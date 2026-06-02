# Master App PDF Source - PanCen - Company Uniform Request

> Master row: 9 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 9 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Company Uniform Request | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | PanCen - Company Uniform Request | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | CWR | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/HR/5_CompanyUniformRequest.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 5 | 1818 | 40 | 16 | PANCEN COMPANY UNIFORM REQUEST DATABASE |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/005_oleObject20.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 5 | 1818 | 40 | 16 | PANCEN COMPANY UNIFORM REQUEST DATABASE |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PANCEN COMPANY UNIFORM REQUEST DATABASE | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A – REQUESTER INFORMATION | Inferred from PDF text | Needs Human Confirmation |
| 3 | Request Type | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B – HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 5 | HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION C – HR VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | Verification | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION D – HR HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 9 | HR HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION E – COMPLETION OF ISSUANCE (BY HR PERSONNEL) | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Hrhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Uniform Type | UniType | Choice/Text | 1 | Parsed from PDF text |
| 3 | Request Type | ReqType | Number/Text | 1 | Parsed from PDF text |
| 4 | (As per the IC) | Name | Person/Text | 1 | Parsed from PDF text |
| 5 | Employee No | EmpNo | Text | 1 | Parsed from PDF text |
| 6 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 7 | Department | Dept | Text | 1 | Parsed from PDF text |
| 8 | Size | Size | Text | 1 | Parsed from PDF text |
| 9 | Quantity | Quantity | Number/Text | 1 | Parsed from PDF text |
| 10 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 11 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 12 | HOD Approval | HODAprrov | Person/Text | 1 | Parsed from PDF text |
| 13 | Remarks | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 14 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Verification | Verified | Person/Text | 1 | Parsed from PDF text |
| 17 | Last Issuance | LastIssuance | Text | 1 | Parsed from PDF text |
| 18 | Remarks | HRRemark | Multiline Text | 1 | Parsed from PDF text |
| 19 | Name | HRName | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | HRVerdate | Date/Text | 1 | Parsed from PDF text |
| 21 | HR HOD APPROVAL | Approved2 | Person/Text | 1 | Parsed from PDF text |
| 22 | Remarks | HRHODRemark | Person/Text | 1 | Parsed from PDF text |
| 23 | Name | HRHODName | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | HRHODDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Issued Date | IssuedDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Issued By | Issuedby | Text | 1 | Parsed from PDF text |
| 27 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 28 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 29 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 30 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 31 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 32 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 33 | HR PIC - Ahsha/Malini | HRPic | Person/Text | 1 | Parsed from PDF text |
| 34 | HR Ver - Kobi/Zubaidah | HRVer | Text | 1 | Parsed from PDF text |
| 35 | HR HOD - Wafli/Zubaidah | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 36 | IT | IT | Text | 1 | Parsed from PDF text |
| 37 | Reminder1 | reminder1 | Text | 1 | Parsed from PDF text |
| 38 | Reminder2 | reminder2 | Text | 1 | Parsed from PDF text |
| 39 | Reminder3 | reminder3 | Text | 1 | Parsed from PDF text |
| 40 | Reminder4 | reminder4 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (14), approval (8), verification (4), submitted (2), verified (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `CWR`
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
| MASTER-009-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-009-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-009-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 40 |
| Workflow Signal Count | 32 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
