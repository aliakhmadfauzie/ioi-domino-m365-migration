# Master App PDF Source - GHS-SDS (NEW)

> Master row: 251 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 251 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | GHS-SDS (NEW) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | GHS-SDS (NEW) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | GHSSDS | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/020_oleObject252.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.700 | Embedded metadata fallback needs review | 2 | 1477 | 2 | 2 | Checklist for Qualifying Equipment with |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/041_oleObject273.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.700 | Embedded metadata fallback needs review | 13 | 6018 | 51 | 20 | 1/13 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/042_oleObject274.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 15 | 6500 | 50 | 19 | 1/15 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/040_oleObject272.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 9 | 7358 | 43 | 19 | Page 1 of 9 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Y/N/Na | Inferred from PDF text | Needs Human Confirmation |
| 2 | T : +60-4-376 8888 | Inferred from PDF text | Needs Human Confirmation |
| 3 | F : +60-4-390 7252 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 5 | Submitted for approval on DateSubmitted | Inferred from PDF text | Needs Human Confirmation |
| 6 | Listing Req'd Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | : K1 - K2 - K4 - K9 - K3 - K6 - K7 - K8 | Inferred from PDF text | Needs Human Confirmation |
| 8 | approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Equipment Name | EquipName | Person/Text | 1 | Parsed from PDF text |
| 2 | Location | CCLocation | Text | 1 | Parsed from PDF text |
| 3 | SDS No. | DN | Number/Text | 1 | Parsed from PDF text |
| 4 | Issue No. | IN | Number/Text | 1 | Parsed from PDF text |
| 5 | Date Issued | DateIssued | Date/Text | 1 | Parsed from PDF text |
| 6 | Date Review | DateReview | Date/Text | 1 | Parsed from PDF text |
| 7 | Group of Chemicals | Product | Text | 1 | Parsed from PDF text |
| 8 | Trade Name | TradeName | Person/Text | 1 | Parsed from PDF text |
| 9 | Name | CommercialName | Person/Text | 1 | Parsed from PDF text |
| 10 | Common Name/Other Name | CommonName | Person/Text | 1 | Parsed from PDF text |
| 11 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 12 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 13 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 14 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 15 | Listing Req'd Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 16 | Approved doc | txtStatus1 | Person/Text | 1 | Parsed from PDF text |
| 17 | Pending for App | K1; K2; K4; K9 | Text | 1 | Parsed from PDF text |
| 18 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 19 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 20 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 21 | Pending App - LCW | PdgApp | Text | 1 | Parsed from PDF text |
| 22 | Mailing List (CC) | QANames | Person/Text | 1 | Parsed from PDF text |
| 23 | Approvers | App1; App2; App4; App9 | Person/Text | 1 | Parsed from PDF text |
| 24 | Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 25 | nt | Dept | Text | 1 | Parsed from PDF text |
| 26 | Number | No | Text | 1 | Parsed from PDF text |
| 27 | SDS NO | DocNo | Text | 1 | Parsed from PDF text |
| 28 | ISSUE NO. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 29 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 30 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 31 | Allow Editing | Editors | Text | 1 | Parsed from PDF text |
| 32 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 33 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 34 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 35 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Yearly Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 38 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 39 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 40 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 41 | QA | QA | Text | 1 | Parsed from PDF text |
| 42 | QC | QC | Text | 1 | Parsed from PDF text |
| 43 | QA Backup | QAOthers | Text | 1 | Parsed from PDF text |
| 44 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 45 | MailingList - rejections | RejMail | Text | 1 | Parsed from PDF text |
| 46 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 47 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 48 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 49 | Quality Council | QualityCManagers | Text | 1 | Parsed from PDF text |
| 50 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 51 | Pancen Users | PCNTemp | Text | 1 | Parsed from PDF text |
| 52 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 53 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Product Name | Product | Person/Text | 1 | Parsed from PDF text |
| 55 | Status | Status1; Status2; Status3; Status4 | Choice/Text | 1 | Parsed from PDF text |
| 56 | Listing Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 57 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 58 | Pending App | PdgApp | Text | 1 | Parsed from PDF text |
| 59 | CC | QANames | Person/Text | 1 | Parsed from PDF text |
| 60 | Company | Company | Text | 1 | Parsed from PDF text |
| 61 | Department | Dept | Text | 1 | Parsed from PDF text |
| 62 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 63 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 64 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 65 | Quality Council Email add | QualityCManagers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (19), approval (14), review (10), approved (7), submitted (3), rejected (3), reviewed (3), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `GHSSDS`
Child-list recommendation: `MainDB_QA_Ext_GHSSDS_Rows` candidate for repeating row fields

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
| MASTER-251-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-251-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-251-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 65 |
| Workflow Signal Count | 60 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
