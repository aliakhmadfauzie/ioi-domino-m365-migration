# Role & Section Rule Register

> Role and section visibility/editability register for every form already extracted from PDF.
> Generated: 2026-06-02 21:59
> Source: promoted PDF requirement files under `source_analysis/02_extracted_requirements/`.

## Summary

| Department | Module | Forms | Rows |
|---|---|---:|---:|
| FIN | Finance - Capital Approval | 1 | 10 |
| FIN | Finance - Credit Management | 3 | 26 |
| FIN | Finance - Expenditure Approval | 1 | 12 |
| FIN | Finance - Service Entry | 1 | 4 |
| HR | HR - Applications Support | 1 | 7 |
| HR | HR - Attendance | 1 | 10 |
| HR | HR - Cafeteria | 1 | 3 |
| HR | HR - Contract | 1 | 9 |
| HR | HR - Duty Roster | 1 | 6 |
| HR | HR - Employee Data | 1 | 7 |
| HR | HR - Employee Health | 1 | 6 |
| HR | HR - Exit | 1 | 9 |
| HR | HR - Foreign Worker | 2 | 15 |
| HR | HR - Gift/Donation/Sponsorship | 1 | 4 |
| HR | HR - Information | 1 | 5 |
| HR | HR - Survey | 1 | 5 |
| HR | HR - Workforce | 2 | 15 |
| IT | IT - Access | 1 | 7 |
| IT | IT - Activity Logs | 4 | 12 |
| IT | IT - Asset Inventory | 1 | 5 |

## FIN / Finance - Capital Approval

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-CAR-01 | SRC-FIN-001 | CAR | Approval Authority Matrix | Governance/reference | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Contract amount thresholds, recommended-by and approved-by authority | Inferred |
| RSR-FIN-CAR-02 | SRC-FIN-001 | CAR | Finance Use Only | Finance fields | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SAPIONo, SAPAssNo | Inferred |
| RSR-FIN-CAR-03 | SRC-FIN-001 | CAR | Initiation | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, Department, ProjectName, Objective, StartDate, CompDate, AssetClass, CapitalGoodsCat, sustainability/energy fields, Purpose, ExAssetNo, ExecType | Inferred |
| RSR-FIN-CAR-04 | SRC-FIN-001 | CAR | Appraisal and Budget | Financial analysis | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EcoLife, Payback, IRR, NPV, isBudgeted, BudgetAmt, BudgetNo, investment rows, TtlInvAmt, Justification | Inferred |
| RSR-FIN-CAR-05 | SRC-FIN-001 | CAR | Request and Finance Verification | Submit/review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HOD, HOD2, Preparedby, Prepareddate, Preparedpost, VerName, VerDate, VerRem | Inferred |
| RSR-FIN-CAR-06 | SRC-FIN-001 | CAR | Main Approval Chain | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HOD reviews, recommender, SGM Operations, Director approval | Inferred |
| RSR-FIN-CAR-07 | SRC-FIN-001 | CAR | Budget Exceeded / Additional CAR | Conditional workflow | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Att, Rem, submittedby/date, NotifiedBy/date, AddCARAmt | Inferred |
| RSR-FIN-CAR-08 | SRC-FIN-001 | CAR | CAR Completion | Completion workflow | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FinalCompDate, Location, CARCompDesc, Outcome, ActAnnualSaving, OldAsset, PO rows, completion approvals, savings rows | Inferred |
| RSR-FIN-CAR-09 | SRC-FIN-001 | CAR | Cancellation | Cancellation | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CanName, CanDate, CanReason | Inferred |
| RSR-FIN-CAR-10 | SRC-FIN-001 | CAR | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, FIN groups, department HODs, ED/SGM, editor stages, approval flags, mailing lists, reminders | Inferred |

