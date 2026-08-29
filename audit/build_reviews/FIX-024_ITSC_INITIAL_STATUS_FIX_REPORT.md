# FIX-024 ITSC Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-024`
Finding: N/A (non-approval checklist form)
Form: ITSC - IT Service Continuity (Server Health Checklist)
Department: IT

## Result

Status: Fixed Pending Re-Audit

ITSC submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved). ITSC is a server health checklist / data recording form with no approval workflow.

## Evidence Reviewed

- `src/pages/it/forms/itsc/new.tsx` — Create handler uses `CurrentstatusKey1` (Approved)
- `src/generated/models/main-dbit-model.ts` — `CurrentstatusKey4`: 'Sent'

## Code Change

File: `src/pages/it/forms/itsc/new.tsx`

**Before**:
```typescript
currentStatus: 'CurrentstatusKey1' as MainDBITCurrentstatusKey,
```

**After**:
```typescript
currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey,
```

## Rationale

- `CurrentstatusKey1` maps to `'Approved'` — a terminal state inappropriate for a submitted server health checklist.
- `CurrentstatusKey4` maps to `'Sent'` — appropriate for a non-approval data recording form.
- `workflowstage: 1` was already correctly set.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-024` to independently verify ITSC submit uses `CurrentstatusKey4` (Sent).
