# HR SharePoint Build Package

> **Date**: 2026-06-01 | **Status**: Ready for Provisioning
> **Validated**: `HR_SCHEMA_VALIDATION_REPORT.md` — 0 schema errors
> **Target Site**: `{tenant}/sites/HR` (confirm with IT)

---

## 1. Build Scope

| Included | Count |
|---|---|
| Forms | 6 (CIR, BSD, DRD, CWR, EEN, AWHR) |
| Lists | 7 |
| Total Columns | ~250 |

## 2. Build Order

| Order | List | Type | Reason |
|---|---|---|---|
| **1** | `MainDB_HR_Config_ShiftCodes` | Configuration | No dependencies — seed first |
| **2** | `MainDB_HR_Config_Companies` | Configuration | No dependencies |
| **3** | `MainDB_HR` | Parent | Core list — all forms depend on it |
| **4** | `MainDB_HR_Ext_BSD` | Child | Depends on MainDB_HR |
| **5** | `MainDB_HR_Ext_AWHR` | Child | Depends on MainDB_HR + Config_ShiftCodes |
| **6** | `MainDB_HR_Ext_CWR_Periods` | Child | Depends on MainDB_HR |
| **7** | `MainDB_HR_WorkflowHistory` | Workflow History | Depends on MainDB_HR |

## 3. SharePoint Site Target

| Property | Value |
|---|---|
| Site URL | `{tenant}/sites/HR` |
| Site Name | HR Department |
| Owner Group | HR Admins |
| Member Group | HR Staff |
| Visitor Group | All Employees (read-only) |

## 4. Lists to Create

| # | List Name | Type | Forms | Columns |
|---|---|---|---|---|
| 1 | MainDB_HR_Config_ShiftCodes | Configuration | DRD (reference) | 3 |
| 2 | MainDB_HR_Config_Companies | Configuration | AWHR, DRD (reference) | 2 |
| 3 | MainDB_HR | Parent | CIR, BSD, AWHR, CWR, DRD, EEN | ~200 |
| 4 | MainDB_HR_Ext_BSD | Child | BSD | 6 |
| 5 | MainDB_HR_Ext_AWHR | Child | AWHR | 12 |
| 6 | MainDB_HR_Ext_CWR_Periods | Child | CWR | 7 |
| 7 | MainDB_HR_WorkflowHistory | Workflow History | BSD, AWHR, CWR, DRD, EEN | 10 |

---

## 5. List Detail: MainDB_HR_Config_ShiftCodes

**Purpose**: Shift code reference for DRD duty roster
**Type**: Configuration | **Dependencies**: None

### Columns

| # | Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | Shift code (OFC, OFO, N1...) |
| 2 | Hours | scHours | Single line of text | Yes | e.g. "08:30-17:45" |
| 3 | Description | scDescription | Single line of text | No | e.g. "Office" |

### Seed Data

| Title | Hours |
|---|---|
| OFC | 08:30-17:45 |
| OFO | 08:30-17:30 |
| N1 | 08:30-17:00 |
| A1 | 07:00-14:30 |
| A2 | 07:30-15:00 |
| B1 | 15:00-22:30 |
| C1 | 23:00-06:30 |
| 7A1 | 07:00-19:00 |
| 7A2 | 07:30-19:00 |
| 7P1 | 19:00-06:30 |

### Indexed Columns
- Title (unique)

---

## 6. List Detail: MainDB_HR_Config_Companies

**Purpose**: Company reference for HR forms
**Type**: Configuration | **Dependencies**: None

### Columns

| # | Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | Company code (YKS, YTC, NAGA) |
| 2 | Full Name | ccFullName | Single line of text | No | Full company name |

### Seed Data

| Title | Full Name |
|---|---|
| YKS | ⚠️ Pending HR |
| YTC | ⚠️ Pending HR |
| NAGA | ⚠️ Pending HR |

### Indexed Columns
- Title (unique)

---

## 7. List Detail: MainDB_HR (Parent)

