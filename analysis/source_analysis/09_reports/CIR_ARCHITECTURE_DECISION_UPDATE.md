# CIR Architecture Decision Update

Date: 2026-06-02
Task: TASK-HUMAN-CIR-ARCH-DECISION
Decision ID: DEC-2026-008
Department: HR
Form: CIR - Cafeteria Inspection

## Decision

CIR will use a parent-plus-extension SharePoint pattern:

- `MainDB_HR` remains the parent record list for shared metadata, `FormCode`, title, requester/submission metadata, and cross-form routing/index needs.
- `MainDB_HR_Ext_Cafeteria` becomes the authoritative storage location for CIR-specific fields.
- All CIR-specific fields must use the planned lowercase `cir*` internal names on `MainDB_HR_Ext_Cafeteria`.
- CIR remains a non-approval corrective-action review form. The review action is optional and records review metadata; it must not use the generic approval panel/workflow path.

## Required Extension Fields

Provision the following CIR-specific internal names on `MainDB_HR_Ext_Cafeteria`:

| Field |
|---|
| `cirSite` |
| `cirTeamMembers` |
| `cirInspector` |
| `cirInsDate` |
| `cirInsTime` |
| `cirSubmittedBy` |
| `cirSubmittedDate` |
| `cirReviewedBy` |
| `cirReviewedDate` |
| `cirRemarks` |
| `cirCurrentAction` |
| `cirACMComm` |
| `cirECMComm` |
| `cirINO` |

The extension row must also retain the existing parent-link convention used by generated services, including the parent `MainDB_HR` reference and `ParentFormCode = CIR` where supported by the list design.

## Implementation Consequences

- CIR submit must create/update the parent `MainDB_HR` record first, then create/update the linked `MainDB_HR_Ext_Cafeteria` row with the CIR-specific `cir*` fields.
- CIR list/detail screens must read parent metadata from `MainDB_HR` and CIR-specific values from the linked cafeteria extension row.
- CIR code must not fall back to legacy field names such as `EntitySite`, `InspectedBy`, `InspectionDate`, `InspectionTime`, `InspectionRemarks`, `CurrentAction`, or `INO` as the authoritative write path after extension schema generation.
- Initial CIR state is `cirCurrentAction = Submitted`.
- Corrective-action review sets `cirReviewedBy`, `cirReviewedDate`, and `cirCurrentAction = Accepted` when review is completed.
- Formal approval artifacts, including `ApprovalActionPanel`, must remain absent for CIR.

## Queue Impact

- Reopen `TASK-PROVISION-CIR-SCHEMA` as the next ready CIR task. It was previously skipped before export/schema sync/model generation, but this architecture decision resolves the outstanding direction.
- Keep `TASK-SYNC-SCHEMA-CIR` blocked until live provisioning/export confirms the extension-list fields in captured schema/model evidence.
- Keep `TASK-FIX-CIR-EXT-READWRITE` blocked until `TASK-PROVISION-CIR-SCHEMA` and `TASK-SYNC-SCHEMA-CIR` complete.
- Keep `TASK-RE-AUDIT-CIR` blocked until extension schema sync and app read/write alignment are complete.
- Keep DRD and all new HR builds blocked until CIR re-audit passes.

## Evidence Used

- `analysis/source_analysis/02_extracted_requirements/HR/SRC-HR-003_CIR_REQUIREMENTS.md`
- `analysis/source_analysis/06_sharepoint_design/HR_MAINDB_COLUMN_CAPACITY_REVIEW.md`
- `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_PROVISIONING_PREP_REPORT.md`
- `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`
- `analysis/source_analysis/09_reports/HR_CAPACITY_HUMAN_CONFIRMATION_UPDATE.md`
- `analysis/source_analysis/09_reports/CIR_SCHEMA_HUMAN_CONFIRMATION_UPDATE.md`
- `audit/build_reviews/HR_CIR_RE_AUDIT_2.md`

## Next Recommended Task

Run `TASK-PROVISION-CIR-SCHEMA`: provision/export lowercase `cir*` fields on `MainDB_HR_Ext_Cafeteria`, regenerate captured schema/model evidence, then continue to CIR schema sync.
