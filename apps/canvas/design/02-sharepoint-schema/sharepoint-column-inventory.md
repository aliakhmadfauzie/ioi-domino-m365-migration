# SharePoint Column Inventory

> Confirmed SP column names organized by list.
> Primary source: `main-dbhr-service.ts` LOWER_TO_SHAREPOINT map + generated model @displayName annotations.
> All Canvas Patch and Filter formulas must use SP REST column names from this file.
> Last updated: 2026-06-02

---

## Confirmation Status Labels
- `CONFIRMED_SERVICE` — confirmed from service wrapper LOWER_TO_SHAREPOINT map (most reliable)
- `CONFIRMED_MODEL` — confirmed from @displayName annotation in generated model file
- `MISSING_INFO` — not yet confirmed from either source

---

## Canonical Header Columns (Present in all or most MainDB_ lists)

> These columns appear across multiple lists. Exact SP name may vary per list — verify each.

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Read | Canvas Patch Write | Confirmed For | Status |
|---|---|---|---|---|---|---|
| `Title` | Title | Single line text | `record.Title` | `Title: autoTitle` | All lists | CONFIRMED_SERVICE |
| `FormCode` | Form Code | Single line text | `record.FormCode` | `FormCode: gblActiveFormCode` | MainDB_HR, MainDB_FIN | CONFIRMED_SERVICE |
| `formcode` | FormCode (IT) | Single line text | `record.formcode` | `formcode: gblActiveFormCode` | MainDB_IT | CONFIRMED_MODEL |
| `Status` | Status | Choice (label text) | `record.Status.Value` | `Status: {Value: "Draft"}` | MainDB_HR, MainDB_FIN | CONFIRMED_SERVICE |
| `currentStatus` | CurrentStatus | Single line text (plain) | `record.currentStatus` | `currentStatus: "Pending HOD"` | MainDB_IT | CONFIRMED_MODEL |
| `CurrentStatus` | CurrentStatus | Single line text | `record.CurrentStatus` | `CurrentStatus: "Draft"` | MainDB_HR (mirror of Status) | CONFIRMED_SERVICE |
| `CurrentAction` | Workflow Action / CurrentAction | Single line text | `record.CurrentAction` | `CurrentAction: "Submitted"` | MainDB_HR | CONFIRMED_SERVICE |
| `currentAction` | Current Action | Single line text | `record.currentAction` | `currentAction: "Submitted"` | MainDB_IT | CONFIRMED_MODEL |
| `CurrentStage` | CurrentStage | Single line text | `record.CurrentStage` | `CurrentStage: "HOD Review"` | MainDB_HR | CONFIRMED_SERVICE |
| `currentstage` | CurrentStage (HR model) | Single line text | See CurrentStage | — | MainDB_HR (alias) | CONFIRMED_SERVICE |
| `CurrentApprover_Email` | CurrentApprover_Email | Single line text | `record.CurrentApprover_Email` | `CurrentApprover_Email: email` | MainDB_HR | CONFIRMED_SERVICE |
| `CurrentApprover_DisplayName` | CurrentApprover_DisplayName | Single line text | `record.CurrentApprover_DisplayName` | `CurrentApprover_DisplayName: name` | MainDB_HR | CONFIRMED_SERVICE |
| `CurrentApproverGroup` | CurrentApproverGroup | Single line text | `record.CurrentApproverGroup` | `CurrentApproverGroup: "HOD-HR"` | MainDB_HR | CONFIRMED_SERVICE |
| `EntitySite` | EntitySite / Site | Choice | `record.EntitySite.Value` | `EntitySite: {Value: "Prai"}` | MainDB_HR | CONFIRMED_SERVICE |
| `siteKey` | Site | Choice | `record.siteKey.Value` | `siteKey: {Value: "Prai"}` | MainDB_IT | CONFIRMED_MODEL |
| `Requestor_Email` | Requestor_Email | Single line text | `record.Requestor_Email` | `Requestor_Email: gblCurrentUser.UserPrincipalName` | MainDB_HR | CONFIRMED_SERVICE |
| `Requestor_DisplayName` | Requestor_DisplayName | Single line text | `record.Requestor_DisplayName` | `Requestor_DisplayName: gblCurrentUser.DisplayName` | MainDB_HR | CONFIRMED_SERVICE |
| `requestoremail` | Requestor_Email (IT) | Single line text | `record.requestoremail` | `requestoremail: gblCurrentUser.UserPrincipalName` | MainDB_IT | CONFIRMED_MODEL |
| `SubmittedOn` | SubmittedOn | Single line text (ISO) | `DateValue(record.SubmittedOn)` | `SubmittedOn: Text(Now(), DateTimeFormat.UTC)` | MainDB_HR, MainDB_FIN | CONFIRMED_SERVICE |
| `submitteddate` | SubmittedDate | Single line text (ISO) | `DateValue(record.submitteddate)` | `submitteddate: Text(Now(), DateTimeFormat.UTC)` | MainDB_IT | CONFIRMED_MODEL |
| `ApproverRemarks` | ApproverRemarks | Multi-line text | `record.ApproverRemarks` | `ApproverRemarks: txtComment.Text` | MainDB_HR | CONFIRMED_SERVICE |
| `FinalStatus` | FinalStatus | Single line text | `record.FinalStatus` | `FinalStatus: "Locked"` | MainDB_HR, MainDB_FIN | CONFIRMED_SERVICE |
| `workflowstage` | WorkflowStage | Number | `record.workflowstage` | `workflowstage: num` | MainDB_IT | CONFIRMED_MODEL |

