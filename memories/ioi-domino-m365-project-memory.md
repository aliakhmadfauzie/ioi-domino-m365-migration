# IOI Domino to M365 Project Memory

> Purpose: knowledge-transfer memory for AI agents working in this repo.
> Generated: 2026-06-02
> Repo: `C:\Users\AL_AAF\Project\ioi_Docs`

This project migrates IOI Group Lotus Domino applications to Microsoft 365 using SharePoint lists, a Power Apps code-first app, and Power Automate. Treat this file as a fast orientation layer only. The authoritative sources remain the repo documents listed below.

## Startup Checklist For Agents

Before making any change:

1. Read `AGENTS.md`.
2. Read `docs/repo-knowledge-base.md`.
3. Read `docs/central-form-reference.md` before any form, schema, workflow, routing, or data-source change.
4. Read `docs/documentation-governance.md` for source-of-truth and update rules.
5. Read `docs/change-log.md` to understand recent work and avoid undoing it.
6. For app code, read `ioicodeapp/.github/copilot-instructions.md`.
7. For Domino migration work, read `.github/instructions/domino-migration.instructions.md`.
8. Check the local code and live generated schemas before trusting older design docs.

Never guess at field mappings, workflow approvals, SharePoint internal column names, or form-code aliases. If evidence is missing, log it in `docs/risks-assumptions-questions.md`.

## Current Scope And Status

- Portfolio scope: about 418+ Domino forms across 36 department-sites.
- Sites: 22 Penang/Prai departments and 14 Johor/PanCen departments.
- Evidence: 626 clean HCL PDFs under `source/pdf/pdf_form_hcl/hcl_form_pdf/`, plus 1,171 extracted PDFs.
- Current build focus: IT first, then HR and other departments.
- IT analysis: 23 Domino forms analyzed originally; app evidence now tracks about 28 IT form variants/page families.
- App schemas: 27 JSON files currently present in `src/form-schemas/` during this scan.
- Central reference reports 29 JSON form schemas, 144 sections, 1006 fields, 24 confirmed active forms, and 5 duplicate/legacy/outdated forms.
- SharePoint: `MainDB_IT` plus extension lists are provisioned for IT; HR work has begun with `MainDB_HR` and HR extension lists.
- PAC CLI is authenticated according to project status, but verify live environment before doing tenant operations.
- TypeScript and Vite build have recently passed, but always rerun verification after code changes.

## Source Of Truth Priority

Use this priority when sources conflict:

1. `docs/decision-log.md`
2. Actual SharePoint production/dev list schema
3. Current app implementation under `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/`
4. Live Power Automate flows
5. Domino DXL/XML under `source/dxl/`
6. Domino PDF UI exports under `source/pdf/`
7. `mapping/field-mapping.*`
8. `m365-design/*`
9. `analysis/*`
10. Notes, screenshots, or draft artifacts

Important nuance: the current app code can supersede older design docs. Several design docs still describe intent or older Canvas/Power Fx assumptions, while the actual app is React/TypeScript code-first.

## Repository Map

Core source-of-truth folders:

