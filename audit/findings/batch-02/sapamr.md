# Batch 2 Finding: SAPAMR

## Audit Summary

| Item | Detail |
|---|---|
| Form | SAPAMR - SAP Authorisation Matrix Review |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `docs/central-form-reference.md`, `docs/04_WORKFLOW_APPROVAL_RULES.md` |
| App Evidence | `src/pages/it/forms/sapamr/new.tsx`, `src/pages/it/forms/sapamr/index.tsx`, `src/pages/it/forms/sapamr/[id].tsx`, `src/form-schemas/SAPAMR.json`, `src/config/module-workflows.ts` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it.Schema.json`, `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json`, `docs/sharepoint-schemas/schema-reference.md` |
| Approval Classification | Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B02-SAPAMR-001 - SAPAMR routing fields are written to model properties that are not persisted by the MainDB_IT service

- Source:
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md:82`; `src/config/module-workflows.ts:388-423`; `src/pages/it/forms/sapamr/new.tsx:70-119`; `src/generated/models/main-dbit-model.ts:196-210`; `src/generated/services/main-dbit-service.ts:184-255`; `.power/schemas/sharepointonline/maindb_it.Schema.json`
- Code/formula/section: SAPAMR submit handler, MainDB_IT generated model, and MainDB_IT denormalize/write mapping.
- What was found: SAPAMR requires TBV/TBA routing. The new form writes `sAPAMRTBVEmail`, `sAPAMRTBAEmail`, and optional `sAPAMRTBV1Email` through `sAPAMRTBV5Email` to the `MainDB_IT` create payload. The generated model declares those properties, but `MainDBITService.denormalize()` does not map any `sAPAMR*` properties to SharePoint fields, and the captured `maindb_it.Schema.json` search did not expose `SAPAMR_*` columns.
- Why it matters: The form can validate verifier/approver inputs and still fail to persist routing columns. Approval email routing and queue assignment for the TBV and BPO/HOD stages may not work from SharePoint data.

### AUD-B02-SAPAMR-002 - SAPAMR implementation relies on remarks JSON while the source-of-truth schema is marked legacy

- Source:
- File path: `docs/central-form-reference.md:75`; `docs/central-form-reference.md:169-173`; `src/form-schemas/SAPAMR.json:3-5`; `src/pages/it/forms/sapamr/new.tsx:98-119`; `src/pages/it/forms/sapamr/index.tsx:94-121`; `design/m365-design/sharepoint-list-design.md:100-108`
- Code/formula/section: SAPAMR central inventory, legacy schema notice, create payload, and list mapping.
- What was found: Central reference marks SAPAMR's JSON schema as outdated/legacy and says the active implementation uses `it-forms-config.ts`. The create handler stores initiation and prepared-by values in `remarks` JSON. The list page reads only `MainDB_IT` and parses `remarks`; it does not read an Ext_SAP child record. The schema has no `spColumn` or `spTable` bindings, while design/schema docs reference expected `SAPAMR_*` columns.
- Why it matters: SAPAMR has approval sections, but the implemented data contract is a JSON blob rather than confirmed SharePoint columns. That makes workflow actions, reporting, migration validation, and future dynamic-form rendering fragile.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/pages/it/forms/sapamr/new.tsx:98-119` creates a `MainDB_IT` parent with `formcode: 'SAPAMR'`. |
| Child record create | Not found | Searches in `sapamr/new.tsx` found no Ext_SAP create hook or `parentFormCode` payload. |
| List page source | Verified | `src/pages/it/forms/sapamr/index.tsx:94-121` reads `MainDB_IT` and parses `remarks`. |
| Detail route | Verified | `src/pages/it/forms/sapamr/[id].tsx:1` re-exports the generic submission detail page. |
| Approval required | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md:82` classifies SAPAMR as Approval Required. |

## Conflicts

| Conflict | Evidence |
|---|---|
| Schema authority conflict | `SAPAMR.json:3-5` says it is a legacy reference, while `docs/central-form-reference.md:169-173` still uses that schema for confirmed section inventory. |
| SharePoint column conflict | `docs/sharepoint-schemas/schema-reference.md:37` references `SAPAMR_*` columns, but the audited generated write service does not persist `sAPAMR*` fields. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm whether SAPAMR routing fields belong in `MainDB_IT`, `MainDB_IT_Ext_SAP`, or both, and confirm the live internal names for TBV/TBA columns.
