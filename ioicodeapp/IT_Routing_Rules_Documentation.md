# IT Database — Workflow Routing Rules, Roles & Section Access
## Lotus Notes / Domino — All Modules

**Source:** DXL XML deep analysis (action buttons, section access formulas, agent LotusScript)  
**Extraction Date:** 22 May 2026  
**Sites:** Johor (PanCen) · Penang (IOI Penang / Oleo Local)

---

## How to Read This Document

### State Field
Each module uses one of two patterns for workflow state:
- **`CurrentAction`** — a text/keyword field whose value drives all routing logic
- **`txtHDocStatus`** — used in Storage Location forms (single-character codes)
- **`status`** — used in Hardware Inventory (no routing, just record status)

### Section Access Pattern
All editable sections use `accessfieldkind='computed'` with a formula that returns a list of Notes usernames / groups allowed to edit. The formula follows this template:

```
@If(CurrentAction = "SomeState"; EditorGroupName; "Nobody") : ISAdminGroup
```

This means: only members of `EditorGroupName` can edit the section when the document is in `SomeState`. `ISAdmin`/admin always retains access. All others see the section as read-only.

### Button Visibility Pattern
Action buttons use `<code event='hidewhen'>` with the convention:
```
@IsNotMember(@UserName; RoleGroup) | CurrentAction != "ExpectedState"
```
A button is **shown** (not hidden) only when the user is in the right group **and** the document is in the right state.

### Reminder Agent Pattern (shared across modules)
All scheduled reminder agents share this architecture:
1. Query a dedicated `_Rem` view filtered by `CurrentAction` and a date field
2. For each matching doc, send a reminder email
3. Advance the reminder date by **+3 workdays** (+4 if current day is Thu/Fri/Sat)
4. Reminders continue indefinitely until the document advances to the next state

---

---

# SITE: JOHOR (PanCen)

---

## Module 1 — PanCen Hardware Inventory (`HWInv.nsf`)

### Workflow Model
Hardware Inventory does **not** use a `CurrentAction` routing pattern. Records are tracked by a `status` keyword field with no automated email routing.

### Status Values

| Status | Meaning |
|---|---|
| ACTIVE | In use |
| MISSING | Cannot be located |
| SCRAP | Decommissioned |
| UNALLOCATED DESKTOP / UNALLOCATED NOTEBOOK | Available, not assigned |
| SPARE NOTEBOOK | Spare pool |

### Form: `NewInv` — Action Buttons

| Button | Visible When | Action |
|---|---|---|
| Edit Document | Always (read mode only) | Opens document for editing |
| Save | Edit/preview mode | Saves MachineAuthor, DateModified; assigns INO if not set; saves & closes |

**Running Number Assignment (`querysave`):**
- Checks view `lookup` (sorted by INO descending)
- If `INO` is blank and `TagNo` is blank: assigns next 3-digit zero-padded number (e.g., `001`, `002`)
- INO is then locked (not re-generated on subsequent saves)

### Form: `Checklist` — Software Installation Checklist

| Button | Role Required | State Condition | Action |
|---|---|---|---|
| **Completed by IT** | Member of `Editor1` | Checklist items filled, Owner set | Sets `DateSetup = @Now`; sends completion mail to Owner (cc ITPIC) |
| **Accept** | Member of `Editor2` | After IT completes | Sets `OwnerName`, `DateAccept = @Now`; sends acceptance mail to ITPIC (cc Owner) |

**Implicit States (date-field driven):**

| State | Condition |
|---|---|
| Pending IT Setup | `DateSetup` is blank |
| Pending Owner Acceptance | `DateSetup` set, `DateAccept` blank |
| Completed | Both `DateSetup` and `DateAccept` set |

### Section Access Rules

| Section Name | Access Field | Edit Access Formula |
|---|---|---|
| PC Hardware List | `Status__` | `Authors:IT` — requestor + IT group |
| General Info | `Status2` | `Authors:IT` — same |
| Checklist (Checklist form) | `No.` | `Editor1:ADMIN` — IT completion only |

### Scheduled Agents

| Agent | Schedule | Trigger Condition | Action |
|---|---|---|---|
| **RemExpiry** | Daily 10:00 (weekdays) on PHBSVR | View `SoftChecklist\PdgAccept` (DateAccept blank) | Sends reminder to `Owner` (cc `ITPIC`): "Software Installation Checklist Reminder – Pending Acceptance" |

---

## Module 2 — PanCen SAP Disaster Recovery (`SAPDR_PanCen.nsf`)

### State Machine — Form: `SAP_DR Issue`

```
[Request] ──(Submit by Requestor)──► [Submitted]
                                           │
                              (Reply by IT/Editor2)
                                           │
                                           ▼
                                      [Responded]
                                           │
                              (Acceptance by Editor3)
                                    ┌──────┴──────┐
                              CPA=Accepted    CPA=Rejected
                                    │               │
                                    ▼               ▼
                               [Accepted]      [Submitted] ◄─ loops back
                                    │
                         (Send Implementation by Editor4)
                              ┌─────┴─────┐
                         Open/Pending  Completed
                              │               │
                              ▼               ▼
                          [Accepted]       [Closed]
                        (stays open,
                       advances follow-up date)
```

### CurrentAction State Transitions

| From State | To State | Triggered By | Actor | Validation Required |
|---|---|---|---|---|
| *(new doc)* | `Request` | Document creation | Any authorised user | — |
| `Request` | `Submitted` | **Submit** button | Member of `Requestor1` | Plant, Dept, Recipient, BPO names, DR Date, SAP Process checked, DR Issue text |
| `Submitted` | `Responded` | **Reply** button | Member of `Editor2` | COP (cause), Pa (corrective action), Whom (PIC), When (date); optional Pa_1/Whom_1/When_1 |
| `Responded` | `Accepted` | **Acceptance** button (CPA=Accepted) | Member of `Editor3` | CPA radio must be set |
| `Responded` | `Submitted` | **Acceptance** button (CPA=Rejected) | Member of `Editor3` | CPA = "Rejected" |
| `Accepted` | `Accepted` | **Send Implementation** (NewStatus=Open) | Member of `Editor4` | FollowUpDate required if Open |
| `Accepted` | `Closed` | **Send Implementation** (NewStatus≠Open) | Member of `Editor4` | — |

### Form: `SAP_DR NoIssue` — Simplified (one-shot)

| From State | To State | Triggered By | Actor |
|---|---|---|---|
| `Request` | `Submitted` | **Submit** button | Member of `Requestor1` |

No Reply/Acceptance steps. Submission sends a notification only.

### Action Button Visibility Rules

| Button | Hidden When (shown to) |
|---|---|
| **Submit** | Hidden unless: `@IsMember(@UserName; Requestor1)` AND `CurrentAction = "Request"` |
| **Reply** | Hidden unless: `@IsMember(@UserName; Editor2)` AND `CurrentAction = "Submitted"` |
| **Acceptance** | Hidden unless: `@IsMember(@UserName; Editor3)` AND `CurrentAction = "Responded"` |
| **Send Implementation** | Hidden unless: `@IsMember(@UserName; Editor4)` AND `CurrentAction = "Accepted"` AND `CurrentAction ≠ "Closed"` |

### Section Access Rules

| Section | Access Field | Edit Access Formula | Contains |
|---|---|---|---|
| **Initiation** | `Initiator` | `Requestor1` | Plant, Dept, Recipient, BPO, DR Date, SAP Process, DR Issue, Attachment |
| **Reply** | `Response_from_IT` | `@If(CurrentAction="Submitted"; Editor2; "Nobody") : ISAdmin` | Date Replied, CC2, Cause, Corrective Actions table, Attachment |
| **User Acceptance** | `User_Acceptance` | `@If(CurrentAction="Responded"; Editor3; "Nobody")` | CPA radio, Date, Accepted By, Comments, Attachment |
| **Follow Up / Implementation** | `FOLLOW_UP___IMPLEMENTATION___` | `@If(CurrentAction="Accepted"; Editor4; "Nobody")` | NewStatus, Comments, Verified Date/By, Follow-Up Date |

### Key Field Hide-When Rules

| Field | Hidden When |
|---|---|
| `When_1` (2nd corrective action date) | `Pa_1 = ""` — second row only shown when first extra action is filled |
| `nmFirstCC` (CC field) | `@IsNotMember(@UserRoles; ISAdmin)` — admin visibility only |
| `FollowUpDate` | `NewStatus ≠ "Open"` — only relevant for Open/pending implementation |

### Section Visibility (hide-when on sections)

Sections **Reply**, **User Acceptance**, and **Follow Up** each carry a hide-when that hides them from view until the document reaches the appropriate state. Users at earlier stages see the section as collapsed/hidden entirely.

### Email Routing Summary

| Transition | Sent To | CC |
|---|---|---|
| Submit (DR Issue) | `Recipient1` (IT team) | `CC1` + `nmFirstCC` (BPOs + IT Team) |
| Reply | `Requestor1` | `nmFinalCC` |
| Acceptance – Accepted | `Requestor1` | `nmFinalCC` |
| Acceptance – Rejected | `SendToRej` + `Recipient1` | — |
| Send Implementation (Open) | `Recipient1` | `nmFinalCC` |
| Send Implementation (Completed) | `Recipient1` | `nmFinalCC` |
| Submit (DR No Issue) | `Recipient1` | `CC1` + `nmFirstCC` |

### Scheduled Reminder Agents

| Agent | Schedule | State Monitored | Sends To | Advances Field |
|---|---|---|---|---|
| **PdgReply** | Daily 08:30 | `CurrentAction = "Submitted"` AND `Rem_ReplyDate ≤ today` | `Recipient1` (cc `CC1`) | `Rem_ReplyDate` +3/+4 workdays |
| **PdgAcceptance** | Daily 08:30 | `CurrentAction = "Responded"` AND `CPA = ""` AND `Rem_NewAcceptDate = today` | `Requestor1` (cc `CC`) | `Rem_AcceptDate` +3/+4 workdays |
| **PdgImp** | Daily 08:30 | `NewStatus = ""` or `"Open"` AND `FollowUpDate = today` | `Requestor1` (cc `CC`) | `Rem_FollowUpDate` +3/+4 workdays |

---

## Module 3 — PanCen Storage Location Creation Form (`SAPSLoc.nsf`)

### Workflow State Field: `txtHDocStatus`

### State Machine — Form: `External Storage Location`

```
[I: Draft] ──(Send by Requestor)──► [A: Pending ISG Action]
                                           │
                              ┌────────────┴────────────┐
                         (Notify Prod              (Reject
                          by ISG)                  by ISG)
                              │                         │
                              ▼                         ▼
                   [C: Pending Production]        [RISG: Rejected]
                              │
                   (Completed by Prod)
                              │
                              ▼
                      [D: Closed/Completed]
```

### State Machine — Form: `Internal / Tank Form` (extended approval chain)

```
[I: Draft] ──(Send by Requestor)──► [A: Pending HOD Approval]
                                           │
                              (HOD approves → Approved1/2/3)
                                           │
                                    [Approved3: Pending ISG]
                                           │
                              ┌────────────┴────────────┐
                         (Notify Prod              (Reject by ISG)
                          by ISG)                        │
                              │                          ▼
                   [C: Pending Production]         [RISG: Rejected]
                              │
                   (Completed by Prod)
                              │
                              ▼
                      [D: Closed/Completed]
```

### txtHDocStatus Code Reference

| Code | Display Label | Meaning |
|---|---|---|
| `I` | Draft | Initial draft; not yet submitted |
| `A` | Pending Action by ISG Department | Submitted; awaiting IT action |
| `C` | Pending Action from Production | IT done; awaiting Production to extend material codes |
| `D` | Closed/Completed | Fully processed |
| `RISG` | Rejected by ISG | Rejected by IT department |
| `Approved1/2/3` | (Tank form) Multi-level HOD approval states | — |

### Action Button Visibility Rules

