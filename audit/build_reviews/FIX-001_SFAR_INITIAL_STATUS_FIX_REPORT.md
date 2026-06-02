# FIX-001 SFAR Initial Status Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-001 |
| Fix ID | FIX-001 |
| Department | IT |
| Form | SFAR |
| Priority | P1 |
| Type | Approval Logic Mismatch |
| Scope | Prevent initial SFAR submission from writing final `Approved` status |

## Why Allowed

| Check | Result |
|---|---|
| Queue status | `TASK-FIX-001` was the next selectable Ready P1 task after all selectable P0 tasks were complete, blocked, skipped, or pending provisioning |
| DependsOn | None |
| Blocking rules | No new build started; this was a targeted fix checkpoint |
| CIR blocking rule | Not applicable - SFAR is an IT form |

## Finding

`AUD-023` and `FIX_BACKLOG.md` recorded that the shared SFAR submit path previously created required-approval SFAR records with `CurrentstatusKey1`, which maps to `Approved` in the generated `MainDB_IT` model.

Current source evidence shows the specific initial-status defect is already corrected by the SFAR persistence fix that was implemented and re-audited under `TASK-FIX-026` / `TASK-RE-AUDIT-026`.

## Evidence Checked

| Evidence | Result |
|---|---|
| `src/generated/models/main-dbit-model.ts` | `CurrentstatusKey1` maps to `Approved`; `CurrentstatusKey49` maps to `Pending Owner` |
| `src/components/forms/dynamic-form-renderer.tsx` | SFAR branch sets `currentStatus` to `CurrentstatusKey49` instead of `CurrentstatusKey1` |
| `src/components/forms/dynamic-form-renderer.tsx` | SFAR branch sets `workflowstage` to `2` and records `currentAction: PendingOwner` in remarks |
| `src/components/forms/dynamic-form-renderer.tsx` | SFAR submit seeds `ApprovalRecords` with submission and pending folder-owner review history |
| `src/config/module-workflows.ts` | SFAR workflow defines submitted/pending owner-HOD stage before HOD and IT stages |
| `audit/build_reviews/FIX-026_SFAR_PERSISTENCE_RE_AUDIT.md` | Re-audit already passed the SFAR pending owner-review start-state check |

## Work Performed

No app source patch was required for this checkpoint. The current implementation already prevents the initial SFAR submit from writing final `Approved` status:

```tsx
const isSFAR = formConfig.code === 'SFAR';
const currentStatus = (isSFAR ? 'CurrentstatusKey49' : 'CurrentstatusKey1') as MainDBITCurrentstatusKey;
const workflowstage = isSFAR ? 2 : 1;
```

This checkpoint records the P1 fix evidence separately because `FIX-001` remained Ready even though the status correction landed during the broader P0 SFAR persistence fix.

## Verification

- Static evidence confirms `CurrentstatusKey49` = `Pending Owner`.
- Static evidence confirms the SFAR submit path no longer uses `CurrentstatusKey1` for initial submission.
- `npx tsc --noEmit` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Result

**Fixed Pending Re-Audit** - SFAR initial submit no longer writes final `Approved` status. A targeted re-audit should verify the status branch, workflow-stage value, approval-history seed rows, and TypeScript compile evidence.

## Re-Audit Scope

1. Verify `CurrentstatusKey1` still maps to `Approved`.
2. Verify `CurrentstatusKey49` still maps to `Pending Owner`.
3. Verify SFAR initial submit writes `CurrentstatusKey49`.
4. Verify SFAR initial submit writes `workflowstage: 2`.
5. Verify SFAR remarks/action history indicate the pending owner-review start.
6. Run `npx tsc --noEmit`.
