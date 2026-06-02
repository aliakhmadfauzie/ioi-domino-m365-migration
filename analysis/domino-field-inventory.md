# Domino Field Inventory — Complete Portfolio

> **Generated**: 2026-05-31 (Updated: 2026-05-31 — expanded to all departments)
> **Originally Analyzed**: 23 IT forms (20 Penang IT + 3 Johor IT)
> **Total Portfolio**: **~418+ forms across 36 department-sites** (22 Penang + 14 Johor)
> **Total DXL/XML Files**: 23 IT + ~69 HR + ~27 Johor QA = ~119 DXL files
> **Total PDF UI Exports**: 626 clean HCL PDFs + 1,171 extracted = ~1,797
> **HCL PDF Source**: `source/pdf/pdf_form_hcl/hcl_form_pdf/` (organized by site→department)
> **Full Portfolio CSV**: `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` (361 apps)
> **Master XLSX**: `source/pdf/pdf_form_hcl/hcl_form_pdf/Final Apps Inventory.xlsx`

---

## Portfolio Overview

### By Site

| Site | Departments | Est. Forms | HCL PDFs | DXL Available? |
|------|------------|-----------|----------|----------------|
| **Penang (Prai)** | ADMIN, E&I, ENG, FIN, HR, IT, LOG, MKT, MTN, PBI, POM, PRC, PRD, QA, QC, R&D, SA, SEC, SHE, STR, T&D, WH | ~240+ | 372 | IT + HR (partial) |
| **Johor (PanCen)** | FN, HR, IT, LOG, Marketing, MTN, PRC, PRD, Project, QA, QC, SHE, SlsAdmin, STR | ~180+ | 254 | IT + HR + QA (partial) |
| **Total** | **36 department-sites** | **~418+** | **626** | **~119 DXL files** |

### Forms with Deep Analysis (DXL Available)

Forms with DXL/XML source files have complete field-level inventories:

| Department | Forms with DXL | Status |
|-----------|---------------|--------|
| **IT Penang** | 20 forms | ✅ Fully analyzed (domino-field-inventory.csv) |
| **IT Johor** | 3 forms | ✅ Fully analyzed |
| **HR Penang** | 26 forms | ✅ Fully analyzed (analysis/hr-data-source-analysis.md) |
| **HR Johor** | 16 forms | ✅ Fully analyzed |
| **QA Johor** | 27 forms | ✅ Fully analyzed (analysis/qa-qc-data-source-analysis.md) |
| **Other Depts** | 0 forms | 📌 PDF-only — field-level analysis pending |

### Forms with PDF Evidence Only (No DXL)

These forms rely on PDF UI exports and the master app CSV for requirements:

| Department | PDF Count | Est. Forms | Analysis Needed? |
|-----------|-----------|-----------|------------------|
| Penang QA | ~105 | ~55 | 📌 Full inventory needed |
| Penang QC | ~36 | ~36 | 📌 Full inventory needed |
| Penang PRC | ~23 | ~23 | 📌 Full inventory needed |
| Penang SHE | ~22 | ~22 | 📌 Full inventory needed |
| Penang STR | ~16 | ~16 | 📌 Full inventory needed |
| Penang WH | ~16 | ~16 | 📌 Full inventory needed |
| Penang LOG | ~15 | ~15 | 📌 Full inventory needed |
| Penang T&D | ~11 | ~11 | 📌 Full inventory needed |
| Penang PRD | ~11 | ~11 | 📌 Full inventory needed |
| Penang MTN | ~9 | ~9 | 📌 Full inventory needed |
| Penang FIN | ~6 | ~6 | 📌 Full inventory needed |
| Penang E&I | ~6 | ~6 | 📌 Full inventory needed |
| Penang SEC | ~6 | ~6 | 📌 Full inventory needed |
| Penang R&D | ~6 | ~6 | 📌 Full inventory needed |
| Penang MKT | ~5 | ~5 | 📌 Full inventory needed |
| Penang ADMIN | ~4 | ~4 | 📌 Full inventory needed |
| Penang ENG | ~1 | ~1 | 📌 Full inventory needed |
| Penang PBI | ~1 | ~1 | 📌 Full inventory needed |
| Penang POM | ~1 | ~1 | 📌 Full inventory needed |
| Penang SA | ~1 | ~1 | 📌 Full inventory needed |
| Johor QC | ~60 | ~30 | 📌 PDF-only — needs DXL if available |
| Johor Marketing | ~9 | ~9 | 📌 Full inventory needed |
| Johor PRC | ~19 | ~19 | 📌 Full inventory needed |
| Johor PRD | ~14 | ~14 | 📌 Full inventory needed |
| Johor FN | ~5 | ~5 | 📌 Full inventory needed |
| Johor MTN | ~6 | ~6 | 📌 Full inventory needed |
| Johor STR | ~6 | ~6 | 📌 Full inventory needed |
| Johor SHE | ~7 | ~7 | 📌 Full inventory needed |
| Johor LOG | ~3 | ~3 | 📌 Full inventory needed |
| Johor Project | ~2 | ~2 | 📌 Full inventory needed |
| Johor SlsAdmin | ~3 | ~3 | 📌 Full inventory needed |

