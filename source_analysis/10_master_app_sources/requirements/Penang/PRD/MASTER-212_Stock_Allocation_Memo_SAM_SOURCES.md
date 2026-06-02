# Master App PDF Source - Stock Allocation Memo (SAM)

> Master row: 212 | Site: Penang | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 212 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Stock Allocation Memo (SAM) | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | Prod \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | Stock Allocation Memo (SAM) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCALLOMEMO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/005_oleObject119.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 3 | 1489 | 49 | 5 | STOCK ALLOCATION MEMO |

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

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), currentaction (2), approved (1) | Parsed from PDF text |
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
| MASTER-212-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-212-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-212-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 49 |
| Workflow Signal Count | 5 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