- `docs/`: governance, decisions, change log, testing, workflow/visibility rules, project documentation.
- `analysis/`: Domino field inventories, workflow analysis, evidence reconciliation, CRUD gaps, source analysis.
- `mapping/`: Domino-to-M365 field mapping and migration rules.
- `m365-design/`: SharePoint, Power Apps, and Power Automate design intent.
- `source/`: original Domino evidence. Reference only. Do not modify.
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/`: active code-first Power Apps app.
- `audit/`, `automation/`, `source_analysis/`: audit findings, task queues, rollout registers, and fix reports.
- `memories/`: AI memory and handoff artifacts.

Reference-only or generated areas:

- `source/dxl/*`
- `source/pdf/*`
- `source/screenshots/*`
- `.github/instructions/*`
- `.github/skills/*`
- `.github/agents/*`
- `ioicodeapp/powerapps-mirror/Import/*`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/node_modules/*`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/dist/*`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/*` unless regenerating/exporting SDK evidence intentionally

Known stale paths:

- `ioicodeapp/apps/ioi-platform/`: legacy stub. Do not use for development.
- `ioicodeapp/app.js`, `index.html`, `styles.css`, `data.json`: legacy static replica.
- `ioicodeapp/README.md`: older Acidchem Portal replica context.
- `agent/agent-instructions.md` and `agent/skills.md`: deprecated redirects.

## Architecture Decisions

Active decisions from `docs/decision-log.md`:

- DEC-2026-001: use one main list per site, for example `MainDB_IT`, with `FormCode` as discriminator plus extension lists.
- DEC-2026-002: use Power Apps code-first with React, TypeScript, and Vite instead of a classic Canvas app.
- DEC-2026-003: use a single app filtered by form and department, not separate apps per department.
- DEC-2026-004: use `MainDB_IT_JHR` for Johor IT with matching base schema and Johor-specific fields.
- DEC-2026-005: deploy IT first, then other departments in waves.
- DEC-2026-006: use solution-aware Power Automate flows.
- DEC-2026-007: structured form data must live in SharePoint model columns, not JSON inside `remarks`.
- DEC-2026-008: CIR uses `MainDB_HR` parent metadata plus `MainDB_HR_Ext_Cafeteria` for CIR-specific fields.
- DEC-2026-009: keep IT legacy form-code aliases active for UAT routing and list filters.
- DEC-2026-010: HI hardware-specific fields use `MainDB_IT_Ext_Assets` for UAT.

Note: `DEC-2026-007` appears twice in the decision log: one entry for model-column storage and another older entry for SAPSOF decomposition. Treat the model-column storage rule as the critical current implementation rule.

## Active App

Canonical app path:

`ioicodeapp/powerapps-mirror/apps/ioi-platform/`

Tech stack:

- React 19
- TypeScript 5.9
- Vite 7.3
- `@microsoft/power-apps` SDK 1.1.3
- React Router 7
- TanStack Query/Table
- shadcn/Radix UI components
- Tailwind CSS 4
- lucide-react icons

Useful scripts:

- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Fast check: `npm run check:fast`
- Lint: `npm run lint`
- Power config audit: `npm run power-config:audit`
- Strict power config audit: `npm run power-config:audit:strict`

Current app source directories:

- `src/app`
- `src/components`
- `src/config`
- `src/contexts`
- `src/data`
- `src/debug`
- `src/departments`
- `src/features`
- `src/form-schemas`
- `src/forms`
- `src/generated`
- `src/hooks`
- `src/lib`
- `src/modules`
- `src/pages`
- `src/routes`
- `src/services`
- `src/store`
- `src/types`

Important implementation files and areas:

- `src/config/departments.ts`: active department/module config.
- `src/departments/departmentRegistry.ts`: debug/registry view aligned to active app inventory.
- `src/lib/it-forms-config.ts`: IT form configuration and submit transforms.
- `src/lib/it-form-routes.ts`: canonical IT form aliases and route helpers.
- `src/lib/it-approval-actions.ts`: shared IT approval action writer.
- `src/routes/it-routes.tsx`: IT route registration.
- `src/routes/shared.tsx`: shared routes and legacy redirect behavior.
- `src/components/dynamic-form/*`: schema-driven form rendering.
- `src/hooks/use-dynamic-form.ts`: dynamic form submit flow.
- `src/generated/models/*`: typed generated SharePoint models.
- `src/generated/services/*`: generated SharePoint CRUD services.

## Form Schemas And IT Pages

Current `src/form-schemas` files:

- `DCALOG.json`
- `EAF.json`
- `HI.json`
- `INTUATSOF.json`
- `IOIPOL.json`
- `ISGDOC.json`
- `ITDAILYRPT.json`
- `ITDR2.json`
- `ITEVT.json`
- `ITINFO.json`
- `ITSC.json`
- `ITSSR.json`
- `NOTESID.json`
- `PRF.json`
- `PWDRESET.json`
- `SAPAMR.json`
- `SAPCA.json`
- `SAPCR.json`
- `SAPDRP.json`
- `SAPSLCF.json`
- `SAPTR.json`
- `SFAR.json`
- `SILOUATSOF.json`
- `SVRREBOOT.json`
- `SVRREC.json`
- `TRNMAN.json`
- `USERID.json`

Current IT form page folders:

- `[formCode]`
- `asset-submission`
- `dcal`
- `drr`
- `eaf`
- `edl`
- `hi`
- `hwrr`
- `ioip`
- `isgdoc`
- `itdr`
- `itdr2`
- `ite`
- `itinfo`
- `itp`
- `itsc`
- `itssr`
- `mpsprn`
- `nir`
- `prf`
- `rs`
- `sap-inc`
- `sapamr`
- `sapca`
- `sapcr`
- `sapdrp`
- `sapslcf`
- `sapsof2`
- `saptr`
- `sfar`
- `srl`
- `srr`
- `srvr`
- `trnman`
- `ur`

Important aliases from DEC-2026-009:

- `VPNACCESS` maps to `EAF`
- `NOTESID` maps to `NIR`
- `PWDRESET` maps to `RS`
- `USERID` maps to `UR`
- `IOIPOL` maps to `IOIP`
- `ITDAILYRPT` maps to `ITDR`
- `ITEVT` maps to `ITE` / `IAL3`
- `SVRREBOOT` maps to `SRL` / `IAL1`
- `SVRREC` maps to `SRVR` / `IAL4`
- `HWINV_PRAI` maps to `HI`
- `INTUATSOF` and `SILOUATSOF` map to `SAPSOF2`

Known outdated or reference schemas:

- `VPNACCESS.json` was superseded by `EAF.json` in earlier docs. It is not present in the current schema listing from this scan.
- `HWINV_PRAI.json` was superseded by `HI.json` in earlier docs. It is not present in the current schema listing from this scan.
- `ITEVT.json` and `SVRREBOOT.json` are legacy reference schemas; active custom pages exist under `ite` and `srl`.
- `SAPAMR.json` is marked as legacy in central reference; active config is in `it-forms-config.ts`.
- `PWDRESET.json` is retained for reference; active reset-password implementation routes through `RS`.

## High-Priority IT Forms

Use `docs/central-form-reference.md` for full detail. Snapshot:

- `EAF`: External Access Form. Highest priority. VPN/Citrix. Five-stage approval.
- `ITSSR`: IT Support and Service Request. Highest priority. Three-stage support routing/assignment flow.
- `HI`: Hardware Inventory. High priority. Uses `MainDB_IT_Ext_Assets` for hardware-specific data during UAT.
- `PRF`: Program Request Form. High priority. Six-stage approval/work task flow.
- `NIR`, `RS`, `SAPAMR`, `SAPCR`, `SFAR`, `SAPSOF2`: high-complexity approval or SAP/access forms.
- `SAPSOF2`: complex SAP sign-off implementation; `IT_SAPSOF_TestEvidence` list was recently added.

## SharePoint And Data Rules

Core sites:

- Admin: `https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites`
- IT: `https://ioioi.sharepoint.com/sites/ioi-portal-it`
- HR: `https://ioioi.sharepoint.com/sites/ioi-portal-hr`

Core list pattern:

- IT Prai: `MainDB_IT`
- IT Johor: `MainDB_IT_JHR`
- HR Prai: `MainDB_HR`
- HR Johor: `MainDB_HR_JHR`
- Other department examples: `MainDB_FIN`, `MainDB_PRD`, `MainDB_SHE`, `MainDB_QA`, `MainDB_STR`
- Extension lists: `MainDB_IT_Ext_*`, `MainDB_HR_Ext_*`

Critical storage rules:

- Every real form field needs a discrete SharePoint model column.
- Do not store structured form data as JSON in `remarks`.
- `remarks` is free-text notes only.
- Use `submitTransform` in the form config to map UI field IDs to SharePoint model column names.
- Detail pages must read model columns, not `JSON.parse(record.remarks)`.
- Extension lists are acceptable for repeated sub-forms, child rows, signatures, line items, or where a current approved decision says so.
- Do not create system columns such as `SubmittedBy`, `SubmittedDate`, or `Editor1`; use SharePoint `Created By`, `Created`, and built-in metadata.
- Use SharePoint internal names, not display labels, for service writes and filters.

Generated service rules:

- Prefer generated services in `src/generated/services/`.
- Prefer typed models in `src/generated/models/`.
- Use `asRead()` / `asWrite()` style casts where the local pattern expects them.
- Avoid direct `fetch()` or ad hoc REST calls when a generated service exists.
- Avoid broad `as any` casts that hide SharePoint schema mismatch.

## Workflow And Approval Rules

Approval must be discovered from evidence; do not invent approval buttons, statuses, or approver fields.

Primary workflow references:

- `docs/04_WORKFLOW_APPROVAL_RULES.md`
- `docs/05_SECTION_VISIBILITY_RULES.md`
- `analysis/workflow-analysis.md`
- `docs/central-form-reference.md`
- DXL source and PDF UI evidence for unresolved cases

EAF workflow snapshot:

- States: Request, Submitted, HOD Approval, COO/Director Approval, Done.
- Domino fields include `currentaction`, `status1-4`, `date1-5`, and `comment1-4`.
- `isPCN` determines COO vs Director route.

ITSSR workflow snapshot:

- Routed cases should show routed/not assigned until `ITSSR_AssignedTo_Email` is written.
- `ITSSR_SendTo_Email` exists on `MainDB_IT_Ext_Support`.
- Assignment and section visibility must distinguish routed target from actual assigned owner.

Non-approval forms:

- Some forms are record/report-only and should not receive approval workflow just because other forms have one.
- ITDR and ITDR2 were recently aligned as non-approval reports with `Sent` behavior.

## App Coding Rules

From `ioicodeapp/.github/copilot-instructions.md`:

- Always use `EmployeePicker` for person/name fields, not a plain input.
- New form pages generally use a two-step create: parent record first, then extension record with parent link when needed.
- Every detail page must handle loading, error, and empty/missing states.
- Title convention is `{FORMCODE}-{YYYYMMDD-HHmmss}`.
- Badges use explicit color classes such as `bg-{color}-100 text-{color}-800 border-none`.
- Do not leave `SAMPLE_DATA` or mock arrays in production code paths.
- Do not hardcode list GUIDs, site URLs, or column names in page code when config/service layers exist.
- Keep changes focused. Do not refactor unrelated code.
- Update documentation when behavior changes.

## Form Work Procedure

For any form change:

1. Confirm the requested form and active alias in `src/lib/it-form-routes.ts`.
2. Read `docs/central-form-reference.md` for fields, sections, workflow, and data connections.
3. Check schema in `src/form-schemas/{FORM}.json`.
4. Check actual page folder under `src/pages/it/forms/{route}`.
5. Check services/models under `src/generated/`.
6. Check live or exported SharePoint schema if the change touches columns or list writes.
7. Confirm workflow rules in `docs/04_WORKFLOW_APPROVAL_RULES.md` and `docs/05_SECTION_VISIBILITY_RULES.md`.
8. Implement in the smallest local surface.
9. Run typecheck/build.
10. Update `docs/change-log.md`; update central reference or decision/RAQ docs when behavior or evidence changes.

## Verification Commands

Run from `ioicodeapp/powerapps-mirror/apps/ioi-platform/`:

```powershell
npm run typecheck
npm run build
npm run check:fast
npm run power-config:audit
```

Use `npm run build` as the production gate because it performs `tsc -p tsconfig.app.json --noEmit` and `vite build`.

## Recent Context From Change Log

Recent 2026-06-02 work included:

- Debug department registry aligned to active department inventory.
- Additional fallback field cards removed from detail screens.
- EAF request info display and Client ID requirement aligned.
- ITSSR routed-vs-assigned logic fixed.
- SAPSOF test-evidence SharePoint list registered.
- IT form action writers audited and wired to shared approval writer.
- EAF list/index columns corrected.
- Old `/submissions/{id}` detail routing replaced with canonical IT form detail routing.
- IT UAT blockers cleared with legacy alias routing and storage decisions.
- My Submissions routing fixed to canonical detail URLs.
- ITDR/ITDR2 support-list date column internal names checked.
- App build restored after generated page syntax/type issues.
- HR CIR extension-list read/write path fixed and re-audited.

When working in these areas, inspect the touched files first so you do not undo recent fixes.

## Open Risks And Watch Items

- Live SharePoint schema export is not always complete or current; verify before column-sensitive work.
- Some schemas and pages are legacy or aliases; active route may differ from Domino form code.
- Some older design docs describe Canvas/Power Fx patterns while the actual app is code-first React.
- `remarks` JSON usage must be removed from structured fields per DEC-2026-007.
- Some forms previously used sample data; production paths should not.
- Approval role matrices still need business confirmation in some areas.
- HR and non-IT departments are less mature than IT; treat their evidence as wave-specific and verify local analysis.

## Best Short Prompt For A Future Agent

Use this when starting a new task in this repo:

```text
You are working in C:\Users\AL_AAF\Project\ioi_Docs on the IOI Domino to M365 migration.
Before changing anything, read AGENTS.md, docs/repo-knowledge-base.md,
docs/central-form-reference.md, docs/documentation-governance.md,
docs/change-log.md, ioicodeapp/.github/copilot-instructions.md, and this memory file.
The active app is ioicodeapp/powerapps-mirror/apps/ioi-platform.
Use SharePoint model columns for structured data; do not use remarks JSON.
Respect IT form aliases in src/lib/it-form-routes.ts.
Verify with npm run typecheck and npm run build after code changes.
Log significant changes in docs/change-log.md.
```
