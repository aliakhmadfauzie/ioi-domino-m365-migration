# Global Field Dictionary

> Cross-form field dictionary for every form already extracted from PDF and promoted to requirement files.
> Generated: 2026-06-02 21:59
> Source: promoted PDF requirement files under `source_analysis/02_extracted_requirements/`.

## Summary

| Department | Module | Forms | Rows |
|---|---|---:|---:|
| FIN | Finance - Capital Approval | 1 | 42 |
| FIN | Finance - Credit Management | 3 | 72 |
| FIN | Finance - Expenditure Approval | 1 | 32 |
| FIN | Finance - Service Entry | 1 | 18 |
| HR | HR - Applications Support | 1 | 32 |
| HR | HR - Attendance | 1 | 47 |
| HR | HR - Cafeteria | 1 | 22 |
| HR | HR - Contract | 1 | 42 |
| HR | HR - Duty Roster | 1 | 35 |
| HR | HR - Employee Data | 1 | 35 |
| HR | HR - Employee Health | 1 | 21 |
| HR | HR - Exit | 1 | 64 |
| HR | HR - Foreign Worker | 2 | 71 |
| HR | HR - Gift/Donation/Sponsorship | 1 | 32 |
| HR | HR - Information | 1 | 10 |
| HR | HR - Survey | 1 | 14 |
| HR | HR - Workforce | 2 | 101 |
| IT | IT - Access | 1 | 21 |
| IT | IT - Activity Logs | 4 | 64 |
| IT | IT - Asset Inventory | 1 | 26 |

## FIN / Finance - Capital Approval

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-FIN-001-001 | SRC-FIN-001 | CAR | Candidate extraction | SAP IO No. | `SAPIONo` | text | Finance use | Unknown | `carSAPIONo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-002 | SRC-FIN-001 | CAR | Candidate extraction | SAP Asset No. | `SAPAssNo` | text | Finance use | Unknown | `carSAPAssNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-003 | SRC-FIN-001 | CAR | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `carCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-004 | SRC-FIN-001 | CAR | Candidate extraction | Department | `Department` | text | Unknown | Unknown | `carDepartment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-005 | SRC-FIN-001 | CAR | Candidate extraction | CAR Name / Project Name | `ProjectName` | text | Unknown | Unknown | `carProjectName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-006 | SRC-FIN-001 | CAR | Candidate extraction | Objective | `Objective` | multiline | Unknown | Unknown | `carObjective` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-007 | SRC-FIN-001 | CAR | Candidate extraction | Start Date | `StartDate` | date | Unknown | Unknown | `carStartDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-008 | SRC-FIN-001 | CAR | Candidate extraction | Completion Date | `CompDate` | date | Unknown | Unknown | `carCompDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-009 | SRC-FIN-001 | CAR | Candidate extraction | Asset Class Guidelines | `AssetClass` | choice/text | Unknown | Unknown | `carAssetClass` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-010 | SRC-FIN-001 | CAR | Candidate extraction | Capital Goods Category | `CapitalGoodsCat` | choice/text | Unknown | Unknown | `carCapitalGoodsCat` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-011 | SRC-FIN-001 | CAR | Candidate extraction | Sustainability Related | `isSustainability` | boolean/choice | Unknown | Unknown | `carIsSustainability` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-012 | SRC-FIN-001 | CAR | Candidate extraction | Sustainability Project | `SusProj / othersusproj` | choice/text | Conditional | Unknown | `carSusProjOthersusproj` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-013 | SRC-FIN-001 | CAR | Candidate extraction | Energy Project | `Energytype` | choice/text | Unknown | Unknown | `carEnergytype` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-014 | SRC-FIN-001 | CAR | Candidate extraction | Estimated Annual Savings | `EstAnnualSaving` | multiline/number | Unknown | Unknown | `carEstAnnualSaving` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-015 | SRC-FIN-001 | CAR | Candidate extraction | Purpose of Investment | `Purpose` | choice/text | Unknown | Unknown | `carPurpose` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-016 | SRC-FIN-001 | CAR | Candidate extraction | Existing Asset No. | `ExAssetNo` | text | Conditional | Unknown | `carExAssetNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-017 | SRC-FIN-001 | CAR | Candidate extraction | Execution Type | `ExecType` | choice | Unknown | OWN, ADMIN, IT, ENG, MTN, ECM MTN visible | `carExecType` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-018 | SRC-FIN-001 | CAR | Candidate extraction | Economic Life of Investment | `EcoLife` | number | Unknown | Years | `carEcoLife` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-019 | SRC-FIN-001 | CAR | Candidate extraction | Payback | `Payback` | number | Unknown | Months | `carPayback` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-020 | SRC-FIN-001 | CAR | Candidate extraction | IRR | `IRR` | percentage | Conditional | Unknown | `carIRR` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-021 | SRC-FIN-001 | CAR | Candidate extraction | Net Present Value | `NPV` | currency | Conditional | Unknown | `carNPV` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-022 | SRC-FIN-001 | CAR | Candidate extraction | Budgeted | `isBudgeted` | boolean/choice | Unknown | Unknown | `carIsBudgeted` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-023 | SRC-FIN-001 | CAR | Candidate extraction | Amount Budgeted | `BudgetAmt` | currency | Conditional | Unknown | `carBudgetAmt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-024 | SRC-FIN-001 | CAR | Candidate extraction | Budget Number | `BudgetNo` | text | Conditional | Unknown | `carBudgetNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-025 | SRC-FIN-001 | CAR | Candidate extraction | Total Investment Amount | `TtlInvAmt` | currency | Unknown | Unknown | `carTtlInvAmt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-026 | SRC-FIN-001 | CAR | Candidate extraction | Justification | `Justification` | multiline | Unknown | Unknown | `carJustification` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-027 | SRC-FIN-001 | CAR | Candidate extraction | Reviewer I | `HOD` | people | Unknown | Unknown | `carHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-028 | SRC-FIN-001 | CAR | Candidate extraction | Reviewer II | `HOD2` | people | Optional | Unknown | `carHOD2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-029 | SRC-FIN-001 | CAR | Candidate extraction | Requested by | `Preparedby` | people/text | Unknown | Unknown | `carPreparedby` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-030 | SRC-FIN-001 | CAR | Candidate extraction | Requested Date | `Prepareddate` | date | Unknown | Unknown | `carPrepareddate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-031 | SRC-FIN-001 | CAR | Candidate extraction | Requestor Position | `Preparedpost` | text | Unknown | Unknown | `carPreparedpost` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-032 | SRC-FIN-001 | CAR | Candidate extraction | Finance Verify | `VerName, VerDate, VerRem` | people/date/multiline | Finance use | Unknown | `carVerNameVerDateVerRem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-033 | SRC-FIN-001 | CAR | Candidate extraction | HOD Reviews | `Reviewedby, Revieweddate, Reviewedpost, Reviewedrem, App1, Reviewedby_1, App1_1` | mixed | Unknown | Approve/Deny visible | `carReviewedbyRevieweddateReviewe` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-034 | SRC-FIN-001 | CAR | Candidate extraction | Recommended By | `Executor, CC, Recommendby, Recommenddate, Recommendpost, Recommendrem, App2` | mixed | Unknown | Approve/Deny visible | `carExecutorCCRecommendbyRecommen` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-035 | SRC-FIN-001 | CAR | Candidate extraction | SGM Operations Approval | `Approvedby, Approveddate, ApprovedTitle, Approvedrem, App3` | mixed | Unknown | Approve/Deny visible | `carApprovedbyApproveddateApprove` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-036 | SRC-FIN-001 | CAR | Candidate extraction | Director Approval | `EDApprovedby, EDApproveddate, EDApprovedTitle, EDApprovedrem, App3_1` | mixed | Conditional | Approve/Deny visible | `carEDApprovedbyEDApproveddateEDA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-037 | SRC-FIN-001 | CAR | Candidate extraction | Budget Exceeded Hard Copy | `Att, Rem, submittedby, submitteddate, NotifiedBy, NotifiedDate` | mixed | Conditional | Done visible | `carAttRemSubmittedbySubmitteddat` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-038 | SRC-FIN-001 | CAR | Candidate extraction | CAR Completion | `FinalCompDate, AddCARAmt, Location, CARCompDesc, Outcome, ActAnnualSaving, OldAsset, oldAssetRem` | mixed | Unknown | Unknown | `carFinalCompDateAddCARAmtLocatio` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-039 | SRC-FIN-001 | CAR | Candidate extraction | Reassignment | `Reassign, RComment, reassby, reassdt and numbered variants` | mixed | Conditional | Unknown | `carReassignRCommentReassbyReassd` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-040 | SRC-FIN-001 | CAR | Candidate extraction | Grand Total / CAR Amount / Underspend | `GrndTtl, TtlCARAmt, CARUnderSpent, Justification2` | mixed | Unknown | Unknown | `carGrndTtlTtlCARAmtCARUnderSpent` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-041 | SRC-FIN-001 | CAR | Candidate extraction | Completion approvals | `Reviewedby2, Recommendby2, Approvedby2, Approvedby2_1, Approvedby3 and date/remark/App fields` | mixed | Unknown | Approve/Deny visible | `carReviewedby2Recommendby2Approv` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-001-042 | SRC-FIN-001 | CAR | Candidate extraction | Cancellation | `CanName, CanDate, CanReason` | mixed | Conditional | Cancel visible | `carCanNameCanDateCanReason` | Candidate promoted to requirements; verify caveats |