## FIN / Finance - Credit Management

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-CMF_A-01 | SRC-FIN-002 | CMF_A | Initiation | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, Category, CAFNo, PrevCAFNo, DateInitiated, CompanyName, Status, Risk, Reasons, MKTExec, CreditLimit, Days, RevCreditLimit, CreditInsRef, Limit, Attachment, Remark | Inferred |
| RSR-FIN-CMF_A-02 | SRC-FIN-002 | CMF_A | GM Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | GMName, GMDate, GMRem, App1 | Inferred |
| RSR-FIN-CMF_A-03 | SRC-FIN-002 | CMF_A | Finance Review | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_A-04 | SRC-FIN-002 | CMF_A | Senior Financial Controller Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FCName, FCDate, FCRem, App3 | Inferred |
| RSR-FIN-CMF_A-05 | SRC-FIN-002 | CMF_A | SGM / ED Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | COOName, COODate, COORem, App4, EDName, EDDate, EDRem, App5 | Inferred |
| RSR-FIN-CMF_A-06 | SRC-FIN-002 | CMF_A | Approved Limit / Rejection | Decision | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | AppCreditLimit, Days2, Denial | Inferred |
| RSR-FIN-CMF_A-07 | SRC-FIN-002 | CMF_A | Finance Acknowledgement | Acknowledgement | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName2, FMDate2, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_A-08 | SRC-FIN-002 | CMF_A | Finance Follow-Up Cancellation | Cancellation | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CanName, CanDate, CanRem, CanAtt | Inferred |
| RSR-FIN-CMF_A-09 | SRC-FIN-002 | CMF_A | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, COO/ED/FIN/Marketing routing, FLimit, FLimit2, editors, MailList, INO, RemDate | Inferred |
| RSR-FIN-CMF_B-01 | SRC-FIN-003 | CMF_B | Initiation | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, Category, CAFNo, qty, DateInitiated, CompanyName, MKTExec, AppCreditLimit_1, TemCreditLimit, TotCreditLimit, PaymentTerms, TotRec, OpenDelCredit, SalesVal, CreditInsRef, Limit, Reason, MKTHOD, reqby, reqdate | Inferred |
| RSR-FIN-CMF_B-02 | SRC-FIN-003 | CMF_B | Marketing Manager Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | MKTName, MKTDate, MKTRem, App1 | Inferred |
| RSR-FIN-CMF_B-03 | SRC-FIN-003 | CMF_B | GM Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | GMName, GMDate, GMRem, App1_1 | Inferred |
| RSR-FIN-CMF_B-04 | SRC-FIN-003 | CMF_B | Finance Review | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_B-05 | SRC-FIN-003 | CMF_B | ED Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EDName, EDDate, EDRem, App3 | Inferred |
| RSR-FIN-CMF_B-06 | SRC-FIN-003 | CMF_B | Approved Limit / Rejection | Decision | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | AppCreditLimit, Denial | Inferred |
| RSR-FIN-CMF_B-07 | SRC-FIN-003 | CMF_B | Finance Acknowledgement | Acknowledgement | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName2, FMDate2, ExpiryDate, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_B-08 | SRC-FIN-003 | CMF_B | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, Marketing routing, ED, IT, FIN, FLimit, editors, MailList, INO, RemDate | Inferred |
| RSR-FIN-CMF_C-01 | SRC-FIN-004 | CMF_C | Initiation | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CAFNo, DateReview, Company, Category, MKTExec, MKTHOD, reqby, reqdate | Inferred |
| RSR-FIN-CMF_C-02 | SRC-FIN-004 | CMF_C | Customer Credit Review Table | Repeating table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | C_1..C_50, S_1..S_50, A_1..A_50, H_1..H_50, N_1..N_50, F_1..F_50, M_1..M_50 | Inferred |
| RSR-FIN-CMF_C-03 | SRC-FIN-004 | CMF_C | Attachment / Notes | Supporting detail | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Attachment; Active/Inactive and late-payment definitions | Inferred |
| RSR-FIN-CMF_C-04 | SRC-FIN-004 | CMF_C | Marketing Manager Endorsement | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | MKTName, MKTDate, MKTPost, MKTRem, App1 | Inferred |
| RSR-FIN-CMF_C-05 | SRC-FIN-004 | CMF_C | GM / Section Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SectionTitle, GMName, GMDate, GMRem, App1_1 | Inferred |
| RSR-FIN-CMF_C-06 | SRC-FIN-004 | CMF_C | Finance Review | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_C-07 | SRC-FIN-004 | CMF_C | ED Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SectionTitle_1_1, EDName, EDDate, EDRem, App3 | Inferred |
| RSR-FIN-CMF_C-08 | SRC-FIN-004 | CMF_C | Finance Acknowledgement | Acknowledgement | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FMName2, FMDate2, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_C-09 | SRC-FIN-004 | CMF_C | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, MKTFA, MKTFE, MKTSN, MKT, ED, IT, FIN, editors, MailList, Year-INO, RemDate | Inferred |

