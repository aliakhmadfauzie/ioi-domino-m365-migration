# Next Day Action List

Date generated: 2026-06-02
Action date: 2026-06-02

## Current State

- `TASK-HUMAN-CIR-ARCH-DECISION` is complete. DEC-2026-008 approves CIR parent metadata in `MainDB_HR` and CIR-specific lowercase `cir*` fields on `MainDB_HR_Ext_Cafeteria`.
- `TASK-PROVISION-CIR-SCHEMA` is accepted complete by user decision after live provisioning/export. SharePoint auto-suffixed the team-members field to `cirTeamMembers*`; schema sync must record the accepted mapping.
- `TASK-SYNC-SCHEMA-CIR` is complete. Accepted CIR TeamMembers mapping is `cirTeamMembers2`.
- `TASK-FIX-CIR-EXT-READWRITE` and `TASK-RE-AUDIT-CIR` are complete/verified. CIR passed strict re-audit with accepted TeamMembers mapping `cirTeamMembers2`.
- `TASK-HR-BUILD-GUARDRAILS` is complete. HR build guardrails now capture CIR pass evidence, DEC-2026-008 parent-plus-extension rules, non-approval-form handling, typecheck/build-audit gates, and DRD entry criteria.
- `TASK-PREP-DRD-BUILD` is complete. DRD implementation package is prepared and the actual DRD app-source build is the next safe HR task.
- `TASK-FIX-005` and `TASK-RE-AUDIT-005` are complete/verified for ITSSR routed PIC persistence.
- `TASK-FIX-009` is fixed pending re-audit; SAPAMR Ext_SAP fields were provisioned live and exported locally on 2026-06-02.
- `TASK-FIX-011` / `TASK-RE-AUDIT-011` are complete/verified for SAPTR sample-data replacement.
- `TASK-FIX-012` / `TASK-RE-AUDIT-012` are complete/verified for SAPCA sample-data replacement.
- `TASK-FIX-025` / `TASK-RE-AUDIT-025` are complete/verified for ITSC ExtAssets child-data read alignment.
- `TASK-FIX-026` / `TASK-RE-AUDIT-026` are complete/verified for SFAR structured access-field and approval-history persistence.
- `TASK-FIX-031` / `TASK-RE-AUDIT-031` are complete/verified for ISGDOC ExtDocs document-field persistence/read alignment.
- `TASK-FIX-033` / `TASK-RE-AUDIT-033` are complete/verified for ITINFO ExtDocs ITI-field read alignment.
- `TASK-FIX-035` / `TASK-RE-AUDIT-035` are complete/verified for ITDR non-approval status and ExtSupport child activity read alignment.
- `TASK-FIX-036` / `TASK-RE-AUDIT-036` are complete/verified for ITDR2 list/detail reads, ExtSupport task-field readback, and non-approval submit status.
- `TASK-FIX-039` / `TASK-RE-AUDIT-039` are complete/verified for PRF ExtAccess child creation, detail lookup, and workflow field service mappings.
- `TASK-FIX-050` / `TASK-RE-AUDIT-050` are complete/verified for SAPSOF2 SharePoint-backed list/database reads replacing `SAMPLE_DATA`.
- `TASK-FIX-051` / `TASK-RE-AUDIT-051` are complete/verified for SAPSOF2 approval/test evidence child persistence and readback.
- `TASK-FIX-001` / `TASK-RE-AUDIT-001` are complete/verified for SFAR initial status; current submit evidence uses `CurrentstatusKey49` Pending Owner instead of `CurrentstatusKey1` Approved.
- `TASK-FIX-002` / `TASK-RE-AUDIT-002` are complete/verified for SAPSOF2 initial status; current submit evidence uses `CurrentstatusKey47` Pending KU Sign-Off instead of `CurrentstatusKey1` Approved.
- `TASK-FIX-007` is fixed pending re-audit for SAPCR initial status; current submit evidence writes `CurrentstatusKey14` Pending BPO with `workflowstage: 1`.
- `TASK-EXTRACT-EXB-003`, `TASK-QUALITY-EXB-003`, and `TASK-PROMOTE-EXB-003` are complete; EPDU, EPHR, and ESF are promoted with human-confirmation caveats.
- `TASK-EXTRACT-EXB-004`, `TASK-QUALITY-EXB-004`, and `TASK-PROMOTE-EXB-004` are complete; FTCR, FWWPD, and FWWPE are promoted with human-confirmation caveats.
- `TASK-EXTRACT-EXB-005`, `TASK-QUALITY-EXB-005`, and `TASK-PROMOTE-EXB-005` are complete; GDSN, HEALTHINFO, and HRAPR are promoted with human-confirmation caveats.
- `TASK-EXTRACT-FXB-001`, `TASK-QUALITY-FXB-001`, and `TASK-PROMOTE-FXB-001` are complete; CAR, CMF_A, and CMF_B are promoted with human-confirmation caveats.
- `TASK-EXTRACT-FXB-002`, `TASK-QUALITY-FXB-002`, and `TASK-PROMOTE-FXB-002` are complete; CMF_C, EARF, and RSES are promoted with human-confirmation caveats.

