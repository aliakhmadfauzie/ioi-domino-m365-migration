# PRD (Production) & FIN (Finance) — Complete Source Analysis

> **Generated**: 2026-06-01
> **Source**: HCL PDF exports + master_app_data_still_needed.csv + Generated SharePoint Models + Code-First App Config
> **Scope**: Prai (Penang) + Johor (PanCen) sites
> **Status**: PRD list exists (MainDB_PRD, 88 columns); FIN list pending (MainDB_FIN model ready)

---

## 1. PRD (Production) — Complete Analysis

### 1.1 Form Inventory

#### Prai (Penang) — 11 PDFs, 17 FormCodes

| App Name | PDF File | FormCode | Est. Fields | Readiness |
|---|---|---|---|---|
| Equipment Pre-Inspection Report | EPIR.pdf | EPIR | ~15 | Ready for build |
| SAP Material Master Maintenance Request | SAPMMM.pdf, SAPMMM_SF.pdf | SAPMMM | ~20 | Review required |
| Stock Allocation Memo | SAM.pdf, SAM_SF.pdf | SAM | ~15 | Review required |
| CCP1 Filter Inspection Findings | CCP1.pdf | CCP1 | ~12 | Ready for build |
| Storage Tank Verification Form | STVF.pdf | STVF | ~18 | Review required |
| Assessment Memo (Analytical Methods) | ASMR.pdf | ASMR | ~12 | Review required |
| Pallet Management Database | PMD.pdf | PMD | ~12 | Review required |
| Product Specification / Material Request | PSMR.pdf | PSMR | ~14 | Review required |
| RMTC (Raw Material / Tank Check?) | RMTC.pdf | RMTC | ~10 | Review required |

#### Johor (PanCen) — 16 PDFs, 8 FormCodes

| App Name | PDF File(s) | FormCode | Est. Fields | Readiness |
|---|---|---|---|---|
| PanCen - TPM Database | PackIns.pdf, RequestAnalysis2.pdf, ScrapNotification.pdf, PSNSAMv1.pdf | TPM | ~25 | Review required |
| PanCen - BHT Addition Database | 1_BHTAddition.pdf | BHTADD | ~12 | Ready for build |
| PanCen - OPRP/CCP Filter Inspection | 4_oprp_CCP.pdf, 4_oprp_CCPForm.pdf, 4_oprp_Form.pdf, 4_oprp_GOPRPForm.pdf | OPRPCCP | ~15 | Ready for build |
| PanCen - Stock Allocation Memo | 5_PCStockMemo_PCEOSAM.pdf, 5_PCStockMemo_PCOCSAM.pdf | SAM | ~12 | Blocked — no path |
| PanCen - Storage Tank Cleaning Inspection | 6_STCI_NewEntry.pdf, 6_STCI_PCEOUpdatedEntry2.pdf | STCI | ~15 | Ready for build |
| PanCen - Weighing Scale Verification | 7_WSV.pdf | WSV | ~10 | Review required |
| PanCen - Drawing Request | 2_DrawingRequest.pdf | DRAWREQ | ~10 | Ready for build |
| PanCen - FIICI | 3_FIICI.pdf | FIICI | ~12 | Review required |

### 1.2 Field Definitions & Field Types

#### Existing MainDB_PRD Core Columns (88 existing columns)

