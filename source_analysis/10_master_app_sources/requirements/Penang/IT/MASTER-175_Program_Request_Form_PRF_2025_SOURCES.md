# Master App PDF Source - Program Request Form (PRF) 2025

> Master row: 175 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 175 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Program Request Form (PRF) 2025 | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | Program Request Form (PRF) 2025 | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PROGPRF2025 | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/017_oleObject138.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.367 | Embedded metadata fallback needs review | 6 | 4276 | 78 | 18 | PROGRAM REQUEST |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/022_oleObject143.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.033 | Embedded metadata fallback needs review | 2 | 1231 | 32 | 4 | SAP Config Access |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/024_oleObject145.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.033 | Embedded metadata fallback needs review | 5 | 5351 | 68 | 23 | SILO UAT - SIGN OFF FORM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/026_oleObject147.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.033 | Embedded metadata fallback needs review | 4 | 2384 | 64 | 17 | SAP Transport Request Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PROGRAM REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | Request No. : ReqNo | Inferred from PDF text | Needs Human Confirmation |
| 3 | Requestor's Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | *Request type | Inferred from PDF text | Needs Human Confirmation |
| 5 | [Optional] | Inferred from PDF text | Needs Human Confirmation |
| 6 | APPROVAL (Requestor's Section/Div/Dept Head) | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Cc_Isg | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Rfc | Inferred from PDF text | Needs Human Confirmation |
| 10 | Assignment To It (Sales Portal & Abap Developer) | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Abap | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Abap_Cc | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request No. | ReqNo | Number/Text | 1 | Parsed from PDF text |
| 2 | *Requested by | NotesOwner | Text | 1 | Parsed from PDF text |
| 3 | Phone extension No | ExtNo | Text | 1 | Parsed from PDF text |
| 4 | diagram. E.g. Click Here ) | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 5 | Apply changes to | Implementation | Text | 1 | Parsed from PDF text |
| 6 | Acceptance status | status1 | Choice/Text | 1 | Parsed from PDF text |
| 7 | CC | CC1 | Text | 1 | Parsed from PDF text |
| 8 | Date Approved | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 9 | Comments | comments1 | Multiline Text | 1 | Parsed from PDF text |
| 10 | Acceptance status | status2 | Choice/Text | 1 | Parsed from PDF text |
| 11 | CC | CC_ISG | Text | 1 | Parsed from PDF text |
| 12 | development/changes? | RFC | Text | 1 | Parsed from PDF text |
| 13 | Approved by | AppBy_ISG | Person/Text | 1 | Parsed from PDF text |
| 14 | Date Assigned | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 15 | Comments | comments2 | Multiline Text | 1 | Parsed from PDF text |
| 16 | Attachment | TasksAtt | Text | 1 | Parsed from PDF text |
| 17 | ***Attachment (Compulsory) | Attachment_SAP | Text | 1 | Parsed from PDF text |
| 18 | Attached by | AttachedBy | Text | 1 | Parsed from PDF text |
| 19 | Cannot be met) | ITReason | Multiline Text | 1 | Parsed from PDF text |
| 20 | Acceptance status | AcceptStatus_SAP | Choice/Text | 1 | Parsed from PDF text |
| 21 | Assigned to | ABAP | Text | 1 | Parsed from PDF text |
| 22 | CC | ABAP_CC | Text | 1 | Parsed from PDF text |
| 23 | Outsource | Outcource | Text | 1 | Parsed from PDF text |
| 24 | Functional owner | FuncOwner_SAP | Text | 1 | Parsed from PDF text |
| 25 | Approved by | AppBy_SAP | Person/Text | 1 | Parsed from PDF text |
| 26 | Date Assigned | dateapp2_1 | Date/Text | 1 | Parsed from PDF text |
| 27 | Comments | comments2_1 | Multiline Text | 1 | Parsed from PDF text |
| 28 | Type | NotesType | Choice/Text | 1 | Parsed from PDF text |
| 29 | Actual Completion date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 30 | Status | status3 | Choice/Text | 1 | Parsed from PDF text |
| 31 | Date Released for testing | TestingDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Date TR num released in IED | IEDDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Comments | comments3 | Multiline Text | 1 | Parsed from PDF text |
| 34 | Program Name | ProgName | Person/Text | 1 | Parsed from PDF text |
| 35 | Table Name | TableName | Person/Text | 1 | Parsed from PDF text |
| 36 | Test Data | TestData | Text | 1 | Parsed from PDF text |
| 37 | Validation Data | Validation | Text | 1 | Parsed from PDF text |
| 38 | Remarks | ISRemark | Multiline Text | 1 | Parsed from PDF text |
| 39 | Remarks | Remarks_ISG | Multiline Text | 1 | Parsed from PDF text |
| 40 | Notified Date | DateISG | Date/Text | 1 | Parsed from PDF text |
| 41 | Notified By | NotifiedBy | Text | 1 | Parsed from PDF text |
| 42 | Acceptance status | status4 | Choice/Text | 1 | Parsed from PDF text |
| 43 | serve you better. | comment1 | Multiline Text | 1 | Parsed from PDF text |
| 44 | Acceptance date | dateapp4 | Date/Text | 1 | Parsed from PDF text |
| 45 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 46 | Test Data | TestData_1 | Text | 1 | Parsed from PDF text |
| 47 | Validation Data | Validation_1 | Text | 1 | Parsed from PDF text |
| 48 | Remarks | ReqRemark | Multiline Text | 1 | Parsed from PDF text |
| 49 | Remarks | ITRemark | Multiline Text | 1 | Parsed from PDF text |
| 50 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 51 | IT Staff | ISGStaff | Text | 1 | Parsed from PDF text |
| 52 | IT Recipients | ISGRecipients | Text | 1 | Parsed from PDF text |
| 53 | Mailing List | NotifyAll | Text | 1 | Parsed from PDF text |
| 54 | Clare | Clare | Text | 1 | Parsed from PDF text |
| 55 | Cindy) | ismgr2 | Text | 1 | Parsed from PDF text |
| 56 | IT SAP CC | ITSAPCC | Text | 1 | Parsed from PDF text |
| 57 | IT Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 58 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 59 | Editor1a | AEditor1a | Text | 1 | Parsed from PDF text |
| 60 | Requestor Acceptance | AEditor1_1 | Person/Text | 1 | Parsed from PDF text |
| 61 | Editor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 62 | Editor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 63 | Editor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 64 | Editor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 65 | Editor6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 66 | Editor7 | AEditor7 | Text | 1 | Parsed from PDF text |
| 67 | Editor 8 | AEditor8 | Text | 1 | Parsed from PDF text |
| 68 | Display Functional Name | ConvertName | Person/Text | 1 | Parsed from PDF text |
| 69 | Display name in Pdg Func completion | FuncOwnerName | Person/Text | 1 | Parsed from PDF text |
| 70 | PCN QA | PCNQA | Text | 1 | Parsed from PDF text |
| 71 | Requestor OU | OU | Person/Text | 1 | Parsed from PDF text |
| 72 | Reminder To - Only for pending testing | RemTo | Text | 1 | Parsed from PDF text |
| 73 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 74 | Reminder CC SAP | RemCC2 | Text | 1 | Parsed from PDF text |
| 75 | Hide 'Notify' when RFC empty | RFCDone | Text | 1 | Parsed from PDF text |
| 76 | Date Completion | DateCompletion | Date/Text | 1 | Parsed from PDF text |
| 77 | Date Assigned | DateAssign | Date/Text | 1 | Parsed from PDF text |
| 78 | Req No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 79 | Form Num | ReqNum | Text | 1 | Parsed from PDF text |
| 80 | System ID | Client | Text | 1 | Parsed from PDF text |
| 81 | Client Num | ClientNum | Text | 1 | Parsed from PDF text |
| 82 | SAP Notes Number | RefDoc | Text | 1 | Parsed from PDF text |
| 83 | Purpose | Purpose | Text | 1 | Parsed from PDF text |
| 84 | Changes to be done | ChangesDone | Text | 1 | Parsed from PDF text |
| 85 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 86 | Functional Owner | CCFuncOwner | Text | 1 | Parsed from PDF text |
| 87 | Requested By | RequestedBy | Text | 1 | Parsed from PDF text |
| 88 | Date submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 89 | Comments | ReqComments | Multiline Text | 1 | Parsed from PDF text |
| 90 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 91 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 92 | Date Withdrawn | WDDate | Date/Text | 1 | Parsed from PDF text |
| 93 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 94 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 95 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 96 | Req No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 97 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 98 | Ms. Khor & Ung - Transporter | Transporter | Text | 1 | Parsed from PDF text |
| 99 | Mailing List - CC & Transporter | MailA | Text | 1 | Parsed from PDF text |
| 100 | IT Manager | ITPIC | Person/Text | 1 | Parsed from PDF text |
| 101 | IT Manager (Kelly) | ITPIC2 | Person/Text | 1 | Parsed from PDF text |
| 102 | Mailing List - CC | MailCCAll | Text | 1 | Parsed from PDF text |
| 103 | Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 104 | Section B (Main) | Editor2 | Text | 1 | Parsed from PDF text |
| 105 | Section C | Editor3 | Text | 1 | Parsed from PDF text |
| 106 | Section D | Editor4 | Text | 1 | Parsed from PDF text |
| 107 | Reminder to Requestor | RemReqStart | Person/Text | 1 | Parsed from PDF text |
| 108 | Reminder to BASIS Admin | RemAdminStart | Text | 1 | Parsed from PDF text |
| 109 | Client | Client | Text | 1 | Parsed from PDF text |
| 110 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 111 | Module | ModuleName | Person/Text | 1 | Parsed from PDF text |
| 112 | Reference (SSR/CR/PRF) | RefName | Person/Text | 1 | Parsed from PDF text |
| 113 | Attachment | ITRemAttach | Text | 1 | Parsed from PDF text |
| 114 | TR Number Reference (link) | TRNumber | Text | 1 | Parsed from PDF text |
| 115 | Remarks | SAPRemarks | Multiline Text | 1 | Parsed from PDF text |
| 116 | CC | CCEmail | Text | 1 | Parsed from PDF text |
| 117 | 1st Key User | KU1_SILO | Text | 1 | Parsed from PDF text |
| 118 | 2nd Key User (optional) | KU2_SILO | Text | 1 | Parsed from PDF text |
| 119 | 3rd Key User (optional) | KU3_SILO | Text | 1 | Parsed from PDF text |
| 120 | 4th Key User (optional) | KU4_SILO | Text | 1 | Parsed from PDF text |
| 121 | 5th Key User (optional) | KU5_SILO | Text | 1 | Parsed from PDF text |
| 122 | BPO Approval | BPO1_SILO | Text | 1 | Parsed from PDF text |
| 123 | BPO Approval | BPO2_SILO | Text | 1 | Parsed from PDF text |
| 124 | BPO Approval | BPO3_SILO | Text | 1 | Parsed from PDF text |
| 125 | Submitted by (IT) | ITFuncName | Person/Text | 1 | Parsed from PDF text |
| 126 | Date Submitted | ITSubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 127 | Attachment | KU1Attach_SILO | Text | 1 | Parsed from PDF text |
| 128 | Remarks | KU1Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 129 | Status | LockKU1_SILO | Choice/Text | 1 | Parsed from PDF text |
| 130 | Attachment | KU2Attach_SILO | Text | 1 | Parsed from PDF text |
| 131 | Remarks | KU2Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 132 | Status | LockKU2_SILO | Choice/Text | 1 | Parsed from PDF text |
| 133 | Attachment | KU3Attach_SILO | Text | 1 | Parsed from PDF text |
| 134 | Remarks | KU3Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 135 | Status | LockKU3_SILO | Choice/Text | 1 | Parsed from PDF text |
| 136 | Attachment | KU4Attach_SILO | Text | 1 | Parsed from PDF text |
| 137 | Remarks | KU4Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 138 | Status | LockKU4_SILO | Choice/Text | 1 | Parsed from PDF text |
| 139 | Attachment | KU5Attach_SILO | Text | 1 | Parsed from PDF text |
| 140 | Remarks | KU5Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 141 | Status | LockKU5_SILO | Choice/Text | 1 | Parsed from PDF text |
| 142 | Remarks | BPO1Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 143 | Status | LockBPO1_SILO | Choice/Text | 1 | Parsed from PDF text |
| 144 | Remarks | BPO2Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 145 | Status | LockBPO2_SILO | Choice/Text | 1 | Parsed from PDF text |
| 146 | Remarks | BPO3Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 147 | Status | LockBPO3_SILO | Choice/Text | 1 | Parsed from PDF text |
| 148 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 149 | Running number | Year; INO; RunningNo | Text | 1 | Parsed from PDF text |
| 150 | Requestor | AEditor1 | Person/Text | 1 | Parsed from PDF text |
| 151 | sign off. | AEditor2 | Text | 1 | Parsed from PDF text |
| 152 | Key Users Notification - All | NotifyKeyUsers | Text | 1 | Parsed from PDF text |
| 153 | BPO Notification - All | NotifyBPO | Text | 1 | Parsed from PDF text |
| 154 | CC All | CCAll | Text | 1 | Parsed from PDF text |
| 155 | IT | ISAdmin | Text | 1 | Parsed from PDF text |
| 156 | Editor1: Editor1 , Editor2 : Editor2 , Editor3 : Editor3 , Editor4 : Editor4 , Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 157 | Get required signed off | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 158 | Get signed off status | SignStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 159 | Total Signed off | TotalList | Number/Text | 1 | Parsed from PDF text |
| 160 | Get total Key users signed | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 161 | Final count KU - All app | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 162 | Get BPO count | CountBPO1; CountBPO2; CountBPO3 | Text | 1 | Parsed from PDF text |
| 163 | Total Signed Off BPO | SignStatusBPO1; SignStatusBPO2; SignStatusBPO3 | Number/Text | 1 | Parsed from PDF text |
| 164 | Get total BPO Signed | TotalBPOSelected | Number/Text | 1 | Parsed from PDF text |
| 165 | Get total BPO signed | GetTotalBPO | Number/Text | 1 | Parsed from PDF text |
| 166 | Final count - All app BPO | AllApprovedBPO | Person/Text | 1 | Parsed from PDF text |
| 167 | SendEmailBPO confirmation | SendEmailBPO | Text | 1 | Parsed from PDF text |
| 168 | Reminder date (7 days frm submitted dt) | RemDate | Date/Text | 1 | Parsed from PDF text |
| 169 | Pending key users | RemKeyUsers | Text | 1 | Parsed from PDF text |
| 170 | Pending BPO | RemBPO | Text | 1 | Parsed from PDF text |
| 171 | Get Ref Num | GetRefName | Person/Text | 1 | Parsed from PDF text |
| 172 | Request Num | ReqNum | Text | 1 | Parsed from PDF text |
| 173 | TR Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 174 | Development Type | DevCategory | Choice/Text | 1 | Parsed from PDF text |
| 175 | Phase | Phase | Text | 1 | Parsed from PDF text |
| 176 | Incident | IssueNum | Text | 1 | Parsed from PDF text |
| 177 | Transport Number | TRNumber | Text | 1 | Parsed from PDF text |
| 178 | Dependencies | TRDependant | Text | 1 | Parsed from PDF text |
| 179 | SAP Tcode | Tcode | Text | 1 | Parsed from PDF text |
| 180 | Fiori Apps | RptName | Person/Text | 1 | Parsed from PDF text |
| 181 | Changes done | ChangesDone | Text | 1 | Parsed from PDF text |
| 182 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 183 | Key User | KeyUser | Text | 1 | Parsed from PDF text |
| 184 | Owner | CCFuncOwner | Text | 1 | Parsed from PDF text |
| 185 | Approved status | AppStatus | Person/Text | 1 | Parsed from PDF text |
| 186 | Approved by | AppBy | Person/Text | 1 | Parsed from PDF text |
| 187 | Transport Status | TRStatus | Choice/Text | 1 | Parsed from PDF text |
| 188 | Transported by | TRBy | Text | 1 | Parsed from PDF text |
| 189 | Comments | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 190 | Client | Client_1 | Text | 1 | Parsed from PDF text |
| 191 | Dependencies | TRDependant_1 | Text | 1 | Parsed from PDF text |
| 192 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 193 | have been signed off by | KeyUser_1 | Text | 1 | Parsed from PDF text |
| 194 | to IEP/IBP if any | IEPDate | Date/Text | 1 | Parsed from PDF text |
| 195 | Remarks | UATAtt | Multiline Text | 1 | Parsed from PDF text |
| 196 | Functional Owner | FunctionalOwner_1 | Text | 1 | Parsed from PDF text |
| 197 | Date submitted | DateSubmitted_1 | Date/Text | 1 | Parsed from PDF text |
| 198 | Approved Status | AppStatus_1 | Person/Text | 1 | Parsed from PDF text |
| 199 | Approved by | AppBy_1 | Person/Text | 1 | Parsed from PDF text |
| 200 | Date Approved | dtApproved_1 | Date/Text | 1 | Parsed from PDF text |
| 201 | Comments | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 202 | Transport Status | TRStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 203 | Transported by | TRBy_1 | Text | 1 | Parsed from PDF text |
| 204 | Date Transported | dtTransport_1 | Date/Text | 1 | Parsed from PDF text |
| 205 | Comments | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 206 | Comments | Comment5 | Multiline Text | 1 | Parsed from PDF text |
| 207 | Replacement | Replacement | Text | 1 | Parsed from PDF text |
| 208 | Kelly & Siew - 1stapprovar | FirstApprovar | Text | 1 | Parsed from PDF text |
| 209 | Mailing List - Approve | MailA | Person/Text | 1 | Parsed from PDF text |
| 210 | Mailing List - Transport | MailB | Text | 1 | Parsed from PDF text |
| 211 | Mailing List - Send for Approval | MailC | Text | 1 | Parsed from PDF text |
| 212 | Editor 1 - Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 213 | Editor 2 - Section B (Main) | Editor2 | Text | 1 | Parsed from PDF text |
| 214 | Editor 3 - Section C | Editor3 | Text | 1 | Parsed from PDF text |
| 215 | Editor 4 - Section D | Editor4 | Text | 1 | Parsed from PDF text |
| 216 | Editor 5 - Withdrawal | Editor5 | Text | 1 | Parsed from PDF text |
| 217 | Date Transported | DateTransported | Date/Text | 1 | Parsed from PDF text |
| 218 | Clients | Clients | Text | 1 | Parsed from PDF text |
| 219 | Date Transport | DateTransports | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (27), approved (12), approval (7), submitted (7), currentaction (7), approver (1), approve (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `PROGPRF2025`
Child-list recommendation: `MainDB_IT_Ext_PROGPRF2025_Rows` candidate for repeating row fields

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
| MASTER-175-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-175-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-175-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 219 |
| Workflow Signal Count | 62 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
