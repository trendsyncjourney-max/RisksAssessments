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

export default function MgtTab({ mgt, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...mgt, [field]: value }) }
  return (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-header">Management Overview</div>
        <div className="form-grid wide" style={{ padding: 16 }}>
          <div className="field"><label>Management Comments</label>
            <textarea style={{ minHeight: 120 }} value={mgt.management_comments || ''} onChange={e => set('management_comments', e.target.value)} disabled={disabled} placeholder="Management review comments" />
          </div>
          <div className="field"><label>MGT Notes</label>
            <textarea value={mgt.mgt_notes || ''} onChange={e => set('mgt_notes', e.target.value)} disabled={disabled} placeholder="Additional management notes" />
          </div>
          <div style={{ paddingLeft: 0 }}>
            <Toggle label="Approved by Management" checked={mgt.approved_by_mgt} onChange={v => set('approved_by_mgt', v)} disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  )
}
