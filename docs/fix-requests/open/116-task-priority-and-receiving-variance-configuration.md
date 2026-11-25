# Fix Request 116 — VERIFIED DONE — superseded by done/116-task-priority-and-receiving-variance-configuration.md

This request is complete. See `docs/fix-requests/done/116-task-priority-and-receiving-variance-configuration.md` for the full completion report.

Verified 2026-09-25 by independent re-check on a fresh `git archive` snapshot of the current site-server HEAD, real PostgreSQL 16, isolated container: full suite 538/538 pass, 0 fail, 0 skip. `test/fix-request-116-configuration-postgres.test.js` read in full: substantive real-PostgreSQL test — proves two successive active TASK_PRIORITIES config versions produce different, non-retroactive stored task priorities, and that a client-supplied `weightVarianceLimit:.9` is overridden by the configured `.1` limit (WEIGHT_ANOMALY still raised), both surviving repository reload. No fabrication found.

(This file's content is retained as a stub, not deleted, because this mount does not support unlinking/renaming files — see `docs/fix-requests/README.md`.)
