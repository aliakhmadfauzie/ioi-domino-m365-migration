# AUD-012 ITSC Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-012 |
| Form Code | ITSC |
| Form Name | IT Server Checklist |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ITSC row in workflow classification table
- What was found: ITSC is classified as `No Approval Required` and described as a record-keeping form pattern needing code review.
- Why it matters: Approval should not be invented for this item, but code behavior still must match non-approval submission behavior.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `ITSC_all_dxl.xml`, `AllServerMonitor`
- What was found: ITSC has title `IT Server Checklist 2026`, 27 fields, and `HasWorkflow=False`.
- Why it matters: This supports the Not Required approval classification.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/ITSC.pdf row
- What was found: ITSC has approximately 27 visible fields and no workflow marker.
- Why it matters: Field and validation checks should be based on the source PDF and schema.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/new.tsx`
- Code/formula/section: Submit and extension create logic
- What was found: The new page validates required fields, creates a MainDB_IT parent record, and creates an ExtAssets child record with `parentFormCode: 'ITSC'`.
- Why it matters: Write logic exists, but status and read parity need review.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/index.tsx`
- Code/formula/section: List read logic
- What was found: The list view filters MainDB_IT by `formcode eq 'ITSC'` and searches the parent `remarks` payload.
- Why it matters: The list does not prove it joins or reads ExtAssets data created on submit.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/[id].tsx`
- Code/formula/section: Detail read logic
- What was found: The detail page reads MainDB_IT by ID and parses `remarks`.
- Why it matters: Detail behavior may omit structured extension fields.

## 4. UI/Form Fields

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: ITSC PDF row
- What was found: Approximately 27 visible source fields are identified.
- Why it matters: ITSC has broad field coverage and should not rely only on parent remarks if structured schema exists.

## 5. SharePoint Field Mapping

- Source: Generated SharePoint schema
- File path: `.power/schemas/sharepointonline/maindb_it_ext_assets.Schema.json`
- Code/formula/section: ITSC field definitions and required references
- What was found: ITSC fields exist in the ExtAssets schema, including required field references.
- Why it matters: Required schema fields must be written and then read consistently.

- Source: Generated model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-assets-model.ts`
- Code/formula/section: ITSC fields and `parentFormCode`
- What was found: The generated model includes ITSC fields and the parent form code relationship.
- Why it matters: The app has typed support for structured ITSC data.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/index.tsx`
- Code/formula/section: MainDB_IT query
- What was found: The list reads only MainDB_IT records filtered by `ITSC`.
- Why it matters: Extension list data may be unavailable in list/detail review even though it is written.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/new.tsx`
- Code/formula/section: Parent and child create payloads
- What was found: The submit path creates a parent MainDB_IT record with `currentStatus: 'CurrentstatusKey1'`, then creates ExtAssets ITSC child data.
- Why it matters: Non-approval record creation should not use an approval status label unless explicitly intended.

## 8. Validation Rules

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itsc/new.tsx`
- Code/formula/section: Required validation before submit
- What was found: Required validation exists before record creation.
- Why it matters: Validation behavior exists, but should be reconciled with source-required and SharePoint-required fields.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: ITSC pending audit row
- What was found: ITSC section visibility remains pending audit.
- Why it matters: Any conditional sections still need evidence before build readiness.

## 10. Approval Workflow

- Source: Workflow rules documentation and Domino inventory
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`; `analysis/domino-field-inventory.csv`
- Code/formula/section: ITSC workflow classification and `HasWorkflow=False`
- What was found: ITSC is supported as Not Required for approval.
- Why it matters: The audit can classify approval as Not Required without inventing workflow.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to Approved.
- Why it matters: A checklist record may need a non-approval submitted/current status instead of Approved.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-ITSC-001 | High | Ready for Fix | ITSC submit uses `CurrentstatusKey1`, which maps to Approved, even though approval is Not Required. |
| AUD-B002-ITSC-002 | High | Ready for Fix | ITSC writes ExtAssets child data, but list/detail evidence only proves MainDB_IT parent reads. |

## 13. Risk Assessment

Risk is High because status semantics and extension read parity can misrepresent submitted checklist records.

## 14. Final Decision

Completed - Issues Found. Source, app, and schema evidence exist, but write/read parity and status behavior require fixes.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

