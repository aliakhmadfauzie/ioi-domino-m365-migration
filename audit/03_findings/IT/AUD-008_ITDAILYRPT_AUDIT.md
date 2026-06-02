# AUD-008 ITDAILYRPT Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-008 |
| Form Code | ITDAILYRPT |
| Form Name | IT Daily Report Schema Candidate |
| Department | IT |
| Batch | 002 |
| Audit Date | 2026-06-01 |
| Final Status | Blocked - Ambiguous Requirement |
| Approval Classification | Not Required |
| Risk | Unknown |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ITDAILYRPT row in workflow classification table
- What was found: ITDAILYRPT is classified as No Approval Required and described as daily log/report behavior.
- Why it matters: Approval should not be invented for the form.

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: Plan IT Report and ITDR2 notes
- What was found: Plan IT Report maps to `ITDAILYRPT.json` / `itdr`, while ITDR2 may be a duplicate of ITDR.
- Why it matters: ITDAILYRPT overlaps with AUD-040 ITDR and needs a register/source mapping decision.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRAI/ITDR.pdf row
- What was found: ITDR source PDF has approximately 3 fields and no workflow marker.
- Why it matters: Source evidence points to the ITDR route while schema naming points to ITDAILYRPT.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Submit payload
- What was found: The ITDR route stores records using `formcode: 'ITDAILYRPT'` and creates ExtSupport with `parentFormCode: 'ITDAILYRPT'`.
- Why it matters: ITDAILYRPT appears implemented through the ITDR route, not a separate route.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/index.tsx`
- Code/formula/section: Read filter
- What was found: The ITDR list reads MainDB_IT records where `formcode eq 'ITDAILYRPT'`.
- Why it matters: ITDAILYRPT and ITDR are not distinct in the current implementation evidence.

## 4. UI/Form Fields

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: ITDAILYRPT mapping row
- What was found: ITDAILYRPT schema maps to the ITDR route/source.
- Why it matters: This item may be a duplicate register item rather than a separate form.

## 5. SharePoint Field Mapping

- Source: Generated support extension model
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-ext-support-model.ts`
- Code/formula/section: ITDR/ITDR2 support fields and `parentFormCode`
- What was found: Support extension fields exist for the report family.
- Why it matters: Mapping cannot be finalized until ITDR and ITDAILYRPT are disambiguated.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/index.tsx`
- Code/formula/section: MainDB_IT filter
- What was found: Read logic for ITDAILYRPT exists under the ITDR route.
- Why it matters: The audit cannot treat ITDAILYRPT as an independent implemented form without confirmation.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Parent and child create logic
- What was found: ITDR route writes ITDAILYRPT parent and extension child records.
- Why it matters: Write behavior overlaps with AUD-040 ITDR.

## 8. Validation Rules

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: Required validation
- What was found: Required validation exists before submission.
- Why it matters: Validation evidence exists, but the audited item identity remains ambiguous.

## 9. Section Visibility Rules

- Source: Section visibility rules documentation
- File path: `docs/05_SECTION_VISIBILITY_RULES.md`
- Code/formula/section: ITDAILYRPT pending audit row
- What was found: Section visibility remains pending audit.
- Why it matters: Visibility rules are not build-ready.

## 10. Approval Workflow

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: ITDAILYRPT classification
- What was found: Approval is Not Required.
- Why it matters: The form should use non-approval status behavior after mapping is confirmed.

## 11. Draft/Save/Submit/Edit/View Behavior

- Source: Status model and ITDR route
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/models/main-dbit-model.ts`; `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/app/it/forms/itdr/new.tsx`
- Code/formula/section: `CurrentstatusKey1`
- What was found: ITDAILYRPT is written with `CurrentstatusKey1`, which maps to Approved.
- Why it matters: A non-approval report should not be labeled Approved without source evidence.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B002-ITDAILYRPT-001 | Unknown | Blocked - Ambiguous Requirement | ITDAILYRPT overlaps with AUD-040 ITDR and is implemented through the ITDR route. |
| AUD-B002-ITDAILYRPT-002 | High | Ready for Fix | The overlapping implementation writes Approved status and does not prove extension child reads. |

## 13. Risk Assessment

Risk is Unknown for the item identity because ITDAILYRPT may not be a separate form. The implementation concern is High if the ITDR route is the canonical implementation.

## 14. Final Decision

Blocked - Ambiguous Requirement. A source/register decision is required to determine whether ITDAILYRPT should remain separate from ITDR.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App file found | Ambiguous |
| SharePoint schema evidence found | Partial |
| Approval assumed | No |
| Ready for Build | No |

