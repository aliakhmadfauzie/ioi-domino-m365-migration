# FIX-025 ITSC Child Data Read Alignment Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-025 |
| Fix ID | FIX-025 |
| Department | IT |
| Form | ITSC |
| Priority | P0 |
| Type | App Read Logic Issue |
| Scope | Read ITSC ExtAssets child data from list and detail views |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | None violated - this is a Fix task, not a Build |
| DependsOn | None |
| Higher-priority tasks | Earlier selectable IT P0 re-audits through `TASK-RE-AUDIT-012` are complete; SAPAMR remains fixed pending manual provisioning |
| CIR blocking rule | Not applicable - IT form, not HR |

## Finding

ITSC submit creates a `MainDB_IT` parent record and a linked `MainDB_IT_Ext_Assets` child record with `parentFormCode: 'ITSC'`. The list and detail routes only read `MainDB_IT` remarks, so structured checklist fields written to ExtAssets were not guaranteed to be visible after submission.

## Work Performed

**Files modified:**

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itsc/index.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itsc/[id].tsx`

Changes:

1. Added `useMainDBITExtAssetsList` reads for `parentFormCode eq 'ITSC'`.
2. Joined ExtAssets rows to parent `MainDB_IT` rows by parent lookup ID with title fallback.
3. Updated ITSC list search and row summary to include child fields such as server name, reviewer, CPU, memory, and remarks.
4. Updated ITSC detail page to query the linked ExtAssets row by `parentRecord/ID`.
5. Overlaid detail display data with ExtAssets fields first, then parent remarks fallback.
6. Restored missing detail-route imports while touching the detail page.

## Evidence

| File | Purpose |
|---|---|
| `src/pages/it/forms/itsc/new.tsx` | Submit path creates parent `MainDB_IT` and child `MainDB_IT_Ext_Assets` records |
| `src/pages/it/forms/itsc/index.tsx` | List now reads and joins ITSC ExtAssets child records |
| `src/pages/it/forms/itsc/[id].tsx` | Detail now reads the linked ExtAssets child record and displays child values |
| `src/generated/hooks/use-main-dbitext-assets.ts` | Provides `useMainDBITExtAssetsList` for SharePoint-backed child reads |
| `src/generated/models/main-dbit-ext-assets-model.ts` | Confirms typed ITSC child fields exist in ExtAssets |
| `npx tsc --noEmit` | TypeScript compilation passed |

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.

## Result

**Fixed Pending Re-Audit** - ITSC list and detail now read structured ExtAssets child data created by the submit path.

## Re-Audit Scope

1. Verify ITSC list reads ExtAssets records filtered by `parentFormCode eq 'ITSC'`.
2. Verify list rows join child data to parent rows by parent ID/title.
3. Verify ITSC detail reads child data by `parentRecord/ID`.
4. Verify detail display prefers ExtAssets child values and falls back to parent remarks.
5. Verify TypeScript compilation.
