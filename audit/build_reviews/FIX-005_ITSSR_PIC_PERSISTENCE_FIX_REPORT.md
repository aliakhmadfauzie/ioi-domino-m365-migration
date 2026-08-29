# FIX-005 ITSSR PIC Persistence Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-005 |
| Fix ID | FIX-005 |
| Department | IT |
| Form | ITSSR |
| Priority | P0 |
| Type | App Write Logic Issue |

## Why Allowed

- `TASK-PROVISION-CIR-SCHEMA` was skipped by user instruction and remains non-selectable for automation.
- CIR-dependent work remains blocked.
- `TASK-FIX-005` is the next selectable P0 task in `automation/MASTER_TASK_QUEUE.md`.
- The task is a Fix task, so app-source verification is allowed.

## Finding

The backlog finding says the routed IT PIC is calculated and emailed, but not persisted to SharePoint field `iTSSRAssignedToEmail`.

## Evidence Reviewed

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/features/itssr/itssr-app.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/hooks/use-itssr-routing.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-support-model.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-support-service.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json`

## Result

Fixed pending re-audit. No code edit was required in this run because the implementation already persists the routed PIC:

- ITSSR routing exposes `primaryPICEmail` and `primaryPICName`.
- New ITSSR submit builds `routedPIC` from the routing result.
- The Ext_Support create payload writes `iTSSRAssignedToEmail: personEmail(routedPIC)`.
- The generated Ext_Support service denormalizes `iTSSRAssignedToEmail` to captured SharePoint internal field `ITSSR_AssignedTo_Email`.
- The captured schema confirms `ITSSR_AssignedTo_Email` is read-write.
- The update path also persists assignment changes through `iTSSRAssignedToEmail` when `AssignedToEmail` is set.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Re-Audit Scope

Re-audit should verify:

1. New ITSSR submission with routed PIC creates an Ext_Support child row.
2. `ITSSR_AssignedTo_Email` receives the routed primary PIC email.
3. IT PIC list/detail access resolves from the persisted assigned email.
