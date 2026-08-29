# Master App PDF Source - SHE HIRADC

> Master row: 316 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 316 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE HIRADC | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | newHIRARCv4 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEHIRA | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/015_oleObject164.pdf | Extracted embedded PDF | sheet_order_fallback | 0.250 | Explicit mapping | 9 | 6068 | 12 | 19 | Page 1 of 9 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Title | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 3 | Submitted for approval on datesubmitted | Inferred from PDF text | Needs Human Confirmation |
| 4 | Listing Required Approval : | Inferred from PDF text | Needs Human Confirmation |
| 5 | Status of Required approval : | Inferred from PDF text | Needs Human Confirmation |
| 6 | the final approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | Qahod | Inferred from PDF text | Needs Human Confirmation |
| 8 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Document Type | DocType | Choice/Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Number | No | Text | 1 | Parsed from PDF text |
| 4 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | TITLE | Title | Text | 1 | Parsed from PDF text |
| 7 | AREA | Area | Text | 1 | Parsed from PDF text |
| 8 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 9 | 7.0 Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 10 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 11 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 12 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), approval (5), approved (3), review (2), submitted (1), rejected (1), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEHIRA`
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
| MASTER-316-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-316-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-316-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 19 |
| Notes | - |
