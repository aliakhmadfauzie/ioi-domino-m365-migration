Now producing the full Canvas App Rebuild Design Report. This is a comprehensive design-only document — no files will be created or modified.

Canvas App Rebuild Design Report
Project: IOI Acidchem / Pan-Century — HCL Domino to Microsoft Power Apps Canvas App
Report Date: 2026-06-02
Status: DESIGN ONLY — Awaiting approval before any implementation

1. Executive Summary
TSX is Reference Only
The existing React/TypeScript app (ioicodeapp/powerapps-mirror/apps/ioi-platform) serves as a behavioral and layout reference. It will not be converted, extended, or deployed. All design decisions are built from the confirmed documentation sources and SharePoint schema, not from the TSX implementation.

Canvas App is the Target
The target platform is a Microsoft Power Apps Canvas App hosted against SharePoint Lists, using the Office365Users connector for identity and manager resolution.

Scale and Confirmed Scope
361 forms across 2 sites (Johor: 129 forms, Penang: 232 forms)
28+ departments: QA (80), QC (41), HR (37), PUR (29), SHE (29), IT (21), STR (20), and others
22,074 extracted fields from PDF sources
All 361 forms require approval workflows (3 have "Unknown" approval requirement — flagged as MISSING_INFO)
Two SharePoint list patterns: Standard form (single-record) and Editable gallery (parent + child rows)
Critical Architectural Decision: Hybrid Parameterized Form Approach
A Canvas App cannot have 361 form-specific screens (Power Apps limit: ~1,000 controls per screen; practical limit per app is ~500 screens). The recommended architecture uses:

~15 canonical parameterized screens driven by global context variables (gblActiveFormCode, gblActiveSite, gblActiveDept)
SharePoint EditForm/DisplayForm controls for auto-rendering field data from the bound SP list (handles field-level rendering without 22,074 manual control configurations)
Custom Canvas components layered over the native form for workflow panels, approval history, command bars, status badges, and access guards
Per-form field visibility and display-mode rules stored in a AppConfig_FormRules SharePoint list, loaded at app start
This hybrid approach makes the app maintainable across 361 forms without creating hundreds of nearly-identical screens.

Reusable Component Strategy
53 reusable Canvas components are designed before any screen work. Components are parameterized through input properties. No component duplicates business logic. Role and workflow state are passed in via props, not resolved inside components.

Missing Information (Critical)
All role assignments are marked "Needs Human Confirmation" in source documentation
SharePoint site URL is not confirmed
SharePoint internal column names are PDF-extracted only — not confirmed against deployed SP lists
3 forms have unknown approval requirements (Hardware Inventory, Employee Personal Health Record, Contractor/Vendor Agreement)
Recommended Next Step
Confirm the 5 items in Section 16 (Approval Needed) before any Canvas build begins.

