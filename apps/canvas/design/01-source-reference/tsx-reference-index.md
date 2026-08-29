# TSX Reference Index

> TSX app path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/`
> Status: REFERENCE ONLY — do not build from TSX. Use as layout, behavior, and field pattern reference.
> Last updated: 2026-06-02

---

## Important Notes

- `design/m365-design/powerapps-design.md` describes the TSX code-first app — it is **SUPERSEDED** and does NOT describe the Canvas App target. Do not use it as a design reference.
- All TSX files marked RETIRED should not be replicated in Canvas App.
- TSX files marked REFERENCE contain patterns useful for Canvas App design.

---

## App Entry and Routing

| TSX File | Purpose | Canvas Mapping | Status |
|---|---|---|---|
| `src/App.tsx` | App entry, HashRouter, lazy pages, Jotai+TanStack providers | App.OnStart + global variable initialization | REFERENCE |
| `src/main.tsx` | Entry point export | N/A | IGNORE |
| `src/routes/it-routes.ts` | IT department route definitions | gblActiveDept = "IT" + scrDeptHub | REFERENCE |
| `src/routes/hr-routes.ts` | HR department routes | gblActiveDept = "HR" | REFERENCE |
| `src/routes/fin-routes.ts` | Finance department routes | gblActiveDept = "FIN" | REFERENCE |
| `src/routes/str-routes.ts` | Store department routes | gblActiveDept = "STR" | REFERENCE |
| `src/routes/qa-routes.ts` | QA department routes | gblActiveDept = "QA" | REFERENCE |
| `src/routes/procurement-routes.ts` | Procurement routes | gblActiveDept = "PUR" | REFERENCE |
| `src/routes/she-routes.ts` | SHE department routes | gblActiveDept = "SHE" | REFERENCE |
| `src/routes/maintenance-routes.ts` | Maintenance routes | gblActiveDept = "MTN" | REFERENCE |
| All other route files | Remaining depts | Same pattern | REFERENCE |

---

## Pages — Canonical / Shared

| TSX File | Purpose | Canvas Screen Equivalent | Status |
|---|---|---|---|
| `src/pages/department-hub.tsx` | Dept selector landing page | scrHomeDashboard + scrDeptHub | REFERENCE |
| `src/pages/dashboard.tsx` | KPI summary dashboard | scrHomeDashboard (summary section) | REFERENCE |
| `src/pages/my-submissions.tsx` | Current user's own submissions | scrMyRequests | REFERENCE |
| `src/pages/approvals.tsx` | Pending approvals for current user | scrApprovalProcess | REFERENCE |
| `src/pages/batch-approvals.tsx` | Bulk approve/reject | Batch action in scrApprovalProcess | REFERENCE |
| `src/pages/manager-dashboard.tsx` | Manager team view | scrAllRequestsAdmin (manager filter) | REFERENCE |
| `src/pages/submission-detail.tsx` | Generic submission detail | scrViewRequest | REFERENCE |
| `src/pages/submissions/[id].tsx` | Dynamic submission by ID | scrViewRequest (gblActiveRecordID) | REFERENCE |
| `src/pages/submissions.tsx` | Submissions list | scrMyRequests or scrFormList | REFERENCE |
| `src/pages/not-found.tsx` | 404 page | scrNotFound | REFERENCE |
| `src/pages/quick-submit.tsx` | Quick form entry | scrNewRequest (compact mode) | REFERENCE |
| `src/pages/quick-form.tsx` | Quick form variant | scrNewRequest | REFERENCE |
| `src/pages/field-worker.tsx` | Simplified mobile submit | scrNewRequest (mobile layout) | REFERENCE |
| `src/pages/reports.tsx` | Reports page | MISSING_INFO — not mapped yet | REVIEW |
| `src/pages/forms.tsx` | Forms list | scrFormList or scrDeptHub | REFERENCE |
| `src/pages/help.tsx` | Help page | scrHelp (if in scope) | DEFERRED |
| `src/pages/settings.tsx` | User settings | MISSING_INFO | DEFERRED |
| `src/pages/employee-directory.tsx` | Employee directory | Part of cmpPeoplePicker | REFERENCE |

---

## Pages — Admin

| TSX File | Purpose | Canvas Equivalent | Status |
|---|---|---|---|
| `src/pages/admin/index.tsx` | Admin dashboard | scrAdminConfig | REFERENCE |
| `src/pages/admin/workflow-matrix.tsx` | Workflow rules editor | cmpRoleMatrixViewer | REFERENCE |
| `src/pages/admin/routing-matrix.tsx` | Routing config | Config_ApproverMatrix display | REFERENCE |
| `src/pages/admin/forms/index.tsx` | Form registry management | cmpReferenceDataManager | REFERENCE |
| `src/pages/admin/forms/editor.tsx` | Per-form schema editor | NOT REPLICATED — Canvas uses SP schema | RETIRE |
| `src/pages/admin/panels/approval-routing.tsx` | Approval routing config | scrAdminConfig section | REFERENCE |
| `src/pages/admin/panels/audit-log-panel.tsx` | Audit log viewer | cmpAuditHistory | REFERENCE |
| `src/pages/admin/panels/data-source-mapping.tsx` | Data source mapping | 02-sharepoint-schema/ | REFERENCE |
| `src/pages/admin/panels/form-registry-panel.tsx` | Form registry | AppConfig display | REFERENCE |
| `src/pages/admin/panels/route-permission.tsx` | Route permissions | cmpAccessGuard | REFERENCE |
| `src/pages/admin/panels/system-settings.tsx` | System settings | scrAdminConfig | REFERENCE |
| `src/pages/admin/panels/user-profiles-panel.tsx` | User profiles | Config_EmployeeDirectory | REFERENCE |
| `src/pages/admin/panels/user-roles-panel.tsx` | User role management | Config_GlobalUserRoleAssignments | REFERENCE |
| `src/pages/admin/panels/workflow-management.tsx` | Workflow management | Config_ApproverMatrix | REFERENCE |

---

## Pages — HR (Sample — per-form triad: index/new/detail)

| TSX File | Purpose | Canvas Equivalent | Status |
|---|---|---|---|
| `src/pages/hr/awhr/index.tsx` | AWHR list view | scrFormList (gblActiveFormCode="AWHR") | REFERENCE |
| `src/pages/hr/awhr/new.tsx` | New AWHR form | scrNewRequest (gblActiveFormCode="AWHR") | **KEY REFERENCE** — confirmed SP field names |
| `src/pages/hr/awhr/detail.tsx` | AWHR detail + approval | scrViewRequest + scrApprovalProcess | **KEY REFERENCE** — confirmed stage transitions |
| `src/pages/hr/bsd/`, `cwr/`, `jd/`, etc. | Other HR forms (same triad pattern) | Same 3 screens parameterized | REFERENCE |

---

## Pages — Other Departments (Confirmed patterns)

| TSX File | Purpose | Key Findings | Status |
|---|---|---|---|
| `src/pages/str/index.tsx` | STR home — 5 module cards | STR_MODULES config pattern | REFERENCE |
| `src/pages/str/new.tsx` | New STR request | Uses Power Automate for workflow | REFERENCE |
| `src/pages/str/approve.tsx` | STR approval screen | Approve/Reject/Return pattern confirmed | **KEY REFERENCE** |
| `src/pages/it/forms/index.tsx` | IT forms — module structure M1-M7 | IT uses module grouping; two IT sites | **KEY REFERENCE** |
| `src/pages/production/forms/index.tsx` | Production forms | **WARNING: Contains MOCK forms (SAM-001 to WD-004) not in master register. Do not build these.** | **RISK — see issue I-08** |

---

## Pages — IT Forms (M1–M7 Modules, 20+ form directories)

> IT is the primary Domino→M365 migration department. TSX pages below are KEY REFERENCES for Canvas rebuild.

### M1 — User & Access Management

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/pages/it/forms/eaf/new.tsx` | EAF | 4-step wizard: Requestor → Access Details → Justification → Review. Writes parent MainDB_IT + ext MainDB_IT_Ext_Access | scrNewRequest (gblActiveFormCode="EAF") | **KEY REFERENCE** — 5-stage approval workflow |
| `src/pages/it/forms/eaf/[id].tsx` | EAF | Detail/edit view. Stage-gated approval panels: HOD → COO/Director → IT Manager → IT Config | scrViewRequest + scrApprovalProcess | **KEY REFERENCE** |
| `src/pages/it/forms/nir/new.tsx` | NIR (NOTESID) | Notes ID request: Submitter → HOD → Notes Admin → IT Hardware | scrNewRequest (gblActiveFormCode="NIR") | **KEY REFERENCE** |
| `src/pages/it/forms/nir/[id].tsx` | NIR | 4-stage approval detail | scrViewRequest | REFERENCE |
| `src/pages/it/forms/rs/new.tsx` | RS (PWDRESET) | Password reset request: Submitter → IT Processing → ED Approval (conditional) | scrNewRequest (gblActiveFormCode="RS") | REFERENCE |
| `src/pages/it/forms/sfar/new.tsx` | SFAR | Share folder access: Submitter → IT PIC → IT Verifier → Folder Owner → HOD → IT Action | scrNewRequest (gblActiveFormCode="SFAR") | REFERENCE |
| `src/pages/it/forms/ur/new.tsx` | UR (USERID) | User ID requisition: Submitter → HOD → SAP Module Owner → Bank Module Owner → IT Checker → Finance | scrNewRequest (gblActiveFormCode="UR") | REFERENCE |

