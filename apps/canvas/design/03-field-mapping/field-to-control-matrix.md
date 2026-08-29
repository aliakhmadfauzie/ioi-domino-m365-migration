# Field-to-Control Matrix

> Maps form fields to Canvas controls, SP columns, and components.
> Source: MASTER_FIELD_DICTIONARY.md (UI labels only) + confirmed SP column names from 02-sharepoint-schema/
> Last updated: 2026-06-02
>
> IMPORTANT: SP Internal Column names in this file must match `02-sharepoint-schema/sharepoint-column-inventory.md`.
> Do NOT use PDF-extracted field names as SP internal names.

---

## Control Naming Standard

| Control Type | Pattern | Example |
|---|---|---|
| Text input | `txt<FieldName>` | `txtProjectName` |
| Dropdown | `drp<FieldName>` | `drpDepartment` |
| Date picker | `dat<FieldName>` | `datStartDate` |
| Currency input | `cur<FieldName>` | `curBudgetAmt` |
| Number input | `num<FieldName>` | `numQuantity` |
| People picker | `ppl<FieldName>` | `pplHOD` |
| Toggle/Checkbox | `tgl<FieldName>` | `tglIsUrgent` |
| Read-only label | `lbl<FieldName>` | `lblStatus` |
| Component instance | `cmp<Name>` | `cmpStatusBadge1` |

---

## Type-to-Component Mapping Reference

| Field Dictionary Type | Canvas Control | Canvas Component |
|---|---|---|
| Text (single line) | TextInput | cmpTextInputField |
| Multiline Text | TextInput (multiline) | cmpMultilineTextField |
| Number | TextInput (number) | cmpNumberField |
| Currency/Amount | TextInput (number) | cmpCurrencyField |
| Date | DatePicker | cmpDateField |
| Person | Custom people picker | cmpPeoplePicker |
| Choice (single) | Dropdown | cmpChoiceField |
| Choice (multi) | ComboBox | cmpMultiChoiceField |
| Boolean/Yes-No | Toggle | cmpYesNoField |
| Lookup | Dropdown | cmpLookupField |
| Read-only display | Label | cmpReadOnlyField |
| Calculated display | Label | cmpCalculatedFieldDisplay |

---

## Canonical Header Fields (All Forms)

These fields appear on every form's New/Edit screen. They are set automatically — no user input needed.

| Control Name | Component | SP List | SP Column | SP Type | Required | Default Formula | DisplayMode |
|---|---|---|---|---|---|---|---|
| `lblRecordTitle` | cmpReadOnlyField | — | `Title` | Text | Auto | `gblActiveFormCode & "-" & Text(Now(), "yyyyMMdd-HHmmss")` | View |
| `lblFormCode` | cmpReadOnlyField | MainDB_{dept} | `FormCode` | Text | Auto | `gblActiveFormCode` | View |
| `cmpStatusBadge1` | cmpStatusBadge | — | `Status` | Choice | Auto | — | View |
| `lblSite` | cmpReadOnlyField | MainDB_{dept} | `EntitySite` | Choice | Auto | `gblActiveSite` | View |
| `lblSubmitterEmail` | cmpReadOnlyField | MainDB_{dept} | `Requestor_Email` | Text | Auto | `gblCurrentUser.UserPrincipalName` | View |
| `lblSubmittedOn` | cmpReadOnlyField | MainDB_{dept} | `SubmittedOn` | Text (ISO) | Auto | Set on Submit | View |

---

## AWHR — Rest Day & Additional Working Hours (Pilot: confirmed field names)

> Source: `pages/hr/awhr/new.tsx` + `main-dbhr-service.ts` (field names confirmed from service create call)
> Parent list: MainDB_HR | FormCode: AWHR | Child storage: JSON in awhrWorkingHours

### Section: Requisition Details

