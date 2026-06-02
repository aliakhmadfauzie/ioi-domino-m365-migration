# Master Migration Rollout Register

Last updated: 2026-06-02

Active Work Items

- ID: ROLLOUT-001
  Form: EAF (IT)
  Task: FIX-003 — Persist required fields to SharePoint
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-003B` passed. See `audit/build_reviews/FIX-003B_EAF_RE_AUDIT.md`; follow-up EAF field-map task moved to `ROLLOUT-003`.

- ID: ROLLOUT-002
  Form: CIR (HR)
  Task: Re-Audit required — CIR failed re-audit on 2026-06-01
  Priority: P0
  Status: Complete - Passed
  Reason: `audit/build_reviews/HR_CIR_RE_AUDIT_3.md` passed strict CIR re-audit under DEC-2026-008. CIR now uses `MainDB_HR` parent metadata plus `MainDB_HR_Ext_Cafeteria` CIR-specific storage, accepted TeamMembers mapping `cirTeamMembers2`, and non-approval `Submitted -> Accepted` behavior.

- ID: ROLLOUT-003
  Form: EAF (IT)
  Task: FIX-004 — Reconcile ExtAccess service field map
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-004` passed. Current generated service mappings match captured schema names. See `audit/build_reviews/FIX-004_EAF_FIELD_MAP_RE_AUDIT.md`; next CIR task is extension-list provisioning.

- ID: ROLLOUT-004
  Form: CIR (HR)
  Task: TASK-HUMAN-CIR-SCHEMA — Route CIR schema confirmation
  Priority: P0
  Status: Complete - Decision Answered
  Owner: data-team / hr-dev
  Notes: `CIR-SCHEMA-01` was answered on 2026-06-01: use/provision planned lowercase `cir*` fields. CIR schema sync and CIR re-audit remain blocked until SharePoint is provisioned and schema/model evidence is regenerated.

- ID: ROLLOUT-005
  Form: CIR (HR)
  Task: TASK-PROVISION-CIR-SCHEMA — Provision planned `cir*` fields and export schema
  Priority: P0
  Status: Complete - Accepted
  Owner: infra / hr-dev
  Notes: Parent-list provisioning failed because `MainDB_HR` exceeds the list column-size limit. `HR-CAPACITY-01` selected Option B and `DEC-2026-008` confirmed the extension-list path. PowerShell 7 provisioning/export completed against `MainDB_HR_Ext_Cafeteria`; user accepted the live schema checkpoint despite SharePoint auto-suffixing the team-members field to `cirTeamMembers*`. See `source_analysis/06_sharepoint_design/TASK_PROVISION_CIR_SCHEMA_COMPLETION_REPORT.md`.

- ID: ROLLOUT-006
  Form: CIR (HR)
  Task: TASK-HR-MAINDB-COLUMN-CAPACITY-REVIEW — Resolve MainDB_HR capacity before CIR provisioning
  Priority: P0
  Status: Complete - Option B Selected
  Owner: infra / migration lead
  Notes: Capacity options documented in `source_analysis/06_sharepoint_design/HR_MAINDB_COLUMN_CAPACITY_REVIEW.md`; selected path documented in `source_analysis/09_reports/HR_CAPACITY_HUMAN_CONFIRMATION_UPDATE.md`.

- ID: ROLLOUT-007
  Form: CIR / MainDB_HR (HR)
  Task: TASK-HUMAN-HR-CAPACITY-01 — Select capacity strategy
  Priority: P0
  Status: Complete
  Owner: migration lead / business
  Notes: `HR-CAPACITY-01` answered on 2026-06-01 with Option B: move CIR lowercase `cir*` fields to `MainDB_HR_Ext_Cafeteria`.

- ID: ROLLOUT-008
  Form: CIR (HR)
  Task: TASK-FIX-CIR-EXT-READWRITE — Move CIR app read/write to extension list
  Priority: P0
  Status: Verified
  Owner: hr-dev
  Notes: Generated cafeteria model/service and CIR new/detail/index use `MainDB_HR_Ext_Cafeteria` for CIR-specific fields, with TeamMembers mapped to `cirTeamMembers2`. CIR parent metadata remains in `MainDB_HR` per DEC-2026-008. Strict re-audit and TypeScript passed. See `audit/build_reviews/HR_CIR_RE_AUDIT_3.md`.

