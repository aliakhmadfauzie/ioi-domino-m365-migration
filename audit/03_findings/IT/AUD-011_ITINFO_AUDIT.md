# AUD-011 ITINFO Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-011 |
| Form Code | ITINFO |
| Form Name | IT Info |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ITINFO row in workflow classification table
- What was found: ITINFO is classified as No Approval Required and described as an information record.
- Why it matters: Approval should not be invented for this form.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `ITI_all_dxl.xml`, `ISGInfo`
- What was found: ITINFO source has title `IT Info`, 3 fields, and `HasWorkflow=True`.
- Why it matters: This conflicts with the workflow rules document and must be recorded.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/ITI.pdf row
- What was found: ITI has approximately 3 fields and a workflow marker check.
- Why it matters: Workflow classification has conflicting evidence and should remain traceable.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itinfo/new.tsx`
- Code/formula/section: Parent and extension create logic
- What was found: The form creates MainDB_IT with `formcode: 'ITINFO'`, `currentStatus: 'CurrentstatusKey1'`, and then creates ExtDocs with `parentFormCode: 'ITINFO'`.
- Why it matters: Structured extension data is written, but the status maps to Approved.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itinfo/index.tsx`
- Code/formula/section: List read logic
- What was found: The list reads MainDB_IT records where `formcode eq 'ITINFO'` and parses remarks.
- Why it matters: ExtDocs data written by the form is not proven in the list read path.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: ISGInfo mapping row
- What was found: ISGInfo maps to `ITINFO.json` / `itinfo`.
- Why it matters: The source-to-schema relationship is identifiable.

## 5. SharePoint Field Mapping

- Source: Generated docs extension model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-docs-model.ts`
- Code/formula/section: ITI fields and `parentFormCode`
- What was found: The docs extension model contains ITI/ITINFO fields and parent form relationship.
- Why it matters: Extension data should be read wherever it is written.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itinfo/index.tsx`
- Code/formula/section: MainDB_IT query and remarks mapping
- What was found: ITINFO list reads MainDB_IT parent records and parses remarks.
- Why it matters: Extension fields created on submit may be unavailable to users in list/detail views.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itinfo/new.tsx`
- Code/formula/section: Submit payloads
- What was found: ITINFO writes both MainDB_IT and ExtDocs records.
- Why it matters: Write logic is more complete than read logic, creating a read/write mismatch.

## 8. Validation Rules

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itinfo/new.tsx`
- Code/formula/section: Required validation
- What was found: Required validation exists before submission.
- Why it matters: The validation must be reconciled with source and schema requirements.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: ITINFO pending audit row
- What was found: ITINFO section visibility remains pending audit.
- Why it matters: Conditional section behavior is not fully verified.

## 10. Approval Workflow

- Source: Workflow documentation and Domino inventory
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `analysis/domino-field-inventory.csv`
- Code/formula/section: ITINFO classification and source workflow flag
- What was found: Documentation says No Approval Required, while Domino inventory flags workflow.
- Why it matters: The audit classifies approval as Not Required based on explicit rules documentation, but records the conflict for follow-up.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to Approved.
- Why it matters: A non-approval information record should not carry an approval status unless source rules define that behavior.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-ITINFO-001 | High | Ready for Fix | ITINFO submit uses Approved status although approval is classified as Not Required. |
| AUD-B002-ITINFO-002 | High | Ready for Fix | ITINFO writes ExtDocs data, but list evidence only proves MainDB_IT remarks reads. |

## 13. Risk Assessment

Risk is High because approval/status evidence conflicts and extension data may not be visible after submission.

## 14. Final Decision

Completed - Issues Found. The form is auditable, but status, read/write parity, and workflow evidence conflict need resolution.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

