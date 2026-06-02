# SRC-HR-007 EPDU Workflow Candidates

> Form: Employee Personal Detail Update | Batch: EXB-003

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| status_field | 1 | status, ca |
| status_field | 2 | status, ca |
| status_field | 3 | status, hraction, ca |
| submission | 3 | submitted by, submitted on |
| review_or_acceptance | 3 | accepted by, accepted on, notify hr, for hr use |
| routing_or_roles | 3 | hr_1, hr_2, hr_3, hrhod, servers, readers |

## Classification

- Classification: **HR review / notification candidate**
- Rationale: Status + NOTIFY HR + HRAction/Accepted fields indicate HR review after submission.
- Status: Candidate pending quality review.
