# Master App PDF Source - MTN Emergency Change Procedure

> Master row: 200 | Site: Penang | Owner: MTN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 200 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | MTN Emergency Change Procedure | Clearly Found |
| Owner | MTN | Clearly Found |
| Department | Maint \| PHBSVR | Source inventory |
| Form List | changeMinorV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MTNEMERCHAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/008_oleObject33.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 4 | 2393 | 50 | 26 | Page 1 of 4 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Maintenance Emergency Change Procedure | Inferred from PDF text | Needs Human Confirmation |
| 2 | Emergency Change No : | Inferred from PDF text | Needs Human Confirmation |
| 3 | A) Initiation | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mtnhod | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Shehod | Inferred from PDF text | Needs Human Confirmation |
| 6 | Details on Facilities / Engineering Spec (or other relevant specification ): | Inferred from PDF text | Needs Human Confirmation |
| 7 | details | Inferred from PDF text | Needs Human Confirmation |
| 8 | C) Final Approval by HOD of Initiator: | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Location | Loc | Text | 1 | Parsed from PDF text |
| 2 | Dept | Dept | Text | 1 | Parsed from PDF text |
| 3 | Change Requested | changereq1 | Text | 1 | Parsed from PDF text |
| 4 | Equipment/Facilities owner | EquipOwnerEmail | Text | 1 | Parsed from PDF text |
| 5 | Notification No | NotNum | Text | 1 | Parsed from PDF text |
| 6 | HOD Equipment/Facilities owner | HODEquipOwnerEmail | Person/Text | 1 | Parsed from PDF text |
| 7 | HOD of Intiator | HODOwner | Person/Text | 1 | Parsed from PDF text |
| 8 | HOD of Engineering | MTNHOD | Person/Text | 1 | Parsed from PDF text |
| 9 | HOD of Safety | SHEHOD | Person/Text | 1 | Parsed from PDF text |
| 10 | Attachment | OtherArreasAtt | Text | 1 | Parsed from PDF text |
| 11 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 12 | Comments | Comments | Multiline Text | 1 | Parsed from PDF text |
| 13 | Attachment | ReportAtt | Text | 1 | Parsed from PDF text |
| 14 | Reviewed by | ReviewBy | Text | 1 | Parsed from PDF text |
| 15 | Date Reviewed | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 16 | HOD of Initiator | HODOwnerName | Person/Text | 1 | Parsed from PDF text |
| 17 | Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 18 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Comments | AppComments | Multiline Text | 1 | Parsed from PDF text |
| 20 | Reviewed by | ReviewedBy | Text | 1 | Parsed from PDF text |
| 21 | Status | RevStatus | Choice/Text | 1 | Parsed from PDF text |
| 22 | Date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Comments | AppComments_1 | Multiline Text | 1 | Parsed from PDF text |
| 24 | Reviewed by | ReviewedBySHE | Text | 1 | Parsed from PDF text |
| 25 | Status | RevStatusSHE | Choice/Text | 1 | Parsed from PDF text |
| 26 | Date | RevDateSHE | Date/Text | 1 | Parsed from PDF text |
| 27 | Comments | AppCommentsSHE | Multiline Text | 1 | Parsed from PDF text |
| 28 | Reviewed by | ReviewedByEng | Text | 1 | Parsed from PDF text |
| 29 | Status | RevStatusEng | Choice/Text | 1 | Parsed from PDF text |
| 30 | Date | RevDateEng | Date/Text | 1 | Parsed from PDF text |
| 31 | Comments | AppCommentsEng | Multiline Text | 1 | Parsed from PDF text |
| 32 | Doc Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 33 | Date Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 35 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 36 | Mailing List A | MailListA | Text | 1 | Parsed from PDF text |
| 37 | Mail list - Lai CW for ACM | LaiCW | Text | 1 | Parsed from PDF text |
| 38 | Mail list - Goh EH for AES/DCM | GohEH | Text | 1 | Parsed from PDF text |
| 39 | Herman | Herman | Text | 1 | Parsed from PDF text |
| 40 | Chong Chin Soon | CSChong | Text | 1 | Parsed from PDF text |
| 41 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 42 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 43 | AEditor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 44 | AEditor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 45 | AEditor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 46 | AEditor6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 47 | Change Number Temp | Temp | Text | 1 | Parsed from PDF text |
| 48 | WeeklyReminder | WkReminderDate | Date/Text | 1 | Parsed from PDF text |
| 49 | 3 months from ImpDate | ImpDateReminder | Date/Text | 1 | Parsed from PDF text |
| 50 | Reminder CC Mails | CCRemMails | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (9), reviewed (6), review (5), status (4), approval (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MTN`
FormCode: `MTNEMERCHAN`
Child-list recommendation: `MainDB_MTN_Ext_MTNEMERCHAN_Rows` candidate for repeating row fields

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
| MASTER-200-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-200-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-200-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 50 |
| Workflow Signal Count | 26 |
| Notes | - |
