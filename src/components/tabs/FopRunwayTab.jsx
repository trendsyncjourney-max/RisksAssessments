const LIGHTING_OPTIONS = ['None', 'P1 CAT 1', 'P2 CAT 2/3']

const AIRCRAFT_TYPES = ['B757', 'B767', 'B777F']

function blankRunway(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    designator: '', length: '', width: '', pcn: '',
    approach_lighting: 'None',
    ils_cat1: false, ils_cat2: false, ils_cat3: false,
    nav_vor: false, nav_rnav: false, nav_rnp: false,
    nav_circling: false, nav_gnss: false, nav_loc: false, nav_ndb: false,
    weight_b757_mtow: '', weight_b757_mlw: '', weight_b757_mtw: '', weight_b757_max_twy: '',
    weight_b767_mtow: '', weight_b767_mlw: '', weight_b767_mtw: '', weight_b767_max_twy: '',
    weight_b777_mtow: '', weight_b777_mlw: '', weight_b777_mtw: '', weight_b777_max_twy: '',
    ...overrides,
  }
}

function WeightRow({ runway, ac, onChange, disabled }) {
  const prefix = ac.toLowerCase().replace('f','').replace(/[^a-z0-9]/g,'')
  const f = (suffix) => `weight_${prefix}_${suffix}`
  return (
    <tr>
      <td style={{ fontWeight: 600, padding: '6px 8px', background: 'rgba(255,204,0,0.08)' }}>{ac}</td>
      <td><input type="number" value={runway[f('mtow')] || ''} onChange={e => onChange(f('mtow'), e.target.value)} disabled={disabled} style={{ width: '100%', padding: 4 }} /></td>
      <td><input type="number" value={runway[f('mlw')] || ''} onChange={e => onChange(f('mlw'), e.target.value)} disabled={disabled} style={{ width: '100%', padding: 4 }} /></td>
      <td><input type="number" value={runway[f('mtw')] || ''} onChange={e => onChange(f('mtw'), e.target.value)} disabled={disabled} style={{ width: '100%', padding: 4 }} /></td>
      <td><input type="number" value={runway[f('max_twy')] || ''} onChange={e => onChange(f('max_twy'), e.target.value)} disabled={disabled} style={{ width: '100%', padding: 4 }} /></td>
    </tr>
  )
}

function RunwayCard({ runway, onChange, onRemove, disabled }) {
  function set(field, value) { onChange({ ...runway, [field]: value }) }

  return (
    <div className="runway-card">
      <div className="runway-card-header">
        <span className="runway-designator">RWY {runway.designator || '—'}</span>
        {!disabled && <button className="remove-btn" onClick={onRemove}>Remove</button>}
      </div>
      <div className="form-grid" style={{ padding: 14 }}>
        <div className="field"><label>Designator</label>
          <input type="text" value={runway.designator || ''} onChange={e => set('designator', e.target.value)} disabled={disabled} placeholder="e.g. 30/12" />
        </div>
        <div className="field"><label>Length (ft)</label>
          <input type="number" value={runway.length || ''} onChange={e => set('length', e.target.value)} disabled={disabled} />
        </div>
        <div className="field"><label>Width (ft)</label>
          <input type="number" value={runway.width || ''} onChange={e => set('width', e.target.value)} disabled={disabled} />
        </div>
        <div className="field"><label>PCN / PCR</label>
          <input type="text" value={runway.pcn || ''} onChange={e => set('pcn', e.target.value)} disabled={disabled} placeholder="e.g. 69/F/A/W/T" />
        </div>
        <div className="field"><label>Approach Lighting</label>
          <select value={runway.approach_lighting || 'None'} onChange={e => set('approach_lighting', e.target.value)} disabled={disabled}>
            {LIGHTING_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="section-header" style={{ padding: '8px 14px', fontSize: 11 }}>ILS Capability</div>
      <div className="checkbox-group">
        {[['ils_cat1','CAT I'],['ils_cat2','CAT II'],['ils_cat3','CAT III']].map(([key, label]) => (
          <label key={key} className="check-item">
            <input type="checkbox" checked={!!runway[key]} onChange={e => set(key, e.target.checked)} disabled={disabled} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="section-header" style={{ padding: '8px 14px', fontSize: 11 }}>Navigation Options</div>
      <div className="checkbox-group">
        {[['nav_vor','VOR'],['nav_rnav','RNAV'],['nav_rnp','RNP'],['nav_circling','Circling'],['nav_gnss','GNSS'],['nav_loc','LOC'],['nav_ndb','NDB']].map(([key, label]) => (
          <label key={key} className="check-item">
            <input type="checkbox" checked={!!runway[key]} onChange={e => set(key, e.target.checked)} disabled={disabled} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="section-header" style={{ padding: '8px 14px', fontSize: 11 }}>Aircraft Weight Limits (lbs)</div>
      <div style={{ padding: '0 14px 14px', overflowX: 'auto' }}>
        <table className="weight-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
              <th style={{ padding: 6, textAlign: 'left', fontWeight: 600 }}>Aircraft</th>
              <th style={{ padding: 6, fontWeight: 600 }}>MTOW</th>
              <th style={{ padding: 6, fontWeight: 600 }}>MLW</th>
              <th style={{ padding: 6, fontWeight: 600 }}>MTW</th>
              <th style={{ padding: 6, fontWeight: 600 }}>Max TWY</th>
            </tr>
          </thead>
          <tbody>
            {AIRCRAFT_TYPES.map(ac => (
              <WeightRow key={ac} runway={runway} ac={ac} onChange={set} disabled={disabled} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function FopRunwayTab({ runways, onChange, disabled }) {
  function updateRunway(id, updated) {
    onChange(runways.map(r => r.id === id ? updated : r))
  }
  function removeRunway(id) {
    onChange(runways.filter(r => r.id !== id))
  }
  function addRunway() {
    onChange([...runways, blankRunway()])
  }

  return (
    <div className="tab-content">
      <div className="form-section">
        <div className="section-header">Runways ({runways.length})</div>
        <div className="runway-list">
          {runways.map(r => (
            <RunwayCard
              key={r.id}
              runway={r}
              onChange={updated => updateRunway(r.id, updated)}
              onRemove={() => removeRunway(r.id)}
              disabled={disabled}
            />
          ))}
        </div>
        {!disabled && <button className="add-runway-btn" onClick={addRunway}>+ Add Runway</button>}
      </div>
    </div>
  )
}
