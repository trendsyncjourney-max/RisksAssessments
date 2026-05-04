import { RA_STATUS_OPTIONS } from '../../data/initialData.js'

export default function SafeTab({ safe, onChange }) {
  function set(field, value) { onChange({ ...safe, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Safety Assessment</div>
        <div className="form-grid wide">
          <div className="field"><label>Safety Comments</label>
            <textarea style={{ minHeight: 120 }} value={safe.safetyComments} onChange={e => set('safetyComments', e.target.value)} placeholder="Enter safety comments and findings" />
          </div>
          <div className="field"><label>Risk Assessment (RA) Status</label>
            <select value={safe.raStatus} onChange={e => set('raStatus', e.target.value)}>
              {RA_STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Uncontrolled Attitude Documentation</label>
            <textarea value={safe.uncontrolledAttitude} onChange={e => set('uncontrolledAttitude', e.target.value)} placeholder="Document any uncontrolled attitudes identified" />
          </div>
          <div className="field"><label>Supporting Documents</label>
            <textarea value={safe.supportingDocuments} onChange={e => set('supportingDocuments', e.target.value)} placeholder="List supporting documents and references" />
          </div>
        </div>
      </div>

    </div>
  )
}
