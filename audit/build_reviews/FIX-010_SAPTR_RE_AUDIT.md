# FIX-010 SAPTR Re-Audit Report

Date: 2026-06-02
Task: `TASK-RE-AUDIT-010`
Finding: `AUD-B02-SAPTR-001`
Form: SAPTR - SAP Transport Request
Department: IT
Previous Fix: `TASK-FIX-010` — Changed SAPTR submit from `currentStatus: 'CurrentstatusKey1'` (Approved) to `CurrentstatusKey9` (Pending Approval A) with `workflowstage: 1`

## Re-Audit Checks

### Check 1: Submit payload uses `CurrentstatusKey9` (Pending Approval A)

**File**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/saptr/new.tsx`
**Evidence**:
```typescript
currentStatus: 'CurrentstatusKey9' as MainDBIT['currentStatus'],
workflowstage: 1,
```
**Result**: ✅ PASS — Submit writes `CurrentstatusKey9` (Pending Approval A) instead of `CurrentstatusKey1` (Approved).

### Check 2: `workflowstage` is written as `1`

**Evidence**: `workflowstage: 1` in the submit payload.
**Result**: ✅ PASS — `workflowstage` field is written as `1`, aligning with SAPTR workflow stage order (Request=0, Submitted=1).

### Check 3: Submitted records enter the Pending Approval state

**Model evidence**: `src/generated/models/main-dbit-model.ts` line 342:
```typescript
'CurrentstatusKey9': 'Pending Approval A',
```
**Workflow evidence**: `src/config/module-workflows.ts` — SAPTR workflow:
- `Submitted` stage = `Pending Approval`, order 1, actor First Approver
- Initial submit transitions from `Request` → `Submitted`

**Result**: ✅ PASS — `CurrentstatusKey9` maps to `"Pending Approval A"`, matching the workflow's `Submitted` (Pending Approval) stage. First approver queue will filter on this status.

### Check 4: Ext_SAP child creation preserved

**Evidence** (same file, post-submit):
```typescript
if (created?.id) {
  const extData: Omit<MainDBITExtSAP, 'id'> = {
    title: `${requestNumber}-sap`,
    parentFormCode: 'SAPTR',
    parentRecord: { id: created.id, title: requestNumber },
    sAPTRNumber: ...,
    sAPTRCategory: ...,
    sAPTRClient: ...,
    sAPTRIssueNum: ...,
    sAPTRTcode: ...,
    sAPTRChangesDone: ...,
    sAPTRKeyUser: ...,
    sAPTRRequestedBy: ...,
  };
  await createExtSAP.mutateAsync(extData);
}
```
**Result**: ✅ PASS — Ext_SAP child creation preserved with all SAPTR-specific columns.

### Check 5: TypeScript compiles cleanly

**Command**: `npx tsc --noEmit` from `ioicodeapp/powerapps-mirror/apps/ioi-platform`
**Result**: ✅ PASS — Zero errors.

## Overall Result

| Check | Status |
|-------|--------|
| 1. Submit uses `CurrentstatusKey9` (Pending Approval A) | ✅ PASS |
| 2. `workflowstage` written as `1` | ✅ PASS |
| 3. Records enter Pending Approval state, not Approved | ✅ PASS |
| 4. Ext_SAP child creation preserved | ✅ PASS |
| 5. TypeScript compiles cleanly | ✅ PASS |

**Re-Audit Result: ✅ PASSED**

SAPTR initial submit status fix is verified. Submitted records now correctly enter the Pending Approval queue with `CurrentstatusKey9` (Pending Approval A) and `workflowstage: 1`. No regression to Ext_SAP child creation.

## Next Action

Promote `TASK-RE-AUDIT-010` to Complete. The next Ready P1 task is `TASK-FIX-014` (SAPDRP — initial submit status).
