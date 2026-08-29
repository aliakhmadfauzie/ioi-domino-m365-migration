# Master App PDF Source - Cafeteria Inspection Database

> Master row: 157 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 157 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Cafeteria Inspection Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CAFEINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/002_oleObject208.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 621 | 19 | 7 | Cafeteria Inspection |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiator Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | Num | Number/Text | 1 | Parsed from PDF text |
| 2 | Site | Site | Text | 1 | Parsed from PDF text |
| 3 | Team Members | TeamMembers | Text | 1 | Parsed from PDF text |
| 4 | Inspector | Inspector | Text | 1 | Parsed from PDF text |
| 5 | Inspection Date | InsDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Inspection Time | InsTime | Text | 1 | Parsed from PDF text |
| 7 | Submitted By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 8 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Reviewed By | ReviewedBy | Text | 1 | Parsed from PDF text |
| 10 | Reviewed Date | ReviewedDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 12 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 13 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 14 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 15 | Editors | Editors | Text | 1 | Parsed from PDF text |
| 16 | INO | INO | Text | 1 | Parsed from PDF text |
| 17 | IT | IT | Text | 1 | Parsed from PDF text |
| 18 | Committee Members - ACM | ACMComm | Text | 1 | Parsed from PDF text |
| 19 | Committee Members - ECM | ECMComm | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (2), reviewed (2), review (1), status (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `CAFEINSP`
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
| MASTER-157-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-157-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-157-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 19 |
| Workflow Signal Count | 7 |
| Notes | - |
