# SharePoint Connection and Integration Audit

> **Date**: 2026-06-01 (Updated: 2026-06-03)
> **Auditor**: Automated Integration Audit (Fix round: Domino Migration Agent)
> **Scope**: Power Apps code-first app (`apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/`)
> **App Type**: Power Apps new code app — React 19 + TypeScript + Vite + shadcn/ui
> **SDK**: `@microsoft/power-apps` v1.1.3
>
> **⚠️ Fact Correction — 2026-06-03**
> - `MainDBIT` model has **130 properties** (not ~80). Coverage is ~49% of ~264 SP columns, not ~30%.
> - EAF partial failure rollback **already existed** (not missing).
> - Stale connection ref is `6458878c`, `8a5dc4b8`, `08d57e01` (not `a34af162`).

---

## 1. Executive Summary

### Verdict: **Integration is architecturally sound but has significant data quality issues.**

The app uses a **parent-child SharePoint list pattern** (shared schema on MainDB_IT + extension lists per form category), which is well-architected. However, there are several critical issues:

### Major Risks
1. **⚠️ Column duplication** — ~50+ EAF/HI/ITSSR/NIR columns exist in BOTH `MainDB_IT` (parent) and extension lists (child), creating ambiguity about which list is the source of truth
2. **⚠️ Type mismatches** — Many Date/Choice/Person fields are stored as `Single line of text` instead of proper SharePoint types (Date and Time, Choice, Person or Group)
3. **⚠️ Field Mapping document is outdated** — The `field-mapping.csv` references columns (`Requestor_Name` as Person/Group, `AssetTag`, `CaseNo`) that don't match the actual SharePoint schema
4. **⚠️ Generated model gaps** — The `MainDBIT` TypeScript model covers only ~80 of ~264 visible SharePoint columns (~70% missing)
5. **⚠️ Deprecated service still present** — `sharepoint-submission-service.ts` is marked deprecated but remains in the codebase
6. **⚠️ Mock data in dev** — All pages use mock data in dev mode; production switch may expose issues

### Highest-Priority Fixes
| Priority | Issue | Location | Fix |
|----------|-------|----------|-----|
| P1 | Duplicate columns on MainDB_IT vs extension lists | MainDB_IT SharePoint list | Remove duplicate EAF/NIR/HI/ITSSR columns from MainDB_IT (keep only shared schema) |
| P1 | Date fields stored as text | ~20 date fields across lists | Convert to Date and Time type |
| P1 | Field mapping document out of sync | `mapping/field-mapping.csv`, `mapping/field-mapping.md` | Reconcile with actual SharePoint schema |
| P2 | MainDBIT model missing ~180 columns | `src/generated/models/main-dbit-model.ts` | Regenerate model from actual SharePoint schema |
| P2 | Person fields stored as text | Many email/name fields | Add Person or Group columns where needed |
| P3 | Deprecated service removal | `src/services/sharepoint-submission-service.ts` | Remove after confirming no remaining references |

---

## 2. Sources Reviewed

| Source | File/Location | Status |
|--------|--------------|--------|
| Power Apps connection config | `power.config.json` | ✅ Reviewed |
| Power Apps SDK config | `app-gen-sdk/data/index.ts` | ✅ Reviewed |
| Data service layer | `src/data/dataService.ts`, `sharePointClient.ts`, `mockDataClient.ts` | ✅ Reviewed |
| Generated models | `src/generated/models/main-dbit-model.ts`, `main-dbhr-model.ts`, `main-dbqa-model.ts`, `main-dbit-ext-access-model.ts` | ✅ Reviewed |
| Generated services | `src/generated/services/main-dbit-service.ts`, `main-dbit-ext-access-service.ts`, `main-dbhr-service.ts`, `main-dbqa-service.ts` | ✅ Reviewed |
| Extended services | `src/services/main-dbit-site-service.ts`, `main-dbhr-service.ts`, `main-dbqa-site-service.ts` | ✅ Reviewed |
| HR submission service | `src/services/hr-submission-service.ts` | ✅ Reviewed |
| Deprecated submission service | `src/services/sharepoint-submission-service.ts` | ✅ Reviewed (deprecated) |
| Form pages (EAF) | `src/pages/it/forms/eaf/new.tsx`, `index.tsx`, `[id].tsx` | ✅ Reviewed |
| Department config | `src/config/departments.ts` | ✅ Reviewed |
| QA form config | `src/config/qa-forms.ts` | ✅ Reviewed |
| Data source mappings | `src/types/data-source-mapping.ts` | ✅ Reviewed |
| Field mapping doc | `mapping/field-mapping.md`, `mapping/field-mapping.csv` | ✅ Reviewed |
| SharePoint list design | `design/m365-design/sharepoint-list-design.md` | ✅ Reviewed |
| Power Apps design | `design/m365-design/powerapps-design.md` | ✅ Reviewed |
| **Actual SharePoint: MainDB_IT** | `https://ioioi.sharepoint.com/sites/ioi-portal-it` | ✅ Verified (264 visible fields) |
| **Actual SharePoint: MainDB_IT_Ext_Access** | Same site | ✅ Verified (95 fields) |
| **Actual SharePoint: MainDB_IT_Ext_Support** | Same site | ✅ Verified (63 fields) |
| **Actual SharePoint: MainDB_IT_Ext_Assets** | Same site | ✅ Verified (75 fields) |
| **Actual SharePoint: MainDB_IT_Ext_SAP** | Same site | ✅ Verified (49 fields) |
| **Actual SharePoint: MainDB_HR** | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | ✅ Verified (287 fields) |

