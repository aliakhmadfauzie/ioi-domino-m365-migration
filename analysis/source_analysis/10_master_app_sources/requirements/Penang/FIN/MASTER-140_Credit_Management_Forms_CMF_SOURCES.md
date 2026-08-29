# Master App PDF Source - Credit Management Forms (CMF)

> Master row: 140 | Site: Penang | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 140 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Credit Management Forms (CMF) | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | Fin | Source inventory |
| Form List | Appendix B - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CMF_A;CMF_B;CMF_C | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | manual_mapping_needed | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Fin/003_oleObject6.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 4 | 2008 | 55 | 16 | Appendix B |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Temporary Credit Limit Change | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Mkthod | Inferred from PDF text | Needs Human Confirmation |
| 3 | approval after two consecutive TCLC (6 months). | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mktfa | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mktfe | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Mktsn | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Fin | Inferred from PDF text | Needs Human Confirmation |

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
| 40 | Marketing - FE | MKTFE | Text | 1 | Parsed from PDF text |
| 41 | Marketing - SN | MKTSN | Text | 1 | Parsed from PDF text |
| 42 | Marketing | MKT | Text | 1 | Parsed from PDF text |
| 43 | ED | ED | Text | 1 | Parsed from PDF text |
| 44 | IT | IT | Text | 1 | Parsed from PDF text |
| 45 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 46 | Account | FLimit | Text | 1 | Parsed from PDF text |
| 47 | Editor 1 - DocAuthor | Editor1 | Text | 1 | Parsed from PDF text |
| 48 | Editor 2 - MKT HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 49 | Editor 2 - MKT AGM | Editor2a | Text | 1 | Parsed from PDF text |
| 50 | Editor 3 - FIN | Editor3 | Text | 1 | Parsed from PDF text |
| 51 | Editor 4 - ED | Editor4 | Text | 1 | Parsed from PDF text |
| 52 | Editor 5 - FIN | Editor5 | Text | 1 | Parsed from PDF text |
| 53 | Mail List | MailList | Text | 1 | Parsed from PDF text |
| 54 | INO | Year; INO | Text | 1 | Parsed from PDF text |
| 55 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (5), approve (5), submitted (1), approval (1), review (1), rejected (1), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CMF_A`
Child-list recommendation: `MainDB_FIN_Ext_CMF_A_Rows` candidate for repeating row fields

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
| MASTER-140-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-140-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-140-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 55 |
| Workflow Signal Count | 16 |
| Notes | - |
