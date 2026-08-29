# HR Power Apps Build Specification

> **Date**: 2026-06-01 | **Status**: Preliminary (AWHR P1 pending, all P0 cleared)
> **Forms**: 6 HR forms | **Architecture**: `HR_SHAREPOINT_ARCHITECTURE_PRELIMINARY.md`
> **Schema**: `HR_SHAREPOINT_SCHEMA_EXPORT.md`

---

## Build Summary

| Form | Screens | Child Galleries | Workflow | Status |
|---|---|---|---|---|
| CIR | 3 (New, List, Detail) | None | None | ✅ Ready |
| BSD | 4 (New, List, Detail, HOD Approval) | 1 (Backup Staff) | 2-stage HOD | ✅ Ready |
| AWHR | 5 (New, List, Detail, HOS, HOD) | 1 (Working Hours) | 3-stage ⚠️ | ⚠️ HR stage pending |
| CWR | 6 (New, List, Detail, HOD, DivHead, AGM HR) | 1 (Periods) | 4-stage | ✅ Ready |
| DRD | 5 (New, List, Detail, HOS, HOD) | None | 3-stage | ✅ Ready |
| EEN | 5 (New, List, Detail, ED, HOD) | None | Multi-stage | ✅ Ready |

---

## Shared Architecture

### Data Sources

| Data Source | List Name | Type |
|---|---|---|
| HR Parent | `MainDB_HR` | SharePoint |
| BSD Child | `MainDB_HR_Ext_BSD` | SharePoint |
| AWHR Child | `MainDB_HR_Ext_AWHR` | SharePoint |
| CWR Child | `MainDB_HR_Ext_CWR_Periods` | SharePoint |
| Workflow History | `MainDB_HR_WorkflowHistory` | SharePoint |
| Shift Codes | `MainDB_HR_Config_ShiftCodes` | SharePoint |
| Companies | `MainDB_HR_Config_Companies` | SharePoint |
| M365 Users | Office 365 Users | Connector |

### Shared Components

| Component | Purpose | Used By |
|---|---|---|
| `DynamicFormRenderer` | Render form sections from JSON schema | All forms |
| `ApprovalPanel` | Approve/Reject with comments | BSD, AWHR, CWR, DRD, EEN |
| `EditableTable` | Inline editing for child rows | BSD, AWHR, CWR |
| `WorkflowTimeline` | Visual workflow stage tracker | All approval forms |
| `PeoplePicker` | Person selection with M365 lookup | All forms |

### Shared Behaviors

| Behavior | Pattern |
|---|---|
| Draft Save | `Patch(MainDB_HR, {FormCode, ...fields}, CurrentAction: "Draft/Request")` |
| Submit | `Patch(MainDB_HR, {FormCode, ...fields}, CurrentAction: "Submitted")` + email notification |
| Approve | `Patch(MainDB_HR, {CurrentAction: "XApproved", approverName, approverDate, approverComments})` |
| Reject | `Patch(MainDB_HR, {CurrentAction: "XRejected", approverName, approverDate, approverComments})` + notify submitter |
| Workflow Log | `Patch(MainDB_HR_WorkflowHistory, {ParentID, wfFormCode, wfStage, wfAction, wfPerformedBy, wfPerformedDate, wfComments})` |

---

## CIR — Cafeteria Inspection (100/100) ✅ No Workflow

### Screens

| Screen | Purpose | Role | Data Source |
|---|---|---|---|
| New Inspection | Create cafeteria inspection record | Inspector, HR | MainDB_HR |
| Inspection List | View all inspections, filter by site/date | All | MainDB_HR |
| Inspection Detail | View full inspection, corrective action review | All | MainDB_HR |

### New Inspection Screen

| Section | Fields | Control Type | Required | Validation | Choices |
|---|---|---|---|---|---|
| Initiator | cirSite | Dropdown | Yes | Not empty | ⚠️ Pending HR |
| Initiator | cirTeamMembers | People picker (multi) | Yes | At least 1 | M365 Users |
| Initiator | cirInspector | People picker | Yes | Not empty | M365 Users |
| Initiator | cirInsDate | Date picker | Yes | Not empty, ≤ today | — |
| Initiator | cirInsTime | Text input | Yes | Time format | — |
| Submit | cirSubmittedBy | Auto (@Me) | System | — | — |
| Submit | cirSubmittedDate | Auto (@Now) | System | — | — |

