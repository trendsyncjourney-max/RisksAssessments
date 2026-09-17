import { daysSince } from './utils.js'

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
// }
export function buildAudit(sources, { referenceDate = new Date() } = {}) {
  const { aimsBio, aimsBlk, aimsDaily, fsi, docunet, opt, lido, lidoOverrides } = sources

  const crew = new Map() // email -> record

  // AIMS_Bio is the master roster — the only place a crew record is
  // created. Every other source below only updates an existing record
  // (via crew.get, never crew.set for a new one), so a person who has an
  // OPT/FSI/Docunet/LIDO record but isn't in AIMS_Bio never appears.
  for (const [id, bio] of aimsBio.byId) {
    crew.set(bio.email, { email: bio.email, name: bio.name, id })
  }

  // Monthly block hours (used for the "no flight hours" flag below)
  for (const [id, blk] of aimsBlk.byId) {
    const bio = aimsBio.byId.get(id)
    const rec = bio && crew.get(bio.email)
    if (!rec) continue
    rec.blockMinutes = blk.blockMinutes
  }

  // Last flight within the report month + next flight from today
  for (const [id, daily] of aimsDaily.byId) {
    const bio = aimsBio.byId.get(id)
    const rec = bio && crew.get(bio.email)
    if (!rec) continue
    rec.lastFlight = daily.lastFlight
    rec.nextFlight = daily.nextFlight
  }

  // Docunet: username -> email + last up to date
  const docunetByUsername = docunet.byUsername
  for (const [, d] of docunetByUsername) {
    const rec = d.email && crew.get(d.email)
    if (!rec) continue
    rec.docunetLastUpdate = d.lastUpToDate
  }

  // FSI: username -> last up to date, resolve email via Docunet username
  for (const [username, f] of fsi.byUsername) {
    const d = docunetByUsername.get(username)
    const rec = d && d.email && crew.get(d.email)
    if (!rec) continue
    rec.fsiLastUpdate = f.lastUpToDate
    rec.fsiUnread = f.unread === Infinity ? null : f.unread
  }

  // OPT: keyed directly by email
  for (const [email, o] of opt.byEmail) {
    const rec = crew.get(email)
    if (!rec) continue
    rec.optLastUpdate = o.lastUpdated
  }

  // LIDO: ID -> email (override takes priority) + expiration
  for (const [lidoId, l] of lido.byId) {
    const overrideEmail = lidoOverrides.get(lidoId)
    const email = overrideEmail || l.email
    const rec = email && crew.get(email)
    if (!rec) continue
    rec.lidoFound = true
    rec.lidoExpiration = l.expiration
    rec.lidoId = lidoId
    rec.lidoEmailWasOverridden = Boolean(overrideEmail)
  }

  const rows = []
  for (const rec of crew.values()) {
    // No flight hours this month: kept in the report, flagged, and
    // exempt from non-compliance — not dropped.
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
