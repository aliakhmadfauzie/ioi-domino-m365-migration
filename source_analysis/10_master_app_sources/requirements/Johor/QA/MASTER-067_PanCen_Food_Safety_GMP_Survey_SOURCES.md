# Master App PDF Source - PanCen - Food Safety & GMP Survey

> Master row: 67 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 67 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Food Safety & GMP Survey | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA | Source inventory |
| Form List | PanCen - Food Safety & GMP Survey | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FOODSAFEGMP | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/022_oleObject126.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 2 | 454 | 2 | 2 | GMP Survey |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Enter Survey | Inferred from PDF text | Needs Human Confirmation |
| 2 | Details :- | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Initiator | Ini | Text | 1 | Parsed from PDF text |
| 2 | Recipient | Rec | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `FOODSAFEGMP`
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
| MASTER-067-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-067-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-067-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 2 |
| Workflow Signal Count | 2 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