## FIN / Finance - Credit Management

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-FIN-002-001 | SRC-FIN-002 | CMF_A | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `cmfaCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-002 | SRC-FIN-002 | CMF_A | Candidate extraction | Category | `Category` | choice | Unknown | Unknown | `cmfaCategory` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-003 | SRC-FIN-002 | CMF_A | Candidate extraction | Credit Application Form No. | `CAFNo` | text | Unknown | Unknown | `cmfaCAFNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-004 | SRC-FIN-002 | CMF_A | Candidate extraction | Previous Credit Application Form No. | `PrevCAFNo` | text | Optional | Unknown | `cmfaPrevCAFNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-005 | SRC-FIN-002 | CMF_A | Candidate extraction | Date Initiated | `DateInitiated` | date | Unknown | Unknown | `cmfaDateInitiated` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-006 | SRC-FIN-002 | CMF_A | Candidate extraction | Company / Customer Number (SAP) | `CompanyName` | text | Unknown | Unknown | `cmfaCompanyName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-007 | SRC-FIN-002 | CMF_A | Candidate extraction | New Account | `Status` | choice/boolean | Unknown | Unknown | `cmfaStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-008 | SRC-FIN-002 | CMF_A | Candidate extraction | Risk Category | `Risk` | choice | Unknown | Unknown | `cmfaRisk` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-009 | SRC-FIN-002 | CMF_A | Candidate extraction | Reasons | `Reasons, Reasons2` | multiline | Unknown | Unknown | `cmfaReasonsReasons2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-010 | SRC-FIN-002 | CMF_A | Candidate extraction | Marketing Executive In Charge | `MKTExec` | people/text | Unknown | Unknown | `cmfaMKTExec` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-011 | SRC-FIN-002 | CMF_A | Candidate extraction | Proposed Credit Limit | `Currency, CreditLimit` | currency | Unknown | Currency prefix visible | `cmfaCurrencyCreditLimit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-012 | SRC-FIN-002 | CMF_A | Candidate extraction | Proposed Credit Period | `Days` | number/text | Unknown | Days | `cmfaDays` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-013 | SRC-FIN-002 | CMF_A | Candidate extraction | Proposed Revised Credit Limit | `Currency_1, RevCreditLimit` | currency | Conditional | Currency prefix visible | `cmfaCurrency1RevCreditLimit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-014 | SRC-FIN-002 | CMF_A | Candidate extraction | Credit Insurance Ref / Limit | `CreditInsRef, Currency_3, Limit` | text/currency | Unknown | Unknown | `cmfaCreditInsRefCurrency3Limit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-015 | SRC-FIN-002 | CMF_A | Candidate extraction | Attachment | `Attachment` | attachment | Unknown | Unknown | `cmfaAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-016 | SRC-FIN-002 | CMF_A | Candidate extraction | Remark | `Remark` | multiline | Unknown | Unknown | `cmfaRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-017 | SRC-FIN-002 | CMF_A | Candidate extraction | GM Approval | `GMName, GMDate, GMRem, App1` | mixed | Unknown | Approve/Deny visible | `cmfaGMNameGMDateGMRemApp1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-018 | SRC-FIN-002 | CMF_A | Candidate extraction | Finance Review | `FMName, FMDate, CRate, FMRem, FMAtt, App2` | mixed | Unknown | Approve/Deny visible | `cmfaFMNameFMDateCRateFMRemFMAttA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-019 | SRC-FIN-002 | CMF_A | Candidate extraction | Senior Financial Controller Approval | `FCName, FCDate, FCRem, App3` | mixed | Unknown | Approve/Deny visible | `cmfaFCNameFCDateFCRemApp3` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-020 | SRC-FIN-002 | CMF_A | Candidate extraction | SGM Operations Approval | `COOName, COODate, COORem, App4` | mixed | Conditional | Approve/Deny visible | `cmfaCOONameCOODateCOORemApp4` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-021 | SRC-FIN-002 | CMF_A | Candidate extraction | ED Approval | `EDName, EDDate, EDRem, App5` | mixed | Conditional | Approve/Deny visible | `cmfaEDNameEDDateEDRemApp5` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-022 | SRC-FIN-002 | CMF_A | Candidate extraction | Approved Credit Limit / Period | `Currency_2, AppCreditLimit, Days2` | currency/number | Unknown | Unknown | `cmfaCurrency2AppCreditLimitDays2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-023 | SRC-FIN-002 | CMF_A | Candidate extraction | Rejected To | `Denial` | choice/text | Conditional | Unknown | `cmfaDenial` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-024 | SRC-FIN-002 | CMF_A | Candidate extraction | Finance Acknowledgement | `FMName2, FMDate2, FMRem2, FMAtt2, App6` | mixed | Unknown | Approve/Deny visible | `cmfaFMName2FMDate2FMRem2FMAtt2Ap` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-002-025 | SRC-FIN-002 | CMF_A | Candidate extraction | Finance Follow-up Cancellation | `CanName, CanDate, CanRem, CanAtt` | mixed | Conditional | Cancel visible | `cmfaCanNameCanDateCanRemCanAtt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-001 | SRC-FIN-003 | CMF_B | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `cmfbCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-002 | SRC-FIN-003 | CMF_B | Candidate extraction | Category | `Category` | choice | Unknown | Unknown | `cmfbCategory` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-003 | SRC-FIN-003 | CMF_B | Candidate extraction | Form No. | `CAFNo` | text | Unknown | Unknown | `cmfbCAFNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-004 | SRC-FIN-003 | CMF_B | Candidate extraction | No. of Times Applied | `qty` | number | Unknown | Unknown | `cmfbQty` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-005 | SRC-FIN-003 | CMF_B | Candidate extraction | Date | `DateInitiated` | date | Unknown | Unknown | `cmfbDateInitiated` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-006 | SRC-FIN-003 | CMF_B | Candidate extraction | Company / Customer Number (SAP) | `CompanyName` | text | Unknown | Unknown | `cmfbCompanyName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-007 | SRC-FIN-003 | CMF_B | Candidate extraction | Marketing Executive In Charge | `MKTExec` | people/text | Unknown | Unknown | `cmfbMKTExec` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-008 | SRC-FIN-003 | CMF_B | Candidate extraction | Approved Credit Limit | `Currency_7, AppCreditLimit_1` | currency | Unknown | Currency prefix visible | `cmfbCurrency7AppCreditLimit1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-009 | SRC-FIN-003 | CMF_B | Candidate extraction | Proposed Temporary Credit Limit | `Currency_1, TemCreditLimit` | currency | Unknown | Currency prefix visible | `cmfbCurrency1TemCreditLimit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-010 | SRC-FIN-003 | CMF_B | Candidate extraction | Total Credit Limit | `Currency_2, TotCreditLimit` | currency | Unknown | Currency prefix visible | `cmfbCurrency2TotCreditLimit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-011 | SRC-FIN-003 | CMF_B | Candidate extraction | Payment Terms | `PaymentTerms` | text/choice | Unknown | Unknown | `cmfbPaymentTerms` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-012 | SRC-FIN-003 | CMF_B | Candidate extraction | Total Receivables | `Currency_3, TotRec` | currency | Unknown | Currency prefix visible | `cmfbCurrency3TotRec` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-013 | SRC-FIN-003 | CMF_B | Candidate extraction | Open Delivery Credit | `Currency_4, OpenDelCredit` | currency | Unknown | Currency prefix visible | `cmfbCurrency4OpenDelCredit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-014 | SRC-FIN-003 | CMF_B | Candidate extraction | Sales Value | `Currency_5, SalesVal` | currency | Unknown | Currency prefix visible | `cmfbCurrency5SalesVal` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-015 | SRC-FIN-003 | CMF_B | Candidate extraction | Credit Insurance Ref / Limit | `CreditInsRef, Currency_6, Limit` | text/currency | Unknown | Unknown | `cmfbCreditInsRefCurrency6Limit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-016 | SRC-FIN-003 | CMF_B | Candidate extraction | Reason | `Reason` | multiline | Unknown | Unknown | `cmfbReason` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-017 | SRC-FIN-003 | CMF_B | Candidate extraction | Marketing Manager | `MKTHOD` | people/text | Unknown | Unknown | `cmfbMKTHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-018 | SRC-FIN-003 | CMF_B | Candidate extraction | Requested by | `reqby, reqdate` | people/date | Unknown | Unknown | `cmfbReqbyReqdate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-019 | SRC-FIN-003 | CMF_B | Candidate extraction | Marketing Manager Approval | `MKTName, MKTDate, MKTRem, App1` | mixed | Unknown | Approve/Deny visible | `cmfbMKTNameMKTDateMKTRemApp1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-020 | SRC-FIN-003 | CMF_B | Candidate extraction | GM Approval | `GMName, GMDate, GMRem, App1_1` | mixed | Unknown | Approve/Deny visible | `cmfbGMNameGMDateGMRemApp11` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-021 | SRC-FIN-003 | CMF_B | Candidate extraction | Finance Review | `FMName, FMDate, CRate, FMRem, FMAtt, App2` | mixed | Unknown | Approve/Deny visible | `cmfbFMNameFMDateCRateFMRemFMAttA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-022 | SRC-FIN-003 | CMF_B | Candidate extraction | ED Approval | `EDName, EDDate, EDRem, App3` | mixed | Conditional | Approve/Deny visible | `cmfbEDNameEDDateEDRemApp3` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-023 | SRC-FIN-003 | CMF_B | Candidate extraction | Approved Credit Limit | `Currency, AppCreditLimit` | currency | Unknown | Unknown | `cmfbCurrencyAppCreditLimit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-024 | SRC-FIN-003 | CMF_B | Candidate extraction | Rejected To | `Denial` | choice/text | Conditional | Unknown | `cmfbDenial` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-003-025 | SRC-FIN-003 | CMF_B | Candidate extraction | Finance Acknowledgement | `FMName2, FMDate2, ExpiryDate, FMRem2, FMAtt2, App6` | mixed | Unknown | Approve/Deny visible | `cmfbFMName2FMDate2ExpiryDateFMRe` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-001 | SRC-FIN-004 | CMF_C | Candidate extraction | Form No. | `CAFNo` | text | Unknown | Unknown | `cmfcCAFNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-002 | SRC-FIN-004 | CMF_C | Candidate extraction | Date of Review | `DateReview` | date | Unknown | Unknown | `cmfcDateReview` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-003 | SRC-FIN-004 | CMF_C | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `cmfcCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-004 | SRC-FIN-004 | CMF_C | Candidate extraction | Category | `Category` | choice | Unknown | Unknown | `cmfcCategory` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-005 | SRC-FIN-004 | CMF_C | Candidate extraction | Marketing Executive in charge | `MKTExec` | people/text | Unknown | Unknown | `cmfcMKTExec` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-006 | SRC-FIN-004 | CMF_C | Candidate extraction | Marketing Manager | `MKTHOD` | people/text | Unknown | Unknown | `cmfcMKTHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-007 | SRC-FIN-004 | CMF_C | Candidate extraction | Review & prepared by | `reqby, reqdate` | people/date | Unknown | Unknown | `cmfcReqbyReqdate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-008 | SRC-FIN-004 | CMF_C | Candidate extraction | Customer review table | `C_1..C_50, S_1..S_50, A_1..A_50, H_1..H_50, N_1..N_50, F_1..F_50, M_1..M_50` | repeating rows | Unknown | Active/Inactive; Yes/No; Main/Increase/Decrease/Cancel | `cmfcC1C50S1S50A1A50H1H50N1N50F1F` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-009 | SRC-FIN-004 | CMF_C | Candidate extraction | Attachment | `Attachment` | attachment | Unknown | Unknown | `cmfcAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-010 | SRC-FIN-004 | CMF_C | Candidate extraction | Verified & Endorsed by Marketing Manager | `MKTName, MKTDate, MKTPost, MKTRem, App1` | mixed approval | Unknown | Approve/Deny visible | `cmfcMKTNameMKTDateMKTPostMKTRemA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-011 | SRC-FIN-004 | CMF_C | Candidate extraction | Approved by | `SectionTitle, GMName, GMDate, GMRem, App1_1` | mixed approval | Unknown | Approve/Deny visible | `cmfcSectionTitleGMNameGMDateGMRe` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-012 | SRC-FIN-004 | CMF_C | Candidate extraction | Finance Review | `FMName, FMDate, CRate, FMRem, FMAtt, App2` | mixed review | Unknown | Approve/Deny visible | `cmfcFMNameFMDateCRateFMRemFMAttA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-013 | SRC-FIN-004 | CMF_C | Candidate extraction | Approved by | `SectionTitle_1_1, EDName, EDDate, EDRem, App3` | mixed approval | Unknown | Approve/Deny visible | `cmfcSectionTitle11EDNameEDDateED` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-014 | SRC-FIN-004 | CMF_C | Candidate extraction | To be Acknowledged by Finance | `FMName2, FMDate2, FMRem2, FMAtt2, App6` | mixed acknowledgement | Unknown | Approve/Deny visible | `cmfcFMName2FMDate2FMRem2FMAtt2Ap` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-015 | SRC-FIN-004 | CMF_C | Candidate extraction | Created by / Created date | `DocAuthor, CDate` | audit | System | Unknown | `cmfcDocAuthorCDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-016 | SRC-FIN-004 | CMF_C | Candidate extraction | Current Action | `CA` | workflow state | System | Unknown | `cmfcCA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-017 | SRC-FIN-004 | CMF_C | Candidate extraction | Marketing routing | `MKTFA, MKTFE, MKTSN, MKT` | people/group routing | System | Unknown | `cmfcMKTFAMKTFEMKTSNMKT` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-018 | SRC-FIN-004 | CMF_C | Candidate extraction | ED / IT / Finance routing | `ED, IT, FIN` | people/group routing | System | Unknown | `cmfcEDITFIN` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-019 | SRC-FIN-004 | CMF_C | Candidate extraction | Editors | `Editor1, Editor2, Editor2a, Editor3, Editor4, Editor5` | people/group editor | System | Unknown | `cmfcEditor1Editor2Editor2aEditor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-020 | SRC-FIN-004 | CMF_C | Candidate extraction | Mail List | `MailList` | people/group | System | Unknown | `cmfcMailList` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-021 | SRC-FIN-004 | CMF_C | Candidate extraction | INO | `Year - INO` | generated ID | System | Unknown | `cmfcYearINO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-004-022 | SRC-FIN-004 | CMF_C | Candidate extraction | Reminder Date | `RemDate` | date | System | Unknown | `cmfcRemDate` | Candidate promoted to requirements; verify caveats |

## FIN / Finance - Expenditure Approval

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-FIN-005-001 | SRC-FIN-005 | EARF | Candidate extraction | SAP IO No. | `SAPIONo` | text | Finance use | Unknown | `earfSAPIONo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-002 | SRC-FIN-005 | EARF | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `earfCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-003 | SRC-FIN-005 | EARF | Candidate extraction | Department | `Department` | text | Unknown | Unknown | `earfDepartment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-004 | SRC-FIN-005 | EARF | Candidate extraction | Asset Class | `AssetClass` | choice/text | Unknown | A012 Low Value Asset visible | `earfAssetClass` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-005 | SRC-FIN-005 | EARF | Candidate extraction | Purpose of Asset | `Purpose` | multiline/choice | Unknown | Material disposal note visible | `earfPurpose` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-006 | SRC-FIN-005 | EARF | Candidate extraction | Existing Asset No. | `ExAssetNo` | text | Conditional | Unknown | `earfExAssetNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-007 | SRC-FIN-005 | EARF | Candidate extraction | Execution Type | `ExecType` | choice/text | Unknown | Unknown | `earfExecType` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-008 | SRC-FIN-005 | EARF | Candidate extraction | Asset detail rows | `Inv_1..Inv_5, FW_1..FW_5, UL_1..UL_5, InvAmt_1..InvAmt_5, UP_1..UP_5, SAPAssNo_1..SAPAssNo_5` | repeating rows | Unknown | Unknown | `earfInv1Inv5FW1FW5UL1UL5InvAmt1I` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-009 | SRC-FIN-005 | EARF | Candidate extraction | Total Cost | `TtlInvAmt` | currency | Unknown | Unknown | `earfTtlInvAmt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-010 | SRC-FIN-005 | EARF | Candidate extraction | Justification | `Justification` | multiline | Unknown | Unknown | `earfJustification` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-011 | SRC-FIN-005 | EARF | Candidate extraction | Attachment | `Attachment` | attachment | Unknown | Unknown | `earfAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-012 | SRC-FIN-005 | EARF | Candidate extraction | Department Head | `HOD` | people/text | Unknown | Unknown | `earfHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-013 | SRC-FIN-005 | EARF | Candidate extraction | Division Head | `HOD2` | people/text | Unknown | Unknown | `earfHOD2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-014 | SRC-FIN-005 | EARF | Candidate extraction | CC | `CC2` | people/group | Optional | Unknown | `earfCC2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-015 | SRC-FIN-005 | EARF | Candidate extraction | Requested by | `Preparedby, Prepareddate, Preparedpost` | people/date/text | Unknown | Unknown | `earfPreparedbyPrepareddatePrepar` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-016 | SRC-FIN-005 | EARF | Candidate extraction | To be Verified by Finance | `VerName, VerDate, VerRem` | review | Unknown | Verify visible | `earfVerNameVerDateVerRem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-017 | SRC-FIN-005 | EARF | Candidate extraction | Department Head Approval | `hodname, hoddate, hodpost, hodrem, App1` | mixed approval | Unknown | Approve/Deny visible | `earfHodnameHoddateHodpostHodremA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-018 | SRC-FIN-005 | EARF | Candidate extraction | To Be Reviewed By | `CC, Reviewedby, Revieweddate, Reviewedpost, Reviewedrem, App2` | mixed review | Unknown | Approve/Deny visible | `earfCCReviewedbyRevieweddateRevi` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-019 | SRC-FIN-005 | EARF | Candidate extraction | Division Head Approval | `hodname2, hoddate2, hodpost2, hodrem2, App3` | mixed approval | Unknown | Approve/Deny visible | `earfHodname2Hoddate2Hodpost2Hodr` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-020 | SRC-FIN-005 | EARF | Candidate extraction | Notified by | `NotifiedBy, NotifiedDate` | people/date | Conditional | Unknown | `earfNotifiedByNotifiedDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-021 | SRC-FIN-005 | EARF | Candidate extraction | EARF Completion | `CompDate, OldAsset, oldAssetRem` | completion | Unknown | Unknown | `earfCompDateOldAssetOldAssetRem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-022 | SRC-FIN-005 | EARF | Candidate extraction | Details of SAP PR raised | `PODt_1..PODt_5, PONo_1..PONo_5` | repeating rows | Unknown | Unknown | `earfPODt1PODt5PONo1PONo5` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-023 | SRC-FIN-005 | EARF | Candidate extraction | Prepared by completion | `Preparedby2, Prepareddate2` | people/date | Unknown | Unknown | `earfPreparedby2Prepareddate2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-024 | SRC-FIN-005 | EARF | Candidate extraction | Cancellation | `CanName, CanDate, CanReason` | cancellation | Conditional | Cancel visible | `earfCanNameCanDateCanReason` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-025 | SRC-FIN-005 | EARF | Candidate extraction | Created by / Created date | `DocAuthor, CDate` | audit | System | Unknown | `earfDocAuthorCDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-026 | SRC-FIN-005 | EARF | Candidate extraction | Current Action | `CA` | workflow state | System | Unknown | `earfCA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-027 | SRC-FIN-005 | EARF | Candidate extraction | IT / Finance routing | `IT, FINA, FIN1, FIN3, FIN, FINAdmin` | people/group routing | System | Unknown | `earfITFINAFIN1FIN3FINFINAdmin` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-028 | SRC-FIN-005 | EARF | Candidate extraction | Department consultation routing | `ITHOD, ADM, MTN, ADM_CC, CC3` | people/group routing | System | Unknown | `earfITHODADMMTNADMCCCC3` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-029 | SRC-FIN-005 | EARF | Candidate extraction | Division/recommender routing | `DH, Recommender` | people/group routing | System | Unknown | `earfDHRecommender` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-030 | SRC-FIN-005 | EARF | Candidate extraction | Readers / servers | `Servers, Readers` | access control | System | Unknown | `earfServersReaders` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-031 | SRC-FIN-005 | EARF | Candidate extraction | Editors | `Editor1, Editor1a, Editor2, Editor3, Editor4, Editor5, Editor6, Editor7` | people/group editor | System | Unknown | `earfEditor1Editor1aEditor2Editor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-005-032 | SRC-FIN-005 | EARF | Candidate extraction | Mailing List / Reminder Date | `MailingList, RemDate` | people/date | System | Unknown | `earfMailingListRemDate` | Candidate promoted to requirements; verify caveats |

