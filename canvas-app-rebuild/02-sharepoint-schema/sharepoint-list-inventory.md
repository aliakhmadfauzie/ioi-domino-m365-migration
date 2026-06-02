# SharePoint List Inventory

> All confirmed SP lists needed by the Canvas App.
> Source: Generated model files in `src/generated/models/`
> Last updated: 2026-06-02
> Status: CONFIRMED = verified from model/service file | MISSING_INFO = existence unconfirmed | PENDING = to be added

---

## Status Legend
- `CONFIRMED` — list exists; schema confirmed from generated model file
- `CONFIRMED_PARTIAL` — list exists; not all columns confirmed
- `MISSING_INFO` — list may exist; not yet confirmed
- `DO_NOT_CREATE` — confirmed existing list; do not provision a new one

---

## Parent Data Lists (MainDB_)

| SP List Name | Dept | Site | Source Model File | Status | Data Source in Canvas | Notes |
|---|---|---|---|---|---|---|
| `MainDB_HR` | HR | Johor + Prai | `MainDB_HRModel.ts` + `main-dbhr-model.ts` | CONFIRMED | Add as SharePoint data source | FormCode discriminator column confirmed |
| `MainDB_FIN` | FIN | Johor + Prai | `main-dbfin-model.ts` | CONFIRMED | Add as SharePoint data source | departmentKey, companyKey, siteKey as Choice fields |
| `MainDB_IT` | IT | Johor + Prai | `main-dbit-model.ts` | CONFIRMED | Add as SharePoint data source | Uses currentStatus (plain string) not StatusKey pattern |
| `MainDB_QA` | QA | Johor + Prai | `main-dbqa-model.ts` | CONFIRMED_PARTIAL | Add as SharePoint data source | Model file exists; column names need verification |
| `MainDB_QC` | QC | Johor + Prai | `main-dbqc-model.ts` | CONFIRMED_PARTIAL | Add as SharePoint data source | |
| `MainDB_PUR` | PUR | Johor + Prai | `main-dbprd-model.ts` (check) | CONFIRMED_PARTIAL | Add | |
| `MainDB_SHE` | SHE | Johor + Prai | `main-dbshe-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_STR` | STR | Johor + Prai | `main-dbstr-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_PRD` | PRD | Johor + Prai | `main-dbprd-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_LOG` | LOG | Johor + Prai | `main-dblog-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_MKT` | MKT | Johor | `main-dbmkt-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_MTN` | MTN | Johor + Prai | `main-dbmtn-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_WH` | WH | Prai | `main-dbwh-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_ADM` | ADM | Johor + Prai | `main-dbadmin-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_SEC` | SEC | Johor + Prai | `main-dbsec-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_EI` | E&I | Johor + Prai | `main-dbei-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_ENG` | ENG | Prai | `main-dbeng-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_TD` | T&D | Johor + Prai | `main-dbtd-model.ts` | CONFIRMED_PARTIAL | Add | **WARNING:** `MainDB_T&D` — ampersand in list name may cause Canvas connector issues. Test connection. |
| `MainDB_RD` | R&D | Prai | `main-dbrd-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_PBI` | PBI | Prai | `main-dbpbi-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_SA` | SA | Prai | `main-dbsa-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_POM` | POM | Prai | `main-dbpom-model.ts` | CONFIRMED_PARTIAL | Add | |
| `MainDB_PRC` | PRC | Prai | `main-dbprc-model.ts` | CONFIRMED_PARTIAL | Add | |

---

## Child / Extension Lists (MainDB_Ext_)