| Button | Visible To | State Condition |
|---|---|---|
| **Save As Draft** | Original requestor (`authorReqBy`) | `txtHDocStatus = "I"` (draft only) |
| **Send** | Original requestor (`authorReqBy`) | `txtHDocStatus = "I"` |
| **Notify Prod** | ISG Section member (`txtHCpISGSec`) | `txtHDocStatus = "A"` (External) or `"Approved3"` (Tank) |
| **Completed by Prod** | Member of `ProdMail` group | `txtHDocStatus = "C"` |
| **Reject** | ISG Section member (`txtHCpISGSec`) | `txtHDocStatus = "A"` |

### Section Access Rules

| Section | Access Field | Edit Access Formula | Contains |
|---|---|---|---|
| **Requestor** | `Req_Sec` | `txtHCpReqSec : namesHCpISGAdmin` | Request No, Requestor details, Plant Code, Storage Location fields, Remarks |
| **IT (ISG)** | `ISG_Sec` | `txtHCpISGApp` (the IT approver once assigned) | Plant Code (IT), Loc Code (IT), Description, Activate flag, Rejection Remarks, Approver Name/Date |
| **Production Use** | `Production_Use_1` | `ProdMail` group | Extended Status (Yes/No), Production Remarks, Extended By/Date |
| **Hidden Admin** | `ISG_Hidden_Sec` | `namesHCpISGAdmin` (admins only) | Running No (`txtRunNo`), Document Status (`txtHDocStatus` — editable by admin), ISG Admin field |

**Section Visibility (hide-when):**
- **IT** and **Production** sections: hidden when `txtHDocStatus` is in `"I"`, `"S"`, `"P"`, `"RFin"`, `"RDiv"`, `"D"`, `"RDep"` (draft and terminal states)

### Key Field Hide-When Rules

| Field | Hidden When |
|---|---|
| `txtLocAdd1` (Storage Location Description) | `cboAreaType = "Internal Area"` |
| `cboUllage` (Tank Ullage StockTake) | `cboAreaType = "Internal Area"` |
| `txtRemarks` (IT Remarks) | Draft / terminal state OR `txtRejRem ≠ ""` |
| `txtRejRem` (Rejection Remarks) | Draft / terminal state |
| `dtSubmittedTimestamp` | `dtSubmittedTimestamp = ""` (hidden until submitted) |
| `txtReqNo` (Request No) | `txtReqNo = ""` (hidden until assigned) |
| `txtActivate` (Activate Auth Check) | `@Date(@Created) < @Date(2023;7;1)` — legacy records pre-July 2023 |

### Email Routing Summary

| Transition | Sent To | CC | Subject Pattern |
|---|---|---|---|
| Send (Submit) | `txtHCpISGSec` (ISG Section) | `namesDepHead` (Dept Head) | "New Storage Location Creation Form: [ReqNo] – Pending for ISG Action" |
| Notify Prod | `ProdMail` (Production) | `authorReqBy`, `NotifyAll`, `CKC` | "… For Production's action to extend to relevant materials" |
| Completed by Prod | `NotifyAll` | `authorReqBy`, `CKC` | "… Extended status: [Yes/No]" |
| Reject | `authorReqBy` (Requestor) | `@UserName` (ISG) | "… Rejected by ISG" |
| Send (Tank form) | `hodName` (HOD) | — | "Tank – [creationType] Form: [ReqNo] – Need your Approval" |

### Scheduled Agents

No scheduled reminder agents in this database. All notifications are triggered by action buttons only.

---

---

# SITE: PENANG (IOI Penang / Oleo Local)

---

## Module 4 — External Access Form / VPN & Citrix (`vpnaccess.nsf`)

### State Machine — Form: `vpnaccess`

```
[Request: Draft]
       │
  (Submit by Requestor / req group)
       │
       ▼
  [Submitted: Pending HOD]
       │
  ┌────┴──────────────┐
(Approved by HOD)  (Rejected by HOD)
  │                        │
  ▼                        ▼
[Acceptance1:        [Rejected1: terminal]
 Pending COO/ED]
  │
  │  Note: if depthead is COO member, COO step skipped
  │
  ┌────┴──────────────┐
(Approved by HApp)  (Rejected by HApp)
  │                        │
  ▼                        ▼
[Acceptance2:        [Rejected2: terminal]
 Pending IT Manager]
  │
  ┌────┴──────────────┐
(Accepted by IsMgr) (Deny by IsMgr)
  │                        │
  ▼                        ▼
[Done:               [Rejected: terminal]
 Pending IT Staff]
  │
  ┌────┴──────────────┐
(Completed by IT)  (Rejected by IT)
  │                        │
  ▼                        ▼
[Closed: terminal]   [Denied: terminal]
```

### CurrentAction State Transitions

| From | To | Button | Actor (group/field) | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | default |
| `Request` | `Submitted` | **Send for Approval** | `req` (requestor) | Sets `date1=@Today`; mails `depthead` (To), `CC` (CC), `IsMgr` (BCC) |
| `Submitted` | `Acceptance1` | **Approved by HOD** | `depthead` field | Sets `status1="Accepted"`, `date2`, `HODNAME`; opens `EnterComments1` dialog; mails `HApp` |
| `Submitted` | `Rejected1` | **Rejected by HOD** | `depthead` field | Sets `status1="Rejected"`, `date2`; opens comment dialog; mails Requestor |
| `Acceptance1` | `Acceptance2` | **Approved** (COO/ED) | `HApp` group | Sets `status2="Accepted"`, `date3`, `DIVNAME`; opens `EnterComments2`; mails `IsMgr` |
| `Acceptance1` | `Rejected2` | **Rejected** (COO/ED) | `HApp` group | Sets `status2="Rejected"`, `date3`; mails `SendTo` |
| `Acceptance2` | `Done` | **Accepted** (IT Mgr) | `IsMgr` group | Sets `status3="Accepted"`, `date4`, `name4`; opens `EnterComments3`; mails `ITPIC` |
| `Acceptance2` | `Rejected` | **Deny** (IT Mgr) | `IsMgr` group | Sets `status3="Rejected"`, `date4`; mails `ITPIC` |
| `Done` | `Closed` | **Completed by IT** | `ITPIC` group | Sets `status4="Completed"`, `date5`, `name5`; mails Requestor (To), `depthead:app2:ITPIC2` (CC), `IsMgr` (BCC) |
| `Done` | `Denied` | **Rejected by IT** | `ITPIC` group | Sets `status4="Rejected"`, `date5`; prompts `comment4`; mails Requestor |

**Terminal states:** `Rejected1`, `Rejected2`, `Rejected`, `Closed`, `Denied`

### Action Button Visibility Rules

| Button | Hidden When (i.e. shown only when inverse is true) |
|---|---|
| **Send for Approval** | `@IsNotMember(@UserName; req)` OR `CurrentAction != "Request"` |
| **Approved by HOD** | `@IsNotMember(@UserName; depthead)` OR `CurrentAction != "Submitted"` |
| **Rejected by HOD** | `@IsNotMember(@UserName; depthead)` OR `CurrentAction != "Submitted"` |
| **Approved** (COO/ED) | `@IsNotMember(@UserName; HApp)` OR `CurrentAction != "Acceptance1"` |
| **Rejected** (COO/ED) | `@IsNotMember(@UserName; HApp)` OR `CurrentAction != "Acceptance1"` |
| **Accepted** (IT Mgr) | `@IsNotMember(@UserName; IsMgr)` OR `CurrentAction != "Acceptance2"` |
| **Deny** (IT Mgr) | `@IsNotMember(@UserName; IsMgr)` OR `CurrentAction != "Acceptance2"` |
| **Completed by IT** | `@IsNotMember(@UserName; ITPIC)` OR `CurrentAction != "Done"` |
| **Rejected by IT** | `@IsNotMember(@UserName; ITPIC)` OR `CurrentAction != "Done"` |

### Section Access Rules

| Section Title | Access Field | Edit Access Formula | Hide-When |
|---|---|---|---|
| **REQUESTOR'S SECTION** | `Company2` | `AEditor1 : ITADMIN` where `AEditor1 = @If(CurrentAction="Request"; Requestor; "-")` | None |
| **ACCEPTANCE OF DEPARTMENT HEAD** | *(none)* | — | None |
| *COO approval block* | *(none)* | — | Hidden when `@IsMember(depthead; COO)` (direct-to-COO path skips this) |
| **ACCEPTANCE OF IT MANAGER** | `ACCEPTANCE_OF_IS_MANAGER` | `IsMgr` | Hidden when `!@IsMember(depthead; COO)` (only visible on the PanCen/COO path) |
| **ACCEPTANCE OF IT** | *(none)* | — | None |
| **For IT Use** | `Attachment` | `ITPIC` | None |
| **Hidden Fields** (admin) | *(none)* | — | `@IsNotMember(@UserName; ITADMIN)` |

### Email Routing Summary

| Transition | To | CC | BCC |
|---|---|---|---|
| Submit | `depthead` | `CC` | `IsMgr` |
| HOD Approved | `HApp` (COO/ED) | — | — |
| HOD Rejected | Requestor | — | — |
| COO/ED Approved | `IsMgr` | — | — |
| COO/ED Rejected | `SendTo` | — | — |
| IT Mgr Accepted | `ITPIC` | — | — |
| IT Completed | Requestor | `depthead:app2:ITPIC2` | `IsMgr` |
| IT Denied | Requestor | — | — |

### Key Field Hide-When Rules

| Field / Block | Hidden When |
|---|---|
| IT Admin hidden fields block | `@IsNotMember(@UserName; ITADMIN)` |
| COO approval panel (pardef 26) | `@IsMember(depthead; COO)` — shown only on non-COO path |
| IT Mgr extra panel (pardef 37) | `!@IsMember(depthead; COO)` — shown only when HOD is COO |
| Old "VPN ACCESS REQUEST" label | `@Date(@Created) >= @Date(2020,9,3)` — hidden on new docs |

### Scheduled Reminder Agent — `RemAllPdg`

| Attribute | Value |
|---|---|
| Schedule | **Weekly, every Monday at 09:00** on `CN=PHBSVR/O=PHB` |
| View queried | `RemPdgApp` — docs where active approver has not acted for 3+ days |
| Selection | `CurrentAction="Submitted"` AND `@Today >= date1+3`; `"Acceptance1"` AND `@Today >= date2+3`; `"Acceptance2"` AND `@Today >= date3+3`; `"Done"` AND `@Today >= date4+3` |
| Email To | `doc.RemTo` (resolves to: Submitted→`depthead`; Acceptance1→`HApp`; Acceptance2→`IsMgr`; Done→`ITPIC`) |
| Email CC | `doc.req` (requestor) |
| Subject | `doc.RemSubject` (computed per-doc) |

---

## Module 5 — Hardware Inventory (`HWInv2013.nsf`) — Penang

> **Same workflow as Module 1 (PanCen Hardware Inventory).** This database uses the identical `NewInv`, `Checklist`, and `newhware` forms. See Module 1 for full routing rules.

**Site difference:** Penang ACL uses `Oleo Local` group instead of `PanCen Group`. Server: `CN=PHBSVR/O=PHB`. No additional workflow agents beyond Module 1 pattern.

---

## Module 6 — IT Activity Log (`ISGLogActFYNew.nsf`)

### State Machine — Form: `DataRestorationV1`

```
[Request: Draft]
       │
  (Submitted By — requestor)
       │
       ▼
  [Submitted: Pending Backup Admin]
       │
  (Update — Backup Admin)
       │
       ▼
  [Completed]
```

Other forms in this database (Server Reboot, Server Records, Data Center Access, ISG Events) are **log/activity entries** — they do not use a `CurrentAction` routing pattern. They have Submit/Save buttons only, no approval chain.

### CurrentAction State Transitions — `DataRestorationV1`

