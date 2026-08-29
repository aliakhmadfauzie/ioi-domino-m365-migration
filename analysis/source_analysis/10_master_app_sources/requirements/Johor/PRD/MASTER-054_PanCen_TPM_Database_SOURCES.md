# Master App PDF Source - PanCen - TPM Database

> Master row: 54 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 54 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - TPM Database | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| Critical App | Source inventory |
| Form List | PSNSAMv1 - Form \| PackIns - Form \| RequestAnalysis2 - Form \| ScrapNotification - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TPM | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/009_oleObject98.pdf | Extracted embedded PDF | sheet_order_fallback | 0.005 | Explicit mapping | 4 | 1864 | 59 | 6 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/013_oleObject102.pdf | Extracted embedded PDF | sheet_order_fallback | 0.191 | Explicit mapping | 2 | 705 | 27 | 3 | PACKING INSTRUCTION |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/014_oleObject103.pdf | Extracted embedded PDF | sheet_order_fallback | 0.195 | Explicit mapping | 2 | 731 | 27 | 3 | REQUEST ANALYSIS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/015_oleObject104.pdf | Extracted embedded PDF | sheet_order_fallback | 0.191 | Explicit mapping | 3 | 1299 | 36 | 4 | SOAP SCRAP NOTIFICATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Allocation Memo | Inferred from PDF text | Needs Human Confirmation |
| 2 | Pcoc - Psn | Inferred from PDF text | Needs Human Confirmation |
| 3 | Mfg Date | Inferred from PDF text | Needs Human Confirmation |
| 4 | Exp Date | Inferred from PDF text | Needs Human Confirmation |
| 5 | Pds-56/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pcocqc | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Pceoqc1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Pcocprod | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Pcoclog | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Psnprod | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Peoprod | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Psnqc | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SAM Number | SamNum1 | Text | 1 | Parsed from PDF text |
| 2 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Default CC | CC | Text | 1 | Parsed from PDF text |
| 4 | Material Description | ProdName | Person/Text | 1 | Parsed from PDF text |
| 5 | Material Code | ResCode | Text | 1 | Parsed from PDF text |
| 6 | Allocate from SO Num | FromSONum | Text | 1 | Parsed from PDF text |
| 7 | Allocate to SO Num | ToSONum | Text | 1 | Parsed from PDF text |
| 8 | Item No | LN | Text | 1 | Parsed from PDF text |
| 9 | Total Quantity | TotalQty | Number/Text | 1 | Parsed from PDF text |
| 10 | Previous Spec Code | PreviousSpecCode | Text | 1 | Parsed from PDF text |
| 11 | New Spec code | CurrentSpeccode | Text | 1 | Parsed from PDF text |
| 12 | Batch No | Lot | Text | 1 | Parsed from PDF text |
| 13 | Palletizing | Pallet | Text | 1 | Parsed from PDF text |
| 14 | Reference Number | ReferenceNo | Text | 1 | Parsed from PDF text |
| 15 | MFG DATE | MFGDate | Date/Text | 1 | Parsed from PDF text |
| 16 | EXP DATE | EXPDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Production Memo | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 18 | Attachment | Attach1 | Text | 1 | Parsed from PDF text |
| 19 | (Free Stock) | SoNum | Text | 1 | Parsed from PDF text |
| 20 | Spec Code | SpecCode | Text | 1 | Parsed from PDF text |
| 21 | Shipment Date | ExpecDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Customer Code | CustCode | Text | 1 | Parsed from PDF text |
| 23 | Requestor | DoneBy | Person/Text | 1 | Parsed from PDF text |
| 24 | Date Requested | DateDone | Date/Text | 1 | Parsed from PDF text |
| 25 | Allocation Status | AllStatusQC | Choice/Text | 1 | Parsed from PDF text |
| 26 | Reason for rejection | Reason1 | Multiline Text | 1 | Parsed from PDF text |
| 27 | Remarks | RemarksQC | Multiline Text | 1 | Parsed from PDF text |
| 28 | Rejection Date | RejectQCDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Approved for Shipment | ShipmentApp | Person/Text | 1 | Parsed from PDF text |
| 30 | Approved by | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 31 | Date Approved | DateApp | Date/Text | 1 | Parsed from PDF text |
| 32 | For cancellation | InitiatorStatus | Choice/Text | 1 | Parsed from PDF text |
| 33 | Date Cancelled | DateCanceled | Date/Text | 1 | Parsed from PDF text |
| 34 | Reasons for cancellation | IniRemarks | Multiline Text | 1 | Parsed from PDF text |
| 35 | Doc Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 36 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 37 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 38 | QC Recipients PCOC | PCOCQC | Text | 1 | Parsed from PDF text |
| 39 | QC Recipients PSN | PCEOQC1 | Text | 1 | Parsed from PDF text |
| 40 | PRD Recipients PCOC | PCOCPROD | Text | 1 | Parsed from PDF text |
| 41 | Log Recipients PCOC | PCOCLOG | Text | 1 | Parsed from PDF text |
| 42 | WH Recipients PCOC | PCOCWarehouse | Text | 1 | Parsed from PDF text |
| 43 | PROD Recipients PSN | PSNPROD | Text | 1 | Parsed from PDF text |
| 44 | PROD Recipients PEO | PEOPROD | Text | 1 | Parsed from PDF text |
| 45 | PSN QC Recipients | PSNQC | Text | 1 | Parsed from PDF text |
| 46 | PEO QC Recipients | PEOQC | Text | 1 | Parsed from PDF text |
| 47 | Requestor | Initiator | Person/Text | 1 | Parsed from PDF text |
| 48 | FinalStatus | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 49 | IT Admin Role | ISAdmin | Text | 1 | Parsed from PDF text |
| 50 | IT Admin | ISG | Text | 1 | Parsed from PDF text |
| 51 | Running Number | SamNum2 | Text | 1 | Parsed from PDF text |
| 52 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 53 | PSN Mailing List | PSNMailingList | Text | 1 | Parsed from PDF text |
| 54 | PEO Mailing List | PEOMailingList | Text | 1 | Parsed from PDF text |
| 55 | Reminder Mailing List | RemMailList | Text | 1 | Parsed from PDF text |
| 56 | Reminder (3 days) | QCRemDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 58 | EditorACMQC | AEditor2 | Text | 1 | Parsed from PDF text |
| 59 | EditorACMWH | AEditor3 | Text | 1 | Parsed from PDF text |
| 60 | Ref No | txtRefNo | Text | 1 | Parsed from PDF text |
| 61 | Site | Site | Text | 1 | Parsed from PDF text |
| 62 | To | SendToQC | Date/Text | 1 | Parsed from PDF text |
| 63 | CC | CC | Text | 1 | Parsed from PDF text |
| 64 | Equipment | Equipment | Text | 1 | Parsed from PDF text |
| 65 | Type Bag/Drums | Type | Choice/Text | 1 | Parsed from PDF text |
| 66 | Tank No | TankNo | Text | 1 | Parsed from PDF text |
| 67 | Product Name | ProductName | Person/Text | 1 | Parsed from PDF text |
| 68 | Customer | Customer | Text | 1 | Parsed from PDF text |
| 69 | Contract No | ContractNo | Text | 1 | Parsed from PDF text |
| 70 | Quantity | Qty | Number/Text | 1 | Parsed from PDF text |
| 71 | Lot No | LotNo | Text | 1 | Parsed from PDF text |
| 72 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 73 | Packing Operator | Packing | Text | 1 | Parsed from PDF text |
| 74 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 75 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 76 | Date Created | CreateDate | Date/Text | 1 | Parsed from PDF text |
| 77 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 78 | Default CC Mailing list (SendTo & CC) | MailingList | Date/Text | 1 | Parsed from PDF text |
| 79 | AppStatus | Status | Choice/Text | 1 | Parsed from PDF text |
| 80 | Running numbers (INO) | INO | Text | 1 | Parsed from PDF text |
| 81 | Assign Ref No | DisplayRefNo | Text | 1 | Parsed from PDF text |
| 82 | Get Ref No | RefNo | Text | 1 | Parsed from PDF text |
| 83 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 84 | IT | IT | Text | 1 | Parsed from PDF text |
| 85 | Send to QC | SendToQC | Date/Text | 1 | Parsed from PDF text |
| 86 | Date Send | DateSent | Date/Text | 1 | Parsed from PDF text |
| 87 | Department | SelDept | Text | 1 | Parsed from PDF text |
| 88 | Requested by | RequestedBy | Text | 1 | Parsed from PDF text |
| 89 | Analysis | NewAnalysis | Text | 1 | Parsed from PDF text |
| 90 | Analysis | NewAnalysis2 | Text | 1 | Parsed from PDF text |
| 91 | Purpose of Analysis | Purpose | Text | 1 | Parsed from PDF text |
| 92 | Purpose of Analysis | Purpose2 | Text | 1 | Parsed from PDF text |
| 93 | Tank No./Pallet No. | TankNo | Number/Text | 1 | Parsed from PDF text |
| 94 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 95 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 96 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 97 | App Submission date | AppSubmissionDate | Date/Text | 1 | Parsed from PDF text |
| 98 | Running numbers | INO | Text | 1 | Parsed from PDF text |
| 99 | Year & Month | Year | Text | 1 | Parsed from PDF text |
| 100 | ISG | ISG | Text | 1 | Parsed from PDF text |
| 101 | Prod | Prod | Text | 1 | Parsed from PDF text |
| 102 | QC | QC | Text | 1 | Parsed from PDF text |
| 103 | Seal Numbers | SealNumber | Text | 1 | Parsed from PDF text |
| 104 | Date | PMDate | Date/Text | 1 | Parsed from PDF text |
| 105 | Comment | PMComm | Multiline Text | 1 | Parsed from PDF text |
| 106 | Date | QCMDate | Date/Text | 1 | Parsed from PDF text |
| 107 | Comment | QCMComm | Multiline Text | 1 | Parsed from PDF text |
| 108 | Editor2a | Editor2a | Text | 1 | Parsed from PDF text |
| 109 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 110 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 111 | CC1 | CC1 | Text | 1 | Parsed from PDF text |
| 112 | CC2 | CC2 | Text | 1 | Parsed from PDF text |
| 113 | CCList1 | CCList1 | Text | 1 | Parsed from PDF text |
| 114 | CCList2 | CCList2 | Text | 1 | Parsed from PDF text |
| 115 | BCC | BCC | Text | 1 | Parsed from PDF text |
| 116 | Purchasing | Purchasing | Text | 1 | Parsed from PDF text |
| 117 | Marketing | Marketing | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (8), status (4), approved (4) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `TPM`
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
| MASTER-054-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-054-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-054-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 4 |
| Parsed Field Count | 117 |
| Workflow Signal Count | 16 |
| Notes | - |
