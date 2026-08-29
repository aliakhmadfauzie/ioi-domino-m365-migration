# FIX-026 SFAR Persistence Alignment Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-026 |
| Fix ID | FIX-026 |
| Department | IT |
| Form | SFAR |
| Priority | P0 |
| Type | App Write Logic Issue |
| Scope | Persist SFAR structured access fields and approval action history to confirmed SharePoint-backed locations |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | None violated - this is a Fix task, not a Build |
| DependsOn | None |
| Higher-priority tasks | Earlier selectable IT P0 fixes/re-audits through `TASK-RE-AUDIT-025` are complete; SAPAMR remains fixed pending manual provisioning |
| CIR blocking rule | Not applicable - SFAR is an IT form, not HR |

## Finding

SFAR used `DynamicFormRenderer`, whose submit path created a `MainDB_IT` parent record with JSON remarks only. The SFAR list/detail evidence expected structured SFAR fields plus `MainDB_IT_Ext_Access` data, and workflow evidence required approval history for the folder-owner review path.

## Work Performed

**Files modified:**

- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/lib/it-forms-config.ts`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/components/forms/dynamic-form-renderer.tsx`
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts`

Changes:

1. Added an SFAR `submitTransform` that maps form fields to confirmed `MainDB_IT` SFAR columns, including company, department, server, request type, owner, access target, folder path, access level, purpose, and justification.
2. Updated the shared dynamic submit path so SFAR starts in `CurrentstatusKey49` (`Pending Owner`) with `workflowstage: 2` instead of the shared approved status.
3. Created a linked `MainDB_IT_Ext_Access` child row for SFAR folder path and access level using the confirmed ExtAccess schema fields.
4. Seeded `ApprovalRecords` with a submission history row and pending folder-owner review row.
5. Updated the ExtAccess generated service to denormalize create/update payloads and normalize readback for SFAR fields and parent lookup fields.

## Evidence

| File | Purpose |
|---|---|
| `src/lib/it-forms-config.ts` | SFAR submit transform writes confirmed structured `sFAR*` fields to `MainDB_IT` |
| `src/components/forms/dynamic-form-renderer.tsx` | SFAR submit creates parent record, ExtAccess child record, and initial approval history records |
| `src/generated/services/main-dbit-ext-access-service.ts` | ExtAccess service now maps SFAR model fields to SharePoint internal names and normalizes readback |
| `.power/schemas/sharepointonline/maindb_it.Schema.json` | Confirms `SFAR_*` parent columns |
| `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` | Confirms ExtAccess `SFAR_FolderPath`, `SFAR_AccessLevel`, `SFAR_ReviewedBy`, and `SFAR_ReviewedDate_dt` |
| `src/generated/models/approval-records-model.ts` | Confirms `ApprovalRecords` action history model |
| `npx tsc --noEmit` | TypeScript compilation passed |

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.

## Result

**Fixed Pending Re-Audit** - SFAR submit now persists confirmed structured access fields, creates the confirmed access child row, and starts approval history in `ApprovalRecords`.

## Re-Audit Scope

1. Verify SFAR `submitTransform` writes confirmed `MainDB_IT` SFAR fields.
2. Verify SFAR parent submit starts in the pending owner-review state.
3. Verify SFAR submit creates an ExtAccess child row with confirmed folder path and access-level fields.
4. Verify SFAR submit creates initial `ApprovalRecords` history rows.
5. Verify ExtAccess service maps and normalizes SFAR fields.
6. Verify TypeScript compilation.