- ID: ROLLOUT-009
  Form: ITSSR (IT)
  Task: TASK-FIX-005 — Persist routed IT PIC
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-005` passed. Current submit/update evidence persists routed PIC through `iTSSRAssignedToEmail`, which maps to captured SharePoint field `ITSSR_AssignedTo_Email`. See `audit/build_reviews/FIX-005_ITSSR_PIC_PERSISTENCE_RE_AUDIT.md`.

- ID: ROLLOUT-010
  Form: SAPAMR (IT)
  Task: TASK-FIX-009 — Persist TBV/TBA routing fields
  Priority: P0
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: Option B selected. App code updated — ExtSAP model has `sAPAMR*` fields, submit creates ExtSAP child, list/detail reads from ExtSAP. Live provisioning ran successfully on 2026-06-02 and exported `MainDB_IT_Ext_SAP` schema now contains `SAPAMR_TBVEmail`, `SAPAMR_TBAEmail`, and `SAPAMR_TBV1Email` through `SAPAMR_TBV5Email`. See `audit/build_reviews/FIX-009_SAPAMR_ROUTING_FIELDS_FIX_REPORT.md` and `audit/build_reviews/IT_UAT_BLOCKER_CLEARANCE_REPORT.md`.

- ID: ROLLOUT-011
  Form: SAPTR (IT)
  Task: TASK-FIX-011 — Replace sample data with SharePoint reads
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: Re-audit passed 2026-06-01. index.tsx rewritten to use `useMainDBITList` — loading/empty states, `parseRemarks` field extraction, and FormCode filter all verified. See `audit/build_reviews/FIX-011_SAPTR_RE_AUDIT.md`.

- ID: ROLLOUT-012
  Form: SAPCA (IT)
  Task: TASK-FIX-012 — Replace sample data with SharePoint reads
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-012` passed. SAPCA index.tsx uses `useMainDBITList` filtered by `formcode eq 'SAPCA'`; detail fields are populated from `parseRemarks()` keys written by the submit page. TypeScript passed. See `audit/build_reviews/FIX-012_SAPCA_RE_AUDIT.md`.

- ID: ROLLOUT-013
  Form: ITSC (IT)
  Task: TASK-FIX-025 — Read ExtAssets child data in list/detail
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-025` passed. ITSC index and detail now read `MainDB_IT_Ext_Assets`, join child rows to `MainDB_IT` parents by parent lookup ID/title, and prefer child fields with remarks fallback. TypeScript passed. See `audit/build_reviews/FIX-025_ITSC_CHILD_DATA_RE_AUDIT.md`.

- ID: ROLLOUT-014
  Form: SFAR (IT)
  Task: TASK-FIX-026 — Persist access fields and approval history
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-026` passed. SFAR submit now writes confirmed structured `MainDB_IT` SFAR fields, creates the linked `MainDB_IT_Ext_Access` row for folder path/access level, seeds `ApprovalRecords` with submission and pending owner-review history, and TypeScript passed. See `audit/build_reviews/FIX-026_SFAR_PERSISTENCE_RE_AUDIT.md`.