| UI Label | Control Name | Component | SP Column | SP Type | Required | Default | DisplayMode Formula | Validation |
|---|---|---|---|---|---|---|---|---|
| Company | `txtAwhrCompany` | cmpTextInputField | `awhrCompany` | Text | No | "" | If(gblFormMode="View", View, Edit) | None |
| Category | `txtAwhrCategory` | cmpTextInputField | `awhrCategory` | Text | No | "" | Same | None |
| Section | `txtAwhrSection` | cmpTextInputField | `awhrSection` | Text | No | "" | Same | None |
| Department | `txtAwhrDept` | cmpTextInputField | `awhrDepartment` | Text | No | "" | Same | None |
| HOS (Head of Section) | `pplAwhrHOS` | cmpPeoplePicker | `awhrHOS` | Text (email) | YES | "" | Edit only in New/Edit | !IsBlank(pplAwhrHOS.outSelectedUser.Email) |
| HOD (Head of Dept) | `pplAwhrHOD` | cmpPeoplePicker | `awhrHOD` | Text (email) | YES | "" | Edit only in New/Edit | !IsBlank(pplAwhrHOD.outSelectedUser.Email) |
| CC | `txtAwhrCC` | cmpTextInputField | `awhrCC` | Text (email) | No | "" | Same | None |
| Remarks | `txtAwhrRemarks` | cmpMultilineTextField | `awhrRemarks` | Text | No | "" | Same | None |
| Exceeded Category | `chkAwhrExceeded` | cmpMultiChoiceField | `awhrExceeded` | Text (joined) | No | [] | Same | None |

### Section: Working Hours Rows (Child — stored as JSON)

| UI Label | Control Name | Component | SP Column | SP Type | Notes |
|---|---|---|---|---|---|
| Working Hours Table | `cmpAwhrRows` | cmpRelatedChildItems | `awhrWorkingHours` | Text (JSON string) | propStoragePattern = "JSON". ParseJSON to read. JSON.stringify to write. |

### Section: HOS Approval (Read-only unless current approver)

| UI Label | Control Name | SP Column | Visible Formula | DisplayMode Formula |
|---|---|---|---|---|
| HOS Approved By | `lblAwhrHOSName` | `awhrHOSName` | locRecord.awhrCurrentAction <> "Submitted" | DisplayMode.View |
| HOS Date | `lblAwhrHOSDate` | `awhrHOSDate` | Same | DisplayMode.View |
| HOS Remark | `lblAwhrHOSRemark` | `awhrHOSRemark` | Same | DisplayMode.View |

### Section: HOD Approval (Read-only unless current approver)

| UI Label | Control Name | SP Column | Visible Formula | DisplayMode Formula |
|---|---|---|---|---|
| HOD Approved By | `lblAwhrHODName` | `awhrHODName` | locRecord.awhrCurrentAction = "HOSApproved" Or locRecord.awhrCurrentAction = "HODApproved" Or locRecord.awhrCurrentAction = "Completed" | DisplayMode.View |
| HOD Date | `lblAwhrHODDate` | `awhrHODDate` | Same | DisplayMode.View |
| HOD Remark | `txtAwhrHODRemark` | `awhrHODRemark` | Same | If(fxUserHasRole("HOD", "AWHR") And locRecord.awhrCurrentAction = "HOSApproved", Edit, View) |

---

## CAR — Capital Appropriation Request (Pilot: partially confirmed)

> Source: `analysis/source_analysis/10_master_app_sources/requirements/Johor/FIN/MASTER-002_*_SOURCES.md`
> Parent list: MainDB_FIN | FormCode: CAR | Child storage: None
> **WARNING: All SP column names below are PDF-extracted labels. None are confirmed SP internal names.**
> Do not use in Patch formulas until verified against live MainDB_FIN list.

### Section A: Request Details

