# Implementation Plan

> **Updated**: 2026-05-31 — Major revision reflecting actual build state
> **Key Change**: Phase 3 and Phase 4 are substantially further along than originally scoped

---

## Scope Revision

> **⚠️ ORIGINAL SCOPE**: 23 IT forms (20 Penang + 3 Johor)
> **ACTUAL SCOPE**: **~418+ forms across 36 department-sites** (22 Penang + 14 Johor)
>
> This plan was originally written for IT forms only. The full Domino portfolio discovered from
> HCL PDF evidence (`source/pdf/pdf_form_hcl/hcl_form_pdf/`) is significantly larger.
> New phases (Phase 1D, 1E, etc.) are needed for non-IT departments.
> See `analysis/domino-field-inventory.md` for the complete portfolio inventory.

## Phase 0: Environment Setup (Complete ✅)

| # | Task | Status | Notes |
|---|---|---|---|
| 0.1 | VS Code extensions installed | ✅ Done | 15 extensions installed |
| 0.2 | Power Platform CLI verified | ✅ Done | pac v2.7.4 |
| 0.3 | Node.js/npm verified | ✅ Done | v24.16.0 / 11.13.0 |
| 0.4 | Git verified | ✅ Done | — |
| 0.5 | Workspace structure created | ✅ Done | 20+ files created |
| 0.6 | Agent instructions created | ✅ Done | `.instructions.md` + `.github/instructions/` + `.github/skills/` + `.github/agents/` |
| 0.7 | Domino source analysis | ✅ Done | All 23 forms inventoried + workflow analysis completed |
| 0.8 | Evidence reconciliation | ✅ Done | 21/23 forms reconciled (SAPSOF pending) |
| 0.9 | RAQ log initialized | ✅ Done | 8 risks, 8 assumptions, 10 questions logged |
| 0.10 | Documentation governance created | ✅ Done | `docs/documentation-governance.md` — source of truth rules, update rules, inventory |
| 0.11 | Change log created | ✅ Done | `docs/change-log.md` |
| 0.12 | Decision log created | ✅ Done | `docs/decision-log.md` — 7 decisions documented |
| 0.13 | Testing & validation plan created | ✅ Done | `docs/testing-and-validation.md` |

## Phase 1: SharePoint List Creation (Partially Complete 🔄)

> **Architecture**: `MainDB_IT` is the **parent list** per site (Prai). `MainDB_IT_JHR` is the parent for Johor.
> No `MainDB_Master` list is needed — `MainDB_IT` itself is the main list, with `FormCode` column as the discriminator.
> Extension lists (`MainDB_IT_Ext_*`) hold form-specific data linked via lookup to `MainDB_IT`.

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 1.1 | **Create `MainDB_IT` list** on SharePoint | You | SharePoint access | 30 min | ✅ Done | List exists (may need column audit) |
| 1.2 | **Add columns to `MainDB_IT`** via `Add-MainDB_IT-Columns.ps1` | You/AI | 1.1 | 1 hr | 🔄 In progress | Verify existing columns match design |
| 1.3 | **Create `MainDB_IT_JHR` list** (Johor — same schema, 2 extra HI columns: `Site`, `Building/Level`) | You | 1.1 | 30 min | ✅ Script ready — run `Create-MainDB_IT_JHR.ps1` | **Activation sequence:** 1. Run `.\Create-MainDB_IT_JHR.ps1` (creates list + core columns + calls column script) 2. Run `.\create-all-maindb-it-views.ps1` (creates FormCode-filtered views) 3. Add `MainDB_IT_JHR` as data source in Power Apps Studio 4. Copy GUID → update `power.config.json` → replace placeholder |
| 1.4 | **Create extension lists** (linked to MainDB_IT via lookup): | You/AI | 1.1 | 2 hr | ⚠️ Partial | Some extension lists exist |

    | Extension List | Purpose | Forms | Existing Script |
    |---|---|---|---|
    | `MainDB_IT_Ext_Access` | Access-specific fields | EAF, NIR, RS, SFAR, UR | `Add-PRF-Workflow-Columns.ps1` ✅ |
    | `MainDB_IT_Ext_Assets` | Hardware specs, purchase info | HI, 1_HWInv_NewInv | Needs creation |
    | `MainDB_IT_Ext_Support` | Case tracking, SLA, PIC | ITSSR, PRF, IAL1-5, ITDR | `Add-MainDBITExtSupport-Columns.ps1` ✅ |
    | `MainDB_IT_Ext_SAP` | SAP routing, change details | SAPAMR, SAPCA, SAPCR, SAPSOF, SAPTR | `Add-SAPCR-Columns.ps1` ✅ |
    | `MainDB_IT_Ext_Docs` | Document metadata | IOIP, ITI, ITP, ITP2 | Needs creation |
    | `MainDB_IT_Ext_Infra` | Server/DR monitoring | ITSC, SAPDRP | Needs creation |
    | `MainDB_IT_Ext_Policy` | Policy content | IOIP POLICY | ✅ Created (63 columns) |

