# CIR Schema Sync Validation Report

Date: 2026-06-02

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-SYNC-SCHEMA-CIR |
| Type | Schema Validation |
| Priority | P0 |
| Department | HR |
| Form | CIR |

## Why Allowed

- `TASK-SYNC-SCHEMA-CIR` was the highest-priority ready P0 task in `automation/MASTER_TASK_QUEUE.md`.
- `TASK-PROVISION-CIR-SCHEMA` is complete by user acceptance decision.
- The exported live schema exists at `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cafeteria.Schema.json`.
- DEC-2026-008 approves the parent-plus-extension architecture: `MainDB_HR` for parent metadata and `MainDB_HR_Ext_Cafeteria` for CIR-specific fields.
- This task is schema validation only. Per controller rules, it did not modify app source under `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/`.

## Work Performed

- Re-read CIR source requirements, preliminary HR schema design, CIR provisioning completion evidence, and the exported `MainDB_HR_Ext_Cafeteria` schema.
- Validated that required parent-link and CIR extension fields exist in the exported schema.
- Reviewed generated cafeteria model/service evidence without editing it.
- Selected the accepted live team-members field mapping for downstream app read/write work.

## Evidence

### Exported Schema

Schema file:

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cafeteria.Schema.json`

The exported schema contains 116 properties.

### Required Field Coverage

Required extension fields present in the exported schema:

| Required Field | Export Status |
|---|---|
| `ParentRecord` | Present |
| `ParentFormCode` | Present |
| `cirSite` | Present |
| `cirInspector` | Present |
| `cirInsDate` | Present |
| `cirInsTime` | Present |
| `cirSubmittedBy` | Present |
| `cirSubmittedDate` | Present |
| `cirReviewedBy` | Present |
| `cirReviewedDate` | Present |
| `cirRemarks` | Present |
| `cirCurrentAction` | Present |
| `cirACMComm` | Present |
| `cirECMComm` | Present |
| `cirINO` | Present |

The only accepted naming exception is team members:

| Source Field | Planned Name | Accepted Live Name | Rationale |
|---|---|---|---|
| TeamMembers | `cirTeamMembers` | `cirTeamMembers2` | The provisioning script's normal add attempt created `cirTeamMembers2` with display name `CIR Team Members`. A later XML diagnostic attempt created `cirTeamMembers3` with display name `CIR Team Members Exact`; this should not be used for app mapping. |

Other related live fields observed and retained as non-authoritative compatibility/duplicate fields:

- `cIRTeamMembers`
- `cirTeamMembers0`
- `cirTeamMembers1`
- `cirTeamMembers3`

### Generated Model / Service Status

Existing generated files:

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbhr-ext-cafeteria-model.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbhr-ext-cafeteria-service.ts`

The existing generated model is stale. It exposes legacy `cIR*` fields such as `cIRTeamMembers`, `cIRDueDate`, `cIRInspectorName`, `cIRSentBy`, and `cIRSentDate`, but does not yet expose the accepted CIR fields from the exported schema, including `cirSite`, `cirInspector`, `cirInsDate`, `cirCurrentAction`, and `cirTeamMembers2`.

Because this task is Schema Validation, generated app-source updates are deferred to `TASK-FIX-CIR-EXT-READWRITE`.

## Result

Completed.

The exported `MainDB_HR_Ext_Cafeteria` schema is validated as sufficient for the next CIR app fix checkpoint. The accepted team-members mapping is `cirTeamMembers2`.

## Queue Updates

- `TASK-SYNC-SCHEMA-CIR`: `Ready` -> `Complete`
- `TASK-FIX-CIR-EXT-READWRITE`: `Blocked` -> `Ready`
- `TASK-RE-AUDIT-CIR`: remains `Blocked` until extension-list app read/write alignment is complete.
- HR DRD and later HR builds remain blocked until CIR re-audit passes.

## Next Recommended Task

Run `TASK-FIX-CIR-EXT-READWRITE`.

Required fix scope:

- Update the generated cafeteria model/service/validator evidence to include the accepted exported fields.
- Use `cirTeamMembers2` for TeamMembers.
- Keep CIR parent metadata in `MainDB_HR`.
- Move CIR-specific submit/read/review data through `MainDB_HR_Ext_Cafeteria`.
- Preserve non-approval CIR behavior: `Submitted` -> `Accepted`, no approval panel.
