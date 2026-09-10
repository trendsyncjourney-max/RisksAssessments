import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { RULES } from './buildAudit.js'

function fmtDate(d) {
  if (!d) return ''
  return d.toISOString().slice(0, 10)
}

function fmtHours(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

// Columns A-P below, then Q=On Leave, R=Non-Compliant, S=Failed Systems, T=Remarks.
const HEADER = [
  'NAME', 'Email', 'Flt hrs', 'Last Flt', 'Next Flt',
  'OPT', 'OPT days', 'OPT fail',
  'FSI unread', 'FSI fail',
  'LIDO exp', 'LIDO days past', 'LIDO fail',
  'Docunet', 'Docunet days', 'Docunet fail',
  'On Leave', 'Non-Compliant', 'Failed Systems', 'Remarks',
]

export function buildReportWorkbook(rows, { monthLabel } = {}) {
  const title = `AUDIT ${monthLabel || ''} EFB Compliance Report`.trim()
  const aoa = [[title], [], HEADER]

  for (const r of rows) {
    aoa.push([
      r.name, r.email, fmtHours(r.blockMinutes), fmtDate(r.lastFlight), fmtDate(r.nextFlight),
      fmtDate(r.checks.opt.date), r.checks.opt.days ?? '', r.checks.opt.fail ? 'FAIL' : '',
      r.checks.fsi.unread ?? '', r.checks.fsi.fail ? 'FAIL' : '',
      fmtDate(r.checks.lido.date), r.checks.lido.days ?? '', r.checks.lido.fail ? 'FAIL' : '',
      fmtDate(r.checks.docunet.date), r.checks.docunet.days ?? '', r.checks.docunet.fail ? 'FAIL' : '',
      r.onLeave ? 'Y' : '', r.nonCompliant ? 'Y' : 'N', r.failedSystems.join(', '), '',
    ])
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Audit')
  return wb
}

export function workbookToBlob(wb) {
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([out], { type: 'application/octet-stream' })
}

function emlEscape(s) {
  return String(s || '').replace(/\r?\n/g, '\r\n')
}

function buildEmlText({ to, subject, body, from = 'efb.helpdesk@dhl.com' }) {
  const date = new Date().toUTCString()
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${emlEscape(subject)}`,
    `Date: ${date}`,
    'X-Unsent: 1',
    'Content-Type: text/plain; charset="utf-8"',
    '',
    emlEscape(body),
    '',
  ].join('\r\n')
}

function draftBody(row, monthLabel) {
  const lines = [
    `Dear ${row.name || row.email},`,
    '',
    `Our ${monthLabel || 'monthly'} EFB compliance audit shows the following item(s) are overdue for your account:`,
    '',
    ...row.failedSystems.map((s) => {
      const key = Object.keys(RULES).find((k) => RULES[k].label === s)
      const c = row.checks[key]
      if (key === 'fsi') {
        return `- ${s}: ${c.unread != null ? `${c.unread} unread` : 'no data'} (threshold: >=${RULES.fsi.unreadThreshold} unread)`
      }
      return `- ${s}: ${c.days != null ? `${c.days} day(s)` : 'no data'} (threshold: >${RULES[key].days} days)`
    }),
    '',
    'Please update your EFB / device as soon as possible to remain compliant.',
    '',
    '[TBC — email wording pending sample from user]',
  ]
  return lines.join('\n')
}

// Builds one .eml draft per non-compliant crew member and returns a zip Blob.
export async function buildEmlZip(rows, { monthLabel } = {}) {
  const zip = new JSZip()
  for (const row of rows.filter((r) => r.nonCompliant)) {
    const subject = `[Action Required] EFB Compliance — ${monthLabel || ''} — ${row.name || row.email}`.trim()
    const text = buildEmlText({ to: row.email, subject, body: draftBody(row, monthLabel) })
    const safeName = (row.name || row.email).replace(/[^a-z0-9]+/gi, '_')
    zip.file(`${safeName}.eml`, text)
  }
  return zip.generateAsync({ type: 'blob' })
}
