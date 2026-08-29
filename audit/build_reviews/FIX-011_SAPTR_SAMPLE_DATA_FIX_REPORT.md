# FIX-011 SAPTR Sample Data Replacement Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-011 |
| Fix ID | FIX-011 |
| Department | IT |
| Form | SAPTR |
| Priority | P0 |
| Type | App Read Logic Issue |
| Scope | Replace SAPTR sample data reads with real SharePoint-backed records |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | None violated — this is a Fix task, not a Build |
| DependsOn | None — no dependencies |
| Higher-priority tasks | TASK-FIX-009 (SAPAMR) is blocked (human schema decision); TASK-FIX-005/RE-AUDIT-005 are Complete/Verified |
| CIR blocking rule | Not applicable — IT form, not HR |

## Finding

SAPTR index page (`src/pages/it/forms/saptr/index.tsx`) used `SAMPLE_DATA` (3 hardcoded records) instead of reading from SharePoint. This meant the list/detail view showed only sample data, not real submitted records.

## Work Performed

**File modified:** `src/pages/it/forms/saptr/index.tsx`

Changes:
1. **Removed** `SAMPLE_DATA` array (3 hardcoded mock records)
2. **Removed** `useNavigate` import (replaced with `<Link>` for back-navigation consistency)
3. **Added** imports: `Loader2`, `Empty/EmptyHeader/EmptyTitle/EmptyDescription`, `useMainDBITList`, `MainDBITCurrentstatusKeyToLabel`, `MainDBIT`, `parseRemarks`
4. **Added** `SAPTRRecord.mainRecord?: MainDBIT` for detail modal access
5. **Added** `mapStatusToLabel()` helper — maps `currentStatus` key to display label
6. **Added** `parseList()` helper — splits comma-separated values into arrays (for Modules, Phases)
7. **Replaced** component body:
   - `useMainDBITList({ filter: "formcode eq 'SAPTR'", orderBy: ['submitteddate desc'] })` — reads real SharePoint data
   - `saptrData` memo — maps `MainDBIT` records → `SAPTRRecord` shape using `parseRemarks()` to extract fields from the remarks JSON
   - Loading spinner (`Loader2`) while data loads
   - Empty state (`Empty` component) when no records exist
   - Dynamic count label showing total records

## Evidence

| File | Purpose |
|---|---|
| `src/pages/it/forms/saptr/index.tsx` | Rewritten to use `useMainDBITList` instead of `SAMPLE_DATA` |
| `src/generated/hooks/use-main-dbit.ts` | Provides `useMainDBITList` hook for SharePoint reads |
| `src/lib/parse-remarks.ts` | Parses remarks JSON into structured fields |
| `npx tsc --noEmit` | TypeScript compilation passed |

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.

## Result

**Fixed Pending Re-Audit** — SAPTR list/detail now reads from live SharePoint data instead of hardcoded sample data.

## Re-Audit Scope

1. Verify SAPTR list page loads from SharePoint (not SAMPLE_DATA) when browsing to `/it/forms/saptr`
2. Verify each row maps MainDB_IT fields correctly (title, submitteddate, requestoremail, remarks)
3. Verify detail modal displays parsed remarks fields for a selected record
4. Verify new SAPTR submissions appear in the list after submission
