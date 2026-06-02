# Master App PDF Source - Fire Extinguisher Expiry Date Checklist

> Master row: 306 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 306 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Fire Extinguisher Expiry Date Checklist | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | FireExt - Form \| Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FIREEXTIEXPI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/003_oleObject152.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 372 | 16 | 0 | Fire Extinguisher Expiry Date Checklist |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/013_oleObject162.pdf | Extracted embedded PDF | text_match_medium | 0.454 | Explicit mapping | 7 | 1257 | 20 | 7 | SHE FirSt-aid itEm |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : She | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 4 | First-Aid Item Checklist | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Hod/Hos (Cc) | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION B | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | No. | No | Number/Text | 1 | Parsed from PDF text |
| 3 | Location | Location | Text | 1 | Parsed from PDF text |
| 4 | Area | Area | Text | 1 | Parsed from PDF text |
| 5 | Level | Level | Text | 1 | Parsed from PDF text |
| 6 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 7 | Serial No. | SerialNo | Number/Text | 1 | Parsed from PDF text |
| 8 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Prompt Date | PromptDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 11 | Replaced | Replaced | Text | 1 | Parsed from PDF text |
| 12 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 13 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 14 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 15 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 16 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 17 | Year | Year | Text | 1 | Parsed from PDF text |
| 18 | Month | Month | Text | 1 | Parsed from PDF text |
| 19 | Date of Checked | DateChecked | Date/Text | 1 | Parsed from PDF text |
| 20 | First-aid Administrator) | PIC | Person/Text | 1 | Parsed from PDF text |
| 21 | HOD/HOS (CC) | HOD | Person/Text | 1 | Parsed from PDF text |
| 22 | Submit Date | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 23 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 24 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 25 | Date | DateVerified | Date/Text | 1 | Parsed from PDF text |
| 26 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 27 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 28 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 29 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 30 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 31 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 32 | IT | IT | Text | 1 | Parsed from PDF text |
| 33 | CC1 | CC1 | Text | 1 | Parsed from PDF text |
| 34 | CC2 | CC2 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), currentaction (2), submit (1), verified (1), status (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `FIREEXTIEXPI`
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
| MASTER-306-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-306-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-306-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 7 |
| Notes | - |