---

## MainDB_HR Specific Columns

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|---|
| `EmployeeID` | Employee ID | Single line text | `EmployeeID: empID` | CONFIRMED_SERVICE |
| `EmployeeName` | Employee Name | Single line text | `EmployeeName: empName` | CONFIRMED_SERVICE |
| `Department` | Department | Single line text (plain text) | `Department: "HR"` | CONFIRMED_SERVICE |
| `Dept` | Dept | Single line text | `Dept: "HR"` | CONFIRMED_SERVICE |
| `Division` | Division | Single line text | `Division: divValue` | CONFIRMED_SERVICE (note: mapped as 'Divison' typo in SP — use `Divison`) |
| `Divison` | Divison (SP typo) | Single line text | `Divison: divValue` | CONFIRMED_SERVICE — NOTE: SP column has typo 'Divison' not 'Division' |
| `Section` | Section | Single line text | `Section: sectionValue` | CONFIRMED_SERVICE |
| `HOD_x002e_Email` | HOD.Email | Single line text | MISSING_INFO — Canvas accessor for URL-encoded period | MISSING_INFO |
| `Remarks` | Remarks | Multi-line text | `Remarks: txtRemarks.Text` | CONFIRMED_SERVICE |
| `RequestedBy` | RequestedBy | Single line text | `RequestedBy: gblCurrentUser.UserPrincipalName` | CONFIRMED_SERVICE |
| `RequestTitle` | RequestTitle | Single line text | `RequestTitle: txtTitle.Text` | CONFIRMED_SERVICE |
| `DocumentNo` | DocumentNo | Single line text | `DocumentNo: docNo` | CONFIRMED_SERVICE |
| `FormCode` | Form Code | Single line text | `FormCode: gblActiveFormCode` | CONFIRMED_SERVICE |

---

## MainDB_FIN Specific Columns

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|---|
| `Department` | Department | Choice (key codes) | `Department: {Value: "DepartmentKey03"}` | CONFIRMED_MODEL |
| `Company` | Company | Choice (key codes) | `Company: {Value: "CompanyKey0"}` | CONFIRMED_MODEL |
| `Amount` | Amount | Number | `Amount: Value(txt.Text)` | CONFIRMED_MODEL |
| `ContractAmount` | ContractAmount | Number | `ContractAmount: Value(txt.Text)` | CONFIRMED_MODEL |
| `Description` | Description | Single line text | `Description: txt.Text` | CONFIRMED_MODEL |
| `DocumentNo` | DocumentNo | Single line text | `DocumentNo: txt.Text` | CONFIRMED_MODEL |
| `RevisionNo` | RevisionNo | Single line text | `RevisionNo: txt.Text` | CONFIRMED_MODEL |
| `IRR_Percent` | IRR_Percent | Single line text | `IRR_Percent: txt.Text` | CONFIRMED_MODEL |
| `PaybackPeriod` | PaybackPeriod | Single line text | `PaybackPeriod: txt.Text` | CONFIRMED_MODEL |
| `RequiresCOOApproval` | RequiresCOOApproval | Single line text | `RequiresCOOApproval: "Yes"` | CONFIRMED_MODEL |
| `RecipientHODEmail` | RecipientHODEmail | Single line text | `RecipientHODEmail: hodEmail` | CONFIRMED_MODEL |
| `RequestTitle` | RequestTitle | Single line text | `RequestTitle: txt.Text` | CONFIRMED_MODEL |

