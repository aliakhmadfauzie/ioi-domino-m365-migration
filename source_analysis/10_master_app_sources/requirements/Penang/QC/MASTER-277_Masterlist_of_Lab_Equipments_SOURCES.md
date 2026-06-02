# Master App PDF Source - Masterlist of Lab Equipments

> Master row: 277 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 277 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Masterlist of Lab Equipments | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | PT - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFLAB | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/015_oleObject186.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 2 | 1116 | 14 | 4 | PT PROGRAM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Pt Program | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - PLAN | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - REPORT | Inferred from PDF text | Needs Human Confirmation |
| 4 | P_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | A_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | P_2_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | A_2_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | P_3_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | A_3_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | P_4_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | A_4_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | P_5_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Created by | CreatedBy | Text | 1 | Parsed from PDF text |
| 2 | Created on | CreatedOn | Text | 1 | Parsed from PDF text |
| 3 | Year | Year | Text | 1 | Parsed from PDF text |
| 4 | PT Program | PT | Text | 1 | Parsed from PDF text |
| 5 | Discarded by | DisName | Person/Text | 1 | Parsed from PDF text |
| 6 | Discarded Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Reason | DisReason | Multiline Text | 1 | Parsed from PDF text |
| 8 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 9 | IT | IT | Text | 1 | Parsed from PDF text |
| 10 | QC | QC | Text | 1 | Parsed from PDF text |
| 11 | QC HOD | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 12 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 13 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 14 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (2), ca (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `MASTOFLAB`
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
| MASTER-277-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-277-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-277-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 14 |
| Workflow Signal Count | 4 |
| Notes | - |
