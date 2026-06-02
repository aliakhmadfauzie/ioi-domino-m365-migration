# Missing Information Register

> Every item that is MISSING_INFO and blocking or risking build.
> Never delete rows. Mark RESOLVED with date and resolution source.
> Last updated: 2026-06-02

---

## Status Labels
- `OPEN` — not yet resolved; may or may not block build
- `BLOCKING` — must resolve before this item can be built
- `RESOLVED` — confirmed; see resolution column

---

## Register

| ID | Missing Item | Why It Matters | Required Source | Can Build Without? | Status | Resolution Date | Resolution |
|---|---|---|---|---|---|---|---|
| M-01 | SharePoint site URL for Johor site | Cannot register any SP data source in Canvas without the URL | IT Admin | NO | OPEN | — | — |
| M-02 | SharePoint site URL for Prai (Penang) site | Cannot register any SP data source for Prai site | IT Admin | NO | OPEN | — | — |
| M-03 | SP internal column name for FormCode — exact casing: `FormCode` vs `formcode`? Confirmed as `FormCode` for MainDB_HR from service mapping. Need confirmation for MainDB_FIN, MainDB_IT, MainDB_QA, etc. | All Filter formulas depend on exact casing | SP REST API export | NO | OPEN | — | — |
| M-04 | SP internal column name for Status — confirmed as `Status` (Choice) for HR/FIN. Need confirmation for all other lists. | All status-based Filter formulas depend on this | SP REST API export | NO | OPEN | — | — |
| M-05 | SP internal column name for EntitySite — confirmed for MainDB_HR. Need for MainDB_FIN and all other lists. | Site filtering depends on this | SP REST API export or FIN service file | NO | OPEN | — | — |
| M-06 | SP internal column for CurrentApprover_Email — confirmed for MainDB_HR as `CurrentApprover_Email`. Need for MainDB_FIN, MainDB_QA, etc. | Approval queue filter depends on this | Model files or SP export | NO | OPEN | — | — |
| M-07 | SP internal column for CurrentStage — confirmed for MainDB_HR as `CurrentStage`. Need for all other lists. | Workflow stage display and Patch depend on this | Model files or SP export | NO | OPEN | — | — |
| M-08 | RoleKey values in live Config_GlobalUserRoleAssignments SP list | gblIsAdmin, gblIsHOD, cmpAccessGuard, cmpWorkflowActionPanel all depend on known RoleKey strings | Query live SP list | NO | OPEN | — | — |
| M-09 | Config_ApproverMatrix — what ConfigKey values are used and how routing rules are stored | Workflow advance Patch needs to resolve next approver email from this list | Query live SP list | NO | OPEN | — | — |
| M-10 | Which ApprovalHistory_ lists exist beyond HR, QA, STR, SHE — do FIN, IT, QC, PUR, LOG etc. have history lists? | Canvas must register each as a separate data source | Check generated models folder for all ApprovalHistory_*Model.ts files | NO | OPEN | — | — |
| M-11 | Per-form SP column names for AWHR-specific fields — `awhrCompany`, `awhrHOS`, etc. — exact SP REST API names when accessed via Canvas Power Apps connector | Canvas Patch for AWHR fields will fail if wrong name | SP REST export or AWHR service file | NO | OPEN | — | — |
| M-12 | CAR form SP column names — 99 PDF-extracted fields (SAPIONo, ProjectName, etc.) are unconfirmed internal names | Section 9 field mapping is entirely based on PDF labels | MainDB_FIN service file + SP export | NO | OPEN | — | — |
| M-13 | IT site — is MainDB_IT one list (with siteKey) or two lists (one per site)? `MainDB_IT (PRAI)` reference found in TSX. | Canvas data source registration depends on this | IT Admin / SP Admin | NO | OPEN | — | — |
| M-14 | Which forms store child rows as JSON string vs. separate SP child list (per-form survey needed) | cmpRelatedChildItems design depends on this per form | Review each "Editable gallery candidate" form's service/page files | YES (for standard forms) | OPEN | — | — |
| M-15 | Config_Companies and Config_Departments SP list schemas — what columns exist and what values are in them | cmpChoiceField for Company and Department fields needs these as item sources | Query live SP lists | NO (can use hardcoded choices temporarily) | OPEN | — | — |
| M-16 | ApprovalHistory ActionCode format — does SP store "ActionKey0" or the label "Approved"? | Audit history display and filtering depends on this | Query live ApprovalHistory_HR for existing rows | YES (document both; use label) | OPEN | — | — |
| M-17 | FIN Department field — does MainDB_FIN SP column `Department` store "DepartmentKey03" (key code) or "FIN" (label)? | FIN department filter formula must use correct value format | MainDB_FIN service file (not yet read) | NO | OPEN | — | — |
| M-18 | 3 forms with unknown approval status: Hardware Inventory (#21 Johor, #180 Penang), Employee Personal Health Record (#145), Contractor/Vendor Agreement (#356) | Cannot build approval screens for these until confirmed | Form owners / business stakeholders | YES (build without approval; add later) | OPEN | — | — |
| M-19 | HOD_x002e_Email canvas accessor — Canvas Power Apps may access this as `'HOD.Email'` or require URL-decoded name. Behavior with SP connector unknown. | AWHR and other forms write HOD email to this field | Test in Power Apps Studio with live SP connection | YES (skip until SP connected) | OPEN | — | — |
