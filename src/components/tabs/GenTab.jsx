const STATUS_OPTIONS = ['Assessment Completed', 'Assessment Terminated', 'In Progress', 'CATB', 'ENG', 'Safety']
const OPS_TYPE_OPTIONS = ['Destination Airfield', 'Destination Alternate', 'ETOPS Alternate', 'En Route Alternate', 'Emergency Alternate']
const SLOT_OPTIONS = [
  { value: '1', label: '1 – Not Required' },
  { value: '2', label: '2 – Coordination Required' },
  { value: '3', label: '3 – Slots Required' },
]
const OPS_DATA_OPTIONS = ['Pending', 'Partial', 'Ready', 'Complete']
const APPROVAL_STAGES = [
  { key: 'date_request',         label: 'Request' },
  { key: 'date_flight_support',  label: 'Flight Support' },
  { key: 'date_preparation',     label: 'Preparation' },
  { key: 'date_eng_safety',      label: 'Eng / Safety' },
  { key: 'date_final_approval',  label: 'Final Approval' },
  { key: 'date_fop_complete',    label: 'FOP Complete' },
]

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

export default function GenTab({ gen, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...gen, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">Identification</div>
        <div className="form-grid">
          <div className="field"><label>Airfield Name</label>
            <input type="text" value={gen.name || ''} onChange={e => set('name', e.target.value)} disabled={disabled} />
          </div>
          <div className="field"><label>ICAO Code</label>
            <input type="text" value={gen.icao || ''} onChange={e => set('icao', e.target.value.toUpperCase())} disabled={disabled} maxLength={4} />
          </div>
          <div className="field"><label>IATA Code</label>
            <input type="text" value={gen.iata || ''} onChange={e => set('iata', e.target.value.toUpperCase())} disabled={disabled} maxLength={3} />
          </div>
          <div className="field"><label>Country</label>
            <input type="text" value={gen.country || ''} onChange={e => set('country', e.target.value)} disabled={disabled} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Operational Details</div>
        <div className="form-grid">
          <div className="field"><label>Operations Type</label>
            <select value={gen.operations_type || ''} onChange={e => set('operations_type', e.target.value)} disabled={disabled}>
              {OPS_TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Assessment Status</label>
            <select value={gen.status || ''} onChange={e => set('status', e.target.value)} disabled={disabled}>
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>Slot Requirements</label>
            <select value={gen.slot_requirements || '1'} onChange={e => set('slot_requirements', e.target.value)} disabled={disabled}>
              {SLOT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="field"><label>Operating Hours</label>
            <input type="text" value={gen.operating_hours || ''} onChange={e => set('operating_hours', e.target.value)} disabled={disabled} placeholder="e.g. H24" />
          </div>
          <div className="field"><label>Ops Data Readiness</label>
            <select value={gen.ops_data_readiness || 'Pending'} onChange={e => set('ops_data_readiness', e.target.value)} disabled={disabled}>
              {OPS_DATA_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>GigSky Coverage</label>
            <input type="text" value={gen.gigsky_coverage || ''} onChange={e => set('gigsky_coverage', e.target.value)} disabled={disabled} placeholder="e.g. LTE AND 3G / NONE" />
          </div>
        </div>
        <div className="form-grid" style={{ paddingLeft: 16 }}>
          <Toggle label="Airport of Entry" checked={gen.airport_of_entry} onChange={v => set('airport_of_entry', v)} disabled={disabled} />
          <Toggle label="AIP Available" checked={gen.aip_available} onChange={v => set('aip_available', v)} disabled={disabled} />
          <Toggle label="LVOPS Available" checked={gen.lvops_available} onChange={v => set('lvops_available', v)} disabled={disabled} />
        </div>
        {gen.lvops_available && (
          <div className="form-grid wide">
            <div className="field"><label>LVOPS Details</label>
              <textarea value={gen.lvops_details || ''} onChange={e => set('lvops_details', e.target.value)} disabled={disabled}
                placeholder="e.g. RWY 05/06L - CAT 3A; ILS CAT 1 AVAILABLE..." />
            </div>
          </div>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">Physical Parameters</div>
        <div className="form-grid">
          <div className="field"><label>Elevation (ft)</label>
            <input type="number" value={gen.elevation_ft || ''} onChange={e => set('elevation_ft', e.target.value)} disabled={disabled} />
          </div>
          <div className="field"><label>MSA at 25NM (ft)</label>
            <input type="number" value={gen.msa_25nm_ft || ''} onChange={e => set('msa_25nm_ft', e.target.value)} disabled={disabled} />
          </div>
          <div className="field"><label>Max Obstacle Height (ft)</label>
            <input type="number" value={gen.max_obstacle_ft || ''} onChange={e => set('max_obstacle_ft', e.target.value)} disabled={disabled} />
          </div>
          <div className="field"><label>Max Runway Designation</label>
            <input type="text" value={gen.max_runway_designation || ''} onChange={e => set('max_runway_designation', e.target.value)} disabled={disabled} placeholder="e.g. 30" />
          </div>
          <div className="field"><label>PCN (Pavement Classification)</label>
            <input type="text" value={gen.pcn || ''} onChange={e => set('pcn', e.target.value)} disabled={disabled} placeholder="e.g. 62/F/C/X/T" />
          </div>
          <div className="field"><label>ILS Approaches</label>
            <input type="text" value={gen.ils_approaches || ''} onChange={e => set('ils_approaches', e.target.value)} disabled={disabled} placeholder="e.g. CAT I/II/III" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">CAT B Aircraft Reasons</div>
        <div className="form-grid">
          <div className="field"><label>B757 CAT B Reason</label>
            <input type="text" value={gen.catb_b757 || ''} onChange={e => set('catb_b757', e.target.value)} disabled={disabled} placeholder="N/A or reason text" />
          </div>
          <div className="field"><label>B767 CAT B Reason</label>
            <input type="text" value={gen.catb_b767 || ''} onChange={e => set('catb_b767', e.target.value)} disabled={disabled} placeholder="N/A or reason text" />
          </div>
          <div className="field"><label>B777 CAT B Reason</label>
            <input type="text" value={gen.catb_b777 || ''} onChange={e => set('catb_b777', e.target.value)} disabled={disabled} placeholder="N/A or reason text" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Navigation Aids</div>
        <div className="checkbox-group">
          {[['nav_vor','VOR'],['nav_rnav','RNAV'],['nav_rnp','RNP'],['nav_gnss','GNSS'],['nav_loc','LOC'],['nav_ndb','NDB']].map(([key, label]) => (
            <label key={key} className="check-item">
              <input type="checkbox" checked={!!gen[key]} onChange={e => set(key, e.target.checked)} disabled={disabled} />
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
              <input type="date" value={gen[s.key] || ''} onChange={e => set(s.key, e.target.value)} disabled={disabled} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