| From | To | Button | Actor | Validation / Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Submitted By** | `nmRequestor` (requestor) | Validates: site, name, dept, media, server, filepath, filename, reason; assigns 4-digit INO; mails `nmBKAdmin` (To), `nmCC:nmMgrMail` (CC); Subject: `"Data Restoration Request # [INO]"` |
| `Submitted` | `Completed` | **Update** | `nmBKAdmin` (Backup Admin) | Validates: mediaName, mediaDate, fileName, rbStatus; sets `dtPerformed`, `nmPerformed`; mails `nmRequestor` (To), `lstMailing` (CC); Subject: `"Data Restoration Request # [INO] Status: [rbStatus]"` |

### Section Access Rules

| Section | Access Field | Edit Access Formula |
|---|---|---|
| **Requestor section** ("To be filled up IT :") | `Untitled_Section` | `AEditor1` (= requestor name) |
| **Backup Admin section** ("To be filled up Backup Administrator:") | `Media2` | `@If(CurrentAction="Submitted"; AEditor2; "Nobody")` — writable only after submission |

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Submitted By** | `@IsNotMember(@UserName; nmRequestor)` OR `CurrentAction != "Request"` |
| **Update** | `@IsNotMember(@UserName; nmBKAdmin)` OR `CurrentAction != "Submitted"` |

### Scheduled Agents
None. All notifications are triggered by action buttons only.

---

## Module 7 — IOI Policy (`DRPPROC.nsf`)

> **State Field:** `CurrentAction` with three-stage approval (App1 → App2 → App3). Both `PolicyEntry` (original) and `PolicyEntryV1` (current) forms follow the same pattern.

### State Machine — Forms: `PolicyEntry` / `PolicyEntryV1`

```
[Draft]
       │
  (Submit — Author)
       │
       ▼
  [PdgApp1: Pending Approver 1]
       │
  ┌────┴──────────────┐
(A1Replied=Yes)  (A1Replied=No → Rejected)
  │
  ▼
  [PdgApp2: Pending Approver 2]
       │
  ┌────┴──────────────┐
(A2Replied=Yes)  (A2Replied=No → Rejected)
  │
  ▼
  [PdgApp3: Pending Approver 3]
       │
  (A3Replied=Yes)
  │
  ▼
  [PdgDist: Pending Distribution]
       │
  (Distribute)
  │
  ▼
  [Active / Completed]
```

### CurrentAction State Transitions

| From | To | Actor Field | Actions |
|---|---|---|---|
| *(new)* | `Draft` | Author | — |
| `Draft` | `PdgApp1` | Author | Mails `App1` (Approver 1) |
| `PdgApp1` | `PdgApp2` | `App1` (named person) | Sets `A1replied=Yes`, `Status1`, `DateApproved1`; mails `App2` |
| `PdgApp1` | `Rejected` | `App1` | Sets `A1replied=No`, `Status1="Rejected"` |
| `PdgApp2` | `PdgApp3` | `App2` | Sets `A2replied=Yes`, `Status2`, `DateApproved2`; mails `App3` |
| `PdgApp2` | `Rejected` | `App2` | Sets `A2replied=No`, `Status2="Rejected"` |
| `PdgApp3` | `PdgDist` | `App3` | Sets `A3replied=Yes`, `Status3`, `DateApproved3` |
| `PdgApp3` | `Rejected` | `App3` | Sets `A3replied=No`, `Status3="Rejected"` |
| `PdgDist` | `Active` | Author | Archives old version; sets `FinalStatus="Active"` |

### Section Access Rules
Section access is controlled by the `Approval_Section` field in the `Approvalv2` subform:

| Section | Editable By | When |
|---|---|---|
| Approval Stage 1 | `App1` (named person) | When `CurrentAction = "PdgApp1"` |
| Approval Stage 2 | `App2` | When `CurrentAction = "PdgApp2"` |
| Approval Stage 3 | `App3` | When `CurrentAction = "PdgApp3"` |
| Policy Content | Author / `Editors` | Draft state |

### Scheduled Agents
None listed as scheduled. Agent `A3Replied` runs on the "A3Replied" event (on-demand / action menu).

---

## Module 8 — IT Report 2026 (`ITReport2026.nsf`)

**No workflow routing.** This database stores monthly IT reports (`Report` form) and outstanding task plans (`Plan` form). Documents are created and edited by IT staff only — no approval chain, no `CurrentAction` state machine. ACL restricts creation to `ACM IT` and `PanCen IT` groups; all others have Reader access.

---

## Module 9 — IT Info (`ISGInfo.nsf`)

**No workflow routing.** Stores IT informational content (`ISGInfo` form with InfoType, Attachment, ISGRemarks). No approval workflow. IT staff (`ACM IT`, `PanCen IT` groups) can create/edit; everyone else is Reader.

---

## Module 10 — IT Server Checklist 2026 (`svrchklist26.nsf`)

**No workflow routing.** Weekly server monitoring checklist (`AllServerMonitor` form). IT staff fill in server health fields; no multi-stage approval. Views split by site (PNG = Penang, JHR = Johor). No scheduled reminder agents.

---

## Module 11 — IT Support & Service Request (`ITSSR26.nsf`)

> **Note:** ITSSR uses field `CA` (not `CurrentAction`) as its state field. A parallel flag `CS` (0=Rejected, 1=Closed, 2=Pending) and `US` (0=Rejected by requestor, 1=Accepted) track sub-states.

### State Machine — Form: `SS3`

```
[Request: Draft]
       │
  (Submit — requestor/Editor1)
       │
       ▼
  [Submitted: Pending IT]
       │
       ├── (Pending — IT sets CS="2", CA unchanged — "In Progress" flag)
       │
  ┌────┴──────────────┐
(Completed — IT)   (Reject — IT)
  │                        │
  ▼                        ▼
[Notified:           [Denied: terminal]
 Pending Requestor
 Acceptance]
  │
  ┌────┴──────────────┐
(Accept — Requestor) (Reject — Requestor)
  │                        │
  ▼                        ▼
[Accepted: terminal] [Submitted] ◄─ re-opens
```

### CurrentAction (CA) State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Submit** | `Editor1` (requestor/DocAuthor) | Validates Type, HWare/App, ProblemDesc; sets `DateCreated=@Now`; mails `SendTo` (To), `Defcc` (CC); Subject: `"[Company] ITSSR - [Type] - [Category] CaseNo"` |
| `Submitted` | `Notified` | **Completed** | `Editor2` (AllIT group) | Validates Solution, StartDate, ProbCat; sets `ITName`, `CS="1"`, `DateClosed=@Now`; mails DocAuthor (To), `MailingList` (CC); Subject: `"ITSSR - Completed: CaseNo"` |
| `Submitted` | `Submitted` (CS=2) | **Pending** | `Editor2` | Sets CS="2", `DateNotified`; mails DocAuthor; Subject: `"ITSSR - Pending: CaseNo"` |
| `Submitted` | `Denied` | **Reject** (IT) | `Editor2` | Validates ITRemarks; sets `CS="0"`, `DateClosed`; mails DocAuthor |
| `Notified` | `Accepted` | **Accept** | `Editor3` (requestor/DocAuthor) | Rating required; Comment required if Rating < 8; sets `DateAccept`, `US="1"`; mails `ITName` (To), `SendTo:Defcc` (CC); Subject includes Rating |
| `Notified` | `Submitted` | **Reject** (Requestor) | `Editor3` | Validates Comment; sets `US="0"`; mails `ITName` — re-opens ticket |

**Terminal states:** `Accepted`, `Denied`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Submit** | `@IsNotMember(@UserName; Editor1)` |
| **Completed** | `@IsNotMember(@UserName; Editor2)` |
| **Pending** | `@IsNotMember(@UserName; Editor2)` |
| **Reject** (IT) | `@IsNotMember(@UserName; Editor2)` |
| **Accept** | `@IsNotMember(@UserName; Editor3)` |
| **Reject** (Requestor) | `@IsNotMember(@UserName; Editor3)` |

### Section Access Rules

| Section | Access Field | Edit Access Formula | Hide-When |
|---|---|---|---|
| **Requestor's Section** | `Requestor_s_Section__` | `Editor1 : ITADMIN` | None |
| **IT Section** | `IT_Section___` | `Editor2 : ITADMIN` | Collapsed when `CaseStatus_1="Rejected"` |
| **For IT Use** (collapsed) | `For_IT_Use` | `Editor2 : ITADMIN` | `@IsNotMember(@UserName; AllIT)` |
| **Requestor's Acceptance** | `Requestor_s_Acceptance___` | `Editor3` | None |
| **IT Verification** (PanCen desktop) | `Untitled_Section` | `Editor1b : ITADMIN` | `Type2 != "NEW REQUEST DESKTOP/LAPTOP"` OR `OU != "PanCen"` |
| **IT Manager Approval** (PanCen) | `Untitled_Section_1` | `Editor1c : ITADMIN` | Same as above |
| **COO Approval** (PanCen) | `Untitled_Section_2` | `Editor1d : ITADMIN : PanCenM` | Same + `COO_APP != "Yes"` |

**Editor field computed assignments:**
- `Editor1` = DocAuthor (requestor) — active when `CA="Request"`
- `Editor2` = AllIT group — active when `CA="Submitted"`
- `Editor3` = DocAuthor (requestor) — active when `CA="Notified"`

### Key Field Hide-When Rules

| Field | Hidden When |
|---|---|
| Application row | `App = ""` |
| CC row | `CopyTo = ""` |
| Hardware-specific rows | `Type != "HARDWARE"` |
| Software/App rows | `Type != "SOFTWARE/APPLICATION"` |
| Date Sent | `DateCreated = ""` |
| IT Verification section | `Type2 != "NEW REQUEST DESKTOP/LAPTOP"` OR `OU != "PanCen"` |
| COO Approval section | same + `COO_APP != "Yes"` |
| For IT Use section | `@IsNotMember(@UserName; AllIT)` |

### Scheduled Agents
No scheduled email agents in ITSSR. Reminders listed in the schema documentation (RemPdgAcceptance, RemPdgITWithRem/WithoutRem, RemPdgUnderrated) are manual action-menu agents only.

---

## Module 12 — Notes ID Request (`LNIDRequest.nsf`)

> **Note:** NIR uses field `CA` as its state field. The `CurrentAction` field is exposed as an **editable section** behind an admin-only panel, allowing ISADMIN to manually correct state.

### State Machine — Form: `IDR2` / `IDR`

```
[Request: Draft]
       │
  (Send to ISG — requestor/Editor1)
       │
       ▼
  [Submitted: Pending ISG HOD]
       │
  ┌────┴──────────────┐
(Approved — ISGHOD) (Rejected — ISGHOD)
  │                        │
  ▼                        ▼
[ISGHODApproved:     [ISGHODRejected: terminal]
 Pending PIC/IT]
       │
  (Done — PIC/Editor3)
       │
       ▼
  [Done: Pending HWG Configuration]
       │
  ┌────┴──────────────┐
(Completed — HWG)  (HODRejected — admin)
  │                        │
  ▼                        ▼
[Completed: terminal] [HODRejected: terminal]
```

### CA State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Send to ISG** | DocAuthor (`Editor1`) | Validates EmailType, Company, Dept, Designation; sets Requestor, DateSent; mails `ISGHOD` (To), `CC:ISADMIN` (CC); Subject: `"New Lotus Notes ID Request"` |
| `Submitted` | `ISGHODApproved` | **Approved** | `ISGHOD` group (`Editor2`) | Sets `isgHODName`, `isgHodDate`, `isgHodStatus="Approved"`; mails `PIC` (To), DocAuthor (CC); Subject: `"Lotus Notes ID Request - Approved by [name]"` |
| `Submitted` | `ISGHODRejected` | **Rejected** | `ISGHOD` group (`Editor2`) | Validates `isgHodComment`; sets `isgHODName`, `isgHodDate`, `isgHodStatus="Rejected"`; mails DocAuthor (To), `PIC` (CC) |
| `ISGHODApproved` | `Done` | **Done** | `PIC` group (`Editor3`) | Validates `PICTask`; sets `PICName`, `PICDate`; if New ID: mails `HWG` — Subject: `"Lotus Notes ID Successfully created - Please proceed with Configuration"` |
| `Done` | `Completed` | **Completed** | `HWG` group (`Editor4`) | Validates `AccTask`; sets `AccDate`, `AccStatus="Completed"`, `AccName`; mails DocAuthor (To), `Maillist` (CC); Subject: `"Lotus Notes Successfully Configured"` |
| `Done` | `HODRejected` | Agent: **SET** (admin) | ISADMIN | Manual admin fix — sets `HodStatus="Rejected"`, `CA="HODRejected"` |
| `Done` | `Done` (reset) | Agent: **Clear Completion** | ISADMIN | Clears `AccDate`, `AccName`, `AccStatus`; resets `CA="Done"` |

