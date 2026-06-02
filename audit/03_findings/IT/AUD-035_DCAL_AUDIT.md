# AUD-035 - DCAL Audit

## 1. Basic Information

| Item | Detail |
|---|---|
| Audit ID | AUD-035 |
| Form Code | DCAL |
| Form Name | DCAL Page Route |
| Department | IT |
| Approval Classification | Unknown |
| Audit Status | Blocked - Ambiguous Requirement |
| Risk | Unknown |
| Last Reviewed | 2026-06-01 |

## 2. Source Evidence

- Source: Repository source discovery and register evidence
- File path: Related to AUD-001 DCALOG only by naming/register relationship
- Code/formula/section: Source relationship recorded for DCAL
- What was found: DCAL page route appears related to DCALOG, which is already blocked because source matching is unclear.
- Why it matters: The audit cannot confirm final field, workflow, or build readiness without this source relationship being resolved.

## 3. App Files Reviewed

| File path | Purpose Reviewed | Evidence Result |
|---|---|---|
| `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx` | App route or implementation evidence | Reviewed as available from repository file discovery; unresolved where listed as Unknown. |

## 4. UI/Form Fields

| Field/Section | Source Evidence | App Evidence | Status |
|---|---|---|---|
| Form fields | Related to AUD-001 DCALOG only by naming/register relationship | `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx` | Unknown until source-to-app mapping is confirmed. |

## 5. SharePoint Field Mapping

| App/source field | SharePoint list | Column display/internal name | Evidence | Mapping status |
|---|---|---|---|---|
| Form fields | Unknown | Unknown | Register/schema evidence only; no per-field mapping confirmed in this item audit. | Mapping Incomplete |

Notes:

- No SharePoint columns were invented.
- If a schema is named, it is evidence that a list schema exists, not proof that every app field is correctly mapped.

## 6. Read Logic

- Source: App route/source discovery
- File path: `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx`
- Code/formula/section: Route/read evidence for DCAL
- What was found: Read logic is not fully verified for this audit item because source or ownership is unresolved.
- Why it matters: A form cannot be Ready for Build when list/detail read behavior is not tied to a confirmed source and SharePoint mapping.

## 7. Write Logic

- Source: App route/source discovery
- File path: `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx`
- Code/formula/section: Submit/write evidence for DCAL
- What was found: Write logic is not fully verified for this audit item because source, app ownership, or SharePoint mapping is unresolved.
- Why it matters: Submitted data could be saved under the wrong form code, omitted from structured columns, or blocked entirely if the route is only a placeholder.

## 8. Validation Rules

| Rule | Evidence | Status |
|---|---|---|
| Required fields | Related to AUD-001 DCALOG only by naming/register relationship | Unknown |
| Choice/person/date validation | Related to AUD-001 DCALOG only by naming/register relationship | Unknown |

## 9. Section Visibility Rules

| Section | Visibility/editability rule | Evidence | Status |
|---|---|---|---|
| Form sections | Unknown | Related to AUD-001 DCALOG only by naming/register relationship | Unknown |

## 10. Approval Workflow

| Approval Classification | Trigger/condition | Evidence | Status |
|---|---|---|---|
| Unknown | Unknown unless explicitly listed in source evidence | Related to AUD-001 DCALOG only by naming/register relationship | Blocked - Ambiguous Requirement |

## 11. Draft/Save/Submit/Edit/View Behavior

| Behavior | Evidence | Status |
|---|---|---|
| Draft | Not confirmed for this item | Unknown |
| Save | Not confirmed for this item | Unknown |
| Submit | Not confirmed for this item | Unknown |
| Edit | Not confirmed for this item | Unknown |
| View | Not confirmed for this item | Unknown |

## 12. Issues Found

### AUD-B004-DCAL-001 - DCAL and DCALOG relationship unresolved

- Source: Audit evidence review
- File path: Related to AUD-001 DCALOG only by naming/register relationship; `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx`
- Code/formula/section: Source/app/SharePoint mapping for DCAL
- What was found: DCAL page route appears related to DCALOG, which is already blocked because source matching is unclear.
- Why it matters: DCAL and DCALOG relationship unresolved blocks a reliable build decision and requires human decision or missing evidence before fix/build work.


## 12a. Fix Backlog Reference

| Fix ID | Issue ID | Priority | Severity | Status |
|---|---|---|---|---|
| FIX-075 | AUD-B004-DCAL-001 | P4 - Documentation or minor cleanup | Unknown | Open |

## 13. Risk Assessment

Risk: Unknown

Risk justification:

- Evidence: Related to AUD-001 DCALOG only by naming/register relationship; `src/pages/it/forms/dcal/index.tsx`; `src/pages/it/forms/dcal/new.tsx`; Unknown
- Impact: Audit cannot confirm source parity, SharePoint mapping, or workflow behavior for DCAL.
- Recommended disposition: Resolve DCAL and DCALOG relationship unresolved, then re-audit this item.

## 14. Final Decision

Status: Blocked - Ambiguous Requirement

Ready for Build: No

Final notes: Finding created to close the Not Started audit state without assuming workflow or field mapping.

## 15. Quality Checklist

| Check | Result | Notes |
|---|---|---|
| Finding has source evidence | Yes | Source/register evidence cited above. |
| Finding has app evidence | Yes | App route or missing app evidence cited above. |
| Finding has SharePoint/list evidence | Yes | List/schema status cited as known or Unknown. |
| Approval classification is strict | Yes | Uses Unknown. |
| No SharePoint fields invented | Yes | Unknown fields remain Unknown. |
| Unresolved issues added to backlog | Yes | FIX-075. |
| Register row updated | Yes | Updated in master and form inventory. |

