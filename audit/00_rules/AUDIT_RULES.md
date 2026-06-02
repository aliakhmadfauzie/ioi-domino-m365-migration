# Audit Rules

## Audit Scope

The audit checks whether the Power Apps Code App implementation matches Domino evidence, SharePoint schema evidence, workflow evidence, and migration documentation.

## Core Audit Rules

1. Audit mode may only create or update files under `audit/`.
2. App source code is read-only during audit mode.
3. Existing audit files must be read before creating or updating files.
4. Existing audit data must be preserved.
5. Each audited form must have a finding file.
6. Each audited item must update the master register.
7. Each unresolved issue must be added to the fix backlog.
8. Conflicts between documentation, code, schema, and source must be recorded.
9. Missing evidence must be marked as blocked or unknown, not guessed.
10. Every finding must include a risk value from `RISK_RULES.md`.
11. Every audited item must include an approval classification from `STATUS_RULES.md`.
12. Every register update must use strict status values from `STATUS_RULES.md`.

## Audit Output Requirements

Each audited item must produce or update:

| Artifact | Requirement |
|---|---|
| Finding file | One per form/item, with evidence and issue IDs. |
| Master register | Item status, approval classification, finding path, backlog IDs. |
| Fix backlog | One row per unresolved issue. |
| Workflow register | Required when workflow or approval evidence is reviewed. |
| SharePoint inventory | Required when list/column evidence is reviewed. |

Do not leave an audited item without a finding file, even if the audit passes.

## SharePoint Field Mapping Rules

For each form, audit:

| Area | Required Check |
|---|---|
| List existence | Confirm the target list exists in evidence. |
| Column existence | Confirm the app field maps to a real SharePoint column. |
| Internal name | Confirm the internal name used by code/service matches schema evidence. |
| Display name | Record display label if available. |
| Type | Confirm text, choice, person, lookup, date/time, boolean, number, attachment, or multiline. |
| Required | Confirm whether requiredness comes from schema, app validation, or source form. |
| Choice values | Confirm allowed values from schema/source evidence. |
| Person fields | Confirm email, display name, claims, lookup id, and object shape. |
| Lookup fields | Confirm lookup target list and field. |
| Attachments | Confirm whether attachment handling is implemented or missing. |

If the app references a field not found in the expected SharePoint schema, record an issue.

If SharePoint has a field that the source form requires but the app does not use, record a missing implementation issue.

## Power Apps Read Logic Rules

Audit read logic in React/TypeScript equivalents of Power Apps read formulas:

| Pattern | Required Check |
|---|---|
| List retrieval | Confirm correct hook/service and list name. |
| Detail retrieval | Confirm route parameter maps to the correct record id. |
| Parent-child reads | Confirm extension list records are joined when writes create child records. |
| Status display | Confirm status keys are mapped to correct user-facing labels. |
| Sample data | Record as an issue if production screens read sample/mock data. |
| Parsing | Record risk when structured source fields are stored only in `remarks` JSON. |
| Loading/error/empty | Confirm pages handle loading, error, and missing record states. |

If a list page and create page use different storage locations for the same fields, record a read/write mismatch issue.

## Power Apps Write Logic Rules

Audit write logic in create/update handlers, generated services, hooks, and submit transforms:

| Pattern | Required Check |
|---|---|
| Parent create | Confirm main list record is created with correct `FormCode`. |
| Child create | Confirm extension list record is created when required. |
| Rollback | Check whether parent rollback exists if child create fails. |
| Field persistence | Confirm all required UI/source fields are written. |
| Status | Confirm initial and next status values match workflow evidence. |
| User fields | Confirm requester/approver/person fields persist correct email/name/object shape. |
| Attachments | Confirm attachment evidence and implementation. |
| Error handling | Confirm failures are surfaced and do not silently lose data. |

If a write stores source-required fields only in free-text notes or JSON, record whether structured SharePoint columns are required by source, mapping, or reporting evidence.