**Terminal states:** `ISGHODRejected`, `Completed`, `HODRejected`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Send to ISG** | `CA != "Request"` |
| **Approved** | `@IsNotMember(@UserName; Editor2)` |
| **Rejected** | `@IsNotMember(@UserName; Editor2)` |
| **Done** | `@IsNotMember(@UserName; Editor3)` |
| **Completed** | `@IsNotMember(@UserName; Editor4)` |

### Section Access Rules

| Section | `accessfieldname` | Edit Access Formula |
|---|---|---|
| **Requestor Section** | `Requestor_Section` | `Editor1` — always editable by requestor (DocAuthor) |
| **ISG HOD Section** | `ISG_HOD_Section` | `@If(CA="Submitted"; Editor2; "NOBODY")` — editable only when Submitted |
| **Notes Admin / PIC Section** | `Notes_PIC_Section` | `@If(CA="ISGHODApproved"; Editor3; "NOBODY")` — editable only when HOD Approved |
| **Requestor Acceptance Section** | `Requestor_Acceptance_Section` | `@If(CA="Done"; Editor4; ISADMIN)` — editable only when Done; hidden when `CA="Request"` or `EmailType="Rename"` |
| **Hidden Fields** (admin) | `CurrentAction` (editable kind) | Section hidden by `@IsNotMember(@UserName; ISADMIN)` — exposes `CA` field for manual override |

### Key Field Hide-When Rules

| Field | Hidden When |
|---|---|
| Existing Email Address row | `EmailType = ""` OR `EmailType = "New"` — Rename requests only |
| "Change to" row | Same — Rename only |
| New employee fields (Dept, Designation, Internal/External) | Shown for New ID only; hidden for Rename |
| Bottom signature/body section | `CA = "Request"` OR `EmailType = "Rename"` |
| Hidden Fields section | `@IsNotMember(@UserName; ISADMIN)` |

### HWG Routing Logic (Company-based)
The `HWG` computed field routes to different IT hardware groups based on the requestor's company/OU:
- Penang / ACM companies → `ISGHardware`
- Johor / PanCen companies → `ISGHardware2`

### Scheduled Reminder Agents

| Agent | Schedule | State Monitored | View | Sends To | Subject |
|---|---|---|---|---|---|
| **RemPdgHWG** | Daily 09:00 (weekdays) on `PHBSVR` | `CA = "Done"` (HWG config pending) | `RemPdgByHWG` | `doc.HWG` (company-routed) | "Notes ID Request Reminder – Pending for the Configuration" |
| **RemPdgHOD** | Daily 09:00 (weekdays) on `PHBSVR` | `CA = "Submitted"` (HOD approval pending) | `RemPdgHOD` | `doc.HOD` | "Notes ID Request Reminder – Pending HOD Approval" |

---

## Module 13 — IT Procedures / Training Manuals (`isgdoc.nsf`)

**No workflow routing.** Stores IT procedure documents (`isgdoc` form) and training manuals (`TrgManual` form). IT staff create and version-control documents; no approval chain or `CurrentAction` state. The `Archive` agent moves outdated documents to an archive view. ACL restricted to `ACM IT` and `PanCen IT` groups for editing; no public access.

---

## Module 14 — Program Request Form (`PRF26.nsf`)

> **Replica Note:** This module covers the 2026 replica on `CN=PHBSVR3/O=PHB!! Current\PRF26.nsf` (694 documents), extracted from `docs/PRF_all_dxl.xml`. Design differences from the schema-folder version (Penang primary) are noted where found.

> **State Field:** `CurrentAction` (also stored as `CA` alias). **SAP Flag:** `isSAP` computed field — set to `"1"` when `system` contains SAP S4/HANA, SAP, SUCCESSFACTOR-LMS, SALES PORTAL, or DASHBOARD/ENVIRONMENT & SUSTAINABILITY with `RFC="Yes"`.

### State Machine — Form: `PRF` (Non-SAP Track)

```
[Request: Draft]
       │
  (Send for Approval — Requestor/AEditor1)
       │
       ▼
  [Submitted: Pending Dept Head Approval]
       │
  ┌────┼────────────┐
(Approved) (Rejected) (KIV — no CA change)
  │            │
  ▼            ▼
[Acceptance1:  [Rejected: terminal]
 Pending IT
 Task Assignment]
       │
  (Tasks Assignment — ismgr2/AEditor3)
       │
       ▼
  [Acceptance2: Pending IT Completion/Testing]
       │
  (Notify Requestor — isg/AEditor6)
       │
       ▼
  [Closed: Pending Requestor Acceptance]
       │
  ┌────┴──────────────┐
(Accepted)      (To be revised)
  │                    │
  ▼                    ▼
[Closed: terminal] [Acceptance3: re-open for revision]
```

### State Machine — Form: `PRF` (SAP Track)

```
[Request] → [Submitted] → [Acceptance1]
       │
  (Tasks Assignment — sets isSAP=1)
       │
       ▼
  [Acceptance: Pending Functional Spec Submission (SAP)]
       │
  (Submit Functional Spec — isg/AEditor4)
       │
       ▼
  [Submitted_SAP: Pending IT Manager II Assignment]
       │
  (Tasks Assignment II — ismgr/AEditor5)
       │
       ▼
  [Acceptance3: Pending ABAP/IT Completion]
       │
  (Notify Requestor/Functional — ABAP:isg/AEditor6)
       │
       ▼
  [Completed-SAP: Pending ISG Final Notification]
       │
  (Notify Requestor SAP — isg:CC_ISG/AEditor7)
       │
       ▼
  [Closed: Pending Requestor Acceptance]
       │ (same final acceptance as non-SAP)
```

### CurrentAction State Transitions

| From | To | Button | Actor (field) | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Send for Approval** | `AEditor1` = requestor when CA=Request\|Submitted | Validates deptmanager, dept, system, type, site, cc, Objective. Assigns INO (4-digit, from "lookup" view). Sets `datesent=Today()`, `finalstatus="Submitted"`. Mails `deptmanager` (To), cclist (CC). Subject: `"Program Request Form : [system] (for your approval). Request Num: [ReqNo]"` |
| `Submitted` | `Acceptance1` | **Approved by Dept Head** | `AEditor2` = deptmanager when CA=Submitted | Sets `status1="Accepted"`, `finalstatus="Accepted by Dept head"`, `dateapp1`, `depthead`. Mails `ismgr2` (To), NotifyAll (CC). Subject: `"PRF : [system] : Accepted by Dept Head - [ReqNo]"` |
| `Submitted` | `Rejected` | **Rejected by Dept Head** | `AEditor2` | Validates `comments1`. Sets `status1="Rejected"`, `finalstatus="Rejected by Dept head"`, `dateapp1`. Mails `initiator` (To), `ismgr:NotifyAll` (CC). |
| `Submitted` | *(no CA change)* | **KIV by Dept Head** | `AEditor2` | Validates `comments1`. Sets `finalstatus="KIV by Dept head"`, `dateapp1`. Opens dialog. Mails `ismgr` (To), `initiator:cc` (CC). |
| `Acceptance1` | `Acceptance` (SAP) or `Acceptance2` (non-SAP) | **Tasks Assignment** | `AEditor3` = ismgr2 when CA=Acceptance1 | Validates isg, status2, CC_ISG (Sales Portal), RFC. Sets `dateapp2`, `AppBy_ISG`. finalstatus per status2: Accepted→"Job In-progress by IS staff"; Rejected→"Cancelled"; KIV→"KIV by IS Manager". Mails `isg` (To), `ismgr:CC_ISG` (CC). |
| `Acceptance` | `Submitted_SAP` | **Submit Functional Spec** | `AEditor4` = isg when CA=Acceptance & isSAP=1 | Sets `AttachedBy`, `dtSubmitted`. Mails `ismgr`. |
| `Submitted_SAP` | `Acceptance3` | **Tasks Assignment II** | `AEditor5` = ismgr when CA=Submitted_SAP | Validates AcceptStatus_SAP, ABAP, FuncOwner_SAP. Sets `AppBy_SAP`, `dateapp2_1`. finalstatus per AcceptStatus_SAP. Mails `ABAP` (To), `FuncOwner_SAP:ismgr:CC_ISG:ABAP_CC` (CC). |
| `Acceptance2` (non-SAP) | `Closed` | **Notify Requestor/Functional** | `AEditor6` = isg:CC_ISG when CA=Acceptance2 | Validates status3. Sets `byisstaff`. Sets `CurrentAction="Closed"` if status3=Completed. Multiple conditional @MailSend per system type. |
| `Acceptance3` (SAP) | `Completed-SAP` | **Notify Requestor/Functional** | `AEditor6` = ABAP:isg when CA=Acceptance3 | Same as above; sets `CurrentAction="Completed-SAP"` if Completed. |
| `Completed-SAP` | `Closed` | **Notify Requestor (SAP)** | `AEditor7` = isg:CC_ISG when CA=Completed-SAP or Closed+isSAP=1 | Validates `statusISG`. Sets `DateISG`, `NotifiedBy`. `finalstatus`. Sets `CA="Closed"` if Completed. Mails `initiator` (To), `copiesto:isg` (CC). |
| `Closed` or `Acceptance2` | `Closed` (accept) | **Accepted by Requestor** | `AEditor1_1` = requestor when CA=Closed/Acceptance2 + finalstatus=Completed | Validates `Rating` (≥1); if <8 validates `Comment1` (min 25 chars). Sets `status4="Accepted"`, `finalstatus="Closed"`, `dateapp4`. Mails `isg` (To), `copiesto` (CC). Subject: `"PRF : [system] : Accepted by [requestor] Rating : [Rating]"`. |
| `Closed` | `Acceptance3` | **To be revised** | `AEditor1_1` | Validates `Comment1`. Sets `status4="to be revised"`, `finalstatus="Job In-progress by IS staff"`. Mails `isg`. |
| `Closed` | *(no CA change)* | **KIV by Requestor** | `AEditor1_1` | Validates `Comment1`. Sets `status4="KIV"`, `finalstatus="KIV by Requestor"`. Mails `isg`. |

**Terminal states:** `Rejected`, `Closed` (after final acceptance)

**Admin-only reset agents (action menu):**

