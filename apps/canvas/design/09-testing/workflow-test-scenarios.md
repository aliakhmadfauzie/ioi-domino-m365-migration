# Workflow Test Scenarios

> End-to-end workflow test cases for Canvas App.
> Status: PENDING — execute after screens and workflow components are built.
> Last updated: 2026-06-02

---

## W-01: AWHR Full Workflow (Confirmed 3-Stage: Submit → HOS → HOD → HR)

Source: `pages/hr/awhr/detail.tsx` STAGE_ACTIONS — CONFIRMED

| # | Step | Action | Expected SP State | Expected Canvas State | Status |
|---|---|---|---|---|---|
| W-01.1 | Submitter creates new AWHR record | Fill all required fields; Save Draft | Status: "Draft", CurrentAction: "Request" | Form stays on scrNewRequest; success message | [ ] |
| W-01.2 | Submitter submits | Click Submit | Status: "Submitted", CurrentAction: "Submitted", CurrentApprover_Email: HOS email | Navigate to scrMyRequests | [ ] |
| W-01.3 | ApprovalHistory check after submit | — | ApprovalHistory_HR row: FromState="Draft", ToState="Submitted", ActionCode="Submitted", ActionByEmail=submitter | History visible in scrViewRequest timeline | [ ] |
| W-01.4 | HOS approves | HOS opens scrApprovalProcess; clicks Approve | awhrCurrentAction: "HOSApproved", awhrHOSName: HOS email, awhrHOSDate: today | Status badge shows "Under Review"; history row added | [ ] |
| W-01.5 | HOD approves | HOD opens scrApprovalProcess; clicks Approve | awhrCurrentAction: "HODApproved", awhrHODName: HOD email | History row added | [ ] |
| W-01.6 | HR completes | HR opens scrApprovalProcess; clicks Complete | awhrCurrentAction: "Completed", statusKey: "StatusKey5" → Status: "Closed" | Status badge shows "Closed" | [ ] |
| W-01.7 | Confirm final state | View record | Status: "Closed", CurrentApprover_Email: "" | All sections visible and read-only; timeline shows 3 stages | [ ] |

---

## W-02: CAR Full Workflow (4-Stage: Submit → HOD → FIN Manager → COO → ED)

> NOTE: CAR-specific SP column names UNVERIFIED. This test is BLOCKED until M-12 resolved.

| # | Step | Expected SP Write | Status |
|---|---|---|---|
| W-02.1 | Submit CAR | FormCode: "CAR", Status: "Submitted", CurrentApprover_Email: HOD email | [B] BLOCKED — M-12 |
| W-02.2 | HOD approves | Status: "Under Review", CurrentApprover_Email: FIN Manager email | [B] BLOCKED |
| W-02.3 | FIN Manager approves | CurrentApprover_Email: COO email | [B] BLOCKED |
| W-02.4 | COO approves | CurrentApprover_Email: ED email | [B] BLOCKED |
| W-02.5 | ED approves | Status: "Approved", CurrentApprover_Email: "" | [B] BLOCKED |

---

## W-03: Rejection Flow (Any Form)

| # | Step | Expected Result | Status |
|---|---|---|---|
| W-03.1 | Approver clicks Reject without comment | Validation error: "Comment required" | [ ] |
| W-03.2 | Approver adds comment; clicks Reject | Status: "Rejected", ApproverRemarks: comment, CurrentApprover_Email: "" | [ ] |
| W-03.3 | Submitter views rejected record | Status badge: Rejected; rejection comment visible in approval section | [ ] |
| W-03.4 | ApprovalHistory row created | ActionCode: "Rejected", ActionComment: reason, ActionByEmail: rejector | [ ] |

---

## W-04: Return for Edit Flow

| # | Step | Expected Result | Status |
|---|---|---|---|
| W-04.1 | Approver returns record | Status: "Draft", CurrentAction: "Request", ApproverRemarks: return reason | [ ] |
| W-04.2 | Submitter sees returned record in scrMyRequests | Status: "Draft"; return reason visible | [ ] |
| W-04.3 | Submitter edits and resubmits | Status: "Submitted" again; new history row added | [ ] |

---

## W-05: Withdraw Flow

| # | Step | Expected Result | Status |
|---|---|---|---|
| W-05.1 | Submitter clicks Withdraw on Submitted record | Confirm dialog appears | [ ] |
| W-05.2 | Submitter confirms withdraw | Status: "Closed", CurrentAction: "Withdrawn" | [ ] |
| W-05.3 | Withdrawn record visible in scrMyRequests | Status badge: Closed/Withdrawn | [ ] |

---

## W-06: Approval History Verification

| # | Test | Expected Result | Status |
|---|---|---|---|
| W-06.1 | After every workflow action, check ApprovalHistory_HR | New row exists with correct ParentID, FromState, ToState, ActionByEmail, ActionOn | [ ] |
| W-06.2 | scrViewRequest workflow timeline shows history | All stages shown in chronological order | [ ] |
| W-06.3 | Timeline shows correct stage names and actor names | Stage labels match Config_ApproverMatrix config | [ ] |
