# FIX-019 NIR Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-019`
Finding: `AUD-B001-NIR-002`
Form: NIR - Notes ID Request
Department: IT

## Result

Status: Fixed Pending Re-Audit

NIR initial submit now creates records in the `Submitted` workflow state (`CurrentstatusKey30` = Pending IT, `workflowstage: 2`, `nirCA: 'Submitted'`) instead of the `Request` draft state (`CurrentstatusKey27` = Pending HOD, `workflowstage: 1`, `nirCA: 'Request'`).

## Evidence Reviewed

- `audit/03_findings/IT/AUD-043_NIR_AUDIT.md` — Finding AUD-B001-NIR-002
- `src/types/m1-forms.ts` — `NIR_WORKFLOW_CONFIG`: Request = Draft (stage 1), Submitted = Pending ISG HOD (stage 2)
- `src/hooks/use-nir-workflow.ts` — `caToStatusKey`: Submitted → `CurrentstatusKey30`
- `src/pages/it/forms/nir/new.tsx` — Create handler

## Code Change

File: `src/pages/it/forms/nir/new.tsx`

**Before**:
```typescript
currentStatus: 'CurrentstatusKey27',
remarks: JSON.stringify({ nirCA: 'Request' }),
workflowstage: 1,
```

**After**:
```typescript
currentStatus: 'CurrentstatusKey30',
remarks: JSON.stringify({ nirCA: 'Submitted' }),
workflowstage: 2,
```

## Rationale

- `CurrentstatusKey27` (Pending HOD) maps to the `Request` CA state (Draft, stage 1). Records in this state cannot be seen in the HOD approval queue.
- `CurrentstatusKey30` (Pending IT) maps to the `Submitted` CA state (Pending ISG HOD, stage 2). Records in this state enter the HOD approval queue immediately.
- The success message already said "pending ISG HOD approval" — the status now matches the UX expectation.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-019` to independently verify the NIR initial status alignment.