| Agent | Resets To | Clears Fields |
|---|---|---|
| Clear Task Assignment | `Acceptance1` | AppBy_ISG, dateapp2 |
| Clear Functional | `Acceptance` | dtSubmitted, AttachedBy |
| Clear Acceptance | `Closed` (finalstatus="Completed") | dateapp4, status4, Rating |
| Clear IT Functional-Completion for SAP | `Closed` | statusISG, commentsISG, DateISG, NotifiedBy |
| Clear ABAP Assign | `Submitted_SAP` | AcceptStatus_SAP, ABAP, ABAP_CC, FuncOwner_SAP, AppBy_SAP, dateapp2_1 |

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Edit Document** | View / preview mode (`hide='edit previewedit'`) |
| **Save document** | (never hidden) |
| **Send for Approval** | `@IsNotMember(@UserName; AEditor1)` OR `datesent != ""` |
| **Approved by Dept Head** | `@IsNotMember(@UserName; AEditor2)` |
| **Rejected by Dept Head** | `@IsNotMember(@UserName; AEditor2)` |
| **KIV by Dept Head** | `@IsNotMember(@UserName; AEditor2)` |
| **Tasks Assignment** | `@IsNotMember(@UserName; AEditor3)` |
| **Submit Functional Spec** | `@IsNotMember(@UserName; AEditor4)` |
| **Tasks Assignment II** | `@IsNotMember(@UserName; AEditor5)` |
| **Notify Requestor/Functional** | `@IsNotMember(@UserName; AEditor6)` OR `finalstatus="Cancelled"` |
| **Notify Requestor (SAP)** | `@IsNotMember(@UserName; AEditor7)` |
| **Accepted by Requestor** | `@IsNotMember(@UserName; AEditor1_1)` |
| **KIV by Requestor** | `@IsNotMember(@UserName; AEditor1_1)` |
| **To be revised** | `@IsNotMember(@UserName; AEditor1_1)` |

### AEditor Role Field Formulas

| Field | Formula | When Active |
|---|---|---|
| `AEditor1` | `@If(CA="Request"\|CA="Submitted"; NotesOwner; "-")` | Requestor edits Requestor's Section |
| `AEditor1a` | `@If(CA="Request"\|CA="Submitted"; NotesOwner; ismgr)` | Expected Completion Date section |
| `AEditor1_1` | `@If((CA="Closed"\|CA="Acceptance2") & finalstatus="Completed" \| status4="KIV"; NotesOwner; "-")` | Requestor acceptance upon completion |
| `AEditor2` | `@If(CA="Submitted"; deptmanager; "-")` | Dept head when Submitted |
| `AEditor3` | `@If(CA="Acceptance1"; ismgr2; "-")` | IT Manager 2 (Kelly/Wilson group) |
| `AEditor4` | `@If(isSAP="1" & CA="Acceptance"; isg; "-")` | IT staff for SAP functional spec |
| `AEditor5` | `@If(CA="Submitted_SAP"; ismgr; "-")` | IT Manager (Kelly/Clare group) for SAP Task II |
| `AEditor6` | Non-SAP: `isg:CC_ISG` when CA=Acceptance2; SAP: `ABAP:isg` when CA=Acceptance3 | IT developer/ABAP for completion |
| `AEditor7` | `@If(CA="Completed-SAP"\|CA="Closed"&isSAP="1"; isg:CC_ISG; "-")` | IT staff for SAP final notification |

### Section Access Rules

| Section | `accessfieldname` | Edit Access Formula | Hide-When |
|---|---|---|---|
| **Requestor's Section** | `Approved_by` | `AEditor1:ISADMIN` | (always shown) |
| **Approval (Dept Head)** | `APPROVAL__Requestor_s_Div_Dept_Head___` | `AEditor2:ISADMIN` | (always shown) |
| **Tasks Assignment (by IT)** | `TASKS_ASSIGNMENT__by_IT___` | `AEditor3:ISADMIN` | (always shown) |
| **Functional Procedure Submission** (SAP) | `SAP_Functional_Procedure_submission__` | `AEditor4:ISADMIN` | `isSAP="0"` |
| **IT Support Use** | `Remarks2` | `isg` (assigned IT staff) | (always shown) |
| **Assignment to IT / ABAP** (SAP) | `ACCEPTANCE___SAP__by_ISG___` | `AEditor5:ISADMIN` | `isSAP="0"` |
| **IT Support Staff** | `ISG_Support_Staff__` | `@If(finalstatus="Cancelled"; "-"; AEditor6:ISADMIN)` | (always shown) |
| **Notes for IT** (internal) | `Notes_for_IT` | `ISGRecipients` | `@IsNotMember(@UserName; ISADMIN)` |
| **Testing/Validation by IT** | `TESTING_VALIDATION__by_IT_` | `AEditor6:ISADMIN` | (always shown) |
| **IED/IEQ Testing** (SAP) | `IED_IEQ_Testing__for_SAP_Functional_use_` | `isg` | `isSAP="0"` |
| **ISG Completion for SAP** | `ISG_Completion_for_SAP` | `AEditor7:ISADMIN` | `isSAP="0"` |
| **Acceptance Upon Completion** | `Acceptance_upon_completion__by_Requestor___` | `AEditor1_1` | (shown after completion) |
| **Testing/Validation by Requestor** | *(editable, no access formula)* | Open edit | `@Member("SAP S4/HANA"; system)!=0 \| RFC="Yes"` |
| **Hidden Fields** (admin) | *(none)* | (raw CA/finalstatus fields) | `@IsNotMember(@UserName; ISADMIN)` |

### Key Field Hide-When Rules

| Field / Row | Hidden When |
|---|---|
| `CurrentAction`, `finalstatus` | `@IsNotMember(@UserName; ISADMIN)` |
| "Apply changes to" (Notes DB amendment) | `system != "NOTES DATABASE" \| type = "New Request"` |
| "Power BI - Data Source" | `system != "POWER BI"` |
| "Group Name / Members / Validity" rows | `system != "NOTES MAIL GROUP"` |
| "Validity until" date | `validity != "Temporary"` |
| "Require SAP RFC" (RFC) | Not Sales Portal, Dashboard, or Env & Sustainability |
| "Date Released for Testing" (TestingDate) | `@Member("SAP S4/HANA"; system) != 0 \| @Member("ENVIRONMENT & SUSTAINABILITY"; system) != 0` |
| "Date TR num released in IED" (IEDDate) | `@Member("SAP S4/HANA"; system) = 0 & @Member("ENVIRONMENT & SUSTAINABILITY"; system) = 0` |
| All SAP sections (4 sections) | `isSAP = "0"` |
| Notes for IT section | `@IsNotMember(@UserName; ISGRecipients)` |
| Testing/Validation by Requestor section | `@Member("SAP S4/HANA"; system) != 0 \| RFC = "Yes"` |
| `upddt`/`updby` (exp. completion update trail) | `upddt = ""` |
| `testedby`/`testedon` | `testedon = ""` |

### Role Group Lookups (from `PeopleNames.nsf`)

| Field | Group / Source |
|---|---|
| `ISADMIN` | `PeopleNames.nsf` group "ISADMIN" |
| `ISGRecipients` | Group "IT Software Team" |
| `ismgr` | Group "PRFAPP" (Kelly & Clare) |
| `ismgr2` | Group "PRFAPP2" (Kelly & Wilson) |
| `Clare` | Group "ITHOD" |
| `ITSAPCC` | Group "IT_PRF_CC" |
| `ConvertName` | Group "ISGPraiJohor" (IT staff name picklist) |
| `PCNQA` | Group "ACMPANCEN_QA" |

### Running Number Assignment

**Button: "Send for Approval" — `INO` field logic:**
1. Query `"lookup"` view for highest existing `INO` in current year
2. Increment by 1, zero-pad to 4 digits
3. Store in `INO`; display as `ReqNo = "PRF " + Year + "-" + MM + "-" + INO`

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **ReminderPdgApproval** | Daily (weekdays) 08:00 on PHBSVR | `RemPdgApproval` (CA="Submitted" & dateapp1="" & Today > datesent+2) | `deptmanager` | `NotesOwner` | "Program Request Form Reminder - Pending Approval" |
| **ReminderPdgAcceptance** | Daily (weekdays) 08:00 on PHBSVR | `RemPdgAcceptance` (dateapp4="" or <dateapp3; CA=Closed/Completed; not Cancelled) | `NotesOwner` | `deptmanager` | "Program Request Form Reminder - Pending Acceptance" |
| **ReminderPdgTesting** | Weekly Monday 10:00 on PHBSVR | `RemPdgTesting` (non-SAP; status3="Released for testing"; StatusISG=""; TestingDate+7 < Today) | `doc.RemTo` | `doc.RemCC` | "Program Request Form Reminder - Request Pending for Testing" |
| **ReminderPdgJustify** | Daily (weekdays) 08:00 on PHBSVR | `RemPdgJustification` (Job In-progress & ITReason="" & dateapp3="" & expected date ≤ Today) | `isg` | `RemCC2` (ismgr + ITSAPCC for SAP) | "PRF Reminder - Pending Justification (outstanding more than 3 months)" |
| **ReminderUnderrated** | Weekly Monday 10:00 on PHBSVR | `PdgUnderrated` (underrated docs) | `isg` | `ISGRecipients` | "Program Request Form Reminder - Underrated - Please state your comments" |

All five agents send-only — no field mutations occur on the document.

---

## Module 15 — Reset Password / Unlock ID (`ResetPwd09.nsf`)

> **State Field:** `CurrentAction` (also `status` for sub-state). Three form variants: `ResetPasswordV1` (legacy), `ResetPassword` (current standard), `ResetPassword2` (SAP S4/HANA variant). All share the same routing pattern.

### State Machine — Form: `ResetPassword` / `ResetPassword2`

```
[Drafting / Request]
       │
  (Send Request — Requestor/AEditor1)
       │
       ▼
  [Submitted: Pending IT]
       │
  ┌────┼────────────────────────┐
(Reset Done)              (Rejected)
  │                            │
  ▼                            ▼
[Completed: Reset Done]  [Rejected: terminal]
  │
  (BANK type only: ED approval)
  │
  ▼
[Completed: Done — ED Confirmed]
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | `status="Drafting"` |
| `Drafting` / `Request` | `Submitted` | **Send Request** | `AEditor1` = requestor | Sets `status="Submitted"`, `CurrentAction="Submitted"`, `datecreated=@Now`; mails `isg`; Subject: `"[CO] Reset Application Password : [type]"` |
| `Submitted` | `Completed` (Reset Done) | **Reset Done** | `AEditor2` = ISG when Submitted | Sets `status="Completed"`, `finalstatus="Reset Done"`; if BANK type: mails `ED:isg`; else mails `requestor:isg` |
| `Submitted` | `Rejected` | **Rejected** | `AEditor2` | Sets `finalstatus="Rejected"`, `CurrentAction="Rejected"`; mails `requestor:isg` |
| `Completed` (BANK Reset Done) | `Completed` (Done) | **Done** | `AEditor3` = ED group | Sets `edstatus="Completed"`; mails `requestor` |

**Terminal states:** `Rejected`, `Completed` (Done)

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Send Request** | `@UpperCase(AEditor1) != @UpperCase(@UserName)` OR `status != "Drafting"` |
| **Reset Done** | `@IsNotMember(@UserName; AEditor2)` OR `status = "Completed"` |
| **Rejected** | `@IsNotMember(@UserName; AEditor2)` OR `status = "Completed"` |
| **Done** | `@IsNotMember(@UserName; AEditor3)` |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| "To be filled by Requestor" | `To_be_filled_by_Requestor` | `AEditor1:ISADMIN` — `AEditor1 = @If(@IsNewDoc; @UserName; @If(CurrentAction="Request"; requestor; "Nobody"))` |
| "To be completed by IT" | `To_be_filled_by_IT` | `AEditor2` — `@If(CurrentAction="Submitted"; isg; "Nobody")` |
| "To be completed by ED" (BANK type) | `To_be_filled_by_IT_1` | `AEditor3` — ED group |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | Subject |
|---|---|---|---|---|
| **RemPdgIT** | Daily 13:00 on PHBSVR | `OutStanding` (CA="Submitted" & datecreated != "" & datecre = "") | `doc.isg` | "Reset App Password/Unlock SAP ID - Reminder - Pending IT" |

---

## Module 16 — SAP Authorisation Matrix Review (`AuthMatrixReview.nsf`)

> **State Field:** `CurrentAction`. Two form variants: `SAPAutMatReview` (primary) and `SAPAutMatNew`. FI module requests have per-slot individual verifiers (TBV_1–TBV_5); non-FI requests use a single `TBV` group.

### State Machine — Forms: `SAPAutMatReview` / `SAPAutMatNew`

```
[Request: Draft]
       │
  (Send for Verification — Requestor/AEditor1)
       │
       ▼
  [Submitted: Pending Verification]
       │  (FI modules: TBV_1–TBV_5 each sign; non-FI: single TBV group)
       │
  ┌────┴──────────────┐
