# Master App PDF Source - PanCen - Masterlist Of Declaration

> Master row: 42 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 42 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Masterlist Of Declaration | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | DECL - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFDECL | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/002_oleObject68.pdf | Extracted embedded PDF | sheet_order_fallback | 0.300 | Explicit mapping | 2 | 582 | 15 | 1 | PANCEN MASTERLIST OF DECLARATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pancen Masterlist Of Declaration | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No | INO | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 4 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 5 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 6 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 7 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 8 | Statement | RegComp | Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | Expiry Date | ExpDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Send Notification To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 12 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 13 | IT | IT | Text | 1 | Parsed from PDF text |
| 14 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 15 | Editor 2-Obsolete | Editor2 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `MASTOFDECL`
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
| MASTER-042-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-042-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-042-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 1 |
| Notes | - |
