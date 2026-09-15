export function normalizeName(surname, firstName) {
  return `${surname} ${firstName}`.toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim()
}

export function normalizeAimsBioName(name) {
  if (!name) return ''
  // AIMS_bio names look like "SURNAME * FirstName" or "SURNAME FirstName (code)"
  return String(name)
    .toUpperCase()
    .replace(/[^A-Z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