(Verified — TBV)   (Rejected by TBV)
  │                        │
  ▼                        ▼
  [Verified: Pending BPO Approval]  [Rejected: terminal]
       │
  ┌────┴──────────────┐
(Approved — TBA)   (Rejected by TBA)
  │                        │
  ▼                        ▼
  [Approved: terminal]   [Rejected: terminal]
       (or Withdrawn at any active state)
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Send for Verification** | `AEditor1` = Requestor when CA=Request | Assigns running number to `INO`; sets `PreparedDate=Today()`; mails `TBV`; Subject: `"[Pending Verification] - SAP Authorisation Matrix Form for Authorisation Type : [AuthType]. No : [DisplayNum]"` |
| `Submitted` | `Verified` | **Verified** | `TBV` (Key User group) | Sets `CurrentAction="Verified"`, `VerifiedDate=Today()`; mails `TBA`; Subject: `"[Pending Approval] - SAP Authorisation Matrix Form..."` |
| `Submitted` | *(sub-step; CA stays Submitted)* | **Verify (TBV_1–5)** | `TBV_1` / `TBV_2` / `TBV_3` / `TBV_4` / `TBV_5` (FI only) | Sets `Date1`–`Date5` per slot; visible only if Module starts with "FI" |
| `Verified` | `Approved` | **Approved by BPO** | `TBA` | Sets `Status=1`, `ApprovedDate=Today()`; mails Requestor; Subject: `"[Approved] - SAP Authorisation Matrix Form..."` |
| `Verified` | `Rejected` | **Rejected by BPO** | `TBA` | Sets `Status=0`; mails Requestor; Subject: `"[Rejected] - SAP Authorisation Matrix Form..."` |
| Any active | `Withdrawn` | **Withdrawn** | Requestor (when `WTDOn = ""`) | Sets `WTDOn=Today()`; mails `WTDMail` |

**Terminal states:** `Approved`, `Rejected`, `Withdrawn`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Send for Verification** | `@IsNotMember(@UserName; AEditor1)` OR `CurrentAction != "Request"` |
| **Verified** | `@IsNotMember(@UserName; TBV)` OR `CurrentAction != "Submitted"` |
| **Verify (TBV_N)** | `@IsNotMember(@UserName; TBV_N)` OR `CurrentAction != "Submitted"` OR `Module` not starting with "FI" OR `DateN != ""` |
| **Approved by BPO** | `@IsNotMember(@UserName; TBA)` OR `CurrentAction != "Verified"` |
| **Rejected by BPO** | `@IsNotMember(@UserName; TBA)` OR `CurrentAction != "Verified"` |
| **Withdrawn** | `@IsNotMember(@UserName; requestor)` OR `WTDOn != ""` |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| "Initiation" | `Module2` | `AEditor1:IT` — `AEditor1 = @If(CA="Request"\|CA="Submitted"; Requestor; "-")` |
| "Withdrawn" | `Withdrawn_` | `requestor` |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **PendingVerification** | Daily 09:00 on PHBSVR | `RemPdgVerification` (CA="Submitted" & PreparedDate+3 < @Today) | `doc.TBV` | `doc.requestor` | "SAP Authorisation Matrix Review Reminder - Pending Verification" |
| **PendingApproval** | Daily 09:00 on PHBSVR | `RemPdgApproval` (CA="Verified" & VerifiedDate+3 < @Today) | `doc.TBA` | `doc.requestor` | "SAP Authorisation Matrix Review Reminder - Pending Approval" |

---

## Module 17 — SAP Config Access (`SAPConfigAccess.nsf`)

> **State Field:** `CurrentAction`. One main form: `ConfigForm`. The workflow covers access request → IT approval → BASIS team opens config access → requestor closes → BASIS team confirms closure.

### State Machine — Form: `ConfigForm`

```
[Request: Draft]
       │
  (Submit — Requestor/Editor1)
       │
       ▼
  [Submitted: Pending IT Approval]
       │
  ┌────┼──────────────┐
(Approved)      (Rejected)  (Withdrawn)
  │                  │          │
  ▼                  ▼          ▼
[Approved:     [Rejected:  [Withdrawn: terminal]
 Pending        terminal]
 BASIS Reply]
       │
  (Reply — Transporter/Editor2)
       │
  ┌────┴──────────────────┐
(ConfigStatus=           (ConfigStatus=
 "Config Opened")         "Rejected")
  │                            │
  ▼                            ▼
[ConfigAccess-Done:     [Reject - Closed: terminal]
 Pending Requestor
 Closure Request]
       │
  (Submit for Closure — DocAuthor/Editor3)
       │
       ▼
  [Submitted-Closure: Pending BASIS Confirmation]
       │
  (Closed — Transporter/Editor4)
       │
       ▼
  [Completed: terminal]
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Submit** | `Editor1` = DocAuthor when CA=Request | Assigns INO running number; mails `ITAPP`; Subject: `"New Config Access request. Form# [DisplayNum]. Client : [Client]"` |
| `Submitted` | `Approved` | **Approved** | `Editor1a` = ITAPP when Submitted | Sets `Status=1`, `ApprovedDate`; mails `Transporter`; Subject: `"Config Access Request Form - [ReqNum] - APPROVED"` |
| `Submitted` | `Rejected` | **Rejected** | `Editor1a` | Sets `Status=0`; mails `requestor`; Subject: `"Config Access Request Form - [ReqNum] - REJECTED"` |
| `Submitted` | `Withdrawn` | **Withdraw** | DocAuthor | Sets `WDStatus="Withdrawn"`; mails `Transporter` |
| `Approved` | `ConfigAccess-Done` or `Reject - Closed` | **Reply** | `Editor2` = Transporter when Approved | If `ConfigStatus="Config Opened"` → CA="ConfigAccess-Done"; if `ConfigStatus="Rejected"` → CA="Reject - Closed"; mails DocAuthor |
| `ConfigAccess-Done` | `Submitted-Closure` | **Submit for Closure** | `Editor3` = DocAuthor:ITPIC | Sets `dtReqClose=@Now`; mails Transporter |
| `Submitted-Closure` | `Completed` | **Closed** | `Editor4` = Transporter when Submitted-Closure | Sets `Closure="Config closed"`; mails DocAuthor |

**Terminal states:** `Rejected`, `Reject - Closed`, `Withdrawn`, `Completed`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Submit** | `@IsNotMember(@UserName; Editor1)` OR `CurrentAction != "Request"` |
| **Approved** | `@IsNotMember(@UserName; Editor1a)` |
| **Rejected** | `@IsNotMember(@UserName; Editor1a)` |
| **Withdraw** | `@IsNotMember(@UserName; DocAuthor)` OR `CurrentAction != "Submitted"` |
| **Reply** | `@IsNotMember(@UserName; Editor2)` |
| **Submit for Closure** | `@IsNotMember(@UserName; Editor3)` |
| **Closed** | `@IsNotMember(@UserName; Editor4)` |
| **Comment from Requestor** | `@IsNotMember(@UserName; DocAuthor)` |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| "Section A - IT Functional Team" | `Creator` | `Editor1:ISAdmin` — `Editor1 = @If(CA="Request"\|CA="Submitted"; DocAuthor; "-")` |
| "IT Approval" | `Name` | `Editor1a` — `@If(CA="Submitted"; ITAPP; "-")` |
| "Section B - BASIS Team" | `BASIS_Admin` | `Editor2:ISAdmin` — `@If(CA="Approved"; Transporter; "-")` |
| "Section C - Request for Config Close" | `Request_Closure` | `Editor3:ISAdmin` — `@If(CA="ConfigAccess-Done"; DocAuthor:ITPIC; ISAdmin)` |
| "Section D - Completion" | `Basis_Admin_Close` | `Editor4:ISAdmin` — `@If(CA="Submitted-Closure"; Transporter; ISAdmin)` |
| "Requestor's Remarks (If Any)" | `Requestor_s_Remarks__` | `DocAuthor` — hidden for IED→IEQ→IEP, IBD→IBQ→IBP, DUAL→IEP clients |
| "Withdrawal" | `Withdrawn__` | `DocAuthor` — content hidden when `CurrentAction != "Withdrawn"` |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **RemPdgReqClosure** | Every 60 min on PHBSVR | `PdgReqClosure` (CA="ConfigAccess-Done" & dtReqClose="" & ConfigStatus="Config Opened") | `doc.DocAuthor` | `doc.ITPIC` | "Reminder to Functional: SAP Config Access – Pending Closure" |
| **RemPdgCompClosure** | Every 60 min on PHBSVR | `PdgCompletion` (CA="Submitted-Closure" & RemAdminStart ≤ @Now) | `doc.Transporter` | `doc.ITPIC2` | "Reminder to BASIS: SAP Config Access – Pending Completion" |

---

## Module 18 — SAP & WB Change Request Form (`SAPChgRequestForm.nsf`)

> **State Field:** `CurrentAction`. Primary form: `ChangeForm` (alias `ChangeFormV3`). Workflow: Requestor → BPO approval → PM approval → Developer investigation → PM impact analysis → Project Director final approval.

### State Machine — Form: `ChangeForm`

```
[Request: Draft]
       │
  (Send Change Request Form — Requestor/AEditor1)
       │
       ▼
  [Submitted: Pending BPO Approval]
       │
  ┌────┴──────────────┐
(Accept by BPO)  (Reject by BPO)
  │                   │
  ▼                   ▼
[BPOApp:         [BPORej: terminal]
 Pending PM
 Approval]
       │
  ┌────┴──────────────┐
(Accept by PM)   (Reject by PM)
  │                   │
  ▼                   ▼
[PMApp:          [PMRej: terminal]
 Pending Developer
 Investigation]
       │
  (Submit for Approval — Developer/AEditor3)
       │
       ▼
  [SubmittedDetails: Pending PM Impact Analysis]
       │
  (Acceptance by PM — AEditor5)
       │
       ▼
  [PMAppImp: Pending Project Director Final Approval]
       │
  ┌────┴──────────────┐
(Acceptance by PD) (Send for Approval — hidden)
  │                        │
  ▼                        ▼
[AppFinal:           [SubmittedApp:
 Completed]           Resolved]
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | `CurrentAction` defaults to `"Request"` |
| `Request` | `Submitted` | **Send Change Request Form** | `AEditor1` = DocAuthor when CA=Request | `Status="Pending Approval - BPO"`; mails BPO |
| `Submitted` | `BPOApp` | **Accept by BPO** | `nmAppBy` (BPO members) | `Status="Approved by BPO"` |
| `Submitted` | `BPORej` | **Reject by BPO** | `nmAppBy` | `Status="Rejected"` |
| `BPOApp` | `PMApp` | **Accept by PM** | `AEditor2` = AxonPM:ACMPM when CA=BPOApp | `Status="Pending Investigation"` |
| `BPOApp` | `PMRej` | **Reject by PM** | `AEditor2` | `Status="Rejected"` |
| `PMApp` | `SubmittedDetails` | **Submit for Approval** | `AEditor3` = nmAssgTo when CA=PMApp | `Status="Pending Impact Analysis - PM"` |
| `SubmittedDetails` | `PMAppImp` | **Acceptance by PM** | `AEditor5` | `Status="Pending Final Approval - Project Director"` |
| `PMAppImp` | `AppFinal` | **Acceptance by Project Director** | `KhooTC` (hardcoded) | `Status="Completed"` |
| `PMAppImp` | `SubmittedApp` | **Send for Approval** (hidden) | `AEditor5` | `Status="Resolved"` |

