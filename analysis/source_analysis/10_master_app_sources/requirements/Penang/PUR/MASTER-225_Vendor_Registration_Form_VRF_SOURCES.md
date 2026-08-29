# Master App PDF Source - Vendor Registration Form (VRF)

> Master row: 225 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 225 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Vendor Registration Form (VRF) | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related \| PHBSVR | Source inventory |
| Form List | VQA_Log_New - Form \| frmVendor2 - Form \| ChgVendor2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDREGIVRF | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/018_oleObject96.pdf | Extracted embedded PDF | sheet_order_fallback | 0.380 | Explicit mapping | 2 | 827 | 14 | 3 | VQA Issue log |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/019_oleObject97.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2147 | 48 | 18 | NEW VENDOR |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/020_oleObject98.pdf | Extracted embedded PDF | text_match_high | 0.381 | Explicit mapping | 3 | 1078 | 22 | 7 | CHANGE VENDOR |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pur Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | Purhod | Inferred from PDF text | Needs Human Confirmation |
| 3 | Qa Hod | Inferred from PDF text | Needs Human Confirmation |
| 4 | Qahod | Inferred from PDF text | Needs Human Confirmation |
| 5 | New Vendor | Inferred from PDF text | Needs Human Confirmation |
| 6 | Registration | Inferred from PDF text | Needs Human Confirmation |
| 7 | REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION A : REQUESTOR | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION B : PROCUREMENT | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION B1 : ACCEPTANCE AND CREATION | Inferred from PDF text | Needs Human Confirmation |
| 11 | ESKER profile creation details :- | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION B2 : VERIFICATION SECTION | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Log No | Year | Text | 1 | Parsed from PDF text |
| 2 | Category | CategoryName | Person/Text | 1 | Parsed from PDF text |
| 3 | Name of Vendor | VendorName | Person/Text | 1 | Parsed from PDF text |
| 4 | Period Appraised | Period; Year_1 | Text | 1 | Parsed from PDF text |
| 5 | Product/Service Supplied | ProductName | Person/Text | 1 | Parsed from PDF text |
| 6 | Site | Site | Text | 1 | Parsed from PDF text |
| 7 | Department | Department | Text | 1 | Parsed from PDF text |
| 8 | Issue Category | IssueCategory | Choice/Text | 1 | Parsed from PDF text |
| 9 | Description of Issue | Desc | Multiline Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 11 | relevant personnel) | CC | Text | 1 | Parsed from PDF text |
| 12 | Name | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 13 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 14 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Running Number | NotNum | Text | 1 | Parsed from PDF text |
| 16 | Date Created | Date | Date/Text | 1 | Parsed from PDF text |
| 17 | SECTION A | REQUESTOR | Person/Text | 1 | Parsed from PDF text |
| 18 | Company | Comp | Text | 1 | Parsed from PDF text |
| 19 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 20 | CC | CC | Text | 1 | Parsed from PDF text |
| 21 | Department | Dept | Text | 1 | Parsed from PDF text |
| 22 | Vendor Name | VenName | Person/Text | 1 | Parsed from PDF text |
| 23 | Vendor Registration Form | Att | Text | 1 | Parsed from PDF text |
| 24 | SECTION B | PROCUREMENT | Text | 1 | Parsed from PDF text |
| 25 | Status | ACC | Choice/Text | 1 | Parsed from PDF text |
| 26 | Vendor Number | VenNo | Text | 1 | Parsed from PDF text |
| 27 | Type | VenNew | Choice/Text | 1 | Parsed from PDF text |
| 28 | Purchasing Organization | PurOrg | Text | 1 | Parsed from PDF text |
| 29 | Name | FName | Person/Text | 1 | Parsed from PDF text |
| 30 | ne No. | Phone | Number/Text | 1 | Parsed from PDF text |
| 31 | City | City | Text | 1 | Parsed from PDF text |
| 32 | Name | LName | Person/Text | 1 | Parsed from PDF text |
| 33 | Fax No. | Fax | Number/Text | 1 | Parsed from PDF text |
| 34 | State | State | Text | 1 | Parsed from PDF text |
| 35 | Name | FullName | Person/Text | 1 | Parsed from PDF text |
| 36 | Name | Street | Person/Text | 1 | Parsed from PDF text |
| 37 | Name | AcpName | Person/Text | 1 | Parsed from PDF text |
| 38 | Date | AcpDate | Date/Text | 1 | Parsed from PDF text |
| 39 | Rejected By | RejBy | Text | 1 | Parsed from PDF text |
| 40 | Rejected Date | RejDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Reason for rejection | RejReason | Multiline Text | 1 | Parsed from PDF text |
| 42 | Rejected By | RejBy_1 | Text | 1 | Parsed from PDF text |
| 43 | Rejected Date | RejDate_1 | Date/Text | 1 | Parsed from PDF text |
| 44 | Reason for rejection | RejReason_1 | Multiline Text | 1 | Parsed from PDF text |
| 45 | Rejected By | RejBy_2 | Text | 1 | Parsed from PDF text |
| 46 | Rejected Date | RejDate_2 | Date/Text | 1 | Parsed from PDF text |
| 47 | Reason for rejection | RejReason_2 | Multiline Text | 1 | Parsed from PDF text |
| 48 | Name | B2Name | Person/Text | 1 | Parsed from PDF text |
| 49 | Position | B2Post | Text | 1 | Parsed from PDF text |
| 50 | Date | B2Date | Date/Text | 1 | Parsed from PDF text |
| 51 | Name | FinName | Person/Text | 1 | Parsed from PDF text |
| 52 | Position | FinPost | Text | 1 | Parsed from PDF text |
| 53 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Name | FinName2 | Person/Text | 1 | Parsed from PDF text |
| 55 | Position | FinPost2 | Text | 1 | Parsed from PDF text |
| 56 | Date | FinDate2 | Date/Text | 1 | Parsed from PDF text |
| 57 | Name | ITName | Person/Text | 1 | Parsed from PDF text |
| 58 | Date | ITDate | Date/Text | 1 | Parsed from PDF text |
| 59 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 60 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 61 | Performed By | WDBy | Text | 1 | Parsed from PDF text |
| 62 | Performed Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 63 | Require Finance Update | ReqFin | Date/Text | 1 | Parsed from PDF text |
| 64 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 65 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 66 | Submitted by | ReqName | Person/Text | 1 | Parsed from PDF text |
| 67 | Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 68 | SECTION B | FINANCE | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (10), rejected (6), status (4), currentaction (3), submitted (2), ca (2), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VENDREGIVRF`
Child-list recommendation: `MainDB_PUR_Ext_VENDREGIVRF_Rows` candidate for repeating row fields

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
| MASTER-225-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-225-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-225-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 68 |
| Workflow Signal Count | 28 |
| Notes | - |
