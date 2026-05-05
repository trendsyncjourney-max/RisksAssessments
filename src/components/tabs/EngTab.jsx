function Toggle({ label, checked, onChange, disabled }) {
  return (
    <div className="toggle-field">
      <label className="toggle">
        <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
        <span className="toggle-slider" />
      </label>
      <label style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>{label}</label>
    </div>
  )
}

export default function EngTab({ eng, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...eng, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Engineering Support</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Engineering Support Available" checked={eng.eng_support_available} onChange={v => set('eng_support_available', v)} disabled={disabled} />
          <Toggle label="Flying Spanner Required" checked={eng.flying_spanner_required} onChange={v => set('flying_spanner_required', v)} disabled={disabled} />
          <Toggle label="Spanner (Maintenance Tool) Available" checked={eng.spanner_available} onChange={v => set('spanner_available', v)} disabled={disabled} />
        </div>
        <div className="form-grid">
          <div className="field"><label>Engineering Support Contact</label>
            <input type="text" value={eng.eng_contact || ''} onChange={e => set('eng_contact', e.target.value)} disabled={disabled} placeholder="Contact name or team" />
          </div>
          <div className="field"><label>Support Provider</label>
            <input type="text" value={eng.support_provider || ''} onChange={e => set('support_provider', e.target.value)} disabled={disabled} placeholder="e.g. DHL Internal, Third Party" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Contact Details (Phone / Email)</label>
            <input type="text" value={eng.contact_details || ''} onChange={e => set('contact_details', e.target.value)} disabled={disabled} placeholder="Phone, email, or full contact info" />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Engineering Comments</label>
            <textarea style={{ minHeight: 120 }} value={eng.eng_comments || ''} onChange={e => set('eng_comments', e.target.value)} disabled={disabled} placeholder="Enter engineering comments, findings, or notes" />
          </div>
        </div>
      </div>

    </div>
  )
}
