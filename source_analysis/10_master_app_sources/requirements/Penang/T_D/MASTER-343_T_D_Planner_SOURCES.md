# Master App PDF Source - T&D Planner

> Master row: 343 | Site: Penang | Owner: T&D | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 343 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | T&D Planner | Clearly Found |
| Owner | T&D | Clearly Found |
| Department | T&D | Source inventory |
| Form List | T&D Planner | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TDPLAN | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/T&D/TNDP.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 304 | 11 | 2 | E - Planner |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | T&D : Tnd | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CopyTo | Text | 1 | Parsed from PDF text |
| 3 | Training Title | Title | Text | 1 | Parsed from PDF text |
| 4 | Objective | Objective | Text | 1 | Parsed from PDF text |
| 5 | Training Date | DateFrom | Date/Text | 1 | Parsed from PDF text |
| 6 | Time | TimeFrom | Text | 1 | Parsed from PDF text |
| 7 | Venue | Venue | Text | 1 | Parsed from PDF text |
| 8 | Trainer | Trainer | Text | 1 | Parsed from PDF text |
| 9 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 11 | T&D | TND | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_T&D`
FormCode: `TDPLAN`
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
| MASTER-343-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-343-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-343-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 11 |
| Workflow Signal Count | 2 |
| Notes | - |
