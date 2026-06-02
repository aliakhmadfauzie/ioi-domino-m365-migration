# Master App PDF Source - Food Defense Manual (IOIOI)

> Master row: 248 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 248 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Food Defense Manual (IOIOI) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewQMv5 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FOODDEFEMANU | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/030_oleObject262.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1321 | 24 | 3 | Page 1 of 3 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verification | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 2 | Document Title | DocTitle | Text | 1 | Parsed from PDF text |
| 3 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 5 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 6 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 7 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 8 | Verification | Author_Ver | Text | 1 | Parsed from PDF text |
| 9 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 10 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 11 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 13 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 14 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 15 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 16 | QA | QA | Text | 1 | Parsed from PDF text |
| 17 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 18 | MailList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 19 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 20 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 21 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 22 | Quality Council Email | QualityCManagers | Text | 1 | Parsed from PDF text |
| 23 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 24 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (1), approval (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `FOODDEFEMANU`
Child-list recommendation: `MainDB_QA_Ext_FOODDEFEMANU_Rows` candidate for repeating row fields

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
| MASTER-248-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-248-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-248-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 3 |
| Notes | - |
