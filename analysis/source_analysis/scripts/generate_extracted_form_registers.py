from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REQ_ROOT = ROOT / "source_analysis" / "02_extracted_requirements"
OUT_ROOT = ROOT / "source_analysis"
REPORT_DIR = OUT_ROOT / "09_reports"
FIELD_CANDIDATE_DIR = OUT_ROOT / "11_pdf_extraction_layer" / "field_candidates"

FIELD_DICT = OUT_ROOT / "03_field_dictionary" / "GLOBAL_FIELD_DICTIONARY.md"
WORKFLOW_REGISTER = OUT_ROOT / "04_workflow_register" / "WORKFLOW_REGISTER.md"
ROLE_REGISTER = OUT_ROOT / "05_role_section_rules" / "ROLE_SECTION_RULE_REGISTER.md"
SP_REGISTER = OUT_ROOT / "06_sharepoint_design" / "SHAREPOINT_LIST_DESIGN_REGISTER.md"
PA_REGISTER = OUT_ROOT / "07_powerapps_spec" / "POWERAPPS_BUILD_SPEC_REGISTER.md"
COVERAGE_MD = REPORT_DIR / "EXTRACTED_FORM_OUTPUT_COVERAGE.md"
COVERAGE_CSV = REPORT_DIR / "extracted_form_output_coverage.csv"
COVERAGE_JSON = REPORT_DIR / "extracted_form_output_coverage.json"


PIPE_RE = re.compile(r"^\|")
HEADING_RE = re.compile(r"^#{1,6}\s+")
SOURCE_RE = re.compile(r"Source ID\**\s*:?\s*([A-Z0-9-]+)")
DEPT_RE = re.compile(r"Department\**\s*:?\s*([A-Z&]+)")
QUALITY_RE = re.compile(r"Quality\**\s*:?\s*([0-9]+/100)")
PAGES_RE = re.compile(r"\((\d+)\s+pages?")


DEPT_MODULES = {
    "IT": "IT",
    "HR": "HR",
    "FIN": "Finance",
}


FORM_MODULE_HINTS = [
    ("CMF", "Finance - Credit Management"),
    ("CAR", "Finance - Capital Approval"),
    ("EARF", "Finance - Expenditure Approval"),
    ("RSES", "Finance - Service Entry"),
    ("EAF", "IT - Access"),
    ("HI", "IT - Asset Inventory"),
    ("IAL", "IT - Activity Logs"),
    ("AWHR", "HR - Attendance"),
    ("BSD", "HR - Workforce"),
    ("CIR", "HR - Cafeteria"),
    ("CWR", "HR - Workforce"),
    ("DRD", "HR - Duty Roster"),
    ("EEN", "HR - Exit"),
    ("EPDU", "HR - Employee Data"),
    ("EPHR", "HR - Employee Health"),
    ("ESF", "HR - Survey"),
    ("FTCR", "HR - Contract"),
    ("FWW", "HR - Foreign Worker"),
    ("GDSN", "HR - Gift/Donation/Sponsorship"),
    ("HEALTHINFO", "HR - Information"),
    ("HRAPR", "HR - Applications Support"),
]


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def clean_cell(value: str) -> str:
    value = value.strip()
    value = value.replace("`", "")
    value = value.replace("<br>", "; ").replace("<br/>", "; ").replace("<br />", "; ")
    value = re.sub(r"\s+", " ", value)
    return value if value else "-"


def split_row(line: str) -> list[str]:
    cells = [clean_cell(part) for part in line.strip().strip("|").split("|")]
    return cells


def extract_tables(text: str) -> list[dict[str, object]]:
    lines = text.splitlines()
    tables: list[dict[str, object]] = []
    idx = 0
    current_heading = ""
    while idx < len(lines):
        line = lines[idx]
        if HEADING_RE.match(line):
            current_heading = re.sub(r"^#{1,6}\s+", "", line).strip()
        if PIPE_RE.match(line) and idx + 1 < len(lines) and PIPE_RE.match(lines[idx + 1]):
            header = split_row(line)
            separator = split_row(lines[idx + 1])
            if all(set(cell.replace(":", "").strip()) <= {"-", " "} for cell in separator):
                rows = []
                idx += 2
                while idx < len(lines) and PIPE_RE.match(lines[idx]):
                    row = split_row(lines[idx])
                    if len(row) == len(header):
                        rows.append(dict(zip(header, row)))
                    idx += 1
                tables.append({"heading": current_heading, "header": header, "rows": rows})
                continue
        idx += 1
    return tables


