# Master App PDF Source - Vendor CSR Assessment

> Master row: 228 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 228 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Vendor CSR Assessment | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| PHBSVR | Source inventory |
| Form List | AppMaterial - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDCSRASSE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/003_oleObject81.pdf | Extracted embedded PDF | sheet_order_fallback | 0.389 | Explicit mapping | 2 | 872 | 20 | 8 | Issue No |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 4 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |
| 5 | Mgraccess | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section B | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No | IssueNo | Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Item Code | ItemCode | Text | 1 | Parsed from PDF text |
| 4 | Product Name | ProName | Person/Text | 1 | Parsed from PDF text |
| 5 | Brand Name | BrandName | Person/Text | 1 | Parsed from PDF text |
| 6 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 7 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 8 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 9 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 10 | Distribution List | CC | Text | 1 | Parsed from PDF text |
| 11 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 12 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 13 | IT Admin | MGRACCESS | Text | 1 | Parsed from PDF text |
| 14 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 15 | Obsolete | Obsolete | Text | 1 | Parsed from PDF text |
| 16 | Section A | AEditor1 | Text | 1 | Parsed from PDF text |
| 17 | Section B | AEditor2 | Text | 1 | Parsed from PDF text |
| 18 | Approval | SecApproval | Text | 1 | Parsed from PDF text |
| 19 | Review Date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reminder | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (2), approved (2), currentaction (2), status (1), review (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VENDCSRASSE`
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
| MASTER-228-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-228-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-228-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 20 |
| Workflow Signal Count | 8 |
| Notes | - |
