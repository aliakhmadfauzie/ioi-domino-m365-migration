# EXB-002 HR Promotion Summary

> **Date**: 2026-06-01 | **Batch**: EXB-002 | **Status**: ✅ Promoted

## 1. Forms Promoted

| Source ID | Form Name | Quality | Decision |
|---|---|---|---|
| SRC-HR-004 | Contract Worker Requisition (CWR) | 96/100 | ⚠️ Promote with Human Confirmation |
| SRC-HR-005 | Duty Roster Database (DRD) | 98/100 | ✅ Promote Now |
| SRC-HR-006 | Employee Exit Notification (EEN) | 93/100 | ⚠️ Promote with Human Confirmation |

## 2. Requirement Files Created

| File | Fields | Sections | Pages |
|---|---|---|---|
| `HR/SRC-HR-004_CWR_REQUIREMENTS.md` | 62 | 8 | 4 |
| `HR/SRC-HR-005_DRD_REQUIREMENTS.md` | 35 | 5 | 2 |
| `HR/SRC-HR-006_EEN_REQUIREMENTS.md` | 70 | 8 | 8 |

## 3. Fields Promoted

| Form | Promoted | Not Promoted |
|---|---|---|
| CWR | 62 | 0 |
| DRD | 35 | 0 |
| EEN | 70 | 0 |
| **Total** | **167** | **0** |

## 4. Workflow Rules Promoted

| Form | Classification | Stages | Key Evidence |
|---|---|---|---|
| CWR | **Required — Clearly Found** | 4 (HOD→DivHead→AGM HR→Requestor) | CurrentAction + SendTo + 4x Approve/Reject + Acknowledge/Deny |
| DRD | **Required — Clearly Found** | 3 (HOS→HOD→HR) | CA alias + HOSApp/HODApp/HRApp + Editor1-4 |
| EEN | **Required — Clearly Found** | Multi (ED+HOD+IT+Withdraw) | CurrentAction + CA + ED APPROVE/REJECT + HOD APPROVE/REJECT |

## 5. Workflow Rules Requiring Confirmation

| Form | Rule |
|---|---|
| CWR | CurrentAction state values unknown |
| EEN | ED role clarification; ED vs HOD approval order |

## 6. Choice Values Missing

| Form | Unknown Choices |
|---|---|
| CWR | Type, PermCategory, Status, CurrentAction |
| DRD | Category, Amend, CA values |
| EEN | Main, Category, Type, ContractStatus, ExitInterview, WDStatus, CA values |
| **Total** | **16 choice fields across 3 forms** |

## 7. Repeating Tables / Child List Candidates

| Form | Table | Recommendation |
|---|---|---|
| CWR | Period Required date rows (3 × 2 sections) | `MainDB_HR_Ext_CWR_Periods` |
| EEN | Exit Interview (5 questions) | `MainDB_HR_Ext_EEN_Interview` |

## 8. SharePoint Design Recommendations

| Form | Parent | Child Lists |
|---|---|---|
| CWR | MainDB_HR | Ext_CWR_Workers, Ext_CWR_Periods |
| DRD | MainDB_HR | — |
| EEN | MainDB_HR | Ext_EEN_Interview |

## 9. Human Confirmation Questions Added

| Form | High | Medium | Low | Total |
|---|---|---|---|---|
| CWR | 1 | 2 | 0 | 3 |
| DRD | 1 | 0 | 1 | 2 |
| EEN | 3 | 2 | 0 | 5 |
| **Total** | **5** | **4** | **1** | **10** |

## 10. Comparison Against EXB-001

| Metric | EXB-001 | EXB-002 | Delta |
|---|---|---|---|
| Forms promoted | 3 | 3 | — |
| Fields promoted | 108 | 167 | +59 |
| Clearly Found Approval | 2 | 3 | +1 |
| Promote Now (no blockers) | 1 (CIR) | 1 (DRD) | — |
| Avg quality score | 94.3 | 95.7 | +1.4 |
| Child list candidates | 3 | 2 | -1 |
| Human confirmations | 14 | 10 | -4 |

## 11. Cumulative HR Progress

| Batch | Forms | Fields | Cumulative |
|---|---|---|---|
| EXB-001 | BSD, AWHR, CIR | 108 | 3 forms |
| EXB-002 | CWR, DRD, EEN | 167 | 6 forms |
| **Total** | | **275** | **6/26 Prai HR (23%)** |

## 12. EXB-003 Readiness

**YES** — 20 Prai HR PDFs remaining. Next: EPDU, EPHR, ESF.
