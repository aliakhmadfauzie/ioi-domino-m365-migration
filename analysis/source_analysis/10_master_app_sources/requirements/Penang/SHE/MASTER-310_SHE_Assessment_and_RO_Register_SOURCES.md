# Master App PDF Source - SHE Assessment and RO Register

> Master row: 310 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 310 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Assessment and RO Register | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Assessment and RO Register | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEASSERO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SHEARO.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 302 | 8 | 3 | SHE Assessment and RO |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/009_oleObject158.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 302 | 8 | 3 | SHE Assessment and RO |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : She | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | Title | Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 4 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 5 | IT | IT | Text | 1 | Parsed from PDF text |
| 6 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 7 | SHE (Roles) | SHEAdmin | Text | 1 | Parsed from PDF text |
| 8 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (2), submitted (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEASSERO`
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
| MASTER-310-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-310-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-310-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 8 |
| Workflow Signal Count | 6 |
| Notes | - |
