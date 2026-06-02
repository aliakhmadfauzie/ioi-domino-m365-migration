# Batch 1 Finding: ITSSR

## Audit Summary

| Item | Detail |
|---|---|
| Form | ITSSR - IT Support & Service Request |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `docs/central-form-reference.md`, `docs/04_WORKFLOW_APPROVAL_RULES.md` |
| App Evidence | `src/features/itssr/itssr-app.tsx`, `src/form-schemas/ITSSR.json` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json` |
| Approval Classification | No Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B01-ITSSR-001 - Routed IT PIC is not persisted on create

- Source:
- File path: `src/features/itssr/itssr-app.tsx:1215-1224`; `src/features/itssr/itssr-app.tsx:1247-1262`; `src/features/itssr/itssr-app.tsx:1272-1284`; `src/features/itssr/itssr-app.tsx:487`
- Code/formula/section: ITSSR create mutation, routing, and access check.
- What was found: The new form calculates `routedPIC` from service type/application/department and emails that user after submit. The Ext_Support create payload does not set `iTSSRAssignedToEmail`. Later access logic checks `record.AssignedToEmail` or `record.SendToEmail` to decide if a user is IT PIC.
- Why it matters: A submitted ITSSR can notify an IT PIC by email while failing to persist the assigned PIC in SharePoint. Role-gated list/detail access and later workflow actions can miss the assigned person.

### AUD-B01-ITSSR-002 - JSON schema references stale or missing Ext_Support fields

- Source:
- File path: `src/form-schemas/ITSSR.json:56-83`; `src/form-schemas/ITSSR.json:113-124`; `src/form-schemas/ITSSR.json:210-218`; `.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json:361-460`; `src/generated/models/main-dbit-ext-support-model.ts:129-190`
- Code/formula/section: ITSSR schema field mappings and Ext_Support generated model.
- What was found: `ITSSR.json` maps Company to `iTSSRCompany`, Extension No to `iTSSRExtNo`, Hardware Type to `iTSSRHardwareType`, and Carried Out By to `iTName`. The captured schema/model expose fields such as `ITSSR_ServiceType`, `ITSSR_ProblemDescription`, `ITSSR_ReportedBy_Email`, `ITSSR_AssignedTo_Email`, `iTSSRDepartment`, `iTSSRExtension`, `iTSSRHardware`, and `iTSSRITName`, but not the stale schema names listed above.
- Why it matters: The schema is not reliable as an implementation contract. Dynamic rendering or future generated submission logic could target fields that do not exist in the expected SharePoint schema/model.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/features/itssr/itssr-app.tsx:1232-1243` creates `MainDB_IT` with `formcode: ITSSR_CODE`. |
| Child record create | Partial | `src/features/itssr/itssr-app.tsx:1247-1262` creates Ext_Support, but omits assigned PIC. |
| Submit validation | Verified | `src/features/itssr/itssr-app.tsx:1292-1301` requires company, department, service type, reported-by email, routed PIC, and problem description length. |
| Approval classification | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md` classifies ITSSR as No Approval Required and describes service desk status flow. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm whether Ext_Support should use the generated model names as canonical and whether `iTSSRAssignedToEmail` is the official persisted routing field.
