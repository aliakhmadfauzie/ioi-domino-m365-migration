# Form Requirement — Contract Worker Requisition (CWR)

> **Source ID**: SRC-HR-004 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 96/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/CWR.pdf` (4 pages, 2,179 chars)
> **Promotion**: ⚠️ Promote with Human Confirmation — CurrentAction/Status values need HR

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-004 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "Contract Worker title / Form (Outsourcing)" | Clearly Found |
| Form Purpose | Request contract workers (permanent/temporary or plant shutdown) — 4-stage approval: HOD → DivHead → AGM HR → Requestor Acknowledge, then HR/MTN fills requisition details | Clearly Found |
| Pages | 4 | Clearly Found |
| Submission Note | "To issue form to HR minimum 2 months in advance!" | Clearly Found |

## 2. Form Sections

| Section | Page | Type |
|---|---|---|
| Initiation | 1 | Requester |
| Permanent/Temporary Contract Workers | 1-2 | Requester (dual-section with Plant Shutdown) |
| Plant Shutdown Contract Workers | 2 | Requester |
| Endorsed by HOD | 2-3 | Approver (Stage 1) |
| Approved by Division Head | 3 | Approver (Stage 2) |
| Acknowledged by AGM HR | 3 | Approver (Stage 3) |
| To be filled by HR/MTN | 3-4 | Admin |
| Acknowledged by Requestor | 4 | Requester (Stage 4) |
| Hidden Fields | 4 | System |

## 3. Field Requirements (Key Fields — 62 total)

### Initiation

| Field | Domino | Type | Confidence |
|---|---|---|---|
| Issue No | `IssueNo` | Number | Clearly Found |
| To (HOD) | `SendTo` | Person | Clearly Found |
| Division Head | `DivHead` | Person | Clearly Found |
| From (Name) | `Name` | Person | Clearly Found |
| Type of Contract Workers | `Type` | Choice | Clearly Found |
| Category | `PermCategory` | Choice | Clearly Found |

### Permanent/Temporary Workers

| Field | Domino | Type | Confidence |
|---|---|---|---|
| Site | `Site` | Text | Clearly Found |
| No. of Workers | `NoWorkers` | Number | Clearly Found |
| Section | `Workstation` | Text | Clearly Found |
| Job Description | `JD` | Multiline | Clearly Found |
| Working Hour | `WorkingHour` | Text | Clearly Found |
| Date Required | `Period` | Date | Clearly Found |
| Current no. of workers | `CurrentNoWorkers` | Number | Clearly Found |
| Period Required (3 rows) | `tPeriod_N_1`→`fPeriod_N_1` + `TotalDays_N_1` | Date range + Number | Clearly Found |
| Effective Date | `EffDate` | Date | Clearly Found |
| Justification | `Justification` | Multiline | Clearly Found |

### Plant Shutdown Workers (parallel section, same structure with `_2` suffix fields)

### Approval Stages

| Stage | Role | Action | Choice | Flag |
|---|---|---|---|---|
| 1 | HOD | Endorse | Approved/Rejected | `HODApp` |
| 2 | Division Head | Approve | Approved/Rejected | `HODApp3` |
| 3 | AGM HR | Acknowledge | Approved/Rejected | `HRApp` |
| 4 | Requestor | Acknowledge | Acknowledge/Deny | `HODApp2` |

### HR/MTN Fill

| Field | Domino | Type |
|---|---|---|
| Requisition filled by | `Vendor` | Text |
| Number of pax | `Pax` | Number |
| Required Due date | `DateHR` | Date |
| Request Status | `Status` | Choice |
| Remarks/Attachment | `Remarks` | Multiline |
| Updated by | `UpdatedBy` | Person |

### Hidden

`CurrentAction`, `Editor1`-`Editor5`, `HR2`, `MTN`, `HRHOD`, `INO`, `RemDate`, `RemSubject`, `RemCC`

## 4. Choice Fields

| Field | Choices | Confidence |
|---|---|---|
| HOD Approve/Reject | **Approved, Rejected** | Clearly Found |
| DivHead Approve/Reject | **Approved, Rejected** | Clearly Found |
| AGM HR Approve/Reject | **Approved, Rejected** | Clearly Found |
| Requestor Acknowledge/Deny | **Acknowledge, Deny** | Clearly Found |
| Type, PermCategory, Status, CurrentAction | Unknown | Unknown |

## 5. Repeating Tables

**Period Required date rows** (3 rows × 2 worker sections) — **Child List Candidate** for `MainDB_HR_Ext_CWR_Periods`.

## 6. Workflow

| Attribute | Value |
|---|---|
| Approval Required | **Required — Clearly Found** |
| Stages | 4: HOD → DivHead → AGM HR → Requestor |
| CurrentAction | ✅ Present |
| Routing | `SendTo` field routes to HOD |

## 7. SharePoint Design

**Parent**: `MainDB_HR` (header + approval fields)
**Child**: `MainDB_HR_Ext_CWR_Workers` (worker details — 2 types × per-section fields)
**Child**: `MainDB_HR_Ext_CWR_Periods` (period date rows)
**FormCode**: `CWR`

## 8. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| CWR-01 | CurrentAction workflow state values? | High |
| CWR-02 | Status dropdown values? | Medium |
| CWR-03 | Type and PermCategory choice values? | Medium |

## 9. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes |
| Approval Required | ✅ Required (4-stage) |
| Promotion Quality | 96/100 |
