# HR SharePoint Architecture — Preliminary

> **Date**: 2026-06-01 | **Status**: Preliminary (P0 cleared, AWHR P1 pending)
> **Forms**: 6 promoted HR forms | **Evidence**: PDF text + DXL XML

## 1. Scope

Design SharePoint list architecture for 6 promoted HR forms:
CIR, BSD, AWHR, CWR, DRD, EEN — all using `MainDB_HR` parent list with FormCode discriminator.

## 2. Design Principles

| # | Principle |
|---|---|
| 1 | **Single parent list**: `MainDB_HR` with `FormCode` discriminator (consistent with IT `MainDB_IT` pattern) |
| 2 | **Child lists for repeating rows**: Migrate Domino fixed-row patterns to flexible child lists for SharePoint |
| 3 | **Workflow history list**: Separate list for multi-stage approval audit trail |
| 4 | **Lookup lists**: Reusable reference data (Shift Codes, Companies) |
| 5 | **CurrentAction as Choice column**: DXL-confirmed state values hardcoded |
| 6 | **Person columns for people**: HOD, HOS, ED, approvers, requestors |
| 7 | **Pending fields marked**: AWHR workflow fields marked ⚠️ Pending HR Confirmation |

## 3. Forms Covered

| FormCode | Form Name | Quality | Approval | Child Lists | CurrentAction States (DXL) |
|---|---|---|---|---|---|
| CIR | Cafeteria Inspection | 100/100 | Not Required | None | Submitted → Accepted |
| BSD | Backup Staff Database | 98/100 | 2-stage (HOD) | Ext_BSD (Backup Staff) | Request → Submitted → Approved / Rejected → ARCHIVE |
| AWHR | Rest Day & Working Hours | 85/100 | 3-stage (HOS→HOD→HR) ⚠️ | Ext_AWHR (Working Hours) | Request → Submitted → HOSApproved → HODApproved → Withdrawn |
| CWR | Contract Worker Requisition | 96/100 | 4-stage (HOD→DivHead→AGM HR→Req) | Ext_CWR (Periods + Workers) | Submitted → HODApp/Rej → HODivApp/Rej → HRHODApp/Rej → Ack/Denied (9) |
| DRD | Duty Roster Database | 98/100 | 3-stage (HOS→HOD→HR) | None | Submitted → HOSApproved → HODApproved → Completed |
| EEN | Employee Exit Notification | 93/100 | Multi (ED→HOD→IT) | None (interview embedded) | Submitted → EDApproved/EDRejected → Extended → NotifiedHR → Withdrawn |

## 4. Recommended List Architecture

```
MainDB_HR                          ← Parent (all 6 forms, FormCode discriminator)
├── MainDB_HR_Ext_BSD              ← BSD Backup Staff rows
├── MainDB_HR_Ext_AWHR             ← AWHR Working Hours rows
├── MainDB_HR_Ext_CWR_Periods      ← CWR Period date rows
├── MainDB_HR_WorkflowHistory      ← Multi-stage approval audit trail
├── MainDB_HR_Config_ShiftCodes    ← DRD shift code reference
└── MainDB_HR_Config_Companies     ← Shared company list
```

## 5. Parent List: MainDB_HR

### System Columns (All Forms)

| Column | Type | Notes |
|---|---|---|
| ID | Integer | Auto-generated |
| Title | Single line | Form title or auto-number |
| FormCode | Choice | CIR, BSD, AWHR, CWR, DRD, EEN |
| Created | DateTime | System |
| Modified | DateTime | System |
| Author | Person | Created By |
| Editor | Person | Modified By |

### Shared Columns (Used by Multiple Forms)

| Column | Type | Forms | Notes |
|---|---|---|---|
| hrCompany | Choice | BSD, AWHR, DRD | YKS, YTC, NAGA (from DXL) ⚠️ may need expansion |
| hrDepartment | Single line | BSD, AWHR, DRD | Free text or lookup |
| hrSection | Single line | BSD, AWHR, DRD | Free text |
| hrHOS | Person | AWHR, DRD | Head of Section |
| hrHOD | Person | BSD, AWHR, CWR, DRD, EEN | Head of Department / Superior |
| hrCurrentStatus | Choice | ALL | DXL-confirmed per form (see §10) |

