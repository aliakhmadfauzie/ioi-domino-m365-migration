# Master App PDF Source - IMS & Halal Minutes of Meeting

> Master row: 235 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 235 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IMS & Halal Minutes of Meeting | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | frmIMS - Form \| frmHalal - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IMSHALAMINU | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/048_oleObject280.pdf | Extracted embedded PDF | text_match_high | 0.602 | Explicit mapping | 2 | 658 | 14 | 3 | Title |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/049_oleObject281.pdf | Extracted embedded PDF | text_match_high | 0.600 | Explicit mapping | 1 | 382 | 8 | 2 | Halal (External Inspection |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | frmIMS - Form \| frmHalal - Form | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Date of Meeting | MeetDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Review Period | RevPeriod | Text | 1 | Parsed from PDF text |
| 4 | Meeting | Meeting | Text | 1 | Parsed from PDF text |
| 5 | Chairman of the Meeting | COMeeting | Text | 1 | Parsed from PDF text |
| 6 | Minutes of Meeting | Minutes | Text | 1 | Parsed from PDF text |
| 7 | Other Reports | OthRep | Text | 1 | Parsed from PDF text |
| 8 | Minutes By | MinBy | Text | 1 | Parsed from PDF text |
| 9 | Designation | MinByDesg | Text | 1 | Parsed from PDF text |
| 10 | Date | MinByDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Name | CName | Person/Text | 1 | Parsed from PDF text |
| 12 | Designation | CDesg | Text | 1 | Parsed from PDF text |
| 13 | Date | ChDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Distributed to | Distributed | Text | 1 | Parsed from PDF text |
| 15 | Date of Inspection | InsDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Inspected by | InsBy | Text | 1 | Parsed from PDF text |
| 17 | Report | Report | Text | 1 | Parsed from PDF text |
| 18 | Finding | Finding | Text | 1 | Parsed from PDF text |
| 19 | Acknowledged By | AckBy | Text | 1 | Parsed from PDF text |
| 20 | Designation | AckDesg | Text | 1 | Parsed from PDF text |
| 21 | Date | AckDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), ca (2), review (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IMSHALAMINU`
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
| MASTER-235-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-235-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-235-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 5 |
| Notes | - |
