# Master App PDF Source - PanCen - BHT Addition Database

> Master row: 55 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 55 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - BHT Addition Database | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| PCNSVR | Source inventory |
| Form List | BHT - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | BHTADDI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/001_oleObject90.pdf | Extracted embedded PDF | sheet_order_fallback | 0.379 | Explicit mapping | 2 | 983 | 26 | 5 | BHT Addition |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiation | Inferred from PDF text | Needs Human Confirmation |
| 2 | VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 3 | Pdf-118/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Bhtcc | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Tank Number | TankNo | Text | 1 | Parsed from PDF text |
| 2 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 3 | Existing Tank Level | TankIniLevel; MT | Text | 1 | Parsed from PDF text |
| 4 | Existing BHT Concentration | BHTIniQ | Text | 1 | Parsed from PDF text |
| 5 | Final Tank Level | TankFinLevel; MT | Text | 1 | Parsed from PDF text |
| 6 | Target BHT Concentration | BHTTarget; AlertMessage | Text | 1 | Parsed from PDF text |
| 7 | BHT Quantity Added | Qty | Number/Text | 1 | Parsed from PDF text |
| 8 | BHT Lot Number | LotNo | Text | 1 | Parsed from PDF text |
| 9 | Final BHT Concentration | Content | Text | 1 | Parsed from PDF text |
| 10 | Date Added | DateAdded | Date/Text | 1 | Parsed from PDF text |
| 11 | Time Added | TimeAdded | Text | 1 | Parsed from PDF text |
| 12 | Done By | DoneBy; DoneOn | Text | 1 | Parsed from PDF text |
| 13 | Verifier | V2 | Text | 1 | Parsed from PDF text |
| 14 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 15 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 16 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 17 | Date Added | DateAdd | Date/Text | 1 | Parsed from PDF text |
| 18 | Date Created | CreateDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 20 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | Running numbers | INO | Text | 1 | Parsed from PDF text |
| 23 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 24 | ISG | IT | Text | 1 | Parsed from PDF text |
| 25 | BHT Approvers | BHTApp | Person/Text | 1 | Parsed from PDF text |
| 26 | BHT Defcc | BHTCC | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verification (2), currentaction (2), verified (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `BHTADDI`
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
| MASTER-055-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-055-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-055-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 26 |
| Workflow Signal Count | 5 |
| Notes | - |