## FIN / Finance - Service Entry

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-FIN-006-001 | SRC-FIN-006 | RSES | Candidate extraction | Company | `Company` | choice/text | Unknown | Unknown | `rsesCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-002 | SRC-FIN-006 | RSES | Candidate extraction | Requestor | `Requestor` | people/text | Unknown | Unknown | `rsesRequestor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-003 | SRC-FIN-006 | RSES | Candidate extraction | Approver | `Approver` | people/text | Unknown | Unknown | `rsesApprover` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-004 | SRC-FIN-006 | RSES | Candidate extraction | Department | `Dept` | text | Unknown | Unknown | `rsesDept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-005 | SRC-FIN-006 | RSES | Candidate extraction | Phone Ext. No. | `ExtNo` | text | Unknown | Unknown | `rsesExtNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-006 | SRC-FIN-006 | RSES | Candidate extraction | Site | `Site` | choice/text | Unknown | Unknown | `rsesSite` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-007 | SRC-FIN-006 | RSES | Candidate extraction | SES No. | `SESNo` | text | Unknown | Unknown | `rsesSESNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-008 | SRC-FIN-006 | RSES | Candidate extraction | Purchase Order & Item No. | `PO` | text | Unknown | Unknown | `rsesPO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-009 | SRC-FIN-006 | RSES | Candidate extraction | SES Approval Date | `SESAppDate` | date | Unknown | Unknown | `rsesSESAppDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-010 | SRC-FIN-006 | RSES | Candidate extraction | Justification | `Justification` | multiline | Unknown | Unknown | `rsesJustification` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-011 | SRC-FIN-006 | RSES | Candidate extraction | Requested by | `ReqName, ReqDate` | people/date | Unknown | Unknown | `rsesReqNameReqDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-012 | SRC-FIN-006 | RSES | Candidate extraction | Approver Acceptance | `AppName, AppDate, AppRem, App` | mixed approval | Unknown | Approve/Reject visible | `rsesAppNameAppDateAppRemApp` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-013 | SRC-FIN-006 | RSES | Candidate extraction | Finance Acceptance | `FINName, FINDate, FINRem, App2` | mixed completion | Unknown | Complete/Reject visible | `rsesFINNameFINDateFINRemApp2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-014 | SRC-FIN-006 | RSES | Candidate extraction | Created by / Created date | `DocAuthor, CDate` | audit | System | Unknown | `rsesDocAuthorCDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-015 | SRC-FIN-006 | RSES | Candidate extraction | Current Action | `CA` | workflow state | System | Unknown | `rsesCA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-016 | SRC-FIN-006 | RSES | Candidate extraction | IT | `IT` | people/group routing | System | Unknown | `rsesIT` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-017 | SRC-FIN-006 | RSES | Candidate extraction | Editors | `Editor1, Editor2, Editor3` | people/group editor | System | Unknown | `rsesEditor1Editor2Editor3` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-FIN-006-018 | SRC-FIN-006 | RSES | Candidate extraction | Finance | `FIN` | people/group routing | System | Unknown | `rsesFIN` | Candidate promoted to requirements; verify caveats |

## HR / HR - Applications Support

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-015-001 | SRC-HR-015 | HRAPR | Candidate extraction | Sent Date | `DateCreated` | date | Unknown | Unknown | `hraprDateCreated` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-002 | SRC-HR-015 | HRAPR | Candidate extraction | Case No. | `DisplayCaseNo` | text | System | Unknown | `hraprDisplayCaseNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-003 | SRC-HR-015 | HRAPR | Candidate extraction | To GHR Personnel | `SendTo` | people/group | Unknown | Unknown | `hraprSendTo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-004 | SRC-HR-015 | HRAPR | Candidate extraction | Company | `companyname` | text | Unknown | Unknown | `hraprCompanyname` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-005 | SRC-HR-015 | HRAPR | Candidate extraction | Reported By | `ReportedBy` | people/text | Unknown | Unknown | `hraprReportedBy` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-006 | SRC-HR-015 | HRAPR | Candidate extraction | Department | `Dept` | text | Unknown | Unknown | `hraprDept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-007 | SRC-HR-015 | HRAPR | Candidate extraction | Employee No. | `EmpNo` | text | Unknown | Unknown | `hraprEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-008 | SRC-HR-015 | HRAPR | Candidate extraction | Section | `Section` | text | Unknown | Unknown | `hraprSection` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-009 | SRC-HR-015 | HRAPR | Candidate extraction | Extension No. | `ExtNo` | text | Unknown | Unknown | `hraprExtNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-010 | SRC-HR-015 | HRAPR | Candidate extraction | System | `System` | choice/text | Unknown | Unknown | `hraprSystem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-011 | SRC-HR-015 | HRAPR | Candidate extraction | Modules | `Module` | choice/text | Unknown | Unknown | `hraprModule` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-012 | SRC-HR-015 | HRAPR | Candidate extraction | Modules | `Module2` | choice/text | Unknown | Unknown | `hraprModule2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-013 | SRC-HR-015 | HRAPR | Candidate extraction | Problem Description | `ProblemDesc` | multiline | Unknown | Unknown | `hraprProblemDesc` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-014 | SRC-HR-015 | HRAPR | Candidate extraction | Attachment | `Attach` | attachment | Unknown | Unknown | `hraprAttach` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-015 | SRC-HR-015 | HRAPR | Candidate extraction | CC | `CC` | people/text | Unknown | Unknown | `hraprCC` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-016 | SRC-HR-015 | HRAPR | Candidate extraction | Carried out by | `ISGName` | people/text | Unknown | Unknown | `hraprISGName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-017 | SRC-HR-015 | HRAPR | Candidate extraction | Solution | `Solution` | multiline | Unknown | Unknown | `hraprSolution` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-018 | SRC-HR-015 | HRAPR | Candidate extraction | Case Status | `CaseStatus` | choice/status | Unknown | Unknown | `hraprCaseStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-019 | SRC-HR-015 | HRAPR | Candidate extraction | Date Started | `StartDate` | date | Unknown | Unknown | `hraprStartDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-020 | SRC-HR-015 | HRAPR | Candidate extraction | Date Completed | `DateClosed` | date | Unknown | Unknown | `hraprDateClosed` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-021 | SRC-HR-015 | HRAPR | Candidate extraction | Description/Remarks | `ISGRemarks` | multiline | Unknown | Unknown | `hraprISGRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-022 | SRC-HR-015 | HRAPR | Candidate extraction | ISG Attachment | `Attachment2` | attachment | Unknown | Unknown | `hraprAttachment2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-023 | SRC-HR-015 | HRAPR | Candidate extraction | Rejected Carried out by | `ISGName_1` | people/text | Unknown | Unknown | `hraprISGName1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-024 | SRC-HR-015 | HRAPR | Candidate extraction | Rejected Status | `CaseStatus_1` | choice/status | Unknown | Unknown | `hraprCaseStatus1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-025 | SRC-HR-015 | HRAPR | Candidate extraction | Rejected Date | `DateReject` | date | Unknown | Unknown | `hraprDateReject` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-026 | SRC-HR-015 | HRAPR | Candidate extraction | Rejected Remarks | `ISRemarks` | multiline | Unknown | Unknown | `hraprISRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-027 | SRC-HR-015 | HRAPR | Candidate extraction | Requestor Acceptance Status | `Status` | choice/status | Unknown | Unknown | `hraprStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-028 | SRC-HR-015 | HRAPR | Candidate extraction | Date Accepted | `DateAccept` | date | Unknown | Unknown | `hraprDateAccept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-029 | SRC-HR-015 | HRAPR | Candidate extraction | Acceptance Comment | `Comment` | multiline | Unknown | Unknown | `hraprComment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-030 | SRC-HR-015 | HRAPR | Candidate extraction | KIV/Archived By | `KIVBy` | people/text | Unknown | Unknown | `hraprKIVBy` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-031 | SRC-HR-015 | HRAPR | Candidate extraction | KIV Status | `KIVStatus` | choice/status | Unknown | Unknown | `hraprKIVStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-015-032 | SRC-HR-015 | HRAPR | Candidate extraction | KIV Date | `KIVDate` | date | Unknown | Unknown | `hraprKIVDate` | Candidate promoted to requirements; verify caveats |

## HR / HR - Attendance

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| AWHR-001 | SRC-HR-002 | AWHR | - | Issue No | `IssueNo` | Text | Inferred | — | `awhrIssueNo` | Clearly Found |
| AWHR-002 | SRC-HR-002 | AWHR | - | Company | `Company` | Text | Inferred | Unknown | `awhrCompany` | Clearly Found |
| AWHR-003 | SRC-HR-002 | AWHR | - | Category | `EmpCategory` | Choice | Inferred | Unknown | `awhrEmpCategory` | Clearly Found |
| AWHR-004 | SRC-HR-002 | AWHR | - | Section | `Section` | Text | Inferred | Unknown | `awhrSection` | Clearly Found |
| AWHR-005 | SRC-HR-002 | AWHR | - | Department | `Department` | Text | Inferred | Unknown | `awhrDepartment` | Clearly Found |
| AWHR-006 | SRC-HR-002 | AWHR | - | Section Head | `HOS` | Person | Inferred | — | `awhrHOS` | Clearly Found |
| AWHR-007 | SRC-HR-002 | AWHR | - | Department Head | `HOD` | Person | Inferred | — | `awhrHOD` | Clearly Found |
| AWHR-008 | SRC-HR-002 | AWHR | - | CC | `CC` | Text | No | — | `awhrCC` | Clearly Found |
| AWHR-009 | SRC-HR-002 | AWHR | - | Remarks/Attachment | `Attachment` | Attachment | No | — | `awhrAttachment` | Clearly Found |
| AWHR-010 | SRC-HR-002 | AWHR | - | E1 — Exceeding 12 hours/day | `(checkbox)` | Boolean | Unknown | — | `awhrCheckbox` | Clearly Found |
| AWHR-011 | SRC-HR-002 | AWHR | - | E2 — Working on Rest Day | `(checkbox)` | Boolean | Unknown | — | `awhrCheckbox` | Clearly Found |
| AWHR-012 | SRC-HR-002 | AWHR | - | E3 — Exceeding 60 hours/week | `(checkbox)` | Boolean | Unknown | — | `awhrCheckbox` | Clearly Found |
| AWHR-013 | SRC-HR-002 | AWHR | - | E4 — Exceeding 104 hours/month | `(checkbox)` | Boolean | Unknown | — | `awhrCheckbox` | Clearly Found |
| AWHR-014 | SRC-HR-002 | AWHR | - | Submitted by | `Submittedby` | Person | Unknown | Unknown | `awhrSubmittedby` | Clearly Found |
| AWHR-015 | SRC-HR-002 | AWHR | - | Submitted on | `Submittedon` | Date | Unknown | Unknown | `awhrSubmittedon` | Clearly Found |
| AWHR-016 | SRC-HR-002 | AWHR | - | HOS Approve/Reject | `(choice)` | Choice | Inferred | **Approve, Reject** | `awhrChoice` | Clearly Found |
| AWHR-017 | SRC-HR-002 | AWHR | - | Name (HOS) | `HOSName` | Person | Inferred | — | `awhrHOSName` | Clearly Found |
| AWHR-018 | SRC-HR-002 | AWHR | - | Date (HOS) | `HOSDate` | Date | Inferred | — | `awhrHOSDate` | Clearly Found |
| AWHR-019 | SRC-HR-002 | AWHR | - | Remark (HOS) | `HOSRem` | Multiline | No | — | `awhrHOSRem` | Clearly Found |
| AWHR-020 | SRC-HR-002 | AWHR | - | Attachment (HOS) | `HOSAtt` | Attachment | No | — | `awhrHOSAtt` | Clearly Found |
| AWHR-021 | SRC-HR-002 | AWHR | - | HOS Approval Flag | `HOSApp` | Boolean | System | — | `awhrHOSApp` | Clearly Found |
| AWHR-022 | SRC-HR-002 | AWHR | - | HOD Approve/Reject | `(choice)` | Choice | Unknown | **Approve, Reject** | `awhrChoice` | Clearly Found |
| AWHR-023 | SRC-HR-002 | AWHR | - | Name (HOD) | `HODName` | Person | Unknown | — | `awhrHODName` | Clearly Found |
| AWHR-024 | SRC-HR-002 | AWHR | - | Date (HOD) | `HODDate` | Date | Unknown | — | `awhrHODDate` | Clearly Found |
| AWHR-025 | SRC-HR-002 | AWHR | - | Remark (HOD) | `HODRem` | Multiline | Unknown | — | `awhrHODRem` | Clearly Found |
| AWHR-026 | SRC-HR-002 | AWHR | - | Attachment (HOD) | `HODAtt` | Attachment | Unknown | — | `awhrHODAtt` | Clearly Found |
| AWHR-027 | SRC-HR-002 | AWHR | - | HOD Approval Flag | `HODApp` | Boolean | Unknown | — | `awhrHODApp` | Clearly Found |
| AWHR-028 | SRC-HR-002 | AWHR | - | HR Accept/Deny | `(choice)` | Choice | Unknown | **Accept, Deny** | `awhrChoice` | Clearly Found |
| AWHR-029 | SRC-HR-002 | AWHR | - | Comment (HR) | `HRCom` | Multiline | Unknown | — | `awhrHRCom` | Clearly Found |
| AWHR-030 | SRC-HR-002 | AWHR | - | Name (HR) | `HRName` | Person | Unknown | — | `awhrHRName` | Clearly Found |
| AWHR-031 | SRC-HR-002 | AWHR | - | Date (HR) | `HRDate` | Date | Unknown | — | `awhrHRDate` | Clearly Found |
| AWHR-032 | SRC-HR-002 | AWHR | - | Attachment (HR) | `HRAtt` | Attachment | Unknown | — | `awhrHRAtt` | Clearly Found |
| AWHR-033 | SRC-HR-002 | AWHR | - | HR Approval Flag | `HRApp` | Boolean | Unknown | — | `awhrHRApp` | Clearly Found |
| AWHR-034 | SRC-HR-002 | AWHR | - | Discarded by | `WDBy` | Person | Unknown | Unknown | `awhrWDBy` | Clearly Found |
| AWHR-035 | SRC-HR-002 | AWHR | - | Discarded on | `WDDate` | Date | Unknown | Unknown | `awhrWDDate` | Clearly Found |
| AWHR-036 | SRC-HR-002 | AWHR | - | Reason (Withdrawal) | `WDReason` | Multiline | Unknown | Unknown | `awhrWDReason` | Clearly Found |
| AWHR-037 | SRC-HR-002 | AWHR | - | Current Action | `CA` | Choice | Unknown | Unknown | `awhrCA` | Clearly Found |
| AWHR-038 | SRC-HR-002 | AWHR | - | Editor 1-5 | `Editor1-Editor5` | Person | Unknown | Unknown | `awhrEditor1Editor5` | Clearly Found |
| AWHR-039 | SRC-HR-002 | AWHR | - | IT | `IT` | Text | Unknown | Unknown | `awhrIT` | Clearly Found |
| AWHR-040 | SRC-HR-002 | AWHR | - | COO | `COO` | Person | Unknown | Unknown | `awhrCOO` | Clearly Found |
| AWHR-041 | SRC-HR-002 | AWHR | - | HR Exec/Non-Exec/Outsource | `HR_1, HR_2, HR_3` | Person | Unknown | Unknown | `awhrHR1HR2HR3` | Clearly Found |
| AWHR-042 | SRC-HR-002 | AWHR | - | INO | `INO` | Text | Unknown | Unknown | `awhrINO` | Clearly Found |
| AWHR-043 | SRC-HR-002 | AWHR | - | OT Reason List | `OTReason` | Multiline | Unknown | Unknown | `awhrOTReason` | Inferred |
| AWHR-044 | SRC-HR-002 | AWHR | - | Shift Time List | `ShiftList` | Text | Unknown | Unknown | `awhrShiftList` | Inferred |
| AWHR-045 | SRC-HR-002 | AWHR | - | Employee No. List | `EmpNoList` | Number/Text | Unknown | Unknown | `awhrEmpNoList` | Inferred |
| AWHR-046 | SRC-HR-002 | AWHR | - | Employee Names List | `NamesList` | Person/Text | Unknown | Unknown | `awhrNamesList` | Inferred |
| AWHR-047 | SRC-HR-002 | AWHR | - | Category Selection List | `Category` | Choice/Text | Unknown | Unknown | `awhrCategory` | Inferred |

## HR / HR - Cafeteria

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CIR-001 | SRC-HR-003 | CIR | Initiator | No. | `Num` | Text | Inferred | — | `cirNum` | Clearly Found |
| CIR-002 | SRC-HR-003 | CIR | Initiator | Site | `Site` | Text | Inferred | Unknown | `cirSite` | Clearly Found |
| CIR-003 | SRC-HR-003 | CIR | Initiator | Team Members | `TeamMembers` | Person | Inferred | — | `cirTeamMembers` | Clearly Found |
| CIR-004 | SRC-HR-003 | CIR | Initiator | Inspector | `Inspector` | Person | Inferred | — | `cirInspector` | Clearly Found |
| CIR-005 | SRC-HR-003 | CIR | Initiator | Inspection Date | `InsDate` | Date | Inferred | — | `cirInsDate` | Clearly Found |
| CIR-006 | SRC-HR-003 | CIR | Initiator | Inspection Time | `InsTime` | Text | Inferred | — | `cirInsTime` | Clearly Found |
| CIR-007 | SRC-HR-003 | CIR | Initiator | Submitted By | `SubmittedBy` | Person | Inferred | — | `cirSubmittedBy` | Clearly Found |
| CIR-008 | SRC-HR-003 | CIR | Initiator | Submitted Date | `SubmittedDate` | Date | Inferred | — | `cirSubmittedDate` | Clearly Found |
| CIR-009 | SRC-HR-003 | CIR | Review | Reviewed By | `ReviewedBy` | Person | Optional | — | `cirReviewedBy` | Clearly Found |
| CIR-010 | SRC-HR-003 | CIR | Review | Reviewed Date | `ReviewedDate` | Date | Optional | — | `cirReviewedDate` | Clearly Found |
| CIR-011 | SRC-HR-003 | CIR | Review | Remarks | `Remarks` | Multiline | No | — | `cirRemarks` | Clearly Found |
| CIR-012 | SRC-HR-003 | CIR | Review | Status | `Status` | Choice | Inferred | Unknown | `cirStatus` | Clearly Found |
| CIR-013 | SRC-HR-003 | CIR | Hidden | Created by | `DocAuthor` | Person | System | — | `cirDocAuthor` | Clearly Found |
| CIR-014 | SRC-HR-003 | CIR | Hidden | Created on | `CDate` | Date | System | — | `cirCDate` | Clearly Found |
| CIR-015 | SRC-HR-003 | CIR | Hidden | Current Action | `CurrentAction` | Choice | System | Unknown | `cirCurrentAction` | Clearly Found |
| CIR-016 | SRC-HR-003 | CIR | Hidden | Editor 1 | `Editor1` | Person | System | — | `cirEditor1` | Clearly Found |
| CIR-017 | SRC-HR-003 | CIR | Hidden | Editor 2 | `Editor2` | Person | System | — | `cirEditor2` | Clearly Found |
| CIR-018 | SRC-HR-003 | CIR | Hidden | Editors | `Editors` | Person | System | — | `cirEditors` | Clearly Found |
| CIR-019 | SRC-HR-003 | CIR | Hidden | INO | `INO` | Text | System | — | `cirINO` | Clearly Found |
| CIR-020 | SRC-HR-003 | CIR | Hidden | IT | `IT` | Text | System | — | `cirIT` | Clearly Found |
| CIR-021 | SRC-HR-003 | CIR | Hidden | Committee Members (ACM) | `ACMComm` | Text | System | — | `cirACMComm` | Clearly Found |
| CIR-022 | SRC-HR-003 | CIR | Hidden | Committee Members (ECM) | `ECMComm` | Text | System | — | `cirECMComm` | Clearly Found |

