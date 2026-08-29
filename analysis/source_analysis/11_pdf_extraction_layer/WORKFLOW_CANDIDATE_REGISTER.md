# Workflow Candidate Register

> Pre-promotion workflow register. Workflow signals extracted from PDFs are stored here as **candidates** until verified by quality review and promoted to `WORKFLOW_REGISTER.md`.

## Register Format

| Candidate ID | Source ID | Form | Signal Type | Evidence Text | Page | Classification | Status | Confidence |
|---|---|---|---|---|---|---|---|---|

## Signal Types

| Signal | Meaning |
|---|---|
| `status_field` | Status/dropdown field found (e.g., status1, status2) |
| `approval_section` | Section labeled "ACCEPTANCE", "APPROVAL", "REVIEW" |
| `signature_block` | "Accepted by" + "Accepted Date" pattern |
| `current_action` | `CurrentAction` field (Domino workflow state machine) |
| `routing_field` | `SendTo`, `Recipients`, `isPCN` (conditional routing) |
| `multi_stage` | Multiple numbered status/approval sections |
| `no_approval` | No approval signals detected |

## Classification Rules

| Signal Present | Classification |
|---|---|
| `current_action` + multiple `statusN` | **Required** — Clearly Found |
| `approval_section` + `signature_block` (no routing) | **Inferred** |
| `signature_block` only (no section header) | **Inferred** or **Unknown** |
| `no_approval` signals at all | **Not Required** — Clearly Found |

## Pending Candidates

| Candidate ID | Source ID | Form | Signal Type | Evidence | Classification | Status |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — |
| WFC-HR-004 | SRC-HR-004 | CWR | CurrentAction + ApproveReject x3 + AcknowledgeDeny | 4-stage HOD-DivHead-AGM HR-Requestor | Clearly Found Approval | Candidate |
| WFC-HR-005 | SRC-HR-005 | DRD | CA alias + HOS/HOD/HR stages + flags | 3-stage HOS-HOD-HR | Clearly Found Approval | Candidate |
| WFC-HR-006 | SRC-HR-006 | EEN | CurrentAction + CA + APPROVE/REJECT x2 + Withdraw | Multi-stage with ED approval and withdrawal | Clearly Found Approval | Candidate |
| WFC-HR-007 | SRC-HR-007 | EPDU | Status + NOTIFY HR + HRAction/Accepted fields | HR review / notification after employee detail submission | HR review / notification candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-008 | SRC-HR-008 | EPHR | Medical/status fields only; no approval routing | Employee health record with no approval section in extracted text | Not approval / record form candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-009 | SRC-HR-009 | ESF | CA/system fields; survey ratings and comments | Survey form with no approval/routing section in extracted text | Not approval / survey form candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-010 | SRC-HR-010 | FTCR | CurrentAction + recommendation/endorsement + AGM HR/COO/ED approval | Fixed-term contract multi-stage approval | Clearly Found Approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-011 | SRC-HR-011 | FWWPD | CurrentAction + status + Done markers + HR reminder/admin fields | Foreign-worker permit record/task tracking | Record / task tracking candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-012 | SRC-HR-012 | FWWPE | CurrentAction + Superior reply + HOS/HOD/HR approvals + completion/withdrawal sections | Foreign-worker work-period extension workflow | Clearly Found Approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-013 | SRC-HR-013 | GDSN | CurrentAction + submitter + HOD section + department routing | Gift/donation/sponsorship HOD endorsement and notification | HOD endorsement / notification candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-014 | SRC-HR-014 | HEALTHINFO | CurrentAction + status updates + viewed counter, no approval section | HR information/notice broadcast | Information broadcast / non-approval candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-HR-015 | SRC-HR-015 | HRAPR | CurrentAction + GHR/ISG action + rejection + requestor acceptance + KIV/archive | HR applications problem-report handling | Problem-report handling workflow candidate | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-001 | SRC-FIN-001 | CAR | Amount threshold matrix + Finance verification + HOD/recommender/SGM/Director/completion approvals | Capital approval and completion lifecycle | Complex multi-stage approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-002 | SRC-FIN-002 | CMF_A | GM + Finance + SFC + SGM/ED + Finance acknowledgement | Credit application approval | Multi-stage credit approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-003 | SRC-FIN-003 | CMF_B | Marketing + GM + Finance + ED + Finance acknowledgement + TCLC expiry | Temporary credit limit change workflow | Multi-stage credit approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-004 | SRC-FIN-004 | CMF_C | Marketing Manager endorsement + GM/section approval + Finance review + ED approval + Finance acknowledgement | Customer credit review workflow | Multi-stage credit approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-005 | SRC-FIN-005 | EARF | Finance verification + Department Head approval + reviewer + Division Head approval + completion/cancellation | Low-value asset request lifecycle | Multi-stage asset approval | Promoted to Requirements - Human Confirmation Pending |
| WFC-FIN-006 | SRC-FIN-006 | RSES | Approver acceptance + Finance acceptance + CurrentAction | Service entry reversal workflow | Two-stage approval/completion | Promoted to Requirements - Human Confirmation Pending |

*EXB-003, EXB-004, EXB-005, FXB-001, and FXB-002 workflow candidates passed quality review and were promoted to source requirements. EPDU remains HR review/notification only unless additional routing evidence confirms a formal approval workflow; FWWPD remains record/task tracking unless DXL proves approval behavior; HEALTHINFO remains non-approval unless DXL or SME evidence proves publication approval. Finance FXB-001/002 workflows require human confirmation for threshold routing, exact state values, row/table storage, asset consultation routing, and credit-limit/customer review rules before app build.*

---

*Last Updated: 2026-06-02*
