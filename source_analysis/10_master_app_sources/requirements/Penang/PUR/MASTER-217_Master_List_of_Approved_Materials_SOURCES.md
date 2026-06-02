# Master App PDF Source - Master List of Approved Materials

> Master row: 217 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 217 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Master List of Approved Materials | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | ReachForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFAPPR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/006_oleObject84.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 1 | 426 | 8 | 1 | REACh |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Reach | Inferred from PDF text | Needs Human Confirmation |
| 2 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 2 | Item Code | ItemCode | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 5 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 6 | Registered? | ReachRegistered | Text | 1 | Parsed from PDF text |
| 7 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 8 | QA | QA | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `MASTOFAPPR`
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
| MASTER-217-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-217-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-217-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 8 |
| Workflow Signal Count | 1 |
| Notes | - |