## FIN / Finance - Expenditure Approval

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-EARF-01 | SRC-FIN-005 | EARF | Finance / Initiation | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SAPIONo, Company, Department, AssetClass, Purpose, ExAssetNo, ExecType | Inferred |
| RSR-FIN-EARF-02 | SRC-FIN-005 | EARF | Asset Detail Table | Fixed/repeating rows | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Inv_1..Inv_5, FW_1..FW_5, UL_1..UL_5, InvAmt_1..InvAmt_5, UP_1..UP_5, SAPAssNo_1..SAPAssNo_5 | Inferred |
| RSR-FIN-EARF-03 | SRC-FIN-005 | EARF | Justification / Attachment | Supporting details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | TtlInvAmt, Justification, Attachment | Inferred |
| RSR-FIN-EARF-04 | SRC-FIN-005 | EARF | Routing / Requestor | People/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HOD, HOD2, CC2, Preparedby, Prepareddate, Preparedpost | Inferred |
| RSR-FIN-EARF-05 | SRC-FIN-005 | EARF | Finance Verification | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | VerName, VerDate, VerRem | Inferred |
| RSR-FIN-EARF-06 | SRC-FIN-005 | EARF | Department Head Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | hodname, hoddate, hodpost, hodrem, App1 | Inferred |
| RSR-FIN-EARF-07 | SRC-FIN-005 | EARF | Reviewed By | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CC, Reviewedby, Revieweddate, Reviewedpost, Reviewedrem, App2 | Inferred |
| RSR-FIN-EARF-08 | SRC-FIN-005 | EARF | Division Head Approval | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | hodname2, hoddate2, hodpost2, hodrem2, App3 | Inferred |
| RSR-FIN-EARF-09 | SRC-FIN-005 | EARF | Notification / Completion | Completion | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | NotifiedBy, NotifiedDate, CompDate, OldAsset, oldAssetRem | Inferred |
| RSR-FIN-EARF-10 | SRC-FIN-005 | EARF | SAP PR Rows | Fixed/repeating rows | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | PODt_1..PODt_5, PONo_1..PONo_5 | Inferred |
| RSR-FIN-EARF-11 | SRC-FIN-005 | EARF | Cancellation | Cancellation | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CanName, CanDate, CanReason | Inferred |
| RSR-FIN-EARF-12 | SRC-FIN-005 | EARF | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, IT, FINA, FIN1, FIN3, FIN, FINAdmin, ITHOD, ADM, MTN, ADM_CC, CC3, DH, Recommender, Servers, Readers, editors, MailingList, RemDate | Inferred |

## FIN / Finance - Service Entry

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-RSES-01 | SRC-FIN-006 | RSES | Initiator Section | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, Requestor, Approver, Dept, ExtNo, Site, SESNo, PO, SESAppDate, Justification, ReqName, ReqDate | Inferred |
| RSR-FIN-RSES-02 | SRC-FIN-006 | RSES | Approver Acceptance | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | AppName, AppDate, AppRem, App | Inferred |
| RSR-FIN-RSES-03 | SRC-FIN-006 | RSES | Finance Acceptance | Completion | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FINName, FINDate, FINRem, App2 | Inferred |
| RSR-FIN-RSES-04 | SRC-FIN-006 | RSES | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, IT, Editor1, Editor2, Editor3, FIN | Inferred |

## HR / HR - Applications Support

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-HRAPR-01 | SRC-HR-015 | HRAPR | Header / Routing | Case details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DateCreated, DisplayCaseNo, SendTo | Inferred |
| RSR-HR-HRAPR-02 | SRC-HR-015 | HRAPR | Requestor's Section | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | companyname, ReportedBy, Dept, EmpNo, Section, ExtNo, System, Module, Module2, ProblemDesc, Attach, CC | Inferred |
| RSR-HR-HRAPR-03 | SRC-HR-015 | HRAPR | GHR/ISG Action | Action/update | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | ISGName, Solution, CaseStatus, StartDate, DateClosed, ISGRemarks, Attachment2 | Inferred |
| RSR-HR-HRAPR-04 | SRC-HR-015 | HRAPR | Rejected | Rejection | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | ISGName_1, CaseStatus_1, DateReject, ISRemarks | Inferred |
| RSR-HR-HRAPR-05 | SRC-HR-015 | HRAPR | Requestor's Acceptance | Acceptance | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Status, DateAccept, Comment | Inferred |
| RSR-HR-HRAPR-06 | SRC-HR-015 | HRAPR | KIV/Archived | Archive | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | KIVBy, KIVStatus, KIVDate | Inferred |
| RSR-HR-HRAPR-07 | SRC-HR-015 | HRAPR | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CurrentAction, Requestor, AuthorsList, ISG, PIC, GHR, GHR2, HRHOD, AEditor1-3, MailingList, MailList, AutoClosedDate, RemDate, audit fields | Inferred |

