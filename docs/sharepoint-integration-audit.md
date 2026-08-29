# SharePoint Integration Audit Report — IOI Enterprise Platform

> **⚠️ DEPRECATED — Content moved to `analysis/sharepoint-integration-audit.md`**
> This file is a duplicate. The authoritative version lives in `analysis/sharepoint-integration-audit.md`.
> Do not update this file — update `analysis/sharepoint-integration-audit.md` instead.
> This file is kept for reference only.

**Date:** 2026-05-31
**Auditor:** AI Code Review (Domino → M365 Migration Agent)
**App:** IOI Acidchem Enterprise Platform - v2
**App ID:** `26fddd33-46a8-43ae-a1f2-e90fa3b003bf`
**Repository:** `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Overall Status** | **PASS WITH ISSUES** |
| Total Screens/Pages Audited | ~60+ (IT, HR, STR, Finance, Production, SHE, Admin) |
| SharePoint Lists Identified | 53 connected + 2 pending |
| Read Operations Audited | ~40+ (generated hooks, services, components) |
| Write Operations Audited | ~30+ (form submissions, approvals, status updates) |
| **Issues Found** | **26** (3 Critical, 8 High, 9 Medium, 6 Low) |
| **Highest Risk Issue** | EAFDetails component reads NIR/PRF fields instead of ExtAccess fields — **wrong data displayed** |

### Summary Assessment

The application has a **solid architecture** with:
- Code-generated SharePoint service layer (`app-gen-sdk`) correctly handling field normalization/denormalization
- Proper parent-child list relationships (MainDB_IT → MainDB_IT_Ext_*)
- Choice field key-to-label mapping for proper write format
- Site-aware service routing (Prai vs Johor)
- Retry logic for transient Power Platform errors
- Well-structured approval/workflow audit trail via separate lists

**However, there are critical issues** that must be resolved before production deployment.

---

## 2. SharePoint Connection Inventory

| No | SharePoint Site | List Name | Used In Screen/Component | Usage Type | Status | Notes |
|----|-----------------|-----------|--------------------------|------------|--------|-------|
| 1 | ioi-portal-it | MainDB_IT | All IT forms, Submissions, Approvals | Read/Write | ✅ Connected | Parent list for IT (28 forms) |
| 2 | ioi-portal-it | MainDB_IT_JHR | IT forms (Johor site) | Read/Write | ❌ Pending | Placeholder GUID in power.config.json |
| 3 | ioi-portal-it | MainDB_IT_Ext_Access | EAF form, RS form | Read/Write | ✅ Connected | Child table for Access Management |
| 4 | ioi-portal-it | MainDB_IT_Ext_Support | ITSSR, ITDR2 forms | Read/Write | ✅ Connected | Child table for Support tickets |
| 5 | ioi-portal-it | MainDB_IT_Ext_SAP | SAP forms | Read/Write | ✅ Connected | Child table for SAP |
| 6 | ioi-portal-it | MainDB_IT_Ext_Assets | HWRR, ITSC forms | Read/Write | ✅ Connected | Child table for Assets |
| 7 | ioi-portal-it | MainDB_IT_Ext_Docs | ITINFO, IOIP forms | Read/Write | ✅ Connected | Child table for Documents |
| 8 | ioi-portal-it | MainDB_IT_Ext_Policy | IOIP forms | Pending | ❌ Pending | Placeholder GUID |
| 9 | ioi-portal-it | ApprovalRecords | Submission detail page | Read/Write | ✅ Connected | IT approval records |
| 10 | ioi-portal-it | WorkflowAuditLog | Submission detail page | Read/Write | ✅ Connected | Audit trail |
| 11 | ioi-portal-it | ConfigCompanies | Company dropdowns | Read | ✅ Connected | Configuration |
| 12 | ioi-portal-it | ConfigDepartments | Department dropdowns | Read | ✅ Connected | Configuration |
| 13 | ioi-portal-it | ConfigApproverMatrix | Approval routing | Read | ✅ Connected | Configuration |
| 14 | ioi-portal-it | ConfigEmployeeDirectory | Employee lookup | Read | ✅ Connected | Configuration |
| 15 | ioi-portal-it | ConfigNotesAdminRouting | Notes routing | Read | ✅ Connected | Configuration |
| 16 | ioi-portal-it | ITForms | Form definitions | Read | ✅ Connected | Configuration |
| 17 | ioi-portal-it | UserRolesIT | IT role assignments | Read | ✅ Connected | Authorization |
| 18 | ioi-portal-it | Policies | Policy documents | Read | ✅ Connected | Documents |
| 19 | ioi-portal-it | IT_M1_RS_Banks | RS form banks | Read | ✅ Connected | Lookup |
| 20 | ioi-portal-it | IT_M1_RS_SAP_Client | RS form SAP clients | Read | ✅ Connected | Lookup |
| 21 | ioi-portal-it | IT_M1_RS_SystemsList | RS form systems | Read | ✅ Connected | Lookup |
| 22 | ioi-portal-it | IT_M1_SFAR_Servers | SFAR form servers | Read | ✅ Connected | Lookup |
| 23 | ioi-portal-hr | MainDB_HR | HR forms (leave, health, recruitment) | Read/Write | ✅ Connected | Parent list for HR (~24 forms) |
| 24 | ioi-portal-hr | MainDB_HR_Ext_* | HR form extensions (~12 tables) | Read/Write | ✅ Connected | Child tables for HR |
| 25 | ioi-portal-hr | ApprovalHistory_HR | HR approval history | Read/Write | ✅ Connected | Approval records |
| 26 | ioi-portal-hr | AuditLog_HR | HR audit trail | Read/Write | ✅ Connected | Audit |
| 27 | ioi-portal-hr | AttachmentIndex_HR | HR attachments | Read/Write | ✅ Connected | Attachments |
| 28 | ioi-portal-hr | ConfigGlobalUserRoleAssignments | User role assignments | Read/Write | ✅ Connected | Configuration |
| 29 | ioi-portal-hr | HR_RoutingMatrix | HR routing | Read | ✅ Connected | Configuration |
| 30 | ioi-portal-hr | HR_AppraisalRecords | HR appraisals | Read/Write | ✅ Connected | Appraisals |
| 31 | ioi-portal-hr | HR_HealthRegister | HR health | Read/Write | ✅ Connected | Health |
| 32 | ioi-portal-hr | HR_InterviewPipeline | HR interviews | Read/Write | ✅ Connected | Interviews |
| 33 | ioi-portal-str | MainDB_STR | STR forms | Read/Write | ✅ Connected | Store requests |
| 34 | ioi-portal-str | Assignments_STR | STR assignments | Read/Write | ✅ Connected | Child table |
| 35 | ioi-portal-str | AttachmentIndex_STR | STR attachments | Read/Write | ✅ Connected | Attachments |
| 36 | ioi-portal-str | LineItems_STR | STR line items | Read/Write | ✅ Connected | Child table |
| 37 | ioi-portal-str | ApprovalHistory_STR | STR approvals | Read/Write | ✅ Connected | Approval |
| 38 | (unknown) | MainDB_FIN | Finance forms | Read/Write | ✅ Connected | Finance list |
| 39 | (unknown) | MainDB_PRD | Production forms | Read/Write | ✅ Connected | Production list |
| 40 | (unknown) | MainDB_SHE | SHE forms | Read/Write | ✅ Connected | SHE list |
| 41 | (unknown) | MainDB_QA | QA forms | Read/Write | ✅ Connected | QA list |
| 42 | (unknown) | IssueAndBugTracker | Bug tracking | Read/Write | ✅ Connected | Bugs |
| 43 | (unknown) | Office365Users | People picker, user profile | Read | ✅ Connected | Microsoft 365 connector |
| 44 | (unknown) | OutlookEmail | Email notifications | Write | ✅ Connected | Email connector |

### Lists Pending Setup

| List | Status | Impact |
|------|--------|--------|
| MainDB_IT_JHR | ❌ Placeholder GUID | Johor site data isolation broken |
| MainDB_IT_Ext_Policy | ❌ Placeholder GUID | IOIP policy documents cannot be stored |

---

## 3. Screen-by-Screen Data Audit

### 3.1 IT Forms

| Screen | Control / Function | SharePoint List | Operation | Field Used | Field Exists? | Type Match? | Label Accurate? | Status | Issue |
|--------|--------------------|-----------------|-----------|------------|---------------|-------------|-----------------|--------|-------|
| `/it/forms/eaf/new` | handleSubmit | MainDB_IT | Write (create) | `title`, `formcode`, `company`, `currentStatus`, `workflowstage`, `islocked`, `submitteddate`, `requestoremail`, `siteKey`, `remarks` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct parent record creation |
| `/it/forms/eaf/new` | handleSubmit | MainDB_IT_Ext_Access | Write (create) | `parentFormCode`, `parentRecord`, `eAFApplication`, `eAFTargetUserEmail`, `eAFSystemName`, `eAFJustification`, `eAFReminderTo`, `eAFCC`, `eAFDeptHeadEmail`, `eAFClientID`, `eAFUserGroup`, `eAFHigherApproverEmail` | ✅ Yes | ⚠️ Partial | ✅ Yes | ⚠️ ISSUE | eAFClientID, eAFUserGroup, eAFHigherApproverEmail may not exist in SP Ext Access list |
| `/it/forms/eaf/new` | PeoplePicker | Office365Users | Read (search) | `displayName`, `mail`, `userPrincipalName` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correctly uses M365 Users connector |
| `/it/forms/eaf/new` | useSharePointCompanies | ConfigCompanies | Read | Company options | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Static fallback provided |
| `/it/forms/itssr/new` | handleSubmit | MainDB_IT | Write (create) | `title`, `formcode`, `currentStatus`, `environmenttagKey`, `siteKey`, `requestoremail`, `submitteddate`, `workflowstage`, `remarks` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Uses generated service correctly |
| `/it/forms/itssr/new` | handleSubmit | MainDB_IT_Ext_Support | Write (create) | ITSSR-specific ext fields | ✅ Yes | ⚠️ Partial | ✅ Yes | ⚠️ ISSUE | Remarks JSON parsing for section data is fragile |
| `/it/forms/new-request` | handleSubmit | MainDB_IT | Write (create) | Base fields + schema columns | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Dynamic schema-based form |
| `/it/submissions/:id` | useMainDBITList | MainDB_IT | Read | `filter: id eq ${id}` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct OData filter |
| `/it/submissions/:id` | useWorkflowAuditLogList | WorkflowAuditLog | Read | `filter: requestItemID eq '${id}'` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct filter |
| `/it/submissions/:id` | useApprovalRecordsList | ApprovalRecords | Read | `filter: formid eq '${id}'` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct filter |
| `/it/submissions/:id` | Structured Fields | MainDB_IT | Read | Mixed NIR/HI/PRF/RS fields shown for ALL forms | ⚠️ Partial | ⚠️ Partial | ❌ NO | ❌ ISSUE | Fields shown unconditionally, not filtered by formCode |
| `/it/forms/eaf/index` | useMainDBITList | MainDB_IT | Read | `filter: formcode eq 'EAF'` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct filter |
| `/it/forms/eaf/index` | useMainDBITExtAccessList | MainDB_IT_Ext_Access | Read | `filter: parentFormCode eq 'EAF'` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct parent-child join |

### 3.2 DynamicSubmissionDetails Component — CRITICAL

| Screen | Detail Component | List | Operation | Field Used | Field Exists? | Type Match? | Label Accurate? | Status | Issue |
|--------|-----------------|------|-----------|------------|---------------|-------------|-----------------|--------|-------|
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.nIRFullName` → "Full Name" | ✅ Exists | ✅ String | ❌ **NO — this is a NIR field** | ❌ CRITICAL | EAFDetails displays NIR fields instead of ExtAccess fields |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.nIRDepartment` → "Company" and "Department" | ✅ Exists | ✅ String | ❌ **NO — this is a NIR field** | ❌ CRITICAL | Same field mapped to two labels with wrong data |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.subject` → "System Name" | ✅ Exists | ✅ String | ❌ **NO — subject is generic, EAF system is in ExtAccess** | ❌ HIGH | Should read from `eAFSystemName` in ext access table |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.nIRRequestType` → "Request Type" | ✅ Exists | ✅ String | ❌ **NO — this is a NIR field** | ❌ CRITICAL | EAF request type is `eAFApplication` |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.pRFITApprovedEmail` → "IT Manager" | ✅ Exists | ✅ String | ❌ **NO — this is a PRF field** | ❌ HIGH | Should read EAF IT Manager from ext access |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.pRFITApprovedDate` → "IT Manager Date" | ✅ Exists | ✅ String | ❌ **NO — this is a PRF field** | ❌ HIGH | Wrong field source |
| Any EAF submission | EAFDetails | MainDB_IT | Read | `s.pRFDeptManagerEmail` → "Dept. Head" | ✅ Exists | ✅ String | ❌ **NO — this is a PRF field** | ❌ HIGH | Should read `eAFDeptHeadEmail` from ext access |
| Any NIR submission | NIRDetails | MainDB_IT | Read | `s.nIRFullName`, `s.nIREmployeeNumber` etc. | ✅ Exists | ✅ String | ✅ Yes | ✅ PASS | Correct NIR fields |
| Any RS submission | RSDetails | MainDB_IT | Read | `s.rSUserName`, `s.rSDesignation` etc. | ✅ Exists | ✅ String | ✅ Yes | ✅ PASS | Correct RS fields |
| Any SFAR submission | SFARDetails | MainDB_IT | Read | `s.sFARCompany`, `s.sFARDepartment` etc. | ✅ Exists | ✅ String | ✅ Yes | ✅ PASS | Correct SFAR fields |
| Any UR submission | URDetails | MainDB_IT | Read | `s.uRUserFullName`, `s.uREmployeeNumber` etc. | ✅ Exists | ✅ String | ✅ Yes | ✅ PASS | Correct UR fields |
| Any ITSSR submission | ITSSRDetails | MainDB_IT + ExtSupport | Read | Remarks JSON parsing + ext support fields | ⚠️ Partial | ⚠️ Partial | ✅ Yes | ⚠️ MEDIUM | Fragile JSON-in-remarks pattern |

### 3.3 HR Forms

| Screen | Control / Function | SharePoint List | Operation | Status | Issue |
|--------|--------------------|-----------------|-----------|--------|-------|
| `/hr/leave` | HRSubmissionService | MainDB_HR | Write | ❌ MOCK | Uses in-memory mock storage, NOT SharePoint |
| `/hr/health` | HRSubmissionService | MainDB_HR | Write | ❌ MOCK | Uses in-memory mock storage, NOT SharePoint |
| `/hr/recruitment` | HRSubmissionService | MainDB_HR | Write | ❌ MOCK | Uses in-memory mock storage, NOT SharePoint |
| HR Approval actions | HRSubmissionService | MainDB_HR | Write | ❌ MOCK | Uses in-memory mock storage, NOT SharePoint |
| HR list views | MainDBHRService | MainDB_HR | Read | ✅ Connected | Generated service correctly queries SharePoint |

**Note:** The `HRSubmissionService` in `services/hr-submission-service.ts` is entirely mock/in-memory. However, `services/main-dbhr-service.ts` wraps the generated `MainDBHRService` which IS connected to real SharePoint. It appears the HR forms may be using the mock service instead of the real one. This needs verification per screen.

### 3.4 STR Forms

| Screen | Control / Function | SharePoint List | Operation | Status | Issue |
|--------|--------------------|-----------------|-----------|--------|-------|
| `/str/new` | STR submission | MainDB_STR | Read/Write | ✅ Connected | Uses generated service |
| `/str/edit/:id` | STR update | MainDB_STR | Read/Write | ✅ Connected | Uses generated service |
| `/str/mrf/new` | MRF submission | MainDB_STR | Read/Write | ✅ Connected | Uses generated service |

---

## 4. Field Mapping Audit

### 4.1 MainDB_IT — Core Fields

| App Field / Control | SharePoint Display Name | SharePoint Internal Name | Expected Type | Actual Type | Read Correct? | Write Correct? | Issue |
|---------------------|-------------------------|--------------------------|---------------|-------------|---------------|----------------|-------|
| `id` | ID | ID | number | number | ✅ | N/A | ✅ OK |
| `title` | Title | Title | text | text | ✅ | ✅ | ✅ OK |
| `formcode` | FormCode | FormCode | text | text | ✅ | ✅ | ✅ OK |
| `currentStatus` | CurrentStatus | CurrentStatus | choice (text) | text | ✅ | ✅ | ✅ OK — plain text used |
| `environmenttagKey` | EnvironmentTag | EnvironmentTag | choice (key) | choice key | ✅ | ✅ | ✅ OK — `choiceValue()` used |
| `siteKey` | Site | Site | choice (key) | choice key | ✅ | ✅ | ✅ OK — `choiceValue()` used |
| `requestoremail` | Requestor_Email | Requestor_Email | text | text | ✅ | ✅ | ✅ OK |
| `requestorName` | Requestor_Name | Requestor_Name | text | text | ✅ | ✅ | ✅ OK |
| `submitteddate` | SubmittedDate | SubmittedDate | datetime (string) | string (ISO) | ✅ | ✅ | ✅ OK |
| `workflowstage` | WorkflowStage | WorkflowStage | number | number | ✅ | ✅ | ✅ OK |
| `islocked` | IsLocked | IsLocked | boolean | boolean | ✅ | ✅ | ✅ OK — `bool()` used |
| `remarks` | Remarks | Remarks | multiline text | text | ✅ | ✅ | ✅ OK |
| `company` | Company | Company | text | text | ✅ | ✅ | ✅ OK |
| `subject` | Subject | Subject | text | text | ✅ | ✅ | ✅ OK |

### 4.2 MainDB_IT — Form-Specific Prefix Fields

| Prefix | App Field Pattern | SharePoint Column Pattern | Type | Read Correct? | Write Correct? | Issue |
|--------|------------------|--------------------------|------|---------------|----------------|-------|
| NIR | `nIR*` | `NIR_*` | string | ✅ | ✅ | ✅ OK — 15 fields mapped in STRUCTURED_FIELD_MAP |
| HI | `hI*` | `HI_*` | mixed | ✅ | ✅ | ✅ OK — 17 fields mapped |
| PRF | `pRF*` | `PRF_*` | string | ✅ | ✅ | ✅ OK — 18 fields mapped |
| RS | `rS*` | `RS_*` | string | ✅ | ✅ | ✅ OK — 18 fields mapped |
| SFAR | `sFAR*` | `SFAR_*` | string | ✅ | ✅ | ✅ OK — 14 fields mapped |
| UR | `uR*` | `UR_*` | string | ✅ | ✅ | ✅ OK — 13 fields mapped |
| SAPAMR | `sAPAMR*` | `SAPAMR_*` | string | ✅ | ✅ | ✅ OK |
| ITSSR | `iTSSR*` | `ITSSR_*` | string | ✅ | ✅ | ✅ OK (in ExtSupport model) |

### 4.3 MainDB_HR — Key Fields

| App Field | SharePoint Display Name | SharePoint Internal Name | Expected Type | Actual Type | Read Correct? | Write Correct? | Issue |
|-----------|-------------------------|--------------------------|---------------|-------------|---------------|----------------|-------|
| `statusKey` | StatusKey | StatusKey | choice (key) | choice key | ✅ | ✅ | ✅ OK |
| `siteKey` | SiteKey | SiteKey | choice (key) | choice key | ✅ | ✅ | ✅ OK |
| `formcode` | FormCode | FormCode | text | text | ✅ | ✅ | ✅ OK |
| `employeeid` | Employee ID | EmployeeID | text | text | ⚠️ Unknown | ⚠️ Unknown | Need to verify column exists |
| `employeename` | Employee Name | EmployeeName | text | text | ⚠️ Unknown | ⚠️ Unknown | Need to verify column exists |
| `requestedby` | Requested By | RequestedBy | text | text | ✅ | ✅ | ✅ OK |

### 4.4 Choice Key Mapping — Potential Issues

| List | Choice Field | Key Pattern | Labels Mapped | Risk |
|------|-------------|-------------|---------------|------|
| MainDB_IT | CurrentStatus | CurrentstatusKey0-59 | 60 values | ⚠️ If SP choice options change order, key indices break |
| MainDB_IT | Site | SiteKey0-4 | Johor/Penang/Prai/KL/Both | ⚠️ SiteKey mapping must match SP exactly |
| MainDB_IT | EnvironmentTag | EnvironmenttagKey0-2 | Production/UAT/Development | ✅ Low risk (stable) |
| MainDB_HR | StatusKey | StatusKey0-6 | Draft/Submitted/Under Review/Approved/Rejected/Closed/Archived | ⚠️ Medium risk if SP choice order changes |
| MainDB_HR | SiteKey | SiteKey0-1 | Prai/Johor | ✅ Low risk |

---

## 5. Write Operation Audit

### 5.1 IT Form Submissions

| Button / Function | Screen | Target List | Patch/Submit Logic | Required Columns Included? | Type Correct? | Parent-Child Correct? | Error Handling? | Status | Recommendation |
|-------------------|--------|-------------|--------------------|----------------------------|---------------|-----------------------|----------------|--------|----------------|
| EAF Submit | `/it/forms/eaf/new` | MainDB_IT | `createMainDBIT.mutateAsync()` via retryWithBackoff | ✅ Includes: title, formcode, company, currentStatus, workflowstage, islocked, submitteddate, requestoremail, siteKey, remarks | ✅ Types correct | ✅ Parent created first | ✅ Try/catch + retryWithBackoff + user notification | ✅ PASS | Add formCode-specific ext access field validation |
| EAF Submit (child) | `/it/forms/eaf/new` | MainDB_IT_Ext_Access | `MainDBITExtAccessService.create()` via retryWithBackoff | ✅ Includes: parentFormCode, parentRecord, EAF fields | ⚠️ eAFClientID, eAFUserGroup, eAFHigherApproverEmail unchecked | ✅ Child after parent | ⚠️ Error caught but no rollback of parent | ⚠️ MEDIUM | No rollback if child creation fails |
| ITSSR Submit | `/it/forms/itssr/new` | MainDB_IT + Ext_Support | Generated service create | ✅ Base fields + ITSSR fields | ✅ Types correct | ✅ Child after parent | ⚠️ Basic try/catch | ⚠️ MEDIUM | No retryWithBackoff on ITSSR forms |
| New Request (dynamic) | `/it/forms/:formCode/new` | MainDB_IT | `useCreateMainDBIT` | ✅ Dynamic schema-based | ✅ Types correct | ✅ Depends on form | ✅ retryWithBackoff | ✅ PASS | Verify each dynamic form's column mapping |
| Submission approval | `/it/submissions/:id` | MainDB_IT | `useUpdateMainDBIT` | ⚠️ Varies | ✅ Types correct | N/A | ✅ Basic try/catch | ⚠️ MEDIUM | Status transitions not validated |
| Submission withdraw | `/it/submissions/:id` | MainDB_IT | `useUpdateMainDBIT` | ⚠️ Varies | ✅ Types correct | N/A | ⚠️ Minimal | ⚠️ MEDIUM | Withdraw logic needs validation |

### 5.2 Approval / Workflow Writes

| Button / Function | Screen | Target List | Operation | Status | Issue |
|-------------------|--------|-------------|-----------|--------|-------|
| Approve | `/it/submissions/:id` | MainDB_IT | `update()` status change | ✅ PASS | Correct |
| Reject | `/it/submissions/:id` | MainDB_IT | `update()` status change | ✅ PASS | Correct |
| Return for revision | `/it/submissions/:id` | MainDB_IT | `update()` status change | ✅ PASS | Correct |
| Approval record | `/it/submissions/:id` | ApprovalRecords | `create()` audit record | ✅ PASS | Correct |
| Workflow audit log | `/it/submissions/:id` | WorkflowAuditLog | `create()` audit entry | ✅ PASS | Correct |

### 5.3 STR Form Submissions

| Button / Function | Screen | Target List | Operation | Status | Issue |
|-------------------|--------|-------------|-----------|--------|-------|
| STR Save Draft/Submit | `/str/new` | MainDB_STR | Generated service create/update | ✅ PASS | Uses `MainDBSTRService` |
| MRF Submit | `/str/mrf/new` | MainDB_STR | Generated service create/update | ✅ PASS | Uses `MainDBSTRService` |
| STR Edit | `/str/edit/:id` | MainDB_STR | Generated service update | ✅ PASS | Uses `MainDBSTRService` |

### 5.4 HR Form Submissions — CRITICAL ISSUE

| Button / Function | Screen | Target List | Operation | Status | Issue |
|-------------------|--------|-------------|-----------|--------|-------|
| HR Leave Submit | `/hr/leave` | MainDB_HR | **Mock** — uses `HRSubmissionService` | ❌ **MOCK** | `HRSubmissionService` is entirely in-memory! |
| HR Health Submit | `/hr/health` | MainDB_HR | **Mock** — uses `HRSubmissionService` | ❌ **MOCK** | `HRSubmissionService` is entirely in-memory! |
| HR Recruitment Submit | `/hr/recruitment` | MainDB_HR | **Mock** — uses `HRSubmissionService` | ❌ **MOCK** | `HRSubmissionService` is entirely in-memory! |

---

## 6. Read Operation Audit

| Screen | Gallery/Form/Control | Source List | Filter/LookUp Logic | Delegable? | Correct Columns? | Correct Labels? | Status | Recommendation |
|--------|----------------------|-------------|---------------------|------------|------------------|----------------|--------|----------------|
| `/it/forms/eaf/index` | DatabaseTable (gallery) | MainDB_IT | `formcode eq 'EAF'` OData filter | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Add pagination for >2000 records |
| `/it/forms/eaf/index` | ExtAccess join | MainDB_IT_Ext_Access | `parentFormCode eq 'EAF'` OData filter | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Good client-side join |
| `/it/submissions/:id` | Detail page | MainDB_IT | `id eq ${id}` OData filter | ✅ Yes | ⚠️ Mixed | ❌ Wrong for EAF | ❌ CRITICAL | See Section 3.2 |
| `/it/submissions/:id` | Workflow history | WorkflowAuditLog | `requestItemID eq '${id}'` OData filter | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct filter |
| `/it/submissions/:id` | Approval records | ApprovalRecords | `formid eq '${id}'` OData filter | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Correct filter |
| `/it/submissions/:id` | Structured fields sidebar | MainDB_IT | All fields shown unconditionally | ✅ Yes | ⚠️ Mixed | ❌ Wrong for non-NIR/HI/PRF/RS forms | ❌ HIGH | Shows NIR/HI/PRF/RS fields for ALL forms regardless of formcode |
| HR list views | MainDBHRService | MainDB_HR | OData filters | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Good delegation |
| STR list views | MainDBSTRService | MainDB_STR | OData filters | ✅ Yes | ✅ Yes | ✅ Yes | ✅ PASS | Good delegation |

---

## 7. Parent-Child Relationship Audit

| Parent List | Child List | Relationship Field | Create Logic Correct? | Read Logic Correct? | Update Logic Correct? | Risk | Recommendation |
|-------------|------------|--------------------|-----------------------|---------------------|-----------------------|------|----------------|
| MainDB_IT | MainDB_IT_Ext_Access | `parentRecord` (lookup) + `parentFormCode` | ✅ Parent created first, child references parent ID | ✅ Join via `parentRecord.id` map | ⚠️ Not implemented in EAF | MEDIUM | Add cascade update/delete logic |
| MainDB_IT | MainDB_IT_Ext_Support | `parentRecord` (lookup) + `parentFormCode` | ✅ Parent created first | ✅ Join via parent ID | ⚠️ Not verified | MEDIUM | Add cascade update/delete |
| MainDB_IT | MainDB_IT_Ext_SAP | `parentRecord` (lookup) + `parentFormCode` | ✅ Parent created first | ✅ Join via parent ID | ⚠️ Not verified | MEDIUM | Add cascade update/delete |
| MainDB_IT | MainDB_IT_Ext_Assets | `parentRecord` (lookup) + `parentFormCode` | ✅ Parent created first | ✅ Join via parent ID | ⚠️ Not verified | MEDIUM | Add cascade update/delete |
| MainDB_IT | MainDB_IT_Ext_Docs | `parentRecord` (lookup) + `parentFormCode` | ✅ Parent created first | ✅ Join via parent ID | ⚠️ Not verified | MEDIUM | Add cascade update/delete |
| MainDB_HR | MainDB_HR_Ext_* (~12) | `parentRecord` (lookup) | ⚠️ Mock only (HRSubmissionService) | ⚠️ Mock only | ⚠️ Mock only | CRITICAL | Entire HR mock service must be replaced |
| MainDB_STR | LineItems_STR | `parentID` | ✅ Child after parent | ✅ Join via parent ID | ✅ Update logic verified | LOW | ✅ OK |
| MainDB_STR | Assignments_STR | `parentID` | ⚠️ Not verified | ⚠️ Not verified | ⚠️ Not verified | LOW | ✅ OK |

### Key Findings

1. **EAF creates parent then child correctly** — proper sequence and reference
2. **`MainDBITService.deleteWithCascade()` exists** — good cascade delete function
3. **No cascade update** — if parent record fields change, child records may not be updated
4. **No rollback on child failure** — if child creation fails after parent success, parent record exists orphaned

---

## 8. Issue Register

| ID | Severity | Screen / File | Issue | Evidence | Impact | Recommended Fix | Priority |
|----|----------|---------------|-------|----------|--------|-----------------|----------|
| **CRIT-01** | **Critical** | `components/submission-details/index.tsx` — `EAFDetails` | EAF detail view reads NIR and PRF fields instead of EAF ExtAccess fields | Lines 82-104: `s.nIRFullName`, `s.nIRDepartment`, `s.subject`, `s.nIRRequestType`, `s.pRFITApprovedEmail`, `s.pRFITApprovedDate`, `s.pRFDeptManagerEmail` used to display EAF data | Wrong data displayed to users reviewing EAF submissions. Company, Department, System Name, Request Type, Approver info all incorrect. | Rewrite `EAFDetails` to read from `MainDBITExtAccess` via `useMainDBITExtAccessList` with `parentRecord eq ${s.id}` filter | P1 |
| **CRIT-02** | **Critical** | `services/hr-submission-service.ts` | Entire HR submission service is mock/in-memory | Full file uses `Map<string, HRSubmission>` with `let mockIdCounter = 5000`. All create/update/approve/reject operations work on in-memory data only | ALL HR form submissions (leave, health, recruitment, approvals) are not persisted to SharePoint. Data loss risk. | Replace `HRSubmissionService` mock implementation with generated `MainDBHRService` calls, mirroring the pattern in `main-dbhr-service.ts` | P1 |
| **CRIT-03** | **Critical** | `power.config.json` | MainDB_IT_JHR and MainDB_IT_Ext_Policy use placeholder GUIDs | Lines: `"maindb_it_jhr": { "tableName": "00000000-0000-0000-0000-000000000000" }`, `"maindb_it_ext_policy": { "tableName": "00000000-0000-0000-0000-000000000000" }` | Johor site data isolation broken. Policy documents cannot be saved. Johor forms silently fall back to MainDB_IT (Prai). | Create SharePoint lists, add as data sources in Power Apps Studio, update GUIDs in power.config.json | P1 |
| **HIGH-01** | **High** | `components/submission-details/index.tsx` — `EAFDetails` | EAF "System Name" reads `s.subject` instead of `eAFSystemName` from ExtAccess | Line 91: `value={s.subject}` | Wrong system name displayed for EAF. `subject` is a generic column, not EAF-specific. | Query ExtAccess table and use `eAFSystemName` field | P2 |
| **HIGH-02** | **High** | `components/submission-details/index.tsx` — `EAFDetails` | EAF "IT Manager" and "Dept. Head" read PRF fields | Lines 97-100: `s.pRFITApprovedEmail`, `s.pRFITApprovedDate`, `s.pRFDeptManagerEmail` | Wrong approver information displayed. PRF fields are for Program Request Form, not EAF. | Read `eAFDeptHeadEmail`, `eAFITManagerApprovedBy`, `eAFITManagerDate` from ExtAccess | P2 |
| **HIGH-03** | **High** | `pages/submissions/[id].tsx` | Structured fields sidebar shows NIR/HI/PRF/RS fields unconditionally for all forms | Lines ~280-400: NIR, HI, PRF, RS fields pushed to `structuredFields` array without `formcode` check | EAF submissions show NIR/HI/PRF/RS fields that are empty/irrelevant. UI clutter + confusion. | Wrap each form-specific field block with `if (submission.formcode === 'NIR')` etc. | P2 |
| **HIGH-04** | **High** | `data-source-mapping.ts` | ALL IT forms marked as `sourceType: 'in-memory'` / `connectionStatus: 'mock'` | Array items show `sourceType: 'in-memory'` and `connectionStatus: 'mock'` for every IT form (EAF, NIR, RS, ITSSR, PRF, etc.) | Metadata shows mock even though generated services ARE connected to real SharePoint. Misleading for developers. | Update `connectionStatus` to `'connected'` for forms using generated services. Add audit proof. | P2 |
| **HIGH-05** | **High** | `services/sharepoint-submission-service.ts` | Deprecated mock service still referenced in `services/index.ts` exports | `export * from './sharepoint-submission-service'` in index.ts. Service itself has `@deprecated` JSDoc | New developers may accidentally use this mock service instead of generated services. | Remove deprecated re-export or add linting rule to prevent usage | P2 |
| **HIGH-06** | **High** | `MainDBITFormTypeKeyToLabel` in `main-dbit-model.ts` | FormTypeKey labels all say "Pending Configuration" | Lines: `'FormTypeKey0': 'Pending Configuration'`, `'FormTypeKey1': 'Pending Configuration'`, `'FormTypeKey2': 'Pending Configuration'` | Choice field labels not configured in SharePoint. If form uses FormTypeKey, display will be broken. | Configure SharePoint choice options for FormType field and update the key-to-label map | P2 |
| **HIGH-07** | **High** | `data-source-mapping.ts` | Data source mappings reference `SharePointSubmissionService` which is deprecated/mock | All IT form entries in DATA_SOURCE_MAPPINGS have `service.name: 'SharePointSubmissionService'` | Mapping points to wrong service. Should point to `MainDBITService` (generated) instead. | Update all IT form service references to point to generated services | P2 |
| **HIGH-08** | **High** | `MainDBITExtAccessService` | ExtAccess service uses wrong DATA_SOURCE_NAME | Service uses `const DATA_SOURCE_NAME = 'MainDBITExtAccess'` but power.config.json uses `"maindb_it_ext_access"` | Potential connection failure at runtime if the SDK expects exact config key match | Verify correct case with Power Apps SDK documentation | P2 |
| **MED-01** | Medium | `pages/it/forms/eaf/new.tsx` | No rollback if child record (ExtAccess) creation fails after parent (MainDB_IT) succeeds | Lines ~310-330: `createdDraft` created, then ExtAccess created in separate try-catch. If ExtAccess fails, parent exists orphaned. | Orphaned parent record without child data. User sees "submitted" but details are missing. | Implement two-phase commit or delete parent on child failure | P3 |
| **MED-02** | Medium | `pages/it/forms/eaf/new.tsx` | eAFClientID, eAFUserGroup, eAFHigherApproverEmail fields written to ExtAccess but not verified in SP schema | Lines ~322-326: These fields are mapped from Domino fields but may not have corresponding SP columns | If SP columns don't exist, write will fail silently or throw error. | Verify these columns exist in MainDB_IT_Ext_Access SharePoint list | P3 |
| **MED-03** | Medium | `MainDBITService` — `normalize()` | Normalize function maps choice keys using position-based IDs | `choiceKey()` function extracts integer from key string like `'CurrentstatusKey30' -> 30` | If SharePoint choice options are reordered, the numeric indices shift and ALL existing records will show wrong status labels. | Use choice display value instead of key index, or add a stable mapping layer | P3 |
| **MED-04** | Medium | ITSSR form | ITSSR stores form data in `remarks` JSON (section1 JSON in remarks field) | `ITSSRDetails` parses `[ITSSR_SECTION1_JSON]...[\/ITSSR_SECTION1_JSON]` from remarks | Fragile parsing. If remarks field is edited elsewhere, JSON breaks. Data not queryable. | Store ITSSR section data in ExtSupport columns directly instead of JSON in remarks | P3 |
| **MED-05** | Medium | `MainDBITService` — `denormalize()` | Choice fields written using `choiceValue()` with label text, not key | Line: `out.Site = choiceValue(MainDBITSiteKeyToLabel[record.siteKey])` | If SharePoint expects choice key but gets label text (or vice versa), write may fail. Verified: label text is correct for SP writes. | ⚠️ MONITOR: Ensure this works with actual SP write behavior | P3 |
| **MED-06** | Medium | HR Department | `HRSubmissionService.mockApprovalRecords` shares same mock store | `mockApprovalRecords: Map<number, CRApprovalRecord[]>` in hr-submission-service.ts | Approval history not persisted across sessions | Replace with real SharePoint `ApprovalHistoryHRService` calls | P3 |
| **MED-07** | Medium | `MainDBITService` — `translateOptions()` | Field name translation in OData filters may miss nested/compound field references | Regex-based replacement may silently fail for complex filter expressions | Filter may not be applied correctly for some field names | Add unit tests for filter translation with all known field patterns | P3 |
| **MED-08** | Medium | `MainDBITExtAccessService` — `translateOptions()` | Only 4 fields mapped for OData filter translation | Only `parentformcode`, `parentsite`, `title`, `id` mapped. EAF-specific fields like `eAFApplication` not mapped. | Cannot OData-filter on EAF-specific fields | Add all EAF/RS/SFAR fields to the EXT_ACCESS_FIELD_MAP | P3 |
| **MED-09** | Medium | `MainDBITService` | No `environmenttagKey` in `denormalize()` | Choice value written but key field not handled | Environment tag may not be written correctly | Verify EnvironmentTag write path in integration testing | P3 |
| **LOW-01** | Low | `config/module-workflows.ts` | IT module workflows reference form codes not in the generated model | Stage workflows use form codes that may not match generated model exactly | Potential mismatch in stage resolution | Audit all formCode strings against generated model constants | P4 |
| **LOW-02** | Low | `docs/` | SharePoint list schemas not documented for all lists | Many lists referenced in power.config.json but no schema documentation | Hard to verify field mappings without schema reference | Generate schema docs for all SharePoint lists | P4 |
| **LOW-03** | Low | Dynamic form schema | `FieldSchema.spColumn` and `spTable` defined but not verified against actual SP | Schema definition references columns that may not exist | Form submission may fail for unverified columns | Audit all dynamic form column references against actual SP schemas | P4 |
| **LOW-04** | Low | `MainDBITService` | `hIPurchasePrice` typed as `number` but store/read as string fallback | `num()` used for read but STRUCTURED_FIELD_MAP has `valueType: 'number'` | Potential type mismatch if SP returns string instead of number | Verify SP column type for PurchasePrice | P4 |
| **LOW-05** | Low | `siteKeyToSiteCode` | Defaults to Prai for unknown site keys | `default: return 'MY-PR'` in siteKeyToSiteCode | Johor records might be misrouted to Prai if mapping is wrong | Add logging when unknown site keys are encountered | P4 |
| **LOW-06** | Low | `generateTicketId()` | Client-side ticket ID generation uses module-level counter | `let ticketCounter = Date.now() % 100000`. JSDoc explicitly says "Replace with Power Automate flow" | Ticket IDs may collide across sessions. Not production-ready. | Implement Power Automate auto-numbering as documented | P4 |

---

## 9. Required Fix Plan

### Phase 1: Critical Data Integrity Fixes (Before Any Production Deployment)

| Priority | Issue ID | Fix | Estimated Effort |
|----------|----------|-----|-----------------|
| P1 | CRIT-01 | Rewrite `EAFDetails` in `components/submission-details/index.tsx` to read from `MainDBITExtAccess` instead of MainDB_IT NIR/PRF fields | 4 hours |
| P1 | CRIT-02 | Replace `HRSubmissionService` mock with real `MainDBHRService` calls for all HR forms | 8 hours |
| P1 | CRIT-03 | Create MainDB_IT_JHR and MainDB_IT_Ext_Policy SharePoint lists, add as data sources, update GUIDs | 2 hours |

### Phase 2: Field Type and Mapping Fixes

| Priority | Issue ID | Fix | Estimated Effort |
|----------|----------|-----|-----------------|
| P2 | HIGH-01 | Fix EAF "System Name" to read `eAFSystemName` from ExtAccess | 1 hour |
| P2 | HIGH-02 | Fix EAF "IT Manager" and "Dept. Head" to read from ExtAccess fields | 1 hour |
| P2 | HIGH-03 | Add `formcode` conditional checks in structured fields sidebar | 2 hours |
| P2 | HIGH-06 | Configure FormType choice options in SharePoint | 1 hour |
| P2 | HIGH-08 | Verify ExtAccess service DATA_SOURCE_NAME casing | 0.5 hours |

### Phase 3: Parent-Child and Workflow Fixes

| Priority | Issue ID | Fix | Estimated Effort |
|----------|----------|-----|-----------------|
| P3 | MED-01 | Implement rollback or parent delete on child creation failure in EAF form | 4 hours |
| P3 | MED-02 | Verify eAFClientID, eAFUserGroup, eAFHigherApproverEmail columns in SP | 1 hour |
| P3 | MED-06 | Replace HR mock approval records with real SP writes | 4 hours |
| P3 | MED-08 | Complete field mapping in ExtAccessService translateOptions | 1 hour |

### Phase 4: Delegation and Performance Fixes

| Priority | Issue ID | Fix | Estimated Effort |
|----------|----------|-----|-----------------|
| P2 | HIGH-04 | Update data-source-mapping.ts connection status to "connected" | 1 hour |
| P2 | HIGH-05 | Remove deprecated mock service from public exports | 1 hour |
| P2 | HIGH-07 | Update service references in data-source-mapping.ts | 1 hour |
| P3 | MED-03 | Create stable choice key mapping layer | 4 hours |
| LOW-06 | Implement Power Automate ticket ID generation | 4 hours |

### Phase 5: UI Label and Documentation Fixes

| Priority | Issue ID | Fix | Estimated Effort |
|----------|----------|-----|-----------------|
| P4 | LOW-01 | Audit form code strings against generated model | 2 hours |
| P4 | LOW-02 | Generate SharePoint list schema documentation | 4 hours |
| P4 | LOW-03 | Audit dynamic form column references | 3 hours |
| P4 | LOW-04 | Verify PurchasePrice column type | 0.5 hours |

---

## 10. Final Verdict

### Is the app safe to connect to production SharePoint?

**Partially.** The IT department forms (EAF, NIR, RS, SFAR, UR, ITSSR, PRF, HI, SAP forms) and STR department forms are using the correct generated services that connect to real SharePoint. However:

- ✅ **IT forms (MainDB_IT)** — Safe for production **IF Phase 1 fixes are applied first**
- ✅ **STR forms (MainDB_STR)** — Safe for production
- ❌ **HR forms (MainDB_HR)** — **NOT safe** — `HRSubmissionService` is entirely mock/in-memory
- ❌ **MainDB_IT_JHR** — **NOT available** — placeholder GUID, Johor data falls back to Prai

### Can users submit real data?

- **IT forms (Prai):** ✅ Yes, submissions go to real SharePoint lists
- **IT forms (Johor):** ⚠️ Yes but redirected to Prai list (data isolation broken)
- **HR forms:** ❌ No — data goes to in-memory storage only (lost on page refresh)
- **STR forms:** ✅ Yes, submissions go to real SharePoint lists

### Which screens/forms must not go live yet?

| Screen | Status | Reason |
|--------|--------|--------|
| All HR submission screens | ❌ BLOCKED | Mock service — data not persisted |
| EAF submission detail view | ❌ BLOCKED | Displays NIR/PRF data instead of EAF data |
| All Johor-specific screens | ⚠️ LIMITED | MainDB_IT_JHR not set up |

### What must be fixed before UAT?

1. **CRIT-01**: Fix EAFDetails to read ExtAccess fields
2. **CRIT-02**: Replace HR mock service with real SharePoint writes
3. **HIGH-01, HIGH-02, HIGH-03**: Fix submission detail data display
4. **HIGH-04, HIGH-07**: Update data source mapping metadata
5. **MED-01**: Implement rollback protection for parent-child writes

### What must be fixed before production?

1. **CRIT-03**: Set up MainDB_IT_JHR SharePoint list
2. **HIGH-06**: Configure FormType choice options
3. **MED-03**: Create stable choice key mapping
4. **LOW-06**: Implement Power Automate ticket ID generation
5. **MED-08**: Complete ExtAccess field mapping for OData filters

---

## Appendix A: Service Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Power Apps Code App                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Pages / Components                                      │
│    │                                                     │
│    ├─► Generated Hooks (useMainDBIT, useMainDBHR, etc.) │
│    │     └─► Generated Services (MainDBITService, etc.)  │
│    │           └─► app-gen-sdk (getClient())             │
│    │                 └─► SharePoint (via Power Apps SDK) │
│    │                                                     │
│    ├─► Custom Services (MainDBITSiteService)             │
│    │     └─► Generated Services                          │
│    │                                                     │
│    ├─► Workflow Services (workflow-orchestration)        │
│    │     └─► Generated Services + Email connector        │
│    │                                                     │
│    ├─► Office365Users Connector (People Picker)          │
│    │     └─► Microsoft 365 Users (via Power Apps SDK)    │
│    │                                                     │
│    └─► ⚠️ DEPRECATED: SharepointSubmissionService        │
│          └─► In-memory mock (DO NOT USE)                 │
│                                                          │
│  ⚠️ MOCK: HRSubmissionService                            │
│        └─► In-memory Map storage (NOT SharePoint)        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Appendix B: SharePoint Lists by Department

| Department | Parent List | Child Lists | Status |
|------------|-------------|-------------|--------|
| IT (Prai) | MainDB_IT | Ext_Access, Ext_Support, Ext_SAP, Ext_Assets, Ext_Docs | ✅ Connected |
| IT (Johor) | MainDB_IT_JHR | (same as above, pending) | ❌ Pending |
| HR | MainDB_HR | Ext_EEN, Ext_EPDU, Ext_EPHR, Ext_ESF, Ext_FTCR, Ext_FWWPE, Ext_FWWPD, Ext_GDSN, Ext_HealthInfo, Ext_HRAPR | ✅ Connected |
| STR | MainDB_STR | LineItems_STR, Assignments_STR, AttachmentIndex_STR | ✅ Connected |
| Finance | MainDB_FIN | — | ✅ Connected |
| Production | MainDB_PRD | — | ✅ Connected |
| SHE | MainDB_SHE | — | ✅ Connected |
| QA | MainDB_QA | ActionItems, SubActionItems | ✅ Connected |

## Appendix C: Recommended Corrected Code Patterns

### Pattern 1: Fix EAFDetails Component

```typescript
// CURRENT (WRONG):
function EAFDetails({ s }: { s: MainDBIT }) {
  return (
    <SectionCard title="Requestor Info" icon={User}>
      <FieldRow icon={User} label="Full Name" value={s.nIRFullName} /> {/* WRONG: NIR field */}
      <FieldRow icon={Building2} label="Company" value={s.nIRDepartment} /> {/* WRONG: NIR field */}
    </SectionCard>
  );
}

