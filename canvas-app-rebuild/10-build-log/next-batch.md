# Next Batch Queue

> Queue of build batches in order. Move from here to current-batch.md when starting.
> Last updated: 2026-06-02

---

## Batch 0 — SP Schema Confirmation (CURRENT BLOCKER)

Resolve all items in `00-project-control/missing-info-register.md` before proceeding.
Critical items: M-01 through M-07.

---

## Batch 1 — Foundation

After Batch 0 complete:
1. Create Canvas App in Power Apps Studio
2. Register SP data sources: MainDB_HR, MainDB_FIN, MainDB_IT, Config_GlobalUserRoleAssignments, ApprovalHistory_HR, Config_ApproverMatrix
3. Declare all global variables (see app-onstart.md)
4. Write and test App.OnStart formula
5. Verify colUserRoleAssignments populates correctly for test users

---

## Batch 2 — Feedback and State Components (6 components, no SP dependency)

Build in order:
1. cmpLoadingState
2. cmpErrorState
3. cmpEmptyState
4. cmpSuccessMessage
5. cmpConfirmDialog
6. cmpWarningBanner

Test each component in isolation on a test screen before proceeding.

---

## Batch 3 — App Shell Components (7 components)

Build in order:
1. cmpStatusBadge (simple; needed early)
2. cmpAppHeader
3. cmpSideNav
4. cmpBreadcrumb
5. cmpCommandBar
6. cmpAccessGuard
7. cmpAppShell (combines all above)

Build scrAccessDenied and scrNotFound after cmpErrorState and cmpAppHeader are complete.

---

## Batch 4 — Field Input Components (13 components)

Build in order: cmpFieldLabel → cmpRequiredIndicator → cmpTextInputField → cmpMultilineTextField → cmpChoiceField → cmpDateField → cmpNumberField → cmpCurrencyField → cmpYesNoField → cmpPeoplePicker → cmpLookupField → cmpReadOnlyField → cmpCalculatedFieldDisplay

---

## Batch 5 — Form Structure Components (8 components)

Build in order: cmpSectionHeader → cmpFormSection → cmpValidationSummary → cmpFormModeBanner → cmpUnsavedChangesBanner → cmpCanonicalRequestForm

---

## Batch 6 — Workflow Components (6 components)

Build: cmpApprovalCommentBox → cmpApprovalPanel → cmpApprovalHistory → cmpWorkflowTimeline → cmpAuditHistory → cmpWorkflowActionPanel

---

## Batch 7 — List and Dashboard Components (9 components)

Build: cmpSearchBox → cmpFilterPanel → cmpRequestCard → cmpRequestGallery → cmpRequestListToolbar → cmpPaginationOrLoadMore → cmpStatusSummaryCards → cmpDashboardSummary

---

## Batch 8 — Attachment and Data Components (4 components)

Build: cmpAttachmentPanel → cmpRelatedChildItems → cmpChecklistItems → cmpRelatedRecordCard

---

## Batch 9 — Canonical Screens (pilot forms first)

Build screens in order with AWHR as first pilot form:
1. scrHomeDashboard
2. scrDeptHub
3. scrFormList
4. scrNewRequest (AWHR)
5. scrEditDraft (AWHR)
6. scrViewRequest (AWHR)
7. scrApprovalProcess
8. scrMyRequests
9. scrAllRequestsAdmin

---

## Batch 10 — Testing and Validation

End-to-end workflow test (AWHR and CAR). Role boundary tests. SP write verification.

---

## Batch 11 — Expand to All Forms

Add remaining 359 forms to AppConfig. Batch test per dept.

---

## Batch 12 — UAT and Release

Per-dept UAT. Go-live checklist. Production deployment.