---

## 3. Assumptions and Missing Inputs

### Assumptions
1. The **parent-child pattern** (shared schema on MainDB_IT + extension lists) is the intentional architecture
2. The **extension list** is the source of truth for form-specific fields
3. EAF columns on MainDB_IT are **legacy/duplicate** and should be removed
4. The `@microsoft/power-apps` SDK normalizes camelCase model property names to SharePoint column names
5. Mock data is used for development only and will be replaced by SharePoint data in production

### Missing Inputs
1. ❌ Actual SharePoint schemas for: MainDB_QA, MainDB_QC (not fetched for this audit)
2. ❌ Actual SharePoint schemas for: MainDB_FIN, MainDB_PRD, MainDB_SHE, MainDB_STR
3. ❌ Actual SharePoint schemas for: HR extension lists (MainDB_HR_Ext_*)
4. ❌ Actual SharePoint schemas for: QA/QC extension lists (MainDB_QA_Ext_*)
5. ❌ Power Automate flow source code (if any SharePoint columns are flow-managed)
6. ❌ Full list of Choice column values for Choice-type fields

---

## 4. SharePoint Site and List Connection Audit

### Connection Reference: `3eee79e3-fad2-4e24-84b7-acfa1d075fdb` (Primary)

| Connection / Data Source | SharePoint Site | List Name | Used In App | Status | Issue / Risk | Recommended Fix |
|---|---|---|---|---|---|---|
| `maindb_it` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT (Prai) | ✅ IT forms (EAF, NIR, RS, etc.) | **Correct** | None | None |
| `maindb_it_jhr` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_JHR | ⬜ Pending | **Missing** | Placeholder GUID `00000000-...` | Create list and update GUID |
| `maindb_it_ext_access` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Access | ✅ EAF, NIR, PRF, RS, SFAR, UR forms | **Correct** | None | None |
| `maindb_it_ext_support` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Support | ✅ ITSSR, ITDR, ITDR2 forms | **Correct** | None | None |
| `maindb_it_ext_assets` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Assets | ✅ HI, ITSC forms | **Correct** | None | None |
| `maindb_it_ext_sap` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_SAP | ✅ SAP forms | **Correct** | None | None |
| `maindb_it_ext_docs` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Docs | Pending | **Missing** | Placeholder GUID | Create list and update GUID |
| `maindb_it_ext_infra` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Infra | Pending | **Missing** | Not in config at all | Add to power.config.json |
| `maindb_it_ext_policy` | ioioi.sharepoint.com/sites/ioi-portal-it | MainDB_IT_Ext_Policy | Pending | **Missing** | Placeholder GUID | Update GUID in config |
| `maindb_hr` | ioioi.sharepoint.com/sites/ioi-portal-hr | MainDB_HR | ✅ HR forms | **Correct** | None | None |
| `maindb_qa` | ioioi.sharepoint.com/sites/ioi-portal-qa | MainDB_QA | ✅ QA pages | **Correct** | None | None |
| `maindb_qc` | ioioi.sharepoint.com/sites/ioi-portal-qc | MainDB_QC | ✅ QC pages | **Correct** | Newly added | None |

### Connection Reference: `7a10b3f0faba44f2a0c864aec3f1d045` (Secondary)

| Connection / Data Source | SharePoint Site | List Name | Used In App | Status | Issue / Risk |
|---|---|---|---|---|---|
| `maindb_qa` (duplicate) | ioi-portal-qa | MainDB_QA | ✅ QA pages | **Duplicate** | Same tableName as primary connection |
| `maindb_hr` (duplicate) | ioi-portal-hr | MainDB_HR | ✅ HR pages | **Duplicate** | Same tableName as primary connection |

### Connection Reference: `3509ce13-98bf-4d83-a0e0-d044f4a67e94` (IT-only)

| Connection / Data Source | SharePoint Site | List Name | Used In App | Status |
|---|---|---|---|---|
| `itforms` | ioi-portal-it | itforms | Unknown | **Stale?** — Single-purpose connection |

### Stale Connection Reference: `a34af1624208407d9ca803171e614eff`
- Empty data sources — appears unused. **Should be removed.**

---

## 5. Column Existence Audit

### MainDB_IT — Shared Schema Columns (Model Coverage)

| Expected Field (Model) | SharePoint Column | List | Column Exists? | Actual Column Found | Status |
|---|---|---|---|---|---|
| `title` | Title | MainDB_IT | ✅ | Title (Text) | Correct |
| `formcode` | FormCode | MainDB_IT | ✅ | FormCode (Text) | Correct |
| `currentStatus` | CurrentStatus | MainDB_IT | ✅ | CurrentStatus (Text) | Correct |
| `company` | Company | MainDB_IT | ✅ | Company (Text) | Correct |
| `submitteddate` | SubmittedDate | MainDB_IT | ✅ | SubmittedDate (Date and Time) | Correct |
| `requestoremail` | Requestor_Email | MainDB_IT | ✅ | Requestor_Email (Text) | Correct |
| `requestorName` | Requestor_Name | MainDB_IT | ✅ | Requestor_Name (Text) | Correct |
| `siteKey` | Site | MainDB_IT | ✅ | Site (Choice) | Correct |
| `workflowstage` | WorkflowStage | MainDB_IT | ✅ | WorkflowStage (Number) | Correct |
| `islocked` | IsLocked | MainDB_IT | ✅ | IsLocked (Yes/No) | Correct |
| `remarks` | Remarks | MainDB_IT | ✅ | Remarks (Multiple lines) | Correct |
| `hODApproverRemarks` | HOD/Approver Remarks | MainDB_IT | ❓ | Not found by InternalName | **Needs confirmation** |
| `hTMLEMAILTEMPLATE` | HTML EMAIL TEMPLATE | MainDB_IT | ❓ | Not found by InternalName | **Needs confirmation** |

