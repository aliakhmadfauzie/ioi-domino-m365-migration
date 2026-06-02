# Workflow Candidates — CWR.pdf (SRC-HR-004)

> **Form**: Contract Worker Requisition (Outsourcing) | **Classification**: **Clearly Found Approval** (4-stage: HOD→DivHead→AGM HR→Requestor Acknowledge)

## Signals Found

| Signal | Evidence | Page | Confidence |
|---|---|---|---|
| `CurrentAction` | "Current Action : CurrentAction" | 4 | Clearly Found |
| `ApproveReject` ×3 | HOD: "Approved Rejected HODApp", DivHead: "Approved Rejected HODApp3", AGM HR: "Approved Rejected HRApp" | 3 | Clearly Found |
| `AcknowledgeDeny` | Requestor: "Acknowledge Deny HODApp2" | 4 | Clearly Found |
| `SendTo` | "To (HOD) : SendTo" | 1 | Clearly Found |
| `StatusField` | "Request Status : Status" | 4 | Clearly Found |
| `Editor1-4` | Editor1, Editor2, Editor2a, Editor3, Editor4 | 4 | Clearly Found |

## Classification

| Attribute | Value |
|---|---|
| Approval Required | **Required — Clearly Found** |
| Stages | 4: HOD Endorsement → Division Head Approval → AGM HR Acknowledgment → Requestor Acknowledgment |
| CurrentAction | ✅ Present |

## Stages

| Stage | Role | Action | Flag |
|---|---|---|---|
| 1 | HOD | Endorse — Approved/Rejected | HODApp |
| 2 | Division Head | Approve — Approved/Rejected | HODApp3 |
| 3 | AGM HR | Acknowledge — Approved/Rejected | HRApp |
| 4 | Requestor | Acknowledge — Acknowledge/Deny | HODApp2 |

## Promotion

✅ **Promote with Human Confirmation** — 4-stage workflow clearly documented. CurrentAction/Status values need HR confirmation.