// CORRECTED:
function EAFDetails({ s, extAccess }: { s: MainDBIT; extAccess?: MainDBITExtAccess }) {
  return (
    <SectionCard title="Requestor Info" icon={User}>
      <FieldRow icon={User} label="Full Name" value={extAccess?.eAFTargetUserEmail || '-'} />
      <FieldRow icon={Building2} label="Company" value={s.company || '-'} />
    </SectionCard>
    <SectionCard title="Access Details" icon={Shield}>
      <FieldRow icon={Monitor} label="System Name" value={extAccess?.eAFSystemName || '-'} />
      <FieldRow icon={Tag} label="Application Type" value={extAccess?.eAFApplication || '-'} />
      <FieldRow icon={FileText} label="Justification" value={extAccess?.eAFJustification || '-'} />
    </SectionCard>
    <SectionCard title="Approval Status" icon={CheckCircle2}>
      <FieldRow icon={User} label="Dept. Head" value={extAccess?.eAFDeptHeadEmail || '-'} />
      <FieldRow icon={CheckCircle2} label="Dept. Head Status" value={extAccess?.eAFDeptHeadStatus || '-'} />
      <FieldRow icon={Calendar} label="Dept. Head Date" value={extAccess?.eAFDeptHeadDate || '-'} />
      <FieldRow icon={User} label="Div. Director" value={extAccess?.eAFDDAppApprovedBy || '-'} />
      <FieldRow icon={CheckCircle2} label="Div. Director Status" value={extAccess?.eAFDDAppStatus || '-'} />
      <FieldRow icon={Calendar} label="Div. Director Date" value={extAccess?.eAFDDAppDate || '-'} />
      <FieldRow icon={User} label="IT Manager" value={extAccess?.eAFITManagerApprovedBy || '-'} />
      <FieldRow icon={CheckCircle2} label="IT Manager Status" value={extAccess?.eAFITManagerStatus || '-'} />
      <FieldRow icon={Calendar} label="IT Manager Date" value={extAccess?.eAFITManagerDate || '-'} />
    </SectionCard>
  );
}
```

### Pattern 2: Fix Structured Fields in Submission Detail

```typescript
// CURRENT (WRONG - shows all fields unconditionally):
if (submission.nIRFullName) fields.push({ label: 'Full Name', value: submission.nIRFullName, icon: User });
if (submission.nIRDepartment) fields.push({ label: 'Department', value: submission.nIRDepartment, icon: Building2 });

// CORRECTED:
const formCode = submission.formcode;
if (formCode === 'NIR') {
  if (submission.nIRFullName) fields.push({ label: 'Full Name', value: submission.nIRFullName, icon: User });
  if (submission.nIRDepartment) fields.push({ label: 'Department', value: submission.nIRDepartment, icon: Building2 });
}
```

### Pattern 3: Replace HR Mock Service

```typescript
// CURRENT (MOCK):
static async create(input: CreateHRSubmissionInput): Promise<HRSubmission> {
  const id = mockIdCounter++;
  mockHRSubmissions.set(guid, submission);
  return submission;
}

// CORRECTED (using generated service):
import { MainDBHRService } from '@/generated/services/main-dbhr-service';

static async create(input: CreateHRSubmissionInput): Promise<MainDBHR> {
  await ensureInitialized();
  const record: Omit<MainDBHR, 'id'> = {
    title: generateHRFormTitle(input.FormType, ino),
    formcode: input.FormType,
    statusKey: 'StatusKey1' as MainDBHR['statusKey'], // Submitted
    siteKey: 'SiteKey0' as MainDBHRSiteKey,
    // ... map all required fields
  };
  return MainDBHRService.create(record);
}
```

---

*End of Audit Report*
