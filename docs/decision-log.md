# Decision Log — Domino to M365 Migration

> **Format**: `DEC-2026-{NNN}`
> **Status Options**: Proposed / Approved / Rejected / Superseded
> **Started**: 2026-05-31
> **Last Updated**: 2026-06-02

---

## Active Decisions

### DEC-2026-001: Single Main List vs Per-Form Lists

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Use single `MainDB_IT` list per site with `FormCode` discriminator + extension lists |
| **Rationale** | Avoids managing 23+ separate SharePoint lists. Single Power App connects to one main list. `FormCode` discriminator enables per-form views via filtering. Per-site isolation (Prai/Penang vs Johor). Extension lists keep the main list lean. Centralized approval workflows on the main list. |
| **Alternatives Considered** | 1) One list per form — rejected: too many lists, no cross-form view, complex Power App connections. 2) One parent + child per department — rejected: needs Power App to federate across lists. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Implemented in `powerapps-mirror/apps/ioi-platform/` code. Architecture reflected in `design/m365-design/sharepoint-list-design.md`. |

### DEC-2026-002: Power Apps Code-First vs Canvas App

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Use Power Apps new code app / code-first (React + TypeScript + Vite) rather than classic canvas app |
| **Rationale** | Code-first enables full version control via Git, proper TypeScript type safety, component reusability via shadcn/ui, and standard CI/CD. Canvas app would require `.msapp` unpacking and lacks proper diff/merge. |
| **Alternatives Considered** | 1) Classic canvas app — rejected: poor version control. 2) Model-driven app — rejected: too rigid for complex form requirements. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | App built in `powerapps-mirror/apps/ioi-platform/`. Uses `@microsoft/power-apps` SDK v1.1.3. Power Fx for Canvas-level logic not applicable. |

### DEC-2026-003: Single App with FormCode Filtering vs Per-Department Apps

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Build a single Power Apps code-first app that connects to `MainDB_IT` and filters by `FormCode` and department |
| **Rationale** | Single app to maintain, consistent UX across departments, centralized approval workflows, easier reporting, stay-at-home repo. Department filtering via dropdown or user profile. |
| **Alternatives Considered** | Per-department apps — rejected: 23 apps to maintain, inconsistent UX, complex cross-department workflows. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Implemented in `powerapps-mirror/apps/ioi-platform/src/pages/` with department-hub as entry point. |

### DEC-2026-004: MainDB_IT JHR as Separate List vs Shared Schema

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Create separate `MainDB_IT_JHR` list for Johor site with same base schema plus 2 extra HI columns |
| **Rationale** | Johor has field count differences (HI: 60 vs 58). Separate list avoids null columns in Penang list. Cross-site views can be handled via Power Apps filtering. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | 2 extra Johor HI fields: `Site`, `Building/Level`. |

### DEC-2026-005: Staged Deployment — IT First, Then Other Departments

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Deploy MVP to IT department first; roll out to other departments in subsequent waves |
| **Rationale** | IT has the most complex forms (EAF, ITSSR, SAP, HI) and is the best pilot group. IT team can validate the system and provide feedback before broader rollout. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | HR Domino forms exist but are not yet analyzed — they become Wave 2. |

### DEC-2026-006: Power Automate Cloud Flows vs Solution Flows

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Create Power Automate flows as part of a solution (solution-aware flows) rather than standalone cloud flows |

### DEC-2026-007: All Form Fields MUST Be SharePoint Model Columns (No `remarks` JSON)

| Field | Value |
|-------|-------|
| **Date** | 2026-06-02 |
| **Decision** | All form fields MUST be stored as discrete SharePoint list columns (model columns) on the main or extension list. Do NOT store form fields inside the `remarks` text field as JSON. Do NOT rely on extension lists for primary form data. |
| **Rationale** | 1) `remarks` JSON is not queryable via SharePoint filters or OData — makes reporting, search, and Power Automate triggers impossible. 2) JSON inside a text field breaks column-level security, data validation, and indexing. 3) Extension lists add complexity (separate CRUD, cross-list joins, hydration on detail screens). 4) Model columns enable proper type checking, required/validation rules, indexing, search, Power BI reporting, and Power Automate condition triggers. |
| **Alternatives Considered** | 1) `remarks` JSON storage — rejected: not queryable, no validation, breaks reporting. 2) Extension lists — rejected: adds unnecessary cross-list complexity; only acceptable for truly repeated sub-forms (e.g., multi-row signatures). 3) Mixed approach — rejected: creates confusion about where data lives. |
| **Migration Path** | For forms currently storing data in `remarks` JSON: create proper model columns in MainDB_IT (and extension lists where justified), update `submitTransform` in `it-forms-config.ts` to map form fields to model columns, update `new.tsx` submission logic, update detail pages to read from model columns. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | See `.github/instructions/domino-migration.instructions.md` §Data Storage Rules for implementation guidelines. Existing forms using `remarks` JSON (e.g., SAPCR, EAF request details, ITSSR section data) must be refactored to model columns. |
| **Rationale** | Solution-aware flows can be packaged, versioned, and deployed alongside the Power Apps code-first app. Enables ALM lifecycle management. |
| **Alternatives Considered** | Standalone cloud flows — rejected: cannot be packaged with app, harder to manage across environments. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Design in `design/m365-design/power-automate-design.md`. All flows (EAF approval, auto-numbering, ITSSR routing, escalation) will be solution flows. |