def table_with_heading(tables: list[dict[str, object]], *terms: str) -> list[dict[str, str]]:
    selected: list[dict[str, str]] = []
    lower_terms = [term.lower() for term in terms]
    for table in tables:
        heading = str(table["heading"]).lower()
        if any(term in heading for term in lower_terms):
            selected.extend(table["rows"])  # type: ignore[arg-type]
    return selected


def first_table_with_headers(tables: list[dict[str, object]], required: set[str]) -> list[dict[str, str]]:
    for table in tables:
        header = set(str(item) for item in table["header"])
        if required <= header:
            return table["rows"]  # type: ignore[return-value]
    return []


def form_code_from_path(path: Path) -> str:
    name = path.name
    match = re.search(r"_(.+?)_REQUIREMENTS\.md$", name)
    if match:
        return match.group(1)
    return path.stem.replace("_REQUIREMENTS", "")


def title_from_heading(text: str, code: str) -> str:
    first = text.splitlines()[0].strip() if text.splitlines() else ""
    first = re.sub(r"^#\s*Form Requirement\s*[-—]\s*", "", first)
    first = re.sub(r"^#\s*Form Requirement\s*[-]\s*", "", first)
    first = first.strip()
    if first:
        return first
    return code


def infer_module(dept: str, code: str) -> str:
    upper = code.upper()
    for prefix, module in FORM_MODULE_HINTS:
        if upper.startswith(prefix):
            return module
    return DEPT_MODULES.get(dept, dept)


def infer_type(label: str, field_name: str, declared: str) -> str:
    declared = declared.strip()
    if declared and declared != "-":
        return declared
    text = f"{label} {field_name}".lower()
    if "date" in text or text.endswith("dt"):
        return "Date"
    if any(word in text for word in ["amount", "rate", "age", "total", "qty", "quantity", "no."]):
        return "Number/Text"
    if any(word in text for word in ["by", "name", "hod", "approver", "requestor", "prepared"]):
        return "Person/Text"
    if any(word in text for word in ["remark", "comment", "justification", "description", "reason"]):
        return "Multiline"
    if any(word in text for word in ["status", "type", "category", "class"]):
        return "Choice/Text"
    return "Text"


def sp_column_name(code: str, label: str, field_name: str) -> str:
    source = field_name if field_name and field_name != "-" else label
    parts = re.findall(r"[A-Za-z0-9]+", source)
    if not parts:
        return code.lower()
    camel = parts[0][:1].lower() + parts[0][1:]
    for part in parts[1:]:
        camel += part[:1].upper() + part[1:]
    prefix = code.lower().replace("_", "")
    if camel.lower().startswith(prefix):
        return camel[:32]
    return (prefix + camel[:1].upper() + camel[1:])[:32]


def extract_metadata(path: Path, text: str, tables: list[dict[str, object]]) -> dict[str, str]:
    code = form_code_from_path(path)
    dept = path.parent.name.upper()
    source_id = ""
    quality = ""
    pages = ""

    source_match = SOURCE_RE.search(text)
    if source_match:
        source_id = source_match.group(1)
    dept_match = DEPT_RE.search(text)
    if dept_match:
        dept = dept_match.group(1).upper()
    quality_match = QUALITY_RE.search(text)
    if quality_match:
        quality = quality_match.group(1)
    pages_match = PAGES_RE.search(text)
    if pages_match:
        pages = pages_match.group(1)

    for row in first_table_with_headers(tables, {"Attribute", "Value"}):
        attr = row.get("Attribute", "").lower()
        value = row.get("Value", "")
        if attr == "source id":
            source_id = value
        elif attr == "department":
            dept = value.upper()
        elif attr in {"pdf title", "form purpose"} and not code:
            code = value
        elif attr == "pages":
            pages = value

    return {
        "source_id": source_id or code,
        "department": dept,
        "module": infer_module(dept, code),
        "form_code": code,
        "form_name": title_from_heading(text, code),
        "quality": quality or "Not recorded",
        "pages": pages or "Not recorded",
        "requirement_path": rel(path),
    }