### Detail Screen

| Section | Fields | Control Type | Read-Only | Visible To |
|---|---|---|---|---|
| Initiator | All above | Label | Yes | All |
| Corrective Action | cirReviewedBy | People picker | Editable by reviewer | Reviewer, Admin |
| Corrective Action | cirReviewedDate | Date picker | Editable by reviewer | Reviewer, Admin |
| Corrective Action | cirRemarks | Multiline text | Editable by reviewer | Reviewer, Admin |

### Behaviors

| Behavior | Implementation |
|---|---|
| Submit | `Patch(MainDB_HR, {FormCode: "CIR", cirCurrentAction: "Submitted", ...fields})` |
| Status change | cirCurrentAction: "Submitted" → "Accepted" (no approval needed, simple status update) |
| List filter | `Filter(MainDB_HR, FormCode = "CIR")` |
| Success message | "Inspection submitted successfully" |

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| CIR-1 | Create new inspection with all required fields | Save succeeds, cirCurrentAction = "Submitted" |
| CIR-2 | Submit with empty Inspector | Validation error "Inspector is required" |
| CIR-3 | Reviewer adds corrective action review | cirReviewedBy/Date saved, cirRemarks updated |
| CIR-4 | List shows only CIR forms | Filter by FormCode works |

---

## BSD — Backup Staff Database (98/100)

### Screens

| Screen | Purpose | Role | Data Source |
|---|---|---|---|
| New BSD | Fill person-in-charge + 3 backup staff | HOD/HOS | MainDB_HR + Ext_BSD |
| BSD List | View all BSD records, filter by status | All | MainDB_HR |
| BSD Detail | View full BSD, HOD approval section | All, HOD | MainDB_HR + Ext_BSD |
| HOD Approval | Approve/Reject BSD submission | HOD | MainDB_HR |

### New BSD Screen

| Section | Fields | Control Type | Required | Notes |
|---|---|---|---|---|
| SECTION A | bsdDivision | Dropdown | Yes | ⚠️ Pending HR |
| SECTION A | bsdDept | Dropdown | Yes | ⚠️ Pending HR |
| SECTION A | bsdSection | Dropdown | Yes | ⚠️ Pending HR |
| SECTION A | bsdPIC | People picker | Yes | |
| SECTION A | bsdEmpNo | Text input | Yes | |
| SECTION A | bsdPosition | Text input | Yes | |
| SECTION A | bsdResponsibility | Multiline text | Yes | |
| SECTION A | bsdHOD | People picker | Yes | First approver |
| SECTION B | Backup Staff 1-3 | EditableTable / Gallery | Yes | **Child Gallery** — 3 rows |
| SECTION C | bsdRemark | Multiline text | No | |

**Child Gallery (Backup Staff)**:

| Row Field | Control Type | Source |
|---|---|---|
| bsdBackupName | People picker | M365 Users |
| bsdBackupPosition | Text input | — |
| bsdBackupResponsibility | Multiline text | — |

### HOD Approval Screen

| Section | Fields | Control Type | Editable By | Choices |
|---|---|---|---|---|
| SECTION D | bsdHODName | People picker (auto) | HOD | @Me |
| SECTION D | bsdHODDate | Date picker (auto) | HOD | @Now |
| SECTION D | bsdHODRemarks | Multiline text | HOD | — |
| Actions | Approve button | Button | HOD | Sets bsdCurrentAction = "Approved" |
| Actions | Reject button | Button | HOD | Sets bsdCurrentAction = "Rejected" |

### Behaviors