| 1.5 | **Create config/reference lists**: | You/AI | 1.1 | 1 hr | ⬜ Pending |

    | Config List | Purpose |
    |---|---|
    | `Config_Companies` | Company master list (20+ companies) |
    | `Config_Departments` | Department master list (35+ depts) |
    | `Config_ApproverMatrix` | Approval routing rules |
    | `IT_M1_RS_SystemsList` | System reference for RS form |
    | `IT_M1_RS_Banks` | Bank reference for RS form |
    | `IT_M1_SFAR_Servers` | Server reference for SFAR form |

| 1.6 | **Create SharePoint views** via `create-all-maindb-it-views.ps1` | You/AI | 1.1-1.5 | 30 min | ⬜ Pending |
| 1.7 | **Configure list permissions** (IT Admins: Full Control, Dept Heads: Contribute, Users: Read) | You | 1.1-1.5 | 1 hr | ⬜ Pending |
| 1.8 | **Enable versioning** (MainDB_IT: 50 versions, Ext lists: 25 versions) | You | 1.1-1.5 | 30 min | ⬜ Pending |

### Phase 1B: HR Department Lists (New ✅)

> **Architecture**: Same pattern as IT — `MainDB_HR` (Penang) + `MainDB_HR_JHR` (Johor) main lists with `FormCode` discriminator, plus 8 extension lists per functional category.
> **Design reference**: `analysis/hr-data-source-analysis.md`
> **Scripts created**: `Create-HR-Lists.ps1`, `Add-HR-Columns.ps1`, `create-all-hr-views.ps1`

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 1.9 | **Run `Create-HR-Lists.ps1`** — creates MainDB_HR, MainDB_HR_JHR + 8 ext lists | You/AI | HR SharePoint site access | 15 min | ⬜ Pending | Site: `https://ioioi.sharepoint.com/sites/ioi-portal-hr` |
| 1.10 | **Run `Add-HR-Columns.ps1`** — adds all core + prefixed columns to HR lists | You/AI | 1.9 | 30 min | ⬜ Pending | Idempotent — skips existing columns |
| 1.11 | **Run `create-all-hr-views.ps1`** — creates FormCode-filtered views for HR | You/AI | 1.9-1.10 | 15 min | ⬜ Pending | 26 Penang + 16 Johor form code views |
| 1.12 | **Configure HR list permissions** (HR Admins: Full Control, HODs: Contribute, All Employees: Read) | You | 1.9 | 1 hr | ⬜ Pending |

### HR Lists Created

| List | Purpose | Form Codes |
|---|---|---|
| **MainDB_HR** | Penang HR — main list | 26 form codes (AWHR, BSD, CIR, ..., TNPRA) |
| **MainDB_HR_JHR** | Johor HR — main list | 16 form codes (PCNBkStf, cancomp, ..., PCNDriver) |
| **MainDB_HR_Ext_Staffing** | Recruitment & staffing | SR, manpowerReq, FTCR, CWR, INTERVIEWDB |
| **MainDB_HR_Ext_Lifecycle** | Employee lifecycle | EEN, EPDU, EPHR, INTERN, PAF |
| **MainDB_HR_Ext_Attendance** | Attendance & discipline | AWHR, DRD, NDF, LateComing, NightVisit |
| **MainDB_HR_Ext_ForeignWorker** | Foreign workers | FWWPD, FWWPE, OWP, TNPRA, TyphoidVacc, UniformReq |
| **MainDB_HR_Ext_OrgStructure** | Org structure | ORGCHART, PCNOrgChart, JD, pcnjd |
| **MainDB_HR_Ext_Welfare** | Welfare & facilities | BSD, PCNBkStf, CIR, cancomp, GDSN, HEALTHINFO |
| **MainDB_HR_Ext_Compliance** | Compliance & training | PCNTND, TMPU, ContractorReg |
| **MainDB_HR_Ext_Operations** | Internal HR ops | HRINFO, HRAPR, ESF, hostela, workins, SpVisit, PCNDriver |

