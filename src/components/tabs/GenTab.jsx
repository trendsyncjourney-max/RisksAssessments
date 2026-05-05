import { STATUS_OPTIONS, OPS_TYPE_OPTIONS, SLOT_OPTIONS, APPROVAL_STAGES } from '../../data/initialData.js'

function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-field">
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
      <label>{label}</label>
    </div>
  )
}

export default function GenTab({ gen, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...gen, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Identification</div>
        <div className="form-grid">
          <div className="field"><label>Airfield Name</label>
            <input type="text" value={gen.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="field"><label>ICAO Code</label>
            <input type="text" value={gen.icao} onChange={e => set('icao', e.target.value.toUpperCase())} maxLength={4} />
          </div>
          <div className="field"><label>IATA Code</label>
            <input type="text" value={gen.iata} onChange={e => set('iata', e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <div className="field"><label>Country</label>
            <input type="text" value={gen.country} onChange={e => set('country', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Operational Details</div>
        <div className="form-grid">
          <div className="field"><label>Operations Type</label>
            <select value={gen.operationsType} onChange={e => set('operationsType', e.target.value)}>
              {OPS_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Assessment Status</label>
            <select value={gen.status} onChange={e => set('status', e.target.value)}>
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Slot Requirements</label>
            <select value={gen.slotRequirements} onChange={e => set('slotRequirements', e.target.value)}>
              {SLOT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="field"><label>Operating Hours</label>
            <input type="text" value={gen.operatingHours} onChange={e => set('operatingHours', e.target.value)} placeholder="e.g. H24" />
          </div>
          <div className="field"><label>Assessment Age (years)</label>
            <input type="number" value={gen.assessmentAge} onChange={e => set('assessmentAge', e.target.value)} step="0.1" />
          </div>
          <div className="field"><label>Document Version</label>
            <input type="number" value={gen.version} onChange={e => set('version', e.target.value)} min="1" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Physical Parameters</div>
        <div className="form-grid">
          <div className="field"><label>Elevation (ft)</label>
            <input type="number" value={gen.elevation} onChange={e => set('elevation', e.target.value)} />
          </div>
          <div className="field"><label>MSA at 25NM (ft)</label>
            <input type="number" value={gen.msa25nm} onChange={e => set('msa25nm', e.target.value)} />
          </div>
          <div className="field"><label>Max Obstacle Height (ft)</label>
            <input type="number" value={gen.maxObstacleHeight} onChange={e => set('maxObstacleHeight', e.target.value)} />
          </div>
          <div className="field"><label>Max Runway Designation</label>
            <input type="text" value={gen.maxRunwayDesignation} onChange={e => set('maxRunwayDesignation', e.target.value)} placeholder="e.g. 30" />
          </div>
          <div className="field"><label>PCN (Pavement Classification)</label>
            <input type="text" value={gen.pcn} onChange={e => set('pcn', e.target.value)} placeholder="e.g. 62/F/C/X/T" />
          </div>
          <div className="field"><label>ILS Approaches</label>
            <input type="text" value={gen.ilsApproaches} onChange={e => set('ilsApproaches', e.target.value)} placeholder="e.g. CAT I/II/III" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Navigation Aids</div>
        <div className="checkbox-group">
          {[['vor','VOR'],['rnav','RNAV'],['rnp','RNP'],['gnss','GNSS'],['loc','LOC'],['ndb','NDB']].map(([key, label]) => (
            <label key={key} className="check-item">
              <input type="checkbox" checked={gen[key]} onChange={e => set(key, e.target.checked)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Approval Workflow Dates</div>
        <div className="form-grid">
          {APPROVAL_STAGES.map(s => (
            <div key={s.key} className="field">
              <label>{s.label}</label>
              <input type="date" value={gen[s.key] || ''} onChange={e => set(s.key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