| Behavior | Implementation |
|---|---|
| Submit | `Patch(MainDB_HR, {FormCode: "BSD", bsdCurrentAction: "Submitted", ...})` + `ForAll(BackupStaff, Patch(Ext_BSD, ...))` |
| Draft | `bsdCurrentAction: "Request"` |
| HOD Approve | `Patch(MainDB_HR, {bsdCurrentAction: "Approved", bsdHODName, bsdHODDate, bsdHODRemarks})` + workflow log |
| HOD Reject | `Patch(MainDB_HR, {bsdCurrentAction: "Rejected", ...})` + notify submitter |
| ARCHIVE | After Approved, system sets `bsdCurrentAction: "ARCHIVE"` per DXL |
| Notification | Submit → MailSend to HOD; HOD Approve/Reject → MailSend to DocAuthor |
| Visibility | SECTION D (HOD approval) visible only when bsdCurrentAction = "Submitted" AND current user = bsdHOD |

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| BSD-1 | Create BSD with 3 backup staff | Parent saved, 3 child rows in Ext_BSD |
| BSD-2 | HOD approves | bsdCurrentAction → "Approved", notification to DocAuthor |
| BSD-3 | HOD rejects | bsdCurrentAction → "Rejected", DocAuthor notified |
| BSD-4 | Non-HOD user sees approval section | Hidden — role-based visibility |

---

## AWHR — Rest Day & Working Hours (85/100) ⚠️

### Screens

| Screen | Purpose | Role | Data Source |
|---|---|---|---|
| New AWHR | Fill requisition + 15 working hours rows | Requester | MainDB_HR + Ext_AWHR |
| AWHR List | View all AWHR, filter by status/month | All | MainDB_HR |
| AWHR Detail | View full AWHR with approval timeline | All | MainDB_HR + Ext_AWHR |
| HOS Approval | Approve/Reject | HOS | MainDB_HR |
| HOD Approval | Approve/Reject | HOD | MainDB_HR |
| HR Processing | Accept/Deny (⚠️ Pending HR) | HR | MainDB_HR |

### New AWHR Screen

| Section | Fields | Control Type | Required | Notes |
|---|---|---|---|---|
| Header | awhrIssueNo | Text input (auto) | Yes | Auto-number |
| Header | awhrCompany | Dropdown | Yes | Config_Companies |
| Header | awhrEmpCategory | Dropdown | ⚠️ Pending HR | Q: AWHR-07 |
| Header | awhrSection | Text input | Inferred | |
| Header | awhrDepartment | Text input | Inferred | |
| Header | awhrHOS | People picker | Yes | First approver |
| Header | awhrHOD | People picker | Yes | Second approver |
| Category Codes | awhrE1-E4 | Toggle (×4) | No | Checkboxes per PDF |
| Working Hours | 15-row table | **Child Gallery** | Yes | EditableTable |
| Submit | awhrSubmittedBy | Auto | System | @Me |

**Child Gallery (Working Hours)**:

| Row Field | Control Type | Required | Choices |
|---|---|---|---|
| awhrEmpNo | Text input | Yes | — |
| awhrFullName | People picker | Yes | M365 Users |
| awhrExceededCategory | Dropdown | Yes | E1;E2;E3;E4 |
| awhrDateFrom | Date picker | Yes | — |
| awhrDateTo | Date picker | Yes | — |
| awhrDayType | Dropdown | Inferred | ⚠️ Pending HR (Q: AWHR-07) |
| awhrShiftCode | Combo box | Inferred | Config_ShiftCodes |
| awhrAddHours | Number input | No | — |
| awhrTotalHours | Number input | Yes | Auto-calc, editable |

### Approval Behaviors

| Stage | Role | Action | CurrentAction | ⚠️ Pending |
|---|---|---|---|---|
| Submit | Requester | Submit for approval | "Submitted" | — |
| HOS | Head of Section | Approve / Reject | "HOSApproved" / "Submitted" (reset on reject) | — |
| HOD | Head of Dept | Approve / Reject | "HODApproved" / "Submitted" (reset on reject) | Skip-HOD? (Q: AWHR-01) |
| HR | HR | Accept / Deny | ⚠️ No CA state in DXL — uses HRApp flag | **PENDING** (Q: AWHR-02) |
| Withdraw | Requestor | Withdraw request | "Withdrawn" | — |

