# FIX-010 SAPTR Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-010`
Finding: `AUD-B02-SAPTR-001`
Form: SAPTR - SAP Transport Request
Department: IT

## Result

Status: Fixed Pending Re-Audit

SAPTR submit now writes the confirmed workflow start state (`CurrentstatusKey9` = Pending Approval A) with `workflowstage: 1` instead of the final `CurrentstatusKey1` (Approved).

## Evidence Reviewed

- `audit/findings/batch-02/saptr.md` — Finding AUD-B02-SAPTR-001
- `src/config/module-workflows.ts` — SAPTR_WORKFLOW: Request → Submitted (Pending Approval) transition
- `src/generated/models/main-dbit-model.ts` — `CurrentstatusKey9`: 'Pending Approval A'
- `src/pages/it/forms/saptr/new.tsx` — Create handler

## Code Change

File: `src/pages/it/forms/saptr/new.tsx`

### Change 1: Status and workflow stage

**Before**:
```typescript
currentStatus: 'CurrentstatusKey1',
```

**After**:
```typescript
currentStatus: 'CurrentstatusKey9' as MainDBIT['currentStatus'],
workflowstage: 1,
```

### Change 2: Remarks workflow description

**Before**:
```
'Current Stage: Technical Lead Review',
'Workflow Stage: 2',
```

**After**:
```
'Current Stage: Pending Approval',
'Workflow Stage: 1',
```

## Rationale

- `CurrentstatusKey9` maps to `'Pending Approval A'` in the generated `MainDBITCurrentstatusKeyToLabel` — correctly represents the `Submitted` stage of the SAPTR workflow.
- `workflowstage: 1` aligns with the workflow stage order (Request=0, Submitted=1).
- The previous `CurrentstatusKey1` mapped to `'Approved'`, which bypassed the first approval gate.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-010` to independently verify:
- Submit payload uses `CurrentstatusKey9` (Pending Approval A);
- `workflowstage` is written as `1`;
- Submitted records enter the Pending Approval state rather than Approved;
- Ext_SAP child creation is preserved;
- TypeScript compiles cleanly.
