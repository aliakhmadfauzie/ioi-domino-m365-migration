# HR Department — Data Source Analysis & SharePoint List Design Report

> **Generated**: 2026-05-31
> **Analyst**: Domino → M365 Migration Agent
> **Scope**: HR Department — Penang (Prai) and Johor sites
> **Status**: ✅ Complete

---

## 1. Data Sources Overview

### 1.1 DXL/XML Source Files (Domino Schema)

| Site | Location | Forms | Files |
|------|----------|-------|-------|
| **Penang (Prai) HR** | `source/dxl/XML_HR_Penang/` | 26 forms | 26 `*_dxl.xml` + 26 `*_inventory.txt` |
| **Johor HR** | `source/dxl/XML_HR_Johor/` | 16 forms | 16 `*_dxl.xml` + 16 `*_inventory.txt` |

### 1.2 PDF UI Export Files

| Site | Location | PDFs |
|------|----------|------|
| **Penang (Prai) HR** | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/` | 26 clean named PDFs |
| **Johor HR** | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/HR/` | 38 PDFs (some forms have multiple sub-forms) |

### 1.3 Master App Inventory

Referenced in: `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv`

---

## 2. Penang (Prai) HR — Complete Form Inventory

| # | Form Code | Domino Database | Main Form(s) | Est. Fields | Workflow | PDF Size |
|---|-----------|-----------------|--------------|-------------|----------|----------|
| 1 | **AWHR** | Rest Day & Additional Working Hours Requisition | WorkExt, WorkExt2, Ref1, Guideline | ~50 | ✅ Multi-stage | AWHR.pdf |
| 2 | **BSD** | Backup Staff Database | Form, Guidelines | ~25 | ✅ HOD Approval | BSD.pdf |
| 3 | **CIR** | Cafeteria Inspection Database | Form, NewForm, Vending Machines, Service Records, ECM Cleaning, ECM Food Waste, LPG Records | ~40 | ✅ HOD/Committee | CIR.pdf |
| 4 | **CWR** | Contract Worker Requisition Form | Form, Form2, HeadCount, Agreement, JobDescription | ~50 | ✅ Multi-stage | CWR.pdf |
| 5 | **DRD** | Duty Roster Database | FormDR, FormDR2 | ~20 | ✅ HOD Approval | DRD.pdf |
| 6 | **EEN** | Employee Exit Notification | EE, Notification, Notification2 | ~25 | ✅ ED Approval | EEN.pdf |
| 7 | **EPDU** | Employee Personal Detail Update | EMPINFO, UPDINFO | ~30 | ❌ Self-service | EPDU.pdf |
| 8 | **EPHR** | Employee Personal Health Records | EPHR | ~15 | ❌ Record only | EPHR.pdf |
| 9 | **ESF** | Employee Survey | SURVEY | ~15 | ❌ Anonymous | ESF.pdf |
| 10 | **FTCR** | Fixed Term Contract Requisition Database | SPForm, SPForm2 | ~30 | ✅ HOD/HR | FTCR.pdf |
| 11 | **FWWPD** | Foreign Workers Work Permit | Form, Form2, Hostel List, InsDeduction, Unpaid Leaves | ~60 | ✅ Multi-stage | FWWPD.pdf |
| 12 | **FWWPE** | Foreign Worker Work Period Extension | Form, Form2 | ~20 | ✅ HOD/HR | FWWPE.pdf |
| 13 | **GDSN** | Gift-Donation-Sponsorship Requisition | Form, Form2 | ~25 | ✅ HOD/COO | GDSN.pdf |
| 14 | **HEALTHINFO** | Health Info | NewForm, NewForm2 | ~10 | ❌ Info only | HEALTHINFO.pdf |
| 15 | **HRAPR** | HR Applications Problem Reporting | SoftwareErrors, EnterComments | ~15 | ✅ IT/HR | HRAPR.pdf |
| 16 | **HRINFO** | HR Notice Database | NewForm | ~8 | ❌ Notice board | HRINFO.pdf |
| 17 | **INTERN** | Industrial Trainees Summary | Intern, WkPLForm | ~20 | ✅ HOD | INTERN.pdf |
| 18 | **INTERVIEWDB** | Interview Database | INT | ~15 | ❌ Record only | INTERVIEWDB.pdf |
| 19 | **JD** | Job Descriptions (New) | jobdesc, jobdescV1, JDMEMO1-5, Department | ~50 | ✅ Multi-stage | JD.pdf |
| 20 | **NDF** | Night Duty Findings | Form, Schedule, Report, Dept_PIC | ~25 | ✅ HOD | NDF.pdf |
| 21 | **ORGCHART** | Organisation Charts | NewOrgChart, orgchart, RevNewOrgChart, MEMO1-5 | ~30 | ✅ COO Approval | ORGCHART.pdf |
| 22 | **OWP** | Outsource Worker Passport & Work Permit | Form, VendorList, JD | ~35 | ✅ Multi-stage | OWP.pdf |
| 23 | **PAF** | Performance Appraisal Request | AppForm, AppForm2, AppForm3, DWL | ~80 | ✅ HOD/HR | PAF.pdf |
| 24 | **SR** | Staff Requisition | SRF | ~40 | ✅ Multi-stage | SR.pdf |
| 25 | **TMPU** | Talent Management — Planning & Update | TalentUpdate, TalentUpdate2 | ~60 | ✅ Multi-stage | TMPU.pdf |
| 26 | **TNPRA** | Typhoid/NPRA Database | Form, Form2, Reference | ~30 | ✅ HOD/HR | TNPRA.pdf |

