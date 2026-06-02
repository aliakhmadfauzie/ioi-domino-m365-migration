# Screen-to-SharePoint Matrix

> Maps each Canvas screen to the SP lists it reads from and writes to.
> Uses confirmed SP column names only.
> Last updated: 2026-06-02

---

| Screen | SP Lists Read | SP Columns Read | SP Lists Written | SP Columns Written | Notes |
|---|---|---|---|---|---|
| scrHomeDashboard | All MainDB_{dept} (count queries only) | `FormCode`, `Status`, `EntitySite`, `Requestor_Email` | None | — | CountIf for summary cards; delegation-safe with indexed columns |
| scrDeptHub | MainDB_{gblActiveDept} | `FormCode`, `Status`, `EntitySite` | None | — | Count for pending badge only |
| scrFormList | MainDB_{gblActiveDept} | All columns + `FormCode`, `Status.Value`, `EntitySite.Value`, `Title`, `Requestor_Email`, `SubmittedOn`, `CurrentStage` | None | — | Filter: FormCode = gblActiveFormCode And EntitySite.Value = gblActiveSite |
| scrNewRequest | MainDB_{gblActiveDept} (on Save/Submit) | None on load; write only | MainDB_{gblActiveDept} | `Title`, `FormCode`, `Status`, `CurrentStatus`, `CurrentAction`, `CurrentStage`, `CurrentApprover_Email`, `CurrentApprover_DisplayName`, `CurrentApproverGroup`, `EntitySite`, `Requestor_Email`, `Requestor_DisplayName`, `SubmittedOn`, + all form-specific fields | Draft save = Status: {Value:"Draft"}, CurrentAction:"Request" |
| scrEditDraft | MainDB_{gblActiveDept} (load + update) | All form fields by ID | MainDB_{gblActiveDept} | Same as scrNewRequest | Guard: only if Status = "Draft" |
| scrViewRequest | MainDB_{gblActiveDept} (single record) | All columns | MainDB_{gblActiveDept} (via workflow actions only) | `Status`, `CurrentAction`, `CurrentStage`, `CurrentApprover_Email`, `ApproverRemarks`, + form-specific approval fields | Also reads: ApprovalHistory_{dept}, child list (if applicable) |
| scrViewRequest | ApprovalHistory_{gblActiveDept} | `FromState`, `ToState`, `ActionCode`, `ActionComment`, `ActionByEmail`, `ActionByName`, `ActionOn` | ApprovalHistory_{gblActiveDept} | Same columns (on action) | Select correct list by gblActiveDept |
| scrApprovalProcess | All MainDB_{dept} | `FormCode`, `Status.Value`, `CurrentApprover_Email`, `CurrentStage`, `Title`, `EntitySite.Value` | Same lists + ApprovalHistory_{dept} | Workflow advance columns + history columns | Filter: CurrentApprover_Email = gblCurrentUser.UserPrincipalName |
| scrMyRequests | All MainDB_{dept} | `FormCode`, `Status.Value`, `Title`, `SubmittedOn`, `EntitySite.Value` | None | — | Filter: Requestor_Email = gblCurrentUser.UserPrincipalName |
| scrAllRequestsAdmin | All MainDB_{dept} | Same as scrMyRequests + `CurrentApprover_Email` | None | — | Filter: HOD by DepartmentCode; Admin sees all |
| scrAdminConfig | All Config_ lists | All columns | Config_ lists (write) | All Config_ columns | IT Admin only |
| scrAccessDenied | None | — | None | — | Static error screen |
| scrNotFound | None | — | None | — | Static error screen |

---

## Delegation Safety Notes

All Filter formulas that load large galleries must use delegation-safe patterns.

### Delegation-Safe Columns (must be indexed in SP)

The following SP columns must have indexing enabled for delegation to work beyond 500/2000 rows:

| Column | List | Index Required For |
|---|---|---|
| `FormCode` | All MainDB_ lists | Filter by form code |
| `Status` | All MainDB_ lists | Filter by status |
| `EntitySite` | All MainDB_ lists | Filter by site |
| `Requestor_Email` | All MainDB_ lists | Filter by submitter |
| `CurrentApprover_Email` | All MainDB_ lists | Filter approval queue |
| `Created` | All MainDB_ lists | Date-range filters |

### Delegation-Safe Filter Examples (DRAFT_FORMULA)

```powerfx
// SAFE — Uses indexed columns
Filter(MainDB_HR,
    FormCode = gblActiveFormCode
    And EntitySite.Value = gblActiveSite
    And Status.Value = locFilterStatus
)

// SAFE — Approval queue
Filter(MainDB_HR,
    CurrentApprover_Email = gblCurrentUser.UserPrincipalName
    And Status.Value = "Submitted"
)

// UNSAFE — Text search on non-indexed column (avoid for large lists)
// Filter(MainDB_HR, Title contains searchText)   <- not delegation safe
// Use: StartsWith(Title, searchText) instead, with indexed Title column
```
