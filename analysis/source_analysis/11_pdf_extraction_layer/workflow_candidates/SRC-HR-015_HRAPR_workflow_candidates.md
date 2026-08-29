# SRC-HR-015 HRAPR Workflow Candidates

> Form: HR Applications Problem Reporting | Batch: EXB-005

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| submission | 1 | Sent Date, Case No., Reported By, Problem Description |
| assignment_or_action | 1 | To GHR Personnel, Carried out by, Solution, Case Status, Date Started, Date Completed |
| rejection | 2 | Rejected, CaseStatus_1, DateReject, ISRemarks |
| acceptance | 2 | Requestor's Acceptance, Status, Date Accepted, Comment |
| archive | 2 | KIV/ARCHIVED by, KIVStatus, KIVDate |
| current_action | 2 | CurrentAction |
| routing_or_roles | 2 | ISG, PIC, GHR, GHR2, HRHOD, AEditor1-3 |

## Classification

- Classification: Problem-report handling workflow candidate.
- Rationale: Requestor submission is routed to GHR/ISG personnel, then can move through solution/completion, rejection, requestor acceptance, and KIV/archive handling.
- Status: Candidate pending quality review.

