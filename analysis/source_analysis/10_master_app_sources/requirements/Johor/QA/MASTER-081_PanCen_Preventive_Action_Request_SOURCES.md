# Master App PDF Source - PanCen - Preventive Action Request

> Master row: 81 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 81 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Preventive Action Request | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | PrevAction - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PREVACTI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/047_oleObject151.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 6 | 2125 | 45 | 15 | PREVENTIVE ACTION REQUEST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PREVENTIVE ACTION REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Parcc | Inferred from PDF text | Needs Human Confirmation |
| 3 | Potential Non-Conformance | Inferred from PDF text | Needs Human Confirmation |
| 4 | Description | Inferred from PDF text | Needs Human Confirmation |
| 5 | Proposed Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 6 | Recipient's Section: | Inferred from PDF text | Needs Human Confirmation |
| 7 | Acceptance Of Proposed Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 8 | Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 9 | By Whom | Inferred from PDF text | Needs Human Confirmation |
| 10 | By When | Inferred from PDF text | Needs Human Confirmation |
| 11 | Preventive Action Verification | Inferred from PDF text | Needs Human Confirmation |
| 12 | VERIFICATION - IMPLEMENTATION :- | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | PAR No | PARNo | Text | 1 | Parsed from PDF text |
| 2 | Issued Date | IssuedDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Initiator | PARInitiator | Text | 1 | Parsed from PDF text |
| 4 | Location (Intiator) | LocInitiator | Text | 1 | Parsed from PDF text |
| 5 | Recipient | PARRecipient; RecipientName | Person/Text | 1 | Parsed from PDF text |
| 6 | Location (Recipient) | LocRecipient | Text | 1 | Parsed from PDF text |
| 7 | CC | PARCC | Text | 1 | Parsed from PDF text |
| 8 | from date issued | DueDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Next Reminder date | NextReminder | Date/Text | 1 | Parsed from PDF text |
| 10 | Attachment | PARAtt | Text | 1 | Parsed from PDF text |
| 11 | Date Replied | DateReplied | Date/Text | 1 | Parsed from PDF text |
| 12 | CC | CCReply | Text | 1 | Parsed from PDF text |
| 13 | Acceptance status | AcceptanceStatus | Choice/Text | 1 | Parsed from PDF text |
| 14 | justification | Justify | Multiline Text | 1 | Parsed from PDF text |
| 15 | Send To | CC4 | Text | 1 | Parsed from PDF text |
| 16 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 17 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 18 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 19 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 20 | Follow Up Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Verified on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 22 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 23 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 24 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 25 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 26 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 27 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Running number | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 29 | Requestor's section | Editor1 | Person/Text | 1 | Parsed from PDF text |
| 30 | QA's section - Implementation | Editor3 | Text | 1 | Parsed from PDF text |
| 31 | QA's section - Effectiveness | Editor4 | Text | 1 | Parsed from PDF text |
| 32 | Recipient | Recipient | Text | 1 | Parsed from PDF text |
| 33 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 34 | QA Users | QA | Text | 1 | Parsed from PDF text |
| 35 | MailingList1 - Request | MailingList1 | Text | 1 | Parsed from PDF text |
| 36 | MailingList2 - Reply | MailingList2 | Text | 1 | Parsed from PDF text |
| 37 | MailingList3 - Verification | MailingList3 | Text | 1 | Parsed from PDF text |
| 38 | To lock the Imp | LockSection1 | Text | 1 | Parsed from PDF text |
| 39 | To lock the Eff | LockSection2 | Text | 1 | Parsed from PDF text |
| 40 | Reply Status | ReplyStatus | Choice/Text | 1 | Parsed from PDF text |
| 41 | Mailing List | MailingList4 | Text | 1 | Parsed from PDF text |
| 42 | Standard Form Name | Name | Person/Text | 1 | Parsed from PDF text |
| 43 | Quality Council members | QualityCouncil | Text | 1 | Parsed from PDF text |
| 44 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 45 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verification (6), status (4), verified (4), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `PREVACTI`
Child-list recommendation: `MainDB_QA_Ext_PREVACTI_Rows` candidate for repeating row fields

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
| MASTER-081-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-081-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-081-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 45 |
| Workflow Signal Count | 15 |
| Notes | - |
