# Master App PDF Source - Environmental/Microbiology Testing Results Notifications

> Master row: 280 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 280 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Environmental/Microbiology Testing Results Notifications | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | Form - Form \| MRReport - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENVIMICRTEST | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/005_oleObject176.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 595 | 15 | 4 | Environmental/Microbiology Testing |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/012_oleObject183.pdf | Extracted embedded PDF | sheet_order_fallback | 0.379 | Explicit mapping | 2 | 755 | 28 | 4 | Minutes of ISO/IEC 17025 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section C | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Ref No. | RefNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Submitted by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 4 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 5 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 7 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 9 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 10 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 11 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 12 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 13 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 14 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 15 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 16 | Year | Year | Text | 1 | Parsed from PDF text |
| 17 | Notification No. | RptNo | Number/Text | 1 | Parsed from PDF text |
| 18 | Date of Meeting | MDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Time | MTime | Text | 1 | Parsed from PDF text |
| 20 | Venue | MVenue | Text | 1 | Parsed from PDF text |
| 21 | Chairman of the meeting | MChair | Text | 1 | Parsed from PDF text |
| 22 | Attendance | MAttend | Text | 1 | Parsed from PDF text |
| 23 | Minutes of Meeting | Minutes | Text | 1 | Parsed from PDF text |
| 24 | Agenda of Meeting | Agenda | Text | 1 | Parsed from PDF text |
| 25 | Minutes By | MinBy | Text | 1 | Parsed from PDF text |
| 26 | Designation | DesgBy | Text | 1 | Parsed from PDF text |
| 27 | Date | DateBy | Date/Text | 1 | Parsed from PDF text |
| 28 | Name | QCBy | Person/Text | 1 | Parsed from PDF text |
| 29 | Designation | QCDesg | Text | 1 | Parsed from PDF text |
| 30 | Date | QCDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Comments/Remarks | QCRem | Multiline Text | 1 | Parsed from PDF text |
| 32 | Name | GMBy | Person/Text | 1 | Parsed from PDF text |
| 33 | Designation | GMDesg | Text | 1 | Parsed from PDF text |
| 34 | Date | GMDate | Date/Text | 1 | Parsed from PDF text |
| 35 | Comments/Remarks | GMRem | Multiline Text | 1 | Parsed from PDF text |
| 36 | Distribution To | Distribution | Text | 1 | Parsed from PDF text |
| 37 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 38 | QC | QC | Text | 1 | Parsed from PDF text |
| 39 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 40 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (3), submitted (2), review (1), reviewed (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `ENVIMICRTEST`
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
| MASTER-280-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-280-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-280-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 40 |
| Workflow Signal Count | 8 |
| Notes | - |
