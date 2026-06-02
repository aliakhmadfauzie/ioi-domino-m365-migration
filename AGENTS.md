# AGENTS.md — IOI Domino → M365 Migration Project

> Root agent discovery file. All AI agents and assistants must read this first.

## Active Agent Definitions

| Agent | Location | Purpose |
|-------|----------|---------|
| `domino-migration-agent` | `.github/agents/domino-migration-agent.agent.md` | Domino → M365 migration specialist. Analyze DXL/XML, design SharePoint lists, build Power Apps, create flows. |
| `code-app-architectV2` | `ioicodeapp/.github/agents/code-app-architectV2.agent.md` | Power Apps Code App Architect. React/Vite architecture, SharePoint integration, connector patterns. |

## Active Instruction Files

| File | Applies To | Content |
|------|-----------|---------|
| `.github/instructions/domino-migration.instructions.md` | All Domino migration tasks | 23-form inventory, hard rules, workflow specs, department lists |
| `ioicodeapp/.github/copilot-instructions.md` | IOI Platform code changes | Screen/page patterns, critical rules, system field normalization, form analysis |

## Active Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| `domino-migration` | `.github/skills/domino-migration/SKILL.md` | DXL parsing, SharePoint type mappings, @Function → Power Fx reference, flow templates |
| `domino-form-reader` | `ioicodeapp/.github/skills/domino-form-reader.md` | Domino form reading and analysis |
| `add-datasource` | `ioicodeapp/.github/skills/add-datasource/` | Add data sources to code-first app |
| `add-sharepoint` | `ioicodeapp/.github/skills/add-sharepoint/` | Add SharePoint list connections |
| `automate-sharepoint-pnp` | `ioicodeapp/.github/skills/automate-sharepoint-pnp/` | SharePoint PnP PowerShell automation |
| `create-code-app` | `ioicodeapp/.github/skills/create-code-app/` | Create new Power Apps code-first app |

## Required Reading (Before Any Change)

1. **`docs/repo-knowledge-base.md`** — Authoritative folder inventory, governance rules, placement rules
2. **`docs/central-form-reference.md`** — Single source of truth for all form definitions, sections, fields, workflows, data connections
3. **`docs/documentation-governance.md`** — Doc review status, source-of-truth rules, update rules
4. **`docs/change-log.md`** — Full change history — read before modifying anything

## Key Architecture Decisions

- **Single main list per site**: `MainDB_IT` with `FormCode` discriminator (DEC-2026-001)
- **Code-first app**: React 19 + TypeScript + Vite + shadcn/ui, not Canvas app (DEC-2026-002)
- **Single app**: All departments in one app, filtered by FormCode/department (DEC-2026-003)

## Power Apps Code-First App

- **Location**: `ioicodeapp/powerapps-mirror/apps/ioi-platform/`
- **Dev server**: `npm run dev` (localhost:5173)
- **Typecheck**: `npx tsc --noEmit`
- **Build**: `npm run build`
- **App ID**: `26fddd33-46a8-43ae-a1f2-e90fa3b003bf`
- **Connectors**: SharePoint, Microsoft 365 Users (standard only, no premium)

## Project Status

- 23 Domino forms analyzed (20 Penang IT + 3 Johor IT)
- 1,171 PDF UI exports available
- 29 JSON form schemas in source
- SharePoint lists: MainDB_IT + extension lists provisioned
- PAC CLI v2.7.4 authenticated
- TypeScript compiles clean (`tsc --noEmit` exits 0)
- Vite build succeeds