**Terminal states:** `BPORej`, `PMRej`, `AppFinal` (Completed), `SubmittedApp` (Resolved)

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Send Change Request Form** | `@UserName != AEditor1` OR `CurrentAction != "Request"` |
| **Accept by BPO** | `@IsNotMember(@V3UserName; nmAppBy)` OR `CurrentAction != "Submitted"` |
| **Reject by BPO** | `@IsNotMember(@V3UserName; nmAppBy)` OR `CurrentAction != "Submitted"` |
| **Accept by PM** | `@IsNotMember(@UserName; AEditor2)` OR `CurrentAction != "BPOApp"` |
| **Reject by PM** | `@IsNotMember(@UserName; AEditor2)` OR `CurrentAction != "BPOApp"` |
| **Submit for Approval** (Developer) | `@IsNotMember(@UserName; AEditor3)` OR `CurrentAction != "PMApp"` |
| **Acceptance by PM** | `@IsNotMember(@UserName; AEditor5)` OR `CurrentAction != "SubmittedDetails"` |
| **Acceptance by Project Director** | `@UserName != KhooTC` OR `CurrentAction != "PMAppImp"` |
| **Send for Approval** (hidden — `showinbar=false`) | `@IsNotMember(@UserName; AEditor5)` OR `CurrentAction != "PMAppImp"` |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| Section A — Initiation | `SAP_SUPPORT_PROBLEM_ISSUE_FORM` | `AEditor1:ISAdmin` — `AEditor1 = @If(CA="Request"; DocAuthor; "Nobody")` |
| Section E — Acceptance by BPO | `SECTION_E___ACCEPTANCE_BY_BUSINESS_PROCESS_OWNER` | `AEditor1:nmAppBy:ISAdmin` |
| Section F — Approval for Investigation | `SECTION_F___APPROVAL_FOR_INVESTIGATION` | `@If(CA="BPOApp"; AxonPM:ACMPM; "Nobody"):ISAdmin` |
| Section G — Investigation/Resolution Details | `SECTION_G___RESOLUTION_DETAILS` | `@If(CA="PMApp"; AEditor3; "Nobody"):ISAdmin` |
| Section H — Impact Analysis | `SECTION_I___RESOLUTION_DETAILS__ADDITIONAL_` | `@If(CA="SubmittedDetails"; AEditor5; "Nobody"):ISAdmin` |
| Section I — Approval for Implementation (Project Director) | `SECTION_H___APPROVAL_FOR_IMPLEMENTATION` | `@If(CA="PMAppImp"; KhooTC; "Nobody"):ISAdmin` |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **PdgHOD** | Daily 09:00 on PHBSVR (weekdays) | `PdgHODRem` (CA="Submitted" & Year ≥ 2019 & dtReportedBy+2 ≤ @Today) | `doc.nmAppBy` (BPO) | `doc.DocAuthor` | "SAP Change Request - Pending HOD Approval" |

---

## Module 19 — SAP Disaster Recovery — Penang (`SAPDRIssue.nsf`)

Same state machine as Module 2 (PanCen SAPDR). See Module 2 for full details.

**Additional fields in `ProcedureEntryV1`:** `selection1` (editable keyword), `AppBy` (approval names field).

**Additional agents:** `distributed` (sends to distribution list on procedure approval), `chg form` (updates form type).

---

## Module 20 — SAP Storage Location Creation — Penang (`SAPSLoc.nsf`)

Same state machine as Module 3 (PanCen SAPLoc). `txtHDocStatus` codes: `I → A → C → D`, with `RISG` branch.

**Additional field:** `txtHCpDepHeadApp` (Dept Head approval — editable, unlike Johor where this is computed).

---

## Module 21 — SAP Sign Off Form (`SAPSignForm.nsf`)

> **State Field:** `CurrentAction`. Four form variants: `SignOffForm-Ori` (original), `SignOffForm_SILO` (alias `SILO`), `SignOffForm_SILO_New` (alias `SILO2`), `SignOffForm_UAT`. The SILO/SILO2 variants use a multi-stage sign-off with named key users and BPO per slot.

### State Machine — Forms: `SignOffForm_SILO` / `SignOffForm_SILO_New`

```
[Request: Draft]
       │
  (Send to Key User — IT Initiator/AEditor1)
       │
       ▼
  [Submitted: Pending Key User Sign-Off]
       │  (Key users sign off individually in their named sections)
       │  (PPNameTo field drives access — AEditor2)
       │
  → [PPDone: Pending Purchasing Approval]
       │  (AEditor3 = SendToPUR group)
       │
  → [PURDone: Pending QC Approval]
       │  (AEditor4 = SendToQC group)
       │
  → [Completed_SAP: Pending IT Manager Endorsement]
       │  (AEditor5 = Clare:ISManager:Kelly)
       │
  → [Completed]
```

**`SignOffForm-Ori` (Original):** Simpler — IT staff directly sets `CA="Submitted"` via "Signed by IT" button; sends email to `CCEmail`. No multi-stage key-user gating.

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(any)* | `Submitted` | **Signed by IT** (Ori form) | IT staff | Sets `CA="Submitted"`; mails `CCEmail` |
| `Request` | `Submitted` | **Send to Key User** (SILO/SILO2) | `AEditor1` = initiator | Sets `CA="Submitted"`, `RemDate=Today()+7`; mails key users |

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Signed by IT** (Ori) | No hide-when — always visible in edit mode |
| **Send to Key User** (SILO/SILO2) | `@IsNotMember(@UserName; AEditor1)` |

### Section Access Rules

Section access uses `accessfieldkind='editable'` (named field access, not computed formula) for each key-user slot:

| AEditor Field | Formula | When Active |
|---|---|---|
| `AEditor1` | `@If(CurrentAction="Request"; initiator; "Nobody")` | Initiator fills request |
| `AEditor2` | `@If(CurrentAction="Submitted"; PPNameTo; "Nobody")` | Key users sign off |
| `AEditor3` | `@If(CurrentAction="PPDone"; SendToPUR; "Nobody")` | Purchasing approves |
| `AEditor4` | `@If(CurrentAction="PURDone"; SendToQC; "Nobody")` | QC approves |
| `AEditor5` | `@If(CurrentAction="Submitted_SAP"; Clare:ISManager:Kelly; "Nobody")` | IT Manager endorses |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **RemPdgKeyUsers** | Daily 09:00 on PHBSVR | `RemPdgKeyUsers` | Key users pending completion | CCAll | "SAP Sign Off Form - Pending Completion" |
| **RemPdgBPO** | Daily 09:00 on PHBSVR | `RemPdgBPO` | `doc.RemBPO` | `doc.DocAuthor` | `"[doc.Title] - Pending BPO Approval"` |
| **ReminderKeyUser** (DISABLED) | Every 4 hours on PHBSVR | `Reminder_SILO` (CA="Submitted") | `doc.RemKeyUsers` | `doc.CCAll` | "SAP Sign Off Form - Pending Completion" |

---

## Module 22 — SAP Transport Request (`SAPTransRequest.nsf`)

> **State Field:** `CurrentAction`. Primary form: `TRForm`. Dual-path workflow: IEQ-only (`Client` = non-IEP) vs. IEQ+IEP (`Client` = "IED to IEQ to IEP" or "IBD to IBQ to IBP"). The IEP path adds a second approval + transport cycle after IEQ completes.

### State Machine — Form: `TRForm`

```
IEQ-only path:
[Request] → (Submit) → [Submitted] → (Approve) → [Approved] → (Transport Done/Failed) → [Transported]/[FailedIEQ]

IEQ+IEP path:
[Request] → (Submit) → [Submitted] → (Approve IEQ) → [Approved] → (Transport IEQ) → [Transported]
  → (Send for IEP Approval) → [SubmittedIEP] → (Approve IEP) → [ApprovedIEP]
  → (Transport IEP) → [TransportedIEP] / [FailedIEP]

Failure retry: [FailedIEQ/FailedIEP] → (Retry) → [Approved]/[ApprovedIEP]
Any active state: (Withdrawn) → [Withdrawn]
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | CA defaults to `"Request"` |
| `Request` | `Submitted` | **Send for Approval** | `Editor1` = requestor | Mails `FirstApprovar`; Subject: `"New Transport Request Form. Request No : [DisplayNum] : Client : [Client]"` |
| `Submitted` | `Approved` | **Approved** (IEQ) | `Editor3` | `AppStatus="Approved"`; mails `Transporter` |
| `Submitted` | `Rejected` | **Rejected** (IEQ) | `FirstApprovar` | `AppStatus="Rejected"`; mails `DocAuthor` |
| `Approved` | `Transported` | **Transport Done** | `Transporter` | `TRStatus="Transported"`; mails `DocAuthor` |
| `Approved` | `FailedIEQ` | **Transport Failed** | `Transporter` | `TRStatus="Failed in IEQ"`; mails `DocAuthor` |
| `FailedIEQ` or `FailedIEP` | `Approved` or `ApprovedIEP` | **Retry** | `Editor4` | Resets to appropriate approved state |
| `Transported` | `SubmittedIEP` | **Send for Approval (IEP Transport)** | `Editor2` | Mails `FirstApprovar`; Subject: `"New Transport Request Form. Request No : [ReqNum]. Client : [Client_1]"` |
| `SubmittedIEP` | `ApprovedIEP` | **Approved in IEP** | `Editor3` | `AppStatus_1="Approved"`; mails `Transporter` |
| `SubmittedIEP` | `RejectedIEP` | **Rejected in IEP** | `Editor3` | `AppStatus_1="Rejected"`; mails `DocAuthor` |
| `ApprovedIEP` | `TransportedIEP` | **Transport Done — IEP/IBP** | `Transporter` | `TRStatus_1="Transported"`; mails `DocAuthor` |
| `ApprovedIEP` | `FailedIEP` | **Transport Failed — IEP/IBP** | `Transporter` | `TRStatus_1="Failed in IEP"`; mails `DocAuthor` |
| Any | `Withdrawn` | **Withdrawn** | `Editor5` | `WDStatus="Withdrawn"`; mails `MailB`; Subject: `"SAP Transport Request Form - Request No : [ReqNum] - Status : Withdrawn"` |

**Terminal states:** `Rejected`, `RejectedIEP`, `TransportedIEP` (IEP path), `Transported` (IEQ-only), `Withdrawn`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Send for Approval** | `@IsNotMember(@UserName; Editor1)` OR `CurrentAction != "Request"` |
| **Approved** (IEQ) | `@IsNotMember(@UserName; Editor3)` OR `CurrentAction != "Submitted"` OR `Client = "IED to IEQ to IEP"` OR `Client = "IBD to IBQ to IBP"` |
| **Rejected** (IEQ) | `@IsNotMember(@UserName; FirstApprovar)` OR same Client conditions |
| **Transport Done** | `@IsNotMember(@UserName; Transporter)` OR `CurrentAction != "Approved"` OR IEP client |
| **Transport Failed** | `@IsNotMember(@UserName; Transporter)` OR `CurrentAction != "Approved"` OR IEP client |
| **Retry** | `@IsNotMember(@UserName; Editor4)` |
| **Send for Approval (IEP)** | `@IsNotMember(@UserName; Editor2)` OR `CurrentAction != "Transported"` |
| **Approved in IEP** | `@IsNotMember(@UserName; Editor3)` OR `CurrentAction != "SubmittedIEP"` |
| **Rejected in IEP** | `@IsNotMember(@UserName; Editor3)` OR `CurrentAction != "SubmittedIEP"` |
| **Transport Done — IEP/IBP** | `@IsNotMember(@UserName; Transporter)` OR `CurrentAction != "ApprovedIEP"` OR `CurrentAction = "TransportedIEP"` |
| **Transport Failed — IEP/IBP** | `@IsNotMember(@UserName; Transporter)` OR `CurrentAction != "ApprovedIEP"` OR `CurrentAction = "TransportedIEP"` |
| **Withdrawn** | `@IsNotMember(@UserName; Editor5)` |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| Section A — IED/IBD to IEQ/IBQ | `TR_Category` | `Editor1:ISAdmin` |
| Section B — IEQ/IBQ to IEP/IBP | `Client2` | `Editor2:ISAdmin` |

### Scheduled Agents
None found — all agents use `trigger type='actionsmenu'` (manual/on-demand only).

---

## Module 23 — Share Folder Access Requisition (`SFRequest.nsf`)

> **State Field:** `CA` (alias for `CurrentAction`). Three form variants: `Form` (alias `lnir`), `Form1`, `Form2`. `Form2` adds an IT verification step for IOIPCNSHARE server requests; `Form1` handles Owner/HOD approval responses.

### State Machine

```
Standard path (non-IOIPCNSHARE):
[Request] → (Submit) → [Submitted]
  → (HOD/Owner Approve — Form1) → [OwnerApproved]
  → (HOD Approve — Form/lnir) → [HODApproved]
  → (ISG DONE/DENY) → [DONE]/[DENY]

