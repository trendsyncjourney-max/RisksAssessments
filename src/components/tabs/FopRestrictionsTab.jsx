const RFF_OPTIONS = ['5', '6', '7', '8', '9', '10']

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

export default function FopRestrictionsTab({ restrictions, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...restrictions, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">General Operations</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Simultaneous Runway Operations" checked={restrictions.simultaneous_runway_ops} onChange={v => set('simultaneous_runway_ops', v)} disabled={disabled} />
          <Toggle label="ATS Ground Movement Control" checked={restrictions.ats_ground_movement} onChange={v => set('ats_ground_movement', v)} disabled={disabled} />
        </div>
        <div className="form-grid">
          <div className="field"><label>RFF Category (Fire Fighting)</label>
            <select value={restrictions.rff_category || '9'} onChange={e => set('rff_category', e.target.value)} disabled={disabled}>
              {RFF_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>RFF Operating Hours</label>
            <input type="text" value={restrictions.rff_hours || ''} onChange={e => set('rff_hours', e.target.value)} disabled={disabled} placeholder="e.g. H24, OPS HR not published" />
          </div>
        </div>
        <div className="form-grid wide">
          <div className="field"><label>Wildlife Hazard Assessment</label>
            <textarea value={restrictions.wildlife_hazard || ''} onChange={e => set('wildlife_hazard', e.target.value)} disabled={disabled} placeholder="Describe wildlife hazards and mitigation measures" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Aircraft FMC Systems</div>
        <div className="form-grid">
          <div className="field"><label>B757SF FMC</label>
            <input type="text" value={restrictions.fmc_b757 || ''} onChange={e => set('fmc_b757', e.target.value)} disabled={disabled} placeholder="e.g. FMC installed / N/A" />
          </div>
          <div className="field"><label>B767 FMC</label>
            <input type="text" value={restrictions.fmc_b767 || ''} onChange={e => set('fmc_b767', e.target.value)} disabled={disabled} placeholder="e.g. FMC installed / N/A" />
          </div>
          <div className="field"><label>B777F FMC</label>
            <input type="text" value={restrictions.fmc_b777 || ''} onChange={e => set('fmc_b777', e.target.value)} disabled={disabled} placeholder="e.g. FMC installed / N/A" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Charts Availability</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="LIDO iPad" checked={restrictions.lido_ipad} onChange={v => set('lido_ipad', v)} disabled={disabled} />
          <Toggle label="Paper Backup" checked={restrictions.paper_backup} onChange={v => set('paper_backup', v)} disabled={disabled} />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">TAWS Requirements by Fleet</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="B757SF – TAWS Required" checked={restrictions.taws_b757} onChange={v => set('taws_b757', v)} disabled={disabled} />
          <Toggle label="B767 – TAWS Required" checked={restrictions.taws_b767} onChange={v => set('taws_b767', v)} disabled={disabled} />
          <Toggle label="B777F – TAWS Required" checked={restrictions.taws_b777} onChange={v => set('taws_b777', v)} disabled={disabled} />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">RAAS Requirements by Fleet</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="B757SF – RAAS Required" checked={restrictions.raas_b757} onChange={v => set('raas_b757', v)} disabled={disabled} />
          <Toggle label="B767 – RAAS Required" checked={restrictions.raas_b767} onChange={v => set('raas_b767', v)} disabled={disabled} />
          <Toggle label="B777F – RAAS Required" checked={restrictions.raas_b777} onChange={v => set('raas_b777', v)} disabled={disabled} />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Restrictions &amp; Limitations</div>
        <div className="form-grid wide">
          <div className="field"><label>Runway Restrictions</label>
            <textarea value={restrictions.runway_restrictions || ''} onChange={e => set('runway_restrictions', e.target.value)} disabled={disabled} placeholder="Describe any runway restrictions" />
          </div>
          <div className="field"><label>Taxiway Restrictions</label>
            <textarea value={restrictions.taxiway_restrictions || ''} onChange={e => set('taxiway_restrictions', e.target.value)} disabled={disabled} placeholder="e.g. Right turns onto TWY A from A4 restricted (wingspan limit)" />
          </div>
          <div className="field"><label>Apron Restrictions</label>
            <textarea value={restrictions.apron_restrictions || ''} onChange={e => set('apron_restrictions', e.target.value)} disabled={disabled} placeholder="Describe any apron restrictions" />
          </div>
          <div className="field"><label>Fleet-Specific Limitations</label>
            <textarea value={restrictions.fleet_limitations || ''} onChange={e => set('fleet_limitations', e.target.value)} disabled={disabled} placeholder="Describe fleet-specific limitations (wingspan, weight, etc.)" />
          </div>
          <div className="field"><label>Additional Comments</label>
            <textarea style={{ minHeight: 100 }} value={restrictions.additional_comments || ''} onChange={e => set('additional_comments', e.target.value)} disabled={disabled} placeholder="Free-form notes (ATS hours, fuel, restrictions, etc.)" />
          </div>
        </div>
      </div>

    </div>
  )
}