---

## 3. Johor HR — Complete Form Inventory

| # | Form Code | Domino Database | Main Form(s) | Est. Fields | Workflow | PDF Files |
|---|-----------|-----------------|--------------|-------------|----------|-----------|
| 1 | **PCNBkStf** | Backup Staff Database | Form | ~20 | ✅ HOD | `1_PCNBkStf.pdf` |
| 2 | **cancomp** | Canteen Complaint | frmComp | ~10 | ✅ | `2_cancomp.pdf` |
| 3 | **ContractorReg** | Civil & Engineering Contractors Registration | CTForm, CTForm2, CTFormX | ~30 | ✅ | `3_ContractorReg.pdf` |
| 4 | **TyphoidVacc** | Company Typhoid Vaccination | Test TR | ~15 | ✅ | `4_TyphoidVaccination.pdf` |
| 5 | **UniformReq** | Company Uniform Request | Test Uni | ~15 | ✅ HOD/HR | `5_CompanyUniformRequest.pdf` |
| 6 | **pcnjd** | Job Descriptions | JD_Form, JD_Form2, EmpInfo | ~60 | ✅ Multi-stage | `6_pcnjd.pdf` |
| 7 | **LateComing** | Late Coming Notification | FormLate, FormLateEmp | ~15 | ✅ HOD | `7_LateComing_FormLate.pdf`, `7_LateComing_FormLateEmp.pdf` |
| 8 | **manpowerReq** | Manpower Requisition | SRF, ProfileDoc | ~30 | ✅ HOD | `8_manpowerReq.pdf` |
| 9 | **NightVisit** | Night Visit Notification | Form | ~15 | ✅ HOD | `9_NightVisit.pdf` |
| 10 | **PCNOrgChart** | Organisation Charts | NewOrgChart | ~20 | ✅ | `10_PCNOrgChart.pdf` |
| 11 | **AppTest** | Superintendent Visit Notification | Form, EnterComments1-2 | ~15 | ✅ | `11_AppTest_*.pdf` (8 variants) |
| 12 | **SpVisit** | Superintendent Visit Notification | Form, EnterComments1-2 | ~15 | ✅ | `12_SpVisit.pdf` |
| 13 | **workins** | Worker Regular Inspection | frmWork | ~10 | ✅ | `13_workins.pdf` |
| 14 | **hostel** | Workers Hostel Room Checking | frmHostel, frmHostel2, frmEmployee, block, room | ~25 | ✅ | `14_hostel.pdf` |
| 15 | **PCNTND** | Training Database | TR, TE, TM, TE4hrs, TRC, EM, TM2, TrainingMasterbk | ~30 | ✅ | `15_PCNTND_*.pdf` (8 variants) |
| 16 | **PCNDriver** | Driver Arrangement Requisition | Driver, Driver_v2 | ~15 | ✅ | `16_PCNDriver.pdf` |

---

## 4. Functional Categorization

### Category A: Recruitment & Staffing (5 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| SR | Staff Requisition (Penang) | ✅ Multi-stage (HOD → HR → COO) |
| manpowerReq | Manpower Requisition (Johor) | ✅ HOD |
| FTCR | Fixed Term Contract Requisition (Penang) | ✅ Multi-stage |
| CWR | Contract Worker Requisition (Penang) | ✅ Multi-stage |
| INTERVIEWDB | Interview Database (Penang) | ❌ Record only |

