# Master App PDF Source - PanCen - SAP Disaster Recovery (DRP)

> Master row: 22 | Site: Johor | Owner: IT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 22 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - SAP Disaster Recovery (DRP) | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PCNSVR | Source inventory |
| Form List | PanCen - SAP Disaster Recovery (DRP) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPDISARECO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/IT/004_oleObject49.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 2 | 916 | 21 | 5 | Section A |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | Subject | Text | 1 | Parsed from PDF text |
| 2 | Category | Categories | Choice/Text | 1 | Parsed from PDF text |
| 3 | Effective date | EffectDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Revision | Revision | Text | 1 | Parsed from PDF text |
| 5 | Department | Dept | Text | 1 | Parsed from PDF text |
| 6 | Team | Team | Text | 1 | Parsed from PDF text |
| 7 | Date Verified | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 8 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 9 | Date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 10 | Comments | Com1 | Multiline Text | 1 | Parsed from PDF text |
| 11 | Comments | Com2 | Multiline Text | 1 | Parsed from PDF text |
| 12 | Comments | Com3 | Multiline Text | 1 | Parsed from PDF text |
| 13 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 14 | OrginalAuthor | Authors | Text | 1 | Parsed from PDF text |
| 15 | Endorser | Endorser | Text | 1 | Parsed from PDF text |
| 16 | Approvar | Approvar | Text | 1 | Parsed from PDF text |
| 17 | RejectStatusEndorse | RejectStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 18 | RejectStatusApp | RejectStatus2 | Choice/Text | 1 | Parsed from PDF text |
| 19 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 20 | Tan CG | TanCG | Text | 1 | Parsed from PDF text |
| 21 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), verified (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SAPDISARECO`
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
| MASTER-022-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-022-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-022-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 5 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
