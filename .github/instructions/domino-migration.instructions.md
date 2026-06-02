---
description: |
  Domino-to-M365 migration for IOI Group (~418+ forms across 36 department-sites).
  Use when: migrating Lotus/HCL Domino applications to Microsoft 365; analyzing
  ITSSR, EAF, Hardware Inventory, SAP Sign Off, or any IOI Domino form; working
  with DXL/XML source files under source/dxl/; processing PDF UI exports from
  source/pdf/pdf_form_hcl/hcl_form_pdf/; designing SharePoint lists named
  MainDB_{Dept}; building Power Apps code-first apps connected to SharePoint;
  creating Power Automate flows to replace Domino agents; mapping Domino fields
  to M365 columns; performing evidence reconciliation between DXL and PDF sources;
  referencing the full portfolio inventory, EAF 5-stage workflow, or department lists.
name: domino-migration
---

# Domino → M365 Migration — IOI Group

You are helping migrate HCL/Lotus Domino applications to Microsoft 365 for IOI Group.

## Project Context

- **Repo**: `C:\Users\AL_AAF\Project\ioi_Docs`
- **Domino Source DXL**: Files under `source/dxl/` (IT, HR, QA/QC DXL exports)
- **PDF UI Exports**: 626 clean HCL PDFs under `source/pdf/pdf_form_hcl/hcl_form_pdf/` organized by site→department, plus 1,171 extracted PDFs
- **Total Forms**: **~418+ across 36 department-sites** (22 Penang departments + 14 Johor departments)
- **Target**: Department-specific SharePoint Lists + Power Apps code-first app + Power Automate
- **SharePoint Site (Admin)**: `https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites`
- **SharePoint Site (IT)**: `https://ioioi.sharepoint.com/sites/ioi-portal-it`
- **SharePoint Site (HR)**: `https://ioioi.sharepoint.com/sites/ioi-portal-hr`
- **Main List (IT-Prai)**: `MainDB_IT` — all IT forms, `FormCode` column discriminates form type
- **Main List (IT-Johor)**: `MainDB_IT_JHR` — duplicate schema for Johor site
- **Main List (HR-Prai)**: `MainDB_HR` — all HR forms, `FormCode` column discriminator
- **Main List (HR-Johor)**: `MainDB_HR_JHR` — duplicate schema for Johor site
- **Other Department Lists**: `MainDB_FIN`, `MainDB_PRD`, `MainDB_SHE`, `MainDB_QA`, `MainDB_STR` (with pattern for other departments)
- **Extension Lists**: Per-department extension lists (e.g., `MainDB_IT_Ext_*`, `MainDB_HR_Ext_*`)
- **Connectors**: SharePoint, Microsoft 365 Users

## Source Locations

| Location | Contents |
|----------|----------|
| `source/dxl/` | Domino DXL/XML export files |
| `source/pdf/` or `source/Project Iventories/extracted-embedded-pdfs/` | PDF UI exports |
| `source/screenshots/` | Screenshots of existing Domino UIs |
| `source/notes/` | Notes and observations about source apps |

## Analysis Files (in `analysis/`)

| File | Purpose |
|------|---------|
| `domino-field-inventory.md` / `.csv` / `.json` | Inventory of all fields/forms in Domino source |
| `pdf-ui-inventory.md` | UI element inventory from PDF exports |
| `evidence-reconciliation.md` | Cross-reference between DXL evidence and PDF evidence |
| `workflow-analysis.md` | Analysis of Domino workflows |

## Design Files (in `m365-design/`)

| File | Purpose |
|------|---------|
| `sharepoint-list-design.md` | SharePoint list schema designs |
| `powerapps-design.md` | Power Apps app design |
| `power-automate-design.md` | Power Automate flow designs |

## Mapping Files (in `mapping/`)

| File | Purpose |
|------|---------|
| `field-mapping.csv` | Field-by-field Domino → M365 mapping |
| `field-mapping.md` | Detailed field mapping documentation |
| `data-migration-rules.csv` | Data transformation rules |

## Repo Knowledge Base

