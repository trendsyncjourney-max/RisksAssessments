import * as XLSX from 'xlsx'
import { normEmail, parseDate, hhmmToMinutes, parseDdMmYyyy } from './utils.js'

function readWorkbook(data) {
  return XLSX.read(data, { type: data instanceof ArrayBuffer || ArrayBuffer.isView(data) ? 'array' : 'string', cellDates: true })
}

function sheetRows(ws) {
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null })
}

// Finds the first row whose cells match `headerNeedles` (case-insensitive
// substring match against stringified cell), returns { headerRowIndex, rows }.
function findHeaderRow(rows, headerNeedles) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((c) => (c == null ? '' : String(c).trim().toLowerCase()))
    if (headerNeedles.every((needle) => row.some((c) => c.includes(needle)))) {
      return i
    }
  }
  return -1
}

function colIndex(letter) {
  let n = 0
  for (const ch of letter.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

// ---------- AIMS_Bio: ID -> { name, email } ----------
export function parseAimsBio(data) {
  const wb = readWorkbook(data)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['id', 'name', 'email'])
  const byId = new Map()
  const byEmail = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const id = row[colIndex('A')]
    const name = row[colIndex('C')]
    const email = normEmail(row[colIndex('K')])
    if (id == null || !email) continue
    const rec = { id: String(id).trim(), name: name ? String(name).trim() : null, email }
    byId.set(rec.id, rec)
    byEmail.set(email, rec)
  }
  return { byId, byEmail }
}

// ---------- AIMS_blk_duty: ID -> total block minutes for the month ----------
export function parseAimsBlkDuty(data) {
  const wb = readWorkbook(data)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['id', 'name', 'base'])
  const byId = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const id = row[colIndex('A')]
    if (id == null || String(id).trim() === '') continue
    const blockMinutes = hhmmToMinutes(row[colIndex('M')])
    byId.set(String(id).trim(), { blockMinutes })
  }
  return { byId }
}

// ---------- AIMS_daily_duty: ID -> last flight Date (max date with non-empty col N) ----------
export function parseAimsDailyDuty(data) {
  const wb = readWorkbook(data)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['date', 'duty'])
  const byId = new Map()
  let currentId = null

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const a = row[colIndex('A')]
    if (a == null || String(a).trim() === '') continue
    const s = String(a).trim()
    const asDate = parseDdMmYyyy(s)
    if (asDate) {
      if (!currentId) continue
      const blockTime = row[colIndex('N')]
      const isFlight = blockTime != null && String(blockTime).trim() !== ''
      if (isFlight) {
        const entry = byId.get(currentId)
        if (!entry.lastFlight || asDate > entry.lastFlight) entry.lastFlight = asDate
      }
    } else {
      // new crew block — column A holds the AIMS ID
      currentId = s
      if (!byId.has(currentId)) byId.set(currentId, { lastFlight: null })
    }
  }
  return { byId }
}

// ---------- FSI.csv: Username -> lastUpToDate ----------
// A crew member can show up on more than one row (multiple devices) — we
// keep the row with the lowest Non Compliance Count ("unread") value.
export function parseFsi(text) {
  const wb = readWorkbook(text)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['username', 'last up to date'])
  const byUsername = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const username = row[colIndex('A')]
    if (username == null || String(username).trim() === '') continue
    const key = String(username).trim().toLowerCase()
    const unreadRaw = row[colIndex('G')]
    const unread = unreadRaw == null || unreadRaw === '' ? Infinity : Number(unreadRaw)
    const candidate = { lastUpToDate: parseDate(row[colIndex('D')]), unread }

    const existing = byUsername.get(key)
    if (!existing || candidate.unread < existing.unread) {
      byUsername.set(key, candidate)
    }
  }
  return { byUsername }
}

// ---------- Docunet.csv: Username -> { email, lastUpToDate } ----------
// A crew member can show up on more than one row (multiple devices) — we
// keep the row with the latest Last Up To Date value.
export function parseDocunet(text) {
  const wb = readWorkbook(text)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['username', 'email'])
  const byUsername = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const username = row[colIndex('A')]
    if (username == null || String(username).trim() === '') continue
    const key = String(username).trim().toLowerCase()
    const candidate = {
      email: normEmail(row[colIndex('C')]),
      lastUpToDate: parseDate(row[colIndex('F')]),
    }

    const existing = byUsername.get(key)
    if (!existing || !existing.lastUpToDate || (candidate.lastUpToDate && candidate.lastUpToDate > existing.lastUpToDate)) {
      byUsername.set(key, candidate)
    }
  }
  return { byUsername }
}

// ---------- OPT.csv: Email -> lastUpdated ----------
// A crew member can show up on more than one row (multiple devices) — we
// keep the row with the latest Updated (UTC) value.
export function parseOpt(text) {
  const wb = readWorkbook(text)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['email', 'updated'])
  const byEmail = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const email = normEmail(row[colIndex('D')])
    if (!email) continue
    const lastUpdated = parseDate(row[colIndex('L')])
    const existing = byEmail.get(email)
    if (!existing || !existing.lastUpdated || (lastUpdated && lastUpdated > existing.lastUpdated)) {
      byEmail.set(email, { lastUpdated })
    }
  }
  return { byEmail }
}

// ---------- LIDO.xlsx (sheet "Lido mPilot"): LIDO ID -> { email, expiration } ----------
// A crew member can show up on more than one row (multiple devices) — we
// keep the row with the latest Expiration value.
export function parseLido(data) {
  const wb = readWorkbook(data)
  const sheetName = wb.SheetNames.find((n) => n.toLowerCase().includes('mpilot')) || wb.SheetNames[wb.SheetNames.length - 1]
  const rows = sheetRows(wb.Sheets[sheetName])
  const headerIdx = findHeaderRow(rows, ['id', 'email', 'expiration'])
  const byId = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const id = row[colIndex('A')]
    if (id == null || String(id).trim() === '') continue
    const key = String(id).trim()
    const candidate = {
      email: normEmail(row[colIndex('B')]),
      expiration: parseDate(row[colIndex('L')]),
    }

    const existing = byId.get(key)
    if (!existing || !existing.expiration || (candidate.expiration && candidate.expiration > existing.expiration)) {
      byId.set(key, candidate)
    }
  }
  return { byId }
}

// ---------- LIDO_Correct_email.xlsx: LIDO ID -> correct email override ----------
export function parseLidoCorrectEmail(data) {
  const wb = readWorkbook(data)
  const rows = sheetRows(wb.Sheets[wb.SheetNames[0]])
  const headerIdx = findHeaderRow(rows, ['id', 'email'])
  const byId = new Map()
  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    const id = row[colIndex('A')]
    if (id == null || String(id).trim() === '') continue
    const email = normEmail(row[colIndex('B')])
    if (email) byId.set(String(id).trim(), email)
  }
  return byId
}