## HR / HR - Attendance

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-AWHR-01 | SRC-HR-002 | AWHR | Requestor Section | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, EmpCategory, Section, Department, HOS, HOD, CC, Attachment | Inferred |
| RSR-HR-AWHR-02 | SRC-HR-002 | AWHR | Exceeded Category Code | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | E1-E4 checkboxes | Inferred |
| RSR-HR-AWHR-03 | SRC-HR-002 | AWHR | Rostered Shift Table | Reference | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Shift ID, Shift Details (predefined options) | Inferred |
| RSR-HR-AWHR-04 | SRC-HR-002 | AWHR | Working Hours Table | Line Items (Child List Candidate) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | 15 rows: EmpNo_N, Name_N, Category, Date From/To, Day Type, Shift, Add Hours, Total Hours | Inferred |
| RSR-HR-AWHR-05 | SRC-HR-002 | AWHR | Head of Section Approval | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Approve/Reject, HOSName, HOSDate, HOSRem, HOSAtt, HOSApp | Inferred |
| RSR-HR-AWHR-06 | SRC-HR-002 | AWHR | Head of Department Approval | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Approve/Reject, HODName, HODDate, HODRem, HODAtt, HODApp | Inferred |
| RSR-HR-AWHR-07 | SRC-HR-002 | AWHR | HR Use (Processing) | Admin/Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Accept/Deny, HRCom, HRName, HRDate, HRAtt, HRApp | Inferred |
| RSR-HR-AWHR-08 | SRC-HR-002 | AWHR | Withdrawn by Requestor | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | WDBy, WDDate, WDReason | Inferred |
| RSR-HR-AWHR-09 | SRC-HR-002 | AWHR | History Log | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HistoryLog | Inferred |
| RSR-HR-AWHR-10 | SRC-HR-002 | AWHR | Hidden Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA (CurrentAction), Editor1-5, IT, COO, HR_1-3, reference lists | Inferred |

## HR / HR - Cafeteria

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-CIR-01 | SRC-HR-003 | CIR | Initiator Section | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Site, TeamMembers, Inspector, InsDate, InsTime, SubmittedBy, SubmittedDate | Inferred |
| RSR-HR-CIR-02 | SRC-HR-003 | CIR | Corrective Action Review | Review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | ReviewedBy, ReviewedDate, Remarks, Status | Inferred |
| RSR-HR-CIR-03 | SRC-HR-003 | CIR | Hidden Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DocAuthor, CDate, CurrentAction, Editor1, Editor2, Editors, INO, IT, ACMComm, ECMComm | Inferred |

## HR / HR - Contract

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-FTCR-01 | SRC-HR-010 | FTCR | Employee Details | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EmpName, EmpNo, DOB, EmpAge, EmpPost, Dept, JoinDate, RetDate, DivHead, Attachment | Inferred |
| RSR-HR-FTCR-02 | SRC-HR-010 | FTCR | Justification | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Justification text | Inferred |
| RSR-HR-FTCR-03 | SRC-HR-010 | FTCR | Submitted by Department/Section Head | Submission | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SubBy, SubDesg, SubDate | Inferred |
| RSR-HR-FTCR-04 | SRC-HR-010 | FTCR | Division/Department Recommendation | Approval/recommendation | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CPeriod, Others, DivHeadJust, InSuccess, Ext, successor details, training fields | Inferred |
| RSR-HR-FTCR-05 | SRC-HR-010 | FTCR | Endorsement | Approval/recommendation | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EndBy, EndDesg, EndDate | Inferred |
| RSR-HR-FTCR-06 | SRC-HR-010 | FTCR | Employee Background History | Fixed table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Year_N, AprRate_N, DisRec_N, MC_N, HL_N, A_N, L_N, NPL_N, MedEx_N | Inferred |
| RSR-HR-FTCR-07 | SRC-HR-010 | FTCR | Approving Authority | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | AppHR, AppCOO, AppED with dates and remarks | Inferred |
| RSR-HR-FTCR-08 | SRC-HR-010 | FTCR | HR Section | HR update/status | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CaseStatus, AppFor, SpecifyOthers, NotHOD, Remarks2 | Inferred |
| RSR-HR-FTCR-09 | SRC-HR-010 | FTCR | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, Editor1-Editor7, ED, SGM, HR_1, HR_2, HR, HRM, IT, Servers, Readers | Inferred |

