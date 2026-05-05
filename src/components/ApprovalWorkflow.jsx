const APPROVAL_STAGES = [
  { key: 'date_request',         label: 'Request' },
  { key: 'date_flight_support',  label: 'Flight Support' },
  { key: 'date_preparation',     label: 'Preparation' },
  { key: 'date_eng_safety',      label: 'Eng / Safety' },
  { key: 'date_final_approval',  label: 'Final Approval' },
  { key: 'date_fop_complete',    label: 'FOP Complete' },
]

export default function ApprovalWorkflow({ gen }) {
  const stages = APPROVAL_STAGES.map(s => ({ ...s, date: gen[s.key] }))
  const doneCount = stages.filter(s => s.date).length

  return (
    <div className="workflow">
      <div className="workflow-title">Approval Workflow</div>
      <div className="workflow-steps">
        {stages.map((stage, i) => {
          const done = !!stage.date
          const active = !done && i === doneCount
          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className="workflow-step">
                <div className={`step-circle ${done ? 'done' : active ? 'active' : ''}`}>
                  {done ? '✓' : i + 1}
                </div>
                <div className={`step-label ${done ? 'done' : ''}`}>{stage.label}</div>
                <div className="step-date">{stage.date || '—'}</div>
              </div>
              {i < stages.length - 1 && (
                <div className={`workflow-connector ${done ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