---

## MainDB_IT Specific Columns (Form-Code-Prefixed)

### Hardware Inventory (HI_ prefix)
| SP REST Column Name | Canvas Read/Write | Status |
|---|---|---|
| `hITagNo` | `record.hITagNo` / `hITagNo: txt.Text` | CONFIRMED_MODEL |
| `hIAssetNo` | `record.hIAssetNo` | CONFIRMED_MODEL |
| `hIType` | `record.hIType` | CONFIRMED_MODEL |
| `hIComputerName` | `record.hIComputerName` | CONFIRMED_MODEL |
| `hIUsedByEmail` | `record.hIUsedByEmail` | CONFIRMED_MODEL |
| `hIStatus` | `record.hIStatus` | CONFIRMED_MODEL |
| `hIPurchaseDate` | `record.hIPurchaseDate` | CONFIRMED_MODEL |

### Share Folder Access (SFAR_ prefix)
| SP REST Column Name | Canvas Read/Write | Status |
|---|---|---|
| `sFARCompany` | `record.sFARCompany` | CONFIRMED_MODEL |
| `sFARDepartment` | `record.sFARDepartment` | CONFIRMED_MODEL |
| `sFARFolderType` | `record.sFARFolderType` | CONFIRMED_MODEL |
| `sFARHODEmail` | `record.sFARHODEmail` | CONFIRMED_MODEL |
| `sFARReviewedBy` | `record.sFARReviewedBy` | CONFIRMED_MODEL |

### Reset Password (RS_ prefix)
| SP REST Column Name | Canvas Read/Write | Status |
|---|---|---|
| `rSUserName` | `record.rSUserName` | CONFIRMED_MODEL |
| `rSDesignation` | `record.rSDesignation` | CONFIRMED_MODEL |
| `rSReasonForReset` | `record.rSReasonForReset` | CONFIRMED_MODEL |
| `rSNeedsEDApproval` | `record.rSNeedsEDApproval` | CONFIRMED_MODEL |

---

## ApprovalHistory_HR Columns

| SP REST Column Name (PascalCase) | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|
| `Title` | Single line text | `Title: formCode & "-HIST-" & Text(Now(), "yyyymmdd")` | CONFIRMED_MODEL |
| `HistoryID` | Single line text | `HistoryID: ""` | CONFIRMED_MODEL |
| `RecordID` | Single line text | `RecordID: Text(gblActiveRecordID)` | CONFIRMED_MODEL |
| `ParentID` | Number | `ParentID: gblActiveRecordID` | CONFIRMED_MODEL |
| `AppName` | Single line text | `AppName: gblActiveFormCode` | CONFIRMED_MODEL |
| `EntitySite` | Choice | `EntitySite: {Value: gblActiveSite}` | CONFIRMED_MODEL |
| `FromState` | Single line text | `FromState: locPreviousStatus` | CONFIRMED_MODEL |
| `ToState` | Single line text | `ToState: locNewStatus` | CONFIRMED_MODEL |
| `ActionCode` | Single line text | `ActionCode: "Approved"` | CONFIRMED_MODEL |
| `ActionComment` | Single line text | `ActionComment: txtComment.Text` | CONFIRMED_MODEL |
| `ActionByEmail` | Single line text | `ActionByEmail: gblCurrentUser.UserPrincipalName` | CONFIRMED_MODEL |
| `ActionByName` | Single line text | `ActionByName: gblCurrentUser.DisplayName` | CONFIRMED_MODEL |
| `ActionOn` | Single line text (ISO) | `ActionOn: Text(Now(), DateTimeFormat.UTC)` | CONFIRMED_MODEL |

