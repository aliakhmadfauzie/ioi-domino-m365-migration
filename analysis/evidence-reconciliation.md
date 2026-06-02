# Evidence Reconciliation

> **Updated**: 2026-05-31 (added HCL PDF source; expanded to all 36 department-sites)
> **Source DXL**: `source/dxl/XML_HR_*/` (HR DXL files) + Penang/Johor IT XMLs + `source/dxl/XML_QA_Johor/` (QA DXL)
> **HCL PDF Source (NEW)**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/{DEPT}/` and `JOHOR_SITE_FORM/{DEPT}/` — **626 total across all departments**
> **Original PDF UI Exports**: `source/Project Iventories/extracted-embedded-pdfs/` — 1,171 PDFs
> **Master Inventory**: `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` (361 apps)
> **Full Portfolio XLSX**: `source/pdf/pdf_form_hcl/hcl_form_pdf/Final Apps Inventory.xlsx`
>
> **Note**: Evidence reconciliation is complete for IT forms (23) and partially complete for HR (42) and QA Johor (27).
> The remaining ~330+ forms from other departments have PDF-only evidence and need DXL discovery.

## New Evidence Source Assessment

A new organized source of HCL form PDFs was discovered at `source/pdf/pdf_form_hcl/hcl_form_pdf/`. This source provides **clean, individually-named PDFs** organized by site and department — superior to the raw extracted-embedded-pdfs.

### Comparison of PDF Sources

| Criterion | Original Extracted PDFs | HCL PDF Forms (NEW) |
|---|---|---|
| **Location** | `source/Project Iventories/extracted-embedded-pdfs/` | `source/pdf/pdf_form_hcl/hcl_form_pdf/` |
| **Total PDFs** | 1,171 | 626 |
| **Organization** | By match confidence and app | **By site → department** (22 Prai + 14 Johor) |
| **Naming** | UUID-based filenames | **Clean form code names** (EAF.pdf, HI.pdf, etc.) |
| **IT Form Coverage** | 28 Penang + 6 Johor | **28 Penang + 6 Johor** (same) |
| **Build Readiness** | Not included | **Included** in `master_app_data_still_needed.csv` |
| **Recommendation** | Use as fallback | **🟢 PRIMARY SOURCE** for UI layout analysis |

### Source Priority (Updated)
1. **🟢 HCL PDF Forms** (`source/pdf/pdf_form_hcl/hcl_form_pdf/`) — cleanest, best organized
2. **📄 Domino DXL/XML** — field-level schema
3. **🟡 Extracted Embedded PDFs** — fallback for cross-reference
4. **📸 Screenshots** (`source/screenshots/`) — if available

## Purpose
Cross-reference findings from DXL/XML source analysis against PDF UI exports and screenshots to ensure complete coverage.

## Reconciliation Table

| Form | DXL Evidence File | PDF Evidence File | Screenshot | Fields Matched | Discrepancies | Resolved |
|---|---|---|---|---|---|---|
| **EAF (VPN/Citrix)** | `EAF_all_dxl.xml` + `EAF_all_inventory.txt` | **🟢 `PRAI_SITE_FORM/IT/EAF.pdf`** (234 KB, clean single PDF) | — | 24 fields: User, justification, comment1-4, RequestedBy, Type, AgentName, ClientID, Group, system, date1-5, HODNAME, DIVNAME, name4-5, currentaction, status1-4, isPCN, depthead, HApp, req, SendTo, CC, Country, Requestor | DXL shows 24 fields; PDF UI shows ~21 visible fields. `Country`, `IsMgr`, `IsMgr2`, `IsMgr3` are computed/hidden in DXL — not visible in PDF UI | ✅ DXL and PDF reconciled |
| **HI (Hardware Inventory)** | `HI_all_dxl.xml` + `HI_all_inventory.txt` | Penang/IT/ PDFs | — | 58 fields (Penang): machineid, usedby, macdesc, comp, cpuspd, hddtype, ram, inch, ipadd_1, winversion, MACAddress, SerialNo, Location, Printer, etc. | DXL shows 58 fields for Penang; Johor variant shows 60 fields. 2 extra fields in Johor variant (`Site`, `Building/Level`) | ⚠️ Johor variance documented |
| **ITSSR (Support)** | `ITSSR_all_dxl.xml` + `ITSSR_all_inventory.txt` | Penang/IT/ PDFs | — | 23 fields: CaseNo, ReportedBy, CreationDate, INO, CA, Category, etc. | DXL has 23 fields; PDF UI shows ~18 visible fields. 5 fields are computed/hidden (INO, CreationDate, DocAuthor, etc.) | ✅ DXL and PDF reconciled |
| **IAL (IT Activity Log)** | `IAL_all_dxl.xml` + `IAL_all_inventory.txt` | Penang/IT/ PDFs | — | 16 fields: DataRestorationV1 fields | Minor field naming variations between DXL and PDF | ✅ DXL and PDF reconciled |
| **IOIP (Policy)** | `IOIP_all_dxl.xml` + `IOIP_all_inventory.txt` | Penang/IT/ PDFs | — | 10 fields: PolicyEntry fields | — | ✅ |
| **ITI (IT Info)** | `ITI_all_dxl.xml` + `ITI_all_inventory.txt` | Penang/IT/ PDFs | — | 3 fields: ISGInfo fields | — | ✅ |
| **ITP (Procedures)** | `ITP_all_dxl.xml` + `ITP_all_inventory.txt` | Penang/IT/ PDFs | — | 10 fields: isgdoc fields | — | ✅ |
| **ITSC (Server Checklist)** | `ITSC_all_dxl.xml` + `ITSC_all_inventory.txt` | Penang/IT/ PDFs | — | 27 fields: AllServerMonitor fields | — | ✅ |
| **NIR (Notes ID)** | `NIR_all_dxl.xml` + `NIR_all_inventory.txt` | Penang/IT/ PDFs | — | 27 fields: ID Request fields | — | ✅ |
| **PRF (Program Request)** | `PRF_all_dxl.xml` + `PRF_all_inventory.txt` | Penang/IT/ PDFs | — | 23 fields: Reminder (PRF) fields | — | ✅ |
| **RS (Reset Password)** | `RS_all_dxl.xml` + `RS_all_inventory.txt` | Penang/IT/ PDFs | — | 21 fields: changepwd fields | — | ✅ |
| **SFAR (Share Folder)** | `SFAR_all_dxl.xml` + `SFAR_all_inventory.txt` | Penang/IT/ PDFs | — | 26 fields: Form (Share Folder Access) | — | ✅ |
| **SAPAMR (Auth Matrix)** | `SAPAMR_all_dxl.xml` + `SAPAMR_all_inventory.txt` | Penang/IT/ PDFs | — | 26 fields: SAPAutMatReview fields | — | ✅ |
| **SAPCA (Config Access)** | `SAPCA_all_dxl.xml` + `SAPCA_all_inventory.txt` | Penang/IT/ PDFs | — | 16 fields: ConfigForm fields | — | ✅ |
| **SAPCR (Change Request)** | `SAPCR_all_dxl.xml` + `SAPCR_all_inventory.txt` | Penang/IT/ PDFs | — | 54 fields: ChangeForm fields | — | ✅ |
| **SAPDRP (Disaster Recovery)** | `SAPDR_all_dxl.xml` + `SAPDR_all_inventory.txt` | Penang/IT/ PDFs | — | 5 fields: SAP_DR Issue fields | — | ✅ |
| **SAPSLCF (Storage Location)** | `SAPLoc_all_dxl.xml` + `SAPLoc_all_inventory.txt` | Penang/IT/ PDFs | — | 11 fields: New Storage Location fields | — | ✅ |
| **SAPSOF (Sign Off)** | `SAPSOF_And_SAPSOF2_all_dxl.xml` + `SAPSOF_And_SAPSOF2_all_inventory.txt` | Penang/IT/ PDFs | — | 385+ fields: SignOffForm-Ori | Very large form; DXL parsing ongoing | ⚠️ In progress |
| **SAPTR (Transport Request)** | `SAPTR_all_dxl.xml` + `SAPTR_all_inventory.txt` | Penang/IT/ PDFs | — | 34 fields: TRForm fields | — | ✅ |
| **UR (User Access)** | (bundled with NIR/RS DXL) | Penang/IT/ PDFs | — | Mapped from DXL | — | ✅ |
| **HI (Johor)** | `PanCen_HWInv_all_dxl.xml` + `PanCen_HWInv_all_inventory.txt` | 6 PDFs in Johor/IT/ | — | 60 fields | 2 extra fields vs Penang variant | ⚠️ Noted |
| **SAPDRP (Johor)** | `PanCen_SAPDR_all_dxl.xml` + `PanCen_SAPDR_all_inventory.txt` | Johor/IT/ PDFs | — | 5 fields | Matches Penang variant | ✅ |
| **SAPSLCF (Johor)** | `PanCen_SAPLoc_all_dxl.xml` + `PanCen_SAPLoc_all_inventory.txt` | Johor/IT/ PDFs | — | 9 fields | Slightly fewer fields vs Penang (11) | ⚠️ Noted |

## HR Forms Reconciliation

### Penang HR (26 Forms)
> Full DXL + HCL PDF analysis in `analysis/hr-data-source-analysis.md`
> **DXL available**: ✅ All 26 forms have DXL data
> **PDF available**: ✅ All 26 have HCL PDFs
> **Status**: ✅ All reconciled — see `analysis/hr-data-source-analysis.md`

### Johor HR (16 Forms)
> Full DXL + HCL PDF analysis in `analysis/hr-data-source-analysis.md`
> **DXL available**: ✅ All 16 forms have DXL data
> **PDF available**: ✅ All 16 have HCL PDFs (38 files total)
> **Status**: ✅ All reconciled — see `analysis/hr-data-source-analysis.md`

### Johor QA (27 Forms with DXL)
> Full DXL + HCL PDF analysis in `analysis/qa-qc-data-source-analysis.md`
> **DXL available**: ✅ 27 forms
> **PDF available**: ✅ ~90 PDF files
> **Status**: ✅ All reconciled — see `analysis/qa-qc-data-source-analysis.md`

## Evidence Summary

| Metric | Count |
|--------|-------|
| Total DXL files analyzed (IT) | 20 (Penang) + 3 (Johor) = 23 |
| Total DXL files analyzed (HR) | 26 (Penang) + 16 (Johor) = 42 |
| Total DXL files analyzed (QA) | 27 (Johor QA) |
| **Total DXL files analyzed** | **92 forms** |
| Total PDF UI exports (IT dept) | 28 (Penang) + 6 (Johor) = 34 |
| **Total HCL PDFs (all depts)** | **626** (372 Penang + 254 Johor) |
| Total IT forms reconciled | 21/23 (SAPSOF and SAPTR partially done) |
| Total HR forms reconciled | 42/42 ✅ |
| Total QA Johor forms reconciled | 27/27 ✅ (DXL complete) |
| **Pending non-IT reconciliation** | **~330+ forms** from 28 other department-sites (PDF-only evidence — DXL needed) |
| Forms fully matched (IT) | 19 |
| Forms with discrepancies (IT) | 3 (HI Johor, SAPSOF, SAPTR) |
| Resolved (IT) | 19 ✅ |
| Pending (IT) | SAPSOF (385+ fields — complex) |

## Discrepancy Log

| # | Form | Issue | Resolution Status | Notes |
|---|------|-------|-------------------|-------|
| 1 | HI (Johor) | Johor variant has 60 fields vs Penang 58 | ⚠️ Open | Extra fields: `Site`, `Building/Level` — need confirmation these are Johor-only or deprecated in Penang |
| 2 | SAPSOF | 385+ fields; DXL inventory partially extracted | ⚠️ In progress | Largest form; needs dedicated analysis pass |
| 3 | SAPTR | 34 fields; some computed fields lack visible UI equivalents | ⚠️ In progress | Computed fields may not need UI migration |