### ⚠️ Pending HR Confirmation

| Item | Impact | Question ID |
|---|---|---|
| Mandatory field list | Validation rules | AWHR-03 |
| Skip-HOD logic | Power Automate branching | AWHR-01 |
| HR Accept/Deny as final CA state | Workflow state machine | AWHR-02 |
| HR-only editable fields | Role-based visibility | AWHR-04 |
| Requester-only editable fields | Lock after submit | AWHR-05 |
| Withdrawal needs approver? | Workflow logic | AWHR-06 |
| EmpCategory & Day Type choices | Dropdown values | AWHR-07 |

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| AWHR-1 | Create AWHR with 5 working hours rows | Parent + 5 child rows saved |
| AWHR-2 | HOS approves | awhrCurrentAction → "HOSApproved", notify HOD |
| AWHR-3 | HOD rejects | awhrCurrentAction resets to "Submitted", notify DocAuthor |
| AWHR-4 | Withdraw after submit | awhrCurrentAction → "Withdrawn" |
| AWHR-5 | Total hours auto-calculated | TtlHrs = sum of row hours |

---

## CWR — Contract Worker Requisition (96/100)

### Screens

| Screen | Purpose | Role |
|---|---|---|
| New CWR | Fill dual-section worker request + period rows | Requester |
| CWR List | View all CWR, filter by type/status | All |
| CWR Detail | View full CWR with approval timeline | All |
| HOD Endorsement | Endorse (Stage 1) | HOD |
| Division Head Approval | Approve (Stage 2) | Division Head |
| AGM HR Acknowledgment | Acknowledge (Stage 3) | AGM HR |
| Requestor Acknowledgment | Acknowledge/Deny (Stage 4) | Requestor |

### New CWR Screen

| Section | Fields | Control Type | Notes |
|---|---|---|---|
| Initiation | cwrIssueNo, cwrSendTo, cwrDivHead, cwrName | Text/People | Header |
| Initiation | cwrType, cwrPermCategory | Dropdown | ⚠️ Pending HR (Q: CWR-04) |
| Permanent Workers | cwrSite, cwrNoWorkers, cwrWorkstation, cwrJD, cwrWorkingHour, cwrPeriod, cwrCurrentNoWorkers, cwrEffDate, cwrJustification | Mixed | Section A |
| Plant Shutdown | cwrSite2, cwrNoWorkers2, cwrWorkstation2, cwrJD2 | Mixed | Section B |
| Period Required | 6 rows (3 perm + 3 shutdown) | **Child Gallery** | Ext_CWR_Periods |

**Child Gallery (Periods)**:

| Row Field | Control Type | Required |
|---|---|---|
| cwrSection | Dropdown (Permanent / Plant Shutdown) | Yes |
| cwrPeriodFrom | Date picker | Yes |
| cwrPeriodTo | Date picker | Yes |
| cwrTotalDays | Number (auto-calc) | Yes |

### Approval Behaviors (4-Stage)

| Stage | Role | Action | CurrentAction | Flag |
|---|---|---|---|---|
| Submit | Requester | Submit | "Submitted" | — |
| 1 | HOD | Endorse / Reject | "HODApproved" / "HODRejected" | HODApp |
| 2 | Division Head | Approve / Reject | "HODivApproved" / "HODivRejected" | HODApp3 |
| 3 | AGM HR | Acknowledge / Reject | "HRHODApproved" / "HRHODRejected" | HRApp |
| 4 | Requestor | Acknowledge / Deny | "Acknowledged" / "Denied" | HODApp2 |

**Notifications (from DXL)**:
- Submit → HRHOD + HR
- HOD Approved → HRHOD + HR
- HOD Rejected → HRHOD + HR
- (Each stage notifies relevant parties)

