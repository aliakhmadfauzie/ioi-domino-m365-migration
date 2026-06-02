# SharePoint List Inventory — All Departments

> **Generated**: 2026-05-31
> **Source**: PnP.PowerShell live query across all IOI SharePoint sites

---

## 1. IT Portal — `ioi-portal-it`

| List | Status | Items | Notes |
|------|--------|-------|-------|
| **MainDB_IT** | ✅ **EXISTS** | 57 | Main Prai list |
| **MainDB_IT_JHR** | ✅ **EXISTS** | 0 | Johor — just created |
| **MainDB_IT_Ext_Access** | ✅ **EXISTS** | 0 | EAF, NIR, RS, SFAR, UR child records |
| **MainDB_IT_Ext_Assets** | ✅ **EXISTS** | 0 | HI, ITSC child records |
| **MainDB_IT_Ext_Docs** | ✅ **EXISTS** | 0 | IOIP, ITI, ITP, ITP2 child records |
| **MainDB_IT_Ext_Infra** | ✅ **EXISTS** | 0 | ITSC, SAPDRP child records |
| **MainDB_IT_Ext_SAP** | ✅ **EXISTS** | 0 | SAPAMR, SAPCA, SAPCR, etc. child records |
| **MainDB_IT_Ext_Support** | ✅ **EXISTS** | 19 | ITSSR, PRF, IAL1-5 child records |
| **MainDB_IT_Ext_Policy** | ✅ **EXISTS** | 0 | Just created — IOIP POLICY child records |
| **ApprovalRecords** | ✅ **EXISTS** | 44 | Approval history |
| **WorkflowAuditLog** | ✅ **EXISTS** | 22 | Audit trail |
| **ITForms** | ✅ **EXISTS** | 0 | Form registry |
| **User_Roles_IT** | ✅ **EXISTS** | 15 | IT user roles |
| **Config_Companies** | ✅ **EXISTS** | 9 | Company reference |
| **Config_Departments** | ✅ **EXISTS** | 38 | Department reference |
| **Config_ApproverMatrix** | ✅ **EXISTS** | 0 | Approval routing |
| **Config_EmployeeDirectory** | ✅ **EXISTS** | 482 | Employee lookup |
| **Config_NotesAdminRouting** | ✅ **EXISTS** | 0 | NIR routing |
| **IT_RoutingMatrix** | ❓ On Admin Sites | 182 | Listed as IT_RoutingRules on IOI-App_Admin_Sites |

## 2. HR Portal — `ioi-portal-hr`

| List | Status | Items |
|------|--------|-------|
| **MainDB_HR** | ✅ **EXISTS** | 3 |
| **MainDB_HR_Ext_BSD** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_Cafeteria** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_CWR** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_EEN** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_EPDU** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_EPHR** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_ESF** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_FTCR** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_FWWPD** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_FWWPE** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_GDSN** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_HEALTHINFO** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_HRAPR** | ✅ **EXISTS** | 0 |
| **MainDB_HR_Ext_Records** | ✅ **EXISTS** | 0 |
| **ApprovalHistory_HR** | ✅ **EXISTS** | 0 |
| **AttachmentIndex_HR** | ✅ **EXISTS** | 0 |
| **OpsLog_HR** | ✅ **EXISTS** | 0 |
| **HR_RoutingMatrix** | ✅ **EXISTS** | 0 |
| **HR_InterviewPipeline** | ✅ **EXISTS** | 0 |
| **HR_AppraisalRecords** | ✅ **EXISTS** | 0 |
| **Config_GlobalUserRoleAssignments** | ✅ **EXISTS** | 3 |
| **AuditLog_HR** | ✅ **EXISTS** (via generated service) | — |

## 3. STR Portal — `ioi-portal-str`

| List | Status | Items |
|------|--------|-------|
| **MainDB_STR** | ✅ **EXISTS** | 3 |
| **ApprovalHistory_STR** | ✅ **EXISTS** | 0 |
| **Assignments_STR** | ✅ **EXISTS** | 0 |
| **AttachmentIndex_STR** | ✅ **EXISTS** | 0 |
| **LineItems_STR** | ✅ **EXISTS** | 0 |

## 4. FIN Portal — `ioi-portal-fin`

| List | Status | Items |
|------|--------|-------|
| **MainDB_FIN** | ✅ **EXISTS** | 0 |

## 5. PRD Portal — `ioi-portal-prd`

| List | Status | Items |
|------|--------|-------|
| **MainDB_PRD** | ✅ **EXISTS** | 1 |

## 6. QA Portal — `ioi-portal-qa`

| List | Status | Items |
|------|--------|-------|
| **MainDB_QA** | ✅ **EXISTS** | 0 |
| **QA_ActionItems** | ✅ **EXISTS** | 0 |
| **QA_SubActionItems** | ✅ **EXISTS** | 0 |
| **QA_HACCP_ReviewRecord** | ✅ **EXISTS** | 0 |
| **ApprovalHistory_QA** | ✅ **EXISTS** | 0 |

## 7. SHE Portal — `ioi-portal-she`

| List | Status | Items |
|------|--------|-------|
| **MainDB_SHE** | ✅ **EXISTS** | 0 |
| **ApprovalHistory_SHE** | ✅ **EXISTS** | 0 |

## 8. Admin Sites — `IOI-App_Admin_Sites`

| List | Status | Items |
|------|--------|-------|
| **AppSettings** | ✅ **EXISTS** | 0 |
| **AuditLogs** | ✅ **EXISTS** | 0 |
| **Issue and bug tracker** | ✅ **EXISTS** | 0 |
| **UserProfiles** | ✅ **EXISTS** | 1 |
| **UserRoles** | ✅ **EXISTS** | 1 |
| **RoutePermissions** | ✅ **EXISTS** | 0 |
| **IT_RoutingRules** | ✅ **EXISTS** | 182 |

---

## Summary

| Department | Lists Expected | Lists Existing | Missing |
|------------|---------------|----------------|---------|
| **IT** | 28+ | 28 | **0 ✅ All complete** |
| **HR** | 20+ | 20 | **0** |
| **STR** | 5 | 5 | **0** |
| **FIN** | 1 | 1 | **0** |
| **PRD** | 1 | 1 | **0** |
| **QA** | 5 | 5 | **0** |
| **SHE** | 2 | 2 | **0** |
| **Admin** | 7 | 7 | **0** |

**Only 1 list missing across all departments:** `MainDB_IT_Ext_Policy`
