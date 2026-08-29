# FIX-004 EAF Field Map Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-004 |
| Fix ID | FIX-004 |
| Type | Fix |
| Priority | P0 |
| Department | IT |
| Form | EAF |

## Why Allowed

- `TASK-FIX-004` was the highest-priority task with `Status = Ready` in `automation/MASTER_TASK_QUEUE.md`.
- The task is a Fix task, so app source review is allowed by `automation/MIGRATION_PIPELINE_CONTROLLER.md`.
- No dependency task is listed for `TASK-FIX-004`.
- Required evidence files exist:
  - `audit/findings/batch-01/eaf.md`
  - `audit/05_fix_backlog/FIX_BACKLOG.md`
  - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts`
  - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
  - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json`
- Blocking rules permit this task because it resolves a P0 field-mapping/data-save risk and does not start a new build.

## Work Performed

- Reviewed `AUD-B01-EAF-002` in `audit/findings/batch-01/eaf.md`.
- Compared the generated ExtAccess service field map against the captured SharePoint schema.
- Verified that the current service now maps the EAF approval and extension fields to captured internal names.
- Verified that the previously missing EAF extension fields are present in the captured schema.
- No app source patch was required because the current generated service and schema are already reconciled.

## Evidence

The current generated service maps these fields:

| Field | Service Mapping | Captured Schema |
|---|---|---|
| Dept Head status | `EAF_DeptHeadStatus` | Present |
| DD/COO approval status | `EAF_DDAppStatus` | Present |
| IT Manager status | `EAF_ITManagerStatus` | Present |
| IT completed by | `EAF_ITCompletedBy` | Present |
| Dept Head date | `EAF_DeptHeadDate_dt` | Present |
| DD/COO approval date | `EAF_DDAppDate_dt` | Present |
| IT Manager date | `EAF_ITManagerDate_dt` | Present |
| IT completed date | `EAF_ITCompletedDate_dt` | Present |
| Client ID | `EAF_ClientID` | Present |
| User Group | `EAF_UserGroup` | Present |
| Higher Approver Email | `EAF_HigherApprover_Email` | Present |

Additional checks:

- Search for stale internal names found no matches in the service or schema:
  - `EAF_DeptHead_Status`
  - `EAF_DDApp_Status`
  - `EAF_ITManager_Status`
  - `EAF_ITCompleted_By`
- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Result

Completed. `TASK-FIX-004` is marked `Fixed Pending Re-Audit`.

## Queue Updates

- `TASK-FIX-004`: `Ready` -> `Fixed Pending Re-Audit`
- Created `TASK-RE-AUDIT-004` to verify the EAF ExtAccess service field map against the captured SharePoint schema.

## Next Recommended Task

`TASK-RE-AUDIT-004`

