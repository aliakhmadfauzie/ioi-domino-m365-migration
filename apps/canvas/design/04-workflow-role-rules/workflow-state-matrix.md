# Workflow State Matrix

> Confirmed workflow status values, transitions, and field changes per list and form.
> Source: model files, service wrappers, AWHR/STR page files, MASTER_WORKFLOW_REGISTER.md
> Last updated: 2026-06-02

---

## Pattern A — HR and FIN Lists (7-value StatusKey pattern)

**SP Status column:** `Status` (Choice, stores label text)
**SP routing fields:** `CurrentStage`, `CurrentApprover_Email`, `CurrentApproverGroup`, `CurrentAction`

| Status Value (SP) | Display Label | Meaning | Who Acts Next | CurrentApprover_Email Set To |
|---|---|---|---|---|
| `"Draft"` | Draft | Initial save; not yet submitted | Submitter | Submitter's email |
| `"Submitted"` | Submitted | Submitted for first approval stage | First approver (HOD or HOS) | First approver's email |
| `"Under Review"` | Under Review | Intermediate approval stage (after first, before final) | Next-in-chain approver | Next approver's email |
| `"Approved"` | Approved | All stages approved; final state | None | "" (cleared) |
| `"Rejected"` | Rejected | Rejected at any stage | None (notify submitter) | "" |
| `"Closed"` | Closed | Completed and closed | None | "" |
| `"Archived"` | Archived | Archived record | None | "" |

### Confirmed AWHR Stage Transitions

Source: `pages/hr/awhr/detail.tsx` STAGE_ACTIONS object — **CONFIRMED**

| From CurrentAction | User Action | SP Writes | Next CurrentAction | Next Status |
|---|---|---|---|---|
| `"Submitted"` | HOS clicks Approve | `awhrHOSName`, `awhrHOSDate`, `awhrHOSRemark`, `awhrCurrentAction` | `"HOSApproved"` | `"Under Review"` |
| `"Submitted"` | HOS clicks Reject | `awhrRejectReason`, `awhrCurrentAction`, `statusKey` | `"Rejected"` | `"Rejected"` |
| `"HOSApproved"` | HOD clicks Approve | `awhrHODName`, `awhrHODDate`, `awhrHODRemark`, `awhrCurrentAction` | `"HODApproved"` | `"Under Review"` |
| `"HOSApproved"` | HOD clicks Reject | `awhrRejectReason`, `awhrCurrentAction`, `statusKey` | `"Rejected"` | `"Rejected"` |
| `"HODApproved"` | HR clicks Complete | `awhrHRName`, `awhrHRDate`, `awhrCurrentAction`, `statusKey` | `"Completed"` | `"Closed"` |
| `"HODApproved"` | HR clicks Reject | `awhrRejectReason`, `awhrCurrentAction`, `statusKey` | `"Rejected"` | `"Rejected"` |

---

## Pattern B — IT List (60-value plain string currentStatus)

**SP status column:** `currentStatus` (plain string, camelCase, required)
**SP stage field:** `workflowstage` (number, increments on each approval)
**SP action field:** `currentAction` (camelCase)

### Confirmed IT Stage Names by Form

Source: `workflow-orchestration-service.ts` `getStageNameFromNumber()` — **CONFIRMED**

| Form Code | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|---|---|---|---|---|---|
| EAF | Submission | Dept Head | Division Director | IT Manager | IT Provisioning |
| NIR | Request | HOD Approval | Notes Admin | IT Hardware | — |
| RS | Submission | IT Processing | ED Approval | Closed | — |
| ITSSR | Submission | Triage | Resolution | Acceptance | Closure |
| All others | Stage 1 | Stage 2 | Stage 3 | Stage 4 | — |

### IT Status Values (Selected — from `MainDBITCurrentstatusKeyToLabel`)

| currentStatus Value | Meaning |
|---|---|
| `"Draft"` | Initial draft |
| `"Approved"` | Fully approved |
| `"Closed"` | Completed/closed |
| `"Withdrawn"` | Withdrawn by submitter |
| `"Pending HOD"` | Awaiting HOD action |
| `"Pending IT"` | Awaiting IT team |
| `"Pending IT Manager"` | Awaiting IT Manager |
| `"Pending Div Head"` | Awaiting Division Head |
| `"Pending ED"` | Awaiting Executive Director |
| `"Pending Verification"` | Awaiting verification |
| `"Pending Notes Admin"` | Awaiting Domino/Notes admin |
| `"Pending HOD Acceptance"` | Awaiting HOD acceptance |

