# AUD-018 SAPCA Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-018 |
| Form Code | SAPCA |
| Form Name | SAP Configuration Access Form |
| Department | IT |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Risk | High |
| Approval Classification | Required |

## 2. Source Evidence

- Source: Domino form inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `SAPCA_all_dxl.xml` row
- What was found: SAPCA is listed as `ConfigForm`, title `SAP Config Access`, with workflow views including `PdgReqClosure`, `PdgAccess`, `PdgClosure`, `PdgCompletion`, `Rejected`, and `Completed`; `HasWorkflow=True`.
- Why it matters: Source evidence supports an approval/workflow requirement and prevents treating SAPCA as a simple submit-only form.

- Source: Workflow approval rule documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SAPCA row in approval classification table
- What was found: SAPCA is classified as `Approval Required` with an access approval workflow and code review required.
- Why it matters: Approval requirement is evidenced by documentation and source inventory.

- Source: Original PDF form evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/SAPCA.pdf`
- Code/formula/section: PDF filename and IT source folder
- What was found: A source PDF exists for SAPCA.
- Why it matters: The PDF is valid UI/source evidence for field and behavior comparison when detailed field-level PDF extraction is performed.

## 3. App Files Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPCA.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-sap-model.ts`

## 4. UI/Form Fields

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPCA configuration lines 2969-3065
- What was found: SAPCA includes stages for request, IT approval, BASIS reply, requestor closure, BASIS confirmation, and completed. Fields include module, client, reference document, purpose, changes done, IT approver, transporter, IT PIC, BASIS status, closure status, completion status, remarks, and withdrawal fields.
- Why it matters: The app models multi-section workflow data, but each section must be checked against persistence and readback.

## 5. SharePoint Field Mapping

- Source: App submit logic
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/new.tsx`
- Code/formula/section: create payload and `createMainDBIT.mutateAsync` lines 161-203
- What was found: New submissions create a `MainDB_IT` record with `formcode: 'SAPCA'`, `currentStatus: 'Submitted'`, requestor metadata, `workflowstage: 2`, and SAPCA details stored inside `remarks` text.
- Why it matters: Structured SAPCA fields are not proven to be written to SharePoint columns in this submit path.

- Source: JSON form schema
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/SAPCA.json`
- Code/formula/section: Field metadata extraction
- What was found: SAPCA schema contains SAPCA fields such as `A_FormNum`, `A_Module`, `A_Client`, `A_RefDoc`, `A_Purpose`, `A_ChangesDone`, `B_AppStatus`, `C_AppStatus`, and `WD_Status`, but no populated `spTable` or `spColumn` values were found in extracted schema metadata.
- Why it matters: SharePoint column mapping is incomplete from local schema evidence.

## 6. Read Logic

- Source: SAPCA database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/index.tsx`
- Code/formula/section: `SAMPLE_DATA` lines 28-40 and `DatabaseTable data={SAMPLE_DATA}` lines 250-251
- What was found: The SAPCA database/list view renders hard-coded sample data instead of SharePoint records.
- Why it matters: Submitted SAPCA records are not proven visible in the app database view.

## 7. Write Logic

- Source: SAPCA new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/new.tsx`
- Code/formula/section: submit handler lines 161-203
- What was found: The submit handler writes one `MainDB_IT` record and places most form details in `remarks`; no reviewed SAPCA submit path writes a SAP extension row.
- Why it matters: Required workflow and field-level data may not be queryable or auditable as SharePoint fields.

## 8. Validation Rules

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPCA field definitions lines 2969-3065
- What was found: SAPCA required field behavior is partially represented through configured sections and fields, but field-level validation was not proven for every source field in the reviewed submit path.
- Why it matters: Required source fields may be submit-able without full validation unless the page validates them elsewhere.

## 9. Section Visibility Rules

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: SAPCA stages and sections lines 2969-3065
- What was found: BASIS, close request, and completion sections are gated to later workflow stages.
- Why it matters: The UI expects stage-specific workflow behavior, but stage transitions must be persisted.

## 10. Approval Workflow

- Source: SAPCA database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/index.tsx`
- Code/formula/section: `canApprove`, `onApprove`, and `onReject` lines 268-275
- What was found: Approval and rejection actions call `console.log` and close the modal; no SharePoint update or workflow transition is persisted in the reviewed code.
- Why it matters: Approval is required by evidence, but the app action path is not implemented as a data change.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: SAPCA new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/new.tsx`
- Code/formula/section: workflow comment lines 1-7 and submit handler lines 161-203
- What was found: The page documents workflow states and submits a new record; draft/save/edit/view behavior was not proven in the reviewed code path.
- Why it matters: SAPCA workflow cannot be marked ready without confirmed transitions and view/edit behavior.

## 12. Issues Found

| ID | Risk | Issue | Evidence |
|---|---|---|---|
| AUD-B001-SAPCA-001 | High | SAPCA database view uses hard-coded `SAMPLE_DATA`, so submitted SharePoint records are not proven visible. | `sapca/index.tsx` lines 28-40 and 250-251 |
| AUD-B001-SAPCA-002 | High | Required SAPCA approval/workflow and structured field persistence are incomplete in reviewed code. | `sapca/index.tsx` lines 268-275; `sapca/new.tsx` lines 161-203 |

## 13. Risk Assessment

Risk: High

SAPCA has evidenced approval workflow requirements. The current app has submit logic, but list readback is sample data and approval actions are not persisted.

## 14. Final Decision

Status: Completed - Issues Found

SAPCA is not ready for build. Approval is Required. SharePoint field mapping and workflow persistence require fix-mode work.

