# App Repo Categorization Review

> **Generated**: 2026-08-29
> **Scope**: IOI Domino → M365 migration monorepo
> **Goal**: Group the repo by **app category** so each application artifact has a clear, self-contained home.

---

## 1. What "app category" means here

This is a **monorepo** that contains **multiple distinct application artifacts** (not one app). Each artifact is a different "app category":

| # | App Category | Build Type | Where it lives (after reorg) |
|---|--------------|-----------|----------------------|
| A | **Code-First Power Apps App** (`ioi-platform`) | React 19 + TS + Vite + shadcn/ui | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/` |
| B | **Canvas Power Apps App** (`ioi-platform-shell`) | Power Apps Canvas (.pa.yaml) | `apps/canvas/ioi-platform-shell/` + design at `apps/canvas/design/` |
| C | **M365 Target Design** | Design docs (Power Apps / Power Automate / SharePoint) | `design/m365-design/`, `design/sharepoint-lists/`, `design/mapping/` |
| D | **Migration Analysis & Source Evidence** | Analysis reports, source of truth | `analysis/`, `analysis/source_analysis/`, `analysis/source/`, `analysis/design-requirement/` |
| E | **Audit & Governance** | Audit register, findings, fix backlog | `audit/` |
| F | **Automation & CI-CD** | Pipelines, scripts, automation orchestration | `automation/` (incl. `automation/scripts/`), `azure-pipelines.yml` |
| G | **Project Documentation** | Plans, logs, knowledge base | `docs/` |
| H | **Worktree/Scratch branches** | Git worktrees | `agents-generate-run-commands/`, `agents-workflow-quick-ref-md-run-1st-prompt-433f10e5/` |

---

## 2. Current repository inventory (as observed)

### 2.1 Worktree root (`ioi_Docs.worktrees/`)
```
ioi_Docs.worktrees/
├── ioi-domino-m365-migration/            # MAIN branch (doc) — most complete
├── agents-generate-run-commands/         # worktree — duplicates of the same layout
└── agents-workflow-quick-ref-md-run-1st-prompt-433f10e5/  # worktree — duplicates
```

### 2.2 Main worktree (`ioi-domino-m365-migration/`)
```
ioi-domino-m365-migration/
├── AGENTS.md                 # Agent discovery
├── MainPlan.md               # Canvas rebuild design report
├── Mastersharepoint design.md
├── power.config.json         # Power Platform env / app config
├── azure-pipelines.yml       # CI-CD
├── audit_pur_sharepoint.py
├── temp-empdir.ps1
├── desktop.ini
├── .github/  .gitignore  .vscode/
├── analysis/                # Domino analysis findings (Source of Truth)
├── audit/                   # Audit register + findings
├── automation/              # Migration pipeline controller / task queue
├── apps/canvas/design/      # Canvas app design docs (00-12 numbered stages)
├── config/                  # sharepoint-lists column configs
├── analysis/design-requirement/      # design.md, sharepoint-migration.md
├── docs/                    # Migration documentation (Source of Truth)
├── apps/canvas/ioi-platform-shell/      # Canvas app .pa.yaml source
├── apps/code-first/ioicodeapp/              # Code-first Power Apps app repo
├── design/m365-design/             # Power Apps / Power Automate / SharePoint design
├── mapping/                 # field-mapping.csv/.md, data-migration-rules.csv
├── memories/                # project memory files
├── outputs/                 # build outputs
├── PUR/                     # procurement provisioning artifacts
├── scripts/                 # utility scripts
├── source/                  # original Domino evidence (reference only)
└── analysis/source_analysis/         # structured analysis registers (00-11)
```

### 2.3 Code-first app (`apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/`)
```
apps/ioi-platform/
├── src/
│   ├── App.tsx, main.tsx
│   ├── components/  config/  contexts/  data/  debug/  departments/
│   ├── features/  form-schemas/  forms/  generated/  hooks/  lib/  modules/
│   ├── pages/  routes/  services/  store/  types/
├── flows/                  # Power Automate flow definitions (JSON)
├── docs/  data-model/  plugins/  scripts/  app-gen-sdk/  .power/
├── package.json  power.config.json  vite.config.ts  ...
```

---

## 3. Problems found in the current structure

1. **No top-level "apps/" umbrella** — app artifacts (code-first, canvas, flows) are scattered under `apps/code-first/ioicodeapp/`, `apps/canvas/ioi-platform-shell/`, and `apps/canvas/design/` instead of being grouped as peer apps.
2. **Canvas app design is split** between `apps/canvas/ioi-platform-shell/` (source) and `apps/canvas/design/` (design docs) — two places for one app.
3. **App-specific docs vs. project docs mixed** — `docs/` holds both migration docs (project-level) and references that arguably belong with the app.
4. **Duplicate worktrees** at the root (`agents-generate-run-commands/`, `agents-workflow-quick-ref-md-run-1st-prompt-433f10e5/`) clutter the workspace — they are git worktrees of the same repo and only the main branch should be treated as canonical.
5. **Root-level loose files** (`MainPlan.md`, `Mastersharepoint design.md`, `power.config.json`, `azure-pipelines.yml`, `audit_pur_sharepoint.py`, `temp-empdir.ps1`) have no obvious home.
6. **Naming inconsistency**: `apps/code-first/ioicodeapp/`, `apps/canvas/ioi-platform-shell/`, `apps/canvas/design/` all refer to overlapping apps.

---

## 4. Proposed categorization (target structure)

Group by **app category** under a top-level `apps/` and keep shared concerns (docs, analysis, audit, automation) at the root. This gives each app a self-contained home and makes the whole thing read like a proper app monorepo.

```
ioi-domino-m365-migration/                  # canonical branch only
├── apps/
│   ├── code-first/                         # CATEGORY A — Power Apps code-first app
│   │   └── ioi-platform/                   #   (existing apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform)
│   ├── canvas/                             # CATEGORY B — Canvas app (source + design together)
│   │   ├── apps/canvas/ioi-platform-shell/             #   .pa.yaml source
│   │   └── design/                         #   design docs from canvas-app-rebuild
│   └── flows/                              # Power Automate flow definitions
│       └── ...                             #   (from apps/ioi-platform/flows)
│
├── design/                                 # CATEGORY C — M365 target design
│   ├── design/m365-design/                        #   Power Apps / Power Automate / SharePoint
│   ├── sharepoint-lists/                   #   from config/sharepoint-lists
│   └── mapping/                            #   field-mapping, data-migration-rules
│
├── analysis/                               # CATEGORY D — migration analysis & evidence
│   ├── source/                             #   original Domino evidence (reference only)
│   ├── analysis/source_analysis/                    #   structured registers
│   ├── analysis/design-requirement/                 #   design.md, sharepoint-migration.md
│   └── analysis/                           #   findings (existing)
│
├── audit/                                  # CATEGORY E — audit & governance
├── automation/                             # CATEGORY F — CI-CD + orchestration
│   ├── azure-pipelines.yml
│   └── scripts/
│
├── docs/                                   # CATEGORY G — project documentation
├── memories/                               # project memory
├── outputs/                                # build outputs
└── AGENTS.md
```

### 4.1 App-category mapping table (current → target)

| Current path | Category | Target path |
|--------------|----------|-------------|
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/` | A — Code-first | `apps/code-first/ioi-platform/` |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/flows/` | A/B flows | `apps/flows/` |
| `apps/canvas/ioi-platform-shell/` | B — Canvas | `apps/canvas/ioi-platform-shell/` |
| `apps/canvas/design/` | B — Canvas design | `apps/canvas/design/` |
| `design/m365-design/` | C — Design | `design/m365-design/` |
| `design/sharepoint-lists/` | C — Design | `design/sharepoint-lists/` |
| `mapping/` | C — Design | `design/mapping/` |
| `source/` | D — Evidence | `analysis/source/` |
| `analysis/source_analysis/` | D — Analysis | `analysis/source_analysis/` |
| `analysis/design-requirement/` | D — Analysis | `analysis/design-requirement/` |
| `analysis/` | D — Analysis | `analysis/findings/` (kept as `analysis/`) |
| `docs/` | G — Docs | `docs/` (unchanged) |
| `audit/` | E — Audit | `audit/` (unchanged) |
| `automation/`, `azure-pipelines.yml` | F — Automation | `automation/` |
| `scripts/` | F — Automation | `automation/scripts/` |
| `memories/` | G — Docs | `memories/` (unchanged) |
| `outputs/` | — | `outputs/` (unchanged) |
| `PUR/` | D — Data | keep or move under `analysis/` (decision) |
| `main` worktree files (`MainPlan.md`, `Mastersharepoint design.md`, `power.config.json`, `audit_pur_sharepoint.py`, `temp-empdir.ps1`) | — | move to relevant `docs`/`automation`/`scripts` |

---

## 5. Recommended next steps

1. **Decide the canonical branch** — treat `ioi-domino-m365-migration/` (branch `doc`) as the single source of truth; defer restructure on the two scratch worktrees.
2. **Create an `apps/` umbrella** and move the three app artifacts (`code-first`, `canvas`, `flows`) under it.
3. **Co-locate each canvas app's source + design** so one category has one home.
4. **Consolidate design config** (`m365-design`, `config/sharepoint-lists`, `mapping`) under a `design/` category.
5. **Move loose root files** to their owning categories.
6. **Update `docs/repo-knowledge-base.md`** and `AGENTS.md` after moving, so the governance doc stays the single source of truth.
7. **Run the app build/typecheck** after moving to confirm nothing broke.

---

## 6. Notes / decisions needed

- The exact placement of `PUR/`, `outputs/`, and the loose root files is a judgment call — needs confirmation.
- Moving `ioi-platform` under an `apps/` umbrella changes the path referenced in `power.config.json`, `vite.config.ts`, and CI. These must be updated together.
- Because the repo is a monorepo with worktrees, renames should be done via `git mv` on the canonical branch and then merged/rebased into the other worktrees.
