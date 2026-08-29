# Master App PDF Source - Site Master File and Drug Master File

> Master row: 274 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 274 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Site Master File and Drug Master File | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewQMv5 - Form \| newapp - Form \| newentry - Form \| newverification - Form \| dmf - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SITEMASTFILE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/050_oleObject282.pdf | Extracted embedded PDF | sheet_order_fallback | 0.381 | Explicit mapping | 3 | 1677 | 24 | 5 | Page 1 of 3 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/079_oleObject311.pdf | Extracted embedded PDF | text_match_medium | 0.503 | Explicit mapping | 4 | 2493 | 43 | 20 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/080_oleObject312.pdf | Extracted embedded PDF | text_match_high | 0.504 | Explicit mapping | 2 | 882 | 27 | 3 | Page 1 of 2 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/081_oleObject313.pdf | Extracted embedded PDF | text_match_high | 0.501 | Explicit mapping | 5 | 2484 | 27 | 5 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/082_oleObject314.pdf | Extracted embedded PDF | text_match_high | 0.657 | Explicit mapping | 2 | 682 | 16 | 2 | Drug Master File |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 4 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 8 | Submitted for approval on DateSubmitted | Inferred from PDF text | Needs Human Confirmation |
| 9 | Required Approval | Inferred from PDF text | Needs Human Confirmation |
| 10 | : K1 - K2 - K4 - K9 - K3 - K6 - K7 - K8 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Qahod | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 2 | Document Title | DocTitle | Text | 1 | Parsed from PDF text |
| 3 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 4 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 5 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 6 | Approvers | App1; App2; App4; App9 | Person/Text | 1 | Parsed from PDF text |
| 7 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 8 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 9 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 10 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 12 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 13 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 14 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 15 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 16 | QA | QA | Text | 1 | Parsed from PDF text |
| 17 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 18 | Mail List for rejection | RejMail | Text | 1 | Parsed from PDF text |
| 19 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 20 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 21 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 22 | Quality Council | QualityCManagers | Text | 1 | Parsed from PDF text |
| 23 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 24 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Master File | MasterFile | Text | 1 | Parsed from PDF text |
| 26 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 27 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 28 | Section No. | SectionNo | Number/Text | 1 | Parsed from PDF text |
| 29 | TITLE | doctitle | Text | 1 | Parsed from PDF text |
| 30 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 31 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 32 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 33 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 34 | Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 35 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 36 | Pending for App | K1; K2; K4; K9 | Text | 1 | Parsed from PDF text |
| 37 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 38 | Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 39 | Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 40 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 41 | Pending App - LCW | PdgApp | Text | 1 | Parsed from PDF text |
| 42 | CC | QANames | Person/Text | 1 | Parsed from PDF text |
| 43 | QA | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 44 | Approvers | App1 | Person/Text | 1 | Parsed from PDF text |
| 45 | Approval | Author_VER | Text | 1 | Parsed from PDF text |
| 46 | QA | QA2 | Text | 1 | Parsed from PDF text |
| 47 | MailList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 48 | Company | Comp | Text | 1 | Parsed from PDF text |
| 49 | DMF no. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 50 | Customer | Customer | Text | 1 | Parsed from PDF text |
| 51 | Product | Product | Text | 1 | Parsed from PDF text |
| 52 | Issue No. | IssueNo | Number/Text | 1 | Parsed from PDF text |
| 53 | Record of Issue | Issue | Text | 1 | Parsed from PDF text |
| 54 | Designation | PreDesg | Text | 1 | Parsed from PDF text |
| 55 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Distribution To | DistList | Text | 1 | Parsed from PDF text |
| 57 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 58 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 59 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 60 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 61 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 62 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (11), status (9), review (4), approved (3), reviewed (2), submitted (1), rejected (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `SITEMASTFILE`
Child-list recommendation: `MainDB_QA_Ext_SITEMASTFILE_Rows` candidate for repeating row fields

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
| MASTER-274-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-274-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-274-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 5 |
| Parsed Field Count | 62 |
| Workflow Signal Count | 35 |
| Notes | - |