| UI Label | Control Name | Component | PDF Field Name | SP Internal Name | Status |
|---|---|---|---|---|---|
| SAP IO No. | `txtSAPIONo` | cmpTextInputField | `SAPIONo` | MISSING_INFO | UNVERIFIED |
| SAP Asset No. | `txtSAPAssNo` | cmpTextInputField | `SAPAssNo` | MISSING_INFO | UNVERIFIED |
| Company | `drpCompany` | cmpChoiceField | `Company` | `Company` (Choice key: CompanyKey0–2) | CONFIRMED_FROM_MODEL |
| Department | `drpDepartment` | cmpChoiceField | `Department` | `Department` (Choice key: DepartmentKey00–19) | CONFIRMED_FROM_MODEL |
| Project Name | `txtProjectName` | cmpTextInputField | `ProjectName` | MISSING_INFO | UNVERIFIED |
| Objective | `txtObjective` | cmpMultilineTextField | `Objective` | MISSING_INFO | UNVERIFIED |
| Start Date | `datStartDate` | cmpDateField | `StartDate` | MISSING_INFO | UNVERIFIED |
| Completion Date | `datCompDate` | cmpDateField | `CompDate` | MISSING_INFO | UNVERIFIED |
| Purpose of Investment | `txtPurpose` | cmpMultilineTextField | `Purpose` | MISSING_INFO | UNVERIFIED |
| Payback Period | `txtPayback` | cmpTextInputField | `Payback` | `PaybackPeriod` | CONFIRMED_FROM_MODEL |
| IRR % | `txtIRR` | cmpTextInputField | `IRR` | `IRR_Percent` | CONFIRMED_FROM_MODEL |
| Amount Budgeted (RM) | `curBudgetAmt` | cmpCurrencyField | `BudgetAmt` | MISSING_INFO (model shows `Amount` or `ContractAmount`) | CONFLICT |
| Budget Number | `txtBudgetNo` | cmpTextInputField | `BudgetNo` | MISSING_INFO | UNVERIFIED |
| Requested By | `pplPreparedby` | cmpPeoplePicker (auto-fill) | `Preparedby` | `Requestor_Email` | CONFLICT — PDF label ≠ model field |
| Reviewer (HOD) | `pplHOD` | cmpPeoplePicker | `HOD` | `RecipientHODEmail` or routing field | CONFLICT |

> **Next step for CAR:** Read MainDB_FIN service file to confirm all SP internal names. Update CONFLICT and UNVERIFIED rows before building this form.

---

## EAF — External Access Form (VPN & Citrix) — 5-Stage Approval

> Source: `mapping/field-mapping.md`, `src/form-schemas/EAF.json`, `docs/central-form-reference.md`
> Parent list: MainDB_IT | Child list: MainDB_IT_Ext_Access | FormCode: EAF
> Approval: YES — 5-stage (HOD → COO/Director → IT Manager → IT Provisioning)

### Section 1: Requestor Details (EAF_S1)

| UI Label | Control Name | Component | SP List | SP Column | SP Type | Required | Default | Visibility | Editability |
|---|---|---|---|---|---|---|---|---|---|
| Company | `drpEAFCompany` | cmpChoiceField | MainDB_IT | `company` | Choice | CONFIRMED | — | Always | Draft only |
| Requestor | `lblEAFRequestor` | cmpReadOnlyField | MainDB_IT | `requestoremail` | Text (email) | Auto | `gblCurrentUser.UserPrincipalName` | Always | View |
| Date Submitted | `lblEAFDateSubmitted` | cmpReadOnlyField | MainDB_IT | `submitteddate` | Text (ISO) | Auto | `Now()` | Always | View |
| Target User | `txtEAFTargetUser` | cmpTextInputField | MainDB_IT | `EAF_TargetUser_Email` | Text | CONFIRMED | — | Always | Draft only |
| Application | `drpEAFApplication` | cmpChoiceField | MainDB_IT | `applicationType` | Choice (VPN/Citrix/Other) | CONFIRMED | — | Always | Draft only |
| System | `drpEAFSystem` | cmpChoiceField | MainDB_IT | `systemName` | Choice | CONFIRMED | — | Always | Draft only |
| Client ID | `txtEAFClientID` | cmpTextInputField | MainDB_IT | `EAF_ClientID` | Text | No | — | Always | Draft only |
| User Group | `txtEAFUserGroup` | cmpTextInputField | MainDB_IT | `EAF_UserGroup` | Text | No | — | Always | Draft only |
| Justification | `txtEAFJustification` | cmpMultilineTextField | MainDB_IT | `EAF_Justification` | Multiline | CONFIRMED | — | Always | Draft only |
| Dept Head | `pplEAFHOD` | cmpPeoplePicker | MainDB_IT | `HODApprover` | Person/Group | CONFIRMED | — | Always | Draft only |
| Higher Approver | `pplEAFHigherApprover` | cmpPeoplePicker | MainDB_IT | `SecondApprover` | Person/Group | Conditional (isPCN) | — | isPCN = true | Draft only |
| CC | `txtEAFCC` | cmpTextInputField | MainDB_IT | `CCRecipients` | Text (multi-email) | No | — | Always | Draft only |