- ID: ROLLOUT-015
  Form: ISGDOC (IT)
  Task: TASK-FIX-031 — Persist and read document fields through ExtDocs
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-031` passed. ISGDOC submit now keeps the parent `MainDB_IT` record, creates a linked `MainDB_IT_Ext_Docs` child row for confirmed document fields, and list/detail reads prefer ExtDocs values with remarks fallback. TypeScript passed. See `audit/build_reviews/FIX-031_ISGDOC_EXTDOCS_RE_AUDIT.md`.

- ID: ROLLOUT-016
  Form: EXB-003 — EPDU / EPHR / ESF (HR)
  Task: TASK-QUALITY-EXB-003 / TASK-PROMOTE-EXB-003 — Quality review and promote extraction batch
  Priority: P2
  Status: Complete - Promoted with Human Confirmation
  Owner: data-team
  Notes: EXB-003 passed quality review and EPDU, EPHR, and ESF were promoted to source requirements. Promotion carries human-confirmation caveats for repeated child-list design, health-record privacy, survey response modeling, and choice values. See `source_analysis/11_pdf_extraction_layer/quality_reviews/EXB-003_HR_QUALITY_REVIEW.md` and `source_analysis/09_reports/EXB-003_HR_PROMOTION_SUMMARY.md`.

- ID: ROLLOUT-037
  Form: EXB-004 — FTCR / FWWPD / FWWPE (HR)
  Task: TASK-QUALITY-EXB-004 / TASK-PROMOTE-EXB-004 — Quality review and promote extraction batch
  Priority: P2
  Status: Complete - Promoted with Human Confirmation
  Owner: data-team
  Notes: EXB-004 passed quality review and FTCR, FWWPD, and FWWPE were promoted to source requirements. Promotion carries human-confirmation caveats for FTCR workflow/status values, FWWPD ownership/truncated internal names/table storage, and FWWPE HOS optional routing/completion actors. See `source_analysis/11_pdf_extraction_layer/quality_reviews/EXB-004_HR_QUALITY_REVIEW.md` and `source_analysis/09_reports/EXB-004_HR_PROMOTION_SUMMARY.md`.

- ID: ROLLOUT-038
  Form: EXB-005 — GDSN / HEALTHINFO / HRAPR (HR)
  Task: TASK-EXTRACT-EXB-005 — Extract next Prai HR PDF batch
  Priority: P2
  Status: Complete - Promoted with Human Confirmation
  Owner: data-team
  Notes: EXB-005 passed quality review and GDSN, HEALTHINFO, and HRAPR were promoted to source requirements. Promotion carries human-confirmation caveats for GDSN HOD/department routing, HEALTHINFO notice/status semantics, and HRAPR problem-report state/role ownership. See `source_analysis/11_pdf_extraction_layer/quality_reviews/EXB-005_HR_QUALITY_REVIEW.md` and `source_analysis/09_reports/EXB-005_HR_PROMOTION_SUMMARY.md`.

- ID: ROLLOUT-039
  Form: EXB-006 — HRINFO / INTERN / INTERVIEWDB (HR)
  Task: TASK-EXTRACT-EXB-006 — Extract next Prai HR PDF batch
  Priority: P2
  Status: Ready
  Owner: data-team
  Notes: Continue the HR source-analysis pipeline with raw text, page inventory, field candidates, visual notes, workflow candidates, quality review, and promotion gates. Source PDFs are `PRAI_SITE_FORM/HR/HRINFO.pdf`, `PRAI_SITE_FORM/HR/INTERN.pdf`, and `PRAI_SITE_FORM/HR/INTERVIEWDB.pdf`.

- ID: ROLLOUT-040
  Form: FXB-001 — CAR / CMF_A / CMF_B (FIN)
  Task: TASK-EXTRACT-FXB-001 / TASK-QUALITY-FXB-001 / TASK-PROMOTE-FXB-001 — Extract, quality-review, and promote first Prai Finance PDF batch
  Priority: P2
  Status: Complete - Promoted with Human Confirmation
  Owner: data-team
  Notes: FXB-001 passed quality review and CAR, CMF_A, and CMF_B were promoted to source requirements. Promotion carries human-confirmation caveats for CAR threshold routing/table storage, CMF_A credit approval state values/routing, and CMF_B temporary credit limit renewal rules. See `source_analysis/11_pdf_extraction_layer/quality_reviews/FXB-001_FIN_QUALITY_REVIEW.md` and `source_analysis/09_reports/FXB-001_FIN_PROMOTION_SUMMARY.md`.

- ID: ROLLOUT-041
  Form: FXB-002 — CMF_C / EARF / RSES (FIN)
  Task: TASK-EXTRACT-FXB-002 — Extract next Prai Finance PDF batch
  Priority: P2
  Status: Complete - Promoted with Human Confirmation
  Owner: data-team
  Notes: FXB-002 passed quality review and CMF_C, EARF, and RSES were promoted to source requirements. Promotion carries human-confirmation caveats for CMF_C customer-row storage/internal names, EARF routing/completion, and RSES state values. See `source_analysis/11_pdf_extraction_layer/quality_reviews/FXB-002_FIN_QUALITY_REVIEW.md` and `source_analysis/09_reports/FXB-002_FIN_PROMOTION_SUMMARY.md`.

- ID: ROLLOUT-042
  Form: FXB-003 — 1_PCNCAR / 2_pcncreditmanagement_Appendix_A / 2_pcncreditmanagement_Appendix_B (FN Johor)
  Task: TASK-EXTRACT-FXB-003 — Extract next Johor Finance PDF batch
  Priority: P2
  Status: Ready
  Owner: data-team
  Notes: Continue the Finance source-analysis pipeline with Johor FN PDFs. Source PDFs are `JOHOR_SITE_FORM/FN/1_PCNCAR.pdf`, `JOHOR_SITE_FORM/FN/2_pcncreditmanagement_Appendix_A.pdf`, and `JOHOR_SITE_FORM/FN/2_pcncreditmanagement_Appendix_B.pdf`.

- ID: ROLLOUT-017
  Form: ITINFO (IT)
  Task: TASK-FIX-033 / TASK-RE-AUDIT-033 — Read ITI fields through ExtDocs
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: ITINFO submit preserves parent `MainDB_IT` metadata, writes linked `MainDB_IT_Ext_Docs` ITI fields, and list/detail now read ExtDocs values by parent lookup ID/title with remarks fallback. TypeScript passed. See `audit/build_reviews/FIX-033_ITINFO_EXTDOCS_READ_RE_AUDIT.md`.

- ID: ROLLOUT-018
  Form: ITDR / ITDAILYRPT (IT)
  Task: TASK-FIX-035 / TASK-RE-AUDIT-035 — Correct status and read ExtSupport child activity data
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: ITDR submit now uses non-approval `Sent` status instead of `Approved`, still creates the linked `MainDB_IT_Ext_Support` activity row, and list/detail read child activity fields by parent lookup ID/title with remarks fallback. DEC-2026-009 resolves the ITDR versus ITDAILYRPT route/form-code conflict for UAT by querying both aliases under the `/it/forms/itdr` route. TypeScript passed. See `audit/build_reviews/FIX-035_ITDR_STATUS_EXTSUPPORT_RE_AUDIT.md` and `audit/build_reviews/IT_UAT_BLOCKER_CLEARANCE_REPORT.md`.

- ID: ROLLOUT-019
  Form: ITDR2 (IT)
  Task: TASK-FIX-036 — Add list/detail reads for Outstanding Tasks Register
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: ITDR2 now has a dedicated `/it/forms/itdr2` database view, reads `MainDB_IT` records filtered by `FormCode` ITDR2, joins linked `MainDB_IT_Ext_Support` task fields by parent lookup ID/title, and falls back to parent remarks for existing records. Re-audit found and fixed missing ExtSupport service mappings for ITDR2 Year/Month/Title, and `npx tsc --noEmit` passed. See `audit/build_reviews/FIX-036_ITDR2_LIST_DETAIL_FIX_REPORT.md` and `audit/build_reviews/FIX-036_ITDR2_LIST_DETAIL_RE_AUDIT.md`.

- ID: ROLLOUT-020
  Form: PRF (IT)
  Task: TASK-FIX-039 — Create ExtAccess workflow child on submit
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-039` passed. PRF submit/save creates a linked `MainDB_IT_Ext_Access` child after the parent `MainDB_IT` record and rolls back the parent if child creation fails. Detail child lookup uses `parentFormCode` / `parentRecord` filters translated by the service, and PRF workflow fields map to captured `PRF_*` columns including numeric `PRF_Rating`. TypeScript passed. See `audit/build_reviews/FIX-039_PRF_EXTACCESS_CHILD_RE_AUDIT.md`; next safe task is `TASK-FIX-050`.