Before creating any new file, reading any source, or making any migration decision, **first read**:
- **`docs/repo-knowledge-base.md`** — authoritative folder inventory, governance rules, placement rules, archive/temp conventions
- **`docs/central-form-reference.md`** — **⚠️ ALWAYS consult this document first** before editing, reviewing, refactoring, or creating any form-related code, schema, or configuration. This is the single source of truth for all form definitions, sections, fields, workflows, and data connections.

These documents prevent duplicates, misplaced files, and incorrect assumptions.

## Documentation (in `docs/`)

| File | Purpose |
|------|---------|
| `repo-knowledge-base.md` | 🆕 Authoritative repo folder inventory and governance |
| `migration-documentation.md` | Overall migration documentation |
| `implementation-plan.md` | Step-by-step implementation plan |
| `risks-assumptions-questions.md` | RAQ log |

## Full Form Inventory — All Departments

> **Note**: 23 IT forms were originally analyzed but the full Domino portfolio spans **~418+ forms across 36 department-sites**.
> See `analysis/domino-field-inventory.md` for the complete form-by-form inventory with field counts.
> See `source/pdf/pdf_form_hcl/hcl_form_pdf/master_app_data_still_needed.csv` (361 apps) for the authoritative app portfolio.

### Site Departments Overview

| Site | Departments | PDF Count | Est. Forms |
|------|------------|-----------|------------|
| **Penang (Prai)** | ADMIN, E&I, ENG, FIN, HR, IT, LOG, MKT, MTN, PBI, POM, PRC, PRD, QA, QC, R&D, SA, SEC, SHE, STR, T&D, WH | **372** | ~240+ |
| **Johor (PanCen)** | FN, HR, IT, LOG, Marketing, MTN, PRC, PRD, Project, QA, QC, SHE, SlsAdmin, STR | **254** | ~180+ |
| **Total** | **36 department-sites** | **626** | **~418+** |

### Penang IT (28 Forms — Most Complex)

| # | Form Code | Display Name | Fields | Workflow | Priority |
|---|-----------|-------------|-------|----------|----------|
| 1 | **EAF** | External Access Form (VPN & Citrix) | 21 | ✅ 5-stage | Highest |
| 2 | **HI** | Hardware Inventory | 58 | ❌ No | High |
| 3 | **IAL1-5** | IT Activity Log (5 variants) | 16 ea. | ✅ 2-stage | Medium |
| 4 | **IOIP** | IOI Policy | 10 | ❌ No | Low |
| 5 | **ITDR** | IT Report | 3 | ❌ No | Medium |
| 6 | **ITDR2** | IT Report v2 | 3 | ❌ No | Medium |
| 7 | **ITI** | IT Info | 3 | ✅ 2-stage | Low |
| 8 | **ITP/ITP2** | IT Procedures/Training | 10 | ❌ No | Low |
| 9 | **ITSC** | IT Server Checklist | 27 | ❌ No | Medium |
| 10 | **ITSSR** | IT Support & Service Request | 23 | ✅ 3-stage | Highest |
| 11 | **NIR** | Notes ID Request | 27 | ✅ 4-stage | High |
| 12 | **PRF** | Program Request Form | 23 | ✅ 6-stage | High |
| 13 | **RS** | Reset Password/Unlock ID | 21 | ✅ 3-stage | High |
| 14 | **SAPAMR** | SAP Authorisation Matrix | 26 | ✅ 3-stage | High |
| 15 | **SAPCA** | SAP Config Access | 16 | ✅ 4-stage | Medium |
| 16 | **SAPCR** | SAP Change Request | 54 | ✅ 4+ stage | High |
| 17 | **SAPDRP** | SAP DRP | 5 | ✅ 3-stage | Medium |
| 18 | **SAPSLCF** | SAP Storage Location | 11 | ❌ No | Medium |
| 19 | **SAPSOF** | SAP Sign Off | 385+ | ✅ 5+ stage | High |
| 20 | **SAPTR** | SAP Transport Request | 34 | ❌ No | Medium |
| 21 | **SFAR** | Share Folder Access Requisition | 26 | ✅ 3-stage | High |
| 22 | **UR** | User ID Request | ~20 | ❌ No | Medium |

### Penang HR (26 Forms)

