# HR MainDB Column Capacity Review

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-HR-MAINDB-COLUMN-CAPACITY-REVIEW |
| Type | Schema Validation / Capacity Review |
| Priority | P0 |
| Department | HR |
| Form | CIR / MainDB_HR |

## Why Allowed

- `CIR-SCHEMA-01` was answered with the planned `cir*` field path.
- `TASK-PROVISION-CIR-SCHEMA` attempted live provisioning and failed because SharePoint rejected adding another column to `MainDB_HR`.
- This review does not delete columns, change app source, or start a build.

## Evidence

- Live provisioning command reached the HR SharePoint site and failed on the first `cir*` field with:

```text
The column cannot be added because the total size of the columns in this list exceeds the limit. Please delete some other columns first.
```

- Captured schema evidence remains `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr.Schema.json`.
- Existing captured schema still exposes legacy/non-prefixed CIR fields such as `INO`, `EntitySite`, `InspectedBy`, `InspectionDate`, `InspectionTime`, `InspectionRemarks`, and `CurrentAction`.
- Planned schema evidence remains `source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md`, which uses lowercase `cir*` fields for CIR.

## Findings

1. The `cir*` decision is no longer the only blocker.
2. The live `MainDB_HR` list is at or past SharePoint's column-size capacity.
3. Adding more parent-list columns is unsafe until a capacity strategy is selected.
4. Schema sync cannot pass by editing local JSON/model files because the live list rejected the columns.

## Options

| Option | Description | Impact | Recommendation |
|---|---|---|---|
| A | Remove/archive unused `MainDB_HR` columns, then retry `cir*` provisioning | Keeps parent-only CIR design, but requires careful field usage audit and data backup before deletion | Recommended if parent-only HR design is mandatory |
| B | Move CIR form-specific `cir*` fields to a dedicated extension list, leaving only common fields on `MainDB_HR` | Avoids parent-list capacity pressure, but requires app changes and updated schema/design docs | Recommended if minimizing future list bloat is more important than parent-only design |
| C | Revise CIR app to use captured legacy/non-prefixed fields | Fastest path with current live schema, but conflicts with the selected `cir*` decision and planned HR schema | Not recommended unless timeline overrides schema consistency |

## Result

Completed. Capacity review found that CIR provisioning is blocked by SharePoint list capacity, not by missing local instructions.

## Human Decision

- **Date**: 2026-06-01
- **Decision**: Option B selected.
- **Path**: Move CIR form-specific lowercase `cir*` fields to the CIR extension-list path (`MainDB_HR_Ext_Cafeteria`) instead of adding them to `MainDB_HR`.
- **Implication**: `MainDB_HR` remains the parent/common metadata list. CIR schema provisioning, generated service/model work, and app read/write logic must target the extension list for CIR-specific fields.

## Queue Updates

- `TASK-HR-MAINDB-COLUMN-CAPACITY-REVIEW`: Ready -> Complete.
- Created `TASK-HUMAN-HR-CAPACITY-01`.
- `TASK-HUMAN-HR-CAPACITY-01`: Ready -> Complete.
- `TASK-PROVISION-CIR-SCHEMA`: unblocked onto the Option B extension-list provisioning path.
- `TASK-SYNC-SCHEMA-CIR`: remains blocked.
- `TASK-RE-AUDIT-CIR`: remains blocked.

## Next Recommended Task

`TASK-PROVISION-CIR-SCHEMA`: provision/export lowercase `cir*` fields on `MainDB_HR_Ext_Cafeteria`, then regenerate schema/model evidence for CIR extension-list access.
