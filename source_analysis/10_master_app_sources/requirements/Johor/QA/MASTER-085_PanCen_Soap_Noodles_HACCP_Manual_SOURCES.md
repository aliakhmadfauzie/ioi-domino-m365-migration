# Master App PDF Source - PanCen - Soap Noodles HACCP Manual

> Master row: 85 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 85 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Soap Noodles HACCP Manual | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | newapp1 - Form \| newcontrol - Form \| newentry - Form \| newvalidation - Form \| newverification - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SOAPNOODHACC | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/052_oleObject156.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1460 | 27 | 6 | Page 1 of 3 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/053_oleObject157.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1053 | 26 | 4 | Page 1 of 3 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/054_oleObject158.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 938 | 26 | 3 | Page 1 of 2 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/055_oleObject159.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2332 | 26 | 5 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/056_oleObject160.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2334 | 26 | 6 | Page 1 of 4 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Soap Noodles Haccp Manual | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. : SNoD (static text) | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | Title | Inferred from PDF text | Needs Human Confirmation |
| 5 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 6 | Record Of Issues : | Inferred from PDF text | Needs Human Confirmation |
| 7 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 8 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 9 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 12 | Verification Authority | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Date Issue | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 3 | Section No. | SectionNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 7 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 8 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 9 | Approval | Author_VER | Text | 1 | Parsed from PDF text |
| 10 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 11 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 12 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 13 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 15 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 16 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 17 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 18 | QA | QA | Text | 1 | Parsed from PDF text |
| 19 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 20 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 21 | MailingList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 22 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 23 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 24 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 25 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 26 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 27 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 28 | TITLE | doctitle | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (10), status (8), review (2), verified (2), reviewed (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `SOAPNOODHACC`
Child-list recommendation: `MainDB_QA_Ext_SOAPNOODHACC_Rows` candidate for repeating row fields

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
| MASTER-085-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-085-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-085-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 5 |
| Parsed Field Count | 28 |
| Workflow Signal Count | 24 |
| Notes | - |
