# Canvas App Screen Inventory

> All 15 canonical parameterized Canvas App screens.
> All 361 forms are served by these 15 screens — driven by gblActiveFormCode, gblActiveDept, gblActiveSite.
> Cross-reference: `source_analysis/07_powerapps_spec/POWERAPPS_BUILD_SPEC_REGISTER.md`
> Last updated: 2026-06-02

---

## Navigation Context Variables

| Variable | Type | Purpose | Set When |
|---|---|---|---|
| `gblActiveFormCode` | Text | Active form code ("CAR", "AWHR", "SSR") | On form card tap in scrDeptHub or scrFormList |
| `gblActiveDept` | Text | Active dept code ("FIN", "HR", "IT") | On dept card tap in scrHomeDashboard |
| `gblActiveSite` | Text | Active site ("Johor" or "Prai") | App.OnStart; site toggle button |
| `gblActiveRecordID` | Number | SP record ID of current record | On gallery item tap; 0 for new |
| `gblFormMode` | Text | "New", "Edit", "View", "Approve" | Set before Navigate() to form screens |

---

## Screen List

### scrHomeDashboard

| Field | Value |
|---|---|
| Purpose | App landing page. Dept grid, site switcher, My Pending count, My Recent submissions |
| TSX Reference | `pages/department-hub.tsx`, `pages/dashboard.tsx` |
| Roles Allowed | All authenticated users |
| Workflow States | N/A (summary counts only) |
| Reads From | All MainDB_ lists (count only), filtered by gblActiveSite |
| Writes To | None |
| Components | cmpAppShell, cmpAppHeader, cmpSideNav, cmpDashboardSummary, cmpStatusSummaryCards, cmpRequestCard (dept cards) |
| Key Actions | Navigate to dept → Set(gblActiveDept, deptCode); Navigate(scrDeptHub) |
| Build Status | PENDING |

---

### scrDeptHub

| Field | Value |
|---|---|
| Purpose | Dept-level landing showing all forms for selected dept. Form card gallery + pending count |
| TSX Reference | `pages/{dept}/index.tsx` (e.g. `pages/hr/index.tsx`) |
| Roles Allowed | All users with access to the department |
| Workflow States | N/A |
| Reads From | AppConfig or hardcoded form list for gblActiveDept; MainDB_ count queries |
| Writes To | None |
| Components | cmpAppShell, cmpSideNav, cmpBreadcrumb, cmpRequestCard (form cards), cmpStatusSummaryCards, cmpSearchBox, cmpEmptyState |
| Key Actions | Navigate to form list → Set(gblActiveFormCode, code); Navigate(scrFormList) |
| Build Status | PENDING |

---

### scrFormList

| Field | Value |
|---|---|
| Purpose | List of all records for gblActiveFormCode. Canonical "database view" per form |
| TSX Reference | `pages/{dept}/forms/index.tsx` (e.g. `pages/hr/awhr/index.tsx`) |
| Roles Allowed | MISSING_INFO (all with form access) |
| Workflow States | All (filterable by status) |
| Reads From | MainDB_{gblActiveDept} filtered by FormCode = gblActiveFormCode And EntitySite.Value = gblActiveSite |
| Writes To | None (list only) |
| Components | cmpAppShell, cmpBreadcrumb, cmpCommandBar, cmpRequestListToolbar, cmpSearchBox, cmpFilterPanel, cmpRequestGallery, cmpPaginationOrLoadMore, cmpStatusBadge, cmpEmptyState, cmpLoadingState |
| Key Actions | New → Navigate(scrNewRequest; gblFormMode="New"; gblActiveRecordID=0); View → Navigate(scrViewRequest; gblActiveRecordID=id) |
| Build Status | PENDING |

---

### scrNewRequest

| Field | Value |
|---|---|
| Purpose | Create a new form submission. Mode = New |
| TSX Reference | `pages/hr/awhr/new.tsx` (KEY), `pages/fin/forms/new.tsx`, `pages/it/forms/new-request.tsx` |
| Roles Allowed | Submitter role (MISSING_INFO — confirm RoleKey) |
| Workflow States | New (Draft on Save; Submitted on Submit) |
| Reads From | AppConfig (form rules if applicable) |
| Writes To | MainDB_{gblActiveDept} (new record Patch) |
| Components | cmpAppShell, cmpBreadcrumb, cmpCommandBar, cmpFormModeBanner, cmpCanonicalRequestForm, cmpFormSection (multiple), cmpValidationSummary, cmpUnsavedChangesBanner, cmpWorkflowActionPanel (Submit button only) |
| Key Buttons | Save Draft (no validation); Submit (full validation); Cancel |
| Build Status | PENDING — Pilot: AWHR first, then CAR |

---

### scrEditDraft

