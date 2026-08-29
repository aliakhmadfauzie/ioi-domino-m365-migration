# Master App PDF Source - PanCen - QC Info

> Master row: 105 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 105 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - QC Info | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PCNSVR | Source inventory |
| Form List | PT - Form \| QCInfo - Form \| SAP Info - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QC | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/011_oleObject174.pdf | Extracted embedded PDF | sheet_order_fallback | 0.377 | Explicit mapping | 2 | 1103 | 13 | 4 | PT PROGRAM |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/018_oleObject181.pdf | Extracted embedded PDF | text_match_high | 0.753 | Explicit mapping | 1 | 357 | 14 | 2 | PANCEN QC INFORMATION |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/019_oleObject182.pdf | Extracted embedded PDF | text_match_high | 0.763 | Explicit mapping | 1 | 262 | 10 | 0 | QC SAP INFO |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pt Program | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - PLAN | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - REPORT | Inferred from PDF text | Needs Human Confirmation |
| 4 | P_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | A_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | P_2_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | A_2_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | P_3_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | A_3_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | P_4_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | A_4_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | P_5_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Created by | CreatedBy | Text | 1 | Parsed from PDF text |
| 2 | Created on | CreatedOn | Text | 1 | Parsed from PDF text |
| 3 | Year | Year | Text | 1 | Parsed from PDF text |
| 4 | PT Program | PT | Text | 1 | Parsed from PDF text |
| 5 | Discarded Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Reason | DisReason | Multiline Text | 1 | Parsed from PDF text |
| 7 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 8 | IT | IT | Text | 1 | Parsed from PDF text |
| 9 | QC | QC | Text | 1 | Parsed from PDF text |
| 10 | QC HOD | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 11 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 12 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 13 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 14 | To | Send | Text | 1 | Parsed from PDF text |
| 15 | CC | CC | Text | 1 | Parsed from PDF text |
| 16 | Topic | Topic | Person/Text | 1 | Parsed from PDF text |
| 17 | Title | Subject | Text | 1 | Parsed from PDF text |
| 18 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 19 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 20 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 21 | Remarks | QCRemarks | Multiline Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 23 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 24 | Section Control | Lock | Text | 1 | Parsed from PDF text |
| 25 | Manager | ISG | Text | 1 | Parsed from PDF text |
| 26 | QCAdmin | QCAdmin | Text | 1 | Parsed from PDF text |
| 27 | WhoCanRead | AllowableReader | Text | 1 | Parsed from PDF text |
| 28 | TCode | TCode | Text | 1 | Parsed from PDF text |
| 29 | Title | Title | Text | 1 | Parsed from PDF text |
| 30 | Scenario/Problem Description | ProblemDesc | Multiline Text | 1 | Parsed from PDF text |
| 31 | Troubleshooting | Troubleshooting | Text | 1 | Parsed from PDF text |
| 32 | Solution | Solution | Text | 1 | Parsed from PDF text |
| 33 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 34 | Solution given by | SolvedBy | Text | 1 | Parsed from PDF text |
| 35 | Date solved | DateSolved | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (2), currentaction (2), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `QC`
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
| MASTER-105-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-105-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-105-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 6 |
| Notes | - |
