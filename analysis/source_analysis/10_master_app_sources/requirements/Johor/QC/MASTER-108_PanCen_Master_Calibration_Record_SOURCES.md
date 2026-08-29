# Master App PDF Source - PanCen-Master Calibration Record

> Master row: 108 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 108 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen-Master Calibration Record | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PCNSVR | Source inventory |
| Form List | Master - Form \| MasterNon - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTCALI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/028_oleObject191.pdf | Extracted embedded PDF | text_match_high | 0.754 | Explicit mapping | 4 | 6222 | 23 | 7 | MASTERLIST OF LAB EQUIPMENTS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/029_oleObject192.pdf | Extracted embedded PDF | text_match_high | 0.753 | Explicit mapping | 4 | 3442 | 23 | 6 | MASTERLIST OF LAB EQUIPMENTS NOT REQUIRING CALIBRATION/PM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Masterlist Of Lab Equipments | Inferred from PDF text | Needs Human Confirmation |
| 2 | Descrption | Inferred from PDF text | Needs Human Confirmation |
| 3 | Measurement | Inferred from PDF text | Needs Human Confirmation |
| 4 | External Calibration | Inferred from PDF text | Needs Human Confirmation |
| 5 | INTERNAL VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 6 | Tolerance | Inferred from PDF text | Needs Human Confirmation |
| 7 | Preventive Maintenance | Inferred from PDF text | Needs Human Confirmation |
| 8 | Location | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Dba | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Qchod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Masterlist Of Lab Equipments Not Requiring Calibration/Pm | Inferred from PDF text | Needs Human Confirmation |
| 12 | Description | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Revision | Revision | Text | 1 | Parsed from PDF text |
| 4 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 5 | Prepared by | Name; UpdateBy | Date/Text | 1 | Parsed from PDF text |
| 6 | Date | UpdateDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 8 | Verified by | VerBy | Person/Text | 1 | Parsed from PDF text |
| 9 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Remark | VerRem | Multiline Text | 1 | Parsed from PDF text |
| 11 | Approved by | AppBy | Person/Text | 1 | Parsed from PDF text |
| 12 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Remark | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 14 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 15 | Latest | Latest | Text | 1 | Parsed from PDF text |
| 16 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 17 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 18 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 19 | DB Admin | DBA | Text | 1 | Parsed from PDF text |
| 20 | QC List | QCList | Text | 1 | Parsed from PDF text |
| 21 | QC Manager | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 22 | IT | IT | Text | 1 | Parsed from PDF text |
| 23 | Location List | LocationList | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (4), approved (4), currentaction (2), ca (2), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `MASTCALI`
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
| MASTER-108-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-108-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-108-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 23 |
| Workflow Signal Count | 13 |
| Notes | - |
