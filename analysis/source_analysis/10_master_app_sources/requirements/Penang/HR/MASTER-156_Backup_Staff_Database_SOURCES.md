# Master App PDF Source - Backup Staff Database

> Master row: 156 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 156 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Backup Staff Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | BSD | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/001_oleObject207.pdf | Extracted embedded PDF | text_match_high | 0.752 | Explicit mapping | 3 | 1226 | 37 | 13 | IOI OLEOCHEMICAL INDUSTRIES |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries | Inferred from PDF text | Needs Human Confirmation |
| 2 | Berhad | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A - PERSON IN CHARGE (TO BE FILLED BY HOD/HOS) | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B - BACKUP STAFF | Inferred from PDF text | Needs Human Confirmation |
| 6 | Backup Staff 1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Pic_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Backup Staff 2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Pic_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Backup Staff 3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pic_3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION C - NOMINATED BY HOD/HOS | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Division | Division | Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Name | PIC | Person/Text | 1 | Parsed from PDF text |
| 4 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 5 | Position | Position | Text | 1 | Parsed from PDF text |
| 6 | Area of Responsibility | Responsibility | Text | 1 | Parsed from PDF text |
| 7 | Name | PIC_1 | Person/Text | 1 | Parsed from PDF text |
| 8 | Position | Position_1 | Text | 1 | Parsed from PDF text |
| 9 | Area of Responsibility | Responsibility_1 | Text | 1 | Parsed from PDF text |
| 10 | Name | PIC_2 | Person/Text | 1 | Parsed from PDF text |
| 11 | Position | Position_2 | Text | 1 | Parsed from PDF text |
| 12 | Area of Responsibility | Responsibility_2 | Text | 1 | Parsed from PDF text |
| 13 | Name | PIC_3 | Person/Text | 1 | Parsed from PDF text |
| 14 | Position | Position_3 | Text | 1 | Parsed from PDF text |
| 15 | Area of Responsibility | Responsibility_3 | Text | 1 | Parsed from PDF text |
| 16 | Name | SubmittedBy | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 19 | Revision Required | Revision | Text | 1 | Parsed from PDF text |
| 20 | Updated by | Updatedby | Date/Text | 1 | Parsed from PDF text |
| 21 | Date | Updateddt | Date/Text | 1 | Parsed from PDF text |
| 22 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 23 | Remarks | StaRem | Multiline Text | 1 | Parsed from PDF text |
| 24 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 25 | Position | HODPost | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Remarks | HODRemarks | Person/Text | 1 | Parsed from PDF text |
| 28 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 29 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Current Status | CurrentAction | Choice/Text | 1 | Parsed from PDF text |
| 31 | 1. HR Section | Editor1 | Text | 1 | Parsed from PDF text |
| 32 | 2. HOD Section | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 33 | 3. HOD/HOS | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 34 | HR | HR | Text | 1 | Parsed from PDF text |
| 35 | HR Admin | HRAdmin | Text | 1 | Parsed from PDF text |
| 36 | IT | IT | Text | 1 | Parsed from PDF text |
| 37 | Modification Date | ModifiedDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (6), status (3), approved (1), approve (1), reject (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `BSD`
Child-list recommendation: `MainDB_HR_Ext_BSD_Rows` candidate for repeating row fields

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
| MASTER-156-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-156-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-156-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 37 |
| Workflow Signal Count | 13 |
| Notes | - |
