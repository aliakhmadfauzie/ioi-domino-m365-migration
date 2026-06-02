# FIX-003 EAF Re-Audit

Date: 2026-06-01
Task ID: TASK-RE-AUDIT-003
Related Fix: FIX-003
Related Audit: AUD-B01-EAF
Department/Form: IT / EAF
Result: Failed Re-Audit - Fix Required

## Task Selected

- Task ID: `TASK-RE-AUDIT-003`
- Type: Re-Audit
- Priority: P0
- Depends On: `TASK-FIX-003`

## Why Allowed

- `TASK-RE-AUDIT-003` was the highest-priority Ready task in `automation/MASTER_TASK_QUEUE.md`.
- `TASK-FIX-003` was marked `Fixed Pending Re-Audit`.
- Re-audit is required before starting any dependent or lower-priority work.
- This task does not start a new build and does not modify app source code.

## Scope

Re-audit limited to `FIX-003`: EAF required field persistence for:

- `eAFClientID`
- `eAFUserGroup`
- `eAFHigherApproverEmail`

## Evidence Reviewed

- `audit/findings/batch-01/eaf.md`
- `audit/build_reviews/FIX-003_EAF_FIX_REPORT.md`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/eaf/new.tsx`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/types/m1-forms.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/EAF.json`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbit-ext-access-model.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/services/main-dbit-ext-access-service.ts`
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json`

## Checks

| Check | Result | Evidence |
|---|---|---|
| SharePoint schema contains `EAF_ClientID` | Passed | `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` contains read-write `EAF_ClientID`. |
| SharePoint schema contains `EAF_UserGroup` | Passed | `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` contains read-write `EAF_UserGroup`. |
| SharePoint schema contains `EAF_HigherApprover_Email` | Passed | `.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` contains read-write `EAF_HigherApprover_Email`. |
| Generated model contains `eAFClientID` | Passed | `src/generated/models/main-dbit-ext-access-model.ts` contains `eAFClientID?: string`. |
| Generated model contains `eAFUserGroup` | Passed | `src/generated/models/main-dbit-ext-access-model.ts` contains `eAFUserGroup?: string`. |
| Generated model contains `eAFHigherApproverEmail` | Passed | `src/generated/models/main-dbit-ext-access-model.ts` contains `eAFHigherApproverEmail?: string`. |
| Service field map targets confirmed internal names | Passed | `main-dbit-ext-access-service.ts` maps to `EAF_ClientID`, `EAF_UserGroup`, `EAF_HigherApprover_Email`. |
| Create payload persists Client ID from form input | Passed | `new.tsx` writes `eAFClientID: formData.ClientID || ''`; UI updates `ClientID`. |
| Create payload persists User Group from form input | Failed | UI/type use `Group`, but payload writes `eAFUserGroup: formData.UserGroup || ''`. Search found no EAF `UserGroup` form input/state field. |
| Create payload persists Higher Approver from form input or routing logic | Failed | Schema/type/payload mention `HigherApprover`, but search found no EAF UI or update path that populates `HigherApprover`. |
| TypeScript compile | Passed | `npx tsc --noEmit` exited 0 from `ioicodeapp/powerapps-mirror/apps/ioi-platform`. |

## Findings

### REAUD-FIX-003-001 - User Group payload reads the wrong form key

- Severity: P0
- Evidence:
  - `src/types/m1-forms.ts` defines `Group?: string` for the Domino `Group` field.
  - `src/pages/it/forms/eaf/new.tsx` initializes `Group: ''`.
  - `src/pages/it/forms/eaf/new.tsx` UI updates `updateField('Group', e.target.value)`.
  - `src/pages/it/forms/eaf/new.tsx` submit payload writes `eAFUserGroup: formData.UserGroup || ''`.
- Impact: User-entered User Group is not persisted to SharePoint; it is saved as blank.
- Required fix: Change the EAF submit payload to persist `formData.Group` to `eAFUserGroup`.

### REAUD-FIX-003-002 - Higher Approver has no input/update path

- Severity: P0
- Evidence:
  - `src/form-schemas/EAF.json` defines `REQ_HApp` mapped to `eAFHigherApproverEmail`.
  - `src/types/m1-forms.ts` defines `HigherApprover?: string`.
  - `src/pages/it/forms/eaf/new.tsx` initializes `HigherApprover: ''` and writes `eAFHigherApproverEmail` from `formData.HigherApprover`.
  - Search of `src/pages/it/forms/eaf/new.tsx` found no UI control or routing assignment that updates `HigherApprover`.
- Impact: Higher Approver is not persisted with submitted EAF records unless populated by an absent code path.
- Required fix: Add a clear EAF input/routing path for `HigherApprover` and persist it to `eAFHigherApproverEmail`.

## Result

`TASK-RE-AUDIT-003` failed.

`FIX-003` remains unresolved and must return to Fix mode. No next build may start while this P0 issue remains unresolved.

## Queue Updates Required

- `TASK-FIX-003`: `Fixed Pending Re-Audit` -> `Failed Re-Audit / To Do`
- `TASK-RE-AUDIT-003`: `Ready` -> `Failed`
- Add `TASK-FIX-003B`: P0 Fix for EAF User Group and Higher Approver re-audit failures.
- Keep all build tasks blocked until P0 re-audit passes.

## Next Recommended Task

Run `TASK-FIX-003B` in Fix mode.

