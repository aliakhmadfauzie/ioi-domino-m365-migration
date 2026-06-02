# Canvas App Build Order

> Source: Canvas App Rebuild Design Report — Phase 8
> Last updated: 2026-06-02
> Status column: PENDING / IN_PROGRESS / COMPLETE / BLOCKED

---

## Pre-Build: Confirm SP Schema (All BLOCKED on B-01 to B-06)

| Step | Area | What To Do | Dependency | Status |
|---|---|---|---|---|
| 0.1 | Schema | Confirm SP site URLs (Johor + Prai) | None | PENDING |
| 0.2 | Schema | Export SP column names from MainDB_HR, MainDB_FIN, MainDB_IT via REST API | 0.1 | PENDING |
| 0.3 | Schema | Confirm FormCode, Status, EntitySite, CurrentApprover_Email, CurrentStage internal names | 0.2 | PENDING |
| 0.4 | Schema | Confirm RoleKey values from live Config_GlobalUserRoleAssignments | 0.1 | PENDING |
| 0.5 | Schema | Confirm Config_ApproverMatrix key patterns | 0.1 | PENDING |
| 0.6 | Schema | Confirm all ApprovalHistory_ list names for all depts | 0.1 | PENDING |
| 0.7 | Schema | Confirm child row storage pattern per form (JSON vs separate list) | 0.2 | PENDING |

---

## Batch 1: Foundation (Unblock everything)

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 1.1 | Canvas App | Create Canvas App in Power Apps Studio | 0.1 | PENDING |
| 1.2 | Data Sources | Add confirmed SP data sources: MainDB_HR, MainDB_FIN, MainDB_IT, Config_GlobalUserRoleAssignments, ApprovalHistory_HR, Config_ApproverMatrix | 0.2, 1.1 | PENDING |
| 1.3 | App State | Declare all global variables (gblCurrentUser, gblActiveSite, gblActiveFormCode, gblActiveDept, gblActiveRecordID, gblFormMode, gblAppLoaded, gblIsAdmin, gblIsHOD) | 1.1 | PENDING |
| 1.4 | App.OnStart | Write corrected App.OnStart formula (Office365Users.MyProfile, Config_GlobalUserRoleAssignments load, site default) | 1.2, 1.3 | PENDING |

---

## Batch 2: Feedback and State Components (No SP dependency)

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 2.1 | Component | cmpLoadingState | 1.1 | PENDING |
| 2.2 | Component | cmpErrorState | 1.1 | PENDING |
| 2.3 | Component | cmpEmptyState | 1.1 | PENDING |
| 2.4 | Component | cmpSuccessMessage | 1.1 | PENDING |
| 2.5 | Component | cmpConfirmDialog | 1.1 | PENDING |
| 2.6 | Component | cmpWarningBanner | 1.1 | PENDING |

---

## Batch 3: App Shell Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 3.1 | Component | cmpAppHeader (logo, site name, user name, notification badge) | 1.4, 2.1 | PENDING |
| 3.2 | Component | cmpSideNav (dept navigation, active highlight) | 1.4 | PENDING |
| 3.3 | Component | cmpBreadcrumb | 1.1 | PENDING |
| 3.4 | Component | cmpCommandBar (parameterized action buttons) | 1.1, 2.5 | PENDING |
| 3.5 | Component | cmpAccessGuard (role check + redirect) | 1.4 | PENDING |
| 3.6 | Component | cmpAppShell (outer container with nav + content slot) | 3.1, 3.2 | PENDING |
| 3.7 | Component | cmpStatusBadge (statusKey-aware colour mapping) | 1.1 | PENDING |

---

## Batch 4: Field Input Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 4.1 | Component | cmpFieldLabel + cmpRequiredIndicator | 1.1 | PENDING |
| 4.2 | Component | cmpTextInputField | 4.1 | PENDING |
| 4.3 | Component | cmpMultilineTextField | 4.1 | PENDING |
| 4.4 | Component | cmpChoiceField | 4.1 | PENDING |
| 4.5 | Component | cmpMultiChoiceField | 4.1 | PENDING |
| 4.6 | Component | cmpDateField | 4.1 | PENDING |
| 4.7 | Component | cmpNumberField | 4.1 | PENDING |
| 4.8 | Component | cmpCurrencyField | 4.1 | PENDING |
| 4.9 | Component | cmpYesNoField | 4.1 | PENDING |
| 4.10 | Component | cmpPeoplePicker (Office365Users.SearchUser) | 4.1, 1.2 | PENDING |
| 4.11 | Component | cmpLookupField | 4.1 | PENDING |
| 4.12 | Component | cmpReadOnlyField | 4.1 | PENDING |
| 4.13 | Component | cmpCalculatedFieldDisplay | 4.1 | PENDING |

---

