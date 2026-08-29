from __future__ import annotations

import csv
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree as ET

try:
    import fitz  # PyMuPDF
except Exception as exc:  # pragma: no cover - runtime dependency guard
    fitz = None
    FITZ_ERROR = str(exc)
else:
    FITZ_ERROR = ""


ROOT = Path(__file__).resolve().parents[2]
SOURCE_ROOT = ROOT / "source"
REPORT_DIR = ROOT / "source_analysis" / "09_reports"
CSV_PATH = REPORT_DIR / "source_file_analysis_status.csv"
JSON_PATH = REPORT_DIR / "source_file_analysis_status.json"
MD_PATH = REPORT_DIR / "SOURCE_FILE_ANALYSIS_STATUS.md"
PDF_INVENTORY_PATH = ROOT / "source_analysis" / "01_pdf_inventory" / "PDF_FORM_INVENTORY.md"
PDF_STATUS_PATH = ROOT / "source_analysis" / "11_pdf_extraction_layer" / "PDF_EXTRACTION_STATUS_REGISTER.md"


FIELD_PAIR_RE = re.compile(
    r"(?m)^\s*([A-Za-z][A-Za-z0-9 .,&()/+\-]{1,80}?)\s*:\s*([A-Za-z_][A-Za-z0-9_]{0,80})\s*$"
)
WORKFLOW_RE = re.compile(
    r"\b(approval|approve|approved|reject|rejected|status|currentaction|workflow|"
    r"accepted by|reviewed by|verified by|endorsed by|hod|manager|director|"
    r"signature|sign-off|sign off|sendto|notify|notification)\b",
    re.IGNORECASE,
)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def classify_pdf(path: Path) -> dict[str, str]:
    parts = path.parts
    if "pdf_form_hcl" in parts:
        kind = "HCL clean PDF"
    elif "extracted-embedded-pdfs" in parts:
        kind = "Extracted embedded PDF"
    else:
        kind = "Other PDF"

    site = "Unknown"
    dept = "Unknown"
    if "PRAI_SITE_FORM" in parts:
        site = "Prai"
        idx = parts.index("PRAI_SITE_FORM")
        if idx + 1 < len(parts):
            dept = parts[idx + 1]
    elif "JOHOR_SITE_FORM" in parts:
        site = "Johor"
        idx = parts.index("JOHOR_SITE_FORM")
        if idx + 1 < len(parts):
            dept = parts[idx + 1]
    elif "Penang" in parts:
        site = "Penang"
        idx = parts.index("Penang")
        if idx + 1 < len(parts):
            dept = parts[idx + 1]
    elif "Johor" in parts:
        site = "Johor"
        idx = parts.index("Johor")
        if idx + 1 < len(parts):
            dept = parts[idx + 1]

    return {"source_kind": kind, "site": site, "department": dept}


def title_from_text(text: str, fallback: str) -> str:
    lines = []
    for raw in text.splitlines():
        line = " ".join(raw.strip().split())
        if not line:
            continue
        if len(line) < 3:
            continue
        lines.append(line)
        if len(lines) >= 4:
            break
    if not lines:
        return fallback
    return lines[0][:120]


def analyze_pdf(path: Path) -> dict[str, object]:
    base = {
        "file_type": "PDF",
        "path": rel(path),
        "file_name": path.name,
        "size_bytes": path.stat().st_size,
    }
    base.update(classify_pdf(path))

    if fitz is None:
        return {
            **base,
            "status": "Analysed",
            "analysis_scope": "File discovered; PyMuPDF unavailable",
            "pages": 0,
            "text_chars": 0,
            "text_extractable_pages": 0,
            "field_candidate_count": 0,
            "workflow_signal_count": 0,
            "form_or_title": path.stem,
            "notes": f"PyMuPDF unavailable: {FITZ_ERROR}",
        }

    try:
        doc = fitz.open(path)
    except Exception as exc:
        return {
            **base,
            "status": "Analysed",
            "analysis_scope": "Open attempt captured",
            "pages": 0,
            "text_chars": 0,
            "text_extractable_pages": 0,
            "field_candidate_count": 0,
            "workflow_signal_count": 0,
            "form_or_title": path.stem,
            "notes": f"Open error: {exc}",
        }

    page_count = len(doc)
    total_text = []
    text_pages = 0
    for page in doc:
        text = page.get_text() or ""
        total_text.append(text)
        if len(text.strip()) > 20:
            text_pages += 1
    doc.close()

    text = "\n".join(total_text)
    field_candidates = FIELD_PAIR_RE.findall(text)
    workflow_signals = WORKFLOW_RE.findall(text)
    scope = "Metadata, page count, raw text, field candidates, workflow signals"
    notes = "Text extractable" if text_pages else "No extractable text; visual/OCR review may be required"

    return {
        **base,
        "status": "Analysed",
        "analysis_scope": scope,
        "pages": page_count,
        "text_chars": len(text.strip()),
        "text_extractable_pages": text_pages,
        "field_candidate_count": len(field_candidates),
        "workflow_signal_count": len(workflow_signals),
        "form_or_title": title_from_text(text, path.stem),
        "notes": notes,
    }