---

## Form Summary

### Penang IT Forms (20)

| # | Form Name | Database | Fields | Editable | Agents | Views | Workflow |
|---|---|---|---|---|---|---|---|
| 1 | **vpnaccess** | External Access Form (VPN & Citrix) | 21 | 10 | 6 | 19 | ✅ Yes |
| 2 | **newhware** | Hardware Inventory | 58 | 50 | 7 | 27 | ❌ No |
| 3 | **DataRestorationV1** | IT Activity Log - NEW | 16 | 9 | 7 | 9 | ✅ Yes |
| 4 | **PolicyEntry** | IOIOI POLICY | 10 | 8 | 9 | 5 | ❌ No |
| 5 | **Plan** | IT Report - 2026 | 3 | 2 | 6 | 33 | ❌ No |
| 6 | **ISGInfo** | IT Info | 3 | 3 | 3 | 4 | ✅ Yes |
| 7 | **isgdoc** | IT Procedures/Training Manuals | 10 | 7 | 5 | 8 | ❌ No |
| 8 | **AllServerMonitor** | IT Server Checklist 2026 | 27 | 25 | 3 | 12 | ❌ No |
| 9 | **Reminder** | IT Support & Service Request (SSR) 2026 | 23 | 12 | 2 | 11 | ✅ Yes |
| 10 | **ID Request** | Notes ID Request | 27 | 15 | 3 | 5 | ❌ No |
| 11 | **Reminder** | Program Request Form (PRF) 2026 | 23 | 14 | 8 | 11 | ✅ Yes |
| 12 | **changepwd** | Reset Password/Unlock ID | 21 | 9 | 1 | 4 | ❌ No |
| 13 | **SAPAutMatReview** | SAP Authorisation Matrix Review | 26 | 10 | 1 | 4 | ❌ No |
| 14 | **ConfigForm** | SAP Config Access | 16 | 10 | 1 | 2 | ❌ No |
| 15 | **ChangeForm** | SAP & WB Change Request Form | 54 | 33 | 0 | 0 | ✅ Yes |
| 16 | **SAP_DR Issue** | SAP Disaster Recovery (DRP) | 5 | 3 | 2 | 5 | ❌ No |
| 17 | **New Storage Location** | SAP Storage Location Creation Form | 11 | 5 | 3 | 9 | ❌ No |
| 18 | **SignOffForm-Ori** | SAP Sign off Form | 385+ | 110+ | 10+ | 30+ | ✅ Yes |
| 19 | **TRForm** | SAP Transport Request | 34 | 19 | 1 | 8 | ❌ No |
| 20 | **Form** | Share Folder Access Requisition | 26 | 13 | 3 | 5 | ✅ Yes |

### Johor IT Forms (3)

| # | Form Name | Database | Fields | Editable | Agents | Views | Workflow |
|---|---|---|---|---|---|---|---|
| 1 | **newhware** | PanCen - Hardware Inventory | 60 | 50 | 5 | 20+ | ❌ No |
| 2 | **SAP_DR Issue** | PanCen - SAP Disaster Recovery (DRP) | 5 | 3 | 2 | 5 | ❌ No |
| 3 | **External Storage Location** | PanCen - Storage Location Creation Form | 9 | 5 | 2 | 4 | ❌ No |

---

## Penang IT Forms — Detailed Inventory (20 Forms)

