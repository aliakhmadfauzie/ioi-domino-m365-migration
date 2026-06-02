# FIX-007 SAPCR Re-Audit Report

Date: 2026-06-02
Task: `TASK-RE-AUDIT-007`
Finding: `AUD-B02-SAPCR-001`
Form: SAPCR - SAP & WB Change Request
Department: IT
Previous Fix: `TASK-FIX-007` — Changed SAPCR submit from `currentStatus: 'Request'` to `CurrentstatusKey14` (Pending BPO) with `workflowstage: 1`

## Re-Audit Checks

### Check 1: Submit payload uses `CurrentstatusKey14`

**File**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapcr/new.tsx`
**Evidence** (line ~180):
```typescript
currentStatus: 'CurrentstatusKey14' as MainDBIT['currentStatus'],
workflowstage: 1,
```
**Result**: ✅ PASS — Submit writes `CurrentstatusKey14` (Pending BPO) instead of `'Request'`.

### Check 2: `workflowstage` is written as `1`

**File**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapcr/new.tsx`
**Evidence** (line ~181): `workflowstage: 1`
**Result**: ✅ PASS — `workflowstage` field is written as `1`.

### Check 3: Submitted records enter the BPO approval state

**Model evidence**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts` line 347:
```typescript
'CurrentstatusKey14': 'Pending BPO',
```
**Workflow evidence**: `src/config/module-workflows.ts` — SAPCR workflow stages:
- `Submitted` stage = `Pending BPO Approval`, order 1
- Initial submit transitions from `Request` → `Submitted`

**Result**: ✅ PASS — `CurrentstatusKey14` maps to `"Pending BPO"` matching the workflow's `Submitted` stage. BPO approval queue will filter on this status.

### Check 4: No regression to SAPCR extension-list email routing child creation

**File**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapcr/new.tsx`
**Evidence** (lines ~186-204):
```typescript
await createMainDBITExtSAP.mutateAsync({
  title: `${ticketId}-ext`,
  parentFormCode: 'SAPCR',
  parentRecord: { id: created.id, title: ticketId },
  parentSite: 'PRAI',
  sAPCRBPOEmail: ...,
  sAPCRPMEmail: ...,
  sAPCRDeveloperEmail: '',
  sAPCRDirectorEmail: ...,
});
```
**Result**: ✅ PASS — Ext_SAP child creation is preserved with BPO/PM/Developer/Director email routing fields.

### Check 5: TypeScript compiles cleanly

**Command**: `npx tsc --noEmit` from `ioicodeapp/powerapps-mirror/apps/ioi-platform`
**Result**: ✅ PASS — Zero errors.

## Overall Result

| Check | Status |
|-------|--------|
| 1. Submit uses `CurrentstatusKey14` | ✅ PASS |
| 2. `workflowstage` written as `1` | ✅ PASS |
| 3. Records enter Pending BPO state | ✅ PASS |
| 4. Ext_SAP child creation preserved | ✅ PASS |
| 5. TypeScript compiles cleanly | ✅ PASS |

**Re-Audit Result: ✅ PASSED**

SAPCR initial submit status fix is verified. Submitted records now correctly enter the BPO approval queue with `CurrentstatusKey14` (Pending BPO) and `workflowstage: 1`. No regression to the extension-list email routing child creation.

## Next Action

Promote `TASK-RE-AUDIT-007` to Complete. The next Ready P1 task in the queue is `TASK-FIX-010` (SAPTR — initial submit status), followed by `TASK-FIX-014` (SAPDRP), `TASK-FIX-016` (SAPSLCF), etc. P0 blocked tasks (CIR, SAPAMR provisioning) remain in their current state.
