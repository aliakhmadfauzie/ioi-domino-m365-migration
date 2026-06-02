# Master App PDF Source - PanCen - Late Coming Notification

> Master row: 12 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 12 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Late Coming Notification | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | FormLate - Form \| FormLateEmp - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | NDF | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/007_oleObject22.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1266 | 24 | 20 | Late Coming Notification Form |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/008_oleObject23.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1149 | 24 | 20 | Late Coming Notification Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - EMPLOYEE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B - REPLIED SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | Reply | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C - HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION D - HR ACCEPTANCE | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION E - HR HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section D | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section E | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Employee Name | Name | Person/Text | 1 | Parsed from PDF text |
| 2 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Department | Department | Text | 1 | Parsed from PDF text |
| 4 | Late In Date | Date | Date/Text | 1 | Parsed from PDF text |
| 5 | Late In Time | Time | Text | 1 | Parsed from PDF text |
| 6 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 7 | CC | CC | Text | 1 | Parsed from PDF text |
| 8 | Superior/HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 9 | Submitted by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 10 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 12 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 13 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 14 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 15 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 16 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 17 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 18 | VisibleTo | DocView | Text | 1 | Parsed from PDF text |
| 19 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 20 | Admin | ADMIN | Text | 1 | Parsed from PDF text |
| 21 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 22 | HR Admin | HR | Text | 1 | Parsed from PDF text |
| 23 | HR Admin 2 | HR2 | Text | 1 | Parsed from PDF text |
| 24 | INO | INO; INO2 | Text | 1 | Parsed from PDF text |
| 25 | Reason for the lateness | Reason | Multiline Text | 1 | Parsed from PDF text |
| 26 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 27 | TempStatus | FA | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (10), approve (6), reject (6), status (6), submitted (4), approval (4), currentaction (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `NDF`
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
| MASTER-012-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-012-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-012-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 40 |
| Notes | - |
