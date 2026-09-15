import { daysSince } from './utils.js'
import { normalizeAimsBioName, matchDojToAims } from './parseDoj.helpers.js'

// Thresholds from efb_audit.xlsx column G ("rule (fail if)").
// FSI fails on the unread (Non Compliance Count) value itself, not a date.
export const RULES = {
  fsi: { label: 'FSI', unreadThreshold: 22 },
  docunet: { label: 'Docunet', days: 17 },
  opt: { label: 'OPT', days: 21 },
  lido: { label: 'LIDO', days: 20 },
}

// sources = {
//   aimsBio: { byId, byEmail },
//   aimsBlk: { byId },
//   aimsDaily: { byId },
//   fsi: { byUsername },
//   docunet: { byUsername },
//   opt: { byEmail },
//   lido: { byId },
//   lidoOverrides: Map<lidoId, email>,
//   dojNames: Map<normalizedName, displayName> | null,
// }
export function buildAudit(sources, { referenceDate = new Date() } = {}) {
  const { aimsBio, aimsBlk, aimsDaily, fsi, docunet, opt, lido, lidoOverrides, dojNames } = sources

  const crew = new Map() // key -> record (key is email when known, else a synthetic DOJ key)

  function getCrew(key, extra = {}) {
    if (!crew.has(key)) {
      crew.set(key, { email: null, name: null, id: null, ...extra })
    }
    return crew.get(key)
  }

  const aimsEntries = Array.from(aimsBio.byId.values(), (bio) => [normalizeAimsBioName(bio.name), bio])

  const hasDoj = dojNames && dojNames.size > 0

  if (hasDoj) {
    // DOJ is the master roster: every DOJ crew member gets a row, whether
    // or not AIMS_bio can identify them (an unmatched name shows up with
    // no email and a note, instead of silently disappearing).
    for (const [normName, displayName] of dojNames) {
      const bio = matchDojToAims(normName, aimsEntries)
      if (bio) {
        const rec = getCrew(bio.email, { name: bio.name, id: bio.id, email: bio.email })
        rec.name = bio.name
        rec.id = bio.id
        rec.email = bio.email
        rec.aimsMatched = true
      } else {
        const rec = getCrew(`doj:${normName}`, { name: displayName })
        rec.aimsMatched = false
      }
    }
  } else {
    // No DOJ file provided — fall back to AIMS_bio as the roster.
    for (const [id, bio] of aimsBio.byId) {
      const rec = getCrew(bio.email, { name: bio.name, id, email: bio.email })
      rec.name = bio.name
      rec.id = id
      rec.email = bio.email
      rec.aimsMatched = true
    }
  }

  // From here on, everything joins in by AIMS ID / email / username — crew
  // records that came from DOJ but have no AIMS match simply won't be
  // found by any of these lookups, which is expected: there's genuinely
  // no data for them anywhere else.
  function crewByEmail(email) {
    return email ? crew.get(email) : undefined
  }

  // Monthly block hours (used for the "no flight hours" flag below)
  for (const [id, blk] of aimsBlk.byId) {
    const bio = aimsBio.byId.get(id)
    const rec = bio && crewByEmail(bio.email)
    if (!rec) continue
    rec.blockMinutes = blk.blockMinutes
  }

  // Last flight within the report month + next flight from today
  for (const [id, daily] of aimsDaily.byId) {
    const bio = aimsBio.byId.get(id)
    const rec = bio && crewByEmail(bio.email)
    if (!rec) continue
    rec.lastFlight = daily.lastFlight
    rec.nextFlight = daily.nextFlight
  }

  // Docunet: username -> email + last up to date
  const docunetByUsername = docunet.byUsername
  for (const [, d] of docunetByUsername) {
    const rec = crewByEmail(d.email)
    if (!rec) continue
    rec.docunetLastUpdate = d.lastUpToDate
  }

  // FSI: username -> last up to date, resolve email via Docunet username
  for (const [username, f] of fsi.byUsername) {
    const d = docunetByUsername.get(username)
    const rec = d && crewByEmail(d.email)
    if (!rec) continue
    rec.fsiLastUpdate = f.lastUpToDate
    rec.fsiUnread = f.unread === Infinity ? null : f.unread
  }

  // OPT: keyed directly by email
  for (const [email, o] of opt.byEmail) {
    const rec = crewByEmail(email)
    if (!rec) continue
    rec.optLastUpdate = o.lastUpdated
  }

  // LIDO: ID -> email (override takes priority) + expiration
  for (const [lidoId, l] of lido.byId) {
    const overrideEmail = lidoOverrides.get(lidoId)
    const email = overrideEmail || l.email
    const rec = crewByEmail(email)
    if (!rec) continue
    rec.lidoFound = true
    rec.lidoExpiration = l.expiration
    rec.lidoId = lidoId
    rec.lidoEmailWasOverridden = Boolean(overrideEmail)
  }

  const rows = []
  for (const rec of crew.values()) {
    // No flight hours this month: kept in the report, flagged, and
    // exempt from non-compliance — not dropped, so the report's total
    // can match the DOJ roster count.
    const noFlightHours = (rec.blockMinutes || 0) === 0

    // On leave: no flight scheduled from today onward. Also kept and
    // flagged, also exempt from non-compliance.
    const onLeave = !rec.nextFlight

    const exempt = noFlightHours || onLeave

    const checks = {}

    // FSI: fail purely on the unread (Non Compliance Count) value — no date check.
    {
      const unread = rec.fsiUnread ?? null
      const fail = unread == null || unread >= RULES.fsi.unreadThreshold
      checks.fsi = { date: rec.fsiLastUpdate || null, unread, fail }
    }

    for (const key of ['docunet', 'opt']) {
      const dateField = { docunet: 'docunetLastUpdate', opt: 'optLastUpdate' }[key]
      const date = rec[dateField] || null
      const days = date ? daysSince(date, referenceDate) : null
      const fail = days == null || days > RULES[key].days
      checks[key] = { date, days, fail }
    }
    // LIDO: no matching record at all is called out separately from "record
    // found but expired" — the former means go find their real LIDO
    // account and add it to LIDO_Correct_email, not just "overdue".
    {
      const found = Boolean(rec.lidoFound)
      const date = found ? rec.lidoExpiration || null : null
      const days = date ? daysSince(date, referenceDate) : null // positive = days past expiration
      const fail = !found || days == null || days > RULES.lido.days
      checks.lido = { date, days, fail, found }
    }

    const failedSystems = exempt
      ? []
      : Object.entries(checks).filter(([, c]) => c.fail).map(([key]) => RULES[key].label)

    rows.push({
      name: rec.name,
      email: rec.email,
      id: rec.id,
      aimsMatched: rec.aimsMatched !== false,
      blockMinutes: rec.blockMinutes || 0,
      lastFlight: rec.lastFlight || null,
      nextFlight: rec.nextFlight || null,
      noFlightHours,
      onLeave,
      checks,
      nonCompliant: failedSystems.length > 0,
      failedSystems,
    })
  }

  rows.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return rows
}