### Section 2–5: Approval Stages (visible per workflow stage)

| UI Label | Control Name | SP List | SP Column | SP Type | Visible When | Editable By |
|---|---|---|---|---|---|---|
| HOD Status | `drpEAFHODStatus` | MainDB_IT_Ext_Access | `EAF_status1` | Choice (Approved/Rejected/Pending) | `currentStatus` = "Pending HOD" | HOD only |
| HOD Name | `lblEAFHODName` | MainDB_IT_Ext_Access | `EAF_HODNAME` | Text | Same | View |
| HOD Date | `lblEAFHODDate` | MainDB_IT_Ext_Access | `EAF_date2` | DateTime | Same | View |
| HOD Comment | `txtEAFHODComment` | MainDB_IT_Ext_Access | `EAF_comment1` | Multiline | Same | HOD only |
| Director Status | `drpEAFDirectorStatus` | MainDB_IT_Ext_Access | `EAF_status2` | Choice | `currentStatus` = "Pending Div Head" | Director/COO only |
| Director Name | `lblEAFDirectorName` | MainDB_IT_Ext_Access | `EAF_DIVNAME` | Text | Same | View |
| Director Date | `lblEAFDirectorDate` | MainDB_IT_Ext_Access | `EAF_date3` | DateTime | Same | View |
| Director Comment | `txtEAFDirectorComment` | MainDB_IT_Ext_Access | `EAF_comment2` | Multiline | Same | Director/COO only |
| IT Manager Status | `drpEAFITMgrStatus` | MainDB_IT_Ext_Access | `EAF_status3` | Choice | `currentStatus` = "Pending IT Manager" | IT Manager only |
| IT Provisioning Status | `drpEAFITProvStatus` | MainDB_IT_Ext_Access | `EAF_status4` | Choice (Completed/Rejected/Pending) | `currentStatus` = "Pending IT" | IT Staff only |

---

## HI — Hardware Inventory — No Approval, Record-Keeping

> Source: `mapping/field-mapping.md`, `src/form-schemas/HI.json`
> Parent list: MainDB_IT | Child list: MainDB_IT_Ext_Assets | FormCode: HI | Approval: **NO**

### Section 1: General Information (HI_S1)

