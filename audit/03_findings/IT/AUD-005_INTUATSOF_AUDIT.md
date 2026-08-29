# AUD-005 INTUATSOF Audit

## 1. Basic Information

| Field | Value |
|---|---|
| Audit ID | AUD-005 |
| Form Code | INTUATSOF |
| Form Name | IntuatSOF |
| Department | IT |
| Batch | 003 |
| Audit Date | 2026-06-01 |
| Final Status | Blocked - Ambiguous Requirement |
| Approval Classification | Unknown |
| Risk | Unknown |

## 2. Source Evidence

- Source: Workflow rules documentation
- File path: `docs/04_WORKFLOW_APPROVAL_RULES.md`
- Code/formula/section: INTUATSOF row
- What was found: INTUATSOF approval classification is Unknown with limited evidence and needs business confirmation.
- Why it matters: Approval cannot be assumed.

- Source: Source analysis
- File path: `analysis/all-forms-source-analysis.md`
- Code/formula/section: SAPSOF mapping rows
- What was found: INTUATSOF maps into the SAPSOF source family with 385+ fields and partial analysis.
- Why it matters: The source relationship is complex and shared with SILOUATSOF/SAPSOF2.

- Source: Central form reference
- File path: `docs/central-form-reference.md`
- Code/formula/section: INTUATSOF sections
- What was found: INTUATSOF has key-user and BPO sign-off sections encoded in schema documentation.
- Why it matters: Schema evidence suggests workflow sections, but the business classification remains Unknown.

## 3. App Files Reviewed

- Source: Repository route evidence
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/`
- Code/formula/section: Directory listing
- What was found: No dedicated `intuatsof` route directory was found.
- Why it matters: The app file for a direct INTUATSOF implementation is missing.

- Source: Dynamic route fallback
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/[formCode]/new.tsx`
- Code/formula/section: `getFormByCode(formCode)`
- What was found: A dynamic fallback can render configured forms if `getFormByCode` returns a config.
- Why it matters: The audit did not prove INTUATSOF is available through active app navigation or a dedicated implementation.

## 4. UI/Form Fields

The schema contains sign-off sections, but SAPSOF source analysis is partial and shared. Field-level mapping cannot be finalized for INTUATSOF without deciding whether it is distinct from SAPSOF2/SILOUATSOF.

## 5. SharePoint Field Mapping

Generated SAPSOF fields exist in MainDB_IT and Ext_SAP evidence, but no INTUATSOF-specific write/read path was proven.

## 6. Read Logic

No dedicated INTUATSOF list/detail read path was found.

## 7. Write Logic

No dedicated INTUATSOF write path was found.

## 8. Validation Rules

Schema-required fields exist in documentation, but runtime validation could not be verified for a dedicated INTUATSOF page.

## 9. Section Visibility Rules

Section visibility is pending audit in `docs/05_SECTION_VISIBILITY_RULES.md`.

## 10. Approval Workflow

Approval is Unknown. Schema sections suggest sign-off, but workflow rules require business confirmation.

## 11. Draft/Save/Submit/Edit/View Behavior

No dedicated INTUATSOF behavior was proven.

## 12. Issues Found

| Issue ID | Risk | Status | Description |
|---|---|---|---|
| AUD-B003-INTUATSOF-001 | Unknown | Blocked - Ambiguous Requirement | INTUATSOF shares SAPSOF source evidence with SILOUATSOF/SAPSOF2 and lacks a confirmed independent requirement. |
| AUD-B003-INTUATSOF-002 | High | Blocked - Missing App File | No dedicated INTUATSOF route/read/write implementation was found. |

## 13. Risk Assessment

Risk is Unknown because the requirement identity and approval classification are unresolved. Missing app implementation would be High if INTUATSOF remains in scope as a separate form.

## 14. Final Decision

Blocked - Ambiguous Requirement. Human confirmation is needed to decide whether INTUATSOF is separate, superseded, or implemented through SAPSOF2.

## 15. Quality Checklist

| Check | Result |
|---|---|
| Source evidence found | Partial |
| App evidence found | Missing dedicated route |
| SharePoint/list evidence found | Partial |
| Approval classification is strict | Yes |
| Unresolved issues added to backlog | Yes |

