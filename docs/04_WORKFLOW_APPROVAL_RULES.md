# Workflow & Approval Rules — Domino → M365 Migration

> **Purpose**: Consolidated approval classification for every form. Single source of truth for workflow type, status values, approval actors, and submit/edit behavior.
> **Rule**: Approval must be discovered, not assumed. Every form must be classified from evidence.

---

## Approval Classification Categories

| Classification | Definition | Evidence Required |
|---|---|---|
| **Approval Required** | Multi-stage workflow with designated approver roles, status transitions, and approval/rejection actions | Code evidence of approver fields, approval buttons, role checks, or approval status transitions |
| **No Approval Required** | Simple submit→complete workflow. No approver fields, no multi-stage status, no role-gated actions | Code evidence of direct submit→complete without intermediary approval stages |
| **Unknown** | Insufficient evidence to determine. Needs business confirmation or source analysis | Mark exactly what is unclear and what confirmation is needed |

---

## Evidence Sources (Priority Order)

1. **Power Apps source code** — Submit handlers, status transitions, button visibility, role checks (`src/pages/`, `src/hooks/`, `src/services/`)
2. **Form schemas** — `workflow` sections in `src/form-schemas/*.json`
3. **SharePoint lists** — Status columns, approver columns, workflow stage columns
4. **Domino routing rules** — `ioicodeapp/IT_Routing_Rules_Documentation.md`
5. **Domino DXL source** — Section access formulas, action button hide-when, agent code
6. **Migration analysis** — `analysis/workflow-analysis.md`, `docs/central-form-reference.md`

---

## Per-Form Approval Classification

### Batch 1: EAF (External Access Form)

| Item | Detail |
|---|---|
| **Approval Classification** | **Approval Required** |
| **Evidence** | `src/pages/it/forms/eaf/new.tsx`, `src/form-schemas/EAF.json`, `ioicodeapp/IT_Routing_Rules_Documentation.md` |
| **Workflow Stages** | Draft → Submitted → HOD Approval → COO/Director Approval → Done |
| **Status Values** | `Draft`, `Submitted`, `HOD_Approved`, `HOD_Rejected`, `COO_Approved`, `COO_Rejected`, `Completed` |
| **Approval Actors** | Dept Head (HOD), COO or Director (routing depends on `isPCN` flag) |
| **Submit Behavior** | Creates parent `MainDB_IT` record + extension `MainDB_IT_Ext_Access` record. Sets status to `Submitted`. Notifies Dept Head. |
| **Draft Behavior** | Saves to `MainDB_IT` with status `Draft`. Editable by submitter only. |
| **Edit Behavior** | Submitter can edit in Draft. Approvers can edit approval fields only. Admin can edit any field. |
| **Rejection Behavior** | Rejected by HOD → back to submitter with comments. Rejected by COO/Director → back to HOD. |
| **Section Visibility** | See `docs/05_SECTION_VISIBILITY_RULES.md` |
| **Missing Confirmation** | — |

### Batch 1: ITSSR (IT Support & Service Request)

| Item | Detail |
|---|---|
| **Approval Classification** | **No Approval Required** |
| **Evidence** | `src/features/itssr/itssr-app.tsx`, `src/form-schemas/ITSSR.json`, `ioicodeapp/IT_Department_ITSSR_Detailed_Requirements.md` |
| **Workflow Stages** | Draft → Submitted → Assigned → In Progress → Resolved → Closed |
| **Status Values** | `Draft`, `Submitted`, `Assigned`, `InProgress`, `Resolved`, `Closed` |
| **Submit Behavior** | Creates parent `MainDB_IT` record + extension `MainDB_IT_Ext_Support` record. IT PIC can assign, resolve, close. No approval gate. |
| **Draft Behavior** | Saves to `MainDB_IT` with status `Draft`. |
| **Edit Behavior** | Submitter can edit in Draft. IT PIC can update status and add resolution. Requestor can accept/reject resolution (close ticket). |
| **Notes** | ITSSR is a service desk ticket system, not an approval workflow. No approver role exists. |
| **Missing Confirmation** | — |

### Batch 1: HI (Hardware Inventory)

| Item | Detail |
|---|---|
| **Approval Classification** | **No Approval Required** |
| **Evidence** | `src/pages/it/forms/hi/new.tsx`, `src/form-schemas/HI.json` |
| **Workflow Stages** | Draft → Submitted → Completed |
| **Status Values** | `Draft`, `Submitted`, `Completed` |
| **Submit Behavior** | Creates `MainDB_IT` record. Direct completion — no approval gate. |
| **Draft Behavior** | Saves with status `Draft`. |
| **Edit Behavior** | Submitter can edit in Draft. Admin can edit after submission. |
| **Notes** | Hardware Inventory is a record-keeping form, not a workflow. No approver fields or approval logic in code. |
| **Missing Confirmation** | — |

---

### Remaining IT Forms — Quick Classification