### Form-Specific Columns

#### CIR — Cafeteria Inspection

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| cirSite | Choice | Inferred | ⚠️ Pending HR | PDF |
| cirTeamMembers | Person (multi) | Inferred | — | PDF |
| cirInspector | Person | Inferred | — | PDF |
| cirInsDate | DateTime | Inferred | — | PDF |
| cirInsTime | Single line | Inferred | — | PDF |
| cirSubmittedBy | Person | System | @Me | PDF |
| cirSubmittedDate | DateTime | System | @Now | PDF |
| cirReviewedBy | Person | No | — | PDF |
| cirReviewedDate | DateTime | No | — | PDF |
| cirRemarks | Multiline | No | — | PDF |
| cirCurrentAction | Choice | System | Submitted, Accepted | DXL |

#### BSD — Backup Staff Database

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| bsdDivision | Choice | Inferred | ⚠️ DB lookup | PDF/DXL |
| bsdDept | Choice | Inferred | ⚠️ DB lookup | PDF/DXL |
| bsdSection | Choice | Inferred | ⚠️ DB lookup | PDF/DXL |
| bsdPIC | Person | Inferred | — | PDF |
| bsdEmpNo | Single line | Inferred | — | PDF |
| bsdPosition | Single line | Inferred | — | PDF |
| bsdResponsibility | Multiline | Inferred | — | PDF |
| bsdSubmittedBy | Person | System | @Me | DXL |
| bsdSubmitDate | DateTime | System | @Now | DXL |
| bsdRemark | Multiline | No | — | PDF |
| bsdHODName | Person | Inferred | — | PDF |
| bsdHODDate | DateTime | Inferred | — | PDF |
| bsdHODRemarks | Multiline | No | — | PDF |
| bsdRevision | Choice | No | ⚠️ Pending HR | PDF |
| bsdUpdatedBy | Person | No | — | PDF |
| bsdUpdatedDate | DateTime | No | — | PDF |
| bsdCurrentAction | Choice | System | Request, Submitted, Approved, Rejected, ARCHIVE | DXL |

**Child List**: `MainDB_HR_Ext_BSD` — Backup Staff entries (Name, Position, Responsibility per row)

#### AWHR — Rest Day & Working Hours

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| awhrIssueNo | Single line | Inferred | — | PDF |
| awhrEmpCategory | Choice | ⚠️ Pending HR | ⚠️ Pending HR | PDF |
| awhrCC | Single line | No | — | PDF |
| awhrAttachment | Attachment | No | — | PDF |
| awhrE1 | Boolean | No | — | PDF |
| awhrE2 | Boolean | No | — | PDF |
| awhrE3 | Boolean | No | — | PDF |
| awhrE4 | Boolean | No | — | PDF |
| awhrSubmittedBy | Person | System | @Me | PDF |
| awhrSubmittedOn | DateTime | System | @Now | PDF |
| awhrHOSName | Person | Inferred | — | PDF |
| awhrHOSDate | DateTime | Inferred | — | PDF |
| awhrHOSRem | Multiline | No | — | PDF |
| awhrHOSAtt | Attachment | No | — | PDF |
| awhrHOSApp | Boolean | System | — | PDF |
| awhrHODName | Person | Inferred | — | PDF |
| awhrHODDate | DateTime | Inferred | — | PDF |
| awhrHODRem | Multiline | No | — | PDF |
| awhrHODAtt | Attachment | No | — | PDF |
| awhrHODApp | Boolean | System | — | PDF |
| awhrHRName | Person | ⚠️ Pending HR | — | PDF |
| awhrHRDate | DateTime | ⚠️ Pending HR | — | PDF |
| awhrHRCom | Multiline | No | — | PDF |
| awhrHRAtt | Attachment | No | — | PDF |
| awhrHRApp | Boolean | System | — | PDF |
| awhrWDBy | Person | No | — | PDF |
| awhrWDDate | DateTime | No | — | PDF |
| awhrWDReason | Multiline | No | — | PDF |
| awhrCurrentAction | Choice | System | Request, Submitted, HOSApproved, HODApproved, Withdrawn | DXL |
| awhrHistoryLog | Multiline | System | — | PDF |

