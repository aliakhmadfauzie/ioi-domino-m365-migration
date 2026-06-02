# Master App PDF Source - Master List of Service Provider

> Master row: 220 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 220 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Master List of Service Provider | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related \| PHBSVR | Source inventory |
| Form List | MSP2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFSERV | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/007_oleObject85.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2962 | 32 | 25 | Master List of Service Providers |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | right for second submission onwards for approval. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Dd2_1 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Sd2_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Dd2_2 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Sd2_2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Dd2_3 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Sd2_3 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Dd2_4 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Sd2_4 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Dd2_5 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Sd2_5 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No | MSPNo | Text | 1 | Parsed from PDF text |
| 2 | Department | Department | Text | 1 | Parsed from PDF text |
| 3 | HOD/HODiv | HOD | Person/Text | 1 | Parsed from PDF text |
| 4 | Type of Service | Service | Choice/Text | 1 | Parsed from PDF text |
| 5 | Supplier/Vendor Name | Supplier | Person/Text | 1 | Parsed from PDF text |
| 6 | Remark | Scope | Multiline Text | 1 | Parsed from PDF text |
| 7 | applicable) | VAR | Text | 1 | Parsed from PDF text |
| 8 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 9 | INO | INO | Text | 1 | Parsed from PDF text |
| 10 | ISG | ISG | Text | 1 | Parsed from PDF text |
| 11 | PUR Manager | PURMGR | Text | 1 | Parsed from PDF text |
| 12 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 13 | QA Manager | QA | Text | 1 | Parsed from PDF text |
| 14 | FST Members | FST | Text | 1 | Parsed from PDF text |
| 15 | HOD Editor | HODEditor | Person/Text | 1 | Parsed from PDF text |
| 16 | PUR Editor | PUREditor | Text | 1 | Parsed from PDF text |
| 17 | QA Editor | QAEditor | Text | 1 | Parsed from PDF text |
| 18 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 19 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 20 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 21 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 22 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 23 | Reply Count | Reply | Text | 1 | Parsed from PDF text |
| 24 | Reminder PIC | RemPIC | Person/Text | 1 | Parsed from PDF text |
| 25 | SP Duedate | SPDD | Date/Text | 1 | Parsed from PDF text |
| 26 | Certificate Duedate | CLDD | Date/Text | 1 | Parsed from PDF text |
| 27 | Reminder status (1st time) | ReminderStatus | Choice/Text | 1 | Parsed from PDF text |
| 28 | (New Validity date - 7 days) | RemDate1st | Date/Text | 1 | Parsed from PDF text |
| 29 | (every 2 days) | NextRemDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Reminder status (renewal) | RenStatus | Choice/Text | 1 | Parsed from PDF text |
| 31 | Populate the next reminder date | UpcmgRemDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Editor - Renewal | Editor1_1 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submit (9), hod (6), status (5), approved (3), approval (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `MASTOFSERV`
Child-list recommendation: `MainDB_PUR_Ext_MASTOFSERV_Rows` candidate for repeating row fields

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
| MASTER-220-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-220-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-220-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 32 |
| Workflow Signal Count | 25 |
| Notes | - |
