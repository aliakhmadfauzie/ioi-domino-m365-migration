# Fix Plan Batch 001

Date: 2026-06-01

Scope: Top 5 fix items from `audit/05_fix_backlog/FIX_BACKLOG.md`, selected by current backlog priority and severity order.

Rules followed:
- App source code was not modified.
- This plan uses audit findings, current backlog rows, audit register context, and read-only source inspection.
- Fixes that need source, schema, or business confirmation are not marked Ready to Fix.

## Selected Fixes

| Fix ID | Priority | Severity | Form | Plan Status | Human Decision Required |
|---|---|---|---|---|---|
| FIX-003 | P0 - Blocks data save or causes data loss | High | EAF | Ready to Fix after FIX-004 field-map check | No |
| FIX-004 | P0 - Blocks data save or causes data loss | High | EAF | Needs More Investigation | No |
| FIX-006 | P0 - Blocks data save or causes data loss | High | HI | Ready to Fix | No |
| FIX-041 | P0 - Blocks data save or causes data loss | High | INTUATSOF | Human Decision Required | Yes |
| FIX-028 | P0 - Blocks data save or causes data loss | High | IOIPOL | Human Decision Required | Yes |

## FIX-003 - EAF Required Fields Not Persisted

1. Fix ID: FIX-003
2. Related Audit ID: AUD-B01-EAF
3. Department: IT
4. Form Name: EAF
5. Problem Summary: Client ID, User Group, and Higher Approver are present in EAF schema/UI evidence but are not written in the EAF Ext_Access child record payload.
6. Evidence:
   - Source: Batch finding
   - File path: `audit/findings/batch-01/eaf.md`
   - Code/formula/section: `AUD-B01-EAF-001`
   - What was found: EAF schema maps `ClientID`, `Group`, and `HApp` to `eAFClientID`, `eAFUserGroup`, and `eAFHigherApproverEmail`; create handler excludes them.
   - Why it matters: Submitted EAF requests can lose access metadata and higher approver routing data.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/eaf/new.tsx:273`
   - Code/formula/section: EAF Ext_Access child payload
   - What was found: Comment states `@todo Add eAFClientID and eAFUserGroup after creating these columns`; payload only writes application, target user, system, justification, CC, dept head, and `eAFIsPCN`.
   - Why it matters: Current source still supports the backlog issue.
7. Files Likely Needing Changes:
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/eaf/new.tsx`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts`
   - SharePoint schema/export files only if columns are confirmed missing and regeneration is required.
8. Exact Change Strategy:
   - Complete FIX-004 schema/internal-name check first.
   - If fields exist in SharePoint/model, add `eAFClientID`, `eAFUserGroup`, and `eAFHigherApproverEmail` to the EAF `extAccessData` payload.
   - Map `formData.ClientID` to `eAFClientID`.
   - Map the selected/requested user group value to `eAFUserGroup`.
   - Map `formData.HigherApprover` or the computed higher approver email used by workflow routing to `eAFHigherApproverEmail`.
   - Keep parent create and rollback behavior unchanged.
9. Risk of Change: Medium. The change is localized to EAF submit, but it depends on correct Ext_Access internal names.
10. How to Verify After Fix:
   - Run `npx tsc --noEmit` in `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.
   - Submit a test EAF with Client ID, User Group, and Higher Approver values.
   - Confirm the MainDB_IT_Ext_Access child record stores all three values.
   - Open EAF detail view and confirm values display from the extension record.
   - Re-audit FIX-003 and FIX-004 evidence.
11. Human Decision Required: No.

## FIX-004 - EAF Field Map Internal Names Mismatch Schema

1. Fix ID: FIX-004
2. Related Audit ID: AUD-B01-EAF
3. Department: IT
4. Form Name: EAF
5. Problem Summary: Generated Ext_Access service field map uses internal names that conflict with captured SharePoint schema names for EAF approval/status fields, and maps missing EAF extension fields that were not found in the captured schema.
6. Evidence:
   - Source: Batch finding
   - File path: `audit/findings/batch-01/eaf.md`
   - Code/formula/section: `AUD-B01-EAF-002`
   - What was found: Captured schema has names such as `EAF_DeptHeadStatus`, while service maps `eafdeptheadstatus` to `EAF_DeptHead_Status`; searches did not find captured schema properties for `EAF_ClientID`, `EAF_UserGroup`, or `EAF_HigherApprover_Email`.
   - Why it matters: Reads, filters, or writes can target non-existent SharePoint internal names.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts:7`
   - Code/formula/section: `EXT_ACCESS_FIELD_MAP`
   - What was found: Field map still contains underscored names including `EAF_DeptHead_Status`, `EAF_DDApp_Status`, `EAF_ITManager_Status`, `EAF_ITCompleted_By`, `EAF_ClientID`, `EAF_UserGroup`, and `EAF_HigherApprover_Email`.
   - Why it matters: The current source still matches the risk described in the finding.
7. Files Likely Needing Changes:
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` only if regenerated by tooling, not manually edited.
   - SharePoint list columns may need creation/rename outside app source if confirmed missing.
