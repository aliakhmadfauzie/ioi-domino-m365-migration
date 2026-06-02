# Master App PDF Source - Energy Efficiency Info

> Master row: 198 | Site: Penang | Owner: E&I | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 198 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Energy Efficiency Info | Clearly Found |
| Owner | E&I | Clearly Found |
| Department | Maint \| PHBSVR | Source inventory |
| Form List | EEInfo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENEREFFI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/001_oleObject26.pdf | Extracted embedded PDF | sheet_order_fallback | 0.253 | Explicit mapping | 1 | 425 | 6 | 0 | Information |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Details :- | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | Info Type | InfoType | Choice/Text | 1 | Parsed from PDF text |
| 3 | Title | Subject | Text | 1 | Parsed from PDF text |
| 4 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 6 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Unknown | Needs Human Confirmation |
| Workflow Evidence | Unknown | Needs Human Confirmation |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_E&I`
FormCode: `ENEREFFI`
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
| MASTER-198-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-198-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-198-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 6 |
| Workflow Signal Count | 0 |
| Notes | - |
