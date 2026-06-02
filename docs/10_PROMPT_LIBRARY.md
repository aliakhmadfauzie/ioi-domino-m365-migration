# Prompt Library — Domino → M365 Migration

> **Purpose**: Reusable prompts for Codex/GitHub Copilot to perform consistent audit, review, and fix tasks.
> **Usage**: Copy the prompt block, fill in the bracketed placeholders, and submit.

---

## Prompt 1: Repository Discovery

```
Read the full repository at [REPO_PATH].

Do not update any file.

Identify all existing documentation, Power Apps source files, SharePoint schema files, workflow files, prompt files, and audit reports.

Before creating anything, check whether equivalent files already exist.

Output:
- Existing files (with path and purpose)
- Missing files (based on required documentation structure)
- Duplicate files (same content, different location)
- Conflicting files (contradictory content)
- Recommended update plan (what to create, update, merge, or delete)

Do not modify files yet.
```

---

## Prompt 2: Form Audit

```
Audit the selected forms: [FORM_CODES, comma-separated, e.g., EAF,ITSSR,HI]

Do not update files.

For each form, identify:
- Form name, department, source file, screen file
- SharePoint list(s) used
- Fields read and fields written
- Required fields and validation logic
- Approval classification (Approval Required / No Approval Required / Unknown)
- Section visibility rules (role, status, field dependencies)
- Status values (Draft, Submitted, Approved, Rejected, Completed, etc.)
- Submit behavior, draft behavior, edit behavior, attachment behavior
- Missing schema, missing SharePoint columns
- Risks

Do not assume approval is required. Classify every form using evidence only.

Use these sources in priority order:
1. Actual SharePoint list schema
2. Power Apps source code (pages, hooks, services, form-schemas)
3. `mapping/field-mapping.csv`
4. `analysis/workflow-analysis.md`
5. `ioicodeapp/IT_Routing_Rules_Documentation.md`
6. Source DXL and PDF evidence

Output using the audit format from `docs/08_AUDIT_TEMPLATE.md`.
```

---

## Prompt 3: SharePoint Integration Audit

```
Audit SharePoint usage in the selected forms: [FORM_CODES]

Do not update files.

For every data source reference, check:
- List name (display name and internal name)
- Column display name, internal name, and field type
- Required vs optional flags
- Choice values, person fields, lookup fields, date fields
- Yes/No boolean handling, attachment handling
- Patch formulas, SubmitForm usage
- Read formulas (LookUp, Filter, generated hooks/services)
- Error handling and delegation risk
- Parent-child list relationships
- Whether the column actually exists in the SharePoint list

Source priority:
1. Live SharePoint list schema export (PnP PowerShell)
2. `power.config.json` connection references
3. `src/generated/models/` and `src/generated/services/`
4. `mapping/field-mapping.csv`
5. Actual page/hook code

For every mismatch, output:
- File, line, current reference, expected reference, risk level, fix recommendation

Output using the audit format from `docs/08_AUDIT_TEMPLATE.md`.
```

---

## Prompt 4: Approval Logic Discovery

```
Review the selected forms and determine whether each form requires approval.

Do not assume. Use evidence only.

Check these sources for each form:
- Source code: Submit handlers, status transitions, role checks, button visibility
- Source PDF/DXL: Section access formulas, action buttons, agent code
- Documentation: `ioicodeapp/IT_Routing_Rules_Documentation.md`
- SharePoint schema: Status columns, approver columns, workflow stage columns
- `analysis/workflow-analysis.md`
- `docs/central-form-reference.md`

Classify each form as:
- **Approval Required** — Evidence of multi-stage approval with approver roles
- **No Approval Required** — Simple submit→complete workflow, no approver fields
- **Unknown** — Insufficient evidence to determine

For each form, document:
| Field | Detail |
|-------|--------|
| Form name | |
| Department | |
| Approval classification | Approval Required / No Approval Required / Unknown |
| Evidence | Source file:line or document |
| Status values | Draft, Submitted, Approved, Rejected, Completed, etc. |
| Submit behavior | What happens when user submits |
| Draft behavior | How draft is saved |
| Edit behavior | Who can edit and when |
| Approval actor | Who approves, if applicable |
| Section visibility | Which sections show by role/status |
| Missing confirmation | What is unclear |

For Unknown forms, list exactly what confirmation is needed.
```

---

## Prompt 5: Section Visibility Audit

```
Audit section visibility for the selected forms: [FORM_CODES]

Do not update files.

For every form section, identify:
- Section name
- Visible condition (role, status, field value)
- Editable condition
- Role dependency (submitter, approver, admin, specific group)
- Status dependency (Draft, Submitted, Approved, etc.)
- Field dependency
- Evidence source (code file:line, schema, documentation)
- Issue (missing logic, unreachable condition, etc.)

Sources to check:
1. Form schema JSON (`src/form-schemas/[FORMCODE].json`) — section definitions
2. Page code (`src/pages/it/forms/[formcode]/new.tsx`, `[id].tsx`)
3. Hook logic (`src/hooks/use-dynamic-form.ts`, `use-approval-workflow.ts`)
4. Workflow config (`src/config/workflow-routing.ts`, `module-workflows.ts`)
5. Domino routing rules (`ioicodeapp/IT_Routing_Rules_Documentation.md`)

For each section where visibility logic is unclear, document:
"Section visibility: UNKNOWN — source confirmation required"

Use this table:
| Form | Section | Visible To | Visible When | Editable? | Evidence | Issue |
|---|---|---|---|---|---|---|
```

