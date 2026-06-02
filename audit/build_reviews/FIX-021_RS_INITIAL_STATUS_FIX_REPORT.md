# FIX-021 RS Initial Status Fix Report

Date: 2026-06-02
Task: `TASK-FIX-021`
Finding: `AUD-B001-RS-002`
Form: RS - Reset Password / Unlock ID
Department: IT

## Result

Status: Fixed Pending Re-Audit

RS (Reset Password / Unlock ID) submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved). RS is a direct-to-IT-PIC form with no manager approval required.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-044_RS_AUDIT.md` — Finding AUD-B001-RS-002
- `src/components/forms/dynamic-form-renderer.tsx` — Hardcoded currentStatus logic
- `src/lib/it-forms-config.ts` — RS config: `hideApprovalChain: true`, direct-to-PIC routing

## Code Change

File: `src/components/forms/dynamic-form-renderer.tsx`

**Before**:
```typescript
const currentStatus = (isSFAR ? 'CurrentstatusKey49' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
```

**After**:
```typescript
const isRS = formConfig.code === 'RS';
const currentStatus = (isSFAR ? 'CurrentstatusKey49' : isRS ? 'CurrentstatusKey4' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
```

## Rationale

- `CurrentstatusKey1` maps to `'Approved'` — a terminal state inappropriate for a submitted request.
- `CurrentstatusKey4` maps to `'Sent'` — appropriate for a direct-to-PIC service request form.
- RS has `hideApprovalChain: true` and no manager approval stage — records flow directly to IT PIC.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-021` to independently verify:
- RS submit uses `CurrentstatusKey4` (Sent);
- No regression to other dynamic forms (UR, etc.) which still use `CurrentstatusKey1`.
