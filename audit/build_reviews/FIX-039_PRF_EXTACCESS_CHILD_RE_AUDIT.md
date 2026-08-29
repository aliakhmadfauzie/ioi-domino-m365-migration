# FIX-039 / TASK-RE-AUDIT-039 - PRF ExtAccess Child Re-Audit

Date: 2026-06-01
Task: `TASK-RE-AUDIT-039`
Department/Form: IT / PRF
Priority: P0
Result: PASS - Verified

## Scope

Re-audit `AUD-B003-PRF-001` after `TASK-FIX-039`: PRF new-submit must create the linked `MainDB_IT_Ext_Access` workflow child record, PRF detail/workflow must read that child record, and workflow actions must write PRF workflow fields back to the extension list.

This re-audit does not close `AUD-B003-PRF-002` / `FIX-040`; PRF status taxonomy remains a separate P1 item.

## Evidence

| Check | Result | Evidence |
|---|---|---|
| PRF submit creates ExtAccess child | PASS | `src/pages/it/forms/prf/new.tsx` calls `createExtAccessMutation.mutateAsync` with `parentFormCode: 'PRF'`, `parentRecord.id`, `parentRecord.title`, `pRFFinalStatus`, `pRFStatus1`, `pRFDateSent`, manager placeholders, and `pRFRFC`. |
| Parent rollback on child failure | PASS | `new.tsx` catches ExtAccess creation failure and calls `MainDBITService.delete(String(parentRecord.id))` before rethrowing. |
| PRF detail reads linked ExtAccess child | PASS | `src/pages/it/forms/prf/detail.tsx` queries `MainDBITExtAccessService.getAll` using `parentFormCode eq 'PRF' and parentRecord/ID eq ${record.id}` and passes the resulting child ID into `usePRFWorkflow`. |
| ExtAccess filter translation supports lookup path | PASS | `src/generated/services/main-dbit-ext-access-service.ts` maps `parentrecord` to `ParentID`; `translateOptions` rewrites filter/order fields before calling the generated client, so `parentRecord/ID` becomes `ParentID/ID`. |
| PRF workflow writes extension fields | PASS | `src/hooks/use-prf-workflow.ts` builds `extPatch` values including PRF status, date, ISG/SAP, rating, comments, and RFC fields, then calls `MainDBITExtAccessService.update(extAccessRecordId, extPatch)` when a child ID is present. |
| Generated validator accepts PRF workflow fields | PASS | `src/generated/validators/main-dbitext-access-validator.ts` validates `parentRecord`, `pRFStatus1`, `pRFFinalStatus`, `pRFDateSent`, `pRFRating`, and `pRFRFC`. |
| TypeScript compile | PASS | `npx tsc --noEmit` completed with exit code 0 in `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`. |

## Decision

`AUD-B003-PRF-001` is verified fixed. Promote `TASK-FIX-039` to `Verified` and `TASK-RE-AUDIT-039` to `Complete`.

## Residual Risk

`AUD-B003-PRF-002` / `FIX-040` remains open as a separate P1 PRF status-taxonomy issue and was not resolved by this P0 ExtAccess child re-audit.

## Next Task

The next controller-selectable P0 task is `TASK-FIX-050` for SAPSOF2 sample list/database data replacement with SharePoint-backed records.
