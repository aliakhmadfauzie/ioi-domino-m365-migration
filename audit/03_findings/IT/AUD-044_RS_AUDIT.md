# AUD-044 RS Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-044 |
| Form Code | RS |
| Form Name | Reset Password / Unlock ID |
| Department | IT |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Risk | High |
| Approval Classification | Conditional |

## 2. Source Evidence

- Source: Domino form inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `RS_all_dxl.xml` row
- What was found: RS is listed as `changepwd`, title `Reset Password/Unlock ID`, with agent `RemPdgIT` and views including `OutStanding`, `Completed`, `Draft`, and `Rejected`; `HasWorkflow=True`.
- Why it matters: Source evidence supports workflow/status behavior.

- Source: Workflow approval rule documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: RS and PWDRESET rows in approval classification table
- What was found: RS is documented as `Approval Required` with IT manager approval, while legacy PWDRESET is documented as no approval required and superseded by RS.
- Why it matters: Documentation conflicts with app behavior and requires confirmation.

- Source: Original PDF form evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/RS.pdf`
- Code/formula/section: PDF filename and IT source folder
- What was found: A source PDF exists for RS.
- Why it matters: The PDF is valid source evidence for future field-level comparison.

## 3. App Files Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/PWDRESET.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`

## 4. UI/Form Fields

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: RS configuration lines 366-520
- What was found: RS includes submission, IT processing, conditional ED approval, and closed stages. It contains requestor details, requested action, application type, conditional SAP/IEP/bank fields, IT processing, and ED approval sections.
- Why it matters: The app implements a conditional approval design for bank systems.

## 5. SharePoint Field Mapping

- Source: Generated models
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
- Code/formula/section: RS columns lines 170-195 and 291-304 in MainDB_IT model; RS columns lines 185-211 in Ext_Access model
- What was found: Generated models include RS fields in both MainDB_IT and Ext_Access.
- Why it matters: Structured columns exist in generated code, but submit and workflow paths must use them consistently.

## 6. Read Logic

- Source: RS database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/index.tsx`
- Code/formula/section: Main and extension filters lines 223-231; remarks parsing lines 253-256
- What was found: RS reads MainDB_IT and Ext_Access records filtered by `formcode`/`parentFormCode`, then falls back to parsing `remarks` JSON for dynamic form data.
- Why it matters: Readback mixes structured columns and remarks JSON, so field mapping needs confirmation.

## 7. Write Logic

- Source: RS new form page and dynamic renderer
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/new.tsx`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: RS renderer call lines 11-15; generic submit payload lines 162-170
- What was found: RS uses `DynamicFormRenderer`, which creates a MainDB_IT record with `currentStatus: 'CurrentstatusKey1'`, `workflowstage: 1`, and `remarks: JSON.stringify(formData)`.
- Why it matters: `CurrentstatusKey1` maps to `Approved`, and the submit path is not proven to create RS Ext_Access records.

- Source: Generated MainDB_IT model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- Code/formula/section: `MainDBITCurrentstatusKeyToLabel` line 334
- What was found: `CurrentstatusKey1` maps to `Approved`.
- Why it matters: New RS submissions may be created in an approved state.

## 8. Validation Rules

- Source: Dynamic form renderer
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: validation lines 128-151
- What was found: The renderer validates required visible fields and blocks submit if the current user is not loaded.
- Why it matters: Generic visible-field validation exists, but source-specific RS validation still needs field-level confirmation.

## 9. Section Visibility Rules

- Source: App form configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- Code/formula/section: RS conditional ED approval and application sections lines 376-520
- What was found: The app says RS flows directly to IT PIC with no manager approval, and defines ED Approval as conditional when `RS_Bank` is filled.
- Why it matters: This conflicts with documentation stating IT manager approval is required, but supports classifying current app logic as Conditional.

## 10. Approval Workflow

- Source: RS database page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/index.tsx`
- Code/formula/section: ED approval condition and approval buttons around lines 366 and 499-514
- What was found: The page calculates ED approval for bank type records and shows action buttons, but approve/reject handlers are console-only in reviewed code.
- Why it matters: Conditional approval UI exists, but persistence is not implemented or not evidenced.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: RS new form page
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/rs/new.tsx`
- Code/formula/section: workflow comment lines 1-9
- What was found: The page states PIC is auto-assigned by application type and location, flows directly to assigned IT PIC, and has no manager approval requirement.
- Why it matters: This is a documented app behavior that conflicts with source approval documentation and must be resolved before build readiness.

## 12. Issues Found

| ID | Risk | Issue | Evidence |
|---|---|---|---|
| AUD-B001-RS-001 | High | RS approval requirement conflicts across source documentation and app implementation. | `docs/04_WORKFLOW_APPROVAL_RULES.md`; `rs/new.tsx` lines 1-9; `it-forms-config.ts` lines 376-520 |
| AUD-B001-RS-002 | High | RS submits with `CurrentstatusKey1` and approval/ED actions are not proven to persist workflow changes. | `dynamic-form-renderer.tsx` lines 162-170; `main-dbit-model.ts` line 334; `rs/index.tsx` action button area |

## 13. Risk Assessment

Risk: High

RS has source workflow evidence and app-level conditional ED approval behavior, but approval requirements conflict and action persistence is not proven.

## 14. Final Decision

Status: Completed - Issues Found

RS is not ready for build. Approval is classified as Conditional based on current app configuration, with the trigger condition `RS_Bank` filled / bank system request. Business confirmation is required because documentation conflicts with the app comments.

