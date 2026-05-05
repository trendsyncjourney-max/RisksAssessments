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

export default function GopTab({ gop, onChange, disabled }) {
  function set(field, value) { if (!disabled) onChange({ ...gop, [field]: value }) }

  return (
    <div className="tab-content">

      <div className="form-section">
        <div className="section-header">DHL Station &amp; Supervision</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="DHL Station Presence" checked={gop.dhlStationPresence} onChange={v => set('dhlStationPresence', v)} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}><label>Supervision Requirements</label>
            <textarea value={gop.supervisionRequirements} onChange={e => set('supervisionRequirements', e.target.value)} placeholder="Describe supervision requirements" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Ground Handling Services</div>
        <div className="form-grid">
          <div style={{ padding: '0 0 0 16px' }}>
            <Toggle label="Load Documents" checked={gop.loadDocs} onChange={v => set('loadDocs', v)} />
            <Toggle label="Catering" checked={gop.catering} onChange={v => set('catering', v)} />
            <Toggle label="Disinsection" checked={gop.disinsection} onChange={v => set('disinsection', v)} />
            <Toggle label="Fuel Availability" checked={gop.fuelAvailability} onChange={v => set('fuelAvailability', v)} />
            <Toggle label="De-Ice Availability" checked={gop.deiceAvailability} onChange={v => set('deiceAvailability', v)} />
            <Toggle label="Crew Transit" checked={gop.crewTransit} onChange={v => set('crewTransit', v)} />
            <Toggle label="Dangerous Goods Handling" checked={gop.dangerousGoods} onChange={v => set('dangerousGoods', v)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">Reporting &amp; Security</div>
        <div className="form-grid wide">
          <div className="field"><label>Country Reporting Requirements</label>
            <textarea value={gop.countryReporting} onChange={e => set('countryReporting', e.target.value)} placeholder="Describe country-specific reporting requirements" />
          </div>
          <div className="field"><label>Security Assessment</label>
            <textarea value={gop.securityAssessment} onChange={e => set('securityAssessment', e.target.value)} placeholder="Describe security assessment findings" />
          </div>
        </div>
      </div>

    </div>
  )
}
