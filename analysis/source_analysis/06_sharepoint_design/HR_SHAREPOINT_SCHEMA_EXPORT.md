# HR SharePoint Schema Export

> **Date**: 2026-06-01 | **Status**: Preliminary (AWHR P1 pending, all P0 cleared)
> **Evidence**: PDF text + DXL XML | **Architecture**: `HR_SHAREPOINT_ARCHITECTURE_PRELIMINARY.md`
> **Format**: Excel-ready — one row per column, organized by list

---

## Schema Export Conventions

| Convention | Value |
|---|---|
| Site URL | `{tenant}/sites/HR` (placeholder — confirm with IT) |
| Parent list | `MainDB_HR` |
| Child list prefix | `MainDB_HR_Ext_` |
| Config list prefix | `MainDB_HR_Config_` |
| System fields (not listed) | ID, Created, Created By, Modified, Modified By, Attachments, Version |

---

## LIST 1: MainDB_HR (Parent — All 6 Forms)

**Purpose**: Single parent list for all HR forms with `FormCode` discriminator.
**Type**: Parent
**System Fields**: ID, Title, FormCode, Created, Created By, Modified, Modified By

### System Columns (All Forms)

| Department | Form | List | Type | Column Display Name | Internal Name | SP Type | Required | Source |
|---|---|---|---|---|---|---|---|---|
| HR | ALL | MainDB_HR | Parent | Form Code | FormCode | Choice | Yes | CIR;BSD;AWHR;CWR;DRD;EEN |
| HR | ALL | MainDB_HR | Parent | Title | Title | Single line of text | Yes | Auto-generated |

### CIR — Cafeteria Inspection (14 columns)

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source Field | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Site | cirSite | Choice | Inferred | ⚠️ Pending HR | Site | PDF P1 |
| 2 | Team Members | cirTeamMembers | Person or Group | Inferred | — | TeamMembers | PDF P1 |
| 3 | Inspector | cirInspector | Person or Group | Inferred | — | Inspector | PDF P1 |
| 4 | Inspection Date | cirInsDate | Date and time | Inferred | — | InsDate | PDF P1 |
| 5 | Inspection Time | cirInsTime | Single line of text | Inferred | — | InsTime | PDF P1 |
| 6 | Submitted By | cirSubmittedBy | Person or Group | System | @Me | SubmittedBy | PDF P1 |
| 7 | Submitted Date | cirSubmittedDate | Date and time | System | @Now | SubmittedDate | PDF P1 |
| 8 | Reviewed By | cirReviewedBy | Person or Group | No | — | ReviewedBy | PDF P1 |
| 9 | Reviewed Date | cirReviewedDate | Date and time | No | — | ReviewedDate | PDF P1 |
| 10 | Remarks | cirRemarks | Multiple lines of text | No | — | Remarks | PDF P1 |
| 11 | Current Status | cirCurrentAction | Choice | System | Submitted;Accepted | CurrentAction | DXL |
| 12 | Committee Members ACM | cirACMComm | Single line of text | System | — | ACMComm | PDF P2 |
| 13 | Committee Members ECM | cirECMComm | Single line of text | System | — | ECMComm | PDF P2 |
| 14 | Running Number | cirINO | Single line of text | System | — | INO | PDF P2 |

