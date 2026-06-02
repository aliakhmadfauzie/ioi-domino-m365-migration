# AUD-026 SVRREC Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-026 |
| Form Code | SVRREC |
| Form Name | Server Record / RCA |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Completed - Issues Found |
| Approval Classification | Unknown |
| Risk | High |

## 2. Source Evidence

- Source: Source mapping
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: SVRREC notes
- What was found: `SVRREC.json` maps possibly to IAL/DataRestorationV1 and server record/RCA.
- Why it matters: The source relation is possible but still requires confirmation.

- Source: Central form reference
- File path: `docs/central-form-reference.md`
- Code/formula/section: SVRREC sections
- What was found: SVRREC has Record Header, Analysis, and Personnel sections.
- Why it matters: Schema evidence exists for a record/RCA form.

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: Server record rows
- What was found: SVRREBOOT is listed as Not Required; SVRREC is not separately classified in the visible workflow table.
- Why it matters: Approval classification for SVRREC remains Unknown.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/srvr/new.tsx`
- Code/formula/section: Dynamic renderer call
- What was found: SRVR new page renders `IAL4`.
- Why it matters: New records may use IAL4, not SVRREC.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/srvr/index.tsx`
- Code/formula/section: MainDB_IT list filter
- What was found: SRVR list reads records where `formcode eq 'SVRREC'`.
- Why it matters: New and list paths use different form codes.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/srvr/[id].tsx`
- Code/formula/section: Detail record lookup
- What was found: Detail lookup checks `s.formcode === 'SRVR'`.
- Why it matters: Detail lookup conflicts with the list filter `SVRREC`.

## 4. UI/Form Fields

SVRREC schema fields are documented, but source mapping to IAL variants remains uncertain.

## 5. SharePoint Field Mapping

MainDB_IT parent evidence exists, but FormCode inconsistency across new/list/detail prevents reliable mapping.

## 6. Read Logic

List reads SVRREC. Detail reads SRVR. This is internally inconsistent.

## 7. Write Logic

New page uses IAL4 through the shared dynamic renderer.

## 8. Validation Rules

Dynamic visible-required validation applies through the shared renderer.

## 9. Section Visibility Rules

SVRREC visibility is documented as always visible in schema reference, but source-to-app routing remains unresolved.

## 10. Approval Workflow

Approval is Unknown because SVRREC is not separately evidenced in the workflow rules table.

## 11. Draft/Save/Submit/Edit/View Behavior

New/list/detail behavior exists but uses three different identifiers: IAL4, SVRREC, and SRVR.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-SVRREC-001 | High | Ready for Fix | SRVR new/list/detail paths use conflicting form codes: IAL4, SVRREC, and SRVR. |
| AUD-B003-SVRREC-002 | Unknown | Blocked - Ambiguous Requirement | SVRREC source and approval classification require confirmation. |

## 13. Risk Assessment

Risk is High because create, list, and detail paths can disagree and make records unrecoverable from the expected screen.

## 14. Final Decision

Completed - Issues Found. Form-code alignment and source confirmation are required.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Possible Match |
| App evidence found | Yes |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