> Full 60-value list in `main-dbit-model.ts` `MainDBITCurrentstatusKeyToLabel`

### IT Action Key Mapping

Source: `workflow-orchestration-service.ts` `mapActionToActionKey()` — **CONFIRMED**

| User Action | ActionKey Written to ApprovalRecords |
|---|---|
| Approve | `"ActionKey0"` |
| Reject | `"ActionKey1"` |
| Return | `"ActionKey2"` |
| Delegate / Escalate / Pending | `"ActionKey3"` |
| Complete | `"ActionKey4"` |

---

## Generic Workflow Template (Applies to most HR/FIN forms)

> This is the canonical workflow pattern. Per-form stage labels and approver routing must come from `Config_ApproverMatrix` data (MISSING_INFO — populate before build).

| Stage | Status Value | CurrentAction | Who Patches | Fields Written |
|---|---|---|---|---|
| Submitter creates | "Draft" | "Request" | Submitter | All form fields + Status + CurrentAction |
| Submitter submits | "Submitted" | "Submitted" | Submitter | Status, CurrentAction, CurrentStage, CurrentApprover_Email, SubmittedOn |
| First approver approves | "Under Review" | Form-specific (e.g. "HOSApproved") | First approver | CurrentAction, CurrentStage, next CurrentApprover_Email, approval-specific fields |
| Intermediate stages | "Under Review" | Form-specific | Current approver | Same pattern |
| Final approver approves | "Approved" | "Approved" | Final approver | Status="Approved", CurrentAction="Approved", CurrentApprover_Email="" |
| Any approver rejects | "Rejected" | "Rejected" | Current approver | Status="Rejected", CurrentAction="Rejected", ApproverRemarks, CurrentApprover_Email="" |
| Any approver returns | "Draft" | "Request" | Current approver | Status="Draft", CurrentAction="Request", ApproverRemarks, CurrentApprover_Email=submitter |

---

## Approval Stage Count per Form Category

| Form Category | Stages | Approval Chain |
|---|---|---|
| Simple forms (e.g. Canteen Complaint) | 2 | HOD → HR |
| Standard forms (e.g. NDF) | 3 | HOD → HR HOD → Completed |
| Multi-stage HR (e.g. AWHR) | 3 | HOS → HOD → HR |
| Finance high-value (e.g. CAR) | 4 | HOD → Finance Manager → COO → Executive Director |
| Procurement forms (e.g. MER) | 3–4 | HOD → Verification → Approval |
| Database/registration forms (no approval) | 1 | Submit = complete |
| Unknown approval status | N/A | Do not build approval stages |

---

## Pattern C — IT Forms with Approval (EAF, NIR, RS, SFAR, PRF, SAP forms)

### EAF — 5-Stage Approval Workflow (CONFIRMED)

> Source: `docs/04_WORKFLOW_APPROVAL_RULES.md`, `src/pages/it/forms/eaf/new.tsx`
> Status values: `Draft`, `Submitted`, `HOD_Approved`, `HOD_Rejected`, `COO_Approved`, `COO_Rejected`, `Completed`

| Stage | currentStatus | Current Action | Who Acts | Valid Actions | Next Status | SP Fields Updated | Audit? |
|---|---|---|---|---|---|---|---|
| 1 — Submission | `Draft` | Submit | Submitter | Submit | `Submitted` | `requestoremail`, `submitteddate`, all EAF_ fields | No |
| 2 — HOD | `Submitted` | HOD Approval | Dept Head (HOD) | Approve / Reject | `HOD_Approved` / `HOD_Rejected` | `HODApprover`, `EAF_status1`, `EAF_date2`, `EAF_comment1`, `EAF_HODNAME` | YES |
| 3 — COO/Director | `HOD_Approved` | Director Approval | COO or Director (routing depends on isPCN) | Approve / Reject | `COO_Approved` / `COO_Rejected` | `SecondApprover`, `EAF_status2`, `EAF_date3`, `EAF_comment2`, `EAF_DIVNAME` | YES |
| 4 — IT Manager | `COO_Approved` | IT Manager Approval | IT Manager | Approve / Reject | `Pending IT` | `EAF_status3`, `EAF_date4`, `EAF_comment3` | YES |
| 5 — IT Provisioning | `Pending IT` | IT Provisioning | IT Staff | Complete / Reject | `Completed` / `Rejected` | `EAF_status4`, `EAF_date5`, `EAF_comment4` | YES |

