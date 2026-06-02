# Master App PDF Source - IQMS-POM (IOI)

> Master row: 260 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 260 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IQMS-POM (IOI) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | IQMS-POM (IOI) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IQMSPOM | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/031_oleObject263.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 2 | 1049 | 20 | 3 | Page 1 of 2 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/032_oleObject264.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 5 | 2389 | 20 | 6 | Page 1 of 5 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/057_oleObject289.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 9 | 5556 | 29 | 4 | Page 1 of 9 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Verification | Inferred from PDF text | Needs Human Confirmation |
| 5 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | Document Title | DocTitle | Text | 1 | Parsed from PDF text |
| 3 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 4 | Verification | Author_Ver | Text | 1 | Parsed from PDF text |
| 5 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 6 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 7 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 9 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 10 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 11 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 12 | QA | QA | Text | 1 | Parsed from PDF text |
| 13 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 14 | MailList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 15 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 16 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 17 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 18 | Quality Council Email | QualityCManagers | Text | 1 | Parsed from PDF text |
| 19 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 20 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 22 | Document Title | TitleDoc | Text | 1 | Parsed from PDF text |
| 23 | Document Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 24 | Department | Dept | Text | 1 | Parsed from PDF text |
| 25 | Number | No | Text | 1 | Parsed from PDF text |
| 26 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 27 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 28 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 29 | Allow Editing | Editors | Text | 1 | Parsed from PDF text |
| 30 | QA Backup | QAOthers | Text | 1 | Parsed from PDF text |
| 31 | MailingList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 32 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 33 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 34 | Quality Council Email add | QualityCManagers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), approval (3), verification (3), verified (1), review (1), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IQMSPOM`
Child-list recommendation: `MainDB_QA_Ext_IQMSPOM_Rows` candidate for repeating row fields

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
| MASTER-260-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-260-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-260-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 3 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 13 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
