# Master App PDF Source - ECM Pest Control Report

> Master row: 354 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 354 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ECM Pest Control Report | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse \| IMS Related \| PHBSVR | Source inventory |
| Form List | MonthlyReport - Form \| MSDSRecords - Form \| Observations - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ECMPESTCONT | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/005_oleObject67.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 2 | 983 | 8 | 10 | ECM PEST CONTROL |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/006_oleObject68.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 2 | 654 | 6 | 6 | ECM PEST CONTROL - MSDS |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/007_oleObject69.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 2 | 993 | 11 | 9 | ECM PEST CONTROL - Observations |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ecm Pest Control | Inferred from PDF text | Needs Human Confirmation |
| 2 | Verification | Inferred from PDF text | Needs Human Confirmation |
| 3 | Pesthod | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section A before submitting to | Inferred from PDF text | Needs Human Confirmation |
| 5 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ecm Pest Control - Msds | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Monthly Report for | SelectionList | Text | 1 | Parsed from PDF text |
| 2 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 3 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 4 | Sent by | SentBy | Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 7 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 8 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 9 | Send To | ToEmails | Text | 1 | Parsed from PDF text |
| 10 | Chemical Name | ChemicalName | Person/Text | 1 | Parsed from PDF text |
| 11 | Observations | Observations | Text | 1 | Parsed from PDF text |
| 12 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 13 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (9), currentaction (6), verified (4), rejected (3), status (2), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `ECMPESTCONT`
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
| MASTER-354-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-354-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-354-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 13 |
| Workflow Signal Count | 25 |
| Notes | - |