| Column Name | SharePoint Type | Required | Description |
|---|---|---|---|
| **Title** | Single line | ✅ | Auto-generated display name |
| **FormCode** | Choice | ✅ | **Discriminator**: ASMR, CCP1, EPIR, PMD, PSMR, RMTC, SAM, SAPMMM, STVF, BHTADD, DRAWREQ, FIICI, OPRPCCP, STCI, WSV, TPM |
| **StatusKey** | Choice | ✅ | Draft / Submitted / Under Review / Approved / Rejected / Closed / Archived |
| **DepartmentKey** | Choice | ✅ | PRD (Production) |
| **SiteKey** | Choice | — | Prai / Johor |
| **FormReferenceID** | Single line | ✅ | Unique form reference number |
| **AppName** | Single line | — | Application name |
| **RequestTitle** | Single line | — | Request title/subject |
| **Description** | Multiple lines | — | Detailed description |
| **Requestor_Email** | Single line | — | Submitter email |
| **Requestor_DisplayName** | Person/Group | — | Submitter name |
| **SubmittedOn** | DateTime | — | Date submitted |
| **CurrentStage** | Single line | — | Workflow stage |
| **CurrentApprover_Email** | Single line | — | Current approver email |
| **CurrentApprover_DisplayName** | Single line | — | Current approver name |
| **CurrentApproverGroup** | Single line | — | Current approver group/role |
| **Priority** | Choice | — | Low / Normal / High / Critical |
| **TargetDate** | DateTime | — | Target completion date |
| **DueDate** | DateTime | — | Due date |
| **AttachmentLinks** | Multiple lines | — | File attachments |
| **ApproverRemarks** | Multiple lines | — | Approval comments |
| **UrgencyReason** | Multiple lines | — | Reason for urgency |
| **ReasonForChange** | Multiple lines | — | Reason for change |
| **QuantityMT** | Number | — | Quantity in metric tons |
| **RequiresCOOApproval** | Boolean | — | COO approval needed |
| **RecipientHODEmail** | Single line | — | HOD email for routing |
| **ResponseDueDate** | DateTime | — | Response deadline |
| **ResponseExtendedDueDate** | DateTime | — | Extended response deadline |
| **RootCauseSummary** | Multiple lines | — | Root cause analysis |
| **CorrectiveActionSummary** | Multiple lines | — | Corrective action |
| **TankNo** | Single line | — | Tank number |
| **LastImmediateProduct** | Single line | — | Previous product in tank |
| **ProductToLoad** | Single line | — | Product to be loaded |
| **InspectionDate** | DateTime | — | Inspection date |
| **InspectionTime** | DateTime | — | Inspection time |
| **RequestedBy** | Person/Group | — | Person requesting |
| **InspectedBy** | Person/Group | — | Inspector |
| **QCApprovalStatus** | Choice | — | Pending / Approved / Rejected |
| **QCApprovalDate** | DateTime | — | QC approval date |
| **QCApprovalBy** | Person/Group | — | QC approver |
| **InspectionRemarks** | Multiple lines | — | Inspection remarks |
| **DocumentNo** | Single line | — | Document reference number |
| **EffectiveDate** | DateTime | — | Effective date |
| **DocumentType** | Choice | — | SOP / Specification / Form / Report |
| **BusinessArea** | Choice | — | Production / Quality / Safety |
| **SystemCode** | Single line | — | System code |
| **RevisionNo** | Single line | — | Revision number |
| **FinalStatus** | Choice | — | Pending / Completed / Cancelled |
| **FormVersion** | Single line | — | Form version |
| **CurrentAction** | Single line | — | Current workflow action |
| **ProductCode** | Single line | — | Product identifier |
| **ProductionBatch** | Single line | — | Batch/lot number |
| **ShiftInformation** | Choice | — | Morning / Afternoon / Night |
| **Supervisor** | Person/Group | — | Production supervisor |
| **ProductionDate** | DateTime | — | Date of production |
| **WorkflowAction** | Single line | — | Workflow action taken |

#### Recommended Gap Columns (from prd-gap-columns.json)

