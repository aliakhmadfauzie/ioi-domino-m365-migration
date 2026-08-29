# Master App PDF Source - SHE Competent Person

> Master row: 311 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 311 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Competent Person | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Competent Person | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHECOMPPERS | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SHECP.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 391 | 15 | 3 | Competent Person |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/010_oleObject159.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 1 | 391 | 15 | 3 | Competent Person |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Hos/Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | : She | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Competency | Competency | Text | 1 | Parsed from PDF text |
| 4 | Name | Name; Email | Person/Text | 1 | Parsed from PDF text |
| 5 | HOS/HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 6 | Department | Department | Text | 1 | Parsed from PDF text |
| 7 | Position | Position | Text | 1 | Parsed from PDF text |
| 8 | Grade | Grade | Text | 1 | Parsed from PDF text |
| 9 | Date Registered | RegisterDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Refresher | Refresher | Text | 1 | Parsed from PDF text |
| 11 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 13 | Obsolete | Obsolete | Text | 1 | Parsed from PDF text |
| 14 | IT | IT | Text | 1 | Parsed from PDF text |
| 15 | SHE | SHE | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), submitted (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHECOMPPERS`
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
| MASTER-311-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-311-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-311-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 15 |
| Workflow Signal Count | 6 |
| Notes | - |