| # | Form Name | Database | Fields | Editable | Agents | Views | Workflow |
|---|---|---|---|---|---|---|---|
| 1 | **vpnaccess** | External Access Form (VPN & Citrix) | 21 | 10 | 6 | 19 | ✅ Yes |
| 2 | **newhware** | Hardware Inventory | 58 | 50 | 7 | 27 | ❌ No |
| 3 | **DataRestorationV1** | IT Activity Log - NEW | 16 | 9 | 7 | 9 | ✅ Yes |
| 4 | **PolicyEntry** | IOIOI POLICY | 10 | 8 | 9 | 5 | ❌ No |
| 5 | **Plan** | IT Report - 2026 | 3 | 2 | 6 | 33 | ❌ No |
| 6 | **ISGInfo** | IT Info | 3 | 3 | 3 | 4 | ✅ Yes |
| 7 | **isgdoc** | IT Procedures/Training Manuals | 10 | 7 | 5 | 8 | ❌ No |
| 8 | **AllServerMonitor** | IT Server Checklist 2026 | 27 | 25 | 3 | 12 | ❌ No |
| 9 | **Reminder** | IT Support & Service Request (SSR) 2026 | 23 | 12 | 2 | 11 | ✅ Yes |
| 10 | **ID Request** | Notes ID Request | 27 | 15 | 3 | 5 | ❌ No |
| 11 | **Reminder** | Program Request Form (PRF) 2026 | 23 | 14 | 8 | 11 | ✅ Yes |
| 12 | **changepwd** | Reset Password/Unlock ID | 21 | 9 | 1 | 4 | ❌ No |
| 13 | **SAPAutMatReview** | SAP Authorisation Matrix Review | 26 | 10 | 1 | 4 | ❌ No |
| 14 | **ConfigForm** | SAP Config Access | 16 | 10 | 1 | 2 | ❌ No |
| 15 | **ChangeForm** | SAP & WB Change Request Form | 54 | 33 | 0 | 0 | ✅ Yes |
| 16 | **SAP_DR Issue** | SAP Disaster Recovery (DRP) | 5 | 3 | 2 | 5 | ❌ No |
| 17 | **New Storage Location** | SAP Storage Location Creation Form | 11 | 5 | 3 | 9 | ❌ No |
| 18 | **SignOffForm-Ori** | SAP Sign off Form | 385+ | 110+ | 10+ | 30+ | ✅ Yes |
| 19 | **TRForm** | SAP Transport Request | 34 | 19 | 1 | 8 | ❌ No |
| 20 | **Form** | Share Folder Access Requisition | 26 | 13 | 3 | 5 | ✅ Yes |

### Johor IT Forms (3)

| # | Form Name | Database | Fields | Editable | Agents | Views | Workflow |
|---|---|---|---|---|---|---|---|
| 1 | **newhware** | PanCen - Hardware Inventory | 60 | 50 | 5 | 20+ | ❌ No |
| 2 | **SAP_DR Issue** | PanCen - SAP Disaster Recovery (DRP) | 5 | 3 | 2 | 5 | ❌ No |
| 3 | **External Storage Location** | PanCen - Storage Location Creation Form | 9 | 5 | 2 | 4 | ❌ No |

---

## Penang HR Forms (26 Forms)

> Complete field-level analysis in `analysis/hr-data-source-analysis.md`

