# AUD-065 - HR-BSD Audit

## 1. Basic Information

| Item | Detail |
|---|---|
| Audit ID | AUD-065 |
| Form Code | HR-BSD |
| Form Name | HR Backup Staff Declaration |
| Department | HR |
| Approval Classification | Unknown |
| Audit Status | Blocked - Ambiguous Requirement |
| Risk | High |
| Last Reviewed | 2026-06-01 |

## 2. Source Evidence

- Source: Repository source discovery and register evidence
- File path: `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf`
- Code/formula/section: Source relationship recorded for HR-BSD
- What was found: Source, app, and schema evidence exist, but item-level field mapping, validation, and approval classification remain unresolved.
- Why it matters: The audit cannot confirm final field, workflow, or build readiness without this source relationship being resolved.

## 3. App Files Reviewed

| File path | Purpose Reviewed | Evidence Result |
|---|---|---|
| `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx` | App route or implementation evidence | Reviewed as available from repository file discovery; unresolved where listed as Unknown. |

## 4. UI/Form Fields

| Field/Section | Source Evidence | App Evidence | Status |
|---|---|---|---|
| Form fields | `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf` | `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx` | Unknown until source-to-app mapping is confirmed. |

## 5. SharePoint Field Mapping

| App/source field | SharePoint list | Column display/internal name | Evidence | Mapping status |
|---|---|---|---|---|
| Form fields | MainDB_HR_Ext_BSD / `maindb_hr_ext_bsd.Schema.json` | Unknown | Register/schema evidence only; no per-field mapping confirmed in this item audit. | Mapping Incomplete |

Notes:

- No SharePoint columns were invented.
- If a schema is named, it is evidence that a list schema exists, not proof that every app field is correctly mapped.

## 6. Read Logic

- Source: App route/source discovery
- File path: `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx`
- Code/formula/section: Route/read evidence for HR-BSD
- What was found: Read logic is not fully verified for this audit item because source or ownership is unresolved.
- Why it matters: A form cannot be Ready for Build when list/detail read behavior is not tied to a confirmed source and SharePoint mapping.

## 7. Write Logic

- Source: App route/source discovery
- File path: `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx`
- Code/formula/section: Submit/write evidence for HR-BSD
- What was found: Write logic is not fully verified for this audit item because source, app ownership, or SharePoint mapping is unresolved.
- Why it matters: Submitted data could be saved under the wrong form code, omitted from structured columns, or blocked entirely if the route is only a placeholder.

## 8. Validation Rules

| Rule | Evidence | Status |
|---|---|---|
| Required fields | `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf` | Unknown |
| Choice/person/date validation | `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf` | Unknown |

## 9. Section Visibility Rules

| Section | Visibility/editability rule | Evidence | Status |
|---|---|---|---|
| Form sections | Unknown | `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf` | Unknown |

## 10. Approval Workflow

| Approval Classification | Trigger/condition | Evidence | Status |
|---|---|---|---|
| Unknown | Unknown unless explicitly listed in source evidence | `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf` | Blocked - Ambiguous Requirement |

## 11. Draft/Save/Submit/Edit/View Behavior

| Behavior | Evidence | Status |
|---|---|---|
| Draft | Not confirmed for this item | Unknown |
| Save | Not confirmed for this item | Unknown |
| Submit | Not confirmed for this item | Unknown |
| Edit | Not confirmed for this item | Unknown |
| View | Not confirmed for this item | Unknown |

## 12. Issues Found

### AUD-B007-HRBSD-001 - HR-BSD workflow and field mapping incomplete

- Source: Audit evidence review
- File path: `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf`; `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx`
- Code/formula/section: Source/app/SharePoint mapping for HR-BSD
- What was found: Source, app, and schema evidence exist, but item-level field mapping, validation, and approval classification remain unresolved.
- Why it matters: HR-BSD workflow and field mapping incomplete blocks a reliable build decision and requires human decision or missing evidence before fix/build work.


## 12a. Fix Backlog Reference

| Fix ID | Issue ID | Priority | Severity | Status |
|---|---|---|---|---|
| FIX-099 | AUD-B007-HRBSD-001 | P4 - Documentation or minor cleanup | High | Open |

## 13. Risk Assessment

Risk: High

Risk justification:

- Evidence: `source/dxl/XML_HR_Penang/BSD_all_dxl.xml`; `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/BSD.pdf`; `src/pages/hr/bsd/index.tsx`; `src/pages/hr/bsd/new.tsx`; `src/pages/hr/bsd/detail.tsx`; MainDB_HR_Ext_BSD / `maindb_hr_ext_bsd.Schema.json`
- Impact: Audit cannot confirm source parity, SharePoint mapping, or workflow behavior for HR-BSD.
- Recommended disposition: Resolve HR-BSD workflow and field mapping incomplete, then re-audit this item.

## 14. Final Decision

Status: Blocked - Ambiguous Requirement

Ready for Build: No

Final notes: Finding created to close the Not Started audit state without assuming workflow or field mapping.

## 15. Quality Checklist

| Check | Result | Notes |
|---|---|---|
| Finding has source evidence | Yes | Source/register evidence cited above. |
| Finding has app evidence | Yes | App route or missing app evidence cited above. |
| Finding has SharePoint/list evidence | Yes | List/schema status cited as known or Unknown. |
| Approval classification is strict | Yes | Uses Unknown. |
| No SharePoint fields invented | Yes | Unknown fields remain Unknown. |
| Unresolved issues added to backlog | Yes | FIX-099. |
| Register row updated | Yes | Updated in master and form inventory. |

