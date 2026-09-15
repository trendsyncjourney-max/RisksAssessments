// Shared canonicalization so DOJ names and AIMS_bio names normalize the
// same way regardless of source — strip parenthetical remarks entirely
// (rank/status codes, nicknames) before stripping any other non-letters,
// so "ACUTT Keith (RL)" and "Acutt"/"Keith" both collapse to "ACUTT KEITH".
function canonicalize(raw) {
  return String(raw)
    .replace(/\([^)]*\)/g, ' ')
    .toUpperCase()
    .replace(/[^A-Z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeName(surname, firstName) {
  return canonicalize(`${surname} ${firstName}`)
}

// AIMS_bio names carry extra tokens beyond "SURNAME FIRSTNAME" — rank/
// status codes both inside parens ("(RL)") and bare ("TRI", "CP"), and
// markers like "*". Callers match this against a DOJ "SURNAME FIRSTNAME"
// key by prefix (see matchDojToAims below) rather than truncating here,
// since multi-word/hyphenated surnames ("Alcaraz Perez", "Astill-Headley")
// make a fixed token count unreliable.
export function normalizeAimsBioName(name) {
  if (!name) return ''
  return canonicalize(name)
}

// Finds the AIMS_bio record (if any) for a DOJ "SURNAME FIRSTNAME" key.
// `aimsEntries` is an array of [normalizedFullAimsName, bioRecord].
export function matchDojToAims(dojKey, aimsEntries) {
  for (const [normName, bio] of aimsEntries) {
    if (normName === dojKey || normName.startsWith(dojKey + ' ')) return bio
  }
  return null
}