### Category B: Employee Lifecycle (5 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| EEN | Employee Exit Notification (Penang) | ✅ ED Approval |
| EPDU | Employee Personal Detail Update (Penang) | ❌ Self-service |
| EPHR | Employee Personal Health Records (Penang) | ❌ Record only |
| INTERN | Industrial Trainees Summary (Penang) | ✅ HOD |
| PAF | Performance Appraisal Request (Penang) | ✅ Multi-stage (HOD → HR) |

### Category C: Attendance, Leave & Discipline (5 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| AWHR | Rest Day & Additional Working Hours (Penang) | ✅ Multi-stage |
| DRD | Duty Roster Database (Penang) | ✅ HOD |
| NDF | Night Duty Findings (Penang) | ✅ HOD |
| LateComing | Late Coming Notification (Johor) | ✅ HOD |
| NightVisit | Night Visit Notification (Johor) | ✅ HOD |

### Category D: Foreign Workers (4 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| FWWPD | Foreign Workers Work Permit (Penang) | ✅ Multi-stage |
| FWWPE | Foreign Worker Work Period Extension (Penang) | ✅ Multi-stage |
| OWP | Outsource Worker Passport & Work Permit (Penang) | ✅ Multi-stage |
| TNPRA | Typhoid/NPRA Database (Penang) | ✅ HOD/HR |
| TyphoidVacc | Company Typhoid Vaccination (Johor) | ✅ HOD/HR |
| UniformReq | Company Uniform Request (Johor) | ✅ HOD/HR |

### Category E: Organisational Structure (3 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| ORGCHART | Organisation Charts (Penang) | ✅ COO |
| PCNOrgChart | Organisation Charts (Johor) | ✅ COO |
| JD | Job Descriptions (Penang) | ✅ Multi-stage |
| pcnjd | Job Descriptions (Johor) | ✅ Multi-stage |

### Category F: Welfare & Facilities (5 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| BSD | Backup Staff Database (Penang) | ✅ HOD |
| PCNBkStf | Backup Staff Database (Johor) | ✅ HOD |
| CIR | Cafeteria Inspection Database (Penang) | ✅ Committee |
| cancomp | Canteen Complaint (Johor) | ✅ |
| GDSN | Gift-Donation-Sponsorship (Penang) | ✅ COO |
| HEALTHINFO | Health Info (Penang) | ❌ Info only |

### Category G: Compliance & Training (4 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| PCNTND | Training Database (Johor) | ✅ |
| TMPU | Talent Management — Planning & Update (Penang) | ✅ Multi-stage |
| TNPRA | Typhoid/NPRA Database (Penang) | ✅ HOD/HR |
| ContractorReg | Civil & Engineering Contractors Registration (Johor) | ✅ |

### Category H: Internal HR Operations (3 forms)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| HRINFO | HR Notice Database (Penang) | ❌ Notice board |
| HRAPR | HR Applications Problem Reporting (Penang) | ✅ IT/HR |
| ESF | Employee Survey (Penang) | ❌ Anonymous |
| INTERVIEWDB | Interview Database (Penang) | ❌ Record only |

### Category I: Site-Specific Operations (Johor only)
| Form Code | Form Name | Workflow |
|-----------|-----------|----------|
| hostela | Workers Hostel Room Checking (Johor) | ✅ |
| workins | Worker Regular Inspection (Johor) | ✅ |
| SpVisit | Superintendent Visit Notification (Johor) | ✅ |
| AppTest | Superintendent Visit Notification (Johor) | ✅ |
| PCNDriver | Driver Arrangement Requisition (Johor) | ✅ |

---

## 5. SharePoint List Architecture Design

### 5.1 Architecture Pattern

Following the established pattern from **IT Department** (single `MainDB_IT` per site + extension lists), the **HR Department** should use the same architecture:

