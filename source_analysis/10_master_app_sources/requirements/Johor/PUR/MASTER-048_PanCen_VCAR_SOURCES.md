# Master App PDF Source - PanCen - VCAR

> Master row: 48 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 48 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - VCAR | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | NewChangeVendor - Form \| VCAR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VCAR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/007_oleObject73.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 3379 | 28 | 19 | Pancen Notification of Change from Vendor |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/009_oleObject75.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 8 | 4979 | 128 | 32 | VENDOR CORRECTIVE ACTION REPORT (VCAR) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section 1 - Initiation (to be completed by Initiator) | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 3 | R & D | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section 2 - Assessment | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verification Status | Inferred from PDF text | Needs Human Confirmation |
| 6 | Status of Req'd approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | For Approval Notification :- | Inferred from PDF text | Needs Human Confirmation |
| 8 | Log Hod | Inferred from PDF text | Needs Human Confirmation |
| 9 | Prod Hod | Inferred from PDF text | Needs Human Confirmation |
| 10 | Mkt Hod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section 3 - Approval | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section 4 - Status | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Vendor Change Num | ChgNum | Text | 1 | Parsed from PDF text |
| 2 | Company | CompName | Person/Text | 1 | Parsed from PDF text |
| 3 | Department | PUR | Text | 1 | Parsed from PDF text |
| 4 | Name/Description of Material | txtMatDescription | Person/Text | 1 | Parsed from PDF text |
| 5 | Type of Material | VCARCat | Choice/Text | 1 | Parsed from PDF text |
| 6 | Name | nmRequestor | Person/Text | 1 | Parsed from PDF text |
| 7 | Date | dtRequestDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Remarks | txtRequestorRemarks | Person/Text | 1 | Parsed from PDF text |
| 9 | To capture team required | sel1 | Text | 1 | Parsed from PDF text |
| 10 | No of team required | TotalList | Number/Text | 1 | Parsed from PDF text |
| 11 | Verification Status | txtStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 12 | Status of Req'd approval | TotalCount; If; QA | Number/Text | 1 | Parsed from PDF text |
| 13 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 14 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 15 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 16 | Comment | txtComLOGC_1 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Comment | txtComProdC_1 | Multiline Text | 1 | Parsed from PDF text |
| 18 | Comment | txtComMKTC_1 | Multiline Text | 1 | Parsed from PDF text |
| 19 | Comment | txtComQAC_1 | Multiline Text | 1 | Parsed from PDF text |
| 20 | HiddenStatus | StatusLOG | Choice/Text | 1 | Parsed from PDF text |
| 21 | HiddenStatus | StatusProd | Choice/Text | 1 | Parsed from PDF text |
| 22 | HiddenStatus | StatusMKT | Choice/Text | 1 | Parsed from PDF text |
| 23 | HiddenStatus | StatusQA | Choice/Text | 1 | Parsed from PDF text |
| 24 | CC | SendCC | Text | 1 | Parsed from PDF text |
| 25 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 27 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 28 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |
| 29 | VCAR NO | VCARNo | Text | 1 | Parsed from PDF text |
| 30 | Date Initiated | DateSent | Date/Text | 1 | Parsed from PDF text |
| 31 | Vendor Name | VenName | Person/Text | 1 | Parsed from PDF text |
| 32 | Issued By | Requestor1 | Person/Text | 1 | Parsed from PDF text |
| 33 | Dept/Section | Dept | Text | 1 | Parsed from PDF text |
| 34 | CC | CC | Text | 1 | Parsed from PDF text |
| 35 | Head of Div/Dept/Sect | HOD | Person/Text | 1 | Parsed from PDF text |
| 36 | Item Description | ItemDesc | Multiline Text | 1 | Parsed from PDF text |
| 37 | Purchase Order No | PONo | Text | 1 | Parsed from PDF text |
| 38 | Delivery Order No | DONo | Text | 1 | Parsed from PDF text |
| 39 | Category | VCARCat | Choice/Text | 1 | Parsed from PDF text |
| 40 | Non-Conformance | NCDesc | Text | 1 | Parsed from PDF text |
| 41 | where applicable | Attachment1 | Text | 1 | Parsed from PDF text |
| 42 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 43 | Related | FS | Text | 1 | Parsed from PDF text |
| 44 | Safety, Health & Environment | SHE | Text | 1 | Parsed from PDF text |
| 45 | Name | DivHead | Person/Text | 1 | Parsed from PDF text |
| 46 | Date Verified | DateVerified | Date/Text | 1 | Parsed from PDF text |
| 47 | Comments | HODComments | Person/Text | 1 | Parsed from PDF text |
| 48 | Status | VeriStatus | Choice/Text | 1 | Parsed from PDF text |
| 49 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 50 | Name | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 51 | Date | QADate | Date/Text | 1 | Parsed from PDF text |
| 52 | Comments | QAComment | Multiline Text | 1 | Parsed from PDF text |
| 53 | Status | QAStatus | Choice/Text | 1 | Parsed from PDF text |
| 54 | Name | FINHOD | Person/Text | 1 | Parsed from PDF text |
| 55 | Date | FINDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Comments | FINComment | Multiline Text | 1 | Parsed from PDF text |
| 57 | Status | FINStatus | Choice/Text | 1 | Parsed from PDF text |
| 58 | PUR Staff (DLP) | DLPStaff | Text | 1 | Parsed from PDF text |
| 59 | Name | SHEHOD | Person/Text | 1 | Parsed from PDF text |
| 60 | Date | SHEDate | Date/Text | 1 | Parsed from PDF text |
| 61 | Comments | SHEComment | Multiline Text | 1 | Parsed from PDF text |
| 62 | Status | SHEStatus | Choice/Text | 1 | Parsed from PDF text |
| 63 | Vendor Name | DisVenName | Person/Text | 1 | Parsed from PDF text |
| 64 | To respond | RespondBy | Text | 1 | Parsed from PDF text |
| 65 | Reminder date (No reply received) | NextReminder | Date/Text | 1 | Parsed from PDF text |
| 66 | date) | NextReminder1 | Date/Text | 1 | Parsed from PDF text |
| 67 | VCAR Reply Received Date | ReceivedDate | Date/Text | 1 | Parsed from PDF text |
| 68 | Notified Requestor on | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 69 | Notified by | DLPPIC | Person/Text | 1 | Parsed from PDF text |
| 70 | Attachment | PURAtt | Text | 1 | Parsed from PDF text |
| 71 | Remark | VCARRemark | Multiline Text | 1 | Parsed from PDF text |
| 72 | Cause | Cause | Text | 1 | Parsed from PDF text |
| 73 | Acceptance | SHEAccept; By; SHEHODName | Person/Text | 1 | Parsed from PDF text |
| 74 | Date | SHEAcceptDate | Date/Text | 1 | Parsed from PDF text |
| 75 | Remarks | SHERemarks | Multiline Text | 1 | Parsed from PDF text |
| 76 | Review By | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 77 | Date | AcceptDate | Date/Text | 1 | Parsed from PDF text |
| 78 | Acceptance | Acceptance | Text | 1 | Parsed from PDF text |
| 79 | Acceptable | AcceptCA | Text | 1 | Parsed from PDF text |
| 80 | Comments | ReqComments | Multiline Text | 1 | Parsed from PDF text |
| 81 | Attachment | SecAttachment | Text | 1 | Parsed from PDF text |
| 82 | Remark | PurRemark | Multiline Text | 1 | Parsed from PDF text |
| 83 | Attachment | PurAttach | Text | 1 | Parsed from PDF text |
| 84 | Acceptance | PURAccept; By; PURHOD | Person/Text | 1 | Parsed from PDF text |
| 85 | Date | PURAcceptDate | Date/Text | 1 | Parsed from PDF text |
| 86 | Remarks | PURRemarks | Multiline Text | 1 | Parsed from PDF text |
| 87 | Name | PCQIName | Person/Text | 1 | Parsed from PDF text |
| 88 | Date | PCQIDate | Date/Text | 1 | Parsed from PDF text |
| 89 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 90 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 91 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 92 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 93 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 94 | Verified on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 95 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 96 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 97 | Verified by | VerifiedBy_1_1 | Person/Text | 1 | Parsed from PDF text |
| 98 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 99 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 100 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 101 | AuthorsList | AuthorsList | Text | 1 | Parsed from PDF text |
| 102 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 103 | QA Manager | QAMgr | Text | 1 | Parsed from PDF text |
| 104 | SGM | SGM | Text | 1 | Parsed from PDF text |
| 105 | SHE Manager | SHEMgr | Text | 1 | Parsed from PDF text |
| 106 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 107 | ISG Administrators | ISGAdmin | Text | 1 | Parsed from PDF text |
| 108 | WhoCanRead | WhoCanRead | Text | 1 | Parsed from PDF text |
| 109 | PURHOD Name | PurHODName | Person/Text | 1 | Parsed from PDF text |
| 110 | PUR Admin | PUR | Text | 1 | Parsed from PDF text |
| 111 | PUR Coordinator | PURPIC | Person/Text | 1 | Parsed from PDF text |
| 112 | QA Mailing List | QAMail | Text | 1 | Parsed from PDF text |
| 113 | PCN Purchasing | PCNPUR | Text | 1 | Parsed from PDF text |
| 114 | PUR Mailing List | PURMail | Text | 1 | Parsed from PDF text |
| 115 | PCQI Status | PCQIStatus | Choice/Text | 1 | Parsed from PDF text |
| 116 | PCQI App | PCQIAPP | Text | 1 | Parsed from PDF text |
| 117 | PCQI | PCQI | Text | 1 | Parsed from PDF text |
| 118 | PCQI Purchasing | PCQI1 | Text | 1 | Parsed from PDF text |
| 119 | PCQI Oleo | PCQI2 | Text | 1 | Parsed from PDF text |
| 120 | PCQI Edible | PCQI3 | Text | 1 | Parsed from PDF text |
| 121 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 122 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 123 | AEditor2a | AEditor2a | Text | 1 | Parsed from PDF text |
| 124 | AEditor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 125 | AEditor3a | AEditor3a | Text | 1 | Parsed from PDF text |
| 126 | AEditor3b | AEditor3b | Text | 1 | Parsed from PDF text |
| 127 | AEditor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 128 | AEditor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 129 | AEditor6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 130 | AEditor6a | AEditor6a | Text | 1 | Parsed from PDF text |
| 131 | HOD | HOD1 | Person/Text | 1 | Parsed from PDF text |
| 132 | HOD Reject | FirstTime | Person/Text | 1 | Parsed from PDF text |
| 133 | Req Reject | SecondTime | Date/Text | 1 | Parsed from PDF text |
| 134 | increment 5days after due datea | increment1 | Date/Text | 1 | Parsed from PDF text |
| 135 | increment 3 days | increment3 | Text | 1 | Parsed from PDF text |
| 136 | Rejection database | SendTo | Date/Text | 1 | Parsed from PDF text |
| 137 | To lock the Imp | LockSection1 | Text | 1 | Parsed from PDF text |
| 138 | To lock the Eff | LockSection2 | Text | 1 | Parsed from PDF text |
| 139 | CA Status | CAStatus | Choice/Text | 1 | Parsed from PDF text |
| 140 | Actual DueDate | ActualDate | Date/Text | 1 | Parsed from PDF text |
| 141 | NewAcceptDate | NewAcceptDate | Date/Text | 1 | Parsed from PDF text |
| 142 | ActualDate | PURHODDate | Date/Text | 1 | Parsed from PDF text |
| 143 | NewDateReview | NewDateReview | Date/Text | 1 | Parsed from PDF text |
| 144 | Reminder Date (10th day) | Reminder1 | Date/Text | 1 | Parsed from PDF text |
| 145 | Reminder Date (15th day) | Reminder2 | Date/Text | 1 | Parsed from PDF text |
| 146 | Reminder Date (Inititor's HOD) | HODRemDate | Date/Text | 1 | Parsed from PDF text |
| 147 | Reminder date (QA) | QARemDate | Date/Text | 1 | Parsed from PDF text |
| 148 | Reminder date (SHE) | SHERemDate | Date/Text | 1 | Parsed from PDF text |
| 149 | Reminder date (FIN) | FINRemDate | Date/Text | 1 | Parsed from PDF text |
| 150 | Reminder date (Ooi & Lim) | OoiRemDate | Date/Text | 1 | Parsed from PDF text |
| 151 | Reminder date (PCQI) | PCQIRemDate | Date/Text | 1 | Parsed from PDF text |
| 152 | MailingList 1 | Mail1 | Text | 1 | Parsed from PDF text |
| 153 | MailingList2 | Mail2 | Text | 1 | Parsed from PDF text |
| 154 | MailingList3 | Mail3 | Text | 1 | Parsed from PDF text |
| 155 | MailingList4 | Mail4 | Text | 1 | Parsed from PDF text |
| 156 | VCAR No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (14), approval (9), hod (7), verified (7), reject (3), currentaction (3), approver (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VCAR`
Child-list recommendation: `MainDB_PUR_Ext_VCAR_Rows` candidate for repeating row fields

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
| MASTER-048-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-048-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-048-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 156 |
| Workflow Signal Count | 51 |
| Notes | - |
