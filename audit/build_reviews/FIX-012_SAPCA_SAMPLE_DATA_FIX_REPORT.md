# FIX-012 SAPCA Sample Data Replacement Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-012 |
| Fix ID | FIX-012 |
| Department | IT |
| Form | SAPCA |
| Priority | P0 |
| Type | App Read Logic Issue |
| Scope | Replace SAPCA sample data reads with real SharePoint-backed records |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | None violated - this is a Fix task, not a Build |
| DependsOn | None |
| Higher-priority tasks | `TASK-FIX-009` is fixed pending manual provisioning; `TASK-FIX-011` / `TASK-RE-AUDIT-011` are verified |
| CIR blocking rule | Not applicable - IT form, not HR |

## Finding

SAPCA index page (`src/pages/it/forms/sapca/index.tsx`) used `SAMPLE_DATA` hardcoded records instead of reading from SharePoint. This meant the database/list view could show stale demo rows rather than submitted SAPCA requests.

## Work Performed

**File modified:** `src/pages/it/forms/sapca/index.tsx`

Changes:

1. Removed the `SAMPLE_DATA` array.
2. Added `useMainDBITList` SharePoint-backed query with `filter: "formcode eq 'SAPCA'"` and `submitteddate desc` ordering.
3. Added `parseRemarks()` mapping for SAPCA remarks keys written by the submit page.
4. Added loading and empty states.
5. Added status mapping through `MainDBITCurrentstatusKeyToLabel`.
6. Updated table/detail data to use real `MainDBIT` records and parsed fields.

## Evidence

| File | Purpose |
|---|---|
| `src/pages/it/forms/sapca/index.tsx` | Rewritten to use `useMainDBITList` instead of `SAMPLE_DATA` |
| `src/pages/it/forms/sapca/new.tsx` | Submit path writes SAPCA records to `MainDB_IT` with formcode `SAPCA` and remarks fields consumed by the list view |
| `src/generated/hooks/use-main-dbit.ts` | Provides `useMainDBITList` hook for SharePoint reads |
| `src/lib/parse-remarks.ts` | Parses remarks into structured display fields |
| `npx tsc --noEmit` | TypeScript compilation passed |

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.

## Result

**Fixed Pending Re-Audit** - SAPCA list/detail now reads from SharePoint-backed MainDB_IT data instead of hardcoded sample data.

## Re-Audit Scope

1. Verify SAPCA list page loads from SharePoint, not `SAMPLE_DATA`.
2. Verify row mapping for title, submitted date, requestor, status, and remarks-derived SAPCA fields.
3. Verify detail modal displays parsed modules, client, issue reference, purpose, changes, and approval people.
4. Verify a new SAPCA submission appears in the SAPCA list after creation.