## HR / HR - Contract

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-010-001 | SRC-HR-010 | FTCR | Candidate extraction | Name | `EmpName` | people/text | Yes in PDF | Unknown | `ftcrEmpName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-002 | SRC-HR-010 | FTCR | Candidate extraction | Emp. No | `EmpNo` | text | Yes in PDF | Unknown | `ftcrEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-003 | SRC-HR-010 | FTCR | Candidate extraction | Date of Birth | `DOB` | date | Yes in PDF | Unknown | `ftcrDOB` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-004 | SRC-HR-010 | FTCR | Candidate extraction | Age | `EmpAge` | number | Yes in PDF | Unknown | `ftcrEmpAge` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-005 | SRC-HR-010 | FTCR | Candidate extraction | Position | `EmpPost` | text | Yes in PDF | Unknown | `ftcrEmpPost` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-006 | SRC-HR-010 | FTCR | Candidate extraction | Dept./Section | `Dept` | text | Yes in PDF | Unknown | `ftcrDept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-007 | SRC-HR-010 | FTCR | Candidate extraction | Date Joined | `JoinDate` | date | Yes in PDF | Unknown | `ftcrJoinDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-008 | SRC-HR-010 | FTCR | Candidate extraction | Retirement Date | `RetDate` | date | Yes in PDF | Unknown | `ftcrRetDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-009 | SRC-HR-010 | FTCR | Candidate extraction | HOD/HODiv | `DivHead` | people | Yes in PDF | Unknown | `ftcrDivHead` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-010 | SRC-HR-010 | FTCR | Candidate extraction | Attachment | `Attachment` | attachment | No | Unknown | `ftcrAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-011 | SRC-HR-010 | FTCR | Candidate extraction | Submitted by Name | `SubBy` | people/text | Unknown | Unknown | `ftcrSubBy` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-012 | SRC-HR-010 | FTCR | Candidate extraction | Submitted by Designation | `SubDesg` | text | Unknown | Unknown | `ftcrSubDesg` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-013 | SRC-HR-010 | FTCR | Candidate extraction | Submitted Date | `SubDate` | date | Unknown | Unknown | `ftcrSubDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-014 | SRC-HR-010 | FTCR | Candidate extraction | Contract Period | `CPeriod` | choice/text | Yes in PDF | Unknown | `ftcrCPeriod` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-015 | SRC-HR-010 | FTCR | Candidate extraction | Contract Period Other | `Others` | text | Conditional | Unknown | `ftcrOthers` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-016 | SRC-HR-010 | FTCR | Candidate extraction | Div/Dept Head Justification | `DivHeadJust` | multiline | Yes in PDF | Unknown | `ftcrDivHeadJust` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-017 | SRC-HR-010 | FTCR | Candidate extraction | Identified Successor | `InSuccess` | boolean/choice | Yes in PDF | Unknown | `ftcrInSuccess` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-018 | SRC-HR-010 | FTCR | Candidate extraction | External Advertisement | `Ext` | boolean/choice | Yes in PDF | Unknown | `ftcrExt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-019 | SRC-HR-010 | FTCR | Candidate extraction | Successor Name | `SucName` | people/text | Yes in PDF | Unknown | `ftcrSucName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-020 | SRC-HR-010 | FTCR | Candidate extraction | Successor Emp. No. | `SucEmpNo` | text | Yes in PDF | Unknown | `ftcrSucEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-021 | SRC-HR-010 | FTCR | Candidate extraction | Successor Position | `SucPost` | text | Yes in PDF | Unknown | `ftcrSucPost` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-022 | SRC-HR-010 | FTCR | Candidate extraction | Successor Age | `SucAge` | number | Yes in PDF | Unknown | `ftcrSucAge` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-023 | SRC-HR-010 | FTCR | Candidate extraction | Date to be Appointed | `SucDate` | date | Yes in PDF | Unknown | `ftcrSucDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-024 | SRC-HR-010 | FTCR | Candidate extraction | Successor Dept./Section | `SucDept` | text | Yes in PDF | Unknown | `ftcrSucDept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-025 | SRC-HR-010 | FTCR | Candidate extraction | Training Required | `TrReq` | boolean/choice | Yes in PDF | Unknown | `ftcrTrReq` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-026 | SRC-HR-010 | FTCR | Candidate extraction | List of Training | `TrList` | multiline | Conditional | Unknown | `ftcrTrList` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-027 | SRC-HR-010 | FTCR | Candidate extraction | Remarks/Attachment | `Remarks` | multiline/attachment | Unknown | Unknown | `ftcrRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-028 | SRC-HR-010 | FTCR | Candidate extraction | Endorsed By | `EndBy` | people/text | Unknown | Unknown | `ftcrEndBy` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-029 | SRC-HR-010 | FTCR | Candidate extraction | Endorser Designation | `EndDesg` | text | Unknown | Unknown | `ftcrEndDesg` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-030 | SRC-HR-010 | FTCR | Candidate extraction | Endorsed Date | `EndDate` | date | Unknown | Unknown | `ftcrEndDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-031 | SRC-HR-010 | FTCR | Candidate extraction | AGM HR Reviewer | `AppHR` | people | Unknown | Unknown | `ftcrAppHR` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-032 | SRC-HR-010 | FTCR | Candidate extraction | AGM HR Review Date | `AppHRDate` | date | Unknown | Unknown | `ftcrAppHRDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-033 | SRC-HR-010 | FTCR | Candidate extraction | AGM HR Remarks | `HRRem` | multiline | Unknown | Unknown | `ftcrHRRem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-034 | SRC-HR-010 | FTCR | Candidate extraction | COO Approver | `AppCOO` | people | Unknown | Unknown | `ftcrAppCOO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-035 | SRC-HR-010 | FTCR | Candidate extraction | COO Approval Date | `AppCOODate` | date | Unknown | Unknown | `ftcrAppCOODate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-036 | SRC-HR-010 | FTCR | Candidate extraction | COO Remarks | `COORem` | multiline | Unknown | Unknown | `ftcrCOORem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-037 | SRC-HR-010 | FTCR | Candidate extraction | ED Approver | `AppED` | people | Unknown | Unknown | `ftcrAppED` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-038 | SRC-HR-010 | FTCR | Candidate extraction | ED Approval Date | `AppEDDate` | date | Unknown | Unknown | `ftcrAppEDDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-039 | SRC-HR-010 | FTCR | Candidate extraction | ED Remarks | `EDRem` | multiline | Unknown | Unknown | `ftcrEDRem` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-040 | SRC-HR-010 | FTCR | Candidate extraction | HR Application Status | `CaseStatus` | choice | Unknown | Unknown | `ftcrCaseStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-041 | SRC-HR-010 | FTCR | Candidate extraction | Approved Contract Period | `AppFor` | choice/text | Unknown | Unknown | `ftcrAppFor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-010-042 | SRC-HR-010 | FTCR | Candidate extraction | Notify HOD | `NotHOD` | people/text | Unknown | Unknown | `ftcrNotHOD` | Candidate promoted to requirements; verify caveats |

## HR / HR - Duty Roster

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-HR-005-01 | SRC-HR-005 | DRD | Candidate extraction | Company | `Comp` | Text | Inferred | Unknown | `drdComp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-02 | SRC-HR-005 | DRD | Candidate extraction | Category | `Category` | Choice | Inferred | Unknown | `drdCategory` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-03 | SRC-HR-005 | DRD | Candidate extraction | Department | `Dept` | Text | Inferred | Unknown | `drdDept` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-04 | SRC-HR-005 | DRD | Candidate extraction | Section | `Section` | Text | Inferred | Unknown | `drdSection` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-05 | SRC-HR-005 | DRD | Candidate extraction | Section Head | `HOS` | Person | Inferred | — | `drdHOS` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-06 | SRC-HR-005 | DRD | Candidate extraction | Department Head | `HOD` | Person | Inferred | — | `drdHOD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-07 | SRC-HR-005 | DRD | Candidate extraction | CC | `CC` | Text | No | — | `drdCC` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-08 | SRC-HR-005 | DRD | Candidate extraction | Month | `Month` | Number | Inferred | — | `drdMonth` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-09 | SRC-HR-005 | DRD | Candidate extraction | Year | `Year` | Number | Inferred | — | `drdYear` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-10 | SRC-HR-005 | DRD | Candidate extraction | Attachments | `Attch` | Attachment | No | — | `drdAttch` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-11 | SRC-HR-005 | DRD | Candidate extraction | Amended Copy | `Amend` | Choice | No | Unknown | `drdAmend` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-12 | SRC-HR-005 | DRD | Candidate extraction | Changes against last month | `Changes` | Multiline | No | — | `drdChanges` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-13 | SRC-HR-005 | DRD | Candidate extraction | Employee Name | `EmpName` | Person | Inferred | — | `drdEmpName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-14 | SRC-HR-005 | DRD | Candidate extraction | Created By | `SubmittedBy` | Person | Unknown | Unknown | `drdSubmittedBy` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-15 | SRC-HR-005 | DRD | Candidate extraction | Created On | `SubmittedDate` | Date | Unknown | Unknown | `drdSubmittedDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-16 | SRC-HR-005 | DRD | Candidate extraction | Name (HOS) | `HOSName` | Person | Unknown | Unknown | `drdHOSName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-17 | SRC-HR-005 | DRD | Candidate extraction | Date (HOS) | `HOSDate` | Date | Unknown | Unknown | `drdHOSDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-18 | SRC-HR-005 | DRD | Candidate extraction | Remark (HOS) | `HOSRemark` | Multiline | Unknown | Unknown | `drdHOSRemark` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-19 | SRC-HR-005 | DRD | Candidate extraction | Name (HOD) | `HODName` | Person | Unknown | Unknown | `drdHODName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-20 | SRC-HR-005 | DRD | Candidate extraction | Date (HOD) | `HODDate` | Date | Unknown | Unknown | `drdHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-21 | SRC-HR-005 | DRD | Candidate extraction | Remark (HOD) | `HODRemark` | Multiline | Unknown | Unknown | `drdHODRemark` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-22 | SRC-HR-005 | DRD | Candidate extraction | Name (HR) | `HRName` | Person | Unknown | Unknown | `drdHRName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-23 | SRC-HR-005 | DRD | Candidate extraction | Date (HR) | `HRDate` | Date | Unknown | Unknown | `drdHRDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-24 | SRC-HR-005 | DRD | Candidate extraction | CurrentAction | `CA` | Choice | Unknown | Unknown | `drdCA` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-25 | SRC-HR-005 | DRD | Candidate extraction | Editor1 (Section A) | `Editor1` | Person | Unknown | Unknown | `drdEditor1` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-26 | SRC-HR-005 | DRD | Candidate extraction | Editor2 (Section HOS) | `Editor2` | Person | Unknown | Unknown | `drdEditor2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-27 | SRC-HR-005 | DRD | Candidate extraction | Editor3 (Section HOD) | `Editor3` | Person | Unknown | Unknown | `drdEditor3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-28 | SRC-HR-005 | DRD | Candidate extraction | Editor4 (Section HR) | `Editor4` | Person | Unknown | Unknown | `drdEditor4` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-29 | SRC-HR-005 | DRD | Candidate extraction | HOS App | `HOSApp` | Boolean | Unknown | Unknown | `drdHOSApp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-30 | SRC-HR-005 | DRD | Candidate extraction | HOD App | `HODApp` | Boolean | Unknown | Unknown | `drdHODApp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-31 | SRC-HR-005 | DRD | Candidate extraction | HR App | `HRApp` | Boolean | Unknown | Unknown | `drdHRApp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-32 | SRC-HR-005 | DRD | Candidate extraction | HR | `HR` | Text | Unknown | Unknown | `drdHR` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-33 | SRC-HR-005 | DRD | Candidate extraction | ISG Admin | `IT` | Text | Unknown | Unknown | `drdIT` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-34 | SRC-HR-005 | DRD | Candidate extraction | Servers | `Servers` | Text | Unknown | Unknown | `drdServers` | Candidate promoted to requirements; verify caveats |
| CAND-HR-005-35 | SRC-HR-005 | DRD | Candidate extraction | Readers | `Readers` | Text | Unknown | Unknown | `drdReaders` | Candidate promoted to requirements; verify caveats |

## HR / HR - Employee Data

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-007-001 | SRC-HR-007 | EPDU | Candidate extraction | Employee No. | `EmpNo` | people/text | Unknown | Unknown | `epduEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-002 | SRC-HR-007 | EPDU | Candidate extraction | Company | `Company` | text | Unknown | Unknown | `epduCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-003 | SRC-HR-007 | EPDU | Candidate extraction | Name | `EmpName` | people/text | Unknown | Unknown | `epduEmpName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-004 | SRC-HR-007 | EPDU | Candidate extraction | NRIC No. (Old) | `NRIC_O` | text | Unknown | Unknown | `epduNRICO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-005 | SRC-HR-007 | EPDU | Candidate extraction | NRIC No. (New) | `NRIC_N` | text | Unknown | Unknown | `epduNRICN` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-006 | SRC-HR-007 | EPDU | Candidate extraction | Marital Status | `Marital` | choice | Unknown | Unknown | `epduMarital` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-007 | SRC-HR-007 | EPDU | Candidate extraction | Disabilities | `Disabilities` | text | Unknown | Unknown | `epduDisabilities` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-008 | SRC-HR-007 | EPDU | Candidate extraction | Permanent Address | `Address1` | text | Unknown | Unknown | `epduAddress1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-009 | SRC-HR-007 | EPDU | Candidate extraction | Poscode | `Poscode1` | text | Unknown | Unknown | `epduPoscode1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-010 | SRC-HR-007 | EPDU | Candidate extraction | Tel No. | `TelNo1` | text | Unknown | Unknown | `epduTelNo1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-011 | SRC-HR-007 | EPDU | Candidate extraction | Correspondence Address | `Address2` | text | Unknown | Unknown | `epduAddress2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-012 | SRC-HR-007 | EPDU | Candidate extraction | Postcode | `Poscode2` | text | Unknown | Unknown | `epduPoscode2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-013 | SRC-HR-007 | EPDU | Candidate extraction | Tel No. | `TelNo2` | text | Unknown | Unknown | `epduTelNo2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-014 | SRC-HR-007 | EPDU | Candidate extraction | EPF No. | `EPF` | text | Unknown | Unknown | `epduEPF` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-015 | SRC-HR-007 | EPDU | Candidate extraction | SOCSO No. | `SOCSO` | text | Unknown | Unknown | `epduSOCSO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-016 | SRC-HR-007 | EPDU | Candidate extraction | Income Tax No. | `ITAX` | text | Unknown | Unknown | `epduITAX` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-017 | SRC-HR-007 | EPDU | Candidate extraction | Name | `SpName` | people/text | Unknown | Unknown | `epduSpName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-018 | SRC-HR-007 | EPDU | Candidate extraction | NRIC No. (New) | `SpNRIC_N` | text | Unknown | Unknown | `epduSpNRICN` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-019 | SRC-HR-007 | EPDU | Candidate extraction | Working | `SpWork` | text | Unknown | Unknown | `epduSpWork` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-020 | SRC-HR-007 | EPDU | Candidate extraction | Occupation(Optional) | `SpOccupation` | text | Unknown | Unknown | `epduSpOccupation` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-021 | SRC-HR-007 | EPDU | Candidate extraction | Company | `SpComp` | text | Unknown | Unknown | `epduSpComp` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-022 | SRC-HR-007 | EPDU | Candidate extraction | Contact Tel. No. | `TelNo` | text | Unknown | Unknown | `epduTelNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-023 | SRC-HR-007 | EPDU | Candidate extraction | Submitted by | `Submittedby` | people/text | Unknown | Unknown | `epduSubmittedby` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-024 | SRC-HR-007 | EPDU | Candidate extraction | Submitted on | `Submittedon` | date | Unknown | Unknown | `epduSubmittedon` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-025 | SRC-HR-007 | EPDU | Candidate extraction | For Hr Use :- | `HRAction` | people/text | Unknown | Unknown | `epduHRAction` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-026 | SRC-HR-007 | EPDU | Candidate extraction | Accepted by | `Acceptedby` | people/text | Unknown | Unknown | `epduAcceptedby` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-027 | SRC-HR-007 | EPDU | Candidate extraction | Accepted on | `Acceptedon` | date | Unknown | Unknown | `epduAcceptedon` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-028 | SRC-HR-007 | EPDU | Candidate extraction | IT | `IT` | text | Unknown | Unknown | `epduIT` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-029 | SRC-HR-007 | EPDU | Candidate extraction | HR 1 | `HR_1` | people/text | Unknown | Unknown | `epduHR1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-030 | SRC-HR-007 | EPDU | Candidate extraction | HR 2 | `HR_2` | people/text | Unknown | Unknown | `epduHR2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-031 | SRC-HR-007 | EPDU | Candidate extraction | HR 3 | `HR_3` | people/text | Unknown | Unknown | `epduHR3` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-032 | SRC-HR-007 | EPDU | Candidate extraction | HR | `HR` | people/text | Unknown | Unknown | `epduHR` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-033 | SRC-HR-007 | EPDU | Candidate extraction | HR HOD | `HRHOD` | people/text | Unknown | Unknown | `epduHRHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-034 | SRC-HR-007 | EPDU | Candidate extraction | Servers | `Servers` | text | Unknown | Unknown | `epduServers` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-007-035 | SRC-HR-007 | EPDU | Candidate extraction | Readers | `Readers` | text | Unknown | Unknown | `epduReaders` | Candidate promoted to requirements; verify caveats |

## HR / HR - Employee Health

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-008-001 | SRC-HR-008 | EPHR | Candidate extraction | Name | `FullName` | people/text | Unknown | Unknown | `ephrFullName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-002 | SRC-HR-008 | EPHR | Candidate extraction | IC No. / Passport No. | `IC` | text | Unknown | Unknown | `ephrIC` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-003 | SRC-HR-008 | EPHR | Candidate extraction | Gender | `Gender` | choice | Unknown | Unknown | `ephrGender` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-004 | SRC-HR-008 | EPHR | Candidate extraction | HP No | `HP` | text | Unknown | Unknown | `ephrHP` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-005 | SRC-HR-008 | EPHR | Candidate extraction | Company | `Company` | text | Unknown | Unknown | `ephrCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-006 | SRC-HR-008 | EPHR | Candidate extraction | Department | `Dept` | text | Unknown | Unknown | `ephrDept` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-007 | SRC-HR-008 | EPHR | Candidate extraction | Height | `H CM` | number/text | Unknown | Unknown | `ephrHCM` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-008 | SRC-HR-008 | EPHR | Candidate extraction | Weight | `W KG` | number/text | Unknown | Unknown | `ephrWKG` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-009 | SRC-HR-008 | EPHR | Candidate extraction | BMI | `BMI KG/M2` | number/text | Unknown | Unknown | `ephrBMIKGM2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-010 | SRC-HR-008 | EPHR | Candidate extraction | Blood Pressure | `BP mmHg` | text | Unknown | Unknown | `ephrBPMmHg` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-011 | SRC-HR-008 | EPHR | Candidate extraction | Pulse | `P min` | number/text | Unknown | Unknown | `ephrPMin` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-012 | SRC-HR-008 | EPHR | Candidate extraction | Visual | `Visual` | text | Unknown | Unknown | `ephrVisual` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-013 | SRC-HR-008 | EPHR | Candidate extraction | Color Vision | `Vision` | text | Unknown | Unknown | `ephrVision` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-014 | SRC-HR-008 | EPHR | Candidate extraction | Past Medical / Surgical History | `MedHist` | choice | Unknown | Unknown | `ephrMedHist` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-015 | SRC-HR-008 | EPHR | Candidate extraction | Follow up | `Followup` | text | Unknown | Unknown | `ephrFollowup` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-016 | SRC-HR-008 | EPHR | Candidate extraction | Regularly | `Followup2` | text | Unknown | Unknown | `ephrFollowup2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-017 | SRC-HR-008 | EPHR | Candidate extraction | Location | `LocaƟon` | choice | Unknown | Unknown | `ephrLocaOn` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-018 | SRC-HR-008 | EPHR | Candidate extraction | Diagnosis | `Diagnosis` | text | Unknown | Unknown | `ephrDiagnosis` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-019 | SRC-HR-008 | EPHR | Candidate extraction | Discharge Summary | `Discharge` | multiline | Unknown | Unknown | `ephrDischarge` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-020 | SRC-HR-008 | EPHR | Candidate extraction | Medical Report | `AƩachment` | choice | Unknown | Unknown | `ephrAAchment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-008-021 | SRC-HR-008 | EPHR | Candidate extraction | Additional Report | `AƩachment2` | multiline | Unknown | Unknown | `ephrAAchment2` | Candidate promoted to requirements; verify caveats |

