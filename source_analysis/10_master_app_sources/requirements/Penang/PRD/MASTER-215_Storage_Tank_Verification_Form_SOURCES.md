# Master App PDF Source - Storage Tank Verification Form

> Master row: 215 | Site: Penang | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 215 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Storage Tank Verification Form | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | Prod \| PHBSVR | Source inventory |
| Form List | NewSAM - Form \| NewForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORTANKVERI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/005_oleObject119.pdf | Extracted embedded PDF | sheet_order_fallback | 0.252 | Explicit mapping | 3 | 1489 | 49 | 5 | STOCK ALLOCATION MEMO |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/007_oleObject121.pdf | Extracted embedded PDF | text_match_medium | 0.505 | Explicit mapping | 1 | 411 | 9 | 1 | RAW MATERIAL TANKS CLEANING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Allocation Memo | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Rspo | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Acmqc | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Dcmqc | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Ecmqc | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 7 | Sam Pic | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Cbp | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Rms | Inferred from PDF text | Needs Human Confirmation |
| 11 | Raw Material Tanks Cleaning | Inferred from PDF text | Needs Human Confirmation |
| 12 | DETAILS | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SAM Number | SamNum1 | Text | 1 | Parsed from PDF text |
| 2 | Created on | CreatedOn | Text | 1 | Parsed from PDF text |
| 3 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 4 | Material Code | ResCode; SELECT | Text | 1 | Parsed from PDF text |
| 5 | Material Description | ProdName | Person/Text | 1 | Parsed from PDF text |
| 6 | Sales Order | SoNum | Text | 1 | Parsed from PDF text |
| 7 | Item No | LN | Text | 1 | Parsed from PDF text |
| 8 | Total Quantity | TotalQty | Number/Text | 1 | Parsed from PDF text |
| 9 | Good Issue Date | ExpecDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Spec Code | SpecCode | Text | 1 | Parsed from PDF text |
| 11 | Batch No | Lot | Text | 1 | Parsed from PDF text |
| 12 | Customer Code | CustCode | Text | 1 | Parsed from PDF text |
| 13 | Palletizing | Pallet | Text | 1 | Parsed from PDF text |
| 14 | Production Memo | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 15 | Attachment | Attach1 | Text | 1 | Parsed from PDF text |
| 16 | Requestor | DoneBy | Person/Text | 1 | Parsed from PDF text |
| 17 | Date Requested | DateDone | Date/Text | 1 | Parsed from PDF text |
| 18 | Allocation Status | AllStatusQC | Choice/Text | 1 | Parsed from PDF text |
| 19 | Allocation Status | ShipmentApp | Choice/Text | 1 | Parsed from PDF text |
| 20 | Date | DateApp | Date/Text | 1 | Parsed from PDF text |
| 21 | Reason for rejection | Reason1 | Multiline Text | 1 | Parsed from PDF text |
| 22 | Rejection Date | RejectQCDate | Date/Text | 1 | Parsed from PDF text |
| 23 | For cancellation | InitiatorStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Date Cancelled | DateCanceled | Date/Text | 1 | Parsed from PDF text |
| 25 | Reasons for cancellation | IniRemarks | Multiline Text | 1 | Parsed from PDF text |
| 26 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 27 | FinalStatus | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 28 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 29 | QC Recipients ACM | ACMQC | Text | 1 | Parsed from PDF text |
| 30 | QC Recipients DCM | DCMQC | Text | 1 | Parsed from PDF text |
| 31 | QC Recipients ECM | ECMQC | Text | 1 | Parsed from PDF text |
| 32 | Other Recipients | Others | Text | 1 | Parsed from PDF text |
| 33 | 'Send To' List | SendToList | Date/Text | 1 | Parsed from PDF text |
| 34 | ACM/DCM QC Mailing List | QCAll | Text | 1 | Parsed from PDF text |
| 35 | ACM/DCM WH Mailing List | WH | Text | 1 | Parsed from PDF text |
| 36 | Requestor | Initiator | Person/Text | 1 | Parsed from PDF text |
| 37 | IT Admin | ISG | Text | 1 | Parsed from PDF text |
| 38 | Running Number | SamNum2 | Text | 1 | Parsed from PDF text |
| 39 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 40 | Reminder (3 days) | QCRemDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Mak's email | Makks | Text | 1 | Parsed from PDF text |
| 42 | SAM PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 43 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 44 | Editor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 45 | Editor 2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 46 | Choo Bee Peng | CBP | Text | 1 | Parsed from PDF text |
| 47 | Armizal (RSPO) | Armizal | Text | 1 | Parsed from PDF text |
| 48 | AES & ECM (Ramis) | RMS | Text | 1 | Parsed from PDF text |
| 49 | Production Planning (RSPO) | PP | Text | 1 | Parsed from PDF text |
| 50 | Storage Tank | Tank | Text | 1 | Parsed from PDF text |
| 51 | Site | Site | Text | 1 | Parsed from PDF text |
| 52 | Last Cleaning Date | CleaningRecord | Date/Text | 1 | Parsed from PDF text |
| 53 | Next Cleaning Date | CleaningDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 55 | Editor - Section A, B & C | Editor1 | Text | 1 | Parsed from PDF text |
| 56 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 57 | Rem Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (3), status (2), approved (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `STORTANKVERI`
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
| MASTER-215-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-215-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-215-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 57 |
| Workflow Signal Count | 6 |
| Notes | - |