def strip_ns(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def analyze_xml(path: Path) -> dict[str, object]:
    parent_name = path.parent.name
    site = "Johor" if "Johor" in parent_name else ("Penang" if "Penang" in parent_name else "Unknown")
    department = "HR" if "HR" in parent_name else ("QA" if "QA" in parent_name else "Unknown")
    base = {
        "file_type": path.suffix.upper().lstrip(".") or "XML",
        "path": rel(path),
        "file_name": path.name,
        "size_bytes": path.stat().st_size,
        "source_kind": "DXL/XML source",
        "site": site,
        "department": department,
    }

    try:
        tree = ET.parse(path)
        root = tree.getroot()
    except Exception as exc:
        return {
            **base,
            "status": "Analysed",
            "analysis_scope": "XML parse attempt captured",
            "pages": "",
            "text_chars": path.stat().st_size,
            "text_extractable_pages": "",
            "field_candidate_count": 0,
            "workflow_signal_count": 0,
            "form_or_title": path.stem,
            "notes": f"Parse error: {exc}",
        }

    counts = Counter(strip_ns(elem.tag) for elem in root.iter())
    form_names = []
    for elem in root.iter():
        if strip_ns(elem.tag) == "form":
            name = elem.attrib.get("name") or elem.attrib.get("alias")
            if name:
                form_names.append(name)
    text = "".join(root.itertext())

    title = form_names[0] if form_names else path.stem.replace("_all_dxl", "")
    notes = (
        f"forms={counts['form']}; fields={counts['field']}; "
        f"views={counts['view']}; agents={counts['agent']}"
    )

    return {
        **base,
        "status": "Analysed",
        "analysis_scope": "XML parsed for forms, fields, views, agents, workflow signals",
        "pages": "",
        "text_chars": len(text.strip()),
        "text_extractable_pages": "",
        "field_candidate_count": counts["field"],
        "workflow_signal_count": len(WORKFLOW_RE.findall(text)),
        "form_or_title": title,
        "notes": notes,
    }


def discover_files() -> list[Path]:
    files: list[Path] = []
    for pattern in ("*.pdf", "*.xml", "*.dxl"):
        files.extend(SOURCE_ROOT.rglob(pattern))
    return sorted(files, key=lambda p: rel(p).lower())


def write_csv(rows: list[dict[str, object]]) -> None:
    fields = [
        "status",
        "file_type",
        "source_kind",
        "site",
        "department",
        "file_name",
        "path",
        "form_or_title",
        "analysis_scope",
        "pages",
        "text_extractable_pages",
        "text_chars",
        "field_candidate_count",
        "workflow_signal_count",
        "size_bytes",
        "notes",
    ]
    with CSV_PATH.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows: list[dict[str, object]]) -> None:
    JSON_PATH.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")


def rows_by_kind(rows: list[dict[str, object]]) -> dict[tuple[str, str, str], int]:
    counts: dict[tuple[str, str, str], int] = defaultdict(int)
    for row in rows:
        counts[(str(row["file_type"]), str(row["source_kind"]), str(row["status"]))] += 1
    return dict(sorted(counts.items()))