### M2 — IT Support

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/features/itssr/itssr-app.tsx` | ITSSR | IT Support & Service Request: Draft → Submitted → Assigned → In Progress → Resolved → Closed. NO APPROVAL GATE. | scrNewRequest (gblActiveFormCode="ITSSR") | **KEY REFERENCE** — service desk pattern, no approval |
| `src/pages/it/forms/prf/new.tsx` | PRF | Program Request Form: 12-section multi-stage IT approval | scrNewRequest (gblActiveFormCode="PRF") | **KEY REFERENCE** |
| `src/pages/it/forms/ial/new.tsx` | IAL (ITEVT) | IT Event/Activity Log — LEGACY custom component, not DynamicForm | scrNewRequest (gblActiveFormCode="IAL") | REFERENCE — custom renderer |
| `src/pages/it/forms/srl/new.tsx` | SRL (SVRREBOOT) | Server Reboot Log — LEGACY custom component | scrNewRequest (gblActiveFormCode="SRL") | REFERENCE — custom renderer |

### M3 — Hardware & Infrastructure

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/pages/it/forms/hi/new.tsx` | HI | Hardware Inventory: Draft → Submitted → Completed. NO APPROVAL. | scrNewRequest (gblActiveFormCode="HI") | **KEY REFERENCE** — record-keeping, no approval |
| `src/pages/it/forms/itsc/new.tsx` | ITSC | IT Server Checklist: server health metrics, backup catalog | scrNewRequest (gblActiveFormCode="ITSC") | REFERENCE |
| `src/pages/it/forms/svrrec/new.tsx` | SVRREC | Server Record/RCA: incident/maintenance with root cause analysis | scrNewRequest (gblActiveFormCode="SVRREC") | REFERENCE |

