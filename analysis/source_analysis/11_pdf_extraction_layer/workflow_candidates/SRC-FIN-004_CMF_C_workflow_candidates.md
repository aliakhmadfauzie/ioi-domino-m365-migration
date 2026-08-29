# SRC-FIN-004 CMF_C Workflow Candidates

> Form: Review of Customers on Credit | Batch: FXB-002

| Candidate ID | Signal Type | Evidence | Page | Classification | Status | Confidence |
|---|---|---|---:|---|---|---|
| WFC-FIN-004-001 | approval_section | Verified & Endorsed by Marketing Manager with Approve/Deny and `App1` | 3 | Marketing endorsement | Candidate | High |
| WFC-FIN-004-002 | approval_section | Approved by `SectionTitle` with GM fields and `App1_1` | 3 | GM/section approval | Candidate | Medium |
| WFC-FIN-004-003 | review_section | Finance Review with Approve/Deny and `App2` | 4 | Finance review | Candidate | High |
| WFC-FIN-004-004 | approval_section | Approved by `SectionTitle_1_1` with ED fields and `App3` | 4 | ED approval | Candidate | High |
| WFC-FIN-004-005 | acknowledgement | To be Acknowledged by Finance with `App6` | 4 | Finance acknowledgement | Candidate | High |
| WFC-FIN-004-006 | current_action | Current Action `CA` | 5 | Required workflow state | Candidate | High |
| WFC-FIN-004-007 | routing_field | Marketing, ED, IT, Finance, editor, mail list fields | 5 | Conditional routing | Candidate | Medium |

## Classification

CMF_C requires a multi-stage credit review workflow: Marketing Manager endorsement, GM/section approval, Finance review, ED approval, and Finance acknowledgement. Exact state values and routing conditions require human confirmation.