**⚠️ Pending HR**: HR Accept/Deny stage — CA state not found in DXL, uses HRApp flag. Mandatory fields not enumerated.

**Child List**: `MainDB_HR_Ext_AWHR` — Working Hours rows (EmpNo, Name, Category, Date From/To, Day Type, Shift, Add Hours, Total Hours)

#### CWR — Contract Worker Requisition

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| cwrIssueNo | Single line | Inferred | — | PDF |
| cwrSendTo | Person | Inferred | — | PDF |
| cwrDivHead | Person | Inferred | — | PDF |
| cwrName | Person | Inferred | — | PDF |
| cwrType | Choice | Inferred | ⚠️ Pending HR | PDF |
| cwrPermCategory | Choice | Inferred | ⚠️ Pending HR | PDF |

*Permanent Workers Section*:
| cwrSite | Single line | Inferred | — | PDF |
| cwrNoWorkers | Number | Inferred | — | PDF |
| cwrWorkstation | Single line | Inferred | — | PDF |
| cwrJD | Multiline | Inferred | — | PDF |
| cwrWorkingHour | Single line | Inferred | — | PDF |
| cwrPeriod | DateTime | Inferred | — | PDF |
| cwrCurrentNoWorkers | Number | Inferred | — | PDF |
| cwrEffDate | DateTime | Inferred | — | PDF |
| cwrJustification | Multiline | Inferred | — | PDF |

*Plant Shutdown Section*:
| cwrSite2 | Single line | Inferred | — | PDF |
| cwrNoWorkers2 | Number | Inferred | — | PDF |
| cwrWorkstation2 | Single line | Inferred | — | PDF |
| cwrJD2 | Multiline | Inferred | — | PDF |

*Requestor*:
| cwrDocAuthor | Person | System | @Me | PDF |
| cwrDesignation | Single line | Inferred | — | PDF |
| cwrDateIssued | DateTime | System | @Now | PDF |

*4-Stage Approval*:
| cwrHODApp | Choice | System | Approved, Rejected | DXL |
| cwrHODName | Person | Inferred | — | PDF |
| cwrHODDate | DateTime | Inferred | — | PDF |
| cwrHODRemark | Multiline | No | — | PDF |
| cwrDivApp | Choice | System | Approved, Rejected | DXL |
| cwrDivName | Person | Inferred | — | PDF |
| cwrDivDate | DateTime | Inferred | — | PDF |
| cwrDivRemark | Multiline | No | — | PDF |
| cwrHRApp | Choice | System | Approved, Rejected | DXL |
| cwrHRName | Person | Inferred | — | PDF |
| cwrHRPosition | Single line | Inferred | — | PDF |
| cwrHRDate | DateTime | Inferred | — | PDF |
| cwrHRRemark | Multiline | No | — | PDF |
| cwrReqAck | Choice | System | Acknowledged, Denied | DXL |
| cwrReqName | Person | Inferred | — | PDF |
| cwrReqDate | DateTime | Inferred | — | PDF |
| cwrReqRemark | Multiline | No | — | PDF |

*HR/MTN Fill*:
| cwrVendor | Single line | No | — | PDF |
| cwrPax | Number | No | — | PDF |
| cwrDateHR | DateTime | No | — | PDF |
| cwrStatus | Choice | No | ⚠️ Pending HR | PDF |
| cwrRemarks | Multiline | No | — | PDF |
| cwrUpdatedBy | Person | No | — | PDF |
| cwrUpdatedDesi | Single line | No | — | PDF |
| cwrUpdatedDate | DateTime | No | — | PDF |

| cwrCurrentAction | Choice | System | Submitted, HODApproved, HODRejected, HODivApproved, HODivRejected, HRHODApproved, HRHODRejected, Acknowledged, Denied | DXL |

**Child Lists**: `MainDB_HR_Ext_CWR_Periods` (date ranges) — 3 perm + 3 shutdown rows