### BSD — Backup Staff Database (17 columns)

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source Field | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Division | bsdDivision | Choice | Inferred | ⚠️ DB lookup | Division | PDF P1, DXL |
| 2 | Department | bsdDept | Choice | Inferred | ⚠️ DB lookup | Dept | PDF P1, DXL |
| 3 | Section | bsdSection | Choice | Inferred | ⚠️ DB lookup | Section | PDF P1, DXL |
| 4 | Person In Charge | bsdPIC | Person or Group | Inferred | — | PIC | PDF P1 |
| 5 | Employee No | bsdEmpNo | Single line of text | Inferred | — | EmpNo | PDF P1 |
| 6 | Position | bsdPosition | Single line of text | Inferred | — | Position | PDF P1 |
| 7 | Area of Responsibility | bsdResponsibility | Multiple lines of text | Inferred | — | Responsibility | PDF P1 |
| 8 | Department Head | bsdHOD | Person or Group | Inferred | — | HOD | PDF P1 |
| 9 | Submitted By | bsdSubmittedBy | Person or Group | System | @Me | SubmittedBy | DXL |
| 10 | Submit Date | bsdSubmitDate | Date and time | System | @Now | SubmitDate | DXL |
| 11 | Remark | bsdRemark | Multiple lines of text | No | — | Remark | PDF P2 |
| 12 | HOD Name | bsdHODName | Person or Group | Inferred | — | HODName | PDF P3 |
| 13 | HOD Date | bsdHODDate | Date and time | Inferred | — | HODDate | PDF P3 |
| 14 | HOD Remarks | bsdHODRemarks | Multiple lines of text | No | — | HODRemarks | PDF P3 |
| 15 | Revision Required | bsdRevision | Choice | No | ⚠️ Pending HR (Q: BSD-04) | Revision | PDF P2 |
| 16 | Updated By | bsdUpdatedBy | Person or Group | No | — | Updatedby | PDF P2 |
| 17 | Updated Date | bsdUpdatedDate | Date and time | No | — | Updateddt | PDF P2 |
| 18 | Status | bsdStatus | Choice | System | ⚠️ Pending HR | Status | PDF P2 |
| 19 | Current Status | bsdCurrentAction | Choice | System | Request;Submitted;Approved;Rejected;ARCHIVE | CurrentAction | DXL |

**Child List**: `MainDB_HR_Ext_BSD` — Backup Staff 1-3 entries (Name, Position, Responsibility)

### AWHR — Rest Day & Working Hours (30 columns) ⚠️

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Issue No | awhrIssueNo | Single line of text | Inferred | — | IssueNo | PDF P1 |
| 2 | Company | awhrCompany | Choice | Inferred | ⚠️ Pending HR | Company | PDF P1 |
| 3 | Employee Category | awhrEmpCategory | Choice | ⚠️ Pending HR (Q: AWHR-03) | ⚠️ Pending HR | EmpCategory | PDF P1 |
| 4 | Section | awhrSection | Single line of text | Inferred | — | Section | PDF P1 |
| 5 | Department | awhrDepartment | Single line of text | Inferred | — | Department | PDF P1 |
| 6 | Section Head | awhrHOS | Person or Group | Inferred | — | HOS | PDF P1 |
| 7 | Department Head | awhrHOD | Person or Group | Inferred | — | HOD | PDF P1 |
| 8 | CC | awhrCC | Single line of text | No | — | CC | PDF P1 |
| 9 | Remarks Attachment | awhrAttachment | Attachment | No | — | Attachment | PDF P1 |
| 10 | E1 - Exceeding 12hrs/day | awhrE1 | Yes/No | No | — | (checkbox) | PDF P1 |
| 11 | E2 - Working on Rest Day | awhrE2 | Yes/No | No | — | (checkbox) | PDF P1 |
| 12 | E3 - Exceeding 60hrs/week | awhrE3 | Yes/No | No | — | (checkbox) | PDF P1 |
| 13 | E4 - Exceeding 104hrs/month | awhrE4 | Yes/No | No | — | (checkbox) | PDF P1 |
| 14 | Submitted By | awhrSubmittedBy | Person or Group | System | @Me | Submittedby | PDF P2 |
| 15 | Submitted On | awhrSubmittedOn | Date and time | System | @Now | Submittedon | PDF P2 |
| 16 | HOS Name | awhrHOSName | Person or Group | Inferred | — | HOSName | PDF P2 |
| 17 | HOS Date | awhrHOSDate | Date and time | Inferred | — | HOSDate | PDF P2 |
| 18 | HOS Remark | awhrHOSRem | Multiple lines of text | No | — | HOSRem | PDF P2 |
| 19 | HOS Attachment | awhrHOSAtt | Attachment | No | — | HOSAtt | PDF P2 |
| 20 | HOS Approved | awhrHOSApp | Yes/No | System | — | HOSApp | PDF P2 |
| 21 | HOD Name | awhrHODName | Person or Group | Inferred | — | HODName | PDF P3 |
| 22 | HOD Date | awhrHODDate | Date and time | Inferred | — | HODDate | PDF P3 |
| 23 | HOD Remark | awhrHODRem | Multiple lines of text | No | — | HODRem | PDF P3 |
| 24 | HOD Attachment | awhrHODAtt | Attachment | No | — | HODAtt | PDF P3 |
| 25 | HOD Approved | awhrHODApp | Yes/No | System | — | HODApp | PDF P3 |
| 26 | HR Name | awhrHRName | Person or Group | ⚠️ Pending HR | — | HRName | PDF P3 |
| 27 | HR Date | awhrHRDate | Date and time | ⚠️ Pending HR | — | HRDate | PDF P3 |
| 28 | HR Comment | awhrHRCom | Multiple lines of text | No | — | HRCom | PDF P3 |
| 29 | HR Attachment | awhrHRAtt | Attachment | No | — | HRAtt | PDF P3 |
| 30 | HR Approved | awhrHRApp | Yes/No | System | — | HRApp | PDF P3 |
| 31 | Withdrawn By | awhrWDBy | Person or Group | No | — | WDBy | PDF P3 |
| 32 | Withdrawn Date | awhrWDDate | Date and time | No | — | WDDate | PDF P3 |
| 33 | Withdrawn Reason | awhrWDReason | Multiple lines of text | No | — | WDReason | PDF P3 |
| 34 | History Log | awhrHistoryLog | Multiple lines of text | System | — | HistoryLog | PDF P3 |
| 35 | Current Status | awhrCurrentAction | Choice | System | Request;Submitted;HOSApproved;HODApproved;Withdrawn | CA | DXL |

