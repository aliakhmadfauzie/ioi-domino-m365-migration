# Form Requirement — Backup Staff Database (BSD)

> **Source ID**: SRC-HR-001 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 98/100
> **Evidence**: PyMuPDF direct text extraction from `PRAI_SITE_FORM/HR/BSD.pdf` (3 pages, 1,224 chars)
> **Promotion**: ✅ Promote with Human Confirmation — Status/CurrentAction values need HR input

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-001 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "Backup Staff Database" | Clearly Found |
| Form Purpose | Maintain backup staff records — person-in-charge, 3 backup staff slots, nominated by HOD/HOS, approved by Head of Division | Clearly Found |
| Pages | 3 | Clearly Found |

## 2. Source Evidence Summary

| Evidence | Source |
|---|---|
| Raw text extraction | `11_pdf_extraction_layer/raw_text/BSD_page1.txt`, `BSD_page2.txt`, `BSD_page3.txt` |
| Page inventory | `11_pdf_extraction_layer/page_inventory/SRC-HR-001_BSD_page_inventory.md` |
| Visual notes | `11_pdf_extraction_layer/visual_notes/SRC-HR-001_BSD_visual_notes.md` |
| Field candidates | `11_pdf_extraction_layer/field_candidates/SRC-HR-001_BSD_field_candidates.md` |
| Workflow candidates | `11_pdf_extraction_layer/workflow_candidates/SRC-HR-001_BSD_workflow_candidates.md` |

## 3. Form Sections

| Section | Page | Type | Key Fields |
|---|---|---|---|
| SECTION A — PERSON IN CHARGE | 1 | Requester (HOD/HOS) | Division, Dept, Section, PIC, EmpNo, Position, Responsibility, HOD |
| SECTION B — BACKUP STAFF | 1-2 | Repeating (Child List Candidate) | PIC_1-3, Position_1-3, Responsibility_1-3 |
| SECTION C — NOMINATED BY HOD/HOS | 2 | Requester | SubmittedBy, SubmitDate, Remark |
| SECTION D — APPROVED BY HEAD OF DIVISION | 2-3 | Approver | HODName, HODPost, HODDate, HODRemarks, HODApp |
| Admin/Updates | 2-3 | Admin | Revision, Updatedby, Updateddt, Status, StaRem |
| Hidden Fields | 3 | System | DocAuthor, CurrentAction, Editor1-3, HR, HRAdmin, IT, ModifiedDate |

## 4. Field Requirements

### SECTION A — PERSON IN CHARGE (Page 1)

| # | PDF Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| 1 | Division | `Division` | Text | Inferred | Unknown | Clearly Found |
| 2 | Department | `Dept` | Text | Inferred | Unknown | Clearly Found |
| 3 | Section | `Section` | Text | Inferred | Unknown | Clearly Found |
| 4 | Name (PIC) | `PIC` | Person | Inferred | — | Clearly Found |
| 5 | Employee No. | `EmpNo` | Text | Inferred | — | Clearly Found |
| 6 | Position | `Position` | Text | Inferred | — | Clearly Found |
| 7 | Area of Responsibility | `Responsibility` | Multiline | Inferred | — | Clearly Found |
| 8 | Department/Division Head | `HOD` | Person | Inferred | — | Clearly Found |

### SECTION B — BACKUP STAFF (Pages 1-2) ⚠️ CHILD LIST CANDIDATE

| # | PDF Label | Domino Field | Type | Req | Confidence |
|---|---|---|---|---|---|
| 9 | Name (BS1) | `PIC_1` | Person | Inferred | Clearly Found |
| 10 | Position (BS1) | `Position_1` | Text | Inferred | Clearly Found |
| 11 | Area of Responsibility (BS1) | `Responsibility_1` | Multiline | Inferred | Clearly Found |
| 12 | Name (BS2) | `PIC_2` | Person | Inferred | Clearly Found |
| 13 | Position (BS2) | `Position_2` | Text | Inferred | Clearly Found |
| 14 | Area of Responsibility (BS2) | `Responsibility_2` | Multiline | Inferred | Clearly Found |
| 15 | Name (BS3) | `PIC_3` | Person | Inferred | Clearly Found |
| 16 | Position (BS3) | `Position_3` | Text | Inferred | Clearly Found |
| 17 | Area of Responsibility (BS3) | `Responsibility_3` | Multiline | Inferred | Clearly Found |

**⚠️ Design Note**: BACKUP STAFF 1-3 are repeating blocks with identical field patterns and numbered suffixes (PIC_1, PIC_2, PIC_3). This is a **Child List Candidate** — recommend `MainDB_HR_Ext_BSD` child list with Name, Position, Responsibility columns instead of fixed PIC_1/2/3 columns.

### SECTION C — NOMINATED BY HOD/HOS (Page 2)

| # | PDF Label | Domino Field | Type | Req | Confidence |
|---|---|---|---|---|---|
| 18 | Name (Submitted By) | `SubmittedBy` | Person | Inferred | Clearly Found |
| 19 | Date | `SubmitDate` | Date | Inferred | Clearly Found |
| 20 | Remark | `Remark` | Multiline | No | Clearly Found |

### SECTION D — APPROVED BY HEAD OF DIVISION (Pages 2-3)

| # | PDF Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| 21 | APPROVE REJECT | (choice control) | Choice | Inferred | **APPROVE, REJECT** | Clearly Found |
| 22 | Name (HOD) | `HODName` | Person | Inferred | — | Clearly Found |
| 23 | Position (HOD) | `HODPost` | Text | Inferred | — | Clearly Found |
| 24 | Date (HOD) | `HODDate` | Date | Inferred | — | Clearly Found |
| 25 | Remarks (HOD) | `HODRemarks` | Multiline | No | — | Clearly Found |
| 26 | HOD Approval Flag | `HODApp` | Boolean | Inferred | — | Clearly Found |

