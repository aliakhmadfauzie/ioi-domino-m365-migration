# Master App PDF Source - IMS - SOP (IOI)

> Master row: 255 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 255 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IMS - SOP (IOI) | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | Regulations - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IMSSOP | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/025_oleObject257.pdf | Extracted embedded PDF | sheet_order_fallback | 0.377 | Explicit mapping | 2 | 490 | 15 | 2 | companyname (radio buttons) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Regulations | Inferred from PDF text | Needs Human Confirmation |
| 2 | Regulation No | Inferred from PDF text | Needs Human Confirmation |
| 3 | Sector | Inferred from PDF text | Needs Human Confirmation |
| 4 | Country | Inferred from PDF text | Needs Human Confirmation |
| 5 | Topic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CC | Text | 1 | Parsed from PDF text |
| 3 | REGULATION NO | RegNo | Text | 1 | Parsed from PDF text |
| 4 | SECTOR | Sector | Text | 1 | Parsed from PDF text |
| 5 | COUNTRY | Country | Text | 1 | Parsed from PDF text |
| 6 | TOPIC | Topic | Person/Text | 1 | Parsed from PDF text |
| 7 | REGULATIONS | Reg | Text | 1 | Parsed from PDF text |
| 8 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 9 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Author | Creator | Text | 1 | Parsed from PDF text |
| 11 | DateSubmitted | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 12 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 13 | QA User | QAUser | Text | 1 | Parsed from PDF text |
| 14 | QC User | QCUser | Text | 1 | Parsed from PDF text |
| 15 | Reader | Reader | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IMSSOP`
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
| MASTER-255-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-255-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-255-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 2 |
| Notes | - |
