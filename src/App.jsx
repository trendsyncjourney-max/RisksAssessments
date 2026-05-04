import { useState, useEffect } from 'react'
import { loadAllAirfields, saveAirfield, deleteAirfield } from './db/storage.js'
import Dashboard from './components/Dashboard.jsx'
import AirfieldDetail from './components/AirfieldDetail.jsx'

export default function App() {
  const [airfields, setAirfields] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    loadAllAirfields().then(setAirfields)
  }, [])

  async function handleSave(updated) {
    await saveAirfield(updated)
    setAirfields(prev => prev.map(a => a.id === updated.id ? updated : a))
  }

  async function handleAdd(airfield) {
    await saveAirfield(airfield)
    setAirfields(prev => [...prev, airfield])
    setSelected(airfield)
  }

  async function handleDelete(id) {
    await deleteAirfield(id)
    setAirfields(prev => prev.filter(a => a.id !== id))
    setSelected(null)
  }

  if (selected) {
    const airfield = airfields.find(a => a.id === selected.id) || selected
    return (
      <AirfieldDetail
        airfield={airfield}
        onSave={handleSave}
        onBack={() => setSelected(null)}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <Dashboard
      airfields={airfields}
      onSelect={setSelected}
      onAdd={handleAdd}
    />
  )
}
