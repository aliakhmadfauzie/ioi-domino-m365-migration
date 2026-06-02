# Master App PDF Source - QC Non-Routine Testing Report

> Master row: 287 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 287 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | QC Non-Routine Testing Report | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | QC Non-Routine Testing Report | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QCNONROUT | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QC/QCNTR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 356 | 13 | 2 | QC Non-Routine Testing Report |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/031_oleObject202.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 356 | 13 | 2 | QC Non-Routine Testing Report |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Info section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section Control | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | To | Text | 1 | Parsed from PDF text |
| 2 | Topic | Topic | Person/Text | 1 | Parsed from PDF text |
| 3 | Product Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Period | Period | Text | 1 | Parsed from PDF text |
| 5 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 6 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 9 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 10 | Section Control | Lock | Text | 1 | Parsed from PDF text |
| 11 | Manager | IT | Text | 1 | Parsed from PDF text |
| 12 | QCAdmin | QC | Text | 1 | Parsed from PDF text |
| 13 | WhoCanRead | AllowableReader | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (4) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `QCNONROUT`
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
| MASTER-287-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-287-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-287-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 4 |
| Notes | - |
