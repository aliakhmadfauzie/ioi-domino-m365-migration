# SharePoint List Design

> **Updated**: 2026-05-31 — Corrected to reflect actual code architecture
> **Site**: https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites
> **Main List**: `MainDB_IT` (Prai), `MainDB_IT_JHR` (Johor) — `FormCode` column discriminates form type
> **Extension Lists**: `MainDB_IT_Ext_Access`, `Ext_Assets`, `Ext_Support`, `Ext_SAP`, `Ext_Docs`, `Ext_Infra`

---

## Architecture: Single Main List Per Site + Extension Lists

### Why Not One List Per Domino App?
You have **23 Domino forms** but they fall into **6 functional categories**. Creating 23 separate SharePoint lists would be unmanageable. Instead, use a **single wide MainDB_IT list** per site with `FormCode` as the discriminator, plus optional extension lists for form-specific extra fields.

| Architecture | Pros | Cons | Status |
|---|---|---|---|
| **1 main list per site + extension lists** | Single Power App connection, FormCode views, per-site isolation | Wide table with many columns | ✅ **Implemented in code** |
| **1 list per form** | Simple mapping | Too many lists, no cross-form view | ❌ Not recommended |
| **1 parent + child per dept** | Dept-level isolation | Needs Power App to federate | ❌ Replaced by simpler model |

---

### Actual List Structure (from Code)

```
SharePoint Site: IOI-App_Admin_Sites
│
├── [Main] MainDB_IT (Prai)             ← ✅ EXISTS — All IT forms, FormCode discriminator
├── [Main] MainDB_IT_JHR (Johor)        ← ✅ CODE READY — SP list creation pending (see scripts/Add-MainDB_IT-Columns.ps1)
│
├── [Ext]  MainDB_IT_Ext_Access         ← ✅ EXISTS — EAF, NIR, RS, SFAR, UR
├── [Ext]  MainDB_IT_Ext_Assets         ← ✅ EXISTS — HI hardware assets; 20 HI Power Apps columns added 2026-06-03
├── [Ext]  MainDB_IT_Ext_Support        ← ✅ EXISTS — ITSSR, PRF, IAL1-5, ITDR
├── [Ext]  MainDB_IT_Ext_SAP            ← ✅ EXISTS — SAPAMR, SAPCA, SAPCR, SAPSOF, SAPTR, SAPSLCF
├── [Ext]  MainDB_IT_Ext_Docs           ← ⬜ PENDING — IOIP, ITI, ITP, ITP2
├── [Ext]  MainDB_IT_Ext_Infra          ← ⬜ PENDING — ITSC, SAPDRP
├── [Ext]  MainDB_IT_Ext_Policy         ← ✅ CREATED — IOIP POLICY (63 columns)
│
├── [Config] Config_Companies           ← ⬜ PENDING — Company reference
├── [Config] Config_Departments         ← ⬜ PENDING — Department reference
├── [Config] Config_ApproverMatrix      ← ⬜ PENDING — Approval routing
├── [Config] Config_EmployeeDirectory   ← ⬜ PENDING — Employee lookup
├── [Config] IT_M1_RS_SystemsList       ← ⬜ PENDING — RS form system list
├── [Config] IT_M1_RS_Banks             ← ⬜ PENDING — RS form bank list
├── [Config] IT_M1_SFAR_Servers         ← ⬜ PENDING — SFAR form server list
│
├── [Main] MainDB_HR (Prai)                ← ✅ SCRIPTS READY — 26 HR forms, FormCode discriminator (see scripts/Create-HR-Lists.ps1)
├── [Main] MainDB_HR_JHR (Johor)           ← ✅ SCRIPTS READY — 16 Johor HR forms, FormCode discriminator
│
├── [Ext]  MainDB_HR_Ext_Staffing          ← ✅ SCRIPTS READY — SR, manpowerReq, FTCR, CWR, INTERVIEWDB
├── [Ext]  MainDB_HR_Ext_Lifecycle         ← ✅ SCRIPTS READY — EEN, EPDU, EPHR, INTERN, PAF
├── [Ext]  MainDB_HR_Ext_Attendance        ← ✅ SCRIPTS READY — AWHR, DRD, NDF, LateComing, NightVisit
├── [Ext]  MainDB_HR_Ext_ForeignWorker     ← ✅ SCRIPTS READY — FWWPD, FWWPE, OWP, TNPRA, TyphoidVacc, UniformReq
├── [Ext]  MainDB_HR_Ext_OrgStructure      ← ✅ SCRIPTS READY — ORGCHART, PCNOrgChart, JD, pcnjd
├── [Ext]  MainDB_HR_Ext_Welfare           ← ✅ SCRIPTS READY — BSD, PCNBkStf, CIR, cancomp, GDSN, HEALTHINFO
├── [Ext]  MainDB_HR_Ext_Compliance        ← ✅ SCRIPTS READY — PCNTND, TMPU, ContractorReg
├── [Ext]  MainDB_HR_Ext_Operations        ← ✅ SCRIPTS READY — HRINFO, HRAPR, ESF, hostela, workins, SpVisit, PCNDriver
│
├── [Main] MainDB_QA_JHR (Johor QA)           ← ✅ ANALYZED — 27 forms (see analysis/qa-qc-data-source-analysis.md)
├── [Main] MainDB_QC_JHR (Johor QC)           ← ✅ ANALYZED — 29 forms (PDF-only)
├── [Main] MainDB_QA (Prai/Penang QA)         ← ✅ ANALYZED — 46 forms (PDF-only)
├── [Main] MainDB_QC (Prai/Penang QC)         ← ✅ ANALYZED — 22 forms (PDF-only)
│
├── [Ext]  MainDB_QA_Ext_IMS                  ← ⬜ PENDING — SOP, WI, QM, LTM, QP, PQP, SDS, Manuals
├── [Ext]  MainDB_QA_Ext_CAPA                 ← ⬜ PENDING — ICAR, NCR, OFI, PAR, QACAR
├── [Ext]  MainDB_QA_Ext_Records              ← ⬜ PENDING — Master lists, QA Info, KRA/KPI
├── [Ext]  MainDB_QC_Ext_Lab                  ← ⬜ PENDING — QC Lab forms, Calibration, Sensory
├── [Ext]  MainDB_QA_Ext_Assessment           ← ⬜ PENDING — Data Analysis, Food Defence, GMP Survey
├── [Ext]  MainDB_QA_Ext_Product              ← ⬜ PENDING — Tanker Inspection, PFAD, CCCAR, DIR
├── [Ext]  MainDB_QA_Ext_HalalCert            ← ⬜ PENDING — Halal, SDS, Certification
├── [Ext]  MainDB_QA_Ext_ChangeControl        ← ⬜ PENDING — Change Control, Validation
│
├── [Main] MainDB_LOG                    ← 🆕 DESIGN BELOW — Logistics forms, FormCode discriminator
├── [Main] MainDB_MTN                    ← 🆕 DESIGN BELOW — Maintenance forms, FormCode discriminator
│
├── [Main] MainDB_FIN                    ← ✅ JSON READY — Finance forms (see design/sharepoint-lists/fin-columns.json)
├── [Main] MainDB_PRD                    ← ✅ EXISTS — Production forms (designed below)
├── [Main] MainDB_SHE                    ← ✅ EXISTS — SHE forms
├── [Main] MainDB_STR                    ← ✅ EXISTS — Strategy forms
```