| # | Form Code | Form Name | Est. Fields | Workflow |
|---|-----------|-----------|-------------|----------|
| 1 | **AWHR** | Rest Day & Additional Working Hours | ~50 | ✅ Multi-stage |
| 2 | **BSD** | Backup Staff Database | ~25 | ✅ HOD Approval |
| 3 | **CIR** | Cafeteria Inspection Database | ~40 | ✅ HOD/Committee |
| 4 | **CWR** | Contract Worker Requisition | ~50 | ✅ Multi-stage |
| 5 | **DRD** | Duty Roster Database | ~20 | ✅ HOD Approval |
| 6 | **EEN** | Employee Exit Notification | ~25 | ✅ ED Approval |
| 7 | **EPDU** | Employee Personal Detail Update | ~30 | ❌ Self-service |
| 8 | **EPHR** | Employee Personal Health Records | ~15 | ❌ Record only |
| 9 | **ESF** | Employee Survey | ~15 | ❌ Anonymous |
| 10 | **FTCR** | Fixed Term Contract Requisition | ~30 | ✅ HOD/HR |
| 11 | **FWWPD** | Foreign Workers Work Permit | ~60 | ✅ Multi-stage |
| 12 | **FWWPE** | Foreign Worker Work Period Extension | ~20 | ✅ HOD/HR |
| 13 | **GDSN** | Gift-Donation-Sponsorship Requisition | ~25 | ✅ HOD/COO |
| 14 | **HEALTHINFO** | Health Info | ~10 | ❌ Info only |
| 15 | **HRAPR** | HR Applications Problem Reporting | ~15 | ✅ IT/HR |
| 16 | **HRINFO** | HR Notice Database | ~8 | ❌ Notice board |
| 17 | **INTERN** | Industrial Trainees Summary | ~20 | ✅ HOD |
| 18 | **INTERVIEWDB** | Interview Database | ~15 | ❌ Record only |
| 19 | **JD** | Job Descriptions | ~50 | ✅ Multi-stage |
| 20 | **NDF** | Night Duty Findings | ~25 | ✅ HOD |
| 21 | **ORGCHART** | Organisation Charts | ~30 | ✅ COO Approval |
| 22 | **OWP** | Outsource Worker Passport & Work Permit | ~35 | ✅ Multi-stage |
| 23 | **PAF** | Performance Appraisal Request | ~80 | ✅ HOD/HR |
| 24 | **SR** | Staff Requisition | ~40 | ✅ Multi-stage |
| 25 | **TMPU** | Talent Management Planning & Update | ~60 | ✅ Multi-stage |
| 26 | **TNPRA** | Typhoid/NPRA Database | ~30 | ✅ HOD/HR |

### Penang Finance (5+ Forms)
CAR (Capital Appropriation), CMF_A/B/C (Credit Management), EARF, RSES

### Penang Procurement/PRC (23+ Forms)
KOSHER, MAM1-4, MER, MSP, NCFV, RSPO, TAF, VAR1-2, VCAR, VCSR, VDR, VQA1-2, VRF1-2, and more

### Penang QA (~55+ Forms)
APISHIP, ASNHACCP1-5, BRD1-4, CC1-6, CCCAR, CEAR1-2, CIPR1-3, CRRF, CUSTQ1-2, DIR, DOR, FDM1-3, FFSM1-5, FLKRA, ICAR, IMSHALAL, IMSQSHE, LTM, MLFG, MLR, MQP, NCR1-4, OFI, PAR, PMRR1-4, POM, PPR, PQP, PT, SECDOC, SMF1-4, SOP, SRR, TQM1-3, VALIDATIONREPORT1-7, WI, and more

### Penang QC (36+ Forms)
CHEMSHERPA, COD, COI, ECMPDS, EMTRN, ISOOFI, ISORI_1-10, LABOOS, LABQMISO, LABSURVEY, LWR, MLE, NCRISO, PCQI, PQCAR, PSC, QCINFO, QCNTR, QCPAR, RMAM, RNMR, STIR