### M4 — SAP Governance

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/pages/it/forms/sapamr/new.tsx` | SAPAMR | SAP Authorisation Matrix Review | scrNewRequest (gblActiveFormCode="SAPAMR") | REFERENCE |
| `src/pages/it/forms/sapca/new.tsx` | SAPCA | SAP Config Access | scrNewRequest (gblActiveFormCode="SAPCA") | REFERENCE |
| `src/pages/it/forms/sapcr/new.tsx` | SAPCR | SAP Change Request — multi-stage: BPO → PM → ABAPER → Transport | scrNewRequest (gblActiveFormCode="SAPCR") | **KEY REFERENCE** |
| `src/pages/it/forms/saptr/new.tsx` | SAPTR | SAP Transport Request — 2-stage: IED→IEQ, IEQ→IEP | scrNewRequest (gblActiveFormCode="SAPTR") | REFERENCE |
| `src/pages/it/forms/sapslcf/new.tsx` | SAPSLCF | SAP Storage Location Create Form | scrNewRequest (gblActiveFormCode="SAPSLCF") | REFERENCE |

### M5 — Documentation

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/pages/it/forms/ioip/new.tsx` | IOIPOL | IOI Policy: 3-column authority sign-off + revision history | scrNewRequest (gblActiveFormCode="IOIPOL") | REFERENCE |
| `src/pages/it/forms/iti/new.tsx` | ITINFO | IT Information Notice: no approval | scrNewRequest (gblActiveFormCode="ITINFO") | REFERENCE |
| `src/pages/it/forms/itp/new.tsx` | ISGDOC | IT Procedures/Document: no approval | scrNewRequest (gblActiveFormCode="ISGDOC") | REFERENCE |

