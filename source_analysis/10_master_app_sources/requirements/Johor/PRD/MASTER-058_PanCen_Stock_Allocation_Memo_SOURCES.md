# Master App PDF Source - PanCen - Stock Allocation Memo

> Master row: 58 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 58 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Stock Allocation Memo | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| PCNSVR | Source inventory |
| Form List | PanCen - Stock Allocation Memo | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCALLOMEMO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRD/5_PCStockMemo_PCEOSAM.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 3 | 1653 | 51 | 6 | STOCK ALLOCATION MEMO |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRD/5_PCStockMemo_PCOCSAM.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 3 | 1701 | 50 | 6 | STOCK ALLOCATION MEMO |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRD/5_PCStockMemo_PSNSAMv1.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 4 | 1864 | 59 | 6 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/007_oleObject96.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 3 | 1701 | 50 | 6 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/008_oleObject97.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 3 | 1653 | 51 | 6 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/009_oleObject98.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 4 | 1864 | 59 | 6 | STOCK ALLOCATION MEMO |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Allocation Memo | Inferred from PDF text | Needs Human Confirmation |
| 2 | Pdr-63/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Pcocqc | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Pceoqc1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Pcocprod | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pcoclog | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Psnprod | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Peoprod | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Psnqc | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Peoqc | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ioi Pan-Century Oleo Chemicals Sdn. Bhd. | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SAM Number | SamNum1 | Text | 1 | Parsed from PDF text |
| 2 | Created on | CreatedOn | Text | 1 | Parsed from PDF text |
| 3 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 4 | Default CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Material Description | ProdName | Person/Text | 1 | Parsed from PDF text |
| 6 | Material Code | ResCode | Text | 1 | Parsed from PDF text |
| 7 | Allocate from SO Num | FromSONum | Text | 1 | Parsed from PDF text |
| 8 | Allocate to SO Num | ToSONum | Text | 1 | Parsed from PDF text |
| 9 | Total Quantity | TotalQty | Number/Text | 1 | Parsed from PDF text |
| 10 | Current Spec code | CurrentSpeccode | Text | 1 | Parsed from PDF text |
| 11 | Batch No. | Lot | Number/Text | 1 | Parsed from PDF text |
| 12 | Palletizing | Pallet | Text | 1 | Parsed from PDF text |
| 13 | Production Memo | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 14 | Attachment | Attach1 | Text | 1 | Parsed from PDF text |
| 15 | Requestor | DoneBy | Person/Text | 1 | Parsed from PDF text |
| 16 | Date Requested | DateDone | Date/Text | 1 | Parsed from PDF text |
| 17 | Allocation Status | AllStatusQC | Choice/Text | 1 | Parsed from PDF text |
| 18 | Reason for rejection | Reason1 | Multiline Text | 1 | Parsed from PDF text |
| 19 | Remarks | RemarksQC | Multiline Text | 1 | Parsed from PDF text |
| 20 | Rejection Date | RejectQCDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Approved for Shipment | ShipmentApp | Person/Text | 1 | Parsed from PDF text |
| 22 | Approved by | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 23 | Date Approved | DateApp | Date/Text | 1 | Parsed from PDF text |
| 24 | For cancellation | InitiatorStatus | Choice/Text | 1 | Parsed from PDF text |
| 25 | Date Cancelled | DateCanceled | Date/Text | 1 | Parsed from PDF text |
| 26 | Reasons for cancellation | IniRemarks | Multiline Text | 1 | Parsed from PDF text |
| 27 | Doc Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 28 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 29 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 30 | QC Recipients PCOC | PCOCQC | Text | 1 | Parsed from PDF text |
| 31 | QC Recipients PSN | PCEOQC1 | Text | 1 | Parsed from PDF text |
| 32 | PRD Recipients PCOC | PCOCPROD | Text | 1 | Parsed from PDF text |
| 33 | Log Recipients PCOC | PCOCLOG | Text | 1 | Parsed from PDF text |
| 34 | WH Recipients PCOC | PCOCWarehouse | Text | 1 | Parsed from PDF text |
| 35 | PROD Recipients PSN | PSNPROD | Text | 1 | Parsed from PDF text |
| 36 | PROD Recipients PEO | PEOPROD | Text | 1 | Parsed from PDF text |
| 37 | PSN QC Recipients | PSNQC | Text | 1 | Parsed from PDF text |
| 38 | PEO QC Recipients | PEOQC | Text | 1 | Parsed from PDF text |
| 39 | Requestor | Initiator | Person/Text | 1 | Parsed from PDF text |
| 40 | FinalStatus | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 41 | IT Admin Role | ISAdmin | Text | 1 | Parsed from PDF text |
| 42 | IT Admin | ISG | Text | 1 | Parsed from PDF text |
| 43 | Running Number | SamNum2 | Text | 1 | Parsed from PDF text |
| 44 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 45 | PSN Mailing List | PSNMailingList | Text | 1 | Parsed from PDF text |
| 46 | PEO Mailing List | PEOMailingList | Text | 1 | Parsed from PDF text |
| 47 | Reminder Mailing List | RemMailList | Text | 1 | Parsed from PDF text |
| 48 | Reminder (3 days) | QCRemDate | Date/Text | 1 | Parsed from PDF text |
| 49 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 50 | EditorACMQC | AEditor2 | Text | 1 | Parsed from PDF text |
| 51 | EditorACMWH | AEditor3 | Text | 1 | Parsed from PDF text |
| 52 | Previous Spec Code | PreviousSpecCode | Text | 1 | Parsed from PDF text |
| 53 | Batch No | Lot | Text | 1 | Parsed from PDF text |
| 54 | Item No | LN | Text | 1 | Parsed from PDF text |
| 55 | New Spec code | CurrentSpeccode | Text | 1 | Parsed from PDF text |
| 56 | Reference Number | ReferenceNo | Text | 1 | Parsed from PDF text |
| 57 | MFG DATE | MFGDate | Date/Text | 1 | Parsed from PDF text |
| 58 | EXP DATE | EXPDate | Date/Text | 1 | Parsed from PDF text |
| 59 | (Free Stock) | SoNum | Text | 1 | Parsed from PDF text |
| 60 | Spec Code | SpecCode | Text | 1 | Parsed from PDF text |
| 61 | Shipment Date | ExpecDate | Date/Text | 1 | Parsed from PDF text |
| 62 | Customer Code | CustCode | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (18), currentaction (12), status (6) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `STOCALLOMEMO`
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
| MASTER-058-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-058-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-058-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 6 |
| Parsed Field Count | 62 |
| Workflow Signal Count | 36 |
| Notes | - |