2. Sources Reviewed
Source	Path	Status
TSX App Entry	ioicodeapp/powerapps-mirror/apps/ioi-platform/src/App.tsx	Reviewed
TSX Main Entry	ioicodeapp/powerapps-mirror/apps/ioi-platform/main.tsx	Reviewed
TSX Multi-Step Form	src/components/multi-step-form.tsx	Reviewed
TSX Detail Modal	src/components/detail-modal.tsx	Reviewed
TSX My Submissions View	src/components/my-submissions-view.tsx	Reviewed
TSX Route Modules	src/routes/it-routes, hr-routes, fin-routes, ...	Identified (not fully read)
TSX Page Files	src/pages/dashboard, approvals, my-submissions, admin, ...	Identified (not fully read)
Master Workflow Register	source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md	Fully reviewed (361 rows)
Master PowerApps Spec Register	source_analysis/10_master_app_sources/MASTER_POWERAPPS_SPEC_REGISTER.md	Fully reviewed (361 rows)
Master SharePoint Design Register	source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md	Reviewed (100 rows sampled)
Master Field Dictionary	source_analysis/10_master_app_sources/MASTER_FIELD_DICTIONARY.md	Reviewed (100 rows sampled of 22,074)
Master Role/Section Register	source_analysis/10_master_app_sources/MASTER_ROLE_SECTION_REGISTER.md	Reviewed (150 rows sampled)
Master App Source Coverage	source_analysis/10_master_app_sources/MASTER_APP_SOURCE_COVERAGE.md	Fully reviewed
Sample Requirements (CAR)	requirements/Johor/FIN/MASTER-002_PanCen_Capital_Appropriation_Request_CAR_SOURCES.md	Fully reviewed
Central Form Reference	central-form-reference.md	Not found at root — MISSING_INFO
UI Page Specification	design-requirement/ui-page-specification.md	Not read — MISSING_INFO
Data Source Mapping	field-mapping.md / field-mapping.csv	Identified — not fully read
SharePoint Schema Docs	sharepoint-list-design.md, Mastersharepoint design.md	Identified — not fully read
3. TSX-to-Canvas Reference Analysis
Table 3A: TSX File / Area Analysis
TSX File / Area	Purpose	Useful as Canvas Reference?	Logic Found	Translate to Canvas?	Ignore / Retire?	Notes
src/App.tsx	App entry, router, lazy-loaded pages, state providers (Jotai + TanStack Query)	Yes — screen list and navigation structure	Route → Page mapping for all departments; Init guard; Error boundary; Debug overlays	Yes — routes become Canvas screens; init logic becomes App.OnStart	Retire: Jotai, TanStack Query, Debug overlays, MockToggle, FeedbackWidget	20+ department route modules; maps to ~15 Canvas screens
src/pages/dashboard	KPI/summary dashboard	Yes — layout reference	Likely shows summary counts by status	Yes — scrHomeDashboard	No	Map to cmpDashboardSummary
src/pages/my-submissions	Current user's submissions across all forms	Yes — filter logic reference	Scoped by dept/module/form; status filter; search; navigate to detail	Yes — scrMyRequests	No	Uses SubmissionScope type — becomes gblSubmissionScope context var
src/pages/approvals	Pending approvals for current user	Yes	Role-based filtering of records needing action	Yes — part of scrApprovalProcess or cmpWorkflowActionPanel	No	Map to cmpApprovalPanel
src/pages/batch-approvals	Bulk approve/reject	Yes — pattern reference	Bulk action on multiple records	Yes — batch approval button in scrAllRequestsAdmin	No
src/pages/manager-dashboard	Manager view of team submissions	Yes	Manager-scoped data	Yes — filtered view in scrAllRequestsAdmin	No
src/pages/admin	Admin config/management	Yes	Form schema editor, workflow matrix	Yes — scrAdminConfig	No	Only if documented
src/pages/admin/workflow-matrix	Visual workflow matrix editor	Yes — pattern reference	Editable workflow state matrix	Partially — scrAdminConfig section	No
src/pages/admin/forms/index	Forms list management	Yes	Admin form catalog	Yes — scrAdminConfig	No
src/pages/admin/forms/editor	Per-form schema editor	Partially	Dynamic form schema editing	MISSING_INFO — no Canvas equivalent for dynamic schema editing	Retire	Canvas forms use SP list schema, not runtime schema editing
src/pages/not-found	404 page	Yes	Simple error display	Yes — scrNotFound	No	Map to cmpErrorState
src/pages/department-hub	Landing page — all departments	Yes — layout reference	Department grid/cards	Yes — scrHomeDashboard	No	Map to cmpDashboardSummary with dept filter
src/pages/field-worker	Simplified mobile submit	Yes — pattern reference	Reduced-UI quick submit	Yes — scrNewRequest in compact mode	No	Handled by Canvas responsive layout
src/pages/quick-submit	Quick submission entry	Yes	Simplified form entry	Yes — mode in scrNewRequest	No
src/pages/employee-directory	Employee directory	Yes — behavior reference	People search, profile display	Yes — built into cmpPeoplePicker	No	Use Office365Users connector
src/pages/settings	User preferences	Partially	Theme, notifications	MISSING_INFO	Partial retire	Not confirmed as Canvas requirement
src/components/multi-step-form.tsx	Multi-step form wizard	Yes — key pattern reference	Step navigation, field types (text, email, textarea, select, checkbox, date, number, file), validation	Yes — cmpCanonicalRequestForm section navigation	No	Field types map directly to Canvas control types
src/components/my-submissions-view.tsx	Submissions list with scope filtering	Yes — key pattern reference	Status filtering, search, scope (dept/module/form), navigation to detail; status color coding	Yes — cmpRequestGallery + cmpFilterPanel	No	SubmissionScope type → Canvas context variable
src/components/detail-modal.tsx	Record detail view	Yes — minimal stub	FieldGroup type for grouping	Yes — cmpFormSection	No	Currently a placeholder returning null
src/components/loading-screen.tsx	Loading state display	Yes	Message, description, variant, progress	Yes — cmpLoadingState	No
src/components/employee-picker.tsx	People search and select	Yes — key pattern reference	Search Office365 users, display name/photo	Yes — cmpPeoplePicker using Office365Users connector	No
src/components/delegation-dialog.tsx	Workflow delegation	Yes — pattern reference	Delegate action to another person	Yes — cmpWorkflowActionPanel (delegate action)	No
src/components/escalation-monitor.tsx	SLA/escalation tracking	Partially	Escalation threshold monitoring	MISSING_INFO — not confirmed in Canvas scope	Note	Mark as RISK if SLA rules not documented
src/components/form-navigation-dialog.tsx	Dialog for form section navigation	Yes — layout reference	Form section list in dialog	Yes — cmpFormSection navigation	No
src/components/global-search.tsx	Cross-form search	Yes — behavior reference	Search across all forms/depts	Yes — cmpSearchBox with global scope	No
src/components/debug-overlay.tsx	Debug tooling	No	Dev tool only	Retire	Yes	Not needed in Canvas
src/components/database-table.tsx	Tabular data display	Yes — pattern reference	Sortable table with columns	Yes — cmpRequestGallery in table mode	No	Canvas Gallery replaces HTML table
src/components/mobile-bottom-nav.tsx	Mobile navigation bar	Yes — layout reference	Mobile-first bottom nav	Yes — handled by Canvas mobile layout / cmpSideNav	No
src/components/ui/*	shadcn/ui primitives (badge, button, card, etc.)	Yes — design language reference	Standard UI controls	Yes — map to modern Canvas controls + custom components	No	Badge→cmpStatusBadge; Button→Canvas Button; Card→cmpRequestCard; Input→cmpTextInputField; etc.
src/components/system/error-boundary.tsx	React error boundary	Yes — behavior reference	Error catch + retry UI	Yes — cmpErrorState	No	Canvas uses OnError property
src/components/layouts/standalone-layout.tsx	Page layout wrapper	Yes — layout reference	Shell with nav, header, content area	Yes — cmpAppShell	No
src/routes/it-routes, hr-routes, ...	Department route definitions	Yes — form catalog reference	Per-dept form list, form page paths	Yes — drives AppConfig_FormRules SP list	No	20+ route modules = 20+ dept groupings
src/components/workflow/edit-request-indicator.tsx	Workflow edit request badge	Yes	Shows active edit request state	Yes — cmpStatusBadge with editRequest variant	No	hasActiveEditRequest, isSubmissionEditable hooks → Power Fx status checks
src/pages/engineering/forms/[formCode]/index.tsx	Dynamic per-form page (engineering)	Yes — key canonical pattern	FormCode-driven dynamic page rendering	Yes — this is the canonical pattern: one screen + gblActiveFormCode	No	Same pattern used for /security, /training dept pages
Table 3B: TSX Logic Type → Canvas Equivalent
TSX Logic Type	Can Translate to Canvas?	Canvas Equivalent	Notes
React Router HashRouter navigation	Yes	Navigate(scrTargetScreen) + context variables	No URL routing in Canvas; screen navigation is imperative
Lazy-loaded page components (lazy())	N/A	Canvas loads all screens; use Visible and OnVisible for lazy-load simulation	Not applicable — Canvas loads all screens
Jotai atom global state	Yes	Global variables (gbl*) + Named formulas	Set(gblActiveFormCode, "CAR")
TanStack Query data fetching	Yes	ClearCollect(colRequests, MainDB_FIN) in OnVisible	Patch/Gallery replaces useQuery/useMutation
React Hook Form validation	Yes	Power Fx formula in OnSelect before Patch; IsBlank(), IsMatch(), custom validation vars	Validation results stored in locValidationErrors context var
Zod schema validation	Yes	Power Fx IsMatch(), IsNumeric(), custom If() chains	No runtime schema object — each field has its own formula
shadcn/ui Badge	Yes	cmpStatusBadge component
shadcn/ui Button	Yes	Canvas Modern Button control
shadcn/ui Card	Yes	cmpRequestCard component
shadcn/ui Select/Dropdown	Yes	Canvas Modern Dropdown or DropDown control
shadcn/ui Calendar/DatePicker	Yes	Canvas DatePicker control
shadcn/ui Input/Textarea	Yes	Canvas TextInput / Canvas TextInput (multiline)
shadcn/ui Checkbox	Yes	Canvas Check Box or Toggle control
shadcn/ui Skeleton (loading)	Yes	cmpLoadingState component (visible while collection loading)
shadcn/ui Empty state	Yes	cmpEmptyState component
Lucide icons	Partial	Canvas Icon control + Fluent UI icons via modern controls	Not all Lucide icons available; use closest match
framer-motion animations	No	Canvas transitions via Animate (limited)	Canvas has limited animation support
react-router useNavigate	Yes	Navigate(scrTarget)
useUser() hook	Yes	Office365Users.MyProfile() loaded in App.OnStart → gblCurrentUser
useMainDBITList() generated hook	Yes	ClearCollect(colRequests, Filter(MainDB_IT, FormCode = gblActiveFormCode))	Each dept has its own SP data source; use Filter by FormCode
TanStack Query cache invalidation	Yes	Clear(colRequests); ClearCollect(colRequests, ...)	Manual refresh via Refresh button or OnVisible
hasActiveEditRequest()	Yes	CountIf(colEditRequests, ParentID = selectedRecord.ID, Status = "Active") > 0	Power Fx count formula
isSubmissionEditable()	Yes	Power Fx formula: gblCurrentUser.Mail = selectedRecord.SubmitterEmail And selectedRecord.Status = "Draft"
SubmissionScope type	Yes	gblSubmissionScope global variable + gblActiveDept, gblActiveModule, gblActiveFormCode
ErrorBoundary component	Yes	OnError app property + cmpErrorState screen/component
Suspense / fallback	Yes	cmpLoadingState visible while IsBlank(colRequests)
QueryClientProvider	N/A	Replaced by Canvas data sources + ClearCollect pattern
JotaiProvider	N/A	Replaced by Canvas global variables
Mock toggle / debug overlay	No	Not needed in Canvas	Retire completely
Feedback widget	Partial	MISSING_INFO — confirm if bug tracker needed in Canvas app
CanonicalSubmissionDetailRedirect	Yes	Navigate logic in App.OnStart or screen OnVisible with ID parameter
Batch approvals logic	Yes	ForAll loop with Patch in cmpApprovalPanel
Employee picker (Office365 search)	Yes	Office365Users.SearchUser({searchTerm: txtSearch.Text}).value in cmpPeoplePicker
Table 3C: TSX Component Reference
TSX Component	File Path	Purpose	Reusable Pattern Found	Canvas Component Equivalent	Reuse Recommendation	Notes
App (root)	src/App.tsx	App shell, routing, providers	Yes — shell pattern	cmpAppShell	Canonical — build first	Init logic → App.OnStart
DepartmentHubPage	src/pages/department-hub	Department selector landing page	Yes — grid of dept cards	scrHomeDashboard + cmpDashboardSummary	Build as screen
MySubmissionsView	src/components/my-submissions-view.tsx	Scoped submissions list	Yes — key reusable	cmpRequestGallery + cmpFilterPanel	Canonical gallery	Status color map → cmpStatusBadge
MultiStepForm	src/components/multi-step-form.tsx	Wizard-style multi-section form	Yes — section navigation	cmpCanonicalRequestForm	Canonical form	Step types map to Canvas sections
DetailModal	src/components/detail-modal.tsx	Record detail viewer	Minimal stub	cmpFormSection (view mode)	Use cmpFormSection	Currently returns null
LoadingScreen	src/components/loading-screen.tsx	Full-screen loading state	Yes	cmpLoadingState	Standard
EmployeePicker	src/components/employee-picker.tsx	Office365 people search	Yes	cmpPeoplePicker	Standard	Office365Users connector
DelegationDialog	src/components/delegation-dialog.tsx	Delegate workflow action	Yes	cmpWorkflowActionPanel (delegate)	Extend cmpWorkflowActionPanel
EscalationMonitor	src/components/escalation-monitor.tsx	SLA escalation tracking	Partial	MISSING_INFO	Defer	Not confirmed in scope
FormNavigationDialog	src/components/form-navigation-dialog.tsx	Section jump navigation	Yes	cmpFormSection header navigation	Extend cmpFormSection
GlobalSearch	src/components/global-search.tsx	Cross-form search	Yes	cmpSearchBox (global mode)	Extend cmpSearchBox
DatabaseTable	src/components/database-table.tsx	Tabular data display	Yes	cmpRequestGallery (table layout)	Gallery variant
MobileBottomNav	src/components/mobile-bottom-nav.tsx	Mobile navigation	Yes	cmpSideNav (mobile variant)	Responsive variant
EditRequestIndicator	src/components/workflow/edit-request-indicator.tsx	Edit lock badge	Yes	cmpStatusBadge (edit-request variant)	Extend cmpStatusBadge
ErrorBoundary	src/components/system/error-boundary.tsx	Error catch + retry	Yes	cmpErrorState	Standard
shadcn Badge	src/components/ui/badge.tsx	Status/tag display	Yes	cmpStatusBadge	Standard
shadcn Button	src/components/ui/button.tsx	Action button	Yes	Canvas Modern Button	Use native control
shadcn Card	src/components/ui/card.tsx	Content container	Yes	cmpRequestCard	Standard
shadcn Empty	src/components/ui/empty.tsx	Empty state	Yes	cmpEmptyState	Standard
shadcn Skeleton	src/components/ui/skeleton.tsx	Loading placeholder	Yes	cmpLoadingState	Standard
SectionRenderer	src/components/dynamic-form/SectionRenderer.tsx	Dynamic section render	Yes — key canonical	cmpFormSection	Canonical	Most important pattern for parameterized forms
HrBreadcrumb	src/components/hr/hr-breadcrumb.tsx	HR-specific breadcrumb	Partial	cmpBreadcrumb (with dept param)	Parameterize cmpBreadcrumb
IT MultiStagFormView	src/components/it/multi-stage-form-view.tsx	IT multi-stage approval view	Yes	cmpWorkflowTimeline	Extend
DebugCurrentScreen	src/components/debug/DebugCurrentScreen.tsx	Dev debug	No	Retire	Yes
DebugIssues	src/components/debug/DebugIssues.tsx	Dev debug	No	Retire	Yes
DebugReadSources	src/components/debug/DebugReadSources.tsx	Dev debug	No	Retire	Yes
DebugRuntimeLog	src/components/debug/DebugRuntimeLog.tsx	Dev debug	No	Retire	Yes
DebugSchemaComparison	src/components/debug/DebugSchemaComparison.tsx	Dev debug	No	Retire	Yes
DebugWriteActions	src/components/debug/DebugWriteActions.tsx	Dev debug	No	Retire	Yes
MockToggle	src/components/mock-toggle/MockToggle.tsx	Dev mock data toggle	No	Retire	Yes
ig-bento-card	src/components/layout/ig-bento-card.tsx	Bento-style card layout	Yes — layout reference	cmpRequestCard (bento variant)	Extend cmpRequestCard
ig-footer-bar	src/components/layout/ig-footer-bar.tsx	Footer bar	Partial	cmpAppShell (footer)	Integrate into cmpAppShell
ig-page-header	src/components/layout/ig-page-header.tsx	Page header	Yes	cmpAppHeader	Standard
ig-sidenav	src/components/layout/ig-sidenav.tsx	Side navigation	Yes	cmpSideNav	Standard
ig-topbar	src/components/layout/ig-topbar.tsx	Top bar	Yes	cmpAppHeader	Combine with cmpAppHeader
department-layout	src/components/layouts/department-layout.tsx	Per-department layout	Yes	cmpAppShell (with dept context)	Parameterize cmpAppShell
4. Canvas Screen Inventory
The Canvas App uses ~15 canonical parameterized screens. Screens are driven by global context variables, not by form-specific navigation paths. One screen handles multiple forms/departments.

Canvas Screen	Purpose	Equivalent TSX Reference	Roles Allowed	Workflow States Supported	Reads From	Writes To	Main Controls	Components Used	Buttons / Actions	Validation Required	Loading / Error / Empty Behavior	Notes
scrHomeDashboard	App landing page. Department selector, site switcher, summary KPI counts for current user	pages/department-hub, pages/dashboard	All authenticated users	All	AppConfig_Forms (list of all forms), all MainDB_ lists (count only)	None	Site switcher toggle; Dept card gallery; My pending count label; Notification indicator	cmpAppShell, cmpAppHeader, cmpSideNav, cmpDashboardSummary, cmpStatusSummaryCards, cmpRequestCard (dept cards)	View My Submissions; View All (admin); New Request; Switch Site	None	Loading: cmpLoadingState while App.OnStart runs; Error: cmpErrorState if user profile fails; Empty: N/A	gblActiveSite toggles between Johor/Penang. gblCurrentUser loaded from Office365Users.MyProfile()
scrMyRequests	Current user's submissions across all forms, filterable by department/form/status	pages/my-submissions, components/my-submissions-view.tsx	All authenticated users (own records only)	Draft, Submitted, In Review, Approved, Rejected, Completed	MainDB_{DEPT} filtered by SubmittedBy = gblCurrentUser.Mail	None	Search box; Status filter; Dept filter; Gallery of cards	cmpAppShell, cmpSideNav, cmpSearchBox, cmpFilterPanel, cmpRequestGallery, cmpStatusBadge, cmpEmptyState, cmpLoadingState	View Detail; Continue Draft; Copy; Withdraw (if Draft)	None	Loading: cmpLoadingState; Empty: cmpEmptyState with "No submissions found"; Error: cmpErrorState	Scope driven by gblSubmissionScope variable
scrAllRequestsAdmin	All requests view for managers, HOD, and admin roles. Full cross-user list with advanced filters	pages/manager-dashboard, pages/batch-approvals	MISSING_INFO (HOD, Manager, Admin roles — needs role confirmation)	All	All MainDB_{DEPT} for gblActiveSite	None (list only; actions navigate to detail)	Search; Dept filter; Status filter; Date range; User filter; Gallery or table toggle	cmpAppShell, cmpSideNav, cmpSearchBox, cmpFilterPanel, cmpRequestListToolbar, cmpRequestGallery, cmpStatusBadge, cmpPaginationOrLoadMore	View Detail; Batch Approve; Batch Reject; Export (MISSING_INFO)	None	Loading: cmpLoadingState; Empty: cmpEmptyState; Error: cmpErrorState	Pagination required — up to 22K records. Use delegation-safe filters (status, date, person columns).
scrNewRequest	Create a new form submission. Mode = New	pages/quick-submit, dynamic form pages pages/*/forms/[formCode]	MISSING_INFO (submitter role per form)	New → Draft (auto-save)	AppConfig_FormRules (field visibility, section config); AppConfig_ChoiceLists (choice field options)	MainDB_{gblActiveDept} (Patch new record)	Form section navigator; EditForm or field components; Command bar	cmpAppShell, cmpCommandBar, cmpCanonicalRequestForm, cmpFormSection, cmpSectionHeader, cmpValidationSummary, cmpFormModeBanner, cmpRequiredIndicator, cmpWorkflowActionPanel (Submit button)	Save Draft; Submit; Cancel	Yes — all required fields per form config	Loading: cmpLoadingState while form config loads; Empty: N/A; Error: cmpErrorState + cmpValidationSummary	gblActiveFormCode determines which form is shown. Form uses SP EditForm control bound to MainDB_{dept}
scrEditDraft	Edit an existing Draft record. Mode = Edit	Dynamic form pages	MISSING_INFO (submitter + edit-allowed roles)	Draft only (editable); Submitted onwards = read-only redirect to scrViewRequest	MainDB_{gblActiveDept} (Filter by ID = gblActiveRecordID)	MainDB_{gblActiveDept} (Patch update)	Same as scrNewRequest	cmpAppShell, cmpCommandBar, cmpCanonicalRequestForm, cmpFormSection, cmpValidationSummary, cmpUnsavedChangesBanner, cmpWorkflowActionPanel	Save; Submit; Discard Changes; Cancel	Yes — same as scrNewRequest	Loading: cmpLoadingState; Error: cmpErrorState; Empty: redirect if record not found	If record status ≠ Draft, redirect to scrViewRequest. Edit requests (post-submit edits) handled via cmpWorkflowActionPanel
scrViewRequest	Read-only view of a submitted/approved record. Shows all sections, workflow history, attachments	components/detail-modal.tsx, components/it/multi-stage-form-view.tsx	All roles (own record) + MISSING_INFO (approver roles)	All post-Draft states	MainDB_{gblActiveDept} (single record by ID); MainDB_{gblActiveDept}WorkflowHistory; MainDB{gblActiveDept}Ext{formcode}_Rows (if child list exists)	None (read-only base view; action writes go through cmpWorkflowActionPanel)	All form sections in read-only mode; Workflow timeline; Attachment viewer; Action panel for approvers	cmpAppShell, cmpCommandBar, cmpCanonicalRequestForm (view mode), cmpFormSection, cmpWorkflowTimeline, cmpApprovalHistory, cmpStatusBadge, cmpAttachmentPanel, cmpWorkflowActionPanel, cmpRelatedChildItems (if editable gallery form)	Approve; Reject; Verify; Return for Edit; Request Edit; Print; Close	Conditional (comment required for Reject)	Loading: cmpLoadingState; Error: cmpErrorState; Empty: N/A	DisplayMode controlled by propFormMode = "View" or "Approve" passed to cmpCanonicalRequestForm
scrApprovalProcess	Dedicated approval workspace. Shows pending items for current user as approver, with inline approve/reject	pages/approvals	MISSING_INFO (approver roles — HOD, COO, Director, Verifier, etc.)	Submitted, In HOD Review, In Verification, etc. (all states awaiting action)	All MainDB_{DEPT} filtered by CA (CurrentAction) = gblCurrentUser role identifier	MainDB_{DEPT} (Patch status + approval fields); MainDB_{DEPT}_WorkflowHistory (new record)	Pending list gallery; Inline detail panel; Approve/Reject buttons; Batch controls	cmpAppShell, cmpSideNav, cmpRequestGallery, cmpApprovalPanel, cmpApprovalCommentBox, cmpStatusBadge, cmpLoadingState, cmpEmptyState	Approve; Reject; Return; Delegate; View Full Record	Yes — comment required for Reject; MISSING_INFO for Verify-specific rules	Loading: cmpLoadingState; Empty: "No pending approvals" via cmpEmptyState; Error: cmpErrorState	CA field in SP = "CurrentAction" role token per form. Requires confirmed role tokens from role matrix (MISSING_INFO)
scrWorkflowHistory	Read-only workflow audit timeline for a specific record	Referenced in TSX multi-stage view	All authenticated users who can see the record	All	MainDB_{DEPT}_WorkflowHistory (filtered by ParentID)	None	Timeline list	cmpAppShell, cmpWorkflowTimeline, cmpAuditHistory, cmpLoadingState, cmpEmptyState	Back to Record	None	Loading: cmpLoadingState; Empty: "No history" via cmpEmptyState; Error: cmpErrorState	May be embedded in scrViewRequest as a section rather than a standalone screen — confirm with user
scrAttachments	Attachment management for a record	Referenced in app	All roles who can see the record	All	SharePoint List Attachments (native SP attachment API via Power Automate or SP connector)	SharePoint attachment upload	Attachment gallery; Upload button; Delete button (owner only)	cmpAppShell, cmpAttachmentPanel, cmpLoadingState, cmpEmptyState	Upload; Delete; Download; Back	None for view; File type/size validation for upload	Loading: cmpLoadingState; Empty: "No attachments"; Error: cmpErrorState	Attachments use SP native attachment feature or a separate Attachments child list. Confirm SP attachment approach (MISSING_INFO)
scrAdminConfig	Admin-only screen for app configuration, role management, workflow rules, reference data	pages/admin, pages/admin/workflow-matrix, pages/admin/forms	MISSING_INFO (IT Admin / App Admin role only)	N/A	AppConfig_FormRules; AppConfig_Roles; AppConfig_ChoiceLists; AppConfig_WorkflowRules	All AppConfig_ lists	Config tabs; Role matrix viewer; Form rules editor; Reference data manager	cmpAppShell, cmpAdminConfigPanel, cmpRoleMatrixViewer, cmpReferenceDataManager, cmpCommandBar	Save Config; Reset; Back	Yes — admin validation before save	Loading: cmpLoadingState; Error: cmpErrorState; Empty: N/A	Only if AppConfig lists are used. If config is hardcoded, this screen is retired. MISSING_INFO
scrAccessDenied	Access denied for unauthorized users	No equivalent TSX screen (handled by redirect)	All	N/A	None	None	Error illustration; Message; Sign-out button	cmpErrorState, cmpAppHeader	Sign Out; Go to Home	None	N/A	Shown when cmpAccessGuard determines the user has no valid role for the current screen/form
scrNotFound	Invalid navigation / record not found	pages/not-found	All	N/A	None	None	Error message; Back button	cmpErrorState	Go to Home	None	N/A
scrDeptHub	Department-level landing page showing all forms for one department	pages/department-hub (per-dept variant)	All authenticated users with access to that dept	N/A	AppConfig_Forms filtered by Dept = gblActiveDept	None	Form card gallery; My pending count; Last activity	cmpAppShell, cmpSideNav, cmpRequestCard, cmpStatusSummaryCards, cmpSearchBox, cmpEmptyState	Open Form List; New Submission; View All	None	Loading: cmpLoadingState; Empty: cmpEmptyState; Error: cmpErrorState	One screen, parameterized by gblActiveDept. Replaces 20+ TSX department route modules
scrFormList	List of all submissions for a specific form code. The main "database view" per form	Dynamic form pages	MISSING_INFO (all roles with form access)	All	MainDB_{gblActiveDept} filtered by FormCode = gblActiveFormCode	None (list only)	Search; Filter; Status filter; Gallery/table	cmpAppShell, cmpCommandBar, cmpRequestListToolbar, cmpSearchBox, cmpFilterPanel, cmpRequestGallery, cmpPaginationOrLoadMore, cmpStatusBadge, cmpEmptyState	New; View; Edit (if Draft); Export (MISSING_INFO)	None	Loading: cmpLoadingState; Empty: cmpEmptyState; Error: cmpErrorState	One canonical list screen for all 361 forms. gblActiveFormCode drives the filter and column set
scrHelp	Help and documentation	pages/help	All	N/A	AppConfig_HelpContent (MISSING_INFO — confirm if help list exists)	None	Accordion FAQ; Contact; Links	cmpAppShell, cmpEmptyState	Back	None	Loading: minimal	MISSING_INFO — confirm if help content is needed
5. Canvas Reusable Component Architecture
Component Decision Table
UI Pattern / Need	Existing TSX Pattern?	Canvas Component Needed?	Recommended Component	Reason
App shell wrapper (nav + header + content area)	Yes — standalone-layout.tsx, department-layout.tsx	Yes	cmpAppShell	All screens share shell
Top application header	Yes — ig-topbar, ig-page-header	Yes	cmpAppHeader	Site logo, user name, notification bell
Side navigation	Yes — ig-sidenav	Yes	cmpSideNav	Department/section navigation
Breadcrumb trail	Yes — hr-breadcrumb (dept-specific)	Yes	cmpBreadcrumb	All detail screens need breadcrumb
Action command bar (Save, Submit, etc.)	Yes — CommandBar pattern in forms	Yes	cmpCommandBar	All form screens
Role-based access guard	Yes — init guard in App.tsx	Yes	cmpAccessGuard	Every screen needs access control
Dashboard KPI counts	Yes — dashboard page	Yes	cmpDashboardSummary	Landing screen
Status count cards (by status)	Yes — dashboard	Yes	cmpStatusSummaryCards	Dashboard + dept hub
Request item card	Yes — submission cards in my-submissions	Yes	cmpRequestCard	Gallery items
Gallery of requests with scroll	Yes — my-submissions-view	Yes	cmpRequestGallery	All list screens
Gallery toolbar (column config, etc.)	Yes — admin forms list	Yes	cmpRequestListToolbar	Admin + list screens
Filter panel	Yes — filter in my-submissions-view	Yes	cmpFilterPanel	All list/gallery screens
Search box	Yes — global-search	Yes	cmpSearchBox	All screens
Pagination / load more	Partially — implied by gallery	Yes	cmpPaginationOrLoadMore	All galleries
Canonical form shell	Yes — multi-step-form	Yes	cmpCanonicalRequestForm	All form screens
Collapsible form section	Yes — SectionRenderer	Yes	cmpFormSection	All form sections
Section header (title + collapse)	Yes — implied in form sections	Yes	cmpSectionHeader	All sections
Field label display	Yes — shadcn Label	Yes	cmpFieldLabel	All form fields
Required asterisk indicator	Yes — implied in forms	Yes	cmpRequiredIndicator	All required fields
Validation error summary	Yes — form validation	Yes	cmpValidationSummary	All forms
Form mode indicator (New/Edit/View/Approval)	Yes — FormModeBanner implied	Yes	cmpFormModeBanner	All form screens
Unsaved changes warning	Yes — implied	Yes	cmpUnsavedChangesBanner	Edit/New forms
Single-line text input with label	Yes — Input + Label	Yes	cmpTextInputField	All forms
Multi-line text input	Yes — Textarea	Yes	cmpMultilineTextField	All forms
Single-choice dropdown	Yes — Select	Yes	cmpChoiceField	All forms
Multi-choice select	Yes — multi-select pattern	Yes	cmpMultiChoiceField	All forms
Date picker	Yes — Calendar/DatePicker	Yes	cmpDateField	All forms
Number input	Yes — Input type=number	Yes	cmpNumberField	All forms
Currency input	Yes — implied	Yes	cmpCurrencyField	Financial forms
Yes/No toggle	Yes — Checkbox	Yes	cmpYesNoField	All forms
People picker (Office365)	Yes — employee-picker	Yes	cmpPeoplePicker	All forms with person fields
Lookup field (SP lookup)	Partially	Yes	cmpLookupField	SP lookup columns
Read-only field display	Yes — view mode	Yes	cmpReadOnlyField	View mode, all forms
Calculated/derived field display	Partial	Yes	cmpCalculatedFieldDisplay	Financial, date-derived fields
Status badge / chip	Yes — shadcn Badge	Yes	cmpStatusBadge	All galleries and headers
Workflow action buttons panel	Yes — delegation-dialog, multi-stage	Yes	cmpWorkflowActionPanel	scrViewRequest, scrApprovalProcess
Approval section (approver name, date, comment)	Yes — multi-stage-form-view	Yes	cmpApprovalPanel	All approval forms
Approval history log list	Yes — multi-stage-form-view	Yes	cmpApprovalHistory	scrViewRequest
Approver comment text area	Yes — delegation-dialog	Yes	cmpApprovalCommentBox	scrApprovalProcess
Workflow timeline (visual steps)	Yes — multi-stage-form-view	Yes	cmpWorkflowTimeline	scrViewRequest
Audit history log	Yes — implied	Yes	cmpAuditHistory	scrViewRequest
Attachment upload/view	Partially	Yes	cmpAttachmentPanel	All forms with attachments
Child row editable gallery	Yes — database-table, SectionRenderer	Yes	cmpRelatedChildItems	Editable gallery candidate forms
Checklist items	Partially	Yes	cmpChecklistItems	Inspection/checklist forms
Related record card	Partially	Yes	cmpRelatedRecordCard	Cross-list lookups
Loading spinner/state	Yes — loading-screen	Yes	cmpLoadingState	All screens
Error state display	Yes — error-boundary	Yes	cmpErrorState	All screens
Empty state display	Yes — shadcn Empty	Yes	cmpEmptyState	All galleries
Success notification	Yes — Toaster	Yes	cmpSuccessMessage	After save/submit
Confirm dialog	Yes — alert-dialog	Yes	cmpConfirmDialog	Destructive actions
Warning banner	Yes — alert	Yes	cmpWarningBanner	Draft/validation states
Admin config panel	Yes — admin page	Yes (conditional)	cmpAdminConfigPanel	scrAdminConfig only
Role matrix viewer	Yes — workflow-matrix page	Yes (conditional)	cmpRoleMatrixViewer	scrAdminConfig only
Reference data manager	Yes — forms admin page	Yes (conditional)	cmpReferenceDataManager	scrAdminConfig only
Component Architecture Summary Table
Component	Category	Purpose	Use When	Do Not Use When	Role Dependency	Workflow Dependency	Data Source Dependency	Used On Screens
cmpAppShell	App Shell	Outer wrapper with nav, header, content slot	Every screen	Never — always use	All roles	None	None	All screens
cmpAppHeader	App Shell	Top bar with logo, site name, user menu, notifications	Every screen (inside cmpAppShell)	Standalone components	All roles	None	gblCurrentUser	All screens
cmpSideNav	App Shell	Side navigation with department/screen links	All main screens	Embedded components	All roles	None	gblActiveDept, gblActiveFormCode	All main screens
cmpBreadcrumb	App Shell	Breadcrumb trail showing current navigation path	Any screen with depth > 1	Root screens	All roles	None	gblNavPath	All form and list screens
cmpCommandBar	App Shell	Top action bar with primary/secondary action buttons	All form and list screens	Dashboard and standalone info screens	Role-dependent (controls button visibility)	Status-dependent	None (props only)	scrNewRequest, scrEditDraft, scrViewRequest, scrFormList, scrAllRequestsAdmin
cmpAccessGuard	App Shell	Evaluates current role + form code and blocks/allows access	Every screen OnVisible	Never retire	All roles (evaluates role)	None	AppConfig_Roles, gblCurrentUser, gblRoles	All screens
cmpDashboardSummary	Dashboard	Count summaries by dept, status, pending actions	scrHomeDashboard, scrDeptHub	Detailed list screens	All roles	None	All MainDB_ (count only)	scrHomeDashboard, scrDeptHub
cmpStatusSummaryCards	Dashboard	Row of status-count chips (Draft, Submitted, Approved, etc.)	Dashboard and dept hub	Form detail screens	All roles	All workflow states	MainDB_ (filtered count)	scrHomeDashboard, scrDeptHub, scrMyRequests
cmpRequestCard	List/Dashboard	Single request item card with title, status badge, date, submitter	Gallery items in any gallery	Table-view mode (use gallery directly)	All roles	All states	None (props only)	scrMyRequests, scrAllRequestsAdmin, scrFormList, scrDeptHub
cmpRequestGallery	List/Dashboard	Scrollable gallery of request cards	All list screens	Single record view screens	All roles	All states	MainDB_ collections	scrMyRequests, scrAllRequestsAdmin, scrFormList, scrApprovalProcess
cmpRequestListToolbar	List/Dashboard	Toolbar above gallery: view toggle, sort, column select	Admin and list screens	Mobile-only simplified views	Admin/HOD roles	None	None (props only)	scrAllRequestsAdmin, scrFormList
cmpFilterPanel	List/Dashboard	Collapsible filter panel (status, dept, date, person)	All gallery/list screens	Single-record views	All roles	All states	AppConfig_ChoiceLists (status values)	scrMyRequests, scrAllRequestsAdmin, scrFormList, scrApprovalProcess
cmpSearchBox	List/Dashboard	Text search input with clear button	All list and dashboard screens	Read-only form view sections	All roles	None	None (props only)	All list screens
cmpPaginationOrLoadMore	List/Dashboard	Load more button or page count indicator	All galleries with >50 records	Short lists	All roles	None	None (props only)	scrMyRequests, scrAllRequestsAdmin, scrFormList
cmpCanonicalRequestForm	Form	Main form container. Renders form sections in sequence. Controls mode (New/Edit/View/Approve)	All form screens	Dashboard and list screens	Role-dependent (mode control)	Status-dependent (mode control)	AppConfig_FormRules, MainDB_{dept}	scrNewRequest, scrEditDraft, scrViewRequest
cmpFormSection	Form	Single collapsible form section with header and field slot	Inside cmpCanonicalRequestForm	Outside of form context	None — receives mode from parent	None — receives mode from parent	AppConfig_FormRules (visible/editable)	scrNewRequest, scrEditDraft, scrViewRequest
cmpSectionHeader	Form	Section title bar with collapse toggle and section count	Inside cmpFormSection	Standalone	None	None	None (props only)	Inside cmpFormSection
cmpFieldLabel	Form	Standardized field label with optional required indicator	All form fields	Read-only display labels	None	None	None (props only)	All field components
cmpRequiredIndicator	Form	Red asterisk indicator for required fields	Required fields only	Optional fields	None	None	None (props only)	Inside cmpFieldLabel
cmpValidationSummary	Form	List of validation error messages	Above save/submit buttons	View-only screens	None	None	locValidationErrors collection	scrNewRequest, scrEditDraft
cmpFormModeBanner	Form	Banner indicating current form mode (New/Edit/View/Approval)	All form screens	Dashboard and list screens	None	All states	None (props only)	scrNewRequest, scrEditDraft, scrViewRequest
cmpUnsavedChangesBanner	Form	Warning banner when there are unsaved changes	New/Edit mode only	View mode	None	Draft state only	None (props only)	scrNewRequest, scrEditDraft
cmpTextInputField	Field	Single-line text input with label and validation	All single-line text fields	Multi-line text	None	DisplayMode from parent form	None (props only)	All form screens
cmpMultilineTextField	Field	Multi-line text area with label and validation	All multi-line text fields	Single-line fields	None	DisplayMode from parent form	None (props only)	All form screens
cmpChoiceField	Field	Single-choice dropdown with label	Choice/Select fields	Multi-select fields	None	DisplayMode from parent form	AppConfig_ChoiceLists	All form screens
cmpMultiChoiceField	Field	Multi-select combo box with label	Multi-select choice fields	Single-select fields	None	DisplayMode from parent form	AppConfig_ChoiceLists	All form screens
cmpDateField	Field	Date picker with label and formatted display	All date fields	Date+time (use separate control)	None	DisplayMode from parent form	None (props only)	All form screens
cmpNumberField	Field	Number input with label and optional unit	Integer/decimal number fields	Currency (use cmpCurrencyField)	None	DisplayMode from parent form	None (props only)	All form screens
cmpCurrencyField	Field	Currency input with RM prefix and label	Financial amount fields (RM)	Non-currency numbers	None	DisplayMode from parent form	None (props only)	FIN form screens (CAR, CMF, etc.)
cmpYesNoField	Field	Yes/No toggle or checkbox with label	Boolean/Yes-No fields	Multi-option choices	None	DisplayMode from parent form	None (props only)	All form screens
cmpPeoplePicker	Field	Office365Users search with name/photo display	All Person/User fields	Text-only fields	None	DisplayMode from parent form	Office365Users connector	All form screens with person fields
cmpLookupField	Field	SP lookup dropdown or combo	SharePoint Lookup columns	Text fields	None	DisplayMode from parent form	Referenced SP list	All form screens with lookup columns
cmpReadOnlyField	Field	Read-only label+value display pair	All fields in View mode	Edit/New mode (use specific input component)	None	View mode only	None (props only)	scrViewRequest, approval sections
cmpCalculatedFieldDisplay	Field	Display of a computed/derived value	Calculated totals, auto-populated dates, derived values	Editable fields	None	View or auto-computed	Derived from other field values	FIN/QA/PRD form screens
cmpStatusBadge	Workflow	Colored status chip with label	All galleries, form headers, approval lists	Inside form field areas	None	All workflow states	None (props only)	All screens
cmpWorkflowActionPanel	Workflow	Contextual action buttons for current user's role and the record's current state	scrViewRequest, scrApprovalProcess	New/Edit form screens	Role-dependent	Status-dependent	gblRoles, gblCurrentUser	scrViewRequest, scrApprovalProcess
cmpApprovalPanel	Workflow	Single approver section: name, date, comment, action buttons	Each approval stage in a form	Submitter view sections	Approver role only	Specific approval state	None (props only)	scrViewRequest, scrApprovalProcess
cmpApprovalHistory	Workflow	List of all approval actions taken on a record	scrViewRequest (audit tab)	Form input sections	All roles who can view	Post-submission states	MainDB_{dept}_WorkflowHistory	scrViewRequest
cmpApprovalCommentBox	Workflow	Comment text area for approval/rejection action	When approver is taking action	Read-only views	Approver role	Action state	None (props only)	cmpWorkflowActionPanel, scrApprovalProcess
cmpWorkflowTimeline	Workflow	Visual horizontal/vertical step timeline showing workflow progress	scrViewRequest, scrApprovalProcess	Form input sections	All roles	All post-submission states	MainDB_{dept}_WorkflowHistory	scrViewRequest, scrApprovalProcess
cmpAuditHistory	Workflow	Full audit log including field change history	Admin view, scrViewRequest detail	Standard user form view	Admin + approver roles	All post-submission states	MainDB_{dept}_WorkflowHistory	scrViewRequest (admin section)
cmpAttachmentPanel	Attachment	Upload, view, and delete attachments for a record	All forms with attachment fields	Forms with no attachment requirement	Role-dependent (delete = owner only)	Mode-dependent	SP List Attachments or Attachments child list	scrNewRequest, scrEditDraft, scrViewRequest
cmpRelatedChildItems	Related Data	Editable gallery of child/row items (for editable gallery candidate forms)	Forms with child list: MainDB_{DEPT}Ext{FORMCODE}_Rows	Standard form (no child list)	Role-dependent	Status-dependent	MainDB_{DEPT}Ext{FORMCODE}_Rows	scrNewRequest, scrEditDraft, scrViewRequest (for gallery-pattern forms)
cmpChecklistItems	Related Data	Checklist section with check/uncheck items	Inspection/checklist forms	Simple field forms	Role-dependent	Status-dependent	None or child list	Inspection forms (SHE, LOG, PRD, etc.)
cmpRelatedRecordCard	Related Data	Single related record display link/card	Cross-form lookups, related CAR, related VRF, etc.	Primary record display	All roles	None	Referenced SP list	scrViewRequest
cmpLoadingState	Feedback	Spinner + message for loading states	While any collection is loading	After data has loaded	None	None	None	All screens
cmpErrorState	Feedback	Error message with retry/back button	When any data load or save fails	Normal operation	None	None	None	All screens
cmpEmptyState	Feedback	Illustrated empty state with call-to-action	When gallery returns 0 items	When gallery has items	None	None	None	All gallery screens
cmpSuccessMessage	Feedback	Transient success notification after save/submit	After successful Patch	Before user action	None	None	None	All form screens
cmpConfirmDialog	Feedback	Confirmation dialog for destructive/irreversible actions	Before delete, withdraw, reject	Non-destructive actions	None	None	None	All form screens
cmpWarningBanner	Feedback	Persistent warning banner	Draft state, validation issues, restricted fields	Approved/completed forms	None	Draft/invalid states	None	scrNewRequest, scrEditDraft
cmpAdminConfigPanel	Admin	Configuration management panel	scrAdminConfig only	All non-admin screens	IT Admin role only	N/A	All AppConfig_ lists	scrAdminConfig
cmpRoleMatrixViewer	Admin	Visual role matrix table viewer	scrAdminConfig only	All non-admin screens	IT Admin role only	N/A	AppConfig_Roles	scrAdminConfig
cmpReferenceDataManager	Admin	CRUD management for reference/config data	scrAdminConfig only	All non-admin screens	IT Admin role only	N/A	AppConfig_ChoiceLists, AppConfig_FormRules	scrAdminConfig
6. Component Property Specification
Input Properties
Component	Input Property	Type	Required?	Default	Purpose	Example Value
cmpAppShell	propActiveDept	Text	No	""	Currently active department code for nav highlight	"FIN"
cmpAppShell	propActiveScreen	Text	No	""	Currently active screen name for nav state	"scrFormList"
cmpAppHeader	propUserDisplayName	Text	Yes	""	Current user's display name	"Ahmad Ali"
cmpAppHeader	propUserPhoto	Image	No	Blank	Current user's profile photo	Office365Users photo
cmpAppHeader	propActiveSite	Text	Yes	"Johor"	Active site name for display	"Penang"
cmpAppHeader	propPendingCount	Number	No	0	Count of pending actions for notification badge	3
cmpSideNav	propActiveDept	Text	No	""	Highlighted department	"HR"
cmpSideNav	propActiveFormCode	Text	No	""	Highlighted form code	"CAR"
cmpSideNav	propNavItems	Table	Yes	—	Nav items table (label, screen, icon, dept)	See AppConfig
cmpBreadcrumb	propTrail	Table	Yes	—	Array of {Label, Screen, FormCode}	[{Label:"Home", Screen:"scrHomeDashboard"}]
cmpCommandBar	propButtons	Table	Yes	—	Button definitions {Label, Action, Style, Visible, Disabled}	See workflow matrix
cmpCommandBar	propTitle	Text	No	""	Form title shown in command bar	"Capital Appropriation Request"
cmpCommandBar	propFormCode	Text	No	""	Active form code	"CAR"
cmpAccessGuard	propRequiredRoles	Table	Yes	—	Table of role IDs allowed for this screen/action	["Submitter", "HOD_FIN"]
cmpAccessGuard	propCurrentRoles	Table	Yes	—	Current user's resolved roles	gblUserRoles
cmpAccessGuard	propRedirectScreen	Text	No	"scrAccessDenied"	Screen to navigate to on denial	"scrAccessDenied"
cmpDashboardSummary	propSite	Text	Yes	""	Site to filter summary counts	"Johor"
cmpDashboardSummary	propCurrentUserEmail	Text	Yes	""	Email for My Pending filter	"user@ioi.com"
cmpStatusSummaryCards	propCounts	Table	Yes	—	Table of {StatusLabel, Count, Color}	[{StatusLabel:"Draft", Count:5, Color:"Gray"}]
cmpRequestCard	propTitle	Text	Yes	""	Request title or form description	"CAR - Boiler Upgrade"
cmpRequestCard	propStatus	Text	Yes	""	Status value	"Submitted"
cmpRequestCard	propSubmittedBy	Text	No	""	Submitter display name	"Ahmad Ali"
cmpRequestCard	propDate	DateTime	No	Blank	Submission or last update date	DateValue("2026-05-01")
cmpRequestCard	propFormCode	Text	No	""	Form code for routing	"CAR"
cmpRequestCard	propRecordID	Number	No	0	SharePoint record ID for navigation	1042
cmpRequestGallery	propItems	Table	Yes	—	Collection of request records to display	colRequests
cmpRequestGallery	propEmptyMessage	Text	No	"No records found"	Empty state message	"No pending approvals"
cmpRequestGallery	propIsLoading	Boolean	No	false	Show loading state while data loads	!gblDataLoaded
cmpRequestGallery	propLayout	Text	No	"cards"	"cards" or "table"	"cards"
cmpFilterPanel	propStatusOptions	Table	No	—	Status choice options	colStatusOptions
cmpFilterPanel	propDeptOptions	Table	No	—	Department options	colDeptOptions
cmpFilterPanel	propIsOpen	Boolean	No	false	Whether panel is expanded	locFilterOpen
cmpSearchBox	propPlaceholder	Text	No	"Search..."	Placeholder text	"Search by title or submitter"
cmpSearchBox	propCurrentValue	Text	No	""	Controlled input value	locSearchText
cmpCanonicalRequestForm	propFormCode	Text	Yes	""	Form code driving field display	"CAR"
cmpCanonicalRequestForm	propFormMode	Text	Yes	"View"	"New", "Edit", "View", "Approve"	"Edit"
cmpCanonicalRequestForm	propRecord	Record	No	Blank	Bound SharePoint record for Edit/View	LookUp(MainDB_FIN, ID=gblActiveRecordID)
cmpCanonicalRequestForm	propCurrentUserRoles	Table	Yes	—	Current user roles for section visibility	gblUserRoles
cmpFormSection	propSectionTitle	Text	Yes	""	Section heading text	"Section A — Requester Details"
cmpFormSection	propIsVisible	Boolean	Yes	true	Whether to show this section	role-based formula
cmpFormSection	propIsEditable	Boolean	No	false	Whether fields inside are editable	mode-based formula
cmpFormSection	propIsCollapsed	Boolean	No	false	Initial collapsed state	false
cmpSectionHeader	propTitle	Text	Yes	""	Section title	"HOD Approval"
cmpSectionHeader	propIsCollapsed	Boolean	No	false	Collapse state	locSectionCollapsed
cmpFieldLabel	propLabel	Text	Yes	""	Field display label	"Project Name"
cmpFieldLabel	propIsRequired	Boolean	No	false	Show required indicator	true
cmpRequiredIndicator	propIsRequired	Boolean	Yes	false	Whether to show the asterisk	true
cmpValidationSummary	propErrors	Table	No	—	Collection of validation messages	locValidationErrors
cmpValidationSummary	propIsVisible	Boolean	No	false	Whether to show the summary	!IsEmpty(locValidationErrors)
cmpFormModeBanner	propMode	Text	Yes	"View"	Current form mode	"New"
cmpFormModeBanner	propFormName	Text	No	""	Form display name	"Capital Appropriation Request"
cmpUnsavedChangesBanner	propHasChanges	Boolean	Yes	false	Whether there are unsaved changes	locHasUnsavedChanges
cmpTextInputField	propLabel	Text	Yes	""	Field label	"Company"
cmpTextInputField	propValue	Text	No	""	Current field value	record.Company
cmpTextInputField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpTextInputField	propIsRequired	Boolean	No	false	Required validation	true
cmpTextInputField	propMaxLength	Number	No	255	Max character count	255
cmpTextInputField	propPlaceholder	Text	No	""	Input placeholder	"Enter company name"
cmpMultilineTextField	propLabel	Text	Yes	""	Field label	"Objective"
cmpMultilineTextField	propValue	Text	No	""	Current value	record.Objective
cmpMultilineTextField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpMultilineTextField	propIsRequired	Boolean	No	false	Required	false
cmpMultilineTextField	propRows	Number	No	4	Visible row count	4
cmpChoiceField	propLabel	Text	Yes	""	Field label	"Department"
cmpChoiceField	propChoices	Table	Yes	—	Table of {Value, Label}	colDeptChoices
cmpChoiceField	propSelectedValue	Text	No	""	Current selected value	record.Department
cmpChoiceField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"View"
cmpChoiceField	propIsRequired	Boolean	No	false	Required	true
cmpMultiChoiceField	propLabel	Text	Yes	""	Field label	"Affected Systems"
cmpMultiChoiceField	propChoices	Table	Yes	—	All available choices	colSystemChoices
cmpMultiChoiceField	propSelectedValues	Table	No	—	Currently selected values	record.AffectedSystems
cmpMultiChoiceField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpDateField	propLabel	Text	Yes	""	Field label	"Start Date"
cmpDateField	propValue	DateTime	No	Blank	Current date value	record.StartDate
cmpDateField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpDateField	propIsRequired	Boolean	No	false	Required	true
cmpDateField	propMinDate	DateTime	No	Blank	Minimum allowed date	Today()
cmpNumberField	propLabel	Text	Yes	""	Field label	"Quantity"
cmpNumberField	propValue	Number	No	0	Current value	record.Quantity
cmpNumberField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpNumberField	propUnit	Text	No	""	Unit label appended	"MT"
cmpCurrencyField	propLabel	Text	Yes	""	Field label	"Amount Budgeted"
cmpCurrencyField	propValue	Number	No	0	Current value in RM	record.BudgetAmt
cmpCurrencyField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpCurrencyField	propCurrencySymbol	Text	No	"RM"	Currency symbol	"RM"
cmpYesNoField	propLabel	Text	Yes	""	Field label	"Urgent?"
cmpYesNoField	propValue	Boolean	No	false	Current yes/no value	record.IsUrgent
cmpYesNoField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpPeoplePicker	propLabel	Text	Yes	""	Field label	"Reviewer (HOD)"
cmpPeoplePicker	propSelectedUser	Record	No	Blank	Currently selected user {DisplayName, Email, JobTitle}	record.HOD_Person
cmpPeoplePicker	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"Edit"
cmpPeoplePicker	propIsRequired	Boolean	No	false	Required	true
cmpLookupField	propLabel	Text	Yes	""	Field label	"Vendor"
cmpLookupField	propLookupItems	Table	Yes	—	Items from lookup SP list	colVendors
cmpLookupField	propSelectedID	Number	No	0	Selected item ID	record.VendorID
cmpLookupField	propDisplayMode	Text	No	"Edit"	"Edit" or "View"	"View"
cmpReadOnlyField	propLabel	Text	Yes	""	Field label	"Submitted By"
cmpReadOnlyField	propValue	Text	Yes	""	Display value	record.SubmittedByName
cmpCalculatedFieldDisplay	propLabel	Text	Yes	""	Field label	"Grand Total (RM)"
cmpCalculatedFieldDisplay	propFormula	Text	Yes	""	Description of calculation shown	"Sum of all line items"
cmpCalculatedFieldDisplay	propValue	Number	Yes	0	Calculated value to display	Sum(colLineItems, Amount)
cmpStatusBadge	propStatus	Text	Yes	""	Status text	"Submitted"
cmpStatusBadge	propVariant	Text	No	"status"	"status", "editRequest", "formCode"	"status"
cmpWorkflowActionPanel	propCurrentStatus	Text	Yes	""	Current record status	"Submitted"
cmpWorkflowActionPanel	propCurrentUserRoles	Table	Yes	—	User's roles for this form	gblUserRoles
cmpWorkflowActionPanel	propFormCode	Text	Yes	""	Form code for action routing	"CAR"
cmpWorkflowActionPanel	propRecordID	Number	Yes	0	SP record ID	1042
cmpWorkflowActionPanel	propAllowDelegate	Boolean	No	false	Show delegate button	true
cmpApprovalPanel	propStageLabel	Text	Yes	""	Approval stage title	"HOD Approval"
cmpApprovalPanel	propApproverName	Text	No	""	Approver display name	"Khairul Anuar"
cmpApprovalPanel	propApprovalDate	DateTime	No	Blank	Date approved/rejected	record.HODApprovedDate
cmpApprovalPanel	propStatus	Text	No	""	Stage status	"Approved"
cmpApprovalPanel	propComment	Text	No	""	Approver comment	record.HODComment
cmpApprovalPanel	propIsCurrentStage	Boolean	No	false	Is this the active stage requiring action	true
cmpApprovalHistory	propItems	Table	Yes	—	Workflow history collection	colWorkflowHistory
cmpApprovalCommentBox	propIsRequired	Boolean	No	false	Whether comment is required	true (for reject)
cmpApprovalCommentBox	propPlaceholder	Text	No	""	Placeholder text	"Enter rejection reason..."
cmpWorkflowTimeline	propSteps	Table	Yes	—	Table of {Step, Status, Actor, Date, Comment}	colWorkflowSteps
cmpWorkflowTimeline	propCurrentStep	Text	No	""	Active step label	"HOD Review"
cmpAuditHistory	propItems	Table	Yes	—	Full audit log	colAuditLog
cmpAttachmentPanel	propRecordID	Number	Yes	0	Parent SP record ID	1042
cmpAttachmentPanel	propListName	Text	Yes	""	SP list name	"MainDB_FIN"
cmpAttachmentPanel	propDisplayMode	Text	No	"View"	"Edit" or "View"	"Edit"
cmpAttachmentPanel	propAllowedTypes	Text	No	"*"	Comma-separated allowed types	".pdf,.xlsx,.jpg"
cmpRelatedChildItems	propParentID	Number	Yes	0	Parent record ID for child filter	gblActiveRecordID
cmpRelatedChildItems	propChildListName	Text	Yes	""	Child SP list internal name	"MainDB_FIN_Ext_INSUCLAI_Rows"
cmpRelatedChildItems	propColumns	Table	Yes	—	Column definitions {InternalName, Label, Type}	colChildColumns
cmpRelatedChildItems	propDisplayMode	Text	No	"View"	"Edit" or "View"	"Edit"
cmpChecklistItems	propItems	Table	Yes	—	Checklist items {Label, IsChecked}	colChecklistItems
cmpChecklistItems	propDisplayMode	Text	No	"View"	"Edit" or "View"	"Edit"
cmpRelatedRecordCard	propRelatedTitle	Text	Yes	""	Related record title	"Linked CAR-2024-0042"
cmpRelatedRecordCard	propRelatedScreen	Text	No	""	Screen to navigate to	"scrViewRequest"
cmpRelatedRecordCard	propRelatedID	Number	No	0	Related SP record ID	42
cmpLoadingState	propMessage	Text	No	"Loading..."	Loading message	"Loading form..."
cmpLoadingState	propIsVisible	Boolean	Yes	false	Whether to show	!gblDataLoaded
cmpErrorState	propMessage	Text	No	"An error occurred."	Error message	"Could not load record."
cmpErrorState	propShowRetry	Boolean	No	true	Show retry button	true
cmpEmptyState	propMessage	Text	No	"No items found."	Empty message	"No pending approvals."
cmpEmptyState	propCallToAction	Text	No	""	CTA button label	"Create New Request"
cmpEmptyState	propCallToActionScreen	Text	No	""	Navigation target	"scrNewRequest"
cmpSuccessMessage	propMessage	Text	Yes	""	Success text	"Record submitted successfully."
cmpSuccessMessage	propIsVisible	Boolean	Yes	false	Whether to show	locSaveSuccess
cmpConfirmDialog	propTitle	Text	Yes	""	Dialog title	"Confirm Withdrawal"
cmpConfirmDialog	propMessage	Text	Yes	""	Confirmation message	"Are you sure you want to withdraw this request?"
cmpConfirmDialog	propIsOpen	Boolean	Yes	false	Whether dialog is open	locConfirmOpen
cmpConfirmDialog	propConfirmLabel	Text	No	"Confirm"	Confirm button label	"Withdraw"
cmpWarningBanner	propMessage	Text	Yes	""	Warning text	"This form has unsaved changes."
cmpWarningBanner	propIsVisible	Boolean	Yes	false	Whether visible	locHasWarning
Output Properties
Component	Output Property	Type	Purpose	Trigger / Source
cmpSearchBox	outSearchText	Text	Exposes current search string to parent screen	Updated on each text change
cmpFilterPanel	outSelectedStatus	Text	Currently selected status filter	User selection
cmpFilterPanel	outSelectedDept	Text	Currently selected department filter	User selection
cmpFilterPanel	outDateFrom	DateTime	Date range start	User selection
cmpFilterPanel	outDateTo	DateTime	Date range end	User selection
cmpRequestGallery	outSelectedRecord	Record	The record the user tapped/clicked	Gallery OnSelect
cmpTextInputField	outValue	Text	Current input value for parent Patch use	TextInput.Text on change
cmpMultilineTextField	outValue	Text	Current text area value	TextInput.Text on change
cmpChoiceField	outSelectedValue	Text	Selected dropdown value	Dropdown.Selected.Value
cmpMultiChoiceField	outSelectedValues	Table	Table of selected values	ComboBox.SelectedItems
cmpDateField	outSelectedDate	DateTime	Selected date value	DatePicker.SelectedDate
cmpNumberField	outValue	Number	Current number value	TextInput.Text (converted)
cmpCurrencyField	outValue	Number	Current RM value	TextInput.Text (converted)
cmpYesNoField	outValue	Boolean	Current true/false value	Toggle.Value / Checkbox.Value
cmpPeoplePicker	outSelectedUser	Record	{Email, DisplayName, JobTitle} of selected person	Office365Users result
cmpLookupField	outSelectedID	Number	ID of selected SP item	Dropdown.Selected.ID
cmpLookupField	outSelectedValue	Text	Display value of selected item	Dropdown.Selected.Value
cmpApprovalCommentBox	outComment	Text	Current comment text	TextInput.Text
cmpWorkflowActionPanel	outActionTaken	Text	Action the user selected ("Approve", "Reject", etc.)	Button OnSelect
cmpWorkflowActionPanel	outActionComment	Text	Comment text from action dialog	From cmpApprovalCommentBox
cmpConfirmDialog	outConfirmed	Boolean	Whether user confirmed	Confirm button OnSelect
cmpRelatedChildItems	outItems	Table	Current state of editable child rows	Gallery edits
cmpChecklistItems	outItems	Table	Updated checklist state	Checkbox OnChange
cmpSectionHeader	outIsCollapsed	Boolean	Current collapsed state	Toggle tap
cmpAttachmentPanel	outUploadTriggered	Boolean	Whether user clicked upload	Upload button OnSelect
7. Component Internal Control Specification
(Representative components documented. Full specification for each component to be completed in implementation phase.)

