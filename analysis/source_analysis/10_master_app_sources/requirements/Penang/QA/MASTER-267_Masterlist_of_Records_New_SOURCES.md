# Master App PDF Source - Masterlist of Records (New)

> Master row: 267 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 267 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Masterlist of Records (New) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewMSDSv3 - Form \| MasterList - Form \| Quality - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFRECO | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/040_oleObject272.pdf | Extracted embedded PDF | sheet_order_fallback | 0.377 | Explicit mapping | 9 | 7358 | 43 | 19 | Page 1 of 9 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/063_oleObject295.pdf | Extracted embedded PDF | text_match_high | 0.763 | Explicit mapping | 2 | 1085 | 18 | 9 | MASTERLIST OF DocType |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/065_oleObject297.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1333 | 24 | 2 | Masterlist of Records |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 2 | Listing Required Approval : TotalList | Inferred from PDF text | Needs Human Confirmation |
| 3 | approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 5 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Jus_3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Product Name | Product | Person/Text | 1 | Parsed from PDF text |
| 2 | Trade Name | TradeName | Person/Text | 1 | Parsed from PDF text |
| 3 | Status | Status1; Status2; Status3; Status4 | Choice/Text | 1 | Parsed from PDF text |
| 4 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 5 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 7 | Listing Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 8 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 9 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 10 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 11 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 12 | Pending App | PdgApp | Text | 1 | Parsed from PDF text |
| 13 | CC | QANames | Person/Text | 1 | Parsed from PDF text |
| 14 | Company | Company | Text | 1 | Parsed from PDF text |
| 15 | Department | Dept | Text | 1 | Parsed from PDF text |
| 16 | Number | No | Text | 1 | Parsed from PDF text |
| 17 | SDS NO | DocNo | Text | 1 | Parsed from PDF text |
| 18 | ISSUE NO. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 19 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 20 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 21 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 22 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 23 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 24 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 25 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Yearly Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 28 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 29 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 30 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 31 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 32 | QA | QA | Text | 1 | Parsed from PDF text |
| 33 | QC | QC | Text | 1 | Parsed from PDF text |
| 34 | QA Backup | QAOthers | Text | 1 | Parsed from PDF text |
| 35 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 36 | MailingList - rejections | RejMail | Text | 1 | Parsed from PDF text |
| 37 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 38 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 39 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 40 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 41 | Quality Council Email add | QualityCManagers | Text | 1 | Parsed from PDF text |
| 42 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 43 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 44 | Document Type | DocTypeName | Person/Text | 1 | Parsed from PDF text |
| 45 | Designation | txtDesg1 | Text | 1 | Parsed from PDF text |
| 46 | Designation | txtDesg2 | Text | 1 | Parsed from PDF text |
| 47 | Comments | AppCom | Multiline Text | 1 | Parsed from PDF text |
| 48 | Remarks | ObsCom | Multiline Text | 1 | Parsed from PDF text |
| 49 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 50 | Created On | CreateDate | Date/Text | 1 | Parsed from PDF text |
| 51 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 52 | Editor Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 53 | Editor Section B | Editor2 | Text | 1 | Parsed from PDF text |
| 54 | Default CC List | CCList | Text | 1 | Parsed from PDF text |
| 55 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 56 | ISG Admin | ISGAdmin | Text | 1 | Parsed from PDF text |
| 57 | No of Reply | NumReply | Text | 1 | Parsed from PDF text |
| 58 | QA for Record of Review | QAReviewList | Text | 1 | Parsed from PDF text |
| 59 | Mailing List | QAAll | Text | 1 | Parsed from PDF text |
| 60 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 61 | Custodian | Custodian | Text | 1 | Parsed from PDF text |
| 62 | Retention | Retention | Text | 1 | Parsed from PDF text |
| 63 | Latest Record Number | RecordNumber | Text | 1 | Parsed from PDF text |
| 64 | Amendment to the records | Changes | Text | 1 | Parsed from PDF text |
| 65 | Reference Document | ref_1 | Text | 1 | Parsed from PDF text |
| 66 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 67 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 68 | Owner of records | Owner; Send | Text | 1 | Parsed from PDF text |
| 69 | Sender | Sender | Text | 1 | Parsed from PDF text |
| 70 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 71 | Obsolete by | ObsoleteBy | Text | 1 | Parsed from PDF text |
| 72 | Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 73 | Reason | ObsoleteReason | Multiline Text | 1 | Parsed from PDF text |
| 74 | Last Edited by | LastEditedBy | Text | 1 | Parsed from PDF text |
| 75 | Last Edited Date | LastEditedOn | Date/Text | 1 | Parsed from PDF text |
| 76 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 77 | Editor 2 - Section B | Editor2 | Text | 1 | Parsed from PDF text |
| 78 | All PIC's | AllPIC | Person/Text | 1 | Parsed from PDF text |
| 79 | All Reference Docs | AllDocs | Text | 1 | Parsed from PDF text |
| 80 | ISG | ISG | Text | 1 | Parsed from PDF text |
| 81 | Ref Docs Count | RefDocCount | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (9), status (8), review (4), approved (3), currentaction (3), rejected (1), reviewed (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `MASTOFRECO`
Child-list recommendation: `MainDB_QA_Ext_MASTOFRECO_Rows` candidate for repeating row fields

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
| MASTER-267-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-267-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-267-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 81 |
| Workflow Signal Count | 30 |
| Notes | - |