### Remaining Penang Departments
| Dept | Forms | Examples |
|------|-------|---------|
| **ADMIN** | 4 | DAR, RAR, SRS, SRS_SF |
| **E&I** | 6 | CALI, ECMCALI, ISO50001BR/NCR/SOP, PRODSYSMOD |
| **ENG** | 1 | ENGSR |
| **LOG** | 15 | ECMFORKLIFT, FORKLIFT1-4, IMDG, POD, SHUNTINGTRUCK1-3, TANKERWASH1-3, WCC1-2 |
| **MKT** | 5 | ACMPDS, ACMSE, CO, MKTCD, MKTVCR |
| **MTN** | 9 | EE, ENMS1-2, EQUIPPREINS, FAR, MTNEMGNCY, MTNPLAN1-2, PLANTMTN |
| **PBI** | 1 | PBISOPWI |
| **POM** | 1 | VCARPOM |
| **PRD** | 11 | ASMR, CCP1, EPIR, PMD, PSMR, RMTC, SAM, SAPMMM, STVF |
| **R&D** | 6 | NEWPRDREQ, RNDDB, RNDPRJ |
| **SA** | 1 | CARGO |
| **SEC** | 6 | CCTVPR, CSL, TCCI, TLCICAR, TPR, WT |
| **SHE** | 22 | 5SIR, EI, FEED, HIRADC, INSW, IPPE, RLOD, SDS, SHEAI, SHEARO, SHECP, SHED, SHEFAIC, SHEFAR, SHEGO, SHEIA, SHEICAR, SHEINFO, SHEIOC, SHEOFI, SHESR, SHETBR |
| **STR** | 16 | ACMSTR, IFSSH, IMSI, MDNF, ODFM, SDCI, SIC, SII, SIROP, SIU, SLED, SRRI1-2, STIDS |
| **T&D** | 11 | AFT, ETA, ITA, OJT, PTE, TA, TB, TI, TNDP |
| **WH** | 16 | CST, CVA, ECMPCR1-6, ISOTANK, MDINFO1-2, PCR, QUOTATIONMD, SAPIAAF1-2, SHIPMENT |

### Johor Departments
| Dept | Est. Forms | Notes |
|------|-----------|-------|
| **FN (Finance)** | 5 | CAR, credit management (3), insurance claim |
| **HR** | 16 | PCNBkStf, cancomp, ContractorReg, TyphoidVacc, UniformReq, pcnjd, LateComing, manpowerReq, NightVisit, PCNOrgChart, AppTest, SpVisit, workins, hostel, PCNTND, PCNDriver |
| **IT** | 3 | HI (3 sub-forms), SAPDRP, SAPSLCF (2 sub-forms) |
| **LOG** | 3 | PanConShip, tankerinsp, FJBInsp |
| **Marketing** | 9 | ChgOrd, CRRF, ILC, CustDB, MKTVisit, PSN, RSPO, CCCAR, CustQuest |
| **MTN** | 6 | Calibration, PESP, FAR, EnMS, aimbox, TPM |
| **PRC (Procurement)** | 19 | KOSHER, PMDEC, AppMat, MER, EOMkt, NewLiner, VdrChange, POcrf, VCAR, VendorAss, VenAudit, VCSR, VQA, vendorreg, swsi |
| **PRD (Production)** | 14 | BHTAddition, DrawingRequest, FIICI, oprp/CCP, StockMemo, STCI, WSV, QCDatabase25 |
| **Project** | 2 | PRJREQ, DrawingRequest |
| **QA** | ~33 | PCNFL, DataAnalyst, deptkrakpi, QEN, FoodManual, FDAssess, FoodSecManual, FSS, PIMSSOP, PIMSWI, PCIMSQM, ICAR, LTM, MatQP, PQP, MSDS, IoRN, MasterFilters, QltyRec, NCR, OFI, PAR, QACAR, QAINFO, SDS, SecDoc, SNHManual, validation, SiteMaster, MasterlistImp |
| **QC** | ~30 | PFAD, FJBInsp, PISOSOP, ISOManual, ISO17025Info, LabWkReq, pqcar, QASystAudit, QCInfo, QCPAR, RNMR, QCDatabase25, Sensory, tankerinsp, MasterCalibration, OOSqc, speccode, PIMSSOP, PIMSWI, LTM, PQP, MatQP, PQ, SDS, MSDS, Retained, COI, Srvyfrm, PCNHAS |
| **SHE** | 7 | CMR, SDS, hsencr, HSE, SHERO, PIIR, PPE, LROR |
| **SlsAdmin** | 3 | HCert, dbpay, ILC |
| **STR** | 6 | MatDisposal, mrfapp, returnables, StkItem, StoreIsp, SWaste |

