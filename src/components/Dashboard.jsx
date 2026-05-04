import { useState } from 'react'
import { APPROVAL_STAGES, STATUS_OPTIONS, OPS_TYPE_OPTIONS, blankGen, blankRunway, blankRestrictions, blankGop, blankSafe, blankEng } from '../data/initialData.js'

function statusClass(status) {
  if (status === 'Assessment Completed') return 'completed'
  if (status === 'ENG') return 'eng'
  if (status === 'Safety') return 'safety'
  if (status === 'CATB') return 'catb'
  return 'progress'
}

function approvalProgress(gen) {
  return APPROVAL_STAGES.map(s => !!gen[s.key])
}

export default function Dashboard({ airfields, onSelect, onAdd }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ icao: '', iata: '', name: '', country: '', operationsType: 'Destination Airfield' })
  const [err, setErr] = useState('')

  function handleCreate() {
    if (!form.icao.trim()) { setErr('ICAO code is required'); return }
    if (!form.name.trim()) { setErr('Airfield name is required'); return }
    const id = form.icao.trim().toUpperCase()
    if (airfields.find(a => a.id === id)) { setErr('An airfield with this ICAO code already exists'); return }
    const airfield = {
      id,
      gen: blankGen({ icao: id, iata: form.iata.trim().toUpperCase(), name: form.name.trim(), country: form.country.trim(), operationsType: form.operationsType }),
      fopRunways: [blankRunway({ id: Date.now() })],
      fopRestrictions: blankRestrictions(),
      gop: blankGop(),
      safe: blankSafe(),
      eng: blankEng(),
    }
    setShowModal(false)
    setForm({ icao: '', iata: '', name: '', country: '', operationsType: 'Destination Airfield' })
    setErr('')
    onAdd(airfield)
  }

  const completed = airfields.filter(a => a.gen.status === 'Assessment Completed').length

  return (
    <>
      <header className="app-header">
        <h1>Risk Assessments</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ New Airfield</button>
      </header>

      <div className="dashboard">
        <div className="dashboard-title">Airfield Assessments</div>
        <div className="dashboard-sub">
          {airfields.length} airfields tracked &nbsp;·&nbsp; {completed} completed
        </div>

        <div className="airfield-grid">
          {airfields.map(af => {
            const progress = approvalProgress(af.gen)
            const doneCount = progress.filter(Boolean).length
            return (
              <div key={af.id} className="airfield-card" onClick={() => onSelect(af)}>
                <div className="card-top">
                  <div className="card-codes">
                    <span className="card-icao">{af.gen.icao || af.id}</span>
                    {af.gen.iata && <span className="card-iata">{af.gen.iata}</span>}
                  </div>
                  <span className={`status-badge ${statusClass(af.gen.status)}`}>{af.gen.status}</span>
                </div>
                <div className="card-name">{af.gen.name || 'Unnamed Airfield'}</div>
                <div className="card-country">{af.gen.country || '—'}</div>
                <div className="card-ops-type">{af.gen.operationsType}</div>
                <div className="card-progress" title={`${doneCount} of ${APPROVAL_STAGES.length} approval stages complete`}>
                  {progress.map((done, i) => (
                    <div key={i} className={`stage-dot ${done ? 'done' : i === doneCount ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>New Airfield</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="field">
                <label>ICAO Code *</label>
                <input type="text" maxLength={4} value={form.icao} onChange={e => setForm(f => ({ ...f, icao: e.target.value }))} placeholder="e.g. EGLL" />
              </div>
              <div className="field">
                <label>IATA Code</label>
                <input type="text" maxLength={3} value={form.iata} onChange={e => setForm(f => ({ ...f, iata: e.target.value }))} placeholder="e.g. LHR" />
              </div>
              <div className="field">
                <label>Airfield Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. London Heathrow" />
              </div>
              <div className="field">
                <label>Country</label>
                <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. United Kingdom" />
              </div>
              <div className="field">
                <label>Operations Type</label>
                <select value={form.operationsType} onChange={e => setForm(f => ({ ...f, operationsType: e.target.value }))}>
                  {OPS_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              {err && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{err}</div>}
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => { setShowModal(false); setErr('') }}>Cancel</button>
              <button className="confirm-btn" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
