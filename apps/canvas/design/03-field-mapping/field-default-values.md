# Field Default Values

> Confirmed default value rules for Canvas App fields.
> Defaults are applied in the Default property of each control, or set by App.OnStart / screen OnVisible.
> Last updated: 2026-06-02

---

## Auto-Populated Fields (No User Input)

These fields are set automatically — they must never appear as editable input controls on the New/Edit form.

| Field Purpose | SP Column | Default Source | Canvas Formula | Notes |
|---|---|---|---|---|
| Record title | `Title` | Auto-generated | `gblActiveFormCode & "-" & Text(Now(), "yyyyMMdd-HHmmss")` | Unique identifier |
| Form code | `FormCode` | Navigation context | `gblActiveFormCode` | Set when navigating to the screen |
| Submitter email | `Requestor_Email` | Office365Users | `gblCurrentUser.UserPrincipalName` | Set on Submit only |
| Submitter name | `Requestor_DisplayName` | Office365Users | `gblCurrentUser.DisplayName` | Set on Submit only |
| Submission date | `SubmittedOn` | System time | `Text(Now(), DateTimeFormat.UTC)` | Set on Submit only — not on Save Draft |
| Site | `EntitySite` | Global variable | `{Value: gblActiveSite}` | Set on create |
| Status (initial) | `Status` | Fixed | `{Value: "Draft"}` | Always Draft on new record |
| Current action (initial) | `CurrentAction` | Fixed | `"Request"` | Confirmed from HR service `returnForRevision` sets "Request" |

---

## User-Editable Fields with Suggested Defaults

| Field | SP Column | Default Value | Canvas Default Property Formula | Notes |
|---|---|---|---|---|
| Company (FIN forms) | `Company` | First option | `{Value: "CompanyKey0"}` | IOI Corporation Berhad — confirm with FIN dept |
| Department (FIN forms) | `Department` | User's dept | MISSING_INFO — Office365Users.MyProfile().Department may not match DepartmentKey format | Confirm how to map user dept to DepartmentKey |
| Priority | `Priority` | "Normal" | `"Normal"` | |
| Date fields | Various | Today | `Today()` | For start date or due date fields |
| Number fields | Various | 0 | `0` | |
| Text fields | Various | "" | `""` | |
| Toggle/Boolean | Various | false | `false` | |

---

## Read-Only Fields Set During Approval Actions

These fields are written by the system during workflow transitions — not by the submitter.

| Field | SP Column | Set By | Value Set |
|---|---|---|---|
| HOD approval name (AWHR) | `awhrHOSName` | HOS OnSelect Approve | `gblCurrentUser.UserPrincipalName` |
| HOD approval date (AWHR) | `awhrHOSDate` | HOS OnSelect Approve | `Text(Now(), DateTimeFormat.UTC)` |
| HOD remark (AWHR) | `awhrHOSRemark` | HOS on Approve/Reject | `cmpApprovalCommentBox.outComment` |
| Approver remarks | `ApproverRemarks` | Any approver on action | `txtComment.Text` (from cmpApprovalCommentBox) |
| Final status | `FinalStatus` | Admin lock action | `"Locked"` |
| Current approver email | `CurrentApprover_Email` | System on workflow advance | Next approver's email from routing config |
| Current stage | `CurrentStage` | System on workflow advance | Stage label from routing config |

---

## AWHR Working Hours Row Defaults

Each new working hours row added in `cmpRelatedChildItems` starts with these defaults:

```powerfx
// DRAFT_FORMULA — default for new AWHR row
Collect(locChildItems, {
    id: CountRows(locChildItems) + 1,
    empNo: "",
    name: "",
    category: "",
    dateFrom: "",
    dateTo: "",
    dayType: "Weekday",    // default to Weekday
    shift: "OFC",          // default to OFC shift
    addHours: "0",
    totalHours: "0"
})
```

---

## Status Value Defaults Reference

| Situation | SP Status Value | SP CurrentAction Value |
|---|---|---|
| New record (Save Draft) | `{Value: "Draft"}` | `"Request"` |
| Submit | `{Value: "Submitted"}` | `"Submitted"` |
| HOD/HOS Approved (intermediate) | `{Value: "Under Review"}` | Stage-specific (e.g. `"HOSApproved"`, `"HODApproved"`) |
| Final Approved | `{Value: "Approved"}` | `"Approved"` |
| Rejected at any stage | `{Value: "Rejected"}` | `"Rejected"` |
| Returned for edit | `{Value: "Draft"}` | `"Request"` |
| Completed / Closed | `{Value: "Closed"}` | `"Completed"` |
