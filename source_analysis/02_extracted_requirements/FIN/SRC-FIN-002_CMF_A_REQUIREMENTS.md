# Form Requirement - Approval for Credit Application Form (CMF_A)

> Source ID: SRC-FIN-002 | Department: FIN | Promoted: 2026-06-02 | Quality: 95/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/CMF_A.pdf` (5 pages, 2,407 chars)
> Promotion: Promote with Human Confirmation - credit workflow states, role titles, and choice values need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-002 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Approval for Credit Application Form, Appendix A | Clearly Found |
| Form Purpose | Submit and approve a fresh or revised credit application with customer/SAP details, credit limit/period, credit insurance, Finance review, senior approvals, Finance acknowledgement, and cancellation/follow-up. | Clearly Found |
| Pages | 5 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Initiation | 1-2 | Request details | Company, Category, CAFNo, PrevCAFNo, DateInitiated, CompanyName, Status, Risk, Reasons, MKTExec, CreditLimit, Days, RevCreditLimit, CreditInsRef, Limit, Attachment, Remark |
| GM Approval | 2 | Approval | GMName, GMDate, GMRem, App1 |
| Finance Review | 2 | Review | FMName, FMDate, CRate, FMRem, FMAtt, App2 |
| Senior Financial Controller Approval | 2-3 | Approval | FCName, FCDate, FCRem, App3 |
| SGM / ED Approval | 3 | Approval | COOName, COODate, COORem, App4, EDName, EDDate, EDRem, App5 |
| Approved Limit / Rejection | 3 | Decision | AppCreditLimit, Days2, Denial |
| Finance Acknowledgement | 3 | Acknowledgement | FMName2, FMDate2, FMRem2, FMAtt2, App6 |
| Finance Follow-Up Cancellation | 4 | Cancellation | CanName, CanDate, CanRem, CanAtt |
| Hidden Fields | 4-5 | System/routing | CA, COO/ED/FIN/Marketing routing, FLimit, FLimit2, editors, MailList, INO, RemDate |

## 3. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - multi-stage credit approval workflow | Clearly Found |
| Workflow Evidence | GM approval, Finance review, SFC approval, SGM/ED approvals, Finance acknowledgement, cancellation, CurrentAction and routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 4. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CMF_A`
Recommended storage: parent/extension fields for one-row credit request and approval data. No repeating child table is visible.

## 5. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| CMF_A-01 | What are valid `CA`, App1-App6, `Status`, and `Denial` values? | High |
| CMF_A-02 | Confirm routing conditions for Senior Financial Controller, SGM Operations, ED, COO ACM/PCN, Finance II, Finance Head, and Marketing groups. | High |
| CMF_A-03 | Confirm choice values for Company, Category, Risk Category, New Account, Currency, and credit period units. | Medium |
| CMF_A-04 | Confirm how final limits `FLimit` and `FLimit2` are calculated for new vs existing accounts. | Medium |

## 6. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with workflow/status confirmation |
| Approval Required | Yes |
| Promotion Quality | 95/100 |

