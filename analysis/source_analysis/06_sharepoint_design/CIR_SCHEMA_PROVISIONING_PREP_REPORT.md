# CIR Schema Provisioning Preparation Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-PROVISION-CIR-SCHEMA |
| Type | Schema Generation / Provisioning Preparation |
| Priority | P0 |
| Department | HR |
| Form | CIR |

## Why Allowed

- `CIR-SCHEMA-01` was answered with the planned `cir*` internal-name path.
- The earlier blocker was not a source-analysis conflict; it was missing live/captured SharePoint evidence for the planned columns.
- This task does not start a new HR build and does not mark schema sync complete without live evidence.

## Work Performed

- Added `apps/code-first/ioicodeapp/scripts/Add-CIR-MainDBHR-Columns.ps1`.
- The script provisions the approved CIR parent-list fields on `MainDB_HR` using planned lowercase `cir*` internal names.
- It is idempotent and supports `-WhatIf`.
- After `HR-CAPACITY-01` was answered, updated `apps/code-first/ioicodeapp/scripts/Add-CIR-Cafeteria-Lists.ps1` so the same lowercase `cir*` fields are provisioned on `MainDB_HR_Ext_Cafeteria` instead of adding new form-specific columns to `MainDB_HR`.

## Evidence

- Planned fields come from `analysis/source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md`.
- The blocker was documented in `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`.
- User decision on 2026-06-01: use the `cir*` fields.
- User decision on `HR-CAPACITY-01` on 2026-06-01: Option B, move CIR `cir*` fields to the extension-list path.

## Provisioning Attempt

- **Date**: 2026-06-01
- **Command attempted**: `apps/code-first/ioicodeapp/scripts/Add-CIR-MainDBHR-Columns.ps1`
- **Connection**: Reached `https://ioioi.sharepoint.com/sites/ioi-portal-hr`
- **Result**: Failed on first new `cir*` column because SharePoint reported the list column-size limit is exceeded.

Error summary:

```text
The column cannot be added because the total size of the columns in this list exceeds the limit. Please delete some other columns first.
```

## Result

Blocked on the original parent-list approach. The live `MainDB_HR` list cannot accept the new `cir*` fields, so the selected provisioning path is now the extension list `MainDB_HR_Ext_Cafeteria`.

Required commands:

```powershell
.\ioicodeapp\scripts\Add-CIR-Cafeteria-Lists.ps1
.\ioicodeapp\scripts\Export-SharePointSchema.ps1 -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-hr" -ListName "MainDB_HR_Ext_Cafeteria"
```

After export, generate/update the CIR extension-list model/service evidence so the generated layer includes the lowercase `cir*` properties.

## Queue Updates

- `CIR-SCHEMA-01`: Open -> Answered (`cir*` fields).
- `TASK-PROVISION-CIR-SCHEMA`: blocked by SharePoint list column-size limit after live attempt.
- `TASK-HUMAN-HR-CAPACITY-01`: answered with Option B.
- `TASK-PROVISION-CIR-SCHEMA`: retargeted to `MainDB_HR_Ext_Cafeteria` extension-list provisioning.
- `TASK-SYNC-SCHEMA-CIR`: remains blocked until live provisioning/export evidence exists.
- `TASK-RE-AUDIT-CIR`: remains blocked until schema sync passes.
- `TASK-FIX-CIR-EXT-READWRITE`: required after extension-list schema/model generation.

## Next Recommended Task

Run `TASK-PROVISION-CIR-SCHEMA` on the extension-list path, then export/generate schema evidence for `MainDB_HR_Ext_Cafeteria`.
