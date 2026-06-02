# TASK-PROVISION-CIR-SCHEMA Completion Report

Date: 2026-06-02

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-PROVISION-CIR-SCHEMA |
| Type | Schema Generation / Provisioning |
| Priority | P0 |
| Department | HR |
| Form | CIR |

## Why Allowed

- `TASK-HUMAN-HR-CAPACITY-01` is complete and selected the extension-list path.
- `TASK-HUMAN-CIR-ARCH-DECISION` is complete and approved DEC-2026-008.
- The provisioning script exists at `ioicodeapp/scripts/Add-CIR-Cafeteria-Lists.ps1`.
- This task provisions/export schema evidence only; it does not start a new HR build and does not mark CIR schema sync or re-audit complete.

## Work Performed

- Ran `ioicodeapp/scripts/Add-CIR-Cafeteria-Lists.ps1` against `https://ioioi.sharepoint.com/sites/ioi-portal-hr` using PowerShell 7.
- Confirmed `MainDB_HR_Ext_Cafeteria` and `MainDB_HR_Ext_Records` exist.
- Confirmed existing parent-link fields and most lowercase `cir*` fields already existed.
- Added/attempted the missing CIR team-members field.
- Exported the live `MainDB_HR_Ext_Cafeteria` schema to `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cafeteria.Schema.json`.

## Evidence

Provisioning output:

- `MainDB_HR_Ext_Cafeteria`: exists.
- `ParentRecord`: exists.
- `ParentFormCode`: exists.
- `cirSite`, `cirInspector`, `cirInsDate`, `cirInsTime`, `cirSubmittedBy`, `cirSubmittedDate`, `cirReviewedBy`, `cirReviewedDate`, `cirRemarks`, `cirCurrentAction`, `cirACMComm`, `cirECMComm`, and `cirINO`: exist.
- `cirTeamMembers` exact internal-name creation was not accepted by SharePoint; SharePoint generated suffixed live fields including `cirTeamMembers2` and `cirTeamMembers3`.
- `MainDB_HR_Ext_Records`: exists with `ParentRecord`, `cIRRecSubType`, `cIRRecTitle`, and `cIRRecNotes`.

Export output:

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cafeteria.Schema.json`
- Exported field count after final attempt: 116.

Live field metadata observed:

| Title | InternalName | Type |
|---|---|---|
| CIR Team Members | `cIRTeamMembers` | Single line of text |
| CIR Team Members | `cirTeamMembers0` | Multiple lines of text |
| CIR Team Members | `cirTeamMembers1` | Multiple lines of text |
| CIR Team Members | `cirTeamMembers2` | Multiple lines of text |
| CIR Team Members Exact | `cirTeamMembers3` | Multiple lines of text |

## Result

Completed by user acceptance decision on 2026-06-02.

The live extension-list schema is accepted as the provisioning checkpoint evidence even though SharePoint did not permit an exact `cirTeamMembers` internal name and generated suffixed `cirTeamMembers*` fields instead.

Downstream handling:

- `TASK-SYNC-SCHEMA-CIR` must treat the exported schema as authoritative.
- `TASK-SYNC-SCHEMA-CIR` must explicitly reconcile the CIR team-members mapping from the accepted live schema before `TASK-FIX-CIR-EXT-READWRITE` starts.
- CIR app read/write work must not guess the team-members field; it must use the field selected and documented by schema sync.

## Queue Updates

- `TASK-PROVISION-CIR-SCHEMA`: `Ready` -> `Complete`
- `TASK-SYNC-SCHEMA-CIR`: `Blocked` -> `Ready`
- `TASK-FIX-CIR-EXT-READWRITE`: remains `Blocked` until schema sync selects/records the generated model mapping.
- `TASK-RE-AUDIT-CIR`: remains `Blocked` until schema sync and app read/write alignment complete.

## Next Recommended Task

Run `TASK-SYNC-SCHEMA-CIR` to validate the exported extension-list schema, document the accepted CIR team-members field mapping, and generate/update CIR extension model evidence.
