# Master App PDF Source - PanCen - Workers Hostel Room Checking

> Master row: 19 | Site: Johor | Owner: SEC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 19 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Workers Hostel Room Checking | Clearly Found |
| Owner | SEC | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | frmHostel2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | WORKHOSTROOM | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/016_oleObject31.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 6 | 4639 | 23 | 8 | Company |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Workers Hostel Room Checking | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A : INSPECTION DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | Hostel: | Inferred from PDF text | Needs Human Confirmation |
| 4 | Block: | Inferred from PDF text | Needs Human Confirmation |
| 5 | Room: | Inferred from PDF text | Needs Human Confirmation |
| 6 | Date Checking: | Inferred from PDF text | Needs Human Confirmation |
| 7 | Available: | Inferred from PDF text | Needs Human Confirmation |
| 8 | If Unavailable [Remarks]: | Inferred from PDF text | Needs Human Confirmation |
| 9 | Bikash Lama | Inferred from PDF text | Needs Human Confirmation |
| 10 | E1841 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Birendra Kurmi | Inferred from PDF text | Needs Human Confirmation |
| 12 | E1833 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Name | ChkName | Person/Text | 1 | Parsed from PDF text |
| 2 | Date | ChkDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Name | HRName | Person/Text | 1 | Parsed from PDF text |
| 4 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Remarks | HRRem | Multiline Text | 1 | Parsed from PDF text |
| 6 | Status | VerStatus | Choice/Text | 1 | Parsed from PDF text |
| 7 | Name | VerName | Person/Text | 1 | Parsed from PDF text |
| 8 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Remarks | VerRem | Multiline Text | 1 | Parsed from PDF text |
| 10 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Remarks | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 13 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 14 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 15 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 17 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 18 | Editor3 | Editor4 | Text | 1 | Parsed from PDF text |
| 19 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 20 | HR | HR | Text | 1 | Parsed from PDF text |
| 21 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 22 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 23 | Reminder | ReminderDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), approver (2), verified (1), approved (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SEC`
FormCode: `WORKHOSTROOM`
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
| MASTER-019-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-019-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-019-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 23 |
| Workflow Signal Count | 8 |
| Notes | - |
