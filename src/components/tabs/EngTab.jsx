function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-field">
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
      <label style={{ cursor: 'pointer' }}>{label}</label>
    </div>
  )
}

export default function EngTab({ eng, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...eng, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Engineering Support</div>
        <div className="form-grid">
          <div className="field"><label>Engineering Support Contact</label>
            <input type="text" value={eng.engineeringContact} onChange={e => set('engineeringContact', e.target.value)} placeholder="Contact name or team" />
          </div>
          <div className="field"><label>Support Provider</label>
            <input type="text" value={eng.supportProvider} onChange={e => set('supportProvider', e.target.value)} placeholder="e.g. DHL Internal, Third Party" />
          </div>
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="Spanner (Maintenance Tool) Available" checked={eng.spannerAvailability} onChange={v => set('spannerAvailability', v)} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Engineering Comments</label>
            <textarea style={{ minHeight: 120 }} value={eng.engineeringComments} onChange={e => set('engineeringComments', e.target.value)} placeholder="Enter engineering comments, findings, or notes" />
          </div>
        </div>
      </div>

    </div>
  )
}
