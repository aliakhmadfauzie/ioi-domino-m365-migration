# AUD-021 SAPSLCF Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-021 |
| Form Code | SAPSLCF |
| Form Name | SAP Storage Location Creation Form |
| Department | IT |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Risk | High |
| Approval Classification | Unknown |

## 2. Source Evidence

- Source: Domino form inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `SAPLoc_all_dxl.xml` row
- What was found: SAP storage location source is listed with title `SAP - Storage Location Creation Form` and views including `Pending Action by ISG Department` and `Rejected By ISG`; `HasWorkflow=False` in the Penang source row.
- Why it matters: Source evidence indicates status routing, but not enough to classify approval as required.

- Source: Workflow approval rule documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SAPSLCF row in approval classification table
- What was found: SAPSLCF approval classification is `Unknown`; documentation notes `txtHDocStatus` and requires business confirmation.
- Why it matters: Approval must stay Unknown until confirmed.

- Source: Original PDF form evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/SAPSLCF.pdf`
- Code/formula/section: PDF filename and IT source folder
- What was found: A source PDF exists for SAPSLCF.
- Why it matters: The PDF is valid UI/source evidence for future field-level comparison.

## 3. App Files Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPSLCF.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`

## 4. UI/Form Fields

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPSLCF configuration lines 3272-3340
- What was found: The app defines Request, HODApprove, and ITProcess stages with requestor and IT support sections.
- Why it matters: The UI models staged behavior that needs backing workflow data.

## 5. SharePoint Field Mapping

- Source: JSON form schema
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPSLCF.json`
- Code/formula/section: Field metadata extraction
- What was found: SAPSLCF schema includes requestor, HOD, plant, storage, material, IT, and production-related fields, but no populated `spTable` or `spColumn` values were found in extracted schema metadata.
- Why it matters: Local schema evidence does not prove structured SharePoint field mapping.

## 6. Read Logic

- Source: SAPSLCF database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/index.tsx`
- Code/formula/section: `useMainDBITList` filter lines 96-97 and remarks parsing lines 104-105
- What was found: SAPSLCF reads `MainDB_IT` records filtered by `formcode eq 'SAPSLCF'` and parses details from `remarks`.
- Why it matters: Read logic is present, but structured field readback is not proven.

## 7. Write Logic

- Source: SAPSLCF new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/new.tsx`
- Code/formula/section: submit handler lines 79-86
- What was found: New SAPSLCF submissions write `formcode: 'SAPSLCF'`, `currentStatus: 'CurrentstatusKey1'`, `workflowstage: 1`, and form details in `remarks` JSON.
- Why it matters: This status key maps to approved in the generated model and may bypass expected request/HOD/IT states.

- Source: Generated MainDB_IT model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- Code/formula/section: `MainDBITCurrentstatusKeyToLabel` line 334
- What was found: `CurrentstatusKey1` maps to `Approved`.
- Why it matters: New SAPSLCF records are not proven to enter the correct initial workflow state.

## 8. Validation Rules

- Source: SAPSLCF new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/new.tsx`
- Code/formula/section: validation lines 63-76
- What was found: The page validates requestor, department, plant, storage location, and description before submit.
- Why it matters: Basic validation exists, but source workflow validation remains unconfirmed.

## 9. Section Visibility Rules

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPSLCF stages and sections lines 3272-3340
- What was found: HOD and IT process concepts are present in the staged configuration.
- Why it matters: Visibility rules need persistence and role handling.

## 10. Approval Workflow

- Source: SAPSLCF database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/index.tsx`
- Code/formula/section: reviewed list/detail implementation
- What was found: No approve, reject, HOD, or IT processing mutation was proven in the reviewed list/detail page.
- Why it matters: Approval requirement is Unknown, and any staged workflow cannot be passed without mutation evidence.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: SAPSLCF pages
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/new.tsx`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapslcf/index.tsx`
- Code/formula/section: submit lines 79-94; read lines 96-105
- What was found: Submit and list/view behavior exist through `MainDB_IT`; draft, edit, and stage transition behavior were not proven.
- Why it matters: Staged forms need complete lifecycle support before build readiness.

## 12. Issues Found

| ID | Risk | Issue | Evidence |
|---|---|---|---|
| AUD-B001-SAPSLCF-001 | High | New SAPSLCF submissions use `CurrentstatusKey1`, which maps to `Approved`. | `sapslcf/new.tsx` lines 79-86; `main-dbit-model.ts` line 334 |
| AUD-B001-SAPSLCF-002 | High | HOD/IT staged workflow and structured SharePoint mapping are not proven in reviewed code. | `it-forms-config.ts` lines 3272-3340; `sapslcf/index.tsx` lines 96-105 |

## 13. Risk Assessment

Risk: High

SAPSLCF has staged UI and source status evidence, but approval requirement remains Unknown and initial status appears incorrect.

## 14. Final Decision

Status: Completed - Issues Found

SAPSLCF is not ready for build. Approval classification remains Unknown and requires business confirmation.

