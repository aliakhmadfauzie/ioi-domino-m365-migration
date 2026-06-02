# Master App PDF Source - Warehouse Briefing Form 2025

> Master row: 361 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 361 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Warehouse Briefing Form 2025 | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse \| PHBSVR | Source inventory |
| Form List | Layout - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | WAREBRIE2025 | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/004_oleObject66.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 2 | 722 | 10 | 9 | Layout |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pesthod | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A before submitting to | Inferred from PDF text | Needs Human Confirmation |
| 3 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue Date | IssueDate | Date/Text | 1 | Parsed from PDF text |
| 2 | Revision No. | RevNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 4 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 5 | Prepared Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Verified By | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 7 | Verified Date | VerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Evidence of last revise | Evidence | Text | 1 | Parsed from PDF text |
| 9 | Last review date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Obsoleted Date | ObsDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), verified (2), currentaction (2), review (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `WAREBRIE2025`
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
| MASTER-361-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-361-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-361-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 10 |
| Workflow Signal Count | 9 |
| Notes | - |
