# FIX-036 ITDR2 List/Detail Re-Audit

Date: 2026-06-01
Task: `TASK-RE-AUDIT-036`
Fix ID: `FIX-036`
Form: ITDR2 / Outstanding Tasks Register
Department: IT

## Result

Status: Passed

The re-audit found one service-layer gap in the submitted fix and applied a narrow correction. After the follow-up fix, the required project typecheck passed.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-009_ITDR2_AUDIT.md`
- `audit/build_reviews/FIX-036_ITDR2_LIST_DETAIL_FIX_REPORT.md`
- `docs/central-form-reference.md`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr2/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr2/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/it-routes.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-support-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-support-service.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/validators/main-dbitext-support-validator.ts`

## Checks

| Check | Result | Notes |
|---|---|---|
| `/it/forms/itdr2` list route exists | Pass | Route points to `ITDR2DatabaseView`. |
| List reads parent records | Pass | Uses `useMainDBITList({ filter: "formcode eq 'ITDR2'" })`. |
| List reads ExtSupport child records | Pass | Uses `useMainDBITExtSupportList({ filter: "parentFormCode eq 'ITDR2'" })`. |
| Detail joins child to parent | Pass | Joins by parent lookup ID with title fallback. |
| Submit uses non-approval status | Pass | `new.tsx` writes `CurrentstatusKey4` (`Sent`) instead of `Approved`. |
| Submit creates ExtSupport child | Pass after follow-up fix | `new.tsx` creates `MainDB_IT_Ext_Support` child data for ITDR2 task fields. |
| ExtSupport service persists/readbacks all ITDR2 child fields | Fixed during re-audit | `iTDR2Year`, `iTDR2Month`, and `iTDR2Title` were present in the model/page but missing from service normalize/denormalize and validator mappings. |
| TypeScript verification | Pass | `npx tsc --noEmit` passed. |

## Follow-Up Fix Applied

- Added `ITDR2_Year`, `ITDR2_Month`, and `ITDR2_Title` mappings to `normalizeExtSupport()`.
- Added `ITDR2_Year`, `ITDR2_Month`, and `ITDR2_Title` mappings to `denormalizeExtSupport()`.
- Added `iTDR2Year`, `iTDR2Month`, and `iTDR2Title` to `MainDBITExtSupportSchema`.

## Promotion Decision

Promote `TASK-FIX-036` to Verified and mark `TASK-RE-AUDIT-036` Complete.

## Next Safe Task

Continue to `TASK-FIX-039` for PRF ExtAccess child-record creation during submit.