8. Exact Change Strategy:
   - Compare actual SharePoint list internal names against `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json`.
   - If local schema is current, change the service map to the schema-confirmed internal names.
   - If missing EAF fields do not exist, create or request the missing SharePoint columns before wiring FIX-003.
   - Regenerate generated model/service files from the SDK where possible rather than hand-editing generated output.
   - Re-run a narrow service read/write check for Ext_Access.
9. Risk of Change: High if done without schema confirmation; Medium after schema confirmation.
10. How to Verify After Fix:
   - Confirm each mapped internal name exists in the SharePoint schema export.
   - Run `npx tsc --noEmit`.
   - Create/update an EAF Ext_Access record using the service and verify no field is dropped or misnamed.
   - Confirm EAF approval status fields still read correctly in detail/approval views.
11. Human Decision Required: No, but schema/source confirmation is required before code changes. Plan status: Needs More Investigation.

## FIX-006 - HI Hardware Data Split From List/Detail Read Path

1. Fix ID: FIX-006
2. Related Audit ID: AUD-B01-HI
3. Department: IT
4. Form Name: HI
5. Problem Summary: HI submit writes hardware details to `MainDB_IT_Ext_Assets`, while HI list/detail behavior reads from `MainDB_IT`, so hardware fields can appear blank after save.
6. Evidence:
   - Source: Batch finding
   - File path: `audit/findings/batch-01/hi.md`
   - Code/formula/section: `AUD-B01-HI-001`
   - What was found: Create writes Ext_Assets, but list/detail only read MainDB_IT fields.
   - Why it matters: Data can be saved successfully but not shown back to users.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/new.tsx:214`
   - Code/formula/section: Ext_Assets create
   - What was found: HI submit creates a MainDB_IT_Ext_Assets child record and rolls back parent on failure.
   - Why it matters: Ext_Assets is the active write path.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx:99`
   - Code/formula/section: HI database view
   - What was found: HI list reads `useMainDBITList` and maps `main.hI*` fields from parent records.
   - Why it matters: List does not join the child data that submit creates.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/[id].tsx`
   - Code/formula/section: Detail page file content
   - What was found: File exists but contains only `e`.
   - Why it matters: The detail route is effectively broken or incomplete.
7. Files Likely Needing Changes:
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/[id].tsx`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/hooks/use-main-dbitext-assets.ts`
   - `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-assets-service.ts`
8. Exact Change Strategy:
   - Keep HI submit writing Ext_Assets, because current create code and field mapping evidence support the extension-list model.
   - In HI list view, fetch `MainDB_IT_Ext_Assets` records and join them to parent MainDB_IT records by parent lookup ID or parent record title, using the confirmed relationship field.
   - Prefer Ext_Assets values for hardware fields; fall back to parent fields only for older records.
   - Replace the malformed HI detail page with a real detail view or redirect to the canonical submission detail once it can load Ext_Assets.
   - Do not migrate hardware fields back to MainDB_IT unless a separate schema decision requires it.
9. Risk of Change: Medium. The fix changes read composition for one form and must handle older records without child rows.
10. How to Verify After Fix:
   - Run `npx tsc --noEmit`.
   - Create a new HI record with CPU, RAM, HDD, serial, vendor, and warranty fields.
   - Confirm the Ext_Assets child row exists.
   - Confirm HI list displays child-backed hardware values.
   - Open HI detail route and confirm it renders, not a malformed file, and displays child-backed values.
   - Confirm older parent-only HI records still render with fallback values.
11. Human Decision Required: No.

## FIX-041 - INTUATSOF Dedicated Implementation Missing

1. Fix ID: FIX-041
2. Related Audit ID: AUD-005
3. Department: IT
4. Form Name: INTUATSOF
5. Problem Summary: INTUATSOF has schema evidence, but no dedicated route/read/write implementation was proven, and the audit could not confirm whether INTUATSOF is separate from SAPSOF/SAPSOF2/SILOUATSOF.
6. Evidence:
   - Source: Audit finding
   - File path: `audit/03_findings/IT/AUD-005_INTUATSOF_AUDIT.md`
   - Code/formula/section: Sections 2, 3, 6, 7, 10, and 12
   - What was found: INTUATSOF approval classification is Unknown; source maps into the shared SAPSOF source family; no dedicated `intuatsof` route directory was found; no dedicated read/write path was proven.
   - Why it matters: Building a dedicated implementation may duplicate or conflict with SAPSOF2 unless the business confirms the form identity.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/INTUATSOF.json`
   - Code/formula/section: Schema file
   - What was found: Schema exists for INTUATSOF.
   - Why it matters: Schema alone is not enough to prove active app route or workflow behavior.
7. Files Likely Needing Changes:
   - No app files should be changed until a human decision is made.
   - If confirmed in scope later: `src/routes/it-routes.tsx`, `src/pages/it/forms/intuatsof/*`, `src/lib/it-forms-config.ts`, `src/generated/services/*` or dynamic form routing.
