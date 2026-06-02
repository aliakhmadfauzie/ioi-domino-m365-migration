# Master App PDF Source - SAP Inventory Adjustment Approval Form

> Master row: 353 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 353 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Inventory Adjustment Approval Form | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse | Source inventory |
| Form List | MDInfo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPINVEADJU | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/010_oleObject72.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 2 | 518 | 15 | 2 | Materials Department Info |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Admin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Event Date | EventDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Title | Title | Text | 1 | Parsed from PDF text |
| 5 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 6 | Reminder | RemDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Submitted by | FullName | Person/Text | 1 | Parsed from PDF text |
| 8 | Counter | Counter | Text | 1 | Parsed from PDF text |
| 9 | IT | IT | Text | 1 | Parsed from PDF text |
| 10 | Admin Role | ADMIN | Text | 1 | Parsed from PDF text |
| 11 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 12 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 13 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 14 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 15 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `SAPINVEADJU`
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
| MASTER-353-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-353-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-353-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 2 |
| Notes | - |
