const RA_STATUS_OPTIONS = ['Yes', 'No', 'N/A', 'In Review', 'Pending']

export default function SafeTab({ safe, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...safe, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Risk Assessment Status</div>
        <div className="form-grid">
          <div className="field"><label>Risk Assessment Completed and Sufficient?</label>
            <select value={safe.ra_completed || 'Pending'} onChange={e => set('ra_completed', e.target.value)} disabled={disabled}>
              {RA_STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>RA Form Reference / Filename</label>
            <input type="text" value={safe.ra_form_attach || ''} onChange={e => set('ra_form_attach', e.target.value)} disabled={disabled} placeholder="RA Form filename or link" />
          </div>
        </div>
        <div className="form-grid wide">
          <div className="field"><label>Additional Comments</label>
            <textarea style={{ minHeight: 100 }} value={safe.safety_comments || ''} onChange={e => set('safety_comments', e.target.value)} disabled={disabled} placeholder="Enter safety comments and findings" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Risk Assessment Documents</div>
        <div className="form-grid wide">
          <div className="field"><label>Uncontrolled Airfield Risk Assessment</label>
            <input type="text" value={safe.uncontrolled_ra || ''} onChange={e => set('uncontrolled_ra', e.target.value)} disabled={disabled} placeholder="Filename or link" />
          </div>
          <div className="field"><label>Additional Risk Assessment 1</label>
            <input type="text" value={safe.additional_ra_1 || ''} onChange={e => set('additional_ra_1', e.target.value)} disabled={disabled} placeholder="Filename or link" />
          </div>
          <div className="field"><label>Additional Risk Assessment 2</label>
            <input type="text" value={safe.additional_ra_2 || ''} onChange={e => set('additional_ra_2', e.target.value)} disabled={disabled} placeholder="Filename or link" />
          </div>
          <div className="field"><label>Additional Risk Assessment 3</label>
            <input type="text" value={safe.additional_ra_3 || ''} onChange={e => set('additional_ra_3', e.target.value)} disabled={disabled} placeholder="Filename or link" />
          </div>
          <div className="field"><label>Other Supporting Documents</label>
            <textarea value={safe.supporting_documents || ''} onChange={e => set('supporting_documents', e.target.value)} disabled={disabled} placeholder="List supporting documents and references" />
          </div>
        </div>
      </div>

    </div>
  )
}
