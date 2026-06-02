# Master App PDF Source - Pancen - ISO 17025 Manual

> Master row: 110 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 110 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - ISO 17025 Manual | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PCNSVR | Source inventory |
| Form List | DSM - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ISO1702MANU | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/005_oleObject168.pdf | Extracted embedded PDF | sheet_order_fallback | 0.252 | Explicit mapping | 1 | 293 | 9 | 2 | DSM AUDIT REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Dsm Audit Report | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Year | Year | Text | 1 | Parsed from PDF text |
| 2 | Distributed to | DisTo | Text | 1 | Parsed from PDF text |
| 3 | Audit Date | AuditDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Audit report | AuditReport | Text | 1 | Parsed from PDF text |
| 5 | Next audit date | NextAuditDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Reminder send to | RemSendTo | Date/Text | 1 | Parsed from PDF text |
| 7 | CA | CA | Text | 1 | Parsed from PDF text |
| 8 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 9 | IT | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `ISO1702MANU`
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
| MASTER-110-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-110-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-110-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 9 |
| Workflow Signal Count | 2 |
| Notes | - |
