# Master App PDF Source - PanCen - Canteen Complaint

> Master row: 8 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 8 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Canteen Complaint | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | frmComp - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CANTCOMP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/002_oleObject17.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 1231 | 38 | 9 | Company |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Canteen Complaint Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B : CANTEEN IN CHARGE | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C : CANTEEN ACTION PLAN | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approved By Canteen Pic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Verified By Canteen Advisor | Inferred from PDF text | Needs Human Confirmation |
| 7 | Hr Hod | Inferred from PDF text | Needs Human Confirmation |
| 8 | Hrhod | Inferred from PDF text | Needs Human Confirmation |
| 9 | Hr Pic | Inferred from PDF text | Needs Human Confirmation |
| 10 | Hrpic | Inferred from PDF text | Needs Human Confirmation |
| 11 | Comm2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 3 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 4 | Department | Dept | Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Type of complaint | TypeC | Choice/Text | 1 | Parsed from PDF text |
| 7 | Description of complaint | Complaint | Multiline Text | 1 | Parsed from PDF text |
| 8 | Attachment if any | Attch | Text | 1 | Parsed from PDF text |
| 9 | Name | CICName | Person/Text | 1 | Parsed from PDF text |
| 10 | Date | CICDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Remarks | CICRem | Multiline Text | 1 | Parsed from PDF text |
| 12 | Attachment if any | Attch2 | Text | 1 | Parsed from PDF text |
| 13 | Name | PICName | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | PICDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Comments | PICComm | Person/Text | 1 | Parsed from PDF text |
| 16 | Status | AdvStatus | Choice/Text | 1 | Parsed from PDF text |
| 17 | Name | AdvName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | AdvDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Comments | AdvComm | Multiline Text | 1 | Parsed from PDF text |
| 20 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 21 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 22 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 23 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 24 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 25 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 26 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 27 | Editor6 | Editor6 | Text | 1 | Parsed from PDF text |
| 28 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 29 | Def CC | DefCC | Text | 1 | Parsed from PDF text |
| 30 | COO | COO | Text | 1 | Parsed from PDF text |
| 31 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 32 | HR PIC | HRPIC | Person/Text | 1 | Parsed from PDF text |
| 33 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 34 | Cantenn Committee | COMM | Text | 1 | Parsed from PDF text |
| 35 | Cantenn Committee | COMM2 | Text | 1 | Parsed from PDF text |
| 36 | INO | INO | Text | 1 | Parsed from PDF text |
| 37 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 38 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), approved (1), verified (1), currentaction (1), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `CANTCOMP`
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
| MASTER-008-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-008-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-008-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 9 |
| Notes | - |