---

## List Design: MainDB_IT (Main List — Prai)
> Main list for all IT Access and Service Requests at Prai site. Each record is discriminated by `FormCode`.

### Core Columns (All Forms)

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: EAF, ITSSR, HI, NIR, RS, PRF, SFAR, UR, SAPCR, etc. |
| **CurrentStatus** | Choice | ✅ | Workflow state machine value |
| **EnvironmentTag** | Choice | — | Production / UAT / Development |
| **Site** | Choice | ✅ | Johor / Penang / Prai / Kuala Lumpur / Both Sites |
| **SubmittedBy** | Person/Group | ✅ | Current user |
| **SubmittedDate** | Date/Time | ✅ | `=Now` |
| **Company** | Choice | — | From Config_Companies |
| **Subject** | Single line | — | Request subject |
| **IsLocked** | Boolean | — | Lock flag |
| **Remarks** | Multiple lines | — | General remarks |
| **WorkflowStage** | Number | — | Current workflow stage (1-5) |
| **HODApproverRemarks** | Multiple lines | — | HOD comments |

### Form-Prefixed Columns (Wide Table Pattern)

Each form type has prefixed columns in the same MainDB_IT list:

**EAF fields:** `company`, `subject`, `requestorName`, `requestoremail`, `applicationType`, `systemName`, `targetUser`, ...
**NIR fields:** `nIRFullName`, `nIRDepartment`, `nIRRequestType`, `nIRHODApprovalStatus`, `nIRNotesAdminStatus`, `nIRITHardwareStatus`, ...
**HI fields:** `hITagNo`, `hIAssetNo`, `hIType`, `hIComputerName`, `hICompany`, `hIUsedByEmail`, `hILocation`, `hIDepartment`, `hISerialNo`, ...
**PRF fields:** `pRFRequestNo`, `pRFRequestType`, `pRFIsSAP`, `pRFDeptManagerEmail`, `pRFITApprovedEmail`, ...
**RS fields:** `rSUserName`, `rSDesignation`, `rSCompany`, `rSDepartment`, `rSResetType`, `rSReasonForReset`, `rSAssignedPICEmail`, ...
**SAPAMR fields:** `sAPAMRTBVEmail`, `sAPAMRTBAEmail`, ...

