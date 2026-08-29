# EXB-002 HR Extraction Batch Summary

> **Batch**: EXB-002 | **Date**: 2026-06-01 | **Department**: HR (Prai)
> **PDFs**: 3 | **Method**: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---|---|---|---|
| SRC-HR-004 | CWR.pdf | 4 | Contract Worker Requisition (Outsourcing) | 2,179 | ✅ |
| SRC-HR-005 | DRD.pdf | 2 | Duty Roster Database | 1,431 | ✅ |
| SRC-HR-006 | EEN.pdf | 8 | Employee Exit Notification | 6,683 | ✅ |
| **Total** | | **14 pages** | | **10,293 chars** | **3/3 ✅** |

## 2. Field Candidates Extracted

| PDF | Candidates | Choice Fields (Known) | Repeating Tables |
|---|---|---|---|
| CWR.pdf | 58 | APPROVE/REJECT ×3, Acknowledge/Deny ×1 | ✅ Period Required (3 date rows × 2 sections) |
| DRD.pdf | 62 | Shift Code (10 codes visible) | ❌ None |
| EEN.pdf | 77 | APPROVE/REJECT | ❌ None |
| **Total** | **197** | **5** | **1** |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | CurrentAction | Stages |
|---|---|---|---|---|
| CWR.pdf | **Clearly Found Approval** | 6 signals | ✅ Yes | 4 (HOD→DivHead→AGM HR→Requestor) |
| DRD.pdf | **Clearly Found Approval** | 6 signals | ✅ CA alias | 3 (HOS→HOD→HR) |
| EEN.pdf | **Clearly Found Approval** | 8 signals | ✅ Yes + CA | 2+ (Submit→ED Approve→IT Notify) |

**All 3 forms have clearly documented approval workflows.** Zero Inferred or Unknown classifications.

## 4. Quality Scores

### CWR.pdf (SRC-HR-004)

| Gate | Score | Max |
|---|---|---|
| G1 Page Inventory | 10 | 10 |
| G2 Raw Text (2,179 chars) | 20 | 20 |
| G3 Field Candidates (58, dual-section form) | 23 | 25 |
| G4 Visual Notes (4-stage documented) | 10 | 10 |
| G5 Workflow (CurrentAction + 4-stage ApproveReject) | 15 | 15 |
| G6 Promotion Readiness | 18 | 20 |
| **Total** | **96/100** | |

**Promotion**: ✅ Promote with Human Confirmation

### DRD.pdf (SRC-HR-005)

| Gate | Score | Max |
|---|---|---|
| G1 Page Inventory | 10 | 10 |
| G2 Raw Text (1,431 chars) | 20 | 20 |
| G3 Field Candidates (62, shift code reference) | 24 | 25 |
| G4 Visual Notes (3-stage + shift table) | 10 | 10 |
| G5 Workflow (CA alias + HOS/HOD/HR) | 15 | 15 |
| G6 Promotion Readiness | 19 | 20 |
| **Total** | **98/100** | |

**Promotion**: ✅ Promote

### EEN.pdf (SRC-HR-006)

| Gate | Score | Max |
|---|---|---|
| G1 Page Inventory | 10 | 10 |
| G2 Raw Text (6,683 chars — largest HR form) | 20 | 20 |
| G3 Field Candidates (77, 8-page complex form) | 22 | 25 |
| G4 Visual Notes (exit interview + deactivation + IT notify) | 9 | 10 |
| G5 Workflow (APPROVE/REJECT + CurrentAction + CA) | 15 | 15 |
| G6 Promotion Readiness | 17 | 20 |
| **Total** | **93/100** | |

**Promotion**: ✅ Promote with Human Confirmation (ED role, exit interview structure)

## 5. Promotion Recommendations

| PDF | Score | Recommendation | Blocker |
|---|---|---|---|
| DRD.pdf | 98/100 | ✅ **Promote** | No blockers |
| CWR.pdf | 96/100 | ✅ Promote with Human Confirmation | Status/CurrentAction values |
| EEN.pdf | 93/100 | ✅ Promote with Human Confirmation | ED role, interview structure |

## 6. Comparison Against EXB-001

| Metric | EXB-001 | EXB-002 | Trend |
|---|---|---|---|
| PDFs | 3 | 3 | — |
| Total fields | 131 | 197 | ↑ Larger forms |
| Avg quality score | 94.3 | 95.7 | ↑ Improved |
| Clearly Found Approval | 1 | 3 | ↑ All workflow forms |
| Inferred Approval | 1 | 0 | ↑ Better evidence |
| Not Approval | 1 | 0 | — |
| Repeating tables | 2 | 1 | — |
| Avg pages | 3.0 | 4.7 | ↑ Larger (EEN=8 pages) |

## 7. Manual Review Items

| Item | PDF | Reason |
|---|---|---|
| CWR CurrentAction values | CWR | 4-stage state machine values unknown |
| EEN ED role | EEN | "ED" = Executive Director? Needs confirmation |
| EEN exit interview | EEN | Structured questionnaire — child list or embedded? |
| DRD shift codes | DRD | 10 codes visible — verify completeness |

## 8. Count Reconciliation

| Item | Count |
|---|---|
| PDFs in batch | 3 |
| Pages extracted | 14 |
| Raw text files | 14 |
| Page inventory files | 1 (combined) |
| Visual notes files | 3 |
| Workflow candidate files | 3 |
| Total field candidates | 197 |
| Clearly Found Approval | 3/3 |
| Quality ≥ 90 | 3/3 |

## 9. EXB-002 Safe for Quality Review?

**YES** — All 3 forms have Clearly Found workflow evidence. Zero inferred/unknown classifications. Quality scores all ≥ 93. EXB-002 quality exceeds EXB-001.

---

*EXB-002 complete. 6 of 26 Prai HR PDFs now extracted (23%).*
