# Fix Request 121 — Cloud CSV event export has no formula-injection hardening

## Problem

`storemesh-cloud/src/event-export.js`, `csvCell()`: only quotes a cell when it contains `"`, `\r`, or `\n` (standard CSV-escaping). It does not neutralize a leading `=`, `+`, `-`, or `@`, which Excel/Google Sheets/LibreOffice interpret as the start of a formula when the CSV is opened — the classic CSV/formula-injection class of bug.

Verified not currently exploitable: every free-text, potentially-attacker-influenced field (`reason`, `retryReason`, etc.) is nested inside the JSON-stringified `payload`/`beforeState`/`afterState` columns, which always start with `{` and can't trigger the formula interpreter as a whole-cell value; `actorUsername` is server-provisioned, not self-registerable. So this is defense-in-depth on a newly-shipped export endpoint (FR111), not an active exploit today — but it's cheap to fix now, before any future field addition (e.g. a free-text column exposed directly) makes it exploitable, and before this export is handed to an external party (this is the cross-site cloud reporting layer, the export a customer or auditor is most likely to open in Excel).

## Requirements

- In `csvCell()`, prefix any cell whose formatted text starts with `=`, `+`, `-`, or `@` with a leading `'` (single quote) or tab character (pick whichever spreadsheet tools treat correctly), in addition to the existing quote-escaping — this must not break correctly-negative numeric values or dates if any column can render as one.
- Apply consistently regardless of quoting: a value like `-5` starting a formula-triggering character must be neutralized even though it doesn't need `"` quoting today.
- Add unit tests for `csvCell`/`csvRow` covering: a cell starting with each of `=`, `+`, `-`, `@`; a normal string; a string needing quote-escaping; combined case (formula-prefix character plus embedded comma/quote).

## Acceptance criteria

- New tests pass; full `storemesh-cloud` suite green.
- A round-trip test proves a cell like `=1+1` (or similar) is written to the CSV output in a form that will not be auto-executed as a formula when opened in a spreadsheet application (i.e. the raw written bytes start with the neutralizing prefix, not the formula-triggering character).