**⚠️ AWHR Pending**: HR Accept/Deny final stage (Q: AWHR-02), mandatory field list (Q: AWHR-03), skip-HOD logic (Q: AWHR-01)

**Child List**: `MainDB_HR_Ext_AWHR` — Working Hours (15 rows)

### CWR — Contract Worker Requisition (50+ columns)

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Issue No | cwrIssueNo | Single line of text | Inferred | — | IssueNo | PDF P1 |
| 2 | Send To (HOD) | cwrSendTo | Person or Group | Inferred | — | SendTo | PDF P1 |
| 3 | Division Head | cwrDivHead | Person or Group | Inferred | — | DivHead | PDF P1 |
| 4 | From Name | cwrName | Person or Group | Inferred | — | Name | PDF P1 |
| 5 | Worker Type | cwrType | Choice | Inferred | ⚠️ Pending HR (Q: CWR-04) | Type | PDF P1 |
| 6 | Category | cwrPermCategory | Choice | Inferred | ⚠️ Pending HR (Q: CWR-04) | PermCategory | PDF P1 |
| 7 | Site (Perm) | cwrSite | Single line of text | Inferred | — | Site | PDF P1 |
| 8 | No of Workers (Perm) | cwrNoWorkers | Number | Inferred | — | NoWorkers | PDF P1 |
| 9 | Workstation (Perm) | cwrWorkstation | Single line of text | Inferred | — | Workstation | PDF P1 |
| 10 | Job Description (Perm) | cwrJD | Multiple lines of text | Inferred | — | JD | PDF P1 |
| 11 | Working Hour | cwrWorkingHour | Single line of text | Inferred | — | WorkingHour | PDF P1 |
| 12 | Date Required | cwrPeriod | Date and time | Inferred | — | Period | PDF P1 |
| 13 | Current Workers | cwrCurrentNoWorkers | Number | Inferred | — | CurrentNoWorkers | PDF P1 |
| 14 | Effective Date | cwrEffDate | Date and time | Inferred | — | EffDate | PDF P2 |
| 15 | Justification | cwrJustification | Multiple lines of text | Inferred | — | Justification | PDF P2 |
| 16 | Site (Shutdown) | cwrSite2 | Single line of text | Inferred | — | Site2 | PDF P2 |
| 17 | No of Workers (Shutdown) | cwrNoWorkers2 | Number | Inferred | — | NoWorkers2 | PDF P2 |
| 18 | Workstation (Shutdown) | cwrWorkstation2 | Single line of text | Inferred | — | Workstation2 | PDF P2 |
| 19 | Job Description (Shutdown) | cwrJD2 | Multiple lines of text | Inferred | — | JD2 | PDF P2 |
| 20 | Requested By | cwrDocAuthor | Person or Group | System | @Me | DocAuthor | PDF P2 |
| 21 | Designation | cwrDesignation | Single line of text | Inferred | — | Designation | PDF P2 |
| 22 | Date Issued | cwrDateIssued | Date and time | System | @Now | DateIssued | PDF P2 |
| 23 | HOD Approved | cwrHODApp | Choice | System | Approved;Rejected | HODApp | DXL |
| 24 | HOD Name | cwrHODName | Person or Group | Inferred | — | HODName | PDF P2 |
| 25 | HOD Date | cwrHODDate | Date and time | Inferred | — | HODDate | PDF P2 |
| 26 | HOD Remark | cwrHODRemark | Multiple lines of text | No | — | HODRemark | PDF P2 |
| 27 | Div Head Approved | cwrDivApp | Choice | System | Approved;Rejected | HODApp3 | DXL |
| 28 | Div Head Name | cwrDivName | Person or Group | Inferred | — | HODName3 | PDF P3 |
| 29 | Div Head Date | cwrDivDate | Date and time | Inferred | — | HODDate3 | PDF P3 |
| 30 | Div Head Remark | cwrDivRemark | Multiple lines of text | No | — | HODRemark3 | PDF P3 |
| 31 | AGM HR Approved | cwrHRApp | Choice | System | Approved;Rejected | HRApp | DXL |
| 32 | AGM HR Name | cwrHRName | Person or Group | Inferred | — | HRName | PDF P3 |
| 33 | AGM HR Position | cwrHRPosition | Single line of text | Inferred | — | HRPosition | PDF P3 |
| 34 | AGM HR Date | cwrHRDate | Date and time | Inferred | — | HRDate | PDF P3 |
| 35 | AGM HR Remark | cwrHRRemark | Multiple lines of text | No | — | HRRemark | PDF P3 |
| 36 | Requestor Acknowledged | cwrReqAck | Choice | System | Acknowledged;Denied | HODApp2 | DXL |
| 37 | Requestor Name | cwrReqName | Person or Group | Inferred | — | HODName2 | PDF P4 |
| 38 | Requestor Date | cwrReqDate | Date and time | Inferred | — | HODDate2 | PDF P4 |
| 39 | Requestor Remark | cwrReqRemark | Multiple lines of text | No | — | HODRemark2 | PDF P4 |
| 40 | Vendor | cwrVendor | Single line of text | No | — | Vendor | PDF P3 |
| 41 | Number of Pax | cwrPax | Number | No | — | Pax | PDF P3 |
| 42 | Required Due Date | cwrDateHR | Date and time | No | — | DateHR | PDF P3 |
| 43 | Request Status | cwrStatus | Choice | No | ⚠️ Pending HR | Status | PDF P4 |
| 44 | Remarks | cwrRemarks | Multiple lines of text | No | — | Remarks | PDF P3 |
| 45 | Updated By | cwrUpdatedBy | Person or Group | No | — | UpdatedBy | PDF P3 |
| 46 | Updated Designation | cwrUpdatedDesi | Single line of text | No | — | UpdatedDesi | PDF P3 |
| 47 | Updated Date | cwrUpdatedDate | Date and time | No | — | UpdatedDate | PDF P3 |
| 48 | Current Status | cwrCurrentAction | Choice | System | Submitted;HODApproved;HODRejected;HODivApproved;HODivRejected;HRHODApproved;HRHODRejected;Acknowledged;Denied | CurrentAction | DXL |