---

## List Design: MainDB_IT_Ext_Access (Extension — Access Management)
> Linked to MainDB_IT via lookup. Stores form-specific fields for EAF, NIR, RS, SFAR, UR.

| Column Name | Type | Notes |
|---|---|---|
| **ParentRecordID** | Lookup → MainDB_IT | Links back to parent |
| **ParentFormCode** | Choice | EAF / NIR / RS / SFAR / UR |
| **EAF_status1** | Choice | HOD approval: Approved/Rejected |
| **EAF_status2** | Choice | Director approval: Approved/Rejected |
| **EAF_status3** | Choice | IT Manager: Approved/Rejected |
| **EAF_status4** | Choice | IT Provisioning: Completed/Rejected |
| **EAF_date2-5** | DateTime | Stage approval timestamps |
| **EAF_comment1-4** | Note | Stage approval comments |
| **EAF_HODNAME** | Text | HOD who approved |
| **EAF_DIVNAME** | Text | Director who approved |
| **EAF_isPCN** | Boolean | PCN routing flag |
| **PRF_Status1-4** | Choice | PRF workflow statuses |
| **PRF_DateApp1-4** | DateTime | PRF approval dates |
| **PRF_Comments1** | Note | PRF comments |

---

## List Design: MainDB_IT_Ext_Assets (Extension — Hardware Assets)
> Linked to MainDB_IT via lookup. Stores hardware inventory fields for HI form.
> Provisioned on 2026-06-03 via `scripts/sharepoint/Provision-HI-ExtAssets.ps1`; live report: `analysis/sharepoint-provisioning/hi-ext-assets-provisioning-20260603-020511.csv` (20 created, 72 existing, 0 blocked).

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentID** | Lookup → MainDB_IT | ✅ | Links back to parent record |
| **ParentFormCode** | Single line | ✅ | HI |
| **ParentSite** | Single line | — | Site/source marker |
| **HI_TagNo** | Single line | — | App field `hITagNo`; generated asset ID |
| **HI_AssetNo** | Single line | — | App field `hIAssetNo` |
| **HI_Type** | Single line | — | App field `hIType` |
| **HI_ComputerName** | Single line | — | App field `hIComputerName`; brand/model value in current page |
| **HI_Company** | Single line | — | App field `hICompany` |
| **HI_UsedBy_Email** | Single line | — | App field `hIUsedByEmail` |
| **HI_Location** | Single line | — | Site/building/floor/room display path |
| **HI_Department** | Single line | — | App field `hIDepartment` |
| **HI_Site / HI_Building / HI_Floor / HI_Room** | Single line | — | Location subfields added for current HI page |
| **HI_SerialNo** | Single line | — | App field `hISerialNo` |
| **HI_Status / HI_Condition** | Single line | — | Asset lifecycle and condition |
| **HI_CPU / HI_CPUModel / HI_RAM / HI_HDDSize / HI_HDDType** | Single line | — | Hardware configuration fields added for current HI page |
| **HI_MonitorSize / HI_IPAddress / HI_MACAddress / HI_OSVersion** | Single line | — | Hardware/network/OS fields |
| **HI_MSOfficeVer / HI_MSOfficeKey / HI_NotesVer / HI_MSEmail** | Single line | — | Software/account fields |
| **HI_Vendor / HI_PONumber / HI_InvoiceNo** | Single line | — | Procurement references |
| **HI_PurchaseDate_dt / HI_WarrantyExpiry_dt / HI_LastAuditedDate_dt** | DateTime | — | Date columns use `_dt` internal names |
| **HI_PurchasePrice / HI_Year / HI_Month** | Number | — | Numeric procurement/audit fields |
| **HI_Specifications / HI_ProbFindings / HI_Actions** | Multiple lines | — | Long text fields |
| **ITSC_* fields** | Mixed | — | Existing shared asset/server-checklist fields retained |

---

## List Design: MainDB_IT_Ext_Support (Extension — IT Support)
> Linked to MainDB_IT via lookup. Stores ITSSR, PRF, IAL, ITDR case data.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_IT | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | ITSSR / PRF / IAL1-5 / ITDR |
| **CaseNo** | Single line | ✅ | Auto-generated case number |
| **Category** | Choice | — | Request category |
| **SubCategory** | Choice | — | Secondary category |
| **ReportedBy** | Person/Group | — | Reporter |
| **CreationDate** | DateTime | — | Date created |
| **INONumber** | Single line | — | Auto-number (former INO agent) |
| **ServiceType** | Choice | — | Support type |
| **Priority** | Choice | — | Low/Normal/High/Critical |
| **SLA_Hours** | Number | — | SLA target hours |
| **DueDate** | DateTime | — | SLA due |
| **ResolvedAt** | DateTime | — | Resolution date |
| **AssignedPIC** | Person/Group | — | Assigned IT staff |
| **PIC_Email** | Single line | — | PIC email for routing |
| **ITSSR_PendingDate** | DateTime | — | Pending status date |
| **ITSSR_OU** | Choice | — | Org unit: PanCen/Penang/ACM/Other |
| **ITSSR_Type2** | Choice | — | Secondary request type |

