# AUD-043 NIR Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-043 |
| Form Code | NIR |
| Form Name | Notes ID Request |
| Department | IT |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Risk | High |
| Approval Classification | Required |

## 2. Source Evidence

- Source: Domino form inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `NIR_all_dxl.xml` row
- What was found: NIR is listed as `ID Request`, title `Notes ID Request`, with agents `RemPdgHWG` and `RemPdgHOD` and views including `PendingByHWG`, `PendingByPIC`, `PendingByHOD`, `Draft`, `Rejected`, and `Completed`; `HasWorkflow=True`.
- Why it matters: Source evidence supports required multi-stage approval/workflow behavior.

- Source: Workflow approval rule documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: NIR row in approval classification table
- What was found: NIR is classified as `Approval Required` with multi-stage HOD/IT approval.
- Why it matters: The audit can classify approval as Required with evidence.

- Source: Original PDF form evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/NIR.pdf`
- Code/formula/section: PDF filename and IT source folder
- What was found: A source PDF exists for NIR.
- Why it matters: The PDF is valid source evidence for field comparison.

## 3. App Files Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/NOTESID.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`

## 4. UI/Form Fields

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: NIR configuration lines 317-364
- What was found: NIR has stages for Request, HOD Approval, Notes Admin, and IT Hardware, with stage-gated sections for employee info, HOD approval, Notes admin, and hardware assignment.
- Why it matters: App UI reflects the source workflow concept.

## 5. SharePoint Field Mapping

- Source: Generated models
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
- Code/formula/section: NIR columns lines 95-127 in MainDB_IT model and NIR columns lines 112-169 in Ext_Access model
- What was found: Generated models include NIR fields in both `MainDB_IT` and `MainDB_IT_Ext_Access`.
- Why it matters: Structured SharePoint fields exist in generated code, but create/read/update paths must use them correctly.

## 6. Read Logic

- Source: NIR database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/index.tsx`
- Code/formula/section: Main and extension filters lines 119-128
- What was found: The page reads `MainDB_IT` records filtered by `formcode eq 'NIR'` and extension records filtered by `parentFormCode eq 'NIR'`.
- Why it matters: Read logic is tied to SharePoint data sources and the extension list.

## 7. Write Logic

- Source: NIR new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/new.tsx`
- Code/formula/section: Main create lines 152-160 and extension create lines 177-188
- What was found: NIR creates a MainDB_IT record and an Ext_Access record with `parentFormCode: 'NIR'`, request type, and remarks.
- Why it matters: NIR has a structured extension write path, but workflow status and approval transitions still require validation.

## 8. Validation Rules

- Source: NIR new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/new.tsx`
- Code/formula/section: reviewed submit flow
- What was found: Submit logic exists, but full field-level validation against source PDF/schema was not proven in this batch.
- Why it matters: Required NIR source fields need a separate field-by-field validation pass.

## 9. Section Visibility Rules

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: NIR sections lines 317-364
- What was found: HOD, Notes Admin, and Hardware sections are configured for later workflow stages.
- Why it matters: Stage visibility is represented but depends on persisted workflow state.

## 10. Approval Workflow

- Source: NIR database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/index.tsx`
- Code/formula/section: `canApprove`, `onApprove`, and `onReject` lines 310-318
- What was found: Approval/rejection actions only log to console and close the modal.
- Why it matters: Approval is Required by source evidence, but the reviewed actions do not persist status or workflow stage changes.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: NIR new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/nir/new.tsx`
- Code/formula/section: workflow comment lines 1-9 and result object lines 197-200
- What was found: The page documents four workflow stages and returns a local result with status `Request`; the submitted MainDB_IT payload uses `currentStatus: 'CurrentstatusKey27'`.
- Why it matters: Initial status must be reconciled with the queue logic that checks for submitted or under-review records.

## 12. Issues Found

| ID | Risk | Issue | Evidence |
|---|---|---|---|
| AUD-B001-NIR-001 | High | Required NIR approval actions are UI-only in reviewed code and do not persist HOD/Notes Admin/Hardware transitions. | `nir/index.tsx` lines 310-318 |
| AUD-B001-NIR-002 | High | NIR initial status key and approval queue logic need reconciliation. | `nir/new.tsx` lines 152-160 and 197-200; `nir/index.tsx` lines 310-318 |

## 13. Risk Assessment

Risk: High

NIR has clear source and app workflow evidence, plus extension list usage. The blocking risk is missing persisted approval transitions and status alignment.

## 14. Final Decision

Status: Completed - Issues Found

NIR is not ready for build. Approval is Required and workflow persistence must be implemented or verified in fix mode.

