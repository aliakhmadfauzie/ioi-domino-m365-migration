from __future__ import annotations

import csv
import json
import re
import shutil
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Iterable

try:
    import fitz  # PyMuPDF
except ImportError as exc:  # pragma: no cover - runtime guard for local tooling
    raise SystemExit("PyMuPDF is required. Install with `pip install pymupdf`.") from exc


ROOT = Path(__file__).resolve().parents[2]
MASTER_CSV = ROOT / "source" / "Project Iventories" / "master_app_data_still_needed.csv"
APP_MAPPING_CSV = ROOT / "source" / "Project Iventories" / "application_pdf_source_mapping.csv"
EMBEDDED_MAPPING_CSV = ROOT / "source" / "Project Iventories" / "embedded_pdf_application_mapping.csv"
STATUS_JSON = ROOT / "source_analysis" / "09_reports" / "source_file_analysis_status.json"

OUT_ROOT = ROOT / "source_analysis" / "10_master_app_sources"
REQ_ROOT = OUT_ROOT / "requirements"
COVERAGE_MD = OUT_ROOT / "MASTER_APP_SOURCE_COVERAGE.md"
COVERAGE_CSV = OUT_ROOT / "master_app_source_coverage.csv"
COVERAGE_JSON = OUT_ROOT / "master_app_source_coverage.json"
FIELD_MD = OUT_ROOT / "MASTER_FIELD_DICTIONARY.md"
FIELD_CSV = OUT_ROOT / "master_field_dictionary.csv"
WORKFLOW_MD = OUT_ROOT / "MASTER_WORKFLOW_REGISTER.md"
ROLE_MD = OUT_ROOT / "MASTER_ROLE_SECTION_REGISTER.md"
SP_MD = OUT_ROOT / "MASTER_SHAREPOINT_DESIGN_REGISTER.md"
PA_MD = OUT_ROOT / "MASTER_POWERAPPS_SPEC_REGISTER.md"

GENERATED_AT = "2026-06-02"


COMMON_TOKENS = {
    "and",
    "app",
    "application",
    "appendix",
    "arrangement",
    "cen",
    "database",
    "details",
    "document",
    "domino",
    "form",
    "forms",
    "for",
    "from",
    "info",
    "information",
    "ioi",
    "list",
    "main",
    "management",
    "new",
    "pancen",
    "pan",
    "pcn",
    "pims",
    "record",
    "register",
    "request",
    "system",
    "the",
}

DEPT_ALIASES = {
    "ADM": {"ADM", "ADMIN"},
    "ADMIN": {"ADM", "ADMIN"},
    "FIN": {"FIN", "FN", "FINANCE"},
    "FINANCE": {"FIN", "FN", "FINANCE"},
    "HR": {"HR", "GHR"},
    "GHR": {"HR", "GHR"},
    "IT": {"IT"},
    "MAINT": {"MAINT", "MTN"},
    "MKT": {"MKT", "MKTG", "MARKETING"},
    "MKTG": {"MKT", "MKTG", "MARKETING"},
    "MARKETING": {"MKT", "MKTG", "MARKETING"},
    "PUR": {"PUR", "PRC", "PURCHASING"},
    "PP": {"PP", "PRD", "PROD"},
    "PRC": {"PUR", "PRC", "PURCHASING"},
    "PRD": {"PP", "PRD", "PROD"},
    "PROD": {"PP", "PRD", "PROD"},
    "QC": {"QC"},
    "QA": {"QA"},
    "R&D": {"R&D", "RD"},
    "RD": {"R&D", "RD"},
    "SALES": {"SALES", "SLSADM", "SLSADMIN"},
    "SLSADM": {"SALES", "SLSADM", "SLSADMIN"},
    "SLSADMIN": {"SALES", "SLSADM", "SLSADMIN"},
    "STORE": {"STORE", "STR"},
    "STR": {"STORE", "STR"},
    "T&D": {"T&D", "TD"},
    "TD": {"T&D", "TD"},
    "UTILITY": {"UTILITY", "MAINT", "MTN"},
    "WH": {"WH", "WAREHOUSE"},
}

WORKFLOW_TERMS = re.compile(
    r"\b(currentaction|approval|approve|approved|approver|reject|rejected|submit|submitted|"
    r"hod|signature|verified|verification|review|reviewed|route|routing|status|ca)\b",
    re.IGNORECASE,
)
FIELD_RE = re.compile(r"^\s*([^:]{2,80}?)\s*:\s*([A-Za-z][A-Za-z0-9_]{1,60})\s*$")
FIELD_NAME_RE = re.compile(r"\b[A-Za-z][A-Za-z0-9_]{1,60}\b")


@dataclass
class PdfEvidence:
    path: Path
    rel_path: str
    source_kind: str
    match_method: str
    match_score: float
    match_confidence: str
    pages: int = 0
    text_chars: int = 0
    field_candidate_count: int = 0
    workflow_signal_count: int = 0
    title: str = ""
    text: str = ""
    error: str = ""