| # | Form Code | Database | Est. Fields | Workflow |
|---|-----------|----------|-------------|----------|
| 1 | **AWHR** | Rest Day & Additional Working Hours Requisition | ~50 | ✅ Multi-stage |
| 2 | **BSD** | Backup Staff Database | ~25 | ✅ HOD Approval |
| 3 | **CIR** | Cafeteria Inspection Database | ~40 | ✅ HOD/Committee |
| 4 | **CWR** | Contract Worker Requisition | ~50 | ✅ Multi-stage |
| 5 | **DRD** | Duty Roster Database | ~20 | ✅ HOD Approval |
| 6 | **EEN** | Employee Exit Notification | ~25 | ✅ ED Approval |
| 7 | **EPDU** | Employee Personal Detail Update | ~30 | ❌ Self-service |
| 8 | **EPHR** | Employee Personal Health Records | ~15 | ❌ Record only |
| 9 | **ESF** | Employee Survey | ~15 | ❌ Anonymous |
| 10 | **FTCR** | Fixed Term Contract Requisition | ~30 | ✅ HOD/HR |
| 11 | **FWWPD** | Foreign Workers Work Permit | ~60 | ✅ Multi-stage |
| 12 | **FWWPE** | Foreign Worker Work Period Extension | ~20 | ✅ HOD/HR |
| 13 | **GDSN** | Gift-Donation-Sponsorship Requisition | ~25 | ✅ HOD/COO |
| 14 | **HEALTHINFO** | Health Info | ~10 | ❌ Info only |
| 15 | **HRAPR** | HR Applications Problem Reporting | ~15 | ✅ IT/HR |
| 16 | **HRINFO** | HR Notice Database | ~8 | ❌ Notice board |
| 17 | **INTERN** | Industrial Trainees Summary | ~20 | ✅ HOD |
| 18 | **INTERVIEWDB** | Interview Database | ~15 | ❌ Record only |
| 19 | **JD** | Job Descriptions | ~50 | ✅ Multi-stage |
| 20 | **NDF** | Night Duty Findings | ~25 | ✅ HOD |
| 21 | **ORGCHART** | Organisation Charts | ~30 | ✅ COO Approval |
| 22 | **OWP** | Outsource Worker Passport & Work Permit | ~35 | ✅ Multi-stage |
| 23 | **PAF** | Performance Appraisal Request | ~80 | ✅ HOD/HR |
| 24 | **SR** | Staff Requisition | ~40 | ✅ Multi-stage |
| 25 | **TMPU** | Talent Management Planning & Update | ~60 | ✅ Multi-stage |
| 26 | **TNPRA** | Typhoid/NPRA Database | ~30 | ✅ HOD/HR |

## Johor HR Forms (16 Forms)

> Complete field-level analysis in `analysis/hr-data-source-analysis.md`

| # | Form Code | Database | Est. Fields | Workflow |
|---|-----------|----------|-------------|----------|
| 1 | **PCNBkStf** | Backup Staff Database | ~20 | ✅ HOD |
| 2 | **cancomp** | Canteen Complaint | ~10 | ✅ |
| 3 | **ContractorReg** | Civil & Engineering Contractors Registration | ~30 | ✅ |
| 4 | **TyphoidVacc** | Company Typhoid Vaccination | ~15 | ✅ |
| 5 | **UniformReq** | Company Uniform Request | ~15 | ✅ |
| 6 | **pcnjd** | Job Descriptions | ~60 | ✅ Multi-stage |
| 7 | **LateComing** | Late Coming Notification | ~15 | ✅ HOD |
| 8 | **manpowerReq** | Manpower Requisition | ~30 | ✅ HOD |
| 9 | **NightVisit** | Night Visit Notification | ~15 | ✅ HOD |
| 10 | **PCNOrgChart** | Organisation Charts | ~20 | ✅ |
| 11 | **AppTest** | Superintendent Visit Notification | ~15 | ✅ |
| 12 | **SpVisit** | Superintendent Visit Notification | ~15 | ✅ |
| 13 | **workins** | Worker Regular Inspection | ~10 | ✅ |
| 14 | **hostel** | Workers Hostel Room Checking | ~25 | ✅ |
| 15 | **PCNTND** | Training Database | ~30 | ✅ |
| 16 | **PCNDriver** | Driver Arrangement Requisition | ~15 | ✅ |

## Johor QA Forms (27 Forms with DXL + Additional PDF-only)

> Complete field-level analysis in `analysis/qa-qc-data-source-analysis.md`

**With DXL**: PCNFL, DataAnalyst, deptkrakpi, QEN, PCNFoodManual, FDAssess, FoodSecManual, FSS, PIMSSOP, PIMSWI, PCIMSQM, ICAR, PCLTM, PCMatQP, PanCenPQP, PCMSDS, PIoRN, PCMasterFilters, PCQltyRec, PCNCR, PCGenOFI, PanCenPAR, QACAR, PCNQAINFO, SDSPCNBM, PanCenSecDoc, PCNSNHManual

**PDF-only**: Validation Database, Site Master, PCMasterlistImp, PCPQ

---

## Functional Categories

### IT Department
#### 1. IT Access & Security (4 forms)
- **External Access Form (VPN/Citrix)** — Multi-level approval workflow
- **Notes ID Request** — ID creation/management
- **Reset Password/Unlock ID** — Password management
- **Share Folder Access Requisition** — File share access

#### 2. IT Asset & Inventory (3 forms)
- **Hardware Inventory** — 50+ editable fields (PC specs, printers, network)
- **IT Activity Log** — Data restoration, server reboot tracking
- **IT Server Checklist** — Server monitoring checklist

