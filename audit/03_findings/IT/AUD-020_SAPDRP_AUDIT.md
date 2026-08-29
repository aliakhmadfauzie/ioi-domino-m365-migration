# AUD-020 SAPDRP Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-020 |
| Form Code | SAPDRP |
| Form Name | SAP DRP Procedures |
| Department | IT |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Risk | High |
| Approval Classification | Unknown |

## 2. Source Evidence

- Source: Domino form inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `SAPDR_all_dxl.xml` row
- What was found: SAP DRP is listed with title `SAP Disaster Recovery (DRP)` and views including `Pending Endorsement`, `Pending Approval`, `Completed`, and `Rejected`; `HasWorkflow=True`.
- Why it matters: The source indicates workflow/status behavior, but the exact approval requirement needs confirmation.

- Source: Workflow approval rule documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SAPDRP row in approval classification table
- What was found: SAPDRP approval classification is `Unknown`; documentation states insufficient code evidence and business confirmation needed.
- Why it matters: Approval must not be assumed even though workflow-like views exist.

- Source: Original PDF form evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/SAPDRP.pdf`
- Code/formula/section: PDF filename and IT source folder
- What was found: A source PDF exists for SAPDRP.
- Why it matters: The PDF is valid source evidence for field comparison.

## 3. App Files Reviewed

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/index.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPDRP.json`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`

## 4. UI/Form Fields

- Source: App form configuration
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPDRP configuration lines 3188-3270
- What was found: The app defines procedure entry, initiator, and endorser sections with Draft/Verify/Endorse stages.
- Why it matters: The app has staged UI intent, but workflow transitions must be proven.

## 5. SharePoint Field Mapping

- Source: JSON form schema
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPDRP.json`
- Code/formula/section: Field metadata extraction
- What was found: SAPDRP schema includes fields such as `HDR_Title`, `HDR_Category`, `HDR_EffectDate`, `HDR_Revision`, `HDR_Dept`, `HDR_Team`, `HDR_AppBy`, `BODY_Body`, and status fields, but no populated `spTable` or `spColumn` values were found in extracted schema metadata.
- Why it matters: Local schema metadata does not prove structured SharePoint mapping for DRP fields.

## 6. Read Logic

- Source: SAPDRP database page
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/index.tsx`
- Code/formula/section: `useMainDBITList` filter lines 105-106 and remarks parsing lines 113-114
- What was found: SAPDRP reads `MainDB_IT` records filtered by `formcode eq 'SAPDRP'` and parses details from `main.remarks`.
- Why it matters: Read logic exists, but it depends on JSON remarks rather than proven typed SharePoint columns.

## 7. Write Logic

- Source: SAPDRP new form page
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/new.tsx`
- Code/formula/section: submit handler lines 72-79
- What was found: New SAPDRP submissions write `formcode: 'SAPDRP'`, `currentStatus: 'CurrentstatusKey1'`, `workflowstage: 1`, and store form details in `remarks` JSON.
- Why it matters: The status key and remarks-only storage may not match the workflow source.

- Source: Generated MainDB_IT model
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- Code/formula/section: `MainDBITCurrentstatusKeyToLabel` line 334
- What was found: `CurrentstatusKey1` maps to `Approved`.
- Why it matters: New DRP submissions appear to be created with an approved status rather than a draft, pending, verify, or endorsement status.

## 8. Validation Rules

- Source: SAPDRP new form page
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/new.tsx`
- Code/formula/section: validation lines 57-68
- What was found: The page requires procedure title, category, effective date, and procedure content before submit.
- Why it matters: Basic validation exists, but source-required workflow validation is not proven.

## 9. Section Visibility Rules

- Source: App form configuration
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPDRP sections lines 3188-3270
- What was found: Initiator and endorser sections are associated with staged behavior.
- Why it matters: Stage visibility needs matching status transitions and role behavior.

## 10. Approval Workflow

- Source: SAPDRP database page
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/index.tsx`
- Code/formula/section: reviewed list/detail implementation
- What was found: Records are listed and shown from `MainDB_IT`, but no approval, verify, endorse, or reject mutation was proven in the reviewed page.
- Why it matters: Source indicates workflow views, but implemented workflow logic is missing or not evidenced.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: SAPDRP new and database pages
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/new.tsx`; `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapdrp/index.tsx`
- Code/formula/section: submit lines 72-87; list read lines 105-114
- What was found: Submit and view/list behavior exist through `MainDB_IT`; draft, edit, endorsement, and approval transitions were not proven.
- Why it matters: SAPDRP cannot be marked passed with incomplete workflow evidence.

## 12. Issues Found

| ID | Risk | Issue | Evidence |
|---|---|---|---|
| AUD-B001-SAPDRP-001 | High | New SAPDRP submissions use `CurrentstatusKey1`, which maps to `Approved`. | `sapdrp/new.tsx` lines 72-79; `main-dbit-model.ts` line 334 |
| AUD-B001-SAPDRP-002 | High | SAPDRP workflow and structured field persistence are not implemented with confirmed SharePoint columns in the reviewed code. | `sapdrp/index.tsx` lines 105-114; `SAPDRP.json` field metadata |

## 13. Risk Assessment

Risk: High

The app can submit and read SAPDRP records, but status initialization conflicts with the generated model and the approval requirement remains Unknown.

## 14. Final Decision

Status: Completed - Issues Found

SAPDRP is not ready for build. Approval classification remains Unknown pending business/source confirmation.

