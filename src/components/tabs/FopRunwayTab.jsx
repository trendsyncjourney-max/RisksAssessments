import { LIGHTING_OPTIONS } from '../../data/initialData.js'
import { blankRunway } from '../../data/initialData.js'

function RunwayCard({ runway, onChange, onRemove }) {
  function set(field, value) { onChange({ ...runway, [field]: value }) }

  return (
    <div className="runway-card">
      <div className="runway-card-header">
        <span className="runway-designator">RWY {runway.designator || '—'}</span>
        <button className="remove-btn" onClick={onRemove}>Remove</button>
      </div>
      <div className="form-grid" style={{ padding: 14 }}>
        <div className="field"><label>Designator</label>
          <input type="text" value={runway.designator} onChange={e => set('designator', e.target.value)} placeholder="e.g. 30/12" />
        </div>
        <div className="field"><label>Length (ft)</label>
          <input type="number" value={runway.length} onChange={e => set('length', e.target.value)} />
        </div>
        <div className="field"><label>Width (ft)</label>
          <input type="number" value={runway.width} onChange={e => set('width', e.target.value)} />
        </div>
        <div className="field"><label>Approach Lighting</label>
          <select value={runway.approachLighting} onChange={e => set('approachLighting', e.target.value)}>
            {LIGHTING_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="section-header" style={{ padding: '8px 14px', fontSize: 11 }}>ILS Capability</div>
      <div className="checkbox-group">
        {[['ilsCat1','CAT I'],['ilsCat2','CAT II'],['ilsCat3','CAT III']].map(([key, label]) => (
          <label key={key} className="check-item">
            <input type="checkbox" checked={runway[key]} onChange={e => set(key, e.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="section-header" style={{ padding: '8px 14px', fontSize: 11 }}>Navigation Options</div>
      <div className="checkbox-group">
        {[['vor','VOR'],['rnav','RNAV'],['rnp','RNP'],['circling','Circling'],['gnss','GNSS'],['loc','LOC'],['ndb','NDB']].map(([key, label]) => (
          <label key={key} className="check-item">
            <input type="checkbox" checked={runway[key]} onChange={e => set(key, e.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default function FopRunwayTab({ runways, onChange }) {
  function updateRunway(id, updated) {
    onChange(runways.map(r => r.id === id ? updated : r))
  }
  function removeRunway(id) {
    onChange(runways.filter(r => r.id !== id))
  }
  function addRunway() {
    onChange([...runways, blankRunway({ id: Date.now() })])
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
            />
          ))}
        </div>
        <button className="add-runway-btn" onClick={addRunway}>+ Add Runway</button>
      </div>
    </div>
  )
}
