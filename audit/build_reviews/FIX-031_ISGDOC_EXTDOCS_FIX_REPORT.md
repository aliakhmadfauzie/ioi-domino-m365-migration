# FIX-031 ISGDOC ExtDocs Persistence Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-031 |
| Fix ID | FIX-031 |
| Department | IT |
| Form | ISGDOC |
| Priority | P0 |
| Type | App Write Logic Issue |
| Scope | Persist and read ISGDOC document fields through the confirmed `MainDB_IT_Ext_Docs` model while preserving legacy remarks fallback |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | None violated - this is a Fix task, not a Build |
| DependsOn | None |
| Higher-priority tasks | Earlier selectable IT P0 fixes/re-audits through `TASK-RE-AUDIT-026` are complete; SAPAMR remains fixed pending manual provisioning |
| CIR blocking rule | Not applicable - ISGDOC is an IT form, not HR |

## Finding

ISGDOC create/list/detail paths only used `MainDB_IT.remarks` JSON for document fields even though a generated `MainDB_IT_Ext_Docs` model, service, and hook already existed with ITP/ISGDOC-style document fields. This made the structured document schema effectively unused by the form.

## Work Performed

**Files modified:**

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/isgdoc/new.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/isgdoc/index.tsx`

Changes:

1. Kept the existing `MainDB_IT` parent record create path and remarks JSON compatibility for older readback behavior.
2. Added a linked `MainDB_IT_Ext_Docs` child record after parent creation using `parentFormCode: 'ISGDOC'` and the parent lookup ID/title.
3. Persisted confirmed document fields to ExtDocs: type, title, version number, last updated date, revision number, applicable-to text, and comments.
4. Updated ISGDOC list/detail data assembly to query ExtDocs rows, join them to parent `MainDB_IT` records by parent lookup ID/title, and prefer structured ExtDocs values with remarks fallback.
5. Left the unconfirmed owner field in remarks because the ExtDocs model does not expose a confirmed owner column for ISGDOC.
6. Kept status behavior unchanged because the initial Approved/non-approval taxonomy issue is tracked separately as `FIX-030`.

## Evidence

| File | Purpose |
|---|---|
| `src/pages/it/forms/isgdoc/new.tsx` | ISGDOC submit creates parent `MainDB_IT` plus linked `MainDB_IT_Ext_Docs` child data |
| `src/pages/it/forms/isgdoc/index.tsx` | ISGDOC list/detail reads structured ExtDocs fields with remarks fallback |
| `src/generated/models/main-dbit-ext-docs-model.ts` | Confirms ExtDocs model fields used for ITP/ISGDOC document data |
| `src/generated/services/main-dbit-ext-docs-service.ts` | Confirms ExtDocs service maps ITP document fields and parent lookup data |
| `npx tsc --noEmit` | TypeScript compilation passed |

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.

## Result

**Fixed Pending Re-Audit** - ISGDOC now writes and reads structured document fields through `MainDB_IT_Ext_Docs`, with legacy remarks data retained as fallback.

## Re-Audit Scope

1. Verify ISGDOC submit creates the parent `MainDB_IT` record.
2. Verify ISGDOC submit creates a linked `MainDB_IT_Ext_Docs` child row using `parentFormCode: 'ISGDOC'`.
3. Verify ExtDocs child create maps document fields to the confirmed generated model.
4. Verify ISGDOC list/detail reads ExtDocs rows and joins them back to parent records.
5. Verify old remarks-only submissions remain readable through fallback fields.
6. Verify TypeScript compilation.
