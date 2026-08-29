# Human Confirmation Questions

> **Updated**: 2026-06-02 (CIR architecture decision approved) | **Evidence**: PyMuPDF + DXL XML + schema validation
> **DXL details**: `analysis/source_analysis/09_reports/DXL_EVIDENCE_HR_WORKFLOW.md`
> **Schema blocker evidence**: `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`

## HR Department — 15 Forms (55 Open, 15 Answered, 0 P0 Human Blockers)

### CIR Schema Confirmation — P0 Decisions Answered

| Q-ID | Form | Priority | Area | Question | Status | Evidence | Recommended Decision |
|---|---|---|---|---|---|---|---|
| CIR-SCHEMA-01 | CIR | ~~P0~~ | SharePoint schema | Should `MainDB_HR` be provisioned/regenerated with the planned `cir*` internal names from `HR_SHAREPOINT_SCHEMA_EXPORT.md`, or should CIR implementation be revised to the captured legacy/non-prefixed fields? | Answered 2026-06-01 - use planned `cir*` fields; confirmed 2026-06-02 by DEC-2026-008; provisioning/export accepted complete; schema sync selected `cirTeamMembers2` for TeamMembers | `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_SYNC_VALIDATION_REPORT.md`; `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_PROVISIONING_PREP_REPORT.md`; `analysis/source_analysis/09_reports/HR_CAPACITY_HUMAN_CONFIRMATION_UPDATE.md`; `analysis/source_analysis/09_reports/CIR_ARCHITECTURE_DECISION_UPDATE.md`; `analysis/source_analysis/06_sharepoint_design/TASK_PROVISION_CIR_SCHEMA_COMPLETION_REPORT.md` | Update generated model/service and CIR app pages to use `MainDB_HR_Ext_Cafeteria`, with TeamMembers mapped to `cirTeamMembers2`. |
| HR-CAPACITY-01 | CIR / MainDB_HR | ~~P0~~ | SharePoint schema capacity | Live `MainDB_HR` rejected new `cir*` columns because the list column-size limit is exceeded. Should we prune/archive unused parent columns, move CIR `cir*` fields to a dedicated extension list, or revise CIR to captured legacy fields? | Answered 2026-06-01 - Option B; confirmed 2026-06-02 by DEC-2026-008: parent metadata in `MainDB_HR`, CIR-specific fields in `MainDB_HR_Ext_Cafeteria` | `analysis/source_analysis/06_sharepoint_design/HR_MAINDB_COLUMN_CAPACITY_REVIEW.md`; `analysis/source_analysis/09_reports/HR_CAPACITY_HUMAN_CONFIRMATION_UPDATE.md`; `analysis/source_analysis/06_sharepoint_design/CIR_SCHEMA_PROVISIONING_PREP_REPORT.md`; `analysis/source_analysis/09_reports/CIR_ARCHITECTURE_DECISION_UPDATE.md` | Provision/export lowercase `cir*` fields on the CIR extension list, then update CIR app read/write path to use the extension list. |

### Cross-Form: CurrentAction / CA State Values — ✅ ALL ANSWERED

| Q-ID | Form(s) | Priority | Status | DXL Answer |
|---|---|---|---|---|
| HR-X01 | All 5 approval | ~~P0~~ | ✅ Answered | See per-form table below |
| HR-X02 | BSD, CIR, CWR | ~~P0~~ | ⚠️ Deferred | Status field exists but values not in DXL keywords |

### CurrentAction States (All Forms — Quick Reference)

| Form | States | Source |
|---|---|---|
| BSD | Request → Submitted → Approved / Rejected → ARCHIVE | DXL |
| AWHR | Request → Submitted → HOSApproved → HODApproved → Withdrawn | DXL |
| CIR | Submitted → Accepted | DXL |
| CWR | Submitted → HODApp/Rej → HODivApp/Rej → HRHODApp/Rej → Ack/Denied (9 states) | DXL |
| DRD | Submitted → HOSApproved → HODApproved → Completed | DXL |
| EEN | Submitted → EDApproved/EDRejected → Extended → NotifiedHR → Withdrawn | DXL |

### BSD — Backup Staff Database (98/100)

