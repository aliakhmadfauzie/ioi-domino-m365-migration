# Role Test Scenarios

> Test cases verifying role-based access control in the Canvas App.
> Status: PENDING — execute after role matrix is confirmed and components are built.
> Last updated: 2026-06-02

---

## Test Status Legend
- `[ ]` PENDING
- `[x]` PASS
- `[!]` FAIL — create issue in 11-risk-and-issues/issue-log.md
- `[~]` PARTIAL
- `[B]` BLOCKED — list reason

---

## R-01: Submitter Role — Correct Access

| # | Test | Expected Result | Status |
|---|---|---|---|
| R-01.1 | Log in as a user with Submitter role for HR dept | scrHomeDashboard loads; HR dept visible | [ ] |
| R-01.2 | Navigate to scrNewRequest for AWHR | Form loads in New mode; all fields editable | [ ] |
| R-01.3 | Check Save Draft button visible | Save Draft button present in command bar | [ ] |
| R-01.4 | Check Submit button visible | Submit button present | [ ] |
| R-01.5 | Check Approve button hidden | Approve button NOT visible | [ ] |
| R-01.6 | Check Reject button hidden | Reject button NOT visible | [ ] |
| R-01.7 | Navigate to scrViewRequest for own Submitted record | View mode; no action buttons | [ ] |
| R-01.8 | Navigate to scrViewRequest for another user's record | [B] BLOCKED until role matrix confirmed — access behavior TBC | [B] |
| R-01.9 | Navigate to scrAdminConfig | Redirect to scrAccessDenied | [ ] |

---

## R-02: HOD Role — Correct Access

| # | Test | Expected Result | Status |
|---|---|---|---|
| R-02.1 | Log in as HOD for HR dept | scrApprovalProcess shows pending items for their dept | [ ] |
| R-02.2 | Open a Submitted AWHR record from scrApprovalProcess | scrViewRequest loads in Approve mode | [ ] |
| R-02.3 | Check Approve button visible | Approve (HOD) button visible | [ ] |
| R-02.4 | Check Reject button visible | Reject button visible | [ ] |
| R-02.5 | Check Return button visible | Return for Edit button visible | [ ] |
| R-02.6 | Check submitter's form fields are read-only | All submitter fields are DisplayMode.View | [ ] |
| R-02.7 | HOD approval section editable | HOD remark field is editable | [ ] |
| R-02.8 | Try to edit submitter's Company field | Cannot edit — DisplayMode.View | [ ] |
| R-02.9 | HOD cannot access scrAdminConfig | Redirect to scrAccessDenied | [ ] |
| R-02.10 | HOD sees scrAllRequestsAdmin filtered to own dept | Only HR records visible | [ ] |

---

## R-03: Admin Role — Full Access

| # | Test | Expected Result | Status |
|---|---|---|---|
| R-03.1 | Log in as IT Admin | All screens accessible | [ ] |
| R-03.2 | Navigate to scrAdminConfig | Loads without redirect | [ ] |
| R-03.3 | View any record from any dept | Can view without restriction | [ ] |
| R-03.4 | scrAllRequestsAdmin shows all depts | No dept filter applied | [ ] |

---

## R-04: Unauthorized User — Access Denied

| # | Test | Expected Result | Status |
|---|---|---|---|
| R-04.1 | User with no roles in Config_GlobalUserRoleAssignments | scrHomeDashboard loads; no dept cards; no pending items | [ ] |
| R-04.2 | Unauthorized user navigates directly to scrAdminConfig | Redirect to scrAccessDenied | [ ] |
| R-04.3 | Unauthorized user navigates to scrNewRequest | Redirect to scrAccessDenied | [ ] |
| R-04.4 | Unauthorized user tries to open another user's Draft | Redirect to scrAccessDenied or View mode (TBC with role matrix) | [B] BLOCKED until role matrix confirmed |

---

## R-05: Cross-Site Access

| # | Test | Expected Result | Status |
|---|---|---|---|
| R-05.1 | Johor user with site = "Johor" in EntitySite | Sees only Johor records | [ ] |
| R-05.2 | Prai user with site = "Prai" in EntitySite | Sees only Prai records | [ ] |
| R-05.3 | Admin user toggles site from Johor to Prai | Gallery refreshes with Prai records | [ ] |
| R-05.4 | Johor user toggles to Prai (if allowed) | [B] BLOCKED until cross-site access policy confirmed (M-05 in missing-info-register) | [B] |
