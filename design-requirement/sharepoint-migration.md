# IOI Platform — SharePoint Migration Guide
> Source: IBM Lotus Notes (NSF databases) → Target: SharePoint Online + React app (ioi-platform)
> Sites: Penang (Oleo/PMS · server PHBSVR/PHB) and Johor (PanCen · server PSVR)
> Generated from DXL inventory exports in `source/dxl/XML_HR_Penang/` and `source/dxl/XML_HR_Johor/`

---

## Table of Contents
1. [Migration Overview](#1-migration-overview)
2. [Source System Inventory](#2-source-system-inventory)
3. [SharePoint Target Architecture](#3-sharepoint-target-architecture)
4. [Form-by-Form Field Mapping](#4-form-by-form-field-mapping)
5. [Workflow Translation (Agents → Power Automate)](#5-workflow-translation-agents--power-automate)
6. [ACL Translation (Notes Groups → SharePoint Permissions)](#6-acl-translation-notes-groups--sharepoint-permissions)
7. [Data Extraction Strategy (DXL → SharePoint)](#7-data-extraction-strategy-dxl--sharepoint)
8. [Migration Phases & Checklist](#8-migration-phases--checklist)
9. [Cross-Site Consolidation Rules](#9-cross-site-consolidation-rules)

---

## 1. Migration Overview

### Architecture Shift

```
BEFORE (Lotus Notes)                    AFTER (SharePoint + React)
─────────────────────────────────────   ────────────────────────────────────────
Each form = separate NSF database       All forms = rows in MainDB_HR list
                                        (discriminated by formcode column)
Workflow = Lotus Agents (LotusScript)   Workflow = Power Automate flows
ACL = Notes groups (Oleo Local, etc.)   Permissions = AAD groups / SP permissions
Views = Notes view formulas             Views = React app filters + SP list views
Email reminders = Reminder form agents  Notifications = Power Automate email steps
Two sites (Penang / Johor) separate     Two sites unified under one SP site
                                        with a site column (SiteKey0=Prai, SiteKey1=Johor)
```

### Key Principles

1. **One SharePoint list, multiple form codes.** All HR forms write to `MainDB_HR` with a `formcode` column (BSD, CWR, EEN, etc.). Dedicated sub-tables exist for structurally different forms (appraisals, health, interview).
2. **Workflow state is a column.** Lotus `CurrentAction` / `CA` field → `currentaction` column in SP. Power Automate flows advance the state; they do NOT replace the column — they update it.
3. **Sites are a filter, not a separator.** The `siteKey` column (Prai / Johor) replaces having two completely separate NSF databases per form at each site.
4. **Agents become flows, not code.** Every named Lotus agent (RemPdgHOD, SET, Clear, FORMULA, etc.) has a Power Automate equivalent. See §5 for the mapping.
5. **Record numbers are preserved.** The Lotus `INO` / `IssueNo` / `tRunningNumber` field migrates to a `iNO` column. New records generated after migration use the React app's timestamp-based format.

---

## 2. Source System Inventory

### 2A. Penang HR Databases (`XML_HR_Penang/`)

| Code | NSF Database Name | NSF Path | Record Count | Key Forms | Target List |
|---|---|---|---|---|---|
| **AWHR** | Rest Day & Additional Working Hours Requisition | `AddWorkExt.nsf` | — | WorkExt, WorkExt2, BAK | MainDB_HR |
| **BSD** | Backup Staff Database | `BkStf.nsf` | 1,630 | Form, Reminder, Guidelines | MainDB_HR |
| **CIR** | Cafeteria Inspection Database | `CafeIns.nsf` | — | Form, NewForm, Vending Machines, Service Records | MainDB_HR + MainDB_HR_Ext_Cafeteria |
| **CWR** | Contract Worker Requisition Form | `CWRF.nsf` | — | Form, Form2, HeadCount, Agreement, JobDescription | MainDB_HR + MainDB_HR_Ext_CWR |
| **DRD** | Duty Roster Database | `DutyRoster.nsf` | — | FormDR, FormDR2 | MainDB_HR |
| **EEN** | Employee Exit Notification (NEW) | `EEN.nsf` | — | EE, Notification, Notification2 | MainDB_HR |
| **EPDU** | Employee Personal Detail Update | `EMPINFO.nsf` | — | EMPINFO, UPDINFO | MainDB_HR |
| **EPHR** | Employee Personal Health Records | `EPHR.nsf` | — | EPHR | MainDB_HR (ephric, ephrfullname…) |
| **ESF** | Employee Separation Form | — | — | — | MainDB_HR (esfcategory, esfhr…) |
| **FTCR** | Fixed Term Contract Requisition | `SPlanning.nsf` | — | SPForm, SPForm2 | MainDB_HR |
| **FWWPD** | Foreign Workers Work Permit | `ForeignWorkers.nsf` | — | Form, Form2, Hostel List, InsDeduction | MainDB_HR (fwwpdname…) |
| **FWWPE** | Foreign Worker Work Period Extension | `FWWPE.nsf` | — | Form, Form2 | MainDB_HR (fwwpdname…) |
| **GDSN** | Gift-Donation-Sponsorship Requisition | `GDSR.nsf` | — | Form, Form2 | MainDB_HR |
| **HEALTHINFO** | Health Info | `HEInfo.nsf` | — | NewForm, NewForm2, BAK_NewForm | HRHealthRegister |
| **HRAPR** | HR Applications Problem Reporting | `BOSSAPR.nsf` | — | SoftwareErrors, EnterComments | MainDB_HR |
| **HRINFO** | HR Notice Database | `Notice.nsf` | — | NewForm | MainDB_HR |
| **INTERN** | Industrial Trainees Summary | `Internsummary.nsf` | — | Intern, WkPLForm | MainDB_HR |
| **INTERVIEWDB** | Interview Database | `interdb.nsf` | — | INT | HRInterviewPipeline |
| **JD** | Job Descriptions (New) | `jobdescNew.nsf` | — | jobdesc, jobdescV1, JD, JD2, Department | MainDB_HR |
| **NDF** | Night Duty Findings | `NightDuty.nsf` | — | Form, Report, Schedule | MainDB_HR |
| **ORGCHART** | Organisation Charts | `NewOrgchart.nsf` | — | NewOrgChart, RevNewOrgChart, orgchart | Separate SP Document Library |
| **OWP** | Outsource Worker Passport & Work Permit | `OutsourceWorker.nsf` | — | Form, VendorList, JD | MainDB_HR |
| **PAF** | Performance Appraisal Request | `PerfAppraisal.nsf` | — | AppForm, AppForm2, AppForm3, DWL, DWL2 | HRAppraisalRecords |
| **SR** | Staff Requisition | `Staff Requisition.nsf` | — | SRF, BAK_FORM | MainDB_HR |
| **TMPU** | Talent Management – Planning & Update | `TalentMgmt.nsf` | — | TalentUpdate, TalentUpdate2 | MainDB_HR |
| **TNPRA** | Typhoid/NPRA Database | `TyphoidInjection.nsf` | — | Form, Form2, ReminderHOD | HRHealthRegister |

### 2B. Johor HR Databases (`XML_HR_Johor/`)

| Code | NSF Database Name | NSF Path | Forms |
|---|---|---|---|
| PCNBkStf | PanCen – Backup Staff Database | `PanCen - Current\PCNBkStf.nsf` | Form, Reminder, Guidelines |
| cancomp | PanCen – Canteen Complaint | `cancomp.nsf` | frmComp, Reminder |
| ContractorReg | Civil & Engineering Contractors Registration | `ContractorReg.nsf` | CTForm, CTForm2, CTFormX |
| TyphoidVaccination | Company Typhoid Vaccination | `TyphoidVaccination.nsf` | Form, Reminder |
| CompanyUniformRequest | Company Uniform Request | `CompanyUniformRequest.nsf` | Form, Reminder |
| pcnjd | PanCen – Job Descriptions | `pcnjd.nsf` | JD_Form, JD_Form2, EmpInfo, MR |
| LateComing | Late Coming Notification | `LateComing.nsf` | FormLate, FormLateEmp |
| manpowerReq | Manpower Requisition | `manpowerReq.nsf` | SRF, ProfileDoc |
| NightVisit | Night Visit Notification | `NightVisit.nsf` | Form, EnterComments1, EnterComments2 |
| PCNOrgChart | Organisation Charts | `PCNOrgChart.nsf` | NewOrgChart, Reminder |
| SpVisit | Superintendent Visit Notification | `SpVisit.nsf` | Form, EnterComments1, EnterComments2 |
| workins | Worker Regular Inspection | `workins.nsf` | frmWork |
| hostel | Workers Hostel Room Checking | `hostel.nsf` | frmHostel, frmHostel2, frmEmployee |
| PCNTND | Training Database | `PCNTND.nsf` | TR, TE, TM, TM2, EM, SchTrain, TLibrary (+ many subtypes) |
| PCNDriver | Driver Arrangement Requisition | `PCNDriver.nsf` | Driver, Driver_v2 |
| AppTest | Application Test | — | — |

### 2C. QA Databases (`XML_QA_Johor/` — 20 databases)

QA module is out of scope for initial HR migration but shares the MainDB_QA target list.

---

## 3. SharePoint Target Architecture

### 3A. SharePoint Lists (already provisioned)

| SP List | Purpose | Discriminator | Migrates from |
|---|---|---|---|
| **MainDB_HR** | All general HR forms | `formcode` column | All NSF databases except those below |
| **MainDB_HR_Ext_CWR** | CWR contract worker line items | Parent record ID | `CWRF.nsf` sub-documents |
| **MainDB_HR_Ext_Cafeteria** | Cafeteria inspection checklist items | Parent record ID | `CafeIns.nsf` sub-documents |
| **HRAppraisalRecords** | Performance appraisals | — | `PerfAppraisal.nsf` |
| **HRHealthRegister** | Health / typhoid records | — | `HEInfo.nsf`, `TyphoidInjection.nsf` |
| **HRInterviewPipeline** | Candidate interview tracking | — | `interdb.nsf` |
| **HRRoutingMatrix** | Approval routing config | — | (new — replaces hard-coded ACL groups) |

### 3B. MainDB_HR Column Inventory

```
Core columns (all forms):
  id              → system (auto)
  title           → generated record number
  formcode        → 'BSD', 'CWR', 'EEN', …
  currentaction   → workflow state (replaces Lotus CA / CurrentAction)
  statusKey       → StatusKey0–StatusKey6 (Draft → Archived)
  siteKey         → SiteKey0=Prai / SiteKey1=Johor
  requestoremail  → submitter
  requestordisplayname
  submittedon     → submission timestamp
  department
  section
  division
  company
  employeename    ← Lotus PIC / EmpName / tName
  employeeid      ← Lotus EmpNo / EmpNum / INO
  description     ← primary text field (reason, justification, notes)
  details         ← secondary text (type, programme, category)
  remarks         ← tertiary (cost, hours, amount)
  effectivedate   ← start date / from date / receipt date
  duedate         ← end date / expiry / deadline
  priority
  backupPIC       ← Lotus HOS / backup staff
  documentno      ← Lotus jobno / IssueNo / tRunningNumber
  documenttype
  formversion     ← Lotus revnum / Revision
  revisionno
  vacancyTitle    ← Lotus jobtitle / tPosition
  jobdesignation  ← Lotus EmDesg / tDesignation
  appliedPosition ← Lotus jobtitle (candidate role)
  candidateName   ← Lotus tCandidateName
  lastWorkingDay  ← EEN / ESF
  reasonForLeaving← EEN / ESF Reasons
  exitCategoryKey ← ExitCategoryKey0–2
  exitTypeKey     ← ExitTypeKey0–2

FWWPD-prefixed (foreign worker):
  fwwpdname, fwwpdempno, fwwpddepartment, fwwpdcompany
  fwwpdhostel, fwwpdcomemo, fwwpdpassportnonew
  fwwpdreason, fwwpdremark

EPHR-prefixed (health record):
  ephric, ephrfullname, ephrdept, ephrgender, ephrhp
  ephrmedhist, ephrfollowup, ephrvisual, ephrvision, ephrcompany

ESF-prefixed:
  esfcategory, esfdatesubmitted, esfhr, esfit
  esfservers, esfservice, esfsuggestion, esfage

Computed workflow columns (managed by Power Automate):
  currentapproveremail, currentapproverdisplayname
  currentapprovergroup, currentstage, finalstatus, workflowaction
  recipienthodemail, hODEmail
```

---

## 4. Form-by-Form Field Mapping

### BSD — Backup Staff Database

| Lotus Field | Lotus Form | SharePoint Column | Notes |
|---|---|---|---|
| EmpNo | Form | `employeeid` | Staff number |
| PIC | Form | `employeename` | Staff name |
| Dept | Form | `department` | |
| Section | Form | `section` | |
| Divison | Form | `division` | Typo preserved from source |
| PIC_1, PIC_2, PIC_3 | Form | `details` | Store as JSON array `["name1","name2","name3"]` |
| SubmitDate | Form | `submittedon` | |
| HODDate | Form | `effectivedate` | HOD approval date |
| CurrentAction | Form | `currentaction` | Draft / Submitted / Approved / Rejected / ARCHIVE |
| DocAuthor | Computed | `requestordisplayname` | |
| Revision | View | `revisionno` | |
| StaRem | Form | `description` | Staff remarks |

**Workflow states:**
```
Lotus CurrentAction → SP currentaction
  "Request"    → "Request"    (Draft)
  "Submitted"  → "Submitted"
  "Approved"   → "Approved"
  "Rejected"   → "Rejected"
  "ARCHIVE"    → statusKey = StatusKey6 (Archived)
```

---

### AWHR — Rest Day & Additional Working Hours

| Lotus Field | Lotus Form | SharePoint Column | Notes |
|---|---|---|---|
| Company | WorkExt2 | `company` | |
| Department | WorkExt2 | `department` | |
| Section | WorkExt2 | `section` | |
| IssueNo | WorkExt | `documentno` | Auto-generated by INO agent |
| Category | WorkExt2 | `details` | Rest Day / Public Holiday / Normal OT |
| EmpNo_1…15 | WorkExt2 | — | Up to 15 employees per batch request |
| Name_1…15 | WorkExt2 | `employeename` | First employee; batch stored in ext table |
| DateW_1…15 | WorkExt2 | `effectivedate` | First date |
| AddHrs_1…15 | WorkExt2 | `remarks` | Total hours |
| Reason_1…15 | WorkExt2 | `description` | |
| HOS, HOSName | WorkExt2 | `backupPIC` | HOS = Head of Section |
| HOD, HODName | WorkExt2 | `currentapproverdisplayname` | |
| HOSDate, HODDate | WorkExt2 | `effectivedate` | Approval date |
| CA | WorkExt2 | `currentaction` | Workflow state |
| Submittedon | WorkExt2 | `submittedon` | |

> **Note:** AWHR supports up to 15 employees per submission. The React app currently handles this as a single `employeename` field. For historical migration, encode multi-employee data in `description` as pipe-delimited text. Future iteration: create `MainDB_HR_Ext_AWHR` for line items.

---

### CWR — Contract Worker Requisition

| Lotus Field | Lotus Form | SharePoint Column | Notes |
|---|---|---|---|
| INO / IssueNo | Form | `iNO` / `documentno` | |
| Category | Form | `details` | Contract / Permanent |
| Requestor | Form | `requestordisplayname` | |
| Department | Form | `department` | |
| Area | Form | `section` | |
| NoWorkers | Form | `remarks` | Number of workers needed |
| Workstation | Form | `description` | |
| JD | Form | `vacancyTitle` | Job description summary |
| Designation | Form2 | `jobdesignation` | |
| Vendor | Form | `company` | Vendor/agency name |
| Pax | Form | `remarks` | Confirmed headcount |
| Period | Form | `effectivedate` + `duedate` | Contract from/to |
| HODRemark | Form | `approverremarks` | |
| CurrentAction / CA | Form | `currentaction` | See workflow map below |
| Status | Form | `statusKey` | |

**CWR Workflow states:**
```
Lotus CA → SP currentaction
  "Request"          → "Request"
  "Submitted"        → "Submitted"
  "HODApproval"      → "HODApproval"
  "HRReview"         → "HRReview"
  "VendorAssignment" → "VendorAssignment"
  "HODFinalApproval" → "HODFinalApproval"
  "Completed"        → "Completed"
  "Rejected"         → "Rejected"
  "Withdrawn"        → statusKey = StatusKey6
```

---

### EEN — Employee Exit Notification

| Lotus Field | Lotus Form | SharePoint Column | Notes |
|---|---|---|---|
| EmpNum | EE | `employeeid` | |
| EmpName | EE | `employeename` | |
| EmpDept | EE | `department` | |
| Position | EE | `jobdesignation` | |
| Type / Category | EE | `exitCategoryKey` | Resignation / Retirement / Termination |
| othertype | EE | `details` | Free text if Type = Other |
| ResignedDate | EE | `effectivedate` | Date resignation submitted |
| LastWorkingDay | EE | `lastWorkingDay` | |
| Reasons | EE | `reasonForLeaving` | |
| Progress | EE | `currentstage` | Clearance progress |
| HODRemarks | EE | `approverremarks` | |
| dtDeactivate | EE | `duedate` | IT deactivation date |
| ExtDate | EE | `targetdate` | Extension date if LWD extended |
| CA / eenCurrentAction | EE | `currentaction` | Workflow state |
| Body | Notification | — | Email body — not migrated |

**EEN Workflow states:**
```
  (blank / Request) → "Submitted"   (employee submits)
  "HODApproved"     → "HODApproved" 
  "EDApproved"      → "EDApproved"
  "Completed"       → "Completed"
  "Rejected"        → "Rejected"
```

---

### PAF — Performance Appraisal

> Migrates to `HRAppraisalRecords` (dedicated list), not MainDB_HR.

| Lotus Field | AppForm | HRAppraisalRecords Column | Notes |
|---|---|---|---|
| Year | AppForm | `cycleYear` | Review year |
| EmNo | AppForm | `employeeNo` | |
| EmName | AppForm | — | Look up from employee directory |
| EmDesg | AppForm | — | Not stored (derived) |
| EmDept | AppForm | — | Not stored (derived) |
| R1–R16 | AppForm | — | Rating line items — use ext table if needed |
| TotalRating | AppForm | `rating` | Overall score |
| NameSubmitted / HOD | AppForm | `reviewerEmail` | HOD who reviewed |
| DateSubmitted | AppForm | — | map to SP created/modified |
| CA | AppForm | `statusKey` | Draft → Submitted → Approved |

---

### SR — Staff Requisition

| Lotus Field | SRF Form | SharePoint Column | Notes |
|---|---|---|---|
| tRunningNumber | SRF | `documentno` | Running reference no |
| tPosition | SRF | `vacancyTitle` | Position requested |
| nNumber | SRF | `remarks` | Number of positions |
| tName | SRF | `employeename` | Requestor name |
| tDesignation | SRF | `jobdesignation` | Requestor designation |
| dCompany | SRF | `company` | |
| dDivision | SRF | `division` | |
| dDept | SRF | `department` | |
| tSection | SRF | `section` | |
| SubmitDate / dRequisitionedDate | SRF | `submittedon` | |
| dReviewedDate | SRF | `effectivedate` | HOD review date |
| dVerifiedDate | SRF | — | Verifier date |
| dApprovedDate | SRF | `duedate` | Final approval date |
| tCandidateName | SRF | `candidateName` | Filled candidate |
| CurrentStatus | SRF | `currentaction` | See below |

**SR Workflow states:**
```
  "Request"     → "Request"
  "Submitted"   → "Submitted"
  "HODApproval" → "HODApproval"
  "Approved"    → "Approved"
  "Rejected"    → "Rejected"
```

---

### JD — Job Descriptions

| Lotus Field | jobdesc Form | SharePoint Column | Notes |
|---|---|---|---|
| jobno | jobdesc | `documentno` | JD reference number |
| jobtitle | jobdesc | `vacancyTitle` | |
| repno | jobdesc | `details` | Reports-to position number |
| category | jobdesc | `documenttype` | |
| div / div1 | jobdesc | `division` | |
| department | jobdesc | `department` | |
| section | jobdesc | `section` | |
| effectdate | jobdesc | `effectivedate` | |
| revnum | jobdesc | `revisionno` | |
| jobsum | jobdesc | `description` | Job summary |
| duties | jobdesc | `remarks` | Key duties |
| competency | jobdesc | `profileDetails` | Competency requirements |
| byname | jobdesc | `requestordisplayname` | Prepared by |
| dateapp1 / dateapp2 / dateapp3 | jobdesc | `duedate` | Final approval date |
| status / CurrentAction | jobdesc | `currentaction` | |

---

### ESF — Employee Separation Form

> Note: The Lotus `ESF_all_dxl.xml` is an Employee Survey form; actual Employee Separation logic is in EEN. The ESF code in SharePoint maps to separation data stored via ESF-prefixed columns.

| Lotus Field | SP Column | |
|---|---|---|
| esfcategory | `esfcategory` | Exit category |
| esfdatesubmitted | `esfdatesubmitted` | Separation date |
| esfhr | `esfhr` | HR clearance status |
| esfit | `esfit` | IT clearance status |
| esfservers | `esfservers` | Server access revoked |
| esfservice | `esfservice` | Service record |
| esfsuggestion | `esfsuggestion` | Resignation suggestion / exit comments |
| esfage | `esfage` | Employee age at separation |

---

### HEALTHINFO / TNPRA — Health Information & Typhoid

> Migrates to `HRHealthRegister` (dedicated list).

| Lotus Field | SP Column | Notes |
|---|---|---|
| EmpNo | `employeeNo` | |
| HealthItem / vaccineType | `healthItem` | Annual check / Typhoid / Vision etc. |
| Result / Status | `result` | Pass / Fail / Normal |
| Site | `siteKey` | SiteKey0=Prai, SiteKey1=Johor |
| RecordNo / IssueNo | `recordNo` | |
| ExpiryDate | — | Stored in `result` field or ext table |

---

### INTERVIEWDB — Interview Database

> Migrates to `HRInterviewPipeline` (dedicated list).

| Lotus Field | SP Column | Notes |
|---|---|---|
| CandidateName | `candidateName` | |
| Position (applied) | `position` | |
| Interviewer / DocAuthor | `ownerEmail` | |
| Stage / CurrentAction | `stage` | Screening / Interview / Offer / Joined / Declined |
| IssueNo | `pipelineNo` | |
| Site | `siteKey` | |

---

### FWWPD / FWWPE — Foreign Worker Work Permit / Extension

| Lotus Field | SP Column | Notes |
|---|---|---|
| Name / EmpName | `fwwpdname` | Foreign worker name |
| EmpNo / INO | `fwwpdempno` | Worker ID |
| Department | `fwwpddepartment` | |
| Company | `fwwpdcompany` | Employer / agency |
| Hostel | `fwwpdhostel` | Hostel assignment |
| PassportNoNew | `fwwpdpassportnonew` | New passport number |
| Reason | `fwwpdreason` | |
| Remark | `fwwpdremark` | |
| ExpiryDate | `duedate` | Permit expiry |
| ExtendDate | `effectivedate` | Extension start |
| COMemo | `fwwpdcomemo` | Company memo reference |

---

## 5. Workflow Translation (Agents → Power Automate)

### Common Lotus Agents and Their Power Automate Equivalents

| Lotus Agent | Trigger | Action | Power Automate Flow |
|---|---|---|---|
| `SET` | Field save | Compute running number, set CA, set dates | `When item created` → set `documentno`, `currentaction`, `submittedon` |
| `FORMULA` | Field save | Run @Formula expressions to compute values | `When item created/modified` → update computed columns |
| `INO` | Button click | Generate incremental Issue Number | `When item created` → query max(documentno) and increment |
| `RemPdgHOD` | Scheduled | Send email reminder to HOD when pending > N days | `Recurrence (daily)` → filter pending HOD items → send reminder |
| `RemPdgHR` | Scheduled | Send email reminder to HR team | Same pattern |
| `RemPdgHOS` | Scheduled | Send email reminder to Head of Section | Same pattern |
| `RemPdgAck` | Scheduled | Remind pending acknowledgement | Same pattern |
| `RemPdgReply` | Scheduled | Remind pending reply | Same pattern |
| `RemExpiry` | Scheduled | Alert on expiring permits / health records | `Recurrence (daily)` → filter duedate within 30 days → alert |
| `Refresh Docs` | Agent | Bulk refresh view columns | Not needed — SP list views auto-update |
| `Clear` | Button click | Reset form to draft | `HTTP trigger` → `PATCH` item with `currentaction = 'Request'` |
| `ARCHIVE` | Agent | Move records to archive | `When item modified` → if CA = ARCHIVE set statusKey = StatusKey6 |
| `Move to Draft` | Agent | Revert record to draft | HTTP trigger → PATCH currentaction = 'Request' |
| `DB_NSF` | Background | Sync to another NSF | Deprecated — no equivalent needed |

### Workflow Flow Structure (Standard Approval)

```
Trigger: When SP item is created
│
├─ Step 1: Auto-set documentno (INO format)
│   Format: {formcode}-{YYYYMMDD}-{sequence}
│
├─ Step 2: Set currentaction = 'Request' (draft) or 'Submitted'
│
├─ Step 3 (on Submitted): Send approval email to HOD
│   To: {hODEmail}
│   Subject: "[{formcode}] New Request: {title}"
│   Body: Link to SP item + summary fields
│
├─ Step 4 (HOD approves): Update currentaction = 'HODApproval'
│   → Send notification to HR team / next approver
│
├─ Step 5: Final approval → currentaction = 'Approved'
│   → Send confirmation to requestor
│
└─ Step 6 (any rejection): Update currentaction = 'Rejected'
    → Send rejection with remarks to requestor
```

### Reminder Flow Structure

```
Trigger: Recurrence — Daily at 08:00 MYT
│
├─ Get items from MainDB_HR
│   Filter: currentaction eq 'Submitted'
│            AND submittedon lt [today - 2 days]
│            AND formcode eq '{target form}'
│
├─ For each item:
│   ├─ Check if reminder already sent today (use a SP tracking column)
│   └─ Send email to {currentapproveremail}
│       Subject: "[REMINDER] Pending approval: {title}"
│
└─ Update 'lastReminderSent' column
```

---

## 6. ACL Translation (Notes Groups → SharePoint Permissions)

### Penang (Oleo/PMS) Group Mapping

| Lotus Notes Group / Person | Permission Level | SharePoint Equivalent |
|---|---|---|
| `Oleo Local` | Editor | `HR_Oleo_Members` AAD group → Contribute |
| `Oleo Managers` | Editor | `HR_Oleo_Managers` AAD group → Contribute |
| `Oleo Executives` | Editor | `HR_Oleo_Executives` AAD group → Contribute |
| `HR ACM` | Editor | `HR_ACM_Team` AAD group → Contribute |
| `ACM IT` | Editor | `IT_ACM_Team` AAD group → Contribute |
| `ACM Cafeteria Committee` | Editor | `HR_Cafeteria_Committee` AAD group → Contribute |
| `Notes Administrator Group` | Manager | `SP_SiteAdmins` → Full Control |
| `LocalDomainServers` | Manager | Not migrated (server identity) |
| `-Default-` | No Access | SP site: Remove Everyone access |
| Named persons (CN=Ravi Madhu…) | Manager/Editor | Individual AAD accounts |

### Johor (PanCen) Group Mapping

| Lotus Notes Group | Permission Level | SharePoint Equivalent |
|---|---|---|
| `PanCen Group` | Editor | `HR_PanCen_Members` AAD group → Contribute |
| `Pancen Deputy managers & Above` | Editor | `HR_PanCen_Managers` AAD group → Contribute |
| `Pancen - All Sections HOD & Above` | Editor | `HR_PanCen_HOD` AAD group → Contribute |
| `GDS` | Editor | `HR_GDS_Team` AAD group → Contribute |

### Permission Model for SharePoint Lists

```
MainDB_HR list permissions:
  Full Control  → HR Admins (IT + HR Manager)
  Contribute    → All HR staff (create own records)
  Read          → Read-only viewers

Row-level access (via Power Automate + App):
  Requestor can only edit own records in Request/Draft state
  HOD can approve records from their department
  HR team can edit any record
  IT Admin can override any state
```

---

## 7. Data Extraction Strategy (DXL → SharePoint)

### Source Format
- Each Lotus database was exported as a DXL (XML) file
- Location: `source/dxl/XML_HR_Penang/` and `source/dxl/XML_HR_Johor/`
- File naming: `{FORMCODE}_all_dxl.xml` (Penang) or `{N}_{DBName}_all_dxl.xml` (Johor)

### Extraction Pipeline

```
Step 1 — Parse DXL XML
  Input:  {formcode}_all_dxl.xml
  Tool:   Python / PowerShell XML parser
  Output: JSON array of document records with all field values

Step 2 — Field normalization
  Map Lotus field names → SP column names (see §4 tables)
  Handle multi-value fields (pipe-separated or JSON array)
  Normalize dates: Notes datetime → ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  Map Lotus CurrentAction values → SP currentaction values

Step 3 — Site tagging
  Penang files → siteKey = 'SiteKey0'
  Johor files  → siteKey = 'SiteKey1'
  Add formcode column value

Step 4 — Deduplication check
  Query existing SP items with same documentno + siteKey
  Skip if already migrated (track in migration log CSV)

Step 5 — Load to SharePoint
  Use PnP PowerShell or SharePoint REST API (PATCH)
  Batch size: 100 items per request
  Log success / failure to migration-log.csv

Step 6 — Attachment migration
  Extract embedded attachments from DXL ($FILE items)
  Upload to SP item's attachments
```

### DXL Record Structure

```xml
<!-- Example: BSD document record in DXL -->
<document form='Form'>
  <noteinfo noteid='...' unid='...' sequence='...' />
  <item name='CurrentAction'><text>Submitted</text></item>
  <item name='PIC'><text>Ahmad Bin Ali</text></item>
  <item name='EmpNo'><text>EMP-0042</text></item>
  <item name='Dept'><text>Production</text></item>
  <item name='Section'><text>Blending</text></item>
  <item name='PIC_1'><text>Siti Binti Omar</text></item>
  <item name='SubmitDate'><datetime>20240312T090000,00+08</datetime></item>
</document>
```

### Extraction Script Template (PowerShell)

```powershell
# Load DXL XML
[xml]$dxl = Get-Content ".\BSD_all_dxl.xml" -Encoding UTF8

# Extract all documents
$documents = $dxl.database.document | Where-Object { $_.form -eq 'Form' }

foreach ($doc in $documents) {
    $fields = @{}
    foreach ($item in $doc.item) {
        $name = $item.GetAttribute('name')
        $value = $item.text ?? $item.datetime ?? $item.number
        $fields[$name] = $value
    }

    # Map to SP columns
    $spItem = @{
        title           = "BSD-$($fields['EmpNo'])-$(Get-Date -Format 'yyyyMMdd')"
        formcode        = 'BSD'
        siteKey         = 'SiteKey0'   # Penang
        currentaction   = $fields['CurrentAction'] ?? 'Request'
        employeename    = $fields['PIC']
        employeeid      = $fields['EmpNo']
        department      = $fields['Dept']
        section         = $fields['Section']
        submittedon     = $fields['SubmitDate']
        details         = "$($fields['PIC_1'])|$($fields['PIC_2'])|$($fields['PIC_3'])"
    }

    # POST to SharePoint via PnP or REST
    Add-PnPListItem -List "MainDB_HR" -Values $spItem
}
```

---

## 8. Migration Phases & Checklist

### Phase 1 — Preparation (Pre-migration)
- [ ] Provision all SP lists (MainDB_HR, HRAppraisalRecords, HRHealthRegister, HRInterviewPipeline)
- [ ] Create all AAD groups (HR_Oleo_Members, HR_PanCen_Members, etc.)
- [ ] Map all users: Lotus CN=Name/OU/O= → Azure AD UPNs
- [ ] Export all DXL files from both sites
- [ ] Validate DXL files open correctly (check encoding, size)
- [ ] Run inventory count: record count per NSF database
- [ ] Set up migration log spreadsheet (NSF, form, record count, migrated count, errors)

### Phase 2 — Schema Validation
- [ ] Verify all SP column names match field mapping tables in §4
- [ ] Test extraction on 10 records per form code
- [ ] Verify date parsing works (Notes datetime → ISO 8601)
- [ ] Verify multi-value fields encode correctly (pipe-delimited)
- [ ] Verify attachment extraction works for at least one database

### Phase 3 — Historical Data Migration (read-only records)
- [ ] Migrate ARCHIVE / Completed records first (lowest risk)
- [ ] Migrate one form code at a time, validate before next
- [ ] Priority order:
  1. BSD (1,630 known records — largest, simplest structure)
  2. EEN (exit records — critical HR data)
  3. CWR (contract worker records)
  4. JD (job descriptions)
  5. SR, FTCR, INTERN, AWHR
  6. EPHR, HEALTHINFO, TNPRA → HRHealthRegister
  7. PAF, HRAPR → HRAppraisalRecords
  8. INTERVIEWDB → HRInterviewPipeline
  9. FWWPD, FWWPE (foreign worker — sensitive)
  10. GDSN, ESF, EPDU (personal data — handle with PDPA care)

### Phase 4 — Active Record Migration
- [ ] Migrate records in Request / Submitted / Pending state
- [ ] Notify HODs: "Pending items are now in the new system"
- [ ] Freeze Lotus Notes write access (set to Reader)
- [ ] Enable Power Automate flows for active workflows
- [ ] Run parallel validation period (1 week)

### Phase 5 — Cutover
- [ ] Disable Lotus Notes ACL write access
- [ ] Set NSF databases to Read-Only
- [ ] Redirect any bookmarks / Lotus links to SharePoint URL
- [ ] Decommission reminder agents (Notes scheduled agents)
- [ ] Enable all Power Automate reminder flows

### Phase 6 — Post-Migration Validation
- [ ] Record count match: SP count = Lotus count ± tolerance
- [ ] Spot-check 5% of records per form code
- [ ] Verify all workflow states migrated correctly
- [ ] Test new submission → approval cycle end-to-end
- [ ] Verify email reminders fire from Power Automate
- [ ] Archive NSF backup files to cold storage

---

## 9. Cross-Site Consolidation Rules

### Penang-Johor Form Equivalence

Several forms exist in both sites under different database names. During migration, consolidate into a single SP list using `siteKey` to differentiate.

| Penang Form | Johor Equivalent | Consolidated SP formcode |
|---|---|---|
| BSD (`BkStf.nsf`) | PCNBkStf | `BSD` |
| JD (`jobdescNew.nsf`) | pcnjd | `JD` |
| SR (`Staff Requisition.nsf`) | manpowerReq | `SR` |
| ORGCHART (`NewOrgchart.nsf`) | PCNOrgChart | `ORGCHART` |
| NightDuty (`NightDuty.nsf`) | NightVisit | `NDF` |
| TyphoidInjection | TyphoidVaccination | `TNPRA` (→ HRHealthRegister) |
| TMPU / TalentMgmt | PCNTND (Training) | `TMPU` |

### Field Name Conflicts (Penang vs Johor)

| Concept | Penang Field | Johor Field | Resolved SP Column |
|---|---|---|---|
| Employee No | EmpNo, INO | EmpNo, INO | `employeeid` |
| Employee Name | PIC, Name, EmpName | Name, EmpName | `employeename` |
| Department | Dept, Department | Dept, Department | `department` |
| Running Number | IssueNo, INO | IssueNo, INO | `documentno` |
| Workflow State | CurrentAction, CA | CurrentAction, CA | `currentaction` |
| Submit Date | SubmitDate, Submittedon | DateSubmitted | `submittedon` |
| HOD Name | HOD, HODName | HOD | `currentapproverdisplayname` |
| HOD Email | HODEmail, recipienthodemail | HODEmail | `hODEmail` |

### Record Number Format After Migration

```
Historical records (from Lotus):   preserve original INO value in documentno
                                    e.g. "BSD/2024/001"

New records (from React app):       {formcode}-{yyyyMMddHHmmss}-{random3}
                                    e.g. "BSD-20250603141523-042"
```

---

## Appendix A — Lotus Notes Agents Summary

| Agent Pattern | Purpose | Recurring? | PA Flow Type |
|---|---|---|---|
| `SET` | Set CA, compute fields on save | No | `When item created` |
| `FORMULA` | Run @Formula on form | No | `When item created/modified` |
| `INO` | Generate Issue Number | No | `When item created` |
| `RemPdg*` (7+ variants) | Pending reminder emails | Yes (daily/weekly) | `Recurrence` |
| `RemExpiry` | Expiry alerts (permits, health) | Yes (daily) | `Recurrence` |
| `Refresh Docs` | Recompute view columns | Yes (scheduled) | Not needed (SP auto-refreshes) |
| `Clear` | Reset to draft | No (manual) | HTTP trigger + PATCH |
| `Move to Draft` | Revert to draft | No (manual) | HTTP trigger + PATCH |
| `ARCHIVE` | Archive old records | Yes (scheduled) | `Recurrence` → set statusKey |
| `DB_NSF` | Cross-database sync | No | Deprecated |
| `UNLOCK` | Remove edit lock | No (manual) | HTTP trigger + PATCH |

## Appendix B — Data Volume Estimates

| Form Code | Known Record Count | Est. Attachments | Migration Priority |
|---|---|---|---|
| BSD | 1,630 | Medium | High |
| EEN | Unknown | Low | High |
| CWR | Unknown | Medium | High |
| JD | Unknown | High (PDFs) | High |
| PAF | Unknown | Low | Medium |
| AWHR | Unknown | Low | Medium |
| FWWPD | Unknown | High (passports) | Medium |
| TNPRA | Unknown | Low | Medium |
| All other forms | Unknown | Low | Low |
| **Total (estimated)** | **~5,000–15,000** | **~2,000 files** | — |

## Appendix C — PDPA / Sensitive Data Handling

The following columns contain personally identifiable information (PII) requiring special handling:

| Column | Data Class | Handling |
|---|---|---|
| `ephric` (IC number) | Sensitive | Encrypt at rest; restrict read to HR only |
| `ephrfullname` | Personal | Standard access controls |
| `ephrmedhist` | Medical — Sensitive | Restrict to HR + Medical staff only |
| `fwwpdpassportnonew` | Sensitive | Encrypt at rest |
| `employeeid` | Personal | Standard |
| `reasonForLeaving` | Personal | Restrict to HR |
| `esfsuggestion` | Personal | Restrict to HR |
| `gdsnPurpose` / `gdsnDataCollected` | PDPA-classified | Must comply with PDPA consent records; never delete |

> Reference: GDSN (General Data Subject Notification) records must be retained for the full statutory retention period even after employee separation.
