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

const ACC3_OPTIONS = ['Not Validated', 'Validated', 'Exempted', 'Pending', 'N/A']

export default function GopTab({ gop, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...gop, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">General — DHL Network</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Existing DHL Network Station" checked={gop.dhl_network_station} onChange={v => set('dhl_network_station', v)} disabled={disabled} />
          <Toggle label="DHL Supervised" checked={gop.dhl_supervised} onChange={v => set('dhl_supervised', v)} disabled={disabled} />
          <Toggle label="Appropriate SGHA in Place" checked={gop.sgha_in_place} onChange={v => set('sgha_in_place', v)} disabled={disabled} />
          <Toggle label="Station Added to SABLE System" checked={gop.sable_system} onChange={v => set('sable_system', v)} disabled={disabled} />
        </div>
        <div className="form-grid wide">
          <div className="field"><label>Supervision Requirements</label>
            <textarea value={gop.supervision_requirements || ''} onChange={e => set('supervision_requirements', e.target.value)} disabled={disabled} placeholder="Describe supervision requirements" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Loading Documents</div>
        <div className="form-grid">
          <div className="field"><label>Who Will Produce Loading Docs?</label>
            <input type="text" value={gop.loading_docs_producer || ''} onChange={e => set('loading_docs_producer', e.target.value)} disabled={disabled} placeholder="e.g. DHL CVG" />
          </div>
          <div className="field"><label>Who Will Print &amp; Deliver Loading Docs?</label>
            <input type="text" value={gop.loading_docs_deliverer || ''} onChange={e => set('loading_docs_deliverer', e.target.value)} disabled={disabled} placeholder="e.g. DHL MIA" />
          </div>
        </div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Loadmaster Required" checked={gop.loadmaster_required} onChange={v => set('loadmaster_required', v)} disabled={disabled} />
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Crew Services</div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Crew Catering Arranged" checked={gop.catering} onChange={v => set('catering', v)} disabled={disabled} />
          <Toggle label="Aircraft Disinsection" checked={gop.disinsection} onChange={v => set('disinsection', v)} disabled={disabled} />
          <Toggle label="Crew Transit Procedures Defined" checked={gop.crew_transit} onChange={v => set('crew_transit', v)} disabled={disabled} />
          <Toggle label="Jumpseat Available" checked={gop.jumpseat_available} onChange={v => set('jumpseat_available', v)} disabled={disabled} />
        </div>
        <div className="form-grid wide">
          <div className="field"><label>Fuel Arrangements</label>
            <textarea value={gop.fuel_arrangements || ''} onChange={e => set('fuel_arrangements', e.target.value)} disabled={disabled} placeholder="e.g. JetA1 H24, supplier..." />
          </div>
          <div className="field"><label>Immigration / Visa Requirements</label>
            <textarea value={gop.immigration_visa || ''} onChange={e => set('immigration_visa', e.target.value)} disabled={disabled} placeholder="Describe crew visa/immigration requirements" />
          </div>
          <div className="field"><label>Innoculation Requirements</label>
            <textarea value={gop.innoculation || ''} onChange={e => set('innoculation', e.target.value)} disabled={disabled} placeholder="Describe required vaccinations" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Reference Documents &amp; Reports</div>
        <div className="form-grid wide">
          <div className="field"><label>iSOS Country Report</label>
            <input type="text" value={gop.isos_country_report || ''} onChange={e => set('isos_country_report', e.target.value)} disabled={disabled} placeholder="URL or reference / N/A" />
          </div>
          <div className="field"><label>iSOS City Report</label>
            <input type="text" value={gop.isos_city_report || ''} onChange={e => set('isos_city_report', e.target.value)} disabled={disabled} placeholder="URL or reference / N/A" />
          </div>
          <div className="field"><label>IATA Fuel Quality Pool (IFQP)</label>
            <input type="text" value={gop.iata_fuel_quality || ''} onChange={e => set('iata_fuel_quality', e.target.value)} disabled={disabled} placeholder="Reference / N/A" />
          </div>
          <div className="field"><label>De/Anti-Ice Quality Pool</label>
            <input type="text" value={gop.deice_quality_pool || ''} onChange={e => set('deice_quality_pool', e.target.value)} disabled={disabled} placeholder="Reference / N/A" />
          </div>
          <div className="field"><label>Airport Information Directory</label>
            <input type="text" value={gop.airport_info_directory || ''} onChange={e => set('airport_info_directory', e.target.value)} disabled={disabled} placeholder="Reference / N/A" />
          </div>
          <div className="field"><label>DHL Quality Audit Pool</label>
            <input type="text" value={gop.dhl_quality_audit || ''} onChange={e => set('dhl_quality_audit', e.target.value)} disabled={disabled} placeholder="Reference / N/A" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Country Reporting &amp; Security</div>
        <div className="form-grid wide">
          <div className="field"><label>Country Reporting Requirements</label>
            <textarea value={gop.country_reporting || ''} onChange={e => set('country_reporting', e.target.value)} disabled={disabled} placeholder="Describe country-specific reporting requirements" />
          </div>
          <div className="field"><label>Global Security Situation Centre Report</label>
            <textarea value={gop.global_security_report || ''} onChange={e => set('global_security_report', e.target.value)} disabled={disabled} placeholder="Latest assessment summary" />
          </div>
          <div className="field"><label>DHL Security Assessment</label>
            <textarea value={gop.dhl_security_assessment || ''} onChange={e => set('dhl_security_assessment', e.target.value)} disabled={disabled} placeholder="DHL-specific security findings" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">ACC3 / RA3 Validation</div>
        <div className="form-grid">
          <div className="field"><label>ACC3 / RA3 Validation Status</label>
            <select value={gop.acc3_validation || 'Pending'} onChange={e => set('acc3_validation', e.target.value)} disabled={disabled}>
              {ACC3_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field"><label>ACC3 Reference / Notes</label>
            <input type="text" value={gop.acc3_notes || ''} onChange={e => set('acc3_notes', e.target.value)} disabled={disabled} placeholder="Validation reference, expiry, etc." />
          </div>
        </div>
        <div className="form-grid" style={{ padding: '0 16px' }}>
          <Toggle label="Dangerous Goods Approved Station" checked={gop.dg_approved} onChange={v => set('dg_approved', v)} disabled={disabled} />
        </div>
      </div>

    </div>
  )
}
