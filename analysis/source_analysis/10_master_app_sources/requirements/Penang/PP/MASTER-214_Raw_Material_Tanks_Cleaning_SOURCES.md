# Master App PDF Source - Raw Material Tanks Cleaning

> Master row: 214 | Site: Penang | Owner: PP | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 214 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Raw Material Tanks Cleaning | Clearly Found |
| Owner | PP | Clearly Found |
| Department | Prod \| IMS Related \| PHBSVR | Source inventory |
| Form List | Raw Material Tanks Cleaning | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RAWMATETANK | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/PRD/RMTC.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 411 | 9 | 1 | RAW MATERIAL TANKS CLEANING |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/007_oleObject121.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 411 | 9 | 1 | RAW MATERIAL TANKS CLEANING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Raw Material Tanks Cleaning | Inferred from PDF text | Needs Human Confirmation |
| 2 | DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | Editor - Section A, B & C | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Storage Tank | Tank | Text | 1 | Parsed from PDF text |
| 2 | Site | Site | Text | 1 | Parsed from PDF text |
| 3 | Last Cleaning Date | CleaningRecord | Date/Text | 1 | Parsed from PDF text |
| 4 | Next Cleaning Date | CleaningDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 6 | Editor - Section A, B & C | Editor1 | Text | 1 | Parsed from PDF text |
| 7 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 8 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 9 | Rem Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PP`
FormCode: `RAWMATETANK`
Child-list recommendation: No child list inferred from parsed field names; confirm during design

Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.

## 7. Power Apps Build Specification

| Screen/Component | Requirement | Confidence |
| --- | --- | --- |
| List | Filter by site/owner/FormCode and status | Inferred |
| New/Edit | Render parsed PDF fields grouped by inferred sections | Inferred |
| Detail | Read-only view with audit/workflow metadata | Inferred |
| Approval Actions | Show only if workflow state confirms approval is required | Needs Human Confirmation |
| Child Rows | Use editable gallery only if child-list recommendation is confirmed | Needs Human Confirmation |

## 8. Human Confirmation Questions

| # | Question | Severity |
| --- | --- | --- |
| MASTER-214-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-214-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-214-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 9 |
| Workflow Signal Count | 2 |
| Notes | - |