## Batch 5: Form Structure Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 5.1 | Component | cmpSectionHeader (collapsible) | 1.1 | PENDING |
| 5.2 | Component | cmpFormSection (section container + visibility) | 5.1, 4.1 | PENDING |
| 5.3 | Component | cmpValidationSummary | 2.6 | PENDING |
| 5.4 | Component | cmpFormModeBanner | 1.1 | PENDING |
| 5.5 | Component | cmpUnsavedChangesBanner | 2.6 | PENDING |
| 5.6 | Component | cmpCanonicalRequestForm (master form container) | 5.1, 5.2, 5.3, 5.4, 5.5 | PENDING |

---

## Batch 6: Workflow and Approval Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 6.1 | Component | cmpApprovalCommentBox | 4.3 | PENDING |
| 6.2 | Component | cmpApprovalPanel (single stage display) | 4.12, 3.7 | PENDING |
| 6.3 | Component | cmpApprovalHistory (history list) | 1.2 | PENDING |
| 6.4 | Component | cmpWorkflowTimeline (visual steps) | 3.7 | PENDING |
| 6.5 | Component | cmpAuditHistory (full log) | 1.2 | PENDING |
| 6.6 | Component | cmpWorkflowActionPanel (action buttons + confirm) | 3.4, 6.1, 2.5 | PENDING |

---

## Batch 7: List and Dashboard Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 7.1 | Component | cmpSearchBox | 1.1 | PENDING |
| 7.2 | Component | cmpFilterPanel | 7.1, 4.4 | PENDING |
| 7.3 | Component | cmpRequestCard (gallery item) | 3.7 | PENDING |
| 7.4 | Component | cmpRequestGallery (scrollable list) | 7.3, 2.3, 2.1 | PENDING |
| 7.5 | Component | cmpRequestListToolbar | 7.1 | PENDING |
| 7.6 | Component | cmpPaginationOrLoadMore | 1.1 | PENDING |
| 7.7 | Component | cmpStatusSummaryCards | 3.7 | PENDING |
| 7.8 | Component | cmpDashboardSummary | 7.7, 7.3 | PENDING |

---

## Batch 8: Attachment and Related Data Components

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 8.1 | Component | cmpAttachmentPanel | 1.2, 2.5 | PENDING |
| 8.2 | Component | cmpRelatedChildItems (JSON + child list modes) | 1.2 | PENDING |
| 8.3 | Component | cmpChecklistItems | 4.9 | PENDING |
| 8.4 | Component | cmpRelatedRecordCard | 4.12 | PENDING |

---

## Batch 9: Canonical Screens

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 9.1 | Screen | scrAccessDenied + scrNotFound | Batch 2 | PENDING |
| 9.2 | Screen | scrHomeDashboard | Batch 3, 7 | PENDING |
| 9.3 | Screen | scrDeptHub | 9.2 | PENDING |
| 9.4 | Screen | scrFormList | Batch 7 | PENDING |
| 9.5 | Screen | scrNewRequest (pilot: CAR form) | Batch 4, 5 | PENDING |
| 9.6 | Screen | scrEditDraft (pilot: CAR form) | 9.5 | PENDING |
| 9.7 | Screen | scrViewRequest (pilot: CAR form) | Batch 6, 8 | PENDING |
| 9.8 | Screen | scrApprovalProcess | Batch 6, 7 | PENDING |
| 9.9 | Screen | scrMyRequests | Batch 7 | PENDING |
| 9.10 | Screen | scrAllRequestsAdmin | Batch 7 | PENDING |

---

## Batch 10: Validation, Workflow, Attachments, Guards

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 10.1 | Validation | Wire all validation formulas to scrNewRequest and scrEditDraft | 9.5, 9.6 | PENDING |
| 10.2 | Workflow | Wire all Patch formulas for Submit, Approve, Reject, Return, Withdraw | 9.7, 9.8 | PENDING |
| 10.3 | Workflow | Wire ApprovalHistory write on every action | 10.2 | PENDING |
| 10.4 | Attachments | Wire cmpAttachmentPanel to all form screens | 9.5, 9.6, 9.7 | PENDING |
| 10.5 | Guards | Wire cmpAccessGuard to all screens OnVisible | All screens | PENDING |

---

## Batch 11: Test and Expand

| Step | Area | What To Build | Dependency | Status |
|---|---|---|---|---|
| 11.1 | Testing | End-to-end test: CAR pilot form full workflow | 10.2 | PENDING |
| 11.2 | Testing | Second pilot form: NDF (HR, simpler 3-stage workflow) | 9.5, 9.6, 9.7 | PENDING |
| 11.3 | Expansion | Add remaining forms to AppConfig data | 11.1, 11.2 | PENDING |
| 11.4 | Admin | Build scrAdminConfig (scope TBC) | All screens | PENDING |
| 11.5 | Polish | Breadcrumbs, mobile layout, print action | All screens | PENDING |

---

## Batch 12: UAT and Release

| Step | Area | What To Do | Dependency | Status |
|---|---|---|---|---|
| 12.1 | UAT | UAT per department (see 09-testing/) | 11.3 | PENDING |
| 12.2 | Release | Pre-release checklist (see 12-release-readiness/) | 12.1 | PENDING |
| 12.3 | Release | Go-live (see 12-release-readiness/) | 12.2 | PENDING |
