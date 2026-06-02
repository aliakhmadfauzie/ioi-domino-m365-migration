# AUD-006 IOIPOL Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-006 |
| Form Code | IOIPOL |
| Form Name | IOI Policy |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: IOIPOL row in workflow classification table
- What was found: IOIPOL is classified as Approval Required for policy acknowledgment workflow.
- Why it matters: The implementation must include source-backed workflow behavior, not only form submission.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `IOIP_all_dxl.xml`, `PolicyEntry`
- What was found: The source title is `IOIOI POLICY`, with 10 fields and views including Draft, Pending Approval, Pending Distribution, and Archived.
- Why it matters: Source views support a workflow/status lifecycle even though the inventory row flags `HasWorkflow=False`.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/IOIP.pdf row
- What was found: IOIP has approximately 10 visible fields and no clear workflow marker in the PDF inventory.
- Why it matters: The PDF supports field review but does not fully define workflow stages.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: MainDB_IT and extension create logic
- What was found: The new page creates a parent record with `formcode: 'IOIP'`, `currentStatus: 'CurrentstatusKey3'`, and `workflowstage: 1`, then references `parentFormCode: 'IOIP'` for extension data.
- Why it matters: The runtime form code is IOIP, while the audit item and schema naming use IOIPOL.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/index.tsx`
- Code/formula/section: List read filters
- What was found: The list reads MainDB_IT with `formcode eq 'IOIP'` and ExtPolicy with `parentFormCode eq 'IOIP'`.
- Why it matters: The app consistently uses IOIP, but the register item is IOIPOL.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: Email calls
- What was found: The submit path sends approval/confirmation emails.
- Why it matters: Email notification exists, but persisted approval transitions were not fully proven.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: IOIP PolicyEntry row
- What was found: IOIP maps to `IOIPOL.json` / `ioip` with 10/10 fields.
- Why it matters: Field source mapping exists, but naming differs between audit code and route/form code.

## 5. SharePoint Field Mapping

- Source: Generated model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-policy-model.ts`
- Code/formula/section: IOIP policy fields
- What was found: The generated policy extension model includes IOIP fields.
- Why it matters: Structured policy extension fields exist and should be used consistently.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/index.tsx`
- Code/formula/section: MainDB_IT and ExtPolicy queries
- What was found: Read logic filters both parent and extension lists by IOIP.
- Why it matters: IOIPOL register rows may not align with runtime records stored as IOIP.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: Submit payload
- What was found: New IOIP records are initially created as `CurrentstatusKey3`, which maps to Draft.
- Why it matters: Draft behavior exists, but approval-required transition behavior must be verified.

## 8. Validation Rules

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: Submit handling
- What was found: Custom submit logic exists rather than the shared dynamic renderer.
- Why it matters: Validation must be checked against IOIPOL source fields and required schema, not assumed from the shared renderer.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: IOIPOL pending audit row
- What was found: IOIPOL section visibility remains pending audit.
- Why it matters: Visibility behavior is not yet build-ready.

## 10. Approval Workflow

- Source: Workflow rules documentation and app email logic
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: IOIPOL approval classification and submit notifications
- What was found: Documentation classifies approval as Required and the app sends approval-related emails, but persisted approval status transitions were not proven.
- Why it matters: Notification alone is not sufficient approval workflow evidence.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model and submit code
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
- Code/formula/section: `CurrentstatusKey3`
- What was found: IOIP starts as Draft.
- Why it matters: Draft behavior is evidenced, but submit-for-approval and approval completion behavior remain incomplete.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-IOIPOL-001 | High | Ready for Fix | Audit/schema naming uses IOIPOL while runtime form code and route use IOIP. |
| AUD-B002-IOIPOL-002 | High | Ready for Fix | Approval is Required, but only Draft creation and email notification were proven; persisted approval transitions remain unverified. |

## 13. Risk Assessment

Risk is High because approval-required policy records may not have a complete persisted workflow, and form-code mismatch can affect reporting and filtering.

## 14. Final Decision

Completed - Issues Found. IOIPOL has source and app evidence, but form-code naming and approval persistence need remediation.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

