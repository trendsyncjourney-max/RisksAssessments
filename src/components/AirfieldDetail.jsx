import { useState, useCallback } from 'react'
import ApprovalWorkflow from './ApprovalWorkflow.jsx'
import GenTab from './tabs/GenTab.jsx'
import FopRunwayTab from './tabs/FopRunwayTab.jsx'
import FopRestrictionsTab from './tabs/FopRestrictionsTab.jsx'
import GopTab from './tabs/GopTab.jsx'
import SafeTab from './tabs/SafeTab.jsx'
import EngTab from './tabs/EngTab.jsx'

const TABS = [
  { key: 'gen',             label: 'GEN' },
  { key: 'fopRunway',       label: 'FOP Runway' },
  { key: 'fopRestrictions', label: 'FOP Restrictions' },
  { key: 'gop',             label: 'GOP' },
  { key: 'safe',            label: 'SAFE' },
  { key: 'eng',             label: 'ENG' },
]

export default function AirfieldDetail({ airfield, onSave, onBack, onDelete }) {
  const [draft, setDraft] = useState(airfield)
  const [activeTab, setActiveTab] = useState('gen')
  const [toast, setToast] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  async function handleSave() {
    await onSave(draft)
    showToast()
  }

  const updateGen = useCallback(gen => setDraft(d => ({ ...d, gen })), [])
  const updateRunways = useCallback(fopRunways => setDraft(d => ({ ...d, fopRunways })), [])
  const updateRestrictions = useCallback(fopRestrictions => setDraft(d => ({ ...d, fopRestrictions })), [])
  const updateGop = useCallback(gop => setDraft(d => ({ ...d, gop })), [])
  const updateSafe = useCallback(safe => setDraft(d => ({ ...d, safe })), [])
  const updateEng = useCallback(eng => setDraft(d => ({ ...d, eng })), [])

  return (
    <>
      <header className="app-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>{draft.gen.icao || draft.id} – {draft.gen.name || 'Airfield Detail'}</h1>
        <button className="add-btn" style={{ background: '#7f1d1d' }} onClick={() => setConfirmDelete(true)}>Delete</button>
      </header>

      <nav className="tab-nav">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="detail-container pb-save">
        {activeTab === 'gen' && (
          <>
            <ApprovalWorkflow gen={draft.gen} />
            <GenTab gen={draft.gen} onChange={updateGen} />
          </>
        )}
        {activeTab === 'fopRunway' && (
          <FopRunwayTab runways={draft.fopRunways} onChange={updateRunways} />
        )}
        {activeTab === 'fopRestrictions' && (
          <FopRestrictionsTab restrictions={draft.fopRestrictions} onChange={updateRestrictions} />
        )}
        {activeTab === 'gop' && (
          <GopTab gop={draft.gop} onChange={updateGop} />
        )}
        {activeTab === 'safe' && (
          <SafeTab safe={draft.safe} onChange={updateSafe} />
        )}
        {activeTab === 'eng' && (
          <EngTab eng={draft.eng} onChange={updateEng} />
        )}
      </div>

      <div className="save-bar">
        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </div>

      {toast && <div className="save-toast">Saved successfully</div>}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete {draft.gen.icao || draft.id}?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
              This will permanently remove this airfield assessment. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="confirm-btn" style={{ background: 'var(--dhl-red)', color: '#fff' }} onClick={() => onDelete(airfield.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