| Column Name | SharePoint Type | Choices | Form Used By | Logic / Notes |
|---|---|---|---|---|
| **MaterialCode** | Text | — | SAPMMM, SAM | SAP material master code |
| **MaterialDescription** | Note | — | SAPMMM, SAM | Material description |
| **StorageLocation** | Text | — | SAPMMM | SAP storage location code |
| **PlantCode** | Text | — | SAPMMM, SAM | Plant/unit code |
| **ValuationClass** | Text | — | SAPMMM | SAP valuation class |
| **MaterialGroup** | Text | — | SAPMMM | SAP material group |
| **CCPParameter** | Choice | Temperature, Pressure, pH, Time, Flow Rate, Other | CCP1, OPRPCCP | Critical control point parameter type |
| **CCPLimitMin** | Number | — | CCP1, OPRPCCP | Critical limit minimum value |
| **CCPLimitMax** | Number | — | CCP1, OPRPCCP | Critical limit maximum value |
| **CCPActualReading** | Number | — | CCP1, OPRPCCP | Actual monitoring reading |
| **CCPResult** | Choice | Pass, Fail, Out of Spec | CCP1, OPRPCCP | Monitoring result |
| **CCPCorrectiveAction** | Note | — | CCP1, OPRPCCP | Action taken if out of spec |
| **EquipmentID** | Text | — | EPIR, PMD, PSMR | Equipment/Asset ID |
| **EquipmentName** | Text | — | EPIR, PMD, PSMR | Equipment description |
| **PreInspectionChecklist** | Note | — | EPIR | Pre-inspection items checklist |
| **PreInspectionResult** | Choice | Pass, Conditional, Fail | EPIR | Overall inspection result |
| **AsmtNo** | Text | — | ASMR | Assessment number |
| **AsmtType** | Choice | Internal, External, Customer | ASMR | Assessment type |
| **PalletNo** | Text | — | PMD | Pallet ID |
| **PackingType** | Choice | Drum, IBC, Bag, Bulk | PMD, PSMR | Packing method |
| **BHTBatchNo** | Text | — | BHTADD | BHT batch number (Johor) |
| **BHTQuantityKG** | Number | — | BHTADD | BHT quantity in KG (Johor) |
| **DrawingNo** | Text | — | DRAWREQ | Drawing reference number (Johor) |
| **DrawingRevision** | Text | — | DRAWREQ | Drawing revision (Johor) |
| **WeighScaleID** | Text | — | WSV | Weighing scale identifier (Johor) |
| **WeighCalibrationDate** | DateTime | — | WSV | Last calibration date (Johor) |
| **WeighCalibrationDue** | DateTime | — | WSV | Next calibration due (Johor) |
| **WeighResult** | Choice | Pass, Fail | WSV | Verification result (Johor) |
| **FilterClothNo** | Text | — | FilterCloth (Johor implied) | Filter cloth identifier |
| **FilterClothInstallDate** | DateTime | — | FilterCloth (Johor) | Installation date |
| **FilterClothCondition** | Choice | New, Good, Worn, Replace | FilterCloth (Johor) | Filter cloth condition |

### 1.3 PRD Choice Field Values (Consolidated)

| Field | Options | Notes |
|---|---|---|
| FormCode | ASMR, CCP1, EPIR, PMD, PSMR, RMTC, SAM, SAPMMM, STVF, BHTADD, DRAWREQ, FIICI, OPRPCCP, STCI, WSV, TPM | Discriminator |
| StatusKey | Draft → Submitted → Under Review → Approved → Rejected → Closed → Archived | Workflow state machine |
| SiteKey | Prai, Johor | |
| DepartmentKey | PRD (Production), also cross-dept: ADM, EI, ENG, FIN, HR, IT, LOG, MKT, MTN, PBI, PUR, QA, QC, RD, SEC, SHE, STR, TD, WH | Wide dept scope |
| Priority | (not specified in model — likely Low/Normal/High/Critical) | |
| ShiftInformation | Morning, Afternoon, Night (from UI) | |
| QCApprovalStatus | Pending, Approved, Rejected | |
| DocumentType | SOP, Specification, Form, Report | |
| BusinessArea | Production, Quality, Safety | |
| FinalStatus | Pending, Completed, Cancelled | |
| CCPParameter | Temperature, Pressure, pH, Time, Flow Rate, Other | Gap columns |
| CCPResult | Pass, Fail, Out of Spec | Gap columns |
| PreInspectionResult | Pass, Conditional, Fail | Gap columns |
| AsmtType | Internal, External, Customer | Gap columns |
| PackingType | Drum, IBC, Bag, Bulk | Gap columns |
| WeighResult | Pass, Fail | Gap columns |
| FilterClothCondition | New, Good, Worn, Replace | Gap columns |

### 1.4 PRD Approval Workflow

#### Classification: **Hybrid** (Forms vary by type)

| FormCode | Approval Required | Workflow Pattern | Evidence |
|---|---|---|---|
| CCP1 / OPRPCCP | **No Approval** | Inspection log → QC sign-off → Complete | Checklist pattern |
| EPIR | **No Approval** | Pre-inspection checklist → Complete | Inspection record |
| SAM / SAPMMM | **Approval Required** | Requestor → HOD → SAP Team | Multi-stage approval pattern |
| STVF / STCI | **Approval Required** | Requestor → Supervisor → QC | Inspection + approval |
| ASMR | **Approval Required** | Requestor → Reviewer → Approver | Assessment workflow |
| TPM | **No Approval** | Activity log → Verification | Maintenance record |
| BHTADD / DRAWREQ | **Approval Required** | Requestor → Supervisor | Simple approval |
| WSV | **No Approval** | Verification log | Calibration record |

