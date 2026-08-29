# Master App PDF Source - 5SIR

> Master row: 304 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 304 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | 5SIR | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | 5SIR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/001_oleObject150.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1052 | 21 | 3 | 5S IMPROVEMENT REQUEST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | 5S IMPROVEMENT REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | 5SIR Request | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Cc3 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Cpa | Inferred from PDF text | Needs Human Confirmation |
| 6 | Withdrawn Section: | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | OFINo | Number/Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Initiator | Requestor | Person/Text | 1 | Parsed from PDF text |
| 4 | Recipient | Recipient; NoIdRecipient | Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Observation | DateAudit | Date/Text | 1 | Parsed from PDF text |
| 7 | Location | Location1 | Text | 1 | Parsed from PDF text |
| 8 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 11 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 12 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 13 | Description | PDesc | Multiline Text | 1 | Parsed from PDF text |
| 14 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 15 | Date | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 16 | CC | CC3 | Text | 1 | Parsed from PDF text |
| 17 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 18 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 20 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 21 | Remarks | WDCom | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), review (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `5SIR`
Child-list recommendation: `MainDB_SHE_Ext_5SIR_Rows` candidate for repeating row fields

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
| MASTER-304-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-304-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-304-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 3 |
| Notes | - |