**Visibility**: Each approval section visible only to the assigned approver when `cwrCurrentAction` indicates their stage.

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| CWR-1 | Create CWR with 3 perm + 3 shutdown period rows | 6 child rows in Ext_CWR_Periods |
| CWR-2 | Full 4-stage approval flow | All 4 stages complete, CurrentAction → "Acknowledged" |
| CWR-3 | HOD rejects at stage 1 | cwrCurrentAction → "HODRejected", notify HRHOD |
| CWR-4 | Requestor denies at stage 4 | cwrCurrentAction → "Denied" |

---

## DRD — Duty Roster Database (98/100) ✅

### Screens

| Screen | Purpose | Role |
|---|---|---|
| New DRD | Fill monthly duty roster | Requester |
| DRD List | View all rosters, filter by month/year | All |
| DRD Detail | View roster with approval timeline | All |
| HOS Approval | Approve (Stage 1) | HOS |
| HOD Approval | Approve (Stage 2) | HOD |
| HR Processing | Receive (Stage 3) | HR |

### New DRD Screen

| Section | Fields | Control Type | Required | Choices |
|---|---|---|---|---|
| Header | drdCompany | Dropdown | Yes | Config_Companies (YKS;YTC;NAGA) |
| Header | drdCategory | Dropdown | Yes | Both;Outsource Worker |
| Header | drdDepartment | Text input | Yes | — |
| Header | drdSection | Text input | Yes | — |
| Header | drdHOS | People picker | Yes | |
| Header | drdHOD | People picker | Yes | |
| Header | drdMonth | Number input (1-12) | Yes | — |
| Header | drdYear | Number input | Yes | — |
| Header | drdEmpName | People picker | Yes | |
| Options | drdAmend | Dropdown | No | ⚠️ Pending HR |
| Options | drdChanges | Multiline text | No | — |
| Attachments | drdAttch | Attachment control | No | — |

### Approval Behaviors

| Stage | Role | Action | CurrentAction | Notify |
|---|---|---|---|---|
| Submit | Requester | Submit | "Submitted" | HOS |
| HOS | Head of Section | Approve / Reject | "HOSApproved" / "Submitted" | HOD (if approved), DocAuthor (if rejected) |
| HOD | Head of Dept | Approve / Reject | "HODApproved" / "Submitted" | DocAuthor + CC + HR (if approved), DocAuthor (if rejected) |
| HR | HR | Receive | "Completed" | — |

**Validation**: Month/Year required. Submission deadline rule: "by 10th of the month" — display warning if past deadline.

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| DRD-1 | Create roster with all required fields | Save succeeds, drdCurrentAction = "Submitted" |
| DRD-2 | HOS approves → HOD approves → HR receives | Full 3-stage, drdCurrentAction → "Completed" |
| DRD-3 | HOD rejects | drdCurrentAction resets to "Submitted", notify DocAuthor |
| DRD-4 | Shift code dropdown shows 10 codes | OFC, OFO, N1, A1, A2, B1, C1, 7A1, 7A2, 7P1 |

---

## EEN — Employee Exit Notification (93/100)

### Screens

| Screen | Purpose | Role |
|---|---|---|
| New EEN | Fill exit notification + interview | HR/Requester |
| EEN List | View all exits, filter by status | All |
| EEN Detail | View full exit with timeline | All |
| ED Approval | APPROVE/REJECT (Stage 1) | ED |
| HOD Approval | APPROVE/REJECT (Stage 2) | HOD |
| HR Returned Items | Process returned company items | HR |
| Withdraw | Withdraw exit request | Requestor |

### New EEN Screen

| Section | Fields | Control Type | Required | Notes |
|---|---|---|---|---|
| Employee Details | eenSite, eenMain, eenCategory, eenType, eenContractStatus | Dropdowns | Yes | ⚠️ Choices pending (Q: EEN-05) |
| Employee Details | eenEmpName, eenEmpEmail, eenEmpNum, eenPosition, eenEmpDept | Mixed | Yes | |
| Employee Details | eenExitInterview | Dropdown | Yes | |
| Dates | eenDtNoticeReceived, eenResignedDate, eenLastWorkingDay, eenLastServiceDay | Date pickers | Yes | |
| Dates | eenDtOriDeactivate, eenDtDeactivate | Date pickers | Yes | Deactivation management |
| Superior | eenHOD, eenDivHead | People pickers | Yes | |
| Exit Interview | eenReasons, eenOtherReason | Multiline + Text | No | Embedded (DXL confirmed) |
| Exit Interview | eenProgress, eenPay | Multiline | No | |
| Exit Interview | eenNewJob | Dropdown | No | ⚠️ Pending HR |

