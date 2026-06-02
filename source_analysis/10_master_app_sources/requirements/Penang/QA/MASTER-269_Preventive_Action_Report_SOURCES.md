# Master App PDF Source - Preventive Action Report

> Master row: 269 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 269 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Preventive Action Report | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | PrevAction - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PREVACTIREPO | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/071_oleObject303.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1475 | 34 | 7 | PREVENTIVE ACTION REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Preventive Action Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Select | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Parcc | Inferred from PDF text | Needs Human Confirmation |
| 4 | Potential Non-Conformance | Inferred from PDF text | Needs Human Confirmation |
| 5 | Description | Inferred from PDF text | Needs Human Confirmation |
| 6 | Proposed Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 7 | VERIFICATION - EFFECTIVENESS:- | Inferred from PDF text | Needs Human Confirmation |
| 8 | Requestor's section | Inferred from PDF text | Needs Human Confirmation |
| 9 | Recipient's section | Inferred from PDF text | Needs Human Confirmation |
| 10 | QA's section - Implementation | Inferred from PDF text | Needs Human Confirmation |
| 11 | QA's section - Effectiveness | Inferred from PDF text | Needs Human Confirmation |
| 12 | MailingList1 - Request | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | PAR No | PARNo | Text | 1 | Parsed from PDF text |
| 2 | Issued Date | IssuedDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Initiator | PARInitiator | Text | 1 | Parsed from PDF text |
| 4 | Location (Initiator) | LocInitiator | Text | 1 | Parsed from PDF text |
| 5 | Recipient | PARRecipient; RecipientName | Person/Text | 1 | Parsed from PDF text |
| 6 | Location (Recipient) | SELECT | Text | 1 | Parsed from PDF text |
| 7 | CC | PARCC | Text | 1 | Parsed from PDF text |
| 8 | Next Reminder date | NextReminder | Date/Text | 1 | Parsed from PDF text |
| 9 | Attachment | PARAtt | Text | 1 | Parsed from PDF text |
| 10 | Send on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 11 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 12 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 13 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 14 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 15 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 16 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 18 | Running number | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 19 | Requestor's section | Editor1 | Person/Text | 1 | Parsed from PDF text |
| 20 | Recipient's section | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | QA's section - Implementation | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | QA's section - Effectiveness | Editor4 | Text | 1 | Parsed from PDF text |
| 23 | Recipient | Recipient | Text | 1 | Parsed from PDF text |
| 24 | QA Users | QA | Text | 1 | Parsed from PDF text |
| 25 | MailingList1 - Request | MailingList1 | Text | 1 | Parsed from PDF text |
| 26 | MailingList2 - Reply | MailingList2 | Text | 1 | Parsed from PDF text |
| 27 | MailingList3 - Verification | MailingList3 | Text | 1 | Parsed from PDF text |
| 28 | To lock the Imp | LockSection1 | Text | 1 | Parsed from PDF text |
| 29 | To lock the Eff | LockSection2 | Text | 1 | Parsed from PDF text |
| 30 | Reply Status | ReplyStatus | Choice/Text | 1 | Parsed from PDF text |
| 31 | Mailing List | MailingList4 | Text | 1 | Parsed from PDF text |
| 32 | Standard Form Name | Name | Person/Text | 1 | Parsed from PDF text |
| 33 | OE Council | QualityCouncil | Text | 1 | Parsed from PDF text |
| 34 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verification (3), status (2), verified (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `PREVACTIREPO`
Child-list recommendation: `MainDB_QA_Ext_PREVACTIREPO_Rows` candidate for repeating row fields

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
| MASTER-269-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-269-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-269-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 7 |
| Notes | - |
