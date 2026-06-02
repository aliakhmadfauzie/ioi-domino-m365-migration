# Master App PDF Source - Absent From Training Form

> Master row: 344 | Site: Penang | Owner: T&D | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 344 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Absent From Training Form | Clearly Found |
| Owner | T&D | Clearly Found |
| Department | T&D \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ABSETRAI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/T_D/001_oleObject106.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 930 | 22 | 6 | ABSENT FROM TRAINING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Absent From Training | Inferred from PDF text | Needs Human Confirmation |
| 2 | EMPLOYEE & TRAINING DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | Reply By Superior/Employee | Inferred from PDF text | Needs Human Confirmation |
| 5 | Reply | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Name of Absentee | Name | Person/Text | 1 | Parsed from PDF text |
| 4 | Employee Number | EmpNo | Text | 1 | Parsed from PDF text |
| 5 | Department/Section | Dept | Text | 1 | Parsed from PDF text |
| 6 | Position | Position | Text | 1 | Parsed from PDF text |
| 7 | Training Title | Title | Text | 1 | Parsed from PDF text |
| 8 | Training Date | Date | Date/Text | 1 | Parsed from PDF text |
| 9 | Time | Time | Text | 1 | Parsed from PDF text |
| 10 | Venue | Venue | Text | 1 | Parsed from PDF text |
| 11 | Trainer | Trainer | Text | 1 | Parsed from PDF text |
| 12 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 13 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 14 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 15 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 16 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 17 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 18 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 19 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 20 | T&D | TND | Text | 1 | Parsed from PDF text |
| 21 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 22 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), hod (1), approve (1), reject (1), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_T&D`
FormCode: `ABSETRAI`
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
| MASTER-344-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-344-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-344-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 22 |
| Workflow Signal Count | 6 |
| Notes | - |
