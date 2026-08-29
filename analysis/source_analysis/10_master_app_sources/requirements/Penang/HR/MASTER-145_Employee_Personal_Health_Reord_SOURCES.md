# Master App PDF Source - Employee Personal Health Reord

> Master row: 145 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 145 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Employee Personal Health Reord | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR | Source inventory |
| Form List | EPHR - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | EPHR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/026_oleObject232.pdf | Extracted embedded PDF | text_match_medium | 0.563 | Explicit mapping | 2 | 956 | 19 | 0 | EMPLOYEE PERSONAL HEALTH RECORD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Employee Personal Health Record | Inferred from PDF text | Needs Human Confirmation |
| 2 | : H Cm | Inferred from PDF text | Needs Human Confirmation |
| 3 | : W Kg | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Bmi Kg/M2 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Medical History | Inferred from PDF text | Needs Human Confirmation |
| 6 | Admission Record | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Name | FullName | Person/Text | 1 | Parsed from PDF text |
| 2 | IC No. / Passport No. | IC | Number/Text | 1 | Parsed from PDF text |
| 3 | Date of Birth | DOB | Date/Text | 1 | Parsed from PDF text |
| 4 | Gender | Gender | Text | 1 | Parsed from PDF text |
| 5 | HP No | HP | Text | 1 | Parsed from PDF text |
| 6 | Company | Company | Text | 1 | Parsed from PDF text |
| 7 | Department | Dept | Text | 1 | Parsed from PDF text |
| 8 | Height | CM | Text | 1 | Parsed from PDF text |
| 9 | Weight | KG | Text | 1 | Parsed from PDF text |
| 10 | BMI | BMI; KG; M2 | Text | 1 | Parsed from PDF text |
| 11 | Blood Pressure | BP | Text | 1 | Parsed from PDF text |
| 12 | Visual | Visual | Text | 1 | Parsed from PDF text |
| 13 | Color Vision | Vision | Text | 1 | Parsed from PDF text |
| 14 | Past Medical / Surgical History | MedHist | Text | 1 | Parsed from PDF text |
| 15 | Follow up | Followup | Text | 1 | Parsed from PDF text |
| 16 | Regularly | Followup2 | Text | 1 | Parsed from PDF text |
| 17 | Admission Date | AdmDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Diagnosis | Diagnosis | Text | 1 | Parsed from PDF text |
| 19 | Discharge Summary | Discharge | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Unknown | Needs Human Confirmation |
| Workflow Evidence | Unknown | Needs Human Confirmation |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `EPHR`
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
| MASTER-145-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-145-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-145-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 19 |
| Workflow Signal Count | 0 |
| Notes | - |