### 3. IT Service Desk (2 forms)
- **IT Support & Service Request (SSR)** — Case tracking with INO auto-numbering
- **IT Report** — Reporting dashboard

### 4. IT Governance (3 forms)
- **IOIOI POLICY** — Policy document management
- **IT Info** — Information repository
- **IT Procedures/Training Manuals** — Document library

### 5. SAP Governance (7 forms)
- **SAP Authorisation Matrix Review** — Access matrix
- **SAP Config Access** — Configuration access
- **SAP & WB Change Request Form** — 54-field change management
- **SAP Disaster Recovery (DRP)** — DR planning
- **SAP Storage Location Creation Form** — Storage setup
- **SAP Sign off Form** — 385+ field complex form
- **SAP Transport Request** — Transport management

### 6. Business Processes (2 forms)
- **Program Request Form (PRF)** — Program approval workflow
- **IT Activity Log** — IT operations tracking

---

## Key Workflow Patterns Identified

| Form | Workflow States | Approvers |
|---|---|---|
| **EAF (VPN/Citrix)** | Request → Submitted → HOD Approval → COO/Director Approval → Done | Dept Head (HOD), COO/Director |
| **ITSSR (Support)** | Draft → Request → (status tracking via CurrentAction) | ISG Team |
| **PRF (Program Request)** | Draft → Submitted → ISG Review → Approval | ISG Manager |
| **ChangeForm (SAP Change)** | Draft → Submitted → Approval Chain | Multiple approvers |
| **SignOffForm (SAP SOF)** | Multi-stage sign-off workflow | Department + IT approvers |

---

## Fields by Form
### Form: vpnaccess (External Access Form - VPN & Citrix)
| Field Name | Data Type | Kind | Purpose |
|---|---|---|---|
| User | text | editable | Requesting user name |
| justification | text | editable | Reason for access |
| comment1-4 | text | editable | Approval comments |
| RequestedBy | names | editable | Requestor name |
| Type | text | editable | Access type |
| AgentName | text | editable | Agent/application name |
| ClientID | text | editable | Client identifier |
| Group | text | editable | User group |
| system | text | editable | System name |
| date1-5 | datetime | computed | Timestamp for each approval stage |
| HODNAME | names | computed | Dept Head who approved |
| DIVNAME | names | computed | Division/Director who approved |
| name4-5 | names | computed | Additional approver names |
| currentaction | text | computed | Workflow state tracker |
| status1-4 | text | computed | Approval status per stage |
| IsMgr | text | computed | Is manager flag |
| isPCN | text | computed | PCN indicator |
| depthead | names | computed | Department head field |
| HApp | names | computed | Higher approver |
| req | names | computed | Requestor field |
| SendTo | names | computed | Notification target |
| CC | names | computed | CC list |
| Country | text | computed | Country |
| Requestor | names | computed | Requestor |

### Form: newhware (Hardware Inventory)
| Field Name | Data Type | Kind | Purpose |
|---|---|---|---|
| machineid | text | editable | Machine ID |
| usedby | text | editable | User assigned to |
| macdesc | text | editable | Machine description |
| comp | keyword | editable | Computer type |
| cpuspd | keyword | editable | CPU speed |
| hddtype | keyword | editable | HDD type |
| ram | keyword | editable | RAM size |
| inch | keyword | editable | Monitor size |
| ipadd_1 | text | editable | IP address |
| winversion | keyword | editable | Windows version |
| MACAddress | text | editable | MAC address |
| SerialNo | text | editable | Serial number |
| Location | text | editable | Location |
| Printer | text | editable | Printer details |
| ... 45+ more fields | | | |

### Form: ChangeForm (SAP & WB Change Request)
| Field Name | Data Type | Kind | Purpose |
|---|---|---|---|
| (54 fields total) | mixed | mixed | Change request management |
| currentaction | text | computed | Workflow state |

### Form: Reminder / RemSSR (IT Support & Service Request)
| Field Name | Data Type | Kind | Purpose |
|---|---|---|---|
| (23 fields total) | mixed | mixed | Service request tracking |
| CaseNo | text | editable | Case number |
| ReportedBy | text | editable | Reporter name |
| CreationDate | datetime | computed | Date created |
| INO | text | computed | Auto-number field |
| CA | text | editable | Category |
| Category | text | editable | Request category |
