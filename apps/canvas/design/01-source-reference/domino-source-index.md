# Domino Source Index

> All 361 Domino forms extracted as PDF requirements, organized by site and department.
> Primary source: `analysis/source_analysis/10_master_app_sources/requirements/`
> Last updated: 2026-06-02

---

## Summary

| Metric | Value |
|---|---|
| Total forms | 361 |
| Sites | Johor (129), Penang/Prai (232) |
| Status Extracted | 287 |
| Status Extracted - Needs Review | 74 |
| Total fields extracted | 22,074 |

---

## How to Navigate Source Files

Each form has one master source document at:
```
analysis/source_analysis/10_master_app_sources/requirements/{Site}/{Dept}/MASTER-{NNN}_{AppName}_SOURCES.md
```

This document contains:
1. Basic information (site, owner, form code, blueprint)
2. PDF evidence (source PDF path, page count, field count)
3. Form sections (all section headers)
4. Field extraction (label, PDF field name, recommended type)
5. Workflow signals (keywords found: approved, hod, reject, etc.)

---

## Johor Forms by Department

### FIN — Finance (6 forms)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 2 | CAR | PanCen - Capital Appropriation Request | Extracted |
| 3 | CMF_A | PanCen - Credit Management Forms | Extracted |
| 4 | INSUCLAI | PanCen - Insurance Claim | Extracted |
| — | CMF_B | Credit Management Form B | Extracted |
| — | CMF_C | Credit Management Form C | Extracted |
| — | EARF | Expenditure Appropriation Request Form | Extracted |

### HR — Human Resources (selected)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 5 | CIR | PanCen - Civil & Engineering Contractors Registration | Extracted |
| 7 | BSD | PanCen - Backup Staff Database | Extracted |
| 8 | CANTCOMP | PanCen - Canteen Complaint | Extracted |
| 9 | CWR | PanCen - Company Uniform Request | Extracted - NR |
| 11 | JD | PanCen - Job Descriptions | Extracted |
| 12 | NDF | PanCen - Late Coming Notification | Extracted |
| 13 | SR | PanCen - Manpower Requisition | Extracted |
| 14 | NDF | PanCen - Night Visit Notification | Extracted |
| 16 | PAF | PanCen - Performance Appraisal | Extracted |
| 20 | TNPRA | Pancen - Company Typhoid Vaccination | Extracted |

### IT — Information Technology (Johor)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 21 | HARDINVE | PanCen - Hardware Inventory | Extracted |
| 22 | SAPDISARECO | PanCen - SAP Disaster Recovery (DRP) | Extracted - NR |
| 23 | STORLOCACREA | PanCen - Storage Location Creation Form | Extracted |

### QA — Quality Assurance (Johor, selected)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 73 | CHANCONT | PanCen - Change Control Form | Extracted - NR |
| 77 | INTECORRACTI | PanCen - Internal Corrective Action 2014-Current | Extracted |
| 78 | ISSUOFRECO | PanCen - Issuance of Records Number | Extracted |

> **Full list:** See `analysis/source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md` rows 1–129 for all Johor forms.

---

## Penang/Prai Forms by Department

### IT — Information Technology (Penang, selected)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 171 | EXTACC | External Access Form (VPN & Citrix) | Extracted |
| 173 | SSR | IT Support & Service Request (SSR) 2025 | Extracted - NR |
| 175 | PRF | Program Request Form (PRF) 2025 | Extracted - NR |
| 177 | SAPAMR | SAP Authorisation Matrix Review | Extracted - NR |
| 178 | SAPSOF | SAP Sign off Form | Extracted |
| 179 | UR | User ID Requisition Form (UR) 2025 | Extracted - NR |
| 184 | RS | Reset Password/Unlock ID | Extracted |
| 185 | STORLOCACREA | SAP - Storage Location Creation Form | Extracted - NR |
| 187 | SAPDISARECO | SAP Disaster Recovery (DRP) | Extracted - NR |
| 188 | SFAR | Share Folder Access Requisition | Extracted |

### HR — Human Resources (Penang, selected)
| Master # | Form Code | Application Name | Status |
|---|---|---|---|
| 147 | AWHR | Rest Day & Additional Working Hours Requisition | Extracted |
| 148 | TMPU | Talent Management - Planning & Update | Extracted |
| 149 | EEN | Employee Exit Notification (NEW) | Extracted - NR |
| 158 | CWR | Contract Worker Requisition Form | Extracted |
| 160 | EPDU | Employee Personal Detail Update | Extracted |

> **Full list:** See `analysis/source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md` rows 130–361 for all Penang/Prai forms.

---

## Important Source Notes

### Forms with Unknown Approval Status (DO NOT BUILD approval sections yet)
| Master # | Form Code | Application Name |
|---|---|---|
| 21 | HARDINVE | PanCen - Hardware Inventory (Johor) |
| 145 | EPHR | Employee Personal Health Record (Penang) |
| 183 | ITSRVCHK | IT Server Checklist 2025 (Penang) |
| 350 | TRAINATT | Training Attendance (Penang) |
| 356 | CONTRAGREE | Contractor/Vendor Agreement (Penang) |

### Production Forms with MOCK codes (Do NOT build these)
The TSX `pages/production/forms/index.tsx` contains these invented form codes that DO NOT exist in the master register. Ignore them entirely:
- SAM-001 through SAM-006
- TPM-002 through TPM-008
- CCP-001 through CCP-006
- MM-001 through MM-006
- PR-001 through PR-008
- PC-001 through PC-008
- EQ-001 through EQ-006
- PQ-001 through PQ-006
- WD-001 through WD-004

The REAL promoted PRD form codes (from master register) are:
`TPM`, `BHTADDI`, `FILTCLOTREPL`, `OPRPCCPFILT`, `STOCALLOMEMO`, `STORTANKCLEA`, `WEIGSCALVERI`, `EQUIPREINSP`, `SAPMATEMAST`, `CCP1FILTINSP`, `STORTANKVERI`