| Q-ID | Priority | Area | Question | Status | Answer |
|---|---|---|---|---|---|
| BSD-01 | ~~P1~~ | Approval | HOD = final stage? | ✅ Answered | Yes — after Approved, next is ARCHIVE |
| BSD-02 | ~~P2~~ | SharePoint | Fixed 3 or flexible child list? | ✅ Answered | Fixed 3 columns (PIC_1/2/3) |
| BSD-03 | P2 | Fields | Division/Department/Section choices? | ⚠️ Deferred | DB lookup — not hardcoded in DXL |
| BSD-04 | P3 | Fields | Revision Required: Yes/No or multi? | 🔴 Open | Not in DXL |

### AWHR — Rest Day & Working Hours (85/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| AWHR-01 | P1 | Routing | Skip-HOD possible? | 🔴 Open |
| AWHR-02 | P1 | Approval | HR Accept/Deny = final? | 🔴 Open (HR stage uses HRApp flag; no CA state in DXL) |
| AWHR-03 | P1 | Fields | Which fields mandatory? | 🔴 Open (* Mandatory in PDF, not enumerated in DXL) |
| AWHR-04 | P2 | Role | HR-only editable fields? | 🔴 Open |
| AWHR-05 | P2 | Role | Requester-only editable fields? | 🔴 Open |
| AWHR-06 | P2 | Workflow | Withdrawal needs approver? | 🔴 Open |
| AWHR-07 | P3 | Fields | EmpCategory & Day Type choices? | 🔴 Open |
| AWHR-08 | ~~P2~~ | SharePoint | Working hours: flexible or fixed 15? | ✅ Answered — Fixed 15 rows |

### CIR — Cafeteria Inspection (100/100) ✅

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CIR-01 | P2 | Fields | Site choice values? | 🔴 Open |
| CIR-02 | ~~P3~~ | Workflow | Corrective Action mandatory? | ✅ Answered — Optional |

### CWR — Contract Worker Requisition (96/100)

| Q-ID | Priority | Area | Question | Status | Answer |
|---|---|---|---|---|---|
| CWR-01 | ~~P1~~ | Approval | Confirm 4-stage workflow? | ✅ Answered | Confirmed: HOD→DivHead→AGM HR→Requestor |
| CWR-02 | ~~P0~~ | SharePoint | Single form or child entries? | ✅ Answered | Single form, dual sections |
| CWR-03 | ~~P0~~ | SharePoint | Period rows: fixed or flexible? | ✅ Answered | Fixed 3 per section |
| CWR-04 | P2 | Fields | Type & PermCategory choices? | 🔴 Open |

### DRD — Duty Roster Database (98/100) ✅ ZERO OPEN

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| DRD-01 | ~~P3~~ | Fields | 10 shift codes complete? | ✅ Answered — Confirmed |
| DRD-02 | P2 | Fields | Category & Amend choices? | ⚠️ Deferred |

### EEN — Employee Exit Notification (93/100)

| Q-ID | Priority | Area | Question | Status | Answer |
|---|---|---|---|---|---|
| EEN-01 | ~~P0~~ | Role | ED role? | ✅ Answered | ED = approver (EDApproved/EDRejected states) |
| EEN-02 | ~~P1~~ | Approval | ED first or HOD first? | ✅ Answered | ED first |
| EEN-03 | ~~P1~~ | SharePoint | Exit interview: child or embedded? | ✅ Answered | Embedded fields |
| EEN-04 | ~~P1~~ | Approval | IT notification: auto or manual? | ✅ Answered | Automatic after NotifiedHR |
| EEN-05 | P2 | Fields | Main/Category/Type/etc choices? | 🔴 Open |

### EPDU — Employee Personal Detail Update (91/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| EPDU-01 | P1 | Workflow | What are the `HRAction` / HR review state values? | 🔴 Open |
| EPDU-02 | P1 | SharePoint | Should education, children, and family rows be child lists or fixed-row parent columns? | 🔴 Open |
| EPDU-03 | P2 | Fields | What are the choice values for Marital, Disabilities, Working, and child/family status fields? | 🔴 Open |
| EPDU-04 | P2 | Security | Who may access/update personal identity and tax fields? | 🔴 Open |

