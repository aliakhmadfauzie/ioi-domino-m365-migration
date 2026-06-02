# Master App PDF Source - SAP Reversal for Receiving & Issuing

> Master row: 332 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 332 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Reversal for Receiving & Issuing | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store | Source inventory |
| Form List | InvAdjustment - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPREVERECE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/007_oleObject41.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 3 | 1390 | 47 | 11 | FormTitle |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approval of Requestor's Dept Head | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval of Material Dept Head | Inferred from PDF text | Needs Human Confirmation |
| 4 | Material Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Acmstr | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Ecmstr | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Str | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Mat | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Mathod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Serial No | SerialNo | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Material Code | MatCode | Text | 1 | Parsed from PDF text |
| 5 | Material Description | MatDesc | Multiline Text | 1 | Parsed from PDF text |
| 6 | Quantity | Qty; UOM | Number/Text | 1 | Parsed from PDF text |
| 7 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 8 | Remarks | Rem | Multiline Text | 1 | Parsed from PDF text |
| 9 | Date Goods Issued from Store | GIssued | Date/Text | 1 | Parsed from PDF text |
| 10 | Date Goods Return to Store | GReturn | Date/Text | 1 | Parsed from PDF text |
| 11 | Reservation No. | ResNo | Number/Text | 1 | Parsed from PDF text |
| 12 | Material Doc. No. | MatDocNo | Number/Text | 1 | Parsed from PDF text |
| 13 | Duration Items at enduser | Duration; Days | Text | 1 | Parsed from PDF text |
| 14 | Reason of Return/ Adjustment | ReasonReturn | Multiline Text | 1 | Parsed from PDF text |
| 15 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 16 | Requestor Name | ReqName | Person/Text | 1 | Parsed from PDF text |
| 17 | Requestor Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remark | HODRem | Person/Text | 1 | Parsed from PDF text |
| 21 | Name | MatHODName | Person/Text | 1 | Parsed from PDF text |
| 22 | Date | MatHODDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Remark | MatHODRem | Person/Text | 1 | Parsed from PDF text |
| 24 | Material Doc. No. | MatDocNo2 | Number/Text | 1 | Parsed from PDF text |
| 25 | TO No. | MatTONo | Number/Text | 1 | Parsed from PDF text |
| 26 | Remark | MatRem | Multiline Text | 1 | Parsed from PDF text |
| 27 | Adjusted Name | MatName | Person/Text | 1 | Parsed from PDF text |
| 28 | Adjusted Date | MatDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Rejected Info | RejInfo | Text | 1 | Parsed from PDF text |
| 30 | Remarks | StoreRem | Multiline Text | 1 | Parsed from PDF text |
| 31 | Name | STRName | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | STRDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 34 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 35 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 36 | IT | IT | Text | 1 | Parsed from PDF text |
| 37 | INO | INO | Text | 1 | Parsed from PDF text |
| 38 | Store ACM | ACMSTR | Text | 1 | Parsed from PDF text |
| 39 | Store ECM | ECMSTR | Text | 1 | Parsed from PDF text |
| 40 | Material | MAT | Text | 1 | Parsed from PDF text |
| 41 | Material HOD | MATHOD | Person/Text | 1 | Parsed from PDF text |
| 42 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 43 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 44 | Editor 2a | Editor2a | Text | 1 | Parsed from PDF text |
| 45 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 46 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 47 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (4), hod (3), approve (2), rejected (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `SAPREVERECE`
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
| MASTER-332-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-332-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-332-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 47 |
| Workflow Signal Count | 11 |
| Notes | - |