```
SharePoint Site: IOI-App_Admin_Sites
│
├── [Main] MainDB_HR (Prai/Penang)          ← ⬜ NEW — All Penang HR forms, FormCode discriminator
├── [Main] MainDB_HR_JHR (Johor)            ← ⬜ NEW — All Johor HR forms, FormCode discriminator
│
├── [Ext]  MainDB_HR_Ext_Staffing           ← ⬜ NEW — SR, manpowerReq, FTCR, CWR, INTERVIEWDB
├── [Ext]  MainDB_HR_Ext_Lifecycle          ← ⬜ NEW — EEN, EPDU, EPHR, INTERN, PAF
├── [Ext]  MainDB_HR_Ext_Attendance         ← ⬜ NEW — AWHR, DRD, NDF, LateComing, NightVisit
├── [Ext]  MainDB_HR_Ext_ForeignWorker      ← ⬜ NEW — FWWPD, FWWPE, OWP, TNPRA, TyphoidVacc, UniformReq
├── [Ext]  MainDB_HR_Ext_OrgStructure       ← ⬜ NEW — ORGCHART, PCNOrgChart, JD, pcnjd
├── [Ext]  MainDB_HR_Ext_Welfare            ← ⬜ NEW — BSD, PCNBkStf, CIR, cancomp, GDSN, HEALTHINFO
├── [Ext]  MainDB_HR_Ext_Compliance         ← ⬜ NEW — PCNTND, TMPU, TNPRA, ContractorReg
├── [Ext]  MainDB_HR_Ext_Operations         ← ⬜ NEW — HRINFO, HRAPR, ESF, INTERVIEWDB, hostela, workins, SpVisit, PCNDriver
│
├── [Config] Config_Companies               ← ⬜ PENDING — Company reference (shared)
├── [Config] Config_Departments             ← ⬜ PENDING — Department reference (shared)
├── [Config] Config_EmployeeDirectory       ← ⬜ PENDING — Employee lookup (shared)
├── [Config] Config_ApproverMatrix          ← ⬜ PENDING — Approval routing (shared)
│
└── [Other] MainDB_IT (exists), MainDB_FIN, MainDB_PRD, MainDB_QA, MainDB_SHE, MainDB_STR  ← ⬜ PENDING
```

### 5.2 Rationale

| Decision | Reason |
|----------|--------|
| **Two main lists** (Penang + Johor) | Each site has different forms; Johor has 16 forms, Penang has 26 forms — some overlap (BSD, ORGCHART, JD, SR variants) |
| **FormCode discriminator** | Same pattern as IT — single Power App connection, views filtered by FormCode |
| **Extension lists per functional category** | Avoids 500+ column limit on SharePoint lists; each extension list houses form-specific fields |
| **Shared config lists** | Companies, Departments, EmployeeDirectory, ApproverMatrix are shared across all departments |

### 5.3 Cross-Site Overlap

| Form Category | Penang Code | Johor Code | Merge Strategy |
|---------------|-------------|------------|----------------|
| Backup Staff | BSD | PCNBkStf | Same FormCode `BSD` in both sites, different sites discriminated by `Site` column |
| Org Charts | ORGCHART | PCNOrgChart | Same FormCode `ORGCHART` in both sites |
| Job Descriptions | JD | pcnjd | Same FormCode `JD` in both sites |
| Staff Requisition | SR | manpowerReq | Different FormCodes: `SR` (Penang) vs `SR_JHR` (Johor) |

---

## 6. MainDB_HR — Core Columns Design

> Main list for all HR requests at Prai/Penang site. Each record is discriminated by `FormCode`.

### 6.1 Core Columns (All Forms)

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: AWHR, BSD, CIR, CWR, DRD, EEN, EPDU, EPHR, ESF, FTCR, FWWPD, FWWPE, GDSN, HEALTHINFO, HRAPR, HRINFO, INTERN, INTERVIEWDB, JD, NDF, ORGCHART, OWP, PAF, SR, TMPU, TNPRA |
| **CurrentStatus** | Choice | ✅ | Workflow state machine value (Draft → Submitted → HOD Approval → HR Review → Director → Completed) |
| **Site** | Choice | ✅ | Penang / Johor |
| **EmployeeName** | Person/Group | ✅ | Requesting employee |
| **EmployeeNo** | Single line | ✅ | Employee number |
| **Company** | Choice | ✅ | From Config_Companies |
| **Department** | Choice | ✅ | From Config_Departments |
| **Designation** | Single line | — | Job title |
| **SubmittedDate** | Date/Time | ✅ | `=Now` |
| **Subject** | Single line | — | Request subject |
| **HOD** | Person/Group | — | HOD for workflow routing |
| **HODApprovalDate** | Date/Time | — | HOD approval timestamp |
| **HODRemarks** | Multiple lines | — | HOD comments |
| **HRInCharge** | Person/Group | — | HR PIC for workflow routing |
| **HRApprovalDate** | Date/Time | — | HR approval timestamp |
| **HRRemarks** | Multiple lines | — | HR comments |
| **IsLocked** | Boolean | — | Lock flag |
| **Remarks** | Multiple lines | — | General remarks |
| **WorkflowStage** | Number | — | Current workflow stage (1-5) |
| **EnvironmentTag** | Choice | — | Production / UAT / Development |

### 6.2 Form-Prefixed Columns (Wide Table Pattern)

Following the IT department pattern, each form type will have prefixed columns in MainDB_HR:

