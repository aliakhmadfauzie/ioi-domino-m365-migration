# Power Automate Design

> **Generated**: 2026-05-31
> **Connectors**: SharePoint, Microsoft 365 Users, Approvals, Mail
> **Domino Sources**: EAF workflow, ITSSR auto-numbering, PRF approval, SAP change routing

---

## Flow 1: EAF Multi-Stage Approval (Replace Domino @MailSend Workflow)

### Trigger
When an item is created or modified in **MainDB_IT** where `CurrentStatus` changes.

### Actions

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | **Trigger**: When an item is created or modified | SharePoint | Filter: CurrentStatus changed |
| 2 | **Condition**: Check CurrentStatus | — | Switch on workflow stage |
| 3 | **If Submitted**: Send approval to HOD | Approvals | Assignment: depthead |
| 4 | **If HOD Approved**: Check isPCN, route to COO or Director | Approvals | Conditional routing |
| 5 | **If Approved**: Update status to "Completed" | SharePoint | Patch item |
| 6 | **If Rejected**: Send rejection email | Mail | Notify requestor |
| 7 | **Always**: Send email notification with doc link | Mail | Replaces @MailSend + doclink |

### Domino Agent Being Replaced
- `@MailSend(depthead;CC;...; [IncludeDoclink])` — Send for Approval
- `@MailSend(HApp;Requestor;...; [IncludeDoclink])` — HOD Approved notification
- `@MailSend(IsMgr;SendTo;...; [IncludeDoclink])` — COO/Director approved

### Workflow Logic (Domino → Power Automate)

| Domino Formula | Power Automate Equivalent |
|---|---|
| `FIELD CurrentAction := "Submitted"` | Update item: CurrentStatus = "Submitted" |
| `@MailSend(depthead;CC;...)` | Start an approval: Assign to Dept Head |
| `@If(isPCN="1";"COO";"Director")` | Condition: isPCN equals yes → COO approval |
| `@DialogBox("EnterComments1")` | Approval comments (built-in) |
| `FIELD HODNAME := @Name([CN];@UserName)` | Update item: ApprovedBy |
| `@Command([FileSave])` | SharePoint Update item action |

---

## Flow 2: Auto-Numbering (Replace Domino INO Agent)

### Trigger
When an item is created in **MainDB_IT**.

### Actions

| Step | Action | Connector |
|---|---|---|
| 1 | **Trigger**: When an item is created | SharePoint |
| 2 | **Get last request number** | SharePoint (filter by RequestID, order desc, top 1) |
| 3 | **Increment and format** | Compose (`REQ-{yyyymmdd}-{seq}`) |
| 4 | **Update RequestID field** | SharePoint |

### Domino Agent Being Replaced
- `field='INO' value='0121'` — SimpleAgent: Modify field

---

## Flow 3: ITSSR Category Routing

### Trigger
When an item is created in **MainDB_IT** where `FormCode = "ITSSR"`.

### Actions

| Step | Action | Connector |
|---|---|---|
| 1 | **Trigger**: When an item is created | SharePoint |
| 2 | **Get manager info** | Microsoft 365 Users |
| 3 | **Assign to IT team** | SharePoint update |
| 4 | **Send notification** | Mail |

---

## Flow 4: Hardware Inventory — Audit Reminder

### Trigger
Recurrence (monthly).

### Actions

| Step | Action | Connector |
|---|---|---|
| 1 | **Recurrence**: Monthly | Schedule |
| 2 | **Get items where LastAuditDate > 6 months** | SharePoint |
| 3 | **Send reminder email** | Mail |
| 4 | **Create follow-up task** | SharePoint |

### Domino Agent Being Replaced
- `RemExpiry` agent from Hardware Inventory database

---

## Flow 5: PRF ISG Assignment

### Trigger
When an item is created or modified in **MainDB_IT** where `FormCode = "PRF"` and the item is submitted for ISG review.

### Actions

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | **Trigger**: When an item is created or modified | SharePoint | Filter: PRF items only |
| 2 | **Condition**: Check status | — | Submitted / Pending ISG review |
| 3 | **Assign to ISG** | SharePoint update | Replaces PRF SET agent assignment behavior |
| 4 | **Notify ISG** | Mail | Sends review notification |
| 5 | **Optional HR notification** | Mail | Replaces PRF HR routing when HR is selected |

### Domino Agent Being Replaced
- `SET` agent — sets ISG approval fields
- `HR` agent — sets/reminds HR routing target

---