Component	Internal Control	Control Type	Purpose	Key Properties / Formulas
cmpAppShell	conShellWrapper	Container	Outer layout container	Layout: Horizontal fill; Height: Parent.Height
cmpAppShell	conNavArea	Container	Holds cmpSideNav	Width: If(gblNavCollapsed, 48, 240); Visible: !gblMobileView
cmpAppShell	conContentArea	Container	Main content slot	Width: Parent.Width - conNavArea.Width; Overflow: Scroll
cmpAppHeader	conHeader	Container	Full-width top bar	Height: 56; Fill: Color.White; BorderBottom: 1px
cmpAppHeader	icoLogo	Image	IOI logo	Image: gblAppLogo; Width: 120
cmpAppHeader	lblSiteName	Label	Active site display	Text: propActiveSite; FontSize: 14
cmpAppHeader	lblUserName	Label	Current user name	Text: propUserDisplayName
cmpAppHeader	imgUserPhoto	Image	User profile photo	Image: propUserPhoto; Circular border radius
cmpAppHeader	lblNotifBadge	Label	Pending count badge	Text: propPendingCount; Visible: propPendingCount > 0; Fill: Red
cmpSideNav	galNavItems	Gallery	Nav item list	Items: propNavItems; TemplateSize: 48
cmpSideNav	galNavItems.lblNavLabel	Label	Nav item label	Text: ThisItem.Label
cmpSideNav	galNavItems.icoNavIcon	Icon	Nav item icon	Icon: ThisItem.Icon
cmpSideNav	galNavItems.conActiveIndicator	Container	Active highlight bar	Fill: Color.Blue; Visible: ThisItem.Screen = propActiveScreen
cmpStatusBadge	lblBadgeText	Label	Status text	Text: propStatus; FontSize: 11; Bold: true
cmpStatusBadge	conBadge	Container	Badge background	Fill: Switch(propStatus, "Draft", Color.Gray, "Submitted", Color.Blue, "Approved", Color.Green, "Rejected", Color.Red, "In Review", Color.Orange, Color.LightGray); BorderRadius: 12
cmpRequestCard	conCard	Container	Card outer container	Height: 88; Fill: White; BorderRadius: 8; Drop shadow
cmpRequestCard	cmpStatusBadge1	Component	Status badge	propStatus: propStatus
cmpRequestCard	lblTitle	Label	Request title	Text: propTitle; FontSize: 14; Bold: true; MaxLines: 2
cmpRequestCard	lblSubmittedBy	Label	Submitter name	Text: propSubmittedBy; FontSize: 12; Color: Gray
cmpRequestCard	lblDate	Label	Date display	Text: Text(propDate, "DD MMM YYYY"); FontSize: 12
cmpRequestCard	lblFormCode	Label	Form code chip	Text: propFormCode; FontSize: 10
cmpRequestGallery	galItems	Gallery	Main scrollable gallery	Items: propItems; TemplateSize: 96; Layout: Vertical
cmpRequestGallery	galItems.cmpCard	Component	Card per item	propTitle: ThisItem.Title; propStatus: ThisItem.Status
cmpRequestGallery	cmpLoading	Component	Loading overlay	propIsVisible: propIsLoading
cmpRequestGallery	cmpEmpty	Component	Empty state	propIsVisible: !propIsLoading And IsEmpty(propItems)
cmpFormSection	conSection	Container	Section wrapper	Visible: propIsVisible
cmpFormSection	cmpSecHeader	Component	Collapsible header	propTitle: propSectionTitle; propIsCollapsed: locIsCollapsed
cmpFormSection	conFields	Container	Field slot area	Visible: !locIsCollapsed; Overflow: Visible
cmpTextInputField	cmpLbl	Component	Field label	propLabel: propLabel; propIsRequired: propIsRequired
cmpTextInputField	txtInput	TextInput	Actual text input	Default: propValue; DisplayMode: If(propDisplayMode="Edit", DisplayMode.Edit, DisplayMode.View); MaxLength: propMaxLength
cmpTextInputField	lblError	Label	Inline error message	Text: locError; Visible: !IsBlank(locError); Color: Red; FontSize: 11
cmpPeoplePicker	cmpLbl	Component	Field label	propLabel: propLabel; propIsRequired: propIsRequired
cmpPeoplePicker	txtSearch	TextInput	Search input	OnChange: Set(locSearchResults, Office365Users.SearchUser({searchTerm: txtSearch.Text}).value)
cmpPeoplePicker	galResults	Gallery	Search results dropdown	Items: locSearchResults; Visible: !IsBlank(txtSearch.Text) And !IsEmpty(locSearchResults)
cmpPeoplePicker	galResults.lblName	Label	Result name	Text: ThisItem.DisplayName
cmpPeoplePicker	galResults.lblTitle	Label	Result job title	Text: ThisItem.JobTitle
cmpPeoplePicker	conSelectedUser	Container	Selected user display chip	Visible: !IsBlank(locSelectedUser.Email)
cmpPeoplePicker	lblSelectedName	Label	Selected user name	Text: locSelectedUser.DisplayName
cmpPeoplePicker	btnClearUser	Button	Remove selected user	OnSelect: Set(locSelectedUser, Blank())
cmpWorkflowActionPanel	conPanel	Container	Action panel wrapper	Visible: !IsEmpty(locAvailableActions)
cmpWorkflowActionPanel	galActions	Gallery	Action buttons list	Items: locAvailableActions; Layout: Horizontal
cmpWorkflowActionPanel	galActions.btnAction	Button	Per-action button	Text: ThisItem.Label; OnSelect: Set(locPendingAction, ThisItem.ActionKey); Set(locConfirmOpen, true)
cmpWorkflowActionPanel	cmpConfirm	Component	Confirm dialog	propIsOpen: locConfirmOpen; propTitle: locPendingAction
cmpWorkflowActionPanel	cmpComment	Component	Comment input	propIsRequired: locPendingAction = "Reject"
cmpApprovalPanel	conApproval	Container	Stage container	Fill: If(propStatus="Approved", LightGreen, propStatus="Rejected", LightRed, LightGray)
cmpApprovalPanel	lblStageTitle	Label	Stage heading	Text: propStageLabel; Bold: true
cmpApprovalPanel	cmpStatusBadge	Component	Stage status	propStatus: propStatus
cmpApprovalPanel	lblApproverName	Label	Approver name	Text: propApproverName; Visible: !IsBlank(propApproverName)
cmpApprovalPanel	lblApprovalDate	Label	Approval date	Text: Text(propApprovalDate, "DD MMM YYYY"); Visible: !IsBlank(propApprovalDate)
cmpApprovalPanel	lblComment	Label	Comment display	Text: propComment; Visible: !IsBlank(propComment)
cmpWorkflowTimeline	galSteps	Gallery	Horizontal step gallery	Items: propSteps; Layout: Horizontal; TemplateSize: 160
cmpWorkflowTimeline	galSteps.cmpBadge	Component	Step status dot	propStatus: ThisItem.Status
cmpWorkflowTimeline	galSteps.lblStepName	Label	Step label	Text: ThisItem.Step
cmpWorkflowTimeline	galSteps.lblActor	Label	Actor name	Text: ThisItem.Actor; Visible: !IsBlank(ThisItem.Actor)
cmpWorkflowTimeline	galSteps.lblDate	Label	Step date	Text: Text(ThisItem.Date, "DD MMM")
cmpLoadingState	conLoading	Container	Full-screen or inline loading	Visible: propIsVisible
cmpLoadingState	icoSpinner	Icon	Spinning indicator	Icon: Icon.Sync; Animate rotation
cmpLoadingState	lblLoadingMsg	Label	Loading message	Text: propMessage
cmpErrorState	lblErrorMsg	Label	Error description	Text: propMessage; Color: Red
cmpErrorState	btnRetry	Button	Retry action	Text: "Retry"; OnSelect: outRetryTriggered = true; Visible: propShowRetry
cmpEmptyState	lblEmptyMsg	Label	Empty message	Text: propMessage; Color: Gray
cmpEmptyState	btnCTA	Button	Call-to-action	Text: propCallToAction; Visible: !IsBlank(propCallToAction); OnSelect: Navigate(propCallToActionScreen)
cmpConfirmDialog	conDialog	Container	Modal overlay container	Visible: propIsOpen; Fill: RGBA(0,0,0,0.4)
cmpConfirmDialog	conDialogBox	Container	Dialog box	Fill: White; BorderRadius: 12; Width: 400
cmpConfirmDialog	lblTitle	Label	Dialog title	Text: propTitle; Bold: true
cmpConfirmDialog	lblMessage	Label	Confirmation message	Text: propMessage
cmpConfirmDialog	btnConfirm	Button	Confirm action	Text: propConfirmLabel; OnSelect: Set(outConfirmed, true)
cmpConfirmDialog	btnCancel	Button	Cancel	Text: "Cancel"; OnSelect: Set(propIsOpen, false)
cmpValidationSummary	galErrors	Gallery	Error list	Items: propErrors; Visible: propIsVisible
cmpValidationSummary	galErrors.lblError	Label	Error message	Text: "• " & ThisItem.Message; Color: Red; FontSize: 12
cmpAttachmentPanel	galAttachments	Gallery	Attachment list	Items: colAttachments
cmpAttachmentPanel	galAttachments.lblFileName	Label	File name	Text: ThisItem.FileName
cmpAttachmentPanel	galAttachments.btnDownload	Button	Download link	OnSelect: Launch(ThisItem.DownloadUrl)
cmpAttachmentPanel	galAttachments.btnDelete	Button	Delete attachment	Visible: propDisplayMode = "Edit"; OnSelect: locConfirmDelete = true
cmpAttachmentPanel	btnUpload	Button	Trigger upload	Text: "Upload"; Visible: propDisplayMode = "Edit"
cmpRelatedChildItems	galChildren	Gallery	Editable child rows	Items: Filter(locChildItems, ParentID = propParentID); TemplateSize: 48
cmpRelatedChildItems	btnAddRow	Button	Add new child row	Text: "+ Add Row"; Visible: propDisplayMode = "Edit"; OnSelect: Collect(locChildItems, {ParentID: propParentID})
cmpRelatedChildItems	btnDeleteRow	Button	Delete row	Visible: propDisplayMode = "Edit"; OnSelect: Remove(locChildItems, galChildren.Selected)
cmpChoiceField	cmpLbl	Component	Field label	propLabel: propLabel; propIsRequired: propIsRequired
cmpChoiceField	drpChoice	Dropdown	Choice selector	Items: propChoices; DefaultSelectedItems: Filter(propChoices, Value = propSelectedValue); DisplayMode: If(propDisplayMode="Edit", DisplayMode.Edit, DisplayMode.View)
cmpDateField	cmpLbl	Component	Field label	propLabel: propLabel; propIsRequired: propIsRequired
cmpDateField	datPicker	DatePicker	Date selector	DefaultDate: propValue; DisplayMode: If(propDisplayMode="Edit", DisplayMode.Edit, DisplayMode.View); MinDate: propMinDate
cmpCommandBar	conBar	Container	Full-width bar	Height: 52; Fill: White; BorderBottom: 1px
cmpCommandBar	lblTitle	Label	Form title	Text: propTitle; Bold: true; FontSize: 16
cmpCommandBar	galButtons	Gallery	Action button row	Items: Filter(propButtons, Visible); Layout: Horizontal
cmpCommandBar	galButtons.btnAction	Button	Each action button	Text: ThisItem.Label; Style: ThisItem.Style; Disabled: ThisItem.Disabled
8. Canvas Data Source and App State Plan
Data Sources to Add to the Canvas App
Data Source	SharePoint Site	SharePoint List	Purpose	Columns Read	Columns Written	Lookup Fields	Choice Fields	Person Fields	Attachments	Notes
MainDB_FIN	MISSING_INFO (SharePoint site URL)	MainDB_FIN	All Finance forms (CAR, CMF_A, CMF_B, CMF_C, INSUCLAI, EARF, RSES, etc.) — discriminated by FormCode column	All form fields + FormCode + Status + CA + SubmittedBy + CreatedDate	FormCode, Status, CA, all form-specific fields	MISSING_INFO	Status, CA (CurrentAction), Department, Company	HOD, Preparedby, Reviewedby, Approvedby, EDApprovedby	Yes (SP list attachments)	Parent list for 6+ Johor FIN forms + 5+ Penang FIN forms
MainDB_HR	MISSING_INFO	MainDB_HR	All HR forms (CWR, BSD, JD, NDF, SR, etc.)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA, Department	HOD, SubmittedBy	Yes	Parent list for 10+ HR forms per site
MainDB_IT	MISSING_INFO	MainDB_IT	All IT forms (SSR, PRF, UR, HARDINVE, SAPDISARECO, etc.)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	Parent list for 20+ IT forms
MainDB_QA	MISSING_INFO	MainDB_QA	All QA forms (80+ forms — largest dept)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	80 QA forms — ensure delegation-safe queries with indexed columns
MainDB_QC	MISSING_INFO	MainDB_QC	All QC forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	41 QC forms
MainDB_PUR	MISSING_INFO	MainDB_PUR	All Procurement forms (VCAR, VENDREGI, MER, etc.)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	29 PUR forms
MainDB_SHE	MISSING_INFO	MainDB_SHE	All Safety Health Environment forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	29 SHE forms
MainDB_STR	MISSING_INFO	MainDB_STR	All Store/Warehouse forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	20 STR forms
MainDB_MKT	MISSING_INFO	MainDB_MKT	Marketing forms (Johor)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	8 MKT forms
MainDB_MKTG	MISSING_INFO	MainDB_MKTG	Marketing forms (Johor — separate list)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	1 MKTG form (Customer Questionnaire 2025)
MainDB_PRD	MISSING_INFO	MainDB_PRD	Production forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	12 PRD forms
MainDB_LOG	MISSING_INFO	MainDB_LOG	Logistics forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	10 LOG forms
MainDB_ADM	MISSING_INFO	MainDB_ADM	Admin forms (Johor + Penang)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	4 ADM forms
MainDB_SEC	MISSING_INFO	MainDB_SEC	Security forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	SubmittedBy	Yes	7 SEC forms
MainDB_E&I	MISSING_INFO	MainDB_E&I	Electrical & Instrumentation forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	8 E&I forms
MainDB_MTN	MISSING_INFO	MainDB_MTN	Maintenance forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	6 MTN forms
MainDB_T&D	MISSING_INFO	MainDB_T&D	Training & Development forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	10 T&D forms
MainDB_WH	MISSING_INFO	MainDB_WH	Warehouse forms (Penang)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	10 WH forms
MainDB_PROJECT	MISSING_INFO	MainDB_PROJECT	Project forms (drawing requests, project requests)	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	2 PROJECT forms
MainDB_TPM	MISSING_INFO	MainDB_TPM	TPM forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	1 TPM form
MainDB_UTILITY	MISSING_INFO	MainDB_UTILITY	Utility/Energy forms	All form fields + FormCode + Status + CA	FormCode, Status, CA, form fields	MISSING_INFO	Status, CA	HOD, SubmittedBy	Yes	1 Utility form
MainDB_{DEPT}Ext{FORMCODE}_Rows	MISSING_INFO	Multiple child lists (e.g. MainDB_FIN_Ext_INSUCLAI_Rows)	Child row data for editable gallery candidate forms	ParentID + all row fields	ParentID + all row fields	ParentID → parent list ID	MISSING_INFO	MISSING_INFO	No	One child list per form that has editable gallery pattern (~90 forms based on spec register)
AppConfig_FormRules	MISSING_INFO	AppConfig_FormRules	Per-form field visibility rules, section config, required fields	FormCode, SectionName, FieldInternalName, IsVisible, IsRequired, DisplayModeFormula	Writable by IT Admin only	None	None	None	No	Config list — must be designed and populated during build
AppConfig_Roles	MISSING_INFO	AppConfig_Roles	Role definitions and user-role assignments	RoleName, RoleCode, DeptCode, FormCode, UserEmail	Writable by IT Admin only	None	None	UserEmail (Person)	No	Central role resolution table. MISSING_INFO — exact role structure needs confirmation
AppConfig_ChoiceLists	MISSING_INFO	AppConfig_ChoiceLists	Choice field options for all forms	ListName, ChoiceKey, ChoiceValue, SortOrder	Writable by IT Admin only	None	None	None	No	Centralizes all dropdown/choice values
AppConfig_WorkflowRules	MISSING_INFO	AppConfig_WorkflowRules	Workflow state transitions per form and role	FormCode, CurrentStatus, Role, AllowedAction, NextStatus	Writable by IT Admin only	None	None	None	No	Drives cmpWorkflowActionPanel action list. MISSING_INFO — exact rules need confirmation per form
WorkflowHistory	MISSING_INFO	WorkflowHistory (or per-dept variant)	Audit log of all approval/action events	ParentID, ListName, Action, Actor, Date, Comment, PreviousStatus, NewStatus	Written on every workflow action	ParentID → parent list	Action, Status	Actor (Person)	No	May be one global history list or per-dept — confirm architecture
Office365Users	N/A — Connector	Connector	Current user, manager, people search	MyProfile(), MyManager(), SearchUser()	None	N/A	N/A	N/A	N/A	Standard connector; no license cost
App State — Variables and Collections
Variable / Collection / Named Formula	Type	Purpose	Set In	Used By	Notes
gblCurrentUser	Record	Current user profile {Email, DisplayName, JobTitle, Department}	App.OnStart — Office365Users.MyProfile()	All screens, all components requiring user identity	Cache at start; refresh not needed unless session is long
gblCurrentUserManager	Record	Current user's manager {Email, DisplayName}	App.OnStart — Office365Users.MyManager()	cmpWorkflowActionPanel (delegation), manager dashboard	Used for delegation logic
gblActiveSite	Text	Currently selected site: "Johor" or "Penang"	App.OnStart (default), scrHomeDashboard site toggle	All screens — drives which SP lists are shown	Persist in user AppConfig if multi-site users exist
gblActiveDept	Text	Currently selected department code (e.g. "FIN", "HR")	Set when navigating into a dept from scrHomeDashboard or scrDeptHub	scrDeptHub, scrFormList, scrNewRequest, scrEditDraft	Drives which MainDB_ list is used
gblActiveFormCode	Text	Currently active form code (e.g. "CAR", "NDF")	Set on scrDeptHub or scrFormList before Navigate() to form screen	scrNewRequest, scrEditDraft, scrViewRequest — drives form config	Central parameterization mechanism
gblActiveRecordID	Number	SP ID of the currently viewed/edited record	Set before Navigate() to scrViewRequest or scrEditDraft	scrViewRequest, scrEditDraft, scrApprovalProcess	0 for New mode
gblFormMode	Text	Current form mode: "New", "Edit", "View", "Approve"	Set before Navigate() to form screens	cmpCanonicalRequestForm, cmpCommandBar, all form components	Drives DisplayMode of all form fields
gblUserRoles	Table	Collection of roles for current user {RoleCode, DeptCode, FormCode}	App.OnStart — Filter(AppConfig_Roles, UserEmail = gblCurrentUser.Email)	cmpAccessGuard, cmpWorkflowActionPanel, all visibility formulas	MISSING_INFO — exact role resolution logic depends on confirmed AppConfig_Roles schema
gblIsAdmin	Boolean	Whether current user has IT Admin role	App.OnStart — CountIf(gblUserRoles, RoleCode = "ADMIN") > 0	scrAdminConfig visibility, cmpAdminConfigPanel	Simplifies admin checks
gblIsHOD	Boolean	Whether current user is HOD of any dept	App.OnStart — CountIf(gblUserRoles, RoleCode = "HOD") > 0	scrAllRequestsAdmin, manager-scoped views	MISSING_INFO — depends on role matrix
gblAppLoaded	Boolean	Whether App.OnStart has completed	App.OnStart last step: Set(gblAppLoaded, true)	cmpLoadingState (hide when true), all screens OnVisible	Prevents screens from rendering before data is ready
gblNavPath	Table	Current breadcrumb navigation trail	Updated on each Navigate() call	cmpBreadcrumb	Table of {Label, Screen, FormCode}
gblActiveListName	Text	Internal name of the currently active MainDB_ list (derived from dept)	Derived formula from gblActiveDept	All Patch/Filter calls	e.g. "MainDB_FIN" when gblActiveDept = "FIN"
colRequests	Collection	Current page's list of request records	ClearCollect on screen OnVisible or filter change	cmpRequestGallery, cmpFilterPanel, cmpPaginationOrLoadMore	Filtered by FormCode + site + user scope
colFormConfig	Collection	Form section and field rules for active form	ClearCollect on gblActiveFormCode change	cmpCanonicalRequestForm, all cmpFormSection instances	From AppConfig_FormRules
colStatusOptions	Collection	Status choice values for filter dropdowns	App.OnStart	cmpFilterPanel, cmpChoiceField (status)	From AppConfig_ChoiceLists or hardcoded if static
colDeptOptions	Collection	Department list for filters	App.OnStart	cmpFilterPanel, scrHomeDashboard	Derived from distinct dept values or AppConfig list
colWorkflowHistory	Collection	Workflow history for current active record	ClearCollect on scrViewRequest OnVisible	cmpApprovalHistory, cmpWorkflowTimeline, cmpAuditHistory	Filter WorkflowHistory by ParentID = gblActiveRecordID
colChildItems	Collection	Child rows for editable gallery candidate forms	ClearCollect on scrViewRequest/scrEditDraft OnVisible	cmpRelatedChildItems	Filter by ParentID = gblActiveRecordID; clear when navigating away
colUserRoleOptions	Collection	All available role names (for admin config)	App.OnStart or scrAdminConfig OnVisible	cmpRoleMatrixViewer, cmpAdminConfigPanel	From AppConfig_Roles
colChoiceLists	Collection	All AppConfig_ChoiceLists data	App.OnStart	All cmpChoiceField and cmpMultiChoiceField instances	Grouped by ListName
colWorkflowRules	Collection	All AppConfig_WorkflowRules data	App.OnStart	cmpWorkflowActionPanel	Filter by FormCode + CurrentStatus + Role to get available actions
locValidationErrors	Table (context)	Current form validation errors	Set in OnSelect (Save/Submit button) before Patch	cmpValidationSummary	Cleared at start of each validation run
locHasUnsavedChanges	Boolean (context)	Whether current form has unsaved edits	Set on any field value change	cmpUnsavedChangesBanner	Reset on Save or navigate-cancel
locSaveSuccess	Boolean (context)	Whether last save was successful	Set after successful Patch	cmpSuccessMessage	Reset after timer or navigate
locSaveError	Text (context)	Error message from failed save	Set in Patch error handler	cmpErrorState
locFilterStatus	Text (context)	Currently applied status filter	Set by cmpFilterPanel	ClearCollect filter formula
locFilterDept	Text (context)	Currently applied dept filter	Set by cmpFilterPanel	ClearCollect filter formula
locSearchText	Text (context)	Current search string	Set by cmpSearchBox	Gallery Items filter formula
locConfirmOpen	Boolean (context)	Whether confirm dialog is open	Set by destructive action buttons	cmpConfirmDialog
locPendingAction	Text (context)	The pending action awaiting confirmation	Set by cmpWorkflowActionPanel	cmpConfirmDialog title
locSelectedRecord	Record (context)	Currently selected gallery record	Set by galItems OnSelect	Navigate to detail screens
fxGetListName(dept)	Named Formula	Derives MainDB list name from dept code	Named formula	All data source references	e.g. fxGetListName("FIN") → "MainDB_FIN"
fxGetStatusColor(status)	Named Formula	Returns color for a given status string	Named formula	cmpStatusBadge, galItems	Centralizes status colors
fxUserHasRole(roleCode, formCode)	Named Formula	Returns true if current user has specified role for specified form	Named formula	cmpAccessGuard, cmpWorkflowActionPanel	Uses gblUserRoles collection
fxGetAvailableActions(formCode, status, roles)	Named Formula	Returns table of available actions for current state	Named formula	cmpWorkflowActionPanel, cmpCommandBar	Uses colWorkflowRules
App.OnStart Logic (Planning)

