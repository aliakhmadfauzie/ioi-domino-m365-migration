# SAPAMR Schema Blocker Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-009 |
| Fix ID | FIX-009 |
| Department | IT |
| Form | SAPAMR |
| Priority | P0 |
| Type | Fix / Schema Blocker |

## Why Allowed

- `TASK-RE-AUDIT-005` passed.
- `TASK-FIX-009` was the next selectable P0 task in `automation/MASTER_TASK_QUEUE.md`.
- The task is a Fix task, so app/source mapping inspection is allowed.

## Finding

`TASK-FIX-009` cannot be safely implemented yet because the target SharePoint fields are not confirmed in captured schema evidence.

The SAPAMR new form writes these model properties:

- `sAPAMRTBVEmail`
- `sAPAMRTBAEmail`
- `sAPAMRTBV1Email`
- `sAPAMRTBV2Email`
- `sAPAMRTBV3Email`
- `sAPAMRTBV4Email`
- `sAPAMRTBV5Email`

The generated model declares those fields, but `MainDBITService` does not denormalize them into SharePoint payload fields.

## Evidence Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapamr/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-service.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it.Schema.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json`
- `docs/sharepoint-schemas/schema-reference.md`
- `m365-design/sharepoint-list-design.md`

## Schema Result

- Captured `maindb_it.Schema.json` search found no `SAPAMR_*`, `TBV`, or `TBA` routing columns.
- Captured `maindb_it_ext_sap.Schema.json` search found no `SAPAMR_*`, `TBV`, or `TBA` routing columns.
- Design docs reference `SAPAMR_TBVEmail` and `SAPAMR_TBAEmail`, but those names are not confirmed in captured live schema evidence.

## Result

Blocked. No app code was changed because mapping `sAPAMR*` fields to unconfirmed internal names would violate the schema blocking rule: do not use guessed SharePoint internal names.

## Required Decision / Action

Confirm one of these paths before `TASK-FIX-009` can resume:

1. Provision/export SAPAMR routing columns on `MainDB_IT`, then map `sAPAMR*` fields in `MainDBITService`.
2. Provision/export SAPAMR routing columns on `MainDB_IT_Ext_SAP`, then update SAPAMR submit/read paths to create/read the extension child record.
3. Explicitly keep routing fields only in `remarks` JSON and close `FIX-009` as not applicable, with workflow/reporting risk accepted.