**Child List**: `MainDB_HR_Ext_CWR_Periods` — Period date ranges (3 perm + 3 shutdown)

### DRD — Duty Roster Database (21 columns) ✅ Clean

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Company | drdCompany | Choice | Inferred | YKS;YTC;NAGA | Comp | DXL |
| 2 | Category | drdCategory | Choice | Inferred | Both;Outsource Worker | Category | DXL |
| 3 | Department | drdDepartment | Single line of text | Inferred | — | Dept | PDF P1 |
| 4 | Section | drdSection | Single line of text | Inferred | — | Section | PDF P1 |
| 5 | Section Head | drdHOS | Person or Group | Inferred | — | HOS | PDF P1 |
| 6 | Department Head | drdHOD | Person or Group | Inferred | — | HOD | PDF P1 |
| 7 | CC | drdCC | Single line of text | No | — | CC | PDF P1 |
| 8 | Month | drdMonth | Number | Inferred | 1-12 | Month | PDF P1 |
| 9 | Year | drdYear | Number | Inferred | — | Year | PDF P1 |
| 10 | Attachments | drdAttch | Attachment | No | — | Attch | PDF P1 |
| 11 | Amended Copy | drdAmend | Choice | No | ⚠️ Pending HR (Q: DRD-02) | Amend | PDF P1 |
| 12 | Changes | drdChanges | Multiple lines of text | No | — | Changes | PDF P1 |
| 13 | Employee Name | drdEmpName | Person or Group | Inferred | — | EmpName | PDF P1 |
| 14 | Submitted By | drdSubmittedBy | Person or Group | System | @Me | SubmittedBy | DXL |
| 15 | Submitted Date | drdSubmittedDate | Date and time | System | @Now | SubmittedDate | DXL |
| 16 | HOS Name | drdHOSName | Person or Group | Inferred | — | HOSName | PDF P1 |
| 17 | HOS Date | drdHOSDate | Date and time | Inferred | — | HOSDate | PDF P1 |
| 18 | HOS Remark | drdHOSRemark | Multiple lines of text | No | — | HOSRemark | PDF P1 |
| 19 | HOD Name | drdHODName | Person or Group | Inferred | — | HODName | PDF P2 |
| 20 | HOD Date | drdHODDate | Date and time | Inferred | — | HODDate | PDF P2 |
| 21 | HOD Remark | drdHODRemark | Multiple lines of text | No | — | HODRemark | PDF P2 |
| 22 | HR Name | drdHRName | Person or Group | Inferred | — | HRName | PDF P2 |
| 23 | HR Date | drdHRDate | Date and time | Inferred | — | HRDate | PDF P2 |
| 24 | HOS Approved | drdHOSApp | Yes/No | System | — | HOSApp | DXL |
| 25 | HOD Approved | drdHODApp | Yes/No | System | — | HODApp | DXL |
| 26 | HR Received | drdHRApp | Yes/No | System | — | HRApp | DXL |
| 27 | Current Status | drdCurrentAction | Choice | System | Submitted;HOSApproved;HODApproved;Completed | CA | DXL |