## Key Workflow: EAF (VPN/Citrix)

- **States**: Request → Submitted → HOD Approval → COO/Director Approval → Done
- **Domino fields**: `currentaction`, `status1-4`, `date1-5`, `comment1-4`
- **Key routing**: `isPCN` flag determines COO vs Director approval path
- **Priority**: Highest — this is the first form to migrate

## Migration Approach

1. Review DXL/XML and PDF together for each form
2. Map Domino fields to SharePoint columns
3. Build Power App screens matching Domino UI
4. Create Power Automate flows replacing Domino agents
5. Reconcile evidence between DXL and PDF exports
6. Implement using Power Platform CLI (`pac`) and Git feature branches

## Hard Rules

- **DO NOT** make assumptions about Domino field types without checking the DXL source
- **DO NOT** propose SharePoint designs without first analyzing the Domino schema and PDF UI
- **DO NOT** write Power Fx code without confirming the SharePoint list schema and column internal names
- **DO NOT** delete or overwrite existing analysis without logging changes
- **DO NOT** guess at field mappings — record unknowns in `docs/risks-assumptions-questions.md`
- **ALWAYS** cross-reference DXL evidence with PDF UI evidence before finalizing
- **ALWAYS** use `agent/output-templates.md` conventions for consistency
- **ALWAYS** run through `agent/review-checklist.md` before marking artifacts complete
- **ALWAYS** consult **`docs/central-form-reference.md`** first before editing, reviewing, refactoring, or creating any form-related code, schema, or configuration

## Core Behavior Rules

These rules apply to every task, every form, every change.

1. **Do not assume.** Verify every fact against source evidence (code, schemas, SharePoint lists, DXL, PDF).
2. **Do not invent missing SharePoint lists.** If a list doesn't exist, report it — do not create or assume one.
3. **Do not invent missing SharePoint columns.** If a column is missing, report it — do not code against imaginary columns.
4. **Do not invent approval logic.** Approval must be discovered per form. Not all forms require approval.
5. **Do not assume all forms require approval.** See `docs/04_WORKFLOW_APPROVAL_RULES.md`.
6. **Section visibility must be discovered per form, per status, per role.** See `docs/05_SECTION_VISIBILITY_RULES.md`.
7. **Do not update files before providing findings** unless explicitly asked.
8. **Prefer updating existing documents** over creating new duplicates.
9. **Preserve useful existing content.** Do not overwrite documentation that is still accurate.

## Data Storage Rules (DEC-2026-007)

> **Critical architecture decision**: All form fields MUST be stored as discrete SharePoint list columns (model columns). Do NOT use `remarks` JSON or extension lists as primary data storage.

### Why Model Columns?

| Aspect | Model Columns (✅) | `remarks` JSON (❌) |
|--------|-------------------|---------------------|
| **Queryable** | Yes — OData filters, `$filter` | No — cannot filter inside JSON |
| **Search** | Yes — SharePoint search indexes columns | No — text blob is opaque to search |
| **Validation** | Yes — column required/type rules | No — any invalid JSON breaks the record |
| **Power Automate** | Yes — triggers on column changes | No — cannot detect field-level changes |
| **Power BI** | Yes — columns are available as fields | No — requires complex JSON parsing |
| **Type Safety** | Yes — TypeScript generates typed models | No — `any` type, runtime errors |

### Implementation Rules

| Rule | Description |
|------|-------------|
| **Each field = one column** | Every Domino form field gets its own SharePoint list column on `MainDB_{Dept}` or a justified extension list |
| **Use `submitTransform`** | Map form field IDs → SharePoint model column names in the form config's `submitTransform` function |
| **Name columns by prefix** | Use form-code prefix for columns: `hITagNo`, `sFARCompany`, `rSUserName`, `uRRequestType`, etc. |
| **Detail pages read columns** | Detail screens read `record.hITagNo` — NOT `JSON.parse(record.remarks).tagNo` |
| **Extension lists = last resort** | Only acceptable for truly repeated sub-forms (signature rows, line items). Not for primary form data. |
| **Refactor existing** | Forms currently using `remarks` JSON (SAPCR, EAF, ITSSR section data) must be migrated to model columns |