### Phase 1C: QA & QC Department Lists (Analysis Complete ✅)

> **Design reference**: `analysis/qa-qc-data-source-analysis.md`
> **Status**: Analysis complete — scripts pending

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 1.13 | **Analyze QA/QC data sources** (DXL + PDF) | AI | — | 2 hr | ✅ Complete | 27 Johor QA DXL files, ~271 PDFs across 4 site/dept combos |
| 1.14 | **Create QA/QC analysis report** | AI | 1.13 | 1 hr | ✅ Complete | `analysis/qa-qc-data-source-analysis.md` |
| 1.15 | **Create QA/QC SharePoint list scripts** | AI | 1.14 | 2 hr | ⬜ Pending | 4 main lists + 8 extension lists |
| 1.16 | **Run QA/QC list creation** | You/AI | 1.15 | 30 min | ⬜ Pending | On `https://ioioi.sharepoint.com/sites/ioi-portal-hr` or new QA site |

### QA/QC Lists Planned

| List | Purpose | Forms |
|---|---|---|
| **MainDB_QA_JHR** | Johor QA — main list | 27 forms (PCNFL, DataAnalyst, deptkrakpi, QEN, ..., PCNSNHManual) |
| **MainDB_QC_JHR** | Johor QC — main list | 29 forms (PFAD, FJBInsp, PISOSOP, ..., PCNHAS) |
| **MainDB_QA** | Penang QA — main list | 46 forms (APISHIP, ASNHACCP, BRD, ..., WI) |
| **MainDB_QC** | Penang QC — main list | 22 forms (CHEMSHERPA, COD, COI, ..., STIR) |
| **MainDB_QA_Ext_IMS** | IMS document management | SOP, WI, QM, LTM, QP, PQP, SDS, Manuals |
| **MainDB_QA_Ext_CAPA** | Corrective actions | ICAR, NCR, OFI, PAR, QACAR |
| **MainDB_QA_Ext_Records** | Master lists & records | Master lists, QA Info, KRA/KPI |
| **MainDB_QC_Ext_Lab** | Laboratory management | QC Lab forms, Calibration, Sensory |
| **MainDB_QA_Ext_Assessment** | Assessment & audit | Data Analysis, Food Defence, GMP Survey |
| **MainDB_QA_Ext_Product** | Product quality | Tanker Inspection, PFAD, CCCAR, DIR |
| **MainDB_QA_Ext_HalalCert** | Halal & certification | Halal, SDS, Certification |
| **MainDB_QA_Ext_ChangeControl** | Change control & validation | Change Control, Validation Reports |

## Phase 2: Power Platform Connection (Complete ✅)

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 2.1 | `pac auth create` to connect to Power Platform | You | PAC installed | 15 min | ✅ Done | PAC CLI authenticated |
| 2.2 | Verify environment connection (`pac who`) | You | 2.1 | 5 min | ✅ Done | Connection verified |
| 2.3 | Select target environment (`pac org select`) | You | 2.1 | 5 min | ✅ Done | Environment selected |

## Phase 3: Field Mapping (Substantially Complete ✅)

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 3.1 | Map EAF (VPN/Citrix) fields | AI + You | 1.1 | 2 hr | ✅ Complete | 32/32 fields mapped |
| 3.2 | Map ITSSR fields | AI + You | 1.1 | 1 hr | ✅ Complete | 23/23 fields mapped |
| 3.3 | Map PRF fields | AI + You | 1.1 | 1 hr | ✅ Complete | 23/23 fields mapped |
| 3.4 | Map SFAR fields | AI + You | 1.1 | 1 hr | ✅ Complete | 26/26 fields mapped |
| 3.5 | Map Hardware Inventory fields | AI + You | 1.4 | 3 hr | ✅ Complete | 58/58 fields mapped |
| 3.6 | Map SAP Change Request fields | AI + You | 1.5 | 2 hr | ✅ Complete | 54/54 fields mapped |
| 3.7 | Create data migration rules | AI + You | 3.1-3.6 | 2 hr | ✅ Complete | 45 transformation rules defined |
| 3.8 | Map remaining IT forms (NIR, RS, IOIP, ITI, ITP, ITSC, SAPAMR, SAPCA, SAPDRP, SAPSLCF, SAPTR) | AI + You | — | 2 hr | ✅ Complete | 11 additional forms mapped |