**SR fields:** `sRPosition`, `sRDepartment`, `sRDivision`, `sRExecutive`, `sRRequisitionerPost`, `sRReviewerPost`, `sRVerifierPost`, `sRStatus`, `sRRequiredDate`, `sRRemarks`
**PAF fields:** `pAFYear`, `pAFEmNo`, `pAFEmName`, `pAFEmComp`, `pAFEmDept`, `pAFEmDesg`, `pAFJS5`, `pAFR1-R6`, `pAFG1-G7`, `pAFCR_1-3`, `pAFCRP_1-3`
**EEN fields:** `eENEmpName`, `eENEmpNum`, `eENEmpEmail`, `eENPosition`, `eENCategory`, `eENType`, `eENReasons`, `eENPay`, `eENComments1-5`
**AWHR fields:** `aWHRGrd_1-5`, `aWHRQ_1-8`, `aWHRIns_1-8`
**CWR fields:** `cWRCategory`, `cWRIssueNo`, `cWRINO`, `cWRRemarks`, `cWRSummary`
**TMPU fields:** `tMPUFullName`, `tMPUCompany`, `tMPUDept`, `tMPUDiv`, `tMPUJobTitle`, `tMPUJobGrade`, `tMPUDateJoin`, `tMPUPotential`, `tMPUDevelop_1-8`, `tMPUResource_1-5`
**ORGCHART fields:** `oRGC_HODName`, `oRGC_HODDate`, `oRGC_HODRemarks`, `oRGC_EDName`, `oRGC_EDDate`, `oRGC_EDRemarks`

---

## 7. Extension List Designs

### 7.1 MainDB_HR_Ext_Staffing
> Linked to MainDB_HR via lookup. Stores recruitment and staffing form-specific fields.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | SR / manpowerReq / FTCR / CWR / INTERVIEWDB |
| **sR_rExecutive** | Single line | — | Executive name |
| **sR_tDeptHeadName** | Single line | — | Dept Head for approval |
| **sR_tRunningNumber** | Single line | — | Auto-number |
| **sR_nNumber** | Number | — | Number of staff |
| **sR_tPosition** | Single line | — | Position title |
| **sR_tDesignation** | Single line | — | Designation |
| **sR_tName** | Single line | — | Candidate name |
| **sR_Section_A** | Note | — | Section A details |
| **sR_Summary** | Note | — | Summary |
| **sR_tRequisitionerPost** | Single line | — | Requisitioner post |
| **sR_tReviewerPost** | Single line | — | Reviewer post |
| **sR_tVerifierPost** | Single line | — | Verifier post |
| **sR_dReviewedDate** | DateTime | — | Review date |
| **sR_dVerifiedDate** | DateTime | — | Verification date |
| **sR_dVerifiedDate_1** | DateTime | — | Second verification date |
| **sR_dVerifiedDate_2** | DateTime | — | Third verification date |
| **sR_tCandidateName** | Single line | — | Shortlisted candidate |
| **sR_tSpecialRequirement** | Note | — | Special requirements |
| **sR_tExperience** | Note | — | Experience required |
| **sR_tQualification** | Note | — | Qualification |
| **sR_tDuties** | Note | — | Job duties |
| **sR_tTermPeriod** | Single line | — | Contract period |
| **sR_tReason** | Note | — | Reason for requisition |
| **sR_OfferedDate** | DateTime | — | Date offered |
| **sR_tRemark** | Note | — | Remarks |
| **sR_Status1-4** | Choice | — | Workflow status fields |
| **cWR_Category** | Choice | — | Contract worker category |
| **cWR_IssueNo** | Single line | — | Issue number |
| **cWR_INO** | Single line | — | Auto-number |
| **ftcr_SPForm** | Note | — | Fixed term contract details |
| **int_Form** | Note | — | Interview form details |

