# Workflow Candidates — BSD.pdf (SRC-HR-001)

> **Form**: Backup Staff Database | **Department**: HR | **Classification**: **Clearly Found Approval** (multi-stage with CurrentAction)

## Workflow Signals Found

| Signal Type | Evidence | Page | Confidence |
|---|---|---|---|
| `CurrentAction` | Hidden field: `Status : CurrentAction` | 3 | Clearly Found |
| `ApprovalSection` | "SECTION D - APPROVED BY HEAD OF DIVISION" | 3 | Clearly Found |
| `ApproveReject` | "APPROVE REJECT" text in SECTION D | 3 | Clearly Found |
| `ApproverRole` | "HODName", "HODPost", "HODDate", "HODRemarks", "HODApp" | 3 | Clearly Found |
| `StatusField` | "Status : Status" + "Status : CurrentAction" | 3 | Clearly Found |
| `MultiStage` | Section A (HOD/HOS fill), C (Nominated by HOD/HOS), D (Approved by HOD) — 3 role stages | 1-3 | Clearly Found |
| `EditorRoles` | Editor1 (HR Section), Editor2 (HOD Section), Editor3 (HOD/HOS) | 3 | Clearly Found |

## Workflow Classification

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | **Required** | Clearly Found |
| Stages | 3: Section A (HOD/HOS fill) → Section C (Nomination) → Section D (Approval with APPROVE/REJECT) | Clearly Found |
| CurrentAction present | ✅ Yes | Clearly Found |
| Routing instructions | Not in text extraction — likely in Domino agent code | Unknown |
| Status values | `Status` field present but values not in text | Unknown |

## Possible Stages

| Stage | Section | Role | Action |
|---|---|---|---|
| 1 | SECTION A | HOD/HOS | Fill person-in-charge details |
| 2 | SECTION C | HOD/HOS | Nominate backup staff, submit |
| 3 | SECTION D | Head of Division | APPROVE or REJECT with name/date/remarks |

## Notification Signals

| Signal | Evidence | Confidence |
|---|---|---|
| Editor roles | Editor1/2/3 suggest notification routing | Inferred |

## Promotion Recommendation

✅ **Promote with Human Confirmation** — Approval is Clearly Found (CurrentAction + APPROVE/REJECT + multi-section). Status values and routing details need human confirmation from the business.