---

## Config_GlobalUserRoleAssignments Columns

| SP REST Column Name | SP Field Type | Canvas Read | Status |
|---|---|---|---|
| `UserPrincipalName` | Single line text | `record.UserPrincipalName` | CONFIRMED_MODEL |
| `RoleKey` | Single line text | `record.RoleKey` | CONFIRMED_MODEL — values MISSING_INFO |
| `AssignmentScope` | Choice | `record.AssignmentScope.Value` | CONFIRMED_MODEL |
| `IsActiveAssignment` | Boolean (Yes/No) | `record.IsActiveAssignment` | CONFIRMED_MODEL |
| `DepartmentCodeScope` | Single line text | `record.DepartmentCodeScope` | CONFIRMED_MODEL |
| `ModuleKeyScope` | Single line text | `record.ModuleKeyScope` | CONFIRMED_MODEL |
| `Display_Name` | Single line text | `record.Display_Name` | CONFIRMED_MODEL |

---

## MainDB_IT_Ext_Access Columns (EAF, NIR, RS, SFAR, UR)

> Source: `design/m365-design/sharepoint-list-design.md`, `main-dbit-ext-access-model.ts`

### Canonical Extension Columns

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Read/Write | Status |
|---|---|---|---|---|
| `ParentRecordID` | ParentRecordID | Lookup → MainDB_IT | Read: `record.ParentRecordID.Value` / Write: `ParentRecordID: {Id: gblActiveRecordID}` | CONFIRMED_MODEL |
| `ParentFormCode` | ParentFormCode | Choice | `record.ParentFormCode.Value` / `ParentFormCode: {Value: "EAF"}` | CONFIRMED_MODEL |

### EAF-Specific Columns

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|---|
| `EAF_status1` | HOD Status | Choice (Approved/Rejected/Pending) | `EAF_status1: {Value: "Approved"}` | CONFIRMED_MODEL |
| `EAF_status2` | Director Status | Choice | `EAF_status2: {Value: "Approved"}` | CONFIRMED_MODEL |
| `EAF_status3` | IT Manager Status | Choice | `EAF_status3: {Value: "Approved"}` | CONFIRMED_MODEL |
| `EAF_status4` | IT Provisioning Status | Choice (Completed/Rejected/Pending) | `EAF_status4: {Value: "Completed"}` | CONFIRMED_MODEL |
| `EAF_date2` | HOD Approved Date | DateTime | `EAF_date2: Now()` | CONFIRMED_MODEL |
| `EAF_date3` | Director Approved Date | DateTime | `EAF_date3: Now()` | CONFIRMED_MODEL |
| `EAF_date4` | IT Manager Approved Date | DateTime | `EAF_date4: Now()` | CONFIRMED_MODEL |
| `EAF_date5` | IT Completion Date | DateTime | `EAF_date5: Now()` | CONFIRMED_MODEL |
| `EAF_comment1` | HOD Remarks | Multiple lines | `EAF_comment1: txt.Text` | CONFIRMED_MODEL |
| `EAF_comment2` | Director Remarks | Multiple lines | `EAF_comment2: txt.Text` | CONFIRMED_MODEL |
| `EAF_comment3` | IT Manager Remarks | Multiple lines | `EAF_comment3: txt.Text` | CONFIRMED_MODEL |
| `EAF_comment4` | IT Remarks | Multiple lines | `EAF_comment4: txt.Text` | CONFIRMED_MODEL |
| `EAF_HODNAME` | HOD Approved By | Single line text | `EAF_HODNAME: gblCurrentUser.DisplayName` | CONFIRMED_MODEL |
| `EAF_DIVNAME` | Director Approved By | Single line text | `EAF_DIVNAME: gblCurrentUser.DisplayName` | CONFIRMED_MODEL |
| `EAF_isPCN` | Is PCN | Yes/No | `EAF_isPCN: true` | CONFIRMED_MODEL |

### NIR-Specific Columns

