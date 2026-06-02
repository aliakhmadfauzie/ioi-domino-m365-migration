# FIX-035 ITDR Status and ExtSupport Read Fix Report

Date: 2026-06-01
Task: TASK-FIX-035
Form: ITDR / ITDAILYRPT
Department: IT
Priority: P0
Status: Fixed Pending Re-Audit

## Source Finding

- Audit: `audit/03_findings/IT/AUD-040_ITDR_AUDIT.md`
- Backlog: `audit/05_fix_backlog/FIX_BACKLOG.md`
- Finding: ITDR uses a non-approval report-submission workflow, but the submit path wrote `CurrentstatusKey1` (`Approved`) and the list/detail view only proved parent/remarks reads even though submit creates a `MainDB_IT_Ext_Support` child row.

## Scope Boundary

`FIX-034` remains open for the ITDR versus ITDAILYRPT form-code ownership conflict. This fix intentionally preserves the existing runtime storage identity (`formcode: 'ITDAILYRPT'` and `parentFormCode: 'ITDAILYRPT'`) and corrects only `FIX-035`: status handling and ExtSupport read parity.

## Fix Applied

- Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr/new.tsx`.
  - Changed initial submit status from `CurrentstatusKey1` (`Approved`) to `CurrentstatusKey4` (`Sent`) for the no-approval report submission.
  - Continued creating the linked `MainDB_IT_Ext_Support` child row.
  - Added `parentSite: 'PRAI'` to the child record.
  - Trimmed submitted text values and disabled submit while either parent or child create is pending.
- Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr/index.tsx`.
  - Added `useMainDBITExtSupportList` read for `parentFormCode eq 'ITDAILYRPT'`.
  - Joined ExtSupport rows to parent `MainDB_IT` rows by parent lookup ID, with parent title fallback.
  - Mapped list/detail fields to prefer ExtSupport activity type, category, date range, venue, and participants.
  - Preserved parent remarks fallback for legacy records and fields not present in ExtSupport.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Residual Scope

- `FIX-034` remains blocked by the ITDR versus ITDAILYRPT naming/ownership decision.
