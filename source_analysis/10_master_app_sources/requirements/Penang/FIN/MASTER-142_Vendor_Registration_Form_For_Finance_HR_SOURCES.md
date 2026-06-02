# Master App PDF Source - Vendor Registration Form (For Finance & HR)

> Master row: 142 | Site: Penang | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 142 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Vendor Registration Form (For Finance & HR) | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | Fin | Source inventory |
| Form List | Vendor Registration Form (For Finance & HR) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDREGIFINA | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/PRC/VRF1.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.033 | HCL fallback needs review | 4 | 2147 | 48 | 18 | NEW VENDOR |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/PRC/VRF2.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.033 | HCL fallback needs review | 3 | 1078 | 22 | 7 | CHANGE VENDOR |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | New Vendor | Inferred from PDF text | Needs Human Confirmation |
| 2 | Registration | Inferred from PDF text | Needs Human Confirmation |
| 3 | REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION A : REQUESTOR | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B : PROCUREMENT | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B1 : ACCEPTANCE AND CREATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | ESKER profile creation details :- | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION B2 : VERIFICATION SECTION | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION C1 : FINANCE UPDATE | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION C2 : FINANCE CONFIRMATION | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION D : IT UPDATE | Inferred from PDF text | Needs Human Confirmation |
| 12 | WITHDRAWN SECTION | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Running Number | NotNum | Text | 1 | Parsed from PDF text |
| 2 | Date Created | Date | Date/Text | 1 | Parsed from PDF text |
| 3 | SECTION A | REQUESTOR | Person/Text | 1 | Parsed from PDF text |
| 4 | Company | Comp | Text | 1 | Parsed from PDF text |
| 5 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Department | Dept | Text | 1 | Parsed from PDF text |
| 8 | Vendor Name | VenName | Person/Text | 1 | Parsed from PDF text |
| 9 | Vendor Registration Form | Att | Text | 1 | Parsed from PDF text |
| 10 | SECTION B | PROCUREMENT | Text | 1 | Parsed from PDF text |
| 11 | Status | ACC | Choice/Text | 1 | Parsed from PDF text |
| 12 | Vendor Number | VenNo | Text | 1 | Parsed from PDF text |
| 13 | Type | VenNew | Choice/Text | 1 | Parsed from PDF text |
| 14 | Purchasing Organization | PurOrg | Text | 1 | Parsed from PDF text |
| 15 | Name | FName | Person/Text | 1 | Parsed from PDF text |
| 16 | ne No. | Phone | Number/Text | 1 | Parsed from PDF text |
| 17 | City | City | Text | 1 | Parsed from PDF text |
| 18 | Name | LName | Person/Text | 1 | Parsed from PDF text |
| 19 | Fax No. | Fax | Number/Text | 1 | Parsed from PDF text |
| 20 | State | State | Text | 1 | Parsed from PDF text |
| 21 | Name | FullName | Person/Text | 1 | Parsed from PDF text |
| 22 | Name | Street | Person/Text | 1 | Parsed from PDF text |
| 23 | Name | AcpName | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | AcpDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Rejected By | RejBy | Text | 1 | Parsed from PDF text |
| 26 | Rejected Date | RejDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Reason for rejection | RejReason | Multiline Text | 1 | Parsed from PDF text |
| 28 | Rejected By | RejBy_1 | Text | 1 | Parsed from PDF text |
| 29 | Rejected Date | RejDate_1 | Date/Text | 1 | Parsed from PDF text |
| 30 | Reason for rejection | RejReason_1 | Multiline Text | 1 | Parsed from PDF text |
| 31 | Rejected By | RejBy_2 | Text | 1 | Parsed from PDF text |
| 32 | Rejected Date | RejDate_2 | Date/Text | 1 | Parsed from PDF text |
| 33 | Reason for rejection | RejReason_2 | Multiline Text | 1 | Parsed from PDF text |
| 34 | Name | B2Name | Person/Text | 1 | Parsed from PDF text |
| 35 | Position | B2Post | Text | 1 | Parsed from PDF text |
| 36 | Date | B2Date | Date/Text | 1 | Parsed from PDF text |
| 37 | Name | FinName | Person/Text | 1 | Parsed from PDF text |
| 38 | Position | FinPost | Text | 1 | Parsed from PDF text |
| 39 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 40 | Name | FinName2 | Person/Text | 1 | Parsed from PDF text |
| 41 | Position | FinPost2 | Text | 1 | Parsed from PDF text |
| 42 | Date | FinDate2 | Date/Text | 1 | Parsed from PDF text |
| 43 | Name | ITName | Person/Text | 1 | Parsed from PDF text |
| 44 | Date | ITDate | Date/Text | 1 | Parsed from PDF text |
| 45 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 46 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 47 | Performed By | WDBy | Text | 1 | Parsed from PDF text |
| 48 | Performed Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 49 | Require Finance Update | ReqFin | Date/Text | 1 | Parsed from PDF text |
| 50 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 51 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 52 | Submitted by | ReqName | Person/Text | 1 | Parsed from PDF text |
| 53 | Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 54 | SECTION B | FINANCE | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (8), rejected (6), status (4), submitted (2), currentaction (2), ca (2), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `VENDREGIFINA`
Child-list recommendation: `MainDB_FIN_Ext_VENDREGIFINA_Rows` candidate for repeating row fields

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
| MASTER-142-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-142-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-142-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 54 |
| Workflow Signal Count | 25 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
