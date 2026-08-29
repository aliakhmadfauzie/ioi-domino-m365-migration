# EXB-001 HR Promotion Summary

> **Date**: 2026-06-01 | **Batch**: EXB-001 | **Status**: ✅ Promoted

## 1. Forms Promoted

| Source ID | Form Name | Quality Score | Promotion Status |
|---|---|---|---|
| SRC-HR-003 | Cafeteria Inspection (CIR) | 100/100 | ✅ Promoted |
| SRC-HR-001 | Backup Staff Database (BSD) | 98/100 | ✅ Promoted (Status/CurrentAction need HR) |
| SRC-HR-002 | Rest Day & Additional Working Hours (AWHR) | 85/100 | ✅ Promoted (CA=CurrentAction confirmed during promotion) |

## 2. Requirement Files Created

| File | Fields | Sections | Pages |
|---|---|---|---|
| `HR/SRC-HR-003_CIR_REQUIREMENTS.md` | 22 | 2 | 2 |
| `HR/SRC-HR-001_BSD_REQUIREMENTS.md` | 39 | 5 (A, B, C, D, Hidden) | 3 |
| `HR/SRC-HR-002_AWHR_REQUIREMENTS.md` | 47 | 8 | 4 |

## 3. Fields Promoted

| Form | Promoted | Not Promoted | Reason |
|---|---|---|---|
| CIR | 22 | 0 | All 22 trace to PDF text |
| BSD | 39 | 0 | All 39 trace to PDF text |
| AWHR | 47 | 0 | All 47 trace to PDF text |
| **Total** | **108** | **0** | |

## 4. Workflow Rules Promoted

| Form | Classification | Stages | Evidence |
|---|---|---|---|
| CIR | **Not Required** | 0 | No approval signals beyond standard Domino CurrentAction |
| BSD | **Required — Clearly Found** | 3 (A→C→D) | CurrentAction + "APPROVE REJECT" + HODApp flag + Editor1-3 roles |
| AWHR | **Required — Clearly Found** | 3 (HOS→HOD→HR) | `CA` (CurrentAction alias) + Approve/Reject at HOS + Approve/Reject at HOD + Accept/Deny at HR + HOSApp/HODApp/HRApp flags + Editor1-5 roles |

## 5. Workflow Rules Requiring Confirmation

| Form | Rule | Confidence |
|---|---|---|
| BSD | CurrentAction state values unknown | Needs Human Confirmation |
| AWHR | `CA` state values unknown | Needs Human Confirmation |
| AWHR | Whether HOD can be skipped in 3-stage flow | Needs Human Confirmation |

## 6. Choice Values Missing

| Form | Fields with Unknown Choices |
|---|---|
| CIR | Site, Status, CurrentAction |
| BSD | Division, Department, Section, Revision Required, Status, CurrentAction |
| AWHR | EmpCategory, DayType, CA (CurrentAction), Section, Department, Company |
| **Total** | **15 choice fields need human input** |

## 7. Repeating Tables / Child List Candidates

| Form | Table | Rows | Recommendation |
|---|---|---|---|
| BSD | BACKUP STAFF 1-3 | 3 fixed | `MainDB_HR_Ext_BSD` child list |
| AWHR | Working Hours Table | 15 fixed | `MainDB_HR_Ext_AWHR` child list |

## 8. SharePoint Design Recommendations

| Form | Parent List | Child List | Parent Cols | Child Cols |
|---|---|---|---|---|
| CIR | MainDB_HR | — | 14 | — |
| BSD | MainDB_HR | MainDB_HR_Ext_BSD | 25+ | 4 |
| AWHR | MainDB_HR | MainDB_HR_Ext_AWHR | 30+ | 10 |

## 9. AWHR Correction During Promotion

| Before Promotion | After Full Extraction |
|---|---|
| CurrentAction: "Not confirmed" | **`CA` = CurrentAction alias** — found in hidden fields |
| Approval: "Inferred" | **Upgraded to Clearly Found** — 3-stage with Approve/Reject + Accept/Deny |
| HR Use: "Not documented" | **Documented** — HR Accept/Deny with HRCom, HRName, HRDate, HRAtt, HRApp |
| Withdrawal: Not noted | **Documented** — WDBy, WDDate, WDReason section |

## 10. Human Confirmation Questions Created

| File | Questions |
|---|---|
| `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` | 21 total (HR: 14, IT: 7) |

## 11. Can EXB-002 Proceed?

**YES** — Method proven for HR forms. PyMuPDF extracts `label : fieldname` pairs reliably. Promotion pipeline validated end-to-end with CIR (100/100).

**Recommended EXB-002**: CWR.pdf, DRD.pdf, EEN.pdf (next 3 alphabetically in Prai HR)
