# Master App PDF Source - ACM Sales Enquiry

> Master row: 206 | Site: Penang | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 206 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ACM Sales Enquiry | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | Mktg \| PHBSVR | Source inventory |
| Form List | Enq - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ACMSALEENQU | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Mktg/002_oleObject11.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 1 | 419 | 12 | 2 | Sales Enquiry (sales@ioioleo.com) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Enq - Form | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date Created | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 2 | Region | Region | Text | 1 | Parsed from PDF text |
| 3 | SGrp | SGrp | Text | 1 | Parsed from PDF text |
| 4 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 5 | Country | Country | Text | 1 | Parsed from PDF text |
| 6 | Company Name | CustomerName | Person/Text | 1 | Parsed from PDF text |
| 7 | Person Name | PersonName | Person/Text | 1 | Parsed from PDF text |
| 8 | Email Address | EmailAddress | Text | 1 | Parsed from PDF text |
| 9 | Product | Product | Text | 1 | Parsed from PDF text |
| 10 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 11 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 12 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `ACMSALEENQU`
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
| MASTER-206-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-206-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-206-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 2 |
| Notes | - |