### EEN — Employee Exit Notification (50+ columns)

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Site | eenSite | Single line of text | Inferred | — | Site | PDF P1 |
| 2 | Main Category | eenMain | Choice | Inferred | ⚠️ Pending HR (Q: EEN-05) | Main | PDF P1 |
| 3 | Category | eenCategory | Choice | Inferred | ⚠️ Pending HR (Q: EEN-05) | Category | PDF P1 |
| 4 | Type | eenType | Choice | Inferred | ⚠️ Pending HR (Q: EEN-05) | Type | PDF P1 |
| 5 | Other Type | eenOtherType | Single line of text | No | — | othertype | PDF P1 |
| 6 | Contract Status | eenContractStatus | Choice | Inferred | ⚠️ Pending HR (Q: EEN-05) | ContractStatus | PDF P1 |
| 7 | Employee Name | eenEmpName | Person or Group | Inferred | — | EmpName | PDF P1 |
| 8 | Employee Email | eenEmpEmail | Single line of text | Inferred | — | EmpEmail | PDF P1 |
| 9 | Employee No | eenEmpNum | Single line of text | Inferred | — | EmpNum | PDF P1 |
| 10 | Position | eenPosition | Single line of text | Inferred | — | Position | PDF P1 |
| 11 | Department | eenEmpDept | Single line of text | Inferred | — | EmpDept | PDF P1 |
| 12 | Exit Interview Hardcopy | eenExitInterview | Choice | Inferred | ⚠️ Pending HR (Q: EEN-05) | ExitInterview | PDF P1 |
| 13 | Notification Received | eenDtNoticeReceived | Date and time | Inferred | — | dtNoticeReceived | PDF P1 |
| 14 | Resignation Date | eenResignedDate | Date and time | Inferred | — | ResignedDate | PDF P1 |
| 15 | Last Working Day | eenLastWorkingDay | Date and time | Inferred | — | LastWorkingDay | PDF P1 |
| 16 | Last Service Day | eenLastServiceDay | Date and time | Inferred | — | LastServiceDay | PDF P1 |
| 17 | Superior (HOD) | eenHOD | Person or Group | Inferred | — | HOD | PDF P1 |
| 18 | Division Head | eenDivHead | Person or Group | Inferred | — | DivHead | PDF P1 |
| 19 | HR Remarks | eenHRComment | Multiple lines of text | No | — | HRComment | PDF P1 |
| 20 | Date Submitted | eenSubmitDate | Date and time | System | @Now | SubmitDate | PDF P1 |
| 21 | Original Deactivate Date | eenDtOriDeactivate | Date and time | Inferred | — | dtOriDeactivate | PDF P2 |
| 22 | Deactivate Date | eenDtDeactivate | Date and time | Inferred | — | dtDeactivate | PDF P2 |
| 23 | Extension Justification | eenJustification | Multiple lines of text | No | — | Justification | PDF P2 |
| 24 | Extension Granted By | eenExtName | Person or Group | No | — | ExtName | PDF P2 |
| 25 | Extension Granted Date | eenExtDate | Date and time | No | — | ExtDate | PDF P2 |
| 26 | ED Status | eenEDStatus | Choice | System | APPROVE;REJECT | Status | PDF P3, DXL |
| 27 | ED Name | eenEDName | Person or Group | Inferred | — | EDName | PDF P3 |
| 28 | ED Date | eenEDDate | Date and time | Inferred | — | EDDate | PDF P3 |
| 29 | ED Remarks | eenRemarks | Multiple lines of text | No | — | Remarks | PDF P3 |
| 30 | HOD Approved | eenHODStatus | Choice | System | APPROVE;REJECT | HODRemarks | PDF P4, DXL |
| 31 | HOD Name | eenHODName | Person or Group | Inferred | — | HODName | PDF P4 |
| 32 | HOD Date | eenHODDate | Date and time | Inferred | — | HODDate | PDF P4 |
| 33 | Exit Reason | eenReasons | Multiple lines of text | No | — | Reasons | PDF P3 |
| 34 | Exit Other Reason | eenOtherReason | Single line of text | No | — | otherReason | PDF P3 |
| 35 | Progress Feedback | eenProgress | Multiple lines of text | No | — | Progress | PDF P3 |
| 36 | Pay Feedback | eenPay | Multiple lines of text | No | — | Pay | PDF P3 |
| 37 | New Job Found | eenNewJob | Choice | No | ⚠️ Pending HR (Q: EEN-05) | NewJob | PDF P4 |
| 38 | Actual LWD | eenActualLWD | Date and time | No | — | ActualLWD | PDF P6 |
| 39 | Notify IT By | eenSentBy | Person or Group | No | — | SentBy | PDF P6 |
| 40 | Notify IT Date | eenSentDate | Date and time | No | — | SentDate | PDF P6 |
| 41 | Company Properties | eenCompanyProperties | Choice | No | ⚠️ Pending HR | CompanyProperties | PDF P6 |
| 42 | Return Reason | eenReason | Multiple lines of text | No | — | Reason | PDF P6 |
| 43 | Return Remarks | eenRemarks2 | Multiple lines of text | No | — | Remarks2 | PDF P6 |
| 44 | Return Performed By | eenPerformedBy2 | Person or Group | No | — | PerformedBy2 | PDF P6 |
| 45 | Return Performed Date | eenPerformedDate2 | Date and time | No | — | PerformedDate2 | PDF P6 |
| 46 | Return Attachment | eenAttachment | Attachment | No | — | Attachment | PDF P6 |
| 47 | Withdraw Status | eenWDStatus | Choice | No | ⚠️ Pending HR (Q: EEN-05) | WDStatus | PDF P7 |
| 48 | Withdraw Reason | eenWDReason | Multiple lines of text | No | — | WDReason | PDF P7 |
| 49 | Withdraw By | eenWDBy | Person or Group | No | — | WDBy | PDF P7 |
| 50 | Withdraw Date | eenWDDate | Date and time | No | — | WDDate | PDF P7 |
| 51 | Current Status | eenCurrentAction | Choice | System | Submitted;EDApproved;EDRejected;Extended;NotifiedHR;Withdrawn | CA | DXL |

