# Master App PDF Source - Pest Control Report

> Master row: 355 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 355 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Pest Control Report | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse \| IMS Related \| PHBSVR | Source inventory |
| Form List | ProblemNotification - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PESTCONTREPO | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/002_oleObject64.pdf | Extracted embedded PDF | text_match_high | 0.751 | Explicit mapping | 2 | 1154 | 13 | 9 | ECM PEST CONTROL - Problem Notification |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 4 | Pesthod | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section A before submitting to | Inferred from PDF text | Needs Human Confirmation |
| 6 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification num | NoticeNum | Text | 1 | Parsed from PDF text |
| 2 | Send To | ToEmails | Text | 1 | Parsed from PDF text |
| 3 | CC | CC | Text | 1 | Parsed from PDF text |
| 4 | Problem | SelectionList | Text | 1 | Parsed from PDF text |
| 5 | Station Number | StationNum | Text | 1 | Parsed from PDF text |
| 6 | Problem Description | ProblemDesc | Multiline Text | 1 | Parsed from PDF text |
| 7 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 8 | Sent by | SentBy | Text | 1 | Parsed from PDF text |
| 9 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 10 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 11 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 12 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 13 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), verified (2), currentaction (2), status (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `PESTCONTREPO`
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
| MASTER-355-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-355-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-355-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 9 |
| Notes | - |