## HR / HR - Duty Roster

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-DRD-01 | SRC-HR-005 | DRD | SECTION A — Header | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Comp, Category, Dept, Section, HOS, HOD, CC, Month, Year, Attch, Amend, Changes, EmpName | Inferred |
| RSR-HR-DRD-02 | SRC-HR-005 | DRD | Shift Code Reference | Reference | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | 10 predefined shift codes with hours | Inferred |
| RSR-HR-DRD-03 | SRC-HR-005 | DRD | HOS APPROVAL | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HOSName, HOSDate, HOSRemark | Inferred |
| RSR-HR-DRD-04 | SRC-HR-005 | DRD | HOD APPROVAL | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HODName, HODDate, HODRemark | Inferred |
| RSR-HR-DRD-05 | SRC-HR-005 | DRD | FOR HR Use | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HRName, HRDate | Inferred |
| RSR-HR-DRD-06 | SRC-HR-005 | DRD | Hidden Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, Editor1-4, HOSApp, HODApp, HRApp | Inferred |

## HR / HR - Employee Data

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EPDU-01 | SRC-HR-007 | EPDU | Personal Details | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EmpNo, Company, EmpName, NRIC_O, NRIC_N, Marital, Disabilities, addresses, phone, EPF, SOCSO, ITAX | Inferred |
| RSR-HR-EPDU-02 | SRC-HR-007 | EPDU | Employee Education Background | Repeating table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | InsName_N, FY_N, TY_N, Standard_N, Field_N, Place_N, Grd_N | Inferred |
| RSR-HR-EPDU-03 | SRC-HR-007 | EPDU | Children Details | Repeating table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | N_N, G_N, S_N, D_N, B_N, Ins_N, Q_N, Ds_N, TR_N | Inferred |
| RSR-HR-EPDU-04 | SRC-HR-007 | EPDU | Family Details | Repeating table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FDN_N, FDR_N, R_N | Inferred |
| RSR-HR-EPDU-05 | SRC-HR-007 | EPDU | Spouse Details | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SpName, SpNRIC_N, SpWork, SpOccupation, SpComp, TelNo | Inferred |
| RSR-HR-EPDU-06 | SRC-HR-007 | EPDU | Submission / HR Review | Submitter + HR review | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Submittedby, Submittedon, HRAction, Acceptedby, Acceptedon | Inferred |
| RSR-HR-EPDU-07 | SRC-HR-007 | EPDU | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DocAuthor, CDate, ModiDate, IT, HR_1, HR_2, HR_3, HR, HRHOD, Servers, Readers | Inferred |

## HR / HR - Employee Health

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EPHR-01 | SRC-HR-008 | EPHR | Employee Health Header | Requester/HR medical record | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FullName, IC, DOB, Gender, HP, Company, Dept | Inferred |
| RSR-HR-EPHR-02 | SRC-HR-008 | EPHR | Measurements | Medical record | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Height, Weight, BMI, Blood Pressure, Pulse, Visual, Color Vision | Inferred |
| RSR-HR-EPHR-03 | SRC-HR-008 | EPHR | Medical History | Repeating table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | D_N, S_N, R_N rows for condition/date/since/remark pattern | Inferred |
| RSR-HR-EPHR-04 | SRC-HR-008 | EPHR | Follow-Up | Medical record | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Followup, Followup2, Location, LocRem | Inferred |
| RSR-HR-EPHR-05 | SRC-HR-008 | EPHR | Admission Record | Medical record | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | AdmDate, Diagnosis, Discharge, Attachment, Attachment2 | Inferred |
| RSR-HR-EPHR-06 | SRC-HR-008 | EPHR | Audit | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DocAuthor, CDate | Inferred |

## HR / HR - Exit

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EEN-01 | SRC-HR-006 | EEN | HR Section — Employee Details | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-02 | SRC-HR-006 | EEN | Deactivation Dates | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-03 | SRC-HR-006 | EEN | APPROVE REJECT — ED | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-04 | SRC-HR-006 | EEN | HEAD OF DEPARTMENT / DIVISION APPROVAL | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-05 | SRC-HR-006 | EEN | EXIT INTERVIEW (5 questions) | Information | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-06 | SRC-HR-006 | EEN | ACTUAL LAST WORKING DAY — Notify IT | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-07 | SRC-HR-006 | EEN | HUMAN RESOURCES USE — Returned Items | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-08 | SRC-HR-006 | EEN | Withdraw Section | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-EEN-09 | SRC-HR-006 | EEN | Hidden/System Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |

## HR / HR - Foreign Worker

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-FWWPD-01 | SRC-HR-011 | FWWPD | Section A - General Information | Record details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Company, Status, Reason, Remark, COMemo, Name, EmpNo, Department, Hostel, DOB, DOC, passport fields, nationality, contract period, permit fields, WorkerCode, SocsoNo | Inferred |
| RSR-HR-FWWPD-02 | SRC-HR-011 | FWWPD | Section B - Hospitalization & Surgical Scheme | Fixed table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Y_N, PN_N, SN_N, P_N, F_N, T_N, Att_N, D_N | Inferred |
| RSR-HR-FWWPD-03 | SRC-HR-011 | FWWPD | Section C - FOMEMA Status | Fixed table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DY_N, C_N, DC_N, FR_N, FRmks_N, AttC_N, DD_N | Inferred |
| RSR-HR-FWWPD-04 | SRC-HR-011 | FWWPD | Section D - MYEG Process | Fixed table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | EY_N, DA_N, EY_N_1, ST_N, ECC_N, DS_N_1, S_N, DS_N | Inferred |
| RSR-HR-FWWPD-05 | SRC-HR-011 | FWWPD | Section E - Foreign Employment Contract | Fixed table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | FY_N, CPF_N, CPT_N, PB_N, FDS_N | Inferred |
| RSR-HR-FWWPD-06 | SRC-HR-011 | FWWPD | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CurrentAction, IT, HR, HRHOD, PdgEmpCon, HRList, EditorsE | Inferred |
| RSR-HR-FWWPE-01 | SRC-HR-012 | FWWPE | Section A - Issued by HR Personnel | Request/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SendTo, HOS, HOD, CC, Company, Name, EmpNo, PassportNo, Department, Section, WPExpDate, DateF, DateT, Year, DocAuthor, DateIssued | Inferred |
| RSR-HR-FWWPE-02 | SRC-HR-012 | FWWPE | Section B - Reply by Superior | Reply/action | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Status, Reason, Departure, attachment, ReplyRemark, Position, ReplyName, ReplyDate | Inferred |
| RSR-HR-FWWPE-03 | SRC-HR-012 | FWWPE | Section C - Accepted by HOS | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HOSStatus, HOSName, HOSDate, HOSRemark | Inferred |
| RSR-HR-FWWPE-04 | SRC-HR-012 | FWWPE | Section D - Endorsed by HOD | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | ContStatus, HODStatus, HODName, HODDate, HODRemark | Inferred |
| RSR-HR-FWWPE-05 | SRC-HR-012 | FWWPE | Section E - Approved by HR Department | Approval | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HRHODStatus, HRHODName, HRHODDate, HRHODRemark | Inferred |
| RSR-HR-FWWPE-06 | SRC-HR-012 | FWWPE | Section F - Flight & Transportation | Completion | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DepartDate, DepartTime, Att, Att2, Doneby, Donedate | Inferred |
| RSR-HR-FWWPE-07 | SRC-HR-012 | FWWPE | Section G - Income Tax Declaration | Completion | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SubDate, Remarks, Doneby2, Donedate2 | Inferred |
| RSR-HR-FWWPE-08 | SRC-HR-012 | FWWPE | Withdrawn | Withdrawal | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | WDDate, WDBy, WDRem | Inferred |
| RSR-HR-FWWPE-09 | SRC-HR-012 | FWWPE | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CurrentAction, Editor1-Editor8, IT, HR, PIC1, PIC2, HRHOD, ToList, CCList, INO | Inferred |

## HR / HR - Gift/Donation/Sponsorship

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-GDSN-01 | SRC-HR-013 | GDSN | Part A - Initiator Section | Request details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | ProjectCode, ReqType, company, Recipient, Name, Address, SAP_ID, Requestor, HOD, Department, Type, Purpose, otherPurpose, IsBenefit, benefitText, IsLogo, ItemDetail, GiftValue, DateRec, Quantity, Price, Total, IsPO, PoNo | Inferred |
| RSR-HR-GDSN-02 | SRC-HR-013 | GDSN | Submitter | Submission | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Notified, position, reportedDate | Inferred |
| RSR-HR-GDSN-03 | SRC-HR-013 | GDSN | Part B - HOD Section | Endorsement | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HODName, HODPost, HODDate, App, SendTo | Inferred |
| RSR-HR-GDSN-04 | SRC-HR-013 | GDSN | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, Editor1, Editor2, ED, SGM, HR, FIN, PUR, IsPUR, MKT, IT, INO, MailList, Readers | Inferred |

