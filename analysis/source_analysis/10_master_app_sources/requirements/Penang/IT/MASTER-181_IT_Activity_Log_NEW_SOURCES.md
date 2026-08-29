# Master App PDF Source - IT Activity Log - NEW

> Master row: 181 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 181 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IT Activity Log - NEW | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | IT Activity Log - NEW | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ITACTILOG | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL1.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 1 | 509 | 7 | 2 | SERVER REBOOT LOG |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL2.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 1 | 499 | 6 | 2 | DATA CENTER ACCESS LOG |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/007_oleObject128.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 1 | 499 | 6 | 2 | DATA CENTER ACCESS LOG |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/008_oleObject129.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 1 | 509 | 7 | 2 | SERVER REBOOT LOG |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Server Reboot Log | Inferred from PDF text | Needs Human Confirmation |
| 2 | Data Center Access Log | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Server Name | lstServerName | Person/Text | 1 | Parsed from PDF text |
| 2 | Total Down Time | TotalDownTime | Number/Text | 1 | Parsed from PDF text |
| 3 | Remarks/Attachment | RebootRemarks | Multiline Text | 1 | Parsed from PDF text |
| 4 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 5 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 6 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 7 | ISG Recipients | ISGRecipients | Text | 1 | Parsed from PDF text |
| 8 | Mailing List - Penang | MailP_Mgr | Text | 1 | Parsed from PDF text |
| 9 | Mailing List - Johor | MailJ_Mgr | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (8) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `ITACTILOG`
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
| MASTER-181-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-181-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-181-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 9 |
| Workflow Signal Count | 8 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
