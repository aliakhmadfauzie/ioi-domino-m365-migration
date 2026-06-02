# Migration Status

> Last updated: 2026-06-03
> Project: IOI Acidchem / Pan-Century — HCL Domino to Microsoft Power Apps Canvas App

---

## Current Phase: DOCUMENTATION PREPARATION (Pre-Build)

**Active batch**: "Prepare Canvas App source-of-truth documentation before screen design/build."
**Next action**: Complete SP schema confirmation → Canvas App creation and data source connections

---

## Phase Status

| Phase | Description | Status | Date Completed | Notes |
|---|---|---|---|---|
| Phase 0 | Source analysis — 361 forms extracted from Domino PDFs | COMPLETE | 2026-06-02 | 22,074 fields extracted |
| Phase 1 | Canvas App Rebuild Design Report | COMPLETE | 2026-06-02 | 15 screens, 53 components, 12 phases |
| Phase 2 | Audit and Fact-Check Report | COMPLETE | 2026-06-02 | 19 issues found; 6 critical |
| Phase 3 | Corrected Canvas App Data Model and Formula Reference | COMPLETE | 2026-06-02 | Confirmed SP column names, status patterns, routing fields |
| Phase 4 | Canvas App folder structure setup | COMPLETE | 2026-06-02 | 13 folders, 51 files |
| Phase 4.5 | Canvas App source-of-truth documentation | IN PROGRESS | — | Populating from existing repo/docs: TSX index, traceability, SP inventory, field-to-control, workflow/role/approval matrices, screen inventory |
| Phase 5 | SP schema confirmation (6 critical blockers) | NOT STARTED | — | Blocker — must complete before any build |
| Phase 6 | Canvas App creation and data source connections | NOT STARTED | — | Blocked by Phase 5 |
| Phase 7 | Component build (53 components) | NOT STARTED | — | Blocked by Phase 6 |
| Phase 8 | Screen build (15 screens) | NOT STARTED | — | Blocked by Phase 7 |
| Phase 9 | Workflow wiring and testing | NOT STARTED | — | Blocked by Phase 8 |
| Phase 10 | UAT and go-live | NOT STARTED | — | Blocked by Phase 9 |

---

## Completed Setup

| Item | Status | Detail |
|---|---|---|
| Canvas App folder structure | ✅ COMPLETE | 13 folders (00-12), 51+ files |
| TSX Reference Index | ✅ COMPLETE | 100+ TSX files catalogued with Canvas mapping |
| Source Traceability Matrix | ✅ COMPLETE | Form→Domino→TSX→SP→Canvas traceability for pilot forms |
| SharePoint List Inventory | ✅ COMPLETE | ~20 MainDB_ lists + ~25 Ext_ lists + config/history lists confirmed |
| SharePoint Column Inventory | ✅ IN PROGRESS | Canonical header columns + IT/HR/FIN lists covered |
| Field-to-Control Matrix | ✅ IN PROGRESS | DRAFT mappings with SP internal names, Canvas controls |
| Workflow State Matrix | ✅ COMPLETE | Pattern A (HR/FIN 7-value StatusKey) + Pattern B (IT 60-value currentStatus) |
| Role Access Matrix | ✅ COMPLETE | RoleKey values MISSING_INFO — pending live SP confirmation |
| Approval Requirement Matrix | ✅ COMPLETE | 356 forms confirmed YES, 5 UNKNOWN |
| Screen Inventory | ✅ COMPLETE | 15 canonical screens with TSX references, SP dependencies |

---

## 6 Critical Blockers (Must Resolve Before Any Build)

| ID | Blocker | Owner | Status |
|---|---|---|---|
| B-01 | SharePoint site URLs for Johor and Prai sites not confirmed | IT Admin | OPEN |
| B-02 | SP internal column names for FormCode, Status, EntitySite, CurrentApprover_Email, CurrentStage not confirmed from live SP lists | SP Admin | OPEN |
| B-03 | `Config_GlobalUserRoleAssignments` — RoleKey values in live SP list not known | IT Admin | OPEN |
| B-04 | `Config_ApproverMatrix` — routing key pattern not confirmed | IT Admin | OPEN |
| B-05 | `ApprovalHistory_FIN`, `ApprovalHistory_IT`, `ApprovalHistory_QC` and other per-dept history lists — existence not confirmed | SP Admin | OPEN |
| B-06 | Form-specific SP column internal names (e.g. `awhrCompany`, `awhrHOS`) — Canvas REST API names not confirmed | SP Admin | OPEN |

---

## IT Department — Migration-Specific Status

The IT department has the most mature M365 migration artifacts:

| Artifact | Status | Location |
|---|---|---|
| 24 active form schemas (JSON) | ✅ COMPLETE | `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/form-schemas/` |
| SharePoint lists (MainDB_IT + 4 Ext_ lists) | ✅ PROVISIONED | IOI-App_Admin_Sites |
| Field mapping (465 fields across 28 forms) | ✅ COMPLETE | `mapping/field-mapping.csv`, `mapping/field-mapping.md` |
| Workflow approval rules per form | ✅ COMPLETE | `docs/04_WORKFLOW_APPROVAL_RULES.md` |
| Section visibility rules per form | ✅ COMPLETE | `docs/05_SECTION_VISIBILITY_RULES.md` |
| Code-first TSX app (reference) | ✅ BUILT | `ioicodeapp/powerapps-mirror/apps/ioi-platform/` |
| Canvas App rebuild documentation | ✅ IN PROGRESS | `canvas-app-rebuild/` |

---

## Scope Summary

| Metric | Value |
|---|---|
| Total forms (full portfolio) | ~418+ (across 36 department-sites) |
| Forms analyzed in detail | 361 (IT + HR + QA/QC + FIN + others) |
| Johor forms | 129 |
| Prai (Penang) forms | 232 |
| IT forms (current migration focus) | 24 active + 5 legacy/duplicate |
| Forms requiring approval | 356 (confirmed) |
| Forms with unknown approval requirement | 5 (Hardware Inventory ×2, Employee Health Record, Contractor Agreement, Training Attendance) |
| Forms with NO approval required | ITSSR, HI, DCALOG, ISGDOC, ITINFO, ITDR2, ITDAILYRPT, ITSC, TRNMAN (CONFIRMED from code evidence) |
| Canvas screens (canonical parameterized) | 15 |
| Canvas components | 53 |
| SP parent lists | ~20 (MainDB_ per dept) |
| SP child/ext lists | ~90 (editable gallery forms) |
| SP config lists | Config_GlobalUserRoleAssignments, Config_ApproverMatrix, Config_Companies, Config_Departments, Config_EmployeeDirectory |
| SP history lists | ApprovalHistory_HR, ApprovalHistory_QA, ApprovalHistory_STR, ApprovalHistory_SHE + others TBC |

---

## Key Architecture Decisions (Summary)

1. Canvas App — not TSX code-first app — is the final target
2. Hybrid form pattern: SharePoint EditForm + custom Canvas components for workflow/approval panels
3. 15 canonical parameterized screens for 361 forms (not 361 individual screens)
4. Site values: `"Prai"` and `"Johor"` (not "Penang")
5. Status field: SP `Status` column stores label text ("Draft", "Submitted") — not key codes
6. Routing: `CurrentStage` + `CurrentApprover_Email` + `CurrentApproverGroup` (not a generic CA field)
7. Role config: `Config_GlobalUserRoleAssignments` already exists — do not create AppConfig_Roles
8. History: Per-dept `ApprovalHistory_{DEPT}` lists — not one global WorkflowHistory list
