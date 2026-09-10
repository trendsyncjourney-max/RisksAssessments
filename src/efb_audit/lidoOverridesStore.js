// LIDO ID -> correct email overrides, persisted in the browser's local
// storage. Seeded from the bundled defaults on first use. No backend —
// this tool runs entirely client-side.

import { LIDO_EMAIL_DEFAULTS } from './lidoEmailDefaults.js'

const STORAGE_KEY = 'efb_lido_overrides_v1'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore — fall through to defaults
  }
  const seeded = Object.fromEntries(LIDO_EMAIL_DEFAULTS)
  writeStore(seeded)
  return seeded
}

function writeStore(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch {
    // storage unavailable (private mode, quota, etc.) — edits won't persist
  }
}

// Returns [{ lido_id, correct_email }, ...] sorted by ID.
export function loadOverrides() {
  const obj = readStore()
  return Object.entries(obj)
    .map(([lido_id, correct_email]) => ({ lido_id, correct_email }))
    .sort((a, b) => a.lido_id.localeCompare(b.lido_id))
}

export function saveOverride(lidoId, correctEmail) {
  const id = String(lidoId).trim()
  const email = String(correctEmail).trim().toLowerCase()
  if (!id || !email) return
  const obj = readStore()
  obj[id] = email
  writeStore(obj)
}

export function deleteOverride(lidoId) {
  const obj = readStore()
  delete obj[String(lidoId).trim()]
  writeStore(obj)
}

// records: [{ lido_id, correct_email }, ...] or Map<lido_id, correct_email>
export function bulkUpsertOverrides(records) {
  const obj = readStore()
  const entries = records instanceof Map ? [...records.entries()] : records.map((r) => [r.lido_id, r.correct_email])
  for (const [id, email] of entries) {
    if (!id || !email) continue
    obj[String(id).trim()] = String(email).trim().toLowerCase()
  }
  writeStore(obj)
  return entries.length
}

export function resetOverridesToDefaults() {
  writeStore(Object.fromEntries(LIDO_EMAIL_DEFAULTS))
}

// Map<lido_id, correct_email> for buildAudit().
export function overridesAsMap() {
  return new Map(Object.entries(readStore()))
}
