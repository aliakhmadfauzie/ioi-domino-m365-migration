# EXB-003 HR Extraction Batch Summary

> **Batch**: EXB-003 | **Date**: 2026-06-01 | **Department**: HR (Prai)
> **PDFs**: 3 | **Method**: PyMuPDF direct text extraction

## 1. PDFs Processed

| Source ID | File | Pages | Form Name | Raw Text (chars) | Text Extractable |
|---|---|---:|---|---:|---|
| SRC-HR-007 | EPDU.pdf | 3 | Employee Personal Detail Update | 2313 | ✅ |
| SRC-HR-008 | EPHR.pdf | 2 | Employee Personal Health Record | 953 | ✅ |
| SRC-HR-009 | ESF.pdf | 3 | Employee Survey Form | 2183 | ✅ |
| **Total** | | **8 pages** | | **5449 chars** | **3/3 ✅** |

## 2. Field Candidates Extracted

| PDF | Label Pairs | Standalone Table/System Codes | Repeating/Table Signals |
|---|---:|---:|---:|
| EPDU.pdf | 35 | 143 | 137 |
| EPHR.pdf | 21 | 25 | 21 |
| ESF.pdf | 14 | 50 | 46 |
| **Total** | **70** | **218** | **204** |

## 3. Workflow Candidates Found

| PDF | Classification | Signals | Notes |
|---|---|---:|---|
| EPDU.pdf | HR review / notification candidate | 6 | Candidate pending quality review; do not promote until reviewed. |
| EPHR.pdf | Not approval / record form candidate | 2 | Candidate pending quality review; do not promote until reviewed. |
| ESF.pdf | Not approval / survey form candidate | 4 | Candidate pending quality review; do not promote until reviewed. |

## 4. Extraction Artifacts Created

| Artifact Type | Location | Count |
|---|---|---:|
| Raw text | `raw_text/{FORM}_pageN.txt` | 8 |
| Page inventory | `page_inventory/EXB-003_page_inventories.md` | 1 |
| Field candidates | `field_candidates/SRC-HR-00{7-9}_*_FIELD_CANDIDATES.md` | 3 |
| Visual notes | `visual_notes/SRC-HR-00{7-9}_*_visual_notes.md` | 3 |
| Workflow candidates | `workflow_candidates/SRC-HR-00{7-9}_*_workflow_candidates.md` | 3 |

## 5. Quality Review Readiness

EXB-003 is ready for quality review. All three PDFs opened successfully and all pages produced extractable text. Field candidates include standalone table/system codes that must be reviewed carefully before promotion.

## 6. Next Step

Run `TASK-QUALITY-EXB-003` before promoting EPDU, EPHR, or ESF to formal source requirements.
