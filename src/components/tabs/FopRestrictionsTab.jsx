import { RFF_OPTIONS } from '../../data/initialData.js'

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

export default function FopRestrictionsTab({ restrictions, onChange }) {
  function set(field, value) { onChange({ ...restrictions, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">General Operations</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="Simultaneous Runway Operations" checked={restrictions.simultaneousRunwayOps} onChange={v => set('simultaneousRunwayOps', v)} />
            <Toggle label="ATS Ground Movement Control" checked={restrictions.atsGroundMovement} onChange={v => set('atsGroundMovement', v)} />
          </div>
          <div className="field"><label>RFF Category (Fire Fighting)</label>
            <select value={restrictions.rffCategory} onChange={e => set('rffCategory', e.target.value)}>
              {RFF_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Wildlife Hazard Assessment</label>
            <textarea value={restrictions.wildlifeHazard} onChange={e => set('wildlifeHazard', e.target.value)} placeholder="Describe wildlife hazards and mitigation measures" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Aircraft FMC Systems</div>
        <div className="form-grid">
          <div className="field"><label>B757SF FMC</label>
            <input type="text" value={restrictions.b757fmc} onChange={e => set('b757fmc', e.target.value)} placeholder="e.g. FMC installed" />
          </div>
          <div className="field"><label>B767 FMC</label>
            <input type="text" value={restrictions.b767fmc} onChange={e => set('b767fmc', e.target.value)} placeholder="e.g. FMC installed" />
          </div>
          <div className="field"><label>B777F FMC</label>
            <input type="text" value={restrictions.b777ffmc} onChange={e => set('b777ffmc', e.target.value)} placeholder="e.g. FMC installed / N/A" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Charts Availability</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="LIDO iPad" checked={restrictions.lidoIpad} onChange={v => set('lidoIpad', v)} />
            <Toggle label="Paper Backup" checked={restrictions.paperBackup} onChange={v => set('paperBackup', v)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">TAWS Requirements by Fleet</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="B757SF – TAWS Required" checked={restrictions.tawsB757} onChange={v => set('tawsB757', v)} />
            <Toggle label="B767 – TAWS Required" checked={restrictions.tawsB767} onChange={v => set('tawsB767', v)} />
            <Toggle label="B777F – TAWS Required" checked={restrictions.tawsB777F} onChange={v => set('tawsB777F', v)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">RAAS Requirements by Fleet</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="B757SF – RAAS Required" checked={restrictions.raasB757} onChange={v => set('raasB757', v)} />
            <Toggle label="B767 – RAAS Required" checked={restrictions.raasB767} onChange={v => set('raasB767', v)} />
            <Toggle label="B777F – RAAS Required" checked={restrictions.raasB777F} onChange={v => set('raasB777F', v)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Restrictions &amp; Limitations</div>
        <div className="form-grid wide">
          <div className="field"><label>Runway Restrictions</label>
            <textarea value={restrictions.runwayRestrictions} onChange={e => set('runwayRestrictions', e.target.value)} placeholder="Describe any runway restrictions" />
          </div>
          <div className="field"><label>Taxiway Restrictions</label>
            <textarea value={restrictions.taxiwayRestrictions} onChange={e => set('taxiwayRestrictions', e.target.value)} placeholder="e.g. Right turns onto TWY A from A4 restricted (wingspan limit)" />
          </div>
          <div className="field"><label>Apron Restrictions</label>
            <textarea value={restrictions.apronRestrictions} onChange={e => set('apronRestrictions', e.target.value)} placeholder="Describe any apron restrictions" />
          </div>
          <div className="field"><label>Fleet-Specific Limitations</label>
            <textarea value={restrictions.fleetLimitations} onChange={e => set('fleetLimitations', e.target.value)} placeholder="Describe fleet-specific limitations (wingspan, weight, etc.)" />
          </div>
        </div>
      </div>

    </div>
  )
}
