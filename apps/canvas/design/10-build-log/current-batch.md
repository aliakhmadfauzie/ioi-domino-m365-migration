# Current Batch

> What is currently being worked on. Update at start of every build session.
> Last updated: 2026-06-03

---

## Current Batch: Prepare Canvas App source-of-truth documentation before screen design/build

**Batch ID**: DOC-2026-06-03
**Batch Description**: Populate /canvas-app-rebuild documentation workspace from existing repo and available documentation (TSX reference, Domino analysis, SharePoint schema, field mappings, workflow rules, role matrices).
**Status**: ✅ COMPLETE — All 11 files updated.

---

## Batch Deliverables (Completed)

| # | File | Action | Status |
|---|---|---|---|
| 1 | `00-project-control/migration-status.md` | Updated with current phase, IT dept status, corrected approval counts | ✅ DONE |
| 2 | `01-source-reference/tsx-reference-index.md` | Added IT forms pages (M1-M7), IT-specific components, hooks, services | ✅ DONE |
| 3 | `01-source-reference/source-traceability-matrix.md` | Full IT form inventory: 24 active + 5 legacy forms with Domino→TSX→SP→Canvas traceability | ✅ DONE |
| 4 | `02-sharepoint-schema/sharepoint-list-inventory.md` | Added IT dept list detail: 6 provisioned + 2 pending ext lists + 6 pending config lists | ✅ DONE |
| 5 | `02-sharepoint-schema/sharepoint-column-inventory.md` | Added MainDB_IT_Ext_Access (EAF/NIR/SFAR), Ext_Assets (HI), Ext_Support (ITSSR), Ext_SAP columns | ✅ DONE |
| 6 | `03-field-mapping/field-to-control-matrix.md` | Added EAF, HI, ITSSR full control mappings + 21 IT forms quick reference with approval status | ✅ DONE |
| 7 | `04-workflow-role-rules/workflow-state-matrix.md` | Added Pattern C (EAF 5-stage, NIR 4-stage, RS, PRF) + Pattern D (NO approval forms) | ✅ DONE |
| 8 | `04-workflow-role-rules/role-access-matrix.md` | Added IT department role definitions (12 roles) + IT action permission matrix | ✅ DONE |
| 9 | `04-workflow-role-rules/approval-requirement-matrix.md` | **Fixed**: Split IT into Approval YES (16 forms) and NO (11 forms). Was incorrectly "all require approval". | ✅ DONE |
| 10 | `05-screen-design/screen-inventory.md` | Added IT navigation map + 24 IT forms screen dependency matrix (approval/child list/workflow panel) | ✅ DONE |
| 11 | `10-build-log/current-batch.md` | Recorded this batch | ✅ DONE |

---

## Current Status: PRE-BUILD — Documentation Complete, Awaiting SP Schema Confirmation

No Canvas App build has started yet. Source-of-truth documentation is now populated from existing repo/docs.

**Next action**: Resolve 6 critical blockers → Create Canvas App → Register data sources → Build first component.

---

## Active Items (Post-Documentation)

| Item | Owner | Status | Target Date | Notes |
|---|---|---|---|---|
| Confirm SP site URLs (Johor + Prai) | IT Admin | OPEN | TBD | Blocker B-01, B-02 |
| Export SP column names from MainDB_HR, MainDB_FIN, MainDB_IT | SP Admin | OPEN | TBD | Blocker B-02 |
| Confirm RoleKey values from Config_GlobalUserRoleAssignments | IT Admin | OPEN | TBD | Blocker B-03 |
| Confirm Config_ApproverMatrix routing key pattern | IT Admin | OPEN | TBD | Blocker B-04 |
| Confirm all ApprovalHistory_ list names | SP Admin | OPEN | TBD | Blocker B-05 |
| Confirm form-specific SP column names via Canvas connector test | SP Admin | OPEN | TBD | Blocker B-06 |

---

## When Blockers Are Resolved

Move to Batch 2 — Canvas App Creation:

1. Create Canvas App in Power Apps Studio
2. Register confirmed SP lists as data sources
3. Write and test App.OnStart (gblActiveSite, gblCurrentUser, colUserRoleAssignments)
4. Build first component: cmpLoadingState
5. Build cmpAppShell + cmpAppHeader + cmpSideNav
6. Build scrHomeDashboard

See `build-order.md` for full sequence.