### EPHR — Employee Personal Health Record (88/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| EPHR-01 | P1 | Security | Which HR/medical roles can create, view, and edit health records? | 🔴 Open |
| EPHR-02 | P1 | SharePoint | Should medical history and admission records be repeatable child rows or fixed parent fields? | 🔴 Open |
| EPHR-03 | P2 | Fields | What are the choice values for Gender, Past Medical/Surgical History, Location, and Medical Report? | 🔴 Open |
| EPHR-04 | P2 | Attachments | Should health attachments be SharePoint attachments or a separate document child list? | 🔴 Open |

### ESF — Employee Survey Form (92/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| ESF-01 | P1 | SharePoint | Are survey questions fixed at 16 rows, or should HR manage the question list as configuration? | 🔴 Open |
| ESF-02 | P1 | SharePoint | Should responses be stored as child rows or fixed parent columns? | 🔴 Open |
| ESF-03 | P2 | Fields | What are the choice values for Years of Service, Age Group, and Category? | 🔴 Open |
| ESF-04 | P2 | Security | How should confidentiality be enforced in SharePoint/Power Apps access rules? | 🔴 Open |
| ESF-05 | P3 | Calculation | Confirm TotalRating calculation formula. | 🔴 Open |

### FTCR — Fixed Term Contract Requisition Form (94/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| FTCR-01 | P1 | Workflow | Confirm the exact approval route: Department/Section Head -> Div/Dept Head -> Endorser -> AGM HR -> COO/SGM -> ED -> HR status? | 🔴 Open |
| FTCR-02 | P1 | Workflow | What are valid `CA` / `CaseStatus` / `AppFor` values? | 🔴 Open |
| FTCR-03 | P1 | SharePoint | Should the 10 background-history rows be fixed columns or a child list? | 🔴 Open |
| FTCR-04 | P2 | Fields | What are choice values for contract period, identified successor, external advertisement, and training required? | 🔴 Open |
| FTCR-05 | P2 | Role | Which role can edit the HR Section and Notify HOD fields? | 🔴 Open |

### FWWPD — Foreign Workers Work Permit Database (90/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| FWWPD-01 | P1 | Form ownership | Is FWWPD a standalone HR record form or a supporting database used by FWWPE? | 🔴 Open |
| FWWPD-02 | P1 | Fields | Confirm exact internal names for passport expiry and work permit expiry fields; extracted PDF text dropped the first character. | 🔴 Open |
| FWWPD-03 | P1 | SharePoint | Should insurance, FOMEMA, MYEG, and employment contract rows be child lists or fixed 10-row columns? | 🔴 Open |
| FWWPD-04 | P2 | Workflow | What are valid `Status` and `CurrentAction` values? | 🔴 Open |
| FWWPD-05 | P2 | Role | Which HR/admin roles may edit Section E and reminder fields? | 🔴 Open |

### FWWPE — Foreign Worker Work Period Extension (95/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| FWWPE-01 | P1 | Workflow | Confirm whether HOS approval is optional/skipped when Head of Section is blank. | 🔴 Open |
| FWWPE-02 | P1 | Workflow | What are exact `CurrentAction` state values and transition order? | 🔴 Open |
| FWWPE-03 | P1 | Role | Who completes Section F and Section G, and can they be completed independently? | 🔴 Open |
| FWWPE-04 | P2 | Fields | Confirm full choice values for `Status`, `ContStatus`, `HOSStatus`, `HODStatus`, and `HRHODStatus`. | 🔴 Open |
| FWWPE-05 | P2 | Attachments | Should attachment fields use SharePoint attachments or a dedicated document child list? | 🔴 Open |

### GDSN — Gift/Donation/Sponsorship Notification (92/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| GDSN-01 | P1 | Workflow | Is HOD endorsement the final approval, or do ED/SGM/HR/FIN/PUR/MKT routing fields represent later required approvals/notifications? | 🔴 Open |
| GDSN-02 | P1 | Workflow | What are valid `CA` and `App` state values? | 🔴 Open |
| GDSN-03 | P2 | Fields | Confirm choice values for Request Type, Type, Purpose, Benefit, Logo, and Purchase through PO. | 🔴 Open |
| GDSN-04 | P2 | Routing | Which department routing fields are conditional, especially PUR/IsPUR and FIN/MKT? | 🔴 Open |

