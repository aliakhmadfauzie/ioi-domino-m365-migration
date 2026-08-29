# Power Apps Design

> **Generated**: 2026-05-31 — Major revision to reflect actual code-first architecture
> **App Type**: Power Apps new code app (code-first) — React + TypeScript + Vite
> **Framework**: shadcn/ui + Radix UI + Tailwind CSS v4 + React Query + Jotai
> **SDK**: `@microsoft/power-apps` v1.1.3
> **Connectors**: SharePoint, Microsoft 365 Users, Office 365 Outlook
> **App Location**: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/`
> **Decision**: DEC-2026-002 (code-first over canvas), DEC-2026-003 (single app over multi-app)

---

## Architecture Overview

### Actual App Stack
```
┌─────────────────────────────────────────────────────────┐
│                 Power Apps Code-First App                │
│         (React 19 + TypeScript + Vite + shadcn/ui)       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  src/pages/        ← 40+ route pages                     │
│  src/components/   ← 70+ reusable components (Radix UI)  │
│  src/form-schemas/ ← 28 JSON form schemas                │
│  src/services/     ← 10+ service modules                 │
│  src/generated/    ← 80+ models + hooks + validators     │
│  src/contexts/     ← Approval + workflow contexts         │
│  src/hooks/        ← Custom React hooks                  │
│  src/store/        ← Jotai state atoms                   │
│  src/types/        ← TypeScript types                    │
│  src/features/     ← Feature modules                     │
│  src/lib/          ← Utility libraries                   │
│  src/config/       ← Runtime config                      │
│  src/data/         ← Static/mock data                    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  power.config.json  ← Power Platform deployment config   │
│  package.json       ← Dependencies (20+ packages)        │
│  vite.config.ts     ← Vite bundler config                │
│  tsconfig.json      ← TypeScript strict mode             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
User (Browser)
    │
    ▼
React App (Vite dev server @ localhost:5173)
    │
    ├── Mock Service (dev) ───→ In-memory data
    │
    └── SharePoint Service (prod) ───→ MainDB_IT / MainDB_IT_Ext_* / Config_*
                                          │
                                          ▼
                                    Power Automate Flows
                                          │
                                          ▼
                                    Approvals + Email
