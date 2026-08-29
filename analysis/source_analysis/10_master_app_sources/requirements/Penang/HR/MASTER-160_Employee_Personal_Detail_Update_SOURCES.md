# Master App PDF Source - Employee Personal Detail Update

> Master row: 160 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 160 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Employee Personal Detail Update | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Employee Personal Detail Update | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | EPDU | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/EPDU.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.300 | HCL fallback high confidence | 3 | 2318 | 35 | 10 | EMPLOYEE PERSONAL |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Employee Personal | Inferred from PDF text | Needs Human Confirmation |
| 2 | Detail Update - New | Inferred from PDF text | Needs Human Confirmation |
| 3 | (A) PERSONAL DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Nric_O | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Nric_N | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Epf | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Socso | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Itax | Inferred from PDF text | Needs Human Confirmation |
| 9 | (B) Employee Education Background | Inferred from PDF text | Needs Human Confirmation |
| 10 | (C) CHILDREN DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 11 | (D) FAMILY DETAILS - (PARENTS/GRANDPARENTS/PARENTS-IN-LAW/BROTHERS/SISTERS) | Inferred from PDF text | Needs Human Confirmation |
| 12 | Fdn_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Name | EmpName | Person/Text | 1 | Parsed from PDF text |
| 4 | NRIC No. (Old) | NRIC_O | Number/Text | 1 | Parsed from PDF text |
| 5 | NRIC No. (New) | NRIC_N | Number/Text | 1 | Parsed from PDF text |
| 6 | Marital Status | Marital | Choice/Text | 1 | Parsed from PDF text |
| 7 | Disabilities | Disabilities | Text | 1 | Parsed from PDF text |
| 8 | Permanent Address | Address1 | Text | 1 | Parsed from PDF text |
| 9 | Poscode | Poscode1 | Text | 1 | Parsed from PDF text |
| 10 | Tel No. | TelNo1 | Number/Text | 1 | Parsed from PDF text |
| 11 | Correspondence Address | Address2 | Text | 1 | Parsed from PDF text |
| 12 | Postcode | Poscode2 | Text | 1 | Parsed from PDF text |
| 13 | Tel No. | TelNo2 | Number/Text | 1 | Parsed from PDF text |
| 14 | EPF No. | EPF | Number/Text | 1 | Parsed from PDF text |
| 15 | SOCSO No. | SOCSO | Number/Text | 1 | Parsed from PDF text |
| 16 | Income Tax No. | ITAX | Number/Text | 1 | Parsed from PDF text |
| 17 | Name | SpName | Person/Text | 1 | Parsed from PDF text |
| 18 | NRIC No. (New) | SpNRIC_N | Number/Text | 1 | Parsed from PDF text |
| 19 | Working | SpWork | Text | 1 | Parsed from PDF text |
| 20 | Occupation(Optional) | SpOccupation | Text | 1 | Parsed from PDF text |
| 21 | Company | SpComp | Text | 1 | Parsed from PDF text |
| 22 | Contact Tel. No. | TelNo | Number/Text | 1 | Parsed from PDF text |
| 23 | Submitted by | Submittedby | Text | 1 | Parsed from PDF text |
| 24 | Submitted on | Submittedon | Text | 1 | Parsed from PDF text |
| 25 | Status | HRAction | Choice/Text | 1 | Parsed from PDF text |
| 26 | Accepted by | Acceptedby | Text | 1 | Parsed from PDF text |
| 27 | Accepted on | Acceptedon | Text | 1 | Parsed from PDF text |
| 28 | IT | IT | Text | 1 | Parsed from PDF text |
| 29 | HR 1 | HR_1 | Text | 1 | Parsed from PDF text |
| 30 | HR 2 | HR_2 | Text | 1 | Parsed from PDF text |
| 31 | HR 3 | HR_3 | Text | 1 | Parsed from PDF text |
| 32 | HR | HR | Text | 1 | Parsed from PDF text |
| 33 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 34 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 35 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (4), status (3), submit (2), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `EPDU`
Child-list recommendation: `MainDB_HR_Ext_EPDU_Rows` candidate for repeating row fields

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
| MASTER-160-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-160-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-160-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 10 |
| Notes | - |
