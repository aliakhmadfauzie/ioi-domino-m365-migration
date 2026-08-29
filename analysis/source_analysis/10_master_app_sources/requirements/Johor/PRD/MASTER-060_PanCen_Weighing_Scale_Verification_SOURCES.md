# Master App PDF Source - PanCen - Weighing Scale Verification

> Master row: 60 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 60 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Weighing Scale Verification | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| PCNSVR | Source inventory |
| Form List | PCOCSAM - Form \| NewEntry - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | WEIGSCALVERI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/007_oleObject96.pdf | Extracted embedded PDF | sheet_order_fallback | 0.252 | Explicit mapping | 3 | 1701 | 50 | 6 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/012_oleObject101.pdf | Extracted embedded PDF | text_match_high | 0.751 | Explicit mapping | 2 | 475 | 16 | 6 | WEIGHING SCALE VERIFICATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Allocation Memo | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Pan-Century Oleo Chemicals Sdn. Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Pdf-117/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Pcocqc | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Pceoqc1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pcocprod | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Pcoclog | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Psnprod | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Peoprod | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Psnqc | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Peoqc | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | Default CC | CC | Text | 1 | Parsed from PDF text |
| 3 | Material Description | ProdName | Person/Text | 1 | Parsed from PDF text |
| 4 | Material Code | ResCode | Text | 1 | Parsed from PDF text |
| 5 | Allocate from SO Num | FromSONum | Text | 1 | Parsed from PDF text |
| 6 | Allocate to SO Num | ToSONum | Text | 1 | Parsed from PDF text |
| 7 | Total Quantity | TotalQty | Number/Text | 1 | Parsed from PDF text |
| 8 | Previous Spec Code | PreviousSpecCode | Text | 1 | Parsed from PDF text |
| 9 | Current Spec code | CurrentSpeccode | Text | 1 | Parsed from PDF text |
| 10 | Batch No | Lot | Text | 1 | Parsed from PDF text |
| 11 | Palletizing | Pallet | Text | 1 | Parsed from PDF text |
| 12 | Production Memo | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 13 | Attachment | Attach1 | Text | 1 | Parsed from PDF text |
| 14 | Requestor | DoneBy | Person/Text | 1 | Parsed from PDF text |
| 15 | Date Requested | DateDone | Date/Text | 1 | Parsed from PDF text |
| 16 | Allocation Status | AllStatusQC | Choice/Text | 1 | Parsed from PDF text |
| 17 | Reason for rejection | Reason1 | Multiline Text | 1 | Parsed from PDF text |
| 18 | Remarks | RemarksQC | Multiline Text | 1 | Parsed from PDF text |
| 19 | Rejection Date | RejectQCDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Approved for Shipment | ShipmentApp | Person/Text | 1 | Parsed from PDF text |
| 21 | Approved by | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 22 | Date Approved | DateApp | Date/Text | 1 | Parsed from PDF text |
| 23 | For cancellation | InitiatorStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Date Cancelled | DateCanceled | Date/Text | 1 | Parsed from PDF text |
| 25 | Reasons for cancellation | IniRemarks | Multiline Text | 1 | Parsed from PDF text |
| 26 | Doc Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 27 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 28 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 29 | QC Recipients PCOC | PCOCQC | Text | 1 | Parsed from PDF text |
| 30 | QC Recipients PSN | PCEOQC1 | Text | 1 | Parsed from PDF text |
| 31 | PRD Recipients PCOC | PCOCPROD | Text | 1 | Parsed from PDF text |
| 32 | Log Recipients PCOC | PCOCLOG | Text | 1 | Parsed from PDF text |
| 33 | WH Recipients PCOC | PCOCWarehouse | Text | 1 | Parsed from PDF text |
| 34 | PROD Recipients PSN | PSNPROD | Text | 1 | Parsed from PDF text |
| 35 | PROD Recipients PEO | PEOPROD | Text | 1 | Parsed from PDF text |
| 36 | PSN QC Recipients | PSNQC | Text | 1 | Parsed from PDF text |
| 37 | PEO QC Recipients | PEOQC | Text | 1 | Parsed from PDF text |
| 38 | Requestor | Initiator | Person/Text | 1 | Parsed from PDF text |
| 39 | FinalStatus | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 40 | IT Admin Role | ISAdmin | Text | 1 | Parsed from PDF text |
| 41 | IT Admin | ISG | Text | 1 | Parsed from PDF text |
| 42 | Running Number | SamNum2 | Text | 1 | Parsed from PDF text |
| 43 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 44 | PSN Mailing List | PSNMailingList | Text | 1 | Parsed from PDF text |
| 45 | PEO Mailing List | PEOMailingList | Text | 1 | Parsed from PDF text |
| 46 | Reminder Mailing List | RemMailList | Text | 1 | Parsed from PDF text |
| 47 | Reminder (3 days) | QCRemDate | Date/Text | 1 | Parsed from PDF text |
| 48 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 49 | EditorACMQC | AEditor2 | Text | 1 | Parsed from PDF text |
| 50 | EditorACMWH | AEditor3 | Text | 1 | Parsed from PDF text |
| 51 | SECTION 1 | INSPECTION | Text | 1 | Parsed from PDF text |
| 52 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 53 | Date | DToday | Date/Text | 1 | Parsed from PDF text |
| 54 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 55 | Inspected By | InBy; InName | Person/Text | 1 | Parsed from PDF text |
| 56 | Date | InDate | Date/Text | 1 | Parsed from PDF text |
| 57 | SECTION 2 | REVIEW | Text | 1 | Parsed from PDF text |
| 58 | Remarks | RevRemarks | Multiline Text | 1 | Parsed from PDF text |
| 59 | Reviewed By | RevBy | Text | 1 | Parsed from PDF text |
| 60 | Date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 61 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 62 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 63 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 64 | IT | IT | Text | 1 | Parsed from PDF text |
| 65 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 66 | RemCC | Verifier | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (3), currentaction (3), verification (2), status (1), review (1), reviewed (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `WEIGSCALVERI`
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
| MASTER-060-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-060-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-060-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 66 |
| Workflow Signal Count | 12 |
| Notes | - |
