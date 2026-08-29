# Source Analysis Batch 002 Summary

> **Batch**: 002
> **Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Quality Warning**: ⚠️ Direct PDF viewing was not available for this batch. All field labels, types, and workflow claims are derived from intermediate analysis sources (`pdf-ui-inventory.md`) and the shared `DataRestorationV1` Domino template pattern (same as IAL1 from Batch 001). All fields are marked Inferred unless the form-specific purpose label was confirmed by `pdf-ui-inventory.md`.

## 1. PDFs Analyzed

| Source ID | File | Department | Form Name | Status | PDF Size |
|---|---|---|---|---|---|
| SRC-004 | IAL2.pdf | IT | IT Activity Log 2 — Server Reboot | Analyzed | 150 KB |
| SRC-005 | IAL3.pdf | IT | IT Activity Log 3 — ISG Events | Analyzed | 76 KB |
| SRC-006 | IAL4.pdf | IT | IT Activity Log 4 — Data Center | Analyzed | 153 KB |

## 2. Forms Extracted

| Count | Detail |
|---|---|
| 3 | All single-form PDFs — all variants of `DataRestorationV1` template |

## 3. Fields Extracted

| Form | Fields | Clearly Found | Inferred | Text | Date | Person | Choice | Multiline |
|---|---|---|---|---|---|---|---|---|
| IAL2 | 16 | 0 | 16 | 6 | 2 | 2 | 3 | 2 |
| IAL3 | 16 | 0 | 16 | 3 | 2 | 2 | 3 | 4 |
| IAL4 | 16 | 0 | 16 | 5 | 2 | 2 | 3 | 2 |
| **Total** | **48** | **0** | **48** | **14** | **6** | **6** | **9** | **8** |

> **Note**: All 48 fields marked Inferred. No field labels were independently confirmed against the PDF. Labels are based on the shared `DataRestorationV1` template pattern with variant-specific naming (Server Reboot, ISG Events, Data Center).

## 4. Choices Extracted

| Result | Count |
|---|---|
| Choice fields with known choices | 0 |
| Choice fields with Unknown choices | 9 |
| **Total choice fields** | **9** |

## 5. Repeating Tables Found

| Form | Table | Classification |
|---|---|---|
| None | — | — |
| **Total** | **0** | |

## 6. Approval/Workflow Items Found

| Form | Approval | Evidence Class | Stages | Routing | Status Values |
|---|---|---|---|---|---|
| IAL2 | Inferred | Inferred | 2 (Entry → Review) | Unknown | 3 |
| IAL3 | Inferred | Inferred | 2 (Entry → Review) | Unknown | 3 |
| IAL4 | Inferred | Inferred | 2 (Entry → Review) | Unknown | 3 |
| **Total workflows** | **3 Inferred** | | | | |

**Evidence Basis**: `pdf-ui-inventory.md` marks all IAL variants with workflow ✅. No routing details available. Classification follows Batch 001 IAL1 pattern.

## 7. Unknown Workflow Items

| Form | Unknown Item |
|---|---|
| IAL2 | Reviewer assignment mechanism |
| IAL2 | Whether review is mandatory or optional |
| IAL3 | Reviewer assignment mechanism (ISG Manager?) |
| IAL3 | Whether review is mandatory or optional |
| IAL4 | Reviewer assignment mechanism (DC Manager?) |
| IAL4 | Whether review is mandatory or optional |
| All | Whether IAL1-5 should share one SharePoint list |

## 8. SharePoint Lists Recommended

| Form | Parent List | Child List(s) | Parent Columns |
|---|---|---|---|
| IAL2 | MainDB_IT | — | 17 |
| IAL3 | MainDB_IT | — | 17 |
| IAL4 | MainDB_IT | — | 17 |
| **Total** | **3 parent (all MainDB_IT)** | **0 child** | **51** |

## 9. Human Confirmation Questions

| # | Form | Question | Severity |
|---|---|---|---|
| 1 | IAL2 | Is approval review mandatory or optional? | High |
| 2 | IAL2 | What are the exact Activity Type choices for Server Reboot? | Medium |
| 3 | IAL2 | What are the exact Reboot Type choices? | Medium |
| 4 | IAL2 | What are the exact Outcome choices? | Medium |
| 5 | IAL2 | How is the reviewer assigned? | High |
| 6 | IAL2 | Should IAL1-5 share the same SharePoint list? | Medium |
| 7 | IAL3 | Is approval review mandatory or optional for ISG Events? | High |
| 8 | IAL3 | What are the exact Event Type choices? | Medium |
| 9 | IAL3 | What are the exact Severity choices? | Medium |
| 10 | IAL3 | What are the exact Outcome choices? | Medium |
| 11 | IAL3 | How is the reviewer assigned for ISG events? | High |
| 12 | IAL3 | Should IAL1-5 share the same SharePoint list? | Medium |
| 13 | IAL4 | Is approval review mandatory or optional for Data Center? | High |
| 14 | IAL4 | What are the exact Activity Type choices for Data Center? | Medium |
| 15 | IAL4 | What are the exact Access Type choices? | Medium |
| 16 | IAL4 | What are the exact Outcome choices? | Medium |
| 17 | IAL4 | How is the reviewer assigned for DC activities? | High |
| 18 | IAL4 | Should IAL1-5 share the same SharePoint list? | Medium |
| **Total** | | | **18 questions (6 High, 12 Medium)** |

## 10. Count Reconciliation

| Item | Count |
|---|---|
| PDFs selected for batch | 3 |
| PDFs analyzed | 3 |
| Forms extracted | 3 |
| Requirement files created | 3 |
| Fields extracted | 48 |
| Choice fields (all Unknown) | 9 |
| Workflow entries (all Inferred) | 3 |
| SharePoint designs (all single-list) | 3 |
| Human confirmation questions | 18 |

## 11. Registers Updated

| Register | Path | Status |
|---|---|---|
| FORM_REQUIREMENT_REGISTER.md | `analysis/source_analysis/02_extracted_requirements/` | Updated |
| GLOBAL_FIELD_DICTIONARY.md | `analysis/source_analysis/03_field_dictionary/` | Pending (48 entries) |
| WORKFLOW_REGISTER.md | `analysis/source_analysis/04_workflow_register/` | Updated |
| ROLE_SECTION_RULE_REGISTER.md | `analysis/source_analysis/05_role_section_rules/` | Pending (3 entries) |
| SHAREPOINT_LIST_DESIGN_REGISTER.md | `analysis/source_analysis/06_sharepoint_design/` | Pending (3 entries) |
| POWERAPPS_BUILD_SPEC_REGISTER.md | `analysis/source_analysis/07_powerapps_spec/` | Pending (3 entries) |
| PDF_FORM_INVENTORY.md | `analysis/source_analysis/01_pdf_inventory/` | Updated |

## 12. Evidence Quality Assessment

| Area | Rating | Detail |
|---|---|---|
| Form identification | ✅ Good | Form names confirmed by `pdf-ui-inventory.md` |
| Field labels | ⚠️ Inferred | Based on template pattern, not direct PDF verification |
| Field types | ⚠️ Inferred | Based on template pattern and domain inference |
| Choices | ❌ Unknown | None resolved — no dropdown data in intermediate sources |
| Workflow classification | ⚠️ Inferred | Template pattern + `pdf-ui-inventory.md` workflow ✅ flag |
| Routing details | ❌ Unknown | No routing instructions in any available source |

---

*Batch 002 completed. All IAL variants (1-4) now analyzed. One IAL variant remains: SRC-007 (IAL5 — Server Records).*