// DRAFT_FORMULA — planning only
// 1. Load current user
Set(gblCurrentUser, Office365Users.MyProfile());
Set(gblCurrentUserManager, Office365Users.MyManager());

// 2. Set default site
Set(gblActiveSite, "Penang");  // Default — confirm with user

// 3. Load role assignments
ClearCollect(colAppConfig_Roles, AppConfig_Roles);
ClearCollect(gblUserRoles, Filter(colAppConfig_Roles, UserEmail = gblCurrentUser.Mail));
Set(gblIsAdmin, CountIf(gblUserRoles, RoleCode = "ADMIN") > 0);
Set(gblIsHOD, CountIf(gblUserRoles, RoleCode = "HOD") > 0);

// 4. Load choice lists and form config
ClearCollect(colChoiceLists, AppConfig_ChoiceLists);
ClearCollect(colWorkflowRules, AppConfig_WorkflowRules);
ClearCollect(colStatusOptions, Filter(colChoiceLists, ListName = "Status"));
ClearCollect(colDeptOptions, Filter(colChoiceLists, ListName = "Department"));

// 5. Mark app as loaded
Set(gblAppLoaded, true);
9. Field-to-Control-and-Component Mapping Matrix
Note: The full 22,074-field mapping is too large for a single document. This section documents the canonical pattern using the Capital Appropriation Request (CAR) form as the reference example. All other forms follow the same pattern, applied to their specific fields from the MASTER_FIELD_DICTIONARY.