| UI Label | Control Name | Component | SP List | SP Column | SP Type | Required | Default |
|---|---|---|---|---|---|---|---|
| Machine ID / Asset Tag | `txtHITagNo` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_TagNo` | Text | CONFIRMED | — |
| Asset No | `txtHIAssetNo` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_AssetNo` | Text | No | — |
| Status | `drpHIStatus` | cmpChoiceField | MainDB_IT_Ext_Assets | `HI_Status` | Choice | CONFIRMED | "Active" |
| Type | `drpHIType` | cmpChoiceField | MainDB_IT_Ext_Assets | `HI_Type` | Choice | CONFIRMED | — |
| Computer Name | `txtHIComputerName` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_ComputerName` | Text | No | — |
| Serial Number | `txtHISerialNo` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_SerialNo` | Text | No | — |
| Used By | `pplHIUsedBy` | cmpPeoplePicker | MainDB_IT_Ext_Assets | `HI_UsedBy_Email` | Text (email) | No | — |
| Location | `txtHILocation` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_Location` | Text | No | — |
| Department | `txtHIDepartment` | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_Department` | Text | No | — |
| Company | `drpHICompany` | cmpChoiceField | MainDB_IT_Ext_Assets | `HI_Company` | Choice | No | — |
| Site/Building/Floor/Room | `txtHISite` etc. | cmpTextInputField | MainDB_IT_Ext_Assets | `HI_Site`, `HI_Building`, `HI_Floor`, `HI_Room` | Text | No | — |

### Section 2: Hardware Configuration (HI_S2)

| UI Label | Control Name | SP Column | SP Type | Required |
|---|---|---|---|---|
| CPU | `drpHICPU` | `HI_CPU` | Choice | No |
| RAM | `drpHIRAM` | `HI_RAM` | Choice | No |
| HDD Size | `txtHIHDDSize` | `HI_HDDSize` | Text | No |
| HDD Type | `drpHIHDDType` | `HI_HDDType` | Choice | No |
| Monitor Size | `drpHIMonitorSize` | `HI_MonitorSize` | Choice | No |
| IP Address | `txtHIIPAddress` | `HI_IPAddress` | Text | No |
| MAC Address | `txtHIMACAddress` | `HI_MACAddress` | Text | No |
| OS Version | `drpHIOSVersion` | `HI_OSVersion` | Choice | No |

### Section 3: Procurement Details (HI_S3)

| UI Label | Control Name | SP Column | SP Type | Required |
|---|---|---|---|---|
| Vendor | `txtHIVendor` | `HI_Vendor` | Text | No |
| PO Number | `txtHIPONumber` | `HI_PONumber` | Text | No |
| Purchase Date | `datHIPurchaseDate` | `HI_PurchaseDate_dt` | DateTime | No |
| Purchase Price (RM) | `numHIPurchasePrice` | `HI_PurchasePrice` | Number | No |
| Warranty Expiry | `datHIWarrantyExpiry` | `HI_WarrantyExpiry_dt` | DateTime | No |
| Condition | `drpHICondition` | `HI_Condition` | Choice | No |

### Section 4: Software & Accounts (HI_S4)

| UI Label | Control Name | SP Column | SP Type |
|---|---|---|---|
| MS Office Version | `drpHIMSOfficeVer` | `HI_MSOfficeVer` | Choice |
| MS Office Key | `txtHIMSOfficeKey` | `HI_MSOfficeKey` | Text |
| Notes Version | `drpHINotesVer` | `HI_NotesVer` | Choice |
| MS Email | `txtHIMSEmail` | `HI_MSEmail` | Text |

### Section 5: Notes (HI_S5)

| UI Label | Control Name | SP Column | SP Type |
|---|---|---|---|
| Specifications | `txtHISpecifications` | `HI_Specifications` | Multiline |
| Notes / Remarks | `txtHIRemarks` | MainDB_IT `Remarks` | Multiline |

---

## ITSSR — IT Support & Service Request — No Approval, Service Desk

> Source: `mapping/field-mapping.md`, `src/form-schemas/ITSSR.json`, `features/itssr/itssr-app.tsx`
> Parent list: MainDB_IT | Child list: MainDB_IT_Ext_Support | FormCode: ITSSR | Approval: **NO**

### Section 1: Requestor Details (ITSSR_S2)

