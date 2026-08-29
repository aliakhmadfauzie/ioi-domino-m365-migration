# Master App PDF Source - Raw Material Approval

> Master row: 289 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 289 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Raw Material Approval | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RAWMATEAPPR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/033_oleObject204.pdf | Extracted embedded PDF | text_match_medium | 0.503 | Explicit mapping | 2 | 836 | 18 | 6 | RAW MATERIAL |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Raw Material | Inferred from PDF text | Needs Human Confirmation |
| 2 | APPROVAL MEMO | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval by, | Inferred from PDF text | Needs Human Confirmation |
| 4 | QC Approval by, | Inferred from PDF text | Needs Human Confirmation |
| 5 | Withdrawn Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | HR Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | HOD Section | Inferred from PDF text | Needs Human Confirmation |
| 8 | Withdraw Section | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 2 | No. | TankNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Quantity (m/t) | Qty | Number/Text | 1 | Parsed from PDF text |
| 4 | Description of off spec | Desc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 8 | Withdrawn on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |
| 10 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 11 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Current Status | CurrentAction | Choice/Text | 1 | Parsed from PDF text |
| 13 | HR Section | Editor1 | Text | 1 | Parsed from PDF text |
| 14 | HOD Section | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 15 | HR Section | Editor3 | Text | 1 | Parsed from PDF text |
| 16 | Withdraw Section | Editor4 | Text | 1 | Parsed from PDF text |
| 17 | IT | IT | Text | 1 | Parsed from PDF text |
| 18 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (3), status (1), currentaction (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `RAWMATEAPPR`
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
| MASTER-289-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-289-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-289-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 18 |
| Workflow Signal Count | 6 |
| Notes | - |
