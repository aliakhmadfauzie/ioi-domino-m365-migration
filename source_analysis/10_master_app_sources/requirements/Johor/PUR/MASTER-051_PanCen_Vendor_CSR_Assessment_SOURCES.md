# Master App PDF Source - PanCen - Vendor CSR Assessment

> Master row: 51 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 51 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Vendor CSR Assessment | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDCSRASSE | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/013_oleObject79.pdf | Extracted embedded PDF | text_match_medium | 0.500 | Explicit mapping | 2 | 767 | 21 | 9 | Vendor CSR Assessment |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiation | Inferred from PDF text | Needs Human Confirmation |
| 2 | APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 4 | Obsolete Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Mkt | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 7 | Purhod | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No | IssueNo | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Vendor ID & Name | VendorID | Person/Text | 1 | Parsed from PDF text |
| 4 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 5 | Product Supplied | Product | Text | 1 | Parsed from PDF text |
| 6 | Product Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 7 | CSR Rating | CSRRating | Text | 1 | Parsed from PDF text |
| 8 | Next Due Date | DueDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 11 | Prepared by | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 12 | Prepared Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 13 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 14 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 15 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 16 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 17 | MKT User | MKT | Text | 1 | Parsed from PDF text |
| 18 | PUR Role | PUR | Text | 1 | Parsed from PDF text |
| 19 | Purchasing HOD | PURHOD | Person/Text | 1 | Parsed from PDF text |
| 20 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 21 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approver (2), currentaction (2), approval (1), approve (1), reject (1), status (1), hod (1) | Parsed from PDF text |
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
| MASTER-051-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-051-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-051-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 9 |
| Notes | - |