## HR / HR - Information

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-HEALTHINFO-01 | SRC-HR-014 | HEALTHINFO | Information Header | Notice details | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Title, Category, Send, Subject | Inferred |
| RSR-HR-HEALTHINFO-02 | SRC-HR-014 | HEALTHINFO | Information Body | Content | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Body, Att, Ext | Inferred |
| RSR-HR-HEALTHINFO-03 | SRC-HR-014 | HEALTHINFO | Status Updates | Tracking | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Update, Status | Inferred |
| RSR-HR-HEALTHINFO-04 | SRC-HR-014 | HEALTHINFO | View Details | Tracking | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Viewed, CtrLst | Inferred |
| RSR-HR-HEALTHINFO-05 | SRC-HR-014 | HEALTHINFO | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Author, DateSent, Lock, Lock2, CurrentAction, ISADMIN | Inferred |

## HR / HR - Survey

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-ESF-01 | SRC-HR-009 | ESF | Survey Instructions and Rating Legend | Reference | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Scale 1-10; Poor, Below Average, Above Average, Good, Excellent | Inferred |
| RSR-HR-ESF-02 | SRC-HR-009 | ESF | Motivation Factor Questions | Repeating survey table | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Question text, Rating, Comment, group/category code | Inferred |
| RSR-HR-ESF-03 | SRC-HR-009 | ESF | Respondent Summary | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Service, Age, Category, Suggestion, DateSubmitted | Inferred |
| RSR-HR-ESF-04 | SRC-HR-009 | ESF | Hidden Fields | System/routing | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | CA, HR, IT, Editor1, Servers, Readers | Inferred |
| RSR-HR-ESF-05 | SRC-HR-009 | ESF | Aggregated Survey Fields | System/summary | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Qs, Cs, Gs-G_16, TotalRating | Inferred |

## HR / HR - Workforce

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-BSD-01 | SRC-HR-001 | BSD | SECTION A — PERSON IN CHARGE | Requester (HOD/HOS) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Division, Dept, Section, PIC, EmpNo, Position, Responsibility, HOD | Inferred |
| RSR-HR-BSD-02 | SRC-HR-001 | BSD | SECTION B — BACKUP STAFF | Repeating (Child List Candidate) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | PIC_1-3, Position_1-3, Responsibility_1-3 | Inferred |
| RSR-HR-BSD-03 | SRC-HR-001 | BSD | SECTION C — NOMINATED BY HOD/HOS | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | SubmittedBy, SubmitDate, Remark | Inferred |
| RSR-HR-BSD-04 | SRC-HR-001 | BSD | SECTION D — APPROVED BY HEAD OF DIVISION | Approver | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | HODName, HODPost, HODDate, HODRemarks, HODApp | Inferred |
| RSR-HR-BSD-05 | SRC-HR-001 | BSD | Admin/Updates | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | Revision, Updatedby, Updateddt, Status, StaRem | Inferred |
| RSR-HR-BSD-06 | SRC-HR-001 | BSD | Hidden Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | DocAuthor, CurrentAction, Editor1-3, HR, HRAdmin, IT, ModifiedDate | Inferred |
| RSR-HR-CWR-01 | SRC-HR-004 | CWR | Initiation | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-02 | SRC-HR-004 | CWR | Permanent/Temporary Contract Workers | Requester (dual-section with Plant Shutdown) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-03 | SRC-HR-004 | CWR | Plant Shutdown Contract Workers | Requester | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-04 | SRC-HR-004 | CWR | Endorsed by HOD | Approver (Stage 1) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-05 | SRC-HR-004 | CWR | Approved by Division Head | Approver (Stage 2) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-06 | SRC-HR-004 | CWR | Acknowledged by AGM HR | Approver (Stage 3) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-07 | SRC-HR-004 | CWR | To be filled by HR/MTN | Admin | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-08 | SRC-HR-004 | CWR | Acknowledged by Requestor | Requester (Stage 4) | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |
| RSR-HR-CWR-09 | SRC-HR-004 | CWR | Hidden Fields | System | Visible when form renders unless status/role rules restrict it | Needs Human Confirmation | - | Inferred |

