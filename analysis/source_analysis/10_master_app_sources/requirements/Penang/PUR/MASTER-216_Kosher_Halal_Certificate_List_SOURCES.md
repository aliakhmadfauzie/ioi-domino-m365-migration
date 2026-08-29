# Master App PDF Source - Kosher & Halal Certificate List

> Master row: 216 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 216 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Kosher & Halal Certificate List | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related | Source inventory |
| Form List | MaterialsInfo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | KOSHHALACERT | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/005_oleObject83.pdf | Extracted embedded PDF | sheet_order_fallback | 0.380 | Explicit mapping | 5 | 4455 | 23 | 1 | MATERIALS INFORMATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Materials Information | Inferred from PDF text | Needs Human Confirmation |
| 2 | Miq_1 | Inferred from PDF text | Needs Human Confirmation |
| 3 | Miq_2 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Miq_3 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Miq_4 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Miq_5 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Miq_6 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Miq_7 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Miq_8 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Miq_9 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Miq_10 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Coa/Coc | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Type of Material | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 4 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 5 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 6 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 7 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 8 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Last Modified By | LastEditBy | Text | 1 | Parsed from PDF text |
| 10 | Last Modified | LastEditDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 12 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 13 | PUR Admin | PURAdmin | Text | 1 | Parsed from PDF text |
| 14 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 15 | PUR - Packaging Material | PURPM | Text | 1 | Parsed from PDF text |
| 16 | PUR - Raw Material | PURRM | Text | 1 | Parsed from PDF text |
| 17 | PUR - Process Chemical | PURPC | Text | 1 | Parsed from PDF text |
| 18 | PUR - CCP | PURCCP | Text | 1 | Parsed from PDF text |
| 19 | PUR - Product Contact Materials | PURPCM | Text | 1 | Parsed from PDF text |
| 20 | PUR - Semi-finished Material | PURSFM | Text | 1 | Parsed from PDF text |
| 21 | Procurement | PUR | Text | 1 | Parsed from PDF text |
| 22 | QA | QA | Text | 1 | Parsed from PDF text |
| 23 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `KOSHHALACERT`
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
| MASTER-216-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-216-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-216-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 23 |
| Workflow Signal Count | 1 |
| Notes | - |