| SP REST Column Name | SP Display Name | SP Field Type | Status |
|---|---|---|---|
| `NIR_fullName` | Full Name | Single line text | CONFIRMED_MODEL |
| `NIR_department` | Department | Single line text | CONFIRMED_MODEL |
| `NIR_requestType` | Request Type | Choice | CONFIRMED_MODEL |
| `NIR_HODApprovalStatus` | HOD Approval Status | Choice | CONFIRMED_MODEL |
| `NIR_NotesAdminStatus` | Notes Admin Status | Choice | CONFIRMED_MODEL |
| `NIR_ITHardwareStatus` | IT Hardware Status | Choice | CONFIRMED_MODEL |

### SFAR-Specific Columns

| SP REST Column Name | SP Display Name | SP Field Type | Status |
|---|---|---|---|
| `SFAR_folderType` | Folder Type | Choice | CONFIRMED_MODEL |
| `SFAR_server` | Server | Choice | CONFIRMED_MODEL |
| `SFAR_accessType` | Access Type | Choice (Read/Write/Full Control) | CONFIRMED_MODEL |
| `SFAR_folderOwnerEmail` | Folder Owner | Single line text (email) | CONFIRMED_MODEL |
| `SFAR_ITPICStatus` | IT PIC Status | Choice | CONFIRMED_MODEL |
| `SFAR_ITVerifierStatus` | IT Verifier Status | Choice | CONFIRMED_MODEL |
| `SFAR_OwnerStatus` | Owner Approval Status | Choice | CONFIRMED_MODEL |
| `SFAR_HODStatus` | HOD Status | Choice | CONFIRMED_MODEL |
| `SFAR_ITActionStatus` | IT Action Status | Choice | CONFIRMED_MODEL |

---

## MainDB_IT_Ext_Assets Columns (HI, ITSC)

> Source: `design/m365-design/sharepoint-list-design.md`, provisioning script `Provision-HI-ExtAssets.ps1`
> Provisioned: 2026-06-03 — 20 columns created, 72 existing retained

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|---|
| `ParentID` | ParentID | Lookup → MainDB_IT | `ParentID: {Id: gblActiveRecordID}` | CONFIRMED_MODEL |
| `ParentFormCode` | ParentFormCode | Single line text | `ParentFormCode: "HI"` | CONFIRMED_MODEL |
| `HI_TagNo` | Tag No | Single line text | `HI_TagNo: txt.Text` | CONFIRMED_MODEL |
| `HI_AssetNo` | Asset No | Single line text | `HI_AssetNo: txt.Text` | CONFIRMED_MODEL |
| `HI_Type` | Type | Single line text | `HI_Type: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_ComputerName` | Computer Name | Single line text | `HI_ComputerName: txt.Text` | CONFIRMED_MODEL |
| `HI_Company` | Company | Single line text | `HI_Company: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_UsedBy_Email` | Used By | Single line text | `HI_UsedBy_Email: email` | CONFIRMED_MODEL |
| `HI_Location` | Location | Single line text | `HI_Location: txt.Text` | CONFIRMED_MODEL |
| `HI_Department` | Department | Single line text | `HI_Department: txt.Text` | CONFIRMED_MODEL |
| `HI_Site` | Site | Single line text | `HI_Site: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_SerialNo` | Serial No | Single line text | `HI_SerialNo: txt.Text` | CONFIRMED_MODEL |
| `HI_Status` | Status | Single line text | `HI_Status: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_CPU` | CPU | Single line text | `HI_CPU: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_RAM` | RAM | Single line text | `HI_RAM: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_HDDSize` | HDD Size | Single line text | `HI_HDDSize: txt.Text` | CONFIRMED_MODEL |
| `HI_HDDType` | HDD Type | Single line text | `HI_HDDType: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_OSVersion` | OS Version | Single line text | `HI_OSVersion: dd.Selected.Value` | CONFIRMED_MODEL |
| `HI_IPAddress` | IP Address | Single line text | `HI_IPAddress: txt.Text` | CONFIRMED_MODEL |
| `HI_MACAddress` | MAC Address | Single line text | `HI_MACAddress: txt.Text` | CONFIRMED_MODEL |
| `HI_Vendor` | Vendor | Single line text | `HI_Vendor: txt.Text` | CONFIRMED_MODEL |
| `HI_PONumber` | PO Number | Single line text | `HI_PONumber: txt.Text` | CONFIRMED_MODEL |
| `HI_PurchaseDate_dt` | Purchase Date | DateTime | `HI_PurchaseDate_dt: dp.SelectedDate` | CONFIRMED_MODEL |
| `HI_PurchasePrice` | Purchase Price (RM) | Number | `HI_PurchasePrice: Value(txt.Text)` | CONFIRMED_MODEL |
| `HI_WarrantyExpiry_dt` | Warranty Expiry | DateTime | `HI_WarrantyExpiry_dt: dp.SelectedDate` | CONFIRMED_MODEL |
| `HI_Specifications` | Specifications | Multiple lines | `HI_Specifications: txt.Text` | CONFIRMED_MODEL |