#### Proposed Workflow Stages (Standard PRD)
```
Draft → Submitted → Supervisor Review → HOD Approval → QC Sign-off → Completed
                               ↘ Rejected ↙        ↘ Rejected ↙
```

#### Status Transition Map
| Current Status | Allowed Actions | Next Status | Actor |
|---|---|---|---|
| Draft | Submit | Submitted | Requestor |
| Submitted | Approve / Reject | Under Review / Rejected | Supervisor |
| Under Review | Approve / Reject | Approved / Rejected | HOD |
| Approved | QC Sign-off | Closed | QC Officer |
| Rejected | Re-submit | Submitted | Requestor |
| Closed | Archive | Archived | Admin |

#### Approval Actors
| Role | Responsibility | Source |
|---|---|---|
| **Production Supervisor** | First-level review (CCP deviations, inspections) | PDF evidence |
| **Production HOD** | Approval for SAM, SAPMMM, budget items | UI pattern |
| **QC Officer** | QC sign-off for inspection forms | PDF evidence |
| **COO** | High-value items requiring COO approval (RequiresCOOApproval flag) | Model field |

### 1.5 PRD Routing Rules

| Condition | Route To | Notes |
|---|---|---|
| RequiresCOOApproval = true | COO / Director | Flag field on form |
| QuantityMT > threshold | HOD + COO | High-volume approvals |
| CCPResult = "Out of Spec" | Supervisor + QC | Deviation auto-routing |
| Department = QC Involved | QC Officer | Cross-department routing |

---

## 2. FIN (Finance) — Complete Analysis

### 2.1 Form Inventory

#### Prai (Penang) — 6 PDFs

| App Name | PDF File | FormCode | Est. Fields | Readiness |
|---|---|---|---|---|
| Capital Appropriation Request | CAR.pdf | CAR | ~20-25 | Review required |
| Credit Management Form A | CMF_A.pdf | CMF_A | ~15 | Review required |
| Credit Management Form B | CMF_B.pdf | CMF_B | ~15 | Review required |
| Credit Management Form C | CMF_C.pdf | CMF_C | ~15 | Review required |
| Expense Approval Request Form | EARF.pdf | EARF | ~18 | Review required |
| Request for Special Expense Statement | RSES.pdf | RSES | ~15 | Review required |

#### Johor (PanCen) — 5 PDFs

| App Name | PDF File(s) | FormCode | Est. Fields | Readiness |
|---|---|---|---|---|
| PanCen - Capital Appropriation Request (CAR) | 1_PCNCAR.pdf | PCNCAR | ~20-25 | Review required |
| PanCen - Credit Management (Appendix A) | 2_pcncreditmanagement_Appendix_A.pdf | CMF_A | ~15 | Review required |
| PanCen - Credit Management (Appendix B) | 2_pcncreditmanagement_Appendix_B.pdf | CMF_B | ~15 | Review required |
| PanCen - Credit Management (Appendix C) | 2_pcncreditmanagement_Appendix_C.pdf | CMF_C | ~15 | Review required |
| PanCen - Insurance Claim | 3_insclaim.pdf | INSCLAIM | ~20 | Review required |

### 2.2 Field Definitions & Field Types

#### Existing MainDB_FIN Model Columns (from code)

