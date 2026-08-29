# Master App PDF Source - Engineering Service Request Form

> Master row: 139 | Site: Penang | Owner: ENG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 139 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Engineering Service Request Form | Clearly Found |
| Owner | ENG | Clearly Found |
| Department | Eng \| PHBSVR | Source inventory |
| Form List | EngSRFormV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENGISERV | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Eng/001_oleObject25.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2068 | 27 | 12 | Engineering Service Request Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Engineering Service Request Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section 1 - Requestor's Information | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section 2 - Requestor's Head of Div/Department Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section 3 - Approval from SGM Operations Office | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section 4 - Verification by Department Head (For Engineering Dept Use only) | Inferred from PDF text | Needs Human Confirmation |
| 6 | Section 5 - Engineering personnel in charge (report/attachment) | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section 6 - Verification by Engineering Dept. Head | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section 7 - Project/Service Acceptance by Requestor | Inferred from PDF text | Needs Human Confirmation |
| 9 | Editor - Section 1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Editor - Section 2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Editor - Section 3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Editor - Section 5 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Eng. Service Reference Num. | EngNum | Text | 1 | Parsed from PDF text |
| 2 | CAR Num | CarNum | Text | 1 | Parsed from PDF text |
| 3 | Status | StatusHOD | Person/Text | 1 | Parsed from PDF text |
| 4 | Comments | Comments1 | Multiline Text | 1 | Parsed from PDF text |
| 5 | Name | DeptHead | Person/Text | 1 | Parsed from PDF text |
| 6 | Date | EDHDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Status | StatusDIV | Choice/Text | 1 | Parsed from PDF text |
| 8 | Comments | Comments2 | Multiline Text | 1 | Parsed from PDF text |
| 9 | Name | DIVHead | Person/Text | 1 | Parsed from PDF text |
| 10 | Date | DivDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Comments | Comments3 | Multiline Text | 1 | Parsed from PDF text |
| 12 | Name | VerifyHOD | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | VerifyDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Type | SC | Choice/Text | 1 | Parsed from PDF text |
| 15 | Comments | CommentsPIC | Person/Text | 1 | Parsed from PDF text |
| 16 | Attachments | PICAttachment | Person/Text | 1 | Parsed from PDF text |
| 17 | Name | PICName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | PICDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Status | StatusVerify_1 | Choice/Text | 1 | Parsed from PDF text |
| 20 | Comments | Comments3_1 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Name | VerifyHOD_1 | Person/Text | 1 | Parsed from PDF text |
| 22 | Date | VerifyDate_1 | Date/Text | 1 | Parsed from PDF text |
| 23 | Status | StatusAccept | Choice/Text | 1 | Parsed from PDF text |
| 24 | Comments | Comments4 | Multiline Text | 1 | Parsed from PDF text |
| 25 | Name | RequestorName | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | RequestedDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), approval (2), verification (2), hod (2), approved (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_ENG`
FormCode: `ENGISERV`
Child-list recommendation: `MainDB_ENG_Ext_ENGISERV_Rows` candidate for repeating row fields

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
| MASTER-139-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-139-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-139-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 12 |
| Notes | - |
