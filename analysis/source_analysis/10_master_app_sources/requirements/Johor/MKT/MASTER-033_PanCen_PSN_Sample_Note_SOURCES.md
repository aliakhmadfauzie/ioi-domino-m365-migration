# Master App PDF Source - PanCen - PSN Sample Note

> Master row: 33 | Site: Johor | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 33 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - PSN Sample Note | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | MARKETING \| PCNSVR | Source inventory |
| Form List | PanCen - PSN Sample Note | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PSNSAMPNOTE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/008_oleObject62.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.033 | Embedded metadata fallback needs review | 1 | 86 | 3 | 0 | PSN Spec code info |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PanCen - PSN Sample Note | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Material Code | MatCode | Text | 1 | Parsed from PDF text |
| 2 | Spec Code | SpecCode | Text | 1 | Parsed from PDF text |
| 3 | Concatenate | ConSpec | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Unknown | Needs Human Confirmation |
| Workflow Evidence | Unknown | Needs Human Confirmation |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `PSNSAMPNOTE`
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
| MASTER-033-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-033-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-033-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 3 |
| Workflow Signal Count | 0 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