## Flow 7: SR (Staff Requisition) Multi-Stage Approval — HR DEPARTMENT

### Trigger
When an item is created or modified in **MainDB_HR** where `FormCode = "SR"` and `CurrentStatus` changes.

### Workflow State Machine (from Domino DXL evidence)

```
New (Draft) ──(Submit by Initiator)──► Submitted
                                          │
                             ┌────────────┴────────────┐
                        (HOD Approved)           (HOD Rejected)
                             │                         │
                             ▼                         ▼
                        Requested                   RejHOD
                             │
                        (Div Head Approved)
                             │
                             ▼
                        Reviewed
                             │
                        (HR Endorsed)
                             │
                             ▼
                        Endorsed
                             │
                    ┌───────┴───────┐
               (ED Approved)  (ED Rejected)
                    │               │
                    ▼               ▼
               Approved         RejED
```

### Domino Roles → M365 Mapping

| Domino Role | M365 Equivalent | Actions |
|-------------|-----------------|---------|
| `Editor2` | HOD (Department Head) | Approve/Reject → moves to "Requested" |
| `Editor2a` | Division Head | Approve/Reject → moves to "Reviewed" |
| `Editor3` | HR (Group HR) | Endorse/Reject → moves to "Endorsed" |
| `Editor4` | ED (Executive Director) | Approve/Reject → moves to "Approved"/"RejED" |
| `DocAuthor` | Employee/Requestor | Submit, view own requests |

### Actions

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | **Trigger**: When an item is created or modified | SharePoint | Filter: FormCode = "SR", CurrentStatus changed |
| 2 | **Initialize variables** | — | FormCode, CurrentStatus, ItemID, Requestor, Dept |
| 3 | **Condition**: Check FormCode = SR | — | Route to SR handler |
| 4 | **Switch on CurrentStatus** | — | Dispatch to correct stage |
| 5 | **If Submitted**: Get SR extension + ApproverMatrix | SharePoint | Read Ext_Staffing + Config_ApproverMatrix |
| 6 | **If Submitted**: Send approval to HOD | Approvals | Assign from ApproverMatrix.HODEmail |
| 7 | **If HOD Approves**: Update status to "Requested" | SharePoint | Patch MainDB_HR + Ext_Staffing |
| 8 | **If HOD Rejects**: Update status to "RejHOD" | SharePoint | Patch MainDB_HR + Ext_Staffing |
| 9 | **If Requested**: Send approval to Div Head | Approvals | Assign from ApproverMatrix.DivHeadEmail |
| 10 | **If Div Head Approves**: Update to "Reviewed" | SharePoint | Patch MainDB_HR + Ext_Staffing |
| 11 | **If Reviewed**: Send approval to HR | Approvals | Assign from ApproverMatrix.HREmail |
| 12 | **If HR Endorses**: Update to "Endorsed" | SharePoint | Patch MainDB_HR + Ext_Staffing |
| 13 | **If Endorsed**: Send approval to ED | Approvals | Assign from ApproverMatrix.EDEmail |
| 14 | **If ED Approves**: Update to "Approved" | SharePoint | Completion — notify all parties |
| 15 | **If any Rejection**: Update status & send rejection email | SharePoint + Mail | Notify requestor + relevant approvers |

### Domino Agents Being Replaced
- **DocAuthor** — auto-author assignment
- **RemPdgHOD** — Pending HOD reminder (daily 08:30, view filter: CurrentAction=Submitted)
- **RemPdgHODiv** — Pending Div Head reminder (daily 08:30, view filter: CurrentAction=Requested)
- **RemPdgHR** — Pending HR reminder (daily 08:30, view filter: CurrentAction=Reviewed)
- **RemPdgDirector** — Pending ED reminder (daily 08:30, view filter: CurrentAction=Endorsed)
- **RemPdgDraft** — Pending Draft reminder
- **Set** — Field value set agent
- **Clear** — Field clear agent
- **Clear Submition** — Submission clear agent
- **NextRemDate** — Reminder date advance (+3/+4 workdays)

### Flow File
- `flows/sr-staff-requisition-approval-flow-definition.json`

---

## Flow 8: HR Universal Form Submission & Routing

### Trigger
When an item is created or modified in **MainDB_HR**.

### Purpose
Combined handler for all 42 HR forms (26 Penang + 16 Johor). Performs:
1. **Auto-numbering**: Generate `HR-{YYYYMMDD}-{seq}` ticket IDs on create (replaces Domino INO agents)
2. **Notification routing**: Look up `HR_RoutingMatrix` to find HOD/HR approver emails, send notification with doclink
3. **Status-based emails**: Draft saved confirmation, Submitted notification, Approved completion, Rejected notification

