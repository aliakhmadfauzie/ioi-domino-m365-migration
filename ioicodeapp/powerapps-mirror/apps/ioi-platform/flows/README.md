# Power Automate Flows — IOI Platform

> **Generated**: 2026-05-31
> **Connectors**: SharePoint, Microsoft 365 Users, Office 365 Outlook, Approvals
> **Decision**: DEC-2026-006 — Solution-aware flows

---

## Flow Inventory

| # | Flow | File | Status | Priority | Replaces Domino Agent |
|---|---|---|---|---|---|
| 1 | **EAF Multi-Stage Approval** | `eaf-approval-flow-definition.json` | 📝 Designed | 🔴 P0 | `@MailSend(depthead;...)`, `@MailSend(HApp;...)` |
| 2 | **Auto-Numbering (INO Replacement)** | `generate-ticket-id.json` | 📝 Designed | 🔴 P0 | INO SimpleAgent |
| 3 | **ITSSR Category Routing** | `itssr-category-routing-flow-definition.json` | 📝 Designed | 🟡 P1 | Category-based view selection |
| 4 | **Hardware Inventory Audit Reminder** | `hardware-inventory-audit-reminder-flow-definition.json` | 📝 Designed | 🟢 P2 | RemExpiry agent |
| 5 | **PRF ISG Assignment** | `prf-isg-assignment-flow-definition.json` | 📝 Designed | 🟡 P1 | PRF SET + HR agents |
| 6 | **SAPCR Approval Chain** | `sapcr-approval-chain-flow-definition.json` | 📝 Designed | 🟡 P1 | Multi-department approval |

---

## Flow 1: EAF Multi-Stage Approval

### Workflow
```
Trigger: MainDB_IT item created/modified where FormCode = "EAF"
  │
  ├── CurrentStatus = "Submitted"
  │     ├── Send Approval to HOD (eAFDeptHeadEmail)
  │     ├── If Approved →
  │     │     ├── Update: CurrentStatus = "HODApproved", WorkflowStage = 2
  │     │     ├── Notify requestor
  │     │     └── Check isPCN →
  │     │           ├── Yes: Route to COO
  │     │           └── No: Route to Division Director
  │     └── If Rejected →
  │           ├── Update: CurrentStatus = "HODRejected"
  │           └── Send rejection email to requestor
  │
  ├── CurrentStatus = "HODApproved"
  │     ├── Wait for COO/Director approval
  │     ├── If Approved → Route to IT Manager
  │     └── If Rejected → Update status, notify
  │
  ├── CurrentStatus = "ITManagerApproved"
  │     └── Route to IT Provisioning
  │
  └── CurrentStatus = "ITProvisioned"
        ├── Update: CurrentStatus = "Completed", WorkflowStage = 5
        └── Send completion email
```

### Domino Equivalence
| Domino Agent/Action | Power Automate Equivalent |
|---|---|
| `@MailSend(depthead;CC;...; [IncludeDoclink])` | Approval connector → HOD |
| `@MailSend(HApp;Requestor;...; [IncludeDoclink])` | Approval connector → COO/Director |
| `@MailSend(IsMgr;SendTo;...; [IncludeDoclink])` | Email notification |
| `FIELD CurrentAction := "Submitted"` | Update item action |
| `@If(isPCN="1";"COO";"Director")` | Condition: isPCN equals Yes |
| `@DialogBox("EnterComments1")` | Approval comments (built-in) |

### Fields Updated by Flow
| SharePoint Column | When | Value |
|---|---|---|
| `CurrentStatus` | Each stage transition | Stage-specific status key |
| `WorkflowStage` | Each approval | 1-5 numeric |
| `HODApprovedBy` | HOD approves | Approver email |
| `HODApprovedDate` | HOD approves | UTC timestamp |
| `HODRemarks` | HOD rejects | Rejection comments |
| `DirectorApprovedBy` | Director approves | Approver email |
| `DirectorApprovedDate` | Director approves | UTC timestamp |
| `DirectorRemarks` | Director rejects | Rejection comments |
| `CompletedDate` | Final stage | UTC timestamp |

---

## Deep-Link Integration with Power Apps

All flows can generate deep links to the Power Apps code-first app. The app
automatically handles these params for auto-navigation and notifications.

### Deep Link Format
```
https://apps.powerapps.com/play/e/{envId}/a/{appId}?formCode=EAF&itemId=123&action=view&status=Submitted
```

### Supported Parameters
| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| `formCode` | string | `EAF` | Target form type |
| `itemId` | number | `123` | SharePoint item ID |
| `action` | enum | `view`, `edit`, `approve`, `new` | What to do |
| `status` | string | `Submitted` | Current status context |
| `department` | string | `it` | Department scope |
| `notification` | string | `Your+request+was+approved` | Toast message |

### Power Automate Expression
```javascript
concat(
  'https://apps.powerapps.com/play/e/Default-c6f6218b-5ff2-48b5-9114-f89da23caadb/a/26fddd33-46a8-43ae-a1f2-e90fa3b003bf',
  '?formCode=', triggerBody()?['FormCode'],
  '&itemId=', string(triggerBody()?['ID']),
  '&action=view',
  '&status=', triggerBody()?['Status']
)
```

## App-Side Handler
The `useAppParams()` hook in `src/hooks/use-app-params.ts` and the
`DeepLinkHandler` component in `src/components/deep-link-handler.tsx`
parse these params and auto-navigate the user to the correct screen.

## Deployment Instructions

1. Create solution in Power Platform (`pac solution init`)
2. Add flows as solution-aware cloud flows
3. Configure SharePoint connection reference
4. Configure Office 365 connection reference
5. Configure Approvals connection reference
6. Set environment variables for:
   - SharePoint site URL
   - IT Manager email
   - IT Provisioning team email
7. Export as managed solution for deployment

## Local Definition Status

The files in this folder are local flow definitions prepared from the migration documentation. They still need to be created or imported in the target Power Automate environment:

- `eaf-approval-flow-definition.json`
- `generate-ticket-id.json`
- `itssr-category-routing-flow-definition.json`
- `hardware-inventory-audit-reminder-flow-definition.json`
- `prf-isg-assignment-flow-definition.json`
- `sapcr-approval-chain-flow-definition.json`

Use `flow-deployment-manifest.json` as the deployment checklist for the target environment `Default-c6f6218b-5ff2-48b5-9114-f89da23caadb`.

## Custom Connector Definitions

- `mcp-registry-power-automate-swagger.json` — Swagger 2.0 custom connector definition for the official MCP Registry read API. This is prepared for Power Automate/Power Apps custom connector import and exposes read-only discovery actions:
  - List MCP servers
  - List MCP server versions
  - Get MCP server version
