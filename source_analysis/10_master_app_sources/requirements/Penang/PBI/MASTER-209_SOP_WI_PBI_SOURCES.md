# Master App PDF Source - SOP & WI PBI

> Master row: 209 | Site: Penang | Owner: PBI | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 209 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SOP & WI PBI | Clearly Found |
| Owner | PBI | Clearly Found |
| Department | PBI | Source inventory |
| Form List | newSOPv7 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SOPWIPBI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/PBI/001_oleObject19.pdf | Extracted embedded PDF | sheet_order_fallback | 0.253 | Explicit mapping | 13 | 6428 | 29 | 5 | Page 1 of 13 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Title | Inferred from PDF text | Needs Human Confirmation |
| 2 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 3 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_4 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Document Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Number | No | Text | 1 | Parsed from PDF text |
| 4 | Company | Comp | Text | 1 | Parsed from PDF text |
| 5 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 6 | System | Sys | Text | 1 | Parsed from PDF text |
| 7 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 8 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 9 | Allow Editing | Editors | Text | 1 | Parsed from PDF text |
| 10 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 11 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 12 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 13 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 15 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 16 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 17 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 18 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 19 | QA PIC | QA | Person/Text | 1 | Parsed from PDF text |
| 20 | QA Backup | QAOthers | Text | 1 | Parsed from PDF text |
| 21 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 22 | MailList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 23 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 24 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 25 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 26 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 27 | Quality Council Email | QualityCManagers | Text | 1 | Parsed from PDF text |
| 28 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 29 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (1), review (1), reviewed (1), approved (1), approval (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PBI`
FormCode: `SOPWIPBI`
Child-list recommendation: `MainDB_PBI_Ext_SOPWIPBI_Rows` candidate for repeating row fields

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
| MASTER-209-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-209-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-209-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 29 |
| Workflow Signal Count | 5 |
| Notes | - |
