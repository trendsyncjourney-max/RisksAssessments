import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import {
  parseAimsBio, parseAimsBlkDuty, parseAimsDailyDuty,
  parseFsi, parseDocunet, parseOpt, parseLido, parseLidoCorrectEmail,
} from '../efb_audit/parsers.js'
import { buildAudit } from '../efb_audit/buildAudit.js'
import { buildReportWorkbook, workbookToBlob, buildEmlZip } from '../efb_audit/report.js'
import { periodToLabel, periodToReferenceDate, periodToRange, currentPeriod } from '../efb_audit/utils.js'
import '../styles/efb_audit.css'

const FILE_SLOTS = [
  { key: 'aimsBio', label: 'AIMS_Bio.xlsx', accept: '.xlsx,.xls,.csv' },
  { key: 'aimsBlk', label: 'AIMS_blk_duty.xlsx', accept: '.xlsx,.xls,.csv' },
  { key: 'aimsDaily', label: 'AIMS_daily_duty.xlsx', accept: '.xlsx,.xls,.csv' },
  { key: 'fsi', label: 'FSI.csv', accept: '.csv' },
  { key: 'docunet', label: 'docunet.csv', accept: '.csv' },
  { key: 'opt', label: 'OPT.csv', accept: '.csv' },
  { key: 'lido', label: 'LIDO.xlsx', accept: '.xlsx,.xls' },
  { key: 'doj', label: 'DOJ.pdf (optional — active roster filter)', accept: '.pdf', optional: true },
]

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function EfbAuditPage({ onBack }) {
  const [files, setFiles] = useState({})
  const [period, setPeriod] = useState(currentPeriod)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState(null)
  const [overrides, setOverrides] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => { loadOverrides() }, [])

  async function loadOverrides() {
    const { data } = await supabase.from('lido_email_overrides').select('*').order('lido_id')
    if (data) setOverrides(data)
  }

  async function saveOverride(lido_id, correct_email) {
    if (!lido_id.trim() || !correct_email.trim()) return
    await supabase.from('lido_email_overrides').upsert({ lido_id: lido_id.trim(), correct_email: correct_email.trim().toLowerCase() })
    loadOverrides()
  }

  async function deleteOverride(lido_id) {
    await supabase.from('lido_email_overrides').delete().eq('lido_id', lido_id)
    loadOverrides()
  }

  async function bulkImportOverrides(file) {
    const buf = await file.arrayBuffer()
    const parsed = parseLidoCorrectEmail(buf) // Map<lido_id, correct_email>
    const records = [...parsed.entries()].map(([lido_id, correct_email]) => ({ lido_id, correct_email }))
    if (records.length === 0) throw new Error('No ID / email rows found in that file')
    const { error } = await supabase.from('lido_email_overrides').upsert(records, { onConflict: 'lido_id' })
    if (error) throw error
    await loadOverrides()
    return records.length
  }

  function handleFile(key, file) {
    setFiles((f) => ({ ...f, [key]: file }))
  }

  async function runAudit() {
    setError('')
    setRunning(true)
    setRows(null)
    try {
      const required = FILE_SLOTS.filter((s) => !s.optional)
      for (const slot of required) {
        if (!files[slot.key]) throw new Error(`Missing file: ${slot.label}`)
      }

      const [aimsBioBuf, aimsBlkBuf, aimsDailyBuf, fsiText, docunetText, optText, lidoBuf] = await Promise.all([
        files.aimsBio.arrayBuffer(),
        files.aimsBlk.arrayBuffer(),
        files.aimsDaily.arrayBuffer(),
        files.fsi.text(),
        files.docunet.text(),
        files.opt.text(),
        files.lido.arrayBuffer(),
      ])

      const { start: reportMonthStart, end: reportMonthEnd } = periodToRange(period)

      const aimsBio = parseAimsBio(aimsBioBuf)
      const aimsBlk = parseAimsBlkDuty(aimsBlkBuf)
      const aimsDaily = parseAimsDailyDuty(aimsDailyBuf, { reportMonthStart, reportMonthEnd })
      const fsi = parseFsi(fsiText)
      const docunet = parseDocunet(docunetText)
      const opt = parseOpt(optText)
      const lido = parseLido(lidoBuf)

      let dojNames = null
      if (files.doj) {
        try {
          const { parseDoj } = await import('../efb_audit/parseDoj.js')
          dojNames = await parseDoj(await files.doj.arrayBuffer())
        } catch (e) {
          console.error('DOJ roster PDF failed to parse — continuing without the active-roster filter', e)
          setError(`Note: DOJ.pdf could not be read (${e.message || e}) — audit ran without the active-roster filter.`)
        }
      }

      const lidoOverrides = new Map(overrides.map((o) => [o.lido_id, o.correct_email]))
      const referenceDate = periodToReferenceDate(period)

      const auditRows = buildAudit({ aimsBio, aimsBlk, aimsDaily, fsi, docunet, opt, lido, lidoOverrides, dojNames }, { referenceDate })
      setRows(auditRows)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setRunning(false)
    }
  }

  const monthLabel = periodToLabel(period)

  function downloadReport() {
    const wb = buildReportWorkbook(rows, { monthLabel })
    downloadBlob(workbookToBlob(wb), `EFB_Audit_${monthLabel}.xlsx`)
  }

  async function downloadEmls() {
    const zip = await buildEmlZip(rows, { monthLabel })
    downloadBlob(zip, `EFB_Audit_${monthLabel}_emails.zip`)
  }

  const nonCompliantCount = rows ? rows.filter((r) => r.nonCompliant).length : 0

  return (
    <div className="efb-audit-page">
      <header className="efb-header">
        <button className="efb-back" onClick={onBack}>← Back</button>
        <h1>EFB Monthly Compliance Audit</h1>
      </header>

      <section className="efb-card">
        <h2>1. Report month</h2>
        <div className="efb-run-row">
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <span className="efb-month-label">Reporting as of {monthLabel}</span>
        </div>
      </section>

      <section className="efb-card">
        <h2>2. Upload this month's source files</h2>
        <div className="efb-file-grid">
          {FILE_SLOTS.map((slot) => (
            <label key={slot.key} className="efb-file-slot">
              <span>{slot.label}{slot.optional ? '' : ' *'}</span>
              <input
                type="file"
                accept={slot.accept}
                onChange={(e) => handleFile(slot.key, e.target.files[0] || null)}
              />
              {files[slot.key] && <span className="efb-file-ok">✓ {files[slot.key].name}</span>}
            </label>
          ))}
        </div>

        <div className="efb-run-row">
          <button className="efb-primary" disabled={running} onClick={runAudit}>
            {running ? 'Running…' : 'Run Audit'}
          </button>
        </div>
        {error && <div className="efb-error">{error}</div>}
      </section>

      {rows && (
        <section className="efb-card">
          <h2>3. Results — {rows.length} crew audited, {nonCompliantCount} non-compliant</h2>
          <p className="efb-note">Crew with zero block hours this month, or no flight scheduled from today onward (on leave), are excluded from this list entirely.</p>
          <div className="efb-download-row">
            <button onClick={downloadReport}>Download report (.xlsx)</button>
            <button onClick={downloadEmls} disabled={nonCompliantCount === 0}>Download .eml drafts (.zip)</button>
          </div>
          <div className="efb-table-wrap">
            <table className="efb-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Flt hrs</th><th>Last Flt</th><th>Next Flt</th>
                  <th>OPT</th><th>FSI</th><th>LIDO</th><th>Docunet</th><th>Failed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.email} className={r.nonCompliant ? 'efb-row-fail' : ''}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{Math.floor(r.blockMinutes / 60)}:{String(r.blockMinutes % 60).padStart(2, '0')}</td>
                    <td>{r.lastFlight ? r.lastFlight.toISOString().slice(0, 10) : ''}</td>
                    <td>{r.nextFlight ? r.nextFlight.toISOString().slice(0, 10) : ''}</td>
                    <td>{r.checks.opt.fail ? `FAIL (${r.checks.opt.days ?? '?'}d)` : 'OK'}</td>
                    <td>{r.checks.fsi.fail ? `FAIL (${r.checks.fsi.days ?? '?'}d)` : 'OK'}</td>
                    <td>{r.checks.lido.fail ? `FAIL (${r.checks.lido.days ?? '?'}d)` : 'OK'}</td>
                    <td>{r.checks.docunet.fail ? `FAIL (${r.checks.docunet.days ?? '?'}d)` : 'OK'}</td>
                    <td>{r.failedSystems.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="efb-card">
        <div className="efb-admin-toggle" onClick={() => setShowAdmin((s) => !s)}>
          <h2>{showAdmin ? '▼' : '▶'} Admin — LIDO email overrides ({overrides.length})</h2>
        </div>
        {showAdmin && (
          <LidoOverridesAdmin
            overrides={overrides}
            onSave={saveOverride}
            onDelete={deleteOverride}
            onBulkImport={bulkImportOverrides}
          />
        )}
      </section>
    </div>
  )
}

function LidoOverridesAdmin({ overrides, onSave, onDelete, onBulkImport }) {
  const [newId, setNewId] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState('')

  async function handleImportFile(file) {
    if (!file) return
    setImporting(true)
    setImportMsg('')
    try {
      const count = await onBulkImport(file)
      setImportMsg(`Imported/updated ${count} row(s).`)
    } catch (e) {
      setImportMsg(`Import failed: ${e.message || e}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="efb-admin">
      <div className="efb-admin-import">
        <label className="efb-file-slot">
          <span>Bulk import from LIDO_Correct_email.xlsx (ID in col A, correct email in col B)</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            disabled={importing}
            onChange={(e) => handleImportFile(e.target.files[0] || null)}
          />
        </label>
        {importing && <span>Importing…</span>}
        {importMsg && <span className="efb-file-ok">{importMsg}</span>}
      </div>

      <div className="efb-admin-add">
        <input placeholder="LIDO ID" value={newId} onChange={(e) => setNewId(e.target.value)} />
        <input placeholder="Correct DHL email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <button onClick={() => { onSave(newId, newEmail); setNewId(''); setNewEmail('') }}>Add / Update</button>
      </div>
      <div className="efb-table-wrap">
        <table className="efb-table">
          <thead><tr><th>LIDO ID</th><th>Correct Email</th><th></th></tr></thead>
          <tbody>
            {overrides.map((o) => (
              <tr key={o.lido_id}>
                <td>{o.lido_id}</td>
                <td>{o.correct_email}</td>
                <td><button onClick={() => onDelete(o.lido_id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
