# Master App PDF Source - Failure Analysis Report

> Master row: 196 | Site: Penang | Owner: MTN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 196 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Failure Analysis Report | Clearly Found |
| Owner | MTN | Clearly Found |
| Department | Maint \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | QM - Form \| FAR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FAILANALREPO | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/003_oleObject28.pdf | Extracted embedded PDF | sheet_order_fallback | 0.005 | Explicit mapping | 2 | 755 | 23 | 2 | Page 1 of 2 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/004_oleObject29.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 12 | 6260 | 51 | 33 | FAILURE ANALYSIS REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. :SNoD (static text) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 6 | Failure Analysis Report | Inferred from PDF text | Needs Human Confirmation |
| 7 | I) Entity Detail | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ii) Troubleshooting | Inferred from PDF text | Needs Human Confirmation |
| 9 | Iii) Possible Causes | Inferred from PDF text | Needs Human Confirmation |
| 10 | Iv) Correction/Corrective Action | Inferred from PDF text | Needs Human Confirmation |
| 11 | Result | Inferred from PDF text | Needs Human Confirmation |
| 12 | Request for Extention :- | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | Section No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 7 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 8 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 9 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 10 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 12 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 13 | QA | QA | Text | 1 | Parsed from PDF text |
| 14 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 15 | CC | CC | Text | 1 | Parsed from PDF text |
| 16 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 17 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 18 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 19 | Maillist for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 20 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 21 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 22 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 23 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 24 | FAR No | FARNo | Text | 1 | Parsed from PDF text |
| 25 | FAR No | Year | Text | 1 | Parsed from PDF text |
| 26 | Company | CompSel | Text | 1 | Parsed from PDF text |
| 27 | Requested by | RequestedBy | Text | 1 | Parsed from PDF text |
| 28 | To Maintenance users | Recipient_MTN | Text | 1 | Parsed from PDF text |
| 29 | Acceptance By | AppName | Person/Text | 1 | Parsed from PDF text |
| 30 | To Production users | Recipient_PROD | Text | 1 | Parsed from PDF text |
| 31 | Acceptance By | AppNameProd | Person/Text | 1 | Parsed from PDF text |
| 32 | Model | Model | Text | 1 | Parsed from PDF text |
| 33 | Criteria | Criteria | Text | 1 | Parsed from PDF text |
| 34 | History of Failure | HistoryFailure | Text | 1 | Parsed from PDF text |
| 35 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 36 | Reason | AppCom | Multiline Text | 1 | Parsed from PDF text |
| 37 | Date Rejected | RejDate | Date/Text | 1 | Parsed from PDF text |
| 38 | Status1 | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 39 | Reason | Reason_1 | Multiline Text | 1 | Parsed from PDF text |
| 40 | Reason | AppCom_1 | Multiline Text | 1 | Parsed from PDF text |
| 41 | DateRejected | RejDate_1 | Date/Text | 1 | Parsed from PDF text |
| 42 | Status1_1 | Status1_1 | Choice/Text | 1 | Parsed from PDF text |
| 43 | Extended Reply Date | NewReplyDateMTN | Date/Text | 1 | Parsed from PDF text |
| 44 | Reason for Extension | ExtReasonMTN | Multiline Text | 1 | Parsed from PDF text |
| 45 | Reason | AppComProd | Multiline Text | 1 | Parsed from PDF text |
| 46 | DateRejected | RejDate_P | Date/Text | 1 | Parsed from PDF text |
| 47 | Status1_P | Status1_P | Choice/Text | 1 | Parsed from PDF text |
| 48 | Reason | AppComProd_1 | Multiline Text | 1 | Parsed from PDF text |
| 49 | DateRejected | RejDate_P_1 | Date/Text | 1 | Parsed from PDF text |
| 50 | Status1_P_1 | Status1_P_1 | Choice/Text | 1 | Parsed from PDF text |
| 51 | Extended Reply Date | NewReplyDatePROD | Date/Text | 1 | Parsed from PDF text |
| 52 | Reason for Extension | ExtReasonPROD | Multiline Text | 1 | Parsed from PDF text |
| 53 | Share To | CC4 | Text | 1 | Parsed from PDF text |
| 54 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 55 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 56 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Conclusion | Conclusion | Text | 1 | Parsed from PDF text |
| 58 | Status | MTNStatus | Choice/Text | 1 | Parsed from PDF text |
| 59 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 60 | Reviewed By | RevBy | Text | 1 | Parsed from PDF text |
| 61 | Date Reviewed | RevDate | Date/Text | 1 | Parsed from PDF text |
| 62 | Share To | CC4_1 | Text | 1 | Parsed from PDF text |
| 63 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 64 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 65 | FollowUp Date | FollowUpDate_1 | Date/Text | 1 | Parsed from PDF text |
| 66 | Conclusion | Conclusion_P | Text | 1 | Parsed from PDF text |
| 67 | Status | PRDStatus | Choice/Text | 1 | Parsed from PDF text |
| 68 | Remarks | Remarks_P | Multiline Text | 1 | Parsed from PDF text |
| 69 | Reviewed By | RevBy_P | Text | 1 | Parsed from PDF text |
| 70 | Date Reviewed | RevDate_P | Date/Text | 1 | Parsed from PDF text |
| 71 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 72 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 73 | Remarks | WDrawnCom | Multiline Text | 1 | Parsed from PDF text |
| 74 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (12), review (7), verified (5), reviewed (4), hod (3), currentaction (2), approval (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MTN`
FormCode: `FAILANALREPO`
Child-list recommendation: `MainDB_MTN_Ext_FAILANALREPO_Rows` candidate for repeating row fields

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
| MASTER-196-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-196-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-196-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 74 |
| Workflow Signal Count | 35 |
| Notes | - |
