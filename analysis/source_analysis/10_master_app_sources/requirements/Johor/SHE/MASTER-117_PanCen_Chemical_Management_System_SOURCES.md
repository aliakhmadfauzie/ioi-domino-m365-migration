# Master App PDF Source - PanCen - Chemical Management System

> Master row: 117 | Site: Johor | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 117 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Chemical Management System | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PCNSVR | Source inventory |
| Form List | CMR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CHEM | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/SHE/001_oleObject213.pdf | Extracted embedded PDF | sheet_order_fallback | 0.250 | Explicit mapping | 3 | 907 | 27 | 16 | Chemical Management Reports |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A : DETAILS OF DOCUMENT | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B : DETAILS OF NOTIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C : DETAILS OF APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 6 | She-141/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 7 | She Hod | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Shehod | Inferred from PDF text | Needs Human Confirmation |
| 9 | : She | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Doc No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Business Division | Division | Text | 1 | Parsed from PDF text |
| 3 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 4 | Status | Action | Choice/Text | 1 | Parsed from PDF text |
| 5 | Revised Date | DocRelease | Date/Text | 1 | Parsed from PDF text |
| 6 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 7 | Department | Department | Text | 1 | Parsed from PDF text |
| 8 | HOD Name | HOD | Person/Text | 1 | Parsed from PDF text |
| 9 | CC | CC | Text | 1 | Parsed from PDF text |
| 10 | Date Submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 11 | Notifier Name | NotifierName | Person/Text | 1 | Parsed from PDF text |
| 12 | HOD Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 13 | Comment | HODComment | Person/Text | 1 | Parsed from PDF text |
| 14 | SHE HOD Name | SHEHODName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date Approved | SHEHODDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Comment | SHEHODComment | Person/Text | 1 | Parsed from PDF text |
| 17 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 18 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 20 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 21 | IT | IT | Text | 1 | Parsed from PDF text |
| 22 | SHE HOD | SHEHOD | Person/Text | 1 | Parsed from PDF text |
| 23 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 24 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 25 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 26 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 27 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (5), approve (2), reject (2), approved (2), status (1), submitted (1), approval (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `CHEM`
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
| MASTER-117-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-117-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-117-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 16 |
| Notes | - |
