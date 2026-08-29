# FIX-022 UR Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-022`
Finding: `AUD-B002-UR-001`
Form: UR - User Registration
Department: IT

## Result

Status: Fixed Pending Re-Audit

UR (User Registration) submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved). UR's approval requirement is unresolved (FIX-023 blocked), so `Sent` is used as a safe non-terminal submitted state.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-050_UR_AUDIT.md` — Finding AUD-B002-UR-001
- `src/components/forms/dynamic-form-renderer.tsx` — Hardcoded currentStatus logic

## Code Change

File: `src/components/forms/dynamic-form-renderer.tsx`

**Before**:
```typescript
const isRS = formConfig.code === 'RS';
const currentStatus = (isSFAR ? 'CurrentstatusKey49' : isRS ? 'CurrentstatusKey4' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
```

**After**:
```typescript
const isRS = formConfig.code === 'RS';
const isUR = formConfig.code === 'UR';
const currentStatus = (isSFAR ? 'CurrentstatusKey49' : isRS || isUR ? 'CurrentstatusKey4' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
```

## Rationale

- `CurrentstatusKey1` maps to `'Approved'` — a terminal state inappropriate for new submissions.
- `CurrentstatusKey4` maps to `'Sent'` — a safe generic non-terminal submitted state.
- UR's approval requirement is unresolved (FIX-023 blocked/ambiguous), so `Sent` is the safest choice until the requirement is confirmed.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-022` to independently verify UR submit uses `CurrentstatusKey4` (Sent).
