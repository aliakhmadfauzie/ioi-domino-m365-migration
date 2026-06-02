# Master App PDF Source - PanCen - Hardware Inventory

> Master row: 21 | Site: Johor | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 21 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Hardware Inventory | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PCNSVR | Source inventory |
| Form List | PanCen - Hardware Inventory | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | HARDINVE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/IT/1_HWInv_Network.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 278 | 8 | 0 | Network Hardware Inventory Form |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/002_oleObject47.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 278 | 8 | 0 | Network Hardware Inventory Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PanCen - Hardware Inventory | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | MAC Address | MACAddress | Text | 1 | Parsed from PDF text |
| 2 | Model | Model | Text | 1 | Parsed from PDF text |
| 3 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 4 | IP Address | IPAddress | Text | 1 | Parsed from PDF text |
| 5 | Serial Number | SerialNo | Text | 1 | Parsed from PDF text |
| 6 | Purchase Date | PURDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Created by | Authors; MachineCreationDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Last Modified by | MachineAuthor; DateModified | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Unknown | Needs Human Confirmation |
| Workflow Evidence | Unknown | Needs Human Confirmation |
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
| MASTER-021-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-021-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-021-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 8 |
| Workflow Signal Count | 0 |
| Notes | - |
