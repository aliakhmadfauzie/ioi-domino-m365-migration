# AUD-015 PRF Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-015 |
| Form Code | PRF |
| Form Name | Program Request Form |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: PRF row
- What was found: PRF is classified as Approval Required with multi-stage IT approval.
- Why it matters: PRF cannot be treated as submit-only.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `PRF_all_dxl.xml`, `Reminder`
- What was found: PRF has 23 fields, 18 agents, 38 views, and `HasWorkflow=True`.
- Why it matters: Source evidence confirms a complex workflow surface.

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: PRF PDF row and workflow table
- What was found: PRF has about 23 visible fields and a 6-stage workflow.
- Why it matters: UI source evidence supports field and workflow review.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/prf/new.tsx`
- Code/formula/section: Submit handler
- What was found: New PRF records are created with `formcode: 'PRF'`, draft status `CurrentstatusKey3`, submit status `CurrentstatusKey27`, and `workflowstage: 1`.
- Why it matters: Submit enters a pending status, but workflow stage and child workflow records need reconciliation.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/prf/detail.tsx`
- Code/formula/section: ExtAccess lookup and workflow actions
- What was found: Detail logic looks for ExtAccess with `parentFormCode eq 'PRF' and parentRecord/ID eq ${record.id}` and calls PRF workflow actions.
- Why it matters: Detail expects extension workflow data that the new submit path did not prove it creates.

- Source: Workflow hook
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/hooks/use-prf-workflow.ts`
- Code/formula/section: PRF transition map
- What was found: PRF workflow maps Domino-like states to status keys and writes PRF workflow fields to ExtAccess when an extension record exists.
- Why it matters: Workflow support exists but depends on a child record ID.

## 4. UI/Form Fields

PRF source field count is supported by `analysis/evidence-reconciliation.md` and `analysis/pdf-ui-inventory.md`. The app has dedicated new, list, detail, and `[id]` route files under `src/pages/it/forms/prf`.

## 5. SharePoint Field Mapping

- Source: SharePoint schema and generated models
- File path: `docs/sharepoint-schemas/schema-reference.md`; `src/generated/models/main-dbit-model.ts`; `src/generated/models/main-dbit-ext-access-model.ts`
- Code/formula/section: PRF field family and PRF workflow fields
- What was found: PRF fields exist in MainDB_IT and PRF workflow fields exist in ExtAccess model evidence.
- Why it matters: PRF has structured column evidence, but the create path must align with where workflow fields are read and written.

## 6. Read Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/prf/index.tsx`
- Code/formula/section: MainDB_IT list filter
- What was found: PRF list reads `formcode eq 'PRF'` and maps MainDB_IT PRF fields.
- Why it matters: Parent read logic exists.

## 7. Write Logic

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/prf/new.tsx`
- Code/formula/section: MainDB_IT create payload
- What was found: New PRF writes MainDB_IT parent fields and remarks, but no ExtAccess child create was evidenced in the new submit path.
- Why it matters: Workflow detail actions expect ExtAccess workflow fields.

## 8. Validation Rules

Required field checks exist in `prf/new.tsx` for core request fields, objective/justification, and SAP client when relevant.

## 9. Section Visibility Rules

`docs/05_SECTION_VISIBILITY_RULES.md` marks PRF section visibility pending audit. PRF detail contains stage-gated panels, but those rules were not fully reconciled with source workflow stages.

## 10. Approval Workflow

Approval is Required. Submit uses `CurrentstatusKey27`, which the generated model labels Pending HOD, while PRF workflow hook maps it to Request. This conflict must be reconciled.

## 11. Draft/Save/Submit/Edit/View Behavior

Draft and submit are implemented. Detail workflow actions exist, but child workflow record creation was not proven from the new-form path.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-PRF-001 | High | Ready for Fix | PRF detail/workflow expects ExtAccess child workflow data, but new submit evidence only proves MainDB_IT parent creation. |
| AUD-B003-PRF-002 | High | Ready for Fix | PRF status mapping conflicts: generated status label says Pending HOD while the PRF workflow hook maps the same key to Request. |

## 13. Risk Assessment

Risk is High because workflow routing and approval state can diverge between parent status, PRF hook state, and extension workflow fields.

## 14. Final Decision

Completed - Issues Found. PRF has strong source and app evidence, but workflow persistence and status mapping need fixes before build readiness.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes |
| App evidence found | Yes |
| SharePoint/list evidence found | Yes |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