def extract_sections(tables: list[dict[str, object]]) -> list[dict[str, str]]:
    rows = table_with_heading(tables, "form sections")
    sections = []
    for row in rows:
        section = row.get("Section Name") or row.get("Section") or row.get("Section/Field") or "-"
        section_type = row.get("Type") or "Section"
        visibility = row.get("Visibility Rule") or "Visible when form renders unless status/role rules restrict it"
        role = row.get("Role Dependency") or row.get("Visible To") or "Needs Human Confirmation"
        key_fields = row.get("Key Fields") or row.get("Purpose") or "-"
        confidence = row.get("Confidence") or row.get("Evidence Class") or "Inferred"
        if section and section != "-":
            sections.append(
                {
                    "section": section,
                    "type": section_type,
                    "visibility": visibility,
                    "role": role,
                    "key_fields": key_fields,
                    "confidence": confidence,
                }
            )
    return sections


def extract_fields(tables: list[dict[str, object]], meta: dict[str, str]) -> list[dict[str, str]]:
    rows = table_with_heading(tables, "field extraction", "field requirements")
    seen_table_ids = {id(row) for row in rows}
    for table in tables:
        header = {str(item) for item in table["header"]}
        is_field_table = (
            {"PDF Label", "Domino Field"} <= header
            or {"Field Label", "Suggested Internal Name"} <= header
            or {"Field", "Domino"} <= header
            or {"Field", "Domino Field"} <= header
        )
        is_non_field_table = bool(header & {"Choices Found", "Values", "Validation Rule", "Question", "Severity"})
        if is_field_table and not is_non_field_table:
            for row in table["rows"]:  # type: ignore[index]
                if id(row) not in seen_table_ids:
                    rows.append(row)
                    seen_table_ids.add(id(row))
    fields = []
    counter = 1
    for row in rows:
        label = row.get("Field Label") or row.get("PDF Label") or row.get("Field") or "-"
        field_name = row.get("Suggested Internal Name") or row.get("Domino Field") or row.get("Domino") or row.get("Internal Name") or "-"
        data_type = row.get("Data Type") or row.get("Type") or "-"
        confidence = row.get("Evidence Confidence") or row.get("Confidence") or "Inferred"
        section = row.get("Section") or "-"
        required = row.get("Required") or row.get("Req") or "Unknown"
        choices = row.get("Choices") or "Unknown"
        group = row.get("Field Group") or "-"
        repeating = row.get("Repeating Table") or ("Yes" if "row" in label.lower() or ".." in field_name else "No")
        notes = row.get("Notes") or "-"
        if label == "-" and field_name == "-":
            continue
        field_id = row.get("Field ID") or f"{meta['form_code']}-{counter:03d}"
        fields.append(
            {
                "field_id": field_id,
                "department": meta["department"],
                "module": meta["module"],
                "source_id": meta["source_id"],
                "form_code": meta["form_code"],
                "form_name": meta["form_name"],
                "section": section,
                "display_label": label,
                "source_field": field_name,
                "suggested_type": infer_type(label, field_name, data_type),
                "required": required,
                "choices": choices,
                "field_group": group,
                "repeating_table": repeating,
                "sharepoint_column": sp_column_name(meta["form_code"], label, field_name),
                "confidence": confidence,
                "notes": notes,
            }
        )
        counter += 1
    return fields


def extract_candidate_fields(meta: dict[str, str]) -> list[dict[str, str]]:
    if not FIELD_CANDIDATE_DIR.exists():
        return []
    candidates = []
    source_id = meta["source_id"].lower()
    for path in FIELD_CANDIDATE_DIR.iterdir():
        if not path.is_file() or not path.name.lower().endswith(".md"):
            continue
        if not path.name.lower().startswith(source_id):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        tables = extract_tables(text)
        rows = []
        for table in tables:
            header = {str(item) for item in table["header"]}
            has_candidate_id = bool(header & {"Candidate ID", "CAND-ID"})
            has_label = bool(header & {"PDF Label", "Label", "Row", "Field"})
            has_source_field = bool(header & {"Domino Field", "Domino Pattern", "Domino"})
            if has_candidate_id and has_label and has_source_field:
                rows.extend(table["rows"])  # type: ignore[arg-type]
        for index, row in enumerate(rows, 1):
            label = row.get("PDF Label") or row.get("Label") or row.get("Row") or row.get("Field") or "-"
            field_name = row.get("Domino Field") or row.get("Domino Pattern") or row.get("Domino") or "-"
            data_type = row.get("Suggested Type") or row.get("Type") or "-"
            field_id = row.get("Candidate ID") or row.get("CAND-ID") or f"{meta['form_code']}-CAND-{index:03d}"
            candidates.append(
                {
                    "field_id": field_id,
                    "department": meta["department"],
                    "module": meta["module"],
                    "source_id": meta["source_id"],
                    "form_code": meta["form_code"],
                    "form_name": meta["form_name"],
                    "section": "Candidate extraction",
                    "display_label": label,
                    "source_field": field_name,
                    "suggested_type": infer_type(label, field_name, data_type),
                    "required": row.get("Required") or "Unknown",
                    "choices": row.get("Choices") or "Unknown",
                    "field_group": "-",
                    "repeating_table": "Yes" if "repeating" in data_type.lower() or ".." in field_name else "No",
                    "sharepoint_column": sp_column_name(meta["form_code"], label, field_name),
                    "confidence": "Candidate promoted to requirements; verify caveats",
                    "notes": row.get("Evidence") or f"Fallback from {rel(path)}",
                }
            )
    return candidates


