# Master App PDF Source - SHE Fire Alarm Reporting

> Master row: 313 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 313 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Fire Alarm Reporting | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Fire Alarm Reporting | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEFIREALAR | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SHEFAR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 2 | 552 | 17 | 1 | SHE FIRE ALARM REPORTING |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/012_oleObject161.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 2 | 552 | 17 | 1 | SHE FIRE ALARM REPORTING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | She Fire Alarm Reporting | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Request No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B - SHE | Inferred from PDF text | Needs Human Confirmation |
| 5 | She (Cc) | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Shecc | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Shehod | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request No. | ReqNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Site | Site | Text | 1 | Parsed from PDF text |
| 3 | Location of Bell Alarm | Location | Text | 1 | Parsed from PDF text |
| 4 | Time of Problem Occur | Time | Text | 1 | Parsed from PDF text |
| 5 | Action Taken | Action | Text | 1 | Parsed from PDF text |
| 6 | Action Taken | ActionTaken | Text | 1 | Parsed from PDF text |
| 7 | Action by | ActionBy | Text | 1 | Parsed from PDF text |
| 8 | Rectified Date | RectifiedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 10 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 11 | IT | IT | Text | 1 | Parsed from PDF text |
| 12 | SHE (To) | SHETo | Text | 1 | Parsed from PDF text |
| 13 | SHE (CC) | SHECC | Text | 1 | Parsed from PDF text |
| 14 | SHE | SHEHOD | Person/Text | 1 | Parsed from PDF text |
| 15 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 17 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEFIREALAR`
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
| MASTER-313-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-313-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-313-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 17 |
| Workflow Signal Count | 2 |
| Notes | - |