| Field | Value |
|---|---|
| Purpose | Edit an existing Draft or Returned-for-Edit record. Mode = Edit |
| TSX Reference | `pages/str/edit.tsx`, `pages/hr/awhr/new.tsx` (same pattern) |
| Roles Allowed | Submitter (own Draft records only) |
| Workflow States | Draft, Returned |
| Reads From | MainDB_{gblActiveDept} by ID = gblActiveRecordID |
| Writes To | MainDB_{gblActiveDept} (Patch update) |
| Components | Same as scrNewRequest + cmpUnsavedChangesBanner |
| Guard | If record Status ≠ "Draft": redirect to scrViewRequest |
| Build Status | PENDING |

---

### scrViewRequest

| Field | Value |
|---|---|
| Purpose | Read-only view of any record. Shows all sections, workflow history, attachments. Approval actions for current approver |
| TSX Reference | `pages/hr/awhr/detail.tsx` (KEY), `pages/str/submission-detail.tsx` |
| Roles Allowed | Record owner (own records); HOD/Approvers (dept records); Admin (all) |
| Workflow States | All post-Draft states |
| Reads From | MainDB_{gblActiveDept} by ID; ApprovalHistory_{dept}; child list (if exists) |
| Writes To | MainDB_{gblActiveDept} (via workflow action only); ApprovalHistory_{dept} |
| Components | cmpAppShell, cmpBreadcrumb, cmpCommandBar, cmpFormModeBanner, cmpCanonicalRequestForm (View mode), cmpWorkflowTimeline, cmpApprovalHistory, cmpAttachmentPanel, cmpWorkflowActionPanel, cmpRelatedChildItems (if editable gallery form), cmpStatusBadge |
| Key Buttons | Approve (if approver + correct stage); Reject (same); Return (same); Print; Copy; Back |
| Build Status | PENDING — Pilot: AWHR first |

---

### scrApprovalProcess

| Field | Value |
|---|---|
| Purpose | Approval workspace — shows all pending items for current approver. Quick approve/reject |
| TSX Reference | `pages/approvals.tsx`, `pages/it/approvals/index.tsx`, `pages/str/approve.tsx` |
| Roles Allowed | Any user with approver role |
| Workflow States | Submitted, Under Review (where CurrentApprover_Email = current user) |
| Reads From | All MainDB_{dept} lists filtered by CurrentApprover_Email = gblCurrentUser.UserPrincipalName |
| Writes To | Same lists + ApprovalHistory_{dept} |
| Components | cmpAppShell, cmpSideNav, cmpRequestGallery, cmpFilterPanel (by form/dept), cmpApprovalPanel, cmpApprovalCommentBox, cmpWorkflowActionPanel, cmpStatusBadge, cmpEmptyState, cmpLoadingState |
| Key Buttons | Approve; Reject; View Full Record |
| Build Status | PENDING |

---

### scrMyRequests

| Field | Value |
|---|---|
| Purpose | Current user's own submissions across all forms and depts |
| TSX Reference | `pages/my-submissions.tsx`, `components/my-submissions-view.tsx` |
| Roles Allowed | All authenticated users |
| Workflow States | All |
| Reads From | All MainDB_{dept} lists filtered by Requestor_Email = gblCurrentUser.UserPrincipalName |
| Writes To | None |
| Components | cmpAppShell, cmpBreadcrumb, cmpSearchBox, cmpFilterPanel, cmpRequestGallery, cmpStatusBadge, cmpEmptyState, cmpLoadingState, cmpPaginationOrLoadMore |
| Key Actions | Navigate to detail → Set(gblActiveRecordID); Navigate(scrViewRequest) |
| Build Status | PENDING |

---

### scrAllRequestsAdmin

| Field | Value |
|---|---|
| Purpose | All records for managers, HOD, and admin. Full cross-user view with filters |
| TSX Reference | `pages/manager-dashboard.tsx`, `pages/batch-approvals.tsx` |
| Roles Allowed | HOD (dept filter), Admin (all) — MISSING_INFO for exact RoleKeys |
| Workflow States | All |
| Reads From | All MainDB_{dept} for gblActiveSite; filtered by dept if HOD |
| Writes To | None (list view only) |
| Components | cmpAppShell, cmpCommandBar, cmpRequestListToolbar, cmpSearchBox, cmpFilterPanel, cmpRequestGallery, cmpPaginationOrLoadMore, cmpStatusBadge, cmpEmptyState |
| Build Status | PENDING |

---

### scrAccessDenied

| Field | Value |
|---|---|
| Purpose | Shown when cmpAccessGuard denies access |
| TSX Reference | No direct equivalent (TSX uses redirects) |
| Roles Allowed | All (error page) |
| Components | cmpErrorState, cmpAppHeader |
| Key Buttons | Go to Home; Sign Out |
| Build Status | PENDING — simple; build early |

---

### scrNotFound

| Field | Value |
|---|---|
| Purpose | Invalid navigation or record not found |
| TSX Reference | `pages/not-found.tsx` |
| Roles Allowed | All |
| Components | cmpErrorState |
| Key Buttons | Go to Home |
| Build Status | PENDING — simple; build early |

