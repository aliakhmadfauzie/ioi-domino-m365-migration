# Master App PDF Source - Pancen CCCAR 2025

> Master row: 27 | Site: Johor | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 27 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen CCCAR 2025 | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | MARKETING | Source inventory |
| Form List | SpecCode - Form \| CCCAR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CCCA2025 | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/008_oleObject62.pdf | Extracted embedded PDF | sheet_order_fallback | 0.306 | Explicit mapping | 1 | 86 | 3 | 0 | PSN Spec code info |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/010_oleObject64.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 15 | 13724 | 94 | 112 | Created using notes Title (static text) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Customer Complaint Corrective Action Report (Cccar) | Inferred from PDF text | Needs Human Confirmation |
| 2 | CCCAR Request | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mktpic | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mkthod | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 7 | Verification of Complaint : vercomp | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Cc5 | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Cpa_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Cc3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Cpa | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Material Code | MatCode | Text | 1 | Parsed from PDF text |
| 2 | Spec Code | SpecCode | Text | 1 | Parsed from PDF text |
| 3 | Concatenate | ConSpec | Text | 1 | Parsed from PDF text |
| 4 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 5 | CCCAR No. | Year; Month; INO; BA | Number/Text | 1 | Parsed from PDF text |
| 6 | CCCAR No. | CCCARNo | Number/Text | 1 | Parsed from PDF text |
| 7 | CCCAR Issued Date | Disp_Datesent | Date/Text | 1 | Parsed from PDF text |
| 8 | Date Issued | DateSent | Date/Text | 1 | Parsed from PDF text |
| 9 | Complaint | Nature | Text | 1 | Parsed from PDF text |
| 10 | Contact Person | contname1 | Person/Text | 1 | Parsed from PDF text |
| 11 | Contact Person | contname2 | Person/Text | 1 | Parsed from PDF text |
| 12 | Issued By | Requestor1; NoIdRequestor1 | Person/Text | 1 | Parsed from PDF text |
| 13 | Location (Initiator) | Location | Text | 1 | Parsed from PDF text |
| 14 | Issued To | Recipient1; NoIdRecipient1 | Text | 1 | Parsed from PDF text |
| 15 | Location (Recipient) | Location2 | Text | 1 | Parsed from PDF text |
| 16 | cc | CC1 | Text | 1 | Parsed from PDF text |
| 17 | Superior | MKTPIC | Person/Text | 1 | Parsed from PDF text |
| 18 | Head of Marketing | MKTHOD | Person/Text | 1 | Parsed from PDF text |
| 19 | Recipient's HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 20 | Verification of Complaint | vercomp | Text | 1 | Parsed from PDF text |
| 21 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 22 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 23 | Reviewed by | ReviewBy | Text | 1 | Parsed from PDF text |
| 24 | cc | CC5 | Text | 1 | Parsed from PDF text |
| 25 | Acceptance | CPA_1 | Text | 1 | Parsed from PDF text |
| 26 | Comments | CommentReview | Multiline Text | 1 | Parsed from PDF text |
| 27 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 28 | Review By | ReviewByHOD | Person/Text | 1 | Parsed from PDF text |
| 29 | Date and Time | DateCommentSent | Date/Text | 1 | Parsed from PDF text |
| 30 | cc | CC3 | Text | 1 | Parsed from PDF text |
| 31 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 32 | Comments | Comment1; Date1 | Date/Text | 1 | Parsed from PDF text |
| 33 | Attachment | Attachment3 | Text | 1 | Parsed from PDF text |
| 34 | Withdrawn Comments | WRemarks | Multiline Text | 1 | Parsed from PDF text |
| 35 | Comments | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 36 | Send To | CC4 | Text | 1 | Parsed from PDF text |
| 37 | Send on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 38 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 39 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 40 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 41 | FOLLOWUP DATE | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Send on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 43 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 44 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 45 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 46 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 47 | Followup Date | FWUpDate | Date/Text | 1 | Parsed from PDF text |
| 48 | If yes, which workstations | Workstations | Text | 1 | Parsed from PDF text |
| 49 | Preventive Action Request Form | PARLink | Text | 1 | Parsed from PDF text |
| 50 | in Hazard Analysis Table? | HazardYesNO | Text | 1 | Parsed from PDF text |
| 51 | Comment | DeadlineComment | Multiline Text | 1 | Parsed from PDF text |
| 52 | R/O Table? | ROYesNO | Text | 1 | Parsed from PDF text |
| 53 | Comment | CAComment | Multiline Text | 1 | Parsed from PDF text |
| 54 | Recurrence | Reccurrence | Text | 1 | Parsed from PDF text |
| 55 | Comment | RecComment | Multiline Text | 1 | Parsed from PDF text |
| 56 | deadline | Deadline | Text | 1 | Parsed from PDF text |
| 57 | Comment | DeadlineComment_1 | Multiline Text | 1 | Parsed from PDF text |
| 58 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 59 | Root Cause | RootCause | Text | 1 | Parsed from PDF text |
| 60 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 61 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 62 | Requestor | Authors | Person/Text | 1 | Parsed from PDF text |
| 63 | Creation date | CDate | Date/Text | 1 | Parsed from PDF text |
| 64 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 65 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 66 | Editor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 67 | Editor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 68 | Editor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 69 | CCCAR Reply No | No_Reply | Text | 1 | Parsed from PDF text |
| 70 | Rejection email | SendTo | Date/Text | 1 | Parsed from PDF text |
| 71 | PCEO MKT Managers | GMEmails_PCEO | Text | 1 | Parsed from PDF text |
| 72 | FA & Gly | GMEmails | Text | 1 | Parsed from PDF text |
| 73 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 74 | Mailing List1 | MailingList1 | Text | 1 | Parsed from PDF text |
| 75 | Mailing List2 | MailingList2 | Text | 1 | Parsed from PDF text |
| 76 | Mailing List4 - QA List | QA | Text | 1 | Parsed from PDF text |
| 77 | MKT Use | MKTEditor | Text | 1 | Parsed from PDF text |
| 78 | REVIEW DETAILS - PIC | ReviewPIC | Person/Text | 1 | Parsed from PDF text |
| 79 | Reminder list | ReminderReplyMail | Text | 1 | Parsed from PDF text |
| 80 | Reminder list for MKT HOD | RemListQAReq | Person/Text | 1 | Parsed from PDF text |
| 81 | Reminder CC List | RemCC | Text | 1 | Parsed from PDF text |
| 82 | Reminder date | DateReminder | Date/Text | 1 | Parsed from PDF text |
| 83 | Reminder to MKT HOD | RemMKTHODDate | Date/Text | 1 | Parsed from PDF text |
| 84 | CA Status | CAStatus | Choice/Text | 1 | Parsed from PDF text |
| 85 | CC Recipients | AllRecipients | Text | 1 | Parsed from PDF text |
| 86 | Date Replied - Reminder Review | DateReplied | Date/Text | 1 | Parsed from PDF text |
| 87 | ED | ED | Text | 1 | Parsed from PDF text |
| 88 | TO PCOC HOD | app1 | Person/Text | 1 | Parsed from PDF text |
| 89 | Soap Noodles | app3 | Text | 1 | Parsed from PDF text |
| 90 | Editor | APPEditor | Text | 1 | Parsed from PDF text |
| 91 | HideActionButton | HideApp | Text | 1 | Parsed from PDF text |
| 92 | Head of Marketing (MKTHOD) | HMKT | Person/Text | 1 | Parsed from PDF text |
| 93 | To lock the Imp | LockSection1 | Text | 1 | Parsed from PDF text |
| 94 | To lock the Eff | LockSection2 | Text | 1 | Parsed from PDF text |
| 95 | All PIC - Reminder | AllPIC | Person/Text | 1 | Parsed from PDF text |
| 96 | All PIC - CC when Implementation | AllPICCC | Person/Text | 1 | Parsed from PDF text |
| 97 | Hide Date | HDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (93), review (6), hod (5), ca (2), verified (2), currentaction (2), verification (1), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `CCCA2025`
Child-list recommendation: `MainDB_MKT_Ext_CCCA2025_Rows` candidate for repeating row fields

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
| MASTER-027-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-027-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-027-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 97 |
| Workflow Signal Count | 112 |
| Notes | - |
