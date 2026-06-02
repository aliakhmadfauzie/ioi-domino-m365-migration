# FIX-003 — EAF Required Fields Persistence (Fix Plan)

Related: AUD-B01-EAF
Priority: P0
Department: IT
Form: EAF

Objective
- Ensure the EAF create/update path persists the following SharePoint columns: `eAFClientID`, `eAFUserGroup`, `eAFHigherApproverEmail`.

Scope
- Code paths: `src/pages/it/forms/eaf/new.tsx`, `src/pages/it/forms/eaf/edit.tsx`, service mappings in `src/generated/services/*`, and any submit helpers.
- DB/SharePoint: verify that target SharePoint list `MainDB_IT` (or canonical EAF list) contains the required internal column names.

Plan
1. Confirm SharePoint internal column names exist in `source_analysis/06_sharepoint_design` or via schema export. If missing, create schema ticket (not in this fix).
2. Update service mapping (generated models) if internal names differ from generated model fields.
3. Modify create/update payload in the EAF submit handlers to include `eAFClientID`, `eAFUserGroup`, `eAFHigherApproverEmail` (values derived from form inputs or routed logic).
4. Add unit/compile check (run `npx tsc -p tsconfig.app.json --noEmit`) and local smoke test of EAF submit page if dev server available.
5. Create Re-Audit ticket and schedule re-audit once code is merged.

Owner: @dev-team (assign as needed)
ETA: 2 business days (estimate)

Notes
- Do not touch CIR or HR code as part of this fix. This is an IT/EAF-specific patch.
- If SharePoint columns are missing, escalate to schema team before making code changes.
