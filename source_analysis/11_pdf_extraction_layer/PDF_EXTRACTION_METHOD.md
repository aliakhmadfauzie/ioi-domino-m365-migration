# PDF Extraction Method

> **Version**: 1.0 | **Date**: 2026-06-01
> **Tool**: PyMuPDF (fitz) — `pip install pymupdf`
> **Applies to**: All Domino PDF forms (IT and non-IT)

## Overview

The PDF extraction layer is the controlled intermediate step between raw PDF files and promoted source requirements. It ensures no fields, choices, sections, or workflows are hallucinated — everything traces to PDF evidence.

## Stage 1: Page Inventory

**Script pattern**:
```python
import fitz, os
doc = fitz.open(pdf_path)
print(f"Pages: {len(doc)}")
for i, page in enumerate(doc):
    text = page.get_text()
    print(f"Page {i+1}: {len(text)} chars")
```

**Output**: `page_inventory/{SRC-ID}_page_inventory.md`

Record per PDF:
| Field | Description |
|---|---|
| Source ID | From `PDF_FORM_INVENTORY.md` |
| File path | Full absolute path |
| Page count | `len(doc)` |
| Form name visible | From PDF title text |
| Department visible | From folder path or PDF content |
| Sections visible | By scanning for section headers |
| Tables visible | By scanning for columnar patterns |
| Signature/approval areas | Keyword scan |
| Choice controls | Keyword scan |
| Has extractable text | `len(text.strip()) > 20` |
| Notes | Any extraction issues |

## Stage 2: Raw Text Extraction

**Script pattern**:
```python
import fitz
doc = fitz.open(pdf_path)
for i, page in enumerate(doc):
    text = page.get_text()
    with open(f"raw_text/{src_id}_page{i+1}.txt", "w") as f:
        f.write(text)
```

**Output**: `raw_text/{SRC-ID}_page{N}.txt`

**Quality gates**:
- ⚠️ If `len(text.strip()) < 20`: mark `OCR Required` or `Image-Only PDF`
- ⚠️ If garbled/unreadable: mark `Manual Review Required`
- ✅ Otherwise: mark `Text Extractable`

## Stage 3: Field Candidate Extraction

Parse `label : fieldname` pairs from raw text.

**Script pattern**:
```python
import re
text = page.get_text()
# Match patterns like "Company : Company" or "Requestor : req"
pairs = re.findall(r'(\w[\w\s/-]+?)\s*:\s*(\w+)', text)
for label, fieldname in pairs:
    print(f"{label.strip()} -> {fieldname}")
```

**Output**: `field_candidates/{SRC-ID}_field_candidates.md`

Each candidate field record:
| Field | Description |
|---|---|
| Candidate ID | `CAND-{SRC}-{NNN}` |
| PDF Label | Exact text before `:` |
| Domino Field Name | Exact text after `:` |
| Page | Page number where found |
| Suggested M365 Type | Text/Date/Choice/Person/Multiline |
| Required | Only if marked in PDF |
| Choices | Only if visible in PDF |
| Status | `Candidate` (not yet promoted) |

## Stage 4: Visual/Structural Notes

For each PDF, document visual layout observations:
- Section headers and their page positions
- Table structures (column headers, row patterns)
- Signature blocks (label + line/box)
- Checkboxes and radio groups
- Dropdown indicators
- Repeating row patterns
- Approval blocks

**Output**: `visual_notes/{SRC-ID}_visual_notes.md`

## Stage 5: Workflow Candidate Extraction

Scan raw text for workflow signals:
- `status` fields
- `CurrentAction` fields
- `Accepted by` / `Approved by` / `Reviewed by`
- `date` fields near approval labels
- `comment` fields near approval labels
- `SendTo` / `Recipients` fields
- Section headers: "ACCEPTANCE OF", "APPROVAL", "REVIEW"
- Multi-stage numbered sections

**Output**: `workflow_candidates/{SRC-ID}_workflow_candidates.md`

**Classification rules**:
- `status1, status2, status3...` → Multi-stage workflow (Inferred)
- `CurrentAction` field → Workflow state machine (Clearly Found)
- `Accepted by` + `Accepted Date` → Approval signature (Inferred)
- No approval fields → Not Required (Clearly Found)
- Signature box only, no routing → Inferred or Unknown

## Stage 6: Promote to Source Requirements

Only after extraction quality review passes:
1. All candidate fields have evidence classification
2. All workflow candidates have evidence classification
3. No hallucinated choices
4. Quality review score ≥ 80%

**Promotion**: Copy verified candidates → `source_analysis/02_extracted_requirements/{Dept}/{SRC-ID}_{FormName}_REQUIREMENTS.md`

---

## Batch Extraction Commands

```powershell
# Extract all PDFs from a department folder
python scripts/extract_pdf_batch.py --dept HR --site PRAI

# Extract single PDF
python scripts/extract_pdf_single.py --src SRC-035

# Generate field candidates from raw text
python scripts/generate_field_candidates.py --batch EXB-001
```