## Phase 4: Power Apps Code-First App (Built ✅ — Needs Deployment)

> **Note**: The entire Phase 4 has been pre-built in `powerapps-mirror/apps/ioi-platform/`. Tasks below show what exists.
> **⚠️ Known Gap**: The `powerapps-mirror` was scraped from the Power Apps builder UI. The `powerapps-bundles-inbox/` folder contains the original source export text bundles which should be used as the authoritative source for rebuilding if needed.
> **⚠️ Dual Code Path**: The `ioicodeapp/apps/ioi-platform/` folder contains an older project stub; the active app is under `ioicodeapp/powerapps-mirror/apps/ioi-platform/`.

| # | Task | Status | Notes | Code Location |
|---|---|---|---|---|
| 4.1 | App scaffolding (React + Vite + TypeScript + shadcn/ui) | ✅ Done | Full project with 40+ routes | `powerapps-mirror/apps/ioi-platform/` |
| 4.2 | HomeScreen with department selector hub | ✅ Done | Department cards, module navigation | `src/pages/department-hub.tsx` |
| 4.3 | Department pages (IT, HR, FIN, QA, QC, SHE, etc.) | ✅ Done | 23 department page routes | `src/pages/{dept}/index.tsx` |
| 4.4 | IT forms landing page (M1-M7 modules) | ✅ Done | 28 forms organized by module | `src/pages/it/forms/index.tsx` |
| 4.5 | EAF (VPN/Citrix) form — list + create + detail | ✅ Done | Multi-step wizard, 5-stage workflow | `src/pages/it/forms/eaf/` |
| 4.6 | ITSSR form — list + create + detail | ✅ Done | Full support ticket system | `src/pages/it/forms/itssr/` |
| 4.7 | Hardware Inventory form — list + create | ✅ Done | Asset tracking screens | `src/pages/it/forms/hi/` |
| 4.8 | NIR, RS, PRF, SFAR forms — list + create + detail | ✅ Done | All M1-M2 forms | `src/pages/it/forms/{nir,rs,prf,sfar}/` |
| 4.9 | SAP forms (SAPAMR, SAPCA, SAPCR, SAPSOF2, SAPTR, etc.) | ✅ Done | All SAP governance forms | `src/pages/it/forms/{sapamr,sapca,...}/` |
| 4.10 | Approval screens | ✅ Done | Stage-gated approval UI | `src/pages/it/approvals/` |
| 4.11 | My submissions screen | ✅ Done | User's own requests view | `src/pages/my-submissions.tsx` |
| 4.12 | Form schemas (JSON) for all IT forms | ✅ Done | 28 form schemas in `form-schemas/` | `src/form-schemas/*.json` |
| 4.13 | Generated models/services/hooks | ✅ Done | 80+ model files, services, React Query hooks | `src/generated/` |
| 4.14 | SharePoint submission service (mock) | ✅ Done | All 28 form codes, workflow stages, SLA tracking | `src/services/sharepoint-submission-service.ts` |
| 4.15 | Office 365 Users + Outlook email services | ✅ Done | User profile, email sending | `src/services/` |
| 4.16 | Dynamic form renderer | ✅ Done | Schema-driven form generation | `src/components/dynamic-form/` |
| **4.17** | **Comprehensive Phase 1-4 analysis** (EAF, ITSSR, HI) | ✅ **Done 2026-05-31** | Identified gaps, misalignments, missing fields, schema mismatches | `analysis/phase1-4-*.md` |
| **4.18** | **Created HI detail page** `[id].tsx` | ✅ **Done 2026-05-31** | HI was missing detail/view page | `src/pages/it/forms/hi/[id].tsx` |
| **4.19** | **Fixed EAF schema** (VPNACCESS.json → EAF.json) | ✅ **Done 2026-05-31** | Wrong formCode "VPNACCESS" vs actual "EAF"; added missing Domino fields (ClientID, Group, HApp) | `src/form-schemas/EAF.json` |
| **4.20** | **Fixed HI schema** (HWINV_PRAI.json → HI.json) | ✅ **Done 2026-05-31** | Wrong formCode "HWINV_PRAI" vs actual "HI"; expanded to 5 sections, 38 fields | `src/form-schemas/HI.json` |
| **4.21** | **Added missing Domino fields to EAF type + UI** | ✅ **Done 2026-05-31** | ClientID, Group, HigherApprover added to EAFFormInput + form UI | `src/types/m1-forms.ts`, `src/pages/it/forms/eaf/new.tsx` |
| **4.22** | **Deploy app to Power Platform** | ⬜ **Next** | Depends on Phase 1 + 2 | — |
| **4.23** | **Swap mock storage for real SharePoint connector** | ⬜ **Next** | Depends on Phase 1.2 (MainDB_IT creation) | — |
| **4.24** | **Test MVP with sample data** | ⬜ **Next** | After SharePoint connection | — |

