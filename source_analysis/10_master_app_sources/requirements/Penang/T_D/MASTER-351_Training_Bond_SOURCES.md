# Master App PDF Source - Training Bond

> Master row: 351 | Site: Penang | Owner: T&D | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 351 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Training Bond | Clearly Found |
| Owner | T&D | Clearly Found |
| Department | T&D \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TRAIBOND | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/T_D/008_oleObject113.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 690 | 21 | 2 | Training Bond |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Tnd | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Employee Name | Employee | Person/Text | 1 | Parsed from PDF text |
| 3 | Position | Position | Text | 1 | Parsed from PDF text |
| 4 | Division | Division | Text | 1 | Parsed from PDF text |
| 5 | Department/Section | Dept | Text | 1 | Parsed from PDF text |
| 6 | Agreement Date | AgreementDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Agreement Period | Period | Text | 1 | Parsed from PDF text |
| 8 | Date | From | Date/Text | 1 | Parsed from PDF text |
| 9 | Training Title | Title | Text | 1 | Parsed from PDF text |
| 10 | Training Provider | Provider | Text | 1 | Parsed from PDF text |
| 11 | Training Location | Location | Text | 1 | Parsed from PDF text |
| 12 | Training Fee | RM | Text | 1 | Parsed from PDF text |
| 13 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 14 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 15 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 17 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 18 | Attachment | Attachment2 | Text | 1 | Parsed from PDF text |
| 19 | Follow Up Actions | Action | Text | 1 | Parsed from PDF text |
| 20 | ISG | IT | Text | 1 | Parsed from PDF text |
| 21 | TND | TND | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_T&D`
FormCode: `TRAIBOND`
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
| MASTER-351-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-351-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-351-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 2 |
| Notes | - |
