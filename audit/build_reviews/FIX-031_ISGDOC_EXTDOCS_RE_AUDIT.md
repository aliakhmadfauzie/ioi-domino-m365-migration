# FIX-031 ISGDOC ExtDocs Persistence Re-Audit Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-031 |
| Fix ID | FIX-031 |
| Department | IT |
| Form | ISGDOC |
| Priority | P0 |
| Type | Re-Audit |
| Reason | Verify ISGDOC structured document fields persist and read through `MainDB_IT_Ext_Docs` |

## Why Allowed

| Check | Result |
|---|---|
| `DependsOn` (`TASK-FIX-031`) | Complete - fix evidence recorded in `audit/build_reviews/FIX-031_ISGDOC_EXTDOCS_FIX_REPORT.md` |
| Required source evidence files | Existing - ISGDOC new/list pages, ExtDocs model/service/hooks, ISGDOC audit finding |
| Blocking rule violation | None - this is a re-audit of a P0 Fix task, not a new build |
| CIR blocking rule | Not applicable - ISGDOC is an IT form, not HR |

## Re-Audit Checks

### Check 1: ISGDOC creates the parent record

**Source evidence:** `src/pages/it/forms/isgdoc/new.tsx`

The submit handler still calls `createMainDBIT` with `formcode: 'ISGDOC'`, generated record number, requester email, submitted date, workflow stage, current status, and remarks JSON.

**Verdict:** PASS - parent record creation remains intact.

### Check 2: ISGDOC creates linked ExtDocs child data

**Source evidence:** `src/pages/it/forms/isgdoc/new.tsx`

After parent creation, the handler creates `MainDB_IT_Ext_Docs` data with `parentFormCode: 'ISGDOC'`, `parentRecord: { id: created.id, title: recordNo }`, and `parentSite: 'PRAI'`.

**Verdict:** PASS - ISGDOC no longer leaves the ExtDocs schema unused on create.

### Check 3: ISGDOC maps document fields to confirmed ExtDocs model fields

**Source evidence:** `src/pages/it/forms/isgdoc/new.tsx`; `src/generated/models/main-dbit-ext-docs-model.ts`

Submit maps `DOC_Type`, `DOC_Title`, `DOC_VerNo`, `DOC_DateLast`, `DOC_Revision`, `DOC_ApplicableTo`, and `DOC_Comments` into `iTPDocType`, `iTPDocTitle`, `iTPVersionNo`, `iTPDateLastUpdated`, `iTPRevisionNo`, `iTPApplicableTo`, and `iTPComments`.

**Verdict:** PASS - mapped fields are present in the generated ExtDocs model.

### Check 4: ISGDOC list/detail reads ExtDocs data

**Source evidence:** `src/pages/it/forms/isgdoc/index.tsx`

The list page now calls `useMainDBITExtDocsList({ filter: "parentFormCode eq 'ISGDOC'" })`, builds lookup maps by parent record ID/title, and joins child rows to parent `MainDB_IT` records.

**Verdict:** PASS - list/detail assembly reads structured ExtDocs data.

### Check 5: Existing remarks-only submissions remain readable

**Source evidence:** `src/pages/it/forms/isgdoc/index.tsx`

Mapped row values prefer ExtDocs fields but fall back to parsed remarks values for all existing document fields. Owner remains remarks-based because no confirmed ExtDocs owner field exists in the generated model.

**Verdict:** PASS - old records are not orphaned by the structured read change.

### Check 6: Status behavior remains separately tracked

**Source evidence:** `audit/05_fix_backlog/FIX_BACKLOG.md`

The separate ISGDOC status taxonomy issue remains `FIX-030` / `TASK-FIX-030` at P1. This re-audit only covers P0 structured persistence/read alignment.

**Verdict:** PASS - no unrelated status claim was promoted by this fix.

### Check 7: TypeScript compilation

**Evidence:** `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

**Verdict:** PASS

## Result

| Item | Status |
|---|---|
| Parent `MainDB_IT` create retained | Pass |
| ExtDocs child create added | Pass |
| Confirmed ExtDocs document fields mapped | Pass |
| List/detail ExtDocs read join added | Pass |
| Remarks fallback preserved | Pass |
| Separate status issue left open | Pass |
| TypeScript compilation | Pass |
| **Overall** | **RE-AUDIT PASSED** |

## Queue Updates

| Task ID | Previous Status | New Status |
|---|---|---|
| TASK-FIX-031 | Ready | Verified |
| TASK-RE-AUDIT-031 | Not listed | Complete |

## Residual Issue Outside This Fix Scope

`FIX-030` / `TASK-FIX-030` remains a separate P1 workflow/status taxonomy item for replacing the current initial status with the confirmed non-approval submitted/completed state.

## Evidence References

- `audit/03_findings/IT/AUD-007_ISGDOC_AUDIT.md`
- `audit/05_fix_backlog/FIX_BACKLOG.md`
- `audit/build_reviews/FIX-031_ISGDOC_EXTDOCS_FIX_REPORT.md`
- `src/pages/it/forms/isgdoc/new.tsx`
- `src/pages/it/forms/isgdoc/index.tsx`
- `src/generated/models/main-dbit-ext-docs-model.ts`
- `src/generated/services/main-dbit-ext-docs-service.ts`

## Next Recommended Task

`TASK-FIX-033` - ITINFO ExtDocs read alignment.