---

## LIST 2: MainDB_HR_Ext_BSD (Child — Backup Staff)

**Purpose**: BSD Backup Staff entries (Name, Position, Responsibility per row)
**Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | — | Staff name | — |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID | — | — |
| 3 | Backup Staff Name | bsdBackupName | Person or Group | Yes | — | PIC_N | PDF P1-2 |
| 4 | Backup Position | bsdBackupPosition | Single line of text | Yes | — | Position_N | PDF P1-2 |
| 5 | Backup Responsibility | bsdBackupResponsibility | Multiple lines of text | Inferred | — | Responsibility_N | PDF P1-2 |
| 6 | Row Number | bsdRowNumber | Number | System | — | — | — |

---

## LIST 3: MainDB_HR_Ext_AWHR (Child — Working Hours)

**Purpose**: AWHR Working Hours rows (15 max per submission)
**Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | — | Employee name | — |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID | — | — |
| 3 | Employee No | awhrEmpNo | Single line of text | Yes | — | EmpNo_N | PDF P1-2 |
| 4 | Full Name | awhrFullName | Person or Group | Yes | — | Name_N | PDF P1-2 |
| 5 | Exceeded Category | awhrExceededCategory | Choice | Inferred | E1;E2;E3;E4 | C_N | PDF P1-2 |
| 6 | Date From | awhrDateFrom | Date and time | Yes | — | DateW_N_1 | PDF P1-2 |
| 7 | Date To | awhrDateTo | Date and time | Yes | — | DateW_N | PDF P1-2 |
| 8 | Day Type | awhrDayType | Choice | Inferred | ⚠️ Pending HR (Q: AWHR-07) | D_N | PDF P1-2 |
| 9 | Shift Code | awhrShiftCode | Lookup | Inferred | MainDB_HR_Config_ShiftCodes:Title | SC_N | PDF P1-2 |
| 10 | Add Hours | awhrAddHours | Number | No | — | AddHrs_N | PDF P1-2 |
| 11 | Total Hours | awhrTotalHours | Number | Yes | — | TtlHrs_N | PDF P1-2 |
| 12 | Row Number | awhrRowNumber | Number | System | — | — | — |