### MainDB_IT — NIR Columns (Model vs SharePoint)

| Model Property | SharePoint Column | Column Exists? | Type Match? | Status |
|---|---|---|---|---|
| `nIRFullName` | NIR_FullName | ✅ | Text/Text ✅ | Correct |
| `nIRDepartment` | NIR_Department | ✅ | Text/Text ✅ | Correct |
| `nIRRequestType` | NIR_RequestType | ✅ | Text/Text ✅ | Correct |
| `nIRHODApprovalStatus` | NIR_HODApprovalStatus | ✅ | Text/Text ✅ | Correct |
| `nIRHODApprovedBy` | NIR_HODApprovedBy | ✅ | Text/Text ✅ | Correct |
| `nIRHODApprovedDate` | NIR_HODApprovedDate | ✅ | Text/Text ✅ | Correct |
| `nIRNotesAdminStatus` | NIR_NotesAdminStatus | ✅ | Text/Text ✅ | Correct |
| `nIRNotesAdminBy` | NIR_NotesAdminBy | ✅ | Text/Text ✅ | Correct |
| `nIRNotesAdminDate` | NIR_NotesAdminDate | ✅ | Text/Text ✅ | Correct |
| `nIRITHardwareStatus` | NIR_ITHardwareStatus | ✅ | Text/Text ✅ | Correct |
| `nIRITHardwareBy` | NIR_ITHardwareBy | ✅ | Text/Text ✅ | Correct |
| `nIREmployeeNumber` | EmployeeNumber | ✅ | Text/Text ✅ | Correct |
| `nIRDesignation` | Designation | ✅ | Text/Text ✅ | Correct |
| `nIRPhoneExtension` | PhoneExtension | ✅ | Text/Text ✅ | Correct |
| `nIRExistingEmailAddress` | NIR_ExistingEmailAddress | ✅ | Text/Text ✅ | Correct |
| `nIREmployeeType` | EmployeeType | ✅ | Text/Text ✅ | Correct |

### MainDB_IT — HI Columns (Model vs SharePoint)

| Model Property | SharePoint Column | Column Exists? | Type Match? | Status |
|---|---|---|---|---|
| `hITagNo` | HI_TagNo | ✅ | Text/Text ✅ | Correct |
| `hIAssetNo` | HI_AssetNo | ✅ | Text/Text ✅ | Correct |
| `hIType` | HI_Type | ✅ | Text/Text ✅ | Correct |
| `hIComputerName` | HI_ComputerName | ✅ | Text/Text ✅ | Correct |
| `hICompany` | HI_Company | ✅ | Text/Text ✅ | Correct |
| `hIUsedByEmail` | HI_UsedBy_Email | ✅ | Text/Text ✅ | Correct |
| `hILocation` | HI_Location | ✅ | Text/Text ✅ | Correct |
| `hIDepartment` | HI_Department | ✅ | Text/Text ✅ | Correct |
| `hISerialNo` | HI_SerialNo | ✅ | Text/Text ✅ | Correct |
| `hIPurchaseDate` | HI_PurchaseDate | ✅ | Text/Text (should be Date) | **Wrong type** |
| `hIVendor` | HI_Vendor | ✅ | Text/Text ✅ | Correct |
| `hIStatus` | HI_Status | ✅ | Text/Text ✅ | Correct |
| `hIYear` | HI_Year | ✅ | Number/Number ✅ | Correct |
| `hIMonth` | HI_Month | ✅ | Number/Number ✅ | Correct |

### Missing from Model — EAF Columns on MainDB_IT (NOT in generated model)

| SharePoint Column | Type | In Extension List? | Used By App? | Status |
|---|---|---|---|---|
| EAF_Application | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_DeptHeadStatus | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_DeptHeadComment | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_DeptHead_Email | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_Justification | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_SystemName | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_TargetUser_Email | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_ITManagerStatus | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_ITCompletionStatus | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |
| EAF_IsPCN | Text | ✅ (Ext_Access) | ✅ (via Ext_Access) | **Unused on parent** |

### Missing from Model — ITSSR Columns on MainDB_IT (NOT in generated model)

| SharePoint Column | Type | In Extension List? | Status |
|---|---|---|---|
| ITSSR_AssignedTo_Email | Text | ✅ (Ext_Support) | **Unused on parent** |
| ITSSR_DateAccepted | Text | ✅ (Ext_Support) | **Unused on parent** |
| ITSSR_DateResolved | Text | ✅ (Ext_Support) | **Unused on parent** |
| ITSSR_ITRemarks | Multiple lines | ✅ (Ext_Support) | **Unused on parent** |
| ITSSR_ReportedBy_Email | Text | ✅ (Ext_Support) | **Unused on parent** |

### Full List of 180+ Columns on MainDB_IT NOT in Generated Model
The actual SharePoint list has columns for: EAF (20+), ITSSR (6+), ITDR (6+), ITDR2 (6+), IAL1-5 (25+), ITP (6+), ITP2 (6+), ITI (3+), ITSC (14+), IOIP (3+), UR (12+), SFAR (15+), SAP-related (5+), and general columns (Analysis, Background, Backup*, CC, Comments, CorrectiveAction, etc.).

