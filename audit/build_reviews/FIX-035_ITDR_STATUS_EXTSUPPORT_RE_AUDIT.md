# FIX-035 ITDR Status and ExtSupport Read Re-Audit

Date: 2026-06-01
Task: TASK-RE-AUDIT-035
Form: ITDR / ITDAILYRPT
Department: IT
Priority: P0
Result: Passed

## Evidence Reviewed

- `audit/03_findings/IT/AUD-040_ITDR_AUDIT.md`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itdr/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-support-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-support-service.ts`
- `audit/build_reviews/FIX-035_ITDR_STATUS_EXTSUPPORT_FIX_REPORT.md`

## Re-Audit Checks

| Check | Result | Evidence |
|---|---|---|
| ITDR submit no longer writes terminal Approved status | Pass | `new.tsx` uses `CurrentstatusKey4`, which maps to `Sent` |
| Parent record remains consistent with existing runtime identity | Pass | `new.tsx` still writes `formcode: 'ITDAILYRPT'`; `FIX-034` tracks the naming conflict separately |
| Linked ExtSupport row is still created | Pass | `new.tsx` creates `MainDBITExtSupport` with parent lookup and `iTDR*` fields |
| List/detail reads ExtSupport child data | Pass | `index.tsx` calls `useMainDBITExtSupportList` filtered to `ITDAILYRPT` and joins by parent lookup ID/title |
| ExtSupport fields are preferred with remarks fallback | Pass | `index.tsx` prefers child activity/category/date/venue/participants values and falls back to parsed remarks |
| TypeScript compiles | Pass | `npx tsc --noEmit` passed |

## Decision

`TASK-FIX-035` is verified and `TASK-RE-AUDIT-035` is complete.

## Follow-Up

Run `TASK-FIX-036` next for ITDR2 list/detail reads. Keep `FIX-034` blocked until a human/business decision confirms ITDR versus ITDAILYRPT form-code ownership.