| Column Name | TypeScript Type | SharePoint Type | Required | Description |
|---|---|---|---|---|
| **id** | number | Number | ✅ | System ID (GUID) |
| **title** | string | Single line | ✅ | Display name |
| **formCode** | string | Choice | ✅ | **Discriminator**: CAR, CMF_A, CMF_B, CMF_C, EARF, RSES, PCNCAR, INSCLAIM, etc. |
| **statusKey** | MainDBFINStatusKey | Choice | ✅ | Draft / Submitted / Under Review / Approved / Rejected / Closed / Archived |
| **departmentKey** | MainDBFINDepartmentKey | Choice | ✅ | FIN (Finance) |
| **siteKey** | MainDBFINSiteKey | Choice | — | Prai / Johor |
| **companyKey** | MainDBFINCompanyKey | Choice | — | IOI Corp / IOI Oleochemical / Other |
| **appName** | string | Single line | — | Application name |
| **requestTitle** | string | Single line | — | Request title |
| **description** | string | Multiple lines | — | Description |
| **requestorEmail** | string | Single line | — | Submitter email |
| **requestorDisplayName** | string | Person/Group | — | Submitter name |
| **submittedOn** | string | DateTime | — | Date submitted |
| **currentStage** | string | Single line | — | Workflow stage |
| **currentApproverEmail** | string | Single line | — | Current approver email |
| **currentApproverDisplayName** | string | Single line | — | Current approver name |
| **currentApproverGroup** | string | Single line | — | Current approver group |
| **amount** | number | Currency | — | Request amount (RM) |
| **contractAmount** | number | Currency | — | Contract amount (RM) |
| **iRRPercent** | string | Single line | — | IRR percentage |
| **paybackPeriod** | string | Single line | — | Payback period |
| **problemDesc** | string | Multiple lines | — | Problem description |
| **section** | string | Single line | — | Department/section |
| **statusRequest** | string | Single line | — | Request status |
| **module2Key** | MainDBFINModule2Key | Choice | — | Module (pending config) |
| **priority** | string | Choice | — | Low / Normal / High / Critical |
| **targetDate** | string | DateTime | — | Target date |
| **dueDate** | string | DateTime | — | Due date |
| **attachmentLinks** | string | Multiple lines | — | File attachments |
| **approverRemarks** | string | Multiple lines | — | Approval remarks |
| **urgencyReason** | string | Multiple lines | — | Urgency reason |
| **reasonForChange** | string | Multiple lines | — | Reason for change |
| **quantityMT** | string | Number | — | Quantity (MT) |
| **requiresCOOApproval** | string | Boolean | — | COO approval flag |
| **recipientHODEmail** | string | Single line | — | HOD email |
| **responseDueDate** | string | DateTime | — | Response due |
| **responseExtendedDueDate** | string | DateTime | — | Extended response due |
| **rootCauseSummary** | string | Multiple lines | — | Root cause |
| **correctiveActionSummary** | string | Multiple lines | — | Corrective action |
| **documentNo** | string | Single line | — | Document reference |
| **documentType** | string | Choice | — | Document type |
| **businessArea** | string | Choice | — | Business area |
| **systemCode** | string | Single line | — | System code |
| **revisionNo** | string | Single line | — | Revision number |
| **finalStatus** | string | Choice | — | Pending / Completed / Cancelled |
| **formVersion** | string | Single line | — | Form version |
| **workflowAction** | string | Single line | — | Workflow action |

### 2.3 FIN Choice Field Values (Consolidated)

| Field | Options | Notes |
|---|---|---|
| FormCode | CAR, CMF_A, CMF_B, CMF_C, EARF, RSES, PCNCAR, INSCLAIM + (see UI extensions: CreditApp, CreditRev, AnnBudget, InvApproval, BankRecon, TaxInv, etc.) | Discriminator |
| StatusKey | Draft → Submitted → Under Review → Approved → Rejected → Closed → Archived | Workflow state machine |
| SiteKey | Prai, Johor | |
| DepartmentKey | FIN (Finance), also cross-dept: ADM, EI, ENG, HR, IT, LOG, MKT, MTN, PBI, PRD, PUR, QA, QC, RD, SEC, SHE, STR, TD, WH | Wide scope |
| CompanyKey | IOI Corporation Berhad, IOI Oleochemical Industries Berhad, Other | |
| Priority | (likely Low / Normal / High / Critical) | |
| DocumentType | (likely Invoice / Contract / Report / Form) | |

### 2.4 FIN Approval Workflow

#### Classification: **Approval Required** (Most forms)
All FIN forms involve financial approval chains. CAR, EARF, and Credit Management require multi-stage financial approvals.

#### Proposed FIN Module Structure (from UI code — finance/index.tsx)

