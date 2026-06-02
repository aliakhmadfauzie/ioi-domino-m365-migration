# AUD-062 - QC-LWR Audit

## 1. Basic Information

| Item | Detail |
|---|---|
| Audit ID | AUD-062 |
| Form Code | QC-LWR |
| Form Name | QC LWR |
| Department | QC |
| Approval Classification | Unknown |
| Audit Status | Blocked - Missing SharePoint Schema |
| Risk | High |
| Last Reviewed | 2026-06-01 |

## 2. Source Evidence

- Source: Repository source discovery and register evidence
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf`
- Code/formula/section: Source relationship recorded for QC-LWR
- What was found: LWR source and app route exist, but local QC schema evidence is missing for field-level mapping.
- Why it matters: The audit cannot confirm final field, workflow, or build readiness without this source relationship being resolved.

## 3. App Files Reviewed

| File path | Purpose Reviewed | Evidence Result |
|---|---|---|
| `src/pages/qc/forms/lwr/new.tsx` | App route or implementation evidence | Reviewed as available from repository file discovery; unresolved where listed as Unknown. |

## 4. UI/Form Fields

| Field/Section | Source Evidence | App Evidence | Status |
|---|---|---|---|
| Form fields | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf` | `src/pages/qc/forms/lwr/new.tsx` | Unknown until source-to-app mapping is confirmed. |

## 5. SharePoint Field Mapping

| App/source field | SharePoint list | Column display/internal name | Evidence | Mapping status |
|---|---|---|---|---|
| Form fields | MainDB_QC schema missing in current local schema inventory | Unknown | Register/schema evidence only; no per-field mapping confirmed in this item audit. | Mapping Incomplete |

Notes:

- No SharePoint columns were invented.
- If a schema is named, it is evidence that a list schema exists, not proof that every app field is correctly mapped.

## 6. Read Logic

- Source: App route/source discovery
- File path: `src/pages/qc/forms/lwr/new.tsx`
- Code/formula/section: Route/read evidence for QC-LWR
- What was found: Read logic is not fully verified for this audit item because source or ownership is unresolved.
- Why it matters: A form cannot be Ready for Build when list/detail read behavior is not tied to a confirmed source and SharePoint mapping.

## 7. Write Logic

- Source: App route/source discovery
- File path: `src/pages/qc/forms/lwr/new.tsx`
- Code/formula/section: Submit/write evidence for QC-LWR
- What was found: Write logic is not fully verified for this audit item because source, app ownership, or SharePoint mapping is unresolved.
- Why it matters: Submitted data could be saved under the wrong form code, omitted from structured columns, or blocked entirely if the route is only a placeholder.

## 8. Validation Rules

| Rule | Evidence | Status |
|---|---|---|
| Required fields | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf` | Unknown |
| Choice/person/date validation | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf` | Unknown |

## 9. Section Visibility Rules

| Section | Visibility/editability rule | Evidence | Status |
|---|---|---|---|
| Form sections | Unknown | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf` | Unknown |

## 10. Approval Workflow

| Approval Classification | Trigger/condition | Evidence | Status |
|---|---|---|---|
| Unknown | Unknown unless explicitly listed in source evidence | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf` | Blocked - Missing SharePoint Schema |

## 11. Draft/Save/Submit/Edit/View Behavior

| Behavior | Evidence | Status |
|---|---|---|
| Draft | Not confirmed for this item | Unknown |
| Save | Not confirmed for this item | Unknown |
| Submit | Not confirmed for this item | Unknown |
| Edit | Not confirmed for this item | Unknown |
| View | Not confirmed for this item | Unknown |

## 12. Issues Found

### AUD-B007-QCLWR-001 - QC-LWR SharePoint schema missing

- Source: Audit evidence review
- File path: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf`; `src/pages/qc/forms/lwr/new.tsx`
- Code/formula/section: Source/app/SharePoint mapping for QC-LWR
- What was found: LWR source and app route exist, but local QC schema evidence is missing for field-level mapping.
- Why it matters: QC-LWR SharePoint schema missing blocks a reliable build decision and requires human decision or missing evidence before fix/build work.


## 12a. Fix Backlog Reference

| Fix ID | Issue ID | Priority | Severity | Status |
|---|---|---|---|---|
| FIX-096 | AUD-B007-QCLWR-001 | P0 - Blocks data save or causes data loss | High | Open |

## 13. Risk Assessment

Risk: High

Risk justification:

- Evidence: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/LWR.pdf`; `src/pages/qc/forms/lwr/new.tsx`; MainDB_QC schema missing in current local schema inventory
- Impact: Audit cannot confirm source parity, SharePoint mapping, or workflow behavior for QC-LWR.
- Recommended disposition: Resolve QC-LWR SharePoint schema missing, then re-audit this item.

## 14. Final Decision

Status: Blocked - Missing SharePoint Schema

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
| Unresolved issues added to backlog | Yes | FIX-096. |
| Register row updated | Yes | Updated in master and form inventory. |

