import { daysSince } from './utils.js'
import { normalizeAimsBioName } from './parseDoj.helpers.js'

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
//   dojNames: Set<string> | null,
// }
export function buildAudit(sources, { referenceDate = new Date() } = {}) {
  const { aimsBio, aimsBlk, aimsDaily, fsi, docunet, opt, lido, lidoOverrides, dojNames } = sources

  const crew = new Map() // email -> record

  function getCrew(email, extra = {}) {
    if (!crew.has(email)) {
      crew.set(email, { email, name: null, id: null, ...extra })
    }
    return crew.get(email)
  }

  // Seed from AIMS_bio (the master roster with names + emails)
  for (const [id, bio] of aimsBio.byId) {
    const rec = getCrew(bio.email, { name: bio.name, id })
    rec.name = bio.name
    rec.id = id
  }

  // Monthly block hours + zero-hour exclusion (grace rule)
  for (const [id, blk] of aimsBlk.byId) {
    const bio = aimsBio.byId.get(id)
    if (!bio) continue
    const rec = getCrew(bio.email)
    rec.blockMinutes = blk.blockMinutes
  }

  // Last flight within the report month + next flight from today
  for (const [id, daily] of aimsDaily.byId) {
    const bio = aimsBio.byId.get(id)
    if (!bio) continue
    const rec = getCrew(bio.email)
    rec.lastFlight = daily.lastFlight
    rec.nextFlight = daily.nextFlight
  }

  // Docunet: username -> email + last up to date
  const docunetByUsername = docunet.byUsername
  for (const [, d] of docunetByUsername) {
    if (!d.email) continue
    const rec = getCrew(d.email)
    rec.docunetLastUpdate = d.lastUpToDate
  }

  // FSI: username -> last up to date, resolve email via Docunet username
  for (const [username, f] of fsi.byUsername) {
    const d = docunetByUsername.get(username)
    const email = d && d.email
    if (!email) continue
    const rec = getCrew(email)
    rec.fsiLastUpdate = f.lastUpToDate
    rec.fsiUnread = f.unread === Infinity ? null : f.unread
  }

  // OPT: keyed directly by email
  for (const [email, o] of opt.byEmail) {
    const rec = getCrew(email)
    rec.optLastUpdate = o.lastUpdated
  }

  // LIDO: ID -> email (override takes priority) + expiration
  for (const [lidoId, l] of lido.byId) {
    const overrideEmail = lidoOverrides.get(lidoId)
    const email = overrideEmail || l.email
    if (!email) continue
    const rec = getCrew(email)
    rec.lidoExpiration = l.expiration
    rec.lidoId = lidoId
    rec.lidoEmailWasOverridden = Boolean(overrideEmail)
  }

  // Active-roster filter via DOJ (optional — if unavailable/unmatched, crew is kept)
  if (dojNames && dojNames.size > 0) {
    for (const rec of crew.values()) {
      rec.activeOnDoj = dojNames.has(normalizeAimsBioName(rec.name))
    }
  }

  const rows = []
  for (const rec of crew.values()) {
    // Grace: crew with zero block hours this month are excluded entirely.
    const flewLastMonth = (rec.blockMinutes || 0) > 0
    if (!flewLastMonth) continue

    // Grace: no flight scheduled from today onward means they're on leave —
    // ignore them entirely, even if they'd otherwise fail a check.
    const onLeave = !rec.nextFlight
    if (onLeave) continue

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
    // LIDO: fail if expiration already passed by more than the threshold
    {
      const date = rec.lidoExpiration || null
      const days = date ? daysSince(date, referenceDate) : null // positive = days past expiration
      const fail = days == null || days > RULES.lido.days
      checks.lido = { date, days, fail }
    }

    const failedSystems = Object.entries(checks)
      .filter(([, c]) => c.fail)
      .map(([key]) => RULES[key].label)

    rows.push({
      name: rec.name,
      email: rec.email,
      id: rec.id,
      blockMinutes: rec.blockMinutes || 0,
      lastFlight: rec.lastFlight || null,
      nextFlight: rec.nextFlight || null,
      checks,
      nonCompliant: failedSystems.length > 0,
      failedSystems,
    })
  }

  rows.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return rows
}