### 7.2 MainDB_HR_Ext_Lifecycle
> Linked to MainDB_HR via lookup. Stores employee lifecycle form data.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | EEN / EPDU / EPHR / INTERN / PAF |
| **een_EmpName** | Single line | ✅ | Employee name |
| **een_EmpNum** | Single line | ✅ | Employee number |
| **een_EmpEmail** | Single line | ✅ | Employee email |
| **een_Position** | Choice | — | Exit position type |
| **een_Category** | Choice | — | Exit category |
| **een_Type** | Choice | — | Exit type (resignation, retirement, etc.) |
| **een_Reasons** | Note | — | Reasons for exit |
| **een_Pay** | Single line | — | Final pay details |
| **een_Progress** | Choice | — | Exit progress status |
| **een_Comments1-5** | Note | — | Stage comments |
| **een_SugDisscussion** | Note | — | Suggestion for discussion |
| **een_SugImprovements** | Note | — | Improvement suggestions |
| **een_NewPost** | Single line | — | New position if applicable |
| **een_PreventLeave** | Note | — | Retention attempts |
| **een_HRRem** | Note | — | HR remarks |
| **een_Details_1-2** | Note | — | Additional details |
| **paf_Year** | Single line | — | Appraisal year |
| **paf_EmNo** | Single line | — | Employee number |
| **paf_EmName** | Single line | — | Employee name |
| **paf_EmComp** | Single line | — | Company |
| **paf_EmDept** | Single line | — | Department |
| **paf_EmDesg** | Single line | — | Designation |
| **paf_EmDateJoin** | DateTime | — | Date joined |
| **paf_EmComYear** | Number | — | Years in company |
| **paf_JS5** | Note | — | Job scope |
| **paf_R1-R6** | Number | — | Rating fields (1-6) |
| **paf_G1-G7** | Number | — | Goal fields (1-7) |
| **paf_CR_1-3** | Single line | — | Core responsibility text |
| **paf_CRP_1-3** | Number | — | Core responsibility percentage |
| **paf_KRAS** | Note | — | KRA details |
| **paf_CRPT** | Number | — | Core responsibility total |
| **paf_MS1-3** | Note | — | Management skills |
| **paf_S6Total** | Number | — | Section 6 total |
| **paf_Total_1-2** | Number | — | Score totals |
| **paf_Summary** | Note | — | Performance summary |
| **paf_SummaryHR** | Note | — | HR summary |
| **paf_Band_1-2** | Choice | — | Performance band |
| **epdu_EMPINFO** | Note | — | Employee personal info update |
| **epdu_UPDINFO** | Note | — | Update info fields |
| **ephr_EPHR** | Note | — | Health record |
| **intern_Intern** | Note | — | Intern details |
| **intern_WkPLForm** | Note | — | Work plan form |

### 7.3 MainDB_HR_Ext_Attendance
> Linked to MainDB_HR via lookup. Stores attendance, leave & discipline forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | AWHR / DRD / NDF / LateComing / NightVisit |
| **awhr_Grd_1-5** | Single line | — | Grade fields |
| **awhr_Q_1-8** | Single line | — | Question fields |
| **awhr_Ins_1-8** | Single line | — | Instruction fields |
| **drd_FormDR** | Note | — | Duty roster form |
| **drd_FormDR2** | Note | — | Duty roster form variant |
| **ndf_Form** | Note | — | Night duty findings |
| **ndf_Schedule** | Note | — | Schedule details |
| **ndf_Report** | Note | — | Report details |
| **ndf_Dept_PIC** | Single line | — | Department PIC |
| **late_FormLate** | Note | — | Late coming form |
| **late_FormLateEmp** | Note | — | Late coming employee form |
| **night_Form** | Note | — | Night visit form |

### 7.4 MainDB_HR_Ext_ForeignWorker
> Linked to MainDB_HR via lookup. Stores foreign worker management forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | FWWPD / FWWPE / OWP / TNPRA / TyphoidVacc / UniformReq |
| **fwwpd_Form** | Note | — | Foreign worker work permit form |
| **fwwpd_Form2** | Note | — | Permit variant |
| **fwwpd_HostelList** | Note | — | Hostel list |
| **fwwpd_InsDeduction** | Note | — | Insurance deduction |
| **fwwpd_UnpaidLeaves** | Note | — | Unpaid leave records |
| **fwwpe_Form** | Note | — | Work period extension form |
| **fwwpe_Form2** | Note | — | Extension variant |
| **owp_Form** | Note | — | Outsource worker form |
| **owp_VendorList** | Note | — | Vendor list |
| **owp_JD** | Note | — | Job description for outsourced |
| **tnpra_Form** | Note | — | Typhoid/NPRA form |
| **tnpra_Reference** | Note | — | Reference data |
| **tnpra_Form2** | Note | — | NPRA variant |
| **typhoid_TestTR** | Note | — | Typhoid vaccination record |
| **uniform_TestUni** | Note | — | Uniform request |
| **uniform_UniType** | Choice | — | Uniform type |
| **uniform_Size** | Choice | — | Size |
| **uniform_Quantity** | Number | — | Quantity |

