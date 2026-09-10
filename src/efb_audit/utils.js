// Shared helpers for the EFB monthly audit module.

export function normEmail(email) {
  if (!email) return null
  const e = String(email).trim().toLowerCase()
  return e.includes('@') ? e : null
}

// Parses a variety of date-ish values (Excel date object, "dd/mm/yyyy",
// "dd-Mon-yyyy HH:mm:ss", "dd/mm/yyyy, HH:mm", "yyyy-mm-dd HH:mm:ss.f") into a JS Date.
export function parseDate(value) {
  if (value == null || value === '') return null
  if (value instanceof Date) return isNaN(value) ? null : value

  const s = String(value).trim()
  if (!s) return null

  // yyyy-mm-dd[ HH:mm:ss[.f]]  (docunet)
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/)
  if (m) {
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)))
  }

  // dd-Mon-yyyy HH:mm:ss  (OPT)
  m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?/)
  if (m) {
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
    const mo = months[m[2]]
    if (mo != null) return new Date(Date.UTC(+m[3], mo, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)))
  }

  // dd/mm/yyyy, HH:mm  (FSI)   or  dd/mm/yyyy
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s+(\d{1,2}):(\d{2}))?/)
  if (m) {
    return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)))
  }

  // yyyy-mm-dd (LIDO expiration)
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))

  const d = new Date(s)
  return isNaN(d) ? null : d
}

export function daysSince(date, reference = new Date()) {
  if (!date) return null
  const ms = reference.setHours ? new Date(reference).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0) : null
  return Math.round(ms / 86400000)
}

// "H:MM" or "HH:MM" -> minutes. Returns 0 for blank/invalid.
export function hhmmToMinutes(value) {
  if (value == null || value === '') return 0
  const s = String(value).trim()
  const m = s.match(/^(\d+):(\d{2})$/)
  if (!m) return 0
  return (+m[1]) * 60 + (+m[2])
}

// dd/mm/yyyy string (AIMS daily duty) -> Date
export function parseDdMmYyyy(s) {
  const m = String(s).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
}
