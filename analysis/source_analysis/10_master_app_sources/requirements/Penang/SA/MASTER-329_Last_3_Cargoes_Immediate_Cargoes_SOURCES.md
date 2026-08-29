# Master App PDF Source - Last 3 Cargoes/Immediate Cargoes

> Master row: 329 | Site: Penang | Owner: SA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 329 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Last 3 Cargoes/Immediate Cargoes | Clearly Found |
| Owner | SA | Clearly Found |
| Department | SlsAdmin \| IMS Related \| PHBSVR | Source inventory |
| Form List | CargoesV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | LAST3CARG | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SlsAdmin/001_oleObject15.pdf | Extracted embedded PDF | text_match_high | 0.756 | Explicit mapping | 2 | 947 | 31 | 5 | LAST 3 / IMMEDIATE CARGOES |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Last 3 / Immediate Cargoes | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 3 | S/O Details | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 5 | QC Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | Qcd-61/060322/00 | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section A: AEditor1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section B: AEditor2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section C: AEditor3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section A & B | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Running Number | FormNo | Text | 1 | Parsed from PDF text |
| 2 | Requested by | Initiator | Text | 1 | Parsed from PDF text |
| 3 | Date requested | DateReq | Date/Text | 1 | Parsed from PDF text |
| 4 | present to work. | SendTo | Date/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | S/O Details | SODetails | Text | 1 | Parsed from PDF text |
| 7 | Vehicle Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 8 | Vehicle No | No | Text | 1 | Parsed from PDF text |
| 9 | Shipment ETA Date | ETADate | Date/Text | 1 | Parsed from PDF text |
| 10 | Vessel Name | VesselName | Person/Text | 1 | Parsed from PDF text |
| 11 | Last 3/Immediate Cargoes | CargoesDetails | Text | 1 | Parsed from PDF text |
| 12 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 13 | Chemist | AppBy | Text | 1 | Parsed from PDF text |
| 14 | Date Approved | DateApp | Date/Text | 1 | Parsed from PDF text |
| 15 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 16 | Due date | AppDueDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Cancel | CancelStatus | Choice/Text | 1 | Parsed from PDF text |
| 18 | By Whom | ByWhom | Text | 1 | Parsed from PDF text |
| 19 | Date Cancelled | DateCancelled | Date/Text | 1 | Parsed from PDF text |
| 20 | Reason | Reasons | Multiline Text | 1 | Parsed from PDF text |
| 21 | Editors | Authors; CDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 23 | Currentaction | CurrentAction | Text | 1 | Parsed from PDF text |
| 24 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 25 | Default CC List | Defcc | Text | 1 | Parsed from PDF text |
| 26 | QC List | QC | Text | 1 | Parsed from PDF text |
| 27 | Reminder CC | CC1 | Text | 1 | Parsed from PDF text |
| 28 | Section A | AEditor1 | Text | 1 | Parsed from PDF text |
| 29 | Section B | AEditor2 | Text | 1 | Parsed from PDF text |
| 30 | Section C | AEditor3 | Text | 1 | Parsed from PDF text |
| 31 | Section A & B | AEditor4 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), currentaction (2), approved (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SA`
FormCode: `LAST3CARG`
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
| MASTER-329-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-329-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-329-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 31 |
| Workflow Signal Count | 5 |
| Notes | - |
