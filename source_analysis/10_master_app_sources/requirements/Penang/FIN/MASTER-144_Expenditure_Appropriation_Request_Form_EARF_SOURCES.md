# Master App PDF Source - Expenditure Appropriation Request Form (EARF)

> Master row: 144 | Site: Penang | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 144 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Expenditure Appropriation Request Form (EARF) | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | Fin \| Critical App \| PHBSVR | Source inventory |
| Form List | Appendix C - Form | Source inventory |
| Blueprint Department | FIN | Source inventory |
| Blueprint Code | EARF | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Fin/004_oleObject7.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 5 | 3461 | 43 | 14 | Appendix C |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Review Of Customers On Credit | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Mkthod | Inferred from PDF text | Needs Human Confirmation |
| 3 | Sap Id | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mktfa | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mktfe | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Mktsn | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Fin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Form No. | CAFNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Date of Review | DateReview | Date/Text | 1 | Parsed from PDF text |
| 3 | Company | Company | Text | 1 | Parsed from PDF text |
| 4 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 5 | charge | MKTExec | Text | 1 | Parsed from PDF text |
| 6 | Marketing Manager | MKTHOD | Person/Text | 1 | Parsed from PDF text |
| 7 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 8 | Name | MKTName | Person/Text | 1 | Parsed from PDF text |
| 9 | Date | MKTDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Position | MKTPost | Text | 1 | Parsed from PDF text |
| 11 | Remark | MKTRem | Multiline Text | 1 | Parsed from PDF text |
| 12 | Name | GMName | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | GMDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Remark | GMRem | Multiline Text | 1 | Parsed from PDF text |
| 15 | Name | FMName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | FMDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Conversion Rate | CRate | Number/Text | 1 | Parsed from PDF text |
| 18 | Remark | FMRem | Multiline Text | 1 | Parsed from PDF text |
| 19 | Attachment | FMAtt | Text | 1 | Parsed from PDF text |
| 20 | Name | EDName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remark | EDRem | Multiline Text | 1 | Parsed from PDF text |
| 23 | Name | FMName2 | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | FMDate2 | Date/Text | 1 | Parsed from PDF text |
| 25 | Remark | FMRem2 | Multiline Text | 1 | Parsed from PDF text |
| 26 | Attachment | FMAtt2 | Text | 1 | Parsed from PDF text |
| 27 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 28 | Marketing - FA | MKTFA | Text | 1 | Parsed from PDF text |
| 29 | Marketing - FE | MKTFE | Text | 1 | Parsed from PDF text |
| 30 | Marketing - SN | MKTSN | Text | 1 | Parsed from PDF text |
| 31 | Marketing | MKT | Text | 1 | Parsed from PDF text |
| 32 | ED | ED | Text | 1 | Parsed from PDF text |
| 33 | IT | IT | Text | 1 | Parsed from PDF text |
| 34 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 35 | DocAuthor | Editor1 | Text | 1 | Parsed from PDF text |
| 36 | Editor 2- MKT HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 37 | Editor 2 - MKT AGM | Editor2a | Text | 1 | Parsed from PDF text |
| 38 | Editor 3 - FIN | Editor3 | Text | 1 | Parsed from PDF text |
| 39 | Editor 4 - ED | Editor4 | Text | 1 | Parsed from PDF text |
| 40 | Editor 5 - FIN | Editor5 | Text | 1 | Parsed from PDF text |
| 41 | Mail List | MailList | Text | 1 | Parsed from PDF text |
| 42 | INO | Year; INO | Text | 1 | Parsed from PDF text |
| 43 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approve (5), review (4), approved (2), verified (1), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `EARF`
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
| MASTER-144-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-144-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-144-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 43 |
| Workflow Signal Count | 14 |
| Notes | - |
