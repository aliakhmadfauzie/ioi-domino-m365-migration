# Master App PDF Source - PanCen - Industrial Incident Report Ver 2.0

> Master row: 116 | Site: Johor | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 116 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Industrial Incident Report Ver 2.0 | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| Critical App \| PCNSVR | Source inventory |
| Form List | PanCen - Industrial Incident Report Ver 2.0 | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | INDUINCIREPO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/SHE/5_PIIR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.950 | HCL fallback high confidence | 1 | 458 | 16 | 5 | ENVIRONMENTAL INCIDENT REGISTER |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Environmental Incident Register | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | She-142/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 5 | : She | Inferred from PDF text | Needs Human Confirmation |
| 6 | She Hod | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Shehod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Running Number | ReportNo | Text | 1 | Parsed from PDF text |
| 2 | Financical Year(FY) | FY | Text | 1 | Parsed from PDF text |
| 3 | Period | Period | Text | 1 | Parsed from PDF text |
| 4 | Attachment | Attch | Text | 1 | Parsed from PDF text |
| 5 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 6 | Reviewed By (SHE HOD) | ReviewedBy | Person/Text | 1 | Parsed from PDF text |
| 7 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 8 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 10 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 11 | INO | INO | Text | 1 | Parsed from PDF text |
| 12 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 13 | Editor 2 - SHE HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 14 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 15 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 16 | SHE HOD | SHEHOD | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), reviewed (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `INDUINCIREPO`
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
| MASTER-116-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-116-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-116-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 5 |
| Notes | - |
