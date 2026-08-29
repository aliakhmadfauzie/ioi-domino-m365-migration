# Repo Knowledge Base — Domino → M365 Migration

> **Generated**: 2026-05-31
> **Project**: IOI Group Domino → M365 Migration
> **Repo Root**: `C:\Users\AL_AAF\Project\ioi_Docs`
> **Document Version**: 1.0
> **Governance Status**: ✅ Active source of truth for repo structure

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Repo Overview](#2-repo-overview)
3. [Folder Governance Rules](#3-folder-governance-rules)
4. [Full Folder Inventory](#4-full-folder-inventory)
5. [Source of Truth Map](#5-source-of-truth-map)
6. [Avoiding Common Problems](#6-avoiding-common-problems)
7. [New File Placement Rules](#7-new-file-placement-rules)
8. [Archive/Temp Convention](#8-archivetemp-convention)
9. [Duplicate & Outdated File Handling](#9-duplicate--outdated-file-handling)
10. [Data Sources That Must Be Reused](#10-data-sources-that-must-be-reused)
11. [Files to Check Before Creating New Work](#11-files-to-check-before-creating-new-work)
12. [Related Documents](#12-related-documents)

---

## 1. Purpose

This document is the **single source of truth for understanding the repo structure**. Every future AI assistant, developer, or migration analyst must read this document first before making any changes.

### What This Document Prevents

1. Creating new files when source files already exist
2. Ignoring existing data sources
3. Duplicating forms, screens, pages, models, services, or documentation
4. Making assumptions instead of checking repo evidence
5. Updating reference-only files incorrectly
6. Missing temporary work or draft files
7. Losing useful information during cleanup
8. Using outdated files as the source of truth
9. Creating documentation that does not match the repo
10. Making migration decisions without evidence

---

## 2. Repo Overview

### Root-Level Structure

```
ioi_Docs/
├── .github/              # AI agent configuration (INSTRUCTION FILES — read-only)
├── .vscode/              # VS Code workspace settings (tasks, extensions, settings)
├── apps/                 # Application artifacts (code-first, canvas)
│   ├── code-first/ioicodeapp/   # Power Apps code-first app (multi-purpose)
│   └── canvas/                   # Canvas app source + design
├── design/               # M365 target design (Power Apps / Power Automate / SharePoint)
│   ├── m365-design/
│   ├── sharepoint-lists/
│   └── mapping/
├── analysis/             # Domino analysis findings + source evidence (source of truth)
│   ├── source/                   # Original Domino evidence (reference only)
│   ├── source_analysis/          # Structured analysis registers
│   └── design-requirement/
├── docs/                 # Migration documentation (source of truth)
├── automation/           # CI-CD + scripts
├── audit/                # Audit register & findings
├── memories/  outputs/
├── Latest_Client_provided_file-*.zip  # Client source archive
├── .gitignore
└── desktop.ini
```

### Key Numbers

| Metric | Count |
|--------|-------|
| Domino forms analyzed | 23 (20 Penang IT + 3 Johor IT) |
| PDF UI exports | 1,171 (626 HCL clean PDFs + extracted-embedded-pdfs) |
| Form schemas (JSON) | 28 in `powerapps-mirror/apps/ioi-platform/src/form-schemas/` |
| Generated models | ~55 (kebab-case canonical) |
| Generated services | ~55 (kebab-case canonical) |
| Generated hooks | ~55 (kebab-case canonical) |
| Generated validators | ~52 (kebab-case canonical) |
| Page routes | 40+ |
| UI components | 70+ |
| Active department modules | 23 departments configured |
| IT forms with CRUD pages | 20+ IT form page directories |

---

## 3. Folder Governance Rules

### Governance Classification

| Classification | Meaning | Color |
|---------------|---------|-------|
| **Source of Truth** | This folder contains definitive, authoritative content that must be kept accurate | 🟢 |
| **Design Intent** | This folder contains design documents that describe what *should* be built — may differ from actual implementation | 🔵 |
| **Reference Only** | This folder contains original evidence, source material, or auto-generated artifacts — do NOT modify | 🟡 |
| **Active Development** | This folder is the primary development path — make changes here | 🟣 |
| **Deprecated / Redirect** | This folder contains files that point to newer locations — do NOT add new content here | 🔴 |
| **Temp / Draft** | Prefix with `_tmp/` — work-in-progress, may be discarded | ⚪ |
| **Archive** | Prefix with `_archive/` — old content kept for reference | ⚫ |

### Folder Classification Table

| Path | Classification | Can Update? | Notes |
|------|--------------|-------------|-------|
| `docs/` | 🟢 Source of Truth | ✅ Yes | Core migration documentation, governance, plans, logs |
| `analysis/` | 🟢 Source of Truth | ✅ Yes | Domino field inventory, reconciliation, workflow analysis (incl. `source/`, `source_analysis/`, `design-requirement/`) |
| `design/mapping/` | 🟢 Source of Truth | ✅ Yes | Field mappings CSV + MD, data migration rules |
| `design/m365-design/` | 🔵 Design Intent | ✅ Yes | Target architecture — update to match actual implementation |
| `analysis/source/dxl/` | 🟡 Reference Only | ❌ No | Original Domino DXL/XML evidence — never modify |
| `analysis/source/pdf/` | 🟡 Reference Only | ❌ No | Original PDF UI exports — never modify |
| `analysis/source/screenshots/` | 🟡 Reference Only | ❌ No | Evidence screenshots — never modify |
| `analysis/source/notes/` | ⚪ Temp/Draft | ✅ Yes | Working notes — use `_tmp/` prefix for drafts |
| `analysis/source/Project Iventories/` | 🟡 Reference Only | ❌ No | Client inventory CSVs and baseline mapping — reference only |
| `agent/` | 🔴 Deprecated | ❌ No* | *Only update if adding a redirect notice. All active content is in `.github/` |
| `.github/instructions/` | 🟡 Reference Only | ❌ No | AI agent instruction files — controls AI behavior, read-only |
| `.github/skills/` | 🟡 Reference Only | ❌ No | AI agent skill files — controls AI procedures, read-only |
| `.github/agents/` | 🟡 Reference Only | ❌ No | AI agent mode definitions — controls agent mode, read-only |
| `.vscode/` | ⚙️ Config | ✅ Yes | VS Code workspace config (tasks, settings, extensions) |
| `apps/code-first/ioicodeapp/` | 🟣 Active Dev (mixed) | ⚠️ Selective | See sub-folder rules below |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/` | 🟣 Active Dev | ✅ Yes | Main app source code — primary development location |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/docs/` | 🟢 Source of Truth | ✅ Yes | App-specific technical documentation |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/flows/` | 🟣 Active Dev | ✅ Yes | Power Automate flow definitions (JSON) |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/scripts/` | 🟣 Active Dev | ✅ Yes | App-specific setup/seed scripts |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/` | ⚙️ Auto-generated | ❌ No | Power Platform SDK schemas — regenerated by SDK |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/dist/` | ⚙️ Build output | ❌ No | Built assets — regenerated by `npm run build` |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/node_modules/` | ⚙️ Generated | ❌ No | npm dependencies — regenerated by `npm install` |
| `apps/code-first/ioicodeapp/powerapps-mirror/Import/` | 🟡 Reference Only | ❌ No | Scrape progress logs and import inventory — auto-generated |
| `apps/code-first/ioicodeapp/powerapps-mirror/data-model/` | 🟡 Reference Only | ❌ No | Auto-extracted data models — reference only |
| `apps/code-first/ioicodeapp/powerapps-screenshots/` | 🟡 Reference Only | ❌ No | Power Apps builder UI screenshots — evidence |
| `apps/code-first/ioicodeapp/scripts/` | 🟣 Active Dev | ✅ Yes | Utility scripts (PowerShell, Python, Node.js) |
| `apps/code-first/ioicodeapp/tools/` | 🟣 Active Dev | ✅ Yes | Import/build tools |
| `apps/code-first/ioicodeapp/docs/` | ⚪ Empty | ❌ No | Empty folder — legacy placeholder |
| `apps/code-first/ioicodeapp/canvas-review-sync/` | ⚪ Empty | ❌ No | Empty folder — legacy placeholder |
| `apps/code-first/ioicodeapp/apps/ioi-platform/` | 🔴 Legacy | ❌ No | Older project stub — DO NOT USE, use `powerapps-mirror` path instead |
| `apps/code-first/ioicodeapp/app.js, index.html, styles.css, data.json` | 🔴 Legacy | ❌ No | Static replica of older Power Apps version — reference only |
| `apps/code-first/ioicodeapp/domino-form-reader.SKILL.md` | 🟡 Reference | ❌ No | Legacy skill file — skill content moved to `.github/skills/` |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/node_modules/` | ⚙️ Generated | ❌ No | App dependencies |

---

## 4. Full Folder Inventory

### 4.1 Root Level

| Path | Type | Purpose Inferred From Repo | Key Files Found | Role | Should Update? | Should Refer Only? |
|------|------|---------------------------|-----------------|------|---------------|--------------------|
| `.github/agents/domino-migration-agent.agent.md` | File | AI agent mode definition | Agent YAML frontmatter with tool restrictions | Agent config | ❌ | ✅ |
| `.github/instructions/domino-migration.instructions.md` | File | AI agent instructions for Domino migration | Full 23-form inventory, EAF workflow, hard rules | Agent config | ❌ | ✅ |
| `.github/skills/domino-migration/SKILL.md` | File | AI agent skill — detailed procedures | DXL parsing, @Function→Power Fx, field mapping | Agent config | ❌ | ✅ |
| `.vscode/extensions.json` | File | Recommended VS Code extensions | 15 extension IDs | Config | ✅ | ❌ |
| `.vscode/settings.json` | File | VS Code workspace settings | XML, Markdown, CSV, spell check config | Config | ✅ | ❌ |
| `.vscode/tasks.json` | File | VS Code tasks | PAC auth, org, solution, Git tasks | Config | ✅ | ❌ |
| `.gitignore` | File | Git ignore rules | node_modules, .zip, PDF, screenshot ignores | Config | ✅ | ❌ |
| `desktop.ini` | File | Windows folder settings | System file | System | ❌ | ❌ |
| `Latest_Client_provided_file-*.zip` | File | Client source archive | Zipped client files | Reference | ❌ | ✅ |

### 4.2 `agent/` — Agent Reference Files (DEPRECATED)

| File | Purpose | Role | Notes |
|------|---------|------|-------|
| `.instructions.md` | VS Code agent instructions | 🔴 Deprecated | Content merged into `.github/instructions/domino-migration.instructions.md` |
| `agent-instructions.md` | Migration agent instructions | 🔴 Deprecated | Redirect notice to `.github/instructions/` |
| `skills.md` | Migration skills | 🔴 Deprecated | Redirect notice to `.github/skills/domino-migration/SKILL.md` |
| `output-templates.md` | Output format templates | 🟢 Active | Still current — update here |
| `review-checklist.md` | Migration review checklist | 🟢 Active | Still current — update here |

### 4.3 `analysis/` — Domino Analysis (Source of Truth)

| File | Purpose | Status |
|------|---------|--------|
| `domino-field-inventory.md` | Complete field inventory of all 23 forms | ✅ Current |
| `domino-field-inventory.csv` | Machine-readable field inventory | ✅ Current |
| `domino-field-inventory.json` | JSON version of field inventory | ✅ Current |
| `evidence-reconciliation.md` | Cross-reference DXL vs PDF evidence | ✅ Current |
| `workflow-analysis.md` | Domino workflow analysis | ✅ Current |
| `pdf-ui-inventory.md` | UI element inventory from PDF exports | ❌ Needs population |
| `phase1-source-analysis-eaf-itssr-hi.md` | Phase 1: Source analysis for EAF, ITSSR, HI | ✅ Current |
| `phase2-repo-inventory-eaf-itssr-hi.md` | Phase 2: Repo inventory | ✅ Current |
| `phase3-alignment-eaf-itssr-hi.md` | Phase 3: Alignment analysis | ✅ Current |
| `phase4-redundancy-report.md` | Phase 4: Redundancy report | ✅ Current |
| `all-forms-source-analysis.md` | Cross-reference of 23 Domino forms vs 27 app schemas vs 38 page dirs | ✅ Current |
| `log-prd-mtn-source-analysis.md` | LOG/PRD/MTN PDF source analysis — 64 PDFs across 6 dirs | ✅ Current |
| `all-forms-crud-gap-analysis.csv` | CRUD completeness scores per form | ✅ Current |
| `alignment-findings-summary.csv` | Alignment findings summary | ✅ Current |
| `phase1-4-summary.json` | Phase 1-4 analysis summary in JSON | ✅ Current |
| `_analyze-forms.ps1` | PowerShell analysis helper script | ✅ Utility |
| `_form-summary.txt` | Form summary text output | ✅ Utility |

### 4.4 `docs/` — Migration Documentation (Source of Truth)

| File | Purpose | Status |
|------|---------|--------|
| `migration-documentation.md` | Overall migration overview, strategy, key findings | ⚠️ Partially current |
| `implementation-plan.md` | Step-by-step implementation tasks by phase | ⚠️ Partially current |
| `risks-assumptions-questions.md` | RAQ log | ⚠️ Partially current |
| `change-log.md` | Track all significant repo changes | ✅ Current |
| `decision-log.md` | Track business/design decisions (DEC-2026-NNN) | ✅ Current |
| `testing-and-validation.md` | Test plans and validation criteria | ✅ Current |
| `documentation-governance.md` | Documentation governance rules | ✅ Current |
| `documentation-governance.csv` | Machine-readable governance inventory | ✅ Current |
| `documentation-review.csv` | Machine-readable doc review status | ✅ Current |
| `app-repo-cleanup-plan.md` | Cleanup plan for powerapps-mirror app repo | ✅ Current |

### 4.5 `design/m365-design/` — M365 Target Designs (Design Intent)

| File | Purpose | Status |
|------|---------|--------|
| `sharepoint-list-design.md` | SharePoint list schema designs | ⚠️ Partially current |
| `powerapps-design.md` | Power Apps app design | ⚠️ Partially current |
| `power-automate-design.md` | Power Automate flow designs | ✅ Current (flows not yet built) |

### 4.6 `mapping/` — Field Mapping (Source of Truth)

| File | Purpose | Status |
|------|---------|--------|
| `field-mapping.csv` | Field-by-field Domino → M365 mapping | ✅ Current |
| `field-mapping.md` | Detailed field mapping documentation | ✅ Current |
| `data-migration-rules.csv` | Data transformation rules | ✅ Current |

### 4.7 `source/` — Original Domino Evidence (Reference Only)

| Path | Contents | Key Files | Purpose |
|------|----------|-----------|---------|
| `source/dxl/XML_HR_Johor/` | HR Domino DXL exports — Johor | 14 forms (PCNBkStf, cancomp, ContractorReg, etc.) + inventory .txt files | Original Domino evidence |
| `source/dxl/XML_HR_Penang/` | HR Domino DXL exports — Penang | 45+ forms (AWHR, BSD, CIR, CWR, DRD, etc.) | Original Domino evidence |
| `source/dxl/XML_QA_Johor/` | QA Domino DXL exports — Johor | 38 forms (PCNFL, DataAnalyst, deptkrakpi, QEN, etc.) | Original Domino evidence |
| `source/dxl/XML_QA_Penang/` | QA Domino DXL exports — Penang | Empty | Awaiting source |
| `source/pdf/pdf_form_hcl/hcl_form_pdf/` | Clean HCL PDF exports | `JOHOR_SITE_FORM/` (14 depts), `PRAI_SITE_FORM/` (22 depts), `Final Apps Inventory.xlsx`, `master_app_data_still_needed.csv` | **Best quality PDF source** |
| `source/Project Iventories/` | Client baseline inventory and mapping | `2026-04-18_application_inventory_baseline.md`, `application_pdf_source_mapping.csv`, `combined_source_mapping.csv`, `excel_pdf_reference_inventory.csv`, `embedded_pdf_application_mapping.csv`, `embedded_pdf_application_mapping_summary.md`, `APP_DEVELOPMENT_REFERENCE.md`, `extracted-embedded-pdfs/` (Johor + Penang by department) | Client mapping inventory |
| `source/notes/` | Working notes | Empty | Temp/draft — use `_tmp/` prefix |
| `source/screenshots/` | UI screenshots | Empty | Awaiting screenshots |

### 4.8 `apps/code-first/ioicodeapp/` — Power Apps Code-First App (Mixed Purpose)

#### 4.8.1 Legacy / Reference Content (Do Not Modify)

| Path | Type | Purpose | Notes |
|------|------|---------|-------|
| `project.json` | Config | Acidchem Portal v1 project descriptor | Legacy — actual app is v2 in `powerapps-mirror/` |
| `app.js` | File | Static replica of Power Apps app logic | Legacy reference — DO NOT USE for development |
| `index.html` | File | Static replica entry point | Legacy reference |
| `styles.css` | File | Static replica styles | Legacy reference |
| `data.json` | File | Static replica data | Legacy reference |
| `README.md` | Doc | Old repo README (references "Acidchem Portal Replica") | ❌ Outdated — app has evolved significantly |
| `domino-form-reader.SKILL.md` | Doc | Legacy Domino form reader skill | Skill moved to `.github/skills/domino-migration/SKILL.md` |
| `IT_Database_Schema_Documentation.md` | Doc | IT database schema doc | Reference |
| `IT_Database_Schema_Documentation.pdf` | Doc | PDF version of schema doc | Reference |
| `IT_Department_ITSSR_Detailed_Requirements.md` | Doc | ITSSR requirements doc | Reference |
| `IT_Forms_ForSharePoint.xlsx` | Data | Old SharePoint forms workbook | Reference |
| `IT_Forms_ForSharePoint_NEW.xlsx` | Data | Updated SharePoint forms workbook | Reference |
| `IT_Routing_Configuration.xlsx` | Data | Routing config workbook | Reference |
| `IT_Routing_Rules_Documentation.md` | Doc | Routing rules documentation | Reference |
| `Domino Mail Groups (2).xlsx` | Data | Domino mail groups | Reference |
| `sharepoint-write-buttons-audit.md` | Doc | SharePoint write buttons audit | Reference |
| `apps/ioi-platform/` | Folder | Older project stub (minimal content) | 🔴 **LEGACY — DO NOT USE.** Active app is in `powerapps-mirror/apps/ioi-platform/` |
| `canvas-review-sync/` | Folder | Empty legacy folder | Empty — can be archived |
| `docs/` | Folder | Empty documentation folder | Empty — use root `docs/` instead |
| `.venv/` | Folder | Python virtual environment | Not in .gitignore — should be added |
| `node_modules/` | Folder | npm dependencies | Generated |
| `powerapps-screenshots/` | Folder | Power Apps builder UI screenshots | Reference — 210+ screenshots of Power Apps builder pages |

#### 4.8.2 Active Development Path (Primary)

| Path | Type | Purpose | Notes |
|------|------|---------|-------|
| `powerapps-mirror/` | Folder | **Active Power Apps code-first app root** | Main development location |
| `powerapps-mirror/project.json` | Config | "Acidchem Portal" v2 project descriptor | Main project |
| `powerapps-mirror/SCRAPE_STATUS.md` | Doc | Scraping process documentation | ✅ Current |
| `powerapps-mirror/tree-manifest.json` | Data | File tree manifest | Reference |
| `powerapps-mirror/tsconfig*.json` | Config | TypeScript configuration | App config |
| `powerapps-mirror/import-log-*.json` | Logs | Scrape/import progress logs | Auto-generated — reference only |
| `powerapps-mirror/data-model/data-model.json` | Data | Extracted data model | Reference — auto-generated |
| `powerapps-mirror/data-model/full-data-model.json` | Data | Full extracted data model | Reference — auto-generated |
| `powerapps-mirror/Import/` | Folder | Import scrape artifacts and logs | Reference only — auto-generated |

#### 4.8.3 Main App Source (`powerapps-mirror/apps/ioi-platform/`)

| Path | Type | Purpose | Key Contents |
|------|------|---------|-------------|
| `app.tsx` | Entry | App root component | Route setup, providers |
| `main.tsx` | Entry | React entry point | Render app |
| `index.html` | Entry | HTML shell | Vite entry |
| `vite.config.ts` | Config | Vite build config | Build settings |
| `power.config.json` | Config | Power Platform config | environmentId, appId, connectionReferences |
| `package.json` | Config | npm dependencies | React 19, TypeScript, Vite, shadcn/ui, Power Apps SDK |
| `src/app/` | Code | App initialization | `app-init.ts` — startup logic |
| `src/pages/` | Code | **40+ page routes** | Department hub, IT forms (20+), HR forms, approvals, admin, etc. |
| `src/pages/it/forms/` | Code | **IT form pages** | `[formCode]/` dynamic + explicit EAF, ITSSR, HI, NIR, PRF, SFAR, etc. |
| `src/components/` | Code | **70+ UI components** | shadcn/ui (50+), dynamic-form, workflow, layout, it, hr, shared |
| `src/components/ui/` | Code | **shadcn/ui primitives** | 50+ base UI building blocks |
| `src/components/dynamic-form/` | Code | **Dynamic form engine** | DynamicForm.tsx, FieldRenderer.tsx, SectionRenderer.tsx |
| `src/components/workflow/` | Code | **Workflow components** | approval-workflow, stage-progress, workflow-timeline, escalation-monitor |
| `src/components/layout/` | Code | **App layout components** | ig-layout, ig-sidenav, ig-topbar, ig-footer-bar |
| `src/services/` | Code | **Custom services** | 13 files — SharePoint, M365 Users, Outlook, workflow, notifications |
| `src/generated/models/` | Code | **~55 TypeScript models** | SharePoint list models (kebab-case canonical) |
| `src/generated/services/` | Code | **~55 data services** | CRUD services for each SharePoint list |
| `src/generated/hooks/` | Code | **~55 React hooks** | use-* hooks for each data source |
| `src/generated/validators/` | Code | **~52 validators** | Validation logic per model |
| `src/generated/components/` | Code | Generated UI components | Banner component |
| `src/form-schemas/` | Code | **28 JSON form schemas** | One per Domino form — defines fields, sections, validation |
| `src/config/` | Code | Configuration | Departments, form constants, routing, workflow, form dropdowns |
| `src/types/` | Code | TypeScript types | Form schemas, workflow types, admin config, data source mapping |
| `src/store/` | Code | State management | Jotai stores — admin, form-schema, notification, platform |
| `src/lib/` | Code | Utilities | Form utils, routing config, workflow definitions, SLA utils |
| `src/contexts/` | Code | React contexts | IT approval context |
| `src/features/` | Code | Feature modules | ITSR app, bug tracker |
| `src/modules/` | Code | **Department modules** | IT, HR, STR, LOG, Core, Admin, Shared — each with components/hooks/services/types |
| `src/routes/` | Code | Route definitions | Per-department route files |
| `src/data/` | Code | Data layer | M365 client, SharePoint client, mock data toggle |
| `src/debug/` | Code | Debug tools | Debug panel, schema comparison, runtime log |
| `src/departments/` | Code | Department registry | Single `departmentRegistry.ts` |
| `src/hooks/` | Code | Custom hooks | (empty — hooks in generated/hooks/) |
| `flows/` | Code | Power Automate flow definitions | `eaf-approval-flow-definition.json` |
| `docs/` | Doc | App-specific technical documentation | Blueprint, audit reports, setup guides, testing docs |
| `scripts/` | Code | Setup and seed scripts | PnP PowerShell, Node.js seed scripts |
| `public/` | Asset | Static assets | `favicon.svg` |
| `.power/schemas/` | Config | Power Platform connector schemas | SharePoint Online (~52 schemas), Office 365 Users, Office 365 |
| `.power/schemas/appschemas/` | Config | App-level Power Platform schemas | `dataSourcesInfo.ts` |
| `plugins/` | Code | Vite plugins | `vite-plugin-propagate-query.ts` |

#### 4.8.4 Utility Scripts (`apps/code-first/ioicodeapp/scripts/`)

| Script | Purpose | Language |
|--------|---------|----------|
| `Add-BSD-BackupStaff-Lists.ps1` | Create BSD SharePoint lists | PowerShell |
| `Add-CIR-Cafeteria-Lists.ps1` | Create CIR lists | PowerShell |
| `Add-CWR-ContractWorker-Lists.ps1` | Create CWR lists | PowerShell |
| `Add-Ext_Support-Ext_Assets-Columns.ps1` | Add extension columns | PowerShell |
| `Add-IOIP-Ext-Policy-Columns.ps1` | Add IOIP policy columns | PowerShell |
| `Add-IT-SchemaStore.ps1` | Add IT schema store | PowerShell |
| `Add-ITSSR-Columns.ps1` | Add ITSSR columns | PowerShell |
| `Add-MainDBITExtSupport-Columns.ps1` | Add extension support columns | PowerShell |
| `Add-MainDB_IT-Columns.ps1` | Add MainDB_IT columns | PowerShell |
| `Add-NIR-HWGRouting-Column.ps1` | Add NIR routing column | PowerShell |
| `Add-PRF-Workflow-Columns.ps1` | Add PRF workflow columns | PowerShell |
| `Add-RS-AssignedPICEmail-Column.ps1` | Add RS email column | PowerShell |
| `Add-SAPAMR-Columns.ps1` | Add SAPAMR columns | PowerShell |
| `Add-SAPCR-Columns.ps1` | Add SAPCR columns | PowerShell |
| `create-all-maindb-it-views.ps1` | Create all MainDB_IT views | PowerShell |
| `create-maindb-it-list.ps1` | Create MainDB_IT list | PowerShell |
| `create-ext-support-formcode-views.ps1` | Create extension support views | PowerShell |
| `Create-SharePointGroupsFromDominoWorkbook.ps1` | Create SharePoint groups from Domino workbook | PowerShell |
| `Create-SharePointGroupsFromResolvedCsv.ps1` | Create SharePoint groups from resolved CSV | PowerShell |
| `Grant-SharePointAppAccessViaSiteGroups.ps1` | Grant app access | PowerShell |
| `Grant-SharePointAppListAccess.ps1` | Grant app list access | PowerShell |
| `Grant-SharePointListAccess.ps1` | Grant list access | PowerShell |
| `Resolve-ITSSRSharePointGroupsFromDxl.ps1` | Resolve ITSSR groups from DXL | PowerShell |
| `check-formcode-fields.ps1` | Check form code fields | PowerShell |
| `cleanup-and-recreate-all-views.ps1` | Cleanup and recreate views | PowerShell |
| `cleanup-duplicate-views.ps1` | Cleanup duplicate views | PowerShell |
| `get-formcodes.ps1` | Get form codes | PowerShell |
| `verify-all-views.ps1` | Verify all views | PowerShell |
| `generate-schemas.mjs` | Generate schemas | Node.js |
| `docx_to_pdf_reportlab.py` | Convert docx to PDF | Python |
| `dxl_form_analyzer.py` | Analyze DXL forms | Python |
| `extract_batch2.py` | Batch extraction v2 | Python |
| `extract_dxl_forms.py` | Extract DXL forms | Python |
| `extract_dxl_forms2.py` | Extract DXL forms v2 | Python |
| `strengthen_dataverse_proposal.py` | Dataverse proposal analysis | Python |
| `sharepoint-app-lists.csv` | SharePoint app lists data | CSV |
| `sharepoint-list-access-users.txt` | List access users | Text |
| `maindb-it-columns.json` | MainDB_IT column definitions | JSON |
| `maindb-it-columns-v2.json` | MainDB_IT column definitions v2 | JSON |
| `itssr-sharepoint-groups-from-dxl.csv` | ITSSR groups from DXL | CSV |
| `itssr-sharepoint-group-members-from-dxl.csv` | ITSSR group members from DXL | CSV |
| `domino-sharepoint-groups-invalid-members.csv` | Invalid group members | CSV |

#### 4.8.5 Tools (`apps/code-first/ioicodeapp/tools/`)

| File | Purpose |
|------|---------|
| `import-powerapps-bundle.ps1` | Import Power Apps bundle script |

---

## 5. Source of Truth Map

### Priority Model (1 = highest authority)

| Priority | Source | Rationale |
|----------|--------|-----------|
| **1** | `docs/decision-log.md` (DEC-2026-NNN decisions) | Stakeholder-approved decisions override all technical assumptions |
| **2** | Actual SharePoint Production/Dev List Schema | Ground truth for what exists in M365 |
| **3** | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/` | Code reflects what was actually built |
| **4** | Power Automate environment (live flows) | Running flows reflect actual automation |
| **5** | `source/dxl/` (Domino DXL/XML) | Original source — definitive for Domino-side facts |
| **6** | `source/pdf/` (PDF UI exports) | Visual confirmation of DXL interpretation |
| **7** | `mapping/field-mapping.*` | Intended mapping — may diverge from actual implementation |
| **8** | `design/m365-design/*` | Design intent — may differ from actual implementation |
| **9** | `analysis/*` | Analysis findings — may need reconciliation |
| **10** | `source/notes/`, `source/screenshots/` | Unverified notes and images |

### Folder-Specific Source of Truth Rules

| Content Type | Primary Source of Truth | Secondary Source |
|-------------|------------------------|-----------------|
| Field names | `mapping/field-mapping.csv` | `source/dxl/` XML |
| Field labels | `source/pdf/` UI exports | DXL `<field><label>` |
| SharePoint column types | Actual SharePoint schema | `design/m365-design/sharepoint-list-design.md` |
| Choice values | Actual SharePoint choice columns | DXL keyword lists + PDF UI |
| Power Apps control names | `src/` source code | `design/m365-design/powerapps-design.md` |
| Workflow statuses | Power Automate flows + SharePoint status column | `analysis/workflow-analysis.md` |
| Approval roles | `docs/decision-log.md` | DXL agent MailSend recipients |
| Department rules | `docs/decision-log.md` + `mapping/field-mapping.csv` | DXL computed-field formulas |
| Visibility logic | App component props | DXL hide-when formulas |
| Required fields | SharePoint column required setting | DXL field required flags |
| Data migration rules | `mapping/data-migration-rules.csv` | DXL computed-field formulas |
| Implementation status | `docs/change-log.md` (actual) + `docs/implementation-plan.md` (planned) | Git log |

---

## 6. Avoiding Common Problems

### Problem 1: Creating New Files When Source Files Already Exist

**Rule**: Before creating ANY new file, check:
1. `source/dxl/` — does a DXL file already exist for this form?
2. `source/pdf/` — are there PDF UI exports for this form?
3. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/` — does a form schema JSON already exist?
4. `analysis/domino-field-inventory.*` — has the form been analyzed?
5. `mapping/field-mapping.csv` — has the form been mapped?

**If you find existing evidence**: Use it. Do NOT recreate from scratch.

### Problem 2: Ignoring Existing Data Sources

**Must-check data sources before any analysis**:
1. HCL PDFs: `source/pdf/pdf_form_hcl/hcl_form_pdf/` — **best quality PDF source** (626 files)
2. Extracted embedded PDFs: `source/Project Iventories/extracted-embedded-pdfs/` — older extraction
3. DXL/XML: `source/dxl/XML_HR_*/` and `source/dxl/XML_QA_*/` — original Domino source
4. Client inventory: `source/Project Iventories/README.md` and CSVs
5. App README: `apps/code-first/ioicodeapp/README.md` and `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/README.md`

### Problem 3: Duplicating Forms, Screens, Pages, Models, Services

**Known duplicates in the repo** (DO NOT recreate):
- `src/services/str-submission-service.ts` is canonical; `str-service.ts` is a duplicate
- `src/pages/submission-detail.tsx` may duplicate `src/pages/submissions/[id].tsx`
- `src/pages/quick-form.tsx` may duplicate `src/pages/quick-submit.tsx`
- Generated models/services/hooks/validators exist in kebab-case (canonical) — do not create PascalCase versions

### Problem 4: Making Assumptions Instead of Checking Evidence

**Before any migration decision**:
1. Check `source/dxl/` for the actual Domino field definition
2. Check `source/pdf/` for the visual UI layout
3. Check `analysis/evidence-reconciliation.md` for existing reconciliation status
4. Check `docs/decision-log.md` for any existing decisions
5. Check `analysis/all-forms-source-analysis.md` for cross-reference completeness

### Problem 5: Updating Reference-Only Files

**NEVER modify** (read-only):
- `source/dxl/*` — original Domino evidence
- `source/pdf/*` — original PDF exports
- `source/screenshots/*` — original screenshots
- `.github/instructions/*` — AI agent instructions
- `.github/skills/*` — AI agent skills
- `.github/agents/*` — AI agent mode definitions
- `apps/code-first/ioicodeapp/powerapps-mirror/Import/*` — auto-generated scrape logs
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/node_modules/*` — generated
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/dist/*` — build output
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/*` — SDK-generated

### Problem 6: Missing Temporary Work or Draft Files

**Temp/Draft convention**: Use `_tmp/` prefix for folders containing work-in-progress.
- `source/notes/` → use `source/notes/_tmp/` for draft notes
- Any working folder → create `_tmp/` subfolder for drafts

### Problem 7: Losing Useful Information During Cleanup

**Archive convention**: Use `_archive/` prefix for folders containing old but potentially useful content.
- Before deleting anything, move to `_archive/` within the same parent folder
- Add a note in `docs/change-log.md` with the archive date and reason
- Never delete without logging

### Problem 8: Using Outdated Files as Source of Truth

**Known outdated files**:
- `apps/code-first/ioicodeapp/README.md` — references "Acidchem Portal Replica", not current app
- `apps/code-first/ioicodeapp/app.js`, `index.html`, `styles.css`, `data.json` — legacy static replica
- `apps/code-first/ioicodeapp/apps/ioi-platform/` — **DO NOT USE**, use `powerapps-mirror/apps/ioi-platform/`
- `apps/code-first/ioicodeapp/project.json` (v1) — superseded by `powerapps-mirror/project.json` (v2)
- `agent/agent-instructions.md` — redirects to `.github/instructions/`
- `agent/skills.md` — redirects to `.github/skills/`

### Problem 9: Creating Documentation That Does Not Match the Repo

**Rule**: All documentation in `docs/` must be verified against the actual repo structure before creation or update. Check:
1. Does the file path exist?
2. Does the described folder contain what's claimed?
3. Are there new files/folders that contradict the documentation?

### Problem 10: Making Migration Decisions Without Evidence

**Rule**: Every migration decision must cite at least one evidence source from:
- `source/dxl/` (DXL evidence)
- `source/pdf/` (PDF/UI evidence)
- `source/Project Iventories/` (client inventory evidence)
- `analysis/` (analyzed findings)
- `docs/decision-log.md` (existing decisions)
- **Never guess** — if evidence is missing, log it in `docs/risks-assumptions-questions.md`

---

## 7. New File Placement Rules

### Where to Create New Files

| If you need to... | Create it in... | Notes |
|-------------------|-----------------|-------|
| Document migration strategy | `docs/` | Use `docs/documentation-governance.md` conventions |
| Log a change | `docs/change-log.md` | Append to the table |
| Log a decision | `docs/decision-log.md` | Use DEC-2026-NNN format |
| Log a risk/assumption/question | `docs/risks-assumptions-questions.md` | Append to the table |
| Create test cases | `docs/testing-and-validation.md` | Use the test case table format |
| Add field mapping | `mapping/field-mapping.csv` + `mapping/field-mapping.md` | Update both CSV and MD |
| Add data migration rules | `mapping/data-migration-rules.csv` | Append to CSV |
| Design a new SharePoint list | `design/m365-design/sharepoint-list-design.md` | Update the design doc |
| Design a new Power Apps feature | `design/m365-design/powerapps-design.md` | Update the design doc |
| Design a new Power Automate flow | `design/m365-design/power-automate-design.md` | Update the design doc |
| Add a new form analysis | `analysis/` | Follow existing naming: `{form}-analysis.md` |
| Add app source code | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/` | Follow the existing module/page/service pattern |
| Add a form schema JSON | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/` | Use formCode as filename (e.g., `EAF.json`) |
| Add a new page | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/{dept}/` | Follow existing patterns |
| Add a new service | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/services/` | Custom services |
| Add a generated model | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/` | Use kebab-case naming |
| Add a utility script | `apps/code-first/ioicodeapp/scripts/` | PowerShell, Python, or Node.js |
| Create a draft/work-in-progress | Use `_tmp/` prefix in the relevant folder | Never leave drafts in the root |
| Archive old content | Use `_archive/` prefix in the relevant folder | Always log the archive action |

### Where NOT to Create New Files

| Location | Reason |
|----------|--------|
| `source/dxl/` | Reference only — original Domino evidence |
| `source/pdf/` | Reference only — original PDF exports |
| `source/screenshots/` | Reference only — evidence screenshots |
| `.github/instructions/` | Read-only AI agent configuration |
| `.github/skills/` | Read-only AI agent skills |
| `.github/agents/` | Read-only AI agent modes |
| `apps/code-first/ioicodeapp/apps/ioi-platform/` | **LEGACY** — DO NOT USE |
| `apps/code-first/ioicodeapp/` root (new app-level files) | Only update existing reference files |
| `agent/` root (new instruction files) | Deprecated — add to `.github/` instead |

---

## 8. Archive/Temp Convention

### Temporary / Draft Content (`_tmp/`)

Use `_tmp/` as a **prefix or subfolder name** for work-in-progress:

```
source/notes/_tmp/eaf-draft-analysis.md     # Draft notes
analysis/_tmp/                               # Draft analysis
docs/_tmp/                                   # Draft documentation
```

Rules:
- `_tmp/` content may be deleted without notice
- `_tmp/` content should not be referenced by permanent files
- Move out of `_tmp/` when work is complete
- Log the move in `docs/change-log.md`

### Archived Content (`_archive/`)

Use `_archive/` as a **prefix or subfolder name** for old content:

```
apps/code-first/ioicodeapp/_archive/apps/ioi-platform/       # Archived legacy project stub
apps/code-first/ioicodeapp/_archive/canvas-review-sync/      # Archived empty folder
```

Rules:
- `_archive/` content is kept for reference but NOT used
- Archived content should have a corresponding entry in `docs/change-log.md`
- Archived content can be deleted after 6 months with stakeholder approval
- Never archive content that is currently referenced by active code

---

## 9. Duplicate & Outdated File Handling

### Known Duplicates to Resolve

| Duplicate Group | Canonical | Superseded | Action |
|-----------------|-----------|------------|--------|
| Generated services (PascalCase vs kebab-case) | kebab-case files | PascalCase files | ✅ Already cleaned (Phase 3 of cleanup plan) |
| Generated models (same) | kebab-case files | PascalCase files | ✅ Already cleaned |
| Generated validators (same) | kebab-case files | PascalCase files | ✅ Already cleaned |
| Generated hooks (same) | kebab-case files | PascalCase files | ✅ Already cleaned |
| Generated components (same) | kebab-case files | PascalCase files | ✅ Already cleaned |
| `str-service.ts` vs `str-submission-service.ts` | `str-submission-service.ts` | `str-service.ts` | ⬜ Pending cleanup |
| `quick-form.tsx` vs `quick-submit.tsx` | Needs investigation | Needs investigation | ⬜ Needs review |
| `submission-detail.tsx` vs `submissions/[id].tsx` | Needs investigation | Needs investigation | ⬜ Needs review |
| `delegation-dialog.tsx` (3 locations) | `workflow/delegation-dialog.tsx` | Root + approval-workflow copies | ✅ Partially cleaned |
| `database-table.tsx` / `detail-modal.tsx` (3 locations) | Needs investigation | Root + database-view + shared copies | ⬜ Needs review |
| Form schemas (`VPNACCESS.json`, `HWINV_PRAI.json`) | `EAF.json`, `HI.json` | Old schemas with wrong formCode | ⬜ Pending deletion |
| `apps/ioi-platform/` (old) vs `powerapps-mirror/apps/ioi-platform/` | `powerapps-mirror/...` | `apps/ioi-platform/` | ⬜ Move to `_archive/` |

### How to Handle Newly Found Duplicates

1. **Do NOT delete immediately** — move to `_archive/` instead
2. Log the duplicate in `docs/app-repo-cleanup-plan.md`
3. Log the archive action in `docs/change-log.md`
4. Update any references to point to the canonical version

---

## 10. Data Sources That Must Be Reused

### Primary Evidence Sources

| Source | Location | Contains | When to Use |
|--------|----------|----------|-------------|
| **HCL PDFs (Best Quality)** | `source/pdf/pdf_form_hcl/hcl_form_pdf/` | 626 clean PDFs by site/department | First choice for UI evidence |
| **Extracted Embedded PDFs** | `source/Project Iventories/extracted-embedded-pdfs/` | Extracted PDFs by site/department | Fallback if HCL PDFs unavailable |
| **DXL/XML (HR Johor)** | `source/dxl/XML_HR_Johor/` | 14 HR form DXL exports | Field definitions, formulas, agents |
| **DXL/XML (HR Penang)** | `source/dxl/XML_HR_Penang/` | 45+ HR form DXL exports | Field definitions, formulas, agents |
| **DXL/XML (QA Johor)** | `source/dxl/XML_QA_Johor/` | 38 QA form DXL exports | Field definitions, formulas, agents |
| **DXL/XML (QA Penang)** | `source/dxl/XML_QA_Penang/` | Empty | Awaiting source |
| **Client Inventory** | `source/Project Iventories/` | App inventory CSVs, PDF mapping, baseline | App discovery and planning |
| **Client Archive** | `Latest_Client_provided_file-*.zip` | Zipped client source files | Unzip if needed for additional source |

### Analysis Output Sources

| Source | Location | Contains |
|--------|----------|----------|
| Field Inventory | `analysis/domino-field-inventory.*` | All 23 forms with field list |
| Evidence Reconciliation | `analysis/evidence-reconciliation.md` | DXL vs PDF cross-reference |
| Workflow Analysis | `analysis/workflow-analysis.md` | Domino workflow logic |
| Field Mapping | `mapping/field-mapping.csv` | Domino → M365 column mapping |
| Data Migration Rules | `mapping/data-migration-rules.csv` | Transformation rules |
| All-Forms Source Analysis | `analysis/all-forms-source-analysis.md` | Cross-reference of 23 forms vs 27 schemas vs 38 pages |

### App Source Data Sources

| Source | Location | Contains |
|--------|----------|----------|
| Form Schemas (JSON) | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/` | 28 JSON schemas defining form fields |
| Generated Models | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/` | ~55 TypeScript models |
| Generated Services | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/` | ~55 CRUD services |
| Route Definitions | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/` | Per-department routes |
| Department Config | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/config/departments.ts` | 23 departments with form definitions |
| SharePoint Schemas | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/` | ~52 SharePoint list schemas |
| Power Automate Flows | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/flows/` | EAF approval flow definition |

---

## 11. Files to Check Before Creating New Work

### Before Any Migration Task

Checklist — read these files in order:

1. **`docs/repo-knowledge-base.md`** (this file) — understand what exists
2. **`AGENTS.md`** — agent/instruction/skill discovery (root of repo)
3. **`docs/documentation-governance.md`** — understand documentation rules
4. **`docs/decision-log.md`** — check for existing decisions
5. **`docs/implementation-plan.md`** — check current phase and tasks
6. **`docs/central-form-reference.md`** — single source of truth for all form definitions
7. **`docs/04_WORKFLOW_APPROVAL_RULES.md`** — per-form approval classification
8. **`docs/05_SECTION_VISIBILITY_RULES.md`** — per-form section visibility rules
9. **`docs/09_BATCH_DEVELOPMENT_PLAN.md`** — current batch and form schedule
10. **`analysis/all-forms-source-analysis.md`** — check form completeness
11. **`analysis/evidence-reconciliation.md`** — check reconciliation status
12. **`mapping/field-mapping.csv`** — check existing field mappings
13. **`docs/change-log.md`** — check recent changes

### Before Creating a New Form Schema

Check:
1. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/` — does a schema already exist?
2. `source/dxl/` — does the DXL file exist? (for field definitions)
3. `source/pdf/pdf_form_hcl/hcl_form_pdf/` — do PDF UI exports exist?
4. `analysis/domino-field-inventory.*` — has the form been analyzed?
5. `mapping/field-mapping.csv` — has the form been mapped?

### Before Creating a New Page

Check:
1. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/{dept}/forms/` — does the page already exist?
2. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/` — is the route already defined?
3. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/` — can existing components be reused?
4. `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/modules/{dept}/` — does a module already exist?

### Before Creating Documentation

Check:
1. `docs/` — does the document already exist?
2. `docs/documentation-governance.md` — what format and rules apply?
3. `docs/change-log.md` — has the topic been previously documented?

---

## 12. Related Documents

### Governance Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Repo Knowledge Base | `docs/repo-knowledge-base.md` | **← You are here** |
| Agent Discovery | `AGENTS.md` | Root agent/instruction/skill discovery file |
| Documentation Governance | `docs/documentation-governance.md` | Source of truth rules, conflict resolution, update rules |
| Change Log | `docs/change-log.md` | All significant repo changes |
| Decision Log | `docs/decision-log.md` | Business/design decisions (DEC-2026-NNN) |
| RAQ Log | `docs/risks-assumptions-questions.md` | Risks, assumptions, questions |

### Workflow & Visibility Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Workflow & Approval Rules | `docs/04_WORKFLOW_APPROVAL_RULES.md` | Per-form approval classification, status values, approval actors |
| Section Visibility Rules | `docs/05_SECTION_VISIBILITY_RULES.md` | Per-form section visibility by role and status |

### Development Process Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Audit Output Template | `docs/08_AUDIT_TEMPLATE.md` | Standardized tables for form audits |
| Batch Development Plan | `docs/09_BATCH_DEVELOPMENT_PLAN.md` | 10-batch schedule of 3 forms each |
| Prompt Library | `docs/10_PROMPT_LIBRARY.md` | 10 reusable prompts for consistent AI agent tasks |

### Migration Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Migration Overview | `docs/migration-documentation.md` | Overall migration strategy |
| Implementation Plan | `docs/implementation-plan.md` | Phase-by-phase task tracking |
| Testing & Validation | `docs/testing-and-validation.md` | Test plans and validation |

### Agent Configuration

| Document | Location | Purpose |
|----------|----------|---------|
| Agent Instructions | `.github/instructions/domino-migration.instructions.md` | AI agent instructions |
| Agent Skill | `.github/skills/domino-migration/SKILL.md` | Detailed procedures |
| Agent Mode | `.github/agents/domino-migration-agent.agent.md` | Agent mode definition |

### App Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| App README | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/README.md` | App setup and overview |
| App Blueprint | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/docs/overview.md` | Technical blueprint |
| App Cleanup Plan | `docs/app-repo-cleanup-plan.md` | Duplicate resolution and cleanup |

---

> **Maintenance Note**: This document must be updated whenever:
> - A new folder is added to the repo
> - An existing folder's purpose changes
> - A new data source is discovered
> - A governance rule changes
> - Legacy content is archived or deleted
>
> Update trigger: any structural repo change
> Update frequency: as needed, per structural change
> Owner: Migration Lead
