# FIX-025 ITSC Child Data Read Alignment Re-Audit Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-025 |
| Fix ID | FIX-025 |
| Department | IT |
| Form | ITSC |
| Priority | P0 |
| Type | Re-Audit |
| Reason | Verify ITSC list/detail read the ExtAssets child data created during submit |

## Why Allowed

| Check | Result |
|---|---|
| `DependsOn` (`TASK-FIX-025`) | Complete - fix evidence recorded in `audit/build_reviews/FIX-025_ITSC_CHILD_DATA_FIX_REPORT.md` |
| Required source evidence files | Existing - ITSC list, detail, submit page, ExtAssets hook/model |
| Blocking rule violation | None - this is a re-audit of a P0 Fix task, not a new build |
| CIR blocking rule | Not applicable - ITSC is an IT form, not HR |

## Re-Audit Checks

### Check 1: ITSC list reads ExtAssets child data

**Source evidence:** `src/pages/it/forms/itsc/index.tsx`

The list now calls:

```typescript
const { data: extAssets = [], isLoading: extLoading } = useMainDBITExtAssetsList({
  filter: "parentFormCode eq 'ITSC'",
});
```

It builds `assetsByParentId` and `assetsByParentTitle` maps and attaches the matching child record to each `MainDB_IT` parent row.

**Verdict:** PASS - list view reads the extension list and joins child data.

### Check 2: ITSC list search and summary include child fields

**Source evidence:** `src/pages/it/forms/itsc/index.tsx`

Search now includes child fields including `iTSCServerName`, `iTSCReviewedBy`, `iTSCReviewedDate`, `iTSCCPUUsage`, `iTSCMemoryUsed`, and `iTSCRemarks`. The row summary prefers `asset?.iTSCServerName` and `asset?.iTSCReviewedBy`, with parent remarks fallback.

**Verdict:** PASS - child values are visible/searchable in the list path.

### Check 3: ITSC detail reads linked ExtAssets row

**Source evidence:** `src/pages/it/forms/itsc/[id].tsx`

The detail page now calls:

```typescript
const { data: extAssets = [], isLoading: extLoading } = useMainDBITExtAssetsList({
  filter: id ? `parentFormCode eq 'ITSC' and parentRecord/ID eq ${id}` : undefined,
});
```

It selects the child row by parent lookup ID with title fallback.

**Verdict:** PASS - detail view reads the specific child record.

### Check 4: Detail display prefers child fields and falls back to remarks

**Source evidence:** `src/pages/it/forms/itsc/[id].tsx`

The detail page overlays ExtAssets values onto the parsed remarks object for server name, virus definition date, CPU, memory, drive, disk cleanup, Windows update, tenant, volumes, backup times, physical storage, reviewer, and remarks.

**Verdict:** PASS - detail display uses child fields where present while preserving parent remarks fallback.

### Check 5: TypeScript compilation

**Evidence:** `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

**Verdict:** PASS

## Result

| Item | Status |
|---|---|
| ITSC list reads ExtAssets child rows | Pass |
| ITSC list joins child rows to parent records | Pass |
| ITSC search/summary includes child data | Pass |
| ITSC detail reads specific child row | Pass |
| ITSC detail prefers child fields with remarks fallback | Pass |
| TypeScript compilation | Pass |
| **Overall** | **RE-AUDIT PASSED** |

## Queue Updates

| Task ID | Previous Status | New Status |
|---|---|---|
| TASK-FIX-025 | Ready | Verified |
| TASK-RE-AUDIT-025 | New | Complete |
| TASK-NEXT-BUILD | Blocked | Still blocked - other P0 tasks remain ready/blocked |

## Residual Issue Outside This Fix Scope

`FIX-024` / `TASK-FIX-024` remains a separate P1 issue for ITSC non-approval status handling. This re-audit only covers P0 child-data read alignment.

## Evidence References

- `audit/build_reviews/FIX-025_ITSC_CHILD_DATA_FIX_REPORT.md`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itsc/index.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itsc/[id].tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/itsc/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/hooks/use-main-dbitext-assets.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-assets-model.ts`
- `npx tsc --noEmit`

## Next Recommended Task

`TASK-FIX-026` - SFAR access fields and approval action persistence alignment.
