# Master App PDF Source - Store Incoming Delivery Schedule (Packaging Materials)

> Master row: 341 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 341 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Store Incoming Delivery Schedule (Packaging Materials) | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| PHBSVR | Source inventory |
| Form List | Plan - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORINCODELI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/001_oleObject35.pdf | Extracted embedded PDF | sheet_order_fallback | 0.377 | Explicit mapping | 3 | 1625 | 15 | 1 | Store Incoming Delivery |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | San Miguel Yamamura Woven Products | Inferred from PDF text | Needs Human Confirmation |
| 2 | Schutz (Malaysia) Sdn Bhd | Inferred from PDF text | Needs Human Confirmation |
| 3 | Stanta Mauser (Malaysia) Sdn Bhd | Inferred from PDF text | Needs Human Confirmation |
| 4 | Greif Malaysia Sdn Bhd | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mat | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CopyTo | Text | 1 | Parsed from PDF text |
| 3 | (ETA - Estimate Time Arrival) | DateFrom | Date/Text | 1 | Parsed from PDF text |
| 4 | Packaging Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 5 | Vendor Name | Vendor | Person/Text | 1 | Parsed from PDF text |
| 6 | PO. No. | PO | Number/Text | 1 | Parsed from PDF text |
| 7 | (if applicable) | Pallet | Text | 1 | Parsed from PDF text |
| 8 | IT | IT | Text | 1 | Parsed from PDF text |
| 9 | Store | ST | Text | 1 | Parsed from PDF text |
| 10 | Procurement | PR | Text | 1 | Parsed from PDF text |
| 11 | Materials HOD | MAT | Person/Text | 1 | Parsed from PDF text |
| 12 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 13 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 14 | Delivery Date List | DateList | Date/Text | 1 | Parsed from PDF text |
| 15 | Date Transform | DateTransform | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STORINCODELI`
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
| MASTER-341-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-341-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-341-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 1 |
| Notes | - |
