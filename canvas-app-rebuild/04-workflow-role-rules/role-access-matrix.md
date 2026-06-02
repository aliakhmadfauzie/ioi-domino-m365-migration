# Role Access Matrix

> Defines which roles can access which screens and perform which actions.
> RoleKey values are MISSING_INFO — must be confirmed from live Config_GlobalUserRoleAssignments SP list before build.
> Source: Config_GlobalUserRoleAssignmentsModel.ts + MASTER_ROLE_SECTION_REGISTER.md + TSX component patterns
> Last updated: 2026-06-02

---

## Role Config SP List

**List name:** `Config_GlobalUserRoleAssignments`
**Primary column for role:** `RoleKey` (string — values MISSING_INFO)
**Scope columns:** `DepartmentCodeScope`, `ModuleKeyScope`
**Active flag:** `IsActiveAssignment` (boolean)

### Schema Summary

| Column | Type | Purpose |
|---|---|---|
| `UserPrincipalName` | Text | User's UPN/email for role lookup |
| `RoleKey` | Text | Role identifier — **VALUES MISSING_INFO** |
| `AssignmentScope` | Choice | Scope type (e.g. global, dept, module) |
| `IsActiveAssignment` | Boolean | Whether this assignment is currently active |
| `DepartmentCodeScope` | Text | Dept code this role applies to (e.g. "HR", "FIN") |
| `ModuleKeyScope` | Text | Module this role applies to |
| `Display_Name` | Text | User display name (for reference) |

---

## Role Load Formula (App.OnStart)

```powerfx
// DRAFT_FORMULA — confirmed SP column names
ClearCollect(
    colUserRoleAssignments,
    Filter(
        Config_GlobalUserRoleAssignments,
        UserPrincipalName = gblCurrentUser.UserPrincipalName
        And IsActiveAssignment = true
    )
)
```

---

## Role Check Named Formula

```powerfx
// DRAFT_FORMULA — fxUserHasRole
// Usage: fxUserHasRole("MISSING_INFO_HOD_ROLEKEY", gblActiveDept)
fxUserHasRole(roleKey, deptCode) =
    CountIf(
        colUserRoleAssignments,
        RoleKey = roleKey
        And (IsBlank(DepartmentCodeScope) Or DepartmentCodeScope = deptCode)
        And IsActiveAssignment = true
    ) > 0
```

---

## Role Category Definitions (Pending RoleKey Confirmation)

> All role names below are ASSUMED based on workflow signals from MASTER_WORKFLOW_REGISTER and TSX page patterns.
> RoleKey values (the actual strings stored in SP) must be confirmed from the live list.

| Role Category | Assumed RoleKey (MISSING_INFO) | Scope | Description |
|---|---|---|---|
| All Authenticated Users | (no role required) | Global | Any M365 user with SP access |
| Submitter | MISSING_INFO | Dept + FormCode | Can create, edit own drafts, submit |
| HOD (Head of Department) | MISSING_INFO | DepartmentCodeScope | Can approve/reject for their dept |
| HOS (Head of Section) | MISSING_INFO | DepartmentCodeScope | First approver for certain HR forms (AWHR) |
| HR Personnel | MISSING_INFO | HR dept scope | HR verification stage for HR forms |
| Finance Manager | MISSING_INFO | FIN dept scope | Finance approval for FIN forms |
| COO | MISSING_INFO | Global | COO approval for high-value forms |
| Executive Director | MISSING_INFO | Global | Final approval tier |
| Verifier | MISSING_INFO | Form-specific | Quality/inspection verification step |
| IT Admin / App Admin | MISSING_INFO | Global | Full access including scrAdminConfig |
| Read-Only Viewer | MISSING_INFO | Dept-specific | View-only access; no approval or edit |

---

## Screen Access Matrix

| Screen | All Auth Users | Submitter | HOD | HR | Admin | Notes |
|---|---|---|---|---|---|---|
| scrHomeDashboard | YES | YES | YES | YES | YES | All see; content filtered by role |
| scrMyRequests | YES | YES | YES | YES | YES | All see own submissions |
| scrDeptHub | YES | YES (own dept) | YES (own dept) | YES (HR) | YES | |
| scrFormList | YES | YES (own dept forms) | YES | YES | YES | Content filtered by FormCode and role |
| scrNewRequest | NO — must have Submitter role | YES | YES (if also submitter) | YES | YES | cmpAccessGuard validates role |
| scrEditDraft | NO | YES (own Draft) | Limited | Limited | YES | Only own Drafts unless Admin |
| scrViewRequest | YES (own) | YES (own) | YES (dept records) | YES | YES | |
| scrApprovalProcess | NO | NO | YES | YES (HR stage) | YES | Only roles with pending action |
| scrAllRequestsAdmin | NO | NO | YES (dept filter) | YES (HR filter) | YES | |
| scrAdminConfig | NO | NO | NO | NO | YES | IT Admin only |
| scrAccessDenied | YES | YES | YES | YES | YES | Shown on access failure |
| scrNotFound | YES | YES | YES | YES | YES | |

---

## Action Permission Matrix

