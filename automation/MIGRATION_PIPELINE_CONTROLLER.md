# Migration Pipeline Controller

> Authoritative controller for selecting and executing the next migration pipeline task.
> Last updated: 2026-06-01

## Purpose

This controller prevents agents from skipping blocked work, starting downstream builds too early, or marking migration tasks complete without evidence.

It must be read before selecting any task from `automation/MASTER_TASK_QUEUE.md`.

## Required Inputs

Before task selection, read these files:

| File | Purpose |
|---|---|
| `automation/MASTER_TASK_QUEUE.md` | Canonical task queue and task status |
| `automation/BLOCKING_RULES.md` | Global build, source analysis, schema, and automation blockers |
| `audit/05_fix_backlog/FIX_BACKLOG.md` | Fix status and failed re-audit evidence |
| `source_analysis/09_reports/MASTER_MIGRATION_ROLLOUT_REGISTER.md` | Rollout-level active work and blockers |
| `source_analysis/09_reports/HR_DEPARTMENT_PROGRESS_REGISTER.md` | HR baseline state and dependent build blockers |

If a required input is missing, stop and report the missing file. Do not select or execute a task.

## Allowed Task Types

- Extraction
- Quality Review
- Promotion
- Schema Generation
- Schema Validation
- Build
- Build Audit
- Fix
- Re-Audit
- Progress Register Update
- Human Confirmation Question Update

## Task Selection Rules

Apply these rules in order:

1. Select P0 tasks before P1 or lower.
2. Fix failed builds before starting new builds.
3. Re-audit fixed items before starting dependent builds.
4. Continue extraction only if it does not depend on failed build work.
5. Do not start DRD until CIR passes re-audit.
6. Do not start any new form build if the current department baseline form has failed.
7. Do not modify app source code unless the selected task is Fix Mode or Build Mode.
8. Do not promote extraction candidates unless quality review passed.
9. Do not generate schema unless promoted requirements exist.
10. Do not mark anything complete without evidence.

When multiple unblocked tasks have the same priority, select the earliest task in `MASTER_TASK_QUEUE.md`.

## Status Interpretation

| Status Text | Meaning | Selectable? |
|---|---|---|
| `Ready` | Task can start after dependency and file checks | Yes |
| `Ready (...) / Action: ...` | Task can start; action text defines scope | Yes |
| `To Do` | Task can start if no dependency or blocking rule prevents it | Yes |
| `Failed Re-Audit / To Do` | Fix task can start; failed evidence exists | Yes, for Fix only |
| `Partially Ready` | Only the explicitly ready subset can start | Conditional |
| `Pending` | Waiting for dependency completion | No |
| `In Progress` | Already started; continue only if it is the highest-priority active task and not blocked | Conditional |
| `Blocked` | Blocked by rule or missing decision/evidence | No |
| `Complete` / `Completed` / `Verified` | Finished; do not reselect unless a new task exists | No |

## Dependency Verification

Before execution, verify:

1. `DependsOn` task IDs are complete or verified.
2. Required source evidence files exist.
3. Required schema or mapping files exist for schema/build tasks.
4. Quality review exists and permits promotion for promotion tasks.
5. No blocking rule applies to the task, form, department, or dependency chain.

If verification fails, update the task as blocked with the reason and stop.

## Blocking Rules

Always enforce `automation/BLOCKING_RULES.md`.

Current known hard blockers:

| Blocker | Effect |
|---|---|
| CIR failed strict re-audit | Blocks DRD and all new HR builds dependent on CIR baseline |
| Any P0 build audit issue | Blocks next form build |
| Wrong SharePoint list writes | Blocks next build |
| Wrong internal column names | Blocks next build |
| Approval workflow on a non-approval form | Blocks next build |
| Unverified workflow routing | Blocks full build |
| Failed re-audit | Keeps dependent forms blocked |

## Execution Scope

Execute exactly one selected task.

Do not combine task types unless the selected task explicitly requires a register/report update as part of completion.

### App Source Code Rule

Only modify files under the active app source path when the selected task type is `Fix` or `Build`:

`ioicodeapp/powerapps-mirror/apps/ioi-platform/src/`

For all other task types, restrict changes to automation, audit, source analysis, mapping, design, or documentation files as required by the task.

## Completion Requirements

After executing the selected task:

1. Update the task status in `automation/MASTER_TASK_QUEUE.md`.
2. Update all related registers and reports.
3. Create the required report file for the task.
4. Add the next task automatically if appropriate.
5. Mark dependent tasks blocked if the task failed.
6. Add evidence references for every completion claim.
7. Add a `docs/change-log.md` entry for any file creation or significant update.

## Report Requirements

Each task report must include:

| Section | Required Content |
|---|---|
| Task Selected | Task ID, type, priority, department, form |
| Why Allowed | Dependency, file, and blocking-rule verification |
| Work Performed | Files reviewed and changes made |
| Evidence | Source files, audit files, schema files, or test output |
| Result | Completed, blocked, failed, or requires human decision |
| Queue Updates | Status changes and new tasks |
| Next Recommended Task | Highest-priority next unblocked task |

Recommended report locations:

| Task Type | Report Location |
|---|---|
| Extraction | `source_analysis/11_pdf_extraction_layer/extraction_batches/` |
| Quality Review | `source_analysis/11_pdf_extraction_layer/quality_reviews/` |
| Promotion | `source_analysis/09_reports/` |
| Schema Generation / Validation | `source_analysis/06_sharepoint_design/` or `audit/08_reports/` |
| Build / Fix / Re-Audit | `audit/build_reviews/` or `audit/08_reports/` |
| Progress Register Update | `source_analysis/09_reports/` |
| Human Confirmation Question Update | `source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |

## Stop Conditions

Stop immediately if:

- A P0 issue remains unresolved and the selected task is not the relevant Fix or Re-Audit.
- A required source file is missing.
- A required schema file is missing.
- Re-audit fails.
- A human decision is required for workflow, source ownership, or schema.
- The task cannot be completed safely.

When stopping, update the queue only if the selected task can be clearly marked blocked with evidence. Otherwise, report the stop condition without changing task status.

## Final Response Format

Use this format after every controller run:

1. Task selected
2. Task completed or blocked
3. Files updated
4. New tasks created
5. Blockers
6. Next recommended task

