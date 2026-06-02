# Master App PDF Source - Post Training Evaluation Form

> Master row: 348 | Site: Penang | Owner: T&D | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 348 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Post Training Evaluation Form | Clearly Found |
| Owner | T&D | Clearly Found |
| Department | T&D \| PHBSVR | Source inventory |
| Form List | NewForm2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | POSTTRAIEVAL | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/T_D/005_oleObject110.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 3455 | 27 | 6 | Post Training Evaluation Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | HR SECTION | Inferred from PDF text | Needs Human Confirmation |
| 2 | Required to fill in Section D | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Rnr | Inferred from PDF text | Needs Human Confirmation |
| 4 | HOD's SECTION | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION A - Knowledge, Skills & Attitude | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B - Implementation | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION C - Overall Evaluation | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION D - Management System | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION E - Superior's Comment | Inferred from PDF text | Needs Human Confirmation |
| 10 | T&D-15/241019/09 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Tnd | Inferred from PDF text | Needs Human Confirmation |
| 12 | Isg Admin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Training Title | Title | Text | 1 | Parsed from PDF text |
| 2 | Training Date | TrainingDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Superior's Name | Superior | Person/Text | 1 | Parsed from PDF text |
| 4 | Designation | SupDesignation | Text | 1 | Parsed from PDF text |
| 5 | Employee's Name | Employee | Person/Text | 1 | Parsed from PDF text |
| 6 | Designation | EmpDesignation | Text | 1 | Parsed from PDF text |
| 7 | Employee's Email | EmpEmail | Text | 1 | Parsed from PDF text |
| 8 | Division/Department | Department | Text | 1 | Parsed from PDF text |
| 9 | Issue Date | IssuedDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Issue To | IssuedTo | Date/Text | 1 | Parsed from PDF text |
| 11 | Required to fill in Section D | RNR | Text | 1 | Parsed from PDF text |
| 12 | Able to Assess | Assess | Text | 1 | Parsed from PDF text |
| 13 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 14 | Next Review Required | Review | Text | 1 | Parsed from PDF text |
| 15 | Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Comments | SupComment | Multiline Text | 1 | Parsed from PDF text |
| 17 | Signature | SupSignature | Text | 1 | Parsed from PDF text |
| 18 | Position | SupPosition | Text | 1 | Parsed from PDF text |
| 19 | Date | SupDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 21 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 22 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 23 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 24 | T&D | TND | Text | 1 | Parsed from PDF text |
| 25 | ISG ADMIN | ISG | Text | 1 | Parsed from PDF text |
| 26 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 27 | Rating | Ratings | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (3), hod (1), signature (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_T&D`
FormCode: `POSTTRAIEVAL`
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
| MASTER-348-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-348-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-348-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 6 |
| Notes | - |