---

## MainDB_IT_Ext_Support Columns (ITSSR, PRF)

| SP REST Column Name | SP Display Name | SP Field Type | Canvas Patch Write | Status |
|---|---|---|---|---|
| `ParentRecordID` | ParentRecordID | Lookup → MainDB_IT | `ParentRecordID: {Id: gblActiveRecordID}` | CONFIRMED_MODEL |
| `ParentFormCode` | ParentFormCode | Choice (ITSSR/PRF/IAL/ITDR) | `ParentFormCode: {Value: "ITSSR"}` | CONFIRMED_MODEL |
| `CaseNo` | Case No | Single line text | Auto-generated | CONFIRMED_MODEL |
| `Category` | Category | Choice | `Category: {Value: "Hardware"}` | CONFIRMED_MODEL |
| `SubCategory` | Sub Category | Choice | `SubCategory: {Value: "Printer"}` | CONFIRMED_MODEL |
| `ReportedBy` | Reported By | Person/Group | `ReportedBy: {Claims: "i:0#.f|membership|" & email}` | CONFIRMED_MODEL |
| `CreationDate` | Creation Date | DateTime | `CreationDate: Now()` | CONFIRMED_MODEL |
| `INONumber` | INO Number | Single line text | Auto-generated via Power Automate | CONFIRMED_MODEL |
| `ServiceType` | Service Type | Choice | `ServiceType: {Value: "Support"}` | CONFIRMED_MODEL |
| `Priority` | Priority | Choice (Low/Normal/High/Critical) | `Priority: {Value: "Normal"}` | CONFIRMED_MODEL |
| `AssignedPIC` | Assigned PIC | Person/Group | `AssignedPIC: {Claims: claims}` | CONFIRMED_MODEL |
| `PIC_Email` | PIC Email | Single line text | `PIC_Email: email` | CONFIRMED_MODEL |
| `SLA_Hours` | SLA Hours | Number | `SLA_Hours: 4` | CONFIRMED_MODEL |
| `ResolvedAt` | Resolved At | DateTime | `ResolvedAt: Now()` | CONFIRMED_MODEL |

---

## MainDB_IT_Ext_SAP Columns (SAPAMR, SAPCA, SAPCR, SAPTR, SAPSLCF)

| SP REST Column Name | SP Display Name | SP Field Type | Status |
|---|---|---|---|
| `ParentRecordID` | ParentRecordID | Lookup → MainDB_IT | CONFIRMED_MODEL |
| `ParentFormCode` | ParentFormCode | Choice | CONFIRMED_MODEL |
| `SAPCR_TicketNo` | Ticket No | Single line text | CONFIRMED_MODEL |
| `SAPCR_System` | System | Choice (SAP/WB) | CONFIRMED_MODEL |
| `SAPCR_Priority` | Priority | Choice | CONFIRMED_MODEL |
| `SAPCR_BPOApprovedBy` | BPO Approved By | Single line text | CONFIRMED_MODEL |
| `SAPCR_PMApprovedBy` | PM Approved By | Single line text | CONFIRMED_MODEL |
| `SAPTR_TRNumber` | TR Number | Single line text | CONFIRMED_MODEL |
| `SAPTR_Module` | Module | Choice | CONFIRMED_MODEL |
| `SAPAMR_TBVEmail` | To Be Verified By | Single line text | CONFIRMED_MODEL |
| `SAPAMR_TBAEmail` | To Be Approved By | Single line text | CONFIRMED_MODEL |
