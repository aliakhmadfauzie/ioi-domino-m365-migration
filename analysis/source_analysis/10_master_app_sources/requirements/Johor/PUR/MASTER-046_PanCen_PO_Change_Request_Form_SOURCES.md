# Master App PDF Source - PanCen - PO Change Request Form

> Master row: 46 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 46 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - PO Change Request Form | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | frmPO - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | POCHAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/008_oleObject74.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1398 | 42 | 13 | PO CHANGE REQUEST FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PO CHANGE REQUEST FORM | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A : TO FILL UP BY REQUESTOR | Inferred from PDF text | Needs Human Confirmation |
| 3 | Po. No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | Po_No | Inferred from PDF text | Needs Human Confirmation |
| 5 | Changes Details | Inferred from PDF text | Needs Human Confirmation |
| 6 | USER VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | section, if user department is the | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION B : FILL UP BY BUYER | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION C : APPROVED BY PUCHASING HOD | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION D : AUTHORISED LIMIT APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pur-26/170624/00 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section A | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | TO; FILL; UP; BY | Number/Text | 1 | Parsed from PDF text |
| 2 | Requestor Name | ReqName | Person/Text | 1 | Parsed from PDF text |
| 3 | CRF No | NotNum | Text | 1 | Parsed from PDF text |
| 4 | Department | ReqDept | Text | 1 | Parsed from PDF text |
| 5 | PO. NO. | PO_NO | Number/Text | 1 | Parsed from PDF text |
| 6 | Revision No | RevNo | Text | 1 | Parsed from PDF text |
| 7 | Date | PODate | Date/Text | 1 | Parsed from PDF text |
| 8 | Supplier Name | SuppName | Person/Text | 1 | Parsed from PDF text |
| 9 | Buyer name | Buyer | Person/Text | 1 | Parsed from PDF text |
| 10 | Changes Details | Changes | Text | 1 | Parsed from PDF text |
| 11 | Requestor) | ReqBy | Person/Text | 1 | Parsed from PDF text |
| 12 | ReqBy | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 13 | HOD | HODName | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | RecDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Remark | RecRem | Multiline Text | 1 | Parsed from PDF text |
| 16 | Prepared By | BuyerName | Person/Text | 1 | Parsed from PDF text |
| 17 | Remark (If any) | BuyerRem | Multiline Text | 1 | Parsed from PDF text |
| 18 | Attachment | Attch | Text | 1 | Parsed from PDF text |
| 19 | Date | BuyerDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Approved By | AppBy | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remark (If any) | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 23 | Approved By | HODApp | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Remark (If any) | HODRem | Person/Text | 1 | Parsed from PDF text |
| 26 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 27 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 28 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 29 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 30 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 31 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 32 | Editor6 | Editor6 | Text | 1 | Parsed from PDF text |
| 33 | Editor7 | Editor7 | Text | 1 | Parsed from PDF text |
| 34 | Send Date | SendDate | Date/Text | 1 | Parsed from PDF text |
| 35 | PUR HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 36 | PUR | PURAdmin | Text | 1 | Parsed from PDF text |
| 37 | PUR 2 | PUR | Text | 1 | Parsed from PDF text |
| 38 | PUR PIC | PurPIC | Person/Text | 1 | Parsed from PDF text |
| 39 | HODs | HODs | Person/Text | 1 | Parsed from PDF text |
| 40 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 41 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 42 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), approved (3), status (2), verification (1), approval (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `POCHAN`
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
| MASTER-046-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-046-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-046-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 42 |
| Workflow Signal Count | 13 |
| Notes | - |
