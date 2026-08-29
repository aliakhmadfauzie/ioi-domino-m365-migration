# AUD-025 SVRREBOOT Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-025 |
| Form Code | SVRREBOOT |
| Form Name | Server Reboot |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: SVRREBOOT row
- What was found: SVRREBOOT is classified as No Approval Required and marked as a legacy custom component.
- Why it matters: Approval should not be invented.

- Source: Source mapping
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: SVRREBOOT notes
- What was found: `SVRREBOOT.json` maps possibly to IAL/DataRestorationV1 and server reboot.
- Why it matters: The source relation is possible but not fully confirmed.

- Source: Central form reference
- File path: `docs/central-form-reference.md`
- Code/formula/section: SVRREBOOT inventory row
- What was found: SVRREBOOT is marked legacy and not rendered via DynamicForm; SRL/IAL1 uses a custom page component.
- Why it matters: The app route and schema naming are not the same surface.

## 3. App Files Reviewed

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/srl/new.tsx`
- Code/formula/section: Dynamic renderer call
- What was found: The SRL new page renders the `IAL1` form configuration.
- Why it matters: New records may use IAL1 as FormCode, not SVRREBOOT.

- Source: App implementation
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/srl/index.tsx`
- Code/formula/section: MainDB_IT list filter
- What was found: The SRL list reads records where `formcode eq 'SVRREBOOT'`.
- Why it matters: New and list paths use different form codes.

## 4. UI/Form Fields

SVRREBOOT schema describes reboot event fields. Source PDF relationship is possible through IAL1, not a direct filename match.

## 5. SharePoint Field Mapping

Only MainDB_IT parent read/write evidence was proven. The form-code mismatch prevents reliable mapping.

## 6. Read Logic

The list reads `SVRREBOOT` parent records and parses remarks.

## 7. Write Logic

The new page uses IAL1 through the shared dynamic renderer.

## 8. Validation Rules

Dynamic visible-required validation applies, but source mapping is not fully confirmed.

## 9. Section Visibility Rules

Visibility is marked legacy/custom and pending in documentation.

## 10. Approval Workflow

Approval is Not Required.

## 11. Draft/Save/Submit/Edit/View Behavior

New/list behavior exists, but form-code mismatch can prevent submitted records from appearing in the intended list.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-SVRREBOOT-001 | High | Ready for Fix | SRL new page renders IAL1 while SRL list reads SVRREBOOT records. |
| AUD-B003-SVRREBOOT-002 | Unknown | Blocked - Ambiguous Requirement | SVRREBOOT source mapping to IAL1/DataRestorationV1 requires confirmation. |

## 13. Risk Assessment

Risk is High because real submissions may not appear in the matching list due to FormCode mismatch.

## 14. Final Decision

Completed - Issues Found. The item needs form-code and source mapping correction before build readiness.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Possible Match |
| App evidence found | Yes |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

