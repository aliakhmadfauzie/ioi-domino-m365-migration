# Master App PDF Source - Stock Item Cancellation

> Master row: 336 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 336 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Stock Item Cancellation | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| IMS Related \| PHBSVR | Source inventory |
| Form List | ItemCode6 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCITEMCANC | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/011_oleObject45.pdf | Extracted embedded PDF | text_match_medium | 0.500 | Explicit mapping | 7 | 4394 | 110 | 17 | Requestor's Section: |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Requestor's Section: | Inferred from PDF text | Needs Human Confirmation |
| 2 | Stock Item Inclusion Form | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Uom | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Mod | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mod2 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Total Holding Cost > Rm5000.00, Will Be Approved By Operations | Inferred from PDF text | Needs Human Confirmation |
| 7 | Division Head. | Inferred from PDF text | Needs Human Confirmation |
| 8 | Head of Division's Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Head of Finance Approval | Inferred from PDF text | Needs Human Confirmation |
| 10 | Mrp 1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Mrp 2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Mrp 3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Series Number | Dept; RefNo | Text | 1 | Parsed from PDF text |
| 2 | Series Number | SerNum | Text | 1 | Parsed from PDF text |
| 3 | Date Issued | DateIssued | Date/Text | 1 | Parsed from PDF text |
| 4 | Requested By | Requestor | Person/Text | 1 | Parsed from PDF text |
| 5 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 6 | Department | DeptName | Person/Text | 1 | Parsed from PDF text |
| 7 | Contact Number | ExtNo | Text | 1 | Parsed from PDF text |
| 8 | Material Name | ItemName | Person/Text | 1 | Parsed from PDF text |
| 9 | Material Description | ItemDesc | Multiline Text | 1 | Parsed from PDF text |
| 10 | Unit of Measurement(UOM) | UOM | Text | 1 | Parsed from PDF text |
| 11 | Technical Object | EntityNum | Text | 1 | Parsed from PDF text |
| 12 | item? | StockItemRep | Text | 1 | Parsed from PDF text |
| 13 | material code? | CancelMatCode | Text | 1 | Parsed from PDF text |
| 14 | SICF No. | SICFNo | Number/Text | 1 | Parsed from PDF text |
| 15 | Justification | Remark | Multiline Text | 1 | Parsed from PDF text |
| 16 | Current Stock Quantity | CurrQty | Number/Text | 1 | Parsed from PDF text |
| 17 | Reorder point | MinStock | Text | 1 | Parsed from PDF text |
| 18 | Maximum Stock | MaxStock | Text | 1 | Parsed from PDF text |
| 19 | Average usage | AverageUsage | Text | 1 | Parsed from PDF text |
| 20 | Material Usage | MatUsage | Text | 1 | Parsed from PDF text |
| 21 | MRP View | MOD | Text | 1 | Parsed from PDF text |
| 22 | MRP View | MOD2 | Text | 1 | Parsed from PDF text |
| 23 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 24 | Head of Department | HODName | Person/Text | 1 | Parsed from PDF text |
| 25 | Head of Process Owner | HODNameP | Person/Text | 1 | Parsed from PDF text |
| 26 | Head of Department (MTN) | HODNameM | Person/Text | 1 | Parsed from PDF text |
| 27 | Head of Division | DIVName | Person/Text | 1 | Parsed from PDF text |
| 28 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 29 | Total Cost Count | TotalCostCount | Number/Text | 1 | Parsed from PDF text |
| 30 | Sourced By | SourcedBy | Text | 1 | Parsed from PDF text |
| 31 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 32 | Remarks/Attachment | RemarksBuyer | Multiline Text | 1 | Parsed from PDF text |
| 33 | Comments | HODComments | Person/Text | 1 | Parsed from PDF text |
| 34 | Status | statusapp1 | Choice/Text | 1 | Parsed from PDF text |
| 35 | Name | COOApp_1 | Person/Text | 1 | Parsed from PDF text |
| 36 | Date | COODate_1 | Date/Text | 1 | Parsed from PDF text |
| 37 | Comments | COOComments_1 | Multiline Text | 1 | Parsed from PDF text |
| 38 | Status | COOAppStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 39 | Name | PURApp | Person/Text | 1 | Parsed from PDF text |
| 40 | Date | PURDateApp | Date/Text | 1 | Parsed from PDF text |
| 41 | Comments | PURComment | Multiline Text | 1 | Parsed from PDF text |
| 42 | Status | PURAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 43 | Name | FINApp | Person/Text | 1 | Parsed from PDF text |
| 44 | Date | FINDateApp | Date/Text | 1 | Parsed from PDF text |
| 45 | Comments | FINComments | Multiline Text | 1 | Parsed from PDF text |
| 46 | Status | FINAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 47 | Name | COOApp | Person/Text | 1 | Parsed from PDF text |
| 48 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 49 | Comments | COOComments | Multiline Text | 1 | Parsed from PDF text |
| 50 | Status | COOAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 51 | Date Rejected | DateRejPur | Date/Text | 1 | Parsed from PDF text |
| 52 | Remarks | RemPur | Multiline Text | 1 | Parsed from PDF text |
| 53 | PUR Executive | PurExec | Text | 1 | Parsed from PDF text |
| 54 | Status | StatusSent | Choice/Text | 1 | Parsed from PDF text |
| 55 | Updated By | UpdatedBy | Date/Text | 1 | Parsed from PDF text |
| 56 | Date Updated | UpdatedDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Created By | PURCreate | Text | 1 | Parsed from PDF text |
| 58 | Date Created | PURCreated | Date/Text | 1 | Parsed from PDF text |
| 59 | Material Code | MatCode | Text | 1 | Parsed from PDF text |
| 60 | Remarks | PURRemarks | Multiline Text | 1 | Parsed from PDF text |
| 61 | PR Created | PRDone | Text | 1 | Parsed from PDF text |
| 62 | Created By | StoreCreated | Text | 1 | Parsed from PDF text |
| 63 | Date Created | StoreDate | Date/Text | 1 | Parsed from PDF text |
| 64 | Remarks | StoreRemarks | Multiline Text | 1 | Parsed from PDF text |
| 65 | Comments | CommentsInitiator | Multiline Text | 1 | Parsed from PDF text |
| 66 | Status | DisStatus | Choice/Text | 1 | Parsed from PDF text |
| 67 | Attachment | DisAtt | Text | 1 | Parsed from PDF text |
| 68 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 69 | Done by | DisDone | Text | 1 | Parsed from PDF text |
| 70 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 71 | PURStaff | PURStaff | Text | 1 | Parsed from PDF text |
| 72 | StoreStaff - Not ECM | StoreStaff | Text | 1 | Parsed from PDF text |
| 73 | StoreStaff - ECM | StoreStaff_ECM | Text | 1 | Parsed from PDF text |
| 74 | Store section owner | StoreOwner | Text | 1 | Parsed from PDF text |
| 75 | Mat HOD | ICM | Person/Text | 1 | Parsed from PDF text |
| 76 | ECM App | ECMApp | Text | 1 | Parsed from PDF text |
| 77 | PURHOD | GMName | Person/Text | 1 | Parsed from PDF text |
| 78 | MTN Staff | MTNStaff | Text | 1 | Parsed from PDF text |
| 79 | FINName | FINHODName | Person/Text | 1 | Parsed from PDF text |
| 80 | EDName | COO | Person/Text | 1 | Parsed from PDF text |
| 81 | Buyer List | Store | Text | 1 | Parsed from PDF text |
| 82 | MailingList1 | MailingList1 | Text | 1 | Parsed from PDF text |
| 83 | MailingList2 | MailingList2 | Text | 1 | Parsed from PDF text |
| 84 | MailingList3 | MailingList3 | Text | 1 | Parsed from PDF text |
| 85 | MailingList4 | MailList4 | Text | 1 | Parsed from PDF text |
| 86 | Final Notification | MailingList4 | Text | 1 | Parsed from PDF text |
| 87 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 88 | Form Admin (Owner) | FormAdmin | Text | 1 | Parsed from PDF text |
| 89 | AEditor 1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 90 | AEditor 2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 91 | AEditor 2a | AEditor2a | Text | 1 | Parsed from PDF text |
| 92 | AEditor 2b | AEditor2b | Text | 1 | Parsed from PDF text |
| 93 | AEditor 3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 94 | AEditor 3a | AEditor3a | Text | 1 | Parsed from PDF text |
| 95 | AEditor 4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 96 | AEditor 5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 97 | AEditor 6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 98 | AEditor 7 | AEditor7 | Text | 1 | Parsed from PDF text |
| 99 | AEditor 8 | AEditor8 | Text | 1 | Parsed from PDF text |
| 100 | HOD | RemDate1 | Date/Text | 1 | Parsed from PDF text |
| 101 | DIV | RemDate2 | Date/Text | 1 | Parsed from PDF text |
| 102 | GM | RemDate3 | Date/Text | 1 | Parsed from PDF text |
| 103 | FIN HOD | RemDate4 | Date/Text | 1 | Parsed from PDF text |
| 104 | ED | RemDate5 | Date/Text | 1 | Parsed from PDF text |
| 105 | RCC for Reminder | RemCC | Text | 1 | Parsed from PDF text |
| 106 | BCC for reminders | BCC | Text | 1 | Parsed from PDF text |
| 107 | Estimated Cost | EstCost | Number/Text | 1 | Parsed from PDF text |
| 108 | Total Cost | TotalCost | Number/Text | 1 | Parsed from PDF text |
| 109 | End flow | EndFlow | Text | 1 | Parsed from PDF text |
| 110 | Running No. | Year | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (7), hod (4), approval (2), currentaction (2), approved (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STOCITEMCANC`
Child-list recommendation: `MainDB_STR_Ext_STOCITEMCANC_Rows` candidate for repeating row fields

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
| MASTER-336-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-336-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-336-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 110 |
| Workflow Signal Count | 17 |
| Notes | - |