---

## LIST 4: MainDB_HR_Ext_CWR_Periods (Child — Period Ranges)

**Purpose**: CWR Period Required date ranges (3 perm + 3 shutdown)
**Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | — | Period label | — |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID | — | — |
| 3 | Section Type | cwrSection | Choice | Yes | Permanent;Plant Shutdown | — | PDF P1-2 |
| 4 | Period From | cwrPeriodFrom | Date and time | Yes | — | tPeriod_N | PDF P1-2 |
| 5 | Period To | cwrPeriodTo | Date and time | Yes | — | fPeriod_N | PDF P1-2 |
| 6 | Total Days | cwrTotalDays | Number | Yes | — | TotalDays_N | PDF P1-2 |
| 7 | Row Number | cwrRowNumber | Number | System | — | — | — |

---

## LIST 5: MainDB_HR_WorkflowHistory (Workflow History)

**Purpose**: Multi-stage approval audit trail for BSD, AWHR, CWR, DRD, EEN
**Parent**: MainDB_HR | **Key**: ParentID → MainDB_HR:ID

| # | Column Display Name | Internal Name | SP Type | Required | Choices | Source |
|---|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | Auto-generated | — |
| 2 | Parent ID | ParentID | Lookup | Yes | MainDB_HR:ID | — |
| 3 | Form Code | wfFormCode | Choice | Yes | BSD;AWHR;CWR;DRD;EEN | — |
| 4 | Stage | wfStage | Single line of text | Yes | — | — |
| 5 | Action | wfAction | Choice | Yes | Approved;Rejected;Submitted;Acknowledged;Denied;Withdrawn;Extended | DXL |
| 6 | Performed By | wfPerformedBy | Person or Group | Yes | @Me | DXL |
| 7 | Performed Date | wfPerformedDate | Date and time | Yes | @Now | DXL |
| 8 | Comments | wfComments | Multiple lines of text | No | — | — |
| 9 | Previous State | wfPreviousState | Single line of text | System | — | — |
| 10 | New State | wfNewState | Single line of text | System | — | — |

