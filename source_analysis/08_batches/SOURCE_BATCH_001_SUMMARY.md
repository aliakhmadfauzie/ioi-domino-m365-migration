# Source Analysis Batch 001 Summary

> **Batch**: 001
> **Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent

## 1. PDFs Analyzed

| Source ID | File | Department | Form Name | Status |
|---|---|---|---|---|
| SRC-001 | EAF.pdf | IT | External Access Form (VPN & Citrix) | Analyzed |
| SRC-002 | HI.pdf | IT | Hardware Inventory | Analyzed |
| SRC-003 | IAL1.pdf | IT | IT Activity Log 1 — Data Restoration | Analyzed |

## 2. Forms Extracted

| Count | Detail |
|---|---|
| 3 | All single-form PDFs (no multi-form PDFs in this batch) |

## 3. Fields Extracted

| Form | Fields | Clearly Found | Inferred | Text | Date | Person | Choice | Multiline |
|---|---|---|---|---|---|---|---|---|
| EAF | 21 | 20 | 1 | 3 | 2 | 6 | 2 | 5 |
| HI | 26 | 23 | 3 | 12 | 2 | 1 | 4 | 1 |
| IAL1 | 16 | 13 | 3 | 5 | 2 | 2 | 2 | 2 |
| **Total** | **63** | **56** | **7** | **20** | **6** | **9** | **8** | **8** |

## 4. Choices Extracted

| Result | Count |
|---|---|
| Choice fields with known choices | 0 |
| Choice fields with Unknown choices | 8 |
| **Total choice fields** | **8** |

**Note**: All 8 choice fields across 3 forms had dropdown/radio options that were not visible in the PDF analysis evidence. All marked as `Choices = Unknown` and flagged for human confirmation.

## 5. Repeating Tables Found

| Form | Table | Classification |
|---|---|---|
| HI | Software list (Name, Version, License) | Child List Candidate |
| **Total** | **1** | |

## 6. Approval/Workflow Items Found

| Form | Approval | Evidence Class | Stages | Routing | Status Values |
|---|---|---|---|---|---|
| EAF | Required | Clearly Found | 5 | Conditional (isPCN) | 7 |
| HI | Not Required | Clearly Found | 0 | None | 1 |
| IAL1 | Inferred | Inferred | 2 | Unknown | 3 |
| **Total workflows** | **2 active, 1 none** | | | | |

## 7. Unknown Workflow Items

| Form | Unknown Item |
|---|---|
| IAL1 | Reviewer assignment mechanism — automatic routing or manual selection? |
| IAL1 | Is review mandatory or optional? |
| HI | No workflow unknowns (clearly no approval) |

## 8. SharePoint Lists Recommended

| Form | Parent List | Child List(s) | Parent Columns | Child Columns |
|---|---|---|---|---|
| EAF | MainDB_IT | MainDB_IT_Ext_Access | 20 | 4 |
| HI | MainDB_IT | MainDB_IT_Ext_Assets | 22 | 4 |
| IAL1 | MainDB_IT | — | 16 | — |
| **Total** | **3 parent** | **2 child** | **58** | **8** |

## 9. Human Confirmation Questions

| # | Form | Question | Severity |
|---|---|---|---|
| 1 | EAF | What are the exact dropdown choices for Application? | Medium |
| 2 | EAF | What are the exact User Group choices? | Medium |
| 3 | EAF | What is the exact isPCN condition logic? | High |
| 4 | EAF | Are Client ID and User Group always required or conditional? | Medium |
| 5 | EAF | Should provisioning details be in a child list? | Medium |
| 6 | HI | What are the exact Asset Type choices? | Medium |
| 7 | HI | What are the exact Asset Status values? | Medium |
| 8 | HI | Should software be a child list or single multiline field? | Medium |
| 9 | IAL1 | Is approval review mandatory or optional? | High |
| 10 | IAL1 | What are the exact Activity Type and Outcome choices? | Medium |
| 11 | IAL1 | How is the reviewer assigned? | High |
| 12 | IAL1 | Should IAL1-5 share the same SharePoint list? | Medium |
| **Total** | | | **12 questions (3 High, 9 Medium)** |

## 10. Count Reconciliation

| Item | Count |
|---|---|
| PDFs selected for batch | 3 |
| PDFs analyzed | 3 |
| Forms extracted | 3 |
| Requirement files created | 3 |
| Registers updated | 7 |
| Field dictionary entries | 63 |
| Workflow entries | 3 |
| Role/section rules | 6 |
| SharePoint designs | 5 (3 parent + 2 child) |
| Power Apps specs | 3 |
| Human confirmation items | 12 |

## 11. Registers Updated

| Register | Path | Status |
|---|---|---|
| FORM_REQUIREMENT_REGISTER.md | `source_analysis/02_extracted_requirements/` | Updated |
| GLOBAL_FIELD_DICTIONARY.md | `source_analysis/03_field_dictionary/` | Updated |
| WORKFLOW_REGISTER.md | `source_analysis/04_workflow_register/` | Updated |
| ROLE_SECTION_RULE_REGISTER.md | `source_analysis/05_role_section_rules/` | Updated |
| SHAREPOINT_LIST_DESIGN_REGISTER.md | `source_analysis/06_sharepoint_design/` | Updated |
| POWERAPPS_BUILD_SPEC_REGISTER.md | `source_analysis/07_powerapps_spec/` | Updated |
| PDF_FORM_INVENTORY.md | `source_analysis/01_pdf_inventory/` | Updated |

---

*Batch 001 completed. Ready for quality review.*