---

### scrAdminConfig

| Field | Value |
|---|---|
| Purpose | Admin-only configuration panel |
| TSX Reference | `pages/admin/index.tsx` + 8 admin panel pages |
| Roles Allowed | IT Admin only |
| Reads/Writes | Config_ lists, ApprovalHistory_ (read only) |
| Components | cmpAppShell, cmpAdminConfigPanel, cmpRoleMatrixViewer, cmpReferenceDataManager |
| Build Status | DO_NOT_BUILD_YET — scope and admin sub-areas need confirmation |

---

### scrHelp (Optional)

| Field | Value |
|---|---|
| Purpose | Help and FAQ content |
| TSX Reference | `pages/help.tsx` |
| Build Status | DEFERRED — confirm if in scope |

---

## IT Department — Screen-Navigation Context

> Navigation flow for IT forms. All IT forms use the same 15 canonical screens.
> The `gblActiveFormCode` variable drives form-specific sections, SP columns, and workflow behavior.

### IT Navigation Map

```
scrHomeDashboard (dept cards)
  └─ Set(gblActiveDept, "IT") → scrDeptHub
       ├─ M1 Card: User & Access → scrFormList (EAF/NIR/RS/SFAR/UR cards)
       ├─ M2 Card: IT Support → scrFormList (ITSSR/PRF/IAL cards)
       ├─ M3 Card: Hardware → scrFormList (HI/ITSC/SVRREC cards)
       ├─ M4 Card: SAP Governance → scrFormList (SAP forms cards)
       ├─ M5 Card: Documentation → scrFormList (IOIPOL/ITINFO/ISGDOC cards)
       └─ M6 Card: Other → scrFormList (TRNMAN/DCALOG/ITDAILYRPT/ITDR2 cards)

scrFormList (gblActiveFormCode="EAF")
  ├─ New button → scrNewRequest (gblFormMode="New", gblActiveRecordID=0)
  ├─ Item tap → scrViewRequest (gblFormMode="View", gblActiveRecordID=<id>)
  └─ Edit button (own Draft) → scrEditDraft (gblFormMode="Edit")

scrViewRequest (gblActiveFormCode="EAF")
  ├─ Approve/Reject button (if approver + correct stage) → Patch + Approve
  ├─ Edit button (if Draft owner) → scrEditDraft
  └─ Back → scrFormList
```

### IT Form-Specific Screen Dependencies

| Form Code | Approval? | scrApprovalProcess Needed? | cmpWorkflowActionPanel? | cmpApprovalHistory? | Child SP List Read? |
|---|---|---|---|---|---|
| EAF | YES — 5-stage | YES | YES (Approve/Reject per stage) | YES | YES (MainDB_IT_Ext_Access) |
| NIR | YES — 4-stage | YES | YES | YES | YES (MainDB_IT_Ext_Access) |
| RS | YES — 2-stage + ED | YES | YES | YES | YES (MainDB_IT_Ext_Access) |
| SFAR | YES — 5-stage | YES | YES | YES | YES (MainDB_IT_Ext_Access) |
| UR | YES — multi-stage | YES | YES | YES | YES (MainDB_IT_Ext_Access) |
| PRF | YES — 12-section | YES | YES | YES | YES (MainDB_IT_Ext_Support) |
| SAPCR | YES — multi-stage | YES | YES | YES | YES (MainDB_IT_Ext_SAP) |
| SAPTR | YES — 2-stage | YES | YES | YES | YES (MainDB_IT_Ext_SAP) |
| SAPAMR | YES | YES | YES | YES | YES (MainDB_IT_Ext_SAP) |
| SAPCA | YES | YES | YES | YES | YES (MainDB_IT_Ext_SAP) |
| SAPSLCF | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | YES (MainDB_IT_Ext_SAP) |
| SAPDRP | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | PENDING (MainDB_IT_Ext_Infra) |
| IOIPOL | YES | YES | YES | YES | YES (MainDB_IT_Ext_Policy) |
| ITSSR | **NO** | NO | NO | NO | YES (MainDB_IT_Ext_Support) |
| HI | **NO** | NO | NO | NO | YES (MainDB_IT_Ext_Assets) |
| ITSC | **NO** | NO | NO | NO | YES (MainDB_IT_Ext_Assets) |
| DCALOG | **NO** | NO | NO | NO | MISSING_INFO |
| ISGDOC | **NO** | NO | NO | NO | PENDING (MainDB_IT_Ext_Docs) |
| ITINFO | **NO** | NO | NO | NO | PENDING (MainDB_IT_Ext_Docs) |
| ITDR2 | **NO** | NO | NO | NO | MISSING_INFO |
| ITDAILYRPT | **NO** | NO | NO | NO | MISSING_INFO |
| TRNMAN | **NO** | NO | NO | NO | MISSING_INFO |
| INTUATSOF | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | MISSING_INFO |
| SILOUATSOF | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | TSX_INFERENCE | MISSING_INFO |
