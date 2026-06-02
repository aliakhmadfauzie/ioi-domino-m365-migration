# FIX-050 / TASK-FIX-050 - SAPSOF2 Sample Data Replacement

Date: 2026-06-01
Task: `TASK-FIX-050`
Department/Form: IT / SAPSOF2
Priority: P0
Result: Fixed Pending Re-Audit

## Task Selected

`TASK-FIX-050` was selected from `automation/MASTER_TASK_QUEUE.md` as the highest-priority Ready task after `TASK-RE-AUDIT-039` completed.

## Why Allowed

- Dependency check: no direct dependency listed for `TASK-FIX-050`.
- Blocking check: CIR/HR build blockers remain isolated to HR builds; SAPSOF2 sample-data replacement is an IT P0 fix and is not blocked by pending human/business responses.
- Evidence check: `audit/03_findings/IT/AUD-046_SAPSOF2_AUDIT.md` identifies `AUD-B003-SAPSOF2-002`, where the SAPSOF2 database page renders hardcoded `SAMPLE_DATA` instead of submitted SharePoint records.
- Scope check: selected task is Fix mode, so app source edits under `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/` are allowed.

## Work Performed

Updated `src/pages/it/forms/sapsof2/index.tsx` to:

- Remove the hardcoded `SAMPLE_DATA` array from the SAPSOF2 database view.
- Read real `MainDB_IT` records with `useMainDBITList({ filter: "formcode eq 'SAPSOF2'", orderBy: ['submitteddate desc'] })`.
- Map `MainDB_IT` parent fields into the existing SAPSOF2 table/detail view shape.
- Parse the existing SAPSOF2 parent `remarks` snapshot to recover client, module, TR number, reference, IT owner, BPO requirement, key-user slots, BPO slots, and submitted test-evidence summary for display.
- Add loading and empty states for the SharePoint-backed list.

This fix intentionally does not claim child approval/test-evidence persistence is complete. That remains tracked under `FIX-051` / `TASK-FIX-051`.

## Evidence

| Evidence | Result |
|---|---|
| `audit/03_findings/IT/AUD-046_SAPSOF2_AUDIT.md` | Confirms SAPSOF2 list/database view used sample data. |
| `src/pages/it/forms/sapsof2/index.tsx` | Now uses `useMainDBITList` and `MainDBIT` records instead of `SAMPLE_DATA`. |
| `npx tsc --noEmit` | Passed with exit code 0 in `ioicodeapp/powerapps-mirror/apps/ioi-platform`. |

## Result

`AUD-B003-SAPSOF2-002` is fixed pending strict re-audit.

## Queue Updates

- `TASK-FIX-050`: set to `Fixed Pending Re-Audit`.
- `TASK-RE-AUDIT-050`: added as the next SAPSOF2 re-audit checkpoint.
- `TASK-FIX-051`: remains Ready and separate for approval/test-evidence child persistence/readback.

## Next Recommended Task

Run `TASK-RE-AUDIT-050` to verify the SAPSOF2 database view reads SharePoint-backed `MainDB_IT` records and no longer renders `SAMPLE_DATA`.