---

## List Design: MainDB_IT_Ext_SAP (Extension — SAP Governance)
> Linked to MainDB_IT via lookup. Stores SAP form data.

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **ParentRecordID** | Lookup → MainDB_IT | ✅ | Links back to parent |
| **ParentFormCode** | Choice | ✅ | SAPAMR / SAPCA / SAPCR / SAPSLCF / SAPSOF / SAPSOF2 / SAPTR |
| **SAPCR_BPOEmail** | Single line | — | BPO email for workflow routing |
| **SAPCR_PMEmail** | Single line | — | Project Manager email |
| **SAPCR_DeveloperEmail** | Single line | — | Developer email |
| **SAPCR_DirectorEmail** | Single line | — | Project Director email |
| **System** | Choice | — | SAP / WB / Other |
| **ChangeType** | Choice | — | Config / Transport / Access / New |
| **RiskLevel** | Choice | — | Low / Medium / High |
| **Status** | Choice | — | Draft → Submitted → Approved → Closed |

---

---

## List Design: MainDB_LOG (Main List — Logistics)
> Main list for all **Logistics** forms at both Prai and Johor sites. Each record is discriminated by `FormCode`.
> **Target Site**: `https://ioioi.sharepoint.com/sites/ioi-portal-log`
> **Source Analysis**: `analysis/log-prd-mtn-source-analysis.md`
> **Forms Covered**: Forklift/Reach Truck, ECM Forklift, Tanker POD, Tanker Washing, Weekly Counter Check, Shunting Truck, IMDG Inspection, Tanker Inspection (Johor), Container Shipment (Johor), FJB Inspection (Johor)

### Core Columns (All Forms)

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: FORKLIFT, ECMFORKLIFT, TANKERPOD, TANKERWASH, WCC, SHUNTINGTRUCK, IMDG, TANKERINSP, CONTAINERSHIP, FJBINSP |
| **CurrentStatus** | Choice | ✅ | Workflow state machine: New / Submitted / Approved / Rejected / Completed |
| **Department** | Choice | ✅ | Logistics |
| **Site** | Choice | ✅ | Prai / Johor / Both |
| **SubmittedBy** | Person/Group | ✅ | Current user |
| **SubmittedDate** | Date/Time | ✅ | `=Now` |
| **VehicleNo** | Single line | — | Forklift / Truck / Tanker / Equipment identification |
| **DriverName** | Single line | — | Operator/Driver name |
| **Supervisor** | Person/Group | — | Logistics supervisor |
| **Remarks** | Multiple lines | — | General remarks |
| **WorkflowStage** | Number | — | Current workflow stage |

### Form-Prefixed Columns (Wide Table Pattern)

**FORKLIFT fields (Forklift/Reach Truck Database):**
| Column Name | Type | Notes |
|---|---|---|
| `fLiftChecklistDate` | Date/Time | Daily/weekly check date |
| `fLiftModel` | Choice | Forklift model/type |
| `fLiftSerialNo` | Single line | Equipment serial number |
| `fLiftHoursMeter` | Number | Operating hours reading |
| `fLiftBatteryStatus` | Choice | Good / Needs Charging / Faulty |
| `fLiftHydraulicStatus` | Choice | Normal / Leaking / Faulty |
| `fLiftTireCondition` | Choice | Good / Worn / Replace |
| `fLiftSafetyFeatures` | Multiple lines | Horn, lights, seatbelt, backup alarm |
| `fLiftInspector` | Person/Group | Person performing check |
| `fLiftStatus` | Choice | Pass / Conditional Pass / Fail |

**ECMFORKLIFT fields (ECM Forklift Breakdown):**
| Column Name | Type | Notes |
|---|---|---|
| `ecmForkliftNo` | Single line | Forklift unit number |
| `ecmBreakdownDate` | Date/Time | Date of breakdown |
| `ecmBreakdownTime` | Date/Time | Time of breakdown |
| `ecmIssueDescription` | Multiple lines | Breakdown description |
| `ecmRootCause` | Multiple lines | Root cause analysis |
| `ecmActionTaken` | Multiple lines | Corrective action |
| `ecmDownTimeHours` | Number | Total downtime in hours |
| `ecmReportedBy` | Person/Group | Person reporting |
| `ecmResolvedBy` | Person/Group | Technician who resolved |
| `ecmResolutionDate` | Date/Time | Date resolved |