| Module | Forms | Approval Pattern |
|---|---|---|
| **Capital Expenditure** | CAR, CARV, CARC, ProjEval, ROICalc, AssetReg, AssetTrf, AssetDisp, BudgetReq, CapexTrack | Requestor → HOD → Finance Mgr → COO |
| **Expense & Claims** | EARF, TClaim, EClaim, PCard, Advance, AdvSettle, Reimburse, MileageClaim | Requestor → HOD → Finance |
| **Credit Management** | CreditApp, CreditRev, CreditLimit, OverdueRpt, BadDebt, CollAction | Requestor → Credit Mgr → Finance HOD |
| **Budgeting & Planning** | AnnBudget, BudgetVar, Forecast, CostCenter, BudgetTrf, RevBudget | Requestor → HOD → Finance → COO |
| **Accounts Payable** | InvApproval, PayReq, EarlyPay, VendorPay, DebitNote, CreditNote | Requestor → HOD → AP Mgr |
| **Banking & Treasury** | BankRecon, FXReq, BankSig, LoanReq, CashFlow, BankGuarantee | Requestor → Treasury → Finance HOD |
| **Financial Reporting** | MonthClose, InterCo, JournalReq, Accrual, Provision | Requestor → Finance Mgr |
| **Tax & Compliance** | TaxInv, WHT, SST, TaxExempt, TransferPrice | Requestor → Tax Mgr → Finance HOD |

#### Proposed Workflow Stages (Standard FIN)
```
Draft → Submitted → HOD Review → Finance Review → COO Approval → Completed
                               ↘ Rejected ↙         ↘ Rejected ↙
```

Simpler forms (EARF, Claims):
```
Draft → Submitted → HOD Approval → Finance Processing → Completed
                               ↘ Rejected ↙
```

#### Status Transition Map
| Current Status | Allowed Actions | Next Status | Actor |
|---|---|---|---|
| Draft | Submit | Submitted | Requestor |
| Submitted | Approve / Reject | Under Review / Rejected | HOD |
| Under Review | Approve / Reject | Approved / Rejected | Finance Manager |
| Approved (if requires COO) | Approve / Reject | COO_Review / Rejected | COO |
| Approved (final) | Process | Closed | Finance Team |
| COO_Review | Approve / Reject | Approved / Rejected | COO |
| Rejected | Re-submit | Submitted | Requestor |
| Closed | Archive | Archived | Admin |

#### Approval Actors
| Role | Responsibility | Forms |
|---|---|---|
| **HOD** | First-level approval for all FIN forms | All FIN forms |
| **Finance Manager** | Financial review, budget check | CAR, EARF, Budget, AP |
| **Credit Manager** | Credit assessment | CMF, CreditApp, CreditLimit |
| **Treasury Manager** | Banking & FX decisions | BankRecon, FXReq, LoanReq |
| **Tax Manager** | Tax compliance | TaxInv, WHT, SST |
| **COO / Director** | Final approval for high-value items | CAR > RM100K, Budget, BankSig |

### 2.5 FIN Routing Rules

| Condition | Route To | Logic |
|---|---|---|
| **FormCode = CAR** | HOD → Finance Mgr → COO | Capital Expenditure chain |
| **FormCode = CMF_A/B/C** | HOD → Credit Mgr | Credit evaluation |
| **FormCode = EARF** | HOD → Finance | Expense approval |
| **FormCode = INSCLAIM** | HOD → Finance Mgr → COO | Insurance claims |
| **Amount > RM100,000** | + COO Approval | High-value threshold |
| **Amount > RM500,000** | + Board Approval (note) | Board level |
| **RequiresCOOApproval = true** | Route to COO | Flag field |
| **CompanyKey = IOI Corp** | Standard route | Normal chain |
| **CompanyKey = Other** | + Legal Review | Cross-entity |

### 2.6 Proposed FIN-Specific Gap Columns

