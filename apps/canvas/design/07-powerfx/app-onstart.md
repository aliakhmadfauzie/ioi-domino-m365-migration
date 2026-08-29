# App.OnStart Formula

> Source: Corrected Canvas App Data Model and Formula Reference Document (2026-06-02)
> All formulas DRAFT_FORMULA until tested in Power Apps Studio against live SP.
> Status: DRAFT_FORMULA

---

## Corrected App.OnStart

```powerfx
// ============================================================
// DRAFT_FORMULA — Corrected App.OnStart
// Source: Confirmed model files + main-dbhr-service.ts
// SP column names confirmed: UserPrincipalName, RoleKey, IsActiveAssignment (Config_GlobalUserRoleAssignments)
// ============================================================

// Step 1: Load current user profile from Office365Users connector
Set(gblCurrentUser, Office365Users.MyProfile());
// gblCurrentUser provides: .UserPrincipalName, .DisplayName, .Mail, .JobTitle, .Department

// Optional: Load manager
// Set(gblCurrentUserManager, Office365Users.MyManager());

// Step 2: Set active site
// CONFIRMED VALUES: "Johor" (SiteKey1) or "Prai" (SiteKey0)
// "Penang" is NOT a valid EntitySite value for MainDB_HR or MainDB_FIN
// IT uses different site values — see 04-workflow-role-rules/workflow-state-matrix.md
Set(gblActiveSite, "Johor");   // Default — CONFIRM with project owner: Johor or Prai?

// Step 3: Initialize navigation context (cleared at start)
Set(gblActiveDept, Blank());
Set(gblActiveFormCode, Blank());
Set(gblActiveRecordID, 0);
Set(gblFormMode, "View");

// Step 4: Load role assignments from CONFIRMED EXISTING list
// List: Config_GlobalUserRoleAssignments
// CONFIRMED SP columns: UserPrincipalName, RoleKey, IsActiveAssignment, DepartmentCodeScope, ModuleKeyScope
// RoleKey values: MISSING_INFO — must query live SP list
ClearCollect(
    colUserRoleAssignments,
    Filter(
        Config_GlobalUserRoleAssignments,
        UserPrincipalName = gblCurrentUser.UserPrincipalName
        And IsActiveAssignment = true
    )
);

// Step 5: Derive role flags
// REPLACE all "MISSING_INFO_*_ROLEKEY" below with confirmed RoleKey values from SP list
Set(gblIsAdmin,
    CountIf(colUserRoleAssignments, RoleKey = "MISSING_INFO_ADMIN_ROLEKEY") > 0
);
Set(gblIsHOD,
    CountIf(colUserRoleAssignments, RoleKey = "MISSING_INFO_HOD_ROLEKEY") > 0
);
Set(gblIsITAdmin,
    CountIf(colUserRoleAssignments, RoleKey = "MISSING_INFO_ITADMIN_ROLEKEY") > 0
);

// Step 6: Load company and dept options from confirmed existing Config_ lists
// Config_Companies — confirmed existing SP list
ClearCollect(colCompanyOptions, Config_Companies);
// Config_Departments — confirmed existing SP list
ClearCollect(colDeptOptions, Config_Departments);

// Step 7: Mark app as loaded — releases loading screen
Set(gblAppLoaded, true);

// ============================================================
// TOTAL CONFIRMED ITEMS:
// - gblCurrentUser from Office365Users.MyProfile() ✓
// - Config_GlobalUserRoleAssignments SP list columns ✓ (UserPrincipalName, RoleKey, IsActiveAssignment)
// - gblActiveSite values: "Johor" / "Prai" ✓ (not "Penang")
// MISSING_INFO items:
// - All "MISSING_INFO_*_ROLEKEY" placeholders need confirmed RoleKey values from SP list
// - Config_Companies and Config_Departments schemas not fully read
// - SP site URL needed before data sources can be registered
// ============================================================
```

---

## Global Variables Declared

| Variable | Type | Initial Value | Purpose |
|---|---|---|---|
| `gblCurrentUser` | Record | Office365Users.MyProfile() | Current user profile |
| `gblActiveSite` | Text | "Johor" | Active site for all SP filters |
| `gblActiveDept` | Text | Blank | Active department code |
| `gblActiveFormCode` | Text | Blank | Active form code |
| `gblActiveRecordID` | Number | 0 | Active SP record ID |
| `gblFormMode` | Text | "View" | Form mode for DisplayMode formulas |
| `gblIsAdmin` | Boolean | false | IT Admin flag |
| `gblIsHOD` | Boolean | false | HOD flag (any dept) |
| `gblIsITAdmin` | Boolean | false | IT Admin flag |
| `gblAppLoaded` | Boolean | false | Released after OnStart completes |
| `colUserRoleAssignments` | Table | From Config_GlobalUserRoleAssignments | Current user's roles |
| `colCompanyOptions` | Table | From Config_Companies | Company dropdown choices |
| `colDeptOptions` | Table | From Config_Departments | Department dropdown choices |
