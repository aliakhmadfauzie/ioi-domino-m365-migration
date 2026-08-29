# Master App PDF Source - Energy Management System Manual (EnMS)

> Master row: 199 | Site: Penang | Owner: E&I | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 199 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Energy Management System Manual (EnMS) | Clearly Found |
| Owner | E&I | Clearly Found |
| Department | Maint \| PHBSVR | Source inventory |
| Form List | NewQM - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENERMANUENMS | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/002_oleObject27.pdf | Extracted embedded PDF | sheet_order_fallback | 0.005 | Explicit mapping | 4 | 2296 | 36 | 18 | Page 1 of 4 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. :SNoD (static text) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 4 | Submitted for approval on DateSubmitted | Inferred from PDF text | Needs Human Confirmation |
| 5 | : K1 - K2 - K4 - K9 - K3 - K6 - K7 - K8 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Required Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 9 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 10 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Date Issue | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 4 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 5 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 6 | Reply Status | A1replied | Choice/Text | 1 | Parsed from PDF text |
| 7 | Pending for App | K1; K2; K4; K9 | Text | 1 | Parsed from PDF text |
| 8 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 9 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 10 | Rejected Status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 11 | Approvers | App1 | Person/Text | 1 | Parsed from PDF text |
| 12 | CC | QANames | Person/Text | 1 | Parsed from PDF text |
| 13 | Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 14 | Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 15 | Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 16 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 17 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 18 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 19 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 20 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 21 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 22 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 23 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 25 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 26 | QA | QA | Text | 1 | Parsed from PDF text |
| 27 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 28 | CC | CC | Text | 1 | Parsed from PDF text |
| 29 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 30 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 31 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 32 | Maillist for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 33 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 34 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 35 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 36 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), approval (5), approved (2), review (2), submitted (1), rejected (1), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_E&I`
FormCode: `ENERMANUENMS`
Child-list recommendation: `MainDB_E&I_Ext_ENERMANUENMS_Rows` candidate for repeating row fields

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
| MASTER-199-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-199-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-199-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 36 |
| Workflow Signal Count | 18 |
| Notes | - |
