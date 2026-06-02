# SRC-HR-010 FTCR Workflow Candidates

> Form: Fixed Term Contract Requisition Form | Batch: EXB-004

## Workflow Signals

| Signal Type | Page | Evidence Tokens |
|---|---:|---|
| submission | 1 | SUBMITTED BY DEPARTMENT/SECTION HEAD, SubBy, SubDesg, SubDate |
| approval_section | 1-2 | RECOMMENDATION BY DIVISION/DEPARTMENT HEAD, ENDORSED BY HEAD OF DIVISION/DEPARTMENT |
| approval_section | 3 | APPROVING AUTHORITY, Reviewed by Assistant General Manager HR, Approved by title, Approved by edTitle |
| status_field | 3 | HR SECTION, Status, CaseStatus |
| current_action | 4 | CurrentAction, CA |
| routing_or_roles | 4 | Editor1-Editor7, ED, SGM, HR_1, HR_2, HRM, IT, Servers, Readers |

## Classification

- Classification: Clearly found multi-stage approval candidate.
- Rationale: Submitter, department/division recommendation, endorsement, AGM HR review, COO/SGM approval, ED approval, HR status, and CurrentAction routing are all present in extracted text.
- Status: Candidate pending quality review.