## Patch Logic Rules

For Power Fx `Patch` or TypeScript equivalent update/create code:

1. Confirm the patched data source is the correct SharePoint list.
2. Confirm every patched field exists in the target list.
3. Confirm the value type matches the SharePoint column type.
4. Confirm choice fields are patched using the expected object or key format.
5. Confirm person fields use the required email/claims/id structure.
6. Confirm lookup fields use the target lookup object/id expected by the connector.
7. Confirm patch result is checked for failure.
8. Confirm parent-child patch order is correct.

## SubmitForm Logic Rules

For Power Fx `SubmitForm` or equivalent form submit behavior:

1. Confirm the form data source matches the expected SharePoint list.
2. Confirm form mode is correct for new/edit/view.
3. Confirm required validation runs before submit.
4. Confirm `OnSuccess` or equivalent creates needed child records.
5. Confirm `OnFailure` or equivalent records/shows errors.
6. Confirm submit does not set an approval-complete status unless evidence supports it.

## Collect and ClearCollect Logic Rules

For Power Fx `Collect`, `ClearCollect`, or TypeScript in-memory state/cache equivalents:

1. Confirm collections are not used as permanent data storage.
2. Confirm collection data is refreshed after writes.
3. Confirm collection filters match SharePoint filters.
4. Confirm collected mock/sample data is not used in production views.
5. Confirm collection columns match the schema used by read/write logic.

## Filter and LookUp Logic Rules

For Power Fx `Filter`, `LookUp`, or TypeScript query/filter equivalents:

1. Confirm filters use real SharePoint internal names after service translation.
2. Confirm `FormCode` filters are present for main-list shared tables.
3. Confirm lookup by id uses the correct id type and route parameter.
4. Confirm person filters use email or claims consistently.
5. Confirm delegation risks are recorded for non-delegable filters.
6. Confirm status filters compare against the correct key or label.
7. Confirm parent-child filters use the correct parent lookup field.

## Office 365 Users Connector Rules

Audit Microsoft 365 Users usage:

1. Confirm people pickers use Microsoft 365 user identity where required.
2. Confirm email is persisted when routing depends on email.
3. Confirm display name alone is not used for workflow routing.
4. Confirm fallback behavior exists when the connector cannot resolve a user.
5. Confirm selected user fields map to SharePoint person/text fields correctly.
6. Confirm external or shared mailbox scenarios are marked Unknown unless evidenced.

## Workflow Rules

### Approval Workflow

1. Do not assume approval is required.
2. If approval is Required, document stages, roles, status values, actions, visibility, and notifications.
3. Confirm submit enters the first pending approval state.
4. Confirm approver actions update status and write approver evidence.
5. Confirm rejection, withdrawal, and completion states are handled.
6. Confirm conditional approvers are documented with trigger rules.

### Non-Approval Forms

1. Do not assume approval is not required.
2. If approval is Not Required, confirm evidence shows submit-only, log-only, or direct completion behavior.
3. Confirm submit does not route to approvers.
4. Confirm status values are simple and do not imply missing approval.

### Conditional Approval

1. Classify as Conditional only when evidence confirms a trigger.
2. Document the trigger condition.
3. Confirm both approval and non-approval branches are implemented.
4. If only one branch is implemented, record an issue.

## Form Mode Rules

| Mode | Required Audit Checks |
|---|---|
| Draft | Save as draft must preserve data without starting approval unless evidence says otherwise. |
| Submit | Submit must validate required fields and enter correct workflow/status. |
| Edit | Edit must load existing data, preserve immutable fields, and update only allowed fields. |
| View | View must be read-only unless role/status evidence permits actions. |

## Section Visibility Rules

For every form section, audit:

1. Visible conditions.
2. Hidden conditions.
3. Editable conditions.
4. Read-only conditions.
5. Role requirements.
6. Status requirements.
7. Field dependency requirements.
8. Draft vs submitted behavior.
9. Approver-only or submitter-only behavior.
10. Missing visibility logic.

