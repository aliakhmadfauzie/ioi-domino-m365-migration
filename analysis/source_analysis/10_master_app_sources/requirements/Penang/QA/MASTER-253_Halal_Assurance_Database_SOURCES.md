# Master App PDF Source - Halal Assurance Database

> Master row: 253 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 253 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Halal Assurance Database | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | TQMForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | HALAASSU | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/023_oleObject255.pdf | Extracted embedded PDF | sheet_order_fallback | 0.382 | Explicit mapping | 3 | 1250 | 35 | 4 | PROJECT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Project | Inferred from PDF text | Needs Human Confirmation |
| 2 | SecƟon A : Project Details | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cpa | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Running No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Division | Division | Text | 1 | Parsed from PDF text |
| 3 | TQM Tier | Tier | Text | 1 | Parsed from PDF text |
| 4 | Team Name | TeamName | Person/Text | 1 | Parsed from PDF text |
| 5 | Team Leader (Full Name) | TeamLeader | Person/Text | 1 | Parsed from PDF text |
| 6 | Team Members (Full Name) | TeamMembers | Person/Text | 1 | Parsed from PDF text |
| 7 | Project Title | ProjectTitle | Text | 1 | Parsed from PDF text |
| 8 | Project Time Frame | TimeFrame | Text | 1 | Parsed from PDF text |
| 9 | Mission Statement | MissionStatement | Text | 1 | Parsed from PDF text |
| 10 | Problem Statement | ProblemStatement | Text | 1 | Parsed from PDF text |
| 11 | Project Boundary | ProjectBoundary | Text | 1 | Parsed from PDF text |
| 12 | Intangible/Benefits | Intangible | Text | 1 | Parsed from PDF text |
| 13 | Project Workbook | Workbook | Text | 1 | Parsed from PDF text |
| 14 | Sponsor | Sponsor | Text | 1 | Parsed from PDF text |
| 15 | members) | CC | Text | 1 | Parsed from PDF text |
| 16 | Date | EIDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 18 | Reviewed by | Acceptedby | Text | 1 | Parsed from PDF text |
| 19 | Reviewed on | Acceptedon | Text | 1 | Parsed from PDF text |
| 20 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 21 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 22 | Discarded on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 23 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 24 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 25 | DocAuthor | DocAuthor | Text | 1 | Parsed from PDF text |
| 26 | Created Date | CDate | Date/Text | 1 | Parsed from PDF text |
| 27 | VRN No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 28 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 29 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 30 | QA | QA | Text | 1 | Parsed from PDF text |
| 31 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 32 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 33 | Quality Council | OE | Text | 1 | Parsed from PDF text |
| 34 | Mailing List | MailList | Text | 1 | Parsed from PDF text |
| 35 | No. of Reply | Reply | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | reviewed (2), review (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `HALAASSU`
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
| MASTER-253-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-253-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-253-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 4 |
| Notes | - |
