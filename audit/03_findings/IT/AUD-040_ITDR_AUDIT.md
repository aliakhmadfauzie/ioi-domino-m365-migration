# AUD-040 ITDR Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-040 |
| Form Code | ITDR |
| Form Name | IT Daily Report |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ITDR row in workflow classification table
- What was found: ITDR is classified as No Approval Required and described as report submission.
- Why it matters: The form should use non-approval submission behavior.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `ITDR_all_dxl.xml`, `Plan`
- What was found: ITDR source has title `IT Report - 2026`, 3 fields, and `HasWorkflow=False`.
- Why it matters: Domino evidence supports non-approval classification.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/ITDR.pdf row
- What was found: ITDR has approximately 3 fields and no workflow marker.
- Why it matters: Source evidence supports a simple report form.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Submit payloads
- What was found: The ITDR route creates MainDB_IT with `formcode: 'ITDAILYRPT'`, `currentStatus: 'CurrentstatusKey1'`, and creates ExtSupport with `parentFormCode: 'ITDAILYRPT'`.
- Why it matters: Runtime storage uses ITDAILYRPT, not ITDR, creating register/form-code ambiguity.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/index.tsx`
- Code/formula/section: List read logic
- What was found: The ITDR list reads MainDB_IT with `formcode eq 'ITDAILYRPT'` and parses remarks.
- Why it matters: The route is named ITDR, but the stored and queried form code is ITDAILYRPT.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: Plan IT Report mapping
- What was found: ITDR/Plan maps to `ITDAILYRPT.json` / `itdr`.
- Why it matters: The source mapping confirms overlap between ITDR and ITDAILYRPT names.

## 5. SharePoint Field Mapping

- Source: Generated support extension model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-support-model.ts`
- Code/formula/section: ITDR/ITDR2 fields and `parentFormCode`
- What was found: Support extension fields exist for ITDR/ITDR2-style records.
- Why it matters: Extension child records should be read consistently after submission.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/index.tsx`
- Code/formula/section: MainDB_IT filter
- What was found: ITDR list reads parent records by `ITDAILYRPT`.
- Why it matters: Register and route naming could cause audit/reporting mismatch.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Parent and child create logic
- What was found: The form creates parent and ExtSupport child records with ITDAILYRPT as the form code.
- Why it matters: Write logic exists but does not match the audited ITDR form code.

## 8. Validation Rules

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Required validation
- What was found: Required validation exists before record creation.
- Why it matters: Validation must be reconciled against the ITDR/ITDAILYRPT source mapping.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: ITDR pending audit row
- What was found: ITDR section visibility remains pending audit.
- Why it matters: No conditional behavior can be accepted without evidence.

## 10. Approval Workflow

- Source: Workflow documentation and Domino inventory
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `analysis/domino-field-inventory.csv`
- Code/formula/section: ITDR classification and `HasWorkflow=False`
- What was found: Approval is Not Required.
- Why it matters: ITDR should not use approval-specific status semantics.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to Approved.
- Why it matters: Non-approval report submissions should use a source-backed submitted/current status.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-ITDR-001 | High | Ready for Fix | ITDR route stores and reads records using FormCode ITDAILYRPT, creating an audit/register mismatch. |
| AUD-B002-ITDR-002 | High | Ready for Fix | ITDR uses Approved status and creates ExtSupport child data, but list evidence only proves parent/remarks reads. |

## 13. Risk Assessment

Risk is High because form-code ambiguity and parent-only reads can break reporting, navigation, and data review.

## 14. Final Decision

Completed - Issues Found. The implementation exists, but naming, status, and extension read parity need remediation.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

