# Master App PDF Source - Pancen - Site Master

> Master row: 72 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 72 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Site Master | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA | Source inventory |
| Form List | newapp - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SITEMAST | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/059_oleObject163.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1308 | 8 | 6 | Page 1 of 3 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Site Master File | Inferred from PDF text | Needs Human Confirmation |
| 2 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 4 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 2 | TITLE | doctitle | Text | 1 | Parsed from PDF text |
| 3 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 4 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 7 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 8 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (2), reviewed (1), status (1), approval (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `SITEMAST`
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
| MASTER-072-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-072-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-072-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 8 |
| Workflow Signal Count | 6 |
| Notes | - |
