# SharePoint List Schema Reference

**Generated:** 2026-05-31  
**Source:** PnP PowerShell schema export  
**Instructions:** Run the Phase 0 PowerShell script to populate this file with actual SharePoint column schemas. See `docs/refactoring-plan.md#step-01--export-all-sharepoint-list-schemas`.

---

## How to Populate

For each list in the tables below, run:

```powershell
Connect-PnPOnline -Url "https://ioioi.sharepoint.com/sites/ioi-portal-it" -Interactive
Get-PnPField -List "MainDB_IT" | Select-Object Title, InternalName, TypeAsString, Required |
  ConvertTo-Json | Out-File "source/sharepoint-schemas/ioi-portal-it/MainDB_IT.json"
```

Then replace the "TBD" placeholders below with the actual field data.

---

## IT Portal — `ioi-portal-it`

### MainDB_IT

**Form-specific prefix columns** (wide-column pattern — all on MainDB_IT):

| Prefix | Forms Using | Example Columns | Count |
|--------|-------------|-----------------|-------|
| `NIR_*` | NIR | NIR_FullName, NIR_Department, NIR_RequestType | ~15 |
| `HI_*` | HI | HI_TagNo, HI_AssetNo, HI_ComputerName, HI_PurchasePrice | ~17 |
| `PRF_*` | PRF | PRF_RequestNo, PRF_RequestType, PRF_Priority | ~18 |
| `RS_*` | RS | RS_UserName, RS_Company, RS_ResetType | ~18 |
| `SFAR_*` | SFAR | SFAR_Company, SFAR_FolderType, SFAR_ServerName | ~14 |
| `UR_*` | UR | UR_RequestType, UR_EmployeeNumber, UR_Company | ~13 |
| `SAPAMR_*` | SAPAMR | SAPAMR_TBVEmail, SAPAMR_TBAEmail | ~7 |

### MainDB_IT_Ext_Access

**Key columns:** ParentFormCode, ParentRecord (lookup to MainDB_IT)

**EAF-specific fields:** eAFApplication, eAFTargetUserEmail, eAFSystemName, eAFDeptHeadEmail, eAFDeptHeadStatus, eAFITManagerApprovedBy, eAFITManagerStatus, eAFDDAppApprovedBy, eAFDDAppStatus, eAFJustification, eAFCC, eAFReminderTo, eAFClientID, eAFUserGroup, eAFHigherApproverEmail, eAFITConfigRemarks, eAFITConfigStatus, eAFAttachment, eAFITComment

### MainDB_IT_Ext_Support

**Key columns:** ParentFormCode, ParentRecord (lookup to MainDB_IT)

**ITSSR-specific fields:** ITSSR_CaseNo, ITSSR_ServiceType, ITSSR_ProblemCategory, ITSSR_ProblemDescription, ITSSR_AssignedTo_Email, ITSSR_ReportedBy_Email, ITSSR_DateStarted, ITSSR_DateResolved, ITSSR_DateAccepted, ITSSR_Solution, ITSSR_SatisfactionRating, ITSSR_SupportMethod, ITSSR_Department, ITSSR_Extension, ITSSR_Hardware, ITSSR_Application, ITSSR_Module, ITSSR_CC, ITSSR_ITRemarks, ITSSR_DateNotified, ITSSR_DateClosed, ITSSR_ITName, ITSSR_ServiceType2, ITSSR_Hardware2, ITSSR_SAPModule, ITSSR_BankModule

### MainDB_IT_Ext_SAP / Ext_Assets / Ext_Docs

**Key columns:** ParentFormCode, ParentRecord (lookup to MainDB_IT)

### ApprovalRecords

**Key columns:** FormID, StageName, StageNumber, ActionKey, ActionByName, ActionDate, Comment

### WorkflowAuditLog

**Key columns:** RequestItemID, ActionTaken, ActorName, Timestamp, Details

### Config Lists

| List Name | Purpose |
|-----------|---------|
| ConfigCompanies | Company dropdown options |
| ConfigDepartments | Department dropdown options |
| ConfigApproverMatrix | Approval routing rules |
| ConfigEmployeeDirectory | Employee lookup data |
| ConfigNotesAdminRouting | Notes admin routing rules |

---

## HR Portal — `ioi-portal-hr`

### MainDB_HR

**Choice fields:**

| Field | Options (key → label) |
|-------|-----------------------|
| StatusKey | StatusKey0=Draft, StatusKey1=Submitted, StatusKey2=Under Review, StatusKey3=Approved, StatusKey4=Rejected, StatusKey5=Closed, StatusKey6=Archived |
| SiteKey | SiteKey0=Prai, SiteKey1=Johor |
| CaseStatusKey | CaseStatusKey0=Open, CaseStatusKey1=In Progress, CaseStatusKey2=Closed |
| SystemNameKey | SystemNameKey0=SAP, SystemNameKey1=Lotus Notes, SystemNameKey2=Active Directory |

### HR Extension Lists

| List Name | Forms Using | Key Columns |
|-----------|-------------|-------------|
| MainDB_HR_Ext_Staffing | SR, CWR, FTCR, INTERVIEWDB | ParentRecordID, ParentFormCode, Staffing_Details, Staffing_Status |
| MainDB_HR_Ext_Lifecycle | EEN, EPDU, EPHR, INTERN, PAF | ParentRecordID, ParentFormCode, Lifecycle_AppraisalData, Lifecycle_ExitData |
| MainDB_HR_Ext_Attendance | AWHR, DRD, NDF, LVE, OWP | ParentRecordID, ParentFormCode, Attendance_Date, Attendance_Details |
| MainDB_HR_Ext_ForeignWorker | FWWPD, FWWPE, TNPRA | ParentRecordID, ParentFormCode, FW_WorkerName, FW_PassportNo, FW_WorkPermitNo |
| MainDB_HR_Ext_OrgStructure | ORGCHART, JD | ParentRecordID, ParentFormCode, Org_ChartData, Org_JDData |
| MainDB_HR_Ext_Welfare | GDSN, HEALTHINFO, TMPU, HRINFO | ParentRecordID, ParentFormCode, Welfare_Details, Welfare_Amount |
| MainDB_HR_Ext_Compliance | ESF, HRAPR | ParentRecordID, ParentFormCode, Compliance_Details, Compliance_ExpiryDate |
| MainDB_HR_Ext_Operations | BSD, CIR | ParentRecordID, ParentFormCode, Ops_Details, Ops_Date |

---

## STR Portal — `ioi-portal-str`

### MainDB_STR

| Field | Options (key → label) |
|-------|-----------------------|
| StatusKey | StatusKey0=Draft, StatusKey1=Pending, StatusKey2=Approved, StatusKey3=Rejected, StatusKey4=Completed |
| DepartmentKey | Department list |
| SiteKey | SiteKey0=Prai, SiteKey1=Johor |

### LineItems_STR

**Key columns:** ParentRecordID (lookup to MainDB_STR)

---

## Verifications Needed

1. **Run Phase 0 export** to populate actual column schemas from SharePoint
2. **Verify choice option order** matches key-to-label maps in model files
3. **Check for renamed columns** that may have old internal names remaining
4. **Verify all lookup target lists** exist and are accessible
