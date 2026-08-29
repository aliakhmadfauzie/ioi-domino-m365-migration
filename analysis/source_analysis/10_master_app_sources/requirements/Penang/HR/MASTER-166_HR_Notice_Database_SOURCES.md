# Master App PDF Source - HR Notice Database

> Master row: 166 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 166 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | HR Notice Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Intern - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | HRINFO | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/015_oleObject221.pdf | Extracted embedded PDF | sheet_order_fallback | 0.380 | Explicit mapping | 2 | 633 | 13 | 4 | INDUSTRIAL TRAINEES (IOI Scholars) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Summary | Inferred from PDF text | Needs Human Confirmation |
| 2 | Year Award | Inferred from PDF text | Needs Human Confirmation |
| 3 | Contact No. (H/P) | Inferred from PDF text | Needs Human Confirmation |
| 4 | University/ College | Inferred from PDF text | Needs Human Confirmation |
| 5 | Course Title | Inferred from PDF text | Needs Human Confirmation |
| 6 | Course Duration | Inferred from PDF text | Needs Human Confirmation |
| 7 | Training Start | Inferred from PDF text | Needs Human Confirmation |
| 8 | Training End | Inferred from PDF text | Needs Human Confirmation |
| 9 | Bond Period (Yrs) | Inferred from PDF text | Needs Human Confirmation |
| 10 | Date Joined | Inferred from PDF text | Needs Human Confirmation |
| 11 | Job Posting (Ioi Hq | Inferred from PDF text | Needs Human Confirmation |
| 12 | DETAILS) | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | YEAR AWARD | Year | Text | 1 | Parsed from PDF text |
| 2 | NAME | Name | Person/Text | 1 | Parsed from PDF text |
| 3 | CONTACT NO. (H/P) | Contact | Number/Text | 1 | Parsed from PDF text |
| 4 | UNIVERSITY/ COLLEGE | University | Text | 1 | Parsed from PDF text |
| 5 | COURSE TITLE | Course | Text | 1 | Parsed from PDF text |
| 6 | TRAINING START | TrainingStart | Text | 1 | Parsed from PDF text |
| 7 | TRAINING END | TrainingEnd | Text | 1 | Parsed from PDF text |
| 8 | BOND PERIOD (YRS) | Bond | Text | 1 | Parsed from PDF text |
| 9 | DATE JOINED | DateJoin | Date/Text | 1 | Parsed from PDF text |
| 10 | COMPANY | Company | Text | 1 | Parsed from PDF text |
| 11 | DEPARTMENT / SECTION | Department | Text | 1 | Parsed from PDF text |
| 12 | EMPLOYMENT STATUS | EmpStatus | Choice/Text | 1 | Parsed from PDF text |
| 13 | LAST DAY OF SERVICE | LastDay | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), status (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HRINFO`
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
| MASTER-166-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-166-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-166-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 4 |
| Notes | - |