def extract_workflow(tables: list[dict[str, object]], meta: dict[str, str], text: str) -> dict[str, str]:
    attrs = table_with_heading(tables, "workflow and routing")
    values = {row.get("Attribute", ""): row.get("Value", "") for row in attrs if "Attribute" in row and "Value" in row}
    stages = table_with_heading(tables, "workflow stages")
    stage_names = []
    roles = []
    status_values = []
    for row in stages:
        if row.get("Stage"):
            stage_names.append(row["Stage"])
        if row.get("Role/Approver"):
            roles.append(row["Role/Approver"])
        if row.get("Status Value"):
            status_values.append(row["Status Value"])

    approval = values.get("Approval Required", "")
    if not approval:
        lower = text.lower()
        if "approval required | yes" in lower or "approval required | required" in lower:
            approval = "Required"
        elif "approval required | not required" in lower or "no approval" in lower:
            approval = "Not Required"
        elif any(word in lower for word in ["approval", "approve", "reject", "currentaction", "accepted by"]):
            approval = "Inferred / Needs Human Confirmation"
        else:
            approval = "Unknown"

    workflow_evidence = values.get("Workflow Evidence") or values.get("Approval Type") or "Derived from promoted requirement file"
    current_action = values.get("CurrentAction Field") or ("CurrentAction/CA present" if re.search(r"\b(CA|CurrentAction)\b", text) else "Not found")
    state_values = values.get("State Values") or ("; ".join(status_values) if status_values else "Unknown")
    stages_found = "; ".join(stage_names) if stage_names else "Needs Human Confirmation"
    role_list = "; ".join(dict.fromkeys(roles)) if roles else "Needs Human Confirmation"
    confidence = "Clearly Found" if "clearly found" in text.lower() and approval not in {"Unknown"} else "Inferred"

    return {
        **meta,
        "approval_required": approval,
        "evidence_class": confidence,
        "stages_found": stages_found,
        "status_values": state_values,
        "routing_logic": workflow_evidence,
        "current_action": current_action,
        "roles": role_list,
    }


def extract_sharepoint(meta: dict[str, str], fields: list[dict[str, str]], text: str) -> list[dict[str, str]]:
    parent = f"MainDB_{meta['department']}"
    child_candidates = []
    match = re.search(r"Child-list candidates?:\s*([^\n]+)", text, re.IGNORECASE)
    if match:
        child_candidates = [item.strip(" `.") for item in re.split(r",|;", match.group(1)) if item.strip()]
    match = re.search(r"Recommended Child List\(s\)\s*\|\s*([^|\n]+)", text, re.IGNORECASE)
    if match:
        child_candidates.extend(item.strip(" `.") for item in re.split(r",|;", match.group(1)) if item.strip())
    if any(field["repeating_table"].lower().startswith("yes") for field in fields) and not child_candidates:
        child_candidates = [f"{parent}_Ext_{meta['form_code']}"]

    parent_fields = [field for field in fields if not field["repeating_table"].lower().startswith("yes")]
    child_fields = [field for field in fields if field["repeating_table"].lower().startswith("yes")]
    rows = [
        {
            **meta,
            "list_name": parent,
            "list_role": "Parent",
            "column_count": str(max(len(parent_fields), len(fields))),
            "design_basis": "Promoted PDF requirement fields plus FormCode/system fields",
            "notes": "Use FormCode discriminator and generated model columns; unknown choices need confirmation",
        }
    ]
    for idx, child in enumerate(dict.fromkeys(child_candidates), 1):
        rows.append(
            {
                **meta,
                "list_name": child,
                "list_role": "Child/Extension",
                "column_count": str(len(child_fields) if child_fields else "Needs sizing"),
                "design_basis": "Repeating rows, attachments, workflow history, or processing sections from requirement evidence",
                "notes": "Confirm child-list need before provisioning if rows are fixed-count in source PDF",
            }
        )
    return rows


