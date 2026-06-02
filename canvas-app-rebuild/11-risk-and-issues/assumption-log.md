# Assumption Log

> All confirmed assumptions with validation status.
> Seeded from Audit Report Section 5 (Assumption Risks).
> Never delete rows. Update validation status as assumptions are verified.
> Last updated: 2026-06-02

---

## Validation Status Labels
- `ASSUMED` — accepted assumption; not yet validated
- `VALIDATED` — assumption confirmed correct
- `INVALIDATED` — assumption was wrong; see correction action
- `SUPERSEDED` — assumption replaced by confirmed fact

---

## Assumption Register

| ID | Assumption | Why Risky | Safer Alternative | Validation Status | Validated By | Notes |
|---|---|---|---|---|---|---|
| A-01 | WorkflowHistory is a single global SP list | Confirmed WRONG — separate per-dept ApprovalHistory_ lists exist | Use per-dept lists | INVALIDATED | ApprovalHistory_HRModel.ts etc. | Corrected in all files |
| A-02 | Generic CA field maps to one SP column | Confirmed WRONG — three fields: CurrentStage + CurrentApprover_Email + CurrentApproverGroup | Use three-field routing | INVALIDATED | main-dbhr-service.ts LOWER_TO_SHAREPOINT | Corrected in all workflow formulas |
| A-03 | gblActiveSite toggle is "Johor" / "Penang" | Confirmed WRONG — Penang factory site value is "Prai" not "Penang" | Use "Johor" / "Prai" | INVALIDATED | main-dbfin-model.ts SiteKeyToLabel | Corrected in all files |
| A-04 | PDF-extracted field names are SP internal column names | Unconfirmed — PDF labels are display labels, not SP REST column names | Use generated model files and service wrappers as SP column name sources | ASSUMED | — | All Section 9 field names marked UNVERIFIED until confirmed against live SP |
| A-05 | All editable gallery candidate forms use separate SP child lists | AWHR confirmed to use JSON string storage, not separate list | Default to JSON assumption unless a *Model.ts file exists for the form | INVALIDATED (partial) | AWHR new.tsx, MainDB_HR_Ext models | Mixed pattern: survey per form |
| A-06 | Config_GlobalUserRoleAssignments does not exist (proposed AppConfig_Roles as new) | Confirmed WRONG — list already exists with confirmed schema | Use Config_GlobalUserRoleAssignments | INVALIDATED | Config_GlobalUserRoleAssignmentsModel.ts | Corrected in App.OnStart |
| A-07 | Department stored as plain text in all lists | WRONG for MainDB_FIN — uses departmentKey with key codes. HR uses plain text. | Verify per list | PARTIALLY_INVALIDATED | main-dbfin-model.ts vs main-dbhr-model.ts | FIN = key codes; HR = plain text; other lists unknown |
| A-08 | All 361 forms require approval | 5 forms have unknown approval status — do not assume approval for these | Build without approval until confirmed | PARTIALLY_ASSUMED | MASTER_WORKFLOW_REGISTER.md | Forms #21, #145, #183, #350, #356 = Unknown |
| A-09 | Production forms page (pages/production/forms/index.tsx) lists real PRD forms | Confirmed WRONG — page contains 60+ mock/invented form codes not in master register | Use MASTER_WORKFLOW_REGISTER.md only | INVALIDATED | production/forms/index.tsx promotedProductionForms vs master register | Real PRD codes: TPM, BHTADDI, FILTCLOTREPL, etc. |
| A-10 | scrAdminConfig covers all admin needs with 3 components | Underspecified — TSX has 8 admin sub-panels covering approval routing, audit logs, data source mapping, form registry, route permissions, system settings, user profiles, user roles, workflow management | Read all 8 admin panel TSX files before finalizing admin scope | ASSUMED | — | DO_NOT_BUILD_YET pending scope confirmation |
| A-11 | FormCode column name is "FormCode" (PascalCase) in all lists | Only confirmed for MainDB_HR (from service) and MainDB_FIN (from model). MainDB_IT uses lowercase "formcode". Other lists unknown. | Verify per list | PARTIALLY_VALIDATED | main-dbhr-service.ts (FormCode), main-dbit-model.ts (formcode) | Mixed casing exists across lists |
| A-12 | Status is a SharePoint Choice column in all MainDB_ lists | Only confirmed for MainDB_HR (Choice with label text) and MainDB_FIN (statusKey pattern). MainDB_IT uses plain text `currentStatus`, not Choice. | Verify per list | PARTIALLY_VALIDATED | main-dbhr-service.ts, main-dbit-model.ts | Pattern differs: HR/FIN = Choice; IT = plain text |
| A-13 | MainDB_IT is one list for both sites | TSX shows `MainDB_IT (PRAI)` reference suggesting possible second list | Confirm with IT admin | ASSUMED | pages/it/forms/index.tsx database field | May be one list with siteKey filter or two separate lists |
