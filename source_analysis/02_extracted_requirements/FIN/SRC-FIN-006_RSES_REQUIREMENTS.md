# Form Requirement - Reversal Service Entry Sheet (RSES)

> Source ID: SRC-FIN-006 | Department: FIN | Promoted: 2026-06-02 | Quality: 98/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/RSES.pdf` (2 pages, 697 chars)
> Promotion: Promote with Human Confirmation - exact workflow state values need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-006 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Reversal Service Entry Sheet | Clearly Found |
| Form Purpose | Request reversal of a service entry sheet, collect approver acceptance, and complete or reject the request through Finance. | Clearly Found |
| Pages | 2 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Initiator Section | 1 | Request details | Company, Requestor, Approver, Dept, ExtNo, Site, SESNo, PO, SESAppDate, Justification, ReqName, ReqDate |
| Approver Acceptance | 1 | Approval | AppName, AppDate, AppRem, App |
| Finance Acceptance | 1 | Completion | FINName, FINDate, FINRem, App2 |
| Hidden Fields | 2 | System/routing | CA, IT, Editor1, Editor2, Editor3, FIN |

## 3. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - two-stage approval/completion workflow | Clearly Found |
| Workflow Evidence | Approver Acceptance with Approve/Reject; Finance Acceptance with Complete/Reject; CurrentAction and routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 4. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `RSES`
Recommended storage: parent item only. No repeating child structures detected.

## 5. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| RSES-01 | What are valid `CA`, `App`, and `App2` state values? | High |
| RSES-02 | Confirm whether Finance completion is the final workflow state and whether Finance rejection returns to requestor or closes the case. | High |
| RSES-03 | Confirm choice values for Company and Site. | Medium |

## 6. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with workflow-state confirmation |
| Approval Required | Yes |
| Promotion Quality | 98/100 |

