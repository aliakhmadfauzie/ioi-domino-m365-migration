# FIX-005 ITSSR PIC Persistence Re-Audit

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-RE-AUDIT-005 |
| Fix ID | FIX-005 |
| Department | IT |
| Form | ITSSR |
| Priority | P0 |
| Type | Re-Audit |

## Scope

Re-audit the previous ITSSR finding that routed IT PIC email was calculated and emailed but not persisted to SharePoint.

## Evidence Reviewed

- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/hooks/use-itssr-routing.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/features/itssr/itssr-app.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-support-service.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json`
- `audit/build_reviews/FIX-005_ITSSR_PIC_PERSISTENCE_FIX_REPORT.md`

## Checks

| Check | Result | Evidence |
|---|---|---|
| Routing produces a primary PIC email | Pass | `determineITSSRRouting` returns `primaryPICEmail` and `primaryPICName`. |
| New submit captures routed PIC | Pass | ITSSR new submit builds `routedPIC` from `routing.primaryPICEmail` / `routing.primaryPICName`. |
| Ext_Support create persists routed PIC | Pass | Create payload writes `iTSSRAssignedToEmail: personEmail(routedPIC)`. |
| Generated service maps model field to SharePoint field | Pass | `denormalizeExtSupport` maps `iTSSRAssignedToEmail` to `ITSSR_AssignedTo_Email`; `normalizeExtSupport` reads it back. |
| Captured schema confirms field availability | Pass | `maindb_it_ext_support.Schema.json` contains read-write `ITSSR_AssignedTo_Email`. |
| Access path can use persisted assignment | Pass | `mapITSSRRecord` maps `ext.iTSSRAssignedToEmail` to `AssignedToEmail`; `useITSSRAccess` checks `record.AssignedToEmail`. |

## Result

Passed. `FIX-005` is verified.

The original audit statement that Ext_Support create omits assigned PIC is no longer true in the current implementation.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.
