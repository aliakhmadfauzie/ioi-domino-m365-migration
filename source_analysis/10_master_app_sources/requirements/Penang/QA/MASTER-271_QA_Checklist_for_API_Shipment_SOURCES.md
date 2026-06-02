# Master App PDF Source - QA Checklist for API Shipment

> Master row: 271 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 271 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | QA Checklist for API Shipment | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | Form2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QACHECAPI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/076_oleObject308.pdf | Extracted embedded PDF | text_match_medium | 0.565 | Explicit mapping | 5 | 3759 | 82 | 13 | QA CHECKLIST FOR API |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Qa Checklist For Api | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A: Shipment Booking Details (QA use) | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Ipm | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Api | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section B: Production Records (Production use) | Inferred from PDF text | Needs Human Confirmation |
| 6 | *Daily Weight Verification | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section C: QA Verification on Production Records | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Dbra | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Dbraqa | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section D: Warehouse Records (Warehouse use) | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section E: QA Verification on Warehouse Records and Shipment Release | Inferred from PDF text | Needs Human Confirmation |
| 12 | Send shipment approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | API shipment no. | txtRefNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 4 | Issued on | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 5 | To | To; ToName | Person/Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Sales Order | SalesOrder | Text | 1 | Parsed from PDF text |
| 8 | Item Number | ItemNumber | Text | 1 | Parsed from PDF text |
| 9 | Material | IPM | Text | 1 | Parsed from PDF text |
| 10 | Quantity | Quantity; MT | Number/Text | 1 | Parsed from PDF text |
| 11 | Category | API | Choice/Text | 1 | Parsed from PDF text |
| 12 | Sold-to Customer | SoldToCust | Date/Text | 1 | Parsed from PDF text |
| 13 | Proforma Invoice number | ProformaInvoice | Text | 1 | Parsed from PDF text |
| 14 | Port of Loading Date | PortofLoadingDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Attachment | Attachment2 | Text | 1 | Parsed from PDF text |
| 16 | Replied on | SecBRepliedOn | Text | 1 | Parsed from PDF text |
| 17 | From | SecBFrom; SecBFromName | Person/Text | 1 | Parsed from PDF text |
| 18 | To | SecBTo; SecBToName | Person/Text | 1 | Parsed from PDF text |
| 19 | CC | SecBCC | Text | 1 | Parsed from PDF text |
| 20 | Batch Number | SecBBatchNo | Text | 1 | Parsed from PDF text |
| 21 | [Mandatory] | PDLOAttachment | Text | 1 | Parsed from PDF text |
| 22 | Record Attachment [Mandatory] | Att | Text | 1 | Parsed from PDF text |
| 23 | Attachment [Mandatory] | Att_1 | Text | 1 | Parsed from PDF text |
| 24 | Attachment [Mandatory] | Att_2 | Text | 1 | Parsed from PDF text |
| 25 | Record Attachment [Mandatory] | Att_3 | Text | 1 | Parsed from PDF text |
| 26 | Remark | SecBRemark | Multiline Text | 1 | Parsed from PDF text |
| 27 | To | SecCTo; SecCToName | Person/Text | 1 | Parsed from PDF text |
| 28 | CC | SecCCC | Text | 1 | Parsed from PDF text |
| 29 | Plant Logsheet Attachment | DBRA | Text | 1 | Parsed from PDF text |
| 30 | approved by QA? | DBRAQA | Person/Text | 1 | Parsed from PDF text |
| 31 | Retest date of material | RetestDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Attachment | SecCAttachment | Text | 1 | Parsed from PDF text |
| 33 | issued? | Deviation | Text | 1 | Parsed from PDF text |
| 34 | addressed? | IR | Text | 1 | Parsed from PDF text |
| 35 | Acceptance status | AcceptanceStatus | Choice/Text | 1 | Parsed from PDF text |
| 36 | Replied on | SecDRepliedOn | Text | 1 | Parsed from PDF text |
| 37 | From | SecDFrom; SecDFromName | Person/Text | 1 | Parsed from PDF text |
| 38 | To | SecDTo | Date/Text | 1 | Parsed from PDF text |
| 39 | CC | SecDCC | Text | 1 | Parsed from PDF text |
| 40 | Attachment | PreChecklistA | Text | 1 | Parsed from PDF text |
| 41 | Attachment | ShipMarkSamA | Text | 1 | Parsed from PDF text |
| 42 | Is the batch number stated in label correct? | BatchNoCorrect | Text | 1 | Parsed from PDF text |
| 43 | record? | SAPRecord | Text | 1 | Parsed from PDF text |
| 44 | Quantity of Printed Label(s) | QPrintedLabel | Number/Text | 1 | Parsed from PDF text |
| 45 | Quantity of Rejected Label(s) | QRejectedLabel | Number/Text | 1 | Parsed from PDF text |
| 46 | Quantity of Extra Label(s) | QExtraLabel | Number/Text | 1 | Parsed from PDF text |
| 47 | Sales Admin | DocPrep | Text | 1 | Parsed from PDF text |
| 48 | notification to | SendAppNot | Text | 1 | Parsed from PDF text |
| 49 | Replied on | SecFRepliedOn | Text | 1 | Parsed from PDF text |
| 50 | From | SecFFrom; SecFFromName | Person/Text | 1 | Parsed from PDF text |
| 51 | To | SecFTo | Text | 1 | Parsed from PDF text |
| 52 | CC | SecFCC | Text | 1 | Parsed from PDF text |
| 53 | Attachment | DCAttachment | Text | 1 | Parsed from PDF text |
| 54 | Attachment | COAAttachment | Text | 1 | Parsed from PDF text |
| 55 | Approval status | SecGAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 56 | Archived by | AName | Person/Text | 1 | Parsed from PDF text |
| 57 | Date | ADate | Date/Text | 1 | Parsed from PDF text |
| 58 | Remark | ARem | Multiline Text | 1 | Parsed from PDF text |
| 59 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 60 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 61 | Date Created | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 62 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 63 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 64 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 65 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 66 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 67 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 68 | Editor 7 | Editor7 | Text | 1 | Parsed from PDF text |
| 69 | Editor 8 | Editor8 | Text | 1 | Parsed from PDF text |
| 70 | Editor 9 | Editor9 | Text | 1 | Parsed from PDF text |
| 71 | QA | QA | Text | 1 | Parsed from PDF text |
| 72 | QA (Section G) | QA2 | Text | 1 | Parsed from PDF text |
| 73 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 74 | Running numbers | INO | Text | 1 | Parsed from PDF text |
| 75 | Assign Ref No | DisplayRefNo | Text | 1 | Parsed from PDF text |
| 76 | Get Ref No | RefNo | Text | 1 | Parsed from PDF text |
| 77 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 78 | IT | IT | Text | 1 | Parsed from PDF text |
| 79 | Section A CC | CCA | Text | 1 | Parsed from PDF text |
| 80 | Section B CC | CCB | Text | 1 | Parsed from PDF text |
| 81 | Section D CC | CCD | Text | 1 | Parsed from PDF text |
| 82 | Section F CC | CCF | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verification (3), approval (3), status (2), currentaction (2), approved (1), rejected (1), verified (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `QACHECAPI`
Child-list recommendation: `MainDB_QA_Ext_QACHECAPI_Rows` candidate for repeating row fields

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
| MASTER-271-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-271-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-271-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 82 |
| Workflow Signal Count | 13 |
| Notes | - |
