# Master App PDF Source - Halal Internal Audit

> Master row: 254 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 254 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Halal Internal Audit | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | frmHalal - Form \| CustQuest - Form \| AuditReport - Form \| FrmAuditPlan - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | INTERN | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/004_oleObject236.pdf | Extracted embedded PDF | text_match_high | 0.770 | Explicit mapping | 2 | 502 | 17 | 2 | Internal Audit Report |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/024_oleObject256.pdf | Extracted embedded PDF | sheet_order_fallback | 0.257 | Explicit mapping | 4 | 1990 | 54 | 4 | companyname (radio buttons) |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/067_oleObject299.pdf | Extracted embedded PDF | text_match_medium | 0.503 | Explicit mapping | 6 | 3370 | 55 | 5 | INTERNAL AUDIT REPORT |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/069_oleObject301.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 3 | 1999 | 62 | 15 | Internal Audit Plan & Schedule |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 2 | Customer Questionnaire | Inferred from PDF text | Needs Human Confirmation |
| 3 | Date Request | Inferred from PDF text | Needs Human Confirmation |
| 4 | request/per customer given | Inferred from PDF text | Needs Human Confirmation |
| 5 | Withdrawn section: | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 7 | Internal Audit Report | Inferred from PDF text | Needs Human Confirmation |
| 8 | Auditee'S Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 9 | Opportunitie | Inferred from PDF text | Needs Human Confirmation |
| 10 | S For | Inferred from PDF text | Needs Human Confirmation |
| 11 | Improvement | Inferred from PDF text | Needs Human Confirmation |
| 12 | Action To | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company Name | CompName | Person/Text | 1 | Parsed from PDF text |
| 2 | Report Number | NotNum | Text | 1 | Parsed from PDF text |
| 3 | Audit Area | AuditArea | Text | 1 | Parsed from PDF text |
| 4 | Audit Date | AuditDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Auditor Name | Auditor | Person/Text | 1 | Parsed from PDF text |
| 6 | Auditee Name | Auditee | Person/Text | 1 | Parsed from PDF text |
| 7 | Auditee's Div/ Dept Head | DivHead | Text | 1 | Parsed from PDF text |
| 8 | CC | CC | Text | 1 | Parsed from PDF text |
| 9 | Auditor Notes & Report | AuditorNotes | Text | 1 | Parsed from PDF text |
| 10 | Non-conformity | NC | Text | 1 | Parsed from PDF text |
| 11 | Auditor comment | AuditorComment | Multiline Text | 1 | Parsed from PDF text |
| 12 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 13 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 14 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 15 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 17 | INO | INO | Text | 1 | Parsed from PDF text |
| 18 | CQ No. | CQNo | Number/Text | 1 | Parsed from PDF text |
| 19 | To | ToAll | Text | 1 | Parsed from PDF text |
| 20 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 21 | Date Request | DateRequest | Date/Text | 1 | Parsed from PDF text |
| 22 | Customer Name | CustomerName | Person/Text | 1 | Parsed from PDF text |
| 23 | Region | Region | Text | 1 | Parsed from PDF text |
| 24 | Agent/Trader | AgentName | Person/Text | 1 | Parsed from PDF text |
| 25 | Product | Product | Text | 1 | Parsed from PDF text |
| 26 | Packaging Type | PackType | Choice/Text | 1 | Parsed from PDF text |
| 27 | Customer Spec code | CustSpecCode | Text | 1 | Parsed from PDF text |
| 28 | Sales Order | SalesOrder | Text | 1 | Parsed from PDF text |
| 29 | Product Application | ProductApp | Text | 1 | Parsed from PDF text |
| 30 | Customer Type | CurrType | Choice/Text | 1 | Parsed from PDF text |
| 31 | deadline) | ResponseBy | Text | 1 | Parsed from PDF text |
| 32 | Questionnaire | Attachment | Text | 1 | Parsed from PDF text |
| 33 | Other Info | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 34 | Attachment | AttachmentFinal | Text | 1 | Parsed from PDF text |
| 35 | Remarks | OtherRemarks | Multiline Text | 1 | Parsed from PDF text |
| 36 | Related Regulation | Regulations | Text | 1 | Parsed from PDF text |
| 37 | Category | CategorySelection | Choice/Text | 1 | Parsed from PDF text |
| 38 | Date returned to Requestor | DateReturned | Date/Text | 1 | Parsed from PDF text |
| 39 | Completed by | CompletedBy | Text | 1 | Parsed from PDF text |
| 40 | Remark / Attachment | AttA | Multiline Text | 1 | Parsed from PDF text |
| 41 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 42 | Change Control Requirement | Requirement | Text | 1 | Parsed from PDF text |
| 43 | Remark / Attachment | AttB | Multiline Text | 1 | Parsed from PDF text |
| 44 | Other Attachments | OtherAtt | Text | 1 | Parsed from PDF text |
| 45 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 47 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 48 | Remarks | WDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 49 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 50 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 51 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 52 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 53 | AEditor 1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 54 | AEditor 2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 55 | AEditor 3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 56 | Marketing user | MKTUser | Text | 1 | Parsed from PDF text |
| 57 | QA User | QAUser | Text | 1 | Parsed from PDF text |
| 58 | QC User | QCUser | Text | 1 | Parsed from PDF text |
| 59 | CC | CCAll | Text | 1 | Parsed from PDF text |
| 60 | Reminder CC Mails | ReplyCCMail | Text | 1 | Parsed from PDF text |
| 61 | ACM | ACMMail | Text | 1 | Parsed from PDF text |
| 62 | DCM | DCMMail | Text | 1 | Parsed from PDF text |
| 63 | AES | AESMail | Text | 1 | Parsed from PDF text |
| 64 | ECM | ECMMail | Text | 1 | Parsed from PDF text |
| 65 | QAMail | QAMail | Text | 1 | Parsed from PDF text |
| 66 | QC Mail | QCMail | Text | 1 | Parsed from PDF text |
| 67 | Reminder Date | ReplyPdgDate | Date/Text | 1 | Parsed from PDF text |
| 68 | ISG Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 69 | QA | QA | Text | 1 | Parsed from PDF text |
| 70 | QC | QC | Text | 1 | Parsed from PDF text |
| 71 | Company | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 72 | Report No. | ReportNo | Number/Text | 1 | Parsed from PDF text |
| 73 | Audit Area | Area | Text | 1 | Parsed from PDF text |
| 74 | Time Start | TimeStart | Text | 1 | Parsed from PDF text |
| 75 | Time End | TimeEnd | Text | 1 | Parsed from PDF text |
| 76 | Auditor | Auditor | Text | 1 | Parsed from PDF text |
| 77 | Auditee | Auditee; AuditeeName | Person/Text | 1 | Parsed from PDF text |
| 78 | Head | AuditeeHOD | Person/Text | 1 | Parsed from PDF text |
| 79 | CC | AudCC | Text | 1 | Parsed from PDF text |
| 80 | text | Checklist | Text | 1 | Parsed from PDF text |
| 81 | **Audit Notes | Notes | Text | 1 | Parsed from PDF text |
| 82 | ty - If any | Nonconformity | Text | 1 | Parsed from PDF text |
| 83 | Comment | AuditorComment | Multiline Text | 1 | Parsed from PDF text |
| 84 | Good Observation | Observation | Text | 1 | Parsed from PDF text |
| 85 | requirements | Compliance | Text | 1 | Parsed from PDF text |
| 86 | Remark | AuditorRem | Multiline Text | 1 | Parsed from PDF text |
| 87 | Auditor | AuditorName | Person/Text | 1 | Parsed from PDF text |
| 88 | Date | AuditorDate | Date/Text | 1 | Parsed from PDF text |
| 89 | Auditee | AuditeeName2 | Person/Text | 1 | Parsed from PDF text |
| 90 | Date | AuditeeDate | Date/Text | 1 | Parsed from PDF text |
| 91 | Acceptance | Acceptance_1 | Text | 1 | Parsed from PDF text |
| 92 | Remark | AuditeeRem | Multiline Text | 1 | Parsed from PDF text |
| 93 | Reviewed By | ReviewedBy | Text | 1 | Parsed from PDF text |
| 94 | Date | ReviewedDate | Date/Text | 1 | Parsed from PDF text |
| 95 | Acceptance | Acceptance | Text | 1 | Parsed from PDF text |
| 96 | Acceptance Comments | AccComments | Multiline Text | 1 | Parsed from PDF text |
| 97 | Withdrawn by | ObsBy | Text | 1 | Parsed from PDF text |
| 98 | Date | ObsDate | Date/Text | 1 | Parsed from PDF text |
| 99 | Reason | ObsReason | Multiline Text | 1 | Parsed from PDF text |
| 100 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 101 | Requestor | DocAuthor | Person/Text | 1 | Parsed from PDF text |
| 102 | Created Date | CDate | Date/Text | 1 | Parsed from PDF text |
| 103 | QA | AllQA | Text | 1 | Parsed from PDF text |
| 104 | SubQA | SubQA | Text | 1 | Parsed from PDF text |
| 105 | SubQA Editor | SubQAEditor | Text | 1 | Parsed from PDF text |
| 106 | SubSHE | SubSHE | Text | 1 | Parsed from PDF text |
| 107 | SubSHE Editor | SubSHEEditor | Text | 1 | Parsed from PDF text |
| 108 | Sub EI | SubEI | Text | 1 | Parsed from PDF text |
| 109 | SubEI Editor | SubEIEditor | Text | 1 | Parsed from PDF text |
| 110 | QA Admin | QAADMIN | Text | 1 | Parsed from PDF text |
| 111 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 112 | EI MGR | EIMGR | Text | 1 | Parsed from PDF text |
| 113 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 114 | IT | IT | Text | 1 | Parsed from PDF text |
| 115 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 116 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 117 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 118 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 119 | Action Plans | APs | Text | 1 | Parsed from PDF text |
| 120 | Action Takens | ATs | Text | 1 | Parsed from PDF text |
| 121 | Whens | Wns | Text | 1 | Parsed from PDF text |
| 122 | Initiate by | IniBy | Text | 1 | Parsed from PDF text |
| 123 | Designation | IniDesg | Text | 1 | Parsed from PDF text |
| 124 | Date | IniDate | Date/Text | 1 | Parsed from PDF text |
| 125 | Verified by | VerBy | Person/Text | 1 | Parsed from PDF text |
| 126 | Designation | VerDesg | Text | 1 | Parsed from PDF text |
| 127 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 128 | Initiate by | IniBy_1 | Text | 1 | Parsed from PDF text |
| 129 | Designation | IniDesg_1 | Text | 1 | Parsed from PDF text |
| 130 | Date | IniDate_1 | Date/Text | 1 | Parsed from PDF text |
| 131 | Verified by | VerBy_1 | Person/Text | 1 | Parsed from PDF text |
| 132 | Designation | VerDesg_1 | Text | 1 | Parsed from PDF text |
| 133 | Date | VerDate_1 | Date/Text | 1 | Parsed from PDF text |
| 134 | Initiate by | IniBy_2 | Text | 1 | Parsed from PDF text |
| 135 | Designation | IniDesg_2 | Text | 1 | Parsed from PDF text |
| 136 | Date | IniDate_2 | Date/Text | 1 | Parsed from PDF text |
| 137 | Verified by | VerBy_2 | Person/Text | 1 | Parsed from PDF text |
| 138 | Designation | VerDesg_2 | Text | 1 | Parsed from PDF text |
| 139 | Date | VerDate_2 | Date/Text | 1 | Parsed from PDF text |
| 140 | Initiate by | IniBy_3 | Text | 1 | Parsed from PDF text |
| 141 | Designation | IniDesg_3 | Text | 1 | Parsed from PDF text |
| 142 | Date | IniDate_3 | Date/Text | 1 | Parsed from PDF text |
| 143 | Verified by | VerBy_3 | Person/Text | 1 | Parsed from PDF text |
| 144 | Designation | VerDesg_3 | Text | 1 | Parsed from PDF text |
| 145 | Date | VerDate_3 | Date/Text | 1 | Parsed from PDF text |
| 146 | Initiate by | IniBy_4 | Text | 1 | Parsed from PDF text |
| 147 | Designation | IniDesg_4 | Text | 1 | Parsed from PDF text |
| 148 | Date | IniDate_4 | Date/Text | 1 | Parsed from PDF text |
| 149 | Verified by | VerBy_4 | Person/Text | 1 | Parsed from PDF text |
| 150 | Designation | VerDesg_4 | Text | 1 | Parsed from PDF text |
| 151 | Date | VerDate_4 | Date/Text | 1 | Parsed from PDF text |
| 152 | Initiate by | IniBy1 | Text | 1 | Parsed from PDF text |
| 153 | Date | IniDate_5 | Date/Text | 1 | Parsed from PDF text |
| 154 | Verified by | VerBy1 | Person/Text | 1 | Parsed from PDF text |
| 155 | Date | VerDate_5 | Date/Text | 1 | Parsed from PDF text |
| 156 | Initiate by | IniBy2 | Text | 1 | Parsed from PDF text |
| 157 | Date | IniDate_6 | Date/Text | 1 | Parsed from PDF text |
| 158 | Verified by | VerBy2 | Person/Text | 1 | Parsed from PDF text |
| 159 | Date | VerDate_6 | Date/Text | 1 | Parsed from PDF text |
| 160 | Initiate by | IniBy3 | Text | 1 | Parsed from PDF text |
| 161 | Date | IniDate_7 | Date/Text | 1 | Parsed from PDF text |
| 162 | Verified by | VerBy3 | Person/Text | 1 | Parsed from PDF text |
| 163 | Date | VerDate_7 | Date/Text | 1 | Parsed from PDF text |
| 164 | Initiate by | IniBy4 | Text | 1 | Parsed from PDF text |
| 165 | Verified by | VerBy4 | Person/Text | 1 | Parsed from PDF text |
| 166 | Date | IniDate_8 | Date/Text | 1 | Parsed from PDF text |
| 167 | Date | VerDate_8 | Date/Text | 1 | Parsed from PDF text |
| 168 | Initiate by | IniBy5 | Text | 1 | Parsed from PDF text |
| 169 | Date | IniDate_9 | Date/Text | 1 | Parsed from PDF text |
| 170 | Verified by | VerBy5 | Person/Text | 1 | Parsed from PDF text |
| 171 | Date | VerDate_9 | Date/Text | 1 | Parsed from PDF text |
| 172 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 173 | Created on | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 174 | IT Admin | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (12), currentaction (3), ca (3), review (2), status (2), rejected (2), hod (1), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `INTERN`
Child-list recommendation: `MainDB_HR_Ext_INTERN_Rows` candidate for repeating row fields

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
| MASTER-254-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-254-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-254-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 4 |
| Parsed Field Count | 174 |
| Workflow Signal Count | 26 |
| Notes | - |
