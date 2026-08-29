# Master App PDF Source - Disposition of Defective Packaging Materials

> Master row: 330 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 330 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Disposition of Defective Packaging Materials | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store | Source inventory |
| Form List | Disposition of Defective Packaging Materials | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | DISPOFDEFE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/QA/19_PIoRN_DisRecord2.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.950 | HCL fallback needs review | 2 | 747 | 24 | 6 | Disposition Record |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Qad-18/010624/00 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Disposition number | DisNo | Text | 1 | Parsed from PDF text |
| 3 | Department | Department | Text | 1 | Parsed from PDF text |
| 4 | CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Date of Disposal | DateDis | Date/Text | 1 | Parsed from PDF text |
| 6 | disposition activity | DisPerson | Text | 1 | Parsed from PDF text |
| 7 | disposition and document no. (if any) | Title | Number/Text | 1 | Parsed from PDF text |
| 8 | Method of disposal | MOD | Person/Text | 1 | Parsed from PDF text |
| 9 | MDNF no. (if any) | MDNF | Number/Text | 1 | Parsed from PDF text |
| 10 | Justification of disposal | Justification | Multiline Text | 1 | Parsed from PDF text |
| 11 | Name | PreName | Person/Text | 1 | Parsed from PDF text |
| 12 | Designation | Desg | Text | 1 | Parsed from PDF text |
| 13 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 15 | Designation | AppDesg | Text | 1 | Parsed from PDF text |
| 16 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Comments | HODCom | Person/Text | 1 | Parsed from PDF text |
| 18 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 19 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 20 | INO | INO | Text | 1 | Parsed from PDF text |
| 21 | IT | IT | Text | 1 | Parsed from PDF text |
| 22 | QA | QA | Text | 1 | Parsed from PDF text |
| 23 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 24 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), approved (2), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `DISPOFDEFE`
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
| MASTER-330-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-330-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-330-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 6 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