#### DRD — Duty Roster Database

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| drdCategory | Choice | Inferred | Both, Outsource Worker (DXL) | DXL |
| drdMonth | Number | Inferred | 1-12 | PDF |
| drdYear | Number | Inferred | — | PDF |
| drdAttch | Attachment | No | — | PDF |
| drdAmend | Choice | No | ⚠️ Pending HR | PDF |
| drdChanges | Multiline | No | — | PDF |
| drdEmpName | Person | Inferred | — | PDF |
| drdSubmittedBy | Person | System | @Me | DXL |
| drdSubmittedDate | DateTime | System | @Now | DXL |
| drdCC | Single line | No | — | PDF |
| drdHOSName | Person | Inferred | — | PDF |
| drdHOSDate | DateTime | Inferred | — | PDF |
| drdHOSRemark | Multiline | No | — | PDF |
| drdHODName | Person | Inferred | — | PDF |
| drdHODDate | DateTime | Inferred | — | PDF |
| drdHODRemark | Multiline | No | — | PDF |
| drdHRName | Person | Inferred | — | PDF |
| drdHRDate | DateTime | Inferred | — | PDF |
| drdHOSApp | Boolean | System | — | DXL |
| drdHODApp | Boolean | System | — | DXL |
| drdHRApp | Boolean | System | — | DXL |
| drdCurrentAction | Choice | System | Submitted, HOSApproved, HODApproved, Completed | DXL |

#### EEN — Employee Exit Notification

| Column | Type | Required | Choices | Source |
|---|---|---|---|---|
| eenMain | Choice | Inferred | ⚠️ Pending HR | PDF |
| eenCategory | Choice | Inferred | ⚠️ Pending HR | PDF |
| eenType | Choice | Inferred | ⚠️ Pending HR | PDF |
| eenOtherType | Single line | No | — | PDF |
| eenContractStatus | Choice | Inferred | ⚠️ Pending HR | PDF |
| eenEmpName | Person | Inferred | — | PDF |
| eenEmpEmail | Email | Inferred | — | PDF |
| eenEmpNum | Single line | Inferred | — | PDF |
| eenPosition | Single line | Inferred | — | PDF |
| eenEmpDept | Single line | Inferred | — | PDF |
| eenExitInterview | Choice | Inferred | ⚠️ Pending HR | PDF |
| eenDtNoticeReceived | DateTime | Inferred | — | PDF |
| eenResignedDate | DateTime | Inferred | — | PDF |
| eenLastWorkingDay | DateTime | Inferred | — | PDF |
| eenLastServiceDay | DateTime | Inferred | — | PDF |
| eenDivHead | Person | Inferred | — | PDF |
| eenHRComment | Multiline | No | — | PDF |
| eenSubmitDate | DateTime | System | @Now | PDF |
| eenDtOriDeactivate | DateTime | Inferred | — | PDF |
| eenDtDeactivate | DateTime | Inferred | — | PDF |
| eenJustification | Multiline | No | — | PDF |
| eenExtName | Person | No | — | PDF |
| eenExtDate | DateTime | No | — | PDF |

*ED Approval*:
| eenEDName | Person | Inferred | — | PDF |
| eenEDDate | DateTime | Inferred | — | PDF |
| eenRemarks | Multiline | No | — | PDF |

*HOD Approval*:
| eenHODName | Person | Inferred | — | PDF |
| eenHODDate | DateTime | Inferred | — | PDF |
| eenHODRemarks | Multiline | No | — | PDF |

*Exit Interview (embedded)*:
| eenReasons | Multiline | No | — | PDF |
| eenOtherReason | Single line | No | — | PDF |
| eenProgress | Multiline | No | — | PDF |
| eenPay | Multiline | No | — | PDF |
| eenNewJob | Choice | No | ⚠️ Pending HR | PDF |

*IT Notification*:
| eenActualLWD | DateTime | No | — | PDF |
| eenSentBy | Person | No | — | PDF |
| eenSentDate | DateTime | No | — | PDF |

*HR Returned Items*:
| eenCompanyProperties | Choice | No | ⚠️ Pending HR | PDF |
| eenReason | Multiline | No | — | PDF |
| eenRemarks2 | Multiline | No | — | PDF |
| eenPerformedBy2 | Person | No | — | PDF |
| eenPerformedDate2 | DateTime | No | — | PDF |
| eenAttachment | Attachment | No | — | PDF |

