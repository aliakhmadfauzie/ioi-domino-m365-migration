# Master App PDF Source - OFI

> Master row: 268 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 268 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | OFI | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | MSDS - Form \| OFIRequest - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | OFI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/042_oleObject274.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 15 | 6500 | 50 | 19 | 1/15 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/070_oleObject302.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 2170 | 45 | 7 | Opportunity For Improvement Request (OFI Request) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | T : +60-4-376 8888 | Inferred from PDF text | Needs Human Confirmation |
| 2 | F : +60-4-390 7252 | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 4 | Submitted for approval on DateSubmitted | Inferred from PDF text | Needs Human Confirmation |
| 5 | Listing Req'd Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | : K1 - K2 - K4 - K9 - K3 - K6 - K7 - K8 | Inferred from PDF text | Needs Human Confirmation |
| 7 | approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SDS No. | DN | Number/Text | 1 | Parsed from PDF text |
| 2 | Issue No. | IN | Number/Text | 1 | Parsed from PDF text |
| 3 | Date Issued | DateIssued | Date/Text | 1 | Parsed from PDF text |
| 4 | Date Review | DateReview | Date/Text | 1 | Parsed from PDF text |
| 5 | Group of Chemicals | Product | Text | 1 | Parsed from PDF text |
| 6 | Trade Name | TradeName | Person/Text | 1 | Parsed from PDF text |
| 7 | Name | CommercialName | Person/Text | 1 | Parsed from PDF text |
| 8 | Common Name/Other Name | CommonName | Person/Text | 1 | Parsed from PDF text |
| 9 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 10 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 11 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 12 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 13 | Listing Req'd Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 14 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 15 | Pending for App | K1; K2; K4; K9 | Text | 1 | Parsed from PDF text |
| 16 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 17 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 18 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 19 | Pending App - LCW | PdgApp | Text | 1 | Parsed from PDF text |
| 20 | Mailing List (CC) | QANames | Person/Text | 1 | Parsed from PDF text |
| 21 | Approvers | App1; App2; App4; App9 | Person/Text | 1 | Parsed from PDF text |
| 22 | Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 23 | nt | Dept | Text | 1 | Parsed from PDF text |
| 24 | Number | No | Text | 1 | Parsed from PDF text |
| 25 | SDS NO | DocNo | Text | 1 | Parsed from PDF text |
| 26 | ISSUE NO. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 27 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 28 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 29 | Allow Editing | Editors | Text | 1 | Parsed from PDF text |
| 30 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 31 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 32 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 33 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Yearly Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 35 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 36 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 37 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 38 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 39 | QA | QA | Text | 1 | Parsed from PDF text |
| 40 | QC | QC | Text | 1 | Parsed from PDF text |
| 41 | QA Backup | QAOthers | Text | 1 | Parsed from PDF text |
| 42 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 43 | MailingList - rejections | RejMail | Text | 1 | Parsed from PDF text |
| 44 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 45 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 46 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 47 | Quality Council | QualityCManagers | Text | 1 | Parsed from PDF text |
| 48 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 49 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 50 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 51 | OFI No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 52 | OFI No. | OFINo | Number/Text | 1 | Parsed from PDF text |
| 53 | Initiator | Requestor1; NoIdRequestor | Person/Text | 1 | Parsed from PDF text |
| 54 | (Intiator) | Location1 | Text | 1 | Parsed from PDF text |
| 55 | Recipient | Recipient1; NoIdRecipient1 | Text | 1 | Parsed from PDF text |
| 56 | (Recipient) | Location2 | Text | 1 | Parsed from PDF text |
| 57 | cc | CC1 | Text | 1 | Parsed from PDF text |
| 58 | OFI Description | OFIDesc | Multiline Text | 1 | Parsed from PDF text |
| 59 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 60 | Suggestion | Suggestion | Text | 1 | Parsed from PDF text |
| 61 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 62 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 63 | Div/Dept Head | DeptHead | Text | 1 | Parsed from PDF text |
| 64 | Date | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 65 | cc | CC3 | Text | 1 | Parsed from PDF text |
| 66 | Acceptance | CPA_1 | Text | 1 | Parsed from PDF text |
| 67 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 68 | New date to be reviewed | NewDateReview | Date/Text | 1 | Parsed from PDF text |
| 69 | If yes, which workstations | Workstations | Text | 1 | Parsed from PDF text |
| 70 | Preventive Action Request Form | PARLink | Text | 1 | Parsed from PDF text |
| 71 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 72 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 73 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 74 | Remarks | WDrawnCom | Multiline Text | 1 | Parsed from PDF text |
| 75 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 76 | Initiator | Authors | Text | 1 | Parsed from PDF text |
| 77 | Created On | CDate | Date/Text | 1 | Parsed from PDF text |
| 78 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 79 | ISG Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 80 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 81 | Quality Council Member | QCMember | Text | 1 | Parsed from PDF text |
| 82 | QA Creator | QA | Text | 1 | Parsed from PDF text |
| 83 | COO - Exlcuded ED | OSM | Text | 1 | Parsed from PDF text |
| 84 | Def CC Mailing List | CC | Text | 1 | Parsed from PDF text |
| 85 | IOI Prai Div & Dept Managers | DH | Text | 1 | Parsed from PDF text |
| 86 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 87 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 88 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 89 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 90 | Mailing List 1 | FirstMail | Text | 1 | Parsed from PDF text |
| 91 | Mailing List 2 | SecondMail | Text | 1 | Parsed from PDF text |
| 92 | Mailing List 3 | ThirdMail | Text | 1 | Parsed from PDF text |
| 93 | Sent to Rejected DB | SendTo | Date/Text | 1 | Parsed from PDF text |
| 94 | No. of reply | No_Reply | Number/Text | 1 | Parsed from PDF text |
| 95 | Date to hide the Feedback | HideDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (7), approval (5), review (4), reviewed (3), rejected (2), approved (2), currentaction (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `OFI`
Child-list recommendation: `MainDB_QA_Ext_OFI_Rows` candidate for repeating row fields

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
| MASTER-268-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-268-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-268-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 95 |
| Workflow Signal Count | 26 |
| Notes | - |
