# Master App PDF Source - Laboratory Customer Survey

> Master row: 96 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 96 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Laboratory Customer Survey | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC | Source inventory |
| Form List | OTHERForm - Form \| PRODForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | LABOCUSTSURV | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/043_oleObject206.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 2243 | 24 | 9 | PanCen Laboratory Customer Survey/Feedback Form |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/044_oleObject207.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 2005 | 24 | 2 | PanCen Laboratory Customer Survey/Feedback Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Shipping / Logistics / Wh / Production Planning / Store | Inferred from PDF text | Needs Human Confirmation |
| 2 | a) SAP shipment approval | Inferred from PDF text | Needs Human Confirmation |
| 3 | b) Bulking / Raw material / Dispatch approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | c) Stock allocation memo approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | d) Storage tank / Pipeline transfer approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | e) Auxiliary material approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | c) Responsible & follow up on the agreed request / action | Inferred from PDF text | Needs Human Confirmation |
| 8 | Thank You For Responding! | Inferred from PDF text | Needs Human Confirmation |
| 9 | Qcadmin | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Qcadmin | Inferred from PDF text | Needs Human Confirmation |
| 11 | Production | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Send To | SendToName; SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Sent by | Submittedby | Text | 1 | Parsed from PDF text |
| 4 | Sent on | Submittedon | Text | 1 | Parsed from PDF text |
| 5 | Response Required by | Respondby | Text | 1 | Parsed from PDF text |
| 6 | Total Points | TtlPs | Number/Text | 1 | Parsed from PDF text |
| 7 | Total Questions | TtlQs | Number/Text | 1 | Parsed from PDF text |
| 8 | Total Score | Score | Number/Text | 1 | Parsed from PDF text |
| 9 | Continuous Improvement) | Comment | Multiline Text | 1 | Parsed from PDF text |
| 10 | Name | Name; Completedby | Person/Text | 1 | Parsed from PDF text |
| 11 | Job Title | JobTitle | Text | 1 | Parsed from PDF text |
| 12 | Department | Dept | Text | 1 | Parsed from PDF text |
| 13 | Date | Completedon | Date/Text | 1 | Parsed from PDF text |
| 14 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 15 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 17 | CA | CurrentAction | Text | 1 | Parsed from PDF text |
| 18 | QC | QC | Text | 1 | Parsed from PDF text |
| 19 | QCADMIN | QCADMIN | Text | 1 | Parsed from PDF text |
| 20 | IT | IT | Text | 1 | Parsed from PDF text |
| 21 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 22 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 23 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 24 | Total | TtlScore | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (5), rejected (2), ca (2), currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `LABOCUSTSURV`
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
| MASTER-096-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-096-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-096-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 11 |
| Notes | - |