IOIPCNSHARE server path (Form2):
[Request] → (Submit) → [Submitted]
  → (IT VERIFY) → [ITVerified]
  → (HOD/Owner Approve — Form1) → [OwnerApproved]
  → (HOD Approve — Form/lnir) → [HODApproved]
  → (ISG DONE/DENY) → [DONE]/[DENY]

IT can also DENY directly from Submitted/ITVerified → [Denied]
HOD/Owner can also REJECT → [OwnerRejected] / [HODRejected]
```

### CurrentAction State Transitions

| From | To | Button | Actor | Key Actions |
|---|---|---|---|---|
| *(new)* | `Request` | doc creation | Anyone | — |
| `Request` | `Submitted` | **Submit** (Form/lnir) | `Editor1` = Requestor | Sets `Requestor`, `DateSent=@Today`; routes to Owner/Verifier (non-IOIPCNSHARE) or PIC (IOIPCNSHARE); Subject: `"New Share Folder Access Request - Sent for Approval"` or `"...Verification"` |
| `Request` | `Submitted` | **Submit** (Form2) | `Editor1` | Conditional routing: IOIPCNSHARE→PIC; Type="New"→Verifier; else→Owner |
| `Submitted` | `ITVerified` | **VERIFY** (Form2, IOIPCNSHARE) | IT/PCNITSUP | `CA="ITVerified"`, `ITPICStatus="VERIFIED"`; mails Verifier/Owner |
| `Submitted` | `Denied` | **DENY** (Form2, IOIPCNSHARE) | IT/PCNITSUP | `CA="Denied"`, `ITPICStatus="REJECTED"`; mails DocAuthor; Subject: `"Share Folder Access Request - DENIED by IT"` |
| `Submitted` / `ITVerified` | `OwnerApproved` | **HOD/Owner APPROVE** (Form1) | Owner / HOD | `CA="OwnerApproved"`, `hodStatus="Approved"` |
| `Submitted` / `ITVerified` | `OwnerRejected` | **HOD/Owner REJECT** (Form1) | Owner / HOD | `CA="OwnerRejected"`, `hodStatus="Rejected"` |
| `OwnerApproved` | `HODApproved` | **HOD APPROVE** (Form/lnir) | HOD (`Editor2`) | `hodStatus="Approved"`; mails PIC |
| `OwnerApproved` | `HODRejected` | **HOD REJECT** (Form/lnir) | HOD (`Editor2`) | `hodStatus="Rejected"`; mails DocAuthor |
| `HODApproved` | `DONE` | **ISG DONE** (Form/lnir) | ISG (`Editor3`) | `AccStatus="DONE"`; mails DocAuthor:Maillist; Subject: `"Share Folder Access Request - COMPLETED by ISG"` |
| `HODApproved` | `DENY` | **ISG DENY** (Form/lnir) | ISG (`Editor3`) | `AccStatus="REJECTED"`; mails DocAuthor:Maillist; Subject: `"Share Folder Access Request - DENIED by ISG"` |

**Terminal states:** `Denied`, `OwnerRejected`, `HODRejected`, `DONE`, `DENY`

### Action Button Visibility

| Button | Hidden When |
|---|---|
| **Submit** (Form/lnir) | `CA != "Request"` |
| **Submit** (Form2) | `CA != "Request"` |
| **VERIFY** (Form2) | Section access (`Editor1a:IT`) + `CA="Request"` OR `Server != "IOIPCNSHARE"` OR `@Date(@Created) < 2022-06-01` |
| **DENY** (Form2) | Same as VERIFY |

### Section Access Rules

| Section | `accessfieldname` | Edit Formula |
|---|---|---|
| Requestor Section (Form/lnir) | `Requestor_Section` | `Editor1:ISG` |
| HOD Section (Form/lnir) | `ISG_HOD_Section_1` | `Editor2` |
| ISG/Acceptance Section (Form/lnir) | `Requestor_Acceptance_Section` | `Editor3` |
| Requestor Section (Form2) | `Requestor_Section` | `Editor1:IT` |
| IT Section (Form2 — IOIPCNSHARE only) | `Name` | `Editor1a:IT` |

### Scheduled Reminder Agents

| Agent | Schedule | View Queried | Sends To | CC | Subject |
|---|---|---|---|---|---|
| **PendingOwner** | Daily 10:00 on PHBSVR | `RemPdgOwner` (non-IOIPCNSHARE: CA="Submitted"; IOIPCNSHARE: CA="ITVerified"; DateSent+3 ≤ @Today) | `doc.Owner` | `doc.DocAuthor` | "Share Folder Access Requisition Reminder - Pending for Owner Approval" |
| **PendingHOD** | Daily 10:00 on PHBSVR | `RemPdgHOD` (CA="OwnerApproved" or Type="New" & CA="Verified"; OwnerDate+3 or ITDate+3 ≤ @Today) | `doc.HOD` | `doc.DocAuthor` | "Share Folder Access Requisition Reminder - Pending for HOD Approval" |
| **PendingISG** | Daily 10:00 on PHBSVR | `RemPdgPIC` (CA="HODApproved" or IOIPCNSHARE: CA="Submitted"; hodDate+3 ≤ @Today) | `doc.PIC` | `doc.DocAuthor` | "Share Folder Access Requisition Reminder - Pending for IT" |
| **RemPdgITSup** | Daily 10:00 on PHBSVR | `RemPdgITSup` | `doc.PCNITSUP` | `doc.DocAuthor` | "Share Folder Access Requisition Reminder - Pending for IT Superior" |
| **PendingITHOD** (DISABLED) | Daily 08:00 on PHBSVR | `RemPdgITHOD` (Type="New" & non-IOIPCNSHARE: CA="Submitted"; IOIPCNSHARE: CA="ITVerified") | `doc.Verifier` | `doc.RemCC` | "Share Folder Access Requisition Reminder - Pending for IT Verifier Approval" |
| **RemPdgITVer** (DISABLED) | Daily 10:00 on PHBSVR | `RemPdgITVer` | `doc.PCNITSUP` | `doc.DocAuthor` | "Share Folder Access Requisition Reminder - Pending for IT Verification" |

---

---

# APPENDIX A — Cross-Module State Field Reference

| Module | State Field | Initial State | Terminal State(s) |
|---|---|---|---|
| HWInv (JHR + PNG) | `status` | ACTIVE | SCRAP / MISSING |
| HWInv Checklist | date fields | — (blank) | Both timestamps set |
| SAPDR (JHR + PNG) | `CurrentAction` | `Request` | `Closed` |
| SAPLoc (JHR + PNG) | `txtHDocStatus` | `I` | `D` / `RISG` |
| EAF / VPN | `CurrentAction` | `Request` | `Closed` / `discard` |
| ITSSR | `CurrentAction` | `Draft` | `Closed` |
| NIR | `CurrentAction` | `Draft` | `Accepted` / `Rejected` |
| PRF | `CurrentAction` | `Draft` | `Completed` / `Cancelled` / `KIV` |
| RS (Reset Password) | `CurrentAction` + `status` | `Request` / `Drafting` | `Completed` (Done) / `Rejected` |
| SAPAMR | `CurrentAction` | `Request` | `Approved` / `Rejected` / `Withdrawn` |
| SAPCA | `CurrentAction` | `Request` | `Completed` / `Reject - Closed` / `Withdrawn` |
| SAPCR | `CurrentAction` | `Request` | `AppFinal` (Completed) / `BPORej` / `PMRej` |
| SAPSOF | `CurrentAction` | `Request` | `Completed` |
| SAPTR | `CurrentAction` | `Request` | `TransportedIEP` / `Transported` / `Rejected` / `Withdrawn` |
| SFAR | `CA` | `Request` | `DONE` / `DENY` / `Denied` / `OwnerRejected` / `HODRejected` |

---

# APPENDIX B — Common Role Groups Reference

| Group Name | Used In | Role |
|---|---|---|
| `Requestor1` / `authorReqBy` | SAPDR, SAPLoc | Original submitter — locked to the document |
| `Editor1` / `Editor2` / `Editor3` / `Editor4` | SAPDR, HWInv Checklist | Stage-specific approver groups |
| `ISAdmin` / `namesHCpISGAdmin` | All modules | IT administrators — always retain section access |
| `PanCen IT` | JHR modules | IT team (Johor) |
| `ACM IT` | PNG modules | IT team (Penang/Oleo) |
| `IT Software Team` | SAP modules (PNG) | SAP/software team |
| `ProdMail` | SAPLoc | Production team (for material code extension) |
| `txtHCpISGSec` | SAPLoc | ISG section person assigned per document |
| `Oleo Local & PanCen` | EAF, PRF, RS, SFAR | Combined both-sites editor group |
| `SAP BPO – Johor / Prai` | SAPDR, SAPCR | SAP Business Process Owners |
| `SAP Key Users – Johor / Prai` | SAPDR, SAPCR | SAP Key Users |
| `LocalDomainServers` | All | Domino servers — Manager level |

---

# APPENDIX C — Reminder Agent Architecture

All scheduled reminder agents across all modules follow this shared pattern:

```
1. SELECT documents from a _Rem view
   WHERE CurrentAction = "[PendingState]"
   AND   Rem_[Stage]Date <= @Today

2. FOR EACH document:
   a. Send reminder email:
      To:      [Stage approver field]
      CC:      [CC field]
      Subject: "[Module] – Pending [Stage] – [DocRef]"
      Body:    [DocLink to the document]

   b. Advance reminder date:
      Rem_[Stage]Date = @Adjust(@Today; 0; 0; +3; 0; 0; 0)
      (If @Weekday(@Today) is Thu(5), Fri(6), or Sat(7): add +4 days instead)

3. Save document silently

4. LOOP until no more documents in view
```

This creates an **escalating reminder cadence** — reminders fire every 3 business days with no maximum cap, until the document advances past the pending state.

---

# APPENDIX D — Section Access Formula Template

All Lotus Notes section access rules follow one of these formula patterns:

**Pattern 1 — State-gated access:**
```
@If(CurrentAction = "StateX"; EditorGroupName; "Nobody") : ISAdminGroup
```

**Pattern 2 — Named-person access (document-specific):**
```
@If(CurrentAction = "StateX"; ApproverNameField; "Nobody") : ISAdminGroup
```

**Pattern 3 — Always-open requestor section:**
```
RequestorField : ISAdminGroup
```

**Pattern 4 — Milestone-locked (becomes read-only after action):**
```
@If(CurrentAction = "StateX" | CurrentAction = "StateY"; EditorGroup; "Nobody")
```

The `: ISAdminGroup` suffix ensures IT administrators can always access any section regardless of state — used for error recovery, admin corrections, and support.

---

*End of document — IT Routing Rules, Roles & Section Access v2.0*  
*Generated: 22 May 2026 | Updated: 27 May 2026 | Source: DXL XML action button formulas, section access formulas, agent LotusScript*  
*All 23 modules fully extracted from DXL. Includes PHBSVR2 (LNIDRequest) and PHBSVR3 (PRF26) replicas.*
