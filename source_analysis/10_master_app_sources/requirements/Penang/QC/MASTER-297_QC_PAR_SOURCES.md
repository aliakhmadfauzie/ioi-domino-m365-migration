# Master App PDF Source - QC PAR

> Master row: 297 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 297 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | QC PAR | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PHBSVR | Source inventory |
| Form List | ecmpds - Form \| Feedback - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QCPAR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/004_oleObject175.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 4 | 1799 | 27 | 16 | title |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/008_oleObject179.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 1 | 388 | 11 | 1 | QA INFO - Feedback |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Requestor's Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approval Required :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Reference No. | PSCNo | Number/Text | 1 | Parsed from PDF text |
| 2 | PDS | PDS | Text | 1 | Parsed from PDF text |
| 3 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 4 | Date prepared | predate | Date/Text | 1 | Parsed from PDF text |
| 5 | Date verified | veridate | Date/Text | 1 | Parsed from PDF text |
| 6 | Changes required by MKT Exec. | commentDH | Multiline Text | 1 | Parsed from PDF text |
| 7 | Date | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 8 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 9 | Comment | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 10 | Comment | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 11 | Status | statusapp1 | Choice/Text | 1 | Parsed from PDF text |
| 12 | Status | statusapp2 | Choice/Text | 1 | Parsed from PDF text |
| 13 | Date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 14 | Date | dateapp4 | Date/Text | 1 | Parsed from PDF text |
| 15 | Comment | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 16 | Comment | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Status | statusapp3 | Choice/Text | 1 | Parsed from PDF text |
| 18 | Status | statusapp4 | Choice/Text | 1 | Parsed from PDF text |
| 19 | Date | dateapp5 | Date/Text | 1 | Parsed from PDF text |
| 20 | Comment | Comment5 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Status | statusapp5 | Choice/Text | 1 | Parsed from PDF text |
| 22 | PDS No. | PDSNo | Number/Text | 1 | Parsed from PDF text |
| 23 | Notified date | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Status | DisStatus | Choice/Text | 1 | Parsed from PDF text |
| 25 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Done by | DisDone | Text | 1 | Parsed from PDF text |
| 27 | Creation date | CDate | Date/Text | 1 | Parsed from PDF text |
| 28 | QA Info No. | QAInfoNo1 | Number/Text | 1 | Parsed from PDF text |
| 29 | QA Info No. | QAInfoNo2 | Number/Text | 1 | Parsed from PDF text |
| 30 | Notification No. | InfoNo | Number/Text | 1 | Parsed from PDF text |
| 31 | Notified Date | NotifiedDate1 | Date/Text | 1 | Parsed from PDF text |
| 32 | Document L | ink | Text | 1 | Parsed from PDF text |
| 33 | Information/ idea/ finding | Idea | Text | 1 | Parsed from PDF text |
| 34 | Attachment | Idea2 | Text | 1 | Parsed from PDF text |
| 35 | Currenr Action | CA | Text | 1 | Parsed from PDF text |
| 36 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 37 | QA | QA | Text | 1 | Parsed from PDF text |
| 38 | IT | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (7), verified (2), approved (2), review (2), approval (1), reviewed (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `QCPAR`
Child-list recommendation: No child list inferred from parsed field names; confirm during design

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
| MASTER-297-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-297-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-297-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 17 |
| Notes | - |
