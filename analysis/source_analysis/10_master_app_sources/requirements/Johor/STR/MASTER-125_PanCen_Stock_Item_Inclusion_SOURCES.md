# Master App PDF Source - PanCen - Stock Item Inclusion

> Master row: 125 | Site: Johor | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 125 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Stock Item Inclusion | Clearly Found |
| Owner | STR | Clearly Found |
| Department | STORE \| PCNSVR | Source inventory |
| Form List | ItemCode - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCITEMINCL | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/STORE/004_oleObject87.pdf | Extracted embedded PDF | text_match_medium | 0.500 | Explicit mapping | 8 | 3791 | 86 | 15 | CompanyName |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Item Inclusion Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Uom | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Mod | Inferred from PDF text | Needs Human Confirmation |
| 4 | HO Dept Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | HO Div Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Total Holding Cost>Rm5000.00 Will Be Approved By Coo. | Inferred from PDF text | Needs Human Confirmation |
| 7 | PUR's Head Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | FIN's Head Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Chief Operating Officer's Approval | Inferred from PDF text | Needs Human Confirmation |
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
| 12 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 13 | Reorder point | MinStock | Text | 1 | Parsed from PDF text |
| 14 | (For Auto-P21) | MaxStock | Text | 1 | Parsed from PDF text |
| 15 | Average usage | AverageUsage | Text | 1 | Parsed from PDF text |
| 16 | MRP View | MOD | Text | 1 | Parsed from PDF text |
| 17 | Head of Department | HODName | Person/Text | 1 | Parsed from PDF text |
| 18 | Head of Division | DIVName | Person/Text | 1 | Parsed from PDF text |
| 19 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 20 | Name | DeptApp | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Comments | DeptComments | Multiline Text | 1 | Parsed from PDF text |
| 23 | status | DeptStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Name | appby | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | dateapp | Date/Text | 1 | Parsed from PDF text |
| 26 | Comments | HODComments | Person/Text | 1 | Parsed from PDF text |
| 27 | status | statusapp1 | Choice/Text | 1 | Parsed from PDF text |
| 28 | Total Cost Count | TotalCostCount | Number/Text | 1 | Parsed from PDF text |
| 29 | Sourced By | SourcedBy | Text | 1 | Parsed from PDF text |
| 30 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 31 | Remarks | RemarksBuyer | Multiline Text | 1 | Parsed from PDF text |
| 32 | Name | PURApp | Person/Text | 1 | Parsed from PDF text |
| 33 | Date | PURDateApp | Date/Text | 1 | Parsed from PDF text |
| 34 | Comments | PURComment | Multiline Text | 1 | Parsed from PDF text |
| 35 | status | PURAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 36 | Name | FINApp | Person/Text | 1 | Parsed from PDF text |
| 37 | Date | FINDateApp | Date/Text | 1 | Parsed from PDF text |
| 38 | Comments | FINComments | Multiline Text | 1 | Parsed from PDF text |
| 39 | status | FINAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 40 | Name | COOApp1 | Person/Text | 1 | Parsed from PDF text |
| 41 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 42 | Comments | COOComments | Multiline Text | 1 | Parsed from PDF text |
| 43 | Status | COOAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 44 | Date Rejected | DateRejPur | Date/Text | 1 | Parsed from PDF text |
| 45 | Remarks | RemPur | Multiline Text | 1 | Parsed from PDF text |
| 46 | PUR Executive | PurExec | Text | 1 | Parsed from PDF text |
| 47 | StatusSent | StatusSent | Choice/Text | 1 | Parsed from PDF text |
| 48 | Updated By | UpdatedBy | Date/Text | 1 | Parsed from PDF text |
| 49 | Date Updated | UpdatedDate | Date/Text | 1 | Parsed from PDF text |
| 50 | Created By | PURCreate | Text | 1 | Parsed from PDF text |
| 51 | Date Created | PURCreated | Date/Text | 1 | Parsed from PDF text |
| 52 | Remarks | PURRemarks | Multiline Text | 1 | Parsed from PDF text |
| 53 | PR Created | PRDone | Text | 1 | Parsed from PDF text |
| 54 | Created By | StoreCreated | Text | 1 | Parsed from PDF text |
| 55 | Date Created | StoreDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Remarks | StoreRemarks | Multiline Text | 1 | Parsed from PDF text |
| 57 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 58 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 59 | PURStaff | PURMails | Text | 1 | Parsed from PDF text |
| 60 | StoreStaff | StoreStaff | Text | 1 | Parsed from PDF text |
| 61 | PURHOD | PURHODName | Person/Text | 1 | Parsed from PDF text |
| 62 | MTN Staff | MTNMails | Text | 1 | Parsed from PDF text |
| 63 | FINName | FINHODName | Person/Text | 1 | Parsed from PDF text |
| 64 | COOName | COO | Person/Text | 1 | Parsed from PDF text |
| 65 | MailingList1 | MailingList1 | Text | 1 | Parsed from PDF text |
| 66 | MailingList2 | MailingList2 | Text | 1 | Parsed from PDF text |
| 67 | MailingList3 | MailingList3 | Text | 1 | Parsed from PDF text |
| 68 | Final Notification | MailList4 | Text | 1 | Parsed from PDF text |
| 69 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 70 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 71 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 72 | AEditor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 73 | AEditor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 74 | AEditor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 75 | AEditor6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 76 | AEditor7 | AEditor7 | Text | 1 | Parsed from PDF text |
| 77 | AEditor8 | AEditor8 | Text | 1 | Parsed from PDF text |
| 78 | HOD | RemDate1 | Date/Text | 1 | Parsed from PDF text |
| 79 | DIV | RemDate2 | Date/Text | 1 | Parsed from PDF text |
| 80 | Ang | RemDate3 | Date/Text | 1 | Parsed from PDF text |
| 81 | Khoo | RemDate4 | Date/Text | 1 | Parsed from PDF text |
| 82 | Tan | RemDate5 | Date/Text | 1 | Parsed from PDF text |
| 83 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 84 | Store-PCOC | StorePCOCMails | Text | 1 | Parsed from PDF text |
| 85 | Store-PCEO | StorePCEOMails | Text | 1 | Parsed from PDF text |
| 86 | INO | Year | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (5), status (5), currentaction (2), approved (1), rejected (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STOCITEMINCL`
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
| MASTER-125-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-125-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-125-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 86 |
| Workflow Signal Count | 15 |
| Notes | - |
