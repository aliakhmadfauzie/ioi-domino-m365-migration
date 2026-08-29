# Master App PDF Source - Vendor Quality Appraisal

> Master row: 229 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 229 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Vendor Quality Appraisal | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| PHBSVR | Source inventory |
| Form List | AnnualUpdateNew - Form \| VQA_Form_New - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDQUALAPPR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/004_oleObject82.pdf | Extracted embedded PDF | sheet_order_fallback | 0.193 | Explicit mapping | 2 | 663 | 15 | 2 | Declaration Documents |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/017_oleObject95.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1841 | 25 | 7 | Vendor Quality Appraisal |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 3 | Vqano | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION 1 : Filled by Respective DLPs | Inferred from PDF text | Needs Human Confirmation |
| 6 | Total | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION 2 : Filled by Purchasing Department | Inferred from PDF text | Needs Human Confirmation |
| 8 | (A X 100) / B | Inferred from PDF text | Needs Human Confirmation |
| 9 | Opr % | Inferred from PDF text | Needs Human Confirmation |
| 10 | Pur-08/060217/10 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pur Hod | Inferred from PDF text | Needs Human Confirmation |
| 12 | Purhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 2 | Item Code | ItemCode | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 7 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 8 | Period of Renewal | Period | Text | 1 | Parsed from PDF text |
| 9 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Attachments | Attachment | Text | 1 | Parsed from PDF text |
| 11 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 12 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 13 | PUR Admin | PURAdmin | Text | 1 | Parsed from PDF text |
| 14 | Editor | Editor_1 | Text | 1 | Parsed from PDF text |
| 15 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 16 | VQA No | Year | Text | 1 | Parsed from PDF text |
| 17 | Category | CategoryName | Person/Text | 1 | Parsed from PDF text |
| 18 | Name of Vendor | VendorName | Person/Text | 1 | Parsed from PDF text |
| 19 | Period Appraised | Period; Year_1 | Text | 1 | Parsed from PDF text |
| 20 | Product/Service | ProductName | Person/Text | 1 | Parsed from PDF text |
| 21 | Site | Site | Text | 1 | Parsed from PDF text |
| 22 | Department | Department | Text | 1 | Parsed from PDF text |
| 23 | HOD Name | HOD | Person/Text | 1 | Parsed from PDF text |
| 24 | Appraised By | AppraisedBy | Text | 1 | Parsed from PDF text |
| 25 | Verified By | HODVerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 26 | Designation | ApprDesignation | Text | 1 | Parsed from PDF text |
| 27 | Designation | HODVerDesignation | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | AppraisedDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Date | HODVerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 30 | rejected on | HODRejectedDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 32 | Verified By | PurHODVerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 33 | Designation | PreprDesignation | Text | 1 | Parsed from PDF text |
| 34 | Designation | PurDesignation | Text | 1 | Parsed from PDF text |
| 35 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Date | PurHODVerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 38 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 39 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 40 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (3), hod (3), currentaction (2), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VENDQUALAPPR`
Child-list recommendation: `MainDB_PUR_Ext_VENDQUALAPPR_Rows` candidate for repeating row fields

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
| MASTER-229-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-229-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-229-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 40 |
| Workflow Signal Count | 9 |
| Notes | - |