### DEC-2026-007: SAPSOF Decomposition Strategy

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Decision** | Decompose the SAP Sign Off form (385+ fields) into sub-forms/sections rather than a single monolithic form |
| **Rationale** | Single form with 385+ fields is too complex for a single Power Apps screen or SharePoint list item. Break into logical sections: General Info, SAP Details, Testing Results, Sign-off. Use multi-step form navigation. |
| **Alternatives Considered** | 1) Single form — rejected: unusable. 2) Separate SharePoint list per section — rejected: too many lists. |
| **Approved By** | Migration Lead |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | DXL parsing still in progress for SAPSOF. Full decomposition plan will follow evidence reconciliation. |

### DEC-2026-008: CIR Parent + Extension List Data Placement

| Field | Value |
|-------|-------|
| **Date** | 2026-06-02 |
| **Decision** | Keep `MainDB_HR` as the CIR parent metadata/list-discriminator record and place all CIR-specific lowercase `cir*` fields on `MainDB_HR_Ext_Cafeteria`. |
| **Rationale** | Live provisioning showed `MainDB_HR` is at the SharePoint column-size limit. Moving CIR-specific fields to the cafeteria extension list preserves the single HR parent-list pattern while avoiding parent-list capacity risk. |
| **Alternatives Considered** | 1) Add CIR columns directly to `MainDB_HR` - rejected because the live list exceeded the column-size limit. 2) Revise CIR to captured legacy/non-prefixed fields - rejected because it would diverge from the planned HR schema and current CIR code direction. 3) Create a separate standalone CIR parent list - rejected because it breaks the HR `FormCode` parent-record pattern. |
| **Approved By** | Migration Agent, on user delegation to make the CIR decision |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Evidence recorded in `analysis/source_analysis/09_reports/CIR_ARCHITECTURE_DECISION_UPDATE.md`. Next task is `TASK-PROVISION-CIR-SCHEMA` for live extension-list provisioning/export and schema/model regeneration. |

### DEC-2026-009: IT UAT Legacy Form-Code Alias Handling

| Field | Value |
|-------|-------|
| **Date** | 2026-06-02 |
| **Decision** | For IT UAT, legacy/superseded form codes route to the active implementation and database views query active plus legacy aliases together. |
| **Rationale** | Several audit blockers were caused by old Domino/schema names being split from the active code-first route names even though the app already has a working canonical implementation. Keeping aliases prevents dead-end routes and prevents historical records from disappearing from list/detail views. |
| **Canonical Aliases** | `VPNACCESS -> EAF`; `NOTESID -> NIR`; `PWDRESET -> RS`; `USERID -> UR`; `IOIPOL -> IOIP`; `ITDAILYRPT -> ITDR`; `ITEVT -> ITE/IAL3`; `SVRREBOOT -> SRL/IAL1`; `SVRREC -> SRVR/IAL4`; `HWINV_PRAI -> HI`; `INTUATSOF` and `SILOUATSOF -> SAPSOF2`. |
| **Approved By** | Migration Agent, on user instruction to clear IT blockers |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Implemented in `src/lib/it-form-routes.ts`, `src/routes/it-routes.tsx`, and alias-aware list filters. |

### DEC-2026-010: HI Hardware Storage Uses Ext_Assets For UAT

| Field | Value |
|-------|-------|
| **Date** | 2026-06-02 |
| **Decision** | Treat `MainDB_IT_Ext_Assets` as the authoritative storage/read path for HI hardware-specific fields during IT UAT. |
| **Rationale** | Current HI create/list/detail code already writes and reads hardware detail through `MainDB_IT_Ext_Assets`, and re-audit verified read alignment. Keeping this pattern avoids adding duplicate parent-list columns and matches the existing extension-list architecture for hardware data. |
| **Approved By** | Migration Agent, on user instruction to clear IT blockers |
| **Status** | ✅ Approved |
| **Superseded By** | — |
| **Notes** | Resolves the HI storage ownership blocker for UAT scope. |

---

## Superseded Decisions

*None yet.*

---

## Proposed Decisions (Awaiting Review)

*None yet.*

---

## Guidelines

### What Constitutes a Decision?
- Architecture choices (list design, app type, data flow)
- Workflow routing rules
- Approval role assignments
- Field mapping confirmations
- Department-specific deviations
- Technology choices (connectors, SDKs, tools)
- Timeline and milestone commitments
- Scope changes (forms added/removed)

### How to Add a Decision
1. Assign next sequential ID: `DEC-2026-{NNN}`
2. Fill out all fields
3. Set status to `Proposed`
4. Get stakeholder approval → move to `Approved`
5. If superseded later, update status to `Superseded` and reference the new decision

### Where Decisions Flow
- **Approved decisions** → implemented in `powerapps-mirror/apps/ioi-platform/` code
- **Approved decisions** → reflected in `design/m365-design/*` documents
- **Resolved RAQ items** → moved from `docs/risks-assumptions-questions.md` to this log with reference
- **Deployment decisions** → reflected in `docs/implementation-plan.md`