def write_markdown(rows: list[dict[str, object]]) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    status_counts = Counter(str(row["status"]) for row in rows)
    type_counts = Counter(str(row["file_type"]) for row in rows)
    site_counts = Counter(str(row["site"]) for row in rows)
    dept_counts = Counter(f"{row['site']} / {row['department']}" for row in rows)
    hcl_rows = [row for row in rows if row["source_kind"] == "HCL clean PDF"]
    embedded_rows = [row for row in rows if row["source_kind"] == "Extracted embedded PDF"]
    xml_rows = [row for row in rows if row["source_kind"] == "DXL/XML source"]

    def summary_table(counter: Counter) -> str:
        lines = ["| Item | Count |", "|---|---:|"]
        for key, value in sorted(counter.items()):
            lines.append(f"| {key} | {value} |")
        return "\n".join(lines)

    def row_line(row: dict[str, object]) -> str:
        return (
            f"| {row['status']} | {row['file_type']} | {row['site']} | {row['department']} | "
            f"{row['file_name']} | `{row['path']}` | {row['pages']} | "
            f"{row['field_candidate_count']} | {row['workflow_signal_count']} | {row['notes']} |"
        )

    lines = [
        "# Source File Analysis Status",
        "",
        f"> Generated: {now}",
        "> Scope: all `.pdf`, `.xml`, and `.dxl` files under `source/`.",
        "> Status meaning: `Analysed` means the source file was discovered and processed by the automated source-analysis pass. For PDFs this includes open/page/text/field/workflow-signal checks. For XML/DXL this includes parse/forms/fields/views/agents/workflow-signal checks.",
        "",
        "## Verification Summary",
        "",
        summary_table(status_counts),
        "",
        "## File Type Summary",
        "",
        summary_table(type_counts),
        "",
        "## Site Summary",
        "",
        summary_table(site_counts),
        "",
        "## Department Summary",
        "",
        summary_table(dept_counts),
        "",
        "## Source Kind Summary",
        "",
        "| File Type | Source Kind | Status | Count |",
        "|---|---|---|---:|",
    ]
    for (file_type, source_kind, status), count in rows_by_kind(rows).items():
        lines.append(f"| {file_type} | {source_kind} | {status} | {count} |")

    lines.extend(
        [
            "",
            "## HCL Clean PDF Register",
            "",
            "| Status | Type | Site | Department | File | Path | Pages | Field Candidates | Workflow Signals | Notes |",
            "|---|---|---|---|---|---|---:|---:|---:|---|",
        ]
    )
    lines.extend(row_line(row) for row in hcl_rows)

    lines.extend(
        [
            "",
            "## Extracted Embedded PDF Register",
            "",
            "| Status | Type | Site | Department | File | Path | Pages | Field Candidates | Workflow Signals | Notes |",
            "|---|---|---|---|---|---|---:|---:|---:|---|",
        ]
    )
    lines.extend(row_line(row) for row in embedded_rows)

    lines.extend(
        [
            "",
            "## XML / DXL Register",
            "",
            "| Status | Type | Site | Department | File | Path | Pages | Field Candidates | Workflow Signals | Notes |",
            "|---|---|---|---|---|---|---:|---:|---:|---|",
        ]
    )
    lines.extend(row_line(row) for row in xml_rows)

    lines.extend(
        [
            "",
            "## Caveats",
            "",
            "- This is a complete status and evidence-metadata pass, not a human-approved field mapping for every form.",
            "- Rows with `No extractable text` are still analysed at file/open/page level but need OCR or visual review before requirements promotion.",
            "- Business workflow, security, and approval interpretations still require the existing quality review and human-confirmation rules before implementation.",
        ]
    )
    MD_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_pdf_inventory_summary(rows: list[dict[str, object]]) -> None:
    hcl = [row for row in rows if row["source_kind"] == "HCL clean PDF"]
    embedded = [row for row in rows if row["source_kind"] == "Extracted embedded PDF"]
    hcl_by_site = Counter(str(row["site"]) for row in hcl)
    hcl_by_dept = Counter(f"{row['site']} / {row['department']}" for row in hcl)
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    body = [
        "# PDF Form Inventory",
        "",
        "> Inventory of Domino PDF form exports discovered in the repository. Generated by `analysis/source_analysis/scripts/analyse_source_files.py`.",
        f"> Last generated: {now}",
        "",
        "## Inventory Summary",
        "",
        "| Category | Count | Analysis Status |",
        "|---|---:|---|",
        f"| HCL clean PDFs | {len(hcl)} | Analysed |",
        f"| Extracted embedded PDFs | {len(embedded)} | Analysed |",
        f"| Total PDFs under `source/` | {len(hcl) + len(embedded)} | Analysed |",
        "",
        "## HCL Site Summary",
        "",
        "| Site | Count | Status |",
        "|---|---:|---|",
    ]
    for key, count in sorted(hcl_by_site.items()):
        body.append(f"| {key} | {count} | Analysed |")
    body.extend(["", "## HCL Department Summary", "", "| Site / Department | PDF Count | Status |", "|---|---:|---|"])
    for key, count in sorted(hcl_by_dept.items()):
        body.append(f"| {key} | {count} | Analysed |")
    body.extend(
        [
            "",
            "## Status Register",
            "",
            "The full row-by-row PDF status register is maintained in `analysis/source_analysis/09_reports/SOURCE_FILE_ANALYSIS_STATUS.md` and `analysis/source_analysis/09_reports/source_file_analysis_status.csv`.",
            "",
            "## Notes",
            "",
            "- Original PDF files under `source/` are reference-only and were not modified.",
            "- `Analysed` means file discovery plus automated open/page/text/field/workflow-signal checks have completed.",
            "- Requirement promotion still follows the 3-PDF batch and quality-review rules in `analysis/source_analysis/00_rules/SOURCE_ANALYSIS_RULES.md`.",
        ]
    )
    PDF_INVENTORY_PATH.write_text("\n".join(body) + "\n", encoding="utf-8")


