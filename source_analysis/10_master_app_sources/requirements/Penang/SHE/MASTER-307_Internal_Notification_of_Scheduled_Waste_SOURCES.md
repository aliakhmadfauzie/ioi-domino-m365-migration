# Master App PDF Source - Internal Notification of Scheduled Waste

> Master row: 307 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 307 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Internal Notification of Scheduled Waste | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | Form2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | INTERN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/004_oleObject153.pdf | Extracted embedded PDF | text_match_medium | 0.562 | Explicit mapping | 2 | 1053 | 22 | 12 | INTERNAL NOTIFICATION FOR |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Internal Notification For | Inferred from PDF text | Needs Human Confirmation |
| 2 | Scheduled Waste | Inferred from PDF text | Needs Human Confirmation |
| 3 | REQUESTOR'S SECTION - Details of Scheduled Waste Generated | Inferred from PDF text | Needs Human Confirmation |
| 4 | Hod/Hos | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 6 | HOD/HOS APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 7 | She Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 8 | She-11/040602/00 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : She | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Waste Category Code | Name | Person/Text | 1 | Parsed from PDF text |
| 3 | Waste Name | WasteName | Person/Text | 1 | Parsed from PDF text |
| 4 | Date of Waste Generation | WasteGenDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Location of Waste Generated | Location | Number/Text | 1 | Parsed from PDF text |
| 6 | Quantity Generated in MT | Qty | Number/Text | 1 | Parsed from PDF text |
| 7 | Number of drums/carboys/bags | Qty1 | Number/Text | 1 | Parsed from PDF text |
| 8 | HOD/HOS | HOD | Person/Text | 1 | Parsed from PDF text |
| 9 | Requested by | NotifiedName; Notified | Person/Text | 1 | Parsed from PDF text |
| 10 | Status | HODStatus | Person/Text | 1 | Parsed from PDF text |
| 11 | Approved By | HODApproved | Person/Text | 1 | Parsed from PDF text |
| 12 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Remarks | HODRemarks | Person/Text | 1 | Parsed from PDF text |
| 14 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 15 | Remarks | remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 16 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 17 | SHE Personnel | SHE | Text | 1 | Parsed from PDF text |
| 18 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 19 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 20 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), status (3), approval (2), currentaction (2), approved (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `INTERN`
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
| MASTER-307-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-307-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-307-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 22 |
| Workflow Signal Count | 12 |
| Notes | - |
