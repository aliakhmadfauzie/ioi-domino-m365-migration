# Screen Build Checklist

> Per-screen build verification checklist.
> Mark each item: [ ] PENDING | [x] DONE | [!] BLOCKED | [~] PARTIAL
> Last updated: 2026-06-02

---

## Checklist Template (Copy for each screen)

```
## [Screen Name]

Pre-conditions:
[ ] All required components for this screen are BUILT status
[ ] All SP lists used by this screen are registered as data sources
[ ] All global variables used are declared in App.OnStart
[ ] SP column names confirmed in 02-sharepoint-schema/sharepoint-column-inventory.md

Shell and Navigation:
[ ] cmpAppShell applied
[ ] cmpAppHeader receiving gblCurrentUser.DisplayName and gblActiveSite
[ ] cmpSideNav with correct active dept/form highlighted
[ ] cmpBreadcrumb showing correct trail
[ ] cmpCommandBar with correct buttons for this screen + mode
[ ] Screen OnVisible runs access guard before loading data
[ ] Navigate() calls set correct global variables before calling Navigate

Data Loading:
[ ] Screen OnVisible loads required collections (ClearCollect pattern)
[ ] Loading state: cmpLoadingState visible while collections loading
[ ] Empty state: cmpEmptyState shown when gallery has 0 items
[ ] Error state: cmpErrorState shown on failed data load
[ ] Delegation-safe Filter used (indexed columns only in Filter predicates)

Content:
[ ] All required components placed and wired
[ ] All field controls bound to correct SP column names
[ ] DisplayMode formulas applied correctly (Edit/View by mode + role + status)
[ ] Visible formulas applied to all conditional sections
[ ] Status badge showing correct color for current status

Actions:
[ ] All action buttons visible only in correct mode + role + status
[ ] Save Draft: no validation; Patch with Status="Draft"
[ ] Submit: full validation; Patch with Status="Submitted"; history write
[ ] Approve/Reject/Return: comment validation; Patch; history write
[ ] Delete: confirm dialog; remove only Draft records
[ ] Navigation after action goes to correct screen

Testing:
[ ] Data loads correctly from live SP list
[ ] New record Patch creates record in SP with correct FormCode, Status, EntitySite
[ ] Submit advances workflow (Status changes, CurrentApprover_Email set)
[ ] Approve/Reject changes status and writes to ApprovalHistory_{dept}
[ ] Role guard works: submitter cannot see approve buttons
[ ] Mobile layout renders correctly (if applicable)
```

---

## scrAccessDenied and scrNotFound

**Build first — no SP dependency, no components needed beyond cmpErrorState.**

```
## scrAccessDenied
[x] cmpErrorState with "Access Denied" message
[x] "Go to Home" button → Navigate(scrHomeDashboard)
[x] "Sign Out" button → Launch(sign-out URL)
[ ] DONE
```

---

## scrHomeDashboard — Current Status

```
## scrHomeDashboard

Pre-conditions:
[ ] App.OnStart confirmed working (gblCurrentUser, gblActiveSite, colUserRoleAssignments loaded)
[ ] cmpAppShell BUILT
[ ] cmpDashboardSummary BUILT
[ ] cmpStatusSummaryCards BUILT
[ ] cmpRequestCard BUILT
[ ] All MainDB_ data sources registered

Shell and Navigation:
[ ] cmpAppShell applied
[ ] Site toggle button: Set(gblActiveSite, ...) on tap
[ ] Dept card tap: Set(gblActiveDept, code); Navigate(scrDeptHub)

Data Loading:
[ ] My Pending count: CountIf(MainDB_HR, CurrentApprover_Email = gblCurrentUser.UserPrincipalName)
[!] BLOCKED: SP site URL not confirmed (M-01, M-02)
```

---

## scrNewRequest — Current Status (Pilot: AWHR)

```
## scrNewRequest (AWHR pilot)

Pre-conditions:
[ ] All field components (Batch 4) BUILT
[ ] All form structure components (Batch 5) BUILT
[ ] cmpCommandBar BUILT
[ ] cmpValidationSummary BUILT
[!] BLOCKED: SP column names for AWHR confirmed from create call but not verified via Canvas connector

Actions:
[ ] btnSaveDraft: Patch MainDB_HR with Status:"Draft"; CurrentAction:"Request"
[ ] btnSubmit: Validate → Patch MainDB_HR with Status:"Submitted"; CurrentAction:"Submitted"; write routing fields
[ ] Confirm AWHR child rows (JSON) write to awhrWorkingHours correctly
[!] BLOCKED: HOD_x002e_Email Canvas accessor unknown (M-19)
```