### M6 — Other IT

| TSX File | Form | Purpose | Canvas Mapping | Status |
|---|---|---|---|---|
| `src/pages/it/forms/sapdrp/new.tsx` | SAPDRP | SAP Disaster Recovery Plan | scrNewRequest (gblActiveFormCode="SAPDRP") | REFERENCE |
| `src/pages/it/forms/trnman/new.tsx` | TRNMAN | Training Manuals: no approval | scrNewRequest (gblActiveFormCode="TRNMAN") | REFERENCE |
| `src/pages/it/forms/dcalog/new.tsx` | DCALOG | Data Center Access Log: no approval | scrNewRequest (gblActiveFormCode="DCALOG") | REFERENCE |
| `src/pages/it/forms/itdailyrpt/new.tsx` | ITDAILYRPT | IT Daily Report: no approval | scrNewRequest (gblActiveFormCode="ITDAILYRPT") | REFERENCE |
| `src/pages/it/forms/itdr2/new.tsx` | ITDR2 | IT Department Report v2: no approval | scrNewRequest (gblActiveFormCode="ITDR2") | REFERENCE |
| `src/pages/it/forms/intuatsof/new.tsx` | INTUATSOF | Integration UAT Sign-Off: 15 KU + 10 BPO | scrNewRequest (gblActiveFormCode="INTUATSOF") | REFERENCE |
| `src/pages/it/forms/silouatsof/new.tsx` | SILOUATSOF | Silo UAT Sign-Off: 5 KU + 3 BPO | scrNewRequest (gblActiveFormCode="SILOUATSOF") | REFERENCE |

### IT Forms — List/Index Pages

| TSX File | Purpose | Canvas Mapping | Status |
|---|---|---|---|
| `src/pages/it/forms/index.tsx` | IT forms module hub: M1-M7 cards with counts | scrDeptHub (gblActiveDept="IT") | **KEY REFERENCE** |

---

## Components — IT-Specific (beyond canonical reusable)

| TSX File | Canvas Component Equivalent | Status |
|---|---|---|
| `src/components/it/it-forms-list.tsx` | IT forms module card grid in scrDeptHub | REFERENCE |
| `src/components/dynamic-form/DynamicFormRenderer.tsx` | cmpCanonicalRequestForm — schema-driven form rendering | **KEY REFERENCE** |
| `src/components/dynamic-form/SectionRenderer.tsx` | cmpFormSection — renders per-section fields | **KEY REFERENCE** |
| `src/components/approval-workflow/ApprovalPanel.tsx` | cmpApprovalPanel — stage-gated approval UI | **KEY REFERENCE** |
| `src/components/approval-workflow/WorkflowTimeline.tsx` | cmpWorkflowTimeline — visual stage progress | **KEY REFERENCE** |
| `src/hooks/use-dynamic-form.ts` | Logic reference for form state, validation, submit | **KEY REFERENCE** |
| `src/hooks/use-integrated-workflow.ts` | Logic reference for workflow orchestration | **KEY REFERENCE** |
| `src/contexts/approval-context.tsx` | Approval state management pattern | REFERENCE |
| `src/config/workflow-routing.ts` | Workflow routing config patterns | REFERENCE |
| `src/lib/it-forms-config.ts` | IT form registry: FormCode→module, route, SP list mapping | **KEY REFERENCE** |

---

## Components — Canonical Reusable

