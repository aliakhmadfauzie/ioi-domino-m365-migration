# AUD-027 TRNMAN Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-027 |
| Form Code | TRNMAN |
| Form Name | Training Manuals |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Blocked - Missing Source |
| Approval Classification | Not Required |
| Risk | High |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: TRNMAN row
- What was found: TRNMAN is classified as No Approval Required and described as document management.
- Why it matters: Approval should not be invented.

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: Unmapped schema notes
- What was found: `TRNMAN.json` / `trnman/` has no clear original source match and may be related to ITP.
- Why it matters: Original source evidence is missing or ambiguous.

- Source: Central form reference
- File path: `docs/central-form-reference.md`
- Code/formula/section: TRNMAN section and validation tables
- What was found: TRNMAN schema sections and required fields are documented.
- Why it matters: App schema evidence exists, but it is not original Domino/PDF source evidence.

## 3. App Files Reviewed

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/trnman/new.tsx`
- Code/formula/section: Submit handler
- What was found: TRNMAN validates required fields and creates MainDB_IT with `formcode: 'TRNMAN'`, `currentStatus: 'CurrentstatusKey1'`, and JSON remarks.
- Why it matters: `CurrentstatusKey1` maps to Approved even though approval is Not Required.

- Source: App implementation
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/trnman/index.tsx`
- Code/formula/section: MainDB_IT list filter
- What was found: TRNMAN list reads `formcode eq 'TRNMAN'` and parses remarks.
- Why it matters: Read/write path exists, but structured field mapping is remarks-only.

## 4. UI/Form Fields

TRNMAN fields are documented from schema, including training type, title, version, owner, and content. No direct original PDF/DXL source was confirmed.

## 5. SharePoint Field Mapping

Only parent MainDB_IT write/read evidence was proven. No extension list or live schema mapping for TRNMAN-specific columns was confirmed.

## 6. Read Logic

TRNMAN reads MainDB_IT parent records by form code and parses `remarks`.

## 7. Write Logic

TRNMAN writes parent MainDB_IT and stores form details in `remarks` JSON.

## 8. Validation Rules

Required validation exists in `trnman/new.tsx` for training type, title, version, date, revision, owner, and comments.

## 9. Section Visibility Rules

Visibility is pending audit in `docs/05_SECTION_VISIBILITY_RULES.md`.

## 10. Approval Workflow

Approval is Not Required based on the workflow rules document.

## 11. Draft/Save/Submit/Edit/View Behavior

New and list behavior exist. Detail/edit behavior was not proven.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-TRNMAN-001 | Unknown | Blocked - Missing Source | No direct original Domino/PDF source match was confirmed for TRNMAN. |
| AUD-B003-TRNMAN-002 | High | Ready for Fix | TRNMAN submit uses `CurrentstatusKey1`, which maps to Approved, and stores fields only in remarks JSON. |

## 13. Risk Assessment

Risk is High because the app creates records with an approval label and lacks source-backed structured mapping. Source identity remains blocked.

## 14. Final Decision

Blocked - Missing Source. The app can be reviewed, but source requirements must be confirmed before build readiness.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Missing original source |
| App evidence found | Yes |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

