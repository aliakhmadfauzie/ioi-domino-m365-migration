# Master App PDF Source - Inventory Management for Stock Item

> Master row: 338 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 338 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Inventory Management for Stock Item | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| PHBSVR | Source inventory |
| Form List | IMForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | INVESTOCITEM | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/002_oleObject36.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 2 | 1331 | 23 | 5 | INVENTORY MANAGEMENT FOR |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Inventory Management For | Inferred from PDF text | Needs Human Confirmation |
| 2 | Stock Item | Inferred from PDF text | Needs Human Confirmation |
| 3 | Project Details | Inferred from PDF text | Needs Human Confirmation |
| 4 | P10 - Pt | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 2 | Recipient | Recipient | Text | 1 | Parsed from PDF text |
| 3 | Recipient HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 4 | CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Response Required | ResReq | Text | 1 | Parsed from PDF text |
| 6 | Next Reminder | NextRem | Text | 1 | Parsed from PDF text |
| 7 | Title | Title | Text | 1 | Parsed from PDF text |
| 8 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 9 | Material Type | MType | Choice/Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 11 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 12 | Action | Action | Text | 1 | Parsed from PDF text |
| 13 | Name | RName | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | RDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Remarks | RRem | Multiline Text | 1 | Parsed from PDF text |
| 16 | Attachment | ReAttach | Text | 1 | Parsed from PDF text |
| 17 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 18 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 19 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 20 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 21 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 22 | Next Rem | RemDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Pending | P1 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), status (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `INVESTOCITEM`
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
| MASTER-338-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-338-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-338-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 23 |
| Workflow Signal Count | 5 |
| Notes | - |
