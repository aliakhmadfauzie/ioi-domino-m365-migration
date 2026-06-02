# Master App PDF Source - HR Applications Problem Reporting

> Master row: 165 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 165 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | HR Applications Problem Reporting | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | NewForm - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | HRAPR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/014_oleObject220.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 2 | 464 | 6 | 3 | HR NOTICE/INFO |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Hr Notice/Info | Inferred from PDF text | Needs Human Confirmation |
| 2 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section Control | Inferred from PDF text | Needs Human Confirmation |
| 4 | Hr Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | Hrhod | Inferred from PDF text | Needs Human Confirmation |
| 6 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | Send | Text | 1 | Parsed from PDF text |
| 2 | CC | CC | Text | 1 | Parsed from PDF text |
| 3 | Title | Subject | Text | 1 | Parsed from PDF text |
| 4 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 5 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 6 | Phone Ext. No. | Ext | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HRAPR`
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
| MASTER-165-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-165-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-165-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 6 |
| Workflow Signal Count | 3 |
| Notes | - |
