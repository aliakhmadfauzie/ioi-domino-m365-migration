# Issue Log

> All active issues found during design, audit, or build.
> Seeded from Audit Report Section 3 (Issues Found).
> Never delete rows. Mark RESOLVED with date and resolution.
> Last updated: 2026-06-02

---

## Severity Labels
- `CRITICAL` — will cause runtime failure if not resolved before build
- `HIGH` — will produce wrong results; must resolve before testing
- `MEDIUM` — affects quality/completeness; resolve before UAT
- `LOW` — improvement or documentation; resolve before release

---

## Critical Issues (Must resolve before any build)

| ID | Area | Issue | Evidence | Severity | Status | Owner | Target Date | Resolution |
|---|---|---|---|---|---|---|---|---|
| I-01 | SP Data | Site value "Penang" is wrong. Correct SP EntitySite value for Penang factory is "Prai". Johor = "Johor". All formulas using "Penang" would return 0 records. | `main-dbfin-model.ts` SiteKey0='Prai', `main-dbhr-service.ts` SITE_KEY_TO_LABEL | CRITICAL | OPEN — corrected in data model doc and all formula files | — | Before build | Replace all "Penang" with "Prai" in Canvas formulas |
| I-02 | SP Data | Status field uses label text ("Draft", "Submitted"), NOT key codes. Canvas Filter must use `Status.Value = "Draft"` not `statusKey = "StatusKey0"`. | `main-dbhr-service.ts` `toSharePointWrite` converts statusKey → label on write | CRITICAL | OPEN — corrected in all formula files | — | Before build | Use label values in all Filter and Patch formulas |
| I-03 | SP Workflow | CA field does not exist as a SP routing field. Actual routing uses CurrentStage + CurrentApprover_Email + CurrentApproverGroup. | `main-dbfin-model.ts` and `main-dbhr-model.ts` both define all three | CRITICAL | OPEN — corrected in workflow and formula files | — | Before build | Use three-field routing pattern in all workflow Patch formulas |
| I-04 | SP Data | WorkflowHistory (single list) does not exist. Actual history is in per-dept lists: ApprovalHistory_HR, ApprovalHistory_QA, ApprovalHistory_STR, ApprovalHistory_SHE. | Generated model files: ApprovalHistory_HRModel.ts, ApprovalHistory_QAModel.ts, etc. | CRITICAL | OPEN — corrected in formula and data source files | — | Before build | Register each ApprovalHistory_ list as separate data source; use If/Switch to select correct list |
| I-05 | SP Config | AppConfig_Roles does not need to be created. Config_GlobalUserRoleAssignments already exists with confirmed schema. | `Config_GlobalUserRoleAssignmentsModel.ts` | CRITICAL | OPEN — corrected in App.OnStart formula and role matrix files | — | Before build | Use Config_GlobalUserRoleAssignments; do NOT provision AppConfig_Roles |
| I-06 | Field Mapping | All SP internal column names in Section 9 field mapping are PDF-extracted labels, not confirmed SP REST names. Using them in Patch would write to non-existent columns. | MASTER_FIELD_DICTIONARY uses PDF labels; SP REST names confirmed only from model files and service | CRITICAL | OPEN — all field mapping marked UNVERIFIED or CONFLICT | — | Before building each form | Verify each form's column names from generated model files + live SP before Patch formulas |

---

## High Issues

| ID | Area | Issue | Severity | Status | Owner | Resolution |
|---|---|---|---|---|---|---|
| I-07 | SP Data | FIN Department field uses key codes (DepartmentKey03) not plain text. Canvas filters for FIN dept must use key codes. | HIGH | OPEN | — | Confirm from FIN service file; update FIN filter formulas |
| I-08 | TSX Reference | Production forms page contains 60+ mock/invented form codes (SAM-*, TPM-002+, etc.) not in master register. Must not be built. | HIGH | DOCUMENTED | — | See `01-source-reference/domino-source-index.md` mock form list |
| I-09 | SP Data | Child row storage is mixed. AWHR uses JSON string; other forms use separate SP child lists. cmpRelatedChildItems must support both patterns. | HIGH | OPEN | — | Add propStoragePattern to cmpRelatedChildItems |
| I-10 | TSX Completeness | Design report missed: pages/reports.tsx, pages/quick-form.tsx, pages/governance/, pages/mtr/, pages/admin/panels/ (8 sub-panels). These may represent additional Canvas screen requirements. | MEDIUM | OPEN | — | Read missed pages; confirm whether they require additional Canvas screens |
| I-11 | SP Config | AppConfig_FormRules, AppConfig_WorkflowRules proposed as new lists. Existing Config_ApproverMatrix, Config_Departments, Config_Companies, HR_RoutingMatrix may fully cover these needs. | MEDIUM | OPEN | — | Read all existing Config_ list schemas before provisioning new ones |
| I-12 | SP Data | MainDB_IT may have two instances: MainDB_IT (Johor) and MainDB_IT (PRAI) — IT forms module references "MainDB_IT (PRAI)". | MEDIUM | OPEN | — | Confirm with IT admin whether one or two MainDB_IT lists exist |
| I-13 | SP Data | FormCode column casing: MainDB_HR confirms `FormCode` (PascalCase); MainDB_IT confirms `formcode` (lowercase). Other lists unknown. | MEDIUM | OPEN | — | Verify exact casing per list before adding as data source |
| I-14 | Workflow | CAR is a 4-stage approval (HOD → FIN Manager → COO → ED), not the generic 2-3 stage. Design report did not capture this detail. | MEDIUM | DOCUMENTED | — | 4-stage pattern documented in workflow-state-matrix.md |

---

## Medium Issues

| ID | Area | Issue | Severity | Status | Owner | Resolution |
|---|---|---|---|---|---|---|
| I-15 | TSX Reference | Service files (main-dbhr-service.ts, workflow-orchestration-service.ts etc.) not in original design report sources. These are the most authoritative source of SP column names. | MEDIUM | RESOLVED | — | All service files read and confirmed in corrected data model document |
| I-16 | Components | cmpStatusBadge must map statusKey values to display labels and colors. Original design used plain text that happened to match label text, but mapping must be explicit. | MEDIUM | DOCUMENTED | — | fxStatusColor and fxStatusLabel named formulas added to named-formulas.md |
| I-17 | Workflow | AWHR has a 3-stage HOS→HOD→HR workflow, not the generic HOD→COO→Director. Each form defines its own stage names. Generic workflow matrix is a template only. | LOW | DOCUMENTED | — | AWHR confirmed stages documented in workflow-state-matrix.md |
| I-18 | TSX | Governance pages (pages/governance/) not mapped to Canvas screens. | LOW | OPEN | — | Read governance pages and map to existing screens or flag as new |
| I-19 | TSX | Admin area is significantly more complex (8 sub-panels) than original design's scrAdminConfig with 3 components. | LOW | OPEN | — | Expand scrAdminConfig design when admin scope is confirmed |
