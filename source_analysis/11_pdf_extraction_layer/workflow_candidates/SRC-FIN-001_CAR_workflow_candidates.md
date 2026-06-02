# SRC-FIN-001 CAR Workflow Candidates

> Form: Capital Appropriation Request | Batch: FXB-001

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| approval_matrix | 1 | Contract Amount, Recommended by, Approved by, RM thresholds, Board of Directors |
| submission | 3 | Requested by, Requested Date, Requestor Position |
| finance_verification | 3 | To be Verified by Finance, VerName, VerDate, VerRem |
| approval_section | 3-5 | Reviewed By, Recommended By, SGM-Operations Approval, Director's Approval |
| conditional_hardcopy | 5 | For Budget Exceeded 1000000, hard copy approval, Done |
| completion_workflow | 5-10 | CAR Completion, additional amount, HOD/Owner/SGM approvals, post-completion, cancellation |
| current_action | 10 | Current Action, CA |
| routing_or_roles | 10-11 | FIN1-4, FINAdmin, PURPIC, ITHOD, ADM, ENG, MTN, ECMMTN, ED, SGM, Editor1-13 |

## Classification

- Classification: Complex multi-stage capital approval and completion workflow.
- Rationale: CAR has an amount-threshold approval matrix, Finance verification, HOD reviews, recommender, SGM/Director approval, budget-exceeded hard-copy path, completion approvals, additional amount/extension flags, cancellation, and CurrentAction routing.
- Status: Candidate pending quality review.