*Withdraw*:
| eenWDStatus | Choice | No | ⚠️ Pending HR | PDF |
| eenWDReason | Multiline | No | — | PDF |
| eenWDBy | Person | No | — | PDF |
| eenWDDate | DateTime | No | — | PDF |

| eenCurrentAction | Choice | System | Submitted, EDApproved, EDRejected, Extended, NotifiedHR, Withdrawn | DXL |

## 6. Child Lists

### MainDB_HR_Ext_BSD — Backup Staff

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line | Yes | Staff name |
| ParentID | Lookup (MainDB_HR:ID) | Yes | |
| bsdBackupName | Person | Yes | |
| bsdBackupPosition | Single line | Yes | |
| bsdBackupResponsibility | Multiline | Inferred | |
| RowNumber | Number | System | 1, 2, 3... |

### MainDB_HR_Ext_AWHR — Working Hours

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line | Yes | Employee name |
| ParentID | Lookup (MainDB_HR:ID) | Yes | |
| awhrEmpNo | Single line | Yes | |
| awhrFullName | Person | Yes | |
| awhrExceededCategory | Choice | Inferred | E1, E2, E3, E4 |
| awhrDateFrom | DateTime | Yes | |
| awhrDateTo | DateTime | Yes | |
| awhrDayType | Choice | Inferred | ⚠️ Pending HR |
| awhrShiftCode | Lookup (Config_ShiftCodes) | Inferred | |
| awhrAddHours | Number | No | |
| awhrTotalHours | Number | Yes | |
| RowNumber | Number | System | 1-15 |

### MainDB_HR_Ext_CWR_Periods — Period Date Ranges

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line | Yes | Period label |
| ParentID | Lookup (MainDB_HR:ID) | Yes | |
| cwrSection | Choice | Yes | Permanent, Plant Shutdown |
| cwrPeriodFrom | DateTime | Yes | |
| cwrPeriodTo | DateTime | Yes | |
| cwrTotalDays | Number | Yes | |
| RowNumber | Number | System | 1-3 per section |

## 7. Workflow History List: MainDB_HR_WorkflowHistory

Used for forms with multi-stage approval: BSD, AWHR, CWR, DRD, EEN.

| Column | Type | Notes |
|---|---|---|
| Title | Single line | Auto-generated |
| ParentID | Lookup (MainDB_HR:ID) | |
| wfFormCode | Choice | BSD, AWHR, CWR, DRD, EEN |
| wfStage | Choice | Per-form stage names |
| wfAction | Choice | Approved, Rejected, Submitted, Acknowledged, Denied, Withdrawn |
| wfPerformedBy | Person | |
| wfPerformedDate | DateTime | |
| wfComments | Multiline | |
| wfPreviousState | Single line | |
| wfNewState | Single line | |

## 8. Lookup / Configuration Lists

### MainDB_HR_Config_ShiftCodes

| Column | Type | Notes |
|---|---|---|
| Title | Single line | Shift code (OFC, OFO, N1...) |
| scHours | Single line | 08:30-17:45 |
| scDescription | Single line | Office, Morning, Afternoon, etc. |

### MainDB_HR_Config_Companies

| Column | Type | Notes |
|---|---|---|
| Title | Single line | YKS, YTC, NAGA |
| ccFullName | Single line | Full company name |

## 9. Relationship Keys

| Parent | Child | Key |
|---|---|---|
| MainDB_HR | MainDB_HR_Ext_BSD | ID → ParentID |
| MainDB_HR | MainDB_HR_Ext_AWHR | ID → ParentID |
| MainDB_HR | MainDB_HR_Ext_CWR_Periods | ID → ParentID |
| MainDB_HR | MainDB_HR_WorkflowHistory | ID → ParentID |
| MainDB_HR_Ext_AWHR | MainDB_HR_Config_ShiftCodes | awhrShiftCode → ID |

## 10. Status and CurrentAction / CA Design

### Design Decision

Use a single `hrCurrentStatus` Choice column on `MainDB_HR` that combines all per-form state values. Filter by FormCode for Power Apps dropdowns.

**Alternative**: Per-form CurrentAction columns (`bsdCurrentAction`, `awhrCurrentAction`, etc.) — simpler to validate but more columns. **Recommended**: per-form columns for clarity and validation.

