# AUD-023 SFAR Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-023 |
| Form Code | SFAR |
| Form Name | Share Folder Access Requisition |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Required |
| Risk | Critical |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SFAR row in workflow classification table
- What was found: SFAR is classified as Approval Required for folder access approval.
- Why it matters: SFAR cannot be treated as a simple submit-only form.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `SFAR_all_dxl.xml`, `Form`
- What was found: SFAR has 26 fields, approval agents including PendingOwner, PendingHOD, PendingISG, PendingITSup, PendingITHOD, and PendingITVer, and workflow views for pending stages.
- Why it matters: Domino evidence proves workflow behavior and multiple approval stages.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/SFAR.pdf row
- What was found: SFAR has approximately 26 fields and a Requestor/Folder Access/HOD/Owner/IT Support approval pattern.
- Why it matters: UI source evidence aligns with approval workflow requirements.

## 3. App Files Reviewed

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/sfar/new.tsx`
- Code/formula/section: Dynamic form render call
- What was found: SFAR new page uses `DynamicFormRenderer`.
- Why it matters: SFAR inherits the shared submit behavior.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/sfar/index.tsx`
- Code/formula/section: MainDB_IT and ExtAccess read logic
- What was found: The list view reads MainDB_IT where `formcode eq 'SFAR'` and ExtAccess where `parentFormCode eq 'SFAR'`.
- Why it matters: The UI expects structured access data, but write evidence must prove it is created.

- Source: Shared form renderer
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: Submit handler
- What was found: The renderer submits MainDB_IT with `currentStatus: 'CurrentstatusKey1'` and `workflowstage: 1`.
- Why it matters: This bypasses the required approval lifecycle by creating records as Approved.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: SFAR source mapping row
- What was found: SFAR maps to `SFAR.json` / `sfar` with 26/26 fields and a three-stage marker.
- Why it matters: Strong source evidence exists for fields and workflow.

## 5. SharePoint Field Mapping

- Source: SharePoint schema reference
- File path: `docs/sharepoint-schemas/schema-reference.md`
- Code/formula/section: SFAR field family notes
- What was found: SFAR-specific fields are documented as `SFAR_*` fields.
- Why it matters: SharePoint mapping should be explicit and complete.

- Source: Generated SharePoint schema
- File path: `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json`
- Code/formula/section: SFAR field definitions
- What was found: SFAR fields are present in the access extension schema.
- Why it matters: The extension schema exists, but the dynamic submit path did not prove it writes extension rows.

## 6. Read Logic

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/sfar/index.tsx`
- Code/formula/section: Filter and mapping logic
- What was found: SFAR reads MainDB_IT and ExtAccess, and maps structured fields with fallback to parsed remarks.
- Why it matters: Read logic expects structured access records for complete display.

## 7. Write Logic

- Source: Shared form renderer
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: Parent create payload
- What was found: SFAR submit writes parent data and JSON remarks only.
- Why it matters: Required approval metadata and extension fields may not be persisted correctly.

## 8. Validation Rules

- Source: Shared form renderer
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: Required visible field validation
- What was found: Required visible fields are checked before submit.
- Why it matters: Field validation exists but does not substitute for approval-stage validation.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: SFAR pending audit row
- What was found: SFAR section visibility remains pending audit.
- Why it matters: Approval-stage sections need source-backed visibility rules.

## 10. Approval Workflow

- Source: Domino field inventory and workflow documentation
- File path: `analysis/domino-field-inventory.csv`; `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SFAR agents, views, and approval classification
- What was found: SFAR has approval agents and pending workflow views and is classified as Required.
- Why it matters: Approval workflow is not optional for this item.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to Approved.
- Why it matters: Required-approval SFAR records should not be created directly as Approved.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-SFAR-001 | Critical | Ready for Fix | Required approval form is submitted through a shared path that sets Approved status. |
| AUD-B002-SFAR-002 | High | Ready for Fix | SFAR list expects ExtAccess and approval actions, but the audited submit path only proves MainDB_IT remarks persistence. |

## 13. Risk Assessment

Risk is Critical because source evidence proves approval is required and the current submit path can create records as Approved.

## 14. Final Decision

Completed - Issues Found. SFAR has strong source and schema evidence, but approval and write behavior are not implementation-ready.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