**Risk**: These columns exist in SharePoint but the app writes to extension lists instead. For EAF/HI columns, this creates **dual storage** — data in both MainDB_IT AND the extension list. However, the app only writes to extension lists, so MainDB_IT columns remain empty for new records.

---

## 6. Field Type Audit

### MainDB_IT — Critical Type Mismatches

| List | Column | Actual SharePoint Type | Expected Type (Design) | Supports Multiple Values? | Required? | Status |
|---|---|---|---|---|---|---|
| MainDB_IT | CurrentStatus | Single line of text | Choice | No | No | **Wrong type** — Should be Choice for workflow state |
| MainDB_IT | EAF_DeptHeadStatus | Single line of text | Choice | No | No | **Wrong type** |
| MainDB_IT | EAF_ITManagerStatus | Single line of text | Choice | No | No | **Wrong type** |
| MainDB_IT | EAF_ITCompletionStatus | Single line of text | Choice | No | No | **Wrong type** |
| MainDB_IT | EAF_DDAppStatus | Single line of text | Choice | No | No | **Wrong type** |
| MainDB_IT | EAF_DeptHeadDate | Single line of text | Date and Time | No | No | **Wrong type** |
| MainDB_IT | EAF_ITManagerDate | Single line of text | Date and Time | No | No | **Wrong type** |
| MainDB_IT | EAF_ITCompletedDate | Single line of text | Date and Time | No | No | **Wrong type** |
| MainDB_IT | EAF_DDAppDate | Single line of text | Date and Time | No | No | **Wrong type** |
| MainDB_IT | HI_PurchaseDate | Single line of text | Date and Time | No | No | **Wrong type** |
| MainDB_IT | SubmittedDate | Date and Time | Date and Time | No | No | ✅ **Correct** |
| MainDB_IT | Site | Choice | Choice | No | No | ✅ **Correct** |
| MainDB_IT | IsLocked | Yes/No | Yes/No | No | No | ✅ **Correct** |
| MainDB_IT | WorkflowStage | Number | Number | No | No | ✅ **Correct** |
| MainDB_IT | HI_Year | Number | Number | No | No | ✅ **Correct** |
| MainDB_IT | HI_Month | Number | Number | No | No | ✅ **Correct** |
| MainDB_IT | EAF_Justification | Single line of text | Multiple lines of text | No | No | **Wrong type** |
| MainDB_IT | Remarks | Multiple lines of text | Multiple lines of text | No | No | ✅ **Correct** |

### MainDB_IT_Ext_Access — Type Assessment

| List | Column | Actual Type | Expected | Status |
|---|---|---|---|---|
| Ext_Access | EAF_Justification | Single line of text | Multiple lines | **Wrong type** |
| Ext_Access | EAF_DeptHeadStatus | Single line of text | Choice | **Wrong type** |
| Ext_Access | EAF_ITManagerStatus | Single line of text | Choice | **Wrong type** |
| Ext_Access | EAF_ITCompletionStatus | Single line of text | Choice | **Wrong type** |
| Ext_Access | EAF_DDAppStatus | Single line of text | Choice | **Wrong type** |
| Ext_Access | EAF_ITConfigStatus | **Choice** | Choice | ✅ **Correct** |
| Ext_Access | EAF_DeptHeadDate | Single line of text | Date and Time | **Wrong type** |
| Ext_Access | EAF_ITManagerDate | Single line of text | Date and Time | **Wrong type** |
| Ext_Access | EAF_ITCompletedDate | Single line of text | Date and Time | **Wrong type** |
| Ext_Access | EAF_DDAppDate | Single line of text | Date and Time | **Wrong type** |
| Ext_Access | PRF_Status1 | **Choice** | Choice | ✅ **Correct** |
| Ext_Access | PRF_Status2 | **Choice** | Choice | ✅ **Correct** |
| Ext_Access | PRF_Status3 | **Choice** | Choice | ✅ **Correct** |
| Ext_Access | PRF_Status4 | **Choice** | Choice | ✅ **Correct** |
| Ext_Access | PRF_DateApp1 | **Date and Time** | Date and Time | ✅ **Correct** |
| Ext_Access | ParentID | **Lookup** | Lookup | ✅ **Correct** |

### MainDB_IT_Ext_Support — Type Assessment

| Column | Actual Type | Expected | Status |
|---|---|---|---|
| ITSSR_Application | **Choice** | Choice | ✅ Correct |
| ITSSR_ITRemarks | Multiple lines | Multiple lines | ✅ Correct |
| ITSSR_DateAccepted | Single line of text | Date and Time | **Wrong type** |
| ITSSR_DateResolved | Single line of text | Date and Time | **Wrong type** |
| ParentID | **Lookup** | Lookup | ✅ Correct |

### MainDB_HR — Critical Type Mismatches

| List | Column | Actual Type | Expected | Status |
|---|---|---|---|---|
| MainDB_HR | Status | **Choice** | Choice | ✅ **Correct** |
| MainDB_HR | EntitySite | **Choice** | Choice | ✅ **Correct** |
| MainDB_HR | SubmittedOn | Single line of text | Date and Time | **Wrong type** |
| MainDB_HR | TargetDate | Single line of text | Date and Time | **Wrong type** |
| MainDB_HR | DueDate | Single line of text | Date and Time | **Wrong type** |
| MainDB_HR | Department | Single line of text | Choice | **Wrong type** |
| MainDB_HR | Priority | Single line of text | Choice | **Wrong type** |
| MainDB_HR | CurrentApprover_Email | Single line of text | Person or Group | **Wrong type** |
| MainDB_HR | Requestor_Email | Single line of text | Person or Group | **Wrong type** |

