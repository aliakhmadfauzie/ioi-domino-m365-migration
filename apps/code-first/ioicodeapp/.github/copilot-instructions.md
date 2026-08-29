# IOI Platform — Agent Instructions

## Screen & Page Implementation

When implementing any new screen, page, or form for the IOI Platform:

### 1. ALWAYS Read the Page Requirements Guide

Open and follow **`docs/page-requirements-guide.md`** before writing any code. This document contains:

- **Section 1** — Database / SharePoint list naming conventions (prefix pattern, system field SKIP rules)
- **Section 2** — New form screen template (imports, 2-step create, EmployeePicker, draft/submit pattern)
- **Section 3** — Detail/approval screen template (asRead cast, timeline dots, sidebar actions, 3-state handling)
- **Section 4** — List/database view template (useMainDBHRByFormType, status tabs, search)
- **Section 5** — Component reference (all reusable components with import paths)
- **Section 6** — Submission/approval page requirements (my-submissions, approvals)
- **Section 7** — Color theme (badge colors, timeline dots, action button styles per status)

### 2. CRITICAL Rules (Do Not Violate)

| Rule | Description |
|------|-------------|
| **No plain Input for people** | Always use `EmployeePicker` from `@/components/employee-picker` for person/name fields |
| **Skip system fields** | Do NOT create `SubmittedBy`, `SubmittedDate`, `Editor1` columns — use SharePoint `Created By`, `Created` instead |
| **Two-step create** | Create parent `MainDB_HR` record first, then extension record with `ParentRecord` link |
| **PascalCase fields** | Use `asRead()` cast: `const record: MainDB_HRRead = raw ? asRead(raw) : undefined` |
| **Three states** | Every detail page MUST handle loading, error, and empty/missing states |
| **Color theme** | Use `bg-{color}-100 text-{color}-800 border-none` for badges, NOT variant-based styles |
| **Title convention** | Format: `{FORMCODE}-{YYYYMMDD-HHmmss}` |

### 3. Form Analysis Documents

Each form has an analysis document in `docs/form-analyses/` that maps Domino fields to SharePoint columns:

| Form | Analysis File | FormCode |
|------|--------------|----------|
| Cafeteria Inspection | `docs/form-analyses/CIR_form_analysis.md` | `CIR` |
| Contract Worker Requisition | `docs/form-analyses/CWR_form_analysis.md` | `CWR` |
| Backup Staff Database | `docs/form-analyses/BSD_form_analysis.md` | `BSD` |
| Rest Day & Additional Working Hours | `docs/form-analyses/AWHR_form_analysis.md` | `AWHR` |

### 4. System Field Normalization

See `docs/sharepoint-system-field-normalization.md` for the full mapping of which Domino fields map to SharePoint built-in fields.

### 5. PnP PowerShell Scripts

SharePoint list creation scripts live in `scripts/`:
- `Add-CIR-Cafeteria-Lists.ps1` — template for creating extension lists
- `Add-CWR-ContractWorker-Lists.ps1` — CWR extension list

### 6. Data Storage Rules (DEC-2026-007) — CRITICAL

All form fields MUST be stored as discrete SharePoint list columns (model columns). DO NOT use `remarks` JSON for storing form data.

| Rule | Description |
|------|-------------|
| **Model columns required** | Every form field MUST have its own column on the SharePoint list (`MainDB_IT`, `MainDB_HR`, or extension list) |
| **No `remarks` JSON** | Do NOT store form field values as JSON inside the `remarks` text field. The `remarks` field is for free-text notes only. |
| **`submitTransform`** | Use the `submitTransform` function in `it-forms-config.ts` to map form field IDs to SharePoint model column names at submission time |
| **Detail pages** | Detail pages MUST read from model columns (`record.fieldName`) — not from `JSON.parse(record.remarks)` |
| **Extension lists** | Only use extension lists for truly repeated sub-forms (multi-row signatures, line items). Do not use them as a substitute for model columns on the main list. |
| **Refactoring** | Existing forms using `remarks` JSON (SAPCR, EAF, ITSSR, etc.) must be refactored to proper model columns. See `docs/decision-log.md` §DEC-2026-007. |

