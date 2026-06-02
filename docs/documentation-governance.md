# Documentation Governance — Domino to M365 Migration

> **Generated**: 2026-05-31
> **Project**: IOI Group Domino → M365 Migration
> **Repo**: `C:\Users\AL_AAF\Project\ioi_Docs`
> **Governance Version**: 1.0
> **See Also**: [`docs/repo-knowledge-base.md`](./repo-knowledge-base.md) — authoritative folder inventory and placement rules

---

## Table of Contents

1. [Documentation Review](#1-documentation-review)
2. [Documentation Inventory](#2-documentation-inventory)
3. [Source of Truth Rules](#3-source-of-truth-rules)
4. [Documentation Update Rules](#4-documentation-update-rules)
5. [Repo Documentation Structure](#5-repo-documentation-structure)
6. [Change Log Template](#6-change-log-template)
7. [Decision Log Template](#7-decision-log-template)

---

## 1. Documentation Review

### Review Methodology
Each document in the repo was reviewed against:
- Current repo file structure (as of 2026-05-31)
- Actual Power Apps code-first app implementation (`powerapps-mirror/apps/ioi-platform/`)
- Power Platform connection state (PAC authenticated)
- SharePoint list creation state (MainDB_IT + some extensions existing)
- Domino DXL/XML analysis completeness (23 forms analyzed)
- Actual content accuracy vs. current migration progress

### Classification Key
| Status | Meaning |
|--------|---------|
| **✅ Current** | Accurate and up-to-date |
| **⚠️ Partially current** | Mostly accurate, needs minor updates |
| **❌ Outdated** | Contains incorrect or superseded information |
| **📌 Missing** | Document does not exist but should |
| **🔁 Duplicate** | Content exists in another location |
| **👤 Needs owner review** | Requires human SME input |
| **💼 Needs business confirmation** | Requires stakeholder approval |

### Documentation Review Table

| Document | Location | Purpose | Current State | Gap / Issue | Recommended Update |
|---|---|---|---|---|---|
| `migration-documentation.md` | `docs/` | Overall migration overview, strategy, key findings | ⚠️ Partially current | - References `MainDB_IT` as Prai and `MainDB_IT_JHR` as Johor — some lists now exist<br>- Doesn't mention the `powerapps-mirror` code-first app<br>- Doesn't reference PAC auth status or SharePoint creation progress | Update with actual SharePoint list creation status, app repo location, and PAC connection state |
| `implementation-plan.md` | `docs/` | Step-by-step implementation tasks by phase | ⚠️ Partially current | - Phase 1 (SharePoint) shows all ⬜ Pending, but some lists exist<br>- Phase 2 (PAC) shows ⬜ Pending, but PAC is now authenticated<br>- Phase 4 tasks don't mention the `powerapps-mirror` or `powerapps-bundles-inbox` as alternative code paths | Mark Phase 1.1-1.2 as in progress, Phase 2.1 as done, add note about dual code paths |
| `risks-assumptions-questions.md` | `docs/` | RAQ log | ⚠️ Partially current | - Assumption 1 (SharePoint access) and 2 (Power Platform) may now be validated<br>- Question 2 (existing lists) may now be answerable<br>- Doesn't mention the pre-built `powerapps-mirror` app packaging issues | Update validated assumptions, add new risks around app mirror sync |
| `domino-field-inventory.md` | `analysis/` | Complete field inventory of all 23 Domino forms | ✅ Current | — | None needed |
| `pdf-ui-inventory.md` | `analysis/` | UI element inventory from PDF exports | ❌ Outdated — mostly empty | Contains only table headers, no actual data populated | Needs full population from the 1,171 PDF UI exports |
| `evidence-reconciliation.md` | `analysis/` | Cross-reference DXL vs PDF evidence | ✅ Current | SAPSOF still ⚠️ in progress; all others resolved | None needed — update when SAPSOF completes |
| `workflow-analysis.md` | `analysis/` | Domino workflow analysis | ✅ Current | — | None needed |
| `field-mapping.md` | `mapping/` | Detailed field mapping documentation | ✅ Current | — | None needed |
| `field-mapping.csv` | `mapping/` | Machine-readable field mapping | ✅ Current | — | None needed |
| `data-migration-rules.csv` | `mapping/` | Data transformation rules | ✅ Current | — | None needed |
| `sharepoint-list-design.md` | `m365-design/` | SharePoint list schema designs | ⚠️ Partially current | - Lists `MainDB_FIN`, `MainDB_HR` etc in diagram — may not be created<br>- Extension list columns partially defined<br>- No actual creation scripts referenced | Add creation script references, mark which lists exist |
| `powerapps-design.md` | `m365-design/` | Power Apps app design | ⚠️ Partially current | - Describes a Power Fx canvas app, but the actual app is a React+TypeScript code-first app<br>- Screens listed (HomeScreen, NewRequestScreen, etc.) don't match actual page structure<br>- MVP phases listed but actual app is more complete | Rewrite to reflect actual code-first architecture in `powerapps-mirror/apps/ioi-platform/` |
| `power-automate-design.md` | `m365-design/` | Power Automate flow designs | ✅ Current | Flows are designed but not yet built — design is accurate | None needed |
| `agent-instructions.md` | `agent/` | Agent instructions for migration | 🔁 Duplicate — deprecated | Points to `.github/instructions/domino-migration.instructions.md` as replacement | Keep as-is (redirect) |
| `skills.md` | `agent/` | Migration skills documentation | 🔁 Duplicate — deprecated | Points to `.github/skills/domino-migration/SKILL.md` as replacement | Keep as-is (redirect) |
| `review-checklist.md` | `agent/` | Migration review checklist | ✅ Current | — | None needed |
| `output-templates.md` | `agent/` | Output format templates | ✅ Current | — | None needed |
| `ioicodeapp/README.md` | `ioicodeapp/` | Old Acidchem Portal replica README | ❌ Outdated | References "Acidchem Portal Replica", not the actual migration app | Update or mark as legacy |
| `powerapps-mirror/SCRAPE_STATUS.md` | `ioicodeapp/powerapps-mirror/` | Documents scraping process for code-first app | ✅ Current | — | None needed |
| `powerapps-mirror/apps/ioi-platform/README.md` | `ioicodeapp/powerapps-mirror/apps/ioi-platform/` | Code-first app README | ⚠️ Partially current | Minimal — just lists visible tree nodes | Add build/run/deploy instructions |
| `powerapps-mirror/apps/ioi-platform/docs/overview.md` | App docs | Power Apps code-first dev standards | ✅ Current | — | None needed (is a development standard, not migration doc) |
| `change-log.md` | `docs/` | Track all significant repo changes | 📌 **Missing** | No change log exists | **Create immediately** |
| `decision-log.md` | `docs/` | Track business/design decisions | 📌 **Missing** | No decision log exists | **Create immediately** |
| `testing-and-validation.md` | `docs/` | Test plans and validation criteria | 📌 **Missing** | No test plan exists | **Create immediately** |
| `project-overview.md` | `docs/` | High-level project overview | 📌 **Missing** | Content exists in `migration-documentation.md` — may be sufficient | Optional — content can stay in migration-documentation.md |

### Summary

| Status | Count | Files |
|--------|-------|-------|
| ✅ Current | 10 | domino-field-inventory, evidence-reconciliation, workflow-analysis, field-mapping.md/.csv, data-migration-rules.csv, review-checklist, output-templates, SCRAPE_STATUS.md, overview.md |
| ⚠️ Partially current | 6 | migration-documentation, implementation-plan, RAQ log, sharepoint-list-design, powerapps-design, app README |
| ❌ Outdated | 2 | pdf-ui-inventory (empty), ioicodeapp/README.md |
| 🔁 Duplicate | 2 | agent-instructions.md, skills.md (redirect to .github/) |
| 📌 Missing | 3 | change-log.md, decision-log.md, testing-and-validation.md |
| **Total** | **23** | — |

---

## 2. Documentation Inventory

### Governance Rules for this Inventory

| Rule | Value |
|------|-------|
| **Owner** | Migration Lead (You) |
| **Update Trigger** | Any change to repo, list, app, or flow |
| **Update Frequency** | After each significant milestone |
| **Source of Truth** | This document |
| **Format** | Markdown + CSV |

### Complete Documentation Inventory

| # | Document | File Path | Owner | Update Trigger | Update Frequency | Source of Truth | Status |
|---|----------|-----------|-------|----------------|-----------------|-----------------|--------|
| 1 | Project Overview & Strategy | `docs/migration-documentation.md` | Migration Lead | New form added, architecture change, deployment milestone | Per milestone | SharePoint design + app repo | ⚠️ Partially current |
| 2 | Implementation Plan | `docs/implementation-plan.md` | Migration Lead | Any phase task completed or added | Per task completion | Actual repo + SharePoint state | ⚠️ Partially current |
| 3 | Risks, Assumptions & Questions | `docs/risks-assumptions-questions.md` | Migration Lead | New risk/assumption/question identified, milestone reached | Per milestone or weekly | Business confirmation + implementation reality | ⚠️ Partially current |
| 4 | Change Log | `docs/change-log.md` | Migration Lead | Any repo change, file creation, or update | Per change | Git log + actual changes | 📌 **To create** |
| 5 | Decision Log | `docs/decision-log.md` | Migration Lead + Business Stakeholders | Design decision made, architecture choice confirmed | Per decision | Business approval | 📌 **To create** |
| 6 | Testing & Validation | `docs/testing-and-validation.md` | Migration Lead + QA | Test cases defined, UAT completed, bugs found | Per test phase completion | Actual test results | 📌 **To create** |
| 7 | Domino Field Inventory | `analysis/domino-field-inventory.md` | Migration Lead | New form discovered, fields corrected | Per form analysis | DXL/XML source files | ✅ Current |
| 8 | Domino Field Inventory (CSV) | `analysis/domino-field-inventory.csv` | Migration Lead | Sync with .md version | Per form analysis | DXL/XML source files | ✅ Current |
| 9 | Domino Field Inventory (JSON) | `analysis/domino-field-inventory.json` | Migration Lead | Sync with .md version | Per form analysis | DXL/XML source files | ✅ Current |
| 10 | PDF UI Inventory | `analysis/pdf-ui-inventory.md` | Migration Lead | New PDF evidence discovered, UI elements cataloged | Per form analysis | PDF UI exports (1,171 files) | ❌ Needs population |
| 11 | Evidence Reconciliation | `analysis/evidence-reconciliation.md` | Migration Lead | DXL or PDF evidence updated, discrepancies found/resolved | Per form reconciliation | DXL source + PDF exports | ✅ Current |
| 12 | Workflow Analysis | `analysis/workflow-analysis.md` | Migration Lead | Workflow logic confirmed or corrected | Per form analysis | DXL agent code + UI walkthrough | ✅ Current |
| 13 | Field Mapping (MD) | `mapping/field-mapping.md` | Migration Lead | Field mapping changed, new form added | Per form mapping | Field mapping CSV (source of truth) | ✅ Current |
| 14 | Field Mapping (CSV) | `mapping/field-mapping.csv` | Migration Lead | Field mapping changed, new form added | Per form mapping | DXL source + business confirmation | ✅ Current |
| 15 | Data Migration Rules | `mapping/data-migration-rules.csv` | Migration Lead | Transformation logic changed, new rule defined | Per mapping change | Field mapping CSV + business rules | ✅ Current |
| 16 | SharePoint List Design | `m365-design/sharepoint-list-design.md` | Migration Lead | List created/modified, columns changed | Per list change | Actual SharePoint live schema | ⚠️ Partially current |
| 17 | Power Apps Design | `m365-design/powerapps-design.md` | Migration Lead | Screen added, formula changed, data source changed | Per app build cycle | Actual app repo (`powerapps-mirror/apps/ioi-platform/`) | ⚠️ Partially current |
| 18 | Power Automate Design | `m365-design/power-automate-design.md` | Migration Lead | Flow created, modified, or deprecated | Per flow change | Power Automate environment | ✅ Current (flows not yet built) |
| 19 | Agent Instructions | `agent/agent-instructions.md` | Migration Lead | Agent behavior changed, new rules needed | Per agent improvement | `.github/instructions/domino-migration.instructions.md` | 🔁 Redirect to .github |
| 20 | Skills | `agent/skills.md` | Migration Lead | New skill needed, procedure changed | Per skill improvement | `.github/skills/domino-migration/SKILL.md` | 🔁 Redirect to .github |
| 21 | Review Checklist | `agent/review-checklist.md` | Migration Lead | New checklist item identified | Per checklist improvement | Migration lessons learned | ✅ Current |
| 22 | Output Templates | `agent/output-templates.md` | Migration Lead | New output format needed | Per template improvement | Migration requirements | ✅ Current |
| 23 | App Readme (Mirror) | `ioicodeapp/powerapps-mirror/apps/ioi-platform/README.md` | Developer | App structure changed, deployment instructions updated | Per app version | Actual app repo | ⚠️ Partially current |

---

## 3. Source of Truth Rules

### Priority Model

When information conflicts between sources, use this priority (1 = highest authority):

| Priority | Source | Rationale |
|----------|--------|-----------|
| **1** | Approved Business Decision Log (`docs/decision-log.md`) | Stakeholder-approved decisions override all technical assumptions |
| **2** | Current SharePoint Production/Dev List Schema | The actual SharePoint lists are the ground truth for what exists |
| **3** | Current Power Apps Repo Implementation (`powerapps-mirror/apps/ioi-platform/`) | Code reflects what was actually built |
| **4** | Power Automate Environment (live flows) | Running flows reflect actual automation |
| **5** | Domino DXL/XML Source Files | Original source — definitive for Domino-side facts |
| **6** | Domino PDF/UI Export | Visual confirmation of DXL interpretation |
| **7** | Field Mapping Documents (`mapping/field-mapping.*`) | Intended mapping — may diverge from actual implementation |
| **8** | Design Documents (`m365-design/*`) | Design intent — may differ from implementation |
| **9** | Analysis Documents (`analysis/*`) | Analysis findings — may need reconciliation |
| **10** | Notes, Screenshots, Meeting Comments | Lowest authority — unverified |

### Conflict Resolution Rules

| Information Type | Primary Source of Truth | Secondary Source | Conflict Resolution Rule |
|---|---|---|---|
| **Field Names** | Field Mapping CSV (`mapping/field-mapping.csv`) | DXL/XML source | CSV wins if it matches DXL; otherwise update CSV from DXL |
| **Field Labels** | PDF UI export screenshots | DXL/XML `<field><label>` element | PDF label is what users see; DXL label is the code name |
| **SharePoint Column Types** | Actual SharePoint list schema | SharePoint List Design doc | Schema wins; update design doc to match reality |
| **Choice Values** | Actual SharePoint choice column settings | DXL keyword lists + PDF UI dropdowns | SharePoint settings are authoritative; update from Domino if migration not yet done |
| **Power Apps Control Names** | App source code (`powerapps-mirror/apps/ioi-platform/src/`) | Power Apps Design doc | Source code wins; update design doc |
| **Workflow Statuses** | Power Automate flow definitions + SharePoint status column | Workflow Analysis doc | Working automation > designed states > analyzed states |
| **Approval Roles** | Business Decision Log (`docs/decision-log.md`) | DXL agent code (MailSend recipients) | Business decision wins; use DXL as reference |
| **Department-Specific Rules** | Decision Log + Field Mapping CSV | DXL computed-field formulas | Business rules confirmed by stakeholders > reverse-engineered formulas |
| **Visibility Logic** | Power Apps component props + Power Fx | DXL hide-when formulas | App code wins once implemented; DXL before implementation |
| **Required Fields** | SharePoint column required setting | DXL field required flags | SharePoint settings for live; DXL for planned |
| **Data Migration Rules** | Data Migration Rules CSV (`mapping/data-migration-rules.csv`) | DXL computed-field formulas | CSV wins once confirmed; update from DXL for unconfirmed |
| **Implementation Status** | Implementation Plan (`docs/implementation-plan.md`) | Change Log (`docs/change-log.md`) | Change Log records actual changes; Implementation Plan reflects planned vs actual |
| **Risks and Assumptions** | RAQ Log (`docs/risks-assumptions-questions.md`) | Decision Log | RAQ Log tracks all; Decision Log records which were resolved |

### Source Verification Status

| Source | Status | Last Verified | Notes |
|--------|--------|---------------|-------|
| `docs/decision-log.md` | 📌 **Not yet created** | — | Needs creation; all past decisions need retroactive logging |
| SharePoint List Schema | ⚠️ Partially verified | 2026-05-31 | MainDB_IT + some extensions exist; full schema TBD |
| `powerapps-mirror/apps/ioi-platform/` | ✅ Code scanned | 2026-05-31 | 28 form schemas, 80+ models, 40+ routes — not yet deployed |
| Power Automate Environment | ⚠️ Not verified | — | PAC authenticated but no flows built yet |
| Domino DXL/XML Source Files | ✅ Fully analyzed | 2026-05-31 | All 23 forms inventoried |
| Domino PDF/UI Exports | ✅ Available | 2026-05-31 | 1,171 PDFs extracted; 34 IT PDFs mapped to forms |
| Field Mapping CSV | ✅ Complete | 2026-05-31 | ~465 fields mapped across 28 form variants |
| Design Documents | ⚠️ Needs update | 2026-05-31 | Power Apps design describes canvas app; actual is code-first |

---

## 4. Documentation Update Rules

### Change Type → Required Updates

| Change Type | Documents to Update | Required Update | Reviewer / Owner |
|---|---|---|---|
| **New SharePoint list created** | `m365-design/sharepoint-list-design.md`, `docs/implementation-plan.md`, `docs/migration-documentation.md` | Add list to design doc, update plan status, update overview | Migration Lead |
| **SharePoint column added or renamed** | `m365-design/sharepoint-list-design.md`, `mapping/field-mapping.csv`, `mapping/field-mapping.md`, `docs/change-log.md` | Update schema, update mapping, log the change | Migration Lead |
| **Choice values changed** | `m365-design/sharepoint-list-design.md`, `mapping/field-mapping.csv`, `docs/change-log.md` | Update choice lists, update mapping, log the change | Migration Lead |
| **Power Apps screen added** | `m365-design/powerapps-design.md`, `docs/implementation-plan.md`, `docs/change-log.md` | Add screen to design, update plan, log | Developer |
| **Power Apps formula changed** | `m365-design/powerapps-design.md`, `docs/change-log.md` | Document key formula changes, log | Developer |
| **Power Apps data source changed** | `m365-design/powerapps-design.md`, `ioicodeapp/powerapps-mirror/apps/ioi-platform/README.md`, `docs/change-log.md` | Update data source list, update README, log | Developer |
| **Power Automate flow added** | `m365-design/power-automate-design.md`, `docs/implementation-plan.md`, `docs/change-log.md` | Add flow design, update plan, log | Migration Lead + Developer |
| **Workflow status changed** | `m365-design/power-automate-design.md`, `analysis/workflow-analysis.md`, `docs/change-log.md` | Update workflow design, note in analysis, log | Migration Lead |
| **Approval role changed** | `m365-design/power-automate-design.md`, `docs/decision-log.md`, `docs/risks-assumptions-questions.md` | Update flow roles, log decision, update RAQ | Migration Lead + Business |
| **Domino requirement confirmed** | `analysis/evidence-reconciliation.md`, `mapping/field-mapping.csv`, `docs/change-log.md` | Mark reconciled, finalize mapping, log | Migration Lead |
| **Field mapping changed** | `mapping/field-mapping.csv`, `mapping/field-mapping.md`, `mapping/data-migration-rules.csv`, `docs/change-log.md` | Update all mapping files, log | Migration Lead |
| **Department rule changed** | `mapping/data-migration-rules.csv`, `docs/decision-log.md`, `docs/change-log.md` | Update rules, log decision, log change | Migration Lead + Business |
| **Bug fixed** | `docs/testing-and-validation.md` (if test-related), `docs/change-log.md` | Log bug fix, update test results | Developer |
| **Risk identified** | `docs/risks-assumptions-questions.md` | Add risk with impact/probability/mitigation | Migration Lead |
| **Business decision made** | `docs/decision-log.md`, `docs/risks-assumptions-questions.md` (if resolves a question) | Log decision, update RAQ if applicable | Migration Lead + Business |
| **Data migration rule changed** | `mapping/data-migration-rules.csv`, `docs/change-log.md` | Update rules CSV, log | Migration Lead |
| **Test case passed or failed** | `docs/testing-and-validation.md`, `docs/change-log.md` | Update test results, log | QA / Migration Lead |
| **New form added to scope** | `docs/migration-documentation.md`, `analysis/domino-field-inventory.md`, `docs/implementation-plan.md`, `docs/change-log.md` | Update overview, add to inventory, add to plan, log | Migration Lead |
| **Repo file restructured** | `docs/change-log.md`, relevant README files | Log restructuring, update navigation references | Migration Lead |
| **PAC/SharePoint connection changed** | `docs/implementation-plan.md`, `docs/migration-documentation.md` | Update environment references, update plan status | Migration Lead |

### Update Frequency Summary

| Frequency | Documents |
|-----------|-----------|
| **Per change (immediate)** | `docs/change-log.md` |
| **Per decision** | `docs/decision-log.md`, `docs/risks-assumptions-questions.md` |
| **Per form analysis** | `analysis/domino-field-inventory.*`, `analysis/pdf-ui-inventory.md`, `analysis/evidence-reconciliation.md`, `analysis/workflow-analysis.md` |
| **Per form mapping** | `mapping/field-mapping.*`, `mapping/data-migration-rules.csv` |
| **Per list change** | `m365-design/sharepoint-list-design.md` |
| **Per app change** | `m365-design/powerapps-design.md` |
| **Per flow change** | `m365-design/power-automate-design.md` |
| **Per milestone** | `docs/migration-documentation.md`, `docs/implementation-plan.md` |
| **Per test cycle** | `docs/testing-and-validation.md` |

---

## 5. Repo Documentation Structure

### Recommended Structure

```
ioi_Docs/
│
├── docs/                              ← Migration project documentation
│   ├── migration-documentation.md     ← Project overview, strategy, key findings
│   ├── implementation-plan.md         ← Phased task plan with status
│   ├── risks-assumptions-questions.md ← RAQ log
│   ├── documentation-governance.md    ← THIS FILE — governance rules
│   ├── change-log.md                  ← Chronological record of all changes
│   ├── decision-log.md                ← Business/design decisions with rationale
│   └── testing-and-validation.md      ← Test plans, cases, and results
│
├── analysis/                          ← Domino source analysis
│   ├── domino-field-inventory.md      ← Complete field inventory (23 forms)
│   ├── domino-field-inventory.csv
│   ├── domino-field-inventory.json
│   ├── pdf-ui-inventory.md            ← UI element catalog (NEEDS POPULATION)
│   ├── evidence-reconciliation.md     ← DXL vs PDF cross-reference
│   └── workflow-analysis.md           ← Workflow state machine analysis
│
├── mapping/                           ← Field and data mapping
│   ├── field-mapping.md               ← Detailed field mapping docs
│   ├── field-mapping.csv              ← Machine-readable field mapping
│   └── data-migration-rules.csv       ← Data transformation rules
│
├── m365-design/                       ← Target architecture designs
│   ├── sharepoint-list-design.md      ← SharePoint list schemas
│   ├── powerapps-design.md            ← Power Apps app design
│   └── power-automate-design.md       ← Power Automate flow designs
│
├── agent/                             ← Agent customization files
│   ├── agent-instructions.md          ← (redirect to .github/instructions/)
│   ├── skills.md                      ← (redirect to .github/skills/)
│   ├── review-checklist.md            ← Review checklist
│   └── output-templates.md            ← Output format templates
│
├── .github/
│   ├── instructions/
│   │   └── domino-migration.instructions.md
│   └── skills/
│       └── domino-migration/
│           └── SKILL.md
│
└── ioicodeapp/                        ← Power Apps code-first app repo
    ├── powerapps-mirror/
    │   └── apps/ioi-platform/         ← Main app (React + Vite + TypeScript)
    └── powerapps-bundles-inbox/       ← Source export bundles (txt)
```

### File Naming Convention

| Convention | Rule | Example |
|------------|------|---------|
| **All docs** | Lowercase kebab-case | `change-log.md`, `field-mapping.csv` |
| **Analysis files** | Prefix with source type | `pdf-ui-inventory.md`, `domino-field-inventory.csv` |
| **Design files** | Prefix with M365 service | `sharepoint-list-design.md`, `powerapps-design.md` |
| **Mapping files** | Prefix with `field-` or `data-` | `field-mapping.csv`, `data-migration-rules.csv` |
| **Agent files** | Descriptive lowercase | `review-checklist.md`, `output-templates.md` |
| **Dates in filenames** | ISO 8601 compact | `export-20260531.csv` |

---

## 6. Change Log Template

The change log at `docs/change-log.md` should use this format:

```markdown
# Change Log

> **Format**: YYYY-MM-DD | Author | Change Description | Files Affected | Reason

## 2026-05-31

| Date | Author | Change | Files Affected | Reason |
|------|--------|--------|----------------|--------|
| 2026-05-31 | Migration Lead | Created documentation governance system | docs/documentation-governance.md | Governance was missing |
| 2026-05-31 | Migration Lead | Created change log | docs/change-log.md | Required for governance |
| ... | ... | ... | ... | ... |
```

---

## 7. Decision Log Template

The decision log at `docs/decision-log.md` should use this format:

```markdown
# Decision Log

> **Format**: Each decision gets a unique ID: `DEC-{YYYY}-{NNN}`
> **Status**: Proposed / Approved / Rejected / Superseded

## DEC-2026-001: Single Main List vs Per-Form Lists

- **Date**: 2026-05-31
- **Decision**: Use single `MainDB_IT` list per site with `FormCode` discriminator + extension lists
- **Rationale**: Avoid managing 23+ lists; single Power App connection; FormCode views
- **Alternatives Considered**: One list per form (rejected — too many lists)
- **Approved By**: Migration Lead
- **Status**: ✅ Approved
- **Superseded By**: —
- **Notes**: Implemented in `powerapps-mirror/apps/ioi-platform/` code

## DEC-2026-002: [Next decision]
```

---

## Appendix A: Key Contacts

| Role | Person | Area |
|------|--------|------|
| Migration Lead | You | All technical migration |
| SharePoint Admin | You | List creation permissions |
| Power Platform Admin | You | Environment access |
| Business Stakeholder | TBD | Domain decisions, approvals |
| IT Department SME | TBD | Domino workflow validation |

## Appendix B: Quick Reference — Current State Summary

| Dimension | Status | As Of |
|-----------|--------|-------|
| Domino forms analyzed | ✅ 23/23 | 2026-05-31 |
| DXL/XML files inventoried | ✅ 23/23 | 2026-05-31 |
| PDF UI exports cataloged | ⚠️ 34 IT PDFs mapped; full inventory needs population | 2026-05-31 |
| Evidence reconciled | ✅ 21/23 (SAPSOF pending) | 2026-05-31 |
| Workflows analyzed | ✅ 8 workflow forms | 2026-05-31 |
| Fields mapped | ✅ ~465 fields | 2026-05-31 |
| Data migration rules defined | ✅ 45 rules | 2026-05-31 |
| SharePoint lists (MainDB_IT) | ⚠️ Created + some extensions | 2026-05-31 |
| PAC CLI authenticated | ✅ Done | 2026-05-31 |
| Power Apps code-first app | ✅ Built (not deployed) — ⚠️ Needs repo cleanup | 2026-05-31 |
| Power Automate flows | ❌ Not yet built | 2026-05-31 |
| Change log | ✅ Created | 2026-05-31 |
| Decision log | ✅ Created (7 decisions) | 2026-05-31 |
| Testing & validation plan | ✅ Created | 2026-05-31 |
| App repo cleanup plan | ✅ Created — see `docs/app-repo-cleanup-plan.md` | 2026-05-31 |
