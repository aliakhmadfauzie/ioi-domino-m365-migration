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
