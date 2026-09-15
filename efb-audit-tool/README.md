# EFB Monthly Compliance Audit — standalone tool

A single self-contained `dist/index.html` file. No server, no login, no
network calls — everything runs in the browser that opens it. Nothing is
saved between runs; upload all 9 files fresh each month.

## Building

```bash
npm install
npm run build
```

Produces `dist/index.html` — that one file is the entire tool. Email it,
put it on a shared drive, or open it directly by double-clicking. Any
modern browser (Chrome, Edge, Firefox, Safari) works.

## Files it expects, in order

1. `AIMS_Bio.xlsx`
2. `AIMS_blk_duty.xlsx`
3. `AIMS_daily_duty.xlsx`
4. `FSI.csv`
5. `docunet.csv`
6. `OPT.csv`
7. `LIDO.xlsx`
8. `LIDO_Correct_email.xlsx` (the admin ID → correct-email overrides list)
9. `DOJ.pdf` (optional — active-roster filter)

## Source of truth

The audit logic (`src/efb_audit/*.js`) is a copy of the same modules used
by the `/efb_monthly_audit` page in the main RisksAssessments app
(`../src/efb_audit/`). If the rules change, update both copies, or in
future consider extracting them into a shared package.
