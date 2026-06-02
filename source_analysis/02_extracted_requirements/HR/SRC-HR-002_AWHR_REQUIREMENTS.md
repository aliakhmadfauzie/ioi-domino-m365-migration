# Form Requirement — Rest Day & Additional Working Hours Requisition (AWHR)

> **Source ID**: SRC-HR-002 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 85/100
> **Evidence**: PyMuPDF direct text extraction from `PRAI_SITE_FORM/HR/AWHR.pdf` (4 pages, 4,373 chars)
> **Promotion**: ⚠️ Promote with Human Confirmation — 3-stage approval confirmed, large form with 15-row repeating table

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-002 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "Rest Day & Additional Working Hours Requisition" | Clearly Found |
| Form Purpose | Submit working hours requisition for employees exceeding category codes (12hrs/day, Rest Day, 60hrs/week, 104hrs/month) — routed through HOS approval → HOD approval → HR processing | Clearly Found |
| Pages | 4 | Clearly Found |

## 2. Source Evidence Summary

| Evidence | Source |
|---|---|
| Raw text extraction | `11_pdf_extraction_layer/raw_text/AWHR_page1-4.txt` |
| Page inventory | `11_pdf_extraction_layer/page_inventory/SRC-HR-002_AWHR_page_inventory.md` |
| Visual notes | `11_pdf_extraction_layer/visual_notes/SRC-HR-002_AWHR_visual_notes.md` |
| Workflow candidates | `11_pdf_extraction_layer/workflow_candidates/SRC-HR-002_AWHR_workflow_candidates.md` |

## 3. Form Sections

| Section | Page | Type | Key Fields |
|---|---|---|---|
| Requestor Section | 1 | Requester | Company, EmpCategory, Section, Department, HOS, HOD, CC, Attachment |
| Exceeded Category Code | 1 | Requester | E1-E4 checkboxes |
| Rostered Shift Table | 1 | Reference | Shift ID, Shift Details (predefined options) |
| Working Hours Table | 1-2 | Line Items (Child List Candidate) | 15 rows: EmpNo_N, Name_N, Category, Date From/To, Day Type, Shift, Add Hours, Total Hours |
| Head of Section Approval | 2 | Approver | Approve/Reject, HOSName, HOSDate, HOSRem, HOSAtt, HOSApp |
| Head of Department Approval | 2-3 | Approver | Approve/Reject, HODName, HODDate, HODRem, HODAtt, HODApp |
| HR Use (Processing) | 3 | Admin/Approver | Accept/Deny, HRCom, HRName, HRDate, HRAtt, HRApp |
| Withdrawn by Requestor | 3 | Requester | WDBy, WDDate, WDReason |
| History Log | 3 | System | HistoryLog |
| Hidden Fields | 3-4 | System | CA (CurrentAction), Editor1-5, IT, COO, HR_1-3, reference lists |

## 4. Field Requirements

### REQUESTOR SECTION (Page 1)

| # | PDF Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| 1 | Issue No | `IssueNo` | Text | Inferred | — | Clearly Found |
| 2 | Company | `Company` | Text | Inferred | Unknown | Clearly Found |
| 3 | Category | `EmpCategory` | Choice | Inferred | Unknown | Clearly Found |
| 4 | Section | `Section` | Text | Inferred | Unknown | Clearly Found |
| 5 | Department | `Department` | Text | Inferred | Unknown | Clearly Found |
| 6 | Section Head | `HOS` | Person | Inferred | — | Clearly Found |
| 7 | Department Head | `HOD` | Person | Inferred | — | Clearly Found |
| 8 | CC | `CC` | Text | No | — | Clearly Found |
| 9 | Remarks/Attachment | `Attachment` | Attachment | No | — | Clearly Found |

### EXCEEDED CATEGORY CODE (Page 1)

| # | PDF Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| 10 | E1 — Exceeding 12 hours/day | (checkbox) | Boolean | — | Clearly Found |
| 11 | E2 — Working on Rest Day | (checkbox) | Boolean | — | Clearly Found |
| 12 | E3 — Exceeding 60 hours/week | (checkbox) | Boolean | — | Clearly Found |
| 13 | E4 — Exceeding 104 hours/month | (checkbox) | Boolean | — | Clearly Found |

**Note**: These appear as checkboxes/multi-select. The label "EXCEEDED CATEGORY CODE" suggests at least one must be selected.

### WORKING HOURS TABLE (Pages 1-2) ⚠️ CHILD LIST CANDIDATE

15 repeating rows with numbered fields. Columns:
- Emp No.: `EmpNo_N`
- Full Name: `Name_N`
- Exceeded Category: `C_N`
- Date From: `DateW_N_1`
- Date To: `DateW_N`
- Day Type: `D_N`
- Rostered Shift: `SC_N`
- Add Hours: `AddHrs_N`
- Total Hours: `TtlHrs_N`