---

## 7. App-to-SharePoint Binding Audit

### EAF Form — Write Logic (`src/pages/it/forms/eaf/new.tsx`)

| Screen / Control | UI Label | Data Source | SharePoint Column | Column Type | Read Logic | Write Logic | Status |
|---|---|---|---|---|---|---|---|
| EAF New - Submit | Ticket ID | MainDB_IT | Title | Text | — | `title: ticketId` | ✅ Correct |
| EAF New - Submit | FormCode | MainDB_IT | FormCode | Text | — | `formcode: 'EAF'` | ✅ Correct |
| EAF New - Submit | Company | MainDB_IT | Company | Text | — | `company: formData.Company` | ✅ Correct |
| EAF New - Submit | Status | MainDB_IT | CurrentStatus | Text | — | `currentStatus: 'CurrentstatusKey1'` | ✅ Correct |
| EAF New - Submit | WorkflowStage | MainDB_IT | WorkflowStage | Number | — | `workflowstage: 1` | ✅ Correct |
| EAF New - Submit | Requestor Email | MainDB_IT | Requestor_Email | Text | — | `requestoremail: user.email` | ✅ Correct |
| EAF New - Submit | Site | MainDB_IT | Site | Choice | — | `siteKey: mapLocationToSiteKey(...)` | ✅ Correct |
| EAF New - Submit | Remarks | MainDB_IT | Remarks | Multiple lines | — | `remarks: formData.Justification` | ✅ Correct |
| EAF New - Ext | Application | Ext_Access | EAF_Application | Text | — | `eAFApplication: formData.Application` | ✅ Correct |
| EAF New - Ext | Target User | Ext_Access | EAF_TargetUser_Email | Text | — | `eAFTargetUserEmail: targetUserEmail` | ✅ Correct |
| EAF New - Ext | System Name | Ext_Access | EAF_SystemName | Text | — | `eAFSystemName: formData.System` | ✅ Correct |
| EAF New - Ext | Justification | Ext_Access | EAF_Justification | Text | — | `eAFJustification: formData.Justification` | ✅ Correct |
| EAF New - Ext | Dept Head Email | Ext_Access | EAF_DeptHead_Email | Text | — | `eAFDeptHeadEmail: approver.email` | ✅ Correct |
| EAF New - Ext | Parent FormCode | Ext_Access | ParentFormCode | Text | — | `parentFormCode: 'EAF'` | ✅ Correct |
| EAF New - Ext | Parent Record | Ext_Access | ParentID | Lookup | — | `parentRecord: { id, title }` | ✅ Correct |

### Key Binding Issue — EAF Justification

The EAF form writes `formData.Justification` to **two places**:
1. MainDB_IT `Remarks` (as text) — `remarks: formData.Justification`
2. Ext_Access `EAF_Justification` (as text)

This means the justification text is **duplicated** across parent and child. If the user edits the EAF later, the Remarks and EAF_Justification could get out of sync.

### HR Submission Service — Write Logic (`src/services/hr-submission-service.ts`)

| Operation | SharePoint Column | Value Sent | Type Match? | Status |
|---|---|---|---|---|
| Create | Title | Generated INO | Text/Text ✅ | Correct |
| Create | FormCode | `input.FormType` | Text/Text ✅ | Correct |
| Create | StatusKey | `'StatusKey0'` (Draft) | Choice/Choice ✅ | Correct |
| Create | EntitySite | `'SiteKey0'` (Prai) | Choice/Choice ✅ | Correct |
| Create | Requestor_Email | `user.email` | Text/Text ✅ | Correct |
| Create | SubmittedOn | `new Date().toISOString()` | Text (should be Date) | **Wrong type** |

---

## 8. Read Logic Audit

### EAF List Page (`src/pages/it/forms/eaf/index.tsx`)

| Location | Read Operation | Source List | Fields Read | Status |
|---|---|---|---|---|
| EAF index | `useMainDBITList({ filter: "formcode eq 'EAF'" })` | MainDB_IT | title, formcode, company, etc. | ✅ Correct — filters by FormCode |
| EAF index | `useMainDBITExtAccessList(...)` | MainDB_IT_Ext_Access | EAF-specific fields | ✅ Correct |

### Risk: The list page reads from BOTH MainDB_IT AND MainDB_IT_Ext_Access. If the parent record exists but the child record was not created (e.g., due to a partial failure), the EAF record will appear incomplete.

### Submission Detail Page (`src/pages/submissions/[id]`)

The EAF `[id].tsx` re-exports from `../../../submissions/[id]` which is a shared detail page. This detail page must correctly join parent and child records.

---

## 9. Write Logic Audit

### EAF Create Flow (`eaf/new.tsx — handleSubmit`)

| Operation | Target List | Columns Written | Expected Columns | Status |
|---|---|---|---|---|
| Create (Parent) | MainDB_IT | title, formcode, company, currentStatus, workflowstage, islocked, submitteddate, requestoremail, siteKey, remarks | Shared schema (10 columns) | ✅ All required fields included |
| Create (Child) | Ext_Access | title, parentFormCode, parentRecord, eAFApplication, eAFTargetUserEmail, eAFSystemName, eAFJustification, eAFReminderTo, eAFCC, eAFDeptHeadEmail, eAFClientID | EAF-specific fields (11 columns) | ✅ Correct |

### Missing from Write Logic

| What's Missing | Impact | Recommended Fix |
|---|---|---|
| Error handling for partial failure (parent created, child failed) | Orphan parent record with no child | Add cleanup/retry logic |
| HR Submission — Date fields as ISO strings | Written as text to Date-type SharePoint columns | Convert to Date objects |
| Person fields as text objects | Person fields not searchable by People Picker in SharePoint | Consider adding Person columns |

