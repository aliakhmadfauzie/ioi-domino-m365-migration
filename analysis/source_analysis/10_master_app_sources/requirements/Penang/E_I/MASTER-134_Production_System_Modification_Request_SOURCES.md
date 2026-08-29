# Master App PDF Source - Production System Modification Request

> Master row: 134 | Site: Penang | Owner: E&I | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 134 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Production System Modification Request | Clearly Found |
| Owner | E&I | Clearly Found |
| Department | E&I | Source inventory |
| Form List | Production System Modification Request | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PRODMODI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/E&I/PRODSYSMOD.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.500 | HCL fallback needs review | 3 | 1379 | 28 | 17 | Production System |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Modification Request | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section 1 - Requestor's Information | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 4 | QA Section - QA Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section 2 - Requestor's HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Section 3 - Verification by Facilities HOD | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section 4 - E&I Department PIC Use | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section 5 - Requestor Acceptance | Inferred from PDF text | Needs Human Confirmation |
| 9 | Fachod | Inferred from PDF text | Needs Human Confirmation |
| 10 | Qa Hod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Qahod | Inferred from PDF text | Needs Human Confirmation |
| 12 | Rpoapp | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | EngNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Area | Area | Text | 1 | Parsed from PDF text |
| 4 | Problem | Prob | Text | 1 | Parsed from PDF text |
| 5 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 6 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 7 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 8 | Status | QAStatus | Choice/Text | 1 | Parsed from PDF text |
| 9 | Name | QAName | Person/Text | 1 | Parsed from PDF text |
| 10 | Date | QADate | Date/Text | 1 | Parsed from PDF text |
| 11 | Comments | QAComments | Multiline Text | 1 | Parsed from PDF text |
| 12 | Status | StatusHOD | Person/Text | 1 | Parsed from PDF text |
| 13 | Name | DeptHead | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | EDHDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Comments | Comments1 | Multiline Text | 1 | Parsed from PDF text |
| 16 | Status | StatusHOD2 | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | EDHDate2 | Date/Text | 1 | Parsed from PDF text |
| 18 | Comments | Comments2 | Multiline Text | 1 | Parsed from PDF text |
| 19 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 20 | Name | PICName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | PICDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 23 | Remarks/Attachment | Comments3 | Multiline Text | 1 | Parsed from PDF text |
| 24 | Status | StatusAccept | Choice/Text | 1 | Parsed from PDF text |
| 25 | Name | RequestorName | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | RequestedDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Comments | Comments4 | Multiline Text | 1 | Parsed from PDF text |
| 28 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (6), status (6), approval (2), verification (1), ca (1), approver (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_E&I`
FormCode: `PRODMODI`
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
| MASTER-134-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-134-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-134-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 28 |
| Workflow Signal Count | 17 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