| UI Label | Control Name | Component | SP List | SP Column | SP Type | Required | Default |
|---|---|---|---|---|---|---|---|
| Case No | `lblITSSRCaseNo` | cmpReadOnlyField | MainDB_IT_Ext_Support | `CaseNo` | Text (auto) | Auto | Auto-generated |
| Date Sent | `lblITSSRDateSent` | cmpReadOnlyField | MainDB_IT | `submitteddate` | Text (ISO) | Auto | `Now()` |
| Requestor | `lblITSSRRequestor` | cmpReadOnlyField | MainDB_IT | `requestoremail` | Text | Auto | `gblCurrentUser.UserPrincipalName` |
| Reported By | `txtITSSRReportedBy` | cmpTextInputField | MainDB_IT_Ext_Support | `ReportedBy` | Person/Group | No | — |
| Company | `drpITSSRCompany` | cmpChoiceField | MainDB_IT | `company` | Choice | CONFIRMED | — |
| Department | `drpITSSRDepartment` | cmpChoiceField | MainDB_IT | MISSING_INFO | Choice | CONFIRMED | — |
| Extension No | `txtITSSRExtension` | cmpTextInputField | MainDB_IT | MISSING_INFO | Text | No | — |
| To (IT Team) | `txtITSSRTo` | cmpTextInputField | MainDB_IT_Ext_Support | `PIC_Email` | Text | No | — |
| CC | `txtITSSRCC` | cmpTextInputField | MainDB_IT | MISSING_INFO | Text | No | — |
| Service Type | `drpITSSRServiceType` | cmpChoiceField | MainDB_IT_Ext_Support | `ServiceType` | Choice | CONFIRMED | — |
| Category | `drpITSSRCategory` | cmpChoiceField | MainDB_IT_Ext_Support | `Category` | Choice | CONFIRMED | — |
| Problem Description | `txtITSSRDescription` | cmpMultilineTextField | MainDB_IT | MISSING_INFO | Multiline | CONFIRMED | — |
| Attachment | `cmpITSSRAttachment` | cmpAttachmentControl | MainDB_IT | MISSING_INFO | Attachment | No | — |

### Section 2: IT Resolution (ITSSR_S3 — visible when assigned)

| UI Label | Control Name | SP Column | SP Type | Visible When |
|---|---|---|---|---|
| Pending Status | `drpITSSRPendingStatus` | MISSING_INFO | Choice | Status = "Assigned" or "InProgress" |
| Carried Out By | `lblITSSRCarriedOutBy` | `AssignedPIC` | Person/Group | Status = "InProgress" or "Resolved" |
| Solution | `txtITSSRSolution` | MISSING_INFO | Multiline | Status = "InProgress" or "Resolved" |
| Start Date | `datITSSRStartDate` | MISSING_INFO | DateTime | Status = "Assigned" |
| Date Completed | `datITSSRDateCompleted` | `ResolvedAt` | DateTime | Status = "Resolved" |

### Section 3: Requestor Acceptance (ITSSR_S4 — visible when resolved)

| UI Label | Control Name | SP Column | SP Type | Visible When |
|---|---|---|---|---|
| Date Accepted | `datITSSRAccepted` | MISSING_INFO | DateTime | Status = "Resolved" |
| Rating (1–10) | `numITSSRRating` | MISSING_INFO | Number | Status = "Resolved" or "Closed" |
| Comment | `txtITSSRAcceptComment` | MISSING_INFO | Multiline | Status = "Resolved" |

---

## IT Forms — Quick Reference (Remaining Forms)

> For forms below, SP internal column names are sourced from `mapping/field-mapping.csv` and `src/form-schemas/`.
> Marked as TSX_INFERENCE where not yet confirmed from live SharePoint.