### ADMIN/UPDATES (Pages 2-3)

| # | PDF Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| 27 | Revision Required | `Revision` | Choice | No | Unknown | Clearly Found |
| 28 | Updated by | `Updatedby` | Person | No | — | Clearly Found |
| 29 | Date (Updated) | `Updateddt` | Date | No | — | Clearly Found |
| 30 | Status | `Status` | Choice | Inferred | Unknown | Clearly Found |
| 31 | Remarks (Status) | `StaRem` | Multiline | No | — | Clearly Found |

### HIDDEN FIELDS (Page 3)

| # | PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| 32 | Created by | `DocAuthor` | Person | Clearly Found |
| 33 | Created on | `CDate` | Date | Clearly Found |
| 34 | Current Status | `CurrentAction` | Choice | Clearly Found |
| 35 | HR Section | `Editor1` | Person | Clearly Found |
| 36 | HOD Section | `Editor2` | Person | Clearly Found |
| 37 | HOD/HOS | `Editor3` | Person | Clearly Found |
| 38 | HR Admin | `HRAdmin` | Person | Clearly Found |
| 39 | Modification Date | `ModifiedDate` | Date | Clearly Found |

## 5. Choice Fields

| Field | Choices Found | Confidence |
|---|---|---|
| APPROVE REJECT | **APPROVE, REJECT** — exact text from PDF | Clearly Found |
| Division | Unknown | Unknown |
| Department | Unknown | Unknown |
| Section | Unknown | Unknown |
| Revision Required | Unknown | Unknown |
| Status | Unknown | Unknown |
| CurrentAction | Unknown | Unknown |

## 6. Validation Rules

None visible in PDF text.

## 7. Repeating Tables

**BACKUP STAFF 1-3**: ⚠️ Child List Candidate — 3 identical blocks with numbered suffixes. Recommend `MainDB_HR_Ext_BSD` child list (Name, Position, Area of Responsibility) rather than fixed PIC_1/2/3 columns.

## 8. Attachments

None visible.

## 9. Role and Visibility Rules

| Section | Visible To | Editable By | Condition | Evidence |
|---|---|---|---|---|
| SECTION A | HOD/HOS | HOD/HOS | During creation | "TO BE FILLED BY HOD/HOS" |
| SECTION B | HOD/HOS | HOD/HOS | During creation | Section under HOD/HOS |
| SECTION C | HOD/HOS | HOD/HOS | During nomination | "NOMINATED BY HOD/HOS" |
| SECTION D | Head of Division | Head of Division | After nomination | "APPROVED BY HEAD OF DIVISION" |
| Admin/Updates | Admin | Admin | Post-approval | "For HOD/HOS Use" |

## 10. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | **Required** | Clearly Found |
| Evidence | CurrentAction field + "APPROVE REJECT" text + 4 labeled sections with role assignments + HODApp flag | Clearly Found |

### Workflow Stages (Inferred from Section Structure)

| Stage | Section | Role | Action |
|---|---|---|---|
| 1 | SECTION A | HOD/HOS | Fill person-in-charge details |
| 2 | SECTION C | HOD/HOS | Nominate backup staff, submit |
| 3 | SECTION D | Head of Division | APPROVE or REJECT |

**Routing**: `CurrentAction` field exists (Domino workflow state machine). Exact state values not in PDF text. Editor1/2/3 roles (HR Section, HOD Section, HOD/HOS) suggest notification routing.

## 11. Status Values

| Field | Values | Confidence |
|---|---|---|
| Status | Unknown — not in PDF text | Unknown |
| CurrentAction | Unknown — not in PDF text | Unknown |

## 12. SharePoint Design Recommendation

**Parent List**: `MainDB_HR` (header + approval fields)
**Child List**: `MainDB_HR_Ext_BSD` (BACKUP STAFF entries — flexible row count)
**FormCode**: `BSD`

### Parent Columns (MainDB_HR)

Key columns: bsdDivision, bsdDepartment, bsdSection, bsdPIC, bsdEmpNo, bsdPosition, bsdResponsibility, bsdHOD, bsdSubmittedBy, bsdSubmitDate, bsdRemark, bsdHODName, bsdHODPost, bsdHODDate, bsdHODRemarks, bsdHODApp, bsdRevision, bsdUpdatedby, bsdUpdateddt, bsdStatus, bsdStaRem, bsdCurrentAction

### Child Columns (MainDB_HR_Ext_BSD)

| Column | Type | Notes |
|---|---|---|
| ParentID | Lookup → MainDB_HR:ID | |
| bsdBackupName | Person | |
| bsdBackupPosition | Single line | |
| bsdBackupResponsibility | Multiline | |
| RowNumber | Number | 1, 2, 3... |

## 13. Power Apps Build Recommendation

**Screens**: New/Edit (Sections A+B), Nomination (Section C), Approval (Section D), List, Detail
**Controls**: DynamicFormRenderer, EditableTable (for backup staff), ApprovalPanel (for HOD approval)
**Visibility**: Section D visible only to Head of Division after submission

## 14. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| 1 | What are the CurrentAction workflow state values? | High |
| 2 | What are the Status dropdown values? | Medium |
| 3 | What are Division/Department/Section choice values? | Medium |
| 4 | Is Revision Required a Yes/No or multi-option choice? | Low |
| 5 | Should backup staff be flexible count (child list) or fixed 3 slots? | Medium |

## 15. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes (with child list decision) |
| Approval Required | ✅ Required — Clearly Found |
| Promotion Quality | 98/100 |