(N = 1..15)

**Design Note**: This is a primary **Child List Candidate** — 15 repeating rows with identical column structure. Strongly recommend `MainDB_HR_Ext_AWHR` child list.

### SUBMISSION (Page 2)

| # | PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| 14 | Submitted by | `Submittedby` | Person | Clearly Found |
| 15 | Submitted on | `Submittedon` | Date | Clearly Found |

### HEAD OF SECTION APPROVAL (Page 2)

| # | PDF Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| 16 | HOS Approve/Reject | (choice) | Choice | Inferred | **Approve, Reject** | Clearly Found |
| 17 | Name (HOS) | `HOSName` | Person | Inferred | — | Clearly Found |
| 18 | Date (HOS) | `HOSDate` | Date | Inferred | — | Clearly Found |
| 19 | Remark (HOS) | `HOSRem` | Multiline | No | — | Clearly Found |
| 20 | Attachment (HOS) | `HOSAtt` | Attachment | No | — | Clearly Found |
| 21 | HOS Approval Flag | `HOSApp` | Boolean | System | — | Clearly Found |

### HEAD OF DEPARTMENT APPROVAL (Pages 2-3)

| # | PDF Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| 22 | HOD Approve/Reject | (choice) | Choice | **Approve, Reject** | Clearly Found |
| 23 | Name (HOD) | `HODName` | Person | — | Clearly Found |
| 24 | Date (HOD) | `HODDate` | Date | — | Clearly Found |
| 25 | Remark (HOD) | `HODRem` | Multiline | — | Clearly Found |
| 26 | Attachment (HOD) | `HODAtt` | Attachment | — | Clearly Found |
| 27 | HOD Approval Flag | `HODApp` | Boolean | — | Clearly Found |

### HR USE — PROCESSING (Page 3)

| # | PDF Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| 28 | HR Accept/Deny | (choice) | Choice | **Accept, Deny** | Clearly Found |
| 29 | Comment (HR) | `HRCom` | Multiline | — | Clearly Found |
| 30 | Name (HR) | `HRName` | Person | — | Clearly Found |
| 31 | Date (HR) | `HRDate` | Date | — | Clearly Found |
| 32 | Attachment (HR) | `HRAtt` | Attachment | — | Clearly Found |
| 33 | HR Approval Flag | `HRApp` | Boolean | — | Clearly Found |

### WITHDRAWN BY REQUESTOR (Page 3)

| # | PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| 34 | Discarded by | `WDBy` | Person | Clearly Found |
| 35 | Discarded on | `WDDate` | Date | Clearly Found |
| 36 | Reason (Withdrawal) | `WDReason` | Multiline | Clearly Found |

### HIDDEN FIELDS (Pages 3-4)

| # | PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| 37 | Current Action | `CA` | Choice | Clearly Found |
| 38 | Editor 1-5 | `Editor1`-`Editor5` | Person | Clearly Found |
| 39 | IT | `IT` | Text | Clearly Found |
| 40 | COO | `COO` | Person | Clearly Found |
| 41 | HR Exec/Non-Exec/Outsource | `HR_1`, `HR_2`, `HR_3` | Person | Clearly Found |
| 42 | INO | `INO` | Text | Clearly Found |

### REFERENCE LISTS (Page 4 — system data)

| # | Field | Domino Field | Purpose |
|---|---|---|---|
| 43 | OT Reason List | `OTReason` | Dropdown source |
| 44 | Shift Time List | `ShiftList` | Dropdown source |
| 45 | Employee No. List | `EmpNoList` | Dropdown source |
| 46 | Employee Names List | `NamesList` | Dropdown source |
| 47 | Category Selection List | `Category` | Dropdown source |

## 5. Choice Fields

| Field | Choices Found | Confidence |
|---|---|---|
| HOS Approve/Reject | **Approve, Reject** — exact text | Clearly Found |
| HOD Approve/Reject | **Approve, Reject** — exact text | Clearly Found |
| HR Accept/Deny | **Accept, Deny** — exact text | Clearly Found |
| Exceeded Category Code (E1-E4) | Checkboxes — individual Boolean fields | Clearly Found |
| EmpCategory | Unknown | Unknown |
| Company | Unknown | Unknown |
| Section | Unknown | Unknown |
| Department | Unknown | Unknown |

## 6. Validation Rules

| Rule | Evidence | Confidence |
|---|---|---|
| At least one Exceeded Category Code must be selected | "EXCEEDED CATEGORY CODE" heading | Inferred |
| Submission deadline: within 5 working days after attendance cut-off @22nd | "Submission will be within 5 working days after the attendance cut off @22nd of the current month" | Clearly Found |
| "* Mandatory" label visible on page 1 | PDF text: "* Mandatory" | Clearly Found |

## 7. Repeating Tables

