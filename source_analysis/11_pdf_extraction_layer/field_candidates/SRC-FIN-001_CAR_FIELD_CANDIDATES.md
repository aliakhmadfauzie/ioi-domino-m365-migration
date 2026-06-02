# SRC-FIN-001 CAR Field Candidates

> Form: Capital Appropriation Request | Batch: FXB-001 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-FIN-001-001 | SAP IO No. | `SAPIONo` | 1 | text | Finance use | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-002 | SAP Asset No. | `SAPAssNo` | 1 | text | Finance use | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-003 | Company | `Company` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-004 | Department | `Department` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-005 | CAR Name / Project Name | `ProjectName` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-006 | Objective | `Objective` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-007 | Start Date | `StartDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-008 | Completion Date | `CompDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-009 | Asset Class Guidelines | `AssetClass` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-010 | Capital Goods Category | `CapitalGoodsCat` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-011 | Sustainability Related | `isSustainability` | 1 | boolean/choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-012 | Sustainability Project | `SusProj` / `othersusproj` | 1 | choice/text | Conditional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-013 | Energy Project | `Energytype` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-014 | Estimated Annual Savings | `EstAnnualSaving` | 1 | multiline/number | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-015 | Purpose of Investment | `Purpose` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-016 | Existing Asset No. | `ExAssetNo` | 1 | text | Conditional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-001-017 | Execution Type | `ExecType` | 1 | choice | Unknown | OWN, ADMIN, IT, ENG, MTN, ECM MTN visible | Candidate | Raw text pages 1-2 |
| CAND-SRC-FIN-001-018 | Economic Life of Investment | `EcoLife` | 2 | number | Unknown | Years | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-019 | Payback | `Payback` | 2 | number | Unknown | Months | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-020 | IRR | `IRR` | 2 | percentage | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-021 | Net Present Value | `NPV` | 2 | currency | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-022 | Budgeted | `isBudgeted` | 2 | boolean/choice | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-023 | Amount Budgeted | `BudgetAmt` | 2 | currency | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-024 | Budget Number | `BudgetNo` | 2 | text | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-025 | Total Investment Amount | `TtlInvAmt` | 2 | currency | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-001-026 | Justification | `Justification` | 2-3 | multiline | Unknown | Unknown | Candidate | Raw text pages 2-3 |
| CAND-SRC-FIN-001-027 | Reviewer I | `HOD` | 3 | people | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-028 | Reviewer II | `HOD2` | 3 | people | Optional | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-029 | Requested by | `Preparedby` | 3 | people/text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-030 | Requested Date | `Prepareddate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-031 | Requestor Position | `Preparedpost` | 3 | text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-032 | Finance Verify | `VerName`, `VerDate`, `VerRem` | 3 | people/date/multiline | Finance use | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-001-033 | HOD Reviews | `Reviewedby`, `Revieweddate`, `Reviewedpost`, `Reviewedrem`, `App1`, `Reviewedby_1`, `App1_1` | 3-4 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text pages 3-4 |
| CAND-SRC-FIN-001-034 | Recommended By | `Executor`, `CC`, `Recommendby`, `Recommenddate`, `Recommendpost`, `Recommendrem`, `App2` | 4 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 4 |
| CAND-SRC-FIN-001-035 | SGM Operations Approval | `Approvedby`, `Approveddate`, `ApprovedTitle`, `Approvedrem`, `App3` | 4 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 4 |
| CAND-SRC-FIN-001-036 | Director Approval | `EDApprovedby`, `EDApproveddate`, `EDApprovedTitle`, `EDApprovedrem`, `App3_1` | 4-5 | mixed | Conditional | Approve/Deny visible | Candidate | Raw text pages 4-5 |
| CAND-SRC-FIN-001-037 | Budget Exceeded Hard Copy | `Att`, `Rem`, `submittedby`, `submitteddate`, `NotifiedBy`, `NotifiedDate` | 5 | mixed | Conditional | Done visible | Candidate | Raw text page 5 |
| CAND-SRC-FIN-001-038 | CAR Completion | `FinalCompDate`, `AddCARAmt`, `Location`, `CARCompDesc`, `Outcome`, `ActAnnualSaving`, `OldAsset`, `oldAssetRem` | 5 | mixed | Unknown | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-001-039 | Reassignment | `Reassign`, `RComment`, `reassby`, `reassdt` and numbered variants | 5,8,9 | mixed | Conditional | Unknown | Candidate | Raw text pages 5,8,9 |
| CAND-SRC-FIN-001-040 | Grand Total / CAR Amount / Underspend | `GrndTtl`, `TtlCARAmt`, `CARUnderSpent`, `Justification2` | 7 | mixed | Unknown | Unknown | Candidate | Raw text page 7 |
| CAND-SRC-FIN-001-041 | Completion approvals | `Reviewedby2`, `Recommendby2`, `Approvedby2`, `Approvedby2_1`, `Approvedby3` and date/remark/App fields | 8-9 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text pages 8-9 |
| CAND-SRC-FIN-001-042 | Cancellation | `CanName`, `CanDate`, `CanReason` | 10 | mixed | Conditional | Cancel visible | Candidate | Raw text page 10 |

## Repeating / Table Field Codes

| Structure | Fields | Rows | Status | Evidence |
|---|---|---:|---|---|
| Investment rows | `Inv_N`, `UL_N`, `InvAmt_N` | 10 | Candidate | Raw text page 2 |
| SAP PO raised rows | `PODt_N`, `PONo_N`, `POVdr_N`, `POAmt_N`, `PODesc_N` | 50 | Candidate | Raw text pages 6-7 |
| CAR post-completion savings rows | `S_N`, `T_N`, `C_N`, `SC_N`, `SP_N` | 12 | Candidate | Raw text pages 9-10 |
| Hidden routing/editor fields | `CA`, `FIN1`-`FIN4`, `FINAdmin`, `PURPIC`, `ITHOD`, `ADM`, `ENG`, `MTN`, `ECMMTN`, `Editor1`-`Editor13`, approval flags, mailing lists, reminders | N/A | Candidate | Raw text pages 10-11 |

