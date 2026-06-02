# Workflow Candidates — EEN.pdf (SRC-HR-006)

> **Form**: Employee Exit Notification | **Classification**: **Clearly Found Approval** (APPROVE/REJECT with CurrentAction)

## Signals Found

| Signal | Evidence | Page | Confidence |
|---|---|---|---|
| `CurrentAction` | CurrentAction field | 8 | Clearly Found |
| `CA_alias` | CA field | 8 | Clearly Found |
| `ApproveReject` | "APPROVE REJECT" title + Status, EDName, EDDate, Remarks | 3 | Clearly Found |
| `HOD` | "Superior : HOD", "Department/Division Head : DivHead" | 1-2 | Clearly Found |
| `StatusField` | "Status : Status" | 3 | Clearly Found |
| `ExtendDate` | "Please click on Extend Date button" | 2 | Clearly Found |
| `ITNotify` | "Notify IT", "Sent by SentBy on SentDate" | 6 | Clearly Found |
| `Editor1-3` | Editor1, Editor2, Editor3 | 8 | Clearly Found |

## Classification

| Attribute | Value |
|---|---|
| Approval Required | **Required — Clearly Found** |
| Stages | 2+: Submit → ED Approval (APPROVE/REJECT) → IT Notification |
| CurrentAction | ✅ Present |

## Stages

| Stage | Role | Action |
|---|---|---|
| 1 | HR/Requester | Submit exit notification with interview |
| 2 | ED (Executive Director?) | APPROVE/REJECT |
| 3 | IT | Notified of deactivation date |

**Note**: Largest HR form (8 pages). Exit interview questionnaire embedded. Deactivation date extension capability via "Extend Date" button. IT notification on actual last working day.

## Promotion

✅ **Promote with Human Confirmation** — APPROVE/REJECT + CurrentAction confirmed. ED role needs clarification. Exit interview is structured questionnaire.