## Priority Actions

| Order | Task | Department / Form | Action | Expected Output |
|---:|---|---|---|---|
| 1 | `TASK-EXTRACT-FXB-003` | FN Johor / 1_PCNCAR, Appendix_A, Appendix_B | Continue the Finance PDF extraction pipeline with the first 3 Johor FN PDFs. | Raw text, page inventory, field candidates, visual notes, workflow candidates, quality review, promoted requirement files. |
| 2 | `TASK-HUMAN-FIN-QUESTIONS` | FIN / promoted forms | Route open human-confirmation questions for FXB-001 and FXB-002. | Updated `HUMAN_CONFIRMATION_QUESTIONS.md` with answered/deferred statuses. |
| 3 | `TASK-FIX-009` | IT / SAPAMR | Re-audit SAPAMR live Ext_SAP write/read behavior after provisioning/export. | Re-audit report; typecheck/build evidence if code changes are needed. |

## Blockers To Keep Visible

| Blocker | Impact | Evidence |
|---|---|---|
| EXB-004 human-confirmation caveats | FTCR, FWWPD, and FWWPE are promoted for requirements/design, but workflow/status/table-storage details need confirmation before final app build specs. | `analysis/source_analysis/09_reports/EXB-004_HR_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |
| EXB-005 human-confirmation caveats | GDSN, HEALTHINFO, and HRAPR are promoted for requirements/design, but endorsement/routing, notice status, and problem-report state details need confirmation before final app build specs. | `analysis/source_analysis/09_reports/EXB-005_HR_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |
| FXB-001 human-confirmation caveats | CAR, CMF_A, and CMF_B are promoted for requirements/design, but Finance threshold routing, workflow state values, table storage, and temporary credit limit rules need confirmation before final app build specs. | `analysis/source_analysis/09_reports/FXB-001_FIN_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |
| FXB-002 human-confirmation caveats | CMF_C, EARF, and RSES are promoted for requirements/design, but customer-row storage/internal names, asset consultation routing, completion behavior, and state values need confirmation before final app build specs. | `analysis/source_analysis/09_reports/FXB-002_FIN_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |
| SAPAMR re-audit pending | SAPAMR live columns are provisioned and exported; run a write/read re-audit before final UAT signoff. | `audit/build_reviews/FIX-009_SAPAMR_ROUTING_FIELDS_FIX_REPORT.md`; `audit/build_reviews/IT_UAT_BLOCKER_CLEARANCE_REPORT.md`; `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json` |
| ITSSR schema field gap remains separate from PIC persistence | `FIX-052` stays blocked until SharePoint schema is confirmed. | `audit/findings/batch-01/itssr.md`; `audit/05_fix_backlog/FIX_BACKLOG.md` |
| EXB-003/004/005 and FXB-001/002 schema/build follow-up deferred | EPDU/EPHR/ESF/FTCR/FWWPD/FWWPE/GDSN/HEALTHINFO/HRAPR/CAR/CMF_A/CMF_B/CMF_C/EARF/RSES are promoted, but final app build specs still require human-confirmation answers and schema decisions. | `analysis/source_analysis/09_reports/EXB-003_HR_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/EXB-004_HR_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/EXB-005_HR_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/FXB-001_FIN_PROMOTION_SUMMARY.md`; `analysis/source_analysis/09_reports/FXB-002_FIN_PROMOTION_SUMMARY.md` |
| Multiple IT P1 fixes remain ready | New builds should not start until active ready fixes/re-audits are cleared. | `automation/MASTER_TASK_QUEUE.md` |

## First Task For Next Automation Pass

Run `TASK-EXTRACT-FXB-003` for Finance source-analysis continuation.
