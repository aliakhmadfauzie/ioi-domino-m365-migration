# Master App PDF Source - SAP Shelf Life Expiration Details

> Master row: 335 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 335 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Shelf Life Expiration Details | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| IMS Related \| PHBSVR | Source inventory |
| Form List | ReversalCorrection - Form \| ShelfLife - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPSHELLIFE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/008_oleObject42.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 1097 | 40 | 7 | FormTitle |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/009_oleObject43.pdf | Extracted embedded PDF | text_match_high | 0.601 | Explicit mapping | 4 | 2979 | 60 | 5 | SAP SHELF LIFE EXPIRATION DATE - |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approval of Requestor's Dept Head | Inferred from PDF text | Needs Human Confirmation |
| 3 | Material Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Acmstr | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Ecmstr | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Str | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Mat | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Mathod | Inferred from PDF text | Needs Human Confirmation |
| 10 | Sap Shelf Life Expiration Date - | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section A: Initiation | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section B: Prod Plannning Use | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Serial No | SerialNo | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Material Code | MatCode | Text | 1 | Parsed from PDF text |
| 5 | Material Description | MatDesc | Multiline Text | 1 | Parsed from PDF text |
| 6 | Quantity | Qty; UOM | Number/Text | 1 | Parsed from PDF text |
| 7 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 8 | Remarks | Rem | Multiline Text | 1 | Parsed from PDF text |
| 9 | PO Number | PONo | Text | 1 | Parsed from PDF text |
| 10 | PO Item Line | POItemLine | Text | 1 | Parsed from PDF text |
| 11 | Vendor | Vendor | Text | 1 | Parsed from PDF text |
| 12 | Reason of Reversal | ReasonReversal | Multiline Text | 1 | Parsed from PDF text |
| 13 | Correction | Correction | Text | 1 | Parsed from PDF text |
| 14 | Preventive Action | PrevAction | Text | 1 | Parsed from PDF text |
| 15 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 16 | Requestor Name | ReqName | Person/Text | 1 | Parsed from PDF text |
| 17 | Requestor Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remark | HODRem | Person/Text | 1 | Parsed from PDF text |
| 20 | Material Doc. No. | MatDocNo2 | Number/Text | 1 | Parsed from PDF text |
| 21 | TO No. | MatTONo | Number/Text | 1 | Parsed from PDF text |
| 22 | Remark | MatRem | Multiline Text | 1 | Parsed from PDF text |
| 23 | Adjusted Name | MatName | Person/Text | 1 | Parsed from PDF text |
| 24 | Adjusted Date | MatDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 26 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 28 | IT | IT | Text | 1 | Parsed from PDF text |
| 29 | INO | INO | Text | 1 | Parsed from PDF text |
| 30 | Store ACM | ACMSTR | Text | 1 | Parsed from PDF text |
| 31 | Store ECM | ECMSTR | Text | 1 | Parsed from PDF text |
| 32 | Store | STR | Text | 1 | Parsed from PDF text |
| 33 | Material | MAT | Text | 1 | Parsed from PDF text |
| 34 | Material HOD | MATHOD | Person/Text | 1 | Parsed from PDF text |
| 35 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 36 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 37 | Editor 2a | Editor2a | Text | 1 | Parsed from PDF text |
| 38 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 39 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 40 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Section A | Initiation | Text | 1 | Parsed from PDF text |
| 42 | Running No | Year; INO | Text | 1 | Parsed from PDF text |
| 43 | Quantity at Store Location | UOM | Number/Text | 1 | Parsed from PDF text |
| 44 | Action to be taken by (PP) | PPNameTo | Person/Text | 1 | Parsed from PDF text |
| 45 | Process Owners | CCProcessOwners | Text | 1 | Parsed from PDF text |
| 46 | CC | CC | Text | 1 | Parsed from PDF text |
| 47 | Date | UpdatedDate | Date/Text | 1 | Parsed from PDF text |
| 48 | Remark | RemarksUpdated | Date/Text | 1 | Parsed from PDF text |
| 49 | Action to be taken | PPAction | Text | 1 | Parsed from PDF text |
| 50 | Send to PROC | SendToPUR | Date/Text | 1 | Parsed from PDF text |
| 51 | CC | PPCC | Text | 1 | Parsed from PDF text |
| 52 | Completed by | PPActionBy | Text | 1 | Parsed from PDF text |
| 53 | Date | PPDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Attachment | PPRemarks | Multiline Text | 1 | Parsed from PDF text |
| 55 | Able to extend? | PURAction | Text | 1 | Parsed from PDF text |
| 56 | Send to QC | SendToQC | Date/Text | 1 | Parsed from PDF text |
| 57 | CC | PURCC | Text | 1 | Parsed from PDF text |
| 58 | Completed by | PURActionBy | Text | 1 | Parsed from PDF text |
| 59 | Date | PURDate | Date/Text | 1 | Parsed from PDF text |
| 60 | Remark | PURRemarks | Multiline Text | 1 | Parsed from PDF text |
| 61 | Attachment | PURAttach | Text | 1 | Parsed from PDF text |
| 62 | New Expiration Date | dtNewExpiration | Date/Text | 1 | Parsed from PDF text |
| 63 | in SAP | QCAction | Text | 1 | Parsed from PDF text |
| 64 | CC | QCCC | Text | 1 | Parsed from PDF text |
| 65 | Completed by | QCActionBy | Text | 1 | Parsed from PDF text |
| 66 | Date | QCDate | Date/Text | 1 | Parsed from PDF text |
| 67 | Attachment | QCRemarks | Multiline Text | 1 | Parsed from PDF text |
| 68 | Material code status | MATAction | Choice/Text | 1 | Parsed from PDF text |
| 69 | Send to All | SendToAll | Date/Text | 1 | Parsed from PDF text |
| 70 | CC | MATCC | Text | 1 | Parsed from PDF text |
| 71 | Completed by | MATActionBy | Text | 1 | Parsed from PDF text |
| 72 | Date | MATDate | Date/Text | 1 | Parsed from PDF text |
| 73 | Attachment | MATRemarks | Multiline Text | 1 | Parsed from PDF text |
| 74 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 75 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 76 | Date Withdrawn | WDDate | Date/Text | 1 | Parsed from PDF text |
| 77 | Reason | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 78 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 79 | IT Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 80 | Editor1 - Request | AEditor1 | Text | 1 | Parsed from PDF text |
| 81 | Editor2 - PPDone | AEditor2 | Text | 1 | Parsed from PDF text |
| 82 | Editor3 - PURDone | AEditor3 | Text | 1 | Parsed from PDF text |
| 83 | Editor4 - QCDone | AEditor4 | Text | 1 | Parsed from PDF text |
| 84 | Editor5 - MAT Section | AEditor5 | Text | 1 | Parsed from PDF text |
| 85 | QC Notify All | NotifyAll | Text | 1 | Parsed from PDF text |
| 86 | Store | StorePIC | Person/Text | 1 | Parsed from PDF text |
| 87 | Running number | RunningNo | Text | 1 | Parsed from PDF text |
| 88 | PROC | ReminderToAll | Text | 1 | Parsed from PDF text |
| 89 | (ACM) | StoreMailACM | Text | 1 | Parsed from PDF text |
| 90 | (ECM) | StoreMailECM | Text | 1 | Parsed from PDF text |
| 91 | group to Store | ReminderCCAll | Text | 1 | Parsed from PDF text |
| 92 | Pending Action Status | PdgAction | Choice/Text | 1 | Parsed from PDF text |
| 93 | Pending Action PIC | PICNames | Person/Text | 1 | Parsed from PDF text |
| 94 | Reminder Count | RemCount | Text | 1 | Parsed from PDF text |
| 95 | date - 180 days) | RemDate1st | Date/Text | 1 | Parsed from PDF text |
| 96 | 2nd reminder | RemDate2nd | Date/Text | 1 | Parsed from PDF text |
| 97 | 3rd reminder | RemDate3rd | Date/Text | 1 | Parsed from PDF text |
| 98 | 4th reminder - weekly | RemDate4th | Date/Text | 1 | Parsed from PDF text |
| 99 | Weekly reminder | QCRemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), status (3), approval (2), currentaction (2), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `SAPSHELLIFE`
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
| MASTER-335-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-335-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-335-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 99 |
| Workflow Signal Count | 12 |
| Notes | - |
