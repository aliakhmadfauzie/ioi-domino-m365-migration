# FIX-016 SAPSLCF Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-016`
Finding: `AUD-B001-SAPSLCF-001`
Form: SAPSLCF - SAP Storage Location Creation Form
Department: IT

## Result

Status: Fixed Pending Re-Audit

SAPSLCF submit now writes `CurrentstatusKey27` (Pending HOD) instead of `CurrentstatusKey1` (Approved). SAPSLCF is an approval-required form with HOD as the first approver.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-021_SAPSLCF_AUDIT.md` — Finding AUD-B001-SAPSLCF-001
- `src/generated/models/main-dbit-model.ts` — `CurrentstatusKey27`: 'Pending HOD'
- `src/pages/it/forms/sapslcf/new.tsx` — Create handler

## Code Change

File: `src/pages/it/forms/sapslcf/new.tsx`

**Before**:
```typescript
currentStatus: 'CurrentstatusKey1' as MainDBITCurrentstatusKey,
```

**After**:
```typescript
currentStatus: 'CurrentstatusKey27' as MainDBITCurrentstatusKey,
```

## Rationale

- `CurrentstatusKey1` maps to `'Approved'` — a terminal/approved state inappropriate for a newly submitted record.
- `CurrentstatusKey27` maps to `'Pending HOD'` — the correct pending state for a form requiring HOD approval.
- `workflowstage: 1` was already correctly set.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-016` to independently verify:
- Submit payload uses `CurrentstatusKey27` (Pending HOD);
- Submitted records are no longer created as Approved;
- `workflowstage: 1` is preserved;
- TypeScript compiles cleanly.
