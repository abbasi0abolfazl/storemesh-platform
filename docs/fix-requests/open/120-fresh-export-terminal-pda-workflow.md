# Fix Request 120 — Fresh Export has no PDA or Terminal workflow

## Problem

Every other production/warehouse module — Packaging, Quality Control, Consumables receiving, Shipping, Internal Transfer — already has a dedicated PDA and/or Terminal floor workflow, shipped via FR103–107 and FR112–115. Fresh Export is the one module left without any floor-device workflow at all.

Confirmed via `grep -rn "FRESH_EXPORT" storemesh-pda/*.js storemesh-terminal/*.js storemesh-terminal/src/*.js`: zero matches in either repo. `fresh-export-review-2026-08-24.txt` (finding on PDA/Terminal coverage) is still accurate against current code — this was never filed as its own fix request; it was out of scope for the FR103–107 batch, which covered Packaging/QC/Consumables/Shipping/Internal-Transfer only.

## Requirements

- Follow the same device-placement pattern already established for Packaging and QC (per `needs-decision/fr103-104-105-floor-device-placement.md`'s resolution — Terminal for both Packaging and QC): read the Fresh Export domain logic (`storemesh-site-server/src/domain.js`, cold-holding/weighing/box-lifecycle per FR55) and the existing Terminal Packaging/QC workflows (FR113/114) as the reference shape, and add an equivalent Fresh Export workflow to whichever device (PDA or Terminal) matches how operators already interact with cold-holding, weighing, and box lifecycle on the floor — if genuinely ambiguous which device fits best, flag that explicitly as a blocker rather than guessing, the same way FR103/104/105 did before Mohamad's device-placement decision.
- Cover the real Fresh Export floor actions: cold-holding intake, weighing, box lifecycle transitions (open/close/seal), and whatever manager-override paths FR46/FR55 already define server-side.
- Real-PostgreSQL backend tests plus device-UI tests matching the existing FR112–115 pattern (server round-trip, not just UI rendering).
- Update `storemesh-contracts` for any new routes.

## Acceptance criteria

- `storemesh-terminal` and/or `storemesh-pda` full suites green with new Fresh Export workflow tests.
- `storemesh-site-server` full suite green, real PostgreSQL, at or above current baseline.
- An operator can complete a full Fresh Export floor sequence (intake → weigh → box lifecycle) from the chosen device without going through the web console.