### Migration Path for Existing `remarks` JSON Forms

1. Add new SharePoint columns to `MainDB_IT` via PnP PowerShell script (see `scripts/` for templates)
2. Update generated TypeScript model (run code generation or manually add to `main-dbit-model.ts`)
3. Add `submitTransform` entries in `it-forms-config.ts` to map form fields → model columns
4. Update `new.tsx` submission logic to pass data via `submitTransform` instead of `remarks` JSON
5. Update detail page to read from model columns instead of `JSON.parse(record.remarks)`
6. Document the column in `docs/central-form-reference.md` and `mapping/field-mapping.csv`
7. See `docs/decision-log.md` §DEC-2026-007 for full context
10. **Make small, reviewable changes.** One logical change per edit.
11. **Always include test steps** after proposing or making changes.
12. **Always identify risk** before changing working logic.
13. **Every form must be traceable** to source PDF, SharePoint list, Power Apps screen, and workflow rule.
14. **If data is missing, mark it as missing** instead of guessing.

## Change Control Rule

Before editing any file, provide:

```
# Proposed Changes
| File | Change Type | Reason | Risk (Low/Medium/High) | Needs Approval? |
|---|---|---|---|
```

Do not edit until approved, unless the user explicitly says: **"Proceed with the updates."**

When editing:
- Make the smallest safe change.
- Do not refactor unrelated code.
- Do not change UI layout unless required.
- Do not rename controls unless required.
- Do not delete files unless confirmed.
- Do not overwrite useful documentation.
- Preserve existing logic unless clearly wrong.
- Update related documentation if behavior changes.

## Approval Logic Rule

Not all forms require approval. For every form, classify approval as one of:

1. **Approval Required** — Multi-stage workflow with approver roles
2. **No Approval Required** — Simple submit→complete
3. **Unknown** — Insufficient evidence

Use evidence from: source PDF, Power Apps code, SharePoint columns, workflow/status fields, buttons, role checks, section visibility, existing documentation, user-confirmed rules.

Rules:
- Do not assume approval is required.
- Do not add approval buttons unless confirmed.
- Do not add approver fields unless confirmed.
- Do not add approval status unless confirmed.
- If unknown, document it as unknown.
- If no approval is required, keep the flow simple.
- Approval must be discovered, not assumed.

For each form, document using the table in `docs/04_WORKFLOW_APPROVAL_RULES.md`.

## Section Visibility Rule

For every form and screen section, identify: section name, visible condition, user role required, status required, field dependency, whether submitter-only/approver-only/admin-only, whether read-only after submission, whether editable in draft, whether hidden after completion.

Do not invent visibility logic. If unclear, document: **"Section visibility: UNKNOWN — source confirmation required."**

Use the table format in `docs/05_SECTION_VISIBILITY_RULES.md`.

## SharePoint Data Mapping Rule

For every form, identify all SharePoint usage: list name, column display name, column internal name, field type, required/optional, choice values, person field structure, lookup field source, date/time format, Yes/No boolean handling, attachment handling, read/write/patch formulas, error handling, delegation risk.

Use this table:

| Form | UI Label | Control Name | App Field | SharePoint List | SharePoint Column | Internal Name | Type | Required | Read/Write | Status | Issue |
|---|---|---|---|---|---|---|---|---|---|---|---|

## Form Inventory Rule

Every form must be documented. For each form capture: form name, department, site/category, source PDF, Power Apps screen, SharePoint list, related child lists, data source type, approval classification, status values, required/optional fields, attachments, sections, process sections, validation rules, submit/draft/edit/cancel/admin behavior, known issues, missing information.

Use this table:

| Form ID | Form Name | Department | Source PDF | Screen/File | SharePoint List | Approval Classification | Status | Notes |
|---|---|---|---|---|---|---|---|---|

## Development Batch Rule

Do not attempt to update everything at once. Use batch development with **3 forms per batch**.

For each batch: Discover → Audit → Report → Wait for approval → Apply approved fixes only → Diff summary → Test steps → Update documentation → Next batch.

