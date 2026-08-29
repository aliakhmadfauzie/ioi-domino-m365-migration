# Master App PDF Source - Maintenance Plan

> Master row: 197 | Site: Penang | Owner: MTN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 197 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Maintenance Plan | Clearly Found |
| Owner | MTN | Clearly Found |
| Department | Maint \| IMS Related \| PHBSVR | Source inventory |
| Form List | MPForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MAINPLAN | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/005_oleObject30.pdf | Extracted embedded PDF | sheet_order_fallback | 0.393 | Explicit mapping | 3 | 1135 | 24 | 12 | Maintenance Plan |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B : Acceptance | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION C : FaciliƟes Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION D : Maintenance Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 6 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section D | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section E | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ecm E&I | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ecmei | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ecmfac | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ecmmat | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Serial No | txtSrNo | Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Company | Company | Text | 1 | Parsed from PDF text |
| 4 | Equipment Name | EqName | Person/Text | 1 | Parsed from PDF text |
| 5 | Main Work Center | MWC | Text | 1 | Parsed from PDF text |
| 6 | Cycle | Cycle | Text | 1 | Parsed from PDF text |
| 7 | Remark | Others | Multiline Text | 1 | Parsed from PDF text |
| 8 | PM job description | PMJD | Multiline Text | 1 | Parsed from PDF text |
| 9 | Next Triggering | TMonth; TYear | Text | 1 | Parsed from PDF text |
| 10 | Justification/ Reason | JustReason | Multiline Text | 1 | Parsed from PDF text |
| 11 | Acceptance | AcceptedBy | Text | 1 | Parsed from PDF text |
| 12 | Requestor | Requester | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 14 | SECTION B | Acceptance | Text | 1 | Parsed from PDF text |
| 15 | Accepted By | AccBy | Text | 1 | Parsed from PDF text |
| 16 | Date | AccDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Remarks | SecBRem | Multiline Text | 1 | Parsed from PDF text |
| 18 | Rejected By | AppBy | Text | 1 | Parsed from PDF text |
| 19 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remarks | SecCRem | Multiline Text | 1 | Parsed from PDF text |
| 21 | Maintenance Plan | MPlan | Text | 1 | Parsed from PDF text |
| 22 | Acknowledged By | AckBy | Text | 1 | Parsed from PDF text |
| 23 | Date | AckDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Remarks | SecDRem | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approver (7), approval (1), approved (1), rejected (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MTN`
FormCode: `MAINPLAN`
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
| MASTER-197-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-197-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-197-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 12 |
| Notes | - |
