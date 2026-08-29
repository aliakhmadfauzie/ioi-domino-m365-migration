# Master App PDF Source - QA INFO CENTRE

> Master row: 272 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 272 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | QA INFO CENTRE | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | QAInfov2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QACENT | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/077_oleObject309.pdf | Extracted embedded PDF | text_match_medium | 0.502 | Explicit mapping | 2 | 723 | 13 | 3 | QA INFORMATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Qa Information | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section A Editor | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | QA Info No | QAInfoNo2 | Text | 1 | Parsed from PDF text |
| 2 | Send To | SendTo2 | Date/Text | 1 | Parsed from PDF text |
| 3 | Notified Date | NotifiedDate2 | Date/Text | 1 | Parsed from PDF text |
| 4 | Category | InfoCategory | Choice/Text | 1 | Parsed from PDF text |
| 5 | Title | Title | Text | 1 | Parsed from PDF text |
| 6 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 7 | Attachment | Attach3 | Text | 1 | Parsed from PDF text |
| 8 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 9 | Section A Editor | AEditor1 | Text | 1 | Parsed from PDF text |
| 10 | QA Access Name List | QA | Person/Text | 1 | Parsed from PDF text |
| 11 | Reference No | Year; Month; INFONO2 | Text | 1 | Parsed from PDF text |
| 12 | ISG Access | ISG | Text | 1 | Parsed from PDF text |
| 13 | SendEmail status | temp1 | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `QACENT`
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
| MASTER-272-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-272-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-272-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 3 |
| Notes | - |
