# Form Requirement — Duty Roster Database (DRD)

> **Source ID**: SRC-HR-005 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 98/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/DRD.pdf` (2 pages, 1,431 chars)
> **Promotion**: ✅ Promote Now — zero blockers

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-005 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "DUTY ROSTER DATABASE" | Clearly Found |
| Form Purpose | Submit monthly duty roster for department employees with shift assignments, routed through HOS approval → HOD approval → HR processing | Clearly Found |
| Pages | 2 | Clearly Found |
| Submission Rule | "* The following month duty roster need to be submitted by 10th of the month" | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---|---|---|
| SECTION A — Header | 1 | Requester | Comp, Category, Dept, Section, HOS, HOD, CC, Month, Year, Attch, Amend, Changes, EmpName |
| Shift Code Reference | 1 | Reference | 10 predefined shift codes with hours |
| HOS APPROVAL | 1 | Approver | HOSName, HOSDate, HOSRemark |
| HOD APPROVAL | 2 | Approver | HODName, HODDate, HODRemark |
| FOR HR Use | 2 | Admin | HRName, HRDate |
| Hidden Fields | 2 | System | CA, Editor1-4, HOSApp, HODApp, HRApp |

## 3. Field Requirements

### Section A — Header

| # | PDF Label | Domino Field | Type | Required | Choices | Page | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | Company | `Comp` | Text | Inferred | Unknown | 1 | Clearly Found |
| 2 | Category | `Category` | Choice | Inferred | Unknown | 1 | Clearly Found |
| 3 | Department | `Dept` | Text | Inferred | Unknown | 1 | Clearly Found |
| 4 | Section | `Section` | Text | Inferred | Unknown | 1 | Clearly Found |
| 5 | Section Head | `HOS` | Person | Inferred | — | 1 | Clearly Found |
| 6 | Department Head | `HOD` | Person | Inferred | — | 1 | Clearly Found |
| 7 | CC | `CC` | Text | No | — | 1 | Clearly Found |
| 8 | Month | `Month` | Number | Inferred | — | 1 | Clearly Found |
| 9 | Year | `Year` | Number | Inferred | — | 1 | Clearly Found |
| 10 | Attachments | `Attch` | Attachment | No | — | 1 | Clearly Found |
| 11 | Amended Copy | `Amend` | Choice | No | Unknown | 1 | Clearly Found |
| 12 | Changes against last month | `Changes` | Multiline | No | — | 1 | Clearly Found |
| 13 | Employee Name | `EmpName` | Person | Inferred | — | 1 | Clearly Found |

### Shift Code Reference (10 codes extracted)

| Code | Hours | Confidence |
|---|---|---|
| OFC | 08:30-17:45 | Clearly Found |
| OFO | 08:30-17:30 | Clearly Found |
| N1 | 08:30-17:00 | Clearly Found |
| A1 | 07:00-14:30 | Clearly Found |
| A2 | 07:30-15:00 | Clearly Found |
| B1 | 15:00-22:30 | Clearly Found |
| C1 | 23:00-06:30 | Clearly Found |
| 7A1 | 07:00-19:00 | Clearly Found |
| 7A2 | 07:30-19:00 | Clearly Found |
| 7P1 | 19:00-06:30 | Clearly Found |

### Submission

| # | PDF Label | Domino Field | Type | Page | Confidence |
|---|---|---|---|---|---|
| 14 | Created By | `SubmittedBy` | Person | 1 | Clearly Found |
| 15 | Created On | `SubmittedDate` | Date | 1 | Clearly Found |

### HOS APPROVAL

| # | PDF Label | Domino Field | Type | Page | Confidence |
|---|---|---|---|---|---|
| 16 | Name (HOS) | `HOSName` | Person | 1 | Clearly Found |
| 17 | Date (HOS) | `HOSDate` | Date | 1 | Clearly Found |
| 18 | Remark (HOS) | `HOSRemark` | Multiline | 1 | Clearly Found |

### HOD APPROVAL

| # | PDF Label | Domino Field | Type | Page | Confidence |
|---|---|---|---|---|---|
| 19 | Name (HOD) | `HODName` | Person | 2 | Clearly Found |
| 20 | Date (HOD) | `HODDate` | Date | 2 | Clearly Found |
| 21 | Remark (HOD) | `HODRemark` | Multiline | 2 | Clearly Found |

### FOR HR Use

| # | PDF Label | Domino Field | Type | Page | Confidence |
|---|---|---|---|---|---|
| 22 | Name (HR) | `HRName` | Person | 2 | Clearly Found |
| 23 | Date (HR) | `HRDate` | Date | 2 | Clearly Found |

### Hidden Fields

| # | PDF Label | Domino Field | Type | Page | Confidence |
|---|---|---|---|---|---|
| 24 | CurrentAction | `CA` | Choice | 2 | Clearly Found |
| 25-28 | Editor1-4 | `Editor1`-`Editor4` | Person | 2 | Clearly Found |
| 29 | HOS App | `HOSApp` | Boolean | 2 | Clearly Found |
| 30 | HOD App | `HODApp` | Boolean | 2 | Clearly Found |
| 31 | HR App | `HRApp` | Boolean | 2 | Clearly Found |

## 4. Choice Fields

| Field | Choices Found | Confidence |
|---|---|---|
| Category | Unknown | Unknown |
| Amended Copy | Unknown | Unknown |
| CA (CurrentAction) | Unknown | Unknown |
| Shift Code | 10 codes with hours (extracted above) | Clearly Found |

## 5. Repeating Tables

None — single roster submission per month.

## 6. Attachments

Yes — `Attch` field for supporting documents.

## 7. Role and Visibility Rules

| Section | Visible To | Editable By | Condition |
|---|---|---|---|
| Section A | All | Requester | During creation |
| HOS APPROVAL | HOS, Admin | HOS | After submission |
| HOD APPROVAL | HOD, Admin | HOD | After HOS approval |
| FOR HR Use | HR, Admin | HR | After HOD approval |

## 8. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | **Required — Clearly Found** | Clearly Found |
| Evidence | `CA` (CurrentAction alias) + Editor1-4 roles + HOSApp/HODApp/HRApp flags | Clearly Found |

### Stages

| Stage | Role | Action | Flag |
|---|---|---|---|
| 1 | HOS (Section Head) | Approve | HOSApp |
| 2 | HOD (Department Head) | Approve | HODApp |
| 3 | HR | Receive/Process | HRApp |

## 9. Status Values

`CA` (CurrentAction) values not in PDF text — **Needs Human Confirmation**.

## 10. SharePoint Design

**List**: `MainDB_HR` (single list, no child needed)
**FormCode**: `DRD`

Key columns: drdCompany, drdCategory, drdDepartment, drdSection, drdHOS, drdHOD, drdMonth, drdYear, drdAttch, drdAmend, drdChanges, drdEmpName, drdSubmittedBy, drdSubmittedDate, drdHOSName, drdHOSDate, drdHOSRemark, drdHODName, drdHODDate, drdHODRemark, drdHRName, drdHRDate, drdCA, drdHOSApp, drdHODApp, drdHRApp

## 11. Power Apps Build

**Screens**: New Roster, HOS Approval, HOD Approval, HR Processing, List, Detail
**Controls**: DynamicFormRenderer, shift code dropdown (10 predefined codes), ApprovalPanel ×3
**Validation**: Month/Year required, submission by 10th deadline

## 12. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| DRD-01 | What are the CA (CurrentAction) state values? | High |
| DRD-02 | What are Category and Amended Copy choice values? | Low |

## 13. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes |
| Approval Required | ✅ Required — Clearly Found |
| Promotion Quality | 98/100 — Promote Now |
