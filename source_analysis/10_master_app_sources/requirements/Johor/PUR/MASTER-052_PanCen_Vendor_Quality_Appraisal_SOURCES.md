# Master App PDF Source - PanCen - Vendor Quality Appraisal

> Master row: 52 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 52 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Vendor Quality Appraisal | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | VQA_Form2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDQUALAPPR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/014_oleObject80.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 2062 | 36 | 7 | Pancen Vendor Quality Appraisal |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Vqano | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION 1 : Filled by Respective DLPs | Inferred from PDF text | Needs Human Confirmation |
| 4 | Total | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION 2 : Filled by Purchasing Department | Inferred from PDF text | Needs Human Confirmation |
| 6 | (A X 100) / B | Inferred from PDF text | Needs Human Confirmation |
| 7 | Opr % | Inferred from PDF text | Needs Human Confirmation |
| 8 | Pur-28/170624/00 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Pur Hod | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Purhod | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 12 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | VQA No | Year | Text | 1 | Parsed from PDF text |
| 2 | Category | CategoryName | Person/Text | 1 | Parsed from PDF text |
| 3 | Name of Vendor | VendorName | Person/Text | 1 | Parsed from PDF text |
| 4 | Period Appraised | Period_1 | Text | 1 | Parsed from PDF text |
| 5 | Product/Service | ProductName | Person/Text | 1 | Parsed from PDF text |
| 6 | Site | Site | Text | 1 | Parsed from PDF text |
| 7 | Department | Department | Text | 1 | Parsed from PDF text |
| 8 | HOD Name | HOD | Person/Text | 1 | Parsed from PDF text |
| 9 | Appraised By | AppraisedBy | Text | 1 | Parsed from PDF text |
| 10 | Verified By | HODVerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 11 | Designation | ApprDesignation | Text | 1 | Parsed from PDF text |
| 12 | Designation | HODVerDesignation | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | AppraisedDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Date | HODVerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 15 | rejected on | HODRejectedDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 17 | Verified By | PurHODVerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 18 | Designation | PreprDesignation | Text | 1 | Parsed from PDF text |
| 19 | Designation : Senior Procurement Manager | Asst; General; Manager | Text | 1 | Parsed from PDF text |
| 20 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Date | PurHODVerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 23 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 24 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 26 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 27 | PUR HOD | PURHOD | Person/Text | 1 | Parsed from PDF text |
| 28 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 29 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |
| 30 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 31 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 32 | Editor 2.1 | Editor2_1 | Text | 1 | Parsed from PDF text |
| 33 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 34 | VQA No | VQAN | Text | 1 | Parsed from PDF text |
| 35 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 36 | PUR Prep | PCNQCPRDB | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), verified (2), rejected (1), currentaction (1) | Parsed from PDF text |
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
| MASTER-052-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-052-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-052-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 36 |
| Workflow Signal Count | 7 |
| Notes | - |
