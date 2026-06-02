# Master App PDF Source - Room Arrangement Requisition (RAR)

> Master row: 130 | Site: Penang | Owner: ADM | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 130 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Room Arrangement Requisition (RAR) | Clearly Found |
| Owner | ADM | Clearly Found |
| Department | Admin | Source inventory |
| Form List | New Stationery Memo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ROOMREQURAR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Admin/003_oleObject3.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 1272 | 12 | 6 | <Computed Subform> |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stationery Requisition | Inferred from PDF text | Needs Human Confirmation |
| 2 | Requestor's section: | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval Info | Inferred from PDF text | Needs Human Confirmation |
| 4 | Issuance Details :- | Inferred from PDF text | Needs Human Confirmation |
| 5 | Mailing List after Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | IOIOI; Admin; Staff | Text | 1 | Parsed from PDF text |
| 2 | To be approved by (HOS/HOD) | nmAppby | Person/Text | 1 | Parsed from PDF text |
| 3 | Discarded by | DiscardBy; DiscardOn | Text | 1 | Parsed from PDF text |
| 4 | Reason | txtComment3 | Multiline Text | 1 | Parsed from PDF text |
| 5 | Original Authors | DocAuthor | Text | 1 | Parsed from PDF text |
| 6 | Default Email Add (Send To) | SendToAdmin | Date/Text | 1 | Parsed from PDF text |
| 7 | Default Email Add (CC) | SendToJoyce | Date/Text | 1 | Parsed from PDF text |
| 8 | Mailing List after Approval | CCMailList | Text | 1 | Parsed from PDF text |
| 9 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 10 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 11 | IOIOIAdmin | OwnerAdmin | Text | 1 | Parsed from PDF text |
| 12 | ITAdmin | ITAdmin | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (2), currentaction (2), approved (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_ADM`
FormCode: `ROOMREQURAR`
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
| MASTER-130-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-130-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-130-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 6 |
| Notes | - |
