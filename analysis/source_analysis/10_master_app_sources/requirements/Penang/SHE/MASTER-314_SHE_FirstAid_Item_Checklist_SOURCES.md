# Master App PDF Source - SHE FirstAid Item Checklist

> Master row: 314 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 314 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE FirstAid Item Checklist | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE FirstAid Item Checklist | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEFIRSITEM | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/013_oleObject162.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.750 | Embedded metadata fallback needs review | 7 | 1257 | 20 | 7 | SHE FirSt-aid itEm |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 2 | First-Aid Item Checklist | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 4 | Hod/Hos (Cc) | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Year | Year | Text | 1 | Parsed from PDF text |
| 3 | Location | Location | Text | 1 | Parsed from PDF text |
| 4 | Month | Month | Text | 1 | Parsed from PDF text |
| 5 | Date of Checked | DateChecked | Date/Text | 1 | Parsed from PDF text |
| 6 | First-aid Administrator) | PIC | Person/Text | 1 | Parsed from PDF text |
| 7 | HOD/HOS (CC) | HOD | Person/Text | 1 | Parsed from PDF text |
| 8 | Submit Date | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 9 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 10 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 11 | Date | DateVerified | Date/Text | 1 | Parsed from PDF text |
| 12 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 13 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 14 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 15 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 17 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 18 | IT | IT | Text | 1 | Parsed from PDF text |
| 19 | CC1 | CC1 | Text | 1 | Parsed from PDF text |
| 20 | CC2 | CC2 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), currentaction (2), submit (1), verified (1), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEFIRSITEM`
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
| MASTER-314-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-314-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-314-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 20 |
| Workflow Signal Count | 7 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