| SP List Name | Parent List | Form Code | Source Model File | Status | Notes |
|---|---|---|---|---|---|
| `MainDB_HR_Ext_EEN` | MainDB_HR | EEN (Employee Exit) | `MainDB_HR_Ext_EENModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_EPDU` | MainDB_HR | EPDU (Emp Detail Update) | `MainDB_HR_Ext_EPDUModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_EPHR` | MainDB_HR | EPHR (Emp Health Record) | `MainDB_HR_Ext_EPHRModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_ESF` | MainDB_HR | ESF (Exit Survey Form) | `MainDB_HR_Ext_ESFModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_FTCR` | MainDB_HR | FTCR (Fixed Term Contract) | `MainDB_HR_Ext_FTCRModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_FWWPD` | MainDB_HR | FWWPD (Foreign Worker) | `MainDB_HR_Ext_FWWPDModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_FWWPE` | MainDB_HR | FWWPE (FW Work Permit Ext) | `MainDB_HR_Ext_FWWPEModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_GDSN` | MainDB_HR | GDSN (Gift/Donation/Sponsor) | `MainDB_HR_Ext_GDSNModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_HEALTHINFO` | MainDB_HR | HEALTHINFO | `MainDB_HR_Ext_HEALTHINFOModel.ts` | CONFIRMED | |
| `MainDB_HR_Ext_HRAPR` | MainDB_HR | HRAPR (HR Appraisal) | `MainDB_HR_Ext_HRAPRModel.ts` | CONFIRMED | |
| `MainDB_IT_Ext_Access` | MainDB_IT | SFAR (Share Folder Access) | `MainDB_IT_Ext_AccessModel.ts` | CONFIRMED | |
| `MainDB_IT_Ext_Assets` | MainDB_IT | HI (Hardware Inventory) | `MainDB_IT_Ext_AssetsModel.ts` | CONFIRMED | |
| `MainDB_IT_Ext_SAP` | MainDB_IT | SAPAMR | `MainDB_IT_Ext_SAPModel.ts` | CONFIRMED | |
| `MainDB_IT_Ext_Support` | MainDB_IT | SSR (IT Support) | `MainDB_IT_Ext_SupportModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_Assessment` | MainDB_QA | — | `MainDB_QA_Ext_AssessmentModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_CAPA` | MainDB_QA | — | `MainDB_QA_Ext_CAPAModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_ChangeControl` | MainDB_QA | CHANCONT | `MainDB_QA_Ext_ChangeControlModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_HalalCert` | MainDB_QA | — | `MainDB_QA_Ext_HalalCertModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_IMS` | MainDB_QA | — | `MainDB_QA_Ext_IMSModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_Product` | MainDB_QA | — | `MainDB_QA_Ext_ProductModel.ts` | CONFIRMED | |
| `MainDB_QA_Ext_Records` | MainDB_QA | — | `MainDB_QA_Ext_RecordsModel.ts` | CONFIRMED | |
| `MainDB_QC_Ext_Lab` | MainDB_QC | — | `MainDB_QC_Ext_LabModel.ts` | CONFIRMED | |
| **AWHR rows** | MainDB_HR | AWHR | **None — stored as JSON in awhrWorkingHours field** | CONFIRMED_NO_LIST | Do NOT register as data source; read via ParseJSON |

---

## Config and Reference Lists

| SP List Name | Purpose | Source Model File | Status | Canvas Action |
|---|---|---|---|---|
| `Config_GlobalUserRoleAssignments` | User role assignments | `Config_GlobalUserRoleAssignmentsModel.ts` | CONFIRMED — DO_NOT_CREATE | Add as data source. Do NOT create AppConfig_Roles. |
| `Config_ApproverMatrix` | Approval routing config (key-value store) | `Config_ApproverMatrixModel.ts` | CONFIRMED | Add as data source. Columns: ConfigKey, ConfigValue, Category. |
| `Config_Companies` | Company choice options | `Config_CompaniesModel.ts` | CONFIRMED_PARTIAL | Add as data source |
| `Config_Departments` | Department choice options | `Config_DepartmentsModel.ts` | CONFIRMED_PARTIAL | Add as data source |
| `Config_EmployeeDirectory` | Employee directory | `Config_EmployeeDirectoryModel.ts` | CONFIRMED_PARTIAL | Add as data source |
| `Config_NotesAdminRouting` | Legacy Notes routing config | `Config_NotesAdminRoutingModel.ts` | CONFIRMED_PARTIAL | Reference only |

---

## Approval History Lists

| SP List Name | Dept | Source Model File | Status | Canvas Action |
|---|---|---|---|---|
| `ApprovalHistory_HR` | HR | `ApprovalHistory_HRModel.ts` | CONFIRMED | Add as data source |
| `ApprovalHistory_QA` | QA | `ApprovalHistory_QAModel.ts` | CONFIRMED | Add as data source |
| `ApprovalHistory_STR` | STR | `ApprovalHistory_STRModel.ts` | CONFIRMED | Add as data source |
| `ApprovalHistory_SHE` | SHE | `ApprovalHistory_SHEModel.ts` | CONFIRMED | Add as data source |
| `ApprovalHistory_FIN` | FIN | Not yet found | MISSING_INFO | Confirm existence before build |
| `ApprovalHistory_IT` | IT | Not yet found | MISSING_INFO | Confirm existence before build |
| `ApprovalHistory_QC` | QC | Not yet found | MISSING_INFO | Confirm existence before build |
| `ApprovalHistory_PUR` | PUR | Not yet found | MISSING_INFO | Confirm existence before build |
| `ApprovalHistory_MTN` | MTN | Not yet found | MISSING_INFO | Confirm existence before build |