**Purpose**: Single parent list for all 6 HR forms with FormCode discriminator
**Type**: Parent | **Dependencies**: Config_ShiftCodes, Config_Companies
**Relationship Keys**: Referenced by Ext_BSD, Ext_AWHR, Ext_CWR_Periods, WorkflowHistory via ParentID

### System Columns

| Internal Name | Type | Notes |
|---|---|---|
| Title | Single line of text | Required — auto-generated or form title |
| FormCode | Choice | Required — CIR;BSD;AWHR;CWR;DRD;EEN |
| ID | Integer | Auto |
| Created | DateTime | Auto |
| Modified | DateTime | Auto |
| Author | User | Auto |
| Editor | User | Auto |

### Indexed Columns

| Column | Reason |
|---|---|
| FormCode | Primary filter for all views |
| ID | Standard — lookup target |

### CIR Columns (14)

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1 | Site | cirSite | Choice | Yes | ⚠️ Pending HR | Pending |
| 2 | Team Members | cirTeamMembers | Person (multi) | Yes | — | ✅ |
| 3 | Inspector | cirInspector | Person | Yes | — | ✅ |
| 4 | Inspection Date | cirInsDate | DateTime | Yes | — | ✅ |
| 5 | Inspection Time | cirInsTime | Single line | Yes | — | ✅ |
| 6 | Submitted By | cirSubmittedBy | Person | System | — | ✅ |
| 7 | Submitted Date | cirSubmittedDate | DateTime | System | — | ✅ |
| 8 | Reviewed By | cirReviewedBy | Person | No | — | ✅ |
| 9 | Reviewed Date | cirReviewedDate | DateTime | No | — | ✅ |
| 10 | Remarks | cirRemarks | Multiline | No | — | ✅ |
| 11 | Current Status | cirCurrentAction | Choice | System | Submitted;Accepted | ✅ |
| 12 | Committee ACM | cirACMComm | Single line | No | — | ✅ |
| 13 | Committee ECM | cirECMComm | Single line | No | — | ✅ |
| 14 | Running Number | cirINO | Single line | No | — | ✅ |

### BSD Columns (19)

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1 | Division | bsdDivision | Choice | Yes | ⚠️ DB lookup | Pending |
| 2 | Department | bsdDept | Choice | Yes | ⚠️ DB lookup | Pending |
| 3 | Section | bsdSection | Choice | Yes | ⚠️ DB lookup | Pending |
| 4 | Person In Charge | bsdPIC | Person | Yes | — | ✅ |
| 5 | Employee No | bsdEmpNo | Single line | Yes | — | ✅ |
| 6 | Position | bsdPosition | Single line | Yes | — | ✅ |
| 7 | Area of Responsibility | bsdResponsibility | Multiline | Yes | — | ✅ |
| 8 | Department Head | bsdHOD | Person | Yes | — | ✅ |
| 9 | Submitted By | bsdSubmittedBy | Person | System | — | ✅ |
| 10 | Submit Date | bsdSubmitDate | DateTime | System | — | ✅ |
| 11 | Remark | bsdRemark | Multiline | No | — | ✅ |
| 12 | HOD Name | bsdHODName | Person | Yes | — | ✅ |
| 13 | HOD Date | bsdHODDate | DateTime | Yes | — | ✅ |
| 14 | HOD Remarks | bsdHODRemarks | Multiline | No | — | ✅ |
| 15 | Revision Required | bsdRevision | Choice | No | ⚠️ Pending HR | Pending |
| 16 | Updated By | bsdUpdatedBy | Person | No | — | ✅ |
| 17 | Updated Date | bsdUpdatedDate | DateTime | No | — | ✅ |
| 18 | Status | bsdStatus | Choice | No | ⚠️ Pending HR | Pending |
| 19 | Current Status | bsdCurrentAction | Choice | System | Request;Submitted;Approved;Rejected;ARCHIVE | ✅ |

