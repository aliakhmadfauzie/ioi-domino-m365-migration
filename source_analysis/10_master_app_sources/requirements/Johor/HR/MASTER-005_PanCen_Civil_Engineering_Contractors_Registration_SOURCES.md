# Master App PDF Source - PanCen - Civil & Engineering Contractors Registration

> Master row: 5 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 5 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Civil & Engineering Contractors Registration | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR | Source inventory |
| Form List | CTFormX - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | CIR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/003_oleObject18.pdf | Extracted embedded PDF | sheet_order_fallback | 0.380 | Explicit mapping | 4 | 2758 | 34 | 4 | IOI PAN-CENTURY OLEOCHEMICALS SDN. BHD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Pan-Century Oleochemicals Sdn. Bhd | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Pan-Century Edible Oils Sdn. Bhd | Inferred from PDF text | Needs Human Confirmation |
| 3 | Registration Form Of Construction & Engineering Works | Inferred from PDF text | Needs Human Confirmation |
| 4 | Project Details (Maklumat Projek) | Inferred from PDF text | Needs Human Confirmation |
| 5 | W1Pno_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Cidb_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | W1Pno_2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Cidb_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | W1Pno_3 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Cidb_3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | W1Pno_4 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Cidb_4 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | (Nama Projek / Kerja) | ProName | Person/Text | 1 | Parsed from PDF text |
| 2 | (Tarikh Mula Kerja) | ComDate | Date/Text | 1 | Parsed from PDF text |
| 3 | (Tarikh Dijangka Siap) | ExpDate | Date/Text | 1 | Parsed from PDF text |
| 4 | (Lokasi Projek) | JobLocation | Text | 1 | Parsed from PDF text |
| 5 | (Jenis projek/kerja | JobType | Choice/Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | (Nama Syarikat) | CompName | Person/Text | 1 | Parsed from PDF text |
| 8 | (Nama PIC) | PICContact | Person/Text | 1 | Parsed from PDF text |
| 9 | (No Pendaftaran CIDB) | CIDBRegister | Text | 1 | Parsed from PDF text |
| 10 | (No. Tel) | ContactNo | Number/Text | 1 | Parsed from PDF text |
| 11 | Original copy of Company Undertaking Letter | CBox_1 | Text | 1 | Parsed from PDF text |
| 12 | Copy of Medical Report for worker age > 55 years old | CBox_2 | Text | 1 | Parsed from PDF text |
| 13 | (Form CIDB LI/96 (Pindaan 1/103) | CBox_3 | Text | 1 | Parsed from PDF text |
| 14 | OSH Coordinator | CBox_9 | Text | 1 | Parsed from PDF text |
| 15 | Copy of Company SOP | CBox_6 | Text | 1 | Parsed from PDF text |
| 16 | Others | CBox_8 | Text | 1 | Parsed from PDF text |
| 17 | Checked By | HRName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remarks | HRRem | Multiline Text | 1 | Parsed from PDF text |
| 20 | Checked By | SHEName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | SHEDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remarks | SHERemark | Multiline Text | 1 | Parsed from PDF text |
| 23 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 24 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 25 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 26 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 27 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 28 | HR Admin | HRAdmin | Text | 1 | Parsed from PDF text |
| 29 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 30 | HR | HR | Text | 1 | Parsed from PDF text |
| 31 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 32 | CCMail | CCMails | Text | 1 | Parsed from PDF text |
| 33 | Email Notification | SendNot | Text | 1 | Parsed from PDF text |
| 34 | Email Add | SendTo | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (1), approved (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `CIR`
Child-list recommendation: `MainDB_HR_Ext_CIR_Rows` candidate for repeating row fields

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
| MASTER-005-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-005-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-005-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 4 |
| Notes | - |
