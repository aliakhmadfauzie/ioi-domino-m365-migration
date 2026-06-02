# Master App PDF Source - PanCen - Credit Management Forms

> Master row: 3 | Site: Johor | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 3 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Credit Management Forms | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | FINANCE \| PCNSVR | Source inventory |
| Form List | Appendix A - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CMF_A;CMF_B;CMF_C | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | manual_mapping_needed | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/FINANCE/002_oleObject10.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 6 | 2295 | 64 | 17 | Appendix A |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | APPROVAL FOR CREDIT APPLICATION FORM | Inferred from PDF text | Needs Human Confirmation |
| 2 | Cancel | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Coo | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Fin | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Finhod | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Mktfa | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Mktsn | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | No. | CAFNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Application Form No. | PrevCAFNo | Number/Text | 1 | Parsed from PDF text |
| 5 | Date Initiated | DateInitiated | Date/Text | 1 | Parsed from PDF text |
| 6 | Customer Number (SAP) | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 7 | New Account | Status | Choice/Text | 1 | Parsed from PDF text |
| 8 | Reasons | Reasons | Multiline Text | 1 | Parsed from PDF text |
| 9 | Executive In Charge | MKTExec | Text | 1 | Parsed from PDF text |
| 10 | Executive | Currency; CreditLimit | Text | 1 | Parsed from PDF text |
| 11 | Executive | Days | Text | 1 | Parsed from PDF text |
| 12 | (For Existing Customer) | Currency_1; RevCreditLimit | Text | 1 | Parsed from PDF text |
| 13 | Reasons | Reasons2 | Multiline Text | 1 | Parsed from PDF text |
| 14 | Limit | Currency_3; Limit | Text | 1 | Parsed from PDF text |
| 15 | etc) | Attachment | Text | 1 | Parsed from PDF text |
| 16 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 17 | Name | GMName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | GMDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remark | GMRem | Multiline Text | 1 | Parsed from PDF text |
| 20 | Name | FMName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | FMDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remark | FMRem | Multiline Text | 1 | Parsed from PDF text |
| 23 | Attachment | FMAtt | Text | 1 | Parsed from PDF text |
| 24 | Name | FCName | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | FCDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Remark | FCRem | Multiline Text | 1 | Parsed from PDF text |
| 27 | Name | COOName | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 29 | Remark | COORem | Multiline Text | 1 | Parsed from PDF text |
| 30 | Name | EDName | Person/Text | 1 | Parsed from PDF text |
| 31 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Remark | EDRem | Multiline Text | 1 | Parsed from PDF text |
| 33 | Revised Credit Limit | Currency_2; AppCreditLimit | Text | 1 | Parsed from PDF text |
| 34 | Approved Credit Period | Days2 | Person/Text | 1 | Parsed from PDF text |
| 35 | Rejected to | Denial | Text | 1 | Parsed from PDF text |
| 36 | Name | FMName2 | Person/Text | 1 | Parsed from PDF text |
| 37 | Date | FMDate2 | Date/Text | 1 | Parsed from PDF text |
| 38 | Remark | FMRem2 | Multiline Text | 1 | Parsed from PDF text |
| 39 | Attachment | FMAtt2 | Text | 1 | Parsed from PDF text |
| 40 | Cancelled by | CanName | Person/Text | 1 | Parsed from PDF text |
| 41 | Cancelled Date | CanDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Remark | CanRem | Multiline Text | 1 | Parsed from PDF text |
| 43 | Attachment | CanAtt | Text | 1 | Parsed from PDF text |
| 44 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 45 | COO | COO | Text | 1 | Parsed from PDF text |
| 46 | ED | ED | Text | 1 | Parsed from PDF text |
| 47 | IT | IT | Text | 1 | Parsed from PDF text |
| 48 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 49 | Finance Head | FINHOD | Person/Text | 1 | Parsed from PDF text |
| 50 | Marketing - FA | MKTFA | Text | 1 | Parsed from PDF text |
| 51 | Marketing - SN | MKTSN | Text | 1 | Parsed from PDF text |
| 52 | Marketing | MKT | Text | 1 | Parsed from PDF text |
| 53 | Final Limit - New Account | FLimit | Text | 1 | Parsed from PDF text |
| 54 | Account | FLimit2 | Text | 1 | Parsed from PDF text |
| 55 | Editor 1 - DocAuthor | Editor1 | Text | 1 | Parsed from PDF text |
| 56 | Editor 2 - GM | Editor2 | Text | 1 | Parsed from PDF text |
| 57 | Editor 3 - FM | Editor3 | Text | 1 | Parsed from PDF text |
| 58 | Editor 4 - FIN HOD | Editor4 | Person/Text | 1 | Parsed from PDF text |
| 59 | Editor 6 - ED | Editor6 | Text | 1 | Parsed from PDF text |
| 60 | Editor 7 - FIN | Editor7 | Text | 1 | Parsed from PDF text |
| 61 | Editor 8 - FIN | Editor8 | Text | 1 | Parsed from PDF text |
| 62 | Mail List | MailList | Text | 1 | Parsed from PDF text |
| 63 | INO | INO | Text | 1 | Parsed from PDF text |
| 64 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approve (6), approved (5), approval (1), status (1), review (1), rejected (1), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CMF_A`
Child-list recommendation: No child list inferred from parsed field names; confirm during design

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
| MASTER-003-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-003-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-003-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 64 |
| Workflow Signal Count | 17 |
| Notes | - |