## HR / HR - Exit

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-HR-006-01 | SRC-HR-006 | EEN | Candidate extraction | Company | `Site` | Text | Inferred | Unknown | `eenSite` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-02 | SRC-HR-006 | EEN | Candidate extraction | Main Category | `Main` | Choice | Inferred | Unknown | `eenMain` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-03 | SRC-HR-006 | EEN | Candidate extraction | Category | `Category` | Choice | Inferred | Unknown | `eenCategory` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-04 | SRC-HR-006 | EEN | Candidate extraction | Type | `Type` | Choice | Inferred | Unknown | `eenType` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-05 | SRC-HR-006 | EEN | Candidate extraction | please specify (other type) | `othertype` | Text | No | — | `eenOthertype` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-06 | SRC-HR-006 | EEN | Candidate extraction | Renewal Status | `ContractStatus` | Choice | Inferred | Unknown | `eenContractStatus` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-07 | SRC-HR-006 | EEN | Candidate extraction | Name & Email | `EmpName / EmpEmail` | Person+Email | Inferred | — | `eenEmpNameEmpEmail` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-08 | SRC-HR-006 | EEN | Candidate extraction | Employee No. | `EmpNum` | Text | Inferred | — | `eenEmpNum` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-09 | SRC-HR-006 | EEN | Candidate extraction | Position | `Position` | Text | Inferred | — | `eenPosition` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-10 | SRC-HR-006 | EEN | Candidate extraction | Section | `EmpDept` | Text | Inferred | — | `eenEmpDept` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-11 | SRC-HR-006 | EEN | Candidate extraction | Exit Interview (Hardcopy?) | `ExitInterview` | Choice | Inferred | Unknown | `eenExitInterview` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-12 | SRC-HR-006 | EEN | Candidate extraction | Notification Received Date | `dtNoticeReceived` | Date | Inferred | — | `eenDtNoticeReceived` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-13 | SRC-HR-006 | EEN | Candidate extraction | Effective Resignation Date | `ResignedDate` | Date | Inferred | — | `eenResignedDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-14 | SRC-HR-006 | EEN | Candidate extraction | Last Working Date | `LastWorkingDay` | Date | Inferred | — | `eenLastWorkingDay` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-15 | SRC-HR-006 | EEN | Candidate extraction | Last Service Date | `LastServiceDay` | Date | Inferred | — | `eenLastServiceDay` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-16 | SRC-HR-006 | EEN | Candidate extraction | Superior | `HOD` | Person | Inferred | — | `eenHOD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-17 | SRC-HR-006 | EEN | Candidate extraction | Department/Division Head | `DivHead` | Person | Inferred | — | `eenDivHead` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-18 | SRC-HR-006 | EEN | Candidate extraction | Remarks | `HRComment` | Multiline | No | — | `eenHRComment` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-19 | SRC-HR-006 | EEN | Candidate extraction | Date Submitted | `SubmitDate` | Date | Inferred | — | `eenSubmitDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-20 | SRC-HR-006 | EEN | Candidate extraction | Original Deactivate Date | `dtOriDeactivate` | Date | Unknown | Unknown | `eenDtOriDeactivate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-21 | SRC-HR-006 | EEN | Candidate extraction | Deactivate Date (after extension) | `dtDeactivate` | Date | Unknown | Unknown | `eenDtDeactivate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-22 | SRC-HR-006 | EEN | Candidate extraction | Justification (extension) | `Justification` | Multiline | Unknown | Unknown | `eenJustification` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-23 | SRC-HR-006 | EEN | Candidate extraction | Granted by | `ExtName` | Person | Unknown | Unknown | `eenExtName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-24 | SRC-HR-006 | EEN | Candidate extraction | Granted on | `ExtDate` | Date | Unknown | Unknown | `eenExtDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-25 | SRC-HR-006 | EEN | Candidate extraction | Status | `Status` | Choice | Unknown | APPROVE, REJECT | `eenStatus` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-26 | SRC-HR-006 | EEN | Candidate extraction | Name (ED) | `EDName` | Person | Unknown | — | `eenEDName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-27 | SRC-HR-006 | EEN | Candidate extraction | Date (ED) | `EDDate` | Date | Unknown | — | `eenEDDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-28 | SRC-HR-006 | EEN | Candidate extraction | Remarks | `Remarks` | Multiline | Unknown | — | `eenRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-35 | SRC-HR-006 | EEN | Candidate extraction | HOD APPROVE REJECT | `HODRemarks` | Choice | Unknown | APPROVE, REJECT | `eenHODRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-36 | SRC-HR-006 | EEN | Candidate extraction | Approved By | `HODName` | Person | Unknown | — | `eenHODName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-37 | SRC-HR-006 | EEN | Candidate extraction | Approved Date | `HODDate` | Date | Unknown | — | `eenHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-38 | SRC-HR-006 | EEN | Candidate extraction | Actual Last Working Day | `ActualLWD` | Date | Unknown | Unknown | `eenActualLWD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-39 | SRC-HR-006 | EEN | Candidate extraction | Sent by | `SentBy` | Person | Unknown | Unknown | `eenSentBy` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-40 | SRC-HR-006 | EEN | Candidate extraction | Sent Date | `SentDate` | Date | Unknown | Unknown | `eenSentDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-41 | SRC-HR-006 | EEN | Candidate extraction | Company Properties | `CompanyProperties` | Choice | Unknown | Unknown | `eenCompanyProperties` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-42 | SRC-HR-006 | EEN | Candidate extraction | Reason (not returned) | `Reason` | Multiline | Unknown | Unknown | `eenReason` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-43 | SRC-HR-006 | EEN | Candidate extraction | Remarks | `Remarks2` | Multiline | Unknown | Unknown | `eenRemarks2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-44 | SRC-HR-006 | EEN | Candidate extraction | Performed By | `PerformedBy2` | Person | Unknown | Unknown | `eenPerformedBy2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-45 | SRC-HR-006 | EEN | Candidate extraction | Performed Date | `PerformedDate2` | Date | Unknown | Unknown | `eenPerformedDate2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-46 | SRC-HR-006 | EEN | Candidate extraction | Attachment | `Attachment` | Attachment | Unknown | Unknown | `eenAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-47 | SRC-HR-006 | EEN | Candidate extraction | Status (Withdraw) | `WDStatus` | Choice | Unknown | Unknown | `eenWDStatus` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-48 | SRC-HR-006 | EEN | Candidate extraction | Reason (Withdraw) | `WDReason` | Multiline | Unknown | Unknown | `eenWDReason` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-49 | SRC-HR-006 | EEN | Candidate extraction | Performed By (Withdraw) | `WDBy` | Person | Unknown | Unknown | `eenWDBy` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-50 | SRC-HR-006 | EEN | Candidate extraction | Performed Date (Withdraw) | `WDDate` | Date | Unknown | Unknown | `eenWDDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-51 | SRC-HR-006 | EEN | Candidate extraction | Current Action | `CA` | Choice | Unknown | Unknown | `eenCA` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-52 | SRC-HR-006 | EEN | Candidate extraction | Editor 1-6 | `Editor1-Editor6` | Person | Unknown | Unknown | `eenEditor1Editor6` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-53 | SRC-HR-006 | EEN | Candidate extraction | IT Section | `ITEditor` | Person | Unknown | Unknown | `eenITEditor` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-54 | SRC-HR-006 | EEN | Candidate extraction | HOD Section | `HODEditor` | Person | Unknown | Unknown | `eenHODEditor` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-55 | SRC-HR-006 | EEN | Candidate extraction | HR Editor | `HREditor` | Person | Unknown | Unknown | `eenHREditor` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-56 | SRC-HR-006 | EEN | Candidate extraction | EI Related | `isEI` | Text | Unknown | Unknown | `eenIsEI` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-57 | SRC-HR-006 | EEN | Candidate extraction | ACM IT | `ACMIT` | Text | Unknown | Unknown | `eenACMIT` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-58 | SRC-HR-006 | EEN | Candidate extraction | PCN IT | `PCNIT` | Text | Unknown | Unknown | `eenPCNIT` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-59 | SRC-HR-006 | EEN | Candidate extraction | HR Exec/Non-Exec | `HR1, HR2` | Text | Unknown | Unknown | `eenHR1HR2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-60 | SRC-HR-006 | EEN | Candidate extraction | HR HOD | `HRHOD` | Person | Unknown | Unknown | `eenHRHOD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-61 | SRC-HR-006 | EEN | Candidate extraction | Finance | `FIN` | Text | Unknown | Unknown | `eenFIN` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-62 | SRC-HR-006 | EEN | Candidate extraction | Security (BCC) | `BCC` | Text | Unknown | Unknown | `eenBCC` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-63 | SRC-HR-006 | EEN | Candidate extraction | Running Number | `INO` | Text | Unknown | Unknown | `eenINO` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-64 | SRC-HR-006 | EEN | Candidate extraction | Reminder date | `RemDate` | Date | Unknown | Unknown | `eenRemDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-65 | SRC-HR-006 | EEN | Candidate extraction | Hide Extend button | `Hide` | Boolean | Unknown | Unknown | `eenHide` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-66 | SRC-HR-006 | EEN | Candidate extraction | Hide Interview | `HideInt` | Boolean | Unknown | Unknown | `eenHideInt` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-67 | SRC-HR-006 | EEN | Candidate extraction | Hide Handover | `HideHand` | Boolean | Unknown | Unknown | `eenHideHand` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-68 | SRC-HR-006 | EEN | Candidate extraction | Type Check | `TypeCheck` | Choice | Unknown | Unknown | `eenTypeCheck` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-69 | SRC-HR-006 | EEN | Candidate extraction | All Done (IT) | `AllDone` | Boolean | Unknown | Unknown | `eenAllDone` | Candidate promoted to requirements; verify caveats |
| CAND-HR-006-70 | SRC-HR-006 | EEN | Candidate extraction | All Done (HR) | `AllDone2` | Boolean | Unknown | Unknown | `eenAllDone2` | Candidate promoted to requirements; verify caveats |

## HR / HR - Foreign Worker

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-011-001 | SRC-HR-011 | FWWPD | Candidate extraction | Company | `Company` | text | Unknown | Unknown | `fwwpdCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-002 | SRC-HR-011 | FWWPD | Candidate extraction | Status | `Status` | choice | Unknown | Unknown | `fwwpdStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-003 | SRC-HR-011 | FWWPD | Candidate extraction | Reason | `Reason` | multiline | Unknown | Unknown | `fwwpdReason` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-004 | SRC-HR-011 | FWWPD | Candidate extraction | Remark | `Remark` | multiline | Unknown | Unknown | `fwwpdRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-005 | SRC-HR-011 | FWWPD | Candidate extraction | Check-Out-Memo | `COMemo` | attachment/text | Unknown | Unknown | `fwwpdCOMemo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-006 | SRC-HR-011 | FWWPD | Candidate extraction | Name | `Name` | people/text | Unknown | Unknown | `fwwpdName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-007 | SRC-HR-011 | FWWPD | Candidate extraction | Employee No. | `EmpNo` | text | Unknown | Unknown | `fwwpdEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-008 | SRC-HR-011 | FWWPD | Candidate extraction | Department | `Department` | text | Unknown | Unknown | `fwwpdDepartment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-009 | SRC-HR-011 | FWWPD | Candidate extraction | Hostel Address | `Hostel` | multiline | Unknown | Unknown | `fwwpdHostel` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-010 | SRC-HR-011 | FWWPD | Candidate extraction | Date of Birth | `DOB` | date | Unknown | Unknown | `fwwpdDOB` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-011 | SRC-HR-011 | FWWPD | Candidate extraction | Date of Commencement | `DOC` | date | Unknown | Unknown | `fwwpdDOC` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-012 | SRC-HR-011 | FWWPD | Candidate extraction | New Passport No. | `PassportNoNew` | text | Unknown | Unknown | `fwwpdPassportNoNew` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-013 | SRC-HR-011 | FWWPD | Candidate extraction | New Upload Passport | `PassportNew` | attachment | Unknown | Unknown | `fwwpdPassportNew` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-014 | SRC-HR-011 | FWWPD | Candidate extraction | Passport Expiry Date | `PassportExpiryDate` | date | Unknown | Unknown | `fwwpdPassportExpiryDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-015 | SRC-HR-011 | FWWPD | Candidate extraction | Old Passport No. | `PassportNoOld` | text | Unknown | Unknown | `fwwpdPassportNoOld` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-016 | SRC-HR-011 | FWWPD | Candidate extraction | Old Upload Passport | `PassportOld` | attachment | Unknown | Unknown | `fwwpdPassportOld` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-017 | SRC-HR-011 | FWWPD | Candidate extraction | Nationality | `Nationality` | choice/text | Unknown | Unknown | `fwwpdNationality` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-018 | SRC-HR-011 | FWWPD | Candidate extraction | Contract Period From | `ContractPeriod` | date | Unknown | Unknown | `fwwpdContractPeriod` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-019 | SRC-HR-011 | FWWPD | Candidate extraction | Contract Period To | `ContractPeriod_1` | date | Unknown | Unknown | `fwwpdContractPeriod1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-020 | SRC-HR-011 | FWWPD | Candidate extraction | Work Permit Expiry Date | `WorkPermitExpiryDate` | date | Unknown | Unknown | `fwwpdWorkPermitExpiryDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-021 | SRC-HR-011 | FWWPD | Candidate extraction | Work Permit No. | `WorkPermitNo` | text | Unknown | Unknown | `fwwpdWorkPermitNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-022 | SRC-HR-011 | FWWPD | Candidate extraction | Upload Permit to Work | `Permit` | attachment | Unknown | Unknown | `fwwpdPermit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-023 | SRC-HR-011 | FWWPD | Candidate extraction | FOMEMA Worker Code | `WorkerCode` | text | Unknown | Unknown | `fwwpdWorkerCode` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-011-024 | SRC-HR-011 | FWWPD | Candidate extraction | SOCSO No. | `SocsoNo` | text | Unknown | Unknown | `fwwpdSocsoNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-001 | SRC-HR-012 | FWWPE | Candidate extraction | Issue No | `IssueNo` | text | Unknown | Unknown | `fwwpeIssueNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-002 | SRC-HR-012 | FWWPE | Candidate extraction | Superior | `SendTo` | people | Unknown | Unknown | `fwwpeSendTo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-003 | SRC-HR-012 | FWWPE | Candidate extraction | Head of Section | `HOS` | people | Optional in PDF | Unknown | `fwwpeHOS` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-004 | SRC-HR-012 | FWWPE | Candidate extraction | Head of Department | `HOD` | people | Unknown | Unknown | `fwwpeHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-005 | SRC-HR-012 | FWWPE | Candidate extraction | CC | `CC` | people/text | Unknown | Unknown | `fwwpeCC` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-006 | SRC-HR-012 | FWWPE | Candidate extraction | Company | `Company` | text | Unknown | Unknown | `fwwpeCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-007 | SRC-HR-012 | FWWPE | Candidate extraction | Name | `Name` | people/text | Unknown | Unknown | `fwwpeName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-008 | SRC-HR-012 | FWWPE | Candidate extraction | Employee No. | `EmpNo` | text | Unknown | Unknown | `fwwpeEmpNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-009 | SRC-HR-012 | FWWPE | Candidate extraction | Passport No. | `PassportNo` | text | Unknown | Unknown | `fwwpePassportNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-010 | SRC-HR-012 | FWWPE | Candidate extraction | Department | `Department` | text | Unknown | Unknown | `fwwpeDepartment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-011 | SRC-HR-012 | FWWPE | Candidate extraction | Section | `Section` | text | Unknown | Unknown | `fwwpeSection` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-012 | SRC-HR-012 | FWWPE | Candidate extraction | Work Permit Expiry Date | `WPExpDate` | date | Unknown | Unknown | `fwwpeWPExpDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-013 | SRC-HR-012 | FWWPE | Candidate extraction | Contract Period From | `DateF` | date | Unknown | Unknown | `fwwpeDateF` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-014 | SRC-HR-012 | FWWPE | Candidate extraction | Contract Period To | `DateT` | date | Unknown | Unknown | `fwwpeDateT` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-015 | SRC-HR-012 | FWWPE | Candidate extraction | Contract Year | `Year` | number/text | Unknown | Unknown | `fwwpeYear` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-016 | SRC-HR-012 | FWWPE | Candidate extraction | Requested By | `DocAuthor` | people | System | Unknown | `fwwpeDocAuthor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-017 | SRC-HR-012 | FWWPE | Candidate extraction | Date Issued | `DateIssued` | date | System | Unknown | `fwwpeDateIssued` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-018 | SRC-HR-012 | FWWPE | Candidate extraction | Superior Reply Status | `Status` | choice | Unknown | Continue / Not to Continue visible | `fwwpeStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-019 | SRC-HR-012 | FWWPE | Candidate extraction | Reason for leaving | `Reason` | multiline | Conditional | Unknown | `fwwpeReason` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-020 | SRC-HR-012 | FWWPE | Candidate extraction | Departure | `Departure` | date/text | Conditional | Unknown | `fwwpeDeparture` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-021 | SRC-HR-012 | FWWPE | Candidate extraction | Early-leave letter | `attachment` | attachment | Conditional | Unknown | `fwwpeAttachment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-022 | SRC-HR-012 | FWWPE | Candidate extraction | Reply Remark | `ReplyRemark` | multiline | Unknown | Unknown | `fwwpeReplyRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-023 | SRC-HR-012 | FWWPE | Candidate extraction | Reply Position | `Position` | text | Unknown | Unknown | `fwwpePosition` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-024 | SRC-HR-012 | FWWPE | Candidate extraction | Reply Name | `ReplyName` | people/text | Unknown | Unknown | `fwwpeReplyName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-025 | SRC-HR-012 | FWWPE | Candidate extraction | Reply Date | `ReplyDate` | date | Unknown | Unknown | `fwwpeReplyDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-026 | SRC-HR-012 | FWWPE | Candidate extraction | HOS Status | `HOSStatus` | choice | Unknown | Approved / Rejected visible | `fwwpeHOSStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-027 | SRC-HR-012 | FWWPE | Candidate extraction | HOS Name | `HOSName` | people/text | Unknown | Unknown | `fwwpeHOSName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-028 | SRC-HR-012 | FWWPE | Candidate extraction | HOS Date | `HOSDate` | date | Unknown | Unknown | `fwwpeHOSDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-029 | SRC-HR-012 | FWWPE | Candidate extraction | HOS Remark | `HOSRemark` | multiline | Unknown | Unknown | `fwwpeHOSRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-030 | SRC-HR-012 | FWWPE | Candidate extraction | HOD Contract Status | `ContStatus` | choice | Unknown | Unknown | `fwwpeContStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-031 | SRC-HR-012 | FWWPE | Candidate extraction | HOD Status | `HODStatus` | choice | Unknown | Approved / Rejected visible | `fwwpeHODStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-032 | SRC-HR-012 | FWWPE | Candidate extraction | HOD Name | `HODName` | people/text | Unknown | Unknown | `fwwpeHODName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-033 | SRC-HR-012 | FWWPE | Candidate extraction | HOD Date | `HODDate` | date | Unknown | Unknown | `fwwpeHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-034 | SRC-HR-012 | FWWPE | Candidate extraction | HOD Remark | `HODRemark` | multiline | Unknown | Unknown | `fwwpeHODRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-035 | SRC-HR-012 | FWWPE | Candidate extraction | HR Status | `HRHODStatus` | choice | Unknown | Approved / Rejected visible | `fwwpeHRHODStatus` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-036 | SRC-HR-012 | FWWPE | Candidate extraction | HR Name | `HRHODName` | people/text | Unknown | Unknown | `fwwpeHRHODName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-037 | SRC-HR-012 | FWWPE | Candidate extraction | HR Date | `HRHODDate` | date | Unknown | Unknown | `fwwpeHRHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-038 | SRC-HR-012 | FWWPE | Candidate extraction | HR Remark | `HRHODRemark` | multiline | Unknown | Unknown | `fwwpeHRHODRemark` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-039 | SRC-HR-012 | FWWPE | Candidate extraction | Flight Departure Date | `DepartDate` | date | Unknown | Unknown | `fwwpeDepartDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-040 | SRC-HR-012 | FWWPE | Candidate extraction | Departure Time | `DepartTime` | text/time | Unknown | Unknown | `fwwpeDepartTime` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-041 | SRC-HR-012 | FWWPE | Candidate extraction | Flight Attachment | `Att` | attachment | Unknown | Unknown | `fwwpeAtt` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-042 | SRC-HR-012 | FWWPE | Candidate extraction | Transportation Details | `Att2` | attachment/text | Unknown | Unknown | `fwwpeAtt2` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-043 | SRC-HR-012 | FWWPE | Candidate extraction | Income Tax Date of Submission | `SubDate` | date | Unknown | Unknown | `fwwpeSubDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-044 | SRC-HR-012 | FWWPE | Candidate extraction | Income Tax Remarks | `Remarks` | multiline | Unknown | Unknown | `fwwpeRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-045 | SRC-HR-012 | FWWPE | Candidate extraction | Withdrawn Date | `WDDate` | date | Unknown | Unknown | `fwwpeWDDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-046 | SRC-HR-012 | FWWPE | Candidate extraction | Withdrawn By | `WDBy` | people/text | Unknown | Unknown | `fwwpeWDBy` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-012-047 | SRC-HR-012 | FWWPE | Candidate extraction | Withdrawal Remarks | `WDRem` | multiline | Unknown | Unknown | `fwwpeWDRem` | Candidate promoted to requirements; verify caveats |

