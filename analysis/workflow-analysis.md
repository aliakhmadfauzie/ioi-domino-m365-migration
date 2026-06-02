# Workflow Analysis

> **Generated**: 2026-05-31 from Domino DXL/XML analysis

---

## 1. External Access Form (VPN & Citrix) — `vpnaccess`

> **Cross-Reference**: M365 status value mappings are in `docs/04_WORKFLOW_APPROVAL_RULES.md`.
> | Domino `CurrentAction` | M365 Status Value | Description |
> |---|---|---|
> | `Request` | `Draft` | User filling form |
> | `Submitted` | `Submitted` | Sent for approval |
> | `Acceptance1` / `status1=Accepted` | `HOD_Approved` | HOD approved |
> | `Rejected1` / `status1=Rejected` | `HOD_Rejected` | HOD rejected |
> | `Acceptance2` / `status2=Accepted` | `COO_Approved` | COO/Director approved |
> | `Rejected2` / `status2=Rejected` | `COO_Rejected` | COO/Director rejected |
> | `Done` | `Completed` | Final state |

**Database**: External Access Form (VPN & Citrix)
**Source**: `source/pdf/XML_IT_Penang/EAF_all_dxl.xml`

### Workflow States
```
Request → Submitted → Acceptance1 (HOD) → Acceptance2 (COO/Director) → Done
                          ↘ Rejected1 ↙          ↘ Rejected2 ↙
```

### Stage Details

| Stage | Status Field | Action | Performed By | Email Notification |
|---|---|---|---|---|
| **Draft** | CurrentAction="Request" | User fills form | Requestor | — |
| **Submitted** | CurrentAction="Submitted" | Send for Approval | Requestor | Sent to Dept Head |
| **HOD Approval** | CurrentAction="Acceptance1", status1="Accepted" | Approved by HOD | Dept Head | Sent to Requestor + COO/Director |
| **HOD Rejection** | CurrentAction="Rejected1", status1="Rejected" | Rejected by HOD | Dept Head | Sent to Requestor |
| **COO/Director Approval** | CurrentAction="Acceptance2", status2="Accepted" | Approved | COO (if isPCN=1) or Director | Sent to ISG Manager + Others |
| **COO/Director Rejection** | CurrentAction="Rejected2", status2="Rejected" | Rejected | COO/Director | Sent to SendTo list |
| **Complete** | CurrentAction="Done" | Accepted | Final Approver | — |

### Key Fields
- `currentaction` — Tracks workflow state
- `status1-4` — Approval status per stage
- `date1-5` — Timestamp for each stage
- `comment1-4` — Approval comments
- `HODNAME`, `DIVNAME`, `name4`, `name5` — Approver names
- `isPCN` — Determines if COO or Director approval path
- `depthead` — Department Head (first approver)
- `HApp` — Higher Approval (second approver)
- `req` — Requestor name
- `IsMgr`, `IsMgr2`, `IsMgr3` — Manager flags

### Domino Agents
| Agent | Trigger | Action |
|---|---|---|
| Clear | Action menu | Clears date fields |
| Refresh Docs | Action menu | Refreshes document views |
| RemAllPdg | Action menu | Removes pending flags |
| Set | Action menu | Sets field values |
| DBNSF | Action menu | Database operations |

### Target Power Automate
| Domino Action | M365 Equivalent |
|---|---|
| `@MailSend(depthead;...)` | Power Automate: Send email with approval link |
| Approval buttons | Power Automate: Approval connector (First to respond) |
| `currentaction` state machine | SharePoint Status column + Power Automate condition switches |
| `isPCN` conditional routing | Power Automate: Condition on field value |
| `@DialogBox("EnterComments1")` | Power Apps: Comments screen or Power Automate: Approval comments |

---

## 2. IT Support & Service Request (SSR) — `RemSSR`

**Database**: IT Support & Service Request (SSR) 2026
**Source**: `source/pdf/XML_IT_Penang/ITSSR_all_dxl.xml`

### Workflow States
```
Draft → Request → (ISG Processing) → Resolved/Closed
```

### Key Fields
- `CaseNo` — Auto-generated case number
- `INO` — Auto-numbering via agent
- `ReportedBy` — Reporter name
- `CreationDate` — Date created
- `CA` — Category (used in view selection formula: `SELECT CA ="Request"`)

### Domino Agents
| Agent | Trigger | Action |
|---|---|---|
| INO | Action menu | Auto-numbering (`field='INO' value='0121'`) |

### Target Power Automate
- Auto-numbering via SharePoint ID column or calculated column
- Category-based routing via Power Automate condition

---

## 3. Program Request Form (PRF) — `RemPRF`

**Database**: Program Request Form (PRF) 2026
**Source**: `source/pdf/XML_IT_Penang/PRF_all_dxl.xml`

### Workflow States
```
Draft → Submitted → ISG Review → Approval
```

### Domino Agents
| Agent | Trigger | Action |
|---|---|---|
| INO | Action menu | Auto-numbering (`value='0006'`) |
| SET | Action menu | Sets `AppBy_ISG='Kelly'`, `dateapp2` |
| HR | Action menu | Sets `RemTo` field |
| Clear | Action menu | Clears `datesent` field |
| Refresh Docs | Action menu | Document refresh |
| Private agents | Action menu | Personal agent scripts |

### Target Power Automate
- Auto-numbering via SharePoint ID
- ISG assignment automation
- HR notification routing

---

## 4. SAP & WB Change Request — `ChangeForm`

**Database**: SAP & WB Change Request Form
**Source**: `source/pdf/XML_IT_Penang/SAPCR_all_dxl.xml`

**Note**: 54 fields, multi-stage approval. Details to be extracted from XML.

---

## 5. SAP Sign Off Form — `SignOffForm-Ori`

**Database**: SAP Sign off Form
**Source**: `source/pdf/XML_IT_Penang/SAPSOF_And_SAPSOF2_all_dxl.xml`

**Note**: 385+ fields — the largest form. Contains complex multi-department sign-off workflow.

---

## Summary of Workflow Forms

| Form | CurrentAction | Stages | Approval Chain | Complexity |
|---|---|---|---|---|
| **EAF (VPN/Citrix)** | ✅ Yes | 5 | Requestor → HOD → COO/Director | Medium |
| **ITSSR (Support)** | ✅ Yes | 3 | Requestor → ISG Team | Low |
| **PRF (Program)** | ✅ Yes | 4 | Requestor → ISG → Manager | Medium |
| **IAL (Activity Log)** | ✅ Yes | 2 | IT Team only | Low |
| **ISGInfo** | ✅ Yes | 2 | Information only | Low |
| **ChangeForm (SAP)** | ✅ Yes | 4+ | Multi-department | High |
| **SignOffForm (SAP)** | ✅ Yes | 5+ | Multi-department sign-off | Very High |
| **SFAR (Share Folder)** | ✅ Yes | 3 | Requestor → IT Admin | Low |