**TANKERWASH fields (Tanker Washing, Inspection & Leak Test):**
| Column Name | Type | Notes |
|---|---|---|
| `tWasherTankerNo` | Single line | Tanker registration number |
| `tWashDate` | Date/Time | Washing date |
| `tWashType` | Choice | Internal / External / Both |
| `tWashProduct` | Single line | Previous product carried |
| `tWashNextProduct` | Single line | Next product to load |
| `tWashInspector` | Person/Group | Inspection officer |
| `tWashLeakTestResult` | Choice | Pass / Fail |
| `tWashLeakTestMethod` | Choice | Pressure / Vacuum / Visual |
| `tWashSealNo` | Single line | Seal number applied |
| `tWashStatus` | Choice | Clean / Conditional / Reject |

**WCC fields (Weekly Counter Check):**
| Column Name | Type | Notes |
|---|---|---|
| `wccWeekEnding` | Date/Time | Week ending date |
| `wccTankerNo` | Single line | Tanker checked |
| `wccProductType` | Single line | Product type |
| `wccOpeningBalance` | Number | Opening stock (MT) |
| `wccReceipt` | Number | Receipts (MT) |
| `wccDelivery` | Number | Deliveries (MT) |
| `wccClosingBalance` | Number | Closing stock (MT) |
| `wccVariance` | Number | Variance (MT) |
| `wccCheckedBy` | Person/Group | Person performing check |
| `wccVerifiedBy` | Person/Group | Verifier |

**SHUNTINGTRUCK fields (Shunting Truck Service):**
| Column Name | Type | Notes |
|---|---|---|
| `stTruckNo` | Single line | Shunting truck number |
| `stServiceDate` | Date/Time | Service date |
| `stServiceType` | Choice | Routine / Major / Emergency Repair |
| `stOdometerReading` | Number | Odometer (km) |
| `stServiceDetails` | Multiple lines | Service performed |
| `stPartsReplaced` | Multiple lines | Parts replaced |
| `stNextServiceDate` | Date/Time | Next scheduled service |
| `stServiceBy` | Person/Group | Service provider/technician |
| `stLicenseExpiry` | Date/Time | Road license expiry |
| `stInspectionStatus` | Choice | Pass / Conditional / Fail |

**IMDG fields (IMDG Inspection Checklist):**
| Column Name | Type | Notes |
|---|---|---|
| `imdgDate` | Date/Time | Inspection date |
| `imdgVehicleNo` | Single line | Vehicle number |
| `imdgDriverName` | Single line | Driver name |
| `imdgProduct` | Single line | Dangerous goods product |
| `imdgUNNo` | Single line | UN Number |
| `imdgClass` | Choice | Class 1-9 |
| `imdgPlacards` | Boolean | Placards displayed |
| `imdgDocumentation` | Boolean | Shipping documents complete |
| `imdgPackaging` | Choice | Good / Minor Defect / Reject |
| `imdgInspector` | Person/Group | Inspector |
| `imdgResult` | Choice | Compliant / Non-Compliant |

**TANKERINSP fields (Johor - Tanker Inspection):**
| Column Name | Type | Notes |
|---|---|---|
| `tInspDate` | Date/Time | Inspection date |
| `tInspTankerNo` | Single line | Tanker number |
| `tInspType` | Choice | Internal / External / Pre-load / Post-discharge |
| `tInspProduct` | Single line | Product |
| `tInspCleanliness` | Choice | Clean / Acceptable / Reject |
| `tInspInspector` | Person/Group | Inspector |
| `tInspRemarks` | Multiple lines | Inspection remarks |

**CONTAINERSHIP fields (Johor - Container Shipment Database):**
| Column Name | Type | Notes |
|---|---|---|
| `cShipContainerNo` | Single line | Container number |
| `cShipSealNo` | Single line | Seal number |
| `cShipLoadingDate` | Date/Time | Loading date |
| `cShipDestination` | Single line | Destination port |
| `cShipCustomer` | Single line | Customer name |
| `cShipProduct` | Single line | Product loaded |
| `cShipQuantityMT` | Number | Quantity (MT) |
| `cShipVesselName` | Single line | Vessel name |
| `cShipBLNo` | Single line | Bill of Lading number |
| `cShipRemarks` | Multiple lines | Remarks |

**FJBINSP fields (Johor - FJB Storage Tank Cleanliness):**
| Column Name | Type | Notes |
|---|---|---|
| `fjbTankNo` | Single line | FJB tank number |
| `fjbInspectionDate` | Date/Time | Inspection date |
| `fjbProduct` | Single line | Product stored |
| `fjbCleanlinessGrade` | Choice | A / B / C / Reject |
| `fjbInspector` | Person/Group | Inspector |
| `fjbNextInspection` | Date/Time | Next scheduled inspection |

---

