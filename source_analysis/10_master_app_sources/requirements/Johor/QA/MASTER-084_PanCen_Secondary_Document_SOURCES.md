# Master App PDF Source - PanCen - Secondary Document

> Master row: 84 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 84 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Secondary Document | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | NewDoc2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SECO | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/051_oleObject155.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 570 | 13 | 2 | SECONDARY DOCUMENT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Secondary Document | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Editor for Request section | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Business Area | Comp | Text | 1 | Parsed from PDF text |
| 2 | Document No | DocNo | Text | 1 | Parsed from PDF text |
| 3 | Source | Source | Text | 1 | Parsed from PDF text |
| 4 | No. of Original Copies | Copies | Number/Text | 1 | Parsed from PDF text |
| 5 | No. of Duplicate Copies | DupCopies | Number/Text | 1 | Parsed from PDF text |
| 6 | be printed) | Att | Text | 1 | Parsed from PDF text |
| 7 | Remarks | SecRemarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | Distribution List | DistributionList | Text | 1 | Parsed from PDF text |
| 9 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 10 | Editor for Request section | AEditor1 | Text | 1 | Parsed from PDF text |
| 11 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 12 | QA | QA | Text | 1 | Parsed from PDF text |
| 13 | IT | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `SECO`
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
| MASTER-084-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-084-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-084-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 2 |
| Notes | - |
