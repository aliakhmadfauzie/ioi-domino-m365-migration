# Form Requirement Register

> Master register tracking all form requirement extractions from PDF source analysis.

## Register Summary

| Batch | Source IDs | Forms Extracted | Status | Started | Completed | Fields | Choices | Workflows | Human Confirmations |
|---|---|---|---|---|---|---|---|---|---|
| 001 | SRC-001, SRC-002, SRC-003 | 3 | Completed | 2026-06-01 | 2026-06-01 | 63 | 0 (all Unknown) | 2 (1 Clearly Found, 1 Inferred) | 12 |
| 002 | SRC-004, SRC-005, SRC-006 | 3 | Completed | 2026-06-01 | 2026-06-01 | 48 | 0 (all Unknown) | 3 (all Inferred) | 18 |

## Form Entries

| Req ID | Source ID | Department | Form Name | Status | Fields Extracted | Has Approval | Has Repeating Table | Has Attachments | Requirement File | Last Updated |
|---|---|---|---|---|---|---|---|---|---|---|
| REQ-001 | SRC-001 | IT | External Access Form (EAF) | Analyzed | 21 | Clearly Found (5-stage) | No | No | `IT/SRC-001_EAF_REQUIREMENTS.md` | 2026-06-01 |
| REQ-002 | SRC-002 | IT | Hardware Inventory (HI) | Analyzed | 26 | Not Required | Yes (Software) | No | `IT/SRC-002_HI_REQUIREMENTS.md` | 2026-06-01 |
| REQ-003 | SRC-003 | IT | IT Activity Log 1 (IAL1) | Analyzed | 16 | Inferred (single review) | No | No | `IT/SRC-003_IAL1_REQUIREMENTS.md` | 2026-06-01 |
| REQ-004 | SRC-004 | IT | IT Activity Log 2 (IAL2 — Server Reboot) | Analyzed | 16 | Inferred (single review) | No | No | `IT/SRC-004_IAL2_REQUIREMENTS.md` | 2026-06-01 |
| REQ-005 | SRC-005 | IT | IT Activity Log 3 (IAL3 — ISG Events) | Analyzed | 16 | Inferred (single review) | No | No | `IT/SRC-005_IAL3_REQUIREMENTS.md` | 2026-06-01 |
| REQ-006 | SRC-006 | IT | IT Activity Log 4 (IAL4 — Server Records) | Analyzed | 22 | Inferred | No | No | `IT/SRC-006_IAL4_REQUIREMENTS.md` | 2026-06-01 |
| REQ-007 | SRC-HR-003 | HR | Cafeteria Inspection (CIR) | Analyzed | 22 | Not Required | No | No | `HR/SRC-HR-003_CIR_REQUIREMENTS.md` | 2026-06-01 |
| REQ-008 | SRC-HR-001 | HR | Backup Staff Database (BSD) | Analyzed | 39 | Clearly Found (3-stage) | Yes (Backup Staff — Child List Candidate) | No | `HR/SRC-HR-001_BSD_REQUIREMENTS.md` | 2026-06-01 |
| REQ-009 | SRC-HR-002 | HR | Rest Day & Additional Working Hours (AWHR) | Analyzed | 47 | Clearly Found (3-stage) | Yes | Yes | `HR/SRC-HR-002_AWHR_REQUIREMENTS.md` | 2026-06-01 |
| REQ-010 | SRC-HR-004 | HR | Contract Worker Requisition (CWR) | Analyzed | 62 | Clearly Found (4-stage) | Yes | No | `HR/SRC-HR-004_CWR_REQUIREMENTS.md` | 2026-06-01 |
| REQ-011 | SRC-HR-005 | HR | Duty Roster Database (DRD) | Analyzed | 35 | Clearly Found (3-stage) | No | Yes | `HR/SRC-HR-005_DRD_REQUIREMENTS.md` | 2026-06-01 |
| REQ-012 | SRC-HR-006 | HR | Employee Exit Notification (EEN) | Analyzed | 70 | Clearly Found (multi-stage) | No | Yes | `HR/SRC-HR-006_EEN_REQUIREMENTS.md` | 2026-06-01 |

---

*Last Updated: 2026-06-01*
