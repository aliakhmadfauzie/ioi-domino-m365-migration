# FIX-007 SAPCR Initial Status Fix Report

Date: 2026-06-01
Task: `TASK-FIX-007`
Finding: `AUD-B02-SAPCR-001`
Form: SAPCR - SAP & WB Change Request
Department: IT

## Result

Status: Fixed Pending Re-Audit

SAPCR submit now creates the parent `MainDB_IT` record in the SAPCR workflow start state for BPO approval instead of leaving the submitted record in the draft/request state.

## Evidence Reviewed

- `audit/findings/batch-02/sapcr.md`
- `audit/05_fix_backlog/FIX_BACKLOG.md`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/config/module-workflows.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapcr/new.tsx`

## Code Change

Updated `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/sapcr/new.tsx`:

- Replaced submitted parent `currentStatus: 'Request'` with `currentStatus: 'CurrentstatusKey14'`.
- Added `workflowstage: 1`.
- Kept draft/request handling separate from submitted record creation.

`CurrentstatusKey14` maps to `Pending BPO` in the generated `MainDB_IT` status taxonomy. `workflowstage: 1` aligns with the SAPCR `Submitted` workflow stage, labeled `Pending BPO Approval` in `module-workflows.ts`.

## Verification

- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Work

Run `TASK-RE-AUDIT-007` to independently verify the SAPCR submitted record path, including:

- submit payload uses `CurrentstatusKey14`;
- `workflowstage` is written as `1`;
- submitted records enter the BPO approval state rather than draft/request;
- no regression to SAPCR extension-list email routing child creation.
