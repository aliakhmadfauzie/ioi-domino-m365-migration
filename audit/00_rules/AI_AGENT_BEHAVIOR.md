# AI Agent Behavior

## Purpose

These rules control AI behavior for the IOI Domino to Microsoft 365 migration audit. The target stack is Power Apps Code App, SharePoint Lists, and Microsoft 365 connectors such as Office 365 Users AND Shared_sharepoint.

## Project Operating Modes

| Mode | Trigger | Allowed Changes |
|---|---|---|
| Audit Mode | Default mode unless the user explicitly asks for fixes | Create or update files under `audit/` only |
| Fix Mode | User explicitly asks to fix selected issues | Edit app source code only for selected approved backlog items |

## Strict Vocabulary Enforcement

Agents must use only the status values and risk values defined in `STATUS_RULES.md` and `RISK_RULES.md`.

Do not introduce synonyms such as `Done`, `Complete`, `Failed`, `Skipped`, `Open`, `Closed`, `P1`, `Major`, `Minor`, or `N/A` in registers or findings.

Approval classification must be exactly one of:

| Classification | Required Handling |
|---|---|
| Required | Document approval stages and evidence. |
| Not Required | Document evidence that no approval is required. |
| Conditional | Document the trigger condition and both branches. |
| Unknown | Mark as requiring human review or blocked depending on severity. |

## Audit Mode Behavior

1. Read `AGENTS.md` and the existing audit control files before starting.
2. Read existing files under `audit/` before creating or updating audit artifacts.
3. Continue from existing audit progress.
4. Preserve existing audit rows, findings, backlog IDs, and evidence.
5. Do not modify app source code.
6. Do not modify source evidence, mapping documents, design documents, or production documentation outside `audit/`.
7. Do not delete files.
8. Do not overwrite audit files when adding missing sections is sufficient.
9. Do not invent missing SharePoint lists.
10. Do not invent missing SharePoint columns.
11. Do not invent approval stages, status values, or routing roles.
12. Do not mark new audit items completed unless evidence has been reviewed and a finding file exists.
13. Create or update a finding file for every audited item.
14. Add unresolved issues to the fix backlog.
15. Update the audit register after each audited item.
16. Use the evidence format exactly; do not summarize unsupported impressions as findings.
17. If the app implementation and documentation conflict, record the conflict instead of choosing silently.
18. If source evidence is missing, do not infer behavior from similar forms.

## Batch Self-Review Behavior

Before reporting a batch as complete, the AI agent must perform a self-review:

1. Confirm every selected Audit ID has a finding file.
2. Confirm every finding file contains the required evidence format.
3. Confirm every finding file has source, app, SharePoint/list, workflow, validation, approval, risk, and final decision sections.
4. Confirm every unresolved issue has a fix backlog entry.
5. Confirm the master register item rows match the finding files and backlog IDs.
6. Confirm no selected item remains `In Progress`.
7. Confirm count reconciliation states the count basis.
8. Look for conflicts between item-level rows and range/discovery rows in the master register.
9. If the current task does not permit correcting a discovered conflict, document it in the batch summary or quality report.
10. Do not claim the method is stable without listing any known limitations.

## Fix Mode Behavior

1. Fix mode begins only when the user explicitly asks to fix selected issues.
2. Fix only issues listed in the audit fix backlog or specifically selected by the user.
3. Read the finding file and evidence before editing code.
4. Preserve unrelated source code and user changes.
5. Do not delete files unless the user explicitly authorizes deletion.
6. Do not change SharePoint list or column names unless confirmed by evidence or user instruction.
7. Do not add approval logic unless the finding evidence confirms approval is Required or Conditional.
8. If fixing a field mapping issue, confirm the SharePoint internal name before changing read/write code.
9. After fixes, run the appropriate validation commands where feasible.
10. Update audit backlog/status files only after implementation and verification.
11. Do not broaden a fix beyond the selected backlog item without explicit user approval.
12. If a fix reveals missing source, SharePoint schema, or workflow evidence, stop and mark the item with the appropriate blocked status.

## Evidence Requirements

Every finding must use this evidence format:

- Source:
- File path:
- Code/formula/section:
- What was found:
- Why it matters:

Acceptable evidence includes:

| Evidence Type | Examples |
|---|---|
| Domino source | DXL/XML, extracted inventories, Domino agents |
| UI source | PDF exports, screenshots, existing UI analysis |
| App source | React pages, hooks, generated services, generated models, form schemas |
| SharePoint source | `.power/schemas`, PnP scripts, list exports, schema docs |
| Migration docs | `docs/`, `analysis/`, `mapping/`, `design/m365-design/` |

## Approval Classification Behavior

Approval must be classified as exactly one of:

| Classification | Rule |
|---|---|
| Required | Evidence confirms one or more approval/review stages. |
| Not Required | Evidence confirms submit-only, log-only, or direct completion behavior. |
| Conditional | Evidence confirms approval depends on a field, department, amount, site, status, or other trigger. |
| Unknown | Evidence is missing, ambiguous, or conflicting. |

If classification is Conditional, document the trigger condition.

If classification is Unknown, mark it as requiring human review or blocked depending on severity and available evidence.

## Batch Behavior

1. Audit in controlled batches.
2. Finish one item before moving to the next item in the selected batch.
3. Do not restart completed audits unless related source files changed or the user requests a re-audit.
4. Stop only when the selected batch is complete, no `Not Started` items remain, or a real blocker prevents progress.
5. Do not mark a batch `Completed - Passed` if any item in the batch has unresolved findings.
6. When a batch contains issues, set the batch status to `Completed - Issues Found`.