| Column Name | SharePoint Type | Choices | Form Used By | Logic / Notes |
|---|---|---|---|---|
| **CapitalExpenditureType** | Choice | New / Replacement / Expansion / Upgrade | CAR | CAPEX category |
| **ProjectCode** | Text | — | CAR, ProjEval | Project reference code |
| **CostCenter** | Text | — | All FIN forms | Cost center code |
| **GLCode** | Text | — | All FIN forms | General ledger code |
| **VendorName** | Text | — | CMF, AP forms | Vendor/customer name |
| **CreditLimitAmount** | Currency | — | CMF, CreditApp | Recommended credit limit |
| **CreditRating** | Choice | A / B / C / D | CMF, CreditRev | Internal credit rating |
| **CurrencyType** | Choice | MYR, USD, EUR, SGD, JPY, Other | FXReq, CAR | Transaction currency |
| **ExchangeRate** | Number | — | FXReq | Exchange rate applied |
| **InvoiceNo** | Text | — | InvApproval, PayReq | Supplier invoice number |
| **PONumber** | Text | — | InvApproval, PayReq | Purchase order number |
| **PaymentTerms** | Choice | 30 / 60 / 90 / COD | InvApproval, PayReq | Payment terms in days |
| **TaxInvoiceNo** | Text | — | TaxInv, SST | Tax invoice reference |
| **TaxType** | Choice | SST / WHT / Income Tax | TaxInv, WHT | Tax type |
| **BankAccountNo** | Text | — | BankRecon, BankSig | Bank account number |
| **BankName** | Text | — | BankRecon, BankSig | Bank name |
| **ApprovalAuthority** | Choice | HOD / Finance Mgr / COO / Board | All FIN | Approval authority level |
| **BudgetCode** | Text | — | BudgetReq, AnnBudget | Budget reference code |

---

## 3. SharePoint List Architecture

### 3.1 Current Status

| List | Site | Status | Columns | Notes |
|---|---|---|---|---|
| **MainDB_PRD** | ioi-portal-prd | ✅ **EXISTS** | 88 existing + 31 gap columns | Add gap columns to existing |
| **MainDB_FIN** | ioi-portal-fin (target) | ⬜ **PENDING** | 50+ (from model) | Provision new list |

### 3.2 MainDB_PRD — Recommended Update Plan

```
Existing: 88 columns (core + form-prefixed)
Gap:      31 columns (from prd-gap-columns.json)
Target:   119 columns (wide table pattern)
```

**Priority gap columns to add first:**
1. CCP Monitoring fields (CCPParameter, CCPLimitMin/Max, CCPActualReading, CCPResult, CCPCorrectiveAction) — for CCP1, OPRPCCP
2. Equipment fields (EquipmentID, EquipmentName, PreInspectionChecklist, PreInspectionResult) — for EPIR
3. Material fields (MaterialCode, MaterialDescription, StorageLocation, PlantCode, ValuationClass, MaterialGroup) — for SAPMMM, SAM
4. Johor-specific fields (BHTBatchNo, BHTQuantityKG, DrawingNo, DrawingRevision, WeighScaleID, WeighCalibrationDate, WeighCalibrationDue, WeighResult, FilterClothNo, FilterClothInstallDate, FilterClothCondition)
5. Packing/Pallet fields (PalletNo, PackingType) — for PMD, PSMR
6. Assessment fields (AsmtNo, AsmtType) — for ASMR

### 3.3 MainDB_FIN — Recommended Initial Schema

**Site**: `https://ioioi.sharepoint.com/sites/ioi-portal-fin` (target)
**List**: MainDB_FIN
**Architecture**: Single main list + optional extension lists for complex forms

**Core columns** (from existing model — 50+):
All columns from `main-dbfin-model.ts` as listed in 2.2 above.

**Additional columns for forms with unique fields:**

| Column Name | Type | Form Used By |
|---|---|---|
| **CAR_ProjectNo** | Text | CAR |
| **CAR_CAPEXType** | Choice | CAR |
| **CAR_ROI** | Number | CAR |
| **CAR_PaybackPeriod** | Number | CAR |
| **CMF_CustomerName** | Text | CMF_A/B/C |
| **CMF_CreditLimit** | Currency | CMF_A/B/C |
| **CMF_CreditRating** | Choice | CMF_A/B/C |
| **EARF_ExpenseType** | Choice | EARF |
| **EARF_ReceiptNo** | Text | EARF |
| **INSCLAIM_ClaimType** | Choice | INSCLAIM |
| **INSCLAIM_ClaimAmount** | Currency | INSCLAIM |

### 3.4 Permissions Model

| Group | MainDB_PRD | MainDB_FIN | Config Lists |
|---|---|---|---|
| **Department Admins** | Full Control | Full Control | Full Control |
| **Dept Heads (HOD)** | Contribute (own items) | Contribute (own items) | Read |
| **Supervisors/Managers** | Contribute + Approve | Contribute + Approve | Read |
| **Requestors** | Contribute (own items) | Contribute (own items) | Read |
| **QC / Finance Team** | Contribute + Edit | Contribute + Edit | Read |
| **All Users** | Read | Read | Read |

