# AUD-046 SAPSOF2 Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-046 |
| Form Code | SAPSOF2 |
| Form Name | SAP Sign-Off Form 2 |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Required |
| Risk | Critical |

## 2. Source Evidence

- Source: PDF UI inventory
- File path: `analysis/pdf-ui-inventory.md`
- Code/formula/section: SAPSOF and SAPSOF2 rows
- What was found: SAPSOF/SAPSOF2 have about 385 fields and 5+ stage Key User/BPO/IT sign-off workflow evidence.
- Why it matters: SAPSOF2 is a required workflow form, not a simple submission.

- Source: Domino field inventory
- File path: `analysis/domino-field-inventory.csv`
- Code/formula/section: `SAPSOF_And_SAPSOF2_all_dxl.xml`
- What was found: SAPSOF source has 385 fields, 12 agents, 18 views, and `HasWorkflow=True`.
- Why it matters: Source evidence confirms workflow and complexity.

- Source: Evidence reconciliation
- File path: `analysis/evidence-reconciliation.md`
- Code/formula/section: SAPSOF pending notes
- What was found: SAPSOF analysis is in progress due to size and complexity.
- Why it matters: Field-level mapping is not fully reconciled.

## 3. App Files Reviewed

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/new.tsx`
- Code/formula/section: Submit handler
- What was found: The new page builds approval slots, but creates only a MainDB_IT parent record with `formcode: 'SAPSOF2'`, `currentStatus: 'CurrentstatusKey1'`, `workflowstage: 2`, and remarks text.
- Why it matters: `CurrentstatusKey1` maps globally to Approved, which conflicts with required sign-off workflow.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapsof2/index.tsx`
- Code/formula/section: `SAMPLE_DATA`
- What was found: The list/database page renders `SAMPLE_DATA`.
- Why it matters: Real submitted SharePoint records are not proven visible.

- Source: Generated hooks
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/hooks/use-it-sapsof-test-evidence.ts`
- Code/formula/section: SAPSOF test evidence CRUD hooks
- What was found: Generated hooks exist for SAPSOF test evidence records.
- Why it matters: Child data infrastructure exists, but new/list evidence did not prove those child records are created and read.

## 4. UI/Form Fields

SAPSOF2 is the largest audited form family in this batch. Field mapping is partial and requires a dedicated decomposition audit.

## 5. SharePoint Field Mapping

Local schemas include SAPSOF fields in MainDB_IT and Ext_SAP evidence, and generated test evidence hooks exist. The audited implementation stores many details in parent remarks and does not prove child record persistence for approval/test evidence.

## 6. Read Logic

The list page uses sample data instead of real SharePoint hooks.

## 7. Write Logic

The new page creates a parent MainDB_IT record and text remarks. Approval slot data is assembled but not proven persisted as child records.

## 8. Validation Rules

The new page uses form validation, including key user requirements, but field-level validation was not fully reconciled with 385+ source fields.

## 9. Section Visibility Rules

Source and app show staged sections, but visibility and editability require dedicated workflow-stage audit.

## 10. Approval Workflow

Approval is Required. The current submit status key maps to Approved globally, and child approval persistence is not proven.

## 11. Draft/Save/Submit/Edit/View Behavior

New and detail files exist, but list view uses sample data and workflow child records are not proven persisted.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-SAPSOF2-001 | Critical | Ready for Fix | Required sign-off form creates parent record with `CurrentstatusKey1`, which maps to Approved. |
| AUD-B003-SAPSOF2-002 | High | Ready for Fix | SAPSOF2 list/database view uses `SAMPLE_DATA` instead of submitted SharePoint records. |
| AUD-B003-SAPSOF2-003 | High | Blocked - Missing Workflow Logic | Approval and test-evidence child records are assembled in code but not proven persisted/read from SharePoint. |

## 13. Risk Assessment

Risk is Critical because required approval/sign-off can be represented with an Approved status and the production list evidence is sample data.

## 14. Final Decision

Completed - Issues Found. SAPSOF2 needs a dedicated workflow/data decomposition fix plan before build readiness.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Yes, partial due size |
| App evidence found | Yes |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