### HR_RoutingMatrix Lookup
The flow reads `HR_RoutingMatrix` list using key `{FormCode}_{Department}` to resolve:
- `HODEmail` — Department Head for first-line routing
- `HREmail` — HR team for HR-related forms
- `DivHeadEmail` — Division Head for escalation
- `EDEmail` — Executive Director for final approval

### Actions

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | **Trigger**: When an item is created or modified | SharePoint | MainDB_HR |
| 2 | **Initialize variables** | — | FormCode, Status, IDs, Site, Dept |
| 3 | **Condition**: Check FormCode is in HR portfolio | — | Filter non-HR forms |
| 4 | **Switch on FormCode_Status** | — | New → Auto-number; Submitted → Notify; etc. |
| 5 | **If New**: Auto-number + notification | SharePoint + Mail | Generate ticket ID, notify HOD/HR |
| 6 | **If Submitted**: Route notification | HR_RoutingMatrix + Mail | Lookup approvers, send doclink |
| 7 | **If Approved/Rejected**: Status notification | Mail | Notify requestor |

### Domino Agents Being Replaced
- INO auto-numbering agents across all HR databases
- @MailSend doclink notifications in SR, EEN, AWHR, PAF, FWWPD, FTCR, CWR, etc.
- Form-specific email agents

### Flow File
- `flows/hr-universal-form-submission-flow-definition.json`

---

## Recommended HR Flow Architecture

```
MainDB_HR
    │
    ├── Flow 7: SR Approval (multi-stage)
    │   ├── Status = "Submitted" → HOD Approval
    │   ├── Status = "Requested" → Div Head Endorsement
    │   ├── Status = "Reviewed" → HR Endorsement
    │   ├── Status = "Endorsed" → ED Final Approval
    │   └── Status = "Approved"/"Rej*" → Complete
    │
    ├── Flow 8: Universal HR Submission & Routing
    │   ├── On Create → Auto-number + notify HOD/HR
    │   ├── On Submit → Route via HR_RoutingMatrix
    │   └── On Complete/Reject → Status notifications
    │
    └── (Future) HR Reminder Escalation
        └── Daily → Check overdue items → Escalate
```

> **Implementation status — Flow 7 & 8**: JSON definitions complete and validated.
> - `sr-staff-requisition-approval-flow-definition.json` — 4-stage approval (HOD → Div Head → HR → ED), all approve/reject branches implemented.
> - `hr-universal-form-submission-flow-definition.json` — Auto-numbering on New, routing notifications on Submitted (non-SR), completion/rejection emails, 3-day overdue reminder.
> - Approver resolution: `Config_ApproverMatrix` (SR) and `HR_RoutingMatrix` (all other forms).

---

## Flow 6: SAPCR Approval Chain

### Trigger
When an item is created or modified in **MainDB_IT** where `FormCode = "SAPCR"` and `CurrentStatus = "Submitted"`.

### Actions

| Step | Action | Connector | Notes |
|---|---|---|---|
| 1 | **Trigger**: When an item is created or modified | SharePoint | Filter: SAPCR submitted items |
| 2 | **Start BPO approval** | Approvals | First SAPCR approval stage |
| 3 | **If BPO approved**: Start IT approval | Approvals | Multi-department routing |
| 4 | **If IT approved**: Start SAP Basis approval | Approvals | Final technical review |
| 5 | **If all approved**: Complete request | SharePoint | Set status to Completed |
| 6 | **If rejected**: Update rejected status and comments | SharePoint + Mail | Notify requestor |

### Domino Agent Being Replaced
- SAP & WB Change Request multi-stage approval / notification logic from `ChangeForm`

---

## Recommended Flow Architecture

```
MainDB_IT
    │
    ├── Flow 1: EAF Approval (multi-stage)
    │   ├── Status = "Submitted" → HOD Approval
    │   ├── Status = "HOD Approved" → COO/Director Approval (conditional)
    │   └── Status = "Approved"/"Rejected" → Complete
    │
    ├── Flow 2: Auto-Numbering
    │   └── On Create → Generate RequestID
    │
    ├── Flow 3: Category Routing
    │   └── On Create with FormType → Assign to Team
    │
    └── Flow 4: Escalation
        └── Daily → Check overdue items → Notify
