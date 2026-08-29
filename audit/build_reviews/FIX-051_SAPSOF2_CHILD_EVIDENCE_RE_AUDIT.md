# FIX-051 SAPSOF2 Child Evidence Re-Audit

Date: 2026-06-01
Task: `TASK-RE-AUDIT-051`
Form: SAPSOF2 - SAP UAT Sign-Off
Result: Complete - Passed

## Task Selected

`TASK-RE-AUDIT-051` was selected from `automation/MASTER_TASK_QUEUE.md` as the highest-priority Ready task. It depends on `TASK-FIX-051`, which was marked Fixed Pending Re-Audit with evidence in `audit/build_reviews/FIX-051_SAPSOF2_CHILD_EVIDENCE_FIX_REPORT.md`.

## Why Allowed

- Dependency `TASK-FIX-051` is fixed pending re-audit.
- The fix report exists and documents the intended child persistence/readback behavior.
- No HR build or DRD build was started; HR CIR-dependent work remains blocked by existing schema/provisioning gates.
- Re-audit mode does not require app source modification.

## Work Performed

Reviewed the SAPSOF2 submit, list/detail, and generated service code paths:

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/index.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/approval-records-service.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/it-sapsof-test-evidence-service.ts`

## Re-Audit Checks

| Check | Result | Evidence |
|---|---|---|
| Parent submission still creates `MainDB_IT` SAPSOF2 record before child writes | Passed | `new.tsx` creates `createdSubmission` before child service calls |
| Approval slots persist to `ApprovalRecords` | Passed | `toApprovalChildRecord()` maps stage, slot, `FormID`, `FormCode`, `StageNumber`, action fields, and pending action key; submit calls `ApprovalRecordsService.create()` for each populated approval slot |
| Test scenarios persist to `ITSAPSOFTestEvidence` | Passed | `toEvidenceChildRecord()` maps parent lookup, `ParentFormCode`, test number, description, expected/actual result, status, tester, date, and metadata; submit calls `ITSAPSOFTestEvidenceService.create()` for each scenario |
| Child-write failure avoids orphaned parent records | Passed | submit deletes created child rows best-effort and deletes the parent `MainDB_IT` row on child create failure |
| Approval records use confirmed service mappings | Passed | `approval-records-service.ts` denormalizes `FormID`, `FormCode`, `StageNumber`, `ActionByID`, `ActionByName`, `ActionDate`, `Action`, `Comments`, and `NextStage` |
| Test evidence service uses confirmed SharePoint column mappings | Passed | `it-sapsof-test-evidence-service.ts` denormalizes `ParentFormCode`, `ParentID`, `Evidence_TestNo`, `Evidence_Description`, `Evidence_ExpectedResult`, `Evidence_ActualResult`, `Evidence_Status`, `Evidence_TestedBy`, `Evidence_TestedDate`, and `Evidence_Remarks` |
| SAPSOF2 list/detail reads approval child rows | Passed | `index.tsx` uses `useApprovalRecordsList()`, joins by SAPSOF2 `FormCode` and parent `FormID`, maps KU/BPO slots, and falls back to remarks when no child rows exist |
| SAPSOF2 list/detail reads test evidence child rows | Passed | `index.tsx` uses `useITSAPSOFTestEvidenceList()`, joins by `ParentFormCode` and parent lookup, maps test rows, and falls back to remarks when no child rows exist |
| SAPSOF2 page still avoids sample data | Passed | `rg` found no `SAMPLE_DATA` in `src/pages/it/forms/sapsof2`; database view uses generated hooks |
| TypeScript verification | Passed | `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform` |

## Result

`TASK-RE-AUDIT-051` passed. `TASK-FIX-051` can be marked Verified and `FIX-051` can be marked Verified.

## Queue Updates

- `TASK-FIX-051`: Fixed Pending Re-Audit -> Verified
- `TASK-RE-AUDIT-051`: Ready -> Complete
- `FIX-051`: Fixed Pending Re-Audit -> Verified
- Next recommended task: `TASK-FIX-001`

## Residual Risks

- `AUD-B003-SAPSOF2-001` remains tracked separately as `TASK-FIX-002`: SAPSOF2 initial status still needs workflow-state reconciliation.
- The large SAPSOF/SAPSOF2 field decomposition remains outside this scoped child-record re-audit.

## Next Recommended Task

`TASK-FIX-001` - Prevent initial SFAR submit from writing final Approved status.
