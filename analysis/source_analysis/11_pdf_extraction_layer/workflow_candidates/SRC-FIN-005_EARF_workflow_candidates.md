# SRC-FIN-005 EARF Workflow Candidates

> Form: Expenditure Appropriation Request Form | Batch: FXB-002

| Candidate ID | Signal Type | Evidence | Page | Classification | Status | Confidence |
|---|---|---|---:|---|---|---|
| WFC-FIN-005-001 | review_section | To be Verified by Finance; Finance verifies asset number | 2 | Finance verification | Candidate | High |
| WFC-FIN-005-002 | approval_section | Department Head Approval with Approve/Deny and `App1` | 2 | Department Head approval | Candidate | High |
| WFC-FIN-005-003 | review_section | To Be Reviewed By with Approve/Deny and `App2` | 2-3 | Recommender/reviewer approval | Candidate | Medium |
| WFC-FIN-005-004 | approval_section | Division Head Approval with Approve/Deny and `App3` | 3 | Division Head approval | Candidate | High |
| WFC-FIN-005-005 | completion_section | EARF Completion with completion date, old asset status, SAP PR rows, prepared-by completion | 3 | Post-approval completion | Candidate | High |
| WFC-FIN-005-006 | current_action | Current Action `CA` | 4 | Required workflow state | Candidate | High |
| WFC-FIN-005-007 | routing_field | IT, Finance/Admin, IT HOD, Admin HOD, Maintenance HOD, Division Head, Recommender, editors | 4 | Conditional routing | Candidate | Medium |

## Classification

EARF requires Finance verification, Department Head approval, reviewer/recommender review, Division Head approval, and a post-approval completion step. Consultation routing for IT/Admin/Maintenance purchases should be confirmed before workflow build.

