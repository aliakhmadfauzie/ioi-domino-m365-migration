# Form Requirement - Review of Customers on Credit (CMF_C)

> Source ID: SRC-FIN-004 | Department: FIN | Promoted: 2026-06-02 | Quality: 91/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/CMF_C.pdf` (5 pages, 3,457 chars)
> Promotion: Promote with Human Confirmation - 50-row table modeling, exact row internal names, and workflow state values need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-004 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Review of Customers on Credit, Appendix C | Clearly Found |
| Form Purpose | Review up to 50 customers for credit status, buying activity, late payment, negative market news, financial statement availability, and credit-limit action, then route through Marketing, Finance, ED, and Finance acknowledgement. | Clearly Found |
| Pages | 5 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Initiation | 1 | Request details | CAFNo, DateReview, Company, Category, MKTExec, MKTHOD, reqby, reqdate |
| Customer Credit Review Table | 1-3 | Repeating table | C_1..C_50, S_1..S_50, A_1..A_50, H_1..H_50, N_1..N_50, F_1..F_50, M_1..M_50 |
| Attachment / Notes | 3 | Supporting detail | Attachment; Active/Inactive and late-payment definitions |
| Marketing Manager Endorsement | 3 | Approval | MKTName, MKTDate, MKTPost, MKTRem, App1 |
| GM / Section Approval | 3 | Approval | SectionTitle, GMName, GMDate, GMRem, App1_1 |
| Finance Review | 4 | Review | FMName, FMDate, CRate, FMRem, FMAtt, App2 |
| ED Approval | 4 | Approval | SectionTitle_1_1, EDName, EDDate, EDRem, App3 |
| Finance Acknowledgement | 4 | Acknowledgement | FMName2, FMDate2, FMRem2, FMAtt2, App6 |
| Hidden Fields | 5 | System/routing | CA, MKTFA, MKTFE, MKTSN, MKT, ED, IT, FIN, editors, MailList, Year-INO, RemDate |

## 3. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - multi-stage customer credit review workflow | Clearly Found |
| Workflow Evidence | Marketing Manager endorsement, GM approval, Finance review, ED approval, Finance acknowledgement, CurrentAction and routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 4. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CMF_C`
Recommended storage: parent item for header/workflow data plus a child list candidate for the 50 customer-review rows if row-level reporting or flexible row count is required.

Child list candidate: `MainDB_FIN_Ext_CreditReviewCustomers`

## 5. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| CMF_C-01 | Should the 50 customer review rows be stored as fixed parent columns or a child list? | High |
| CMF_C-02 | Confirm exact internal names for all `M_*` row fields because PDF extraction visually truncated several values. | High |
| CMF_C-03 | What are valid `CA`, `App1`, `App1_1`, `App2`, `App3`, and `App6` state values? | High |
| CMF_C-04 | Confirm the business labels and routing conditions for `SectionTitle` and `SectionTitle_1_1`. | Medium |
| CMF_C-05 | Confirm choice values for buying activity, late payment, negative market news, financial statement available, and credit-limit action. | Medium |

## 6. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with table/state confirmation |
| Approval Required | Yes |
| Promotion Quality | 91/100 |

