# Master App PDF Source - PanCen - Insurance Claim

> Master row: 4 | Site: Johor | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 4 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Insurance Claim | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | FINANCE \| PCNSVR | Source inventory |
| Form List | Appendix B - Form \| Appendix C - Form \| frmInsClaim - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | INSUCLAI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/FINANCE/003_oleObject11.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 5 | 2037 | 56 | 17 | Appendix B |
| source/Project Iventories/extracted-embedded-pdfs/Johor/FINANCE/004_oleObject12.pdf | Extracted embedded PDF | text_match_high | 0.375 | Explicit mapping | 7 | 3789 | 42 | 14 | Appendix C |
| source/Project Iventories/extracted-embedded-pdfs/Johor/FINANCE/005_oleObject13.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 1430 | 52 | 19 | INSURANCE CLAIM FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Temporary Credit Limit Change Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Mkthod | Inferred from PDF text | Needs Human Confirmation |
| 3 | approval after two consecutive TCLC (6 months). | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mktfa | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mktsn | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Fin | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Finhod | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 10 | Review Of Customers On Credit | Inferred from PDF text | Needs Human Confirmation |
| 11 | Sap Id | Inferred from PDF text | Needs Human Confirmation |
| 12 | Insurance Claim Form | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Form No. | CAFNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Date | DateInitiated | Date/Text | 1 | Parsed from PDF text |
| 5 | Customer Number (SAP) | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 6 | Executive In Charge | MKTExec | Text | 1 | Parsed from PDF text |
| 7 | Approved Credit Limit | Currency_7; AppCreditLimit_1 | Person/Text | 1 | Parsed from PDF text |
| 8 | Increase/(Decrease) | Currency_1; TemCreditLimit | Text | 1 | Parsed from PDF text |
| 9 | Total Credit Limit | Currency_2; TotCreditLimit | Number/Text | 1 | Parsed from PDF text |
| 10 | Payment Terms | PaymentTerms | Text | 1 | Parsed from PDF text |
| 11 | Total Receivables | Currency_3; TotRec | Number/Text | 1 | Parsed from PDF text |
| 12 | Open Delivery Credit | Currency_4; OpenDelCredit | Text | 1 | Parsed from PDF text |
| 13 | Sales Value | Currency_5; SalesVal | Text | 1 | Parsed from PDF text |
| 14 | Credit Insurance Ref | CreditInsRef | Text | 1 | Parsed from PDF text |
| 15 | Limit | Currency_6; Limit | Text | 1 | Parsed from PDF text |
| 16 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 17 | Marketing Manager | MKTHOD | Person/Text | 1 | Parsed from PDF text |
| 18 | Name | MKTName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | MKTDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remark | MKTRem | Multiline Text | 1 | Parsed from PDF text |
| 21 | Name | GMName | Person/Text | 1 | Parsed from PDF text |
| 22 | Date | GMDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Remark | GMRem | Multiline Text | 1 | Parsed from PDF text |
| 24 | Name | FMName | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | FMDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Conversion Rate | CRate | Number/Text | 1 | Parsed from PDF text |
| 27 | Remark | FMRem | Multiline Text | 1 | Parsed from PDF text |
| 28 | Attachment | FMAtt | Text | 1 | Parsed from PDF text |
| 29 | Name | EDName | Person/Text | 1 | Parsed from PDF text |
| 30 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Remark | EDRem | Multiline Text | 1 | Parsed from PDF text |
| 32 | Approved Credit Limit | Currency; AppCreditLimit | Person/Text | 1 | Parsed from PDF text |
| 33 | Rejected to | Denial | Text | 1 | Parsed from PDF text |
| 34 | Name | FMName2 | Person/Text | 1 | Parsed from PDF text |
| 35 | Date | FMDate2 | Date/Text | 1 | Parsed from PDF text |
| 36 | TCLC Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Remark | FMRem2 | Multiline Text | 1 | Parsed from PDF text |
| 38 | Attachment | FMAtt2 | Text | 1 | Parsed from PDF text |
| 39 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 40 | Marketing - FA | MKTFA | Text | 1 | Parsed from PDF text |
| 41 | Marketing - SN | MKTSN | Text | 1 | Parsed from PDF text |
| 42 | Marketing | MKT | Text | 1 | Parsed from PDF text |
| 43 | ED | ED | Text | 1 | Parsed from PDF text |
| 44 | IT | IT | Text | 1 | Parsed from PDF text |
| 45 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 46 | Finance Head | FINHOD | Person/Text | 1 | Parsed from PDF text |
| 47 | Account | FLimit | Text | 1 | Parsed from PDF text |
| 48 | Editor 1 - DocAuthor | Editor1 | Text | 1 | Parsed from PDF text |
| 49 | Editor 2 - MKT HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 50 | Editor 2 - MKT AGM | Editor2a | Text | 1 | Parsed from PDF text |
| 51 | Editor 3 - FIN | Editor3 | Text | 1 | Parsed from PDF text |
| 52 | Editor 4 - ED | Editor4 | Text | 1 | Parsed from PDF text |
| 53 | Editor 5 - FIN | Editor5 | Text | 1 | Parsed from PDF text |
| 54 | Mail List | MailList | Text | 1 | Parsed from PDF text |
| 55 | INO | INO | Text | 1 | Parsed from PDF text |
| 56 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Date of Review | DateReview | Date/Text | 1 | Parsed from PDF text |
| 58 | charge | MKTExec | Text | 1 | Parsed from PDF text |
| 59 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 60 | Position | MKTPost | Text | 1 | Parsed from PDF text |
| 61 | DocAuthor | Editor1 | Text | 1 | Parsed from PDF text |
| 62 | Editor 2- MKT HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 63 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 64 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 65 | Employee No | EmpNo | Text | 1 | Parsed from PDF text |
| 66 | Department | Department | Text | 1 | Parsed from PDF text |
| 67 | Incident Date | InDate | Date/Text | 1 | Parsed from PDF text |
| 68 | Total Incidental Loss | RM | Number/Text | 1 | Parsed from PDF text |
| 69 | Brief of Incident Report | IncidentReport | Text | 1 | Parsed from PDF text |
| 70 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 71 | Attachments/Photos | Attachments | Text | 1 | Parsed from PDF text |
| 72 | Submitted By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 73 | Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 74 | Status | HODApp | Person/Text | 1 | Parsed from PDF text |
| 75 | HOD Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 76 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 77 | Remarks | HODRem | Person/Text | 1 | Parsed from PDF text |
| 78 | List of required documents | ReqDoc | Text | 1 | Parsed from PDF text |
| 79 | Name | FinVerName | Person/Text | 1 | Parsed from PDF text |
| 80 | Date | FinVerDate | Date/Text | 1 | Parsed from PDF text |
| 81 | Remarks | FinVerRem | Multiline Text | 1 | Parsed from PDF text |
| 82 | Required documents | ReplyAttach | Text | 1 | Parsed from PDF text |
| 83 | Reply By | ReplyBy | Text | 1 | Parsed from PDF text |
| 84 | Reply Date | ReplyDate | Date/Text | 1 | Parsed from PDF text |
| 85 | Remarks | ReplyRem | Multiline Text | 1 | Parsed from PDF text |
| 86 | Status | FINApp | Choice/Text | 1 | Parsed from PDF text |
| 87 | Name | FinName | Person/Text | 1 | Parsed from PDF text |
| 88 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 89 | Remarks | FinRem | Multiline Text | 1 | Parsed from PDF text |
| 90 | Status | HODApp2 | Person/Text | 1 | Parsed from PDF text |
| 91 | HOD Name | HODAppName | Person/Text | 1 | Parsed from PDF text |
| 92 | Date | HODAppDate | Date/Text | 1 | Parsed from PDF text |
| 93 | Remarks | HODAppRem | Person/Text | 1 | Parsed from PDF text |
| 94 | Status | FinStatus | Choice/Text | 1 | Parsed from PDF text |
| 95 | Name | FinComName | Person/Text | 1 | Parsed from PDF text |
| 96 | Date | FinComDate | Date/Text | 1 | Parsed from PDF text |
| 97 | Attachments | FinAttch | Text | 1 | Parsed from PDF text |
| 98 | Remarks | FinComRem | Multiline Text | 1 | Parsed from PDF text |
| 99 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 100 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 101 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 102 | Editor2 - HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 103 | Editor3 - FIN | Editor3 | Text | 1 | Parsed from PDF text |
| 104 | Editor4 - Initiator | Editor4 | Text | 1 | Parsed from PDF text |
| 105 | Editor5 - FIN | Editor5 | Text | 1 | Parsed from PDF text |
| 106 | Editor7 - FIN | Editor7 | Text | 1 | Parsed from PDF text |
| 107 | Editor7 - FIN | Editor8 | Text | 1 | Parsed from PDF text |
| 108 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 109 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 110 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 111 | FM | FM | Text | 1 | Parsed from PDF text |
| 112 | FC | FC | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approve (10), hod (10), approved (8), review (5), approval (4), status (4), ca (3), submitted (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `INSUCLAI`
Child-list recommendation: `MainDB_FIN_Ext_INSUCLAI_Rows` candidate for repeating row fields

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
| MASTER-004-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-004-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-004-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 112 |
| Workflow Signal Count | 50 |
| Notes | - |
