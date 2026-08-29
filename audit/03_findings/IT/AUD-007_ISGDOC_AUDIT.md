# AUD-007 ISGDOC Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-007 |
| Form Code | ISGDOC |
| Form Name | ISG Document / IT Procedures |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ISGDOC row in workflow classification table
- What was found: ISGDOC is classified as No Approval Required and described as document upload/record behavior.
- Why it matters: The form should be audited as a non-approval record form unless stronger source evidence says otherwise.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `ITP_all_dxl.xml`, `isgdoc`
- What was found: ISGDOC source has title `IT Procedures/Training Manuals`, 10 fields, and `HasWorkflow=False`.
- Why it matters: Domino source supports non-approval classification.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/ITP.pdf row
- What was found: The source PDF has approximately 10 fields and no workflow marker.
- Why it matters: PDF evidence supports field review but no approval requirement.

## 3. App Files Reviewed

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/isgdoc/new.tsx`
- Code/formula/section: Submit logic
- What was found: The form validates required fields and creates MainDB_IT with `formcode: 'ISGDOC'`, `currentStatus: 'CurrentstatusKey1'`, and JSON remarks.
- Why it matters: The status maps to Approved even though approval is Not Required.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/isgdoc/index.tsx`
- Code/formula/section: List read logic
- What was found: The list reads MainDB_IT where `formcode eq 'ISGDOC'` and parses `remarks`.
- Why it matters: Structured ExtDocs data is not proven in the ISGDOC read path.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: isgdoc mapping row
- What was found: isgdoc maps to `ISGDOC.json` / `isgdoc`.
- Why it matters: Source-to-schema mapping exists for the audited form.

## 5. SharePoint Field Mapping

- Source: Generated docs extension model
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-docs-model.ts`
- Code/formula/section: ITP fields and `parentFormCode`
- What was found: The docs extension model includes ITP/ISGDOC-style fields and a parent form relationship.
- Why it matters: Structured document metadata exists, but the audited ISGDOC create/read path did not prove use of the extension list.

## 6. Read Logic

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/isgdoc/index.tsx`
- Code/formula/section: MainDB_IT query
- What was found: ISGDOC list reads parent records and parses JSON remarks/status.
- Why it matters: Parent-only reads may omit structured document fields.

## 7. Write Logic

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/isgdoc/new.tsx`
- Code/formula/section: MainDB_IT create payload
- What was found: Submit creates MainDB_IT only, with `CurrentstatusKey1`.
- Why it matters: Status semantics and extension mapping require correction or justification.

## 8. Validation Rules

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/isgdoc/new.tsx`
- Code/formula/section: Required validation
- What was found: Required validation exists before submission.
- Why it matters: Validation should be reconciled with the source and SharePoint schema.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: ISGDOC pending audit row
- What was found: ISGDOC section visibility remains pending audit.
- Why it matters: Conditional display behavior is not fully verified.

## 10. Approval Workflow

- Source: Workflow rules documentation and Domino inventory
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `analysis/domino-field-inventory.csv`
- Code/formula/section: ISGDOC classification and `HasWorkflow=False`
- What was found: Approval is Not Required.
- Why it matters: The app should use a non-approval status model.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to Approved.
- Why it matters: Non-approval submissions should not be labeled as Approved unless business rules explicitly define that status.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-ISGDOC-001 | High | Ready for Fix | ISGDOC submit uses Approved status for a non-approval document record. |
| AUD-B002-ISGDOC-002 | High | Ready for Fix | ExtDocs schema/model exists, but ISGDOC create/read evidence only proves MainDB_IT remarks usage. |

## 13. Risk Assessment

Risk is High because document records may have misleading approval status and incomplete structured SharePoint mapping.

## 14. Final Decision

Completed - Issues Found. Source and app evidence exist, but status and mapping issues remain unresolved.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

