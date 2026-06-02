# FIX-014 SAPDRP Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-014`
Finding: `AUD-B001-SAPDRP-001`
Form: SAPDRP - SAP Disaster Recovery Plan Procedure
Department: IT

## Result

Status: Fixed Pending Re-Audit

SAPDRP submit now writes `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved). SAPDRP is a document/procedure management form — the document lifecycle status is tracked via the `HDR_Selection1` field (Draft/For Review/Approved/Superseded/Obsolete) stored in remarks, not the SharePoint `currentStatus` choice.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-020_SAPDRP_AUDIT.md` — Finding AUD-B001-SAPDRP-001
- `src/generated/models/main-dbit-model.ts` — `CurrentstatusKey4`: 'Sent', `CurrentstatusKey1`: 'Approved'
- `src/pages/it/forms/sapdrp/new.tsx` — Create handler

## Code Change

File: `src/pages/it/forms/sapdrp/new.tsx`

**Before**:
```typescript
currentStatus: 'CurrentstatusKey1' as MainDBITCurrentstatusKey,
```

**After**:
```typescript
currentStatus: 'CurrentstatusKey4' as MainDBITCurrentstatusKey,
```

## Rationale

- `CurrentstatusKey1` maps to `'Approved'` — a terminal/approved state inappropriate for a submitted record.
- `CurrentstatusKey4` maps to `'Sent'` — a generic non-approval submitted state.
- SAPDRP is a document procedure recording form with its own document status field (`HDR_Selection1` ∈ {Draft, For Review, Approved, Superseded, Obsolete}) stored in `remarks`.
- `workflowstage: 1` was already correctly set.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-014` to independently verify:
- Submit payload uses `CurrentstatusKey4` (Sent);
- Submitted records are no longer created as Approved;
- `workflowstage: 1` is preserved;
- TypeScript compiles cleanly.
