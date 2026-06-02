# AUD-050 UR Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-050 |
| Form Code | UR |
| Form Name | User Registration / User ID Request |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Unknown |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: UR row in workflow classification table
- What was found: UR is classified as `Unknown` because there is limited code evidence and business confirmation is required.
- Why it matters: The audit cannot assume that UR requires approval or does not require approval.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/UR.pdf inventory row
- What was found: UR has a PDF source with approximately 20 visible fields and no clear workflow marker.
- Why it matters: The PDF can support UI/field review, but it does not prove workflow behavior.

- Source: Source reconciliation
- File path: `analysis/evidence-reconciliation.md`
- Code/formula/section: UR source mapping notes
- What was found: UR is mapped from Domino/source evidence bundled with NIR/RS material.
- Why it matters: Source evidence exists, but the workflow requirement remains unresolved.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ur/new.tsx`
- Code/formula/section: Dynamic form render call
- What was found: The UR new page renders `DynamicFormRenderer` with the UR form configuration.
- Why it matters: UR submit behavior is inherited from the shared dynamic renderer.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ur/index.tsx`
- Code/formula/section: MainDB_IT and ExtAccess read filters
- What was found: The list view reads MainDB_IT records where `formcode eq 'UR'` and ExtAccess records where `parentFormCode eq 'UR'`.
- Why it matters: The read path expects structured access-extension data in addition to the parent list record.

- Source: Shared form renderer
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: Submit handler
- What was found: The renderer creates MainDB_IT records with `formcode`, `currentStatus: 'CurrentstatusKey1'`, `workflowstage: 1`, and JSON `remarks`.
- Why it matters: `CurrentstatusKey1` maps to Approved, which is risky when approval is Unknown.

## 4. UI/Form Fields

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: UR PDF row
- What was found: Approximately 20 visible fields are identified for UR.
- Why it matters: Field-level validation requires comparison with source PDF and generated schema before build readiness.

## 5. SharePoint Field Mapping

- Source: SharePoint schema reference
- File path: `docs/sharepoint-schemas/schema-reference.md`
- Code/formula/section: MainDB_IT field family notes
- What was found: UR-specific fields are documented as `UR_*` fields.
- Why it matters: UR should map either to MainDB_IT UR fields or a related extension list without invented columns.

- Source: Generated SharePoint schema
- File path: `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json`
- Code/formula/section: UR field definitions
- What was found: UR fields are present in the access extension schema.
- Why it matters: The list view references ExtAccess, but the audited submit path did not prove an ExtAccess write.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/ur/index.tsx`
- Code/formula/section: Filter and mapping logic
- What was found: UR reads MainDB_IT and ExtAccess, then maps structured fields with fallback to parsed `remarks`.
- Why it matters: Read logic depends on extension data that is not proven by the shared write path.

## 7. Write Logic

- Source: Shared form renderer
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: MainDB_IT create payload
- What was found: UR submit writes only the parent MainDB_IT payload through the shared renderer and stores form data in `remarks`.
- Why it matters: Structured UR extension fields may not be populated on submit.

## 8. Validation Rules

- Source: Shared form renderer
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- Code/formula/section: Required visible field validation
- What was found: Required validation checks visible fields before submit and shows an error toast when required values are missing.
- Why it matters: Validation exists, but must be compared field by field with the UR source and SharePoint required fields.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: UR pending audit row
- What was found: UR section visibility remains pending audit.
- Why it matters: Build readiness cannot be granted until visibility requirements are confirmed.

## 10. Approval Workflow

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: UR approval classification
- What was found: Approval classification is Unknown.
- Why it matters: The audit must not mark UR Ready for Build while workflow requirement is Unknown.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Shared form renderer and status model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`
- Code/formula/section: Status code mapping
- What was found: `CurrentstatusKey1` maps to `Approved`; `CurrentstatusKey3` maps to `Draft`.
- Why it matters: UR submit currently uses an Approved status before approval requirements are confirmed.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-UR-001 | High | Ready for Fix | UR submit uses `CurrentstatusKey1` through the shared renderer, which maps to Approved. |
| AUD-B002-UR-002 | High | Blocked - Ambiguous Requirement | UR approval requirement remains Unknown and no ExtAccess write was proven for the fields read by the list view. |

## 13. Risk Assessment

Risk is High because the app can create UR records with an Approved status while approval requirement and structured SharePoint mapping remain incomplete.

## 14. Final Decision

Completed - Issues Found. UR has source and app evidence, but approval is Unknown and the write path does not prove complete SharePoint field mapping.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Yes |
| SharePoint schema evidence found | Yes |
| Approval assumed | No |
| Ready for Build | No |

