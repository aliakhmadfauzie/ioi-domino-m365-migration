# Workflow Candidates — DRD.pdf (SRC-HR-005)

> **Form**: Duty Roster Database | **Classification**: **Clearly Found Approval** (3-stage: HOS→HOD→HR)

## Signals Found

| Signal | Evidence | Page | Confidence |
|---|---|---|---|
| `CA_alias` | "CurrentAction : CA" | 2 | Clearly Found |
| `CurrentAction` | "CurrentAction" field label | 2 | Clearly Found |
| `HOS` | "HOS APPROVAL" section + HOSName, HOSDate, HOSRemark, HOSApp | 2 | Clearly Found |
| `HOD` | "HOD APPROVAL" section + HODName, HODDate, HODRemark, HODApp | 2 | Clearly Found |
| `HR_Use` | "FOR HR Use :- Received" + HRName, HRDate, HRApp | 2 | Clearly Found |
| `Editor1-4` | Section A, HOS, HOD, HR roles | 2 | Clearly Found |

## Classification

| Attribute | Value |
|---|---|
| Approval Required | **Required — Clearly Found** |
| Stages | 3: HOS Approval → HOD Approval → HR Received |
| CurrentAction | ✅ Present as `CA` alias |

## Stages

| Stage | Role | Action | Flag |
|---|---|---|---|
| 1 | HOS | Approve | HOSApp |
| 2 | HOD | Approve | HODApp |
| 3 | HR | Receive/Process | HRApp |

**Note**: No explicit APPROVE/REJECT text — but HOSApp/HODApp/HRApp flags + named approval sections + CA (CurrentAction) confirm workflow.

## Promotion

✅ **Promote** — 3-stage with CA. Clean, well-documented. Shift code reference data on page 1.