### CurrentAction Choice Values (DXL-Confirmed)

| Form | Column | Values |
|---|---|---|
| CIR | cirCurrentAction | Submitted, Accepted |
| BSD | bsdCurrentAction | Request, Submitted, Approved, Rejected, ARCHIVE |
| AWHR | awhrCurrentAction | Request, Submitted, HOSApproved, HODApproved, Withdrawn |
| CWR | cwrCurrentAction | Submitted, HODApproved, HODRejected, HODivApproved, HODivRejected, HRHODApproved, HRHODRejected, Acknowledged, Denied |
| DRD | drdCurrentAction | Submitted, HOSApproved, HODApproved, Completed |
| EEN | eenCurrentAction | Submitted, EDApproved, EDRejected, Extended, NotifiedHR, Withdrawn |

## 11. Form-by-Form Design Summary

### CIR — 100/100 ✅
- Parent: MainDB_HR (14 columns)
- Child: None
- Workflow: None
- Attachments: None
- Status: Ready for schema export

### BSD — 98/100 ✅
- Parent: MainDB_HR (17 columns)
- Child: Ext_BSD (5 columns)
- Workflow: 2-stage (HOD only)
- Workflow History: Recommended
- Status: Ready for schema export

### AWHR — 85/100 ⚠️
- Parent: MainDB_HR (30 columns)
- Child: Ext_AWHR (11 columns)
- Workflow: 3-stage (HOS→HOD→HR) ⚠️ HR stage pending
- Workflow History: Recommended
- ⚠️ Pending: HR Accept/Deny as final stage, mandatory fields list
- Status: Can export schema; mark HR stage as Pending

### CWR — 96/100 ✅
- Parent: MainDB_HR (50+ columns — large form)
- Child: Ext_CWR_Periods (6 columns)
- Workflow: 4-stage (9 CA states)
- Workflow History: Strongly recommended
- Status: Ready for schema export

### DRD — 98/100 ✅
- Parent: MainDB_HR (21 columns)
- Child: None
- Workflow: 3-stage (HOS→HOD→HR)
- Workflow History: Recommended
- Lookup: Config_ShiftCodes (10 entries)
- Status: Ready for schema export

### EEN — 93/100 ✅
- Parent: MainDB_HR (50+ columns — largest form)
- Child: None (interview embedded per DXL)
- Workflow: Multi-stage (ED→Extended→NotifiedHR→Withdrawn)
- Workflow History: Recommended
- Status: Ready for schema export

## 12. Pending HR Confirmation Items

| # | Form | Item | Impact |
|---|---|---|---|
| 1 | AWHR | Is HR Accept/Deny the final CA state? | CurrentAction choice values |
| 2 | AWHR | Can HOD be skipped? | Power Automate branching |
| 3 | AWHR | Which fields are mandatory? | Validation rules |
| 4 | All | Choice values for Site, Division, Dept, Section, Category, Type, etc. | Dropdown population |
| 5 | BSD | Revision Required: Yes/No or multi? | Minor |

## 13. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| CWR and EEN parent columns may approach limit (~50 each) | Low | Can split into extension lists if needed |
| AWHR HR stage CA state unknown | Medium | Mark HRApp flag as final stage; confirm with HR before UAT |
| Choice values for DB-lookup fields (Division, Dept, Section) | Low | Use text fields initially; add choices after HR provides values |
| Shift code completeness | Low | 10 codes confirmed in DXL; add more if HR identifies gaps |

## 14. Recommended Next Step

**Generate SharePoint schema export** for all 6 forms. Start with DRD (98/100, zero open) and CIR (100/100) as the simplest forms. AWHR can be generated with P1 fields marked as pending.

### List Creation Order
1. `MainDB_HR_Config_ShiftCodes` (lookup — no dependencies)
2. `MainDB_HR_Config_Companies` (lookup — no dependencies)
3. `MainDB_HR` (parent — 6 FormCode entries)
4. `MainDB_HR_Ext_BSD`, `MainDB_HR_Ext_AWHR`, `MainDB_HR_Ext_CWR_Periods` (children)
5. `MainDB_HR_WorkflowHistory` (audit trail)