| Action | Submitter | HOD | HOS | HR | COO | Director | Admin |
|---|---|---|---|---|---|---|---|
| Save Draft | YES (own) | NO | NO | NO | NO | NO | YES |
| Submit | YES (own Draft) | NO | NO | NO | NO | NO | YES |
| Withdraw | YES (own Submitted) | NO | NO | NO | NO | NO | YES |
| HOD Approve | NO | YES (dept) | NO | NO | NO | NO | YES |
| HOD Reject | NO | YES (dept) | NO | NO | NO | NO | YES |
| HOS Approve (AWHR) | NO | NO | YES | NO | NO | NO | YES |
| HR Complete | NO | NO | NO | YES | NO | NO | YES |
| COO Approve | NO | NO | NO | NO | YES | NO | YES |
| Director Approve | NO | NO | NO | NO | NO | YES | YES |
| Return for Edit | NO | YES | YES | YES | YES | YES | YES |
| Delete Draft | YES (own) | NO | NO | NO | NO | NO | YES |
| View Any Record | NO | YES (dept) | NO | YES | YES | YES | YES |
| Export / Print | YES (own) | YES (dept) | NO | YES | YES | YES | YES |
| Admin Config | NO | NO | NO | NO | NO | NO | YES |

---

## IT Department — Role Definitions

> Source: `docs/04_WORKFLOW_APPROVAL_RULES.md`, `docs/05_SECTION_VISIBILITY_RULES.md`, TSX code patterns
> All RoleKey values are MISSING_INFO until confirmed from live `Config_GlobalUserRoleAssignments` SP list.

| IT Role | Assumed RoleKey | Scope | Description | Evidence |
|---|---|---|---|---|
| IT Submitter | MISSING_INFO | IT dept + FormCode | Creates and submits IT forms. Can edit own Drafts. | CONFIRMED — all IT forms |
| IT PIC (Person-In-Charge) | MISSING_INFO | IT dept + FormCode | Assigned IT staff for ITSSR tickets, RS password resets, SFAR IT action | CONFIRMED — ITSSR, RS, SFAR |
| IT Verifier | MISSING_INFO | IT dept | Verifies SFAR folder access requests | CONFIRMED — SFAR_S4 |
| IT Manager | MISSING_INFO | IT dept | Approves EAF stage 4, SFAR HOD approval | CONFIRMED — EAF, SFAR |
| IT Notes Admin | MISSING_INFO | IT dept | Processes NIR Notes ID creation | CONFIRMED — NIR |
| IT Hardware Team | MISSING_INFO | IT dept | Provisions hardware for NIR | CONFIRMED — NIR |
| IT Config Team | MISSING_INFO | IT dept | Configures EAF VPN/Citrix access (stage 5) | CONFIRMED — EAF_S6 |
| IT SAP BASIS | MISSING_INFO | IT dept | Grants SAP config access (SAPCA), transports (SAPTR) | CONFIRMED — SAPCA, SAPTR |
| IT SAP ABAP Developer | MISSING_INFO | IT dept | Develops/transports SAP changes (SAPCR, PRF) | CONFIRMED — SAPCR, PRF |
| IT Functional Owner | MISSING_INFO | IT dept | SAP functional sign-off (PRF, INTUATSOF, SILOUATSOF) | TSX_INFERENCE |
| IT Admin / App Admin | MISSING_INFO | Global | Full system access, scrAdminConfig, all records | CONFIRMED |
| IT Read-Only | MISSING_INFO | IT dept | View-only access to IT records | TSX_INFERENCE |

---

## IT Department — Action Permission Matrix

| Action | IT Submitter | IT PIC | IT Manager | IT Notes Admin | IT Hardware | IT SAP BASIS | IT Admin |
|---|---|---|---|---|---|---|---|
| Save Draft | YES (own) | YES (own) | YES (own) | YES (own) | YES (own) | YES (own) | YES |
| Submit | YES (own Draft) | YES (own) | YES (own) | YES (own) | YES (own) | YES (own) | YES |
| Assign Ticket (ITSSR) | NO | YES | YES | NO | NO | NO | YES |
| Resolve Ticket (ITSSR) | NO | YES (assigned) | NO | NO | NO | NO | YES |
| Accept Resolution (ITSSR) | YES (own) | NO | NO | NO | NO | NO | YES |
| HOD Approve (EAF/NIR) | NO | NO | NO | NO | NO | NO | YES |
| COO Approve (EAF) | NO | NO | NO | NO | NO | NO | YES |
| IT Manager Approve (EAF) | NO | NO | YES | NO | NO | NO | YES |
| IT Provisioning (EAF) | NO | YES (IT Config) | NO | NO | NO | NO | YES |
| Notes Admin Action (NIR) | NO | NO | NO | YES | NO | NO | YES |
| IT Hardware Action (NIR) | NO | NO | NO | NO | YES | NO | YES |
| IT PIC Review (SFAR) | NO | YES | NO | NO | NO | NO | YES |
| IT Verifier (SFAR) | NO | NO (Verifier role) | NO | NO | NO | NO | YES |
| IT Action Done/Deny (SFAR) | NO | YES | NO | NO | NO | NO | YES |
| SAP BASIS Action | NO | NO | NO | NO | NO | YES | YES |
| Delete Draft | YES (own) | YES (own) | YES (own) | YES (own) | YES (own) | YES (own) | YES |
| View Any IT Record | NO | MISSING_INFO | YES | YES | YES | YES | YES |
| Edit After Submission | NO | YES (assigned fields) | YES (approval fields) | YES (Notes Admin fields) | YES (HW fields) | YES (SAP fields) | YES |
| Admin Config | NO | NO | NO | NO | NO | NO | YES |