### AWHR Columns (33) ⚠️ Preliminary

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1 | Issue No | awhrIssueNo | Single line | Yes | — | ✅ |
| 2 | Company | awhrCompany | Lookup | Yes | Config_Companies | ✅ |
| 3 | Employee Category | awhrEmpCategory | Choice | ⚠️ Pending | ⚠️ Pending HR | Pending |
| 4 | Section | awhrSection | Single line | Yes | — | ✅ |
| 5 | Department | awhrDepartment | Single line | Yes | — | ✅ |
| 6 | Section Head | awhrHOS | Person | Yes | — | ✅ |
| 7 | Department Head | awhrHOD | Person | Yes | — | ✅ |
| 8 | CC | awhrCC | Single line | No | — | ✅ |
| 9 | Remarks Attachment | awhrAttachment | Attachment | No | — | ✅ |
| 10 | E1 - 12hrs/day | awhrE1 | Yes/No | No | — | ✅ |
| 11 | E2 - Rest Day | awhrE2 | Yes/No | No | — | ✅ |
| 12 | E3 - 60hrs/week | awhrE3 | Yes/No | No | — | ✅ |
| 13 | E4 - 104hrs/month | awhrE4 | Yes/No | No | — | ✅ |
| 14 | Submitted By | awhrSubmittedBy | Person | System | — | ✅ |
| 15 | Submitted On | awhrSubmittedOn | DateTime | System | — | ✅ |
| 16 | HOS Name | awhrHOSName | Person | Yes | — | ✅ |
| 17 | HOS Date | awhrHOSDate | DateTime | Yes | — | ✅ |
| 18 | HOS Remark | awhrHOSRem | Multiline | No | — | ✅ |
| 19 | HOS Attachment | awhrHOSAtt | Attachment | No | — | ✅ |
| 20 | HOS Approved | awhrHOSApp | Yes/No | System | — | ✅ |
| 21 | HOD Name | awhrHODName | Person | Yes | — | ✅ |
| 22 | HOD Date | awhrHODDate | DateTime | Yes | — | ✅ |
| 23 | HOD Remark | awhrHODRem | Multiline | No | — | ✅ |
| 24 | HOD Attachment | awhrHODAtt | Attachment | No | — | ✅ |
| 25 | HOD Approved | awhrHODApp | Yes/No | System | — | ✅ |
| 26 | HR Name | awhrHRName | Person | ⚠️ Pending | — | Pending |
| 27 | HR Date | awhrHRDate | DateTime | ⚠️ Pending | — | Pending |
| 28 | HR Comment | awhrHRCom | Multiline | No | — | ✅ |
| 29 | HR Attachment | awhrHRAtt | Attachment | No | — | ✅ |
| 30 | HR Approved | awhrHRApp | Yes/No | System | — | ✅ |
| 31 | Withdrawn By | awhrWDBy | Person | No | — | ✅ |
| 32 | Withdrawn Date | awhrWDDate | DateTime | No | — | ✅ |
| 33 | Withdrawn Reason | awhrWDReason | Multiline | No | — | ✅ |
| 34 | History Log | awhrHistoryLog | Multiline | No | — | ✅ |
| 35 | Current Status | awhrCurrentAction | Choice | System | Request;Submitted;HOSApproved;HODApproved;Withdrawn | ✅ |

### CWR Columns (47)

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1 | Issue No | cwrIssueNo | Single line | Yes | — | ✅ |
| 2 | Send To (HOD) | cwrSendTo | Person | Yes | — | ✅ |
| 3 | Division Head | cwrDivHead | Person | Yes | — | ✅ |
| 4 | From Name | cwrName | Person | Yes | — | ✅ |
| 5 | Worker Type | cwrType | Choice | Yes | ⚠️ Pending HR | Pending |
| 6 | Category | cwrPermCategory | Choice | Yes | ⚠️ Pending HR | Pending |
| 7-20 | (Perm + Shutdown worker fields) | cwrSite, cwrNoWorkers, etc. | Mixed | Yes | — | ✅ |
| 21 | Requested By | cwrDocAuthor | Person | System | — | ✅ |
| 22 | Designation | cwrDesignation | Single line | Yes | — | ✅ |
| 23 | Date Issued | cwrDateIssued | DateTime | System | — | ✅ |
| 24-39 | (4-stage approval fields) | cwrHODApp, etc. | Mixed | System | DXL confirmed | ✅ |
| 40-47 | (HR/MTN Fill + system) | cwrVendor, cwrPax, etc. | Mixed | No | — | ✅ |
| 48 | Current Status | cwrCurrentAction | Choice | System | 9 DXL-confirmed states | ✅ |

