# Master App PDF Source - PanCen - Vendor Assessment

> Master row: 49 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 49 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Vendor Assessment | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | VAForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDASSE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/010_oleObject76.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 5 | 3854 | 15 | 10 | VENDOR ASSESSMENT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Vendor Assessment | Inferred from PDF text | Needs Human Confirmation |
| 2 | Va No. : | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION 1 : Filled by Initiator | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION 2 : Filled by Respective Departments | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section 3 : Verify section | Inferred from PDF text | Needs Human Confirmation |
| 6 | Opr % | Inferred from PDF text | Needs Human Confirmation |
| 7 | Opr2 % | Inferred from PDF text | Needs Human Confirmation |
| 8 | Mkr-02/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section 1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section 2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section 3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Hd Hd2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | issued) | ResDate | Date/Text | 1 | Parsed from PDF text |
| 2 | Vendor ID & Name | VenName | Person/Text | 1 | Parsed from PDF text |
| 3 | Supplier / Manufacture | Manufacturer | Text | 1 | Parsed from PDF text |
| 4 | Product Category | PSAdd; ProSup | Choice/Text | 1 | Parsed from PDF text |
| 5 | Product Description | PDAdd; ProDesc | Multiline Text | 1 | Parsed from PDF text |
| 6 | Product Appraised | MM; YY; MM1; YY1 | Text | 1 | Parsed from PDF text |
| 7 | Name | PreName | Person/Text | 1 | Parsed from PDF text |
| 8 | Name | VerName | Person/Text | 1 | Parsed from PDF text |
| 9 | Designation | PreDesg | Text | 1 | Parsed from PDF text |
| 10 | Designation | VerDesg | Text | 1 | Parsed from PDF text |
| 11 | Complete Date | PreComDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Complete Date | VerComDate | Date/Text | 1 | Parsed from PDF text |
| 13 | By | DisBy | Text | 1 | Parsed from PDF text |
| 14 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Remark | DisRem | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (7), currentaction (1), ca (1), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VENDASSE`
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
| MASTER-049-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-049-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-049-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 10 |
| Notes | - |
