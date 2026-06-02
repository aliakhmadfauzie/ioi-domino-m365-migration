# Completed Work

> Append-only log of completed build milestones.
> Last updated: 2026-06-02

---

## Format

```
## [Date] — [Item Name]
- What was built/completed
- Tested: YES/NO/PARTIAL
- Notes
```

---

## 2026-06-02 — Canvas App Rebuild Design Report

- Produced full Canvas App rebuild design report: 15 screens, 53 components, 12 phases
- Phase 1–8 complete including screen inventory, component architecture, data model, workflow matrix, formula plan, build order
- Tested: NO (design only — no Canvas files created)
- Notes: Design covers 361 forms across Johor and Prai sites

---

## 2026-06-02 — Audit and Fact-Check Report

- Full audit of design report against confirmed TSX source files and generated model files
- 19 issues found; 6 critical; 10 assumption risks; 6 do-not-build items identified
- Critical corrections: site values ("Prai" not "Penang"), status field pattern (label text not key codes), routing fields (CurrentStage + CurrentApprover_Email + CurrentApproverGroup), per-dept ApprovalHistory lists, Config_GlobalUserRoleAssignments already exists
- Tested: NO (audit only)
- Notes: No files modified during audit

---

## 2026-06-02 — Corrected Canvas App Data Model and Formula Reference Document

- Produced corrected data model: confirmed SP column names from 8 source files
- Confirmed: MainDB_HR (full column list), MainDB_FIN (key fields), MainDB_IT (different pattern), ApprovalHistory_HR (full schema), Config_GlobalUserRoleAssignments (full schema), Config_ApproverMatrix (schema)
- Confirmed: AWHR SP field names from service create call
- All DRAFT_FORMULAs corrected: App.OnStart, Filter patterns, Patch patterns, history write
- Tested: NO (document only)

---

## 2026-06-02 — Canvas App Migration Folder Structure

- Created 13-folder structure under `canvas-app-rebuild/`
- Created 51 seeded starter files with content from all three previous documents
- No TSX files modified; no existing files overwritten
- 10 conflict checks performed; zero conflicts found (canvas-app-rebuild/ folder did not exist)
- Tested: N/A (folder/file creation)
- Notes: Cross-references added to existing files in m365-design/, mapping/, source_analysis/ — not duplicated

---

## Next: Batch 0 — SP Schema Confirmation (PENDING)

Resolve all 6 critical blockers from `00-project-control/missing-info-register.md` before build starts.
