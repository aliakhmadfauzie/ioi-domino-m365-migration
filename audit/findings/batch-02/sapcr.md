# Batch 2 Finding: SAPCR

## Audit Summary

| Item | Detail |
|---|---|
| Form | SAPCR - SAP & WB Change Request |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `analysis/workflow-analysis.md`, `docs/central-form-reference.md`, `docs/04_WORKFLOW_APPROVAL_RULES.md` |
| App Evidence | `src/pages/it/forms/sapcr/new.tsx`, `src/pages/it/forms/sapcr/index.tsx`, `src/pages/it/forms/sapcr/[id].tsx`, `src/form-schemas/SAPCR.json` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json`, `design/m365-design/sharepoint-list-design.md` |
| Approval Classification | Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B02-SAPCR-001 - Submitted SAPCR records are created in the draft/request state

- Source:
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md:81`; `analysis/workflow-analysis.md:117-144`; `src/config/module-workflows.ts:447-491`; `src/pages/it/forms/sapcr/new.tsx:165-229`
- Code/formula/section: SAPCR approval classification, workflow transition map, and create handler.
- What was found: SAPCR is classified as Approval Required. The workflow evidence describes a Request -> Submitted -> BPOApp -> PMApp chain, with the submit transition moving from Request to Submitted for BPO approval. The create handler runs from a submit action, shows a submitted success message, but writes `currentStatus: 'Request'` and does not write `workflowstage`.
- Why it matters: New SAPCR submissions can remain in the draft/request state instead of entering Pending BPO Approval. That can block approval queues, reminders, and approver visibility even though the user has submitted the form.

### AUD-B02-SAPCR-002 - SAPCR field storage conflicts with the expected SharePoint schema

- Source:
- File path: `mapping/field-mapping.csv:60-64`; `docs/central-form-reference.md:181-190`; `src/form-schemas/SAPCR.json`; `src/pages/it/forms/sapcr/new.tsx:171-225`; `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json:296-374`; `design/m365-design/sharepoint-list-design.md:189-199`
- Code/formula/section: SAPCR schema sections, field mapping, MainDB_IT create payload, and Ext_SAP child payload.
- What was found: Central reference lists SAPCR sections and fields including BPO, PM, SAP standard, ABAPER, transport, implementation, and discard sections. The mapping CSV only contains five SAPCR rows. `SAPCR.json` has no `spColumn` or `spTable` metadata. The create handler stores most SAPCR data inside `MainDB_IT.remarks` JSON and creates an Ext_SAP child with only BPO/PM/developer/director email routing fields. The captured Ext_SAP schema exposes generic `SAP_*` columns but no captured `SAPCR_*` columns, while the design doc lists `SAPCR_BPOEmail`, `SAPCR_PMEmail`, `SAPCR_DeveloperEmail`, and `SAPCR_DirectorEmail`.
- Why it matters: Required SAPCR business fields are not persisted as queryable SharePoint columns, and the app references SAPCR-specific extension fields whose live schema evidence is not present. This creates reporting, workflow routing, and data migration risk.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/pages/it/forms/sapcr/new.tsx:171-212` creates a `MainDB_IT` parent with `formcode: 'SAPCR'`. |
| Child record create | Partial | `src/pages/it/forms/sapcr/new.tsx:214-225` creates Ext_SAP routing fields only. |
| List page source | Verified | `src/pages/it/forms/sapcr/index.tsx:97-121` reads `MainDB_IT` and parses `remarks`. |
| Detail route | Verified | `src/pages/it/forms/sapcr/[id].tsx:1` re-exports the generic submission detail page. |
| Approval required | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md:81` classifies SAPCR as Approval Required. |

## Conflicts

| Conflict | Evidence |
|---|---|
| Mapping completeness conflict | `mapping/field-mapping.md:120` says SAPCR is 54/54 complete, but `mapping/field-mapping.csv:60-64` contains only five SAPCR rows in the audited CSV. |
| Extension schema conflict | `design/m365-design/sharepoint-list-design.md:196-199` lists SAPCR Ext_SAP columns, but the captured `.power` schema did not expose matching `SAPCR_*` columns during this audit. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm the live `MainDB_IT_Ext_SAP` internal names for SAPCR columns and decide whether submit should write `Submitted`/Pending BPO or another confirmed SharePoint choice value.
