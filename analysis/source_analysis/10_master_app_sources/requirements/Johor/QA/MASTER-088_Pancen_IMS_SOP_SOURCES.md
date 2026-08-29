# Master App PDF Source - Pancen - IMS - SOP

> Master row: 88 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 88 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - IMS - SOP | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | Pancen - IMS - SOP | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IMSSOP | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/030_oleObject134.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 13 | 7335 | 44 | 13 | Page 1 of 13 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/002_oleObject106.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/003_oleObject107.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 4502 | 13 | 10 | MASTERLIST OF KRA/KPI REPORTS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/025_oleObject129.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5239 | 11 | 10 | MASTERLIST OF FUNCTIONAL TEAM MEMBERS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/026_oleObject130.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 4502 | 13 | 10 | MASTERLIST OF KRA/KPI REPORTS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Title | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 3 | Submitted for approval on | Inferred from PDF text | Needs Human Confirmation |
| 4 | : K1 - K2 - K3 - K4 - K5 - K6 - K7 - K8 - K9 - K10 - K11 - K12 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Completed Approval list : TotalCount | Inferred from PDF text | Needs Human Confirmation |
| 6 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 7 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 4 | System | SysCode | Text | 1 | Parsed from PDF text |
| 5 | Document Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 6 | Department | Dept | Text | 1 | Parsed from PDF text |
| 7 | Number | No | Text | 1 | Parsed from PDF text |
| 8 | Business Area | Comp | Text | 1 | Parsed from PDF text |
| 9 | System | Sys | Text | 1 | Parsed from PDF text |
| 10 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 11 | Required Approvals list | TotalList | Number/Text | 1 | Parsed from PDF text |
| 12 | Pending for App | K1; K2; K3; K4 | Text | 1 | Parsed from PDF text |
| 13 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 14 | Completed Approval list | TotalCount | Number/Text | 1 | Parsed from PDF text |
| 15 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 16 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 17 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 18 | Pending App - QMR | PdgApp | Text | 1 | Parsed from PDF text |
| 19 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 20 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 21 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 22 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 23 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 24 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 25 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 26 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 27 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 29 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 30 | Reviewer | Reviewer | Text | 1 | Parsed from PDF text |
| 31 | QA | QA | Text | 1 | Parsed from PDF text |
| 32 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 33 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 34 | Internal Auditors | IA | Text | 1 | Parsed from PDF text |
| 35 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 36 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 37 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 38 | MailList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 39 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 40 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 41 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 42 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 43 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 44 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 45 | Running No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 46 | Revision No. | RevNum | Number/Text | 1 | Parsed from PDF text |
| 47 | Department/Section | DeptSection | Text | 1 | Parsed from PDF text |
| 48 | Approved by HOD | HODName | Person/Text | 1 | Parsed from PDF text |
| 49 | CC | CC | Text | 1 | Parsed from PDF text |
| 50 | Functional Leader | FuncLeadName; FuncLeader | Person/Text | 1 | Parsed from PDF text |
| 51 | Functional Immediate Superior | FuncImSupName; FuncImSup | Person/Text | 1 | Parsed from PDF text |
| 52 | Functional Members | FuncMembers; Note; Please | Text | 1 | Parsed from PDF text |
| 53 | Withdrawn by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 54 | Withdrawn on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 55 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 56 | KRA/KPI Report | Template | Text | 1 | Parsed from PDF text |
| 57 | Any new/tighten KRA/KPI? | NewTighten | Text | 1 | Parsed from PDF text |
| 58 | Total number of KRA/KPI | TotalKK | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (16), review (10), approved (9), reviewed (5), status (4), currentaction (4), approval (3), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IMSSOP`
Child-list recommendation: `MainDB_QA_Ext_IMSSOP_Rows` candidate for repeating row fields

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
| MASTER-088-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-088-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-088-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 5 |
| Parsed Field Count | 58 |
| Workflow Signal Count | 53 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