---

---

## IT Department — List Inventory Detail

> Source: `m365-design/sharepoint-list-design.md`, `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/`, provisioning scripts
> Site: https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites

### IT Core Lists (Provisioned)

| SP List Name | Purpose | Read/Write | Related Forms | Status |
|---|---|---|---|---|
| `MainDB_IT` | Main IT list — FormCode discriminator (24 active forms). Wide table with form-prefixed columns + core columns. | Read + Write (Patch) | ALL IT forms (EAF, ITSSR, HI, NIR, RS, PRF, SFAR, UR, SAPCR, SAPAMR, SAPCA, SAPTR, SAPSLCF, SAPDRP, IOIPOL, ITINFO, ISGDOC, ITSC, DCALOG, TRNMAN, ITDAILYRPT, ITDR2, INTUATSOF, SILOUATSOF) | CONFIRMED — DO_NOT_CREATE |
| `MainDB_IT_Ext_Access` | Extension: User & Access Management (EAF, NIR, RS, SFAR, UR). Approval status columns, approver names, comments. | Read + Write | EAF, NIR, RS, SFAR, UR | CONFIRMED — DO_NOT_CREATE |
| `MainDB_IT_Ext_Assets` | Extension: Hardware & Infrastructure (HI, ITSC). 20+ HI columns provisioned 2026-06-03. | Read + Write | HI, ITSC | CONFIRMED — DO_NOT_CREATE |
| `MainDB_IT_Ext_Support` | Extension: IT Support (ITSSR, PRF, IAL, ITDR). Case numbers, categories, assignment, resolution. | Read + Write | ITSSR, PRF, IAL (ITEVT), ITDR2 | CONFIRMED — DO_NOT_CREATE |
| `MainDB_IT_Ext_SAP` | Extension: SAP Governance (SAPAMR, SAPCA, SAPCR, SAPTR, SAPSLCF). Approval status, transport tracking, config access. | Read + Write | SAPAMR, SAPCA, SAPCR, SAPTR, SAPSLCF | CONFIRMED — DO_NOT_CREATE |
| `MainDB_IT_Ext_Policy` | Extension: Policy (IOIPOL). 63 columns for authority sign-off, revision history. | Read + Write | IOIPOL | CONFIRMED — CREATED |

### IT Lists — Pending

| SP List Name | Purpose | Related Forms | Status |
|---|---|---|---|
| `MainDB_IT_Ext_Docs` | Extension: Documentation (ISGDOC, ITINFO, ITP, ITP2). Document metadata, versioning. | ISGDOC, ITINFO | PENDING — design exists, not provisioned |
| `MainDB_IT_Ext_Infra` | Extension: Infrastructure (ITSC, SAPDRP). Server checklist, DR procedures. | ITSC, SAPDRP | PENDING — design exists, not provisioned |

### IT Config Lists — Pending

| SP List Name | Purpose | Status |
|---|---|---|
| `Config_Companies` | Company reference for EAF, NIR, RS, etc. | PENDING |
| `Config_Departments` | Department reference | PENDING |
| `Config_ApproverMatrix` | Approval routing configuration | PENDING |
| `IT_M1_RS_SystemsList` | RS form — system list for password reset | PENDING |
| `IT_M1_RS_Banks` | RS form — bank list | PENDING |
| `IT_M1_SFAR_Servers` | SFAR form — server list | PENDING |

---

## Canvas Data Source Limit Warning

Power Apps has a limit of approximately **200 data sources per app**.

Estimated count for this project:
- MainDB_ parent lists: ~23
- MainDB_ child/ext lists: ~20+ (growing)
- Config_ lists: ~5
- ApprovalHistory_ lists: ~9+
- Office365Users connector: 1
- **Estimated total: ~58–70 data sources**

Current estimate is within limits. Monitor as more child lists are confirmed.
If limit is approached, consider splitting app by site (Johor app / Prai app) or by department group.