See `docs/09_BATCH_DEVELOPMENT_PLAN.md` for the full batch schedule.

## Power Fx / TypeScript Review Rule

When reviewing data access code, check: Patch, SubmitForm, LookUp, Filter, Search, SortByColumns, Collect, ClearCollect, UpdateContext, Set, If, Switch, Office365Users, User(), Choices, Defaults, Errors, Notify, Navigate, ResetForm, NewForm, EditForm, ViewForm — and their TypeScript equivalents in the code-first app (generated services, hooks, sharepoint-service calls).

For each important operation, document: file, function/property, purpose, data source, risk, issue, recommended fix, test step.

Also check: delegation issues, wrong field names, wrong column types, missing error handling, incorrect status updates, incorrect user role checks, incorrect form mode, mock data still in use, hardcoded values that should come from SharePoint, logic that does not match documentation.

## New Document References

| Document | Purpose |
|----------|---------|
| `docs/04_WORKFLOW_APPROVAL_RULES.md` | Per-form approval classification, status values, approval actors |
| `docs/05_SECTION_VISIBILITY_RULES.md` | Per-form section visibility by role and status |
| `docs/08_AUDIT_TEMPLATE.md` | Standardized audit output format for all form reviews |
| `docs/09_BATCH_DEVELOPMENT_PLAN.md` | 10-batch schedule of 3 forms each |
| `docs/10_PROMPT_LIBRARY.md` | Reusable prompts for audit, fix, test, and documentation tasks |

Before creating or updating any screen, page, form, component, model, service, or UI-related formula, check **`docs/ui-page-specification.md`**.

Use the UI specification as the source of truth for:
- page layout
- form layout
- typography
- font usage
- spacing
- component usage
- field display
- data binding
- visibility rules
- editability rules
- no-duplicate UI rules

### Rules

1. **Use existing components first** — Check `src/components/ui/` and `src/components/` before creating new ones. Reuse shadcn/ui components where practical.
2. **Use canonical form pattern** — New forms must use `FormSubmissionLayout` from `src/components/forms/form-submission-layout.tsx`. Use `DynamicFormRenderer` only as an intermediate step for simple forms.
3. **Use canonical list pattern** — List views must use `DatabaseView` + `DatabaseTable` from `src/components/database-view/`.
4. **Use canonical detail pattern** — Detail pages must route to `/submissions/:id` and use `DynamicSubmissionDetails` + `ApprovalWorkflowPanel` where practical.
5. **Use canonical layout** — Department pages use `DepartmentLayout`. Shared pages use `StandaloneLayout`.
6. **Use canonical module home** — Module dashboard pages use `ModuleHomeLayout` from `src/components/it/module-home-layout.tsx`.
7. **Use existing design tokens** — Colors, spacing, and typography from `src/index.css` CSS variables. Status colors from `src/lib/color-tokens.ts` and `src/lib/status-utils.ts`.
8. **Do not duplicate fields** — Every displayed field must exist in `mapping/field-mapping.csv`, SharePoint schema, or documented derived logic.
9. **Do not duplicate pages** — Check all routes in `src/App.tsx` and department route files before creating a new page.
10. **Do not duplicate components** — Check existing components before creating new ones.

### Conflict Resolution

If the requested UI change conflicts with the specification:
1. Do not implement the change immediately.
2. Document the conflict.
3. Recommend whether the specification should be updated or the requested change should be adjusted.
4. Ask for confirmation if the conflict affects business behavior, field mapping, workflow, or data source usage.

Do not create duplicate pages, forms, components, models, services, or fields. Reuse the canonical UI pattern and existing components where practical.

## Departments (for reference)

- **Johor**: Finance, GHR, IT, Logistics, Maintenance, Marketing, Procurement, Production, QA, QC, SHE, SlsAdmin, Store
- **Penang**: Admin, E&I, Eng, Fin, HR, IT, Log, Maint, Mktg, PBI, POM, Prod, Pur, QA, QC, R&D, Security, SHE, SlsAdmin, Store, T&D, Whse

## Recommended Tools

- `pac auth create` — Connect Power Platform CLI to your tenant
- `pac org select` — Set target environment
- `code-insiders` — VS Code Insiders CLI
- Git feature branches — Isolate migration work per form or department