| Form Code | Form Name | Classification | Evidence Basis | Status |
|---|---|---|---|---|
| SAPCR | SAP Change Request | **Approval Required** | `workflow-analysis.md` — multi-stage with BPO/IT approval | ⚠️ Needs code review |
| SAPAMR | SAP Authorisation Matrix | **Approval Required** | `workflow-analysis.md` — review cycle with TBV/TBA approval | ⚠️ Needs code review |
| SAPTR | SAP Transport Request | **Approval Required** | `workflow-analysis.md` — basis/admin approval stages | ⚠️ Needs code review |
| SAPCA | SAP Config Access | **Approval Required** | `workflow-analysis.md` — access approval workflow | ⚠️ Needs code review |
| SAPDRP | SAP DRP | **Unknown** | Insufficient code evidence | 📌 Needs business confirmation |
| SAPSLCF | SAP Storage Location | **Unknown** | `workflow-analysis.md` mentions `txtHDocStatus` state field | 📌 Needs business confirmation |
| NIR | Notes ID Request | **Approval Required** | `IT_Routing_Rules_Documentation.md` — multi-stage with HOD/IT approval | ⚠️ Needs code review |
| RS | Reset Password | **Approval Required** | `IT_Routing_Rules_Documentation.md` — requires IT manager approval | ⚠️ Needs code review |
| UR | User ID Request | **Unknown** | Limited code evidence | 📌 Needs business confirmation |
| ITSC | IT Server Checklist | **No Approval Required** | Record-keeping form pattern | ⚠️ Needs code review |
| SFAR | Share Folder Access | **Approval Required** | `IT_Routing_Rules_Documentation.md` — folder access approval | ⚠️ Needs code review |
| DCALOG | Data Center Access Log | **No Approval Required** | Log entry form | ⚠️ Needs code review |
| IOIPOL | IOI Policy | **Approval Required** | Policy acknowledgment workflow | ⚠️ Needs code review |
| ISGDOC | IT Procedures | **No Approval Required** | Document upload/record | ⚠️ Needs code review |
| ITINFO | IT Info | **No Approval Required** | Information record | ⚠️ Needs code review |
| ITDR | IT Report | **No Approval Required** | Report submission | ⚠️ Needs code review |
| ITDR2 | IT Report v2 | **No Approval Required** | Report submission | ⚠️ Needs code review |
| ITDAILYRPT | IT Daily Report | **No Approval Required** | Daily log | ⚠️ Needs code review |
| PRF | Program Request Form | **Approval Required** | `workflow-analysis.md` — multi-stage IT approval | ⚠️ Needs code review |
| INTUATSOF | IntuatSOF | **Unknown** | Limited evidence | 📌 Needs business confirmation |
| SILOUATSOF | SilouatSOF | **Unknown** | Limited evidence | 📌 Needs business confirmation |
| TRNMAN | Training Manuals | **No Approval Required** | Document management | ⚠️ Needs code review |
| ITEVT | IT Event Record | **No Approval Required** | Legacy event log | ⚠️ Legacy — custom component |
| SVRREBOOT | Server Reboot | **No Approval Required** | Legacy record | ⚠️ Legacy — custom component |
| PWDRESET | Password Reset | **No Approval Required** | Legacy — superseded by RS | ⚠️ Legacy schema only |
| MRF | Material Requisition | **Approval Required** | Multi-stage procurement approval | ⚠️ Needs code review |
| MPSPRN | MPS Printer Request | **Unknown** | Limited evidence | 📌 Needs business confirmation |

---

## Approval Detection Rules

When auditing a form for the first time, check these signals:

### Signals for "Approval Required"
- Code contains approval button handlers (`handleApprove`, `handleReject`)
- SharePoint list has approver columns (`ApprovedBy`, `HOD_Email`, `ApprovalStatus`)
- Form schema has `workflow` section with multiple stages and role assignments
- Page code imports `useApprovalWorkflow` or `useWorkflowEngine`
- Status field has values like `Submitted`, `Pending_Approval`, `Approved`, `Rejected`
- Role checks gate UI sections (`if (role === 'approver')`)
- Domino source has `CurrentAction` field with multi-state transitions

### Signals for "No Approval Required"
- Single submit action creates record with `Completed` or `Submitted` status
- No approver fields in SharePoint list
- No approval button handlers in code
- Status transitions are work-in-progress states (Assigned → In Progress → Resolved) not approval gates
- Form schema shows `"approvalRequired": false` or no workflow section
- Domino source has simple status field with no routing logic

### When "Unknown"
- Evidence is contradictory between sources
- Only Domino evidence exists, no M365 code yet
- Form has status field but no clear approver role
- Form is legacy with custom component (not DynamicForm)
- Business process not yet confirmed with stakeholders

---

## Related Documents

- `docs/05_SECTION_VISIBILITY_RULES.md` — Section visibility per role/status
- `docs/08_AUDIT_TEMPLATE.md` — Audit output format
- `docs/09_BATCH_DEVELOPMENT_PLAN.md` — Batch schedule
- `ioicodeapp/IT_Routing_Rules_Documentation.md` — Domino routing rules source
- `analysis/workflow-analysis.md` — Domino workflow analysis