### UI Specification Compliance (from `docs/ui-page-specification.md`)

| # | Task | Status | Notes | Code Location |
|---|---|---|---|---|
| 4.25 | **Fix `DatabaseTable.StatusBadge`** — replaced hardcoded hex with centralized `getStatusStyle` from `color-tokens.ts` | ✅ Done 2026-05-31 | Removed duplicate status color definitions | `src/components/database-view/database-table.tsx` |
| 4.26 | **Fix `module-home-layout.tsx` `getStatusBadge`** — replaced hardcoded switch with centralized `statusConfig` | ✅ Done 2026-05-31 | Now covers all 60+ status keys | `src/components/it/module-home-layout.tsx` |
| 4.27 | **EAF `[id].tsx` already redirects** to canonical `/submissions/:id` | ✅ Already done | Re-exports from canonical detail page | `src/pages/it/forms/eaf/[id].tsx` |
| 4.28 | **Migrate ITSSR new form** to `FormSubmissionLayout` canonical pattern | ⬜ TODO | Currently uses custom multi-step; should match EAF pattern | `src/pages/it/forms/itssr/new.tsx` |
| 4.29 | **Migrate PRF new form** to `FormSubmissionLayout` canonical pattern | ⬜ TODO | High-priority M2 form | `src/pages/it/forms/prf/new.tsx` |
| 4.30 | **Migrate HI new form** to `FormSubmissionLayout` canonical pattern | ⬜ TODO | Medium-priority M3 form | `src/pages/it/forms/hi/new.tsx` |
| 4.31 | **Migrate SAP form pages** (sapamr, sapca, sapcr, sapsof2, saptr) to `FormSubmissionLayout` | ⬜ TODO | Various custom implementations; evaluate per form | `src/pages/it/forms/sap*/new.tsx` |
| 4.32 | **Migrate M1 dynamic forms** (RS, SFAR, UR) from `DynamicFormRenderer` to `FormSubmissionLayout` | ⬜ TODO | `DynamicFormRenderer` is adequate for simple forms — evaluate need | `src/pages/it/forms/{rs,sfar,ur}/new.tsx` |
| 4.33 | **Consolidate status badge styling** — verify all badge usages use `status-utils.ts` / `color-tokens.ts` only | ⬜ TODO | Audit all `Badge` components for inline styles | `src/**/*.tsx` |
| 4.34 | **Converted SRL/IAL1, ITE/IAL3, SRVR/IAL4, DRR/IAL5** to `DynamicFormRenderer` | ✅ Done 2026-05-31 | Had complete configs; no extension records needed | `src/pages/it/forms/{srl,ite,srvr,drr}/new.tsx` |
| 4.35 | **Fixed generic `[formCode]/index.tsx`** to use `DatabaseTable` | ✅ Done 2026-05-31 | Was using card-based list; now uses canonical table with search/filter/sort | `src/pages/it/forms/[formCode]/index.tsx` |
| 4.36 | **Migrate complex forms** (PRF, HI, NIR, ITSSR, HWRR, Asset-submission, SAPAMR, SAPCA, SAPCR, SAPTR, SAPSOF2) to `FormSubmissionLayout` | ⬜ TODO | Custom multi-step implementations need significant refactoring | `src/pages/it/forms/{prf,hi,nir,itssr,hwrr,asset-submission,sap*}/new.tsx` |
| 4.37 | **Migrate custom simple forms** (SRR, ISGDOC, TRNMAN, ITINFO, MPSPRN, ITDR, ITDR2) to `DynamicFormRenderer` | ⬜ TODO | Need ITFormConfig definitions created first | `src/pages/it/forms/{srr,isgdoc,trnman,itinfo,mpsprn,itdr,itdr2}/new.tsx` |
| 4.38 | **Convert form-specific `[id].tsx` to canonical** — RS, SFAR, UR, SRVR, SAPAMR, SAPCA, SAPCR, SAPTR, SAPSOF2, HI, HWRR, IOIP, ITSC | ⬜ TODO | Currently have custom detail pages; should redirect to `/submissions/:id` | `src/pages/it/forms/*/[id].tsx` |
| 4.39 | **Convert form-specific `index.tsx` (list views)** to use `DatabaseView` — ITSSR index | ⬜ TODO | ITSSR uses custom `ITSSRListScreen`; evaluate merge | `src/pages/it/forms/itssr/index.tsx` |

