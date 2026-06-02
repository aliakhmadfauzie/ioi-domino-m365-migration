# Master App PDF Source - IQMS-MQP (IOI)

> Master row: 259 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 259 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IQMS-MQP (IOI) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | newverificationV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IQMSMQP | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/032_oleObject264.pdf | Extracted embedded PDF | sheet_order_fallback | 0.379 | Explicit mapping | 5 | 2389 | 20 | 6 | Page 1 of 5 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 3 | VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | TITLE | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
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

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verification (2), status (2), verified (1), approval (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IQMSMQP`
Child-list recommendation: `MainDB_QA_Ext_IQMSMQP_Rows` candidate for repeating row fields

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
| MASTER-259-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-259-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-259-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 20 |
| Workflow Signal Count | 6 |
| Notes | - |