@dataclass
class AppSource:
    index: int
    row: dict[str, str]
    pdfs: list[PdfEvidence] = field(default_factory=list)
    status: str = "Blocked - No PDF Match"
    notes: list[str] = field(default_factory=list)
    artifact_path: Path | None = None
    fields: list[dict[str, str]] = field(default_factory=list)
    sections: list[str] = field(default_factory=list)
    workflow_summary: str = "Unknown"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]


def rel(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return path.as_posix()


def slug(value: str, limit: int = 80) -> str:
    value = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_")
    return (value or "unnamed")[:limit]


def norm_dept(value: str) -> str:
    return re.sub(r"[^A-Z0-9&]+", "", value.upper())


def dept_family(value: str) -> set[str]:
    normalized = norm_dept(value)
    if not normalized:
        return set()
    return DEPT_ALIASES.get(normalized, {normalized})


def split_multi(value: str) -> list[str]:
    if not value:
        return []
    return [part.strip() for part in re.split(r"\s*\|\s*", value) if part.strip()]


def normalize_title(value: str) -> str:
    value = value.lower()
    value = re.sub(r"^\s*pan\s*cen\s*-\s*", "", value)
    value = re.sub(r"^\s*pancen\s*-\s*", "", value)
    value = re.sub(r"[^a-z0-9]+", "", value)
    return value


def site_family(value: str) -> set[str]:
    value = value.strip().lower()
    if value == "penang":
        return {"penang", "prai"}
    if value == "johor":
        return {"johor"}
    return {value}


def localize_pdf_path(value: str) -> Path | None:
    if not value:
        return None
    value = value.strip().strip('"')
    if not value or value.lower() in {"not found", "missing", "nan"}:
        return None
    normalized = value.replace("\\", "/")
    marker = "extracted-embedded-pdfs/"
    if marker in normalized:
        suffix = normalized.split(marker, 1)[1]
        return ROOT / "source" / "Project Iventories" / "extracted-embedded-pdfs" / Path(suffix)
    path = Path(value)
    if path.exists():
        return path
    if normalized.startswith("source/"):
        return ROOT / Path(normalized)
    return None


def tokens(value: str) -> set[str]:
    raw = re.findall(r"[A-Za-z0-9&]+", value.lower())
    result = set()
    for token in raw:
        token = token.strip("&")
        if len(token) < 3 or token in COMMON_TOKENS:
            continue
        result.add(token)
    return result


def compact(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def code_tokens(row: dict[str, str]) -> set[str]:
    values = " ".join(
        row.get(column, "")
        for column in ["app_name", "form_list", "blueprint_code"]
    )
    codes = set()
    for part in re.split(r"[;|,/()\s-]+", values):
        part = part.strip()
        if re.fullmatch(r"[A-Za-z]{2,}[A-Za-z0-9_]*", part) and (
            part.isupper() or any(ch.isdigit() for ch in part)
        ):
            codes.add(part.lower())
    for match in re.findall(r"\(([A-Za-z0-9&/_ -]{2,24})\)", values):
        for part in re.split(r"[^A-Za-z0-9]+", match):
            if len(part) >= 2:
                codes.add(part.lower())
    compact_values = compact(values)
    hint_map = {
        "changecontrolform": {"cc"},
        "customerquestionnaireregulations": {"pccustquest"},
        "customerexternalauditreports": {"externalaudit"},
        "foodfeedsafetymanual": {"foodsecmanual"},
        "industrialincidentreport": {"piir"},
        "ioioipolicy": {"ioip"},
        "jobdescriptionsnew": {"jd"},
        "useridrequisitionform": {"ur"},
        "vendorregistrationform": {"vrf"},
        "defectivepackagingmaterials": {"disrecord"},
    }
    for needle, hints in hint_map.items():
        if needle in compact_values:
            codes.update(hints)
    department_codes = {
        "adm",
        "admin",
        "fin",
        "finance",
        "fn",
        "ghr",
        "halal",
        "hr",
        "it",
        "maint",
        "mkt",
        "mktg",
        "mtn",
        "pp",
        "prc",
        "prd",
        "prod",
        "pur",
        "qa",
        "qc",
        "rd",
        "sec",
        "she",
        "str",
        "td",
        "utility",
        "wh",
    }
    curated_short_codes = {"jd", "ur"}
    return {
        code
        for code in codes
        if (len(code) >= 3 or code in curated_short_codes)
        and code not in COMMON_TOKENS
        and code not in department_codes
    }


def score_candidate(row: dict[str, str], status: dict[str, object]) -> tuple[float, bool]:
    query_text = " ".join(
        row.get(column, "")
        for column in ["app_name", "form_list", "blueprint_code", "blueprint_department"]
    )
    candidate_text = " ".join(
        str(status.get(column, ""))
        for column in ["file_name", "form_or_title", "path", "department"]
    )
    query_tokens = tokens(query_text)
    candidate_tokens = tokens(candidate_text)
    overlap = len(query_tokens & candidate_tokens) / max(len(query_tokens), 1)
    stem_compact = compact(str(status.get("file_name", "")))
    title_compact = compact(str(status.get("form_or_title", "")))
    code_hit = False
    bonus = 0.0
    for code in code_tokens(row):
        code_clean = compact(code)
        if len(code_clean) < 3:
            if stem_compact.startswith(code_clean) or title_compact.startswith(code_clean):
                code_hit = True
                bonus = max(bonus, 0.70)
        elif len(code_clean) >= 3 and (code_clean in stem_compact or code_clean in title_compact):
            code_hit = True
            bonus = max(bonus, 0.70)
        elif any(part in stem_compact for part in [code_clean[:3], code_clean[-3:]]):
            bonus = max(bonus, 0.25)
    return overlap + bonus, code_hit


def build_mapping_index(rows: Iterable[dict[str, str]], title_col: str) -> dict[tuple[str, str], list[dict[str, str]]]:
    index: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        site = row.get("site", "")
        title = row.get(title_col, "")
        if site and title:
            index[(site.lower(), normalize_title(title))].append(row)
    return index


def load_status_rows() -> list[dict[str, object]]:
    with STATUS_JSON.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def extract_pdf(evidence: PdfEvidence, status_by_rel: dict[str, dict[str, object]]) -> PdfEvidence:
    status = status_by_rel.get(evidence.rel_path, {})
    evidence.source_kind = str(status.get("source_kind", evidence.source_kind))
    evidence.title = str(status.get("form_or_title", "")) or evidence.path.stem
    try:
        with fitz.open(evidence.path) as doc:
            evidence.pages = doc.page_count
            parts = []
            for page in doc:
                parts.append(page.get_text("text"))
            evidence.text = "\n".join(parts)
            evidence.text_chars = len(evidence.text)
    except Exception as exc:  # pragma: no cover - depends on local PDF health
        evidence.error = str(exc)
        evidence.text = ""
        evidence.text_chars = 0
    evidence.field_candidate_count = len(parse_fields(evidence.text))
    evidence.workflow_signal_count = len(WORKFLOW_TERMS.findall(evidence.text))
    if not evidence.pages:
        try:
            evidence.pages = int(status.get("pages") or 0)
        except (TypeError, ValueError):
            evidence.pages = 0
    if not evidence.text_chars:
        try:
            evidence.text_chars = int(status.get("text_chars") or 0)
        except (TypeError, ValueError):
            evidence.text_chars = 0
    return evidence


def parse_fields(text: str) -> list[dict[str, str]]:
    seen: set[tuple[str, str]] = set()
    fields = []
    page = 1
    lines = [line.strip() for line in text.splitlines()]

    def add_field(label: str, field_name: str, field_page: int) -> None:
        label = re.sub(r"\s+", " ", label.strip(" :-\t"))
        field_name = field_name.strip(" :-\t")
        if not label or not field_name:
            return
        label = re.sub(r"\s+", " ", label)
        if label.lower() in {"http", "https", "mailto", "page", "notes", "form"}:
            return
        if len(label) < 2 or len(field_name) < 2:
            return
        key = (label.lower(), field_name.lower())
        if key in seen:
            return
        seen.add(key)
        fields.append(
            {
                "label": label,
                "field_name": field_name,
                "type": infer_type(label, field_name),
                "page": str(field_page),
                "confidence": "Parsed from PDF text",
            }
        )

    def extract_names(value: str) -> list[str]:
        names = []
        for candidate in FIELD_NAME_RE.findall(value):
            lower = candidate.lower()
            if lower in COMMON_TOKENS or lower in {"section", "hidden", "fields", "author", "created"}:
                continue
            if candidate[:1].isupper() or "_" in candidate or any(ch.isdigit() for ch in candidate):
                names.append(candidate)
        return names

    for idx, raw_line in enumerate(lines):
        line = raw_line.strip()
        if "\f" in line:
            page += line.count("\f")
        match = FIELD_RE.match(line)
        if match:
            add_field(match.group(1), match.group(2), page)
            continue
        if not line or line.startswith(":") or len(line) > 90:
            continue
        if idx + 1 >= len(lines):
            continue
        next_line = lines[idx + 1].strip()
        if not next_line.startswith(":"):
            continue
        value = next_line[1:].strip()
        if not value and idx + 2 < len(lines):
            value = lines[idx + 2].strip()
        names = extract_names(value)
        if names:
            add_field(line, "; ".join(names[:4]), page)
    return fields


def infer_type(label: str, field_name: str) -> str:
    text = f"{label} {field_name}".lower()
    if any(term in text for term in ["date", "dt"]):
        return "Date/Text"
    if any(term in text for term in ["amount", "amt", "qty", "quantity", "total", "rate", "price", "cost", "no."]):
        return "Number/Text"
    if any(term in text for term in ["approve", "approver", "hod", "pic", "requestor", "prepared", "verified", "name"]):
        return "Person/Text"
    if any(term in text for term in ["remark", "reason", "comment", "description", "justification"]):
        return "Multiline Text"
    if any(term in text for term in ["status", "type", "category", "class", "choice"]):
        return "Choice/Text"
    return "Text"


def infer_sections(text: str, row: dict[str, str]) -> list[str]:
    candidates: list[str] = []
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw.strip())
        if not line or len(line) > 90:
            continue
        if re.search(r"\b(section|approval|applicant|request|verification|part [a-z]|for office use|details)\b", line, re.I):
            candidates.append(line)
        elif line.isupper() and 5 <= len(line) <= 70:
            candidates.append(line.title())
    seen = []
    for item in candidates:
        key = item.lower()
        if key not in {existing.lower() for existing in seen}:
            seen.append(item)
        if len(seen) >= 12:
            break
    if not seen:
        form_list = row.get("form_list", "").strip()
        seen.append(form_list if form_list else "Needs Human Confirmation")
    return seen


def parent_list(row: dict[str, str]) -> str:
    dept = norm_dept(row.get("blueprint_department") or row.get("owner") or row.get("department") or "APP")
    if dept in {"FN", "FINANCE"}:
        dept = "FIN"
    if dept == "GHR":
        dept = "HR"
    if dept == "PRC":
        dept = "PUR"
    return f"MainDB_{dept or 'APP'}"


def form_code(row: dict[str, str], index: int) -> str:
    code = row.get("blueprint_code", "").strip()
    if code:
        return re.sub(r"[^A-Za-z0-9_]+", "_", code.split(";")[0]).strip("_")[:24]
    app_tokens = [token.upper() for token in re.findall(r"[A-Za-z0-9]+", row.get("app_name", "")) if token.lower() not in COMMON_TOKENS]
    if app_tokens:
        return "".join(token[:4] for token in app_tokens[:3])[:24]
    return f"MASTER_{index:03d}"


def has_repeating_fields(fields: list[dict[str, str]]) -> bool:
    return any(re.search(r"(_|\b)([0-9]{1,2})$", field["field_name"]) for field in fields)


def markdown_table(headers: list[str], rows: Iterable[Iterable[object]]) -> str:
    output = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    for row in rows:
        cells = []
        for value in row:
            text = str(value).replace("|", "\\|").replace("\n", "<br>")
            cells.append(text if text else "-")
        output.append("| " + " | ".join(cells) + " |")
    return "\n".join(output)


def write_app_artifact(app: AppSource) -> None:
    row = app.row
    site = slug(row.get("site", "Unknown"), 32)
    owner = slug(row.get("owner") or row.get("department") or "Unknown", 32)
    code = form_code(row, app.index)
    file_name = f"MASTER-{app.index:03d}_{slug(row.get('app_name', ''), 72)}_SOURCES.md"
    path = REQ_ROOT / site / owner / file_name
    path.parent.mkdir(parents=True, exist_ok=True)
    app.artifact_path = path

    evidence_rows = [
        [
            pdf.rel_path,
            pdf.source_kind,
            pdf.match_method,
            f"{pdf.match_score:.3f}",
            pdf.match_confidence,
            pdf.pages,
            pdf.text_chars,
            pdf.field_candidate_count,
            pdf.workflow_signal_count,
            pdf.error or pdf.title,
        ]
        for pdf in app.pdfs
    ]
    if not evidence_rows:
        evidence_rows = [["No PDF matched", "-", "-", "-", "-", "-", "-", "-", "-", "; ".join(app.notes) or "No evidence"]]

    field_rows = [
        [idx, field["label"], field["field_name"], field["type"], field["page"], field["confidence"]]
        for idx, field in enumerate(app.fields, start=1)
    ]
    if not field_rows:
        field_rows = [["-", "No field pairs parsed from extracted PDF text", "-", "-", "-", "Needs Human Confirmation"]]

    section_rows = [[idx, section, "Inferred from PDF text", "Needs Human Confirmation"] for idx, section in enumerate(app.sections, start=1)]
    workflow_required = "Yes - inferred from PDF workflow/routing terms" if app.workflow_summary != "Unknown" else "Unknown"
    child_recommendation = (
        f"`{parent_list(row)}_Ext_{code}_Rows` candidate for repeating row fields"
        if has_repeating_fields(app.fields)
        else "No child list inferred from parsed field names; confirm during design"
    )

    content = [
        f"# Master App PDF Source - {row.get('app_name', 'Unknown Application')}",
        "",
        f"> Master row: {app.index} | Site: {row.get('site', '-')} | Owner: {row.get('owner', '-') or '-'} | Generated: {GENERATED_AT}",
        f"> Classification: {app.status}",
        "",
        "## 1. Basic Information",
        "",
        markdown_table(
            ["Attribute", "Value", "Confidence"],
            [
                ["Master Index", app.index, "Clearly Found"],
                ["Site", row.get("site", "-"), "Clearly Found"],
                ["Application Name", row.get("app_name", "-"), "Clearly Found"],
                ["Owner", row.get("owner", "-"), "Clearly Found"],
                ["Department", row.get("department", "-"), "Source inventory"],
                ["Form List", row.get("form_list", "-"), "Source inventory"],
                ["Blueprint Department", row.get("blueprint_department", "-"), "Source inventory"],
                ["Blueprint Code", row.get("blueprint_code", "-") or code, "Source inventory or inferred"],
                ["Build Readiness", row.get("build_readiness", "-"), "Source inventory"],
                ["Overall Source Status", row.get("overall_source_status", "-"), "Source inventory"],
            ],
        ),
        "",
        "## 2. PDF Evidence",
        "",
        markdown_table(
            [
                "PDF Path",
                "Source Kind",
                "Match Method",
                "Score",
                "Confidence",
                "Pages",
                "Text Chars",
                "Field Candidates",
                "Workflow Signals",
                "Title / Note",
            ],
            evidence_rows,
        ),
        "",
        "## 3. Form Sections",
        "",
        markdown_table(["#", "Section", "Evidence", "Confidence"], section_rows),
        "",
        "## 4. Field Extraction",
        "",
        markdown_table(["#", "Label", "Domino/PDF Field", "Recommended Type", "Page", "Confidence"], field_rows),
        "",
        "## 5. Workflow and Routing",
        "",
        markdown_table(
            ["Attribute", "Value", "Confidence"],
            [
                ["Approval Required", workflow_required, "Inferred" if workflow_required.startswith("Yes") else "Needs Human Confirmation"],
                ["Workflow Evidence", app.workflow_summary, "Parsed from PDF text" if app.workflow_summary != "Unknown" else "Needs Human Confirmation"],
                ["CurrentAction Field", "CA/CurrentAction candidate if present in source evidence", "Needs Human Confirmation"],
                ["State Values", "Unknown", "Needs Human Confirmation"],
            ],
        ),
        "",
        "## 6. SharePoint Design Recommendation",
        "",
        f"Parent list: `{parent_list(row)}`",
        f"FormCode: `{code}`",
        f"Child-list recommendation: {child_recommendation}",
        "",
        "Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.",
        "",
        "## 7. Power Apps Build Specification",
        "",
        markdown_table(
            ["Screen/Component", "Requirement", "Confidence"],
            [
                ["List", "Filter by site/owner/FormCode and status", "Inferred"],
                ["New/Edit", "Render parsed PDF fields grouped by inferred sections", "Inferred"],
                ["Detail", "Read-only view with audit/workflow metadata", "Inferred"],
                ["Approval Actions", "Show only if workflow state confirms approval is required", "Needs Human Confirmation"],
                ["Child Rows", "Use editable gallery only if child-list recommendation is confirmed", "Needs Human Confirmation"],
            ],
        ),
        "",
        "## 8. Human Confirmation Questions",
        "",
        markdown_table(
            ["#", "Question", "Severity"],
            [
                [f"MASTER-{app.index:03d}-01", "Confirm the matched PDF evidence belongs to this Domino app/form.", "High" if "Needs Review" in app.status or "Blocked" in app.status else "Medium"],
                [f"MASTER-{app.index:03d}-02", "Confirm required workflow states, approver roles, and CurrentAction values.", "High"],
                [f"MASTER-{app.index:03d}-03", "Confirm whether repeating rows should be child lists or fixed extension columns.", "Medium"],
            ],
        ),
        "",
        "## 9. Final Classification",
        "",
        markdown_table(
            ["Attribute", "Value"],
            [
                ["PDF Source Status", app.status],
                ["PDF Count", len(app.pdfs)],
                ["Parsed Field Count", len(app.fields)],
                ["Workflow Signal Count", sum(pdf.workflow_signal_count for pdf in app.pdfs)],
                ["Notes", "; ".join(app.notes) or "-"],
            ],
        ),
        "",
    ]
    path.write_text("\n".join(content), encoding="utf-8")


def collect_explicit_pdfs(
    row: dict[str, str],
    app_index: dict[tuple[str, str], list[dict[str, str]]],
    embedded_index: dict[tuple[str, str], list[dict[str, str]]],
) -> list[PdfEvidence]:
    key = (row.get("site", "").lower(), normalize_title(row.get("app_name", "")))
    pdfs: list[PdfEvidence] = []
    seen: set[str] = set()
    for mapped in app_index.get(key, []):
        scores = split_multi(mapped.get("embedded_pdf_match_scores", ""))
        methods = split_multi(mapped.get("embedded_pdf_match_methods", ""))
        for idx, path_text in enumerate(split_multi(mapped.get("pdf_path", ""))):
            path = localize_pdf_path(path_text)
            if not path or not path.exists():
                continue
            rel_path = rel(path)
            if rel_path in seen:
                continue
            seen.add(rel_path)
            try:
                score = float(scores[min(idx, len(scores) - 1)]) if scores else 1.0
            except ValueError:
                score = 1.0
            method = methods[min(idx, len(methods) - 1)] if methods else mapped.get("pdf_path_status", "explicit_mapping")
            pdfs.append(PdfEvidence(path, rel_path, "Embedded PDF", method, score, "Explicit mapping"))
    for mapped in embedded_index.get(key, []):
        path = localize_pdf_path(mapped.get("extracted_pdf_path", ""))
        if not path or not path.exists():
            continue
        rel_path = rel(path)
        if rel_path in seen:
            continue
        seen.add(rel_path)
        try:
            score = float(mapped.get("match_score", "1") or 1)
        except ValueError:
            score = 1.0
        pdfs.append(
            PdfEvidence(
                path,
                rel_path,
                "Embedded PDF",
                mapped.get("match_method", "embedded_mapping"),
                score,
                "Explicit mapping",
            )
        )
    return pdfs


def embedded_meta_fallback(row: dict[str, str], embedded_rows: list[dict[str, str]]) -> list[PdfEvidence]:
    sites = site_family(row.get("site", ""))
    depts = set()
    for column in ["owner", "department", "blueprint_department"]:
        for part in re.split(r"[|,/]+", row.get(column, "")):
            depts.update(dept_family(part.strip()))
    scored: list[tuple[float, bool, dict[str, str], Path, str, str]] = []
    for mapped in embedded_rows:
        path = localize_pdf_path(mapped.get("extracted_pdf_path", ""))
        if not path or not path.exists():
            continue
        parts_lower = {part.lower() for part in path.parts}
        if sites and not (parts_lower & sites):
            continue
        dept = path.parent.name
        if depts and dept_family(dept) and not (dept_family(dept) & depts):
            continue
        status_like = {
            "file_name": path.name,
            "form_or_title": " ".join(
                [
                    mapped.get("pdf_meta_title", ""),
                    mapped.get("pdf_text_excerpt", ""),
                    mapped.get("matched_app_title", ""),
                ]
            ),
            "path": rel(path),
            "department": dept,
        }
        score, code_hit = score_candidate(row, status_like)
        if score >= 0.75 or code_hit:
            scored.append((score, code_hit, mapped, path, dept, status_like["form_or_title"]))
    if not scored:
        return []
    scored.sort(key=lambda item: item[0], reverse=True)
    max_score = scored[0][0]
    selected = []
    seen = set()
    for score, code_hit, mapped, path, dept, title in scored:
        if score < max_score - 0.05 and not code_hit:
            continue
        rel_path = rel(path)
        if rel_path in seen:
            continue
        seen.add(rel_path)
        selected.append(
            PdfEvidence(
                path=path,
                rel_path=rel_path,
                source_kind="Extracted embedded PDF",
                match_method="embedded_pdf_meta_title_fallback",
                match_score=score,
                match_confidence="Embedded metadata fallback needs review",
                title=title,
            )
        )
    return selected[:8]


def hcl_fallback(row: dict[str, str], hcl_rows: list[dict[str, object]]) -> list[PdfEvidence]:
    sites = site_family(row.get("site", ""))
    depts = set()
    for column in ["owner", "department", "blueprint_department"]:
        for part in re.split(r"[|,/]+", row.get(column, "")):
            depts.update(dept_family(part.strip()))
    def score_rows(enforce_site: bool, enforce_dept: bool) -> list[tuple[float, bool, dict[str, object]]]:
        results = []
        for status in hcl_rows:
            status_site = str(status.get("site", "")).lower()
            if enforce_site and status_site and status_site not in sites:
                continue
            status_dept = norm_dept(str(status.get("department", "")))
            if enforce_dept and depts and status_dept and status_dept not in depts:
                continue
            score, code_hit = score_candidate(row, status)
            if score <= 0:
                continue
            results.append((score, code_hit, status))
        return results

    stages = [
        (True, True),
        (True, False),
        (False, True),
        (False, False),
    ]
    for enforce_site, enforce_dept in stages:
        scored = score_rows(enforce_site=enforce_site, enforce_dept=enforce_dept)
        if not scored:
            continue
        scored.sort(key=lambda item: item[0], reverse=True)
        max_score = scored[0][0]
        relaxed = not (enforce_site and enforce_dept)
        if relaxed and not scored[0][1] and max_score < 0.75:
            continue
        if max_score < 0.33 and not scored[0][1]:
            continue
        selected = []
        for score, code_hit, status in scored:
            if score < max_score - 0.05 and not (code_hit and score >= 0.7):
                continue
            if score < 0.33 and not code_hit:
                continue
            path = ROOT / str(status.get("path", ""))
            if not path.exists():
                continue
            if relaxed:
                confidence = "HCL fallback needs review"
            else:
                confidence = "HCL fallback high confidence" if score >= 0.75 or code_hit else "HCL fallback needs review"
            selected.append(
                PdfEvidence(
                    path=path,
                    rel_path=rel(path),
                    source_kind=str(status.get("source_kind", "HCL clean PDF")),
                match_method="pdf_filename_title_token_fallback",
                    match_score=score,
                    match_confidence=confidence,
                )
            )
        if selected:
            return selected[:8]
    return []


def classify(app: AppSource) -> None:
    if not app.pdfs:
        app.status = "Blocked - No PDF Match"
        app.notes.append("No explicit embedded PDF mapping or HCL clean PDF fallback match met threshold.")
        return
    total_text = sum(pdf.text_chars for pdf in app.pdfs)
    if total_text == 0:
        app.status = "Extracted - OCR Required"
        app.notes.append("PDF matched, but no extractable text was available.")
    elif any("needs review" in pdf.match_confidence.lower() for pdf in app.pdfs):
        app.status = "Extracted - Needs Review"
        app.notes.append("PDF matched through fallback scoring; confirm ownership/form identity before build.")
    elif not app.fields:
        app.status = "Extracted - Needs Review"
        app.notes.append("PDF text extracted, but no label-field pairs were parsed.")
    else:
        app.status = "Extracted"


def process() -> list[AppSource]:
    master_rows = read_csv(MASTER_CSV)
    app_map = read_csv(APP_MAPPING_CSV)
    embedded_map = read_csv(EMBEDDED_MAPPING_CSV)
    status_rows = load_status_rows()
    status_by_rel = {str(row.get("path")): row for row in status_rows}
    fallback_pdf_rows = [
        row
        for row in status_rows
        if row.get("file_type") == "PDF"
    ]
    app_index = build_mapping_index(app_map, "title")
    embedded_index = build_mapping_index(embedded_map, "matched_app_title")

    if OUT_ROOT.exists():
        shutil.rmtree(OUT_ROOT)
    REQ_ROOT.mkdir(parents=True, exist_ok=True)

    apps: list[AppSource] = []
    for index, row in enumerate(master_rows, start=1):
        app = AppSource(index=index, row=row)
        pdfs = collect_explicit_pdfs(row, app_index, embedded_index)
        if not pdfs:
            pdfs = embedded_meta_fallback(row, embedded_map)
        if not pdfs:
            pdfs = hcl_fallback(row, fallback_pdf_rows)
        seen = set()
        for pdf in pdfs:
            if pdf.rel_path in seen:
                continue
            seen.add(pdf.rel_path)
            app.pdfs.append(extract_pdf(pdf, status_by_rel))
        combined_text = "\n".join(pdf.text for pdf in app.pdfs)
        app.fields = parse_fields(combined_text)
        app.sections = infer_sections(combined_text, row)
        workflow_hits = WORKFLOW_TERMS.findall(combined_text)
        if workflow_hits:
            counts = Counter(hit.lower() for hit in workflow_hits)
            app.workflow_summary = ", ".join(f"{term} ({count})" for term, count in counts.most_common(8))
        classify(app)
        write_app_artifact(app)
        apps.append(app)
    return apps


def write_csv(path: Path, rows: list[dict[str, object]], headers: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_reports(apps: list[AppSource]) -> None:
    coverage_rows: list[dict[str, object]] = []
    field_rows: list[dict[str, object]] = []
    workflow_rows: list[list[object]] = []
    role_rows: list[list[object]] = []
    sp_rows: list[list[object]] = []
    pa_rows: list[list[object]] = []

    for app in apps:
        row = app.row
        pdf_paths = "; ".join(pdf.rel_path for pdf in app.pdfs)
        methods = "; ".join(sorted({pdf.match_method for pdf in app.pdfs})) if app.pdfs else "-"
        confidence = "; ".join(sorted({pdf.match_confidence for pdf in app.pdfs})) if app.pdfs else "-"
        coverage_rows.append(
            {
                "master_index": app.index,
                "site": row.get("site", ""),
                "owner": row.get("owner", ""),
                "department": row.get("department", ""),
                "app_name": row.get("app_name", ""),
                "form_list": row.get("form_list", ""),
                "build_readiness": row.get("build_readiness", ""),
                "original_source_status": row.get("overall_source_status", ""),
                "analysis_status": app.status,
                "artifact_path": rel(app.artifact_path) if app.artifact_path else "",
                "pdf_count": len(app.pdfs),
                "pdf_paths": pdf_paths,
                "match_methods": methods,
                "match_confidence": confidence,
                "field_count": len(app.fields),
                "workflow_signal_count": sum(pdf.workflow_signal_count for pdf in app.pdfs),
                "notes": "; ".join(app.notes),
            }
        )
        for idx, field_item in enumerate(app.fields, start=1):
            field_rows.append(
                {
                    "master_index": app.index,
                    "site": row.get("site", ""),
                    "owner": row.get("owner", ""),
                    "app_name": row.get("app_name", ""),
                    "form_code": form_code(row, app.index),
                    "field_sequence": idx,
                    "label": field_item["label"],
                    "source_field": field_item["field_name"],
                    "recommended_type": field_item["type"],
                    "confidence": field_item["confidence"],
                }
            )
        workflow_rows.append(
            [
                app.index,
                row.get("site", ""),
                row.get("owner", ""),
                row.get("app_name", ""),
                "Yes" if app.workflow_summary != "Unknown" else "Unknown",
                app.workflow_summary,
                app.status,
            ]
        )
        for section in app.sections:
            role_rows.append([app.index, row.get("site", ""), row.get("owner", ""), row.get("app_name", ""), section, "Needs Human Confirmation"])
        sp_rows.append(
            [
                app.index,
                row.get("site", ""),
                row.get("owner", ""),
                row.get("app_name", ""),
                parent_list(row),
                form_code(row, app.index),
                f"{parent_list(row)}_Ext_{form_code(row, app.index)}_Rows" if has_repeating_fields(app.fields) else "-",
                app.status,
            ]
        )
        pa_rows.append(
            [
                app.index,
                row.get("site", ""),
                row.get("owner", ""),
                row.get("app_name", ""),
                "List; New/Edit; Detail" + ("; Approval Actions" if app.workflow_summary != "Unknown" else ""),
                "Editable gallery candidate" if has_repeating_fields(app.fields) else "Standard form",
                app.status,
            ]
        )

    headers = list(coverage_rows[0].keys())
    write_csv(COVERAGE_CSV, coverage_rows, headers)
    COVERAGE_JSON.write_text(json.dumps(coverage_rows, indent=2), encoding="utf-8")
    write_csv(FIELD_CSV, field_rows, list(field_rows[0].keys()) if field_rows else [])

    status_counts = Counter(row["analysis_status"] for row in coverage_rows)
    site_counts = Counter(row["site"] for row in coverage_rows)
    owner_counts = Counter(row["owner"] or "Unknown" for row in coverage_rows)
    missing = [row for row in coverage_rows if str(row["analysis_status"]).startswith("Blocked")]

    COVERAGE_MD.write_text(
        "\n".join(
            [
                "# Master App Source Coverage",
                "",
                f"Generated: {GENERATED_AT}",
                f"Master inventory: `{rel(MASTER_CSV)}`",
                "",
                "## Summary",
                "",
                markdown_table(
                    ["Metric", "Value"],
                    [
                        ["Master rows", len(coverage_rows)],
                        ["Rows with PDF evidence", sum(1 for row in coverage_rows if int(row["pdf_count"]) > 0)],
                        ["Rows blocked with no PDF match", len(missing)],
                        ["Parsed field rows", len(field_rows)],
                    ],
                ),
                "",
                "## Status Counts",
                "",
                markdown_table(["Status", "Rows"], status_counts.items()),
                "",
                "## Site Counts",
                "",
                markdown_table(["Site", "Rows"], site_counts.items()),
                "",
                "## Owner Counts",
                "",
                markdown_table(["Owner", "Rows"], owner_counts.most_common()),
                "",
                "## Blocked Rows",
                "",
                markdown_table(
                    ["Master Index", "Site", "Owner", "Application", "Reason"],
                    [
                        [row["master_index"], row["site"], row["owner"], row["app_name"], row["notes"]]
                        for row in missing
                    ]
                    or [["-", "-", "-", "None", "All master rows have a generated source artifact"]],
                ),
                "",
                "## Full Coverage",
                "",
                markdown_table(
                    [
                        "Index",
                        "Site",
                        "Owner",
                        "Application",
                        "Status",
                        "PDFs",
                        "Fields",
                        "Artifact",
                    ],
                    [
                        [
                            row["master_index"],
                            row["site"],
                            row["owner"],
                            row["app_name"],
                            row["analysis_status"],
                            row["pdf_count"],
                            row["field_count"],
                            row["artifact_path"],
                        ]
                        for row in coverage_rows
                    ],
                ),
                "",
            ]
        ),
        encoding="utf-8",
    )

    FIELD_MD.write_text(
        "\n".join(
            [
                "# Master Field Dictionary",
                "",
                f"Generated: {GENERATED_AT}",
                f"Rows: {len(field_rows)}",
                "",
                markdown_table(
                    ["Master", "Site", "Owner", "App", "FormCode", "Label", "Source Field", "Type", "Confidence"],
                    [
                        [
                            row["master_index"],
                            row["site"],
                            row["owner"],
                            row["app_name"],
                            row["form_code"],
                            row["label"],
                            row["source_field"],
                            row["recommended_type"],
                            row["confidence"],
                        ]
                        for row in field_rows
                    ],
                ),
                "",
            ]
        ),
        encoding="utf-8",
    )
    WORKFLOW_MD.write_text(
        "# Master Workflow Register\n\n"
        + markdown_table(["Master", "Site", "Owner", "Application", "Approval Required", "Evidence", "Status"], workflow_rows)
        + "\n",
        encoding="utf-8",
    )
    ROLE_MD.write_text(
        "# Master Role/Section Register\n\n"
        + markdown_table(["Master", "Site", "Owner", "Application", "Section", "Role Dependency"], role_rows)
        + "\n",
        encoding="utf-8",
    )
    SP_MD.write_text(
        "# Master SharePoint Design Register\n\n"
        + markdown_table(["Master", "Site", "Owner", "Application", "Parent List", "FormCode", "Child List Candidate", "Status"], sp_rows)
        + "\n",
        encoding="utf-8",
    )
    PA_MD.write_text(
        "# Master Power Apps Spec Register\n\n"
        + markdown_table(["Master", "Site", "Owner", "Application", "Screens", "Component Pattern", "Status"], pa_rows)
        + "\n",
        encoding="utf-8",
    )


def main() -> None:
    apps = process()
    write_reports(apps)
    counts = Counter(app.status for app in apps)
    print(f"Generated master source artifacts: {len(apps)}")
    for status, count in counts.most_common():
        print(f"{status}: {count}")
    print(f"Coverage: {rel(COVERAGE_MD)}")


if __name__ == "__main__":
    main()
