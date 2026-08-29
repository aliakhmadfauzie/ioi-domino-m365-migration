# 09 — Testing

## Purpose
Test scenarios, test cases, and UAT sign-off sheets for the Canvas App. Every workflow path, role boundary, and SharePoint write must have a documented test before the app is released to users.

## What Belongs Here
- Role-based access test scenarios (`role-test-scenarios.md`)
- End-to-end workflow test scenarios (`workflow-test-scenarios.md`)
- SharePoint write verification tests (`sharepoint-write-test.md`)
- User acceptance test template per department (`user-acceptance-test.md`)

## What Does NOT Belong Here
- Design documents
- Power Fx formula code
- Build instructions

## Source of Truth
- `04-workflow-role-rules/` — defines what must be tested
- `02-sharepoint-schema/sharepoint-column-inventory.md` — defines expected SP write results
- `Config_GlobalUserRoleAssignments` SP list — defines role assignments to test against

## Update Rules
- Add test cases as each screen and component is built
- Mark each test: PENDING / PASS / FAIL / BLOCKED
- Do not mark UAT as PASS without evidence (screenshot or screen recording)
- Failed tests must create an entry in `11-risk-and-issues/issue-log.md`

## Testing Priority
1. SharePoint read/write (FormCode, Status, EntitySite, CurrentApprover_Email) — highest priority
2. Role boundary tests (submitter cannot approve, HOD cannot edit submitter fields)
3. End-to-end workflow (Submit → Approve → History written)
4. Delegation limits (large list performance)
5. Mobile layout