### HEALTHINFO — HR Information / Notice (86/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| HEALTHINFO-01 | P1 | Workflow | Confirm this is a notice/information-only form with no approval workflow. | 🔴 Open |
| HEALTHINFO-02 | P2 | Workflow | What are valid `Status` and `CurrentAction` values? | 🔴 Open |
| HEALTHINFO-03 | P2 | Role | Who can publish, update, and archive notices? | 🔴 Open |
| HEALTHINFO-04 | P3 | Migration | Should view counters/readers be migrated or reset during M365 migration? | 🔴 Open |

### HRAPR — HR Applications Problem Reporting (93/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| HRAPR-01 | P1 | Workflow | What are valid `CurrentAction`, `CaseStatus`, `CaseStatus_1`, `Status`, and `KIVStatus` values? | 🔴 Open |
| HRAPR-02 | P1 | Workflow | Confirm workflow transitions among GHR/ISG action, rejection, requestor acceptance, KIV/archive, and auto-close. | 🔴 Open |
| HRAPR-03 | P1 | Role | Which roles correspond to `ISG`, `PIC`, `GHR`, `GHR2`, and `HRHOD`, and which fields can each edit? | 🔴 Open |
| HRAPR-04 | P2 | Workflow | Confirm reminder and auto-close behavior using `RemDate` and `AutoClosedDate`. | 🔴 Open |
| HRAPR-05 | P2 | Fields | Confirm case number generation format `Year - Month - CaseNo`. | 🔴 Open |

## FIN Department — 6 Forms (27 Open, 0 Answered, 0 P0 Human Blockers)

### CAR — Capital Appropriation Request (96/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CAR-01 | P1 | Workflow | Confirm the full approval threshold matrix for HOD, SGM, Director, and Finance verification routing. | 🔴 Open |
| CAR-02 | P1 | Workflow | What are valid `CA`, `App`, `Status`, and completion/cancellation state values? | 🔴 Open |
| CAR-03 | P1 | SharePoint | Should investment items, PO rows, and completion savings rows be child lists or fixed parent columns? | 🔴 Open |
| CAR-04 | P1 | Role | Which roles own Finance verification, recommendation, completion review, and final cancellation fields? | 🔴 Open |
| CAR-05 | P2 | Workflow | How should the hard-copy budget-exceeded flow be represented in M365: attachment, manual offline flag, or formal approval state? | 🔴 Open |

### CMF_A — Approval for Credit Application Form Appendix A (95/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CMF_A-01 | P1 | Workflow | What are valid `CA`, `App`, `Status`, and denial/cancellation state values? | 🔴 Open |
| CMF_A-02 | P1 | Routing | Confirm conditions for GM, Finance, SFC, SGM, ED, and Finance acknowledgement routing. | 🔴 Open |
| CMF_A-03 | P2 | Fields | Confirm choice values for Company, Category, customer Status, Risk, Reason(s), and Attachment behavior. | 🔴 Open |
| CMF_A-04 | P2 | Calculation | Confirm `FLimit` / `FLimit2` meaning and calculation or display rules. | 🔴 Open |

### CMF_B — Temporary Credit Limit Change Form (94/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CMF_B-01 | P1 | Workflow | What are valid `CA`, `App`, and denial/cancellation state values? | 🔴 Open |
| CMF_B-02 | P1 | Business rule | Confirm the rule that a fresh Appendix A is required after two consecutive TCLC submissions across six months. | 🔴 Open |
| CMF_B-03 | P1 | Routing | Confirm conditions for Marketing HOD, GM, Finance, ED, and Finance acknowledgement routing. | 🔴 Open |
| CMF_B-04 | P2 | Workflow | Confirm TCLC expiry and reminder behavior, including owner and notification timing. | 🔴 Open |
| CMF_B-05 | P2 | Fields | Confirm choice values for Company, Category, payment terms, reason, and credit insurance fields. | 🔴 Open |

