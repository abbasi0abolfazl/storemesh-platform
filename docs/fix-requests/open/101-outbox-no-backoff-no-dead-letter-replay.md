# Fix Request 101 — VERIFIED DONE — superseded by done/101-outbox-no-backoff-no-dead-letter-replay.md

This request is complete. See `docs/fix-requests/done/101-outbox-no-backoff-no-dead-letter-replay.md` for the full completion report.

Verified 2026-09-25 by independent re-check: all four reported SHAs (site-server `ec93cd6606beec201fd6fdb32b606b4e4278c6df`, cloud `4ab798c06c1fd814e406a3d24c328951410ff9ea`, contracts `d7a96019b8deb67a7859a9990fb824c055ce2c79`, web `80f47143bba96ce10b8809dbf93e58cfecadcb51`) confirmed as real ancestors of current history via `git merge-base --is-ancestor`. Fresh full-suite re-run on real PostgreSQL 16 in an isolated container: site-server 538/538, cloud 12/12, contracts 77/77, web 99/99 — all 0 fail/0 skip at the current frontier. `test/fix-request-101-outbox-recovery.test.js` read in full: substantive, exercises backoff scheduling and dead-letter requeue against a real repository.

(This file's content is retained as a stub, not deleted, because this mount does not support unlinking/renaming files — see `docs/fix-requests/README.md`.)