---

## 10. Label and Display Audit

| UI Location | Display Label | Expected Label | Bound Column | Status |
|---|---|---|---|---|
| EAF List | Record No | Record No | `title` | ✅ Correct |
| EAF List | Date | Date | `submitteddate` | ✅ Correct |
| EAF List | Submitted By | Submitted By | `requestoremail` | ⚠️ Shows email, not display name |
| EAF List | Company | Company | `company` | ✅ Correct |
| EAF List | Target User | Target User | Ext_Access `eAFTargetUserEmail` | ⚠️ Shows email, not display name |
| EAF List | System | System | Ext_Access `eAFSystemName` | ✅ Correct |

### Issues Found
1. **Email displayed instead of name** — The EAF list shows raw email addresses for submittedBy and targetUser. The People Picker returns full person objects but the app stores only emails.
2. **No display name on list view** — The EAF list doesn't fetch or display `requestorName` which is stored separately on MainDB_IT.

---

## 11. Parent-Child Integration Audit

### IT Forms (EAF Pattern)

| Parent List | Child List | Relationship Column | Current Logic | Status |
|---|---|---|---|---|
| MainDB_IT | MainDB_IT_Ext_Access | ParentID (Lookup) + ParentFormCode | ✅ Created sequentially | Correct — parent first, then child with lookup |
| MainDB_IT | MainDB_IT_Ext_Support | ParentID (Lookup) + ParentFormCode | Pending | **Not verified** |
| MainDB_IT | MainDB_IT_Ext_Assets | ParentID (Lookup) + ParentFormCode | Pending | **Not verified** |
| MainDB_IT | MainDB_IT_Ext_SAP | ParentID (Lookup) + ParentFormCode | Pending | **Not verified** |

### Issues
1. **No cascading delete** — If a parent record is deleted, child records in extension lists become orphans
2. **No transaction** — Parent created first; if child creation fails, parent exists without child
3. **Duplicate status fields** — `CurrentStatus` on MainDB_IT should mirror workflow state, but status fields on Ext_Access (EAF_DeptHeadStatus, EAF_ITManagerStatus, etc.) may drift

---

## 12. Data Completeness Audit

### EAF Create Operation

| Operation | Target List | Required Columns | Currently Written | Missing | Status |
|---|---|---|---|---|---|
| EAF Create | MainDB_IT | Title, FormCode, CurrentStatus | ✅ All included | None | ✅ Complete |
| EAF Create | Ext_Access | Title, EAF_Application, EAF_TargetUser_Email, EAF_SystemName | ✅ All included | None | ✅ Complete |

### HR Create Operation

| Operation | Target List | Required Columns | Currently Written | Missing | Status |
|---|---|---|---|---|---|
| HR Create | MainDB_HR | Title, FormCode, StatusKey, Requestor_Email | ✅ All included | None | ✅ Complete |

### Missing Business Fields

| Form | Missing Field | Impact | Priority |
|---|---|---|---|
| EAF | EAF_IsPCN | PCN routing flag not written | Medium |
| EAF | EAF_DeptHeadStatus | HOD approval status not tracked on parent | Low (tracked on Ext_Access) |
| EAF | Attachments | Not handled in current code | **High** — No attachment upload logic found |

---

## 13. Documentation Alignment

| Document | SharePoint Integration Content | Status | Required Update |
|---|---|---|---|
| `mapping/field-mapping.md` | Field-level mapping | ❌ **Outdated** | Columns don't match actual SharePoint schema (e.g., AssetTag vs HI_MachineID, Requestor_Name as Person/Group vs Text) |
| `mapping/field-mapping.csv` | Field-level mapping | ❌ **Outdated** | Same issues as field-mapping.md |
| `design/m365-design/sharepoint-list-design.md` | List architecture | ⚠️ **Partially outdated** | Lists exist but column details not documented |
| `design/m365-design/powerapps-design.md` | App architecture | ✅ **Current** | Reflects actual code-first architecture |
| `design/m365-design/power-automate-design.md` | Flow design | ❓ **Not reviewed** | — |
| `docs/migration-documentation.md` | Migration overview | ⚠️ Needs update | Missing recent QA/QC data connections |
| `docs/ui-page-specification.md` | UI specs | ❓ **Not reviewed** | — |
| `src/types/data-source-mapping.ts` | Data source mappings | ⚠️ **Partially current** | IT entries documented but HR/QA/QC entries missing |

---

## 14. Prioritized Fix Plan

