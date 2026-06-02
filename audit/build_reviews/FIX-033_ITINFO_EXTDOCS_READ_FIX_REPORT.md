# FIX-033 ITINFO ExtDocs Read Fix Report

Date: 2026-06-01
Task: TASK-FIX-033
Form: ITINFO
Department: IT
Priority: P0
Status: Fixed Pending Re-Audit

## Source Finding

- Audit: `audit/03_findings/IT/AUD-011_ITINFO_AUDIT.md`
- Backlog: `audit/05_fix_backlog/FIX_BACKLOG.md`
- Finding: ITINFO submit writes structured ITI fields to `MainDB_IT_Ext_Docs`, but list/detail views only read `MainDB_IT.remarks`, so submitted ExtDocs data is not proven visible in normal views.

## Fix Applied

- Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itinfo/index.tsx`.
  - Added `useMainDBITExtDocsList` read for `parentFormCode eq 'ITINFO'`.
  - Joined ExtDocs rows to `MainDB_IT` parent records by parent lookup ID, with parent title fallback.
  - Mapped list/detail fields to prefer `iTIInfoType`, `iTISubject`, and `iTIRemarks`.
  - Kept `MainDB_IT.remarks` fallback for legacy records and for fields not present in ExtDocs (`INFO_To`, `INFO_Resend`).
- Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itinfo/new.tsx`.
  - Preserved `INFO_To`, `INFO_InfoType`, `INFO_Subject`, `INFO_ISGRemarks`, and `INFO_Resend` in structured JSON remarks.
  - Continued creating linked ExtDocs rows with ITI fields.
  - Added `parentSite: 'PRAI'`.
  - Disabled submit while either parent or ExtDocs create is pending.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Residual Scope

- `FIX-032` remains separate: ITINFO still uses `CurrentstatusKey1`; that status taxonomy issue was not changed in this P0 read-alignment fix.