```

### Environment Architecture
| Environment | Host | Data Source | Status |
|-------------|------|-------------|--------|
| Development (local) | `localhost:5173` (Vite) | Mock service | ✅ Ready |
| Development (Power Platform) | Power Apps hosted | SharePoint (dev) | ⬜ Pending deployment |
| UAT | Power Apps hosted | SharePoint (uat) | ⬜ Pending |
| Production | Power Apps hosted | SharePoint (prod) | ⬜ Pending |

---

## Page Structure (Actual)

### Entry Points & Layout
| Route | Page | Purpose | Status |
|-------|------|---------|--------|
| `/` | `department-hub.tsx` | Department selection hub with cards | ✅ Built |
| `/_layout.tsx` | App layout | Sidebar + header + content area | ✅ Built |

### Department Pages (23 Routes)
| Route | Department | Status |
|-------|-----------|--------|
| `/adm` | Admin | ✅ Built |
| `/ei` | E&I | ✅ Built |
| `/engineering` | Engineering | ✅ Built |
| `/finance` | Finance | ✅ Built |
| `/hr` | Human Resources | ✅ Built |
| `/it` | IT — main migration focus | ✅ Built |
| `/log` | Logistics | ✅ Built |
| `/maintenance` | Maintenance | ✅ Built |
| `/mpsprn` | MPS/PRN | ✅ Built |
| `/mtr` | MTR | ✅ Built |
| `/ops` | Operations | ✅ Built |
| `/pbi` | PBI | ✅ Built |
| `/procurement` | Procurement | ✅ Built |
| `/production` | Production | ✅ Built |
| `/qa` | QA | ✅ Built |
| `/qc` | QC | ✅ Built |
| `/rnd` | R&D | ✅ Built |
| `/sales` | Sales | ✅ Built |
| `/security` | Security | ✅ Built |
| `/she` | SHE | ✅ Built |
| `/str` | Store | ✅ Built |
| `/training` | Training | ✅ Built |
| `/warehouse` | Warehouse | ✅ Built |

### IT Forms Pages
| Route | Form | Module | Status |
|-------|------|--------|--------|
| `/it/forms/eaf/` | EAF (VPN/Citrix) — list + create + detail | M1 | ✅ Built |
| `/it/forms/nir/` | NIR (Notes ID Request) | M1 | ✅ Built |
| `/it/forms/rs/` | RS (Reset Password) | M1 | ✅ Built |
| `/it/forms/sfar/` | SFAR (Share Folder Access) | M1 | ✅ Built |
| `/it/forms/ur/` | UR (User Access) | M1 | ✅ Built |
| `/it/forms/itssr/` | ITSSR (Support Request) | M2 | ✅ Built |
| `/it/forms/prf/` | PRF (Program Request) | M2 | ✅ Built |
| `/it/forms/hi/` | HI (Hardware Inventory) | M3 | ✅ Built |
| `/it/forms/sapamr/` | SAPAMR (Auth Matrix) | M4 | ✅ Built |
| `/it/forms/sapca/` | SAPCA (Config Access) | M4 | ✅ Built |
| `/it/forms/sapcr/` | SAPCR (Change Request) | M4 | ✅ Built |
| `/it/forms/sapsof2/` | SAPSOF2 (Sign Off) | M4 | ✅ Built |
| `/it/forms/saptr/` | SAPTR (Transport Request) | M4 | ✅ Built |
| `/it/forms/ioip/` | IOIP (Policy) | M5 | ✅ Built |
| `/it/forms/iti/` | ITI (IT Info) | M5 | ✅ Built |
| `/it/forms/itp/` | ITP (Procedures) | M5 | ✅ Built |
| `/it/forms/itsc/` | ITSC (Server Checklist) | M3 | ✅ Built |
| `/it/forms/sapdrp/` | SAPDRP (Disaster Recovery) | M6 | ✅ Built |

### Cross-Cutting Pages
| Route | Page | Purpose | Status |
|-------|------|---------|--------|
| `/my-submissions` | My Submissions | User's own requests | ✅ Built |
| `/approvals` | Approval Screen | Pending approvals dashboard | ✅ Built |
| `/batch-approvals` | Batch Approvals | Multi-item approval | ✅ Built |
| `/submissions` | Submissions | All submissions view | ✅ Built |
| `/submission-detail/:id` | Submission Detail | Single record detail | ✅ Built |
| `/dashboard` | Dashboard | KPIs and stats | ✅ Built |
| `/manager-dashboard` | Manager Dashboard | Dept head view | ✅ Built |
| `/settings` | Settings | User preferences | ✅ Built |
| `/help` | Help | User guide | ✅ Built |
| `/reports` | Reports | Reporting views | ✅ Built |
| `/employee-directory` | Employee Directory | M365 Users lookup | ✅ Built |
| `/field-worker` | Field Worker | Mobile-friendly view | ✅ Built |
| `/quick-form` | Quick Form | Rapid submission | ✅ Built |
| `/quick-submit` | Quick Submit | Fast ticket creation | ✅ Built |
| `/bug-admin` | Bug Admin | Bug tracker admin | ✅ Built |
| `/governance` | Governance | Compliance views | ✅ Built |
| `/not-found` | 404 | Error page | ✅ Built |

---

## Component Architecture (Actual)

### 70+ Reusable Components
| Category | Components | Notes |
|----------|-----------|-------|
| **Dynamic Form** | `dynamic-form/` — schema-driven form renderer | Renders from JSON form schemas |
| **Approval Workflow** | `approval-workflow/` — stage-gated approval UI | Multi-stage approval components |
| **UI Primitives** | `ui/` — 25+ Radix UI primitives (dialog, select, tabs, etc.) | shadcn/ui style |
| **Forms** | `forms/` — per-form components | EAF, ITSSR, HI, etc. |
| **HR** | `hr/` — HR-specific components | Future use |
| **IT** | `it/` — IT-specific components | Current focus |
| **Shared** | `shared/` — cross-cutting components | Reusable across departments |
| **Workflow** | `workflow/` — workflow orchestration | Stage management |
| **Layout** | `layout/`, `sidebar.tsx`, etc. | App chrome |
| **System** | `system/` — admin components | For IT admin use |

### Key Components
| Component | Location | Purpose |
|-----------|----------|---------|
| Dynamic Form Renderer | `src/components/dynamic-form/` | Reads JSON schema → renders form fields |
| Multi-Step Form | `src/components/multi-step-form.tsx` | Wizard-style form navigation |
| Employee Picker | `src/components/employee-picker.tsx` | Microsoft 365 Users lookup |
| User Picker | `src/components/user-picker.tsx` | SharePoint Person picker |
| Delegation Dialog | `src/components/delegation-dialog.tsx` | Approver delegation |
| Escalation Monitor | `src/components/escalation-monitor.tsx` | SLA breach tracking |
| Notifications Panel | `src/components/notifications-panel.tsx` | In-app notifications |
| Global Search | `src/components/global-search.tsx` | Cross-record search |
| Role Switcher | `src/components/role-switcher.tsx` | Role-based view toggle |

---

## Form Schemas (28 JSON Files)

| File | Form | Fields | Module |
|------|------|--------|--------|
| `VPNACCESS.json` | EAF (VPN/Citrix) | 21+ | M1 |
| `NOTESID.json` | NIR (Notes ID) | 27 | M1 |
| `PWDRESET.json` | RS (Reset Password) | 21 | M1 |
| `SFAR.json` | SFAR (Share Folder) | 26 | M1 |
| `USERID.json` | UR (User Access) | — | M1 |
| `ITSSR.json` | ITSSR (Support) | 23 | M2 |
| `PRF.json` | PRF (Program Request) | 23 | M2 |
| `ITEVT.json` | IAL (Activity Log) | 16 | M2 |
| `ITDR2.json` | ITDR2 | — | M2 |
| `HWINV_PRAI.json` | HI (Hardware Inventory) | 58 | M3 |
| `ITSC.json` | ITSC (Server Checklist) | 27 | M3 |
| `SVRREBOOT.json` | Server Reboot | — | M3 |
| `SVRREC.json` | Server Recovery | — | M3 |
| `SAPAMR.json` | SAPAMR (Auth Matrix) | 26 | M4 |
| `SAPCA.json` | SAPCA (Config Access) | 16 | M4 |
| `SAPCR.json` | SAPCR (Change Request) | 54 | M4 |
| `SAPTR.json` | SAPTR (Transport Request) | 34 | M4 |
| `SAPSLCF.json` | SAPSLCF (Storage Location) | 11 | M4 |
| `SAPDRP.json` | SAPDRP (Disaster Recovery) | 5 | M4 |
| `INTUATSOF.json` | SAPSOF (Sign Off) | 385+ | M4 |
| `SILOUATSOF.json` | SAPSOF2 (Sign Off v2) | — | M4 |
| `IOIPOL.json` | IOIPOL (Policy) | 10 | M5 |
| `ITINFO.json` | ITI (IT Info) | 3 | M5 |
| `ISGDOC.json` | ITP (Procedures) | 10 | M5 |
| `TRNMAN.json` | Training Manual | — | M5 |
| `ITDAILYRPT.json` | IT Daily Report | — | M5 |
| `DCALOG.json` | DCA Log | — | M5 |
| `registry.ts` | Schema registry | — | — |

---

## Services Architecture (Actual)

| Service | Location | Purpose | Status |
|---------|----------|---------|--------|
| SharePoint Submission Service | `src/services/sharepoint-submission-service.ts` | CRUD for MainDB_IT + extensions | ✅ Built (mock) |
| Office 365 Users Service | `src/services/office365-users-service.ts` | User profile, manager lookup | ✅ Built |
| Outlook Email Service | `src/services/outlook-email-service.ts` | Email notifications | ✅ Built |
| Workflow Orchestration | `src/services/workflow-orchestration-service.ts` | State machine management | ✅ Built |
| Workflow Audit Service | `src/services/workflow-audit-service.ts` | Audit trail logging | ✅ Built |
| Escalation Engine | `src/services/escalation-engine.ts` | SLA monitoring | ✅ Built |
| Notification Service | `src/services/notification-service.ts` | Cross-channel notifications | ✅ Built |
| Admin SharePoint Service | `src/services/admin-sharepoint-service.ts` | Admin operations | ✅ Built |
| HR Submission Service | `src/services/hr-submission-service.ts` | HR form submissions | ✅ Built |
| MainDB HR Service | `src/services/main-dbhr-service.ts` | HR main list operations | ✅ Built |

---

## EAF (VPN/Citrix) — Screen Mapping to Code

| Domino UI Element | Code Implementation | File |
|---|---|---|
| User field | EmployeePicker or UserPicker component | `src/components/employee-picker.tsx` |
| Justification | Textarea with validation | Form schema → DynamicForm renderer |
| System/Type | Select/Dropdown from Radix UI | Form schema choices |
| RequestedBy | Auto-filled from Microsoft 365 Users | Service call |
| Send for Approval button | Submit button → SharePointSubmissionService | Form action handler |
| Approve/Reject (HOD) | Approval buttons on approval screen | `src/pages/approvals.tsx` |
| Comments dialog | Dialog from Radix UI | `src/components/delegation-dialog.tsx` |
| Status display | Badge component with conditional styling | Workflow stage indicator |
| Document link | Hyperlink to SharePoint item | SharePoint service response |

---

## Source Code Verification

### How to Verify App Structure
```bash
# Navigate to app
cd apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Key Files for Developers
| File | Purpose |
|------|---------|
| `power.config.json` | Power Platform deployment config (environmentId, appId, connections) |
| `src/App.tsx` | Root component with routing |
| `src/main.tsx` | App entry point |
| `src/config/` | Runtime configuration |
| `src/services/sharepoint-submission-service.ts` | SharePoint connector service (currently mock) |
| `src/form-schemas/registry.ts` | Schema registry mapping form codes to schema files |
| `src/generated/` | Auto-generated models, hooks, services |
| `vite.config.ts` | Vite bundler configuration |

---

## Known Gaps

| Gap | Impact | Resolution |
|-----|--------|------------|
| SharePoint submission service uses mock data | No real SharePoint write-back | Replace with real connector after SharePoint lists are finalized |
| `powerapps-mirror` was browser-scraped — some files may be incomplete | Risk of missing or corrupted code | Cross-reference with `powerapps-bundles-inbox/` text bundles |
| App not yet deployed to Power Platform | Cannot test Power Platform-specific features | Deploy via `pac` CLI after SharePoint lists are ready |
| No authentication/authorization implemented | App currently runs in dev mode without auth | Will use Power Platform auth when deployed |
