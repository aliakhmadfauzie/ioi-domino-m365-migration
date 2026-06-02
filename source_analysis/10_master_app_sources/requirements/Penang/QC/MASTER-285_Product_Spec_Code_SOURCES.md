# Master App PDF Source - Product Spec Code

> Master row: 285 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 285 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Product Spec Code | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewQMv7 - Form \| prdtcodeVer4 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PRODSPECCODE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/018_oleObject189.pdf | Extracted embedded PDF | sheet_order_fallback | 0.255 | Explicit mapping | 3 | 2273 | 37 | 13 | Page 1 of 3 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/029_oleObject200.pdf | Extracted embedded PDF | text_match_high | 0.752 | Explicit mapping | 4 | 2257 | 39 | 10 | title |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 3 | Required Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | : K1 - K2 - K4 - K9 - K3 - K6 - K7 - K8 | Inferred from PDF text | Needs Human Confirmation |
| 5 | approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 7 | Qa(Pic) | Inferred from PDF text | Needs Human Confirmation |
| 8 | Requestor's Section | Inferred from PDF text | Needs Human Confirmation |
| 9 | Qcd-60/060322/00 | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 2 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 3 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 4 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 5 | Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 6 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 7 | Pending for App | K1; K2; K4; K9 | Text | 1 | Parsed from PDF text |
| 8 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 9 | Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 10 | Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 11 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 12 | Pending App | PdgApp | Text | 1 | Parsed from PDF text |
| 13 | CC | QANames | Person/Text | 1 | Parsed from PDF text |
| 14 | Approvers | App1 | Person/Text | 1 | Parsed from PDF text |
| 15 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 16 | Document Title | DocTitle | Text | 1 | Parsed from PDF text |
| 17 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 18 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 19 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 20 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 21 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 22 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 23 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 24 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 26 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 27 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 28 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 29 | QA | QA | Text | 1 | Parsed from PDF text |
| 30 | QA(PIC) | QA2 | Person/Text | 1 | Parsed from PDF text |
| 31 | QC | QC | Text | 1 | Parsed from PDF text |
| 32 | IT | IT | Text | 1 | Parsed from PDF text |
| 33 | Mail List for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 34 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 35 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 36 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 37 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 38 | No. | PSCNo | Number/Text | 1 | Parsed from PDF text |
| 39 | No. | PSCNoACM | Number/Text | 1 | Parsed from PDF text |
| 40 | Attachment | ProAtt | Text | 1 | Parsed from PDF text |
| 41 | Date prepared | predate | Date/Text | 1 | Parsed from PDF text |
| 42 | Date verified | veridate | Date/Text | 1 | Parsed from PDF text |
| 43 | Date | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 44 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 45 | Date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 46 | Comment | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 47 | Comment | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 48 | Comment | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 49 | status | statusapp1 | Choice/Text | 1 | Parsed from PDF text |
| 50 | Reminder date | ExtDateMKT | Date/Text | 1 | Parsed from PDF text |
| 51 | status | statusapp2 | Choice/Text | 1 | Parsed from PDF text |
| 52 | Reminder date | ExtDatePRD | Date/Text | 1 | Parsed from PDF text |
| 53 | status | statusapp3 | Choice/Text | 1 | Parsed from PDF text |
| 54 | Reminder date | ExtDateQC | Date/Text | 1 | Parsed from PDF text |
| 55 | Notified date | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Notified by | NotifiedBy | Text | 1 | Parsed from PDF text |
| 57 | Special Remarks | SpecialRemarks | Multiline Text | 1 | Parsed from PDF text |
| 58 | Status | DisStatus | Choice/Text | 1 | Parsed from PDF text |
| 59 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 60 | Done by | DisDone | Text | 1 | Parsed from PDF text |
| 61 | Creation date | CDate | Date/Text | 1 | Parsed from PDF text |
| 62 | ApprovalParties | All | Text | 1 | Parsed from PDF text |
| 63 | MKT App | MKTApp | Text | 1 | Parsed from PDF text |
| 64 | Chemist Name | CreatedBy | Person/Text | 1 | Parsed from PDF text |
| 65 | PSC No. | Year; Month; INO; BA | Number/Text | 1 | Parsed from PDF text |
| 66 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 67 | ISAdmin | ISADMIN | Text | 1 | Parsed from PDF text |
| 68 | AEditor | AEditor1 | Text | 1 | Parsed from PDF text |
| 69 | QC Chemist | Chemists | Text | 1 | Parsed from PDF text |
| 70 | ISG Name (reminder) | ISGName | Person/Text | 1 | Parsed from PDF text |
| 71 | Reset Rejection Status | ResetRejStatus | Choice/Text | 1 | Parsed from PDF text |
| 72 | Acceptance Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 73 | Final Mailing List | MailList | Text | 1 | Parsed from PDF text |
| 74 | Company conversion | CompName | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (11), approval (4), approved (4), verified (2), rejected (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `PRODSPECCODE`
Child-list recommendation: `MainDB_QC_Ext_PRODSPECCODE_Rows` candidate for repeating row fields

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
| MASTER-285-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-285-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-285-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 74 |
| Workflow Signal Count | 23 |
| Notes | - |
