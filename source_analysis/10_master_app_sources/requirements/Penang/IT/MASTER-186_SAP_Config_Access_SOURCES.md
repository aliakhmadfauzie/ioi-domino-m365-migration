# Master App PDF Source - SAP Config Access

> Master row: 186 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 186 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Config Access | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | ConfigForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPCONFACCE | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/022_oleObject143.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1231 | 32 | 4 | SAP Config Access |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A - IT Functional Team | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section B - BASIS Team | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section C - Request for Config Close | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section D - Completion | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Itpic | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Itpic2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section B (Main) | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section D | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Form Num | ReqNum | Text | 1 | Parsed from PDF text |
| 2 | System ID | Client | Text | 1 | Parsed from PDF text |
| 3 | Client Num | ClientNum | Text | 1 | Parsed from PDF text |
| 4 | SAP Notes Number | RefDoc | Text | 1 | Parsed from PDF text |
| 5 | Purpose | Purpose | Text | 1 | Parsed from PDF text |
| 6 | Changes to be done | ChangesDone | Text | 1 | Parsed from PDF text |
| 7 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 8 | Functional Owner | CCFuncOwner | Text | 1 | Parsed from PDF text |
| 9 | Requested By | RequestedBy | Text | 1 | Parsed from PDF text |
| 10 | Date submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 11 | Comments | ReqComments | Multiline Text | 1 | Parsed from PDF text |
| 12 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 13 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 14 | Date Withdrawn | WDDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 16 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 17 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Req No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 19 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 20 | Ms. Khor & Ung - Transporter | Transporter | Text | 1 | Parsed from PDF text |
| 21 | Mailing List - CC & Transporter | MailA | Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 23 | IT Manager | ITPIC | Person/Text | 1 | Parsed from PDF text |
| 24 | IT Manager (Kelly) | ITPIC2 | Person/Text | 1 | Parsed from PDF text |
| 25 | Mailing List - CC | MailCCAll | Text | 1 | Parsed from PDF text |
| 26 | Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 27 | Section B (Main) | Editor2 | Text | 1 | Parsed from PDF text |
| 28 | Section C | Editor3 | Text | 1 | Parsed from PDF text |
| 29 | Section D | Editor4 | Text | 1 | Parsed from PDF text |
| 30 | Display Functional Name | ConvertName | Person/Text | 1 | Parsed from PDF text |
| 31 | Reminder to Requestor | RemReqStart | Person/Text | 1 | Parsed from PDF text |
| 32 | Reminder to BASIS Admin | RemAdminStart | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), submitted (1), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SAPCONFACCE`
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
| MASTER-186-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-186-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-186-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 32 |
| Workflow Signal Count | 4 |
| Notes | - |