| Form Code | Parent List | Child List | Approval | Key Fields Mapped | Status |
|---|---|---|---|---|---|
| NIR (NOTESID) | MainDB_IT | MainDB_IT_Ext_Access | YES — 4-stage | NIR_FullName, NIR_Department, NIR_RequestType, NIR_HODApprovalStatus, NIR_NotesAdminStatus, NIR_ITHardwareStatus | CONFIRMED |
| RS (PWDRESET) | MainDB_IT | MainDB_IT_Ext_Access | YES — 2-stage + ED | RS_UserName, RS_Designation, RS_ReasonForReset, RS_AssignedPICEmail, RS_NeedsEDApproval | CONFIRMED |
| SFAR | MainDB_IT | MainDB_IT_Ext_Access | YES — 5-stage | SFAR_FolderType, SFAR_Server, SFAR_AccessType, SFAR_FolderOwnerEmail, SFAR_HODEmail | CONFIRMED |
| UR (USERID) | MainDB_IT | MainDB_IT_Ext_Access | YES — multi-stage | UR_RequestType, UR_EmployeeName, UR_Department, UR_Application, UR_HODStatus | TSX_INFERENCE |
| PRF | MainDB_IT | MainDB_IT_Ext_Support | YES — 12-section | PRF_RequestNo, PRF_RequestType, PRF_IsSAP, PRF_DeptManagerEmail, PRF_ITApprovedEmail | CONFIRMED |
| SAPCR | MainDB_IT | MainDB_IT_Ext_SAP | YES — multi-stage | SAPCR_TicketNo, SAPCR_System, SAPCR_Priority, SAPCR_BPOApprovedBy, SAPCR_PMApprovedBy | CONFIRMED |
| SAPTR | MainDB_IT | MainDB_IT_Ext_SAP | YES — 2-stage | SAPTR_TRNumber, SAPTR_Module, SAPTR_TRCategory | CONFIRMED |
| SAPAMR | MainDB_IT | MainDB_IT_Ext_SAP | YES | SAPAMR_TBVEmail, SAPAMR_TBAEmail | CONFIRMED |
| SAPCA | MainDB_IT | MainDB_IT_Ext_SAP | YES | SAPCA_Module, SAPCA_Client, SAPCA_Purpose | TSX_INFERENCE |
| SAPSLCF | MainDB_IT | MainDB_IT_Ext_SAP | TSX_INFERENCE | SAPSLCF_PlantCode, SAPSLCF_SLCode | TSX_INFERENCE |
| SAPDRP | MainDB_IT | MainDB_IT_Ext_Infra | TSX_INFERENCE | SAPDRP_Title, SAPDRP_Category, SAPDRP_Revision | TSX_INFERENCE |
| IOIPOL | MainDB_IT | MainDB_IT_Ext_Policy | YES | IOIP_PolicyNo, IOIP_RevNo, IOIP_DocTitle | CONFIRMED |
| ITSC | MainDB_IT | MainDB_IT_Ext_Assets | NO | ITSC_Server, ITSC_CPU, ITSC_RAM | CONFIRMED |
| ITINFO | MainDB_IT | MainDB_IT_Ext_Docs | NO | INFO_To, INFO_InfoType, INFO_Subject | TSX_INFERENCE |
| ISGDOC | MainDB_IT | MainDB_IT_Ext_Docs | NO | DOC_Type, DOC_Title, DOC_VerNo | CONFIRMED |
| DCALOG | MainDB_IT | MISSING_INFO | NO | DCA_Site, DCA_ServerRoom, DCA_Date, DCA_VisitorName | TSX_INFERENCE |
| TRNMAN | MainDB_IT | MISSING_INFO | NO | TRN_Type, TRN_Title, TRN_VerNo | TSX_INFERENCE |
| ITDAILYRPT | MainDB_IT | MISSING_INFO | NO | ITDRPT_Subject, ITDRPT_StartDate, ITDRPT_Category | TSX_INFERENCE |
| ITDR2 | MainDB_IT | MISSING_INFO | NO | TASK_Year, TASK_Month, TASK_Title | TSX_INFERENCE |
| INTUATSOF | MainDB_IT | MISSING_INFO | TSX_INFERENCE | KUN_Status, BPON_Status (multi-row sign-off) | TSX_INFERENCE |
| SILOUATSOF | MainDB_IT | MISSING_INFO | TSX_INFERENCE | KUN_Status, BPON_Status (multi-row sign-off) | TSX_INFERENCE |
