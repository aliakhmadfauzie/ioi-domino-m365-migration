# AUD-006 IOIPOL Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-006 |
| Form Code | IOIPOL |
| Form Name | IOI Policy |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-03 |
| Final Status | Verified |
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
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx`
- Code/formula/section: MainDB_IT and extension create logic
- What was found: The new page creates a parent record with `formcode: 'IOIP'`, pending policy approval status `CurrentstatusKey55`, and `workflowstage: 2`, then creates policy extension data.
- Why it matters: The runtime form code is IOIP, while the audit item and schema naming use IOIPOL; DEC-2026-009 approves this alias path for UAT.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/index.tsx`
- Code/formula/section: List read filters
- What was found: The list reads MainDB_IT with `formcode eq 'IOIP'` and ExtPolicy with `parentFormCode eq 'IOIP'`.
- Why it matters: The app consistently uses IOIP, but the register item is IOIPOL.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx`
- Code/formula/section: Email calls
- What was found: The submit path sends approval/confirmation emails, and the dedicated detail page persists approval actions and policy extension fields.
- Why it matters: Notification now has matching app-side persistence evidence.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: IOIP PolicyEntry row
- What was found: IOIP maps to `IOIPOL.json` / `ioip` with 10/10 fields.
- Why it matters: Field source mapping exists, but naming differs between audit code and route/form code.

## 5. SharePoint Field Mapping

- Source: Generated model
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-policy-model.ts`
- Code/formula/section: IOIP policy fields
- What was found: The generated policy extension model includes IOIP fields.
- Why it matters: Structured policy extension fields exist and should be used consistently.

## 6. Read Logic

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/index.tsx`
- Code/formula/section: MainDB_IT and ExtPolicy queries
- What was found: Read logic filters both parent and extension lists by IOIP.
- Why it matters: IOIPOL register rows may not align with runtime records stored as IOIP.

## 7. Write Logic

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx`
- Code/formula/section: Submit payload
- What was found: New IOIP records are initially created as `CurrentstatusKey55` with `workflowstage: 2`, and policy extension status is initialized to pending approval.
- Why it matters: The approval-required lifecycle now starts in the expected pending policy approval state.

## 8. Validation Rules

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ioip/new.tsx`
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
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx`; `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/detail.tsx`
- Code/formula/section: IOIPOL approval classification and submit notifications
- What was found: Documentation classifies approval as Required; the app sends approval-related emails and persists approval actions to parent history plus MainDB_IT_Ext_Policy fields.
- Why it matters: Approval-required behavior has app-side persistence evidence.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model and submit code
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`; `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx`; `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/detail.tsx`
- Code/formula/section: `CurrentstatusKey55` through approval/distribution/archive actions
- What was found: IOIP starts as pending policy approval and action buttons persist policy status/date/comment/replied fields by stage.
- Why it matters: Submit-for-approval and approval completion behavior are verified for the app-side UAT path.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-IOIPOL-001 | High | Verified | Audit/schema naming uses IOIPOL while runtime form code and route use IOIP; DEC-2026-009 aliases IOIPOL to active IOIP for UAT and canonical detail routes now open the dedicated IOIP detail page. |
| AUD-B002-IOIPOL-002 | High | Verified | Approval is Required; persisted transitions now update parent approval action history and MainDB_IT_Ext_Policy approval fields. |

## 13. Risk Assessment

Risk is reduced for the UAT code-first app path because alias routing and approval persistence were re-audited. Live SharePoint create/readback remains a separate evidence boundary.

## 14. Final Decision

Verified after remediation. IOIPOL is handled through the active IOIP implementation for UAT, and approval persistence is verified by `audit/build_reviews/FIX-029_IOIPOL_APPROVAL_PERSISTENCE_RE_AUDIT.md`.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | Yes - app-side UAT path verified; live tenant readback not run |