**Working Hours Table**: ⚠️ **Child List Candidate** — 15 rows with identical column structure (EmpNo_N, Name_N, C_N, DateW_N, D_N, SC_N, AddHrs_N, TtlHrs_N). Strongly recommend `MainDB_HR_Ext_AWHR` child list.

## 8. Attachments

**Yes** — 3 attachment fields:
- `Attachment` (requester — Remarks/Attachment)
- `HOSAtt` (Head of Section)
- `HODAtt` (Head of Department)
- `HRAtt` (HR Use)

## 9. Role and Visibility Rules

| Section | Visible To | Editable By | Condition | Evidence |
|---|---|---|---|---|
| Requestor + Working Hours | All | Requestor | During creation | "Requestor Section" |
| Head of Section Approval | HOS, Admin | HOS | After submission | "Head of Section Approve Reject" |
| Head of Department Approval | HOD, Admin | HOD | After HOS approval | "Head of Department Approve Reject" |
| HR Use | HR, Admin | HR | After HOD approval | "For HR Use: Accept Deny" |
| Withdrawn | Requestor | Requestor | Any time before HR processing | "Withdrawn by Requestor" |

## 10. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | **Required** | Clearly Found |
| Evidence | `CA` (CurrentAction) field + 3-stage Approve/Reject + HOSApp/HODApp/HRApp flags + Editor1-5 roles | Clearly Found |

### Workflow Stages

| Stage | Section | Role | Action | Approve/Reject Text |
|---|---|---|---|---|
| 1 | Head of Section | HOS | Review and approve/reject | **Approve / Reject** |
| 2 | Head of Department | HOD | Review and approve/reject | **Approve / Reject** |
| 3 | HR Use | HR | Process — accept or deny | **Accept / Deny** |
| (Optional) | Withdrawn | Requestor | Withdraw request | — |

**CurrentAction field**: `CA` (not `CurrentAction` — Domino alias). Editor1-5 roles suggest notification routing.

## 11. Status Values

| Field | Values | Confidence |
|---|---|---|
| CA (CurrentAction) | Unknown — not in text extraction | Unknown |

## 12. SharePoint Design Recommendation

**Parent List**: `MainDB_HR` (header + approval fields)
**Child List**: `MainDB_HR_Ext_AWHR` (working hours rows — 15 max per submission)
**FormCode**: `AWHR`

### Parent Columns (MainDB_HR)

Header: awhrIssueNo, awhrCompany, awhrEmpCategory, awhrSection, awhrDepartment, awhrHOS, awhrHOD, awhrCC, awhrAttachment
Category codes: awhrE1, awhrE2, awhrE3, awhrE4 (Boolean)
Approval: awhrHOSName, awhrHOSDate, awhrHOSRem, awhrHOSAtt, awhrHOSApp, awhrHODName, awhrHODDate, awhrHODRem, awhrHODAtt, awhrHODApp
HR: awhrHRName, awhrHRDate, awhrHRCom, awhrHRAtt, awhrHRApp
Withdrawal: awhrWDBy, awhrWDDate, awhrWDReason
Status: awhrCurrentAction

### Child Columns (MainDB_HR_Ext_AWHR)

| Column | Type | Notes |
|---|---|---|
| ParentID | Lookup → MainDB_HR:ID | |
| awhrEmpNo | Single line | |
| awhrFullName | Person | |
| awhrExceededCategory | Choice | E1-E4 |
| awhrDateFrom | Date | |
| awhrDateTo | Date | |
| awhrDayType | Choice | |
| awhrShiftCode | Choice | From ShiftList |
| awhrAddHours | Number | |
| awhrTotalHours | Number | |
| RowNumber | Number | 1-15 |

## 13. Power Apps Build Recommendation

**Screens**: New (Requestor + Working Hours table), HOS Approval, HOD Approval, HR Processing, Withdrawal, List, Detail
**Controls**: DynamicFormRenderer, EditableTable (for 15-row working hours), ApprovalPanel (3 stages), WithdrawalPanel
**Visibility**: Stage-gated — HOS visible after submit, HOD visible after HOS, HR visible after HOD

## 14. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| 1 | What are the `CA` (CurrentAction) workflow state values? | High |
| 2 | Is the 3-stage approval (HOS→HOD→HR) always sequential or can HOD be skipped? | High |
| 3 | What are EmpCategory choices? | Medium |
| 4 | What are Day Type (D_N) choices? | Medium |
| 5 | Should working hours be flexible count (child list) or fixed 15 rows? | Medium |
| 6 | What are the exact shift codes and their hours (from Shift List on page 4)? | Low |
| 7 | Does withdrawal require any approver action? | Medium |

## 15. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes (with child list and 3-stage workflow) |
| Approval Required | ✅ Required — Clearly Found (3-stage: HOS→HOD→HR) |
| Promotion Quality | 85/100 — quality review confirmed CurrentAction as `CA` alias |
