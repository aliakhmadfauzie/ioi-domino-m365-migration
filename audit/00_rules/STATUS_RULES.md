# Status Rules

## Strict Status Values

Only these audit status values are allowed:

| Status | Meaning |
|---|---|
| Not Started | No audit work has begun for the item. |
| In Progress | Evidence gathering, comparison, or finding write-up has started. |
| Completed - Passed | Audit completed and no issues were found. |
| Completed - Issues Found | Audit completed and one or more issues were found. |
| Blocked - Missing Source | Domino/PDF/source evidence required for audit is missing. |
| Blocked - Missing App File | Expected app page, schema, hook, service, model, or route is missing. |
| Blocked - Missing SharePoint List | Expected SharePoint list is not evidenced. |
| Blocked - Missing SharePoint Schema | List exists or is expected, but column/internal-name schema evidence is missing. |
| Blocked - Missing Workflow Logic | Workflow cannot be audited because approval/status/action logic is missing. |
| Blocked - Ambiguous Requirement | Evidence conflicts or business requirement is unclear. |
| Ready for Fix | Issue has enough evidence and a recommended fix for fix mode. |
| Ready for Build | Audit/fixes are sufficient for build implementation or packaging. |
| Ready for UAT | Build is ready for user acceptance testing. |

Do not use alternate labels such as `Done`, `Complete`, `Passed`, `Failed`, `Skipped`, `Open`, or `Closed` in audit registers.

## Approval Classification Values

Only these approval classification values are allowed:

| Classification | Meaning |
|---|---|
| Required | Evidence confirms approval/review is required. |
| Not Required | Evidence confirms no approval is required. |
| Conditional | Evidence confirms approval depends on a trigger. |
| Unknown | Evidence is missing, incomplete, or conflicting. |

Conditional approval must include the trigger condition.

Unknown approval must include either `requires human review` or a blocked status.

## Status Update Rules

1. New items start as `Not Started`.
2. When evidence review begins, set status to `In Progress`.
3. Use `Completed - Passed` only when the finding file shows no unresolved issues.
4. Use `Completed - Issues Found` when unresolved issues exist.
5. Use a `Blocked - ...` status when progress cannot continue because evidence is missing or ambiguous.
6. Use `Ready for Fix` only after the issue has evidence, impact, and recommended fix.
7. Use `Ready for Build` only after required audit/fix blockers are resolved or accepted.
8. Use `Ready for UAT` only after build readiness is confirmed.
9. Do not mark completed based on assumptions.
10. Preserve historical status rows when adding re-audit results.
11. Do not use `Ready for Fix` for issues that still need source/schema confirmation.
12. Do not use `Ready for Build` when open High or Critical issues remain unless the user explicitly accepts them.
13. Do not use `Ready for UAT` until build evidence and UAT scenarios exist.

## Register Status Rules

| Register | Allowed Status Source |
|---|---|
| Audit master register | Latest item finding and batch summary |
| Form inventory | Latest form audit finding |
| SharePoint list inventory | Schema/list evidence |
| Workflow register | Workflow audit evidence |
| Fix backlog | Finding file and fix verification evidence |
| Ready for build register | Closed/accepted audit findings |
| UAT checklist | Test execution evidence |

## Status Conflict Rules

When two files disagree:

1. Record the conflict in the finding file.
2. Do not silently normalize the conflict.
3. Prefer the source with stronger evidence.
4. If no source clearly wins, use `Blocked - Ambiguous Requirement`.

## Re-Audit Status Rules

1. A re-audit starts as `In Progress`.
2. Preserve the prior status and prior finding IDs.
3. Add new findings with new IDs if new issues are found.
4. If a prior issue remains, keep the backlog status unresolved.
5. If a prior issue is fixed and verified, update the backlog with verification evidence.

## Legacy Status Translation

If older audit files contain non-strict status values, translate them only when updating the file for new work:

| Legacy/Old Value | Strict Value |
|---|---|
| Completed with issues | Completed - Issues Found |
| Completed - No Issues | Completed - Passed |
| Blocked | Use the most specific `Blocked - ...` value |
| Open | Ready for Fix only when evidence and recommended fix are complete; otherwise keep in backlog narrative |

Preserve historical text in finding files unless the file is being actively updated.
