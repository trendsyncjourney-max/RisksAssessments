import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
// ?raw pulls the worker's source in as a plain string at build time (Vite),
// so it gets inlined into the single bundled JS instead of staying a
// separate file. At runtime we turn that string into a Blob URL — pdf.js
// still gets a real worker, but nothing outside this one HTML file is
// ever fetched.
import pdfWorkerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?raw'
import { normalizeName } from './parseDoj.helpers.js'

const workerBlob = new Blob([pdfWorkerSrc], { type: 'text/javascript' })
pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob)

// Parses the "latest crew list" PDF (DOJ) — the master crew roster —
// into a Map<normalizedName, displayName>, e.g. "WELLS ALEX" -> "Wells Alex".
// The normalized key is used to match against AIMS_bio names; the display
// name is shown in the report for crew DOJ lists that AIMS_bio can't match.
export async function parseDoj(data) {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
  const doc = await pdfjsLib.getDocument({
    data: bytes,
    disableStream: true,
    disableAutoFetch: true,
    disableRange: true,
  }).promise
  const roster = new Map()

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p)
    const tc = await page.getTextContent()

    const lines = new Map()
    for (const item of tc.items) {
      const y = Math.round(item.transform[5])
      if (!lines.has(y)) lines.set(y, [])
      lines.get(y).push(item)
    }

    for (const y of [...lines.keys()].sort((a, b) => b - a)) {
      const cells = lines
        .get(y)
        .sort((a, b) => a.transform[4] - b.transform[4])
        .map((i) => i.str.trim())
        .filter((s) => s !== '')

      // Expect: [#, Surname, FirstName, dd/mm/yyyy, Rank, ...fleet flags]
      if (cells.length < 4) continue
      if (!/^\d+$/.test(cells[0])) continue
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(cells[3])) continue

      const normalized = normalizeName(cells[1], cells[2])
      if (!roster.has(normalized)) roster.set(normalized, `${cells[1]} ${cells[2]}`)
    }
  }

  return roster
}

export { normalizeAimsBioName } from './parseDoj.helpers.js'