- ID: ROLLOUT-021
  Form: SAPSOF2 (IT)
  Task: TASK-FIX-050 — Replace sample list/database data with SharePoint reads
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-050` passed. SAPSOF2 database view reads `MainDB_IT` records filtered by `FormCode` SAPSOF2, no `SAMPLE_DATA` remains in `index.tsx`, and the table binds to mapped SharePoint-backed rows. TypeScript passed. See `audit/build_reviews/FIX-050_SAPSOF2_SAMPLE_DATA_FIX_REPORT.md` and `audit/build_reviews/FIX-050_SAPSOF2_SAMPLE_DATA_RE_AUDIT.md`; next safe task is `TASK-FIX-051`.

- ID: ROLLOUT-022
  Form: SAPSOF2 (IT)
  Task: TASK-FIX-051 — Persist and read approval/test evidence child records
  Priority: P0
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-051` passed. SAPSOF2 submit creates `ApprovalRecords` rows for populated KU/BPO approval slots, creates `ITSAPSOFTestEvidence` rows for test scenarios, rolls back the parent record on child-write failure, and list/detail reads child rows with parent remarks fallback. TypeScript passed. See `audit/build_reviews/FIX-051_SAPSOF2_CHILD_EVIDENCE_FIX_REPORT.md` and `audit/build_reviews/FIX-051_SAPSOF2_CHILD_EVIDENCE_RE_AUDIT.md`; next safe task is `TASK-FIX-001`.

