import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'
import { normalizeName } from './parseDoj.helpers.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// Parses the "latest crew list" PDF (DOJ) into a Set of normalized
// "SURNAME FIRSTNAME" strings for matching against AIMS_bio names.
export async function parseDoj(data) {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise
  const names = new Set()

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

      names.add(normalizeName(cells[1], cells[2]))
    }
  }

  return names
}

export { normalizeAimsBioName } from './parseDoj.helpers.js'
