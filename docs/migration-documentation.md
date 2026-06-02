# Migration Documentation — Domino to Microsoft 365

> **Generated**: 2026-05-31
> **Project**: IOI Group Domino → M365 Migration
> **Repo**: `C:\Users\AL_AAF\Project\ioi_Docs`

---

## Project Overview

### Source (HCL/Lotus Domino)
| Item | Details |
|---|---|
| **Domino Server** | PHBSVR (CN=PHBSVR/O=PHB) |
| **Sites** | Johor (PanCen) + Penang (Prai) |
| **Total Forms** | **~418+ across 36 department-sites** (originally scoped as 23 IT) |
| **Total DXL/XML Source Files** | ~119 (23 IT + ~69 HR + ~27 QA) |
| **Total Clean HCL PDFs** | **626** (372 Penang + 254 Johor) — organized by site→department |
| **Total Extracted PDFs** | 1,171 |
| **Master Portfolio CSV** | `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` (361 apps) |
| **Departments (Johor)** | 14: FN, HR, IT, LOG, Marketing, MTN, PRC, PRD, Project, QA, QC, SHE, SlsAdmin, STR |
| **Departments (Penang)** | 22: ADMIN, E&I, ENG, FIN, HR, IT, LOG, MKT, MTN, PBI, POM, PRC, PRD, QA, QC, R&D, SA, SEC, SHE, STR, T&D, WH |
| **App Categories** | IT Access & Security, IT Asset & Inventory, IT Service Desk, IT Governance, SAP Governance, HR (Recruitment, Lifecycle, Attendance, Welfare, Compliance), QA/QC (Food Safety, Quality Management, IMS), Procurement, Production, Logistics, SHE, Security, Finance, Store, Training & Development, Warehouse, Marketing, Engineering, Maintenance, R&D |
| **Workflow Forms (IT)** | 8 forms with multi-stage approval workflows (expanding to 30+ across all depts) |
| **Largest Form** | SAP Sign Off Form (~385 fields) — QA PCNFL (661 fields) is actually largest |

### Target (Microsoft 365)
| Item | Details |
|---|---|
| **Microsoft 365 Tenant** | ioioi.sharepoint.com |
| **SharePoint Site** | https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites |
| **Main List (Prai)** | `MainDB_IT` |
| **Main List (Johor)** | `MainDB_IT_JHR` |
| **Extension Lists** | `MainDB_IT_Ext_Access`, `Ext_Assets`, `Ext_Support`, `Ext_SAP`, `Ext_Docs`, `Ext_Infra` |
| **Config Lists** | `Config_Companies`, `Config_Departments`, `Config_ApproverMatrix`, etc. |
| **App Type** | Power Apps new code app (code-first) |
| **Connectors** | SharePoint, Microsoft 365 Users, Office 365 Outlook |
| **Automation** | Power Automate (replacing Domino agents) |

---

## Migration Strategy

### Approach: Single List Per Site with Extension Lists
Instead of creating one SharePoint list per Domino form (23 lists), we consolidate:

1. **One main list per site** (`MainDB_IT` for Prai, `MainDB_IT_JHR` for Johor) — all 28 IT forms share this list, discriminated by `FormCode` column
2. **Extension lists** (`MainDB_IT_Ext_*`) — form-specific extra fields linked via lookup
3. **Config reference lists** (`Config_*`) — shared dropdown data (companies, departments, systems)
4. **Standalone lists** for asset databases (Hardware Inventory via Ext_Assets)

### Why This Approach?
- ✅ Avoids managing 23+ separate lists
- ✅ Single Power App connects to one main list
- ✅ FormCode discriminator enables per-form views
- ✅ Per-site isolation (Prai vs Johor)
- ✅ Extension lists keep main list lean
- ✅ Centralized approval workflows on main list

### Data Flow
```
Domino User → Submits Request → MainDB_IT
                                    ↓
                     +-----------+----------+
                     |                      |
              MainDB_IT_Ext_*      Power Automate Approval
              (form-specific)           |
                     |              Email Notification
                     ↓              Status Update
              Power App Screen ←----+
                                    ↓
                            Email Notification (via Flow)
```

---

## Key Findings from Source Analysis

### 1. EAF (VPN/Citrix) — Most Complex Workflow
- 5-stage approval: Request → Submitted → HOD → COO/Director → Done
- Conditional routing based on `isPCN` flag
- 21 fields, 6 agents, 19 views
- **Priority for migration**

### 2. Hardware Inventory — Largest Asset Database
- 58 fields (Penang), 60 fields (Johor)
- 50+ editable fields per form
- Used by IT for asset tracking across all departments
- **Standalone SharePoint list**

### 3. SAP Sign Off Form — Most Complex Form
- 385+ fields
- Multi-department sign-off workflow
- **Requires special handling** — may need decomposition