- ID: ROLLOUT-023
  Form: SFAR (IT)
  Task: TASK-FIX-001 — Prevent initial submit from writing final Approved status
  Priority: P1
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-001` passed. SFAR initial submit uses `CurrentstatusKey49` Pending Owner with `workflowstage: 2`, not `CurrentstatusKey1` Approved, and seeds pending owner-review history. TypeScript passed. See `audit/build_reviews/FIX-001_SFAR_INITIAL_STATUS_RE_AUDIT.md`; next safe task is `TASK-FIX-002`.

- ID: ROLLOUT-024
  Form: SAPSOF2 (IT)
  Task: TASK-FIX-002 — Prevent initial sign-off submit from writing final Approved status
  Priority: P1
  Status: Verified
  Owner: dev-team
  Notes: `TASK-RE-AUDIT-002` passed. SAPSOF2 initial submit uses `CurrentstatusKey47` Pending KU Sign-Off with `workflowstage: 2`, not `CurrentstatusKey1` Approved; remarks show Pending KU Sign-Off and TypeScript passed. See `audit/build_reviews/FIX-002_SAPSOF2_INITIAL_STATUS_RE_AUDIT.md`; next safe task is `TASK-FIX-007`.

- ID: ROLLOUT-025
  Form: SAPCR (IT)
  Task: TASK-FIX-007 / TASK-RE-AUDIT-007 — Prevent submitted SAPCR records from staying in Request status
  Priority: P1
  Status: Verified
  Owner: dev-team
  Notes: Re-audit passed 2026-06-02. SAPCR submit uses `CurrentstatusKey14` (Pending BPO) with `workflowstage: 1`, preserves Ext_SAP email routing child creation, and TypeScript compiles cleanly. See `audit/build_reviews/FIX-007_SAPCR_RE_AUDIT.md`; next ready P1 task was `TASK-FIX-010`.

- ID: ROLLOUT-026
  Form: CIR (HR)
  Task: TASK-HUMAN-CIR-ARCH-DECISION — Record CIR parent-plus-extension architecture decision
  Priority: P0
  Status: Complete
  Owner: migration agent
  Notes: User delegated the CIR decision on 2026-06-02. DEC-2026-008 approves `MainDB_HR` parent metadata/discriminator records plus lowercase `cir*` storage on `MainDB_HR_Ext_Cafeteria`. Next task is `TASK-PROVISION-CIR-SCHEMA`.

- ID: ROLLOUT-027
  Form: CIR (HR)
  Task: TASK-SYNC-SCHEMA-CIR — Validate exported CIR extension schema
  Priority: P0
  Status: Complete
  Owner: infra / hr-dev
  Notes: Exported `maindb_hr_ext_cafeteria.Schema.json` validated. Accepted TeamMembers mapping is `cirTeamMembers2`; generated cafeteria model/service are stale and must be updated under `TASK-FIX-CIR-EXT-READWRITE`.

- ID: ROLLOUT-028
  Form: SAPTR (IT)
  Task: TASK-FIX-010 — Prevent initial submit from writing final Approved status
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: Re-audit passed 2026-06-02. SAPTR submit uses `CurrentstatusKey9` (Pending Approval A) with `workflowstage: 1`, preserves Ext_SAP child creation, and TypeScript compiles cleanly. See `audit/build_reviews/FIX-010_SAPTR_RE_AUDIT.md`; next ready P1 task was `TASK-FIX-014`.

- ID: ROLLOUT-029
  Form: SAPDRP (IT)
  Task: TASK-FIX-014 / TASK-RE-AUDIT-014 — Prevent initial submit from writing final Approved status
  Priority: P1
  Status: Verified
  Owner: dev-team
  Notes: Re-audit passed 2026-06-02. SAPDRP submit uses `CurrentstatusKey4` (Sent) with `workflowstage: 1`, no longer creates as Approved, and TypeScript compiles cleanly. See `audit/build_reviews/FIX-014_SAPDRP_RE_AUDIT.md`; next ready P1 task is `TASK-FIX-016` (SAPSLCF initial status).

- ID: ROLLOUT-030
  Form: HR pipeline
  Task: TASK-HR-BUILD-GUARDRAILS — Create guardrails before DRD build prep
  Priority: P0
  Status: Complete
  Owner: migration agent
  Notes: Guardrails are captured in `source_analysis/09_reports/HR_BUILD_GUARDRAILS.md`. CIR pass evidence, DEC-2026-008 parent-plus-extension convention, non-approval-form rule, typecheck requirement, build audit/re-audit sequence, and DRD entry criteria are now recorded. Next HR task is `TASK-PREP-DRD-BUILD`.

- ID: ROLLOUT-035
  Form: DRD (HR)
  Task: TASK-PREP-DRD-BUILD — Prepare DRD implementation package
  Priority: P0
  Status: Complete
  Owner: hr-dev
  Notes: DRD implementation package prepared in `source_analysis/09_reports/DRD_BUILD_PREP_REPORT.md`. The package maps DRD fields, workflow stages, shift-code requirements, route/page insertion points, and audit gates. Next HR task is `TASK-BUILD-HR-DRD`.

- ID: ROLLOUT-036
  Form: DRD (HR)
  Task: TASK-BUILD-HR-DRD — Build DRD app pages and workflow
  Priority: P0
  Status: Ready
  Owner: hr-dev
  Notes: Build `/hr/drd` new/list/detail pages, route them in `hr-routes.tsx`, implement HOS -> HOD -> HR workflow on `drdCurrentAction`, write exported `drd*` fields to `MainDB_HR`, expose the 10 shift codes, run TypeScript, and create `audit/build_reviews/HR_DRD_BUILD_AUDIT.md`.

- ID: ROLLOUT-030
  Form: SAPSLCF (IT)
  Task: TASK-FIX-016 — Prevent initial submit from writing final Approved status
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: SAPSLCF submit now writes `CurrentstatusKey27` (Pending HOD) instead of `CurrentstatusKey1` (Approved). `workflowstage: 1` preserved. TypeScript passed. See `audit/build_reviews/FIX-016_SAPSLCF_INITIAL_STATUS_FIX_REPORT.md`; next ready P1 task is `TASK-FIX-018` (NIR approval actions).

- ID: ROLLOUT-031
  Form: NIR (IT)
  Task: TASK-FIX-018 — Persist NIR approval actions
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: NIR list page onApprove/onReject now persist via MainDBITService.update() with status/approver/timestamp/remarks fields. TypeScript passed. See `audit/build_reviews/FIX-018_NIR_APPROVAL_FIX_REPORT.md`; next ready P1 task was `TASK-FIX-019`.

- ID: ROLLOUT-032
  Form: NIR (IT)
  Task: TASK-FIX-019 — Align NIR initial status with workflow
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: NIR initial submit now creates in Submitted state (`CurrentstatusKey30`, `workflowstage: 2`, `nirCA: 'Submitted'`). TypeScript passed. See `audit/build_reviews/FIX-019_NIR_INITIAL_STATUS_FIX_REPORT.md`; next ready P1 task was `TASK-FIX-021`.

- ID: ROLLOUT-033
  Form: RS (IT)
  Task: TASK-FIX-021 — Change RS initial status to Sent
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: RS submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved) in dynamic-form-renderer. Direct-to-PIC form. TypeScript passed. See `audit/build_reviews/FIX-021_RS_INITIAL_STATUS_FIX_REPORT.md`; next ready P1 task was `TASK-FIX-022`.

- ID: ROLLOUT-034
  Form: UR (IT)
  Task: TASK-FIX-022 — Change UR initial status to Sent
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: UR submit now uses `CurrentstatusKey4` (Sent) instead of `CurrentstatusKey1` (Approved) in dynamic-form-renderer. Approval requirement unresolved (FIX-023 blocked), Sent is safe interim. TypeScript passed. See `audit/build_reviews/FIX-022_UR_INITIAL_STATUS_FIX_REPORT.md`; next ready P1 task is `TASK-FIX-024` (ITSC).

- ID: ROLLOUT-031
  Form: NIR (IT)
  Task: TASK-FIX-018 — Persist NIR approval actions
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: NIR list page onApprove/onReject now persist via MainDBITService.update() with status/approver/timestamp/remarks fields. TypeScript passed. See `audit/build_reviews/FIX-018_NIR_APPROVAL_FIX_REPORT.md`; next ready P1 task was `TASK-FIX-019`.

- ID: ROLLOUT-032
  Form: NIR (IT)
  Task: TASK-FIX-019 — Align NIR initial status with workflow
  Priority: P1
  Status: Fixed Pending Re-Audit
  Owner: dev-team
  Notes: NIR initial submit now creates in Submitted state (`CurrentstatusKey30`, `workflowstage: 2`, `nirCA: 'Submitted'`). TypeScript passed. See `audit/build_reviews/FIX-019_NIR_INITIAL_STATUS_FIX_REPORT.md`; next ready P1 task is `TASK-FIX-021` (RS).