## HR / HR - Gift/Donation/Sponsorship

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-013-001 | SRC-HR-013 | GDSN | Candidate extraction | Notification No. | `ProjectCode` | text | Unknown | Unknown | `gdsnProjectCode` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-002 | SRC-HR-013 | GDSN | Candidate extraction | Request Type | `ReqType` | choice | Unknown | Unknown | `gdsnReqType` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-003 | SRC-HR-013 | GDSN | Candidate extraction | Company | `company` | text | Unknown | Unknown | `gdsnCompany` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-004 | SRC-HR-013 | GDSN | Candidate extraction | Relationship | `Recipient` | text/choice | Unknown | Unknown | `gdsnRecipient` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-005 | SRC-HR-013 | GDSN | Candidate extraction | Name of person/company the gift | `Name` | text | Unknown | Unknown | `gdsnName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-006 | SRC-HR-013 | GDSN | Candidate extraction | Address | `Address` | multiline | Unknown | Unknown | `gdsnAddress` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-007 | SRC-HR-013 | GDSN | Candidate extraction | SAP No. / Vendor ID No. | `SAP_ID` | text | Unknown | Unknown | `gdsnSAPID` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-008 | SRC-HR-013 | GDSN | Candidate extraction | Requestor | `Requestor` | people/text | Unknown | Unknown | `gdsnRequestor` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-009 | SRC-HR-013 | GDSN | Candidate extraction | HOD | `HOD` | people | Unknown | Unknown | `gdsnHOD` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-010 | SRC-HR-013 | GDSN | Candidate extraction | Department | `Department` | text | Unknown | Unknown | `gdsnDepartment` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-011 | SRC-HR-013 | GDSN | Candidate extraction | Type | `Type` | choice | Unknown | Unknown | `gdsnType` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-012 | SRC-HR-013 | GDSN | Candidate extraction | Purpose of the gift | `Purpose` | choice/text | Unknown | Unknown | `gdsnPurpose` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-013 | SRC-HR-013 | GDSN | Candidate extraction | Other Purpose | `otherPurpose` | multiline | Conditional | Unknown | `gdsnOtherPurpose` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-014 | SRC-HR-013 | GDSN | Candidate extraction | Benefit to Company | `IsBenefit` | boolean/choice | Unknown | Unknown | `gdsnIsBenefit` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-015 | SRC-HR-013 | GDSN | Candidate extraction | Benefit Text | `benefitText` | multiline | Conditional | Unknown | `gdsnBenefitText` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-016 | SRC-HR-013 | GDSN | Candidate extraction | Gift with Company Logo | `IsLogo` | boolean/choice | Unknown | Unknown | `gdsnIsLogo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-017 | SRC-HR-013 | GDSN | Candidate extraction | Description of Gift | `ItemDetail` | multiline | Unknown | Unknown | `gdsnItemDetail` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-018 | SRC-HR-013 | GDSN | Candidate extraction | Value of Gift | `GiftValue` | currency | Unknown | Unknown | `gdsnGiftValue` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-019 | SRC-HR-013 | GDSN | Candidate extraction | Date | `DateRec` | date | Unknown | Unknown | `gdsnDateRec` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-020 | SRC-HR-013 | GDSN | Candidate extraction | Quantity | `Quantity` | number | Unknown | Unknown | `gdsnQuantity` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-021 | SRC-HR-013 | GDSN | Candidate extraction | Price per Unit | `Price` | currency | Unknown | Unknown | `gdsnPrice` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-022 | SRC-HR-013 | GDSN | Candidate extraction | Total Cost | `Total` | currency | Unknown | Unknown | `gdsnTotal` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-023 | SRC-HR-013 | GDSN | Candidate extraction | Purchase through PO | `IsPO` | boolean/choice | Unknown | Unknown | `gdsnIsPO` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-024 | SRC-HR-013 | GDSN | Candidate extraction | PO Number | `PoNo` | text | Conditional | Unknown | `gdsnPoNo` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-025 | SRC-HR-013 | GDSN | Candidate extraction | Submitted by | `Notified` | people/text | Unknown | Unknown | `gdsnNotified` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-026 | SRC-HR-013 | GDSN | Candidate extraction | Position | `position` | text | Unknown | Unknown | `gdsnPosition` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-027 | SRC-HR-013 | GDSN | Candidate extraction | Submitted Date | `reportedDate` | date | Unknown | Unknown | `gdsnReportedDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-028 | SRC-HR-013 | GDSN | Candidate extraction | HOD Endorsed By | `HODName` | people/text | Unknown | Unknown | `gdsnHODName` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-029 | SRC-HR-013 | GDSN | Candidate extraction | HOD Position | `HODPost` | text | Unknown | Unknown | `gdsnHODPost` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-030 | SRC-HR-013 | GDSN | Candidate extraction | HOD Date | `HODDate` | date | Unknown | Unknown | `gdsnHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-031 | SRC-HR-013 | GDSN | Candidate extraction | HOD App | `App` | choice/status | Unknown | Unknown | `gdsnApp` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-013-032 | SRC-HR-013 | GDSN | Candidate extraction | Notified To | `SendTo` | people/text | Unknown | Unknown | `gdsnSendTo` | Candidate promoted to requirements; verify caveats |

## HR / HR - Information

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| HEALTHINFO-001 | SRC-HR-014 | HEALTHINFO | - | Title | `Title` | Text | Unknown | Unknown | `healthinfoTitle` | Clearly Found |
| HEALTHINFO-002 | SRC-HR-014 | HEALTHINFO | - | Category | `Category` | Choice | Unknown | Unknown | `healthinfoCategory` | Clearly Found, values need confirmation |
| HEALTHINFO-003 | SRC-HR-014 | HEALTHINFO | - | To | `Send` | People/Group | Unknown | Unknown | `healthinfoSend` | Clearly Found |
| HEALTHINFO-004 | SRC-HR-014 | HEALTHINFO | - | Subject | `Subject` | Text | Unknown | Unknown | `healthinfoSubject` | Clearly Found |
| HEALTHINFO-005 | SRC-HR-014 | HEALTHINFO | - | Description | `Body` | Rich text/Multiline | Unknown | Unknown | `healthinfoBody` | Clearly Found |
| HEALTHINFO-006 | SRC-HR-014 | HEALTHINFO | - | Attachment | `Att` | Attachment | Unknown | Unknown | `healthinfoAtt` | Clearly Found |
| HEALTHINFO-007 | SRC-HR-014 | HEALTHINFO | - | Phone Ext. No. | `Ext` | Text | Unknown | Unknown | `healthinfoExt` | Clearly Found |
| HEALTHINFO-008 | SRC-HR-014 | HEALTHINFO | - | Status Updates | `Update` | Multiline | Unknown | Unknown | `healthinfoUpdate` | Clearly Found |
| HEALTHINFO-009 | SRC-HR-014 | HEALTHINFO | - | Status | `Status` | Choice/Status | Unknown | Unknown | `healthinfoStatus` | Clearly Found |
| HEALTHINFO-010 | SRC-HR-014 | HEALTHINFO | - | Viewed counter/details | `Viewed, CtrLst` | Number/Text | Unknown | Unknown | `healthinfoViewedCtrLst` | Clearly Found |

## HR / HR - Survey

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| CAND-SRC-HR-009-001 | SRC-HR-009 | ESF | Candidate extraction | Years of Service | `Service` | number/text | Unknown | Unknown | `esfService` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-002 | SRC-HR-009 | ESF | Candidate extraction | Age Group | `Age` | number/text | Unknown | Unknown | `esfAge` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-003 | SRC-HR-009 | ESF | Candidate extraction | Category | `Category` | choice | Unknown | Unknown | `esfCategory` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-004 | SRC-HR-009 | ESF | Candidate extraction | Suggestion/s (for improvement) | `Suggestion` | multiline | Unknown | Unknown | `esfSuggestion` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-005 | SRC-HR-009 | ESF | Candidate extraction | CA | `CA` | choice | Unknown | Unknown | `esfCA` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-006 | SRC-HR-009 | ESF | Candidate extraction | HR | `HR` | people/text | Unknown | Unknown | `esfHR` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-007 | SRC-HR-009 | ESF | Candidate extraction | IT | `IT` | text | Unknown | Unknown | `esfIT` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-008 | SRC-HR-009 | ESF | Candidate extraction | Editor 1 | `Editor1` | people/text | Unknown | Unknown | `esfEditor1` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-009 | SRC-HR-009 | ESF | Candidate extraction | Servers | `Servers` | text | Unknown | Unknown | `esfServers` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-010 | SRC-HR-009 | ESF | Candidate extraction | Readers | `Readers` | text | Unknown | Unknown | `esfReaders` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-011 | SRC-HR-009 | ESF | Candidate extraction | All Questions | `Qs` | text | Unknown | Unknown | `esfQs` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-012 | SRC-HR-009 | ESF | Candidate extraction | All Questions | `Cs` | text | Unknown | Unknown | `esfCs` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-013 | SRC-HR-009 | ESF | Candidate extraction | All Questions | `Gs - G_16` | text | Unknown | Unknown | `esfGsG16` | Candidate promoted to requirements; verify caveats |
| CAND-SRC-HR-009-014 | SRC-HR-009 | ESF | Candidate extraction | Total Rating | `TotalRating` | choice | Unknown | Unknown | `esfTotalRating` | Candidate promoted to requirements; verify caveats |