### 7.5 MainDB_HR_Ext_OrgStructure
> Linked to MainDB_HR via lookup. Stores organisational structure forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | ORGCHART / PCNOrgChart / JD / pcnjd |
| **org_NewOrgChart** | Note | — | New org chart data |
| **org_RevNewOrgChart** | Note | — | Revised org chart |
| **org_EnterCommentsApp** | Note | — | Approval comments |
| **org_EnterCommentsEnd** | Note | — | Endorsement comments |
| **org_EnterCommentsCEO** | Note | — | CEO comments |
| **org_MEMO1-5** | Note | — | Memo fields |
| **org_Numbering** | Single line | — | Org chart numbering |
| **jd_jobdesc** | Note | — | Job description form |
| **jd_jobdescV1** | Note | — | Job description variant |
| **jd_EnterComments** | Note | — | Comments |
| **jd_EnterCommentsHOD** | Note | — | HOD comments |
| **jd_JDMEMO1-5** | Note | — | JD memo fields |
| **jd_Department** | Single line | — | Department |
| **pcnjd_JD_Form** | Note | — | JD form (Johor) |
| **pcnjd_JD_Form2** | Note | — | JD form variant (Johor) |
| **pcnjd_EmpInfo** | Note | — | Employee info |

### 7.6 MainDB_HR_Ext_Welfare
> Linked to MainDB_HR via lookup. Stores welfare & facilities forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | BSD / PCNBkStf / CIR / cancomp / GDSN / HEALTHINFO |
| **bsd_Form** | Note | — | Backup staff form |
| **cir_Form** | Note | — | Cafeteria inspection form |
| **cir_NewForm** | Note | — | New inspection form |
| **cir_VendingMachines** | Note | — | Vending machine records |
| **cir_ServiceRecords** | Note | — | Service records |
| **cir_ECMCleaning** | Note | — | ECM cleaning records |
| **cir_ECMFoodWaste** | Note | — | ECM food waste records |
| **cir_LPGRecords** | Note | — | LPG records |
| **cancomp_frmComp** | Note | — | Canteen complaint |
| **gdsn_Form** | Note | — | Gift/donation/sponsorship form |
| **gdsn_Form2** | Note | — | GDS variant |
| **health_NewForm** | Note | — | Health info form |

### 7.7 MainDB_HR_Ext_Compliance
> Linked to MainDB_HR via lookup. Stores compliance & training forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | PCNTND / TMPU / TNPRA / ContractorReg |
| **tmpu_TalentUpdate** | Note | — | Talent update form |
| **tmpu_TalentUpdate2** | Note | — | Talent update variant |
| **tmpu_FullName** | Single line | — | Employee name |
| **tmpu_Company** | Single line | — | Company |
| **tmpu_Dept** | Single line | — | Department |
| **tmpu_Div** | Single line | — | Division |
| **tmpu_JobTitle** | Single line | — | Job title |
| **tmpu_JobGrade** | Single line | — | Job grade |
| **tmpu_DateJoin** | DateTime | — | Date joined |
| **tmpu_Potential** | Choice | — | Potential rating |
| **tmpu_Develop_1-8** | Note | — | Development areas |
| **tmpu_Resource_1-5** | Note | — | Resources needed |
| **tmpu_Lead_1-6** | Note | — | Leadership plans |
| **tmpu_End_1-5** | Note | — | End goals |
| **tmpu_D1-3** | Note | — | Development dimensions |
| **tmpu_App_1-5** | Note | — | Appraisal items |
| **tmpu_COOName** | Single line | — | COO name |
| **tmpu_COODate** | DateTime | — | COO approval date |
| **tmpu_COOCom_1-4** | Note | — | COO comments |
| **tmpu_EDName** | Single line | — | ED name |
| **tmpu_EDDate** | DateTime | — | ED approval date |
| **tmpu_EDCom_1-4** | Note | — | ED comments |
| **tmpu_HODName** | Single line | — | HOD name |
| **tmpu_HODCom_1-4** | Note | — | HOD comments |
| **p cntnd_TR** | Note | — | Training record |
| **pcntnd_TE** | Note | — | Training evaluation |
| **pcntnd_TM** | Note | — | Training master |
| **pcntnd_TM2** | Note | — | Training master variant |
| **pcntnd_TRC** | Note | — | Training record (course) |
| **pcntnd_EM** | Note | — | Exam management |
| **contractor_CTForm** | Note | — | Contractor registration form |
| **contractor_CTFormX** | Note | — | Contractor variant |

