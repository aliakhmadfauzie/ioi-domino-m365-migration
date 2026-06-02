# Master App PDF Source - Masterlist of Filter/Glass/Cleaning Agents & Chemicals

> Master row: 237 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 237 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Masterlist of Filter/Glass/Cleaning Agents & Chemicals | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | InterDept - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFFILT | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/039_oleObject271.pdf | Extracted embedded PDF | sheet_order_fallback | 0.382 | Explicit mapping | 2 | 1336 | 12 | 3 | IOI OLEOCHEMICAL INDUSTRIES BERHAD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries Berhad | Inferred from PDF text | Needs Human Confirmation |
| 2 | INTER-DEPT/SECTION IMPROVEMENT | Inferred from PDF text | Needs Human Confirmation |
| 3 | Activities Endorsement Letter | Inferred from PDF text | Needs Human Confirmation |
| 4 | Dept/Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | The creator of the this request | Inferred from PDF text | Needs Human Confirmation |
| 6 | Current status of this request | Inferred from PDF text | Needs Human Confirmation |
| 7 | Editor for Section A | Inferred from PDF text | Needs Human Confirmation |
| 8 | Editor for Section B | Inferred from PDF text | Needs Human Confirmation |
| 9 | Qapic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Num | RNum | Text | 1 | Parsed from PDF text |
| 2 | Project Title | ProjectTitle | Text | 1 | Parsed from PDF text |
| 3 | Activity Period | ActivityPeriod | Choice/Text | 1 | Parsed from PDF text |
| 4 | Time Frame | TimeFrame | Text | 1 | Parsed from PDF text |
| 5 | FL Involved | FLDept_1 | Text | 1 | Parsed from PDF text |
| 6 | Objective | FLObjective | Text | 1 | Parsed from PDF text |
| 7 | Comments/Remarks | Comments | Multiline Text | 1 | Parsed from PDF text |
| 8 | Late Submission | LateSubmission | Text | 1 | Parsed from PDF text |
| 9 | Sent date | SentDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 11 | Discarded on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 12 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (1), status (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `MASTOFFILT`
Child-list recommendation: `MainDB_QA_Ext_MASTOFFILT_Rows` candidate for repeating row fields

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
| MASTER-237-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-237-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-237-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 3 |
| Notes | - |
