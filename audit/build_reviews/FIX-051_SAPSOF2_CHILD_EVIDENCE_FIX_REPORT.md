# FIX-051 SAPSOF2 Child Evidence Fix Report

Date: 2026-06-01
Task: `TASK-FIX-051`
Form: SAPSOF2 - SAP UAT Sign-Off
Result: Fixed Pending Re-Audit

## Scope

`AUD-B003-SAPSOF2-003` reported that SAPSOF2 approval and test evidence child records were assembled in the submit page but not proven persisted or read. This checkpoint was limited to child-record persistence and readback for the existing SAPSOF2 implementation.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-046_SAPSOF2_AUDIT.md`
- `audit/build_reviews/FIX-050_SAPSOF2_SAMPLE_DATA_RE_AUDIT.md`
- `audit/05_fix_backlog/FIX_BACKLOG.md`
- `docs/ui-page-specification.md`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/index.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/approval-records-service.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/it-sapsof-test-evidence-service.ts`

Note: `docs/page-requirements-guide.md` was referenced by app instructions but is not present in the repository. The active UI source of truth found was `docs/ui-page-specification.md`.

## Changes Made

- SAPSOF2 submit now creates linked `ApprovalRecords` rows for Key User and BPO slots after the parent `MainDB_IT` record is created.
- SAPSOF2 submit now creates linked `ITSAPSOFTestEvidence` rows for each test scenario after the parent `MainDB_IT` record is created.
- Parent creation is rolled back if any child approval or test-evidence write fails; already-created child rows are deleted best-effort before parent rollback.
- `ITSAPSOFTestEvidenceService` now normalizes/denormalizes confirmed SharePoint columns including `ParentFormCode`, `ParentID`, `Evidence_TestNo`, `Evidence_Description`, `Evidence_ExpectedResult`, `Evidence_ActualResult`, `Evidence_Status`, `Evidence_TestedBy`, `Evidence_TestedDate`, and `Evidence_Remarks`.
- SAPSOF2 database view now reads `ApprovalRecords` and `ITSAPSOFTestEvidence`, joins child rows to the parent by form ID / parent lookup, and falls back to parent remarks for older records.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Re-Audit Requirements

Run `TASK-RE-AUDIT-051` to verify:

- a new SAPSOF2 submission creates the expected parent `MainDB_IT` row;
- child `ApprovalRecords` rows are created for populated KU/BPO slots with `FormCode = SAPSOF2` and `FormID` equal to the parent ID;
- child `ITSAPSOFTestEvidence` rows are created with `ParentFormCode = SAPSOF2` and `ParentID` lookup to the parent;
- SAPSOF2 list/detail reads prefer child approval/test evidence rows and retain parent-remarks fallback for legacy records.

## Status

Fixed Pending Re-Audit.
