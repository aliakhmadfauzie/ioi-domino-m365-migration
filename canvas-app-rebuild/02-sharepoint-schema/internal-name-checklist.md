# SharePoint Internal Name Verification Checklist

> Every item in this list must be verified against a live SP list before any Patch formula is finalized.
> Run this SP REST query against each list: `GET {siteUrl}/_api/web/lists/getbytitle('{ListName}')/fields?$select=Title,InternalName,TypeAsString&$filter=Hidden eq false`
> Last updated: 2026-06-02

---

## Verification Status Labels
- `VERIFIED` — confirmed against live SP list with REST API query
- `CONFIRMED_FROM_MODEL` — confirmed from generated model file (reliable but not live SP)
- `UNVERIFIED` — has not been checked against live SP
- `CONFLICT` — model file and PDF extraction disagree — resolve before build

---

## Critical Columns to Verify First (Blocking all workflow formulas)

| List | Canvas Variable / Formula Reference | Expected SP Internal Name | Verification Status | Verified By | Verified Date |
|---|---|---|---|---|---|
| MainDB_HR | `Filter(MainDB_HR, FormCode = ...)` | `FormCode` | CONFIRMED_FROM_MODEL | main-dbhr-service.ts line 304 | 2026-06-02 |
| MainDB_HR | `Filter(MainDB_HR, Status.Value = ...)` | `Status` (Choice) | CONFIRMED_FROM_MODEL | main-dbhr-service.ts `toSharePointWrite` | 2026-06-02 |
| MainDB_HR | `Filter(MainDB_HR, EntitySite.Value = ...)` | `EntitySite` (Choice) | CONFIRMED_FROM_MODEL | service.ts SITE_LABEL_TO_KEY | 2026-06-02 |
| MainDB_HR | `Filter(MainDB_HR, CurrentApprover_Email = ...)` | `CurrentApprover_Email` | CONFIRMED_FROM_MODEL | main-dbhr-service.ts LOWER_TO_SHAREPOINT | 2026-06-02 |
| MainDB_HR | `Patch(..., {CurrentStage: ...})` | `CurrentStage` | CONFIRMED_FROM_MODEL | main-dbhr-service.ts LOWER_TO_SHAREPOINT | 2026-06-02 |
| MainDB_FIN | `Filter(MainDB_FIN, FormCode = ...)` | `FormCode` | CONFIRMED_FROM_MODEL | main-dbfin-model.ts @displayName | 2026-06-02 |
| MainDB_FIN | `Filter(MainDB_FIN, Status.Value = ...)` | `Status` (Choice) | CONFIRMED_FROM_MODEL | main-dbfin-model.ts statusKey @displayName | 2026-06-02 |
| MainDB_FIN | `Filter(MainDB_FIN, EntitySite.Value = ...)` | MISSING_INFO | UNVERIFIED | — | — |
| MainDB_IT | `Filter(MainDB_IT, formcode = ...)` | `formcode` (lowercase) | CONFIRMED_FROM_MODEL | main-dbit-model.ts @displayName | 2026-06-02 |
| MainDB_IT | `Filter(MainDB_IT, currentStatus = ...)` | `currentStatus` (camelCase) | CONFIRMED_FROM_MODEL | main-dbit-model.ts @displayName | 2026-06-02 |
| Config_GlobalUserRoleAssignments | `Filter(..., UserPrincipalName = ...)` | `UserPrincipalName` | CONFIRMED_FROM_MODEL | Config_GlobalUserRoleAssignmentsModel.ts | 2026-06-02 |
| Config_GlobalUserRoleAssignments | `Filter(..., RoleKey = ...)` | `RoleKey` | CONFIRMED_FROM_MODEL | Config_GlobalUserRoleAssignmentsModel.ts — VALUES MISSING_INFO | 2026-06-02 |
| ApprovalHistory_HR | `Patch(ApprovalHistory_HR, ..., {ParentID: ...})` | `ParentID` | CONFIRMED_FROM_MODEL | ApprovalHistory_HRModel.ts | 2026-06-02 |
| ApprovalHistory_HR | `Patch(ApprovalHistory_HR, ..., {ActionByEmail: ...})` | `ActionByEmail` | CONFIRMED_FROM_MODEL | ApprovalHistory_HRModel.ts | 2026-06-02 |

---

## Form-Specific Column Verification (Pilot: CAR form in MainDB_FIN)