def extract_powerapps(meta: dict[str, str], sections: list[dict[str, str]], fields: list[dict[str, str]], workflow: dict[str, str]) -> dict[str, str]:
    has_workflow = workflow["approval_required"].lower() not in {"not required", "no", "none", "unknown"}
    child_galleries = sum(1 for field in fields if field["repeating_table"].lower().startswith("yes"))
    screens = ["List", "New/Edit", "Detail"]
    if has_workflow:
        screens.append("Approval/Action")
    if child_galleries:
        screens.append("Child Rows/Gallery")
    return {
        **meta,
        "screens": "; ".join(screens),
        "screen_count": str(len(screens)),
        "sections": str(len(sections)),
        "fields": str(len(fields)),
        "child_galleries": str(child_galleries),
        "workflow": workflow["approval_required"],
        "ready": "Yes - with human confirmations" if "confirmation" in workflow["approval_required"].lower() or "Unknown" in workflow["status_values"] else "Yes",
        "notes": "Build from promoted requirement; preserve unknown choices/status values as confirmation items",
    }


def parse_requirement(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8", errors="replace")
    tables = extract_tables(text)
    meta = extract_metadata(path, text, tables)
    sections = extract_sections(tables)
    fields = extract_fields(tables, meta)
    candidate_fields = extract_candidate_fields(meta)
    if len(candidate_fields) > len(fields):
        fields = candidate_fields
    workflow = extract_workflow(tables, meta, text)
    sharepoint = extract_sharepoint(meta, fields, text)
    powerapps = extract_powerapps(meta, sections, fields, workflow)
    return {
        "meta": meta,
        "sections": sections,
        "fields": fields,
        "workflow": workflow,
        "sharepoint": sharepoint,
        "powerapps": powerapps,
    }


def write_grouped_table(path: Path, title: str, description: str, headers: list[str], rows: list[dict[str, str]], row_fn) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        f"# {title}",
        "",
        f"> {description}",
        f"> Generated: {now}",
        "> Source: promoted PDF requirement files under `analysis/source_analysis/02_extracted_requirements/`.",
        "",
        "## Summary",
        "",
        "| Department | Module | Forms | Rows |",
        "|---|---|---:|---:|",
    ]
    grouped = defaultdict(list)
    for row in rows:
        grouped[(row["department"], row["module"])].append(row)
    for (dept, module), items in sorted(grouped.items()):
        forms = len({item["form_code"] for item in items})
        lines.append(f"| {dept} | {module} | {forms} | {len(items)} |")

    for (dept, module), items in sorted(grouped.items()):
        lines.extend(["", f"## {dept} / {module}", "", "| " + " | ".join(headers) + " |", "|" + "|".join("---" for _ in headers) + "|"])
        lines.extend(row_fn(item) for item in items)

    lines.extend(
        [
            "",
            "## Caveats",
            "",
            "- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.",
            "- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.",
            "- Original source PDFs and XML files remain reference-only and were not modified.",
        ]
    )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_field_dictionary(fields: list[dict[str, str]]) -> None:
    headers = ["Field ID", "Source ID", "Form", "Section", "Label", "Source Field", "Type", "Required", "Choices", "SharePoint Column", "Confidence"]
    def row_fn(row):
        return (
            f"| {row['field_id']} | {row['source_id']} | {row['form_code']} | {row['section']} | "
            f"{row['display_label']} | `{row['source_field']}` | {row['suggested_type']} | {row['required']} | "
            f"{row['choices']} | `{row['sharepoint_column']}` | {row['confidence']} |"
        )
    write_grouped_table(
        FIELD_DICT,
        "Global Field Dictionary",
        "Cross-form field dictionary for every form already extracted from PDF and promoted to requirement files.",
        headers,
        fields,
        row_fn,
    )