### DRD Columns (27)

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1 | Company | drdCompany | Lookup | Yes | Config_Companies | ✅ |
| 2 | Category | drdCategory | Choice | Yes | Both;Outsource Worker | ✅ |
| 3 | Department | drdDepartment | Single line | Yes | — | ✅ |
| 4 | Section | drdSection | Single line | Yes | — | ✅ |
| 5 | Section Head | drdHOS | Person | Yes | — | ✅ |
| 6 | Department Head | drdHOD | Person | Yes | — | ✅ |
| 7 | CC | drdCC | Single line | No | — | ✅ |
| 8 | Month | drdMonth | Number | Yes | 1-12 | ✅ |
| 9 | Year | drdYear | Number | Yes | — | ✅ |
| 10 | Attachments | drdAttch | Attachment | No | — | ✅ |
| 11 | Amended Copy | drdAmend | Choice | No | ⚠️ Pending HR | Pending |
| 12 | Changes | drdChanges | Multiline | No | — | ✅ |
| 13 | Employee Name | drdEmpName | Person | Yes | — | ✅ |
| 14 | Submitted By | drdSubmittedBy | Person | System | — | ✅ |
| 15 | Submitted Date | drdSubmittedDate | DateTime | System | — | ✅ |
| 16-18 | HOS Approval | drdHOSName, drdHOSDate, drdHOSRemark | Mixed | Yes | — | ✅ |
| 19-21 | HOD Approval | drdHODName, drdHODDate, drdHODRemark | Mixed | Yes | — | ✅ |
| 22-23 | HR Received | drdHRName, drdHRDate | Mixed | Yes | — | ✅ |
| 24-26 | Approval Flags | drdHOSApp, drdHODApp, drdHRApp | Yes/No | System | — | ✅ |
| 27 | Current Status | drdCurrentAction | Choice | System | Submitted;HOSApproved;HODApproved;Completed | ✅ |

### EEN Columns (51)

| # | Display Name | Internal Name | Type | Required | Choices | Status |
|---|---|---|---|---|---|---|
| 1-6 | Employee Details | eenSite, eenMain, eenCategory, eenType, eenOtherType, eenContractStatus | Mixed | Yes | ⚠️ Pending (5 choice fields) | Pending |
| 7-11 | Employee Info | eenEmpName, eenEmpEmail, eenEmpNum, eenPosition, eenEmpDept | Mixed | Yes | — | ✅ |
| 12-20 | Dates + Superior | eenExitInterview, eenDtNoticeReceived, etc. | Mixed | Yes | — | ✅ |
| 21-25 | Deactivation | eenDtOriDeactivate, eenDtDeactivate, eenJustification, eenExtName, eenExtDate | Mixed | Yes | — | ✅ |
| 26-29 | ED Approval | eenEDStatus, eenEDName, eenEDDate, eenRemarks | Mixed | System | APPROVE;REJECT | ✅ |
| 30-32 | HOD Approval | eenHODStatus, eenHODName, eenHODDate | Mixed | System | APPROVE;REJECT | ✅ |
| 33-37 | Exit Interview | eenReasons, eenOtherReason, eenProgress, eenPay, eenNewJob | Mixed | No | ⚠️ Pending (NewJob) | Pending |
| 38-40 | IT Notification | eenActualLWD, eenSentBy, eenSentDate | Mixed | No | — | ✅ |
| 41-46 | Returned Items | eenCompanyProperties, eenReason, eenRemarks2, eenPerformedBy2, eenPerformedDate2, eenAttachment | Mixed | No | — | ✅ |
| 47-50 | Withdraw | eenWDStatus, eenWDReason, eenWDBy, eenWDDate | Mixed | No | ⚠️ Pending (WDStatus) | Pending |
| 51 | Current Status | eenCurrentAction | Choice | System | Submitted;EDApproved;EDRejected;Extended;NotifiedHR;Withdrawn | ✅ |

