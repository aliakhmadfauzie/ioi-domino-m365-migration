# FIX-036 ITDR2 List/Detail Fix Report

Date: 2026-06-01
Task: `TASK-FIX-036`
Fix ID: `FIX-036`
Form: ITDR2 / Outstanding Tasks Register
Department: IT

## Scope

Selected the next ready P0 fix after `TASK-FIX-035` and `TASK-RE-AUDIT-035` were already verified.

Primary audit issue:

- `AUD-B002-ITDR2-001`: ITDR2 had a create page but no matching list/detail read implementation.

Related same-form correction made in the same submit path:

- `AUD-B002-ITDR2-002`: ITDR2 was using `Approved` for a no-approval report submission.

## Code Changes

- Added `src/pages/it/forms/itdr2/index.tsx`.
- Registered `/it/forms/itdr2` to the new ITDR2 database view in `src/routes/it-routes.tsx`.
- The new list reads `MainDB_IT` with `formcode eq 'ITDR2'`.
- The new list also reads `MainDB_IT_Ext_Support` with `parentFormCode eq 'ITDR2'`.
- Detail modal joins ExtSupport child rows to parent records by parent lookup ID, with parent title fallback.
- Detail/list values prefer structured ExtSupport fields and fall back to parent `remarks` JSON for existing records.
- Updated `src/pages/it/forms/itdr2/new.tsx` to use non-approval `Sent` status (`CurrentstatusKey4`) instead of `Approved`.
- Updated ITDR2 submit to create a linked ExtSupport child row for confirmed ITDR2 task fields:
  - `iTDR2Title`
  - `iTDR2TaskDescription`
  - `iTDR2AssignedTo`
  - `iTDR2DueDate`
  - `iTDR2TaskStatus`
  - `iTDR2Year`
  - `iTDR2Month`

## Verification

- Command: `npx tsc --noEmit`
- Result: Passed

## Result

`TASK-FIX-036` is fixed pending re-audit.

The implementation does not resolve unrelated blocked form-code conflicts for other ITDR/ITDAILYRPT items.

## Next Safe Task

Per controller priority, continue to the next ready P0 fix: `TASK-FIX-039`.