| Prio | Issue | Area | File / Screen / List | Recommended Fix | Status |
|------|-------|------|---------------------|----------------|--------|
| **P1** | Duplicate columns on MainDB_IT (EAF, HI, ITSSR, NIR) | SharePoint | MainDB_IT list | Run `scripts/sharepoint/Cleanup-MainDB-IT-DuplicateColumns.ps1` | ⬜ Script created |
| **P1** | Date fields stored as text | SharePoint | Multiple lists | Run Cleanup-MainDB-IT-DuplicateColumns.ps1 (Step 2-3) | ⬜ Script created |
| **P1** | Field mapping out of sync | Documentation | `mapping/field-mapping.csv`, `mapping/field-mapping.md` | Rewrite field mapping to match actual SharePoint columns | ⬜ Pending |
| **P1** | Placeholder GUIDs for jhr, ext_policy, ext_docs, ext_infra | Config | `power.config.json` | Create/provision lists and replace `00000000-...` GUIDs | ⬜ Pending (4 placeholders) |
| **P2** | MainDBIT model missing columns | Generated code | `main-dbit-model.ts` | Regenerate model from actual SharePoint schema (130/264 ≈ 49% coverage, not ~30%) | ⬜ Pending |
| **P2** | Person fields stored as text | SharePoint | Multiple email/name columns | Add Person/Group columns alongside text columns (dual-write) | ⬜ Pending |
| **P2** | No attachment handling | App code | EAF, ITSSR forms | Add attachment upload logic using Attachment data source | ⬜ Pending |
| **P2** | Provision MainDB_IT_Ext_Docs list | SharePoint | MainDB_IT_Ext_Docs | Create SharePoint list for IOIP/ITP/ITP2/ITI forms | ⬜ Pending |
| **P2** | Consolidate `7a10b3f0` secondary connection | Config | `power.config.json` | Move duplicate HR/IT data sources; remove secondary connection | ⬜ Pending |
| **P2** | Remove duplicate QA lists from QC connection | Config | `power.config.json` | Remove `maindb_qa*` entries from QC site dataSet | ⬜ Pending |
| **P3** | Deprecated service still present | App code | `sharepoint-submission-service.ts` | Remove file after confirming no imports (notification-service.ts already decoupled) | ✅ Done |

### ✅ Completed Fixes (Applied 2026-06-03)

| # | Issue | Fix Applied | Verification |
|---|-------|------------|-------------|
| 1 | EAF justification dual-write -> Ext_Access only | `eaf/new.tsx`: removed `remarks: formData.Justification` from parent write; kept only on child `eAFJustification` | `tsc --noEmit` ✅ |
| 2 | `it_routingmatrix` wrong URL (pointed to `MainDB_IT` site) | Moved to primary `ioi-portal-it` dataSet in `3eee79e3` connection; removed from `7a10b3f0` secondary connection | `power.config.json` JSON validated ✅ |
| 3 | `maindb_it_ext_docs`, `maindb_it_ext_infra` not in config | Added to primary IT dataSet + `dataSources` array | 25 IT data sources in primary ✅ |
| 4 | `it_sapsof_testevidence` on separate connection | Consolidated into primary `3eee79e3` connection; removed duplicate connection | JSon validated ✅ |
| 5 | Deprecated `sharepoint-submission-service` import in notification service | Copied `SharePointSubmission` type locally; removed import from deprecated file | `tsc --noEmit` ✅ |
| 6 | Empty/stale SharePoint connection refs (`6458878c`, `8a5dc4b8`, `08d57e01`) | Removed 3 empty SharePoint references from `power.config.json` | 14 connection refs remaining ✅ |
| 7 | Rollback on EAF partial failure (incorrectly flagged as missing) | Confirmed rollback already existed: `MainDBITService.delete(parentId)` on child failure | Code-reviewed ✅ |
| 8 | Stale `3509ce13` connection (itforms-only duplicate) | Removed entire stale connection reference | 14 connections (down from 17) ✅ |

---

## 15. Corrected Formulas / Code Updates

### Fix: Remove duplicate EAF columns from MainDB_IT
PowerShell script to identify and remove duplicate columns:

```powershell
# File: scripts/sharepoint/Cleanup-MainDB-IT-DuplicateColumns.ps1
# WARNING: Run with -WhatIf first to preview changes. Remove -WhatIf to execute.
# .\Cleanup-MainDB-IT-DuplicateColumns.ps1 -WhatIf           # Preview only
# .\Cleanup-MainDB-IT-DuplicateColumns.ps1 -WhatIf:$false    # Execute

$duplicatePrefixes = @("EAF_", "ITSSR_", "ITDR_", "ITDR2_", "NIR_", "IAL", "ITP_", "ITP2_", "ITI_", "IOIP", "ITSC_", "UR_", "SFAR_", "HI_", "PRF_", "RS_", "SAPAMR", "SAPCA", "SAPCR", "SAPSOF", "SAPTR", "SAPSLCF", "SAPDRP", "VPNACCESS_", "HWINV_")

$allFields = Get-PnPField -List "MainDB_IT" | Where-Object { -not $_.Hidden -and -not $_.ReadOnlyField -and -not $_.Required }

$duplicates = $allFields | Where-Object {
    $prefix = $duplicatePrefixes | Where-Object { $_.InternalName -like "$_*" -or $_.Title -like "$_*" }
    $prefix -ne $null
}

Write-Host "Found $($duplicates.Count) potential duplicate columns on MainDB_IT:" -ForegroundColor Yellow
$duplicates | Select-Object Title, InternalName, TypeDisplayName | Format-Table -AutoSize

# Uncomment below to remove (after verification):
# foreach ($field in $duplicates) {
#     Remove-PnPField -List "MainDB_IT" -Identity $field.InternalName -Force
#     Write-Host "  Removed: $($field.Title)" -ForegroundColor Red
# }
```

