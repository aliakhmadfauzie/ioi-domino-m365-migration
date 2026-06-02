# Master App PDF Source - ENVIRONMENT INFO

> Master row: 305 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 305 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ENVIRONMENT INFO | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | NewEnvInfo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENVI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/002_oleObject151.pdf | Extracted embedded PDF | sheet_order_fallback | 0.380 | Explicit mapping | 1 | 386 | 8 | 2 | : Send |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section Control | Inferred from PDF text | Needs Human Confirmation |
| 3 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | Send | Text | 1 | Parsed from PDF text |
| 2 | Title | Subject | Text | 1 | Parsed from PDF text |
| 3 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 4 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 5 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 6 | Section Control | Lock | Text | 1 | Parsed from PDF text |
| 7 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 8 | ISADMIN | ISADMIN | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `ENVI`
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
| MASTER-305-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-305-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-305-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 8 |
| Workflow Signal Count | 2 |
| Notes | - |