Always create a new script when adding a new form's SharePoint lists.

### 6. Route Registration

After creating screens, register in `src/routes/hr-routes.tsx`:
```typescript
const XxxListPage = lazy(() => import('@/pages/hr/xxx/index'));
const XxxNewPage = lazy(() => import('@/pages/hr/xxx/new'));
const XxxDetailPage = lazy(() => import('@/pages/hr/xxx/detail'));

// Inside HR route group:
<Route path="xxx" element={<XxxListPage />} />
<Route path="xxx/new" element={<XxxNewPage />} />
<Route path="xxx/detail/:id" element={<XxxDetailPage />} />
```

### 7. Data Source Registration

After creating SharePoint lists, register in the code app:
```bash
npx power-apps add-data-source -a shared_sharepointonline -c <connection-id> --dataset "<site-url>" -t "<list-guid>" --non-interactive
```

---

### 8. Power Fx / TypeScript Formula Review Rules

When reviewing data access and workflow logic in any file, check each operation against these rules.

#### Operations to Review

| Operation | What to Check |
|-----------|---------------|
| **Generated service calls** (`mainDBITService.create()`, `.update()`, `.getById()`) | Correct list GUID, correct column internal names, correct field types |
| **SharePoint patch/create** (`sharepointService.patchItem`, `createItem`) | Column names match actual SharePoint internal names, not display names |
| **Read hooks** (`useMainDBITBySite().getById(id)`, `useMainDBITExtAccessList()`) | OData filter correct, parent-child relation correct, delegation-safe |
| **Status transitions** (`setCurrentStatus`, `handleApprove`, `handleReject`) | Status values match `docs/04_WORKFLOW_APPROVAL_RULES.md` classification |
| **Role checks** (`if (role === 'hod')`, `if (role === 'admin')`) | Role values match SharePoint User_Roles_IT / ConfigGlobalUserRoleAssignments |
| **Choice field mapping** (`choiceValue()`, `reverseChoiceValue()`) | Key-to-label mapping matches SharePoint choice column values |
| **Person/Employee fields** (`EmployeePicker`, email lookups) | Uses `EmployeePicker`, not plain `<Input>` — stores email, not name |
| **Date/time fields** | Uses DateTime format, not string — matches SharePoint DateTime column type |
| **Boolean fields** (`bool()`, `IsLocked`) | Uses `bool()` cast for SharePoint Yes/No columns |
| **Error handling** | try/catch around all data operations, user-friendly error notification |
| **Mock data** | No `SAMPLE_DATA` or mock arrays remaining in production code paths |
| **Hardcoded values** | No hardcoded list GUIDs, site URLs, or column names — use config/service layer |

#### Critical Anti-Patterns to Catch

| Anti-Pattern | Why It's Wrong | Fix |
|--------------|----------------|-----|
| Reading wrong extension list fields (e.g., EAFDetails reads NIR fields) | Displays wrong data | Use form-specific extension service (`mainDBITExtAccessService` for EAF, `mainDBITExtSupportService` for ITSSR) |
| JSON-in-remarks pattern for structured data | Fragile, no type safety, breaks schema | Move structured fields to proper extension list columns |
| `as any` casts bypassing TypeScript types | Silences type errors, masks mismatches | Use proper `asRead()`/`asWrite()` typed casts |
| Dual-case file imports (PascalCase + kebab-case) | Causes duplicate modules in bundle | Import only from kebab-case canonical files |
| Direct `fetch()` or REST calls instead of generated services | Bypasses auth, normalization, error handling | Use generated services from `src/generated/services/` |
| FormCode/hardcoded status strings in multiple places | Inconsistent when changed | Use constants from form config or status-utils |

#### Documentation Rule

For every important formula or data operation, document:

| File | Function/Property | Purpose | Data Source | Risk | Issue | Recommended Fix | Test Step |
|------|------------------|---------|-------------|------|-------|-----------------|-----------|
