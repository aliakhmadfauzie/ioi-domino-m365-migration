# Master App PDF Source - Register of Legal and Other Requirements

> Master row: 309 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 309 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Register of Legal and Other Requirements | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | RLORv1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | OFLEGAOTHE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/006_oleObject155.pdf | Extracted embedded PDF | sheet_order_fallback | 0.377 | Explicit mapping | 3 | 1284 | 16 | 14 | companyname (checkbox) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Main Section : | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 4 | Input Section : | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Env | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Title | DocTitle | Text | 1 | Parsed from PDF text |
| 3 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 4 | Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 5 | Distribution to | DistributionList | Text | 1 | Parsed from PDF text |
| 6 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 7 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 9 | SHE Admin | SHEAdmin | Text | 1 | Parsed from PDF text |
| 10 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 11 | HR Admin | HR | Text | 1 | Parsed from PDF text |
| 12 | Environment Admin | ENV | Text | 1 | Parsed from PDF text |
| 13 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 14 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 15 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 16 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (8), hod (2), status (2), reviewed (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `OFLEGAOTHE`
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
| MASTER-309-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-309-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-309-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 14 |
| Notes | - |
