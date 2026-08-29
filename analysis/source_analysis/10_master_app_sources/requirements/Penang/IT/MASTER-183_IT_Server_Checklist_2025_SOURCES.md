# Master App PDF Source - IT Server Checklist 2025

> Master row: 183 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 183 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IT Server Checklist 2025 | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | NewForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ITSERVCHEC | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/014_oleObject135.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1223 | 15 | 0 | IT SERVER CHECKLIST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | It Server Checklist | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Ou - Co | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Non windows servers | NW | Text | 1 | Parsed from PDF text |
| 2 | FullSpace | Drive | Text | 1 | Parsed from PDF text |
| 3 | Drive | Size | Text | 1 | Parsed from PDF text |
| 4 | Type | Drive1 | Choice/Text | 1 | Parsed from PDF text |
| 5 | Drive1 | Size1 | Text | 1 | Parsed from PDF text |
| 6 | Type1 | Drive2 | Choice/Text | 1 | Parsed from PDF text |
| 7 | Drive2 | Size2 | Text | 1 | Parsed from PDF text |
| 8 | Type2 | Drive3 | Choice/Text | 1 | Parsed from PDF text |
| 9 | Drive3 | Size3 | Text | 1 | Parsed from PDF text |
| 10 | Year | CurrYear | Text | 1 | Parsed from PDF text |
| 11 | Week end date | WeekEndDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Week Start date | YearStartDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Week Num | Week | Text | 1 | Parsed from PDF text |
| 14 | Weekday | WkDay | Text | 1 | Parsed from PDF text |
| 15 | Requestor OU | OU; CO | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Unknown | Needs Human Confirmation |
| Workflow Evidence | Unknown | Needs Human Confirmation |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `ITSERVCHEC`
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
| MASTER-183-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-183-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-183-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 0 |
| Notes | - |