**Rejection Routing**: HOD rejects → back to Submitter. COO/Director rejects → back to HOD.

### NIR (NOTESID) — 4-Stage Approval Workflow (CONFIRMED)

| Stage | Who Acts | Valid Actions | Next Status | SP Fields Updated |
|---|---|---|---|---|
| 1 — Request | Submitter | Submit | `Pending HOD` | All requestor fields |
| 2 — HOD Approval | Dept Head | Approve / Reject | `Pending Notes Admin` / `Rejected` | `NIR_HODApprovalStatus`, HOD name/date/comment |
| 3 — Notes Admin | IT Notes Admin | Complete / Reject | `Pending IT Hardware` / `Rejected` | `NIR_NotesAdminStatus`, PIC name/date/task |
| 4 — IT Hardware | IT Hardware Team | Complete / Reject | `Closed` / `Rejected` | `NIR_ITHardwareStatus`, accepted by/date/comment |

### RS (PWDRESET) — 2-Stage + Conditional ED (CONFIRMED)

| Stage | Who Acts | Valid Actions | Condition |
|---|---|---|---|
| 1 — Submission | Submitter | Submit | Always |
| 2 — IT Processing | IT PIC | Complete / Reject | Always |
| 3 — ED Approval | Executive Director | Approve / Reject | Conditional: only for high-privilege applications |

### PRF — Multi-Stage IT Program Request (CONFIRMED, 12 sections)

> Source: `src/form-schemas/PRF.json` — 12-section workflow. Stage transitions partially confirmed from schema.

| Stage | Section | Who Acts | Status |
|---|---|---|---|
| 1 | Requestor's Section (PRF_S2) | Submitter | CONFIRMED |
| 2 | IT Approver Update (PRF_S3) | IT Approver | CONFIRMED |
| 3 | Div/Dept Head Approval (PRF_S4) | Dept Head | CONFIRMED |
| 4 | Tasks Assignment by IT (PRF_S5) | ISG | CONFIRMED |
| 5 | Functional Procedure (SAP) (PRF_S6) | Functional Owner | TSX_INFERENCE |
| 6 | IT Support Use (PRF_S7) | IT Support | TSX_INFERENCE |
| 7 | Assignment to ABAP Developer (PRF_S8) | ABAP Developer | TSX_INFERENCE |
| 8 | IT Support Staff Completion (PRF_S9) | IT Staff | CONFIRMED |
| 9 | Testing/Validation by IT (PRF_S10) | IT Tester | TSX_INFERENCE |
| 10 | IT Functional Completion (PRF_S11) | IT Functional | CONFIRMED |
| 11 | Requestor Acceptance (PRF_S12) | Requestor | CONFIRMED |
| 12 | Comments by IT (Final) (PRF_S14) | IT | CONFIRMED |

---

## Pattern D — IT Forms WITHOUT Approval (Direct Submit → Complete)

> These forms have NO approval gate. Status transitions are simple: Draft → Submitted → Completed.
> Do NOT build cmpWorkflowActionPanel or ApprovalHistory writes for these forms.

| Form Code | Status Values | Who Can Edit After Submit | Source Evidence |
|---|---|---|---|
| ITSSR | `Draft`, `Submitted`, `Assigned`, `InProgress`, `Resolved`, `Closed` | IT PIC (assign/resolve), Requestor (accept/close) | `features/itssr/itssr-app.tsx` — CONFIRMED |
| HI | `Draft`, `Submitted`, `Completed` | Admin only | `pages/it/forms/hi/new.tsx` — CONFIRMED |
| DCALOG | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| ISGDOC | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| ITINFO | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| ITDR2 | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| ITDAILYRPT | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| ITSC | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
| TRNMAN | `Draft`, `Submitted`, `Completed` | Admin only | TSX_INFERENCE |
