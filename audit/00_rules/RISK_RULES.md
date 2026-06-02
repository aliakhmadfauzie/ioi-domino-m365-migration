# Risk Rules

## Strict Risk Values

Only these risk values are allowed:

| Risk | Meaning |
|---|---|
| Low | Minor documentation, consistency, or usability issue with limited operational impact. |
| Medium | Partial implementation, stale schema, missing validation, incomplete visibility logic, or reporting risk. |
| High | Missing required persistence, wrong list/column, incorrect status, broken read/write path, approval routing risk, or user-blocking defect. |
| Critical | Approval bypass, data loss, security exposure, production-blocking defect, or irreversible workflow/data corruption risk. |
| Unknown | Evidence is insufficient to score risk. |

Do not use alternate values such as `P1`, `Major`, `Minor`, `Severe`, or `N/A` in audit registers.

## Risk Scoring Rules

| Condition | Minimum Risk |
|---|---|
| New submission is marked approved/completed without evidence | Critical |
| Required source field is collected but not persisted | High |
| App writes to a SharePoint column not evidenced in schema | High |
| App reads from parent list while create writes child list | High |
| Approval routing user/email is not persisted | High |
| Production page uses sample/mock data | High |
| Required SharePoint schema is missing | Medium |
| Source and app validation conflict | Medium |
| Section visibility unknown for approver-only areas | Medium |
| Documentation conflict with no runtime impact | Low |
| Evidence missing for risk score | Unknown |

Increase severity when the issue affects multiple forms, security, approval routing, or migration data integrity.

When evidence supports more than one category, use the highest applicable risk value.

When a risk is `Unknown`, the item must also identify the missing evidence and whether human review is required.

## Risk Categories

| Category | Examples |
|---|---|
| Data Persistence | Missing write, wrong list, wrong column, JSON-only storage where structured columns are required. |
| Read Logic | Wrong hook/service, missing child join, stale status mapping, sample data. |
| Write Logic | Missing parent/child create, wrong status, failed patch handling. |
| Workflow | Missing approval stage, incorrect route, bypassed approval, wrong actor. |
| SharePoint Schema | Missing list, missing column, wrong type, wrong internal name. |
| Security and Access | Incorrect role visibility, user can approve own request when prohibited, exposed approver-only data. |
| Connector | Office 365 Users lookup failures, display-name-only routing, unresolved people fields. |
| Validation | Required field mismatch, conditional validation missing, invalid choice/date/person format. |
| UAT | Test path blocked, incomplete screen, static/mock data prevents real validation. |
| Documentation Conflict | Docs, mapping, source, and code disagree. |

## Risk Evidence Requirements

Each risk entry must include:

- Source:
- File path:
- Code/formula/section:
- What was found:
- Why it matters:
- Risk value:

Unknown risk must explain what evidence is missing.

## Approval Risk Rules

1. Do not assume approval is required.
2. Do not assume approval is not required.
3. If approval is Required and submit bypasses the first approval stage, risk is Critical.
4. If approval is Required and approver routing is missing, risk is High.
5. If approval is Conditional and the trigger is not implemented, risk is High.
6. If approval classification is Unknown and the form handles access, finance, security, identity, SAP, or infrastructure, risk is at least Medium until reviewed.
7. If approval classification is Unknown and missing evidence prevents assessment, use `Unknown` risk and a blocked status.

## SharePoint Risk Rules

1. Missing list evidence is at least Medium and may be High if writes depend on it.
2. Missing column evidence is High when the app writes to that column.
3. Wrong internal name is High when used for create, update, filter, or lookup.
4. Wrong field type is High when it can corrupt data or break writes.
5. Missing choice values are Medium unless they control workflow status, then High.
6. Person field shape mismatch is High when used for approval or security routing.

## Power Apps Logic Risk Rules

| Logic Area | High or Critical Signals |
|---|---|
| Read | Real submissions cannot appear in list/detail views. |
| Write | Required fields are lost or child records are not created. |
| Patch | Patch targets non-existent field or ignores failure. |
| SubmitForm | Submit starts wrong status or misses child record creation. |
| Collect/ClearCollect | Production data replaced by in-memory sample data. |
| Filter/LookUp | Wrong `FormCode`, wrong id, wrong person email, or non-existent internal name. |
| Office 365 Users | Routing uses display name instead of email or unresolved user. |

## Risk Status Relationship

| Risk | Typical Status |
|---|---|
| Low | Completed - Issues Found or Ready for Fix |
| Medium | Completed - Issues Found, Ready for Fix, or Blocked depending on evidence |
| High | Completed - Issues Found or Ready for Fix; blocked if schema/source is missing |
| Critical | Completed - Issues Found or blocked with immediate escalation |
| Unknown | Blocked or requires human review |

## Re-Scoring Rules

1. Re-score only when new evidence appears or a fix is verified.
2. Preserve the original risk in the finding history.
3. Document why the risk changed.
4. Do not downgrade risk because a fix is planned; downgrade only after verification.

## Escalation Rules

Escalate immediately in the finding summary when:

1. A Required approval path is bypassed.
2. A form writes to a non-evidenced SharePoint column.
3. A submitted record cannot be found from list/detail screens.
4. A person field used for routing stores only display name.
5. A production path uses sample data.
6. Source-required fields are lost on submit.
