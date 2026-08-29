# Master App PDF Source - PanCen - E&I Calibration Database

> Master row: 35 | Site: Johor | Owner: E&I | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 35 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - E&I Calibration Database | Clearly Found |
| Owner | E&I | Clearly Found |
| Department | Maint | Source inventory |
| Form List | FrmCal - Form \| FrmEqp - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | EICALI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/Maint/001_oleObject1.pdf | Extracted embedded PDF | text_match_high | 0.754 | Explicit mapping | 3 | 846 | 20 | 6 | NEW CALIBRATION REPORT |
| source/Project Iventories/extracted-embedded-pdfs/Johor/Maint/002_oleObject2.pdf | Extracted embedded PDF | text_match_high | 0.753 | Explicit mapping | 3 | 697 | 18 | 3 | NEW EQUIPMENT DETAILS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | New Calibration Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | Type: | Inferred from PDF text | Needs Human Confirmation |
| 3 | Short Equipment Name | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section 1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section 2 | Inferred from PDF text | Needs Human Confirmation |
| 6 | NEW EQUIPMENT DETAILS | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Applicable to | Site | Text | 1 | Parsed from PDF text |
| 2 | Manufactured by | ManBy | Text | 1 | Parsed from PDF text |
| 3 | Year of Manufacture | ManYear | Text | 1 | Parsed from PDF text |
| 4 | Model No. | Model | Number/Text | 1 | Parsed from PDF text |
| 5 | Serial Number | SrNo | Text | 1 | Parsed from PDF text |
| 6 | Metrology Serial Number | Metrology | Text | 1 | Parsed from PDF text |
| 7 | Measurable Range | MesRange | Text | 1 | Parsed from PDF text |
| 8 | Calibration Range | CalRange | Text | 1 | Parsed from PDF text |
| 9 | Cycle of calibration | Cycle | Text | 1 | Parsed from PDF text |
| 10 | Attachment | Atth | Text | 1 | Parsed from PDF text |
| 11 | SHORT EQUIPMENT NAME | ShortEqName | Person/Text | 1 | Parsed from PDF text |
| 12 | Calibration Date | CalDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Calibration Due | CalDue | Text | 1 | Parsed from PDF text |
| 14 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 15 | CC | CC | Text | 1 | Parsed from PDF text |
| 16 | Name | SubBy | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | SubDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Comment | HODRem | Person/Text | 1 | Parsed from PDF text |
| 19 | Name | AppBy | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Name of Equipment | EqName | Person/Text | 1 | Parsed from PDF text |
| 22 | Weight of Cast Iron | Weight | Text | 1 | Parsed from PDF text |
| 23 | Weighing Scale Register No | RegNo | Text | 1 | Parsed from PDF text |
| 24 | Attachment | Attch | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (2), currentaction (2), ca (2), hod (1), approve (1), reject (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_E&I`
FormCode: `EICALI`
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
| MASTER-035-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-035-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-035-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 9 |
| Notes | - |