## HR / HR - Workforce

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| BSD-001 | SRC-HR-001 | BSD | - | Division | `Division` | Text | Inferred | Unknown | `bsdDivision` | Clearly Found |
| BSD-002 | SRC-HR-001 | BSD | - | Department | `Dept` | Text | Inferred | Unknown | `bsdDept` | Clearly Found |
| BSD-003 | SRC-HR-001 | BSD | - | Section | `Section` | Text | Inferred | Unknown | `bsdSection` | Clearly Found |
| BSD-004 | SRC-HR-001 | BSD | - | Name (PIC) | `PIC` | Person | Inferred | — | `bsdPIC` | Clearly Found |
| BSD-005 | SRC-HR-001 | BSD | - | Employee No. | `EmpNo` | Text | Inferred | — | `bsdEmpNo` | Clearly Found |
| BSD-006 | SRC-HR-001 | BSD | - | Position | `Position` | Text | Inferred | — | `bsdPosition` | Clearly Found |
| BSD-007 | SRC-HR-001 | BSD | - | Area of Responsibility | `Responsibility` | Multiline | Inferred | — | `bsdResponsibility` | Clearly Found |
| BSD-008 | SRC-HR-001 | BSD | - | Department/Division Head | `HOD` | Person | Inferred | — | `bsdHOD` | Clearly Found |
| BSD-009 | SRC-HR-001 | BSD | - | Name (BS1) | `PIC_1` | Person | Inferred | Unknown | `bsdPIC1` | Clearly Found |
| BSD-010 | SRC-HR-001 | BSD | - | Position (BS1) | `Position_1` | Text | Inferred | Unknown | `bsdPosition1` | Clearly Found |
| BSD-011 | SRC-HR-001 | BSD | - | Area of Responsibility (BS1) | `Responsibility_1` | Multiline | Inferred | Unknown | `bsdResponsibility1` | Clearly Found |
| BSD-012 | SRC-HR-001 | BSD | - | Name (BS2) | `PIC_2` | Person | Inferred | Unknown | `bsdPIC2` | Clearly Found |
| BSD-013 | SRC-HR-001 | BSD | - | Position (BS2) | `Position_2` | Text | Inferred | Unknown | `bsdPosition2` | Clearly Found |
| BSD-014 | SRC-HR-001 | BSD | - | Area of Responsibility (BS2) | `Responsibility_2` | Multiline | Inferred | Unknown | `bsdResponsibility2` | Clearly Found |
| BSD-015 | SRC-HR-001 | BSD | - | Name (BS3) | `PIC_3` | Person | Inferred | Unknown | `bsdPIC3` | Clearly Found |
| BSD-016 | SRC-HR-001 | BSD | - | Position (BS3) | `Position_3` | Text | Inferred | Unknown | `bsdPosition3` | Clearly Found |
| BSD-017 | SRC-HR-001 | BSD | - | Area of Responsibility (BS3) | `Responsibility_3` | Multiline | Inferred | Unknown | `bsdResponsibility3` | Clearly Found |
| BSD-018 | SRC-HR-001 | BSD | - | Name (Submitted By) | `SubmittedBy` | Person | Inferred | Unknown | `bsdSubmittedBy` | Clearly Found |
| BSD-019 | SRC-HR-001 | BSD | - | Date | `SubmitDate` | Date | Inferred | Unknown | `bsdSubmitDate` | Clearly Found |
| BSD-020 | SRC-HR-001 | BSD | - | Remark | `Remark` | Multiline | No | Unknown | `bsdRemark` | Clearly Found |
| BSD-021 | SRC-HR-001 | BSD | - | APPROVE REJECT | `(choice control)` | Choice | Inferred | **APPROVE, REJECT** | `bsdChoiceControl` | Clearly Found |
| BSD-022 | SRC-HR-001 | BSD | - | Name (HOD) | `HODName` | Person | Inferred | — | `bsdHODName` | Clearly Found |
| BSD-023 | SRC-HR-001 | BSD | - | Position (HOD) | `HODPost` | Text | Inferred | — | `bsdHODPost` | Clearly Found |
| BSD-024 | SRC-HR-001 | BSD | - | Date (HOD) | `HODDate` | Date | Inferred | — | `bsdHODDate` | Clearly Found |
| BSD-025 | SRC-HR-001 | BSD | - | Remarks (HOD) | `HODRemarks` | Multiline | No | — | `bsdHODRemarks` | Clearly Found |
| BSD-026 | SRC-HR-001 | BSD | - | HOD Approval Flag | `HODApp` | Boolean | Inferred | — | `bsdHODApp` | Clearly Found |
| BSD-027 | SRC-HR-001 | BSD | - | Revision Required | `Revision` | Choice | No | Unknown | `bsdRevision` | Clearly Found |
| BSD-028 | SRC-HR-001 | BSD | - | Updated by | `Updatedby` | Person | No | — | `bsdUpdatedby` | Clearly Found |
| BSD-029 | SRC-HR-001 | BSD | - | Date (Updated) | `Updateddt` | Date | No | — | `bsdUpdateddt` | Clearly Found |
| BSD-030 | SRC-HR-001 | BSD | - | Status | `Status` | Choice | Inferred | Unknown | `bsdStatus` | Clearly Found |
| BSD-031 | SRC-HR-001 | BSD | - | Remarks (Status) | `StaRem` | Multiline | No | — | `bsdStaRem` | Clearly Found |
| BSD-032 | SRC-HR-001 | BSD | - | Created by | `DocAuthor` | Person | Unknown | Unknown | `bsdDocAuthor` | Clearly Found |
| BSD-033 | SRC-HR-001 | BSD | - | Created on | `CDate` | Date | Unknown | Unknown | `bsdCDate` | Clearly Found |
| BSD-034 | SRC-HR-001 | BSD | - | Current Status | `CurrentAction` | Choice | Unknown | Unknown | `bsdCurrentAction` | Clearly Found |
| BSD-035 | SRC-HR-001 | BSD | - | HR Section | `Editor1` | Person | Unknown | Unknown | `bsdEditor1` | Clearly Found |
| BSD-036 | SRC-HR-001 | BSD | - | HOD Section | `Editor2` | Person | Unknown | Unknown | `bsdEditor2` | Clearly Found |
| BSD-037 | SRC-HR-001 | BSD | - | HOD/HOS | `Editor3` | Person | Unknown | Unknown | `bsdEditor3` | Clearly Found |
| BSD-038 | SRC-HR-001 | BSD | - | HR Admin | `HRAdmin` | Person | Unknown | Unknown | `bsdHRAdmin` | Clearly Found |
| BSD-039 | SRC-HR-001 | BSD | - | Modification Date | `ModifiedDate` | Date | Unknown | Unknown | `bsdModifiedDate` | Clearly Found |
| CAND-HR-004-01 | SRC-HR-004 | CWR | Candidate extraction | Issue No | `IssueNo` | Number | Inferred | — | `cwrIssueNo` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-02 | SRC-HR-004 | CWR | Candidate extraction | To (HOD) | `SendTo` | Person | Inferred | — | `cwrSendTo` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-03 | SRC-HR-004 | CWR | Candidate extraction | Division Head | `DivHead` | Person | Inferred | — | `cwrDivHead` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-04 | SRC-HR-004 | CWR | Candidate extraction | From (Name) | `Name` | Person | Inferred | — | `cwrName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-05 | SRC-HR-004 | CWR | Candidate extraction | Type of Contract Workers | `Type` | Choice | Inferred | Unknown | `cwrType` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-06 | SRC-HR-004 | CWR | Candidate extraction | Category | `PermCategory` | Choice | Inferred | Unknown | `cwrPermCategory` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-07 | SRC-HR-004 | CWR | Candidate extraction | Site | `Site` | Text | Inferred | Unknown | `cwrSite` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-08 | SRC-HR-004 | CWR | Candidate extraction | No. of Workers | `NoWorkers` | Number | Inferred | — | `cwrNoWorkers` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-09 | SRC-HR-004 | CWR | Candidate extraction | Section | `Workstation` | Text | Inferred | — | `cwrWorkstation` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-10 | SRC-HR-004 | CWR | Candidate extraction | Job Description | `JD` | Multiline | Inferred | — | `cwrJD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-11 | SRC-HR-004 | CWR | Candidate extraction | Working Hour | `WorkingHour` | Text | Inferred | — | `cwrWorkingHour` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-12 | SRC-HR-004 | CWR | Candidate extraction | Date Required | `Period` | Date | Inferred | — | `cwrPeriod` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-13 | SRC-HR-004 | CWR | Candidate extraction | Current no. of workers | `CurrentNoWorkers` | Number | Inferred | — | `cwrCurrentNoWorkers` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-14 | SRC-HR-004 | CWR | Candidate extraction | Period 1 | `tPeriod_1_1 → fPeriod_1_1 (TotalDays_1_1)` | Date range + Number | Unknown | Unknown | `cwrTPeriod11FPeriod11TotalDays11` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-15 | SRC-HR-004 | CWR | Candidate extraction | Period 2 | `tPeriod_2_1 → fPeriod_2_1 (TotalDays_2_1)` | Date range + Number | Unknown | Unknown | `cwrTPeriod21FPeriod21TotalDays21` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-16 | SRC-HR-004 | CWR | Candidate extraction | Period 3 | `tPeriod_3_1 → fPeriod_3_1 (TotalDays_3_1)` | Date range + Number | Unknown | Unknown | `cwrTPeriod31FPeriod31TotalDays31` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-17 | SRC-HR-004 | CWR | Candidate extraction | Effective Date | `EffDate` | Date | Unknown | Unknown | `cwrEffDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-18 | SRC-HR-004 | CWR | Candidate extraction | Justification | `Justification` | Multiline | Unknown | Unknown | `cwrJustification` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-19 | SRC-HR-004 | CWR | Candidate extraction | Site (Shutdown) | `Site2` | Text | Unknown | Unknown | `cwrSite2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-20 | SRC-HR-004 | CWR | Candidate extraction | No. of Workers required | `NoWorkers2` | Number | Unknown | Unknown | `cwrNoWorkers2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-21 | SRC-HR-004 | CWR | Candidate extraction | Section | `Workstation2` | Text | Unknown | Unknown | `cwrWorkstation2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-22 | SRC-HR-004 | CWR | Candidate extraction | Job Description | `JD2` | Multiline | Unknown | Unknown | `cwrJD2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-23 | SRC-HR-004 | CWR | Candidate extraction | Period 1 | `tPeriod_1 → fPeriod_1 (TotalDays_1)` | Number/Text | Unknown | Unknown | `cwrTPeriod1FPeriod1TotalDays1` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-24 | SRC-HR-004 | CWR | Candidate extraction | Period 2 | `tPeriod_2 → fPeriod_2 (TotalDays_2)` | Number/Text | Unknown | Unknown | `cwrTPeriod2FPeriod2TotalDays2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-25 | SRC-HR-004 | CWR | Candidate extraction | Period 3 | `tPeriod_3 → fPeriod_3 (TotalDays_3)` | Number/Text | Unknown | Unknown | `cwrTPeriod3FPeriod3TotalDays3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-26 | SRC-HR-004 | CWR | Candidate extraction | Requested by | `DocAuthor` | Person | Unknown | Unknown | `cwrDocAuthor` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-27 | SRC-HR-004 | CWR | Candidate extraction | Designation | `Designation` | Text | Unknown | Unknown | `cwrDesignation` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-28 | SRC-HR-004 | CWR | Candidate extraction | Date | `DateIssued` | Date | Unknown | Unknown | `cwrDateIssued` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-29 | SRC-HR-004 | CWR | Candidate extraction | HOD Approved/Rejected | `HODApp` | Choice | Unknown | **Approved, Rejected** | `cwrHODApp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-30 | SRC-HR-004 | CWR | Candidate extraction | Name (HOD) | `HODName` | Person | Unknown | — | `cwrHODName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-31 | SRC-HR-004 | CWR | Candidate extraction | Date (HOD) | `HODDate` | Date | Unknown | — | `cwrHODDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-32 | SRC-HR-004 | CWR | Candidate extraction | Remark (HOD) | `HODRemark` | Multiline | Unknown | — | `cwrHODRemark` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-33 | SRC-HR-004 | CWR | Candidate extraction | DivHead Approved/Rejected | `HODApp3` | Choice | Unknown | **Approved, Rejected** | `cwrHODApp3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-34 | SRC-HR-004 | CWR | Candidate extraction | Name (DivHead) | `HODName3` | Person | Unknown | — | `cwrHODName3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-35 | SRC-HR-004 | CWR | Candidate extraction | Date (DivHead) | `HODDate3` | Date | Unknown | — | `cwrHODDate3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-36 | SRC-HR-004 | CWR | Candidate extraction | Remark (DivHead) | `HODRemark3` | Multiline | Unknown | — | `cwrHODRemark3` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-37 | SRC-HR-004 | CWR | Candidate extraction | HR Approved/Rejected | `HRApp` | Choice | Unknown | **Approved, Rejected** | `cwrHRApp` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-38 | SRC-HR-004 | CWR | Candidate extraction | Name (HR) | `HRName` | Person | Unknown | — | `cwrHRName` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-39 | SRC-HR-004 | CWR | Candidate extraction | Position (HR) | `HRPosition` | Text | Unknown | — | `cwrHRPosition` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-40 | SRC-HR-004 | CWR | Candidate extraction | Date (HR) | `HRDate` | Date | Unknown | — | `cwrHRDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-41 | SRC-HR-004 | CWR | Candidate extraction | Remark (HR) | `HRRemark` | Multiline | Unknown | — | `cwrHRRemark` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-42 | SRC-HR-004 | CWR | Candidate extraction | Requisition filled by | `Vendor` | Text | Unknown | Unknown | `cwrVendor` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-43 | SRC-HR-004 | CWR | Candidate extraction | Number of pax | `Pax` | Number | Unknown | Unknown | `cwrPax` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-44 | SRC-HR-004 | CWR | Candidate extraction | Required Due date | `DateHR` | Date | Unknown | Unknown | `cwrDateHR` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-45 | SRC-HR-004 | CWR | Candidate extraction | Request Status | `Status` | Choice | Unknown | Unknown | `cwrStatus` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-46 | SRC-HR-004 | CWR | Candidate extraction | Remarks/Attachment | `Remarks` | Multiline | Unknown | Unknown | `cwrRemarks` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-47 | SRC-HR-004 | CWR | Candidate extraction | Updated by | `UpdatedBy` | Person | Unknown | Unknown | `cwrUpdatedBy` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-48 | SRC-HR-004 | CWR | Candidate extraction | Designation (Update) | `UpdatedDesi` | Text | Unknown | Unknown | `cwrUpdatedDesi` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-49 | SRC-HR-004 | CWR | Candidate extraction | Date (Updated) | `UpdatedDate` | Date | Unknown | Unknown | `cwrUpdatedDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-50 | SRC-HR-004 | CWR | Candidate extraction | Acknowledge/Deny | `HODApp2` | Choice | Unknown | **Acknowledge, Deny** | `cwrHODApp2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-51 | SRC-HR-004 | CWR | Candidate extraction | Name (Requestor) | `HODName2` | Person | Unknown | — | `cwrHODName2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-52 | SRC-HR-004 | CWR | Candidate extraction | Date (Requestor) | `HODDate2` | Date | Unknown | — | `cwrHODDate2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-53 | SRC-HR-004 | CWR | Candidate extraction | Remark (Requestor) | `HODRemark2` | Multiline | Unknown | — | `cwrHODRemark2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-54 | SRC-HR-004 | CWR | Candidate extraction | Current Action | `CurrentAction` | Choice | Unknown | Unknown | `cwrCurrentAction` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-55 | SRC-HR-004 | CWR | Candidate extraction | Editor 1-5 | `Editor1-Editor5` | Person | Unknown | Unknown | `cwrEditor1Editor5` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-56 | SRC-HR-004 | CWR | Candidate extraction | HR - CC | `HR2` | Text | Unknown | Unknown | `cwrHR2` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-57 | SRC-HR-004 | CWR | Candidate extraction | Maintenance | `MTN` | Text | Unknown | Unknown | `cwrMTN` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-58 | SRC-HR-004 | CWR | Candidate extraction | HR HOD | `HRHOD` | Person | Unknown | Unknown | `cwrHRHOD` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-59 | SRC-HR-004 | CWR | Candidate extraction | INO | `INO` | Text | Unknown | Unknown | `cwrINO` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-60 | SRC-HR-004 | CWR | Candidate extraction | Reminder Date | `RemDate` | Date | Unknown | Unknown | `cwrRemDate` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-61 | SRC-HR-004 | CWR | Candidate extraction | Reminder Subject | `RemSubject` | Text | Unknown | Unknown | `cwrRemSubject` | Candidate promoted to requirements; verify caveats |
| CAND-HR-004-62 | SRC-HR-004 | CWR | Candidate extraction | Reminder CC | `RemCC` | Text | Unknown | Unknown | `cwrRemCC` | Candidate promoted to requirements; verify caveats |

## IT / IT - Access

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| EAF-001 | SRC-001 | EAF | Requestor | Company | `company` | Text | Inferred | Unknown | `eafCompany` | Clearly Found |
| EAF-002 | SRC-001 | EAF | Requestor | Requestor | `requestorName` | Person | Inferred | — | `eafRequestorName` | Clearly Found |
| EAF-003 | SRC-001 | EAF | Requestor | Date Submitted | `dateSubmitted` | Date | Inferred | — | `eafDateSubmitted` | Clearly Found |
| EAF-004 | SRC-001 | EAF | Requestor | Target User | `targetUser` | Person/Text | Inferred | — | `eafTargetUser` | Clearly Found |
| EAF-005 | SRC-001 | EAF | Access Details | Application | `application` | Text | Inferred | Unknown | `eafApplication` | Clearly Found |
| EAF-006 | SRC-001 | EAF | Access Details | System | `system` | Text | Inferred | Unknown | `eafSystem` | Clearly Found |
| EAF-007 | SRC-001 | EAF | Access Details | Client ID | `clientID` | Text | Inferred | — | `eafClientID` | Clearly Found |
| EAF-008 | SRC-001 | EAF | Access Details | User Group | `userGroup` | Text | Inferred | Unknown | `eafUserGroup` | Clearly Found |
| EAF-009 | SRC-001 | EAF | Access Details | Justification | `justification` | Multiline Text | Inferred | — | `eafJustification` | Clearly Found |
| EAF-010 | SRC-001 | EAF | Requestor | Dept Head | `deptHead` | Person | Inferred | — | `eafDeptHead` | Clearly Found |
| EAF-011 | SRC-001 | EAF | Requestor | Higher Approver (COO/Director) | `higherApprover` | Person | Inferred | — | `eafHigherApprover` | Clearly Found |
| EAF-012 | SRC-001 | EAF | Requestor | CC | `ccEmails` | Text | Optional (Inferred) | — | `eafCcEmails` | Clearly Found |
| EAF-013 | SRC-001 | EAF | HOD Acceptance | HOD Name | `hodName` | Person | Inferred | — | `eafHodName` | Clearly Found |
| EAF-014 | SRC-001 | EAF | HOD Acceptance | HOD Approval Date | `hodApprovalDate` | Date | Inferred | — | `eafHodApprovalDate` | Clearly Found |
| EAF-015 | SRC-001 | EAF | HOD Acceptance | HOD Comments | `hodComments` | Multiline Text | Optional (Inferred) | — | `eafHodComments` | Clearly Found |
| EAF-016 | SRC-001 | EAF | Director/COO | Director/COO Name | `directorName` | Person | Inferred | — | `eafDirectorName` | Clearly Found |
| EAF-017 | SRC-001 | EAF | Director/COO | Director/COO Approval Date | `directorApprovalDate` | Date | Inferred | — | `eafDirectorApprovalDate` | Clearly Found |
| EAF-018 | SRC-001 | EAF | Director/COO | Director/COO Comments | `directorComments` | Multiline Text | Optional (Inferred) | — | `eafDirectorComments` | Clearly Found |
| EAF-019 | SRC-001 | EAF | IT Manager | IT Manager Name | `itManagerName` | Person | Inferred | — | `eafItManagerName` | Clearly Found |
| EAF-020 | SRC-001 | EAF | IT Provisioning | Provisioning Details | `provisioningDetails` | Multiline Text | Optional (Inferred) | — | `eafProvisioningDetails` | Clearly Found |
| EAF-021 | SRC-001 | EAF | Config | Configuration Notes | `configNotes` | Multiline Text | Optional (Inferred) | — | `eafConfigNotes` | Inferred |

## IT / IT - Activity Logs

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| IAL1-001 | SRC-003 | IAL1 | Entry | Date | `activityDate` | Date | Inferred | — | `ial1ActivityDate` | Clearly Found |
| IAL1-002 | SRC-003 | IAL1 | Entry | Time | `activityTime` | Text | Inferred | — | `ial1ActivityTime` | Clearly Found |
| IAL1-003 | SRC-003 | IAL1 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | `ial1PerformedBy` | Clearly Found |
| IAL1-004 | SRC-003 | IAL1 | Entry | System / Server | `systemName` | Text | Inferred | — | `ial1SystemName` | Clearly Found |
| IAL1-005 | SRC-003 | IAL1 | Entry | Activity Type | `activityType` | Choice | Inferred | Unknown | `ial1ActivityType` | Clearly Found |
| IAL1-006 | SRC-003 | IAL1 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | `ial1ReferenceNo` | Inferred |
| IAL1-007 | SRC-003 | IAL1 | Details | Description | `description` | Multiline Text | Inferred | — | `ial1Description` | Clearly Found |
| IAL1-008 | SRC-003 | IAL1 | Details | Source of Data | `dataSource` | Text | Inferred | — | `ial1DataSource` | Clearly Found |
| IAL1-009 | SRC-003 | IAL1 | Details | Restoration Target | `restorationTarget` | Text | Inferred | — | `ial1RestorationTarget` | Clearly Found |
| IAL1-010 | SRC-003 | IAL1 | Details | Data Size | `dataSize` | Text | Optional (Inferred) | — | `ial1DataSize` | Inferred |
| IAL1-011 | SRC-003 | IAL1 | Details | Start Time | `startTime` | Text | Inferred | — | `ial1StartTime` | Clearly Found |
| IAL1-012 | SRC-003 | IAL1 | Details | End Time | `endTime` | Text | Inferred | — | `ial1EndTime` | Clearly Found |
| IAL1-013 | SRC-003 | IAL1 | Details | Outcome / Status | `outcome` | Choice | Inferred | Unknown | `ial1Outcome` | Clearly Found |
| IAL1-014 | SRC-003 | IAL1 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | `ial1ReviewedBy` | Clearly Found |
| IAL1-015 | SRC-003 | IAL1 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | `ial1ReviewDate` | Clearly Found |
| IAL1-016 | SRC-003 | IAL1 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | `ial1ReviewComments` | Clearly Found |
| IAL2-001 | SRC-004 | IAL2 | Entry | Date | `activityDate` | Date | Inferred | — | `ial2ActivityDate` | Inferred |
| IAL2-002 | SRC-004 | IAL2 | Entry | Time | `activityTime` | Text | Inferred | — | `ial2ActivityTime` | Inferred |
| IAL2-003 | SRC-004 | IAL2 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | `ial2PerformedBy` | Inferred |
| IAL2-004 | SRC-004 | IAL2 | Entry | Server / Hostname | `serverName` | Text | Inferred | — | `ial2ServerName` | Inferred |
| IAL2-005 | SRC-004 | IAL2 | Entry | Activity Type | `activityType` | Choice | Inferred | Unknown | `ial2ActivityType` | Inferred |
| IAL2-006 | SRC-004 | IAL2 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | `ial2ReferenceNo` | Inferred |
| IAL2-007 | SRC-004 | IAL2 | Details | Description / Reason | `description` | Multiline Text | Inferred | — | `ial2Description` | Inferred |
| IAL2-008 | SRC-004 | IAL2 | Details | Affected Systems | `affectedSystems` | Text | Inferred | — | `ial2AffectedSystems` | Inferred |
| IAL2-009 | SRC-004 | IAL2 | Details | Reboot Type | `rebootType` | Choice | Inferred | Unknown | `ial2RebootType` | Inferred |
| IAL2-010 | SRC-004 | IAL2 | Details | Start Time | `startTime` | Text | Inferred | — | `ial2StartTime` | Inferred |
| IAL2-011 | SRC-004 | IAL2 | Details | End Time | `endTime` | Text | Inferred | — | `ial2EndTime` | Inferred |
| IAL2-012 | SRC-004 | IAL2 | Details | Outcome / Status | `outcome` | Choice | Inferred | Unknown | `ial2Outcome` | Inferred |
| IAL2-013 | SRC-004 | IAL2 | Details | Downtime Duration | `downtimeDuration` | Text | Optional (Inferred) | — | `ial2DowntimeDuration` | Inferred |
| IAL2-014 | SRC-004 | IAL2 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | `ial2ReviewedBy` | Inferred |
| IAL2-015 | SRC-004 | IAL2 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | `ial2ReviewDate` | Inferred |
| IAL2-016 | SRC-004 | IAL2 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | `ial2ReviewComments` | Inferred |
| IAL3-001 | SRC-005 | IAL3 | Entry | Date | `activityDate` | Date | Inferred | — | `ial3ActivityDate` | Inferred |
| IAL3-002 | SRC-005 | IAL3 | Entry | Time | `activityTime` | Text | Inferred | — | `ial3ActivityTime` | Inferred |
| IAL3-003 | SRC-005 | IAL3 | Entry | Requestor / Reported By | `reportedBy` | Person | Inferred | — | `ial3ReportedBy` | Inferred |
| IAL3-004 | SRC-005 | IAL3 | Entry | Event Type | `eventType` | Choice | Inferred | Unknown | `ial3EventType` | Inferred |
| IAL3-005 | SRC-005 | IAL3 | Entry | System / Asset Affected | `systemAffected` | Text | Inferred | — | `ial3SystemAffected` | Inferred |
| IAL3-006 | SRC-005 | IAL3 | Entry | Reference No / Ticket No | `referenceNo` | Text | Optional (Inferred) | — | `ial3ReferenceNo` | Inferred |
| IAL3-007 | SRC-005 | IAL3 | Entry | Severity | `severity` | Choice | Inferred | Unknown | `ial3Severity` | Inferred |
| IAL3-008 | SRC-005 | IAL3 | Details | Description | `description` | Multiline Text | Inferred | — | `ial3Description` | Inferred |
| IAL3-009 | SRC-005 | IAL3 | Details | Impact Assessment | `impactAssessment` | Multiline Text | Optional (Inferred) | — | `ial3ImpactAssessment` | Inferred |
| IAL3-010 | SRC-005 | IAL3 | Details | Resolution / Action Taken | `resolution` | Multiline Text | Inferred | — | `ial3Resolution` | Inferred |
| IAL3-011 | SRC-005 | IAL3 | Details | Start Time | `startTime` | Text | Inferred | — | `ial3StartTime` | Inferred |
| IAL3-012 | SRC-005 | IAL3 | Details | End Time | `endTime` | Text | Inferred | — | `ial3EndTime` | Inferred |
| IAL3-013 | SRC-005 | IAL3 | Details | Outcome / Status | `outcome` | Choice | Inferred | Unknown | `ial3Outcome` | Inferred |
| IAL3-014 | SRC-005 | IAL3 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | `ial3ReviewedBy` | Inferred |
| IAL3-015 | SRC-005 | IAL3 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | `ial3ReviewDate` | Inferred |
| IAL3-016 | SRC-005 | IAL3 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | `ial3ReviewComments` | Inferred |
| IAL4-001 | SRC-006 | IAL4 | Entry | Date | `activityDate` | Date | Inferred | — | `ial4ActivityDate` | Inferred |
| IAL4-002 | SRC-006 | IAL4 | Entry | Time | `activityTime` | Text | Inferred | — | `ial4ActivityTime` | Inferred |
| IAL4-003 | SRC-006 | IAL4 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | `ial4PerformedBy` | Inferred |
| IAL4-004 | SRC-006 | IAL4 | Entry | Location / Rack | `location` | Text | Inferred | — | `ial4Location` | Inferred |
| IAL4-005 | SRC-006 | IAL4 | Entry | Activity Type | `activityType` | Choice | Inferred | Unknown | `ial4ActivityType` | Inferred |
| IAL4-006 | SRC-006 | IAL4 | Entry | Equipment / System | `equipment` | Text | Inferred | — | `ial4Equipment` | Inferred |
| IAL4-007 | SRC-006 | IAL4 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | `ial4ReferenceNo` | Inferred |
| IAL4-008 | SRC-006 | IAL4 | Details | Description | `description` | Multiline Text | Inferred | — | `ial4Description` | Inferred |
| IAL4-009 | SRC-006 | IAL4 | Details | Environmental Readings | `environmentalReadings` | Text | Optional (Inferred) | — | `ial4EnvironmentalReadings` | Inferred |
| IAL4-010 | SRC-006 | IAL4 | Details | Access Type | `accessType` | Choice | Inferred | Unknown | `ial4AccessType` | Inferred |
| IAL4-011 | SRC-006 | IAL4 | Details | Start Time | `startTime` | Text | Inferred | — | `ial4StartTime` | Inferred |
| IAL4-012 | SRC-006 | IAL4 | Details | End Time | `endTime` | Text | Inferred | — | `ial4EndTime` | Inferred |
| IAL4-013 | SRC-006 | IAL4 | Details | Outcome / Status | `outcome` | Choice | Inferred | Unknown | `ial4Outcome` | Inferred |
| IAL4-014 | SRC-006 | IAL4 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | `ial4ReviewedBy` | Inferred |
| IAL4-015 | SRC-006 | IAL4 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | `ial4ReviewDate` | Inferred |
| IAL4-016 | SRC-006 | IAL4 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | `ial4ReviewComments` | Inferred |

## IT / IT - Asset Inventory

| Field ID | Source ID | Form | Section | Label | Source Field | Type | Required | Choices | SharePoint Column | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| HI-001 | SRC-002 | HI | General | Asset Tag / ID | `assetTag` | Text | Inferred | — | `hiAssetTag` | Clearly Found |
| HI-002 | SRC-002 | HI | General | Asset Type | `assetType` | Choice | Inferred | Unknown | `hiAssetType` | Clearly Found |
| HI-003 | SRC-002 | HI | General | Brand / Model | `brandModel` | Text | Inferred | — | `hiBrandModel` | Clearly Found |
| HI-004 | SRC-002 | HI | General | Serial Number | `serialNumber` | Text | Inferred | — | `hiSerialNumber` | Clearly Found |
| HI-005 | SRC-002 | HI | General | Assigned User | `assignedUser` | Person | Inferred | — | `hiAssignedUser` | Clearly Found |
| HI-006 | SRC-002 | HI | General | Department | `department` | Text | Inferred | Unknown | `hiDepartment` | Clearly Found |
| HI-007 | SRC-002 | HI | General | Location | `location` | Text | Inferred | Unknown | `hiLocation` | Clearly Found |
| HI-008 | SRC-002 | HI | General | Purchase Date | `purchaseDate` | Date | Optional (Inferred) | — | `hiPurchaseDate` | Clearly Found |
| HI-009 | SRC-002 | HI | General | Warranty Expiry | `warrantyExpiry` | Date | Optional (Inferred) | — | `hiWarrantyExpiry` | Clearly Found |
| HI-010 | SRC-002 | HI | General | Status | `assetStatus` | Choice | Inferred | Unknown | `hiAssetStatus` | Clearly Found |
| HI-011 | SRC-002 | HI | General | PO Number | `poNumber` | Text | Optional (Inferred) | — | `hiPoNumber` | Inferred |
| HI-012 | SRC-002 | HI | Hardware Config | CPU | `cpu` | Text | Inferred | — | `hiCpu` | Clearly Found |
| HI-013 | SRC-002 | HI | Hardware Config | RAM | `ram` | Text | Inferred | — | `hiRam` | Clearly Found |
| HI-014 | SRC-002 | HI | Hardware Config | HDD / Storage | `hddStorage` | Text | Inferred | — | `hiHddStorage` | Clearly Found |
| HI-015 | SRC-002 | HI | Hardware Config | Monitor | `monitor` | Text | Optional (Inferred) | — | `hiMonitor` | Clearly Found |
| HI-016 | SRC-002 | HI | Hardware Config | IP Address | `ipAddress` | Text | Optional (Inferred) | — | `hiIpAddress` | Clearly Found |
| HI-017 | SRC-002 | HI | Hardware Config | MAC Address | `macAddress` | Text | Optional (Inferred) | — | `hiMacAddress` | Clearly Found |
| HI-018 | SRC-002 | HI | Hardware Config | Operating System | `operatingSystem` | Text | Inferred | Unknown | `hiOperatingSystem` | Clearly Found |
| HI-019 | SRC-002 | HI | Hardware Config | OS Version | `osVersion` | Text | Optional (Inferred) | — | `hiOsVersion` | Inferred |
| HI-020 | SRC-002 | HI | Hardware Config | Hostname | `hostname` | Text | Inferred | — | `hiHostname` | Clearly Found |
| HI-021 | SRC-002 | HI | Software | Software Name | `softwareName` | Text | Optional (Inferred) | — | `hiSoftwareName` | Clearly Found |
| HI-022 | SRC-002 | HI | Software | Software Version | `softwareVersion` | Text | Optional (Inferred) | — | `hiSoftwareVersion` | Clearly Found |
| HI-023 | SRC-002 | HI | Software | License Key | `licenseKey` | Text | Optional (Inferred) | — | `hiLicenseKey` | Inferred |
| HI-024 | SRC-002 | HI | Accounts | Account Type | `accountType` | Choice | Optional (Inferred) | Unknown | `hiAccountType` | Clearly Found |
| HI-025 | SRC-002 | HI | Accounts | Account Username | `accountUsername` | Text | Optional (Inferred) | — | `hiAccountUsername` | Clearly Found |
| HI-026 | SRC-002 | HI | Notes | Remarks | `remarks` | Multiline Text | No | — | `hiRemarks` | Clearly Found |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.
- Original source PDFs and XML files remain reference-only and were not modified.