## IT / IT - Access

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-IT-EAF-01 | SRC-001 | EAF | Requestor Information | Requester | Always visible | Requestor | Capture requestor details (company, name, date, target user) | Clearly Found |
| RSR-IT-EAF-02 | SRC-001 | EAF | Access Details | Requester | Always visible | Requestor | Application, System, Client ID, User Group, Justification | Clearly Found |
| RSR-IT-EAF-03 | SRC-001 | EAF | HOD Acceptance | Approver | Visible during HOD approval stage | HOD/Dept Head | Department Head review and approval with signature | Clearly Found |
| RSR-IT-EAF-04 | SRC-001 | EAF | Director/COO Acceptance | Approver | Visible during second approval stage | Director/COO | Director or COO review and approval | Clearly Found |
| RSR-IT-EAF-05 | SRC-001 | EAF | IT Manager Review | Approver/Admin | Visible after second approval | IT Manager | IT Manager processing | Clearly Found |
| RSR-IT-EAF-06 | SRC-001 | EAF | IT Provisioning | Admin | Visible during IT provisioning stage | IT Admin | Provisioning details and configuration | Clearly Found |
| RSR-IT-EAF-07 | SRC-001 | EAF | Comments/Configuration | Admin | Visible during processing | IT Admin | Configuration notes and comments | Inferred |

## IT / IT - Activity Logs

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-IT-IAL1-01 | SRC-003 | IAL1 | Activity Entry | Requester | Always visible | IT Staff | Log data restoration activity details, requester, date, system | Clearly Found |
| RSR-IT-IAL1-02 | SRC-003 | IAL1 | Activity Details | Information | Always visible | IT Staff | Description of restoration, affected systems, outcome | Clearly Found |
| RSR-IT-IAL1-03 | SRC-003 | IAL1 | Review / Approval | Approver | After entry submitted | Reviewer/Approver | Reviewer sign-off on restoration activity | Inferred |
| RSR-IT-IAL2-01 | SRC-004 | IAL2 | Activity Entry | Requester | Always visible | IT Staff | Log server reboot details — requester, date, server, reboot type | Inferred |
| RSR-IT-IAL2-02 | SRC-004 | IAL2 | Activity Details | Information | Always visible | IT Staff | Description of reboot, affected systems, start/end time, outcome | Inferred |
| RSR-IT-IAL2-03 | SRC-004 | IAL2 | Review / Approval | Approver | After entry submitted | Reviewer/Approver | Reviewer sign-off on reboot activity | Inferred |
| RSR-IT-IAL3-01 | SRC-005 | IAL3 | Activity Entry | Requester | Always visible | IT Staff/ISG | Log ISG event details — requester, date, event type, system affected | Inferred |
| RSR-IT-IAL3-02 | SRC-005 | IAL3 | Activity Details | Information | Always visible | IT Staff/ISG | Description of ISG event, impact, resolution, outcome | Inferred |
| RSR-IT-IAL3-03 | SRC-005 | IAL3 | Review / Approval | Approver | After entry submitted | Reviewer/Approver | Reviewer sign-off on ISG event | Inferred |
| RSR-IT-IAL4-01 | SRC-006 | IAL4 | Activity Entry | Requester | Always visible | IT Staff/DC Ops | Log data center activity — requester, date, activity type, location/rack | Inferred |
| RSR-IT-IAL4-02 | SRC-006 | IAL4 | Activity Details | Information | Always visible | IT Staff/DC Ops | Description of data center activity, equipment affected, environmental readings, outcome | Inferred |
| RSR-IT-IAL4-03 | SRC-006 | IAL4 | Review / Approval | Approver | After entry submitted | Reviewer/Approver | Reviewer sign-off on data center activity | Inferred |

## IT / IT - Asset Inventory

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-IT-HI-01 | SRC-002 | HI | General Information | Requester | Always visible | Requester/IT Staff | Asset identification, user assignment, location, procurement info | Clearly Found |
| RSR-IT-HI-02 | SRC-002 | HI | Hardware Configuration | Information | Always visible | IT Staff | CPU, RAM, HDD, monitor, IP, MAC, OS details | Clearly Found |
| RSR-IT-HI-03 | SRC-002 | HI | Software | Information | Always visible | IT Staff | Installed software list | Clearly Found |
| RSR-IT-HI-04 | SRC-002 | HI | Accounts | Information | Always visible | IT Staff | User accounts, email, SAP accounts | Clearly Found |
| RSR-IT-HI-05 | SRC-002 | HI | Notes | Information | Always visible | Requester/IT Staff | Additional remarks | Clearly Found |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Values marked Unknown, Inferred, or Needs Human Confirmation must stay open until DXL/SME evidence confirms them.
- Original source PDFs and XML files remain reference-only and were not modified.
