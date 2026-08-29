# Risk Register

> All identified risks for the Canvas App migration.
> Seeded from Audit Report Section 3 (Issues) and Section 5 (Assumption Risks).
> Never delete rows. Mark RESOLVED with date and resolution.
> Last updated: 2026-06-02

---

## Risk Status Labels
- `OPEN` — risk is active and unmitigated
- `MITIGATED` — mitigation action taken; residual risk remains
- `RESOLVED` — risk no longer applies
- `ACCEPTED` — decision made to accept the risk

---

## Critical Risks

| Risk ID | Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| RSK-01 | SP site URLs not confirmed — Canvas App cannot connect to any SP data source | HIGH | CRITICAL | Blocker in migration-status.md. Escalate to IT Admin before build. | OPEN |
| RSK-02 | SP internal column names unconfirmed — all Patch formulas would write to wrong columns | HIGH | CRITICAL | Do not write any Patch formula until column names confirmed from live SP. Use DRAFT_FORMULA label on all formulas. | OPEN |
| RSK-03 | RoleKey values in Config_GlobalUserRoleAssignments not known — cmpAccessGuard and cmpWorkflowActionPanel cannot be built | HIGH | CRITICAL | Query live SP list for RoleKey values before building any role-dependent component. | OPEN |
| RSK-04 | Config_ApproverMatrix routing key pattern unknown — workflow advance formulas cannot resolve next approver | MEDIUM | CRITICAL | Read Config_ApproverMatrix SP data before building cmpWorkflowActionPanel. | OPEN |
| RSK-05 | MainDB_T&D list name contains ampersand (&) — Canvas Power Apps connector may reject or mangle this list name | MEDIUM | HIGH | Test SP connection to MainDB_T&D before using. If issues, request SP Admin rename to MainDB_TD. | OPEN |

---

## High Risks

| Risk ID | Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| RSK-06 | SP delegation limit — MainDB_QA has 80 forms; could accumulate 50,000+ records. Non-indexed queries will silently truncate at 500/2000 rows. | HIGH | HIGH | Index FormCode, Status, EntitySite, Requestor_Email, CurrentApprover_Email before data sources are added to Canvas. See 07-powerfx/delegation-risk-notes.md. | OPEN |
| RSK-07 | Canvas App 200 data source limit — 20+ MainDB_ + 20+ Ext_ + 9 ApprovalHistory + Config_ lists may approach the limit | MEDIUM | HIGH | Count data sources before adding to Canvas. If limit approached, split app by site or dept group. | OPEN |
| RSK-08 | Production forms page contains 60+ invented form codes (SAM-*, TPM-002+, etc.) not in master register — risk of building non-existent forms | HIGH | HIGH | Use ONLY MASTER_WORKFLOW_REGISTER.md as the list of forms to build. See domino-source-index.md for the confirmed mock form list. | OPEN |
| RSK-09 | Child row storage is mixed (JSON vs. separate child list) — cmpRelatedChildItems design must support both | MEDIUM | HIGH | Survey per-form storage pattern before building each editable gallery form. Add propStoragePattern to cmpRelatedChildItems. | OPEN |
| RSK-10 | CAR form SP column names all unverified (PDF labels used) — all field mapping in Section 9 would fail | HIGH | HIGH | Read MainDB_FIN service file and verify against live SP before building CAR form. All CONFLICT items in field-to-control-matrix.md must be resolved. | OPEN |

---

## Medium Risks

| Risk ID | Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| RSK-11 | HOD_x002e_Email Canvas accessor — URL-encoded period in SP internal name may not work with Canvas SP connector | MEDIUM | MEDIUM | Test with live SP connection before using. Try 'HOD.Email' as Canvas accessor. | OPEN |
| RSK-12 | 3 forms with unknown approval status — if built with approval stages they should not have | LOW | MEDIUM | Do not build approval screens for Hardware Inventory (#21/#180), Employee Personal Health Record (#145), IT Server Checklist (#183), Training Attendance (#350), Contractor/Vendor Agreement (#356) until confirmed. | OPEN |
| RSK-13 | ApprovalHistory_ lists for FIN, IT, QC, PUR etc. may not exist — audit write formulas would fail | MEDIUM | MEDIUM | Confirm existence of all ApprovalHistory_ lists before building workflow actions for those depts. | OPEN |
| RSK-14 | FIN departmentKey field stores key codes (DepartmentKey03) not labels — Filter formulas must use key codes | MEDIUM | MEDIUM | All FIN department filters must use key codes, not plain text. Confirm from live SP if Choice column stores key or label. | OPEN |
| RSK-15 | design/m365-design/powerapps-design.md describes TSX as the target — could confuse new team members | LOW | MEDIUM | File has been flagged as SUPERSEDED in 01-source-reference/tsx-reference-index.md. Add a note at the top of design/m365-design/powerapps-design.md. | OPEN |

---

## Low Risks

| Risk ID | Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| RSK-16 | IT forms module structure (M1-M7) not captured in Canvas screens — IT users may find navigation confusing | LOW | LOW | Add IT module grouping concept to scrDeptHub design for IT dept. | OPEN |
| RSK-17 | Canvas YAML export format may change between Power Apps versions | LOW | LOW | Always label exported YAML with Power Apps version. Test import after version updates. | ACCEPTED |
| RSK-18 | Power Automate not in scope — email notifications may be needed for approval actions | MEDIUM | LOW | Confirm notification scope with project owner. If needed, design PA flows after Canvas build. | OPEN |
