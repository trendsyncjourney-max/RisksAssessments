import { openDB } from 'idb'
import { INITIAL_AIRFIELDS } from '../data/initialData.js'

const DB_NAME = 'risks-assessments'
const DB_VERSION = 1
const STORE = 'airfields'

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    },
  })
}

export async function loadAllAirfields() {
  const db = await getDB()
  const records = await db.getAll(STORE)
  if (records.length === 0) {
    for (const af of INITIAL_AIRFIELDS) {
      await db.put(STORE, af)
    }
    return INITIAL_AIRFIELDS
  }
  return records
}

export async function saveAirfield(airfield) {
  const db = await getDB()
  await db.put(STORE, airfield)
}

export async function deleteAirfield(id) {
  const db = await getDB()
  await db.delete(STORE, id)
}
