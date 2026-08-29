# Master App PDF Source - SHE Good Observations

> Master row: 315 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 315 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Good Observations | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Good Observations | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEGOODOBSE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SHEGO.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 505 | 19 | 2 | SHE GOOD OBSERVATIONS |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/014_oleObject163.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 505 | 19 | 2 | SHE GOOD OBSERVATIONS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | She Good Observations | Inferred from PDF text | Needs Human Confirmation |
| 2 | GO Request | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | GO No. | GONo | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Initiator | Requestor | Person/Text | 1 | Parsed from PDF text |
| 4 | Recipient | Recipient; NoIdRecipient | Text | 1 | Parsed from PDF text |
| 5 | Date of Observation | DateAudit | Date/Text | 1 | Parsed from PDF text |
| 6 | Location (Recipient) | Location | Text | 1 | Parsed from PDF text |
| 7 | SHE Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 8 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 11 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 12 | Initiator | Authors | Text | 1 | Parsed from PDF text |
| 13 | Created On | CDate | Date/Text | 1 | Parsed from PDF text |
| 14 | ISG Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 15 | QA Admin | SHEAdmin | Text | 1 | Parsed from PDF text |
| 16 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 17 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 18 | INO | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 19 | SHE Committee | SHEComm | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (4) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEGOODOBSE`
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
| MASTER-315-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-315-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-315-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 19 |
| Workflow Signal Count | 4 |
| Notes | - |