## List Design: MainDB_PRD (Main List — Production) — REVIEW
> Main list already exists at `https://ioioi.sharepoint.com/sites/ioi-portal-prd`. This section reviews the existing design against PDF source evidence and recommends gap-fill columns.
> **Site**: `https://ioioi.sharepoint.com/sites/ioi-portal-prd`
> **Existing List**: `MainDB_PRD` (88 columns — confirmed via local schema)
> **Source Analysis**: `analysis/log-prd-mtn-source-analysis.md`
> **Forms Covered (Prai)**: ASMR, CCP1, EPIR, PMD, PSMR, RMTC, SAM, SAPMMM, STVF, Equipment Pre-Inspection, SAP Material Master
> **Forms Covered (Johor)**: BHT Addition, Drawing Request, FIICI, OPRP/CCP, Stock Memo, STCI, WSV, TPM/PackIns

### Existing Core Columns (Confirmed from Schema)
- `Title`, `FormCode`, `Status`, `Department`, `FormID`, `EntitySite` (Site)
- `AppName`, `Requestor_Email`, `Requestor_DisplayName`, `RequestTitle`, `Description`
- `SubmittedOn`, `CurrentStage`, `CurrentApprover_Email`, `CurrentApproverGroup`
- `TargetDate`, `DueDate`, `AttachmentLinks`, `ApproverRemarks`
- `Priority`, `UrgencyReason`, `ReasonForChange`
- `QuantityMT`, `RequiresCOOApproval`, `RecipientHODEmail`
- `ResponseDueDate`, `ResponseExtendedDueDate`
- `RootCauseSummary`, `CorrectiveActionSummary`
- `TankNo`, `LastImmediateProduct`, `ProductToLoad`
- `InspectionDate`, `InspectionTime`, `RequestedBy`, `InspectedBy`
- `QCApprovalStatus`, `QCApprovalDate`, `QCApprovalBy`, `InspectionRemarks`
- `DocumentNo`, `EffectiveDate`, `DocumentType`, `BusinessArea`, `SystemCode`
- `RevisionNo`, `FinalStatus`, `FormVersion`, `CurrentAction`
- `ProductCode`, `ProductionBatch`, `ShiftInfo`, `Supervisor`, `ProducedDate`

### Recommended Additional Columns (Gap Analysis)

The following columns are recommended based on PDF evidence for forms not fully covered by the existing schema:

| Column Name | Type | Form Used By | Notes |
|---|---|---|---|
| **MaterialCode** | Single line | SAPMMM, SAM | SAP material master code |
| **MaterialDescription** | Multiple lines | SAPMMM, SAM | Material description |
| **StorageLocation** | Single line | SAPMMM | SAP storage location |
| **PlantCode** | Single line | SAPMMM, SAM | Plant/unit code |
| **ValuationClass** | Single line | SAPMMM | SAP valuation class |
| **MaterialGroup** | Single line | SAPMMM | SAP material group |
| **CCPParameter** | Choice | CCP1, OPRP/CCP | Temperature / Pressure / pH / Other |
| **CCPLimitMin** | Number | CCP1, OPRP/CCP | Critical limit minimum |
| **CCPLimitMax** | Number | CCP1, OPRP/CCP | Critical limit maximum |
| **CCPActualReading** | Number | CCP1, OPRP/CCP | Actual reading |
| **CCPResult** | Choice | CCP1, OPRP/CCP | Pass / Fail / Out of Spec |
| **CCPCorrectiveAction** | Multiple lines | CCP1, OPRP/CCP | Action taken if out of spec |
| **EquipmentID** | Single line | EPIR, PMD, PSMR | Equipment/Asset ID |
| **EquipmentName** | Single line | EPIR, PMD, PSMR | Equipment description |
| **PreInspectionChecklist** | Multiple lines | EPIR | Pre-inspection items |
| **PreInspectionResult** | Choice | EPIR | Pass / Conditional / Fail |
| **AsmtNo** | Single line | ASMR | Assessment number |
| **AsmtType** | Choice | ASMR | Internal / External / Customer |
| **PalletNo** | Single line | PMD | Pallet ID |
| **PackingType** | Choice | PMD, PSMR | Drum / IBC / Bag / Bulk |
| **BHTBatchNo** | Single line | BHT Addition (Johor) | BHT batch number |
| **BHTQuantityKG** | Number | BHT Addition (Johor) | BHT quantity in KG |
| **DrawingNo** | Single line | Drawing Request (Johor) | Drawing reference number |
| **DrawingRevision** | Single line | Drawing Request (Johor) | Drawing revision |
| **WeighScaleID** | Single line | WSV (Johor) | Weighing scale identifier |
| **WeighCalibrationDate** | Date/Time | WSV (Johor) | Last calibration date |
| **WeighCalibrationDue** | Date/Time | WSV (Johor) | Next calibration due |
| **WeighResult** | Choice | WSV (Johor) | Pass / Fail |
| **FilterClothNo** | Single line | Filter Cloth (Johor) | Filter cloth identifier |
| **FilterClothInstallDate** | Date/Time | Filter Cloth (Johor) | Installation date |
| **FilterClothCondition** | Choice | Filter Cloth (Johor) | New / Good / Worn / Replace |

