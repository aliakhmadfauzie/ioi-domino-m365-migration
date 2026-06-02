# Master App PDF Source - PanCen - Drawing Request Form

> Master row: 61 | Site: Johor | Owner: Project | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 61 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Drawing Request Form | Clearly Found |
| Owner | Project | Clearly Found |
| Department | PRODUCTION \| Project \| PCNSVR | Source inventory |
| Form List | frmDrawing2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | DRAW | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/Project/002_oleObject212.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1575 | 25 | 9 | IOI PAN-CENTURY EDIBLE OILS SDN.BHD. |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Pan-Century Edible Oils Sdn.Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Pan-Century Oleochemical Sdn.Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 3 | DRAWING REQUEST FORM | Inferred from PDF text | Needs Human Confirmation |
| 4 | Request No. | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION A - Descriptions / Details | Inferred from PDF text | Needs Human Confirmation |
| 6 | Description / Details | Inferred from PDF text | Needs Human Confirmation |
| 7 | (Please do attach all the available details like layout / sketch / tech details / etc) | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION B - Recommended By | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION C - Approved for Execution | Inferred from PDF text | Needs Human Confirmation |
| 10 | Droff | Inferred from PDF text | Needs Human Confirmation |
| 11 | Prjhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 5 | requester | Attch | Text | 1 | Parsed from PDF text |
| 6 | Requested by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 7 | Department | ReqDept | Text | 1 | Parsed from PDF text |
| 8 | Requested Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | HOD Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 10 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Remarks | HODRem | Person/Text | 1 | Parsed from PDF text |
| 12 | Name | PJHODName | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | PJHODDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Remarks | PJHODRem | Person/Text | 1 | Parsed from PDF text |
| 15 | Drawing Attachment | DwgAtt | Text | 1 | Parsed from PDF text |
| 16 | Drawing Reference No. | DwgRefNo | Number/Text | 1 | Parsed from PDF text |
| 17 | Drawn by | DrawnBy | Text | 1 | Parsed from PDF text |
| 18 | Date | ChkDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Name | AccName | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | AccDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Remarks | AccRem | Multiline Text | 1 | Parsed from PDF text |
| 22 | Name | PJHODName2 | Person/Text | 1 | Parsed from PDF text |
| 23 | Date | PJHODDate2 | Date/Text | 1 | Parsed from PDF text |
| 24 | Remarks | PJHODRem2 | Person/Text | 1 | Parsed from PDF text |
| 25 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (5), approved (1), verified (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PROJECT`
FormCode: `DRAW`
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
| MASTER-061-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-061-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-061-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 25 |
| Workflow Signal Count | 9 |
| Notes | - |
