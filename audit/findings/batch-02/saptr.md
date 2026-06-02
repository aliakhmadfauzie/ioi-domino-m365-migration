# Batch 2 Finding: SAPTR

## Audit Summary

| Item | Detail |
|---|---|
| Form | SAPTR - SAP Transport Request |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`, `docs/04_WORKFLOW_APPROVAL_RULES.md` |
| App Evidence | `src/pages/it/forms/saptr/new.tsx`, `src/pages/it/forms/saptr/index.tsx`, `src/pages/it/forms/saptr/[id].tsx`, `src/form-schemas/SAPTR.json`, `src/config/module-workflows.ts` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json`, `src/generated/models/main-dbit-model.ts` |
| Approval Classification | Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B02-SAPTR-001 - New SAPTR submissions are created with an Approved status

- Source:
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md:83`; `src/config/module-workflows.ts:355-384`; `src/pages/it/forms/saptr/new.tsx:169-240`; `src/generated/models/main-dbit-model.ts:332-392`
- Code/formula/section: SAPTR approval classification, workflow stages, create handler, and generated CurrentStatus labels.
- What was found: SAPTR is classified as Approval Required and the workflow starts with Request/Draft then Submitted/Pending Approval before transport stages. The SAPTR create handler writes `currentStatus: 'CurrentstatusKey1'`. The generated model maps `CurrentstatusKey1` to `Approved`.
- Why it matters: A newly submitted SAPTR can bypass the first approval state and appear approved immediately. This is a workflow integrity risk similar to the earlier EAF status defect pattern.

### AUD-B02-SAPTR-002 - SAPTR list page uses sample data instead of submitted SharePoint records

- Source:
- File path: `src/pages/it/forms/saptr/new.tsx:217-234`; `src/pages/it/forms/saptr/index.tsx:32-90`; `src/pages/it/forms/saptr/index.tsx:266-284`; `docs/change-log.md:78`
- Code/formula/section: SAPTR create handler and list/database view.
- What was found: The SAPTR create handler writes a `MainDB_IT` parent and `MainDB_IT_Ext_SAP` child. The SAPTR list page defines `SAMPLE_DATA` and passes `SAMPLE_DATA` directly into `DatabaseTable`; it does not call `useMainDBITList` or `useMainDBITExtSAPList`. The change log already notes that SAPTR uses sample data and needs SharePoint hooks.
- Why it matters: Submitted SAPTR records will not appear in the SAPTR database/list view. Users can submit data into SharePoint and then see unrelated static sample rows, which breaks auditability and UAT validation.

### AUD-B02-SAPTR-003 - SAPTR Ext_SAP writes do not match captured schema coverage

- Source:
- File path: `docs/central-form-reference.md:198-203`; `src/form-schemas/SAPTR.json`; `src/pages/it/forms/saptr/new.tsx:219-234`; `src/generated/models/main-dbit-ext-sap-model.ts:124-154`; `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json:296-374`
- Code/formula/section: SAPTR schema fields, Ext_SAP model, and child create payload.
- What was found: Central reference lists SAPTR Section A and Section B approval/transport fields. `SAPTR.json` has no `spColumn` or `spTable` metadata. The create handler writes a subset of `sAPTR*` fields to Ext_SAP. The generated Ext_SAP model declares `sAPTRCategory`, `sAPTRClient`, `sAPTRIssueNum`, `sAPTRTcode`, `sAPTRChangesDone`, `sAPTRKeyUser`, and related fields, but the captured Ext_SAP schema exposes only generic `SAP_TRNumber`, `SAP_Client`, `SAP_Plant`, `SAP_Module`, `SAP_ReviewedBy`, `SAP_ReviewedDate`, and `SAP_Remarks` in the audited section.
- Why it matters: SAPTR references extension columns that do not have matching captured schema evidence. Approval status, transporter, approval dates, and Section B transport fields are not confirmed as persisted columns.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/pages/it/forms/saptr/new.tsx:173-217` creates a `MainDB_IT` parent with `formcode: 'SAPTR'`. |
| Child record create | Partial | `src/pages/it/forms/saptr/new.tsx:219-234` creates Ext_SAP with a subset of SAPTR fields. |
| List page source | Issue found | `src/pages/it/forms/saptr/index.tsx:266-284` renders `SAMPLE_DATA`. |
| Detail route | Verified | `src/pages/it/forms/saptr/[id].tsx:1` re-exports the generic submission detail page. |
| Approval required | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md:83` classifies SAPTR as Approval Required. |

## Conflicts

| Conflict | Evidence |
|---|---|
| Source reconciliation conflict | `analysis/evidence-reconciliation.md:68-80` says SAPTR is partially done/in progress because computed fields may lack visible UI equivalents, while `analysis/all-forms-source-analysis.md:172` calls SAPTR complete. |
| Implementation status conflict | `analysis/all-forms-crud-gap-analysis.csv:18` marks SAPTR full CRUD, but the audited list page uses sample data instead of SharePoint records. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm the live `MainDB_IT_Ext_SAP` schema for SAPTR-specific columns and the correct initial SharePoint `CurrentStatus` choice for a submitted SAPTR request.
