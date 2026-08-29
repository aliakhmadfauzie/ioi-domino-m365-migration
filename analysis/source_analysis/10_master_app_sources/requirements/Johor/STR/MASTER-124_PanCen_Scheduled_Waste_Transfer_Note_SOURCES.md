# Master App PDF Source - PanCen - Scheduled Waste Transfer Note

> Master row: 124 | Site: Johor | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 124 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Scheduled Waste Transfer Note | Clearly Found |
| Owner | STR | Clearly Found |
| Department | STORE \| PCNSVR | Source inventory |
| Form List | SWForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SCHEWASTTRAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/STORE/006_oleObject89.pdf | Extracted embedded PDF | text_match_medium | 0.563 | Explicit mapping | 4 | 2048 | 32 | 11 | Scheduled Waste Transfer Note |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A : To be filled by Requestor / Waste Generator | Inferred from PDF text | Needs Human Confirmation |
| 2 | Applicant Name | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B : Departmental Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C : To be filled by Store PIC / SW Handler - before transfer | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION D : To be filled by Store PIC / SW Handler - after transfer | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION E : Store Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | Std - 27/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section D | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section E | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Applicant Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 2 | Designation | Desg | Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Application Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 5 | To be approved by Deputy Manager and above | HOD | Person/Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Item | Item | Text | 1 | Parsed from PDF text |
| 8 | Waste Description | WDesc | Multiline Text | 1 | Parsed from PDF text |
| 9 | Unit | Unit | Text | 1 | Parsed from PDF text |
| 10 | Packaging Method | PackMet | Person/Text | 1 | Parsed from PDF text |
| 11 | Attachments | Attach | Text | 1 | Parsed from PDF text |
| 12 | Generation Date | GenDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Expiry Date | ExpDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Location | Location | Text | 1 | Parsed from PDF text |
| 15 | Name | DPName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | DPDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Comment | DPComm | Multiline Text | 1 | Parsed from PDF text |
| 18 | Received Date | ReceiveDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 20 | Rejected By | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 21 | Checked By | CheckedBy | Text | 1 | Parsed from PDF text |
| 22 | Date Received | RecvDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Waste Code | WasteCode | Text | 1 | Parsed from PDF text |
| 24 | Quantity | Quantity | Number/Text | 1 | Parsed from PDF text |
| 25 | Unit | SDUnit | Text | 1 | Parsed from PDF text |
| 26 | Packaging Method | PackMet_1 | Person/Text | 1 | Parsed from PDF text |
| 27 | Label condition | LabelCond | Text | 1 | Parsed from PDF text |
| 28 | Estimates weight(mt) | EstWeight | Text | 1 | Parsed from PDF text |
| 29 | Remarks | SDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 30 | Name | STName | Person/Text | 1 | Parsed from PDF text |
| 31 | Date | STDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Comment | STComm | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (3), approved (2), status (2), hod (1), rejected (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `SCHEWASTTRAN`
Child-list recommendation: `MainDB_STR_Ext_SCHEWASTTRAN_Rows` candidate for repeating row fields

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
| MASTER-124-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-124-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-124-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 32 |
| Workflow Signal Count | 11 |
| Notes | - |
