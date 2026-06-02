# Form Requirement - Capital Appropriation Request (CAR)

> Source ID: SRC-FIN-001 | Department: FIN | Promoted: 2026-06-02 | Quality: 96/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/CAR.pdf` (11 pages, 9,865 chars)
> Promotion: Promote with Human Confirmation - amount thresholds, table storage, and completion lifecycle need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-001 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Capital Appropriation Request (CAR) | Clearly Found |
| Form Purpose | Request capital expenditure for assets costing more than RM2000, route for Finance verification and staged approval, then track CAR completion, SAP PO spend, post-completion savings, additional amount, extension, and cancellation. | Clearly Found |
| Pages | 11 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Approval Authority Matrix | 1 | Governance/reference | Contract amount thresholds, recommended-by and approved-by authority |
| Finance Use Only | 1 | Finance fields | SAPIONo, SAPAssNo |
| Initiation | 1-2 | Request details | Company, Department, ProjectName, Objective, StartDate, CompDate, AssetClass, CapitalGoodsCat, sustainability/energy fields, Purpose, ExAssetNo, ExecType |
| Appraisal and Budget | 2 | Financial analysis | EcoLife, Payback, IRR, NPV, isBudgeted, BudgetAmt, BudgetNo, investment rows, TtlInvAmt, Justification |
| Request and Finance Verification | 3 | Submit/review | HOD, HOD2, Preparedby, Prepareddate, Preparedpost, VerName, VerDate, VerRem |
| Main Approval Chain | 3-5 | Approval | HOD reviews, recommender, SGM Operations, Director approval |
| Budget Exceeded / Additional CAR | 5 | Conditional workflow | Att, Rem, submittedby/date, NotifiedBy/date, AddCARAmt |
| CAR Completion | 5-10 | Completion workflow | FinalCompDate, Location, CARCompDesc, Outcome, ActAnnualSaving, OldAsset, PO rows, completion approvals, savings rows |
| Cancellation | 10 | Cancellation | CanName, CanDate, CanReason |
| Hidden Fields | 10-11 | System/routing | CA, FIN groups, department HODs, ED/SGM, editor stages, approval flags, mailing lists, reminders |

## 3. Repeating / Child-List Candidates

| Structure | Fields | Rows | Recommendation | Confidence |
|---|---|---:|---|---|
| Investment rows | Inv_N, UL_N, InvAmt_N | 10 | Child list or fixed 10-row extension columns | Clearly Found |
| SAP PO raised rows | PODt_N, PONo_N, POVdr_N, POAmt_N, PODesc_N | 50 | Strong child-list candidate | Clearly Found |
| CAR post-completion savings rows | S_N, T_N, C_N, SC_N, SP_N | 12 | Child list or fixed 12-row extension columns | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - complex multi-stage approval and completion workflow | Clearly Found |
| Workflow Evidence | Contract amount matrix, Finance verification, HOD reviews, recommender, SGM/Director approval, budget exceeded path, completion approvals, cancellation, CurrentAction and editor routing | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CAR`
Recommended child lists:
- `MainDB_FIN_Ext_CAR_Investments`
- `MainDB_FIN_Ext_CAR_POCommitments`
- `MainDB_FIN_Ext_CAR_PostCompletionSavings`

Core parent fields should use existing `MainDB_FIN` finance columns where possible: amount, contract amount, IRR, payback, project code, cost center, GL code, approval authority, attachment links, and workflow metadata.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| CAR-01 | Confirm the contract amount approval matrix and whether it supersedes the generic FIN threshold assumptions in `analysis/prd-fin-source-analysis.md`. | High |
| CAR-02 | What are valid `CA`, App1-App7, and completion-state values? | High |
| CAR-03 | Should investment rows, SAP PO rows, and post-completion savings rows be child lists or fixed extension columns? | High |
| CAR-04 | Confirm routing ownership for FIN1-FIN4, FINAdmin, PURPIC, IT/Admin/Engineering/Maintenance HODs, SGM, and ED. | High |
| CAR-05 | Confirm whether budget exceeded over RM1,000,000 must preserve hard-copy approval attachment behavior. | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with child-list and threshold decisions |
| Approval Required | Yes |
| Promotion Quality | 96/100 |