---

## LIST 6: MainDB_HR_Config_ShiftCodes (Lookup — Shift Codes)

**Purpose**: DRD shift code reference data (10 codes)
**Type**: Configuration

| # | Column Display Name | Internal Name | SP Type | Required | Source |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | Shift code (OFC, OFO, N1, A1, A2, B1, C1, 7A1, 7A2, 7P1) |
| 2 | Hours | scHours | Single line of text | Yes | e.g. "08:30-17:45" |
| 3 | Description | scDescription | Single line of text | No | e.g. "Office" |

**Seed Data (10 rows)**:

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

---

## LIST 7: MainDB_HR_Config_Companies (Lookup — Companies)

**Purpose**: Shared company list for HR forms
**Type**: Configuration

| # | Column Display Name | Internal Name | SP Type | Required | Source |
|---|---|---|---|---|---|
| 1 | Title | Title | Single line of text | Yes | Company code (YKS, YTC, NAGA) |
| 2 | Full Name | ccFullName | Single line of text | No | Full company name |

**Seed Data (3 rows)**:

| Title | Full Name |
|---|---|
| YKS | ⚠️ Pending HR |
| YTC | ⚠️ Pending HR |
| NAGA | ⚠️ Pending HR |

---

## Schema Summary

| Metric | Count |
|---|---|
| **Total Lists** | **7** |
| Parent Lists | 1 (MainDB_HR) |
| Child Lists | 3 (Ext_BSD, Ext_AWHR, Ext_CWR_Periods) |
| Workflow History Lists | 1 (WorkflowHistory) |
| Configuration Lists | 2 (ShiftCodes, Companies) |
| **Total Columns** | **~250** |
| MainDB_HR columns | ~200 (across 6 forms) |
| Child list columns | 23 (5+11+6+1 system each) |
| Workflow columns | 10 |
| Config columns | 5 |

## Columns Pending HR Confirmation

| Count | Forms |
|---|---|
| **~25** | Choice values, AWHR mandatory fields, AWHR HR stage |

### Pending by Form

| Form | Pending Columns | Question IDs |
|---|---|---|
| CIR | 1 (Site choices) | CIR-01 |
| BSD | 4 (Division, Dept, Section, Revision) | BSD-03, BSD-04 |
| AWHR | 7 (EmpCategory, DayType, HR fields, mandatory) | AWHR-01-07 |
| CWR | 3 (Type, PermCategory, Status) | CWR-04 |
| DRD | 1 (Amend) | DRD-02 |
| EEN | 6 (Main, Category, Type, ContractStatus, NewJob, WDStatus) | EEN-05 |

## Duplicate / Conflict Warnings

| Warning | Detail |
|---|---|
| `drdDepartment` vs `awhrDepartment` | Both have `Department` field on MainDB_HR — different internal names (drd/awhr prefix), no conflict |
| `drdSection` vs `awhrSection` vs `bsdSection` | Same — different prefixes, no conflict |
| `drdHOD` vs `bsdHOD` vs `awhrHOD` vs `eenHOD` | HOD field on 4 forms — different prefixes, no conflict but could be standardized if same person |
| `drdHOS` vs `awhrHOS` | HOS field on 2 forms — different prefixes, no conflict |

## Standardization Candidates

| Shared Field | Forms | Recommend Standard Column? |
|---|---|---|
| HOD (Head of Department) | BSD, AWHR, CWR, DRD, EEN | Consider `hrHOD` shared column — but each form has different context (approver vs superior) |
| HOS (Head of Section) | AWHR, DRD | Consider `hrHOS` shared column |
| Department | BSD, AWHR, DRD | Consider `hrDepartment` shared column |
| Section | BSD, AWHR, DRD | Consider `hrSection` shared column |
| Company | AWHR, DRD | Already shared via Config_Companies lookup |

**Decision**: Keep per-form columns for now (form-specific context). Standardize in refactoring phase if needed.

---

*Schema export complete. Ready for Excel generation and SharePoint list provisioning.*
