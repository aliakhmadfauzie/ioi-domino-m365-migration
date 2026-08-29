# SRC-FIN-003 CMF_B Workflow Candidates

> Form: Temporary Credit Limit Change Form | Batch: FXB-001

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| submission | 2 | Requested by, reqby, reqdate |
| policy_rule | 2 | Fresh Credit Application Form required after two consecutive TCLC |
| approval_section | 2 | Marketing Manager approval, GM approval, App1/App1_1 |
| finance_review | 2-3 | Finance Review, App2, Conversion Rate |
| approval_section | 3 | ED approval, App3 |
| acknowledgement | 3 | To be Acknowledged by Finance, ExpiryDate, App6 |
| current_action | 3 | Current Action, CA |
| routing_or_roles | 3-4 | Marketing roles, ED, FIN, Editor1-5 |

## Classification

- Classification: Temporary credit limit approval workflow.
- Rationale: CMF_B includes requestor submission, marketing/GM approval, Finance review, ED approval, Finance acknowledgement with expiry date, CurrentAction, and a policy link back to CMF_A after two consecutive temporary changes.
- Status: Candidate pending quality review.

