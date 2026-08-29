# CIR Schema Human Confirmation Update

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-HUMAN-CIR-SCHEMA |
| Type | Human Confirmation Question Update |
| Priority | P0 |
| Department | HR |
| Form | CIR |

## Why Allowed

- `TASK-SYNC-SCHEMA-CIR` is blocked by a schema confirmation issue documented in `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`.
- `TASK-HUMAN-CIR-SCHEMA` is the highest-priority ready task that can route the required decision without modifying app source code.
- Required evidence files exist:
  - `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`
  - `analysis/source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md`
  - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr.Schema.json`
  - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbhr-model.ts`
  - `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md`
- Blocking rules permit this task because it does not start a build, does not promote extraction, and does not guess SharePoint internal names.

## Work Performed

- Added a P0 CIR schema confirmation question to `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md`.
- Updated the HR human-confirmation summary to show the new P0 schema blocker.
- Updated the master task queue to mark the question update complete and keep CIR schema sync/re-audit blocked until a human/schema decision is made.
- Updated the HR progress register and rollout register with the routed decision state.
- Did not modify app source code.

## Routed Question

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CIR-SCHEMA-01 | P0 | SharePoint schema | Should `MainDB_HR` be provisioned/regenerated with the planned `cir*` internal names from `HR_SHAREPOINT_SCHEMA_EXPORT.md`, or should CIR implementation be revised to the captured legacy/non-prefixed fields? | Open - blocks CIR schema sync and re-audit |

Recommended answer: provision/regenerate `MainDB_HR` so the captured Power schema includes the planned `cir*` internal names. This keeps the CIR app aligned with the parent-only HR schema design and the recent CIR detail/index fixes.

## Evidence

- `CIR_SCHEMA_SYNC_VALIDATION_REPORT.md` found that the app uses planned `cir*` fields, while the captured Power schema/model still expose legacy/non-prefixed fields such as `INO`, `EntitySite`, `InspectedBy`, `InspectionDate`, `InspectionTime`, `InspectionRemarks`, and `CurrentAction`.
- The generated HR service does not translate field names, so unconfirmed internal names remain a data-save risk.

## Result

Completed. The required P0 human/schema confirmation question is now routed.

## Decision Received

- **Date**: 2026-06-01
- **Decision**: Use/provision the planned lowercase `cir*` internal names.
- **Follow-up**: `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_PROVISIONING_PREP_REPORT.md` created the provisioning handoff and `apps/code-first/ioicodeapp/scripts/Add-CIR-MainDBHR-Columns.ps1` was added.
- **Remaining blocker**: Live SharePoint provisioning/export and generated HR model refresh are still required before CIR schema sync can pass.

## Queue Updates

- `TASK-HUMAN-CIR-SCHEMA`: `Ready` -> `Complete`
- `TASK-SYNC-SCHEMA-CIR`: remains `Blocked`
- `TASK-RE-AUDIT-CIR`: remains `Blocked`
- HR build tasks remain blocked.

## Next Recommended Task

Human/schema decision for `CIR-SCHEMA-01` is required before CIR schema sync or CIR re-audit can proceed.