8. Exact Change Strategy:
   - Ask business/SME to decide whether INTUATSOF is a distinct form, an alias, or superseded by SAPSOF2/SILOUATSOF.
   - If distinct, define canonical form code, route, SharePoint parent/extension list mapping, and workflow classification.
   - If alias/superseded, update audit/register/docs instead of adding code.
   - Do not create a dedicated implementation without that decision.
9. Risk of Change: High if implemented before decision; Low if first resolved as documentation/register cleanup.
10. How to Verify After Fix:
   - Confirm decision is recorded in audit/register or decision documentation.
   - If built, verify route exists, submit creates correct parent/child records, list/detail reads them, and approval status is classified.
   - Re-audit AUD-005 and related SAPSOF variants for duplicate/conflict risk.
11. Human Decision Required: Yes. Plan status: Human Decision Required.

## FIX-028 - IOIPOL Audit/Schema Conflicts With Runtime Code

1. Fix ID: FIX-028
2. Related Audit ID: AUD-006
3. Department: IT
4. Form Name: IOIPOL
5. Problem Summary: Audit/schema use `IOIPOL`, while runtime route and records use `IOIP`; changing this without a canonical decision can break filters, reporting, or historical records.
6. Evidence:
   - Source: Audit finding
   - File path: `audit/03_findings/IT/AUD-006_IOIPOL_AUDIT.md`
   - Code/formula/section: Sections 3, 4, 6, 7, and 12
   - What was found: Runtime creates parent records with `formcode: 'IOIP'`, reads parent and extension records filtered by `IOIP`, but schema/register use IOIPOL.
   - Why it matters: Form-code mismatch affects routing, reporting, filtering, and audit traceability.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/ioip/new.tsx:175`
   - Code/formula/section: Submit parent and extension payload
   - What was found: Parent `formcode` and extension `parentFormCode` are both set to `IOIP`.
   - Why it matters: Current implementation is internally consistent as IOIP.
   - Source: Current app source
   - File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/IOIPOL.json:2`
   - Code/formula/section: Schema identity
   - What was found: Schema declares `formCode` as `IOIPOL`.
   - Why it matters: Schema identity conflicts with runtime identity.
7. Files Likely Needing Changes:
   - No app files should be changed until canonical form code is decided.
   - If canonical code is IOIP: audit/register/schema/docs may need alignment; app route likely remains `ioip`.
   - If canonical code is IOIPOL: `src/pages/it/forms/ioip/*`, `src/routes/it-routes.tsx`, `src/config/departments.ts`, `src/lib/it-forms-config.ts`, `src/lib/it-forms-sap-config.ts`, `src/lib/form-code-registry.ts`, and SharePoint data may need migration/compatibility handling.
8. Exact Change Strategy:
   - Decide canonical form code from source/business evidence: IOIP or IOIPOL.
   - Inventory existing records by `FormCode` before any code change.
   - If IOIP is canonical, update audit/register/schema naming to IOIP or mark IOIPOL as documentation alias.
   - If IOIPOL is canonical, add compatibility handling for existing IOIP records before changing filters/write payloads.
   - Separately plan FIX-029 for persisted approval transitions after identity is resolved.
9. Risk of Change: High without human decision because this can hide existing records or create duplicate form identities.
10. How to Verify After Fix:
   - Confirm one canonical code in register, schema, route, department config, and SharePoint records.
   - Create a policy record and verify list/detail/report filters find it.
   - Verify existing records with the old code remain visible or are migrated.
   - Re-audit AUD-006 and FIX-029.
11. Human Decision Required: Yes. Plan status: Human Decision Required.

## Implementation Readiness

| Fix ID | Readiness | Reason |
|---|---|---|
| FIX-003 | Ready to Fix after FIX-004 | App write omission is evidenced, but exact fields depend on internal-name confirmation. |
| FIX-004 | Needs More Investigation | SharePoint internal names and missing columns must be confirmed before changing generated mapping. |
| FIX-006 | Ready to Fix | Existing create path and extension-list architecture support joining Ext_Assets in read views. |
| FIX-041 | Human Decision Required | Form identity and approval classification are unresolved. |
| FIX-028 | Human Decision Required | Canonical form code must be decided before app or schema alignment. |

## Expected App Files To Change In First Safe Fix Batch

Only after explicit fix-mode approval:

| File | Why |
|---|---|
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx` | Join HI parent records to Ext_Assets child records for list display. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/[id].tsx` | Replace malformed detail file with a working detail/read view. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/eaf/new.tsx` | Persist EAF Client ID, User Group, and Higher Approver after field-map/schema check. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts` | Update EAF Ext_Access internal-name mapping if schema confirmation proves mismatch. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts` | Regenerate or update model if SharePoint columns are added or renamed. |

## Recommended First Fix Batch

Recommended implementation order:

1. FIX-004 investigation only: confirm Ext_Access internal names and whether EAF fields exist.
2. FIX-006 implementation: repair HI read/detail path using Ext_Assets.
3. FIX-003 implementation: persist EAF fields after FIX-004 confirms field names.
4. Hold FIX-041 until INTUATSOF business identity is decided.
5. Hold FIX-028 until IOIP versus IOIPOL canonical code is decided.