### 4. SAP Change Management — 7 SAP-Related Forms
- SAPAMR, SAPCA, SAPCR, SAPDR, SAPLoc, SAPSOF, SAPTR
- 54-field change request form
- Multiple approval chains
- **Can be consolidated into fewer lists**

### 5. IT Service Desk — High Volume
- ITSSR: 1,788 existing documents
- 23 fields, auto-numbering (INO agent)
- Daily operations use
- **First candidate for MVP**

---

## Current Repo Structure

```
C:\Users\AL_AAF\Project\ioi_Docs\
├── .github/
│   ├── instructions/
│   │   └── domino-migration.instructions.md    ← Active agent instructions
│   └── skills/
│       └── domino-migration/SKILL.md           ← Active migration skills
├── source/
│   ├── dxl/                              ← DXL files (HR departments)
│   │   ├── XML_HR_Penang/               ← 44 Penang HR DXL files
│   │   └── XML_HR_Johor/                ← 14 Johor HR DXL files
│   ├── pdf/
│   │   ├── pdf_form_hcl/hcl_form_pdf/   ← 🟢 BEST source: 626 clean HCL form PDFs
│   │   │   ├── PRAI_SITE_FORM/          ← 372 PDFs across 22 departments
│   │   │   │   └── IT/                  ← 28 IT form PDFs (EAF.pdf, HI.pdf, etc.)
│   │   │   ├── JOHOR_SITE_FORM/         ← 254 PDFs across 14 departments
│   │   │   │   └── IT/                  ← 6 Johor IT form PDFs
│   │   │   └── master_app_data_still_needed.csv  ← 361-app portfolio inventory
│   │   └── Latest_Client_provided_file/ ← Raw client-provided archive
│   ├── Project Iventories/              ← Extracted PDF UI exports (1,171 files, fallback)
│   ├── screenshots/                     ← (empty — place screenshots here)
│   └── notes/                           ← (empty — place notes here)
├── analysis/                            ← Field inventory, workflow analysis, evidence reconciliation
├── m365-design/                         ← SharePoint, Power Apps, Power Automate design
├── mapping/                             ← Field mapping CSV + MD, data migration rules
├── docs/                                ← Migration documentation + governance
├── agent/                               ← Agent instructions, skills, checklists (redirect to .github/)
├── ioicodeapp/                          ← Power Apps code-first app repo
│   ├── powerapps-mirror/                ← Scraped code-first app (React + Vite + TS)
│   │   └── apps/ioi-platform/          ← Main app: 28 form schemas, 80+ models, 40+ routes
│   ├── powerapps-bundles-inbox/         ← Source export text bundles (27 files)
│   └── powerapps-screenshots/           ← Power Apps builder screenshots
├── .vscode/                             ← Workspace settings, tasks, extensions
└── .gitignore
```

---

## Broader Portfolio Scope

> The current migration focuses on **23 IT forms** as Wave 1, but the broader Domino estate is significantly larger.

### Full Application Inventory

The `source/Project Iventories/` folder contains a comprehensive inventory of all Domino applications across both sites:

| Metric | Value |
|--------|-------|
| **Total apps still needed** | **361** (232 Penang + 129 Johor) |
| **Extracted embedded PDFs** | **545** UI exports across all departments |
| **Build readiness** | 148 ready for build, 114 review required, 99 blocked |
| **High-confidence PDF matches** | 158 (text-matched, usable as primary UI source) |
| **Mixed-confidence PDF matches** | 58 (usable but should be checked) |
| **Low-confidence PDF matches** | 61 (needs manual validation) |
| **Pending iCloud sync** | 113 (PDFs not yet available) |

### Source Priority (Updated 2026-05-31)

When preparing an app for development, use sources in this **updated priority order**:

1. **🟢 `source/pdf/pdf_form_hcl/hcl_form_pdf/`** — **NEW PRIMARY**: 626 clean HCL PDFs organized by site→department
2. **📄 `master_app_data_still_needed.csv`** — cleanest dev scope with build readiness status
3. **📄 `Final Apps Inventory.xlsx`** — detailed portfolio spreadsheet
4. **🟡 `extracted-embedded-pdfs/`** — fallback for cross-reference (1,171 files, mixed confidence)
5. **📄 `application_pdf_source_mapping.csv`** — per-app source map with PDF paths
6. **📄 `embedded_pdf_application_mapping.csv`** — PDF-to-app join with match confidence
7. **📄 `combined_source_mapping.csv`** — audit view for blueprint readiness

### Departmental Breakdown (non-IT)

