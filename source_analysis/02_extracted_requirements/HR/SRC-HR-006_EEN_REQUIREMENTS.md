# Form Requirement — Employee Exit Notification (EEN)

> **Source ID**: SRC-HR-006 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 93/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/EEN.pdf` (8 pages, 6,683 chars)
> **Promotion**: ⚠️ Promote with Human Confirmation — ED role, exit interview structure

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-006 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "EMPLOYEE EXIT NOTIFICATION" | Clearly Found |
| Form Purpose | Process employee resignation/exit — capture exit details, conduct exit interview, route through ED approval with APPROVE/REJECT, notify IT for deactivation, manage returned company items, allow withdrawal | Clearly Found |
| Pages | 8 (largest HR form) | Clearly Found |

## 2. Form Sections

| Section | Page | Type |
|---|---|---|
| HR Section — Employee Details | 1-2 | Requester |
| Deactivation Dates | 2 | Admin |
| APPROVE REJECT — ED | 2-3 | Approver |
| HEAD OF DEPARTMENT / DIVISION APPROVAL | 4 | Approver |
| EXIT INTERVIEW (5 questions) | 3-5 | Information |
| ACTUAL LAST WORKING DAY — Notify IT | 6 | Admin |
| HUMAN RESOURCES USE — Returned Items | 6 | Admin |
| Withdraw Section | 7 | Requester |
| Hidden/System Fields | 7-8 | System |

## 3. Field Requirements (Key — 70 total)

### Employee Details

| Field | Domino | Type | Confidence |
|---|---|---|---|
| Company | `Site` | Text | Clearly Found |
| Main Category | `Main` | Choice | Clearly Found |
| Category | `Category` | Choice | Clearly Found |
| Type | `Type` | Choice | Clearly Found |
| Renewal Status | `ContractStatus` | Choice | Clearly Found |
| Name & Email | `EmpName` / `EmpEmail` | Person+Email | Clearly Found |
| Employee No. | `EmpNum` | Text | Clearly Found |
| Position | `Position` | Text | Clearly Found |
| Section | `EmpDept` | Text | Clearly Found |
| Exit Interview (Hardcopy?) | `ExitInterview` | Choice | Clearly Found |
| Notification Received Date | `dtNoticeReceived` | Date | Clearly Found |
| Effective Resignation Date | `ResignedDate` | Date | Clearly Found |
| Last Working Date | `LastWorkingDay` | Date | Clearly Found |
| Last Service Date | `LastServiceDay` | Date | Clearly Found |
| Superior | `HOD` | Person | Clearly Found |
| Department/Division Head | `DivHead` | Person | Clearly Found |
| Remarks | `HRComment` | Multiline | Clearly Found |
| Date Submitted | `SubmitDate` | Date | Clearly Found |

### Deactivation

| Field | Domino | Type | Confidence |
|---|---|---|---|
| Original Deactivate Date | `dtOriDeactivate` | Date | Clearly Found |
| Deactivate Date | `dtDeactivate` | Date | Clearly Found |
| Justification (extension) | `Justification` | Multiline | Clearly Found |
| Granted by | `ExtName` | Person | Clearly Found |
| Granted on | `ExtDate` | Date | Clearly Found |

### ED APPROVE REJECT

| Field | Domino | Type | Choices | Confidence |
|---|---|---|---|---|
| Status | `Status` | Choice | APPROVE, REJECT | Clearly Found |
| Name (ED) | `EDName` | Person | — | Clearly Found |
| Date (ED) | `EDDate` | Date | — | Clearly Found |
| Remarks | `Remarks` | Multiline | — | Clearly Found |

### HOD/DIVISION APPROVAL

| Field | Domino | Type | Choices | Confidence |
|---|---|---|---|---|
| APPROVE REJECT | `HODRemarks` | Choice | APPROVE, REJECT | Clearly Found |
| Approved By | `HODName` | Person | — | Clearly Found |
| Approved Date | `HODDate` | Date | — | Clearly Found |

### Exit Interview (5 questions)

| Q | Question | Domino | Type |
|---|---|---|---|
| 1 | Reasons for leaving (+ otherReason) | `Reasons` / `otherReason` | Multiline |
| 2 | Progress feedback | `Progress` | Multiline |
| 3 | Pay feedback | `Pay` | Multiline |
| 4 | Found another job? | `NewJob` | Choice |
| 5 | New job comparison | (multiline) | Multiline |

### Actual Last Working Day

| Field | Domino | Type |
|---|---|---|
| Actual LWD | `ActualLWD` | Date |
| Sent by | `SentBy` | Person |
| Sent Date | `SentDate` | Date |

### HR Use — Returned Items

| Field | Domino | Type |
|---|---|---|
| Company Properties | `CompanyProperties` | Choice |
| Reason (not returned) | `Reason` | Multiline |
| Remarks | `Remarks2` | Multiline |
| Performed By | `PerformedBy2` | Person |
| Performed Date | `PerformedDate2` | Date |
| Attachment | `Attachment` | Attachment |

### Withdraw

| Field | Domino | Type |
|---|---|---|
| Status | `WDStatus` | Choice |
| Reason | `WDReason` | Multiline |
| Performed By | `WDBy` | Person |
| Performed Date | `WDDate` | Date |

### Hidden (Pages 7-8)

`CA` (CurrentAction), `Editor1`-`Editor6`, `ITEditor`, `HODEditor`, `HREditor`, `isEI`, `ACMIT`, `PCNIT`, `HR1`, `HR2`, `HRHOD`, `HRPIC`, `FIN`, `BCC`, `INO`, `RemDate`, `RemCC`, `Hide`, `HideInt`, `HideHand`, `TypeCheck`, `AllDone`, `AllDone2`

## 4. Choice Fields (Known)

| Field | Choices | Confidence |
|---|---|---|
| ED Status | APPROVE, REJECT | Clearly Found |
| HOD APPROVE REJECT | APPROVE, REJECT | Clearly Found |
| WDStatus | Unknown | Unknown |
| Main, Category, Type, ContractStatus, ExitInterview | Unknown | Unknown |

## 5. Workflow

| Attribute | Value |
|---|---|
| Approval Required | **Required — Clearly Found** |
| Evidence | CurrentAction + CA + APPROVE/REJECT (ED + HOD) + Editor1-6 roles |
| Stages | Submit → ED Approve/Reject → HOD Approve/Reject → IT Notify → HR Returned Items → Withdraw (optional) |

## 6. SharePoint Design

**Parent**: `MainDB_HR` (employee details, approvals, deactivation)
**Child**: `MainDB_HR_Ext_EEN_Interview` (exit interview responses — 5 questions)
**FormCode**: `EEN`

## 7. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| EEN-01 | ED = Executive Director? Confirm role | High |
| EEN-02 | CurrentAction/CA state values? | High |
| EEN-03 | Exit interview — child list or embedded JSON? | Medium |
| EEN-04 | Main/Category/Type/ContractStatus choice values? | Medium |
| EEN-05 | Is the ED approval stage before or after HOD? (both have APPROVE/REJECT) | High |

## 8. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes |
| Approval Required | ✅ Required (ED + HOD dual APPROVE/REJECT) |
| Promotion Quality | 93/100 |
