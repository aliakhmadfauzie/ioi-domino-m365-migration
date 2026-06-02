# Master App PDF Source - PanCen - Masterlist of Filter/Glass & Brittle Materials

> Master row: 68 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 68 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Masterlist of Filter/Glass & Brittle Materials | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA | Source inventory |
| Form List | NewVerification - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFFILT | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/020_oleObject124.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 1025 | 27 | 5 | Page 1 of 2 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Title | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approval : | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verification : | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Section No. | SectionNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 4 | TITLE | TitleForDoc | Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Current Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 7 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 8 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 9 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 10 | Verification | Author_Ver | Text | 1 | Parsed from PDF text |
| 11 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 12 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 13 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 15 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 16 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 17 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 18 | QA | QA | Text | 1 | Parsed from PDF text |
| 19 | QA | QA1 | Text | 1 | Parsed from PDF text |
| 20 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 21 | MailingList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 22 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 23 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 24 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 25 | Quality Council Email add | QualityCManagers | Text | 1 | Parsed from PDF text |
| 26 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 27 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), approval (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `MASTOFFILT`
Child-list recommendation: `MainDB_QA_Ext_MASTOFFILT_Rows` candidate for repeating row fields

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
| MASTER-068-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-068-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-068-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 5 |
| Notes | - |
