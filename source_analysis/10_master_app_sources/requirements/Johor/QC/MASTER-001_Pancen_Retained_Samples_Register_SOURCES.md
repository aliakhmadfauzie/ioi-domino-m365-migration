# Master App PDF Source - Pancen - Retained Samples Register

> Master row: 1 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 1 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Retained Samples Register | Clearly Found |
| Owner | QC | Clearly Found |
| Department | - | Source inventory |
| Form List | Pancen - Retained Samples Register | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RETASAMP | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/QC/27_QCRetained.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 4 | 1597 | 52 | 4 | PANCEN QUALITY CONTROL (REFINERY) RETAINED |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/040_oleObject203.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 4 | 1597 | 52 | 4 | PANCEN QUALITY CONTROL (REFINERY) RETAINED |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pancen Quality Control (Refinery) Retained | Inferred from PDF text | Needs Human Confirmation |
| 2 | Sample Database | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section A: Category | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Be_Sn | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pa_Sn | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cs_Sn | Inferred from PDF text | Needs Human Confirmation |
| 8 | Qrpic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Section A | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Date | Despatch_Date | Date/Text | 1 | Parsed from PDF text |
| 3 | Product | Despatch_Product | Text | 1 | Parsed from PDF text |
| 4 | Storage Tank | Despatch_StorageTank | Text | 1 | Parsed from PDF text |
| 5 | Seal No. | Despatch_SealNo | Number/Text | 1 | Parsed from PDF text |
| 6 | Expiry Date (2 Years) | Despatch_ExpiryDat | Date/Text | 1 | Parsed from PDF text |
| 7 | Date | JC_Date | Date/Text | 1 | Parsed from PDF text |
| 8 | Product | JC_Product | Text | 1 | Parsed from PDF text |
| 9 | Quantity (MTS) | JC_Quantity | Number/Text | 1 | Parsed from PDF text |
| 10 | Customer | JC_Customer | Text | 1 | Parsed from PDF text |
| 11 | So No. | JC_SoNo | Number/Text | 1 | Parsed from PDF text |
| 12 | Batch No. | JC_BatchNo | Number/Text | 1 | Parsed from PDF text |
| 13 | Expiry Date (2 Years) | JC_ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Date | Flexibag_Date | Date/Text | 1 | Parsed from PDF text |
| 15 | Product | Flexibag_Product | Text | 1 | Parsed from PDF text |
| 16 | Quantity (MTS) | Flexibag_Quantity | Number/Text | 1 | Parsed from PDF text |
| 17 | Customer | Flexibag_Customer | Text | 1 | Parsed from PDF text |
| 18 | So No. | Flexibag_SoNo | Number/Text | 1 | Parsed from PDF text |
| 19 | Batch No. | Flexibag_BatchNo | Number/Text | 1 | Parsed from PDF text |
| 20 | Expiry Date (2 Years) | Flexibag_ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Date | Drumming_Date | Date/Text | 1 | Parsed from PDF text |
| 22 | Product | Drumming_Product | Text | 1 | Parsed from PDF text |
| 23 | Quantity (MTS) | Drumming_Quantity | Number/Text | 1 | Parsed from PDF text |
| 24 | Customer | Drumming_Customer | Text | 1 | Parsed from PDF text |
| 25 | So No. | Drumming_SoNo | Number/Text | 1 | Parsed from PDF text |
| 26 | Batch No. | Drumming_BatchNo | Number/Text | 1 | Parsed from PDF text |
| 27 | Expiry Date (2 Years) | rumming_ExpiryDat | Date/Text | 1 | Parsed from PDF text |
| 28 | SN | BE_SN | Text | 1 | Parsed from PDF text |
| 29 | Date Received | BE_DateReceived | Date/Text | 1 | Parsed from PDF text |
| 30 | DO No. | BE_DONo | Number/Text | 1 | Parsed from PDF text |
| 31 | Supplier | BE_Supplier | Text | 1 | Parsed from PDF text |
| 32 | Expiry Date (3 Months) | BE_ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 33 | SN | PA_SN | Text | 1 | Parsed from PDF text |
| 34 | Date Received | PA_DateReceived | Date/Text | 1 | Parsed from PDF text |
| 35 | DO No. | PA_DONo | Number/Text | 1 | Parsed from PDF text |
| 36 | Expiry Date (3 Months) | PA_ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 37 | SN | CS_SN | Text | 1 | Parsed from PDF text |
| 38 | Date Received | CS_DateReceived | Date/Text | 1 | Parsed from PDF text |
| 39 | DO No. | CS_DONo | Number/Text | 1 | Parsed from PDF text |
| 40 | Expiry Date (3 Months) | CS_ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Verified By | VerBy | Person/Text | 1 | Parsed from PDF text |
| 42 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 43 | Remark (If any) | VerRem | Multiline Text | 1 | Parsed from PDF text |
| 44 | Disposed Date | DisposeDate | Date/Text | 1 | Parsed from PDF text |
| 45 | Disposed By | DisposeBy | Text | 1 | Parsed from PDF text |
| 46 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 47 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 48 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 49 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 50 | QR Approver | QRPIC | Person/Text | 1 | Parsed from PDF text |
| 51 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 52 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (2), currentaction (2), ca (2), approver (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `RETASAMP`
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
| MASTER-001-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-001-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-001-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 52 |
| Workflow Signal Count | 8 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
