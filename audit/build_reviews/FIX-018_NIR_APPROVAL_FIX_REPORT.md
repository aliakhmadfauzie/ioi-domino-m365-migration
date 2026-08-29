# FIX-018 NIR Approval Actions Persistence Fix Report

Date: 2026-06-02
Task: `TASK-FIX-018`
Finding: `AUD-B001-NIR-001`
Form: NIR - Notes ID Request
Department: IT

## Result

Status: Fixed Pending Re-Audit

NIR list page (`index.tsx`) approval/rejection actions now persist via `MainDBITService.update()` instead of only logging to console.

## Evidence Reviewed

- `audit/03_findings/IT/AUD-043_NIR_AUDIT.md` — Finding AUD-B001-NIR-001: "Required NIR approval actions are UI-only"
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/index.tsx` — DetailModal onApprove/onReject handlers
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/hooks/use-nir-workflow.ts` — Canonical transition field mapping

## Code Change

File: `src/pages/it/forms/nir/index.tsx`

### Added imports
- `MainDBITService` from `@/generated/services/main-dbit-service`
- `useUser` from `@/hooks/use-user`
- `toast` from `sonner`

### Added `useUser()` hook call

### Replaced console.log handlers with persisted service calls

**onApprove** now writes:
- `currentStatus: 'CurrentstatusKey38'` (Pending IT PIC = ISGHODApproved)
- `nIRHODApprovalStatus: 'Approved'`
- `nIRHODApprovedBy: user?.userPrincipalName`
- `nIRHODApprovedDate: new Date().toISOString()`
- `workflowstage: 3`
- `remarks.nirCA: 'ISGHODApproved'`

**onReject** now writes:
- `currentStatus: 'CurrentstatusKey2'` (Closed = ISGHODRejected)
- `nIRHODApprovalStatus: 'Rejected'`
- `nIRHODApprovedBy: user?.userPrincipalName`
- `nIRHODApprovedDate: new Date().toISOString()`
- `workflowstage: 0`
- `remarks.nirCA: 'ISGHODRejected'`
- `remarks.nirComment: comments`

### Updated `canApprove` condition
Changed from checking display label to checking the actual SharePoint `currentStatus` value (`'CurrentstatusKey27'` = Pending HOD).

## Rationale

Field mappings follow the canonical implementation in `use-nir-workflow.ts` (`caToStatusKey` and the transition function) so that list-page approval behavior matches detail-page behavior.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-018` to independently verify persisted approval actions.
