# Master App PDF Source - Hardware Inventory

> Master row: 180 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 180 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Hardware Inventory | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | Hardware Inventory | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | HARDINVE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/HI.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 2 | 1079 | 11 | 3 | HARDWARE |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/002_oleObject123.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 2 | 1079 | 11 | 3 | HARDWARE |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Hardware | Inferred from PDF text | Needs Human Confirmation |
| 2 | General Info | Inferred from PDF text | Needs Human Confirmation |
| 3 | Notes/Return To It Status | Inferred from PDF text | Needs Human Confirmation |
| 4 | Hardware Configuration | Inferred from PDF text | Needs Human Confirmation |
| 5 | Software Configurations | Inferred from PDF text | Needs Human Confirmation |
| 6 | For Accounts Reference :- | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Access Type | DeskType | Choice/Text | 1 | Parsed from PDF text |
| 2 | Remark | Notes | Multiline Text | 1 | Parsed from PDF text |
| 3 | Activation | MSEmail | Text | 1 | Parsed from PDF text |
| 4 | Email Activation Password | MSEmailPswd | Text | 1 | Parsed from PDF text |
| 5 | PO No. | PoNumber | Number/Text | 1 | Parsed from PDF text |
| 6 | Asset No. | AssetNo | Number/Text | 1 | Parsed from PDF text |
| 7 | Vendor | Vendor; Select; Vendor | Text | 1 | Parsed from PDF text |
| 8 | Created by | Authors | Text | 1 | Parsed from PDF text |
| 9 | Last Modified by | MachineAuthor | Text | 1 | Parsed from PDF text |
| 10 | IT | IT | Text | 1 | Parsed from PDF text |
| 11 | Running No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `HARDINVE`
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
| MASTER-180-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-180-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-180-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 11 |
| Workflow Signal Count | 6 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
