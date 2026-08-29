# Master App PDF Source - Notification of Change from Vendor

> Master row: 221 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 221 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Notification of Change from Vendor | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewChangeVendor2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | NOTIOFCHAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/009_oleObject87.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 3550 | 39 | 16 | Notification of Change from Vendor |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section 1) Initiation (to be completed by Initiator) | Inferred from PDF text | Needs Human Confirmation |
| 2 | R & D | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section 2) Assessment | Inferred from PDF text | Needs Human Confirmation |
| 4 | Verification Status | Inferred from PDF text | Needs Human Confirmation |
| 5 | approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | For Approval notification:- | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section 3) Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section 4 Status | Inferred from PDF text | Needs Human Confirmation |
| 9 | Withdrawn | Inferred from PDF text | Needs Human Confirmation |
| 10 | Pur- 18/181024/02 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Qahod | Inferred from PDF text | Needs Human Confirmation |
| 12 | Mailing List (Section 4) | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Vendor Change Num | ChgNum | Text | 1 | Parsed from PDF text |
| 2 | Type of Material | VCARCat | Choice/Text | 1 | Parsed from PDF text |
| 3 | Submitted for evaluation | SubmitEval | Text | 1 | Parsed from PDF text |
| 4 | To capture team required | sel1 | Text | 1 | Parsed from PDF text |
| 5 | No of team required | TotalList | Number/Text | 1 | Parsed from PDF text |
| 6 | Verification Status | txtStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 7 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 8 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 9 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 10 | Comment | txtComQAC_1 | Multiline Text | 1 | Parsed from PDF text |
| 11 | Masterlist Updated | MasterlistUpd | Date/Text | 1 | Parsed from PDF text |
| 12 | MER No. | MERNo | Number/Text | 1 | Parsed from PDF text |
| 13 | CC | SendCC | Text | 1 | Parsed from PDF text |
| 14 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 16 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 17 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |
| 18 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 19 | DocAuthor | DocAuthor | Text | 1 | Parsed from PDF text |
| 20 | Created Date | CDate | Date/Text | 1 | Parsed from PDF text |
| 21 | VRN No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 22 | Editor 1 - Initiation | Editor1 | Text | 1 | Parsed from PDF text |
| 23 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 24 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 25 | Editor Final | Editor4 | Text | 1 | Parsed from PDF text |
| 26 | QA Personnel | QAPersonnel | Text | 1 | Parsed from PDF text |
| 27 | QA Manager | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 28 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 29 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 30 | PUR Admin | PURAdmin | Text | 1 | Parsed from PDF text |
| 31 | Def Mailing List | DefCCMails | Text | 1 | Parsed from PDF text |
| 32 | Mailing List all | MailingList | Text | 1 | Parsed from PDF text |
| 33 | Mailing List (Section 4) | MailingList_1 | Text | 1 | Parsed from PDF text |
| 34 | Assessments Emails | EditorAssessment | Text | 1 | Parsed from PDF text |
| 35 | Mailing list of PIC (Assessment) | AssessMails | Person/Text | 1 | Parsed from PDF text |
| 36 | Reminder for assess | AssessDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Reminder sent | ReminderSent | Text | 1 | Parsed from PDF text |
| 38 | Next Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 39 | Reminder to pending Approvers | RemPdgApp | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (5), approval (4), approved (2), hod (2), submitted (1), verification (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `NOTIOFCHAN`
Child-list recommendation: `MainDB_PUR_Ext_NOTIOFCHAN_Rows` candidate for repeating row fields

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
| MASTER-221-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-221-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-221-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 39 |
| Workflow Signal Count | 16 |
| Notes | - |