| Department (Penang) | App Count | Department (Johor) | App Count |
|---------------------|-----------|---------------------|-----------|
| IMS Related | 104 | QA | 34 |
| HR | 54 | QC | 31 |
| QA | 53 | GHR | 29 |
| Production | 17 | Production | 10 |
| Finance | 16 | Procurement | 8 |

### Strategic Implication

This inventory reveals that the **23 IT forms are ~6% of the total 361 active applications**. The current migration strategy (single list per site + extension lists) was designed for IT forms and may need scaling for the broader portfolio. A normalization layer will be needed since cross-site app equivalence cannot be assumed — only one app title (`Product Spec Code`) overlaps between Penang and Johor.

---

## Current Migration Progress

> **Last Updated**: 2026-05-31 (updated with Phase 1-4 analysis results)

### ✅ Complete
| Area | Details |
|------|---------|
| Domino source analysis | All 23 forms inventoried |
| Workflow analysis | 8 workflow forms documented |
| Field mapping | ~465 fields mapped across 28 form variants |
| Data migration rules | 45 transformation rules defined |
| Evidence reconciliation | 21/23 forms reconciled (SAPSOF + SAPTR partially done) |
| Power Apps code-first app | Built in `powerapps-mirror/apps/ioi-platform/` — not yet deployed |
| PAC CLI | Authenticated to Power Platform |
| Documentation governance | Created — see `docs/documentation-governance.md` |
| **Phase 1-4 analysis** (EAF, ITSSR, HI) | Source analysis, repo inventory, alignment check, redundancy report completed |
| **HI detail page** | `[id].tsx` created with asset info, hardware details, location, notes |
| **EAF schema fix** | `EAF.json` created with correct formCode "EAF", added missing Domino fields (ClientID, Group, HApp), added `spColumn`/`spTable` metadata |
| **HI schema fix** | `HI.json` created with correct formCode "HI", 5 sections, 38 fields with SharePoint column mapping |
| **EAF missing fields** | ClientID, Group, HigherApprover added to `EAFFormInput` type + form UI + submission logic |

### 🔄 In Progress
| Area | Details |
|------|---------|
| SharePoint lists | `MainDB_IT` + `Ext_Access` + `Ext_Support` + `Ext_SAP` exist; `Ext_Assets`, `Ext_Docs`, `Ext_Infra`, `Ext_Policy`, all `Config_*` pending |
| PDF UI inventory | 1,171 PDFs extracted; 34 IT PDFs mapped to forms; needs full population — **blocking ITSSR UI validation** |
| **Old schemas to delete** | `VPNACCESS.json` and `HWINV_PRAI.json` superseded by `EAF.json` and `HI.json` — safe to delete |

### ⬜ Pending
| Area | Details |
|------|---------|
| SharePoint full list creation | Extension lists (Ext_Assets, Ext_Docs, Ext_Infra, Ext_Policy) and config lists not yet created |
| Power Apps deployment | App needs to be deployed to Power Platform environment |
| Power Automate flows | Designed but not built (EAF approval, auto-numbering, ITSSR routing, escalation) |
| Testing & validation | Test plan created (`docs/testing-and-validation.md`) but no tests executed |
| Data migration | Domino data export, transformation, import |
| UAT | Pending SharePoint connection and Power Automate flows |

### Next Steps

#### Immediate (Complete)
1. ✅ Source analysis complete
2. ✅ Workflow analysis complete
3. ✅ SharePoint list design complete
4. ✅ Field mapping complete (CSV + MD)
5. ✅ Power Automate flow design complete
6. ✅ Phase 1-4 analysis (EAF, ITSSR, HI) — see `analysis/phase1-4-*.md`
7. ✅ HI detail page created
8. ✅ EAF schema fixed (VPNACCESS.json → EAF.json)
9. ✅ HI schema fixed (HWINV_PRAI.json → HI.json)
10. ✅ EAF missing fields added (ClientID, Group, HApp)

#### Immediate (Remaining)
11. ⚠️ **Delete old schema files**: `VPNACCESS.json`, `HWINV_PRAI.json`
12. ⚠️ **Create `MainDB_IT_Ext_Assets` SharePoint list** — blocks HI write-back
13. ⚠️ **Verify existing MainDB_IT columns match design**
14. ⬜ **Deploy Power Apps code-first app to Power Platform**
15. ⬜ **Swap mock data service for real SharePoint connector**
16. ⬜ **Build Power Automate flows** (EAF approval first)
17. ⬜ **Populate PDF UI inventory** from IT PDFs (34 files)

#### Development
18. ⬜ Run dev server test (`npm run dev`)
19. ⬜ Unit test each form
20. ⬜ Integration test SharePoint write-back
21. ⬜ User acceptance testing with IT department

#### Rollout
22. ⬜ Pilot with IT department
23. ⬜ Roll out to all departments
24. ⬜ Data migration from Domino
25. ⬜ Go-live and cutover