## Phase 5: Power Automate Flows (Designed — Not Yet Built)

| # | Task | Owner | Dependencies | Effort | Status | Notes |
|---|---|---|---|---|---|---|
| 5.1 | Create EAF multi-stage approval flow | You/AI | 1.1 | 3 hr | ⬜ Pending | Design complete in `m365-design/power-automate-design.md` |
| 5.2 | Create auto-numbering flow (replaces INO agent) | You/AI | 1.1 | 1 hr | ⬜ Pending | Design complete |
| 5.3 | Create ITSSR category routing flow | You/AI | 1.1 | 1 hr | ⬜ Pending | Design complete |
| 5.4 | Create escalation/reminder flows | You/AI | 1.1 | 1 hr | ⬜ Pending | Design complete |
| 5.5 | Create PRF ISG assignment flow | You/AI | 1.1 | 1 hr | ⬜ Pending | Replaces PRF SET + HR agents |
| 5.6 | Create SAPCR approval chain flow | You/AI | 1.1 | 2 hr | ⬜ Pending | Multi-department approval |

## Phase 6: Testing & Validation

| # | Task | Owner | Dependencies | Effort | Status |
|---|---|---|---|---|---|
| 6.1 | Local dev server test (`npm run dev`) | You | 4.17 | 1 hr | ⬜ Pending |
| 6.2 | Unit test each form in Power App | You | 4.19, 5.1-5.6 | 4 hr | ⬜ Pending |
| 6.3 | UAT with IT department pilot | You + IT | 6.2 | 1 day | ⬜ Pending |
| 6.4 | Fix issues from UAT | You | 6.3 | 2 hr | ⬜ Pending |
| 6.5 | Roll out to all departments | You | 6.4 | 1 day | ⬜ Pending |

## Phase 7: Data Migration & Go-Live

| # | Task | Owner | Dependencies | Effort | Status |
|---|---|---|---|---|---|
| 7.1 | Export Domino data to CSV | You | Domino access | 2 hr | ⬜ Pending |
| 7.2 | Transform data per mapping rules | You/AI | 3.7 | 4 hr | ⬜ Pending |
| 7.3 | Import to SharePoint lists | You | 7.2 | 2 hr | ⬜ Pending |
| 7.4 | Verify data integrity | You | 7.3 | 2 hr | ⬜ Pending |
| 7.5 | Cutover communication | You | — | 1 hr | ⬜ Pending |

---

## Prerequisites
- [ ] Access to https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites (✅ You have it)
- [ ] Power Platform environment access with Dataverse (✅ Admin access)
- [ ] PAC CLI authenticated (⬜ Next step — Phase 2.1)
- [ ] Power Apps license (Premium for connectors)

## Dependencies
- Approval connector requires Power Apps Premium license
- Microsoft 365 Users connector may need admin consent
- SharePoint list creation requires site owner permissions

## Risks
| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Domino data export not available | High | Medium | Use DXL/XML as source of truth |
| Complex SAP Sign Off form (385 fields) | Medium | High | Decompose into sub-forms |
| Approval connector licensing | Medium | Medium | Use SharePoint email notifications as fallback |
| User adoption resistance | Medium | Low | Pilot with IT dept first |
| Missing Domino agent logic | Medium | Low | Review code in XML carefully |
| Power App may not work identically in Power Platform vs Vite dev | Medium | Medium | Test early in target environment |
