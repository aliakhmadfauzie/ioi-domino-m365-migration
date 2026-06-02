# Master App PDF Source - Storage Tank Inspection Report

> Master row: 298 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 298 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Storage Tank Inspection Report | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PHBSVR | Source inventory |
| Form List | STIR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORTANKINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/035_oleObject206.pdf | Extracted embedded PDF | text_match_medium | 0.513 | Explicit mapping | 3 | 1233 | 37 | 5 | IOI ACIDCHEM SDN |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Acidchem Sdn | Inferred from PDF text | Needs Human Confirmation |
| 2 | Bhd (Storage Tank Inspection Report) | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Report No. | ReportNo | Number/Text | 1 | Parsed from PDF text |
| 2 | To | Recipient | Text | 1 | Parsed from PDF text |
| 3 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 4 | CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Date | DateInspect | Date/Text | 1 | Parsed from PDF text |
| 6 | 1. ACM/FIMA/PBI Storage Tank No. | TankNo | Number/Text | 1 | Parsed from PDF text |
| 7 | 2. a) Product | Product | Text | 1 | Parsed from PDF text |
| 8 | b) S/O No. | SONo | Number/Text | 1 | Parsed from PDF text |
| 9 | c) Quantity (MT) | Qty | Number/Text | 1 | Parsed from PDF text |
| 10 | 3. Purpose | Purpose | Text | 1 | Parsed from PDF text |
| 11 | 4. Previous Product in Tank | PrevProduct | Text | 1 | Parsed from PDF text |
| 12 | a) Tank Capacity | Capacity; MT | Text | 1 | Parsed from PDF text |
| 13 | b) Type of Tank | Type | Choice/Text | 1 | Parsed from PDF text |
| 14 | c) Method of Cleaning | CleanMethod | Person/Text | 1 | Parsed from PDF text |
| 15 | d) Tank | Tank | Text | 1 | Parsed from PDF text |
| 16 | e) Any oil/product at bottom & wall of the tank | AnyOilProduct | Text | 1 | Parsed from PDF text |
| 17 | f) Any water at bottom of the tank | AnyWater | Text | 1 | Parsed from PDF text |
| 18 | g) Any dirt/foreign particles | AnyDirt | Text | 1 | Parsed from PDF text |
| 19 | (attached white paper for reference) | SwabTest | Text | 1 | Parsed from PDF text |
| 20 | a) Storage Tank No. | StorageTankNo | Number/Text | 1 | Parsed from PDF text |
| 21 | Location | Location | Text | 1 | Parsed from PDF text |
| 22 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 23 | Bulking Product | BulkProduct | Text | 1 | Parsed from PDF text |
| 24 | b) Reason for not approving | Reason | Multiline Text | 1 | Parsed from PDF text |
| 25 | c) Corrective Action | CorrectiveAction | Text | 1 | Parsed from PDF text |
| 26 | 7. Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 27 | Date | InsDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Verified by | VerName | Person/Text | 1 | Parsed from PDF text |
| 29 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Remarks | VerRem | Multiline Text | 1 | Parsed from PDF text |
| 31 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 32 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 33 | CA | CA | Text | 1 | Parsed from PDF text |
| 34 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 35 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 36 | IT | IT | Text | 1 | Parsed from PDF text |
| 37 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), ca (2), verified (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `STORTANKINSP`
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
| MASTER-298-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-298-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-298-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 37 |
| Workflow Signal Count | 5 |
| Notes | - |