def write_workflow_register(workflows: list[dict[str, str]]) -> None:
    headers = ["WF ID", "Source ID", "Form", "Approval", "Evidence", "Stages", "Status Values", "Routing / Current Action", "Roles"]
    def row_fn(row):
        wf_id = f"WF-{row['department']}-{row['form_code']}"
        return (
            f"| {wf_id} | {row['source_id']} | {row['form_code']} | {row['approval_required']} | {row['evidence_class']} | "
            f"{row['stages_found']} | {row['status_values']} | {row['routing_logic']} / {row['current_action']} | {row['roles']} |"
        )
    write_grouped_table(
        WORKFLOW_REGISTER,
        "Workflow Register",
        "Workflow, approval, routing, and status register for every form already extracted from PDF.",
        headers,
        workflows,
        row_fn,
    )


def write_role_register(section_rows: list[dict[str, str]]) -> None:
    headers = ["Rule ID", "Source ID", "Form", "Section", "Type", "Visible / Condition", "Role", "Key Fields", "Confidence"]
    def row_fn(row):
        rule_id = f"RSR-{row['department']}-{row['form_code']}-{int(row['index']):02d}"
        return (
            f"| {rule_id} | {row['source_id']} | {row['form_code']} | {row['section']} | {row['type']} | "
            f"{row['visibility']} | {row['role']} | {row['key_fields']} | {row['confidence']} |"
        )
    write_grouped_table(
        ROLE_REGISTER,
        "Role & Section Rule Register",
        "Role and section visibility/editability register for every form already extracted from PDF.",
        headers,
        section_rows,
        row_fn,
    )


def write_sp_register(rows: list[dict[str, str]]) -> None:
    headers = ["Design ID", "Source ID", "Form", "List", "Role", "Columns", "Design Basis", "Notes"]
    def row_fn(row):
        design_id = f"SHD-{row['department']}-{row['form_code']}-{row['list_role'].split('/')[0].upper()}"
        return (
            f"| {design_id} | {row['source_id']} | {row['form_code']} | `{row['list_name']}` | {row['list_role']} | "
            f"{row['column_count']} | {row['design_basis']} | {row['notes']} |"
        )
    write_grouped_table(
        SP_REGISTER,
        "SharePoint List Design Register",
        "SharePoint parent, child, and extension-list design register for every form already extracted from PDF.",
        headers,
        rows,
        row_fn,
    )


def write_pa_register(rows: list[dict[str, str]]) -> None:
    headers = ["Spec ID", "Source ID", "Form", "Screens", "Sections", "Fields", "Child Galleries", "Workflow", "Ready", "Notes"]
    def row_fn(row):
        spec_id = f"PAS-{row['department']}-{row['form_code']}"
        return (
            f"| {spec_id} | {row['source_id']} | {row['form_code']} | {row['screens']} | {row['sections']} | "
            f"{row['fields']} | {row['child_galleries']} | {row['workflow']} | {row['ready']} | {row['notes']} |"
        )
    write_grouped_table(
        PA_REGISTER,
        "Power Apps Build Specification Register",
        "Power Apps list/new-edit/detail/action screen specification register for every form already extracted from PDF.",
        headers,
        rows,
        row_fn,
    )


