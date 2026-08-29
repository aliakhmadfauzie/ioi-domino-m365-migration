# Master App PDF Source - Staff Requisition

> Master row: 154 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 154 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Staff Requisition | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| IMS Related \| PHBSVR | Source inventory |
| Form List | SRF - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | SR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/023_oleObject229.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 7 | 3857 | 25 | 16 | IOI OLEOCHEMICAL INDUSTRIES BERHAD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries Berhad | Inferred from PDF text | Needs Human Confirmation |
| 2 | (29994-D) | Inferred from PDF text | Needs Human Confirmation |
| 3 | Staff Requisition Application | Inferred from PDF text | Needs Human Confirmation |
| 4 | A. Justification | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | If replacement, please indicate details of last incumbent | Inferred from PDF text | Needs Human Confirmation |
| 7 | (For Department/Division /Section | Inferred from PDF text | Needs Human Confirmation |
| 8 | B. Job Specifications | Inferred from PDF text | Needs Human Confirmation |
| 9 | C. Endorsing Authority | Inferred from PDF text | Needs Human Confirmation |
| 10 | D. Verifying Authority | Inferred from PDF text | Needs Human Confirmation |
| 11 | E. Approving Authority | Inferred from PDF text | Needs Human Confirmation |
| 12 | Hos/Hod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | NO | tRunningNumber | Text | 1 | Parsed from PDF text |
| 2 | To be endorsed by Dept. Head | Optional | Text | 1 | Parsed from PDF text |
| 3 | cooTitle2 ) | COO; Optional | Text | 1 | Parsed from PDF text |
| 4 | Date | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Endorsed by Department Head | tDeptHeadName | Person/Text | 1 | Parsed from PDF text |
| 6 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks1 | Multiline Text | 1 | Parsed from PDF text |
| 8 | Remarks | RemarksCOO | Multiline Text | 1 | Parsed from PDF text |
| 9 | Remarks | Remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 10 | Remarks | Remarks3 | Multiline Text | 1 | Parsed from PDF text |
| 11 | Date Required | RequiredDate | Date/Text | 1 | Parsed from PDF text |
| 12 | HOS/HOD | HOS | Person/Text | 1 | Parsed from PDF text |
| 13 | Current Status | CurrentStatus | Choice/Text | 1 | Parsed from PDF text |
| 14 | Editors 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 15 | Editors 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 16 | Editors 2a | Editor2a | Text | 1 | Parsed from PDF text |
| 17 | Editors 2b | Editor2b | Text | 1 | Parsed from PDF text |
| 18 | Editors 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 19 | Editors 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 20 | Editors 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 21 | HR | HR | Text | 1 | Parsed from PDF text |
| 22 | HR Role | HRADMIN | Text | 1 | Parsed from PDF text |
| 23 | ED | ED | Text | 1 | Parsed from PDF text |
| 24 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |
| 25 | Next Reminder Date | NextRemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (9), hod (3), submitted (2), verified (2) | Parsed from PDF text |
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
| MASTER-154-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-154-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-154-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 25 |
| Workflow Signal Count | 16 |
| Notes | - |