---

## 4. Cross-Department Integration Points

| Integration | PRD ↔ Dept | FIN ↔ Dept | Description |
|---|---|---|---|
| **QC Sign-off** | PRD → QC | — | Production inspection requires QC approval |
| **SAP Material Master** | PRD → IT/SAP | — | SAPMMM form creates SAP material records |
| **Asset Registration** | PRD → FIN | FIN → Asset | New equipment → FIN asset registration |
| **CAPEX Budget** | PRD → FIN | FIN → COO | Capital expenditure requests |
| **Stock/Inventory** | PRD → LOG/WH | — | Production output to warehouse |
| **Vendor Payment** | — | FIN → PUR | Vendor invoices trigger payment |

---

## 5. Risks, Assumptions & Questions

| # | Item | Type | Impact |
|---|---|---|---|
| 1 | PDF-only evidence for most FIN/PRD forms — no DXL/XML source | ⚠️ Risk | Field mapping requires manual PDF review |
| 2 | MainDB_FIN site not yet provisioned | ⚠️ Risk | Cannot test until site created |
| 3 | FIN KPI values and form categories in UI code may not match actual Domino forms | ❓ Question | Needs business confirmation |
| 4 | PRD gap columns need validation against actual Domino PDFs | ⚠️ Risk | Columns may need adjustment |
| 5 | Credit Management (CMF) — three separate forms may need separate FormCodes or sub-types | ❓ Question | CMF_A, CMF_B, CMF_C may be sections of one form |
| 6 | Insurance Claim form (Johor) — no Prai equivalent found | ❓ Question | May be Johor-only form |
| 7 | RSES (Request for Special Expense Statement) — no module mapping in UI code | ❓ Question | Needs categorization |
| 8 | FIN approval thresholds (RM 100K / RM 500K) are assumptions | ❓ Question | Needs business confirmation |
| 9 | PRD TPM Database overlaps with MTN (Maintenance) department | ⚠️ Risk | Cross-dept data ownership |
| 10 | Both lists use wide-table pattern — may hit SharePoint column limit (276 columns for choice fields) | ⚠️ Risk | Monitor column count |

---

## 6. Next Steps

1. **✅ Done**: PRD gap columns defined in `design/sharepoint-lists/prd-gap-columns.json`
2. **⬜ Pending**: Provision MainDB_FIN list on ioi-portal-fin SharePoint site
3. **⬜ Pending**: Create FIN gap-columns.json config file
4. **⬜ Pending**: Review PRD PDFs against existing list columns — validate field mappings
5. **⬜ Pending**: Review FIN PDFs against MainDB_FIN model — validate field coverage
6. **⬜ Pending**: Define Power Automate flows for PRD approval routing (CCP deviation, SAM approval)
7. **⬜ Pending**: Define Power Automate flows for FIN approval routing (CAR multi-stage, EARF approval)
8. **⬜ Pending**: Create Power Apps routing config for FIN department (modules, forms, stages)
9. **⬜ Pending**: Business confirmation on approval thresholds and routing rules
10. **⬜ Pending**: Update `central-form-reference.md` with PRD/FIN section

---

## 7. Reference Links

| Resource | Path |
|---|---|
| PRD PDFs (Prai) | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/PRD/` |
| PRD PDFs (Johor) | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRD/` |
| FIN PDFs (Prai) | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/FIN/` |
| FIN PDFs (Johor/FN) | `source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/FN/` |
| PRD SharePoint Model | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbprd-model.ts` |
| FIN SharePoint Model | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbfin-model.ts` |
| PRD Gap Columns Config | `design/sharepoint-lists/prd-gap-columns.json` |
| PRD Page (UI) | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/production/index.tsx` |
| FIN Page (UI) | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/finance/index.tsx` |
| Source Analysis (LOG/PRD/MTN) | `analysis/log-prd-mtn-source-analysis.md` |
| SharePoint List Design | `design/m365-design/sharepoint-list-design.md` (lines 76-77, 362-434) |
| Master App CSV | `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` |
| Department Config | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/config/departments.ts` |
