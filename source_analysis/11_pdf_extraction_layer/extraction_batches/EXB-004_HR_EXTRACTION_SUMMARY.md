# EXB-004 HR Extraction Batch Summary

> Batch: EXB-004 | Date: 2026-06-02 | Department: HR (Prai)
> PDFs: 3 | Method: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---:|---|---:|---|
| SRC-HR-010 | FTCR.pdf | 4 | Fixed Term Contract Requisition Form | 2,822 | Yes |
| SRC-HR-011 | FWWPD.pdf | 5 | Foreign Workers Work Permit Database | 3,378 | Yes |
| SRC-HR-012 | FWWPE.pdf | 4 | Foreign Worker Work Period Extension | 2,069 | Yes |
| Total |  | 13 pages |  | 8,269 chars | 3/3 |

## 2. Field Candidates Extracted

| PDF | Label Pairs | Repeating/Table Signals | Notes |
|---|---:|---:|---|
| FTCR.pdf | 42 | 10 background-history rows + routing fields | Multi-stage approval form |
| FWWPD.pdf | 24 | 4 fixed 10-row administrative tables | Database/record form with task reminders |
| FWWPE.pdf | 47 | Workflow completion/withdrawal sections | Multi-stage extension approval form |
| Total | 113 | Multiple fixed-row structures | Candidate counts exclude hidden routing fields where summarized |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | Notes |
|---|---|---:|---|
| FTCR.pdf | Clearly found multi-stage approval candidate | 6 | Requires business confirmation of role order and status values. |
| FWWPD.pdf | Permit record / task tracking candidate | 4 | Has CurrentAction/routing fields but no visible request approval chain. |
| FWWPE.pdf | Clearly found multi-stage approval/workflow candidate | 8 | Superior -> HOS -> HOD -> HR -> completion/withdrawal path visible. |

## 4. Extraction Artifacts Created

| Artifact Type | Location | Count |
|---|---|---:|
| Raw text | `raw_text/{FORM}_pageN.txt` | 13 |
| Page inventory | `page_inventory/EXB-004_page_inventories.md` | 1 |
| Field candidates | `field_candidates/SRC-HR-01{0-2}_*_FIELD_CANDIDATES.md` | 3 |
| Visual notes | `visual_notes/SRC-HR-01{0-2}_*_visual_notes.md` | 3 |
| Workflow candidates | `workflow_candidates/SRC-HR-01{0-2}_*_workflow_candidates.md` | 3 |

## 5. Quality Review Readiness

EXB-004 is ready for quality review. All three PDFs opened successfully and all pages produced extractable text. FWWPD should be reviewed as a supporting foreign-worker permit database form, while FWWPE is the work-period extension workflow form.

## 6. Next Step

Run `TASK-QUALITY-EXB-004` before promoting FTCR, FWWPD, or FWWPE to formal source requirements.

