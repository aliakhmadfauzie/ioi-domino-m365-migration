# Form Requirement - Temporary Credit Limit Change Form (CMF_B)

> Source ID: SRC-FIN-003 | Department: FIN | Promoted: 2026-06-02 | Quality: 94/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/CMF_B.pdf` (4 pages, 2,005 chars)
> Promotion: Promote with Human Confirmation - temporary credit workflow, Appendix A dependency, and expiry handling need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-003 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Temporary Credit Limit Change Form, Appendix B | Clearly Found |
| Form Purpose | Request and approve a temporary credit limit increase/decrease, including receivables, open delivery credit, credit insurance, marketing approval, Finance review, ED approval, Finance acknowledgement, and expiry date. | Clearly Found |
| Pages | 4 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Initiation | 1-2 | Request details | Company, Category, CAFNo, qty, DateInitiated, CompanyName, MKTExec, AppCreditLimit_1, TemCreditLimit, TotCreditLimit, PaymentTerms, TotRec, OpenDelCredit, SalesVal, CreditInsRef, Limit, Reason, MKTHOD, reqby, reqdate |
| Marketing Manager Approval | 2 | Approval | MKTName, MKTDate, MKTRem, App1 |
| GM Approval | 2 | Approval | GMName, GMDate, GMRem, App1_1 |
| Finance Review | 2-3 | Review | FMName, FMDate, CRate, FMRem, FMAtt, App2 |
| ED Approval | 3 | Approval | EDName, EDDate, EDRem, App3 |
| Approved Limit / Rejection | 3 | Decision | AppCreditLimit, Denial |
| Finance Acknowledgement | 3 | Acknowledgement | FMName2, FMDate2, ExpiryDate, FMRem2, FMAtt2, App6 |
| Hidden Fields | 3-4 | System/routing | CA, Marketing routing, ED, IT, FIN, FLimit, editors, MailList, INO, RemDate |

## 3. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - temporary credit limit approval workflow | Clearly Found |
| Workflow Evidence | Requested by, Marketing Manager approval, GM approval, Finance review, ED approval, Finance acknowledgement, TCLC expiry, CurrentAction and routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |
| Policy Note | Fresh Appendix A application required after two consecutive TCLC applications | Clearly Found |

## 4. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CMF_B`
Recommended storage: parent/extension fields for one-row temporary credit change and approval data. No repeating child table is visible.

## 5. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| CMF_B-01 | What are valid `CA`, App1/App1_1/App2/App3/App6, and `Denial` values? | High |
| CMF_B-02 | Confirm the exact rule for requiring CMF_A after two consecutive TCLC applications and whether `qty` controls this automatically. | High |
| CMF_B-03 | Confirm routing conditions for Marketing Manager, GM, Finance, ED, and Finance acknowledgement. | High |
| CMF_B-04 | Confirm expiry behavior for `ExpiryDate` and whether reminders use `RemDate`. | Medium |
| CMF_B-05 | Confirm choice values for Company, Category, PaymentTerms, Currency, and Credit Insurance fields. | Medium |

## 6. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with workflow/rule confirmation |
| Approval Required | Yes |
| Promotion Quality | 94/100 |

