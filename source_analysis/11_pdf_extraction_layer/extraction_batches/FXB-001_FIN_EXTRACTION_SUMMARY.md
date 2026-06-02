# FXB-001 Finance Extraction Batch Summary

> Batch: FXB-001 | Date: 2026-06-02 | Department: FIN (Prai)
> PDFs: 3 | Method: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---:|---|---:|---|
| SRC-FIN-001 | CAR.pdf | 11 | Capital Appropriation Request | 9,865 | Yes |
| SRC-FIN-002 | CMF_A.pdf | 5 | Approval for Credit Application Form | 2,407 | Yes |
| SRC-FIN-003 | CMF_B.pdf | 4 | Temporary Credit Limit Change Form | 2,005 | Yes |
| Total |  | 20 pages |  | 14,277 chars | 3/3 |

## 2. Field Candidates Extracted

| PDF | Label Pairs | Repeating/Table Signals | Notes |
|---|---:|---:|---|
| CAR.pdf | 42 grouped label candidates | 10 investment rows, 50 PO rows, 12 completion-saving rows | Complex capital approval plus completion lifecycle |
| CMF_A.pdf | 25 label candidates | Hidden routing/editor fields | Fresh credit application approval |
| CMF_B.pdf | 25 label candidates | Hidden routing/editor fields | Temporary credit limit change approval |
| Total | 92 grouped candidates | Multiple fixed-row structures | CAR table rows summarized as structures, not flattened individually |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | Notes |
|---|---|---:|---|
| CAR.pdf | Complex multi-stage capital approval and completion workflow | 8 | Amount threshold matrix and extensive completion workflow visible |
| CMF_A.pdf | Multi-stage credit approval workflow | 8 | GM, Finance, SFC, SGM/ED, Finance acknowledgement |
| CMF_B.pdf | Temporary credit limit approval workflow | 8 | Marketing, GM, Finance, ED, Finance acknowledgement with expiry |

## 4. Extraction Artifacts Created

| Artifact Type | Location | Count |
|---|---|---:|
| Raw text | `raw_text/{FORM}_pageN.txt` | 20 |
| Page inventory | `page_inventory/FXB-001_page_inventories.md` | 1 |
| Field candidates | `field_candidates/SRC-FIN-00{1-3}_*_FIELD_CANDIDATES.md` | 3 |
| Visual notes | `visual_notes/SRC-FIN-00{1-3}_*_visual_notes.md` | 3 |
| Workflow candidates | `workflow_candidates/SRC-FIN-00{1-3}_*_workflow_candidates.md` | 3 |

## 5. Quality Review Readiness

FXB-001 is ready for quality review. All three PDFs opened successfully and all pages produced extractable text. CAR is complex enough that its table storage and approval thresholds should be confirmed before SharePoint schema or app build work.

## 6. Next Step

Run `TASK-QUALITY-FXB-001` before promoting CAR, CMF_A, or CMF_B to formal source requirements.

