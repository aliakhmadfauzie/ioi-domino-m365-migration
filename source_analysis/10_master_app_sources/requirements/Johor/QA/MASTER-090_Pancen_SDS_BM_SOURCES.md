# Master App PDF Source - Pancen - SDS (BM)

> Master row: 90 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 90 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - SDS (BM) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | SDS - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SDSBM | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/039_oleObject143.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 9 | 5816 | 38 | 13 | Page 1 of 9 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/050_oleObject154.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 9 | 5542 | 37 | 13 | Page 1 of 9 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 2 | Submitted for approval on | Inferred from PDF text | Needs Human Confirmation |
| 3 | : K1 - K2 - K3 - K4 - K5 - K6 - K7 - K8 - K9 - K10 - K11 - K12 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Completed Approval list : TotalCount | Inferred from PDF text | Needs Human Confirmation |
| 5 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No. | Date; Issued; DateIssue | Date/Text | 1 | Parsed from PDF text |
| 2 | Business Area | Comp | Text | 1 | Parsed from PDF text |
| 3 | Product Name | Product | Person/Text | 1 | Parsed from PDF text |
| 4 | Trade Name | TradeName1 | Person/Text | 1 | Parsed from PDF text |
| 5 | Required Approvals list | TotalList | Number/Text | 1 | Parsed from PDF text |
| 6 | Pending for App | K1; K2; K3; K4 | Text | 1 | Parsed from PDF text |
| 7 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 8 | Completed Approval list | TotalCount | Number/Text | 1 | Parsed from PDF text |
| 9 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 10 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 11 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 12 | Pending App - QMR | PdgApp | Text | 1 | Parsed from PDF text |
| 13 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 14 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 15 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 16 | Company | Company | Text | 1 | Parsed from PDF text |
| 17 | Department | Dept | Text | 1 | Parsed from PDF text |
| 18 | Number | No | Text | 1 | Parsed from PDF text |
| 19 | SDS NO | DocNo_1 | Text | 1 | Parsed from PDF text |
| 20 | ISSUE NO. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 21 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 22 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 23 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 24 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 25 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 26 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 27 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 29 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 30 | QA | QA | Text | 1 | Parsed from PDF text |
| 31 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 32 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 33 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 34 | Mail List for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 35 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 36 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 38 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (8), approval (6), review (4), submitted (2), approved (2), rejected (2), reviewed (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `SDSBM`
Child-list recommendation: `MainDB_QA_Ext_SDSBM_Rows` candidate for repeating row fields

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
| MASTER-090-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-090-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-090-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 26 |
| Notes | - |