### ED Approval Screen

| Section | Fields | Control Type | Editable By |
|---|---|---|---|
| APPROVE REJECT | eenEDStatus | Dropdown (APPROVE;REJECT) | ED |
| ED Details | eenEDName | Auto (@Me) | ED |
| ED Details | eenEDDate | Auto (@Now) | ED |
| ED Details | eenRemarks | Multiline text | ED |

### Extension Behavior

| Trigger | Action |
|---|---|
| "Extend Date" button clicked | Show eenDtDeactivate, eenJustification, eenExtName, eenExtDate fields |
| Extension submitted | eenCurrentAction → "Extended", notify IT |
| No extension | Proceed to ED approval |

### Approval Behaviors

| Stage | Role | Action | CurrentAction | Notify |
|---|---|---|---|---|
| Submit | HR/Requester | Submit | "Submitted" | ED |
| ED | Executive Director | APPROVE / REJECT | "EDApproved" / "EDRejected" | EmpEmail (if approved) |
| Extension | HR | Extend deactivation | "Extended" | — |
| HR Notification | System | Auto after ED Approved | "NotifiedHR" | AllIT (auto) |
| HOD | Head of Dept | APPROVE / REJECT | — (uses HODStatus column) | — |
| Withdraw | Requestor | Withdraw | "Withdrawn" | — |

**DXL Confirmed**: ED acts first (EDApproved/EDRejected CA states). IT notified automatically after NotifiedHR state.

### UAT Scenarios

| # | Scenario | Expected |
|---|---|---|
| EEN-1 | Create exit notification with interview | Parent saved, interview embedded |
| EEN-2 | ED approves | eenCurrentAction → "EDApproved", notify EmpEmail |
| EEN-3 | ED rejects | eenCurrentAction → "EDRejected" |
| EEN-4 | Extend deactivation date | eenCurrentAction → "Extended", eenDtDeactivate updated |
| EEN-5 | IT notified after ED approval | eenCurrentAction → "NotifiedHR", AllIT notified |
| EEN-6 | Withdraw exit request | eenCurrentAction → "Withdrawn" |

---

## UAT Scenario Summary

| Form | UAT Scenarios | Priority |
|---|---|---|
| CIR | 4 | P2 (no workflow) |
| BSD | 4 | P1 |
| AWHR | 5 | P1 (HR stage pending) |
| CWR | 4 | P1 |
| DRD | 4 | P1 |
| EEN | 6 | P1 |
| **Total** | **27** | |

## Pending HR Confirmation Items (Blocking Build)

| Form | Item | Impact |
|---|---|---|
| AWHR | HR Accept/Deny as final CA state | Blocks HR approval screen |
| AWHR | Mandatory field list | Blocks New screen validation |
| AWHR | Skip-HOD logic | Blocks Power Automate branching |
| AWHR | EmpCategory, DayType choices | Blocks dropdowns |
| CIR/BSD/CWR/EEN | Various choice values (~15 fields) | Blocks dropdown population |

## Forms Ready for App Build

| Form | App Build Ready? |
|---|---|
| **DRD** | ✅ Yes — 98/100, zero open, simple 3-stage |
| **CIR** | ✅ Yes — 100/100, no workflow, smallest form |
| **BSD** | ✅ Yes — 98/100, all P0/P1 cleared |
| **CWR** | ✅ Yes — 96/100, all P0/P1 cleared |
| **EEN** | ✅ Yes — 93/100, all P0/P1 cleared |
| **AWHR** | ⚠️ Can start — mark HR stage as placeholder |

**Recommended build order**: CIR (simplest) → DRD → BSD → CWR → EEN → AWHR (last, pending HR)