Form	Section	UI Label	Canvas Control Name	Component Used	Control Type	SharePoint List	SharePoint Display Column	SharePoint Internal Column	SharePoint Field Type	Required?	Default Formula	DisplayMode Formula	Visible Formula	Validation Formula	Save/Patch Behavior	Error Message
CAR	Header	SAP IO No.	txtSAPIONo	cmpTextInputField	TextInput	MainDB_FIN	SAP IO No.	SAPIONo	Text (single line)	No	record.SAPIONo	If(gblFormMode="View", DisplayMode.View, DisplayMode.Edit)	true	None	Patch(MainDB_FIN, locRecord, {SAPIONo: txtSAPIONo.Text})	—
CAR	Header	SAP Asset No.	txtSAPAssNo	cmpTextInputField	TextInput	MainDB_FIN	SAP Asset No.	SAPAssNo	Text (single line)	No	record.SAPAssNo	Same as above	true	None	SAPAssNo: txtSAPAssNo.Text	—
CAR	Section A	Company	drpCompany	cmpChoiceField	Dropdown	MainDB_FIN	Company	Company	Choice (Text)	Yes	record.Company	Same as above	true	!IsBlank(drpCompany.Selected.Value)	Company: drpCompany.Selected.Value	"Company is required"
CAR	Section A	Department	drpDepartment	cmpChoiceField	Dropdown	MainDB_FIN	Department	Department	Choice (Text)	Yes	record.Department	Same as above	true	!IsBlank(drpDepartment.Selected.Value)	Department: drpDepartment.Selected.Value	"Department is required"
CAR	Section A	Project Name	txtProjectName	cmpTextInputField	TextInput	MainDB_FIN	Project Name	ProjectName	Text (single line)	Yes	record.ProjectName	Same as above	true	!IsBlank(txtProjectName.Text)	ProjectName: txtProjectName.Text	"Project Name is required"
CAR	Section A	Objective	txtObjective	cmpMultilineTextField	TextInput (multiline)	MainDB_FIN	Objective	Objective	Text (multi-line)	Yes	record.Objective	Same as above	true	!IsBlank(txtObjective.Text)	Objective: txtObjective.Text	"Objective is required"
CAR	Section A	Start Date	datStartDate	cmpDateField	DatePicker	MainDB_FIN	Start Date	StartDate	Date	Yes	record.StartDate	Same as above	true	!IsBlank(datStartDate.SelectedDate)	StartDate: datStartDate.SelectedDate	"Start Date is required"
CAR	Section A	Completion Date	datCompDate	cmpDateField	DatePicker	MainDB_FIN	Completion Date	CompDate	Date	Yes	record.CompDate	Same as above	true	!IsBlank(datCompDate.SelectedDate) And datCompDate.SelectedDate >= datStartDate.SelectedDate	CompDate: datCompDate.SelectedDate	"Completion Date must be after Start Date"
CAR	Section A	Purpose of Investment	txtPurpose	cmpMultilineTextField	TextInput (multiline)	MainDB_FIN	Purpose of Investment	Purpose	Text (multi-line)	Yes	record.Purpose	Same as above	true	!IsBlank(txtPurpose.Text)	Purpose: txtPurpose.Text	"Purpose is required"
CAR	Section A	Payback	txtPayback	cmpTextInputField	TextInput	MainDB_FIN	Payback	Payback	Text	No	record.Payback	Same as above	true	None	Payback: txtPayback.Text	—
CAR	Section A	IRR	txtIRR	cmpTextInputField	TextInput	MainDB_FIN	IRR	IRR	Text	No	record.IRR	Same as above	true	None	IRR: txtIRR.Text	—
CAR	Section A	Amount Budgeted (RM)	curBudgetAmt	cmpCurrencyField	TextInput (number)	MainDB_FIN	Amount Budgeted	BudgetAmt	Number	Yes	record.BudgetAmt	Same as above	true	Value(curBudgetAmt.Text) > 0	BudgetAmt: Value(curBudgetAmt.Text)	"Budget Amount must be greater than 0"
CAR	Section A	Budget Number	txtBudgetNo	cmpTextInputField	TextInput	MainDB_FIN	Budget Number	BudgetNo	Text	No	record.BudgetNo	Same as above	true	None	BudgetNo: txtBudgetNo.Text	—
CAR	Section A	Requested by	pplPreparedby	cmpPeoplePicker	Custom (people picker)	MainDB_FIN	Requested by	Preparedby	Person	Yes	gblCurrentUser (auto)	DisplayMode.View (auto-filled)	true	None	Preparedby: {Email: gblCurrentUser.Mail, DisplayName: gblCurrentUser.DisplayName}	—
CAR	Section A	Requested Date	datPrepareddate	cmpDateField	DatePicker	MainDB_FIN	Requested Date	Prepareddate	Date	Yes	Today() (auto)	DisplayMode.View (auto-filled)	true	None	Prepareddate: Today()	—
CAR	Section A	Reviewer (HOD)	pplHOD	cmpPeoplePicker	Custom (people picker)	MainDB_FIN	Reviewer (HOD)	HOD	Person	Yes	record.HOD	If(gblFormMode="New" Or gblFormMode="Edit", DisplayMode.Edit, DisplayMode.View)	true	!IsBlank(pplHOD.outSelectedUser.Email)	HOD: {Email: pplHOD.outSelectedUser.Email, DisplayName: pplHOD.outSelectedUser.DisplayName}	"HOD Reviewer is required"
CAR	HOD Approval	Reviewed By	lblReviewedby	cmpReadOnlyField	Label	MainDB_FIN	Name	Reviewedby	Person	No	record.Reviewedby	DisplayMode.View	gblFormMode = "View" Or gblFormMode = "Approve"	None	Reviewedby: {Email: gblCurrentUser.Mail} (set by HOD action)	—
CAR	HOD Approval	Reviewed Date	lblRevieweddate	cmpReadOnlyField	Label	MainDB_FIN	Date	Revieweddate	Date	No	record.Revieweddate	DisplayMode.View	gblFormMode = "View" Or gblFormMode = "Approve"	None	Revieweddate: Now() (set by HOD action)	—
CAR	HOD Approval	Reviewer Remarks	txtReviewedrem	cmpMultilineTextField	TextInput	MainDB_FIN	Remark	Reviewedrem	Multi-line Text	No	record.Reviewedrem	If(fxUserHasRole("HOD_FIN", "CAR") And locRecord.Status = "Submitted", DisplayMode.Edit, DisplayMode.View)	gblFormMode = "View" Or gblFormMode = "Approve"	None	Reviewedrem: txtReviewedrem.Text	—
CAR	COO Approval	Approved By (COO)	lblApprovedby	cmpReadOnlyField	Label	MainDB_FIN	Name	Approvedby	Person	No	record.Approvedby	DisplayMode.View	gblFormMode = "View" Or gblFormMode = "Approve"	None	Approvedby: {Email: gblCurrentUser.Mail} (set by COO action)	—
CAR	COO Approval	Approved Date (COO)	lblApproveddate	cmpReadOnlyField	Label	MainDB_FIN	Date	Approveddate	Date	No	record.Approveddate	DisplayMode.View	Same as COO section	None	Approveddate: Now()	—
CAR	Director Approval	Approved By (ED)	lblEDApprovedby	cmpReadOnlyField	Label	MainDB_FIN	Name	EDApprovedby	Person	No	record.EDApprovedby	DisplayMode.View	Same as Director section	None	EDApprovedby: {Email: gblCurrentUser.Mail} (set by ED action)	—
CAR	Additional CAR	Additional CAR Amount (RM)	curAddCARAmt	cmpCurrencyField	TextInput (number)	MainDB_FIN	Additional CAR Amount	AddCARAmt	Number	No	record.AddCARAmt	If(gblFormMode="Edit" And fxUserHasRole("Submitter","CAR"), DisplayMode.Edit, DisplayMode.View)	locRecord.Status = "Approved"	None	AddCARAmt: Value(curAddCARAmt.Text)	—
CAR	Completion	Final Completion Date	datFinalCompDate	cmpDateField	DatePicker	MainDB_FIN	Completion Date	FinalCompDate	Date	No	record.FinalCompDate	If(gblFormMode="Edit" And fxUserHasRole("Submitter","CAR"), DisplayMode.Edit, DisplayMode.View)	locRecord.Status = "Approved"	None	FinalCompDate: datFinalCompDate.SelectedDate	—
CAR	Completion	Remarks	txtRem	cmpMultilineTextField	TextInput	MainDB_FIN	Remarks	Rem	Multi-line Text	No	record.Rem	Same as Completion section	true	None	Rem: txtRem.Text	—
CAR	Status/Workflow	Current Action	lblCA	cmpReadOnlyField	Label	MainDB_FIN	CurrentAction	CA	Text	Auto	System-managed	DisplayMode.View	true	None	CA: fxGetNextCA("CAR", locAction)	—
CAR	Status/Workflow	Status	cmpStatus	cmpStatusBadge	Component	MainDB_FIN	Status	Status	Text (Choice)	Auto	System-managed	DisplayMode.View	true	None	Status: fxGetNextStatus("CAR", locAction)	—
Pattern for all other 360 forms	All sections	All fields from MASTER_FIELD_DICTIONARY	Follow naming: txt|drp|dat|cur|ppl|tgl + FieldInternalName	Follow type mapping table	Follow control type mapping	MainDB_{DEPT} per form	Display label from MASTER_FIELD_DICTIONARY	Internal name from MASTER_FIELD_DICTIONARY	Type from MASTER_FIELD_DICTIONARY	As per form requirements doc	From AppConfig_FormRules	Per section visibility rules	Per AppConfig_FormRules	Per form validation rules	Patch using internal names	Per form validation message
Control Type Mapping (from Field Dictionary types):