| SP Column (PDF-extracted name) | Expected SP Internal Name | Verified SP Internal Name | Status |
|---|---|---|---|
| SAP IO No. | `SAPIONo` (PDF label) | MISSING_INFO | UNVERIFIED |
| SAP Asset No. | `SAPAssNo` (PDF label) | MISSING_INFO | UNVERIFIED |
| Company | `Company` (Choice key) | Confirmed as `Company` from model | CONFIRMED_FROM_MODEL |
| Department | `Department` (Choice key) | Confirmed as `Department` from model | CONFIRMED_FROM_MODEL |
| Project Name | `ProjectName` (PDF label) | MISSING_INFO | UNVERIFIED |
| Objective | `Objective` (PDF label) | MISSING_INFO | UNVERIFIED |
| Start Date | `StartDate` (PDF label) | MISSING_INFO | UNVERIFIED |
| Completion Date | `CompDate` (PDF label) | MISSING_INFO | UNVERIFIED |
| Purpose of Investment | `Purpose` (PDF label) | MISSING_INFO | UNVERIFIED |
| Payback | `PaybackPeriod` | `PaybackPeriod` confirmed from model | CONFIRMED_FROM_MODEL |
| IRR | `IRR_Percent` | `IRR_Percent` confirmed from model | CONFIRMED_FROM_MODEL |
| Amount Budgeted (RM) | `BudgetAmt` (PDF label) | `Amount` confirmed in model; BudgetAmt not found | CONFLICT |
| Budget Number | `BudgetNo` (PDF label) | MISSING_INFO | UNVERIFIED |
| Reviewer (HOD) | `HOD` (PDF label) | `RecipientHODEmail` from model or routing field | CONFLICT |
| Requested By | `Preparedby` (PDF label) | `Requestor_Email` from service map | CONFLICT |

---

## Form-Specific Column Verification (Pilot: AWHR form in MainDB_HR)

| SP Column (confirmed from AWHR new.tsx) | Canvas Write | Status |
|---|---|---|
| `awhrCompany` | `awhrCompany: txt.Text` | CONFIRMED_FROM_SERVICE (used in create call) |
| `awhrCategory` | `awhrCategory: txt.Text` | CONFIRMED_FROM_SERVICE |
| `awhrSection` | `awhrSection: txt.Text` | CONFIRMED_FROM_SERVICE |
| `awhrDepartment` | `awhrDepartment: txt.Text` | CONFIRMED_FROM_SERVICE |
| `awhrHOS` | `awhrHOS: hosEmail` | CONFIRMED_FROM_SERVICE |
| `awhrHOD` | `awhrHOD: hodEmail` | CONFIRMED_FROM_SERVICE |
| `awhrCC` | `awhrCC: ccEmail` | CONFIRMED_FROM_SERVICE |
| `awhrRemarks` | `awhrRemarks: txt.Text` | CONFIRMED_FROM_SERVICE |
| `awhrExceeded` | `awhrExceeded: exceeded joined string` | CONFIRMED_FROM_SERVICE |
| `awhrWorkingHours` | `awhrWorkingHours: JSON string` | CONFIRMED_FROM_SERVICE — rows stored as JSON |
| `awhrSubmittedBy` | `awhrSubmittedBy: gblCurrentUser.UserPrincipalName` | CONFIRMED_FROM_SERVICE |
| `awhrCurrentAction` | `awhrCurrentAction: "Submitted"` | CONFIRMED_FROM_SERVICE |
| `awhrHOSName` | `awhrHOSName: gblCurrentUser.Mail` (on HOS approve) | CONFIRMED_FROM_SERVICE |
| `awhrHOSDate` | `awhrHOSDate: ISO string` | CONFIRMED_FROM_SERVICE |
| `awhrHOSRemark` | `awhrHOSRemark: remark text` | CONFIRMED_FROM_SERVICE |
| `awhrHODName` | `awhrHODName: gblCurrentUser.Mail` (on HOD approve) | CONFIRMED_FROM_SERVICE |
| `awhrHODDate` | `awhrHODDate: ISO string` | CONFIRMED_FROM_SERVICE |
| `awhrHODRemark` | `awhrHODRemark: remark text` | CONFIRMED_FROM_SERVICE |
| `awhrHRName` | `awhrHRName: gblCurrentUser.Mail` (on HR complete) | CONFIRMED_FROM_SERVICE |
| `awhrHRDate` | `awhrHRDate: ISO string` | CONFIRMED_FROM_SERVICE |
| `awhrRejectReason` | `awhrRejectReason: remark text` | CONFIRMED_FROM_SERVICE |

> **Note for Canvas:** The above AWHR column names (awhrCompany, awhrHOS, etc.) are confirmed from the JavaScript service's create call. The actual SP column internal names returned by the SP REST API may differ slightly. Verify with a REST call: `GET {siteUrl}/_api/web/lists/getbytitle('MainDB_HR')/fields?$filter=InternalName eq 'awhrCompany'`

---

## Columns That Need Live SP Verification Before Build

| Priority | List | Column | Reason Unverified |
|---|---|---|---|
| P1 | MainDB_FIN | EntitySite (or is it Site?) | FIN service file not read |
| P1 | MainDB_FIN | All CAR-specific fields | PDF labels only; no FIN service mapping |
| P1 | All MainDB_ lists | FormCode vs formcode exact casing | HR confirmed as FormCode; IT confirmed as formcode; others unknown |
| P2 | MainDB_HR | HOD_x002e_Email Canvas accessor | URL-encoded period may behave differently in Canvas connector |
| P2 | All MainDB_ lists | Status column — is it a SharePoint Choice column or single line text? | HR confirmed as Choice; others need verification |
| P3 | ApprovalHistory_FIN/IT/QC | Existence of these lists | Only HR/QA/STR/SHE confirmed from model files |
