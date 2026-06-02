# TASK-FIX-002 - SAPSOF2 Initial Status Fix Report

> Date: 2026-06-01
> Task: `TASK-FIX-002`
> Fix ID: `FIX-002`
> Department: IT
> Form: SAPSOF2
> Stage: Fix
> Priority: P1

## Task Selected

`TASK-FIX-002` was selected from `automation/MASTER_TASK_QUEUE.md` because all selectable P0 work is either verified or blocked, and SAPSOF2 is the earliest Ready P1 fix in queue order.

## Why Allowed

| Check | Result |
|---|---|
| Queue status | `TASK-FIX-002` was `Ready` |
| DependsOn | None |
| Blocking rules | No selectable P0 task was available; HR CIR/DRD remains blocked by schema/provisioning evidence |
| Source evidence | `audit/03_findings/IT/AUD-046_SAPSOF2_AUDIT.md` and `audit/05_fix_backlog/FIX_BACKLOG.md` identify `CurrentstatusKey1` as the defect |
| App source rule | This is a Fix task, so editing active app source is allowed |

## Work Performed

Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/new.tsx`:

- Changed SAPSOF2 initial submit `currentStatus` from `CurrentstatusKey1` to `CurrentstatusKey47`.
- Preserved `workflowstage: 2`, which is the Key User sign-off stage.
- Updated the persisted workflow remarks from `Status: Submitted` to `Status: Pending KU Sign-Off`.

## Evidence

| Evidence | Result |
|---|---|
| Generated status model | `CurrentstatusKey1` maps to `Approved`; `CurrentstatusKey47` maps to `Pending KU Sign-Off` in `src/generated/models/main-dbit-model.ts` |
| Submit payload | `new.tsx` now writes `currentStatus: 'CurrentstatusKey47'` for new SAPSOF2 records |
| Remarks snapshot | `new.tsx` now persists `Status: Pending KU Sign-Off` in the workflow remarks |
| Approval child rows | Existing submit flow still creates `ApprovalRecords` rows for populated KU/BPO slots with `decision: Pending` |
| TypeScript | `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform` |

## Result

Fixed Pending Re-Audit.

SAPSOF2 initial submit no longer writes the global Approved status key. It now routes the parent record into Pending KU Sign-Off while keeping approval/test evidence child persistence intact.

## Queue Updates

| Task | Previous Status | New Status |
|---|---|---|
| `TASK-FIX-002` | Ready | Fixed Pending Re-Audit |
| `TASK-RE-AUDIT-002` | New | Ready |

## Residual Scope

This fix only corrects the initial submit status. Full workflow transition behavior after Key User and BPO actions still requires separate implementation/audit if not already covered by future workflow tasks.

## Next Recommended Task

`TASK-RE-AUDIT-002` - re-audit SAPSOF2 initial status routing before moving to `TASK-FIX-007`.
