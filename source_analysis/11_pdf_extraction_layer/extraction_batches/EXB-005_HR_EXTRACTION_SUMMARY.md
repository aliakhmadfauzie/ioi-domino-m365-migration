# EXB-005 HR Extraction Batch Summary

> Batch: EXB-005 | Date: 2026-06-02 | Department: HR (Prai)
> PDFs: 3 | Method: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---:|---|---:|---|
| SRC-HR-013 | GDSN.pdf | 3 | Gift/Donation/Sponsorship Notification | 1,210 | Yes |
| SRC-HR-014 | HEALTHINFO.pdf | 2 | HR Information / Notice | 369 | Yes |
| SRC-HR-015 | HRAPR.pdf | 3 | HR Applications Problem Reporting | 1,323 | Yes |
| Total |  | 8 pages |  | 2,902 chars | 3/3 |

## 2. Field Candidates Extracted

| PDF | Label Pairs | Repeating/Table Signals | Notes |
|---|---:|---:|---|
| GDSN.pdf | 32 | Hidden routing fields | HOD endorsement / notification workflow |
| HEALTHINFO.pdf | 10 | View counter/status update fields | Information broadcast / non-approval |
| HRAPR.pdf | 32 | Case number and audit/reminder fields | Problem-report handling workflow |
| Total | 74 | No repeating child-table structures detected | Candidate counts exclude summarized hidden fields where applicable |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | Notes |
|---|---|---:|---|
| GDSN.pdf | HOD endorsement / notification workflow candidate | 4 | CurrentAction and multi-department notification routing visible. |
| HEALTHINFO.pdf | Information broadcast / non-approval candidate | 4 | CurrentAction exists but no approval block appears in extracted text. |
| HRAPR.pdf | Problem-report handling workflow candidate | 7 | Requestor submission, ISG/GHR handling, rejection, acceptance, and archive states visible. |

## 4. Extraction Artifacts Created

| Artifact Type | Location | Count |
|---|---|---:|
| Raw text | `raw_text/{FORM}_pageN.txt` | 8 |
| Page inventory | `page_inventory/EXB-005_page_inventories.md` | 1 |
| Field candidates | `field_candidates/SRC-HR-01{3-5}_*_FIELD_CANDIDATES.md` | 3 |
| Visual notes | `visual_notes/SRC-HR-01{3-5}_*_visual_notes.md` | 3 |
| Workflow candidates | `workflow_candidates/SRC-HR-01{3-5}_*_workflow_candidates.md` | 3 |

## 5. Quality Review Readiness

EXB-005 is ready for quality review. All three PDFs opened successfully and all pages produced extractable text. HEALTHINFO has very little text and should be reviewed as a compact information/notice form rather than a workflow-heavy form.

## 6. Next Step

Run `TASK-QUALITY-EXB-005` before promoting GDSN, HEALTHINFO, or HRAPR to formal source requirements.

