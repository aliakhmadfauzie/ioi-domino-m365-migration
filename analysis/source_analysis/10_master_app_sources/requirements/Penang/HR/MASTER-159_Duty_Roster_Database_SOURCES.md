# Master App PDF Source - Duty Roster Database

> Master row: 159 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 159 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Duty Roster Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | FormDR2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | DRD | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/004_oleObject210.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 2 | 1432 | 33 | 9 | DUTY ROSTER DATABASE |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Duty Roster Database | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Standard | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section Head | Inferred from PDF text | Needs Human Confirmation |
| 6 | HOS APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 7 | HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section HOS | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section HOD | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section HR | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Comp | Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Section Head | HOS | Text | 1 | Parsed from PDF text |
| 5 | Department Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Month | Month | Text | 1 | Parsed from PDF text |
| 8 | Year | Year | Text | 1 | Parsed from PDF text |
| 9 | Attachments | Attch | Text | 1 | Parsed from PDF text |
| 10 | Amended Copy | Amend | Text | 1 | Parsed from PDF text |
| 11 | Employee Name | EmpName | Person/Text | 1 | Parsed from PDF text |
| 12 | Created By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 13 | Created On | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Name | HOSName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | HOSDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Remark | HOSRemark | Multiline Text | 1 | Parsed from PDF text |
| 17 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remark | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 20 | Name | HRName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 23 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 24 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 25 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 26 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 27 | HOS App | HOSApp | Text | 1 | Parsed from PDF text |
| 28 | HOD App | HODApp | Person/Text | 1 | Parsed from PDF text |
| 29 | HR App | HRApp | Text | 1 | Parsed from PDF text |
| 30 | HR | HR | Text | 1 | Parsed from PDF text |
| 31 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 32 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 33 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), approval (2), submitted (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `DRD`
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
| MASTER-159-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-159-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-159-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 33 |
| Workflow Signal Count | 9 |
| Notes | - |