Field Dictionary Type	Canvas Control	Canvas Component
Text (single line)	TextInput	cmpTextInputField
Multiline Text	TextInput (multiline:true)	cmpMultilineTextField
Number/Text	TextInput (number format)	cmpNumberField
Number	TextInput (number format)	cmpNumberField
Date/Text	DatePicker	cmpDateField
Date	DatePicker	cmpDateField
Person/Text	Custom people picker	cmpPeoplePicker
Person	Custom people picker	cmpPeoplePicker
Choice/Text	Dropdown	cmpChoiceField
Currency	TextInput (currency format)	cmpCurrencyField
Boolean	Toggle or Checkbox	cmpYesNoField
Lookup	Dropdown (lookup source)	cmpLookupField
Calculated	Label (read-only)	cmpCalculatedFieldDisplay
10. Role-to-Screen Access Matrix
Note: All specific role names are MISSING_INFO — marked "Needs Human Confirmation" in the MASTER_ROLE_SECTION_REGISTER. The matrix below documents the role category pattern derived from workflow signal analysis. Exact role names and user assignments must be confirmed before build.

Role Category	Screens Allowed	Screens Hidden	Default Landing Screen	Components Affected	Notes
All Authenticated Users (base)	scrHomeDashboard, scrMyRequests, scrNotFound, scrAccessDenied, scrHelp	scrAdminConfig	scrHomeDashboard	cmpAppShell (all)	All M365 / SharePoint licensed users
Submitter (form-specific — can create new records for assigned form codes)	scrHomeDashboard, scrMyRequests, scrDeptHub, scrFormList, scrNewRequest, scrEditDraft (own Drafts only), scrViewRequest (own records)	scrAllRequestsAdmin, scrApprovalProcess (unless also approver), scrAdminConfig	scrHomeDashboard or scrDeptHub	cmpCommandBar (New, Save Draft, Submit visible); cmpWorkflowActionPanel (Withdraw visible for own Drafts)	MISSING_INFO: exact user-to-form assignments. Pattern: most employees are Submitters for their dept's forms
HOD (Head of Department)	All Submitter screens + scrAllRequestsAdmin (dept-filtered), scrApprovalProcess (own dept pending)	scrAdminConfig	scrApprovalProcess or scrHomeDashboard	cmpWorkflowActionPanel (Approve/Reject HOD stage); cmpApprovalPanel (HOD section editable)	MISSING_INFO: exact HOD user list per dept. Present in workflow for most of the 361 forms
COO / Senior Approver	All HOD screens (cross-dept) + scrAllRequestsAdmin (all depts)	scrAdminConfig	scrApprovalProcess	cmpWorkflowActionPanel (COO Approve stage); cmpApprovalPanel (COO/Executive section)	MISSING_INFO: applies to high-value forms (CAR, CMF, Manpower Req, etc.)
Divisional Director / Executive Director	All senior approver screens	scrAdminConfig	scrApprovalProcess	cmpWorkflowActionPanel (Director Approve stage)	MISSING_INFO: highest approval tier for CAR, CMF_A, MER, etc.
Verifier (quality/inspection role)	All Submitter screens + scrApprovalProcess (verification stage)	scrAdminConfig, scrAllRequestsAdmin	scrApprovalProcess	cmpWorkflowActionPanel (Verify action)	Found in QC, QA, SHE, LOG forms with "Verified" workflow signals
HR Personnel / HR HOD	HR dept screens + scrApprovalProcess (HR verification stage)	scrAdminConfig	scrApprovalProcess	cmpWorkflowActionPanel (HR Verify/Approve); cmpApprovalPanel (HR sections)	Found in HR workflow for CWR, NDF, SR, etc.
IT Admin / App Admin	All screens including scrAdminConfig	None	scrAdminConfig or scrHomeDashboard	cmpAdminConfigPanel, cmpRoleMatrixViewer, cmpReferenceDataManager (all visible); Admin-only sections in cmpCommandBar	MISSING_INFO: exact IT Admin user list
Read-Only Viewer	scrHomeDashboard, scrMyRequests, scrFormList, scrViewRequest	scrNewRequest, scrEditDraft, scrApprovalProcess, scrAdminConfig	scrHomeDashboard	cmpCommandBar (only View/Print); cmpWorkflowActionPanel (no actions)	MISSING_INFO: confirm if read-only role exists
QR PIC (Quality Representative)	Quality dept screens + approval screens	scrAdminConfig	scrApprovalProcess	Found in QC RETASAMP form — QRPIC field	MISSING_INFO: confirm exact role scope
11. Workflow-to-UI Behavior Matrix
Common Workflow States (Derived from MASTER_WORKFLOW_REGISTER signal analysis)
All 361 forms share one or more of these states. The exact state labels and transitions vary per form — confirmed rules must come from per-form requirement documents. The following represents the canonical pattern derived from cross-form workflow signal analysis.

Workflow State	Role Allowed To Act	Visible Sections	Editable Sections	Read-Only Sections	Available Buttons	Hidden Buttons	Required Validation	SharePoint Fields Updated	Next Status	History/Audit Write Required?
Draft	Submitter (own record)	All sections for this form	All submitter-editable sections	HOD Approval, Verification, Approval sections (all blank)	Save Draft; Submit; Delete (own); Cancel	Approve; Reject
The output was cut off. I need to continue the Canvas App Rebuild Design Report from where it stopped. The last section being written was Section 11 (Workflow-to-UI Behavior Matrix), specifically the table. Let me continue from there and complete the remaining sections:

Workflow-to-UI Behavior Matrix (continuing)
SharePoint Read/Write Formula Plan
Canvas Naming Standard
Missing Information, Conflicts, and Risks
Recommended Canvas Build Order
Approval Needed Before Implementation
Now I'm picking up where the report left off and working through the remaining sections to complete the full design document.

