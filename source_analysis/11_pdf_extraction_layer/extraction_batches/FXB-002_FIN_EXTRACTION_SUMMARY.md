# FXB-002 Finance Extraction Batch Summary

> Batch: FXB-002 | Date: 2026-06-02 | Department: FIN (Prai)
> PDFs: 3 | Method: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---:|---|---:|---|
| SRC-FIN-004 | CMF_C.pdf | 5 | Review of Customers on Credit | 3,457 | Yes |
| SRC-FIN-005 | EARF.pdf | 4 | Expenditure Appropriation Request Form | 2,611 | Yes |
| SRC-FIN-006 | RSES.pdf | 2 | Reversal Service Entry Sheet | 697 | Yes |
| Total |  | 11 pages |  | 6,765 chars | 3/3 |

## 2. Field Candidates Extracted

| PDF | Label Pairs | Repeating/Table Signals | Notes |
|---|---:|---:|---|
| CMF_C.pdf | 22 grouped candidates | 50 customer review rows | Customer row field names need DXL confirmation because some extracted names are visually truncated |
| EARF.pdf | 32 grouped candidates | 5 asset rows, 5 SAP PR rows | Low-value asset request with Finance verification and completion |
| RSES.pdf | 18 label candidates | None | Compact two-stage service-entry reversal |
| Total | 72 grouped candidates | Multiple fixed-row structures | Repeating rows summarized as structures, not flattened individually |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | Notes |
|---|---|---:|---|
| CMF_C.pdf | Multi-stage customer credit review workflow | 7 | Marketing endorsement, GM/section approval, Finance review, ED approval, Finance acknowledgement |
| EARF.pdf | Low-value asset approval and completion workflow | 7 | Finance verification, HOD/reviewer/division approvals, completion and cancellation |
| RSES.pdf | Two-stage approver and Finance workflow | 4 | Approver acceptance followed by Finance completion/rejection |

## 4. Extraction Artifacts Created

| Artifact Type | Location | Count |
|---|---|---:|
| Raw text | `raw_text/{FORM}_pageN.txt` | 11 |
| Page inventory | `page_inventory/FXB-002_page_inventories.md` | 1 |
| Field candidates | `field_candidates/SRC-FIN-00{4-6}_*_FIELD_CANDIDATES.md` | 3 |
| Visual notes | `visual_notes/SRC-FIN-00{4-6}_*_visual_notes.md` | 3 |
| Workflow candidates | `workflow_candidates/SRC-FIN-00{4-6}_*_workflow_candidates.md` | 3 |

## 5. Quality Review Readiness

FXB-002 is ready for quality review. All three PDFs opened successfully and all pages produced usable text. CMF_C and EARF contain fixed-row table structures that should be confirmed before SharePoint schema generation.

## 6. Next Step

Run `TASK-QUALITY-FXB-002` before promoting CMF_C, EARF, or RSES to formal source requirements.

