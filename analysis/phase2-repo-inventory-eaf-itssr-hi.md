# Phase 2: Repo Inventory — EAF, ITSSR, HI

> **Generated**: 2026-05-31
> **Scope**: EAF, ITSSR, HI form implementation files in `powerapps-mirror/apps/ioi-platform/`

---

## Repo Inventory Table

| Area | File / Item | Purpose | Referenced By | Current State | Notes |
|---|---|---|---|---|---|
| **EAF List** | `src/pages/it/forms/eaf/index.tsx` | EAF database view with combined main+ext data | Router, `useMainDBITList`, `useMainDBITExtAccessList` | ✅ Aligned | 7-column table with status badges; detail modal with field groups |
| **EAF New** | `src/pages/it/forms/eaf/new.tsx` | 4-step multi-step form for EAF submission | Router | ✅ Aligned | PeoplePicker, SharePoint create, email notifications |
| **EAF Detail** | `src/pages/it/forms/eaf/[id].tsx` | Re-exports from `submissions/[id]` | Router | ⚠️ Partially aligned | Generic detail view — may not show EAF-specific fields from Ext_Access |
| **EAF Schema** | `src/form-schemas/VPNACCESS.json` | JSON form schema for EAF fields | Dynamic form renderer | ❌ Not aligned | FormCode says "VPNACCESS" but code uses "EAF"; 6 sections defined |
| **EAF Types** | `src/types/m1-forms.ts` | `EAFFormInput`, `EAFApplication`, `EAF_APPLICATIONS` | New form, components | ✅ Aligned | Includes `EAF_APPLICATIONS`, `EAF_STAGES` |
| **EAF Config** | `src/config/form-dropdown-config.ts` | `EAF_SYSTEMS` dropdown config | New form | ✅ Aligned | System name dropdown |
| **EAF Hooks** | `src/hooks/use-form-approver.ts` | Approver resolution for EAF | New form | ✅ Aligned | Supports manual assign + dept head |
| **EAF Email** | `src/hooks/use-send-email.ts` | `useSendApprovalEmail`, `useSendConfirmationEmail` | New form | ✅ Aligned | Email notification hooks |
| **ITSSR App** | `src/features/itssr/itssr-app.tsx` | Full ITSSR application (list + detail + new + edit) | Router | ✅ Aligned | Comprehensive ~1200+ line feature file |
| **ITSSR Schema** | `src/form-schemas/ITSSR.json` | JSON form schema with `spColumn`/`spTable` references | Dynamic form renderer | ✅ Aligned | 5 sections, ~30+ fields defined |
| **ITSSR List Page** | `src/pages/it/forms/itssr/index.tsx` | Delegates to `ITSSRListScreen` | Router | ✅ Aligned | Thin wrapper |
| **ITSSR New** | `src/pages/it/forms/itssr/new.tsx` | New ITSSR form page | Router | ✅ Aligned | Delegates to feature |
| **ITSSR Detail** | `src/pages/it/forms/itssr/detail.tsx` | ITSSR detail page | Router | ✅ Aligned | Delegates to feature |
| **ITSSR Detail** | `src/pages/it/forms/itssr/[id].tsx` | Dynamic ID catchall | Router | ✅ Aligned | Delegates to feature |
| **ITSSR PIC Routing** | `src/config/itssr-pic-routing.ts` | Category-based routing config | Feature app | ✅ Aligned | Maps categories to PIC emails |
| **ITSSR SLA Utils** | `src/lib/itssr-sla-utils.ts` | SLA calculation utilities | Feature app | ⚠️ Partially aligned | Needs business confirmation on SLA hours |
| **HI List** | `src/pages/it/forms/hi/index.tsx` | Hardware inventory list view | Router | ✅ Aligned | 8-column table with asset tag, type, status |
| **HI New** | `src/pages/it/forms/hi/new.tsx` | New hardware registration form | Router | ⚠️ Partially aligned | Covers ~25 of 58 Domino fields |
| **HI Detail** | `src/pages/it/forms/hi/[id].tsx` | **MISSING** | Router | ❌ Missing | No detail/edit page for HI |
| **HI Schema** | `src/form-schemas/HWINV_PRAI.json` | JSON form schema | Dynamic form renderer | ❌ Not aligned | FormCode says "HWINV_PRAI" but code uses "HI" |
| **HI Types** | `src/types/` | HI-specific types | New form | ⚠️ Partially aligned | No dedicated HI types file |
| **SharePoint Service** | `src/services/sharepoint-submission-service.ts` | Mock SharePoint service with form codes, stages | All forms | ⚠️ Partially aligned | Uses mock data — not connected to real SharePoint |
| **Generated Models** | `src/generated/models/main-dbit-model.ts` | MainDB_IT TypeScript model | All forms | ✅ Aligned | Auto-generated from schema |
| **Generated Services** | `src/generated/services/main-dbit-service.ts` | MainDB_IT CRUD service | All forms | ✅ Aligned | Auto-generated |
| **Generated Hooks** | `src/generated/hooks/use-main-dbit.ts` | React Query hooks for MainDB_IT | EAF, HI lists | ✅ Aligned | Auto-generated |
| **Generated Ext Access** | `src/generated/hooks/use-main-dbitext-access.ts` | React Query hooks for Ext_Access | EAF list | ✅ Aligned | Auto-generated |
| **Generated Ext Support** | `src/generated/services/main-dbit-ext-support-service.ts` | Ext_Support CRUD service | ITSSR | ✅ Aligned | Auto-generated |
| **Generated Ext Docs** | `src/generated/services/main-dbit-ext-docs-service.ts` | Ext_Docs CRUD service | ITSSR | ✅ Aligned | Auto-generated |

---

## Classification Summary

| Status | Count | Items |
|--------|-------|-------|
| ✅ Aligned | 17 | EAF list, EAF new, EAF types, EAF config, EAF hooks, EAF email, ITSSR app, ITSSR schema, ITSSR list/new/detail/[id], ITSSR PIC routing, HI list, generated models/services/hooks |
| ⚠️ Partially aligned | 5 | EAF detail (generic), ITSSR SLA (unvalidated), HI new (25/58 fields), SharePoint service (mock), HI types |
| ❌ Not aligned | 2 | EAF schema (VPNACCESS name), HI schema (HWINV_PRAI name) |
| ❌ Missing | 2 | HI detail page `[id].tsx`, HI edit/update page |