---

## 8. List Detail: MainDB_HR_Ext_BSD

**Purpose**: BSD Backup Staff entries
**Type**: Child | **Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line | Yes | Staff name |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID |
| 3 | Backup Staff Name | bsdBackupName | Person | Yes | |
| 4 | Backup Position | bsdBackupPosition | Single line | Yes | |
| 5 | Backup Responsibility | bsdBackupResponsibility | Multiline | No | |
| 6 | Row Number | bsdRowNumber | Number | No | |

### Indexed Columns
- ParentID (lookup performance)

---

## 9. List Detail: MainDB_HR_Ext_AWHR

**Purpose**: AWHR Working Hours rows
**Type**: Child | **Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line | Yes | Employee name |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID |
| 3 | Employee No | awhrEmpNo | Single line | Yes | |
| 4 | Full Name | awhrFullName | Person | Yes | |
| 5 | Exceeded Category | awhrExceededCategory | Choice | Yes | E1;E2;E3;E4 |
| 6 | Date From | awhrDateFrom | DateTime | Yes | |
| 7 | Date To | awhrDateTo | DateTime | Yes | |
| 8 | Day Type | awhrDayType | Choice | Yes | ⚠️ Pending HR |
| 9 | Shift Code | awhrShiftCode | Lookup | Yes | Config_ShiftCodes:Title |
| 10 | Add Hours | awhrAddHours | Number | No | |
| 11 | Total Hours | awhrTotalHours | Number | Yes | |
| 12 | Row Number | awhrRowNumber | Number | No | |

### Indexed Columns
- ParentID

---

## 10. List Detail: MainDB_HR_Ext_CWR_Periods

**Purpose**: CWR Period Required date ranges
**Type**: Child | **Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Display Name | Internal Name | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line | Yes | Period label |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID |
| 3 | Section Type | cwrSection | Choice | Yes | Permanent;Plant Shutdown |
| 4 | Period From | cwrPeriodFrom | DateTime | Yes | |
| 5 | Period To | cwrPeriodTo | DateTime | Yes | |
| 6 | Total Days | cwrTotalDays | Number | Yes | |
| 7 | Row Number | cwrRowNumber | Number | No | |

### Indexed Columns
- ParentID

---

## 11. List Detail: MainDB_HR_WorkflowHistory

**Purpose**: Multi-stage approval audit trail
**Type**: Workflow History | **Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Display Name | Internal Name | Type | Required | Choices |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line | Yes | Auto |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID |
| 3 | Form Code | wfFormCode | Choice | Yes | BSD;AWHR;CWR;DRD;EEN |
| 4 | Stage | wfStage | Single line | Yes | — |
| 5 | Action | wfAction | Choice | Yes | Approved;Rejected;Submitted;Acknowledged;Denied;Withdrawn;Extended |
| 6 | Performed By | wfPerformedBy | Person | Yes | |
| 7 | Performed Date | wfPerformedDate | DateTime | Yes | |
| 8 | Comments | wfComments | Multiline | No | |
| 9 | Previous State | wfPreviousState | Single line | No | |
| 10 | New State | wfNewState | Single line | No | |

### Indexed Columns
- ParentID
- wfFormCode

---

## 12. Attachment Handling

| List | Attachment Column | Notes |
|---|---|---|
| MainDB_HR | awhrAttachment, awhrHOSAtt, awhrHODAtt, awhrHRAtt, drdAttch, eenAttachment | Standard SharePoint attachment columns |
| Ext_BSD | None | — |
| Ext_AWHR | None | — |
| Ext_CWR_Periods | None | — |
| WorkflowHistory | None | — |

