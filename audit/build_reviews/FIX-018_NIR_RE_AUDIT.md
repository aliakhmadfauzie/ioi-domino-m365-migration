# FIX-018 NIR Approval Persistence Re-Audit Report

Date: 2026-06-02
Task: `TASK-RE-AUDIT-018`
Form: NIR - Notes ID Request
Department: IT

## Checks

1. ✅ `onApprove` calls `MainDBITService.update()` with `CurrentstatusKey38`, `nIRHODApprovalStatus`, `nIRHODApprovedBy`, `nIRHODApprovedDate`, `workflowstage: 3`
2. ✅ `onReject` calls `MainDBITService.update()` with `CurrentstatusKey2`, rejection fields, `nirComment`
3. ✅ `canApprove` checks `CurrentstatusKey27` (Pending HOD)
4. ✅ `npx tsc --noEmit` — zero errors

**Result: ✅ PASSED**