---

## Prompt 6: Power Fx / TypeScript Formula Review

```
Review the data access and workflow logic in the selected files: [FILE_PATHS]

Do not update files.

Check every data operation for:
- Correct SharePoint list name
- Correct column internal name
- Correct field type usage (Person, Choice, Date, Lookup, Boolean)
- Delegation-safe patterns
- Error handling (try/catch, error boundaries)
- Correct status transitions
- Correct user role checks
- Correct form mode (New/Edit/View)
- Any mock data still in use
- Any hardcoded values that should come from SharePoint
- Logic that does not match documentation

For each issue found, document:
| File | Function/Property | Purpose | Data Source | Risk | Issue | Recommended Fix | Test Step |
|---|---|---|---|---|---|---|---|
```

---

## Prompt 7: Fix Approved Issues

```
Proceed only with the approved issues below.

Approved issues:
[PASTE APPROVED ISSUES HERE]

Rules:
- Update only files required for approved issues.
- Do not refactor unrelated code.
- Do not rename controls unless required.
- Do not change UI layout unless required.
- Do not add approval logic unless confirmed.
- Do not invent SharePoint columns.
- Do not invent workflow logic.
- Preserve existing working behavior.
- Update documentation if behavior changes.

After updating, output:
- Files changed (path, line range, what changed)
- Reason for each change
- Risk level of each change (Low / Medium / High)
- Test steps to verify each change
- Rollback note (how to undo if needed)
```

---

## Prompt 8: Batch Development

```
Work on the next batch of 3 forms only: [FORM_CODES]

Do not touch other forms unless required.

For each form:
1. Audit existing code (pages, hooks, services, form-schemas)
2. Verify SharePoint mapping (list, columns, types)
3. Verify approval classification (Approval Required / No Approval Required / Unknown)
4. Verify section visibility rules (per role and status)
5. Verify field validation
6. Identify issues (missing columns, wrong types, missing logic)
7. Recommend fixes

Do not modify files until findings are approved.

Reference the batch plan in `docs/09_BATCH_DEVELOPMENT_PLAN.md`.

Output using the audit format from `docs/08_AUDIT_TEMPLATE.md`.
```

---

## Prompt 9: Test Generation

```
Generate test cases for the selected forms: [FORM_CODES]

Include:
- Draft save test
- Submit test
- Required field validation test (submit with empty required fields)
- SharePoint write verification (check record created in correct list)
- SharePoint read verification (check record appears in submissions view)
- Approval test (if approval is required — submitter→approver→status change)
- No-approval submit test (if approval is not required — direct completion)
- Section visibility test (verify sections show/hide per role and status)
- Role-based access test (submitter sees different UI than approver)
- Edit mode test (draft editable, submitted not editable by submitter)
- Attachment test (if applicable)
- Error handling test (submit with invalid data, network error)
- Regression test (existing forms still work)

Output as a checklist with checkboxes:
- [ ] TC-01: [Test name] — [Expected result]
```

---

## Prompt 10: Documentation Update

```
Update documentation only for the approved changes below.

Approved changes:
[PASTE APPROVED CHANGES]

Before updating:
- Check existing documents for equivalent content (avoid duplicates)
- Preserve useful existing content
- Update only affected sections
- Do not rewrite unrelated sections

Documents to consider (check all that might be affected):
- `docs/central-form-reference.md`
- `docs/migration-documentation.md`
- `docs/implementation-plan.md`
- `docs/change-log.md`
- `docs/risks-assumptions-questions.md`
- `mapping/field-mapping.md` / `mapping/field-mapping.csv`
- `m365-design/sharepoint-list-design.md`
- `analysis/evidence-reconciliation.md`

After updating, output:
- Documents changed (path)
- Sections changed (heading names)
- Reason for each change
- Remaining missing information (what still needs confirmation)
```

---

## Prompt Metadata

| # | Prompt Name | Modifies Files? | Requires Approval? | Typical Use |
|---|---|---|---|---|
| 1 | Repository Discovery | No | No | First run in any session |
| 2 | Form Audit | No | Yes — before fixes | Per-batch form review |
| 3 | SharePoint Integration Audit | No | Yes — before fixes | Verify column mappings |
| 4 | Approval Logic Discovery | No | Yes — before fixes | Classify workflow type |
| 5 | Section Visibility Audit | No | Yes — before fixes | Document visibility rules |
| 6 | Power Fx / TS Formula Review | No | Yes — before fixes | Find code issues |
| 7 | Fix Approved Issues | **Yes** | Yes — approve issues first | Apply fixes |
| 8 | Batch Development | No | Yes — before fixes | Next 3-form batch |
| 9 | Test Generation | No | No | Generate test checklist |
| 10 | Documentation Update | **Yes** | Yes — approve changes first | Sync docs after fixes |
