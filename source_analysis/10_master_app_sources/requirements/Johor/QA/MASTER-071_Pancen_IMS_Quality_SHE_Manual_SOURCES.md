# Master App PDF Source - Pancen - IMS-Quality & SHE Manual

> Master row: 71 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 71 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - IMS-Quality & SHE Manual | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA | Source inventory |
| Form List | Pancen - IMS-Quality & SHE Manual | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IMSQUALSHE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/002_oleObject106.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/003_oleObject107.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 4502 | 13 | 10 | MASTERLIST OF KRA/KPI REPORTS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/025_oleObject129.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/026_oleObject130.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 4502 | 13 | 10 | MASTERLIST OF KRA/KPI REPORTS |

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
| 12 | KRA/KPI Report | Template | Text | 1 | Parsed from PDF text |
| 13 | Any new/tighten KRA/KPI? | NewTighten | Text | 1 | Parsed from PDF text |
| 14 | Total number of KRA/KPI | TotalKK | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (16), approved (8), review (8), reviewed (4), currentaction (4) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IMSQUALSHE`
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
| MASTER-071-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-071-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-071-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 14 |
| Workflow Signal Count | 40 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
