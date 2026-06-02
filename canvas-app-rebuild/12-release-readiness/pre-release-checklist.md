# Pre-Release Checklist

> Technical checklist before UAT can begin.
> All CRITICAL and HIGH issues in 11-risk-and-issues/issue-log.md must be RESOLVED.
> Last updated: 2026-06-02

---

## Status Legend
- `[ ]` PENDING
- `[x]` PASS
- `[!]` FAIL — log in issue-log.md
- `[N/A]` Not applicable

---

## 1. SP Schema Confirmation

| # | Check | Status |
|---|---|---|
| 1.1 | SP site URL for Johor confirmed and documented | [ ] |
| 1.2 | SP site URL for Prai (Penang) confirmed and documented | [ ] |
| 1.3 | All MainDB_ SP column names verified against live SP (FormCode, Status, EntitySite, CurrentApprover_Email, CurrentStage) | [ ] |
| 1.4 | AWHR form-specific column names verified via Canvas connector | [ ] |
| 1.5 | CAR form-specific column names verified | [ ] |
| 1.6 | All ApprovalHistory_ lists confirmed to exist for all depts used in build | [ ] |
| 1.7 | Config_GlobalUserRoleAssignments — RoleKey values confirmed from live SP | [ ] |
| 1.8 | Config_ApproverMatrix routing key pattern confirmed | [ ] |
| 1.9 | Missing information register (00-project-control/missing-info-register.md) — all BLOCKING items RESOLVED | [ ] |

---

## 2. Canvas App Build Completeness

| # | Check | Status |
|---|---|---|
| 2.1 | All 53 components built and status = BUILT | [ ] |
| 2.2 | All 15 canonical screens built | [ ] |
| 2.3 | App.OnStart loads correctly — gblCurrentUser, colUserRoleAssignments, gblActiveSite all populated | [ ] |
| 2.4 | All global variables declared and initialized | [ ] |
| 2.5 | cmpAccessGuard applied to all screens | [ ] |
| 2.6 | cmpLoadingState and cmpErrorState applied to all data-loading screens | [ ] |
| 2.7 | Navigation flow complete — all Navigate() calls tested | [ ] |

---

## 3. SharePoint Write Verification

| # | Check | Status |
|---|---|---|
| 3.1 | New record Patch creates record in correct SP list with correct FormCode | [ ] |
| 3.2 | Status field written as Choice label text (not key code) | [ ] |
| 3.3 | EntitySite written as "Johor" or "Prai" (not "Penang") | [ ] |
| 3.4 | Submit Patch: CurrentApprover_Email set to first approver; SubmittedOn written | [ ] |
| 3.5 | Approve Patch: status advances; routing fields updated | [ ] |
| 3.6 | Reject Patch: status = "Rejected"; ApproverRemarks written; routing fields cleared | [ ] |
| 3.7 | ApprovalHistory write: all required columns populated after every action | [ ] |
| 3.8 | No Patch writes to non-existent SP columns (no errors in Power Apps Monitor) | [ ] |

---

## 4. Delegation Safety

| # | Check | Status |
|---|---|---|
| 4.1 | All gallery Filter formulas use indexed SP columns only | [ ] |
| 4.2 | No delegation warnings in Power Apps formula bar | [ ] |
| 4.3 | SP column indexes confirmed enabled: FormCode, Status, EntitySite, Requestor_Email, CurrentApprover_Email | [ ] |
| 4.4 | Large list test: galleries load correctly with 600+ records | [ ] |

---

## 5. Role and Access Control

| # | Check | Status |
|---|---|---|
| 5.1 | All role test scenarios in 09-testing/role-test-scenarios.md — PASS | [ ] |
| 5.2 | Submitter cannot see Approve/Reject buttons | [ ] |
| 5.3 | HOD cannot edit submitter's fields | [ ] |
| 5.4 | scrAdminConfig only accessible to IT Admin role | [ ] |
| 5.5 | Unauthorized user redirected to scrAccessDenied | [ ] |

---

## 6. Pilot Form End-to-End

| # | Check | Status |
|---|---|---|
| 6.1 | AWHR full workflow: Submit → HOS Approve → HOD Approve → HR Complete | [ ] |
| 6.2 | CAR full workflow: Submit → HOD → FIN Manager → COO → ED | [ ] |
| 6.3 | Rejection and return tested on both pilot forms | [ ] |
| 6.4 | ApprovalHistory records written correctly for all actions | [ ] |
