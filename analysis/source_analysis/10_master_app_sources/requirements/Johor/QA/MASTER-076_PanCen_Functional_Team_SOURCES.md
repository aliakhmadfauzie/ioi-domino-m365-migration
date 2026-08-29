# Master App PDF Source - PanCen - Functional Team

> Master row: 76 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 76 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Functional Team | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | Form_FTKRA - Form \| Form_HYP - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FUNCTEAM | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/002_oleObject106.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/004_oleObject108.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1229 | 13 | 7 | FUNCTIONAL TEAM HALF YEARLY PRESENTATION |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/025_oleObject129.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/027_oleObject131.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1229 | 13 | 7 | FUNCTIONAL TEAM HALF YEARLY PRESENTATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Masterlist Of Functional Team Members | Inferred from PDF text | Needs Human Confirmation |
| 2 | Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 4 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Ini_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_2_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Running No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Revision No. | RevNum | Number/Text | 1 | Parsed from PDF text |
| 3 | Department/Section | DeptSection | Text | 1 | Parsed from PDF text |
| 4 | Approved by HOD | HODName | Person/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Functional Leader | FuncLeadName; FuncLeader | Person/Text | 1 | Parsed from PDF text |
| 7 | Functional Immediate Superior | FuncImSupName; FuncImSup | Person/Text | 1 | Parsed from PDF text |
| 8 | Functional Members | FuncMembers; Note; Please | Text | 1 | Parsed from PDF text |
| 9 | Withdrawn by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 10 | Withdrawn on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 11 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 12 | Company | Company | Text | 1 | Parsed from PDF text |
| 13 | Business Area | Division | Text | 1 | Parsed from PDF text |
| 14 | Activity Month | ActivityPeriod | Choice/Text | 1 | Parsed from PDF text |
| 15 | Verified by HOD | HODName | Person/Text | 1 | Parsed from PDF text |
| 16 | Superior | FuncName | Person/Text | 1 | Parsed from PDF text |
| 17 | Presentation Slide) | Attachment | Text | 1 | Parsed from PDF text |
| 18 | Comments/Remarks (if any) | Comments | Multiline Text | 1 | Parsed from PDF text |
| 19 | Late Submission | LateSubmission | Text | 1 | Parsed from PDF text |
| 20 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 21 | Discarded on | DiscardedOn | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (16), approved (4), review (4), currentaction (4), verified (4), reviewed (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `FUNCTEAM`
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
| MASTER-076-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-076-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-076-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 4 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 34 |
| Notes | - |