If visibility is unclear, record `Unknown` and add a finding if it affects workflow or data integrity.

## Validation Rules

1. Required fields must match source evidence, SharePoint schema, and app validation.
2. Validate date/time fields use correct format and type.
3. Validate choice values match source/schema options.
4. Validate person fields use resolvable users.
5. Validate conditional required fields.
6. Validate attachment requirements.
7. Record conflicts between source-required and app-required fields.

## Error Handling Rules

Audit for:

1. User-visible error messages.
2. Logged technical errors.
3. Failed parent create.
4. Failed child create.
5. Failed update/patch.
6. Failed connector/user lookup.
7. Failed attachment upload.
8. Silent catch blocks.
9. Partial saves.

Silent failure of required data persistence is at least High risk.

If a child record create is optional or non-fatal, the finding must state whether that behavior is supported by evidence.

## Batch Audit Rules

1. Use the master register to select the next `Not Started` item in the selected batch.
2. Read existing finding files before reusing a batch/form ID.
3. Create one finding file per audited item.
4. Update the fix backlog immediately after identifying unresolved issues.
5. Update the register after each item.
6. Move automatically to the next item in the batch unless blocked.
7. Do not mark the batch completed until all batch items have final statuses.
8. Use `Completed - Passed` only when all items have no unresolved issues.
9. Use `Completed - Issues Found` when one or more items have unresolved findings.

### Batch Close Quality Gate

Before creating or finalizing a batch summary, verify and document:

1. Selected item count equals finding file count.
2. Every selected item has one and only one finding file.
3. Every selected item has one item-level row in `AUDIT_MASTER_REGISTER.md`.
4. Every unresolved finding has a fix backlog row unless the finding is explicitly informational.
5. Every finding file contains source evidence, app evidence, SharePoint/list mapping evidence, approval classification, risk, and final decision.
6. Every issue has file-path evidence and a specific impact statement.
7. No batch item remains `In Progress` after the batch summary is created.
8. Any register range rows or discovery summary rows that conflict with item-level rows are listed as quality notes and corrected only if the current task allows register updates.
9. Existing legacy statuses are not treated as new batch statuses; new batch rows must use strict status values.

### Count Reconciliation Rules

1. State the count basis before listing counts.
2. Use one of these bases: `Item-level audit rows`, `Assigned audit IDs from FORM_INVENTORY`, or `Batch summary rows`.
3. Do not mix item-level counts with discovery range rows unless explicitly stated.
4. If the master register contains range rows that cover audited item IDs, document the possible conflict.
5. If not every assigned audit ID has an item-level row, do not claim the master register itself proves the count.
6. For partial batches, report both selected-item counts and overall-register counts.

### Evidence Precision Rules

1. Prefer file paths with line numbers or section names when available.
2. If evidence is produced by a command or extraction, state the command purpose or extraction method.
3. Do not use phrases such as `field metadata extraction` without naming the source file and what was extracted.
4. If a SharePoint column is inferred from a generated model, mark it as generated model evidence, not live SharePoint schema evidence.
5. If local schema files are missing or incomplete, state `Schema Unknown` or `Mapping Incomplete` instead of filling gaps.
6. Risk must include at least one concrete impact tied to evidence.

## Re-Audit Rules

Re-audit a completed item only when:

1. The user requests re-audit.
2. Related source/app/schema files changed.
3. A previous blocker has been resolved.
4. Live SharePoint schema evidence becomes available.
5. A fix has been implemented and needs verification.

Preserve the old finding and add a new re-audit section or new dated finding file.

## Ready Gate Rules

| Gate | Requirement |
|---|---|
| Ready for Fix | Evidence, impact, and recommended fix are documented. |
| Ready for Build | Required fixes are implemented or explicitly accepted. |
| Ready for UAT | Build is available and test scenarios are defined. |

Do not move an item to a ready gate based on optimism or similarity to another form.