### FormCode Values for PRD
`ASMR`, `CCP1`, `EPIR`, `PMD`, `PSMR`, `RMTC`, `SAM`, `SAPMMM`, `STVF`, `BHTADD`, `DRAWREQ`, `FIICI`, `OPRPCCP`, `STCI`, `WSV`, `TPM` (Prai form codes in lowercase)

---

## List Design: MainDB_MTN (Main List — Maintenance)
> Main list for all **Maintenance** forms at both Prai and Johor sites. Each record is discriminated by `FormCode`.
> **Target Site**: `https://ioioi.sharepoint.com/sites/ioi-portal-mtn`
> **Source Analysis**: `analysis/log-prd-mtn-source-analysis.md`
> **Forms Covered**: Failure Analysis Report (FAR), Maintenance Plan, Emergency Change, Equipment Pre-Inspection, Plant Maintenance Documentation, EE, EnMS, Calibration, PESP, TPM

### Core Columns (All Forms)

| Column Name | Type | Required | Notes |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: FAR, MTNPLAN, MTNEMGNCY, EPI, PLANTMTN, EE, ENMS, CALIBRATION, PESP, TPM |
| **CurrentStatus** | Choice | ✅ | Workflow state machine: New / Submitted / In Progress / Approved / Rejected / Completed |
| **Department** | Choice | ✅ | Maintenance |
| **Site** | Choice | ✅ | Prai / Johor / Both |
| **SubmittedBy** | Person/Group | ✅ | Current user |
| **SubmittedDate** | Date/Time | ✅ | `=Now` |
| **EquipmentID** | Single line | — | Equipment/Asset identifier |
| **EquipmentName** | Single line | — | Equipment description |
| **Location** | Single line | — | Physical location |
| **Supervisor** | Person/Group | — | Maintenance supervisor |
| **Remarks** | Multiple lines | — | General remarks |
| **WorkflowStage** | Number | — | Current workflow stage |

### Form-Prefixed Columns (Wide Table Pattern)

**FAR fields (Failure Analysis Report):**
| Column Name | Type | Notes |
|---|---|---|
| `fAREquipmentID` | Single line | Affected equipment |
| `fARFailureDate` | Date/Time | Failure date/time |
| `fARFailureMode` | Choice | Mechanical / Electrical / Hydraulic / Pneumatic / Process / Other |
| `fARSymptoms` | Multiple lines | Observed symptoms |
| `fARRootCause` | Multiple lines | Root cause analysis |
| `fARImpact` | Choice | Production / Quality / Safety / Environmental |
| `fARImpactDescription` | Multiple lines | Business impact description |
| `fARCorrectiveAction` | Multiple lines | Immediate corrective action |
| `fARPreventiveAction` | Multiple lines | Long-term preventive action |
| `fARDownTimeHours` | Number | Total downtime (hours) |
| `fARReportedBy` | Person/Group | Person reporting |
| `fARApprovedBy` | Person/Group | Supervisor/Manager approval |
| `fARClosureDate` | Date/Time | Case closure date |
| `fARCategory` | Choice | Breakdown / Repetitive / Critical |

**MTNPLAN fields (Maintenance Plan):**
| Column Name | Type | Notes |
|---|---|---|
| `mPPlanNo` | Single line | Maintenance plan number |
| `mPEquipmentID` | Single line | Equipment ID |
| `mPEquipmentName` | Single line | Equipment name |
| `mPIntervalType` | Choice | Daily / Weekly / Monthly / Quarterly / Yearly / Hourly |
| `mPIntervalValue` | Number | Interval count (e.g., 30 days, 500 hours) |
| `mPLastDate` | Date/Time | Last maintenance date |
| `mPNextDueDate` | Date/Time | Next scheduled date |
| `mPWorkType` | Choice | Inspection / Lubrication / Replacement / Overhaul / Calibration |
| `mPTaskDescription` | Multiple lines | Maintenance task description |
| `mPAssignedTo` | Person/Group | Assigned technician/team |
| `mPEstimatedHours` | Number | Estimated work hours |
| `mPStatus` | Choice | Scheduled / In Progress / Completed / Overdue |

**MTNEMGNCY fields (Emergency Change Procedure):**
| Column Name | Type | Notes |
|---|---|---|
| `mECChangeNo` | Single line | Emergency change number |
| `mECDate` | Date/Time | Date of request |
| `mECEquipmentID` | Single line | Affected equipment |
| `mECChangeDescription` | Multiple lines | Description of emergency change |
| `mECReason` | Multiple lines | Reason for emergency (safety/production risk) |
| `mECRiskAssessment` | Choice | Low / Medium / High / Critical |
| `mECAuthorizedBy` | Person/Group | Authorizing manager |
| `mECCompletionDate` | Date/Time | Change completion date |
| `mECClosureNotes` | Multiple lines | Post-completion notes |

