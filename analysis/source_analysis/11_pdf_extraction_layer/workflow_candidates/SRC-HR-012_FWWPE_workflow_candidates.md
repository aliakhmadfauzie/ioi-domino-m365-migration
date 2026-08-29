# SRC-HR-012 FWWPE Workflow Candidates

> Form: Foreign Worker Work Period Extension | Batch: EXB-004

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| routing_or_roles | 1 | SendTo, HOS, HOD, CC, ToList, CCList |
| reply_action | 1-2 | CLICK TO REPLY, Continue, Not to Continue, Status |
| approval_section | 2 | Accepted by Head of Section, APPROVED REJECTED, HOSStatus |
| approval_section | 2 | Endorsed by Head of Department, APPROVED REJECTED, HODStatus |
| approval_section | 2-3 | Approved by Human Resources Department, APPROVED REJECTED, HRHODStatus |
| completion_section | 3 | Flight & Transportation Details DONE, Income Tax Declaration DONE |
| withdrawal | 3 | WITHDRAWN, WDDate, WDBy, WDRem |
| current_action | 3 | Current Action, CurrentAction |

## Classification

- Classification: Clearly found multi-stage approval/workflow candidate.
- Rationale: HR issuance is followed by superior reply, optional HOS acceptance, HOD endorsement, HR approval, operational completion sections, and withdrawal handling.
- Status: Candidate pending quality review.