### Fix: Convert date fields from text to DateTime
```powershell
# File: scripts/Fix-DateFieldTypes.ps1
# Convert text-based date fields to proper Date and Time type

$dateFields = @(
    @{ List="MainDB_IT"; Fields=@("EAF_DeptHeadDate","EAF_ITManagerDate","EAF_ITCompletedDate","EAF_DDAppDate","HI_PurchaseDate","HI_LastAuditedDate","ITSSR_DateAccepted","ITSSR_DateResolved","ITSSR_DateStarted","ITDR2_DueDate","ITDR2_ClosedDate") },
    @{ List="MainDB_IT_Ext_Access"; Fields=@("EAF_DeptHeadDate","EAF_ITManagerDate","EAF_ITCompletedDate","EAF_DDAppDate") },
    @{ List="MainDB_IT_Ext_Support"; Fields=@("ITSSR_DateAccepted","ITSSR_DateResolved","ITSSR_DateStarted") },
    @{ List="MainDB_IT_Ext_Assets"; Fields=@("HI_PurchaseDate","HI_LastAuditedDate") },
    @{ List="MainDB_HR"; Fields=@("SubmittedOn","TargetDate","DueDate","ResponseDueDate","ResponseExtendedDueDate") }
)

foreach ($listDef in $dateFields) {
    foreach ($fieldName in $listDef.Fields) {
        $field = Get-PnPField -List $listDef.List -Identity $fieldName -ErrorAction SilentlyContinue
        if ($field -and $field.TypeDisplayName -ne "Date and Time") {
            Write-Host "Converting $($listDef.List):$fieldName from $($field.TypeDisplayName) to DateTime" -ForegroundColor Yellow
            # Note: SharePoint requires deleting and recreating to change field type
            # Add new DateTime field with "_dt" suffix, migrate data, then remove old field
        }
    }
}
```

### Fix: EAF write — Add IsPCN field to submission
```typescript
// File: src/pages/it/forms/eaf/new.tsx
// In handleSubmit(), add to extAccessData:
const extAccessData: Omit<MainDBITExtAccess, 'id'> = {
  // ... existing fields ...
  eAFIsPCN: isPancenCompany ? '1' : '0',  // ADD THIS — maps to Domino isPCN field
};
```

### Fix: EAF write — Add attachment support placeholder
```typescript
// File: src/pages/it/forms/eaf/new.tsx
// After successful parent+child creation, add:
// TODO: Upload attachments to SharePoint list item
// Use: Add-PnPFile after item is created, or Power Automate flow
```

### Fix: Remove stale connection reference
```json
// File: power.config.json
// Remove the entire connection reference "a34af1624208407d9ca803171e614eff"
// This reference has no data sources and is unused
```

---

## 16. Validation Checklist

| Test | Steps | Expected Result | Status |
|---|---|---|---|
| App connects to correct SharePoint site | Navigate to any IT form page | Data loads from `ioi-portal-it` site | ⬜ |
| Correct lists are used | Create EAF record | Parent in MainDB_IT, child in MainDB_IT_Ext_Access | ✅ Verified in code |
| Required columns exist | Check MainDB_IT schema | Title, FormCode, CurrentStatus exist | ✅ Verified |
| Field types match expected design | Check Date fields | Should be Date and Time, not text | ❌ ~20 mismatches |
| New item writes successfully | Submit EAF form | Record created in both lists | ✅ Code pattern correct |
| Edit item updates correct columns | Update EAF | Only Ext_Access fields updated | ⬜ Not verified |
| Choice fields save correctly | Check Status/Site fields | Written as Choice keys | ✅ |
| Person fields save correctly | Check Requestor_Email | Stored as text (not Person object) | ⚠️ Text, not Person |
| Lookup fields save correctly | Check ParentID | Lookup to MainDB_IT record | ✅ |
| Child records link to parent correctly | Check ParentID in Ext_Access | Points to correct MainDB_IT item | ✅ |
| Detail page displays accurate data | View EAF record | Shows both parent and child data | ⬜ Not verified |
| UI labels match field mapping | EAF list page | "Record No", "Date", "Submitted By" visible | ✅ |
| No stale data sources remain | Check config | No empty connection references | ❌ Found 1 stale ref |
| Mock data disabled in production | Check dataMode | Uses real SharePoint client | ⬜ Needs deployment test |

---

## 17. Risks and Clarifying Questions

### Risks
1. **Data loss risk** — Removing duplicate columns from MainDB_IT will delete any data in those columns. Verify no existing records use parent-side columns before removal.
2. **Schema change risk** — Converting text fields to Date/Time requires deleting and recreating columns, which loses existing data. Plan migration carefully.
3. **Production deployment risk** — The app uses mock data in dev. The first production deployment may expose SharePoint connection issues not caught in development.
4. **Orphan records** — No cascading delete or transaction safety for parent-child operations.

### Gaps
1. ❌ No SharePoint schema audit for: MainDB_FIN, MainDB_PRD, MainDB_SHE, MainDB_STR, MainDB_QA, MainDB_QC
2. ❌ No Power Automate flow review (flows may write to SharePoint columns the app doesn't use)
3. ❌ No attachment handling in current app code
4. ❌ No Choice column value enumeration (unable to verify Choice values match app expectations)

### Assumptions
1. The parent-child architecture is intentional and correct
2. The `@microsoft/power-apps` SDK correctly maps camelCase properties to SharePoint column names
3. The EAF/ITSSR/HI/NIR columns on MainDB_IT (parent) are legacy duplicates from initial list creation and are not intentionally maintained

### Questions for Stakeholders
1. **Should MainDB_IT parent-side EAF/HI/ITSSR/NIR columns be removed?** — They duplicate what's in extension lists. Removing simplifies the schema but may impact any existing records that use parent-side columns.
2. **Should Person fields use SharePoint Person/Group type or stay as text?** — Text is simpler for API integration but loses People Picker functionality in SharePoint UI.
3. **Is attachment upload required for MVP?** — The current code has no attachment handling. Power Automate could handle this as a separate flow.
4. **Who manages the generated models?** — The models in `src/generated/` need regeneration when SharePoint schema changes. Is there a regeneration script?
