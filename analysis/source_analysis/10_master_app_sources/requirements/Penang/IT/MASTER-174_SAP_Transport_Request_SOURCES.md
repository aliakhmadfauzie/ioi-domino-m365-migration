# Master App PDF Source - SAP Transport Request

> Master row: 174 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 174 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Transport Request | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| Critical App \| PHBSVR | Source inventory |
| Form List | TRForm2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPTRAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/026_oleObject147.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2384 | 64 | 17 | SAP Transport Request Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SAP Transport Request Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | Request Num : ReqNum | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section A : Transport Request from (IED to IEQ), (IBD to IBQ), (IED to IEQ to IEP)... | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section B : Transport Request from IEQ to IEP or IBQ to IBP | Inferred from PDF text | Needs Human Confirmation |
| 5 | Mailing List - Send for Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Editor 1 - Section A | Inferred from PDF text | Needs Human Confirmation |
| 7 | Editor 2 - Section B (Main) | Inferred from PDF text | Needs Human Confirmation |
| 8 | Editor 3 - Section C | Inferred from PDF text | Needs Human Confirmation |
| 9 | Editor 4 - Section D | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request Num | ReqNum | Text | 1 | Parsed from PDF text |
| 2 | TR Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Development Type | DevCategory | Choice/Text | 1 | Parsed from PDF text |
| 4 | Phase | Phase | Text | 1 | Parsed from PDF text |
| 5 | Client | Client | Text | 1 | Parsed from PDF text |
| 6 | Incident | IssueNum | Text | 1 | Parsed from PDF text |
| 7 | Transport Number | TRNumber | Text | 1 | Parsed from PDF text |
| 8 | Dependencies | TRDependant | Text | 1 | Parsed from PDF text |
| 9 | SAP Tcode | Tcode | Text | 1 | Parsed from PDF text |
| 10 | Fiori Apps | RptName | Person/Text | 1 | Parsed from PDF text |
| 11 | Changes done | ChangesDone | Text | 1 | Parsed from PDF text |
| 12 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 13 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 14 | Key User | KeyUser | Text | 1 | Parsed from PDF text |
| 15 | Owner | CCFuncOwner | Text | 1 | Parsed from PDF text |
| 16 | Requested By | RequestedBy | Text | 1 | Parsed from PDF text |
| 17 | Date submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 18 | Approved status | AppStatus | Person/Text | 1 | Parsed from PDF text |
| 19 | Approved by | AppBy | Person/Text | 1 | Parsed from PDF text |
| 20 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Transport Status | TRStatus | Choice/Text | 1 | Parsed from PDF text |
| 22 | Transported by | TRBy | Text | 1 | Parsed from PDF text |
| 23 | Comments | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 24 | Client | Client_1 | Text | 1 | Parsed from PDF text |
| 25 | Dependencies | TRDependant_1 | Text | 1 | Parsed from PDF text |
| 26 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 27 | have been signed off by | KeyUser_1 | Text | 1 | Parsed from PDF text |
| 28 | to IEP/IBP if any | IEPDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Remarks | UATAtt | Multiline Text | 1 | Parsed from PDF text |
| 30 | Functional Owner | FunctionalOwner_1 | Text | 1 | Parsed from PDF text |
| 31 | Date submitted | DateSubmitted_1 | Date/Text | 1 | Parsed from PDF text |
| 32 | Approved Status | AppStatus_1 | Person/Text | 1 | Parsed from PDF text |
| 33 | Approved by | AppBy_1 | Person/Text | 1 | Parsed from PDF text |
| 34 | Date Approved | dtApproved_1 | Date/Text | 1 | Parsed from PDF text |
| 35 | Comments | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 36 | Transport Status | TRStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 37 | Transported by | TRBy_1 | Text | 1 | Parsed from PDF text |
| 38 | Date Transported | dtTransport_1 | Date/Text | 1 | Parsed from PDF text |
| 39 | Comments | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 40 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 41 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 42 | Date Withdrawn | WDDate | Date/Text | 1 | Parsed from PDF text |
| 43 | Comments | Comment5 | Multiline Text | 1 | Parsed from PDF text |
| 44 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 45 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Req No | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 47 | Replacement | Replacement | Text | 1 | Parsed from PDF text |
| 48 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 49 | Kelly & Siew - 1stapprovar | FirstApprovar | Text | 1 | Parsed from PDF text |
| 50 | Ms. Khor & Ung - Transporter | Transporter | Text | 1 | Parsed from PDF text |
| 51 | Mailing List - Approve | MailA | Person/Text | 1 | Parsed from PDF text |
| 52 | Mailing List - Transport | MailB | Text | 1 | Parsed from PDF text |
| 53 | Mailing List - Send for Approval | MailC | Text | 1 | Parsed from PDF text |
| 54 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 55 | Clare | Clare | Text | 1 | Parsed from PDF text |
| 56 | Editor 1 - Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 57 | Editor 2 - Section B (Main) | Editor2 | Text | 1 | Parsed from PDF text |
| 58 | Editor 3 - Section C | Editor3 | Text | 1 | Parsed from PDF text |
| 59 | Editor 4 - Section D | Editor4 | Text | 1 | Parsed from PDF text |
| 60 | Editor 5 - Withdrawal | Editor5 | Text | 1 | Parsed from PDF text |
| 61 | Display Functional Name | ConvertName | Person/Text | 1 | Parsed from PDF text |
| 62 | Date Transported | DateTransported | Date/Text | 1 | Parsed from PDF text |
| 63 | Clients | Clients | Text | 1 | Parsed from PDF text |
| 64 | Date Transport | DateTransports | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), approved (5), submitted (2), currentaction (2), approve (1), approval (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SAPTRAN`
Child-list recommendation: `MainDB_IT_Ext_SAPTRAN_Rows` candidate for repeating row fields

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
| MASTER-174-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-174-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-174-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 64 |
| Workflow Signal Count | 17 |
| Notes | - |
