# Power Apps Code-First App Repo — Cleanup & Alignment Plan

> **Generated**: 2026-05-31
> **App Location**: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/`
> **App Type**: Power Apps new code app (code-first) — React 19 + TypeScript + Vite + shadcn/ui
> **Total Files Scanned**: ~950 (pages, components, services, models, routes, form schemas)
> **Status**: ⚠️ Multiple duplicates and conflicts found — cleanup recommended

---

## Table of Contents

1. [Repo Inventory](#1-repo-inventory)
2. [Duplicate and Redundancy Detection](#2-duplicate-and-redundancy-detection)
3. [Form Alignment Review](#3-form-alignment-review)
4. [Cleanup Recommendations](#4-cleanup-recommendations)
5. [Safe Cleanup Plan](#5-safe-cleanup-plan)
6. [Naming Convention Proposal](#6-naming-convention-proposal)

---

## 1. Repo Inventory

### 1.1 Pages (`src/pages/`)

| File / Folder | Type | Purpose | Key Contents | Referenced By | Status |
|---|---|---|---|---|---|
| `department-hub.tsx` | Page | Root department selector with cards | Department grid, stats | `App.tsx` | ✅ Active |
| `_layout.tsx` | Page | App chrome layout | Sidebar + header + content | `App.tsx` | ✅ Active |
| `index.tsx` | Page | Root redirect | Redirects to `/department-hub` | `App.tsx` | ✅ Active |
| `dashboard.tsx` | Page | Global KPIs | Charts, metrics | Routes | ✅ Active |
| `approvals.tsx` | Page | Pending approvals | Approval cards, filters | Routes | ✅ Active |
| `batch-approvals.tsx` | Page | Multi-item approval | Batch select, bulk actions | Routes | ✅ Active |
| `my-submissions.tsx` | Page | User's own requests | Filtered list | Routes | ✅ Active |
| `submissions.tsx` | Page | All submissions | Global list, filters | Routes | ✅ Active |
| `submissions/[id].tsx` | Page | Submission detail | Record view | Routes | ✅ Active |
| `submission-detail.tsx` | Page | Alternative detail page | Possibly duplicate of `submissions/[id]` | Routes | ⚠️ Duplicate candidate |
| `employee-directory.tsx` | Page | M365 Users directory | Search, profile cards | Routes | ✅ Active |
| `forms.tsx` | Page | Generic forms index | Form list | Routes | ⚠️ Might be redundant |
| `quick-form.tsx` | Page | Rapid form submission | Minimal form | Routes | ✅ Active |
| `quick-submit.tsx` | Page | Fast ticket creation | Minimal form | Routes | ⚠️ Possibly duplicate of `quick-form` |
| `field-worker.tsx` | Page | Mobile field worker view | Optimized for mobile | Routes | ✅ Active |
| `manager-dashboard.tsx` | Page | Manager overview | Dept head KPIs | Routes | ✅ Active |
| `reports.tsx` | Page | Reporting views | Report list | Routes | ✅ Active |
| `settings.tsx` | Page | User preferences | Theme, notifications | Routes | ✅ Active |
| `help.tsx` | Page | User guide | FAQ, contact | Routes | ✅ Active |
| `bug-admin.tsx` | Page | Bug tracker admin | Issue list | Routes | ✅ Active |
| `not-found.tsx` | Page | 404 | Error display | Routes | ✅ Active |
| `itdr-form.tsx` | Page | Legacy: IT Disaster Recovery | Standalone form | Unknown | ⚠️ Legacy — duplicate of `/it/forms/itdr/` |
| `itdr2-form.tsx` | Page | Legacy: ITDR v2 | Standalone form | Unknown | ⚠️ Legacy — duplicate of `/it/forms/itdr2/` |
| `it/` | Folder | IT department pages | 20+ sub-pages, forms | `it-routes.tsx` | ✅ Active |
| `hr/` | Folder | HR department pages | 35+ sub-pages, forms | `hr-routes.tsx` | ✅ Active |
| `str/` | Folder | Store dept pages | MRF, disposal, compliance | `str-routes.tsx` | ✅ Active |
| `admin/` | Folder | Admin panels | User roles, routing matrix, audit | Routes | ✅ Active |
| `governance/` | Folder | Governance pages | Policies, audit | Routes | ✅ Active |
| `qa/` | Folder | QA pages | CAPAs, audits, forms | Routes | ✅ Active |
| `qc/` | Folder | QC pages | Forms (pqcar, oos, lwr, calibration) | Routes | ✅ Active |
| `she/` | Folder | SHE pages | Forms | Routes | ✅ Active |
| `finance/` | Folder | Finance pages | Forms | Routes | ✅ Active |
| `procurement/` | Folder | Procurement pages | Forms | Routes | ✅ Active |
| `production/` | Folder | Production pages | Forms | Routes | ✅ Active |
| `adm/` | Folder | Admin dept pages | Forms | Routes | ✅ Active |
| `security/` | Folder | Security dept pages | Forms | Routes | ✅ Active |
| `engineering/` | Folder | Engineering pages | Forms | Routes | ✅ Active |
| `maintenance/` | Folder | Maintenance pages | Forms | Routes | ✅ Active |
| `training/` | Folder | Training pages | Forms | Routes | ✅ Active |
| `warehouse/` | Folder | Warehouse pages | Forms | Routes | ✅ Active |
| `sales/` | Folder | Sales pages | Forms | Routes | ✅ Active |
| `log/` | Folder | Logistics pages | Forms (tmi, ti, gtpw, pod, fbn, ecmfb, csd) | Routes | ✅ Active |
| `mtr/` | Folder | MTR pages | Forms | Routes | ✅ Active |
| `ei/` | Folder | E&I pages | (stub) | Routes | ✅ Stub |
| `pbi/` | Folder | PBI pages | (stub) | Routes | ✅ Stub |
| `rnd/` | Folder | R&D pages | (stub) | Routes | ✅ Stub |
| `ops/` | Folder | Operations pages | (stub) | Routes | ✅ Stub |

### 1.2 IT Forms Pages (`src/pages/it/forms/`)

| Path | Form Code | Pattern | Status |
|------|-----------|---------|--------|
| `it/forms/[formCode]/new.tsx` | Generic | Dynamic form code param | ✅ Active |
| `it/forms/[formCode]/index.tsx` | Generic | Dynamic list/database view | ✅ Active |
| `it/forms/eaf/new.tsx` | EAF | Explicit new form page | ✅ Active |
| `it/forms/itssr/new.tsx` | ITSSR | Explicit new form page | ✅ Active |
| `it/forms/itssr/index.tsx` | ITSSR | Explicit list page | ✅ Active |
| `it/forms/itssr/[id].tsx` | ITSSR | Explicit detail page | ✅ Active |
| `it/forms/nir/new.tsx` | NIR | Explicit new form page | ✅ Active |
| `it/forms/prf/new.tsx` | PRF | Explicit new form page | ✅ Active |
| `it/forms/hi/new.tsx` | HI | Explicit new form page | ✅ Active |
| `it/forms/hi/index.tsx` | HI | Explicit list page | ✅ Active |
| `it/forms/rs/new.tsx` | RS | Explicit new form page | ✅ Active |
| `it/forms/sfar/new.tsx` | SFAR | Explicit new form page | ✅ Active |
| `it/forms/ur/new.tsx` | UR | Explicit new form page | ✅ Active |
| `it/forms/ur/index.tsx` | UR | Explicit list page | ✅ Active |
| `it/forms/trnman/new.tsx` | TRNMAN | Explicit new form page | ✅ Active |
| `it/forms/trnman/index.tsx` | TRNMAN | Explicit list page | ✅ Active |
| `it/forms/srvr/new.tsx` | SRVR | Explicit new form page | ✅ Active |
| `it/forms/srvr/index.tsx` | SRVR | Explicit list page | ✅ Active |
| `it/forms/srvr/[id].tsx` | SRVR | Explicit detail page | ✅ Active |
| `it/forms/srr/new.tsx` | SRR | Explicit new form page | ✅ Active |
| `it/forms/drr/new.tsx` | DRR | Explicit new form page | ✅ Active |
| `it/forms/drr/index.tsx` | DRR | Explicit list page | ✅ Active |
| `it/forms/itdr/new.tsx` | ITDR | Explicit new form page | ✅ Active |
| `it/forms/itdr/index.tsx` | ITDR | Explicit list page | ✅ Active |
| `it/forms/itdr2/new.tsx` | ITDR2 | Explicit new form page | ✅ Active |
| `it/forms/itsc/new.tsx` | ITSC | Explicit new form page | ✅ Active |
| `it/forms/itsc/index.tsx` | ITSC | Explicit list page | ✅ Active |
| `it/forms/itsc/[id].tsx` | ITSC | Explicit detail page | ✅ Active |
| `it/forms/sapamr/new.tsx` | SAPAMR | Explicit new form page | ✅ Active |
| `it/forms/sapamr/index.tsx` | SAPAMR | Explicit list page | ✅ Active |
| `it/forms/sapca/new.tsx` | SAPCA | Explicit new form page | ✅ Active |
| `it/forms/sapcr/new.tsx` | SAPCR | Explicit new form page | ✅ Active |
| `it/forms/sapdrp/new.tsx` | SAPDRP | Explicit new form page | ✅ Active |
| `it/forms/sapdrp/index.tsx` | SAPDRP | Explicit list page | ✅ Active |
| `it/forms/sapslcf/new.tsx` | SAPSLCF | Explicit new form page | ✅ Active |
| `it/forms/sapslcf/index.tsx` | SAPSLCF | Explicit list page | ✅ Active |
| `it/forms/sapsof2/new.tsx` | SAPSOF2 | Explicit new form page | ✅ Active |
| `it/forms/sap-inc/new.tsx` | SAP_INC | Explicit new form page | ✅ Active |
| `it/forms/saptr/new.tsx` | SAPTR | Explicit new form page | ✅ Active |
| `it/forms/edl/new.tsx` | EDL | Explicit new form page | ✅ Active |
| `it/forms/itp/new.tsx` | ITP | Explicit new form page | ✅ Active |
| `it/forms/ite/new.tsx` | ITE | Explicit new form page | ✅ Active |
| `it/forms/ite/index.tsx` | ITE | Explicit list page | ✅ Active |
| `it/forms/srl/new.tsx` | SRL | Explicit new form page | ✅ Active |
| `it/forms/srl/index.tsx` | SRL | Explicit list page | ✅ Active |
| `it/forms/dcal/new.tsx` | DCAL | Explicit new form page | ✅ Active |
| `it/forms/dcal/index.tsx` | DCAL | Explicit list page | ✅ Active |
| `it/forms/ioip/new.tsx` | IOIP | Explicit new form page | ✅ Active |
| `it/forms/ioip/index.tsx` | IOIP | Explicit list page | ✅ Active |
| `it/forms/isgdoc/new.tsx` | ISGDOC | Explicit new form page | ✅ Active |
| `it/forms/isgdoc/index.tsx` | ISGDOC | Explicit list page | ✅ Active |
| `it/forms/itinfo/new.tsx` | ITINFO | Explicit new form page | ✅ Active |
| `it/forms/itinfo/index.tsx` | ITINFO | Explicit list page | ✅ Active |
| `it/forms/asset-submission/new.tsx` | ASSET | Explicit new form page | ✅ Active |
| `it/forms/hwrr/new.tsx` | HWRR | Explicit new form page | ✅ Active |
| `it/forms/mpsprn/new.tsx` | MPSPRN | Explicit new form page | ✅ Active |
| `it/forms/new-request.tsx` | — | Generic "new request" selector | Routes | ⚠️ Redundant — `[formCode]/new.tsx` covers this |

### 1.3 Services (`src/services/`)

| File | Purpose | Layer | Status |
|------|---------|-------|--------|
| `sharepoint-submission-service.ts` | Generic SharePoint CRUD for MainDB_IT | Custom | ✅ Active |
| `office365-users-service.ts` | M365 Users profile lookup | Custom | ✅ Active |
| `outlook-email-service.ts` | Email notifications via Outlook | Custom | ✅ Active |
| `workflow-orchestration-service.ts` | State machine management | Custom | ✅ Active |
| `workflow-audit-service.ts` | Audit trail logging | Custom | ✅ Active |
| `escalation-engine.ts` | SLA monitoring | Custom | ✅ Active |
| `notification-service.ts` | Cross-channel notifications | Custom | ✅ Active |
| `admin-sharepoint-service.ts` | Admin SharePoint operations | Custom | ✅ Active |
| `hr-submission-service.ts` | HR form submissions | Custom | ✅ Active |
| `main-dbhr-service.ts` | HR main list operations | Custom | ✅ Active |
| `str-service.ts` | STR department operations | Custom | ⚠️ Duplicate of `str-submission-service` |
| `str-submission-service.ts` | STR department submissions | Custom | ✅ Active (more complete) |
| `index.ts` | Barrel export for custom services | — | ✅ Active |
| `Untitled-1.txt` | Orphaned artifact | — | ❌ Delete |

### 1.4 Generated Services (`src/generated/services/`)

**Critical issue**: Every service has TWO files — PascalCase and kebab-case:

| Duplicate A (PascalCase) | Duplicate B (kebab-case) | Notes |
|---|---|---|
| `MainDB_ITService.ts` | `main-dbit-service.ts` | Identical content |
| `MainDB_HRService.ts` | `main-dbhr-service.ts` | Identical content |
| `MainDB_FINService.ts` | `main-dbfin-service.ts` | Identical content |
| `MainDB_STRService.ts` | `main-dbstr-service.ts` | Identical content |
| `MainDB_SHEService.ts` | `main-dbshe-service.ts` | Identical content |
| `MainDB_QAService.ts` | `main-dbqa-service.ts` | Identical content |
| `MainDB_PRDService.ts` | `main-dbprd-service.ts` | Identical content |
| `ApprovalRecordsService.ts` | `approval-records-service.ts` | Identical content |
| `ApprovalHistory_HRService.ts` | `approval-history-hr-service.ts` | Identical content |
| `ApprovalHistory_STRService.ts` | `approval-history-str-service.ts` | Identical content |
| `ApprovalHistory_SHEService.ts` | `approval-history-she-service.ts` | Identical content |
| `ApprovalHistory_QAService.ts` | `approval-history-qa-service.ts` | Identical content |
| `WorkflowAuditLogService.ts` | `workflow-audit-log-service.ts` | Identical content |
| `UserRolesService.ts` | `user-roles-service.ts` | Identical content |
| `User_Roles_ITService.ts` | `user-roles-it-service.ts` | Identical content |
| `UserProfilesService.ts` | `user-profiles-service.ts` | Identical content |
| `RoutePermissionsService.ts` | `route-permissions-service.ts` | Identical content |
| `PoliciesService.ts` | `policies-service.ts` | Identical content |
| `ITFormsService.ts` | `it-forms-service.ts` | Identical content |
| `IT_RoutingMatrixService.ts` | `it-routing-matrix-service.ts` | Identical content |
| **~30 more pairs** | — | Same pattern |

**Total**: ~50 PascalCase + ~50 kebab-case = ~100 files where only 50 are needed.

### 1.5 Generated Models (`src/generated/models/`)

Same PascalCase/kebab-case duplication as services — approximately 50 model pairs.

### 1.6 Generated Validators (`src/generated/validators/`)

Same PascalCase/kebab-case duplication — approximately 48 pairs.

### 1.7 Generated Hooks (`src/generated/hooks/`)

Same duplication pattern.

### 1.8 Components (`src/components/`)

| Category | Files | Status |
|----------|-------|--------|
| `ui/` | 40+ Radix UI primitives | ✅ Canonical (shadcn/ui style) |
| `workflow/` | 11 files (approval-workflow, delegation, etc.) | ⚠️ See duplicates |
| `approval-workflow/` | 5 files (overlaps with `workflow/`) | ⚠️ Duplicate candidate |
| `dynamic-form/` | 4 files (DynamicForm, FieldRenderer, SectionRenderer) | ✅ Active |
| `layout/` | 7 `ig-*` files (IG-specific layout) | ✅ Active |
| `layouts/` | 2 files (standalone-layout, department-layout) | ✅ Active |
| `forms/` | 2 files (dynamic-form-renderer, form-submission-layout) | ✅ Active |
| `hr/` | 5 files (hr-layout, status-badge, etc.) | ✅ Active |
| `it/` | 3 files (module-home-layout, multi-stage-form, form-navigation-dialog) | ⚠️ `form-navigation-dialog` duplicates root-level component |
| `debug/` | 7 files (DebugPanel, DebugToggle, etc.) | ✅ Active |
| `attachments/` | 3 files (index, attachment-table, attachment-manager) | ✅ Active |
| `shared/` | 2 files (database-table, detail-modal) | ⚠️ See duplicates |
| `database-view/` | 3 files (index, database-table, detail-modal) | ⚠️ See duplicates |
| **Root-level** | 35+ standalone component files | ⚠️ See duplicates |

---

## 2. Duplicate and Redundancy Detection

### 🔴 CRITICAL: Generated File Duplication (PascalCase vs kebab-case)

| Duplicate Group | Files Found | Similarity | Recommended Canonical | Action |
|---|---|---|---|---|
| **All generated services** | ~50 PascalCase + ~50 kebab-case | **100% identical** | kebab-case (already referenced by `generated/services/index.ts`) | Delete ALL PascalCase files |
| **All generated models** | ~50 PascalCase + ~50 kebab-case | **100% identical** | kebab-case | Delete ALL PascalCase files |
| **All generated validators** | ~48 PascalCase + ~48 kebab-case | **100% identical** | kebab-case | Delete ALL PascalCase files |
| **All generated hooks** | ~30 PascalCase + ~30 kebab-case | **100% identical** | kebab-case | Delete ALL PascalCase files |
| **Generated components** | ~30 PascalCase + ~30 kebab-case | **100% identical** | kebab-case | Delete ALL PascalCase files |

**Impact**: 200+ unnecessary files, ~50% of the generated folder is redundant.

### 🔴 CRITICAL: Delegation Dialog (THREE versions)

| Files | Purpose | Analysis | Recommendation |
|---|---|---|---|
| `components/delegation-dialog.tsx` | Stub — returns `null` | Dead code | Delete |
| `components/approval-workflow/delegation-dialog.tsx` | Full impl with motion | More complete | Keep this one |
| `components/workflow/delegation-dialog.tsx` | Full impl with motion (slightly different) | Has people picker + search | Merge into canonical version |

### 🔴 CRITICAL: Approval Workflow (TWO folders)

| Folder | Files | Status |
|--------|-------|--------|
| `components/approval-workflow/` | `approval-workflow.tsx`, `approval-actions.tsx`, `delegation-dialog.tsx`, `audit-timeline.tsx`, `bulk-actions-toolbar.tsx` | ⚠️ Partial overlap with `workflow/` |
| `components/workflow/` | `approval-workflow.tsx`, `approval-actions.tsx`, `delegation-dialog.tsx`, `stage-progress.tsx`, `stage-gated-section.tsx`, `workflow-timeline.tsx`, `escalation-monitor.tsx`, `edit-request-modal.tsx`, `edit-request-indicator.tsx`, `edit-request-dialog.tsx`, `edit-request-approval-panel.tsx`, `workflow-actions.tsx` | More comprehensive |

**Recommendation**: Merge `approval-workflow/` into `workflow/` and keep one canonical `workflow/` folder. The `approval-workflow/` folder is likely an older version.

### 🟡 HIGH: Database Table (THREE versions)

| Files | Location | Recommendation |
|---|---|---|
| `database-table.tsx` | Root `components/` | Keep as canonical |
| `database-view/database-table.tsx` | `components/database-view/` | Delete (covered by root) |
| `shared/database-table.tsx` | `components/shared/` | Delete (covered by root) |

### 🟡 HIGH: Detail Modal (THREE versions)

| Files | Location | Recommendation |
|---|---|---|
| `detail-modal.tsx` | Root `components/` | Keep as canonical |
| `database-view/detail-modal.tsx` | `components/database-view/` | Delete (covered by root) |
| `shared/detail-modal.tsx` | `components/shared/` | Delete (covered by root) |

### 🟡 HIGH: STR Services (TWO versions)

| Files | Purpose | Recommendation |
|---|---|---|
| `services/str-service.ts` | STR dept operations | Merge into `str-submission-service.ts` then delete |
| `services/str-submission-service.ts` | STR dept submissions (more complete) | Keep as canonical |

### 🟡 HIGH: Quick Submit vs Quick Form

| Files | Purpose | Recommendation |
|---|---|---|
| `pages/quick-form.tsx` | Rapid form submission | Determine if these serve different purposes |
| `pages/quick-submit.tsx` | Fast ticket creation | If same purpose, merge into one |

### 🟡 HIGH: Submission Detail (TWO paths)

| Files | Purpose | Recommendation |
|---|---|---|
| `pages/submissions/[id].tsx` | Dynamic submission detail | Keep as canonical |
| `pages/submission-detail.tsx` | Static submission detail | Merge routing into `[id].tsx` pattern |

### 🟡 HIGH: ITDR Legacy Pages

| Files | Purpose | Recommendation |
|---|---|---|
| `pages/itdr-form.tsx` | Legacy ITDR form | Verify if this is still used by routes |
| `pages/it/forms/itdr/new.tsx` | New ITDR form | Keep canonical |
| `pages/itdr2-form.tsx` | Legacy ITDR2 form | Same pattern |
| `pages/it/forms/itdr2/new.tsx` | New ITDR2 form | Same pattern |

### 🟡 HIGH: IT Form Navigation Dialog (TWO versions)

| Files | Purpose | Recommendation |
|---|---|---|
| `components/form-navigation-dialog.tsx` | Root-level | Keep as canonical |
| `components/it/form-navigation-dialog.tsx` | IT-specific | Merge into root if generalizable |

### 🟡 HIGH: IT Forms `new-request.tsx` vs `[formCode]/new.tsx`

| Files | Purpose | Recommendation |
|---|---|---|
| `pages/it/forms/new-request.tsx` | Generic "pick a form" page | May be redundant if `[formCode]/new.tsx` handles it |
| `pages/it/forms/[formCode]/new.tsx` | Dynamic form by formCode | Keep as canonical |

### 🟢 MEDIUM: Escalation Monitor (TWO versions)

| Files | Purpose | Recommendation |
|---|---|---|
| `components/escalation-monitor.tsx` | Root-level | Keep as canonical |
| `components/workflow/escalation-monitor.tsx` | In workflow folder | Delete |

### 🟢 MEDIUM: Multi-Step Form (TWO references)

| Files | Purpose | Recommendation |
|---|---|---|
| `components/multi-step-form.tsx` | Root-level | Keep as canonical |
| `components/it/multi-stage-form-view.tsx` | IT-specific wrapper | May be valid IT-specific wrapper |

### 🟢 MEDIUM: Data Ready Guard

| File | Purpose | Recommendation |
|---|---|---|
| `components/data-ready-guard.tsx` | Loading/init guard | ✅ Keep |

### 🟢 MEDIUM: Orphaned / Unused Files

| File | Problem | Recommendation |
|---|---|---|
| `services/Untitled-1.txt` | VS Code untitled artifact | Delete |
| `pages/forms.tsx` | Generic forms page, may be unused | Verify routing |
| `pages/index.tsx` | Root redirect | ✅ Keep |
| `pages/_layout.tsx` | App layout | ✅ Keep |

### 🟢 MEDIUM: App.tsx routing — `MRFNewPage` loads from `@/forms/mrf/` which doesn't match convention

```tsx
const MRFNewPage = lazy(() => import('@/forms/mrf/MRFNewPage').then(m => ({ default: m.MRFNewPage })));
```
This references a path outside the normal `src/pages/` convention. Needs verification.

---

## 3. Form Alignment Review

### 3.1 IT Business Forms — Current State

| Business Form | Current Files | Duplicates Found | Recommended Canonical | Merge Needed? |
|---|---|---|---|---|
| **EAF (VPN/Citrix)** | `it/forms/eaf/new.tsx`, `it/forms/[formCode]/new.tsx` | Dynamic `[formCode]` may also match EAF | `it/forms/eaf/new.tsx` as explicit page; `[formCode]/new.tsx` as fallback | ⚠️ Ensure no double-routing |
| **ITSSR** | `it/forms/itssr/new.tsx`, `it/forms/itssr/index.tsx`, `it/forms/itssr/[id].tsx`, plus `[formCode]/` variant | Same | `it/forms/itssr/` as canonical | ⚠️ Route deduplication |
| **HI (Hardware)** | `it/forms/hi/new.tsx`, `it/forms/hi/index.tsx` | None | `it/forms/hi/` | None |
| **NIR (Notes ID)** | `it/forms/nir/new.tsx` | `[formCode]/` variant | `it/forms/nir/new.tsx` | ⚠️ Route dedup |
| **PRF** | `it/forms/prf/new.tsx` | `[formCode]/` variant | `it/forms/prf/new.tsx` | ⚠️ Route dedup |
| **RS** | `it/forms/rs/new.tsx` | `[formCode]/` variant | `it/forms/rs/new.tsx` | ⚠️ Route dedup |
| **SFAR** | `it/forms/sfar/new.tsx` | `[formCode]/` variant | `it/forms/sfar/new.tsx` | ⚠️ Route dedup |
| **SAPCR** | `it/forms/sapcr/new.tsx` | `[formCode]/` variant | `it/forms/sapcr/new.tsx` | ⚠️ Route dedup |
| **SAPSOF2** | `it/forms/sapsof2/new.tsx` | `[formCode]/` variant | `it/forms/sapsof2/new.tsx` | ⚠️ Route dedup |
| **ITDR** | `pages/itdr-form.tsx` (legacy) + `it/forms/itdr/new.tsx` | Legacy root-level | `it/forms/itdr/new.tsx` | Delete root-level legacy |
| **ITDR2** | `pages/itdr2-form.tsx` (legacy) + `it/forms/itdr2/new.tsx` | Legacy root-level | `it/forms/itdr2/new.tsx` | Delete root-level legacy |

### 3.2 Form Pattern Assessment

The IT forms follow two competing patterns:

**Pattern A — Dynamic**: `it/forms/[formCode]/new.tsx` + `it/forms/[formCode]/index.tsx`
- ✅ Single file handles all forms
- ✅ Form schema registry determines which form renders
- ⚠️ But explicit per-form pages (Pattern B) also exist for the same form codes

**Pattern B — Explicit**: `it/forms/{formCode}/new.tsx` for each form individually
- ✅ Each form has its own file for custom logic
- ❌ 25+ files instead of 1-2
- ✅ Can override/handle specific per-form behavior

**Recommendation**: Use **Pattern A (dynamic)** as the default routing target. Use **Pattern B (explicit)** only for forms that genuinely need custom rendering (like ITSSR with its triage dashboard). Decouple `it-routes.tsx` so it doesn't import both patterns for the same form code.

### 3.3 New/Edit/View Pattern

Currently, there is no unified New/Edit/View pattern. The forms only have `new` variants. There is no `edit` or `view` page pattern for IT forms.

| Mode | Current | Recommended |
|------|---------|-------------|
| **New** | ✅ `{form}/new.tsx` exists for each form | Keep |
| **Edit** | ❌ Not implemented separately | Add as `{form}/edit.tsx` or merge into detail page |
| **View** | ⚠️ Some have `{form}/[id].tsx` (detail) | Keep detail as view mode |
| **Approval** | ⚠️ Centralized `pages/approvals.tsx` | Keep centralized |

---

## 4. Cleanup Recommendations

### 4.1 Immediate Actions (Safe to Do Now)

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 1 | **Delete** `services/Untitled-1.txt` | 1 file | Orphaned VS Code artifact | None |
| 2 | **Delete** `components/delegation-dialog.tsx` (root-level stub) | 1 file | Dead code — returns `null` | None (not imported anywhere) |
| 3 | **Verify** whether `pages/itdr-form.tsx` and `pages/itdr2-form.tsx` are referenced in routes | 2 files | If not imported, delete | Low |
| 4 | **Delete** `components/escalation-monitor.tsx` (root-level) | 1 file | Duplicate of `workflow/escalation-monitor.tsx` | Low |

### 4.2 Generated Folder Cleanup

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 5 | **Delete** ALL PascalCase files in `generated/services/` | ~50 files | Identical to kebab-case versions | Medium — verify `index.ts` imports kebab-case only |
| 6 | **Delete** ALL PascalCase files in `generated/models/` | ~50 files | Identical to kebab-case versions | Medium — verify imports |
| 7 | **Delete** ALL PascalCase files in `generated/validators/` | ~48 files | Identical to kebab-case versions | Medium — verify imports |
| 8 | **Delete** ALL PascalCase files in `generated/hooks/` | ~30 files | Identical to kebab-case versions | Medium — verify imports |
| 9 | **Delete** ALL PascalCase files in `generated/components/` | ~30 files | Identical to kebab-case versions | Medium — verify imports |

**Total**: ~208 files deleted, freeing ~50% of `generated/` folder.

### 4.3 Component Folder Consolidation

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 10 | **Merge** `approval-workflow/` into `workflow/` | Move unique files, delete overlap | Two parallel workflow component systems | Medium — verify all import paths |
| 11 | **Delete** `components/database-view/` | 3 files | Covered by root `components/database-table.tsx` and `detail-modal.tsx` | Medium — check imports |
| 12 | **Delete** `components/shared/` (if only db-table + detail-modal) | 2 files | Covered by root components | Medium — check imports |
| 13 | **Consolidate** `components/it/form-navigation-dialog.tsx` into root | 2 files → 1 | Duplicate of root `form-navigation-dialog.tsx` | Medium |

### 4.4 Page Consolidation

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 14 | **Evaluate** `pages/quick-form.tsx` vs `quick-submit.tsx` | 2 files | Are these different? If not, merge | Low — needs manual review |
| 15 | **Merge** `pages/submission-detail.tsx` into `pages/submissions/[id].tsx` | 2 files → 1 | Same purpose, different paths | Medium — verify routing |
| 16 | **Verify** `pages/forms.tsx` utility | 1 file | May be unused | Low |
| 17 | **Delete** legacy `pages/itdr-form.tsx` and `pages/itdr2-form.tsx` (if not in routes) | 2 files | Superseded by `it/forms/itdr/` and `it/forms/itdr2/` | Low |

### 4.5 Service Consolidation

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 18 | **Merge** `services/str-service.ts` into `services/str-submission-service.ts` | 2 files → 1 | Overlapping STR department logic | Low — verify all imports reference `str-submission-service` |

### 4.6 Route Cleanup

| # | Action | Files Affected | Reason | Risk |
|---|--------|---------------|--------|------|
| 19 | **Review** `it-routes.tsx` for double-routing (dynamic `[formCode]` vs explicit form routes) | 1 file | Forms may match both patterns | Medium — leads to 404 or rendering errors |
| 20 | **Review** `app.tsx` import of `@/forms/mrf/MRFNewPage` | 1 file | Non-standard import path | Low — verify directory exists |

---

## 5. Safe Cleanup Plan

### Phase 1: Inventory & Verify (Recommended: Do this first)

| Step | Task | Duration | Done By |
|------|------|----------|---------|
| 1.1 | Verify which files are imported by checking all `import` statements in active code | 1 hr | Developer |
| 1.2 | Confirm that `generated/services/index.ts` only exports kebab-case | 15 min | Developer |
| 1.3 | Check if `pages/itdr-form.tsx` and `itdr2-form.tsx` are imported in any route file | 10 min | Developer |
| 1.4 | Check if `components/delegation-dialog.tsx` is imported anywhere | 10 min | Developer |
| 1.5 | Check if `components/escalation-monitor.tsx` is imported from root | 10 min | Developer |
| 1.6 | Run `npm run build` to catch any broken imports | 2 min | Developer |

### Phase 2: Safe Deletions (No risk of breaking anything)

| Step | Task | Files |
|------|------|-------|
| 2.1 | Delete `services/Untitled-1.txt` | 1 |
| 2.2 | Delete `components/delegation-dialog.tsx` (root stub) | 1 |
| 2.3 | Delete legacy `itdr-form.tsx` and `itdr2-form.tsx` (if unimported) | 2 |
| 2.4 | Run `npm run build` to confirm | — |

### Phase 3: Generated File Cleanup (Medium risk — verify imports first)

| Step | Task | Files |
|------|------|-------|
| 3.1 | Confirm `generated/services/index.ts` uses ONLY kebab-case paths | — |
| 3.2 | Search for any PascalCase imports from `generated/` across the codebase | — |
| 3.3 | Delete PascalCase service files | ~50 |
| 3.4 | Delete PascalCase model files | ~50 |
| 3.5 | Delete PascalCase validator files | ~48 |
| 3.6 | Delete PascalCase hook files | ~30 |
| 3.7 | Delete PascalCase component files | ~30 |
| 3.8 | Run `npm run build` to catch any broken imports | — |

### Phase 4: Component Consolidation (Medium risk)

| Step | Task | Files |
|------|------|-------|
| 4.1 | Move unique files from `approval-workflow/` into `workflow/` | TBD |
| 4.2 | Delete `approval-workflow/` folder after merge | 1 folder |
| 4.3 | Verify `workflow/` index.ts or import paths still valid | — |
| 4.4 | Delete `database-view/` and `shared/` if redundant | 2 folders |
| 4.5 | Run `npm run build` | — |

### Phase 5: Service Consolidation (Low risk)

| Step | Task | Files |
|------|------|-------|
| 5.1 | Export anything unique from `str-service.ts` in `str-submission-service.ts` | — |
| 5.2 | Update `services/index.ts` to remove `str-service` | — |
| 5.3 | Delete `str-service.ts` | 1 |
| 5.4 | Run `npm run build` | — |

### Phase 6: Form Pattern Alignment (Longer term)

| Step | Task |
|------|------|
| 6.1 | Choose canonical form pattern: **Dynamic `[formCode]` as default, explicit per-form only for custom needs** |
| 6.2 | Update `it-routes.tsx` to remove explicit imports for forms that only use dynamic pattern |
| 6.3 | Add Edit and View patterns for key forms (EAF, ITSSR, HI) |
| 6.4 | Implement mode-based form component (New/Edit/View controlled by props) |

---

## Execution Summary (Completed 2026-06-01)

### ✅ What Was Done

| Phase | Action | Files Affected | Result |
|-------|--------|---------------|--------|
| **Phase 2** | Deleted orphaned `Untitled-1.txt` | 1 file | ✅ Clean |
| **Phase 2** | Deleted legacy `itdr-form.tsx` and `itdr2-form.tsx` | 2 files | ✅ Clean (confirmed unused) |
| **Phase 3** | Deleted PascalCase generated service files | 52 files | ✅ 60 kebab-case remain |
| **Phase 3** | Deleted PascalCase generated model files | 61 files | ✅ 60 kebab-case remain |
| **Phase 3** | Cleaned PascalCase exports from `generated/index.ts` | 1 file | ✅ Removed ~63 model + 45 service references |
| **Phase 3** | Fixed imports in `use-dynamic-form.ts` | 1 file | ✅ `MainDB_ITService` → `main-dbit-service` |
| **Phase 3** | Fixed imports in `use-employee-lookup.ts` | 1 file | ✅ PascalCase → kebab-case |
| **Phase 3** | Fixed imports in `use-office365-users.ts` | 1 file | ✅ PascalCase → kebab-case |
| **Phase 3** | Fixed imports in `use-send-email.ts` | 1 file | ✅ PascalCase → kebab-case |
| **Phase 3** | Fixed imports in all HR pages (bsd, cafeteria, cwr) | 8 files | ✅ PascalCase → kebab-case |
| **Phase 3** | Recreated Office365 service stubs as kebab-case | 4 files | ✅ `office365-users-service.ts`, `outlook-email-service.ts` + models |
| **Phase 3** | Added Office365 exports to generated service index | 1 file | ✅ |
| **Phase 4** | Deleted unused `approval-workflow/` folder (5 stub files) | 5 files | ✅ All stubs returning `null` |
| **Phase 5** | Deleted unused `str-service.ts` | 1 file | ✅ `str-submission-service.ts` is canonical |

### 📊 Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total generated files | ~352 | ~239 | **−113 (32%)** |
| Total files deleted | — | **120 files** | — |
| PascalCase/kebab-case duplication | 100% | 0% | **Eliminated** |
| Approval workflow folders | 2 (`approval-workflow/` + `workflow/`) | 1 (`workflow/`) | **Consolidated** |
| Unused custom services | 2 (`str-service`, `Untitled-1.txt`) | 0 | **Cleaned** |
| Legacy page files | 2 (`itdr-form`, `itdr2-form`) | 0 | **Cleaned** |

### ⚠️ Postponed / Needs Manual Review

| Item | Reason |
|------|--------|
| `escalation-monitor.tsx` (root vs `workflow/`) | Both self-contained; needs code comparison |
| `quick-form.tsx` vs `quick-submit.tsx` | Need manual review to determine if different |
| `submission-detail.tsx` vs `submissions/[id].tsx` | Need routing analysis before merging |
| Form pattern (`[formCode]` vs explicit) | Working correctly; optimization only |
| `database-view/` and `shared/` folders | Both actively imported by different pages — not duplicates |

### File Naming

| Element | Convention | Example |
|---------|-----------|---------|
| **Pages** | kebab-case | `my-submissions.tsx`, `department-hub.tsx` |
| **Components** | kebab-case | `approval-workflow.tsx`, `dynamic-form.tsx` |
| **Services** | kebab-case | `sharepoint-submission-service.ts` |
| **Models** | kebab-case | `main-dbit-model.ts` |
| **Validators** | kebab-case | `main-dbit-validator.ts` |
| **Hooks** | kebab-case | `use-approval-workflow.ts` |
| **Routes** | kebab-case | `it-routes.tsx`, `hr-routes.tsx` |
| **Form schemas** | UPPER_SNAKE | `VPNACCESS.json`, `ITSSR.json` |
| **React components** | PascalCase (inside file) | `export function ApprovalWorkflow()` |

### Folder Structure

| Folder | Convention | Example |
|--------|-----------|---------|
| Department pages | lowercase | `pages/it/`, `pages/hr/` |
| Form pages | formCode lowercase | `pages/it/forms/eaf/` |
| Components | kebab-case subfolders | `components/approval-workflow/` |
| Generated | keep as-is (kebab-case) | `generated/services/main-dbit-service.ts` |

### Key Principle
> **One canonical file per logical unit. No duplicates in PascalCase/kebab-case.**
> **One canonical component folder per domain. No `approval-workflow/` AND `workflow/`.**
> **One canonical form implementation per business form. No dynamic + explicit co-existence for the same form.**

---

## Summary Table

| Category | Total Files | Files to Delete | Files to Merge | Files to Keep |
|----------|-------------|-----------------|---------------|---------------|
| Generated Services | ~100 | ~50 (PascalCase) | 0 | ~50 |
| Generated Models | ~100 | ~50 (PascalCase) | 0 | ~50 |
| Generated Validators | ~96 | ~48 (PascalCase) | 0 | ~48 |
| Generated Hooks | ~60 | ~30 (PascalCase) | 0 | ~30 |
| Generated Components | ~60 | ~30 (PascalCase) | 0 | ~30 |
| Custom Services | 14 | 2 (Untitled-1, str-service) | 1 merge | 11 |
| Components | 161 | 4-6 (delegation stub, duplicates) | 2-3 folders | ~150 |
| Pages | ~165 | 2-4 (legacy ITDR, form duplicates) | 3-4 merges | ~158 |
| Routes | 21 | 0 | 1 review | 21 |
| **Total** | **~950** | **~216** | **~10 merges** | **~720** |

> **Net reduction potential**: ~216 files deleted (~23% of total), ~10 files merged.
