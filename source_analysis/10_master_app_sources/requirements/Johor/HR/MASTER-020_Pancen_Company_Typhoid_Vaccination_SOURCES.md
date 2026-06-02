# Master App PDF Source - Pancen - Company Typhoid Vaccination

> Master row: 20 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 20 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Company Typhoid Vaccination | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | Test TR - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | TNPRA | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/004_oleObject19.pdf | Extracted embedded PDF | text_match_high | 0.786 | Explicit mapping | 3 | 1049 | 26 | 4 | IOI-PANCEN TYPHOID VACCINATION/FOOD HANDLERS TRAINING RECORD DATABASE |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi-Pancen Typhoid Vaccination/Food Handlers Training Record Database | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A – GENERAL INFORMATION | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Nric | Inferred from PDF text | Needs Human Confirmation |
| 4 | D.O.J | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Doj | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B – TYPHOID VACCINE / FOOD HANDLERS INFORMATION | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Type of Workers | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | [As per the IC] | Name | Person/Text | 1 | Parsed from PDF text |
| 4 | Employee No | EmpNo | Text | 1 | Parsed from PDF text |
| 5 | NRIC/PP No | NRIC | Text | 1 | Parsed from PDF text |
| 6 | D.O.J | DOJ | Text | 1 | Parsed from PDF text |
| 7 | Gender | Gender | Text | 1 | Parsed from PDF text |
| 8 | Designation | Desig | Text | 1 | Parsed from PDF text |
| 9 | Department | Dept | Text | 1 | Parsed from PDF text |
| 10 | Clinic Name | ClinicName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date of Vaccine | DOV | Date/Text | 1 | Parsed from PDF text |
| 12 | Date of Expiry | DOE | Date/Text | 1 | Parsed from PDF text |
| 13 | expiry | DoME | Text | 1 | Parsed from PDF text |
| 14 | Vaccine | AttachTyphoidVac | Text | 1 | Parsed from PDF text |
| 15 | Date | TrainingDt | Date/Text | 1 | Parsed from PDF text |
| 16 | Training Certificate | AttachFoodHandlers | Text | 1 | Parsed from PDF text |
| 17 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 18 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 19 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 20 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | Editor Draft | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | HR Personnel - Ms Ahsha | HR_Rem | Text | 1 | Parsed from PDF text |
| 23 | HR Personnel - Ms Bron | HR | Text | 1 | Parsed from PDF text |
| 24 | HR Personnel - Mr. Kobi | HR_Draft | Text | 1 | Parsed from PDF text |
| 25 | IT | IT | Text | 1 | Parsed from PDF text |
| 26 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), submitted (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `TNPRA`
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
| MASTER-020-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-020-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-020-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 26 |
| Workflow Signal Count | 4 |
| Notes | - |