**EPI fields (Equipment Pre-Inspection Report):**
| Column Name | Type | Notes |
|---|---|---|
| `ePIEquipmentID` | Single line | Equipment ID |
| `ePIEquipmentName` | Single line | Equipment name |
| `ePIInspectionDate` | Date/Time | Inspection date |
| `ePIInspector` | Person/Group | Inspector |
| `ePIItem` | Choice | Checklists per equipment type |
| `ePIResult` | Choice | Pass / Conditional Pass / Fail |
| `ePIComment` | Multiple lines | Inspector comments |
| `ePINextInspectionDate` | Date/Time | Next scheduled inspection |
| `ePIApprovedBy` | Person/Group | Approval authority |

**PLANTMTN fields (Plant Maintenance Documentation):**
| Column Name | Type | Notes |
|---|---|---|
| `pMDocumentNo` | Single line | Document reference number |
| `pMTitle` | Single line | Document title |
| `pMType` | Choice | AR (Activity Report) / FormDoc / SOP / Drawing |
| `pMEquipmentID` | Single line | Related equipment |
| `pMRevisionNo` | Single line | Document revision |
| `pMEffectiveDate` | Date/Time | Effective date |
| `pMAttachment` | Hyperlink | Link to document file |

**CALIBRATION fields (Johor - E&I Calibration):**
| Column Name | Type | Notes |
|---|---|---|
| `calInstrumentID` | Single line | Instrument/equipment ID |
| `calInstrumentName` | Single line | Instrument name |
| `calRange` | Single line | Calibration range |
| `calStandardUsed` | Single line | Calibration standard reference |
| `calDate` | Date/Time | Calibration date |
| `calDueDate` | Date/Time | Next calibration due |
| `calResult` | Choice | Pass / Conditional / Fail |
| `calAdjusted` | Boolean | Was adjustment required? |
| `calCertificateNo` | Single line | Calibration certificate number |
| `calCalibratedBy` | Person/Group | Calibration technician |
| `calRemarks` | Multiple lines | Remarks |

**ENMS fields (Energy Management System):**
| Column Name | Type | Notes |
|---|---|---|
| `enMSDocumentNo` | Single line | EnMS document number |
| `enMSTitle` | Single line | Document title (QM, SOP, target) |
| `enMSType` | Choice | Quality Manual / SOP / Target / Review |
| `enMSEffectiveDate` | Date/Time | Effective date |
| `enMSReviewDate` | Date/Time | Next review date |
| `enMSRevisionNo` | Single line | Revision number |
| `enMSAttachment` | Hyperlink | Document attachment |

**TPM fields (Johor - TPM Database):**
| Column Name | Type | Notes |
|---|---|---|
| `tpmMachineNo` | Single line | Machine number |
| `tpmMachineName` | Single line | Machine name |
| `tpmDate` | Date/Time | TPM activity date |
| `tpmActivityType` | Choice | Cleaning / Inspection / Lubrication / Tightening / Training |
| `tpmFindings` | Multiple lines | Findings during TPM |
| `tpmActionTaken` | Multiple lines | Corrective action |
| `tpmDoneBy` | Person/Group | Person performing TPM |
| `tpmVerifiedBy` | Person/Group | Supervisor verification |
| `tpmOverallEquipmentEffectiveness` | Number | OEE percentage |

**EE fields (Energy Efficiency / Environment):**
| Column Name | Type | Notes |
|---|---|---|
| `eeParameter` | Single line | Energy parameter monitored |
| `eeDate` | Date/Time | Reading date |
| `eeValue` | Number | Reading value |
| `eeUnit` | Single line | Unit of measure |
| `eeTarget` | Number | Target value |
| `eeVariance` | Number | Variance from target |
| `eeRecordedBy` | Person/Group | Person recording |
| `eeRemarks` | Multiple lines | Remarks |

---

## Permissions Model

| Group | MainDB_IT/JHR | Ext Lists | Config Lists |
|---|---|---|---|
| **IT Admins** | Full Control | Full Control | Full Control |
| **Dept Heads** | Contribute (own items) | Read | Read |
| **Requestors** | Contribute (own items) | Read (via app) | Read |
| **All Users** | Read | Read | Read |

## Versioning
- MainDB_IT / MainDB_IT_JHR: **50 versions**
- Extension lists: **25 versions**
- Config lists: **10 versions**

## Retention
- Active requests: Online
- Completed > 1 year: Archive to separate list
- Hardware: Active until scrapped
