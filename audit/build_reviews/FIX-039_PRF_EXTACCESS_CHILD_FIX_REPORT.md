# FIX-039 PRF ExtAccess Child Fix Report

Date: 2026-06-01
Task: `TASK-FIX-039`
Form: PRF - Program Request Form
Status: Fixed Pending Re-Audit

## Source Finding

`AUD-B003-PRF-001` in `audit/03_findings/IT/AUD-015_PRF_AUDIT.md` found that PRF detail and workflow screens expect a linked `MainDB_IT_Ext_Access` record, while the PRF new submit path only created the `MainDB_IT` parent record.

## Changes Applied

- Updated `src/pages/it/forms/prf/new.tsx` so PRF submit/save creates a linked ExtAccess child record after the parent record is created.
- Initialized PRF workflow child fields including `pRFFinalStatus`, `pRFStatus1`, `pRFDateSent`, department-manager placeholders, and `pRFRFC`.
- Added parent rollback on ExtAccess child-create failure to avoid leaving a PRF parent without the required workflow child.
- Added PRF `PRF_*` SharePoint internal-name mappings to `main-dbit-ext-access-service.ts` for normalize and denormalize paths.
- Added canonical model-key mappings for PRF workflow fields so SharePoint reads hydrate the existing `pRF*` model properties.
- Preserved `pRFRating` as numeric during ExtAccess normalization.
- Added PRF workflow fields to `main-dbitext-access-validator.ts` and aligned `parentRecord.id` with the generated numeric lookup model.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Promotion Decision

Not promoted to Verified yet. The fix is ready for strict PRF re-audit under `TASK-RE-AUDIT-039`.

## Next Required Task

Run `TASK-RE-AUDIT-039` to verify:

- PRF submit creates both parent and ExtAccess child records.
- PRF detail lookup can find the child by `parentFormCode eq 'PRF'` and `parentRecord/ID`.
- PRF workflow actions write to confirmed `PRF_*` ExtAccess columns through the generated service.
