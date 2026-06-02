# SharePoint Write Test

> Verifies that every Patch formula writes to the correct SP column with the correct value.
> Execute after connecting Canvas App to live SP and before workflow testing.
> Last updated: 2026-06-02

---

## How to Verify SP Writes

1. Perform an action in the Canvas App (Save Draft, Submit, Approve, etc.)
2. Open SP List in a browser
3. Navigate to the modified record
4. Verify each column value matches the expected value

Or use SP REST to query:
```
GET {siteUrl}/_api/web/lists/getbytitle('MainDB_HR')/items({ID})?$select=Title,FormCode,Status,CurrentAction,CurrentStage,CurrentApprover_Email,EntitySite
```

---

## SP-01: New Record Creation (AWHR)

| # | Check | SP Column | Expected Value | Actual Value | Pass/Fail |
|---|---|---|---|---|---|
| SP-01.1 | FormCode written correctly | FormCode | "AWHR" | — | [ ] |
| SP-01.2 | Status written as label text | Status | "Draft" (Choice label) | — | [ ] |
| SP-01.3 | EntitySite written correctly | EntitySite | "Johor" or "Prai" (Choice label) | — | [ ] |
| SP-01.4 | Requestor_Email = current user | Requestor_Email | [current user UPN] | — | [ ] |
| SP-01.5 | awhrCompany written | awhrCompany | [entered value] | — | [ ] |
| SP-01.6 | awhrHOS written as email | awhrHOS | [selected HOS email] | — | [ ] |
| SP-01.7 | awhrWorkingHours written as JSON | awhrWorkingHours | Valid JSON array string | — | [ ] |

---

## SP-02: Submit Action (AWHR)

| # | Check | SP Column | Expected Value | Actual Value | Pass/Fail |
|---|---|---|---|---|---|
| SP-02.1 | Status = Submitted | Status | "Submitted" | — | [ ] |
| SP-02.2 | CurrentAction = Submitted | CurrentAction | "Submitted" | — | [ ] |
| SP-02.3 | SubmittedOn = ISO timestamp | SubmittedOn | ISO date string | — | [ ] |
| SP-02.4 | awhrCurrentAction = Submitted | awhrCurrentAction | "Submitted" | — | [ ] |
| SP-02.5 | CurrentApprover_Email = HOS email | CurrentApprover_Email | HOS email | — | [ ] |
| SP-02.6 | ApprovalHistory_HR row created | ParentID | = record ID | — | [ ] |
| SP-02.7 | ApprovalHistory_HR FromState | FromState | "Draft" | — | [ ] |
| SP-02.8 | ApprovalHistory_HR ToState | ToState | "Submitted" | — | [ ] |

---

## SP-03: HOS Approve Action (AWHR)

| # | Check | SP Column | Expected Value | Actual Value | Pass/Fail |
|---|---|---|---|---|---|
| SP-03.1 | awhrCurrentAction = HOSApproved | awhrCurrentAction | "HOSApproved" | — | [ ] |
| SP-03.2 | awhrHOSName = HOS email | awhrHOSName | HOS email | — | [ ] |
| SP-03.3 | awhrHOSDate = today | awhrHOSDate | ISO date string | — | [ ] |
| SP-03.4 | Status = Under Review | Status | "Under Review" | — | [ ] |
| SP-03.5 | CurrentApprover_Email = HOD email | CurrentApprover_Email | HOD email | — | [ ] |
| SP-03.6 | ApprovalHistory row: ActionCode = "Approved" | ActionCode | "Approved" | — | [ ] |

---

## SP-04: Reject Action

| # | Check | SP Column | Expected Value | Actual Value | Pass/Fail |
|---|---|---|---|---|---|
| SP-04.1 | Status = Rejected | Status | "Rejected" | — | [ ] |
| SP-04.2 | CurrentApprover_Email cleared | CurrentApprover_Email | "" | — | [ ] |
| SP-04.3 | ApproverRemarks written | ApproverRemarks | [rejection comment] | — | [ ] |
| SP-04.4 | awhrRejectReason written (AWHR) | awhrRejectReason | [rejection comment] | — | [ ] |
| SP-04.5 | ApprovalHistory row: ActionCode = "Rejected" | ActionCode | "Rejected" | — | [ ] |

---

## SP-05: Config_GlobalUserRoleAssignments Read

| # | Check | Expected Result | Pass/Fail |
|---|---|---|---|
| SP-05.1 | colUserRoleAssignments populated for test user | At least one row returned | [ ] |
| SP-05.2 | UserPrincipalName matches | UPN = current user UPN | [ ] |
| SP-05.3 | IsActiveAssignment = true | Only active assignments returned | [ ] |
| SP-05.4 | gblIsAdmin correct | True for admin user; false for submitter | [ ] |

---

## SP-06: Delegation Test

| # | Check | How to Test | Pass/Fail |
|---|---|---|---|
| SP-06.1 | scrFormList loads all records (no truncation) | Create 600+ test records; verify all display | [ ] |
| SP-06.2 | Approval queue loads all pending items | Create 600+ submitted records; verify all in queue | [ ] |
| SP-06.3 | Filter by status delegates correctly | No Power Apps delegation warning in formula bar | [ ] |
