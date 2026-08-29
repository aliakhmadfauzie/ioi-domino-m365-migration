# SRC-FIN-002 CMF_A Workflow Candidates

> Form: Approval for Credit Application Form | Batch: FXB-001

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| submission | 1 | Initiation, DateInitiated, CompanyName |
| approval_section | 2 | GM approval, Approve Deny, App1 |
| finance_review | 2 | Finance Review, App2, Conversion Rate, FMAtt |
| approval_section | 2-3 | Senior Financial Controller, SGM Operations, ED approval, App3-App5 |
| acknowledgement | 3 | To be Acknowledged by Finance, App6 |
| cancellation | 4 | For Finance follow up, CANCEL, Cancelled by |
| current_action | 4 | Current Action, CA |
| routing_or_roles | 4-5 | COO, ED, FIN, FIN2, FINHOD, Marketing roles, Editor1-8 |

## Classification

- Classification: Multi-stage credit approval workflow.
- Rationale: CMF_A includes initiation, GM approval, Finance review, Senior Financial Controller, SGM/ED approvals, Finance acknowledgement, cancellation/follow-up, CurrentAction, and routing/editor fields.
- Status: Candidate pending quality review.

