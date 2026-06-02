# Master App PDF Source - PanCen - Kosher & Halal Certificate List

> Master row: 39 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 39 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Kosher & Halal Certificate List | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | KOSHHALACERT | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/001_oleObject67.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 745 | 30 | 4 | CERTIFICATE DETAILS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | CERTIFICATE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 2 | Obsolete :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Picbk | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Certificate | Certificate | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 4 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 5 | Product Name | ChemicalName | Person/Text | 1 | Parsed from PDF text |
| 6 | Material Code | MaterialCode | Text | 1 | Parsed from PDF text |
| 7 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 8 | Company Brand Name | CompanyBrandName | Person/Text | 1 | Parsed from PDF text |
| 9 | Country | Country | Text | 1 | Parsed from PDF text |
| 10 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 11 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 13 | Certifying Agency | CertifyingAgency | Text | 1 | Parsed from PDF text |
| 14 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 15 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 16 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Last Edited by | LastEditedBy | Text | 1 | Parsed from PDF text |
| 18 | Last Edited On | LastEditedOn | Text | 1 | Parsed from PDF text |
| 19 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Name | WDBy | Person/Text | 1 | Parsed from PDF text |
| 21 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 22 | Remarks | WDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 23 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 24 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 25 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 26 | PIC 2 - Backup | PICBK | Person/Text | 1 | Parsed from PDF text |
| 27 | RemTo | RemTo | Text | 1 | Parsed from PDF text |
| 28 | RemCC | RemCC | Text | 1 | Parsed from PDF text |
| 29 | IT | ISG | Text | 1 | Parsed from PDF text |
| 30 | Status | RenStatus | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `KOSHHALACERT`
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
| MASTER-039-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-039-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-039-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 30 |
| Workflow Signal Count | 4 |
| Notes | - |
