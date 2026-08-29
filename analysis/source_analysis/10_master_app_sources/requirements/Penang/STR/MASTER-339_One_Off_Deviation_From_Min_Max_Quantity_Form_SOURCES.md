# Master App PDF Source - One-Off Deviation From Min/Max Quantity Form

> Master row: 339 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 339 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | One-Off Deviation From Min/Max Quantity Form | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| PHBSVR | Source inventory |
| Form List | AppOneOff - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ONEOFFDEVI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/005_oleObject39.pdf | Extracted embedded PDF | text_match_medium | 0.539 | Explicit mapping | 4 | 2025 | 42 | 13 | One-Off Deviation From Min/Max |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Requestor's section: | Inferred from PDF text | Needs Human Confirmation |
| 2 | Zspa Zcon Zprc Znpr | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Uom | Inferred from PDF text | Needs Human Confirmation |
| 4 | Uom_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Wu1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Note: Approval will be routed to COO if the value of per item is >=RM5K. | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 8 | Head of Dept's Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Head of Division's Approval | Inferred from PDF text | Needs Human Confirmation |
| 10 | Updated by Store Section | Inferred from PDF text | Needs Human Confirmation |
| 11 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 12 | Mat Mgr | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Req No | ReqNum | Text | 1 | Parsed from PDF text |
| 2 | Material Number | MatNum | Text | 1 | Parsed from PDF text |
| 3 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 4 | Material Desc. | MatDesc | Text | 1 | Parsed from PDF text |
| 5 | UOM | UOM | Text | 1 | Parsed from PDF text |
| 6 | Current Min | Min | Text | 1 | Parsed from PDF text |
| 7 | Current Max | Max | Text | 1 | Parsed from PDF text |
| 8 | (per unit as per last PO price) | Value | Number/Text | 1 | Parsed from PDF text |
| 9 | required | Add1 | Text | 1 | Parsed from PDF text |
| 10 | Where used | WU1 | Text | 1 | Parsed from PDF text |
| 11 | Justification | Justify_1 | Multiline Text | 1 | Parsed from PDF text |
| 12 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 13 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 14 | Head of Division | HODiv | Person/Text | 1 | Parsed from PDF text |
| 15 | Name | Requestor | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 17 | Chk cost >RM5Kl | ChkCost | Number/Text | 1 | Parsed from PDF text |
| 18 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Comments | HODComment | Person/Text | 1 | Parsed from PDF text |
| 21 | Name | HODivName | Person/Text | 1 | Parsed from PDF text |
| 22 | Date | HODivDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Comments | HODivComments | Person/Text | 1 | Parsed from PDF text |
| 24 | Name | COOApp | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 26 | Comments | COOComments | Multiline Text | 1 | Parsed from PDF text |
| 27 | Status | COOAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 28 | Name | MATApp | Person/Text | 1 | Parsed from PDF text |
| 29 | Date | MATDateApp | Date/Text | 1 | Parsed from PDF text |
| 30 | Comments | MATComment | Multiline Text | 1 | Parsed from PDF text |
| 31 | status | MATStatus | Choice/Text | 1 | Parsed from PDF text |
| 32 | PR No. | PRNo | Number/Text | 1 | Parsed from PDF text |
| 33 | PR Created date | PRDate | Date/Text | 1 | Parsed from PDF text |
| 34 | PR Created by | PRCreatedBy | Text | 1 | Parsed from PDF text |
| 35 | Updated By | StoreName | Date/Text | 1 | Parsed from PDF text |
| 36 | Date | StoreUpdtDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Remarks | StoreRemarks | Multiline Text | 1 | Parsed from PDF text |
| 38 | Comments | CommentsInitiator | Multiline Text | 1 | Parsed from PDF text |
| 39 | Status | DisStatus | Choice/Text | 1 | Parsed from PDF text |
| 40 | Attachment | DisAtt | Text | 1 | Parsed from PDF text |
| 41 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Done by | DisDone | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (5), approval (3), hod (3), currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `ONEOFFDEVI`
Child-list recommendation: `MainDB_STR_Ext_ONEOFFDEVI_Rows` candidate for repeating row fields

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
| MASTER-339-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-339-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-339-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 42 |
| Workflow Signal Count | 13 |
| Notes | - |
