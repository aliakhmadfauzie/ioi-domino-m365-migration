# Master App PDF Source - SHE Training/Briefing Records

> Master row: 322 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 322 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Training/Briefing Records | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Training/Briefing Records | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHETRAIBRIE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SHETBR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 2 | 597 | 16 | 2 | SHE Training/Briefing Records |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/022_oleObject171.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 2 | 597 | 16 | 2 | SHE Training/Briefing Records |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiator Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Cc (Hod) | Inferred from PDF text | Needs Human Confirmation |
| 3 | Dept/Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 5 | Acmshe | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | WHBFNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 4 | CC (HOD) | CopyTo | Person/Text | 1 | Parsed from PDF text |
| 5 | Dept/Section | Dept | Text | 1 | Parsed from PDF text |
| 6 | Category | Contents | Choice/Text | 1 | Parsed from PDF text |
| 7 | Title | Title | Text | 1 | Parsed from PDF text |
| 8 | Brief by | BriefedBy | Text | 1 | Parsed from PDF text |
| 9 | Matter Discussed | Matter | Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 11 | Objective | Objective | Text | 1 | Parsed from PDF text |
| 12 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 13 | Time | Time | Text | 1 | Parsed from PDF text |
| 14 | Venue | Venue | Text | 1 | Parsed from PDF text |
| 15 | Sent By | Name | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHETRAIBRIE`
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
| MASTER-322-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-322-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-322-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 4 |
| Notes | - |
