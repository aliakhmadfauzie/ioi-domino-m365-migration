# AUD-042 MPSPRN Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-042 |
| Form Code | MPSPRN |
| Form Name | MPS Printer Request |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Blocked - Missing Source |
| Approval Classification | Unknown |
| Risk | Unknown |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: MPSPRN row
- What was found: MPSPRN approval classification is Unknown with limited evidence.
- Why it matters: Approval cannot be assumed.

- Source: Batch development plan
- File path: `docs/09_BATCH_DEVELOPMENT_PLAN.md`
- Code/formula/section: Batch 10
- What was found: MPSPRN is listed as MPS Printer Request with pending status.
- Why it matters: Project planning recognizes the item, but does not provide source details.

- Source: Source discovery/register
- File path: `audit/01_register/FORM_INVENTORY.md`
- Code/formula/section: AUD-042 row
- What was found: MPSPRN is a page-only candidate with unknown source and unknown SharePoint lists.
- Why it matters: Original source and schema evidence are missing.

## 3. App Files Reviewed

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/mpsprn/new.tsx`
- Code/formula/section: Submit handler
- What was found: The page creates MainDB_IT with `formcode: 'MPSPRN'`, draft status `CurrentstatusKey0`, submit status `CurrentstatusKey3`, and remarks text.
- Why it matters: Status usage appears reversed or unconfirmed because generated labels map Key0 to Active and Key3 to Draft.

- Source: Repository route evidence
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/mpsprn/`
- Code/formula/section: Route files
- What was found: Only `new.tsx` was found; no list/detail route was found.
- Why it matters: Submitted records do not have a proven review path.

## 4. UI/Form Fields

No original Domino/PDF source fields were confirmed for MPSPRN.

## 5. SharePoint Field Mapping

Only MainDB_IT parent record writes were proven. No MPSPRN-specific schema/list evidence was found.

## 6. Read Logic

No MPSPRN read/list/detail implementation was found.

## 7. Write Logic

MPSPRN writes parent MainDB_IT with remarks text and unconfirmed status values.

## 8. Validation Rules

The new page validates required fields and IP address format.

## 9. Section Visibility Rules

Visibility is pending audit in documentation.

## 10. Approval Workflow

Approval is Unknown.

## 11. Draft/Save/Submit/Edit/View Behavior

New and draft submit behavior exists. View/read behavior is missing.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-MPSPRN-001 | Unknown | Blocked - Missing Source | No original source evidence was confirmed for MPSPRN. |
| AUD-B003-MPSPRN-002 | High | Blocked - Missing App File | MPSPRN has a new page but no list/detail read implementation was found. |
| AUD-B003-MPSPRN-003 | High | Ready for Fix | Draft/submit status keys appear unconfirmed: draft uses Active and submit uses Draft. |

## 13. Risk Assessment

Risk is Unknown for business behavior because source is missing. Implementation risk is High because read path and status mapping are unsafe.

## 14. Final Decision

Blocked - Missing Source. MPSPRN needs source evidence and route completion before further audit.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | No |
| App evidence found | Partial |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

