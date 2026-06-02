# Master App PDF Source - PanCen - MSPO, RSPO, MPOB, HALAL & KOSHER List

> Master row: 40 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 40 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - MSPO, RSPO, MPOB, HALAL & KOSHER List | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MSPORSPOMPOB | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/005_oleObject71.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 711 | 27 | 4 | CERTIFICATE DETAILS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | CERTIFICATE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 2 | Obsolete :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Certificate | Certificate | Text | 1 | Parsed from PDF text |
| 2 | Seller | Plantation | Text | 1 | Parsed from PDF text |
| 3 | Miller/Supplier | Miller | Text | 1 | Parsed from PDF text |
| 4 | Product Name | ProductName | Person/Text | 1 | Parsed from PDF text |
| 5 | Material Code | MaterialCode | Text | 1 | Parsed from PDF text |
| 6 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 7 | Origin | Origin | Text | 1 | Parsed from PDF text |
| 8 | License Number | CertLicenseNumber | Text | 1 | Parsed from PDF text |
| 9 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 10 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 12 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 13 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 14 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Last Edited by | LastEditedBy | Text | 1 | Parsed from PDF text |
| 16 | Last Edited On | LastEditedOn | Text | 1 | Parsed from PDF text |
| 17 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Name | WDBy | Person/Text | 1 | Parsed from PDF text |
| 19 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 20 | Remarks | WDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 21 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 22 | MKT | MKT | Text | 1 | Parsed from PDF text |
| 23 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 24 | RemTo | RemTo | Text | 1 | Parsed from PDF text |
| 25 | RemCC | RemCC | Text | 1 | Parsed from PDF text |
| 26 | IT | ISG | Text | 1 | Parsed from PDF text |
| 27 | Status | RenStatus | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `MSPORSPOMPOB`
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
| MASTER-040-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-040-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-040-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 4 |
| Notes | - |