### CMF_C — Review of Customers on Credit (91/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| CMF_C-01 | P1 | SharePoint | Should the 50 customer review rows be stored as fixed parent columns or a child list? | 🔴 Open |
| CMF_C-02 | P1 | Fields | Confirm exact internal names for all `M_*` row fields because PDF extraction visually truncated several values. | 🔴 Open |
| CMF_C-03 | P1 | Workflow | What are valid `CA`, `App1`, `App1_1`, `App2`, `App3`, and `App6` state values? | 🔴 Open |
| CMF_C-04 | P2 | Routing | Confirm the business labels and routing conditions for `SectionTitle` and `SectionTitle_1_1`. | 🔴 Open |
| CMF_C-05 | P2 | Fields | Confirm choice values for buying activity, late payment, negative market news, financial statement available, and credit-limit action. | 🔴 Open |

### EARF — Expenditure Appropriation Request Form (94/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| EARF-01 | P1 | SharePoint | Should asset detail rows and SAP PR rows be stored as fixed parent columns or child lists? | 🔴 Open |
| EARF-02 | P1 | Routing | Confirm routing rules for IT, IT HOD, Admin HOD, Maintenance HOD, Finance Admin, and Division Head based on purchase type. | 🔴 Open |
| EARF-03 | P1 | Workflow | What are valid `CA`, `App1`, `App2`, and `App3` state values? | 🔴 Open |
| EARF-04 | P2 | Workflow | Confirm whether Finance verification must occur before Department Head approval in all cases. | 🔴 Open |
| EARF-05 | P2 | Workflow | Confirm completion and cancellation behavior after approval, including who can edit completion fields. | 🔴 Open |

### RSES — Reversal Service Entry Sheet (98/100)

| Q-ID | Priority | Area | Question | Status |
|---|---|---|---|---|
| RSES-01 | P1 | Workflow | What are valid `CA`, `App`, and `App2` state values? | 🔴 Open |
| RSES-02 | P1 | Workflow | Confirm whether Finance completion is the final workflow state and whether Finance rejection returns to requestor or closes the case. | 🔴 Open |
| RSES-03 | P2 | Fields | Confirm choice values for Company and Site. | 🔴 Open |

## IT Department

| Q-ID | Form | Priority | Area | Question | Status | Evidence | Recommended Decision |
|---|---|---|---|---|---|---|---|
| IT-SAPAMR-SCHEMA-01 | SAPAMR | P0 | SharePoint schema | Should SAPAMR TBV/TBA routing fields be provisioned on `MainDB_IT`, provisioned on `MainDB_IT_Ext_SAP`, or kept only in `remarks` JSON? | **Answered 2026-06-01 - Option B (Ext_SAP)**. App code updated; PnP provisioning script ready to run | `analysis/source_analysis/09_reports/SAPAMR_SCHEMA_BLOCKER_REPORT.md`; `audit/build_reviews/FIX-009_SAPAMR_ROUTING_FIELDS_FIX_REPORT.md`; `scripts/sharepoint/provision-sapamr-ext-sap.ps1` | Provision SAPAMR-specific routing fields on `MainDB_IT_Ext_SAP`, export/regenerate schema evidence, then update SAPAMR submit/read paths to use the extension child list. |
| IT-01 | IAL1-5 | P1 | Workflow | Exact CurrentAction and Status values? | Open | `analysis/source_analysis/08_batches/SOURCE_BATCH_001_SUMMARY.md`; `analysis/source_analysis/08_batches/SOURCE_BATCH_002_SUMMARY.md` | Confirm from DXL/PDF before workflow build. |
| IT-02 | IAL1-5 | P1 | Workflow | Reviewer assignment mechanism? | Open | `analysis/source_analysis/08_batches/SOURCE_BATCH_001_SUMMARY.md`; `analysis/source_analysis/08_batches/SOURCE_BATCH_002_SUMMARY.md` | Confirm reviewer source before workflow build. |
| IT-03 | IAL1-5 | P2 | SharePoint | Should all five share one SharePoint list? | Open | `analysis/source_analysis/08_batches/SOURCE_BATCH_001_SUMMARY.md`; `analysis/source_analysis/08_batches/SOURCE_BATCH_002_SUMMARY.md` | Prefer shared list only if FormCode-specific reporting is sufficient. |
| IT-04 | EAF | P2 | Fields | Exact Application and User Group choice values? | Open | `analysis/workflow-analysis.md`; `docs/central-form-reference.md` | Confirm business-approved choice values. |
| IT-05 | EAF | P1 | Workflow | Exact isPCN conditional routing logic? | Open | `analysis/workflow-analysis.md`; `docs/04_WORKFLOW_APPROVAL_RULES.md` | Confirm conditional COO/Director route. |
| IT-06 | HI | P2 | Fields | Exact Asset Type, Status, OS, Vendor choice values? | Open | `analysis/evidence-reconciliation.md`; `docs/central-form-reference.md` | Confirm business-approved choice values. |