Workflow State	Role Allowed To Act	Visible Sections	Editable Sections	Read-Only Sections	Available Buttons	Hidden Buttons	Required Validation	SharePoint Fields Updated	Next Status	History/Audit Write Required?
Draft	Submitter (own record)	All submitter sections	All submitter sections	HOD/Approval sections (locked, blank)	Save Draft; Submit; Delete	Approve; Reject; Verify; Return	Required field validation on Submit	Status="Draft"; CA="Submitter"; SubmittedBy; SubmittedDate (on Submit)	Submitted (on Submit)	No (Draft saves are not audited)
Submitted	HOD (dept match)	All sections	None (record locked pending HOD action)	All sections read-only	Approve (HOD); Reject (HOD); Return for Edit	Submit; Save Draft; Delete; Verify (not yet)	Comment required for Reject	Status="HOD Review" or "Rejected"; CA="HOD"; Reviewedby; Revieweddate; Reviewedrem	HOD Review (auto) or Rejected	Yes — on every action
HOD Review / Pending HOD	HOD	All sections + HOD Approval section	HOD Approval section only (comment, decision)	All submitter sections	Approve; Reject; Return for Edit; Delegate	Submit; Save Draft; Delete	Comment required for Reject	Status="Verified" or "Pending Verification" or "Pending COO"; CA=next role token; Reviewedby; Revieweddate; Reviewedrem	Verified / Pending Verification / Pending COO (form-specific)	Yes
Pending Verification	Verifier (form-specific role)	All sections + Verification section	Verification section only	All other sections	Verify; Reject; Return	Submit; Save Draft; Approve (reserved for higher)	MISSING_INFO — confirm if comment required	Status="Verified"; CA=next; VerifiedBy; VerifiedDate	Pending Approval / Approved	Yes
Verified	Senior Approver (COO/Director per form)	All sections + Approval section	Approval section only	All other sections	Approve; Reject; Return	Submit; Save Draft; Verify	Comment required for Reject	Status="Approved" or "Rejected"; CA=""; Approvedby; Approveddate; Approvedrem	Approved or Rejected	Yes
Pending COO	COO	All sections + COO Approval section	COO section only	All other sections	Approve; Reject; Return	Submit; Save Draft; Verify	Comment required for Reject	Status="Pending Director" or "Approved"; CA=next; Approvedby; Approveddate	Pending Director or Approved	Yes
Pending Director	Director/ED	All sections + Director Approval section	Director section only	All other sections	Approve; Reject	Submit; Save Draft; Verify	Comment required for Reject	Status="Approved"; CA=""; EDApprovedby; EDApproveddate	Approved	Yes
Approved	Admin/IT Admin only (for record-keeping edits)	All sections (read-only)	None (unless edit request active)	All sections	Print; Copy; Request Edit (submitter)	Submit; Approve; Reject; Delete	None for view; validation on edit request	Status unchanged unless edit request applied	Closed/Completed (form-specific)	No (view only)
Rejected	Submitter (may revise and resubmit)	All sections	Submitter sections (if resubmit allowed)	Approval/HOD sections	Resubmit (if allowed); Copy; Print	Approve; Verify; Delete	Required field validation on Resubmit	Status="Submitted"; CA="HOD"; rejection reason preserved	Submitted (if resubmit)	Yes (on resubmit)
Returned for Edit	Submitter (own record)	All sections	All submitter sections	Approval section (preserves comments)	Save Draft; Resubmit; Cancel	Approve; Reject; Verify	Required field validation on Resubmit	Status="Draft" or "Submitted"; CA="Submitter"	Draft (after return)	Yes
Completed / Closed	Read-only for all	All sections (read-only)	None	All sections	Print; Copy	All action buttons	None	Status="Completed"	Terminal state	No
Cancelled / Withdrawn	Submitter (own Draft/Submitted)	All sections (read-only)	None	All sections	Print	All action buttons	None	Status="Cancelled"; CA=""	Terminal state	Yes
Workflow Button Matrix
Button	Valid On Forms	Valid States	Valid Roles	Component Used	Action Purpose	Status Change	Requires Comment?	Requires Validation?	Notes
Save Draft	All forms	Draft, Returned for Edit	Submitter	cmpCommandBar	Save without submitting	Stays Draft	No	No (partial save)	Auto-saves partial data; no required-field check
Submit	All forms	Draft, Returned for Edit	Submitter	cmpCommandBar + cmpWorkflowActionPanel	Submit for approval	Draft → Submitted	No	Yes — all required fields	Triggers CA = HOD token
Approve (HOD)	All approval forms	Pending HOD	HOD	cmpWorkflowActionPanel	HOD approves submission	HOD Review → Verified/Pending next stage	Optional (MISSING_INFO per form)	No	Writes Reviewedby, Revieweddate
Reject (HOD)	All approval forms	Pending HOD	HOD	cmpWorkflowActionPanel	HOD rejects submission	HOD Review → Rejected	Yes	No	Writes Reviewedrem; notifies submitter
Verify	Forms with verification stage	Pending Verification	Verifier	cmpWorkflowActionPanel	Verifier confirms	Pending Verification → Verified	Optional	No	Writes VerifiedBy, VerifiedDate
Approve (COO)	High-value forms (CAR, CMF, MER, etc.)	Pending COO	COO	cmpWorkflowActionPanel	COO approval	Pending COO → Pending Director or Approved	Optional	No	Writes Approvedby, Approveddate
Approve (Director)	High-value forms	Pending Director	Director/ED	cmpWorkflowActionPanel	Final approval	Pending Director → Approved	Optional	No	Writes EDApprovedby, EDApproveddate
Return for Edit	All approval forms	Any review/approval state	HOD, Verifier, Approver	cmpWorkflowActionPanel	Send back to submitter	Any → Returned for Edit / Draft	Yes — reason required	No	Writes return comment; notifies submitter
Reject	All approval forms	Any approval state	HOD, Verifier, Approver	cmpWorkflowActionPanel	Reject record	Any → Rejected	Yes	No	Writes rejection comment
Withdraw	All forms	Draft, Submitted	Submitter (own records)	cmpWorkflowActionPanel	Cancel before approval	Any → Cancelled	No	No	Submitter can only withdraw own records
Resubmit	Forms allowing resubmit	Rejected, Returned for Edit	Submitter	cmpCommandBar	Re-enter approval flow	Rejected/Returned → Submitted	No	Yes — all required fields	MISSING_INFO: not all forms allow resubmit — confirm per form
Delete	All forms	Draft only	Submitter (own) or Admin	cmpCommandBar	Permanently delete	Draft → Deleted	No	No (confirm dialog required)	Confirm dialog via cmpConfirmDialog; only Draft records
Delegate	Forms with delegation	HOD/Approval states	HOD, Approver	cmpWorkflowActionPanel	Delegate action to another person	Unchanged (delegate assigned)	No	No	Uses delegation-dialog pattern from TSX; writes delegate assignment
Print	All forms	All states	All roles with view access	cmpCommandBar	Print/export record	None	No	No	MISSING_INFO: Power Apps print behavior — may need Power Automate PDF generation
Copy	All forms	All states	Submitter, Admin	cmpCommandBar	Copy record as new Draft	None (creates new Draft)	No	No	New record pre-filled with current values
Request Edit	All forms	Approved	Submitter (own)	cmpWorkflowActionPanel	Request to edit an approved record	None (creates edit request)	Yes — reason required	No	Maps to TSX hasActiveEditRequest pattern
12. SharePoint Read/Write Formula Plan
All formulas below are marked DRAFT_FORMULA. Use actual confirmed SharePoint internal column names before implementing. All field internal names from MASTER_FIELD_DICTIONARY are PDF-extracted only and must be verified against deployed SP lists.