### 7.8 MainDB_HR_Ext_Operations
> Linked to MainDB_HR via lookup. Stores internal HR operations forms.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_HR | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | HRINFO / HRAPR / ESF / INTERVIEWDB / hostela / workins / SpVisit / PCNDriver |
| **hrinfo_NewForm** | Note | — | HR notice form |
| **hrapr_SoftwareErrors** | Note | — | Problem reporting form |
| **hrapr_EnterComments** | Note | — | Comments |
| **esf_SURVEY** | Note | — | Survey form |
| **intdb_INT** | Note | — | Interview form |
| **hostel_frmHostel** | Note | — | Hostel checking form |
| **hostel_frmHostel2** | Note | — | Hostel variant |
| **hostel_block** | Note | — | Block info |
| **hostel_room** | Note | — | Room info |
| **workins_frmWork** | Note | — | Work inspection form |
| **spvisit_Form** | Note | — | Superintendent visit form |
| **driver_Driver** | Note | — | Driver arrangement form |
| **driver_Driver_v2** | Note | — | Driver variant |

---

## 8. Permissions Model

| Group | MainDB_HR/JHR | Ext Lists | Config Lists |
|---|---|---|---|
| **HR Admins** | Full Control | Full Control | Full Control |
| **Dept Heads (HODs)** | Contribute (own items) | Read | Read |
| **All Employees** | Contribute (own items) | Read (via app) | Read |
| **IT Admins** | Full Control | Full Control | Full Control |

---

## 9. Implementation Priority

| Priority | List | Forms | Complexity | Workflow |
|----------|------|-------|------------|----------|
| 🔴 P1 | **MainDB_HR** + Core | All 26 (Penang) + 16 (Johor) | High | Foundation |
| 🔴 P1 | **MainDB_HR_JHR** | Johor-specific | Medium | Foundation |
| 🟡 P2 | **Ext_Staffing** | SR, manpowerReq, FTCR, CWR | Medium | ✅ Workflow heavy |
| 🟡 P2 | **Ext_Lifecycle** | EEN, EPDU, EPHR, PAF | High | ✅ Multi-stage |
| 🟡 P2 | **Ext_Attendance** | AWHR, DRD, NDF, LateComing | Medium | ✅ HOD approval |
| 🟢 P3 | **Ext_ForeignWorker** | FWWPD, FWWPE, OWP, TNPRA | High | ✅ Complex workflows |
| 🟢 P3 | **Ext_OrgStructure** | ORGCHART, JD, pcnjd | Medium | ✅ Multi-stage |
| 🟢 P3 | **Ext_Welfare** | BSD, CIR, GDSN | Low | ✅ Simple workflows |
| 🔵 P4 | **Ext_Compliance** | PCNTND, TMPU, ContractorReg | Medium | ✅ Multi-stage |
| 🔵 P4 | **Ext_Operations** | HRINFO, HRAPR, ESF, hostela | Low | ❌ Minimal workflow |

---

## 10. Key Recommendations

1. **Start with MainDB_HR list schema** — deploy core columns + prefixed columns for top 5 forms (SR, PAF, EEN, AWHR, TMPU) to enable MVP
2. **Create extension lists incrementally** — prioritize staffing and lifecycle as they have the highest workflow complexity
3. **Share config lists** — `Config_Companies`, `Config_Departments`, `Config_EmployeeDirectory`, and `Config_ApproverMatrix` should be reused across all departments (IT, HR, FIN, etc.)
4. **Merge cross-site forms** — BSD/PCNBkStf, ORGCHART/PCNOrgChart, JD/pcnjd can share FormCodes with Site discriminator
5. **Leverage existing Power App code-first architecture** — the `MainDB_Master` pattern already exists in `ioicodeapp/`; extend it for HR

---

## 11. Cross-Reference: IT vs HR Architecture Comparison

| Aspect | IT Department | HR Department |
|--------|---------------|---------------|
| Forms | 23 (20 Penang + 3 Johor) | 42 (26 Penang + 16 Johor) |
| Main Lists | MainDB_IT + MainDB_IT_JHR | MainDB_HR + MainDB_HR_JHR |
| Extension Lists | 6 (Access, Assets, Support, SAP, Docs, Infra) | 8 (Staffing, Lifecycle, Attendance, ForeignWorker, OrgStructure, Welfare, Compliance, Operations) |
| Config Lists Shared | Config_Companies, Departments, EmployeeDirectory, ApproverMatrix | Same |
| Workflow Forms | 11/23 (48%) | ~22/42 (52%) |
| Largest Form | SAPSOF (385+ fields) | PAF (~80 fields), TMPU (~60 fields), FWWPD (~60 fields) |
| Data Sources | DXL + PDFs fully reconciled | DXL + PDFs need reconciliation |
