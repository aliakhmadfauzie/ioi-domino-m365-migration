# Master App PDF Source - Talent Management - Planning & Update

> Master row: 148 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 148 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Talent Management - Planning & Update | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR | Source inventory |
| Form List | Talent Management - Planning & Update | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | TMPU | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/TMPU.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.200 | HCL fallback high confidence | 7 | 4417 | 45 | 35 | Talent Management |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | 1) Initiation (By Hr) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | Pic / Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pic2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | 2) Nomination (By Pic) | Inferred from PDF text | Needs Human Confirmation |
| 8 | 2) Readiness Analysis | Inferred from PDF text | Needs Human Confirmation |
| 9 | 2.1 Strengths | Inferred from PDF text | Needs Human Confirmation |
| 10 | 2.2 Leadership Competencies | Inferred from PDF text | Needs Human Confirmation |
| 11 | Rating | Inferred from PDF text | Needs Human Confirmation |
| 12 | Level | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Photo | Photo | Text | 1 | Parsed from PDF text |
| 2 | Employee Name | FullName | Person/Text | 1 | Parsed from PDF text |
| 3 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 4 | *Date of Birth | DOB | Date/Text | 1 | Parsed from PDF text |
| 5 | Age | Age | Text | 1 | Parsed from PDF text |
| 6 | *Company | Company | Text | 1 | Parsed from PDF text |
| 7 | *Division | Div | Text | 1 | Parsed from PDF text |
| 8 | *Department | Dept | Text | 1 | Parsed from PDF text |
| 9 | *Job Title | JobTitle | Text | 1 | Parsed from PDF text |
| 10 | *Job Grade | JobGrade | Text | 1 | Parsed from PDF text |
| 11 | *Date Joined | DateJoin | Date/Text | 1 | Parsed from PDF text |
| 12 | current position | DateComm | Date/Text | 1 | Parsed from PDF text |
| 13 | *Years in current Job Title | Year | Text | 1 | Parsed from PDF text |
| 14 | *Employee Email | Email | Text | 1 | Parsed from PDF text |
| 15 | Experience | HighEdu | Text | 1 | Parsed from PDF text |
| 16 | PIC / HOD | PIC | Person/Text | 1 | Parsed from PDF text |
| 17 | PIC / HOD | PIC2 | Person/Text | 1 | Parsed from PDF text |
| 18 | Personal Mastery | Adaptability | Text | 1 | Parsed from PDF text |
| 19 | Personal Mastery | Influence | Text | 1 | Parsed from PDF text |
| 20 | Business Mastery | Innovation | Text | 1 | Parsed from PDF text |
| 21 | Nominated by | NName | Person/Text | 1 | Parsed from PDF text |
| 22 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 23 | Designation | NDesign | Text | 1 | Parsed from PDF text |
| 24 | *Turnover Risk | Turnover | Text | 1 | Parsed from PDF text |
| 25 | *Learning Orientation | LearnOri | Text | 1 | Parsed from PDF text |
| 26 | *Ability to Lead | AbilityLead | Text | 1 | Parsed from PDF text |
| 27 | *Potential | Potential | Text | 1 | Parsed from PDF text |
| 28 | Division Head | HODiv | Person/Text | 1 | Parsed from PDF text |
| 29 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 31 | Designation | HODDesg | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | HODivDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Name | HODivName | Person/Text | 1 | Parsed from PDF text |
| 34 | Designation | HODivDesg | Person/Text | 1 | Parsed from PDF text |
| 35 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Name | HRName | Person/Text | 1 | Parsed from PDF text |
| 37 | Designation | HRDesg | Text | 1 | Parsed from PDF text |
| 38 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 39 | Name | COOName | Person/Text | 1 | Parsed from PDF text |
| 40 | Designation | COODesg | Text | 1 | Parsed from PDF text |
| 41 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Name | EDName | Person/Text | 1 | Parsed from PDF text |
| 43 | Designation | EDDesg | Text | 1 | Parsed from PDF text |
| 44 | Status | HRStatus | Choice/Text | 1 | Parsed from PDF text |
| 45 | Remarks | HRRem | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (9), hod (8), approve (5), reject (5), submitted (2), approver (2), verification (1), approval (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `TMPU`
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
| MASTER-148-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-148-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-148-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 45 |
| Workflow Signal Count | 35 |
| Notes | - |