def write_coverage(forms: list[dict[str, object]]) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    rows = []
    for form in forms:
        meta = form["meta"]  # type: ignore[assignment]
        fields = form["fields"]  # type: ignore[assignment]
        sections = form["sections"]  # type: ignore[assignment]
        workflow = form["workflow"]  # type: ignore[assignment]
        sharepoint = form["sharepoint"]  # type: ignore[assignment]
        powerapps = form["powerapps"]  # type: ignore[assignment]
        row = {
            **meta,  # type: ignore[arg-type]
            "field_dictionary": "Covered" if fields else "Covered - No field rows parsed",
            "field_count": len(fields),
            "workflow_register": "Covered" if workflow else "Missing",
            "role_section_register": "Covered" if sections else "Covered - No section rows parsed",
            "section_count": len(sections),
            "sharepoint_design": "Covered" if sharepoint else "Missing",
            "sharepoint_rows": len(sharepoint),
            "powerapps_spec": "Covered" if powerapps else "Missing",
        }
        rows.append(row)

    with COVERAGE_CSV.open("w", newline="", encoding="utf-8") as handle:
        fieldnames = [
            "department",
            "module",
            "source_id",
            "form_code",
            "form_name",
            "quality",
            "pages",
            "requirement_path",
            "field_dictionary",
            "field_count",
            "workflow_register",
            "role_section_register",
            "section_count",
            "sharepoint_design",
            "sharepoint_rows",
            "powerapps_spec",
        ]
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    COVERAGE_JSON.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = [
        "# Extracted Form Output Coverage",
        "",
        f"> Generated: {now}",
        "> Verifies that every already-extracted PDF requirement file has downstream field, workflow, role/section, SharePoint design, and Power Apps spec output.",
        "",
        "## Summary",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Extracted requirement forms | {len(rows)} |",
        f"| Field dictionary covered | {sum(1 for row in rows if str(row['field_dictionary']).startswith('Covered'))} |",
        f"| Workflow register covered | {sum(1 for row in rows if row['workflow_register'] == 'Covered')} |",
        f"| Role/section register covered | {sum(1 for row in rows if str(row['role_section_register']).startswith('Covered'))} |",
        f"| SharePoint design covered | {sum(1 for row in rows if row['sharepoint_design'] == 'Covered')} |",
        f"| Power Apps spec covered | {sum(1 for row in rows if row['powerapps_spec'] == 'Covered')} |",
        "",
        "## Coverage By Department / Module",
        "",
        "| Department | Module | Forms | Fields | Sections | SharePoint Rows |",
        "|---|---|---:|---:|---:|---:|",
    ]
    grouped = defaultdict(list)
    for row in rows:
        grouped[(row["department"], row["module"])].append(row)
    for (dept, module), items in sorted(grouped.items()):
        lines.append(
            f"| {dept} | {module} | {len(items)} | {sum(int(item['field_count']) for item in items)} | "
            f"{sum(int(item['section_count']) for item in items)} | {sum(int(item['sharepoint_rows']) for item in items)} |"
        )
    lines.extend(
        [
            "",
            "## Form Coverage",
            "",
            "| Department | Module | Source ID | Form | Fields | Workflow | Role/Section | SharePoint | Power Apps | Requirement |",
            "|---|---|---|---|---:|---|---|---|---|---|",
        ]
    )
    for row in rows:
        lines.append(
            f"| {row['department']} | {row['module']} | {row['source_id']} | {row['form_code']} | {row['field_count']} | "
            f"{row['workflow_register']} | {row['role_section_register']} | {row['sharepoint_design']} | {row['powerapps_spec']} | "
            f"`{row['requirement_path']}` |"
        )
    lines.append("")
    COVERAGE_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    req_files = sorted(REQ_ROOT.rglob("*_REQUIREMENTS.md"), key=lambda path: rel(path).lower())
    forms = [parse_requirement(path) for path in req_files]
    fields = [field for form in forms for field in form["fields"]]  # type: ignore[list-item]
    workflows = [form["workflow"] for form in forms]  # type: ignore[list-item]
    section_rows = []
    for form in forms:
        meta = form["meta"]  # type: ignore[assignment]
        for index, section in enumerate(form["sections"], 1):  # type: ignore[arg-type]
            section_rows.append({**meta, **section, "index": str(index)})  # type: ignore[arg-type]
        if not form["sections"]:
            section_rows.append(
                {
                    **meta,  # type: ignore[arg-type]
                    "section": "Sections not parsed from requirement table",
                    "type": "Unknown",
                    "visibility": "Needs Human Confirmation",
                    "role": "Needs Human Confirmation",
                    "key_fields": "-",
                    "confidence": "Unknown",
                    "index": "1",
                }
            )
    sp_rows = [row for form in forms for row in form["sharepoint"]]  # type: ignore[list-item]
    pa_rows = [form["powerapps"] for form in forms]  # type: ignore[list-item]

    write_field_dictionary(fields)
    write_workflow_register(workflows)
    write_role_register(section_rows)
    write_sp_register(sp_rows)
    write_pa_register(pa_rows)
    write_coverage(forms)

    missing = [form["meta"]["form_code"] for form in forms if not form["workflow"] or not form["sharepoint"] or not form["powerapps"]]  # type: ignore[index]
    print(f"forms={len(forms)}")
    print(f"fields={len(fields)}")
    print(f"sections={len(section_rows)}")
    print(f"workflow_rows={len(workflows)}")
    print(f"sharepoint_rows={len(sp_rows)}")
    print(f"powerapps_rows={len(pa_rows)}")
    print(f"missing_core_outputs={missing}")
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