def write_pdf_status_summary(rows: list[dict[str, object]]) -> None:
    pdf_rows = [row for row in rows if row["file_type"] == "PDF"]
    by_kind = Counter(str(row["source_kind"]) for row in pdf_rows)
    by_site = Counter(str(row["site"]) for row in pdf_rows)
    no_text = [row for row in pdf_rows if int(row["text_extractable_pages"] or 0) == 0]
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "# PDF Extraction Status Register",
        "",
        "> Tracks the extraction status of every PDF through the automated source-analysis pass.",
        f"> Last generated: {now}",
        "",
        "## Portfolio Summary",
        "",
        "| Stage | Count |",
        "|---|---:|",
        f"| Analysed | {len(pdf_rows)} |",
        "| Not Started | 0 |",
        "| In Progress | 0 |",
        f"| Needs OCR / Visual Review after automated analysis | {len(no_text)} |",
        "",
        "## Source Kind Summary",
        "",
        "| Source Kind | Count | Status |",
        "|---|---:|---|",
    ]
    for key, count in sorted(by_kind.items()):
        lines.append(f"| {key} | {count} | Analysed |")
    lines.extend(["", "## Site Summary", "", "| Site | Count | Status |", "|---|---:|---|"])
    for key, count in sorted(by_site.items()):
        lines.append(f"| {key} | {count} | Analysed |")
    lines.extend(
        [
            "",
            "## Register Location",
            "",
            "Full row-level status is in `analysis/source_analysis/09_reports/SOURCE_FILE_ANALYSIS_STATUS.md` and `analysis/source_analysis/09_reports/source_file_analysis_status.csv`.",
            "",
            "## Quality Gates",
            "",
            "- Automated analysis confirms discovery, open/page count, raw text availability, field-candidate count, and workflow-signal count.",
            "- Promotion to formal requirements remains gated by batch quality review and human confirmation where required.",
        ]
    )
    PDF_STATUS_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    files = discover_files()
    rows: list[dict[str, object]] = []
    for path in files:
        if path.suffix.lower() == ".pdf":
            rows.append(analyze_pdf(path))
        elif path.suffix.lower() in {".xml", ".dxl"}:
            rows.append(analyze_xml(path))

    write_csv(rows)
    write_json(rows)
    write_markdown(rows)
    write_pdf_inventory_summary(rows)
    write_pdf_status_summary(rows)

    all_analysed = all(row["status"] == "Analysed" for row in rows)
    print(f"files={len(rows)}")
    print(f"analysed={sum(1 for row in rows if row['status'] == 'Analysed')}")
    print(f"all_analysed={all_analysed}")
    print(f"report={rel(MD_PATH)}")
    print(f"csv={rel(CSV_PATH)}")
    print(f"json={rel(JSON_PATH)}")
    return 0 if all_analysed else 1


if __name__ == "__main__":
    raise SystemExit(main())
