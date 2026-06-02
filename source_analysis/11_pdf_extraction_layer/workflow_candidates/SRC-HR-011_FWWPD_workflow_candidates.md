# SRC-HR-011 FWWPD Workflow Candidates

> Form: Foreign Workers Work Permit Database | Batch: EXB-004

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| status_field | 1 | Status, Reason, Remark |
| table_completion | 2-4 | Done markers across insurance, FOMEMA, MYEG, and contract rows |
| current_action | 5 | Current Action, CurrentAction |
| routing_or_roles | 5 | IT Admin, HR Reminder, HR HOD, Pending Employment Contract, HR List, Section E Editors |

## Classification

- Classification: Foreign-worker permit record / task tracking candidate.
- Rationale: The form has current-action and reminder/editor routing fields, but the visible sections are administrative tracking tables rather than a request approval chain.
- Status: Candidate pending quality review.

