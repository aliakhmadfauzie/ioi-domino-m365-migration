# Component Inventory

> All 53 Canvas App reusable components.
> Build status: DESIGNED / IN_PROGRESS / BUILT / TESTED
> Last updated: 2026-06-02

---

## Build Priority Legend

| Priority | Meaning |
|---|---|
| P1 — Build First | No SP dependency; needed before all other components |
| P2 — App Shell | Needed before any screen can render |
| P3 — Fields | Needed before any form screen |
| P4 — Form Structure | Needed before canonical form |
| P5 — Workflow | Needed before workflow screens |
| P6 — Lists | Needed before list/gallery screens |
| P7 — Data | Needed for editable gallery and attachment forms |
| P8 — Admin | Optional; build last |

---

## Category 1 — App Shell and Navigation (6 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 1 | cmpAppShell | P2 | Outer wrapper with nav + header + content slot | None | DESIGNED |
| 2 | cmpAppHeader | P2 | Top bar with logo, site, user name, notification badge | gblCurrentUser | DESIGNED |
| 3 | cmpSideNav | P2 | Side navigation with dept links and active highlight | None (props only) | DESIGNED |
| 4 | cmpBreadcrumb | P2 | Breadcrumb trail | None (props only) | DESIGNED |
| 5 | cmpCommandBar | P2 | Action buttons (Save Draft, Submit, Approve, etc.) | None (driven by props) | DESIGNED |
| 6 | cmpAccessGuard | P2 | Role check + redirect to scrAccessDenied | colUserRoleAssignments | DESIGNED |

---

## Category 2 — Feedback and State (6 components — Build First)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 7 | cmpLoadingState | P1 | Spinner + message | None | DESIGNED |
| 8 | cmpErrorState | P1 | Error message + retry | None | DESIGNED |
| 9 | cmpEmptyState | P1 | Empty gallery state + CTA | None | DESIGNED |
| 10 | cmpSuccessMessage | P1 | Transient success notification | None | DESIGNED |
| 11 | cmpConfirmDialog | P1 | Confirmation dialog for destructive actions | None | DESIGNED |
| 12 | cmpWarningBanner | P1 | Persistent warning banner | None | DESIGNED |

---

## Category 3 — List, Dashboard, and Card (8 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 13 | cmpStatusBadge | P2 | Status chip with color (accepts Status.Value strings) | None | DESIGNED |
| 14 | cmpRequestCard | P6 | Single request card (title, status, date, submitter) | None (props only) | DESIGNED |
| 15 | cmpRequestGallery | P6 | Scrollable gallery of request cards | colRequests collection | DESIGNED |
| 16 | cmpRequestListToolbar | P6 | Toolbar above gallery (sort, view toggle) | None | DESIGNED |
| 17 | cmpFilterPanel | P6 | Collapsible filter panel | colStatusOptions, colDeptOptions | DESIGNED |
| 18 | cmpSearchBox | P6 | Text search with clear | None | DESIGNED |
| 19 | cmpPaginationOrLoadMore | P6 | Load more button or page indicator | None | DESIGNED |
| 20 | cmpDashboardSummary | P6 | Dept/status summary | MainDB_ count queries | DESIGNED |
| 21 | cmpStatusSummaryCards | P6 | Row of status-count chips | colStatusCounts | DESIGNED |

---

## Category 4 — Form and Section (8 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 22 | cmpFieldLabel | P3 | Standardized field label | None | DESIGNED |
| 23 | cmpRequiredIndicator | P3 | Required asterisk | None | DESIGNED |
| 24 | cmpSectionHeader | P4 | Collapsible section title bar | None | DESIGNED |
| 25 | cmpFormSection | P4 | Section container with visibility | None (props drive visibility) | DESIGNED |
| 26 | cmpValidationSummary | P4 | Error message list | colValidationErrors | DESIGNED |
| 27 | cmpFormModeBanner | P4 | New/Edit/View/Approve mode indicator | None (gblFormMode) | DESIGNED |
| 28 | cmpUnsavedChangesBanner | P4 | Unsaved changes warning | None | DESIGNED |
| 29 | cmpCanonicalRequestForm | P4 | Master form container (orchestrates sections) | AppConfig_FormRules (optional) | DESIGNED |

---

## Category 5 — Field/Input (12 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 30 | cmpTextInputField | P3 | Single-line text input with label | None | DESIGNED |
| 31 | cmpMultilineTextField | P3 | Multi-line text area | None | DESIGNED |
| 32 | cmpChoiceField | P3 | Single-choice dropdown | Choice items from props | DESIGNED |
| 33 | cmpMultiChoiceField | P3 | Multi-select combo box | Choice items from props | DESIGNED |
| 34 | cmpDateField | P3 | Date picker with label | None | DESIGNED |
| 35 | cmpNumberField | P3 | Number input with label | None | DESIGNED |
| 36 | cmpCurrencyField | P3 | Currency input (RM prefix) | None | DESIGNED |
| 37 | cmpYesNoField | P3 | Yes/No toggle | None | DESIGNED |
| 38 | cmpPeoplePicker | P3 | Office365Users search and select | Office365Users connector | DESIGNED |
| 39 | cmpLookupField | P3 | SP lookup dropdown | Lookup SP list | DESIGNED |
| 40 | cmpReadOnlyField | P3 | Read-only label+value pair | None | DESIGNED |
| 41 | cmpCalculatedFieldDisplay | P3 | Computed/derived value display | Derived from other props | DESIGNED |

---

## Category 6 — Workflow and Approval (7 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 42 | cmpWorkflowActionPanel | P5 | Contextual action buttons (Approve, Reject, Return) | colWorkflowRules, gblUserRoles | DESIGNED |
| 43 | cmpApprovalPanel | P5 | Single approval stage display | None (props only) | DESIGNED |
| 44 | cmpApprovalCommentBox | P5 | Comment input for approval actions | None | DESIGNED |
| 45 | cmpApprovalHistory | P5 | History list from ApprovalHistory_{dept} | ApprovalHistory_{dept} | DESIGNED |
| 46 | cmpWorkflowTimeline | P5 | Visual step timeline | colWorkflowSteps (from history) | DESIGNED |
| 47 | cmpAuditHistory | P5 | Full audit log | ApprovalHistory_{dept} | DESIGNED |

---

## Category 7 — Attachment and Related Data (4 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 48 | cmpAttachmentPanel | P7 | Upload, view, delete attachments | SP Attachments or child list | DESIGNED |
| 49 | cmpRelatedChildItems | P7 | Editable gallery rows (JSON or child list mode) | child list or parent JSON field | DESIGNED |
| 50 | cmpChecklistItems | P7 | Checklist with check/uncheck | None or child list | DESIGNED |
| 51 | cmpRelatedRecordCard | P7 | Related record link card | Referenced SP list | DESIGNED |

---

## Category 8 — Admin (3 components)

| # | Component | Priority | Purpose | SP Dependency | Build Status |
|---|---|---|---|---|---|
| 52 | cmpAdminConfigPanel | P8 | Admin configuration management | All Config_ lists | DESIGNED — DO_NOT_BUILD_YET |
| 53 | cmpRoleMatrixViewer | P8 | Role matrix table viewer | Config_GlobalUserRoleAssignments | DESIGNED — DO_NOT_BUILD_YET |
| 54 | cmpReferenceDataManager | P8 | Config data CRUD | Config_ lists | DESIGNED — DO_NOT_BUILD_YET |
