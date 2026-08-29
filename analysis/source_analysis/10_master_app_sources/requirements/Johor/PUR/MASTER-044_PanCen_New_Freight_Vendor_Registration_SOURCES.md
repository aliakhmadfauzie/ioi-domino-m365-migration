# Master App PDF Source - PanCen - New Freight Vendor Registration

> Master row: 44 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 44 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - New Freight Vendor Registration | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | PanCen - New Freight Vendor Registration | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FREIVENDREGI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/006_oleObject72.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.000 | Embedded metadata fallback needs review | 3 | 1076 | 37 | 11 | Comp |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Freight Vendor Registration Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C - Purchasing | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION D - Purchasing HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION E - Finance | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section D | Inferred from PDF text | Needs Human Confirmation |
| 10 | Purhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Registration No | RptNo | Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Comp Name | CompName | Person/Text | 1 | Parsed from PDF text |
| 4 | Attachments | Attach | Text | 1 | Parsed from PDF text |
| 5 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 6 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 7 | Submitted by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 8 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Update in SAP | SAPUpdate | Date/Text | 1 | Parsed from PDF text |
| 10 | Name | ByName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date | ByDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Remarks | ByComment | Multiline Text | 1 | Parsed from PDF text |
| 13 | Update in SAP | SAPUpdatePurHOD | Date/Text | 1 | Parsed from PDF text |
| 14 | Name | PurHodName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | PurHodDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Remarks | PurHodRem | Person/Text | 1 | Parsed from PDF text |
| 17 | Update in SAP | SAPUpdateFIN | Date/Text | 1 | Parsed from PDF text |
| 18 | Name | FinName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remarks | FinComment | Multiline Text | 1 | Parsed from PDF text |
| 21 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 23 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 24 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 25 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 26 | Editor3a | Editor3a | Text | 1 | Parsed from PDF text |
| 27 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 28 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 29 | ITAdmin | ITAdmin | Text | 1 | Parsed from PDF text |
| 30 | Purchasing | PURHOD | Person/Text | 1 | Parsed from PDF text |
| 31 | Purchasing | PUR | Text | 1 | Parsed from PDF text |
| 32 | Freight | FRG | Text | 1 | Parsed from PDF text |
| 33 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 34 | Finance 1 | FIN1 | Text | 1 | Parsed from PDF text |
| 35 | Finance 2 | FIN2 | Text | 1 | Parsed from PDF text |
| 36 | Finance | FINM | Text | 1 | Parsed from PDF text |
| 37 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), submitted (2), approval (2), status (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `FREIVENDREGI`
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
| MASTER-044-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-044-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-044-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 37 |
| Workflow Signal Count | 11 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
