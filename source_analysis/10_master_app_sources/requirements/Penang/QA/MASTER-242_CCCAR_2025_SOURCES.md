# Master App PDF Source - CCCAR 2025

> Master row: 242 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 242 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | CCCAR 2025 | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | CCCAR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CCCA2025 | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/014_oleObject246.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 12 | 11841 | 102 | 99 | Created using notes id |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Request | Inferred from PDF text | Needs Human Confirmation |
| 2 | Customer Complaint Corrective Action Report (Cccar) | Inferred from PDF text | Needs Human Confirmation |
| 3 | CCCAR Request | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mktpic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Verification of Complaint : | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | PCQI Verification | Inferred from PDF text | Needs Human Confirmation |
| 9 | Corrective Action - PCQI Verification | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Cpa2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Cc5 | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Cpa_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | CCCAR No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 2 | CCCAR No. | CCCARNo | Number/Text | 1 | Parsed from PDF text |
| 3 | CCCAR Issued Date | Disp_Datesent | Date/Text | 1 | Parsed from PDF text |
| 4 | Date Issued | DateSent | Date/Text | 1 | Parsed from PDF text |
| 5 | Nature of customer's complaint | Nature | Text | 1 | Parsed from PDF text |
| 6 | Person | contname1 | Person/Text | 1 | Parsed from PDF text |
| 7 | Person | contname2 | Person/Text | 1 | Parsed from PDF text |
| 8 | Issued By | Requestor1; NoIdRequestor1 | Person/Text | 1 | Parsed from PDF text |
| 9 | (Initiator) | Location | Text | 1 | Parsed from PDF text |
| 10 | Issued To | Recipient1; NoIdRecipient1 | Text | 1 | Parsed from PDF text |
| 11 | (Recipient) | SELECT; Location2 | Text | 1 | Parsed from PDF text |
| 12 | cc | CC1 | Text | 1 | Parsed from PDF text |
| 13 | Superior | MKTPIC | Person/Text | 1 | Parsed from PDF text |
| 14 | Status | VerifiedStatus | Person/Text | 1 | Parsed from PDF text |
| 15 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 16 | cc | CC2 | Text | 1 | Parsed from PDF text |
| 17 | Verified by | ReviewBy2 | Person/Text | 1 | Parsed from PDF text |
| 18 | Date and Time | DateVerify | Date/Text | 1 | Parsed from PDF text |
| 19 | Acceptance | CPA2 | Text | 1 | Parsed from PDF text |
| 20 | Comments | Comment1_2 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Attachment | Attachment3_1 | Text | 1 | Parsed from PDF text |
| 22 | No.of Rejection | Rejp | Number/Text | 1 | Parsed from PDF text |
| 23 | Reviewed by | ReviewBy | Text | 1 | Parsed from PDF text |
| 24 | cc | CC5 | Text | 1 | Parsed from PDF text |
| 25 | Acceptance | CPA_1 | Text | 1 | Parsed from PDF text |
| 26 | Acceptance Comments | Comments_1 | Multiline Text | 1 | Parsed from PDF text |
| 27 | Rejection Comments | Comment1_1 | Multiline Text | 1 | Parsed from PDF text |
| 28 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 29 | Reviewed by | ReviewByHOD | Person/Text | 1 | Parsed from PDF text |
| 30 | Date and Time | DateCommentSent | Date/Text | 1 | Parsed from PDF text |
| 31 | cc | CC3 | Text | 1 | Parsed from PDF text |
| 32 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 33 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 34 | Attachment | Attachment3 | Text | 1 | Parsed from PDF text |
| 35 | Comments | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 36 | Send To | CC4 | Text | 1 | Parsed from PDF text |
| 37 | Send on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 38 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 39 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 40 | FOLLOWUP DATE | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Send on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 42 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 43 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 44 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 45 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 46 | If yes, which workstations | Workstations | Text | 1 | Parsed from PDF text |
| 47 | Preventive Action Request Form | PARLink | Text | 1 | Parsed from PDF text |
| 48 | Table? | HazardYesNO | Text | 1 | Parsed from PDF text |
| 49 | Comment | CAComment | Multiline Text | 1 | Parsed from PDF text |
| 50 | table? | ROYesNO | Text | 1 | Parsed from PDF text |
| 51 | Comment | ROComment | Multiline Text | 1 | Parsed from PDF text |
| 52 | Recurrence | Reccurrence | Text | 1 | Parsed from PDF text |
| 53 | Comment | RecComment | Multiline Text | 1 | Parsed from PDF text |
| 54 | action as per | Deadline | Text | 1 | Parsed from PDF text |
| 55 | Comment | DeadlineComment | Multiline Text | 1 | Parsed from PDF text |
| 56 | First Meeting Date | MeetingDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 58 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 59 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 60 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 61 | Date Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 62 | Authors | Authors_1 | Text | 1 | Parsed from PDF text |
| 63 | PIC | ReviewPIC | Person/Text | 1 | Parsed from PDF text |
| 64 | ACM/DCMEditor | APPEditor | Text | 1 | Parsed from PDF text |
| 65 | HideActionButton | HideApp | Text | 1 | Parsed from PDF text |
| 66 | CC | Defcc | Text | 1 | Parsed from PDF text |
| 67 | QA Requestor's section | QAAdmin | Person/Text | 1 | Parsed from PDF text |
| 68 | No of Reply (count) | No_Reply | Text | 1 | Parsed from PDF text |
| 69 | OE Council | QualityCouncil | Text | 1 | Parsed from PDF text |
| 70 | QA | QA | Text | 1 | Parsed from PDF text |
| 71 | QA 2 | QA2 | Text | 1 | Parsed from PDF text |
| 72 | Mailing List for Reminder Link | MailingListRemLink | Text | 1 | Parsed from PDF text |
| 73 | Send to Rejected database function | SendTo | Date/Text | 1 | Parsed from PDF text |
| 74 | To lock the Imp | LockSection1 | Text | 1 | Parsed from PDF text |
| 75 | To lock the Eff | LockSection2 | Text | 1 | Parsed from PDF text |
| 76 | CA Status | CAStatus | Choice/Text | 1 | Parsed from PDF text |
| 77 | CCRecipients | AllRecipients | Text | 1 | Parsed from PDF text |
| 78 | Date Reminder | DateReminder | Date/Text | 1 | Parsed from PDF text |
| 79 | Mailing List A | MailA | Text | 1 | Parsed from PDF text |
| 80 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 81 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 82 | Lock section1 | AEditor3 | Text | 1 | Parsed from PDF text |
| 83 | Lock section 2 | AEditor3_1 | Text | 1 | Parsed from PDF text |
| 84 | AEditor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 85 | AEditor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 86 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |
| 87 | Mail CC ACM | ACM | Text | 1 | Parsed from PDF text |
| 88 | Mail CC AES | AES | Text | 1 | Parsed from PDF text |
| 89 | Mail CC DCM | DCM | Text | 1 | Parsed from PDF text |
| 90 | Mail CC ECM | ECM | Text | 1 | Parsed from PDF text |
| 91 | TO ACM HOD | app1 | Person/Text | 1 | Parsed from PDF text |
| 92 | TO DCM, AEP | app2 | Text | 1 | Parsed from PDF text |
| 93 | Optional App | app3 | Text | 1 | Parsed from PDF text |
| 94 | TO SCM, AES and ECM | app4 | Text | 1 | Parsed from PDF text |
| 95 | FST Members | FST | Text | 1 | Parsed from PDF text |
| 96 | All PIC - Approved | AllPICA | Person/Text | 1 | Parsed from PDF text |
| 97 | All PIC - Reminder | AllPIC | Person/Text | 1 | Parsed from PDF text |
| 98 | Reminder CA - Date - 14 days | RemCADate | Date/Text | 1 | Parsed from PDF text |
| 99 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 100 | Reminder CC2 | RemCC_1 | Text | 1 | Parsed from PDF text |
| 101 | Rem inder Text | Remtext | Text | 1 | Parsed from PDF text |
| 102 | Holidays | Holidays | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (81), verification (3), ca (3), verified (3), review (3), reviewed (2), currentaction (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `CCCA2025`
Child-list recommendation: `MainDB_QA_Ext_CCCA2025_Rows` candidate for repeating row fields

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
| MASTER-242-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-242-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-242-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 102 |
| Workflow Signal Count | 99 |
| Notes | - |
