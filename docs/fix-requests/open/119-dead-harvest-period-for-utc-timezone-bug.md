# Fix Request 119 — Remove or fix dead `harvestPeriodFor()` (recurrence of the FR60/FR63 timezone-bug pattern)

## Problem

`storemesh-site-server/src/domain.js`, method `harvestPeriodFor(instant)` (around line 115), computes an ISO week code using `Date.UTC`/`getUTCFullYear`/`getUTCMonth`/`getUTCDate`/`getUTCDay` — i.e. it resolves a business value (which harvest period an instant falls into) from a fixed UTC offset rather than the active site's configured timezone. This is the same class of bug FR60 and FR63 already fixed once (server/local timezone leaking into a business rule in a system spanning Dubai/Rome/Iran sites).

Confirmed via repository-wide grep (`grep -rn "harvestPeriodFor" src/ test/`): the method has **zero callers** anywhere in `storemesh-site-server`. Real harvest-period assignment goes through the admin-configured `createHarvestPeriod`/date-range lookup path instead. So the bug is not currently live — but the method sits in `domain.js` looking like a working utility, and if anyone wires it up later (e.g. as an "auto-detect harvest period" convenience) it reintroduces the exact timezone bug class twice already found and fixed in this codebase.

## Requirements

- Confirm with a fresh repo-wide grep at implementation time that `harvestPeriodFor` still has no callers and no external contract/test depends on its current (buggy) behavior.
- If genuinely dead: delete the method entirely.
- If it turns out something does depend on it, or product wants to keep it as a future-use utility: fix it to resolve the site timezone the same way the receiving-hours-warning code already does (see the `Intl.DateTimeFormat`-with-site-timezone pattern introduced for FR63, roughly `domain.js` around line 241) rather than fixed UTC math, and add a real-PostgreSQL test proving two sites in different timezones can compute different harvest-period codes for the same instant.
- No other unrelated code path should change.

## Acceptance criteria

- `grep -rn "harvestPeriodFor" src/` after the change shows either zero occurrences (deleted) or a timezone-aware implementation plus a passing test exercising it under a non-UTC, non-Tehran site timezone (e.g. `TZ=America/Los_Angeles` for the Node process, to prove the fix doesn't rely on the host's own local time either).
- Full `storemesh-site-server` `node --test` run, real PostgreSQL, at or above the current passing baseline, 0 failures.
