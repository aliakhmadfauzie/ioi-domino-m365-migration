# FIX-012 SAPCA Sample Data Replacement Re-Audit Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-012 |
| Fix ID | FIX-012 |
| Department | IT |
| Form | SAPCA |
| Priority | P0 |
| Type | Re-Audit |
| Reason | Verify SAPCA list reads from SharePoint instead of `SAMPLE_DATA` and details display parsed remarks correctly |

## Why Allowed

| Check | Result |
|---|---|
| `DependsOn` (`TASK-FIX-012`) | Complete - `Fixed Pending Re-Audit` with evidence in `audit/build_reviews/FIX-012_SAPCA_SAMPLE_DATA_FIX_REPORT.md` |
| Required source evidence files | Existing - `src/pages/it/forms/sapca/index.tsx`, `src/pages/it/forms/sapca/new.tsx` |
| Blocking rule violation | None - this is a re-audit of a P0 Fix task, not a new build |
| CIR blocking rule | Not applicable - SAPCA is an IT form, not HR |

## Re-Audit Checks

### Check 1: SAPCA list page loads from SharePoint, not `SAMPLE_DATA`

**Source evidence:** `src/pages/it/forms/sapca/index.tsx`

- No `SAMPLE_DATA` reference remains in the file.
- The component uses `useMainDBITList` with:

```typescript
const { data: mainRecords = [], isLoading } = useMainDBITList({
  filter: "formcode eq 'SAPCA'",
  orderBy: ['submitteddate desc'],
});
```

- Loading state uses `Loader2`.
- Empty state uses `Empty` when no SAPCA records are returned.
- `DatabaseTable` receives `data={sapcaData}`, not static records.

**Verdict:** PASS - SharePoint-backed records replace hardcoded sample data.

### Check 2: Row mapping uses MainDB_IT fields and SAPCA remarks keys

**Source evidence:** `src/pages/it/forms/sapca/index.tsx`

| SAPCARecord field | Source |
|---|---|
| `id` | `main.id` |
| `formNo` | `main.title` or parsed `Request Number` fallback |
| `dateSubmitted` | `main.submitteddate` |
| `requestedBy` | parsed `Requestor`, fallback `main.requestorName` / `main.requestoremail` |
| `modules` | parsed `Modules` via comma-split helper |
| `client` | parsed `Client` |
| `clientNumber` | parsed `Client Number` |
| `issueReference` | parsed `Issue Log/SSR/PRF/SAP Notes Number` |
| `purpose` | parsed `Purpose` |
| `changesToBeDone` | parsed `Changes to be Done` |
| `status` | parsed `Status Label`, fallback generated current-status label |
| `ccFunctionalOwner` | parsed `CC Functional Owner` |
| `approver` | parsed `ITAPP`, fallback parsed `ITPIC` |

**Submit-key alignment:** `src/pages/it/forms/sapca/new.tsx` writes the same `formcode: 'SAPCA'` and all parsed remarks keys above during submit.

**Verdict:** PASS - Table rows are reconstructed from SharePoint parent records plus matching submitted remarks keys.

### Check 3: Detail modal displays parsed SAPCA fields

**Source evidence:** `src/pages/it/forms/sapca/index.tsx`

The detail modal now receives:

- Request Information: form number, submitted date, requestor, issue reference
- Configuration Details: modules, client, client number, purpose, changes to be done
- Approval: CC functional owner and approver

The displayed values come from `selectedRecord`, which is selected from `sapcaData`, which is mapped from `MainDB_IT` and parsed remarks.

**Verdict:** PASS - Detail modal displays the SharePoint-derived SAPCA fields required by the sample-data replacement scope.

### Check 4: New SAPCA submissions can appear in the list

**Source evidence:**

- `src/pages/it/forms/sapca/new.tsx` creates `MainDB_IT` records with `formcode: 'SAPCA'`.
- `src/pages/it/forms/sapca/index.tsx` filters records with `formcode eq 'SAPCA'`.
- The submit page writes `title`, `submitteddate`, requestor metadata, and remarks keys consumed by the list page.

**Verdict:** PASS - New SAPCA submissions match the list filter and data mapping.

### Check 5: TypeScript compilation

**Evidence:** `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

**Verdict:** PASS

## Residual Issue Outside This Fix Scope

`AUD-B001-SAPCA-002` / `FIX-013` remains blocked: SAPCA approval actions in the modal still log approve/reject comments instead of persisting workflow transitions. This re-audit only verifies `FIX-012`, the sample-data replacement P0 issue.

## Result

| Item | Status |
|---|---|
| SharePoint data source replaces `SAMPLE_DATA` | Pass |
| Row field mapping from MainDB_IT and parsed remarks | Pass |
| Detail modal display of parsed fields | Pass |
| New submissions appear via FormCode filter | Pass |
| TypeScript compilation | Pass |
| **Overall** | **RE-AUDIT PASSED** |

## Queue Updates

| Task ID | Previous Status | New Status |
|---|---|---|
| TASK-RE-AUDIT-012 | Ready | Complete |
| TASK-FIX-012 | Fixed Pending Re-Audit | Verified |
| TASK-NEXT-BUILD | Blocked | Still blocked - other P0 tasks remain ready/blocked |

## Evidence References

- `audit/build_reviews/FIX-012_SAPCA_SAMPLE_DATA_FIX_REPORT.md`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/index.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapca/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/hooks/use-main-dbit.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/parse-remarks.ts`
- `npx tsc --noEmit`

## Next Recommended Task

`TASK-FIX-025` - ITSC child-data read/write alignment.