---

## Priority Summary (Post-DXL)

| Department | P0 | P1 | P2 | P3 | Open | Answered | Total |
|---|---|---|---|---|---|---|---|
| HR | **0** | 24 | 26 | 4 | **55 open** | 15 answered | 70 |
| FIN | **0** | 17 | 10 | 0 | 27 open | 0 answered | 27 |
| IT | **1** | 3 | 3 | 0 | 7 open | 0 | 7 |
| **Total** | **1** | **44** | **39** | **4** | **89 open** | **15 answered** | **105** |

## Forms Blocked

- CIR schema sync and re-audit are blocked until the answered extension-list `cir*` field decision is provisioned and the captured Power schema/model evidence is updated.
- CIR app read/write must be revised to use `MainDB_HR_Ext_Cafeteria` for CIR-specific `cir*` fields after extension-list schema generation.
- HR builds that depend on CIR baseline remain blocked. EXB-003, EXB-004, and EXB-005 forms are promoted for requirements/design work but should not start app builds until matching schema/workflow questions are answered.
- FIN FXB-001 and FXB-002 forms are promoted for requirements/design work but should not start app builds until `MainDB_FIN` provisioning status, workflow/status values, threshold routing, row/table storage, credit-limit rules, asset consultation routing, and SES completion behavior are confirmed.
- SAPAMR `TASK-FIX-009` answered Option B (Ext_SAP). App code updated; provisioning script `scripts/sharepoint/provision-sapamr-ext-sap.ps1` ready to run.

## Forms Safe for Preliminary Schema

| Form | Status |
|---|---|
| **DRD** | ✅ 98/100 — Zero open questions |
| **CIR** | ⚠️ Source questions answered — extension-list provisioning/schema sync pending |
| **BSD** | ✅ 98/100 — P2 deferred only |
| **EEN** | ✅ 93/100 — P0/P1 all cleared |
| **CWR** | ✅ 96/100 — P0/P1 all cleared |
| **AWHR** | ⚠️ 85/100 — 3 P1 open (skip-HOD, HR final, mandatory) |
| **FTCR** | ⚠️ 94/100 — P1 workflow and table-storage questions open |
| **FWWPD** | ⚠️ 90/100 — P1 ownership/internal-name/table-storage questions open |
| **FWWPE** | ⚠️ 95/100 — P1 workflow/routing/completion questions open |
| **GDSN** | ⚠️ 92/100 — P1 endorsement/routing questions open |
| **HEALTHINFO** | ⚠️ 86/100 — P1 notice-only confirmation open |
| **HRAPR** | ⚠️ 93/100 — P1 workflow/status/role questions open |
| **CAR** | ⚠️ 96/100 — P1 threshold/workflow/table-storage questions open |
| **CMF_A** | ⚠️ 95/100 — P1 workflow/routing questions open |
| **CMF_B** | ⚠️ 94/100 — P1 workflow/business-rule/routing questions open |
| **CMF_C** | ⚠️ 91/100 — P1 table-storage/internal-name/workflow questions open |
| **EARF** | ⚠️ 94/100 — P1 routing/workflow/table-storage questions open |
| **RSES** | ⚠️ 98/100 — P1 workflow-state/final-state questions open |

*Last Updated: 2026-06-02 | FXB-002 promoted + CIR architecture decision approved | 0 P0 human blockers*
|---|---|
| **DRD** | ✅ No P0/P1 blockers |
| **CIR** | ✅ No P0/P1 blockers |
| **BSD** | ⚠️ P1 only |
| **AWHR** | ⚠️ P1 only |

---

*Last Updated: 2026-06-01 | 50 questions across 15 forms (9 HR + 6 IT)*
