# Batch 1 Finding: EAF

## Audit Summary

| Item | Detail |
|---|---|
| Form | EAF - External Access Form (VPN & Citrix) |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `mapping/field-mapping.csv`, `docs/central-form-reference.md` |
| App Evidence | `src/pages/it/forms/eaf/new.tsx`, `src/pages/it/forms/eaf/[id].tsx`, `src/form-schemas/EAF.json` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` |
| Approval Classification | Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B01-EAF-001 - Missing persistence for Client ID, User Group, Higher Approver

- Source:
- File path: `analysis/evidence-reconciliation.md:38`; `docs/central-form-reference.md:418-422`; `src/form-schemas/EAF.json:78-125`; `src/pages/it/forms/eaf/new.tsx:667-699`; `src/pages/it/forms/eaf/new.tsx:273-284`
- Code/formula/section: EAF Requestor fields and EAF create handler.
- What was found: EAF source/docs identify `ClientID`, `Group`, and `HApp`. `EAF.json` maps them to `eAFClientID`, `eAFUserGroup`, and `eAFHigherApproverEmail`. The page renders Client ID and User Group inputs, but the create handler has a todo stating these fields are not added until columns/model exist, and the object sent to `MainDB_IT_Ext_Access` only includes application, target user, system, justification, CC, dept head, and `isPCN`.
- Why it matters: Submitted EAF records lose source-required access metadata. Higher Approver routing evidence exists in the form schema/docs, but that value is not persisted with the request.

### AUD-B01-EAF-002 - Service field map conflicts with captured SharePoint schema names

- Source:
- File path: `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json:270-430`; `src/generated/services/main-dbit-ext-access-service.ts:18-41`; `src/generated/models/main-dbit-ext-access-model.ts:35-99`
- Code/formula/section: Ext_Access schema and generated service `EXT_ACCESS_FIELD_MAP`.
- What was found: The captured schema contains names such as `EAF_DeptHeadStatus`, `EAF_DDAppStatus`, `EAF_ITManagerStatus`, and `EAF_ITCompletedBy`. The generated service maps corresponding app fields to `EAF_DeptHead_Status`, `EAF_DDApp_Status`, `EAF_ITManager_Status`, and `EAF_ITCompleted_By`. Searches found no captured schema properties for `EAF_ClientID`, `EAF_UserGroup`, or `EAF_HigherApprover_Email`, while the service maps them.
- Why it matters: Filter/order translations or writes using these mapped names can target non-existent SharePoint internal names. This is a data access risk for approval status fields and the missing EAF extension fields.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/pages/it/forms/eaf/new.tsx:237-250` writes `MainDB_IT` with `formcode: 'EAF'` and pending HOD status. |
| Child record create | Partial | `src/pages/it/forms/eaf/new.tsx:262-284` writes `MainDB_IT_Ext_Access`, but excludes Client ID/User Group/Higher Approver. |
| Detail page route | Verified | `src/pages/it/forms/eaf/[id].tsx:1` re-exports the generic submission detail page. |
| Approval required | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md` classifies EAF as Approval Required; `EAF.json:3-4` describes a 5-stage workflow. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm the live Ext_Access internal names and whether missing columns should be created or whether schema/docs should be corrected.
