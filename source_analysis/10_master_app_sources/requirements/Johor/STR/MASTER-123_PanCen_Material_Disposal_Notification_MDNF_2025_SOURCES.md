# Master App PDF Source - PanCen - Material Disposal Notification (MDNF) 2025

> Master row: 123 | Site: Johor | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 123 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Material Disposal Notification (MDNF) 2025 | Clearly Found |
| Owner | STR | Clearly Found |
| Department | STORE \| PCNSVR | Source inventory |
| Form List | MDNF - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MATEDISPNOTI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/STORE/001_oleObject84.pdf | Extracted embedded PDF | text_match_high | 0.751 | Explicit mapping | 8 | 5429 | 146 | 28 | PANCEN MATERIAL DISPOSAL NOTIFICATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pancen Material Disposal Notification | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section 1: To be filled by Requestor | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section 2: Head Of Department Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section 3: Finance Verification | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Section 4: To be filled by Purchasing | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Gst | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section 5: Purchasing Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section 5A: Chief Operating Officer Approval | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section 6: Finance Approval | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section 8: Chief Operating Officer Approval | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section 9: Store Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No | NotNum | Text | 1 | Parsed from PDF text |
| 2 | Material Type | MType | Choice/Text | 1 | Parsed from PDF text |
| 3 | Material To Be Disposed | MaterialName | Person/Text | 1 | Parsed from PDF text |
| 4 | disposed | MatDesc | Text | 1 | Parsed from PDF text |
| 5 | Fire & other Hazard potential | Hazard | Text | 1 | Parsed from PDF text |
| 6 | Estimated Quantity | Qty | Number/Text | 1 | Parsed from PDF text |
| 7 | Estimated Weight | EstWeight; Alert | Text | 1 | Parsed from PDF text |
| 8 | Location/Tank | Location | Text | 1 | Parsed from PDF text |
| 9 | Usable Value | PM | Text | 1 | Parsed from PDF text |
| 10 | Department | Department | Text | 1 | Parsed from PDF text |
| 11 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 12 | current date and time) | Attachment | Date/Text | 1 | Parsed from PDF text |
| 13 | Department Head | AppName | Person/Text | 1 | Parsed from PDF text |
| 14 | CC | CCName | Person/Text | 1 | Parsed from PDF text |
| 15 | Name | PreBy | Person/Text | 1 | Parsed from PDF text |
| 16 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 17 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Status | StatusApp1 | Choice/Text | 1 | Parsed from PDF text |
| 19 | Name | ReqBy1 | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | ReqDate1 | Date/Text | 1 | Parsed from PDF text |
| 21 | Comment | ReqComment1 | Multiline Text | 1 | Parsed from PDF text |
| 22 | Material Type | MaterialType | Choice/Text | 1 | Parsed from PDF text |
| 23 | Status | FinVerStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Name | FinVerBy | Person/Text | 1 | Parsed from PDF text |
| 25 | Remarks | FinRemarks | Multiline Text | 1 | Parsed from PDF text |
| 26 | Date | FinVerDate | Date/Text | 1 | Parsed from PDF text |
| 27 | CC to | CC1 | Text | 1 | Parsed from PDF text |
| 28 | Mode Of Transaction | TransactionMode | Text | 1 | Parsed from PDF text |
| 29 | Estimated Weight | EstWeightP; WUnit | Text | 1 | Parsed from PDF text |
| 30 | Actual Selling Price/unit | RM; Desc; Unit3 | Number/Text | 1 | Parsed from PDF text |
| 31 | Total Selling Price | RM; SellingPrice; Alert3; Alert4 | Number/Text | 1 | Parsed from PDF text |
| 32 | Collection Charges/unit | RM; Charges; Unit4 | Text | 1 | Parsed from PDF text |
| 33 | Total Collection Charges | RM; CollCharges; Alert5; Alert6 | Number/Text | 1 | Parsed from PDF text |
| 34 | applicable) | GST | Text | 1 | Parsed from PDF text |
| 35 | Buyer Name | BuyerName | Person/Text | 1 | Parsed from PDF text |
| 36 | Terms of Payment | Payment | Text | 1 | Parsed from PDF text |
| 37 | Collector PIC | RemarksB | Person/Text | 1 | Parsed from PDF text |
| 38 | Justification | JustificationP | Multiline Text | 1 | Parsed from PDF text |
| 39 | Name | PrePurBy | Person/Text | 1 | Parsed from PDF text |
| 40 | Designation | PrePurDesg | Text | 1 | Parsed from PDF text |
| 41 | Date | PrePurDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Quotation | QT | Text | 1 | Parsed from PDF text |
| 43 | Comment | PrePurComment | Multiline Text | 1 | Parsed from PDF text |
| 44 | Attachment | BAttachment | Text | 1 | Parsed from PDF text |
| 45 | Status | PurStatus | Choice/Text | 1 | Parsed from PDF text |
| 46 | Name | PurBy | Person/Text | 1 | Parsed from PDF text |
| 47 | Date | PurDate | Date/Text | 1 | Parsed from PDF text |
| 48 | Comment | PurComment | Multiline Text | 1 | Parsed from PDF text |
| 49 | Status | CooStatusA | Choice/Text | 1 | Parsed from PDF text |
| 50 | Name | CooByA | Person/Text | 1 | Parsed from PDF text |
| 51 | Date | CooDateA | Date/Text | 1 | Parsed from PDF text |
| 52 | Comment | CooCommentA | Multiline Text | 1 | Parsed from PDF text |
| 53 | Status | FinStatus | Choice/Text | 1 | Parsed from PDF text |
| 54 | Name | FinBy | Person/Text | 1 | Parsed from PDF text |
| 55 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Comment | FinComment | Multiline Text | 1 | Parsed from PDF text |
| 57 | Status | CooStatus | Choice/Text | 1 | Parsed from PDF text |
| 58 | Name | CooBy | Person/Text | 1 | Parsed from PDF text |
| 59 | Date | CooDate | Date/Text | 1 | Parsed from PDF text |
| 60 | Comment | CooComment | Multiline Text | 1 | Parsed from PDF text |
| 61 | Material | Material4 | Text | 1 | Parsed from PDF text |
| 62 | Status | STVerStatus | Choice/Text | 1 | Parsed from PDF text |
| 63 | Name | STVerBy | Person/Text | 1 | Parsed from PDF text |
| 64 | Date | STVerDate | Date/Text | 1 | Parsed from PDF text |
| 65 | Comment | STVerComment | Multiline Text | 1 | Parsed from PDF text |
| 66 | Completion Status | QCStatus | Choice/Text | 1 | Parsed from PDF text |
| 67 | Completed by | QCBy | Text | 1 | Parsed from PDF text |
| 68 | Date | QCDate | Date/Text | 1 | Parsed from PDF text |
| 69 | Remarks | QCRemarks | Multiline Text | 1 | Parsed from PDF text |
| 70 | CC to | CC2 | Text | 1 | Parsed from PDF text |
| 71 | Completion Status | StoreStatus | Choice/Text | 1 | Parsed from PDF text |
| 72 | Acknowledged by | StoreBy | Text | 1 | Parsed from PDF text |
| 73 | Date | StoreDate | Date/Text | 1 | Parsed from PDF text |
| 74 | Remarks | AccRemarks1 | Multiline Text | 1 | Parsed from PDF text |
| 75 | Completion Status | AccStatus | Choice/Text | 1 | Parsed from PDF text |
| 76 | Completed by | AccBy | Text | 1 | Parsed from PDF text |
| 77 | Date | AccDate | Date/Text | 1 | Parsed from PDF text |
| 78 | Remarks | AccRem | Multiline Text | 1 | Parsed from PDF text |
| 79 | Actual Weight | ActWeight; Alert2 | Text | 1 | Parsed from PDF text |
| 80 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 81 | Send by | PurSendBy | Text | 1 | Parsed from PDF text |
| 82 | Date | PurSendDate | Date/Text | 1 | Parsed from PDF text |
| 83 | Status | COOAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 84 | Remarks | CooRemarks10 | Multiline Text | 1 | Parsed from PDF text |
| 85 | Send by | COOAppName | Person/Text | 1 | Parsed from PDF text |
| 86 | Date | COOAppDate | Date/Text | 1 | Parsed from PDF text |
| 87 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 88 | Withdrawn By | PerformedBy | Text | 1 | Parsed from PDF text |
| 89 | Withdrawn Date | PerformedDate | Date/Text | 1 | Parsed from PDF text |
| 90 | DocAuthor | DocAuthor | Text | 1 | Parsed from PDF text |
| 91 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 92 | KIV | KIV; KIVDate | Date/Text | 1 | Parsed from PDF text |
| 93 | Section 1 (Editor 1) | Editor1 | Text | 1 | Parsed from PDF text |
| 94 | Section 2 (Editor 2) | Editor2 | Text | 1 | Parsed from PDF text |
| 95 | Section 3 (Editor 3) - FIN | Editor3 | Text | 1 | Parsed from PDF text |
| 96 | Section 4 (Editor 4) - PUR | Editor4 | Text | 1 | Parsed from PDF text |
| 97 | Section 5 (Editor 5) - PUR HOD | Editor5 | Person/Text | 1 | Parsed from PDF text |
| 98 | Section 5a (Editor 5a) - COO | Editor5a | Text | 1 | Parsed from PDF text |
| 99 | Section 6 (Editor 6) - FIN HOD | Editor6 | Person/Text | 1 | Parsed from PDF text |
| 100 | Section 7 (Editor 7) - GM | Editor7 | Text | 1 | Parsed from PDF text |
| 101 | Section 8 (Editor 8) - COO | Editor8 | Text | 1 | Parsed from PDF text |
| 102 | Section 9 (Editor 9) - Store Ver | Editor9 | Text | 1 | Parsed from PDF text |
| 103 | Section 10 (Editor 10) - QC | Editor10 | Text | 1 | Parsed from PDF text |
| 104 | Section 11 (Editor 11) - STORE | Editor11 | Text | 1 | Parsed from PDF text |
| 105 | Section 12 (Editor 12) - ACC | Editor12 | Text | 1 | Parsed from PDF text |
| 106 | Section 13 (Editor 13) - Initiator | Editor13 | Text | 1 | Parsed from PDF text |
| 107 | Section 14 (Editor 14) - COO | Editor14 | Text | 1 | Parsed from PDF text |
| 108 | Section 15 (Editor 15) - Withdrawal | Editor15 | Text | 1 | Parsed from PDF text |
| 109 | Approval Date | TA; AppDate | Date/Text | 1 | Parsed from PDF text |
| 110 | 2nd Attachments | TA2; TACT | Text | 1 | Parsed from PDF text |
| 111 | Scrap Value | ScrapValue | Text | 1 | Parsed from PDF text |
| 112 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 113 | Notes Admin | IT | Text | 1 | Parsed from PDF text |
| 114 | Notification No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 115 | GM | SGM | Text | 1 | Parsed from PDF text |
| 116 | COO | COO | Text | 1 | Parsed from PDF text |
| 117 | Purchasing Mailing List | PUR | Text | 1 | Parsed from PDF text |
| 118 | Purchasing Backup CC | PURBK | Text | 1 | Parsed from PDF text |
| 119 | QC | QC | Text | 1 | Parsed from PDF text |
| 120 | QC 1 | QC1 | Text | 1 | Parsed from PDF text |
| 121 | QC 2 | QC2 | Text | 1 | Parsed from PDF text |
| 122 | FINANCE | FIN | Text | 1 | Parsed from PDF text |
| 123 | Store | STORE | Text | 1 | Parsed from PDF text |
| 124 | AR | AR | Text | 1 | Parsed from PDF text |
| 125 | ACC | ACC | Text | 1 | Parsed from PDF text |
| 126 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 127 | PIC HOD | PICHOD | Person/Text | 1 | Parsed from PDF text |
| 128 | PIC CC | PICCC | Person/Text | 1 | Parsed from PDF text |
| 129 | Mailing List | SendToAll | Date/Text | 1 | Parsed from PDF text |
| 130 | Mailing List 1 | SendToAll1 | Date/Text | 1 | Parsed from PDF text |
| 131 | Mailing List 2 | SendToAll2 | Date/Text | 1 | Parsed from PDF text |
| 132 | Mailing List 3 | SendToAll3 | Date/Text | 1 | Parsed from PDF text |
| 133 | Mailing List 4 | SendToAll4 | Date/Text | 1 | Parsed from PDF text |
| 134 | Mailing List 5 | SendToAll5 | Date/Text | 1 | Parsed from PDF text |
| 135 | Mailing List 6 | SendToAll6 | Date/Text | 1 | Parsed from PDF text |
| 136 | Mailing List 7 | SendToAll7 | Date/Text | 1 | Parsed from PDF text |
| 137 | Mailing List 8 | SendToAll8 | Date/Text | 1 | Parsed from PDF text |
| 138 | Mailing List 9 | SendToAll9 | Date/Text | 1 | Parsed from PDF text |
| 139 | Hide Section B1 | DivApp | Text | 1 | Parsed from PDF text |
| 140 | Hide Selling Price | HideSellPrice | Number/Text | 1 | Parsed from PDF text |
| 141 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 142 | Def CC | DefCC | Text | 1 | Parsed from PDF text |
| 143 | To Display Rich Text in View | TextForView | Text | 1 | Parsed from PDF text |
| 144 | Reminder COO - Date | RemCOO | Date/Text | 1 | Parsed from PDF text |
| 145 | Document ID | DocId | Text | 1 | Parsed from PDF text |
| 146 | Web URL | WebURL | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (11), approval (9), hod (3), approved (2), verification (1), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `MATEDISPNOTI`
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
| MASTER-123-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-123-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-123-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 146 |
| Workflow Signal Count | 28 |
| Notes | - |
