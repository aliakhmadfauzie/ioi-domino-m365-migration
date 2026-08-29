# Master App PDF Source - Certificate/Declaration

> Master row: 278 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 278 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Certificate/Declaration | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | MeasurementUncertainty - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CERTDECL | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/010_oleObject181.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 3 | 845 | 32 | 5 | Measurement Uncertainty Report |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | OBSOLETE SECTION | Inferred from PDF text | Needs Human Confirmation |
| 2 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Qcadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Report Number | ReportNo | Text | 1 | Parsed from PDF text |
| 3 | Reference | Reference | Text | 1 | Parsed from PDF text |
| 4 | Title | Title | Text | 1 | Parsed from PDF text |
| 5 | Report | MethodReport | Person/Text | 1 | Parsed from PDF text |
| 6 | Reason for revision | Reason | Multiline Text | 1 | Parsed from PDF text |
| 7 | Issue No. | IssueNo | Number/Text | 1 | Parsed from PDF text |
| 8 | Reviewer | Reviewer | Text | 1 | Parsed from PDF text |
| 9 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 10 | Prepared by | PreName | Person/Text | 1 | Parsed from PDF text |
| 11 | Designation | PreDesi | Text | 1 | Parsed from PDF text |
| 12 | Remarks | PreRem | Multiline Text | 1 | Parsed from PDF text |
| 13 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Reviewed by | AppName2 | Person/Text | 1 | Parsed from PDF text |
| 15 | Designation | AppDesi2 | Text | 1 | Parsed from PDF text |
| 16 | Remarks | AppRem2 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Date | AppDate2 | Date/Text | 1 | Parsed from PDF text |
| 18 | Approved by | AppName | Person/Text | 1 | Parsed from PDF text |
| 19 | Designation | AppDesi | Text | 1 | Parsed from PDF text |
| 20 | Remarks | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 21 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remarks | ObsCom | Multiline Text | 1 | Parsed from PDF text |
| 23 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 24 | IT | IT | Text | 1 | Parsed from PDF text |
| 25 | INO | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 26 | QC | QC | Text | 1 | Parsed from PDF text |
| 27 | QA | QA | Text | 1 | Parsed from PDF text |
| 28 | Admin | QCADMIN | Text | 1 | Parsed from PDF text |
| 29 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 30 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 31 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 32 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approver (2), reviewed (1), approved (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `CERTDECL`
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
| MASTER-278-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-278-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-278-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 32 |
| Workflow Signal Count | 5 |
| Notes | - |
