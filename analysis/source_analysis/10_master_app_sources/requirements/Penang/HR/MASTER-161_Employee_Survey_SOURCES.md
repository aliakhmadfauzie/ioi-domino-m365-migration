# Master App PDF Source - Employee Survey

> Master row: 161 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 161 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Employee Survey | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Employee Survey | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | ESF | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/ESF.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.700 | HCL fallback high confidence | 3 | 2188 | 14 | 3 | EMPLOYEE SURVEY |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Employee Survey | Inferred from PDF text | Needs Human Confirmation |
| 2 | N_1 . | Inferred from PDF text | Needs Human Confirmation |
| 3 | N_2 . | Inferred from PDF text | Needs Human Confirmation |
| 4 | N_3 . | Inferred from PDF text | Needs Human Confirmation |
| 5 | N_4 . | Inferred from PDF text | Needs Human Confirmation |
| 6 | N_5 . | Inferred from PDF text | Needs Human Confirmation |
| 7 | N_6 . | Inferred from PDF text | Needs Human Confirmation |
| 8 | N_7 . | Inferred from PDF text | Needs Human Confirmation |
| 9 | N_8 . | Inferred from PDF text | Needs Human Confirmation |
| 10 | N_9 . | Inferred from PDF text | Needs Human Confirmation |
| 11 | N_10 . | Inferred from PDF text | Needs Human Confirmation |
| 12 | N_11 . | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Years of Service | Service | Text | 1 | Parsed from PDF text |
| 2 | Age Group | Age | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Suggestion/s (for improvement) | Suggestion | Text | 1 | Parsed from PDF text |
| 5 | CA | CA | Text | 1 | Parsed from PDF text |
| 6 | HR | HR | Text | 1 | Parsed from PDF text |
| 7 | IT | IT | Text | 1 | Parsed from PDF text |
| 8 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 9 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 10 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 11 | All Questions | Qs | Text | 1 | Parsed from PDF text |
| 12 | Comments | Cs | Multiline Text | 1 | Parsed from PDF text |
| 13 | Ratings | Gs; G_16 | Text | 1 | Parsed from PDF text |
| 14 | Total Rating | TotalRating | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `ESF`
Child-list recommendation: `MainDB_HR_Ext_ESF_Rows` candidate for repeating row fields

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
| MASTER-161-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-161-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-161-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 14 |
| Workflow Signal Count | 3 |
| Notes | - |