## 13. Permission Considerations

| Role | Access Level | Lists |
|---|---|---|
| HR Admins | Full Control | All lists |
| HR Staff | Contribute | MainDB_HR + child lists |
| HOD / HOS / ED | Contribute (approval screens only) | MainDB_HR, WorkflowHistory |
| All Employees | Read (own submissions) | MainDB_HR (filtered view) |
| IT | Read | All lists |

**Note**: Fine-grained permissions (approval-stage visibility) should be handled in Power Apps, not SharePoint list permissions.

## 14. PnP PowerShell Creation Notes

```powershell
# Template for list creation
Connect-PnPOnline -Url "{tenant}/sites/HR" -Interactive

# 1. Create configuration lists first
New-PnPList -Title "HR Shift Codes" -Template GenericList -Url "MainDB_HR_Config_ShiftCodes"

# 2. Add columns
Add-PnPField -List "MainDB_HR_Config_ShiftCodes" -DisplayName "Hours" -InternalName "scHours" -Type Text
Add-PnPField -List "MainDB_HR_Config_ShiftCodes" -DisplayName "Description" -InternalName "scDescription" -Type Text

# 3. Create parent list
New-PnPList -Title "HR Main Database" -Template GenericList -Url "MainDB_HR"

# 4. Add FormCode choice column
Add-PnPField -List "MainDB_HR" -DisplayName "Form Code" -InternalName "FormCode" -Type Choice -Choices "CIR","BSD","AWHR","CWR","DRD","EEN"

# 5. Add form-specific columns (example: CIR)
Add-PnPField -List "MainDB_HR" -DisplayName "CIR Site" -InternalName "cirSite" -Type Choice -Choices "PENDING_HR"
# ... repeat for all columns

# 6. Create child lists with lookup columns
New-PnPList -Title "HR BSD Backup Staff" -Template GenericList -Url "MainDB_HR_Ext_BSD"
Add-PnPField -List "MainDB_HR_Ext_BSD" -DisplayName "Parent ID" -InternalName "ParentID" -Type Lookup -List "MainDB_HR" -LookupField "ID"

# 7. Index frequently filtered columns
Set-PnPField -List "MainDB_HR" -Identity "FormCode" -Values @{Indexed=$true}
```

## 15. Validation Checklist After List Creation

| # | Check | Expected |
|---|---|---|
| 1 | All 7 lists created | Get-PnPList shows 7 HR lists |
| 2 | FormCode column has 6 values | CIR, BSD, AWHR, CWR, DRD, EEN |
| 3 | Shift codes seeded (10 rows) | Get-PnPListItem shows 10 items |
| 4 | Companies seeded (3 rows) | YKS, YTC, NAGA visible |
| 5 | ParentID lookups work | Can create child row linked to parent |
| 6 | CurrentAction columns have correct choices | DXL-confirmed values per form |
| 7 | Required columns reject empty values | Save fails without required fields |
| 8 | Person columns resolve M365 users | People picker works |
| 9 | Attachment columns accept files | File upload works |
| 10 | Column count per form matches spec | CIR:14, BSD:19, DRD:27, AWHR:35, CWR:48, EEN:51 |

---

## Build Package Summary

| Metric | Count |
|---|---|
| Lists | 7 |
| Parent Lists | 1 (MainDB_HR) |
| Child Lists | 3 (Ext_BSD, Ext_AWHR, Ext_CWR_Periods) |
| Workflow Lists | 1 (WorkflowHistory) |
| Config Lists | 2 (ShiftCodes, Companies) |
| Total Columns | ~250 |
| Seed Data Rows | 13 (10 shifts + 3 companies) |
| Pending HR Confirmations | ~25 choice fields + AWHR HR stage |
| Forms Ready for Build | 5 (CIR, BSD, DRD, CWR, EEN) |
| Forms Preliminary | 1 (AWHR) |

---

*Build package complete. Ready for PnP PowerShell provisioning script generation.*