| TSX File | Canvas Component Equivalent | Status |
|---|---|---|
| `src/components/my-submissions-view.tsx` | cmpRequestGallery + cmpFilterPanel | **KEY REFERENCE** |
| `src/components/multi-step-form.tsx` | cmpCanonicalRequestForm | **KEY REFERENCE** |
| `src/components/employee-picker.tsx` | cmpPeoplePicker | KEY REFERENCE |
| `src/components/loading-screen.tsx` | cmpLoadingState | REFERENCE |
| `src/components/detail-modal.tsx` | cmpFormSection (view mode) — currently a stub | REFERENCE |
| `src/components/delegation-dialog.tsx` | cmpWorkflowActionPanel (delegate) | REFERENCE |
| `src/components/global-search.tsx` | cmpSearchBox | REFERENCE |
| `src/components/database-table.tsx` | cmpRequestGallery (table layout) | REFERENCE |
| `src/components/workflow/edit-request-indicator.tsx` | cmpStatusBadge (edit-request variant) | REFERENCE |
| `src/components/system/error-boundary.tsx` | cmpErrorState | REFERENCE |
| `src/components/layouts/standalone-layout.tsx` | cmpAppShell | REFERENCE |
| `src/components/layout/ig-sidenav.tsx` | cmpSideNav | REFERENCE |
| `src/components/layout/ig-topbar.tsx` + `ig-page-header.tsx` | cmpAppHeader | REFERENCE |
| `src/components/dynamic-form/SectionRenderer.tsx` | cmpFormSection | **KEY REFERENCE** |
| `src/components/hr/status-badge.tsx` | cmpStatusBadge | REFERENCE |
| `src/components/hr/record-info-panel.tsx` | cmpApprovalPanel | REFERENCE |

---

## Components — Retire (Debug/Mock only)

| TSX File | Reason |
|---|---|
| `src/components/debug/DebugCurrentScreen.tsx` | Dev tool — not needed in Canvas |
| `src/components/debug/DebugIssues.tsx` | Dev tool — retire |
| `src/components/debug/DebugReadSources.tsx` | Dev tool — retire |
| `src/components/debug/DebugRuntimeLog.tsx` | Dev tool — retire |
| `src/components/debug/DebugSchemaComparison.tsx` | Dev tool — retire |
| `src/components/debug/DebugWriteActions.tsx` | Dev tool — retire |
| `src/components/mock-toggle/MockToggle.tsx` | Mock data toggle — retire |
| `src/components/debug-overlay.tsx` | Dev overlay — retire |

---

## Key Service Files (Primary SP column name source)

| TSX File | What It Confirms | Status |
|---|---|---|
| `src/services/main-dbhr-service.ts` | Confirmed SP column names for MainDB_HR via LOWER_TO_SHAREPOINT map; status label mapping; site mapping | **AUTHORITATIVE** |
| `src/services/workflow-orchestration-service.ts` | IT workflow transitions; stage names for EAF, NIR, RS, ITSSR forms; ApprovalRecords write pattern | **KEY REFERENCE** |
| `src/services/str-submission-service.ts` | STR SP write pattern | REFERENCE |
| `src/services/hr-submission-service.ts` | HR submission service | REFERENCE |
| `src/services/workflow-audit-service.ts` | Audit log write pattern | REFERENCE |

---

## Key Generated Model Files (SP column definitions)

| Model File | What It Confirms |
|---|---|
| `src/generated/models/main-dbhr-model.ts` | All MainDB_HR fields with SP display names — confirmed |
| `src/generated/models/main-dbfin-model.ts` | All MainDB_FIN fields including statusKey, departmentKey, companyKey choice mappings |
| `src/generated/models/main-dbit-model.ts` | MainDB_IT fields: currentStatus (plain string), 60 status values, form-prefixed columns |
| `src/generated/models/ApprovalHistory_HRModel.ts` | Confirmed SP column names for approval history: HistoryID, RecordID, FromState, ToState, ActionCode, ActionByEmail, ActionOn |
| `src/generated/models/Config_GlobalUserRoleAssignmentsModel.ts` | Role config list schema: UserPrincipalName, RoleKey, IsActiveAssignment, DepartmentCodeScope |
| `src/generated/models/Config_ApproverMatrixModel.ts` | Config store schema: ConfigKey, ConfigValue, Category |