Action	Button / Control	Component	Trigger Property	Validation Before Write	Target SharePoint List	Columns Written Using Internal Names	Status Update	Audit / History Write	Success Notification	Failure Notification	Navigation After Success
Save Draft	btnSaveDraft	cmpCommandBar	OnSelect	None (partial save allowed)	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, If(IsBlank(gblActiveRecordID) Or gblActiveRecordID=0, Defaults(MainDB_FIN), LookUp(MainDB_FIN, ID=gblActiveRecordID)), {FormCode: gblActiveFormCode, Status: "Draft", [all currently filled fields]})	Status = "Draft"; CA = "Submitter"	No	cmpSuccessMessage "Draft saved"	cmpErrorState "Save failed"	Stay on current screen; set gblActiveRecordID if new
Submit New	btnSubmit	cmpCommandBar + cmpWorkflowActionPanel	OnSelect	All required fields per AppConfig_FormRules; locValidationErrors must be empty	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, LookUp(MainDB_FIN, ID=gblActiveRecordID), {Status: "Submitted", CA: fxGetHODToken("CAR"), SubmittedDate: Now(), FormCode: "CAR", [all field values]})	Status = "Submitted"; CA = HOD role token	DRAFT_FORMULA: Patch(WorkflowHistory, Defaults(WorkflowHistory), {ParentID: gblActiveRecordID, ListName: gblActiveListName, Action: "Submitted", Actor: gblCurrentUser.Mail, ActionDate: Now(), PreviousStatus: "Draft", NewStatus: "Submitted"})	"Request submitted successfully"	"Submit failed — please try again"	Navigate(scrMyRequests)
HOD Approve	btnApprove	cmpWorkflowActionPanel	outActionTaken = "Approve"	None	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, LookUp(MainDB_FIN, ID=gblActiveRecordID), {Status: fxGetNextStatus("CAR","HODApprove"), CA: fxGetNextCA("CAR","HODApprove"), Reviewedby: {Email: gblCurrentUser.Mail, DisplayName: gblCurrentUser.DisplayName}, Revieweddate: Today(), Reviewedrem: cmpApprovalCommentBox.outComment})	Status = next per workflow rules; CA = next role	Yes: Patch WorkflowHistory with Action="HOD Approved"	"Approved successfully"	"Approval action failed"	Navigate(scrApprovalProcess)
HOD Reject	btnReject	cmpWorkflowActionPanel	outActionTaken = "Reject"	Comment must not be blank	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, LookUp(MainDB_FIN, ID=gblActiveRecordID), {Status: "Rejected", CA: "", Reviewedby: {Email: gblCurrentUser.Mail}, Revieweddate: Today(), Reviewedrem: cmpApprovalCommentBox.outComment})	Status = "Rejected"; CA = ""	Yes: Action="HOD Rejected"	"Record rejected"	"Reject action failed"	Navigate(scrApprovalProcess)
Verify	btnVerify	cmpWorkflowActionPanel	outActionTaken = "Verify"	MISSING_INFO — per form	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_{DEPT}, LookUp(MainDB_{DEPT}, ID=gblActiveRecordID), {Status: fxGetNextStatus(gblActiveFormCode,"Verify"), CA: fxGetNextCA(gblActiveFormCode,"Verify"), VerifiedBy: MISSING_INFO, VerifiedDate: Today()})	Status = next per workflow rules	Yes: Action="Verified"	"Verified successfully"	"Verification failed"	Navigate(scrApprovalProcess)
COO Approve	btnApprove	cmpWorkflowActionPanel	outActionTaken = "COOApprove"	None	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, LookUp(MainDB_FIN, ID=gblActiveRecordID), {Status: fxGetNextStatus("CAR","COOApprove"), CA: fxGetNextCA("CAR","COOApprove"), Approvedby: {Email: gblCurrentUser.Mail}, Approveddate: Today(), Approvedrem: cmpApprovalCommentBox.outComment})	Status = next; CA = Director token (if applicable)	Yes: Action="COO Approved"	"COO Approval recorded"	"Approval action failed"	Navigate(scrApprovalProcess)
Director Approve	btnApprove	cmpWorkflowActionPanel	outActionTaken = "DirectorApprove"	None	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_FIN, LookUp(MainDB_FIN, ID=gblActiveRecordID), {Status: "Approved", CA: "", EDApprovedby: {Email: gblCurrentUser.Mail}, EDApproveddate: Today(), EDApprovedrem: cmpApprovalCommentBox.outComment})	Status = "Approved"; CA = ""	Yes: Action="Director Approved"	"Final approval recorded"	"Approval action failed"	Navigate(scrApprovalProcess)
Return for Edit	btnReturn	cmpWorkflowActionPanel	outActionTaken = "Return"	Comment required	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_{DEPT}, LookUp(MainDB_{DEPT}, ID=gblActiveRecordID), {Status: "Draft", CA: "Submitter", ReturnComment: cmpApprovalCommentBox.outComment, ReturnDate: Now()})	Status = "Draft"; CA = "Submitter"	Yes: Action="Returned for Edit"	"Returned to submitter"	"Return action failed"	Navigate(scrApprovalProcess)
Withdraw	btnWithdraw	cmpWorkflowActionPanel	outActionTaken = "Withdraw" (after confirm dialog)	Confirm dialog must be confirmed	MainDB_{gblActiveDept}	DRAFT_FORMULA: Patch(MainDB_{DEPT}, LookUp(MainDB_{DEPT}, ID=gblActiveRecordID), {Status: "Cancelled", CA: ""})	Status = "Cancelled"	Yes: Action="Withdrawn"	"Request withdrawn"	"Withdraw failed"	Navigate(scrMyRequests)
Delete Draft	btnDelete	cmpCommandBar	OnSelect (after confirm)	Confirm dialog; Draft status only	MainDB_{gblActiveDept}	DRAFT_FORMULA: Remove(MainDB_{DEPT}, LookUp(MainDB_{DEPT}, ID=gblActiveRecordID))	Record deleted	No	"Draft deleted"	"Delete failed"	Navigate(scrMyRequests)
Load Record List (OnVisible)	scrFormList	Screen	OnVisible	None	MainDB_{gblActiveDept}	DRAFT_FORMULA: ClearCollect(colRequests, Filter(MainDB_{DEPT}, FormCode=gblActiveFormCode And Site=gblActiveSite)) — note: delegation requires indexed columns	None	No	None	cmpErrorState if fails	Stay on screen
Load Single Record (OnVisible)	scrViewRequest / scrEditDraft	Screen	OnVisible	None	MainDB_{gblActiveDept}	DRAFT_FORMULA: Set(locRecord, LookUp(MainDB_{DEPT}, ID=gblActiveRecordID)); ClearCollect(colWorkflowHistory, Filter(WorkflowHistory, ParentID=gblActiveRecordID))	None	No	None	Navigate(scrNotFound) if blank	Stay on screen
Load Child Rows (OnVisible)	scrViewRequest / scrEditDraft (editable gallery forms)	Screen	OnVisible (after locRecord loaded)	None	MainDB_{DEPT}Ext{FORMCODE}_Rows	DRAFT_FORMULA: ClearCollect(colChildItems, Filter(MainDB_FIN_Ext_INSUCLAI_Rows, ParentID=gblActiveRecordID))	None	No	None	cmpErrorState	Stay on screen
Save Child Rows	btnSave / btnSubmit	cmpCommandBar	OnSelect (ForAll loop)	None separately (parent form validation covers)	MainDB_{DEPT}Ext{FORMCODE}_Rows	DRAFT_FORMULA: ForAll(colChildItems, If(IsBlank(ThisRecord.ID), Patch(MainDB_FIN_Ext_INSUCLAI_Rows, Defaults(MainDB_FIN_Ext_INSUCLAI_Rows), {ParentID: gblActiveRecordID, [row fields]}), Patch(MainDB_FIN_Ext_INSUCLAI_Rows, LookUp(MainDB_FIN_Ext_INSUCLAI_Rows, ID=ThisRecord.ID), {[row fields]})))	None	No	Included in parent save success	Included in parent save error	Same as parent
People Search	txtSearch in cmpPeoplePicker	cmpPeoplePicker	OnChange	None	Office365Users connector	DRAFT_FORMULA: ClearCollect(locSearchResults, Office365Users.SearchUser({searchTerm: Self.Text, top: 10}).value)	N/A	No	None	cmpErrorState inline	Stay in picker
App.OnStart — Load Roles	App	App	OnStart	None	AppConfig_Roles	DRAFT_FORMULA: ClearCollect(gblUserRoles, Filter(AppConfig_Roles, UserEmail=gblCurrentUser.Mail))	N/A	No	None	Set(gblRoleLoadError, true)	None (handled in loading screen)
App.OnStart — Load Config	App	App	OnStart	None	AppConfig_ChoiceLists; AppConfig_WorkflowRules; AppConfig_FormRules	DRAFT_FORMULA: ClearCollect(colChoiceLists, AppConfig_ChoiceLists); ClearCollect(colWorkflowRules, AppConfig_WorkflowRules)	N/A	No	None	Set(gblConfigLoadError, true)	None
13. Canvas Naming Standard
Screen Names
Pattern	Format	Example
Screen	scr<PascalName>	scrHomeDashboard, scrNewRequest, scrViewRequest, scrApprovalProcess
Component Names
Pattern	Format	Example
Component	cmp<ComponentName>	cmpStatusBadge, cmpWorkflowActionPanel
Component input property	prop<Name>	propCurrentStatus, propFormMode, propFormCode
Component output property	out<Name>	outActionSelected, outSelectedUser, outValue
Component internal container	con<Area>	conHeader, conFieldArea, conActionRow
Component internal label	lbl<Name>	lblTitle, lblStatus, lblFieldLabel
Component internal button	btn<ActionName>	btnApprove, btnSubmit, btnClearUser
Component internal icon	ico<Name>	icoStatus, icoUser, icoNavIcon
Component internal gallery	gal<Name>	galHistory, galNavItems, galActions
Component internal text input	txt<Name>	txtSearch, txtComment
Component internal date picker	dat<Name>	datPicker, datStartDate
Component internal dropdown	drp<Name>	drpChoice, drpStatus
Component internal image	img<Name>	imgUserPhoto, imgLogo
Component internal toggle	tgl<Name>	tglYesNo
Component internal checkbox	chk<Name>	chkAcknowledge
Screen-Level Controls
Control Type	Naming Pattern	Example
Text input	txt<FieldName>	txtRequestTitle, txtCompany
Dropdown	drp<FieldName>	drpDepartment, drpStatus
Combo box	cmb<FieldName>	cmbApprover, cmbSystems
Date picker	dat<FieldName>	datDueDate, datStartDate
Toggle	tgl<FieldName>	tglIsUrgent, tglYesNo
Checkbox	chk<FieldName>	chkAcknowledged
Label (read-only display)	lbl<FieldName>	lblRequestStatus, lblSubmittedBy
Button	btn<ActionName>	btnSubmit, btnApprove, btnSaveDraft
Gallery	gal<ItemName>	galRequests, galHistory, galChildRows
Form	frm<FormName>	frmRequest, frmCAR
Container	con<SectionName>	conApprovalDetails, conSubmitterSection
Component instance	cmp<ComponentName> (instance suffix if multiple)	cmpStatusBadge1, cmpApprovalPanel_HOD
Icon	ico<Name>	icoBack, icoApprove
Timer	tmr<Name>	tmrSuccess (for auto-dismiss notifications)
Variables and Collections
Item	Naming Pattern	Example
Global variable	gbl<PascalName>	gblCurrentUser, gblActiveSite, gblActiveFormCode
Context variable (screen-local)	loc<PascalName>	locRecord, locValidationErrors, locIsLoading
Collection	col<PascalName>	colRequests, colWorkflowHistory, colChildItems
Named formula	fx<CamelName>	fxGetStatusColor, fxUserHasRole, fxGetNextStatus
SharePoint Internal Names
Item	Rule	Example
SP list names	Match MASTER_SHAREPOINT_DESIGN_REGISTER exactly	MainDB_FIN, MainDB_HR_Ext_BSD_Rows
SP column references in Patch	Use SP internal column name (not display label)	Reviewedby, Approveddate, CA, Status
SP column references in UI	Use display label from MASTER_FIELD_DICTIONARY	"Reviewer (HOD)", "Approval Date"
AppConfig Lists (Proposed)
Config List	Purpose	Key Columns
AppConfig_Roles	User-to-role mapping	UserEmail, RoleCode, DeptCode, FormCode, Site
AppConfig_FormRules	Per-form field and section config	FormCode, SectionName, FieldInternalName, IsVisible, IsRequired, EditableByRole
AppConfig_ChoiceLists	All dropdown choice values	ListName, ChoiceKey, ChoiceValue, SortOrder, Site
AppConfig_WorkflowRules	State transitions per form+role	FormCode, CurrentStatus, RoleCode, AllowedAction, NextStatus, CommentRequired
WorkflowHistory	Audit log for all approval actions	ParentID, ListName, FormCode, Action, Actor, ActionDate, Comment, PreviousStatus, NewStatus
14. Missing Information, Conflicts, and Risks
Type	Item	Impact	Needed To Resolve
MISSING_INFO	SharePoint site URL (Johor and Penang)	Cannot add any SP data sources to Canvas App	Confirm production SP site URLs from IT team
MISSING_INFO	Confirmed SharePoint internal column names for all lists	All Patch/Filter formulas will be wrong without confirmed internal names	Export SP list schema from each deployed MainDB_ list (via SP Admin or PnP PowerShell)
MISSING_INFO	Role matrix — exact role names, role codes, and user assignments per form	cmpAccessGuard, cmpWorkflowActionPanel, AppConfig_Roles all depend on confirmed role structure	Requires business stakeholder sign-off on who can do what per form. All 361 forms show "Needs Human Confirmation" in MASTER_ROLE_SECTION_REGISTER
MISSING_INFO	Approval workflow per form — exact status values, CA tokens, and transition rules	AppConfig_WorkflowRules and all Patch formulas depend on this	Extract and confirm per-form workflow from each MASTER-{N}_SOURCES.md requirement document
MISSING_INFO	Approval requirement for 3 forms (Hardware Inventory #21/#180, Employee Personal Health Record #145, Contractor/Vendor Agreement #356)	Cannot determine if these need approval screens	Confirm with form owners whether these forms require approval
MISSING_INFO	Whether a global WorkflowHistory list exists or each dept has its own history list	Affects data source design and all audit write formulas	Confirm SP list design decision with IT admin
MISSING_INFO	SharePoint attachment approach — native SP list attachments vs. separate Attachments child list	Affects cmpAttachmentPanel design and all file upload/download logic	Confirm with IT team. Native SP attachments require SharePoint connector's AddAttachmentToRecord action
MISSING_INFO	Central form reference document (central-form-reference.md) — referenced in root but not found	May contain critical form design decisions	Locate or regenerate from generate-central-form-reference.ps1 in root
MISSING_INFO	UI page specification (design-requirement/ui-page-specification.md)	May contain screen layouts not yet captured	Read this file and reconcile with Canvas screen inventory
MISSING_INFO	Whether modern Power Apps controls (v3 model-driven-style controls) are confirmed available in this environment	Affects which control types to use in component design	Confirm Power Apps environment version and modern controls availability with IT team
MISSING_INFO	Print/export requirement — whether PDF generation is needed	Affects whether Power Automate flows are needed for Print action	Confirm with business: is browser Print sufficient, or is PDF generation required?
MISSING_INFO	Notification requirement — whether email notifications are required on approval actions	If yes, Power Automate flows needed for each status transition	Confirm with business: are email notifications in scope?
MISSING_INFO	Delegation logic — exact rules for who can delegate to whom	Affects cmpWorkflowActionPanel delegate action	Confirm per-form delegation rules with HOD/approver stakeholders
MISSING_INFO	Resubmission rules — which forms allow resubmit after rejection	Affects available buttons in Rejected state	Confirm per form from requirement documents
MISSING_INFO	User access between sites — whether Johor users can see Penang forms and vice versa	Affects global site filter and role matrix design	Confirm cross-site access policy with HR/IT
MISSING_INFO	AppConfig lists schema and existing data — whether AppConfig_FormRules, AppConfig_Roles, AppConfig_WorkflowRules already exist or need to be created	If they don't exist, provisioning is part of build scope	Confirm with IT team whether config infrastructure exists
MISSING_INFO	Canvas App naming convention preference (confirmed vs. proposed)	Affects all control/component/variable names throughout build	Confirm the naming convention in this report or request changes before build
MISSING_INFO	Preferred Canvas App color theme and typography	Affects cmpAppHeader, cmpStatusBadge, cmpFormModeBanner visual design	Confirm brand colors and font from UI/design team
MISSING_INFO	Help content — whether scrHelp is required and if an AppConfig_HelpContent list exists	Affects whether scrHelp is built	Confirm with project owner
CONFLICT_FOUND	MainDB_HR is used for both Johor HR forms (CANTCOMP, CWR, JD, NDF, SR, etc.) and potentially Penang HR forms. The same list name appears for both sites.	If SP lists are per-site (separate sites), there is no conflict. If it is one list for both sites, the Site column must discriminate.	Confirm whether Johor and Penang SP sites are separate SP site collections or the same site with a Site discriminator column
CONFLICT_FOUND	FormCode "NDF" is used for both "Late Coming Notification" (Master #12) and "Night Visit Notification" (Master #14) in the MASTER_SHAREPOINT_DESIGN_REGISTER.	Both forms share the same FormCode and parent list MainDB_HR. If correct, the app must distinguish by an additional column.	Confirm whether NDF is intentional for both, or one should be renamed
CONFLICT_FOUND	"Pancen - Incoming Letter of Credit" appears twice: Master #127 (MKT owner) and Master #128 (SlsAdm owner), both in Johor.	May be a duplicate form or a copy owned by two departments. Affects whether one or two SP list entries are needed.	Confirm with FIN/MKT/SlsAdm owners whether these are the same form or different
RISK	22,074 fields across 361 forms — manual field-to-control mapping is very large work. The hybrid SP EditForm approach reduces this but requires all SP lists to have the correct schema already deployed.	If SP lists are not yet provisioned, the Canvas App cannot be built.	Run Invoke-CoreSharePointProvisioning.ps1 (found in root) to provision SP lists. Verify before Canvas build starts.
RISK	Canvas App delegation limits — Power Apps can only delegate Filter/Sort operations to SP for indexed columns. Galleries showing all records from large MainDB_ lists (e.g. MainDB_QA with 80 forms' data) may hit 500/2000 record limits.	Large departments (QA, QC, PUR) will have thousands of records in single lists; unindexed queries will fail or truncate.	Ensure Status, FormCode, Site, SubmittedBy, and CreatedDate are indexed in all MainDB_ lists before adding as data sources
RISK	Canvas App data source limit — Power Apps has a limit of 200 data sources per app. With 20+ MainDB_ lists + 20+ child lists + 5+ AppConfig lists + connectors, approaching this limit is possible.	May require splitting app into multiple Canvas Apps (one per site, or one per major dept group)	Count exact data sources needed after SP schema confirmation; plan app split strategy if needed
RISK	All role logic is currently "Needs Human Confirmation" — if role matrix cannot be confirmed before build, workflow buttons and access guards cannot be wired up.	Core functionality (approvals, section visibility) blocked without role matrix.	Make role matrix confirmation a blocker for build start
RISK	The MainDB_T&D SP list name contains & character which may cause issues in Power Apps data source registration.	Power Apps may reject or mangle the list name.	Test SP connection to MainDB_T&D specifically. Consider renaming to MainDB_TD if issues arise.
ASSUMPTION	All MainDB_ lists use FormCode (exact internal name) as the discriminator column to identify which form a record belongs to	If the actual internal name is different (e.g. Form_Code, formcode, ApplicationCode), all Filter formulas will fail	Verify FormCode column internal name in each deployed list
ASSUMPTION	All MainDB_ lists use CA (exact internal name) for the CurrentAction/routing field	If actual name differs, all workflow CA-based routing will fail	Verify CA column internal name in deployed lists
ASSUMPTION	All MainDB_ lists use Status (exact internal name) as the status column	Common SharePoint convention; verify against actual deployed lists	Verify Status column internal name
ASSUMPTION	The Canvas App is deployed as a single Power Apps app (not split per site or per dept)	If data source limits require splitting, component reuse strategy needs revision	Assess after data source count is confirmed
ASSUMPTION	Power Automate flows are NOT in scope for this Canvas App build, except as noted for notifications and print	If Power Automate is in scope, flow triggers and actions must be designed separately	Confirm Power Automate scope with project owner
15. Recommended Canvas Build Order
Build Step	Area	What To Build	Dependency	Validation
1	Schema	Confirm SharePoint site URLs (Johor and Penang)	None	Document both site URLs
2	Schema	Export and confirm SP internal column names for all MainDB_ lists — at minimum: MainDB_FIN, MainDB_HR, MainDB_IT, MainDB_QA, MainDB_QC, MainDB_PUR	SP sites accessible	Column names match MASTER_FIELD_DICTIONARY or corrections documented
3	Schema	Confirm FormCode and CA column internal names across all lists	Step 2	Verified internal names for the 2 most critical columns
4	Schema	Confirm and finalise role matrix — at minimum for the first pilot form (recommend CAR as pilot)	Business stakeholder	Role matrix document approved
5	Schema	Confirm workflow states and transitions for pilot form (CAR)	Role matrix	AppConfig_WorkflowRules data for CAR confirmed
6	Infrastructure	Provision AppConfig lists (AppConfig_Roles, AppConfig_FormRules, AppConfig_ChoiceLists, AppConfig_WorkflowRules, WorkflowHistory) in SP	SP admin access	Lists exist with correct columns
7	Infrastructure	Populate AppConfig_FormRules and AppConfig_WorkflowRules for pilot form (CAR)	Step 6	Config data loadable from Canvas
8	Canvas App	Create Canvas App; add data sources: MainDB_FIN, AppConfig_Roles, AppConfig_FormRules, AppConfig_WorkflowRules, AppConfig_ChoiceLists, WorkflowHistory, Office365Users	Steps 1-7	Data sources connect without errors
9	Canvas App	Write App.OnStart: load gblCurrentUser, gblUserRoles, gblActiveSite, colChoiceLists, colWorkflowRules; set gblAppLoaded	Step 8	All global variables populated on app launch
10	Components	Build feedback/state components first: cmpLoadingState, cmpErrorState, cmpEmptyState, cmpSuccessMessage, cmpConfirmDialog, cmpWarningBanner	Step 9	All 6 feedback components testable in isolation
11	Components	Build app shell: cmpAppShell, cmpAppHeader, cmpSideNav, cmpBreadcrumb, cmpCommandBar, cmpAccessGuard	Step 10	Shell renders on a test screen with correct user name and nav
12	Components	Build field/input components: cmpTextInputField, cmpMultilineTextField, cmpChoiceField, cmpDateField, cmpNumberField, cmpCurrencyField, cmpYesNoField, cmpReadOnlyField, cmpFieldLabel, cmpRequiredIndicator	Step 11	Each component renders and returns correct outValue
13	Components	Build people picker: cmpPeoplePicker	Office365Users connector; Step 12	Office365Users.SearchUser returns results and selected user is surfaced via outSelectedUser
14	Components	Build form structure components: cmpFormSection, cmpSectionHeader, cmpFormModeBanner, cmpValidationSummary, cmpUnsavedChangesBanner, cmpCanonicalRequestForm	Steps 12-13	Form renders in New/Edit/View/Approve modes with correct section visibility
15	Components	Build status and workflow components: cmpStatusBadge, cmpWorkflowActionPanel, cmpApprovalPanel, cmpApprovalCommentBox, cmpWorkflowTimeline, cmpApprovalHistory, cmpAuditHistory	Step 9 (roles/workflow data); Step 11	Workflow panel shows correct actions for current user/status
16	Components	Build list/dashboard components: cmpRequestCard, cmpRequestGallery, cmpFilterPanel, cmpSearchBox, cmpRequestListToolbar, cmpPaginationOrLoadMore, cmpDashboardSummary, cmpStatusSummaryCards	Steps 10-11	Gallery renders records with status badge; filter works
17	Components	Build attachment component: cmpAttachmentPanel	SP attachment approach confirmed; Step 11	Attachments load and upload works for a test record
18	Components	Build child/related data components: cmpRelatedChildItems, cmpChecklistItems, cmpRelatedRecordCard	Steps 8, 14	Child rows load and are editable in Edit mode
19	Screens	Build scrAccessDenied and scrNotFound using cmpErrorState	Step 11	Both screens display correctly
20	Screens	Build scrHomeDashboard using cmpAppShell + cmpDashboardSummary + cmpStatusSummaryCards	Steps 11, 16	Dashboard loads, shows pending counts, site toggle works
21	Screens	Build scrDeptHub using cmpAppShell + cmpRequestCard gallery filtered by dept	Step 20	Dept hub shows correct forms for selected dept
22	Screens	Build scrFormList using cmpAppShell + cmpRequestListToolbar + cmpRequestGallery + cmpSearchBox + cmpFilterPanel	Steps 16, 20	List loads CAR records, search and filter work, delegation works
23	Screens	Build scrNewRequest for pilot form (CAR only first) — New mode with cmpCanonicalRequestForm bound to MainDB_FIN	Steps 14, 22	New CAR record can be created, saved as Draft, and Submitted
24	Screens	Build scrEditDraft for pilot form (CAR) — Edit mode	Step 23	Draft CAR can be edited and resubmitted
25	Screens	Build scrViewRequest for pilot form (CAR) — View + Approval mode	Steps 14, 15, 25	Record displays in read-only; workflow panel shows correct actions
26	Screens	Build scrApprovalProcess — pending items list for current user as approver	Steps 15, 22	HOD sees their pending CAR approvals; can Approve/Reject
27	Screens	Build scrMyRequests — current user's submissions	Step 22	User sees own submissions with correct status badges
28	Screens	Build scrAllRequestsAdmin — all records for admin/HOD	Step 22	Admin sees all records with filter by dept/status
29	Validation	End-to-end test: Submit CAR → HOD Approve → COO Approve → Director Approve → Approved	Steps 23-28	Full workflow completes; WorkflowHistory populated; Status updates correctly at each step
30	Validation	Test role-based access: submitter cannot see approval buttons; HOD cannot edit submitter fields	Step 29	cmpAccessGuard and cmpWorkflowActionPanel enforce roles correctly
31	Expansion	Repeat Steps 22-30 for second pilot form from a different department (recommend NDF — Night Visit Notification, HR)	Steps 23-30 validated	Second form completes end-to-end without screen changes
32	Expansion	Confirm cmpRelatedChildItems works for first editable gallery form (recommend INSUCLAI — Insurance Claim, FIN)	Step 18	Child rows load, add, edit, delete work
33	Expansion	Batch remaining forms by department: add each form to AppConfig data, test list and form screens	Steps 31-32	Each dept's forms navigable from scrDeptHub; pilot forms validate pattern works
34	Admin	Build scrAdminConfig + cmpAdminConfigPanel, cmpRoleMatrixViewer, cmpReferenceDataManager	MISSING_INFO resolved for admin requirements	Admin can view and edit AppConfig data
35	Polish	scrHelp, cmpBreadcrumb across all screens, print action, mobile layout validation	Step 33	All 15 screens complete; breadcrumbs consistent; mobile layout renders correctly
36	Testing	Full UAT across all 361 forms (list view only + New/Submit + Approval cycle per dept)	Step 35	All forms load in scrFormList; all forms can be submitted; approval actions function
37	Documentation	Update MASTER_POWERAPPS_SPEC_REGISTER with final screen names and component assignments	Step 36	Documentation matches built app
16. Approval Needed Before Implementation
The following items must be confirmed before any Canvas App files, SharePoint lists, or AppConfig data are created:

#	Confirmation Required	Why It Blocks Build	Owner
1	SharePoint site URLs (Johor SP site URL + Penang SP site URL)	Cannot add any data sources to Canvas App without site URLs	IT Admin / Project Owner
2	Confirmed SharePoint internal column names for at minimum: FormCode, CA, Status, SubmittedBy, and all fields in the pilot form (CAR)	All Filter and Patch formulas use internal names — wrong names break all data operations	IT Admin / SP Admin
3	Role matrix for pilot form (CAR) — who are the Submitters, HOD, COO, and Director; and what are the exact role tokens in the CA field	cmpWorkflowActionPanel, cmpAccessGuard, and AppConfig_Roles cannot be built without confirmed roles	Business Owner / FIN Dept HOD
4	Workflow state labels and transitions for pilot form (CAR) — exact values for Status column at each step (e.g. "Submitted", "HOD Review", "Pending COO", "Approved", or different labels)	AppConfig_WorkflowRules depends on exact Status values; status mismatch breaks all workflow routing	Business Owner / FIN Dept
5	Decision on AppConfig list approach — confirm whether AppConfig_FormRules, AppConfig_Roles, AppConfig_WorkflowRules, and WorkflowHistory need to be provisioned as new SP lists, or whether equivalent lists already exist	If they already exist, do not re-provision. If they don't exist, provisioning is the first build task.	IT Admin
End of Canvas App Rebuild Design Report
Status: DESIGN ONLY — No files, screens, lists, or components have been created.
Next action: Confirm the 5 items in Section 16, then return for Phase 1 of implementation.

