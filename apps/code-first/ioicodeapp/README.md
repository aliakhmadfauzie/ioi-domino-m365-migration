# IOI Power Apps Code-First App Repo — Domino → M365 Migration

> **⚠️ NOTE**: This folder contains multiple representations of the Power Apps code-first app.
> See below for which is the active development path.

## Repo Contents

| Path | Description | Status |
|------|-------------|--------|
| `powerapps-mirror/apps/ioi-platform/` | **Active** Power Apps code-first app (React + TypeScript + Vite + shadcn/ui) | ✅ Main development path |
| `powerapps-bundles-inbox/` | Source export text bundles from Power Apps builder (27 txt files) | ✅ Authoritative source for rebuilding |
| `powerapps-screenshots/` | Screenshots of the Power Apps builder UI | 📸 Reference |
| `apps/ioi-platform/` | Older project stub (minimal content) | ⚠️ Legacy — redirects to `powerapps-mirror/apps/ioi-platform/` |
| `index.html` + `data.json` + `app.js` | Static replica of Power Apps Vibe project data | 📌 Legacy reference — may be removed in future |
| `domino-form-reader.SKILL.md` | Domino form reader agent skill | 📌 Reference |

## Active Development: `powerapps-mirror/apps/ioi-platform/`

This is the main Power Apps code-first app for the Domino → M365 migration.

**Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Radix UI + React Query + Jotai
**SDK**: `@microsoft/power-apps` v1.1.3
**Config**: `power.config.json` (environmentId, appId, connectionReferences)

**Key Stats**:
- 28 JSON form schemas (one per Domino form)
- 80+ generated models, services, and hooks
- 40+ page routes (department hub + IT forms + approvals)
- 70+ reusable UI components

### Quick Start

```bash
cd powerapps-mirror/apps/ioi-platform
npm install
npm run dev
```

### Build & Deploy

```bash
npm run build
# Then deploy via Power Platform CLI
```

## Source Bundles: `powerapps-bundles-inbox/`

These text files contain the original Power Apps builder export content, organized by type:

- `02-config-and-data-model-part-001.txt` — App config + data model
- `03-generated-hooks.txt` — Auto-generated React hooks
- `04-generated-models.txt` — TypeScript model definitions
- `05-generated-services.txt` — Service layer code
- `06-generated-validators.txt` — Validation logic
- `07-components-part-*.txt` — Component source code
- `08-pages-part-*.txt` — Page/screen source code
- `09-lib-services-store-types-*.txt` — Library, services, state, types
- `10-docs-scripts-plans-*.txt` — Documentation, scripts, plans

> **Note**: If the `powerapps-mirror` scraping is incomplete, rebuild from these bundles.

## Related Documentation
- `docs/migration-documentation.md` — Project overview
- `docs/implementation-plan.md` — Implementation progress
- `docs/documentation-governance.md` — Documentation governance rules
- `design/m365-design/powerapps-design.md` — Power Apps architecture design
- `design/m365-design/sharepoint-list-design.md` — SharePoint list design
