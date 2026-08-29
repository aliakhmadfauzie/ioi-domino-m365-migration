# Master App PDF Source - PanCen - Manpower Requisition

> Master row: 13 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 13 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Manpower Requisition | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | PanCen - Manpower Requisition | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | SR | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/HR/8_manpowerReq.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 8 | 3408 | 49 | 46 | Manpower Requisition Form |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/009_oleObject24.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 8 | 3408 | 49 | 46 | Manpower Requisition Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | A. Justification | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | B. Job Specifications | Inferred from PDF text | Needs Human Confirmation |
| 4 | C. Department Head Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 5 | D. Division Head Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 6 | E. Hr Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 7 | F. HR VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 8 | G. COO VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 9 | H. DIRECTOR APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 10 | Admin | Inferred from PDF text | Needs Human Confirmation |
| 11 | Hr Hod | Inferred from PDF text | Needs Human Confirmation |
| 12 | Hrhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Comp | Text | 1 | Parsed from PDF text |
| 2 | dDept | Dept | Text | 1 | Parsed from PDF text |
| 3 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 4 | Head of Division | HODiv | Person/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 7 | Age | Age | Text | 1 | Parsed from PDF text |
| 8 | Gender | Gender | Text | 1 | Parsed from PDF text |
| 9 | Salary Range | SalaryRange | Text | 1 | Parsed from PDF text |
| 10 | Skill/Competency | Skill | Text | 1 | Parsed from PDF text |
| 11 | Requested by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 12 | Date | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Endorsed by | HODName | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Endorsed by | DivName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | DivDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Verified by | AckName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | AckDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Verified by | HRName | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Chief Operating Officer | COOName | Person/Text | 1 | Parsed from PDF text |
| 22 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 23 | Remarks | RemarksCOO | Multiline Text | 1 | Parsed from PDF text |
| 24 | Director | EDName | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Name of candidate | CandidateName | Date/Text | 1 | Parsed from PDF text |
| 27 | Withdrawn By | WDBy | Text | 1 | Parsed from PDF text |
| 28 | Withdrawn Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 30 | Current Status | CA | Choice/Text | 1 | Parsed from PDF text |
| 31 | Editors 1 - Requestor | Editor1 | Person/Text | 1 | Parsed from PDF text |
| 32 | Editors 2 - HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 33 | Editors 3 - HODiv | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 34 | Editors 4 - HR | Editor4 | Text | 1 | Parsed from PDF text |
| 35 | Editors 5 - HRHOD | Editor5 | Person/Text | 1 | Parsed from PDF text |
| 36 | Editors 6 - COO | Editor6 | Text | 1 | Parsed from PDF text |
| 37 | Editors 7 - ED | Editor7 | Text | 1 | Parsed from PDF text |
| 38 | Editors 8 - HR | Editor8 | Text | 1 | Parsed from PDF text |
| 39 | Admin | ADMIN | Text | 1 | Parsed from PDF text |
| 40 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 41 | HR Acknowledgement | HRACK | Text | 1 | Parsed from PDF text |
| 42 | HR | HR | Text | 1 | Parsed from PDF text |
| 43 | HR - View Only | HR2 | Text | 1 | Parsed from PDF text |
| 44 | COO | COO | Text | 1 | Parsed from PDF text |
| 45 | ED | ED | Text | 1 | Parsed from PDF text |
| 46 | ISADMIN | IT | Text | 1 | Parsed from PDF text |
| 47 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 48 | Temp Access | TEMPACCESS | Text | 1 | Parsed from PDF text |
| 49 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | reject (36), approve (24), status (14), hod (6), verified (4), verification (4), approval (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `SR`
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
| MASTER-013-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-013-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-013-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 49 |
| Workflow Signal Count | 92 |
| Notes | - |
