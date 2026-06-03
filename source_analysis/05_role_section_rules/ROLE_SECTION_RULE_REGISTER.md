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
| MTN | Maintenance - Failure Analysis | 2 | 16 |
| MTN | Maintenance - Maintenance Plan | 1 | 5 |
| QA | QA - Audit Corrective Action Request (Johor) | 1 | 8 |
| QA | QA - CCCAR 2025 (Penang) | 1 | 7 |
| QA | QA - Change Control Form (Johor) | 1 | 5 |
| QA | QA - Change Control Form NEW (Penang) | 1 | 9 |
| QA | QA - Deviation Investigation Report (Penang) | 1 | 10 |
| QA | QA - GMP Inspection Report (Penang) | 1 | 7 |
| QA | QA - ICAR (Penang) | 1 | 8 |
| QA | QA - Internal Corrective Action (Johor) | 1 | 9 |
| QA | QA - NCR & Internal Audit Report (Johor) | 1 | 2 |
| QA | QA - OFI (Penang) | 1 | 8 |
| QA | QA - OFI Request (Johor) | 1 | 7 |
| QA | QA - Preventive Action Report (Penang) | 1 | 8 |
| QA | QA - Preventive Action Request (Johor) | 1 | 7 |
| QC | QC - Lab Work Request | 1 | 8 |
| QC | QC - OOS Report | 1 | 8 |
| QC | QC - PQCAR | 1 | 8 |
| QC | QC - QA System Audit | 1 | 6 |
| QC | QC - QC PAR | 1 | 6 |

## FIN / Finance - Capital Approval

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-CAR-01 | SRC-FIN-001 | CAR | Approval Authority Matrix | Governance/reference | Always visible (read-only reference) | All authenticated users | Contract amount thresholds, recommended-by and approved-by authority | Inferred |
| RSR-FIN-CAR-02 | SRC-FIN-001 | CAR | Finance Use Only | Finance fields | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | SAPIONo, SAPAssNo | Inferred |
| RSR-FIN-CAR-03 | SRC-FIN-001 | CAR | Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | Company, Department, ProjectName, Objective, StartDate, CompDate, AssetClass, CapitalGoodsCat, sustainability/energy fields, Purpose, ExAssetNo, ExecType | Inferred |
| RSR-FIN-CAR-04 | SRC-FIN-001 | CAR | Appraisal and Budget | Financial analysis | Always visible; editable by Requestor / Finance on draft | Requestor / Finance | EcoLife, Payback, IRR, NPV, isBudgeted, BudgetAmt, BudgetNo, investment rows, TtlInvAmt, Justification | Inferred |
| RSR-FIN-CAR-05 | SRC-FIN-001 | CAR | Request and Finance Verification | Submit/review | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | HOD, HOD2, Preparedby, Prepareddate, Preparedpost, VerName, VerDate, VerRem | Inferred |
| RSR-FIN-CAR-06 | SRC-FIN-001 | CAR | Main Approval Chain | Approval | Each approval panel editable when CurrentAction = that approver stage; read-only to others | HOD / SGM Operations / Director (per threshold) | HOD reviews, recommender, SGM Operations, Director approval | Inferred |
| RSR-FIN-CAR-07 | SRC-FIN-001 | CAR | Budget Exceeded / Additional CAR | Conditional workflow | Visible only when total investment amount exceeds budget threshold | Finance / Requestor | Att, Rem, submittedby/date, NotifiedBy/date, AddCARAmt | Inferred |
| RSR-FIN-CAR-08 | SRC-FIN-001 | CAR | CAR Completion | Completion workflow | Visible and editable when CurrentAction = Completion stage | Requestor / Finance | FinalCompDate, Location, CARCompDesc, Outcome, ActAnnualSaving, OldAsset, PO rows, completion approvals, savings rows | Inferred |
| RSR-FIN-CAR-09 | SRC-FIN-001 | CAR | Cancellation | Cancellation | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | CanName, CanDate, CanReason | Inferred |
| RSR-FIN-CAR-10 | SRC-FIN-001 | CAR | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, FIN groups, department HODs, ED/SGM, editor stages, approval flags, mailing lists, reminders | Inferred |

## FIN / Finance - Credit Management

| Rule ID | Source ID | FARForm | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-CMF_A-01 | SRC-FIN-002 | CMF_A | Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | Company, Category, CAFNo, PrevCAFNo, DateInitiated, CompanyName, Status, Risk, Reasons, MKTExec, CreditLimit, Days, RevCreditLimit, CreditInsRef, Limit, Attachment, Remark | Inferred |
| RSR-FIN-CMF_A-02 | SRC-FIN-002 | CMF_A | GM Approval | Approval | Editable by GM when CurrentAction = GM Approval stage | General Manager | GMName, GMDate, GMRem, App1 | Inferred |
| RSR-FIN-CMF_A-03 | SRC-FIN-002 | CMF_A | Finance Review | Review | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_A-04 | SRC-FIN-002 | CMF_A | Senior Financial Controller Approval | Approval | Editable by Senior Financial Controller when CurrentAction = SFC Approval stage | Senior Financial Controller | FCName, FCDate, FCRem, App3 | Inferred |
| RSR-FIN-CMF_A-05 | SRC-FIN-002 | CMF_A | SGM / ED Approval | Approval | Editable by SGM / ED when CurrentAction = SGM/ED Approval stage | SGM / Executive Director | COOName, COODate, COORem, App4, EDName, EDDate, EDRem, App5 | Inferred |
| RSR-FIN-CMF_A-06 | SRC-FIN-002 | CMF_A | Approved Limit / Rejection | Decision | Visible after final approval; editable by Finance | Finance (FIN) Staff | AppCreditLimit, Days2, Denial | Inferred |
| RSR-FIN-CMF_A-07 | SRC-FIN-002 | CMF_A | Finance Acknowledgement | Acknowledgement | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName2, FMDate2, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_A-08 | SRC-FIN-002 | CMF_A | Finance Follow-Up Cancellation | Cancellation | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | CanName, CanDate, CanRem, CanAtt | Inferred |
| RSR-FIN-CMF_A-09 | SRC-FIN-002 | CMF_A | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, COO/ED/FIN/Marketing routing, FLimit, FLimit2, editors, MailList, INO, RemDate | Inferred |
| RSR-FIN-CMF_B-01 | SRC-FIN-003 | CMF_B | Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | Company, Category, CAFNo, qty, DateInitiated, CompanyName, MKTExec, AppCreditLimit_1, TemCreditLimit, TotCreditLimit, PaymentTerms, TotRec, OpenDelCredit, SalesVal, CreditInsRef, Limit, Reason, MKTHOD, reqby, reqdate | Inferred |
| RSR-FIN-CMF_B-02 | SRC-FIN-003 | CMF_B | Marketing Manager Approval | Approval | Editable by Marketing Manager when CurrentAction = Marketing Approval stage | Marketing Manager | MKTName, MKTDate, MKTRem, App1 | Inferred |
| RSR-FIN-CMF_B-03 | SRC-FIN-003 | CMF_B | GM Approval | Approval | Editable by GM when CurrentAction = GM Approval stage | General Manager | GMName, GMDate, GMRem, App1_1 | Inferred |
| RSR-FIN-CMF_B-04 | SRC-FIN-003 | CMF_B | Finance Review | Review | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_B-05 | SRC-FIN-003 | CMF_B | ED Approval | Approval | Editable by Executive Director when CurrentAction = ED Approval stage | Executive Director | EDName, EDDate, EDRem, App3 | Inferred |
| RSR-FIN-CMF_B-06 | SRC-FIN-003 | CMF_B | Approved Limit / Rejection | Decision | Visible after final approval; editable by Finance | Finance (FIN) Staff | AppCreditLimit, Denial | Inferred |
| RSR-FIN-CMF_B-07 | SRC-FIN-003 | CMF_B | Finance Acknowledgement | Acknowledgement | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName2, FMDate2, ExpiryDate, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_B-08 | SRC-FIN-003 | CMF_B | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, Marketing routing, ED, IT, FIN, FLimit, editors, MailList, INO, RemDate | Inferred |
| RSR-FIN-CMF_C-01 | SRC-FIN-004 | CMF_C | Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | CAFNo, DateReview, Company, Category, MKTExec, MKTHOD, reqby, reqdate | Inferred |
| RSR-FIN-CMF_C-02 | SRC-FIN-004 | CMF_C | Customer Credit Review Table | Repeating table | Always visible; editable by Marketing Exec on draft | Requestor (Marketing Exec) | C_1..C_50, S_1..S_50, A_1..A_50, H_1..H_50, N_1..N_50, F_1..F_50, M_1..M_50 | Inferred |
| RSR-FIN-CMF_C-03 | SRC-FIN-004 | CMF_C | Attachment / Notes | Supporting detail | Always visible; editable by Requestor on draft | Requestor | Attachment; Active/Inactive and late-payment definitions | Inferred |
| RSR-FIN-CMF_C-04 | SRC-FIN-004 | CMF_C | Marketing Manager Endorsement | Approval | Editable by Marketing Manager when CurrentAction = Marketing Approval stage | Marketing Manager | MKTName, MKTDate, MKTPost, MKTRem, App1 | Inferred |
| RSR-FIN-CMF_C-05 | SRC-FIN-004 | CMF_C | GM / Section Approval | Approval | Editable by GM when CurrentAction = GM Approval stage | General Manager | SectionTitle, GMName, GMDate, GMRem, App1_1 | Inferred |
| RSR-FIN-CMF_C-06 | SRC-FIN-004 | CMF_C | Finance Review | Review | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName, FMDate, CRate, FMRem, FMAtt, App2 | Inferred |
| RSR-FIN-CMF_C-07 | SRC-FIN-004 | CMF_C | ED Approval | Approval | Editable by Executive Director when CurrentAction = ED Approval stage | Executive Director | SectionTitle_1_1, EDName, EDDate, EDRem, App3 | Inferred |
| RSR-FIN-CMF_C-08 | SRC-FIN-004 | CMF_C | Finance Acknowledgement | Acknowledgement | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FMName2, FMDate2, FMRem2, FMAtt2, App6 | Inferred |
| RSR-FIN-CMF_C-09 | SRC-FIN-004 | CMF_C | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, MKTFA, MKTFE, MKTSN, MKT, ED, IT, FIN, editors, MailList, Year-INO, RemDate | Inferred |

## FIN / Finance - Expenditure Approval

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-EARF-01 | SRC-FIN-005 | EARF | Finance / Initiation | Request details | Always visible; editable by Finance Requestor on draft | Requestor (Finance) | SAPIONo, Company, Department, AssetClass, Purpose, ExAssetNo, ExecType | Inferred |
| RSR-FIN-EARF-02 | SRC-FIN-005 | EARF | Asset Detail Table | Fixed/repeating rows | Always visible; editable by Requestor on draft | Requestor | Inv_1..Inv_5, FW_1..FW_5, UL_1..UL_5, InvAmt_1..InvAmt_5, UP_1..UP_5, SAPAssNo_1..SAPAssNo_5 | Inferred |
| RSR-FIN-EARF-03 | SRC-FIN-005 | EARF | Justification / Attachment | Supporting details | Always visible; editable by Requestor on draft | Requestor | TtlInvAmt, Justification, Attachment | Inferred |
| RSR-FIN-EARF-04 | SRC-FIN-005 | EARF | Routing / Requestor | People/routing | Always visible; editable by Requestor (Preparer / HOD) on draft | Requestor (Preparer) | HOD, HOD2, CC2, Preparedby, Prepareddate, Preparedpost | Inferred |
| RSR-FIN-EARF-05 | SRC-FIN-005 | EARF | Finance Verification | Review | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | VerName, VerDate, VerRem | Inferred |
| RSR-FIN-EARF-06 | SRC-FIN-005 | EARF | Department Head Approval | Approval | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | hodname, hoddate, hodpost, hodrem, App1 | Inferred |
| RSR-FIN-EARF-07 | SRC-FIN-005 | EARF | Reviewed By | Review | Editable by Reviewer when CurrentAction = Review stage | Reviewer (Division level) | CC, Reviewedby, Revieweddate, Reviewedpost, Reviewedrem, App2 | Inferred |
| RSR-FIN-EARF-08 | SRC-FIN-005 | EARF | Division Head Approval | Approval | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | hodname2, hoddate2, hodpost2, hodrem2, App3 | Inferred |
| RSR-FIN-EARF-09 | SRC-FIN-005 | EARF | Notification / Completion | Completion | Visible and editable when CurrentAction = Completion stage | Requestor / Finance | NotifiedBy, NotifiedDate, CompDate, OldAsset, oldAssetRem | Inferred |
| RSR-FIN-EARF-10 | SRC-FIN-005 | EARF | SAP PR Rows | Fixed/repeating rows | Visible after completion; editable by Finance | Finance (FIN) Staff | PODt_1..PODt_5, PONo_1..PONo_5 | Inferred |
| RSR-FIN-EARF-11 | SRC-FIN-005 | EARF | Cancellation | Cancellation | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | CanName, CanDate, CanReason | Inferred |
| RSR-FIN-EARF-12 | SRC-FIN-005 | EARF | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, IT, FINA, FIN1, FIN3, FIN, FINAdmin, ITHOD, ADM, MTN, ADM_CC, CC3, DH, Recommender, Servers, Readers, editors, MailingList, RemDate | Inferred |

## FIN / Finance - Service Entry

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-FIN-RSES-01 | SRC-FIN-006 | RSES | Initiator Section | Request details | Always visible; editable by Requestor on draft | Requestor | Company, Requestor, Approver, Dept, ExtNo, Site, SESNo, PO, SESAppDate, Justification, ReqName, ReqDate | Inferred |
| RSR-FIN-RSES-02 | SRC-FIN-006 | RSES | Approver Acceptance | Approval | Editable by designated Approver when CurrentAction = Approver Acceptance stage | Approver (line manager / HOD) | AppName, AppDate, AppRem, App | Inferred |
| RSR-FIN-RSES-03 | SRC-FIN-006 | RSES | Finance Acceptance | Completion | Editable by Finance (FIN) Staff when CurrentAction = Finance stage | Finance (FIN) Staff | FINName, FINDate, FINRem, App2 | Inferred |
| RSR-FIN-RSES-04 | SRC-FIN-006 | RSES | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, IT, Editor1, Editor2, Editor3, FIN | Inferred |

## HR / HR - Applications Support

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-HRAPR-01 | SRC-HR-015 | HRAPR | Header / Routing | Case details | Always visible; editable by HR Admin (case routing) | HR Admin | DateCreated, DisplayCaseNo, SendTo | Inferred |
| RSR-HR-HRAPR-02 | SRC-HR-015 | HRAPR | Requestor's Section | Request details | Always visible; editable by Requestor on draft | Requestor | companyname, ReportedBy, Dept, EmpNo, Section, ExtNo, System, Module, Module2, ProblemDesc, Attach, CC | Inferred |
| RSR-HR-HRAPR-03 | SRC-HR-015 | HRAPR | GHR/ISG Action | Action/update | Editable by HR Admin / ISG when CurrentAction = HR Processing stage | HR Admin / ISG | ISGName, Solution, CaseStatus, StartDate, DateClosed, ISGRemarks, Attachment2 | Inferred |
| RSR-HR-HRAPR-04 | SRC-HR-015 | HRAPR | Rejected | Rejection | Visible when CurrentAction = Rejected; editable by HR Admin / ISG | HR Admin / ISG | ISGName_1, CaseStatus_1, DateReject, ISRemarks | Inferred |
| RSR-HR-HRAPR-05 | SRC-HR-015 | HRAPR | Requestor's Acceptance | Acceptance | Always visible; editable by Requestor on draft | Requestor | Status, DateAccept, Comment | Inferred |
| RSR-HR-HRAPR-06 | SRC-HR-015 | HRAPR | KIV/Archived | Archive | Editable by HR Admin when CurrentAction = HR Admin stage | HR Admin | KIVBy, KIVStatus, KIVDate | Inferred |
| RSR-HR-HRAPR-07 | SRC-HR-015 | HRAPR | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Requestor, AuthorsList, ISG, PIC, GHR, GHR2, HRHOD, AEditor1-3, MailingList, MailList, AutoClosedDate, RemDate, audit fields | Inferred |

## HR / HR - Attendance

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-AWHR-01 | SRC-HR-002 | AWHR | Requestor Section | Requester | Always visible; editable by Requestor on draft | Requestor | Company, EmpCategory, Section, Department, HOS, HOD, CC, Attachment | Inferred |
| RSR-HR-AWHR-02 | SRC-HR-002 | AWHR | Exceeded Category Code | Requester | Always visible; editable by Requestor on draft | Requestor | E1-E4 checkboxes | Inferred |
| RSR-HR-AWHR-03 | SRC-HR-002 | AWHR | Rostered Shift Table | Reference | Always visible (read-only shift reference table) | All authenticated users | Shift ID, Shift Details (predefined options) | Inferred |
| RSR-HR-AWHR-04 | SRC-HR-002 | AWHR | Working Hours Table | Line Items (Child List Candidate) | Always visible; editable by Requestor on draft (child list candidate) | Requestor | 15 rows: EmpNo_N, Name_N, Category, Date From/To, Day Type, Shift, Add Hours, Total Hours | Inferred |
| RSR-HR-AWHR-05 | SRC-HR-002 | AWHR | Head of Section Approval | Approver | Editable by Head of Section when CurrentAction = HOS Approval stage | Head of Section (HOS) | Approve/Reject, HOSName, HOSDate, HOSRem, HOSAtt, HOSApp | Inferred |
| RSR-HR-AWHR-06 | SRC-HR-002 | AWHR | Head of Department Approval | Approver | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | Approve/Reject, HODName, HODDate, HODRem, HODAtt, HODApp | Inferred |
| RSR-HR-AWHR-07 | SRC-HR-002 | AWHR | HR Use (Processing) | Admin/Approver | Editable by HR Admin / ISG when CurrentAction = HR Processing stage | HR Admin / ISG | Accept/Deny, HRCom, HRName, HRDate, HRAtt, HRApp | Inferred |
| RSR-HR-AWHR-08 | SRC-HR-002 | AWHR | Withdrawn by Requestor | Requester | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | WDBy, WDDate, WDReason | Inferred |
| RSR-HR-AWHR-09 | SRC-HR-002 | AWHR | History Log | System | Always visible (read-only audit trail) | All authenticated users | HistoryLog | Inferred |
| RSR-HR-AWHR-10 | SRC-HR-002 | AWHR | Hidden Fields | System | Not rendered — system routing fields only | System (not user-visible) | CA (CurrentAction), Editor1-5, IT, COO, HR_1-3, reference lists | Inferred |

## HR / HR - Cafeteria

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-CIR-01 | SRC-HR-003 | CIR | Initiator Section | Requester | Always visible; editable by Requestor on draft | Requestor | Site, TeamMembers, Inspector, InsDate, InsTime, SubmittedBy, SubmittedDate | Inferred |
| RSR-HR-CIR-02 | SRC-HR-003 | CIR | Corrective Action Review | Review | Editable by Reviewer when CurrentAction = Review stage | Reviewer (Cafeteria Comm.) | ReviewedBy, ReviewedDate, Remarks, Status | Inferred |
| RSR-HR-CIR-03 | SRC-HR-003 | CIR | Hidden Fields | System | Not rendered — system routing fields only | System (not user-visible) | DocAuthor, CDate, CurrentAction, Editor1, Editor2, Editors, INO, IT, ACMComm, ECMComm | Inferred |

## HR / HR - Contract

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-FTCR-01 | SRC-HR-010 | FTCR | Employee Details | Request details | Always visible; editable by Dept Head on draft | Requestor (Dept Head) | EmpName, EmpNo, DOB, EmpAge, EmpPost, Dept, JoinDate, RetDate, DivHead, Attachment | Inferred |
| RSR-HR-FTCR-02 | SRC-HR-010 | FTCR | Justification | Request details | Always visible; editable by Dept Head on draft | Requestor (Dept Head) | Justification text | Inferred |
| RSR-HR-FTCR-03 | SRC-HR-010 | FTCR | Submitted by Department/Section Head | Submission | Always visible; editable by Requestor / Dept Head on draft | Requestor / Dept Head | SubBy, SubDesg, SubDate | Inferred |
| RSR-HR-FTCR-04 | SRC-HR-010 | FTCR | Division/Department Recommendation | Approval/recommendation | Editable by Division/Dept Head when CurrentAction = Endorsement/Recommendation stage | Division / Dept Head | CPeriod, Others, DivHeadJust, InSuccess, Ext, successor details, training fields | Inferred |
| RSR-HR-FTCR-05 | SRC-HR-010 | FTCR | Endorsement | Approval/recommendation | Editable by Division/Dept Head when CurrentAction = Endorsement/Recommendation stage | Division / Dept Head | EndBy, EndDesg, EndDate | Inferred |
| RSR-HR-FTCR-06 | SRC-HR-010 | FTCR | Employee Background History | Fixed table | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | Year_N, AprRate_N, DisRec_N, MC_N, HL_N, A_N, L_N, NPL_N, MedEx_N | Inferred |
| RSR-HR-FTCR-07 | SRC-HR-010 | FTCR | Approving Authority | Approval | Editable by Division/Dept Head when CurrentAction = Endorsement/Recommendation stage | Division / Dept Head | AppHR, AppCOO, AppED with dates and remarks | Inferred |
| RSR-HR-FTCR-08 | SRC-HR-010 | FTCR | HR Section | HR update/status | Editable by HR Admin / ISG when CurrentAction = HR Processing stage | HR Admin / ISG | CaseStatus, AppFor, SpecifyOthers, NotHOD, Remarks2 | Inferred |
| RSR-HR-FTCR-09 | SRC-HR-010 | FTCR | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, Editor1-Editor7, ED, SGM, HR_1, HR_2, HR, HRM, IT, Servers, Readers | Inferred |

## HR / HR - Duty Roster

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-DRD-01 | SRC-HR-005 | DRD | SECTION A — Header | Requester | Always visible; editable by Requestor on draft | Requestor | Comp, Category, Dept, Section, HOS, HOD, CC, Month, Year, Attch, Amend, Changes, EmpName | Inferred |
| RSR-HR-DRD-02 | SRC-HR-005 | DRD | Shift Code Reference | Reference | Always visible (read-only reference) | All authenticated users | 10 predefined shift codes with hours | Inferred |
| RSR-HR-DRD-03 | SRC-HR-005 | DRD | HOS APPROVAL | Approver | Editable by Head of Section when CurrentAction = HOS Approval stage | Head of Section (HOS) | HOSName, HOSDate, HOSRemark | Inferred |
| RSR-HR-DRD-04 | SRC-HR-005 | DRD | HOD APPROVAL | Approver | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | HODName, HODDate, HODRemark | Inferred |
| RSR-HR-DRD-05 | SRC-HR-005 | DRD | FOR HR Use | Admin | Editable by HR Admin / ISG when CurrentAction = HR Processing stage | HR Admin / ISG | HRName, HRDate | Inferred |
| RSR-HR-DRD-06 | SRC-HR-005 | DRD | Hidden Fields | System | Not rendered — system routing fields only | System (not user-visible) | CA, Editor1-4, HOSApp, HODApp, HRApp | Inferred |

## HR / HR - Employee Data

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EPDU-01 | SRC-HR-007 | EPDU | Personal Details | Requester | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | EmpNo, Company, EmpName, NRIC_O, NRIC_N, Marital, Disabilities, addresses, phone, EPF, SOCSO, ITAX | Inferred |
| RSR-HR-EPDU-02 | SRC-HR-007 | EPDU | Employee Education Background | Repeating table | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | InsName_N, FY_N, TY_N, Standard_N, Field_N, Place_N, Grd_N | Inferred |
| RSR-HR-EPDU-03 | SRC-HR-007 | EPDU | Children Details | Repeating table | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | N_N, G_N, S_N, D_N, B_N, Ins_N, Q_N, Ds_N, TR_N | Inferred |
| RSR-HR-EPDU-04 | SRC-HR-007 | EPDU | Family Details | Repeating table | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | FDN_N, FDR_N, R_N | Inferred |
| RSR-HR-EPDU-05 | SRC-HR-007 | EPDU | Spouse Details | Requester | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | SpName, SpNRIC_N, SpWork, SpOccupation, SpComp, TelNo | Inferred |
| RSR-HR-EPDU-06 | SRC-HR-007 | EPDU | Submission / HR Review | Submitter + HR review | Requestor part editable by Employee on draft; HR Review part editable by HR Admin when CurrentAction = HR Review stage | Employee (submission) / HR Admin (review) | Submittedby, Submittedon, HRAction, Acceptedby, Acceptedon | Inferred |
| RSR-HR-EPDU-07 | SRC-HR-007 | EPDU | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | DocAuthor, CDate, ModiDate, IT, HR_1, HR_2, HR_3, HR, HRHOD, Servers, Readers | Inferred |

## HR / HR - Employee Health

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EPHR-01 | SRC-HR-008 | EPHR | Employee Health Header | Requester/HR medical record | Always visible; editable by Requestor on draft | Requestor | FullName, IC, DOB, Gender, HP, Company, Dept | Inferred |
| RSR-HR-EPHR-02 | SRC-HR-008 | EPHR | Measurements | Medical record | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | Height, Weight, BMI, Blood Pressure, Pulse, Visual, Color Vision | Inferred |
| RSR-HR-EPHR-03 | SRC-HR-008 | EPHR | Medical History | Repeating table | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | D_N, S_N, R_N rows for condition/date/since/remark pattern | Inferred |
| RSR-HR-EPHR-04 | SRC-HR-008 | EPHR | Follow-Up | Medical record | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | Followup, Followup2, Location, LocRem | Inferred |
| RSR-HR-EPHR-05 | SRC-HR-008 | EPHR | Admission Record | Medical record | Always visible; editable by HR Admin (and subject employee for personal data) | HR Admin / Employee | AdmDate, Diagnosis, Discharge, Attachment, Attachment2 | Inferred |
| RSR-HR-EPHR-06 | SRC-HR-008 | EPHR | Audit | System | Always visible (read-only audit trail) | All authenticated users | DocAuthor, CDate | Inferred |

## HR / HR - Exit

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-EEN-01 | SRC-HR-006 | EEN | HR Section — Employee Details | Requester | Editable by HR Admin / ISG when CurrentAction = HR Processing stage | HR Admin / ISG | - | Inferred |
| RSR-HR-EEN-02 | SRC-HR-006 | EEN | Deactivation Dates | Admin | Editable by HR Admin when CurrentAction = HR Admin stage | HR Admin | - | Inferred |
| RSR-HR-EEN-03 | SRC-HR-006 | EEN | APPROVE REJECT — ED | Approver | Editable by Executive Director when CurrentAction = ED Approval stage | Executive Director | - | Inferred |
| RSR-HR-EEN-04 | SRC-HR-006 | EEN | HEAD OF DEPARTMENT / DIVISION APPROVAL | Approver | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | - | Inferred |
| RSR-HR-EEN-05 | SRC-HR-006 | EEN | EXIT INTERVIEW (5 questions) | Information | Always visible; editable by Employee during exit interview | Employee | - | Inferred |
| RSR-HR-EEN-06 | SRC-HR-006 | EEN | ACTUAL LAST WORKING DAY — Notify IT | Admin | Editable by HR Admin when CurrentAction = Last Working Day Notification stage | HR Admin | - | Inferred |
| RSR-HR-EEN-07 | SRC-HR-006 | EEN | HUMAN RESOURCES USE — Returned Items | Admin | Editable by HR Admin when CurrentAction = HR Admin stage | HR Admin | - | Inferred |
| RSR-HR-EEN-08 | SRC-HR-006 | EEN | Withdraw Section | Requester | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | - | Inferred |
| RSR-HR-EEN-09 | SRC-HR-006 | EEN | Hidden/System Fields | System | Not rendered — system routing fields only | System (not user-visible) | - | Inferred |

## HR / HR - Foreign Worker

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-FWWPD-01 | SRC-HR-011 | FWWPD | Section A - General Information | Record details | Always visible; editable by HR Admin | HR Admin | Company, Status, Reason, Remark, COMemo, Name, EmpNo, Department, Hostel, DOB, DOC, passport fields, nationality, contract period, permit fields, WorkerCode, SocsoNo | Inferred |
| RSR-HR-FWWPD-02 | SRC-HR-011 | FWWPD | Section B - Hospitalization & Surgical Scheme | Fixed table | Always visible; editable by HR Admin | HR Admin | Y_N, PN_N, SN_N, P_N, F_N, T_N, Att_N, D_N | Inferred |
| RSR-HR-FWWPD-03 | SRC-HR-011 | FWWPD | Section C - FOMEMA Status | Fixed table | Always visible; editable by HR Admin | HR Admin | DY_N, C_N, DC_N, FR_N, FRmks_N, AttC_N, DD_N | Inferred |
| RSR-HR-FWWPD-04 | SRC-HR-011 | FWWPD | Section D - MYEG Process | Fixed table | Always visible; editable by HR Admin | HR Admin | EY_N, DA_N, EY_N_1, ST_N, ECC_N, DS_N_1, S_N, DS_N | Inferred |
| RSR-HR-FWWPD-05 | SRC-HR-011 | FWWPD | Section E - Foreign Employment Contract | Fixed table | Always visible; editable by HR Admin | HR Admin | FY_N, CPF_N, CPT_N, PB_N, FDS_N | Inferred |
| RSR-HR-FWWPD-06 | SRC-HR-011 | FWWPD | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, IT, HR, HRHOD, PdgEmpCon, HRList, EditorsE | Inferred |
| RSR-HR-FWWPE-01 | SRC-HR-012 | FWWPE | Section A - Issued by HR Personnel | Request/routing | Always visible; editable by Requestor on draft | Requestor | SendTo, HOS, HOD, CC, Company, Name, EmpNo, PassportNo, Department, Section, WPExpDate, DateF, DateT, Year, DocAuthor, DateIssued | Inferred |
| RSR-HR-FWWPE-02 | SRC-HR-012 | FWWPE | Section B - Reply by Superior | Reply/action | Editable by Superior (HOS/HOD) when CurrentAction = Reply stage | HOS / HOD (Superior) | Status, Reason, Departure, attachment, ReplyRemark, Position, ReplyName, ReplyDate | Inferred |
| RSR-HR-FWWPE-03 | SRC-HR-012 | FWWPE | Section C - Accepted by HOS | Approval | Editable by HOS when CurrentAction = HOS Acceptance stage | Head of Section (HOS) | HOSStatus, HOSName, HOSDate, HOSRemark | Inferred |
| RSR-HR-FWWPE-04 | SRC-HR-012 | FWWPE | Section D - Endorsed by HOD | Approval | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | ContStatus, HODStatus, HODName, HODDate, HODRemark | Inferred |
| RSR-HR-FWWPE-05 | SRC-HR-012 | FWWPE | Section E - Approved by HR Department | Approval | Editable by HR HOD when CurrentAction = HR Approval stage | HR HOD | HRHODStatus, HRHODName, HRHODDate, HRHODRemark | Inferred |
| RSR-HR-FWWPE-06 | SRC-HR-012 | FWWPE | Section F - Flight & Transportation | Completion | Editable by HR Admin when CurrentAction = Completion stage | HR Admin | DepartDate, DepartTime, Att, Att2, Doneby, Donedate | Inferred |
| RSR-HR-FWWPE-07 | SRC-HR-012 | FWWPE | Section G - Income Tax Declaration | Completion | Editable by HR Admin when CurrentAction = Completion stage | HR Admin | SubDate, Remarks, Doneby2, Donedate2 | Inferred |
| RSR-HR-FWWPE-08 | SRC-HR-012 | FWWPE | Withdrawn | Withdrawal | Visible and editable by Requestor when CurrentAction = Withdrawn/Cancelled | Requestor | WDDate, WDBy, WDRem | Inferred |
| RSR-HR-FWWPE-09 | SRC-HR-012 | FWWPE | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Editor1-Editor8, IT, HR, PIC1, PIC2, HRHOD, ToList, CCList, INO | Inferred |

## HR / HR - Gift/Donation/Sponsorship

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-GDSN-01 | SRC-HR-013 | GDSN | Part A - Initiator Section | Request details | Always visible; editable by Requestor on draft | Requestor | ProjectCode, ReqType, company, Recipient, Name, Address, SAP_ID, Requestor, HOD, Department, Type, Purpose, otherPurpose, IsBenefit, benefitText, IsLogo, ItemDetail, GiftValue, DateRec, Quantity, Price, Total, IsPO, PoNo | Inferred |
| RSR-HR-GDSN-02 | SRC-HR-013 | GDSN | Submitter | Submission | Always visible; editable by Requestor / Dept Head on draft | Requestor / Dept Head | Notified, position, reportedDate | Inferred |
| RSR-HR-GDSN-03 | SRC-HR-013 | GDSN | Part B - HOD Section | Endorsement | Editable by HOD when CurrentAction = HOD Endorsement stage | HOD | HODName, HODPost, HODDate, App, SendTo | Inferred |
| RSR-HR-GDSN-04 | SRC-HR-013 | GDSN | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, Editor1, Editor2, ED, SGM, HR, FIN, PUR, IsPUR, MKT, IT, INO, MailList, Readers | Inferred |

## HR / HR - Information

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-HEALTHINFO-01 | SRC-HR-014 | HEALTHINFO | Information Header | Notice details | Always visible; editable by Requestor on draft | Requestor | Title, Category, Send, Subject | Inferred |
| RSR-HR-HEALTHINFO-02 | SRC-HR-014 | HEALTHINFO | Information Body | Content | Always visible; editable by HR Admin / Author | HR Admin / Author | Body, Att, Ext | Inferred |
| RSR-HR-HEALTHINFO-03 | SRC-HR-014 | HEALTHINFO | Status Updates | Tracking | Always visible (read-only tracking) | All authenticated users | Update, Status | Inferred |
| RSR-HR-HEALTHINFO-04 | SRC-HR-014 | HEALTHINFO | View Details | Tracking | Always visible (read-only tracking) | All authenticated users | Viewed, CtrLst | Inferred |
| RSR-HR-HEALTHINFO-05 | SRC-HR-014 | HEALTHINFO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | Author, DateSent, Lock, Lock2, CurrentAction, ISADMIN | Inferred |

## HR / HR - Survey

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-ESF-01 | SRC-HR-009 | ESF | Survey Instructions and Rating Legend | Reference | Always visible (read-only reference) | All authenticated users | Scale 1-10; Poor, Below Average, Above Average, Good, Excellent | Inferred |
| RSR-HR-ESF-02 | SRC-HR-009 | ESF | Motivation Factor Questions | Repeating survey table | Always visible; editable by Employee / Survey Respondent | Employee / Survey Respondent | Question text, Rating, Comment, group/category code | Inferred |
| RSR-HR-ESF-03 | SRC-HR-009 | ESF | Respondent Summary | Requester | Always visible; editable by Employee / Survey Respondent | Employee / Survey Respondent | Service, Age, Category, Suggestion, DateSubmitted | Inferred |
| RSR-HR-ESF-04 | SRC-HR-009 | ESF | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, HR, IT, Editor1, Servers, Readers | Inferred |
| RSR-HR-ESF-05 | SRC-HR-009 | ESF | Aggregated Survey Fields | System/summary | Always visible (read-only system-computed summary) | HR Admin | Qs, Cs, Gs-G_16, TotalRating | Inferred |

## HR / HR - Workforce

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-HR-BSD-01 | SRC-HR-001 | BSD | SECTION A — PERSON IN CHARGE | Requester (HOD/HOS) | Always visible; editable by Requestor on draft | Requestor | Division, Dept, Section, PIC, EmpNo, Position, Responsibility, HOD | Inferred |
| RSR-HR-BSD-02 | SRC-HR-001 | BSD | SECTION B — BACKUP STAFF | Repeating (Child List Candidate) | Always visible; editable by HOD/HOS on draft | HOD / HOS | PIC_1-3, Position_1-3, Responsibility_1-3 | Inferred |
| RSR-HR-BSD-03 | SRC-HR-001 | BSD | SECTION C — NOMINATED BY HOD/HOS | Requester | Always visible; editable by HOD / HOS on draft | HOD / HOS | SubmittedBy, SubmitDate, Remark | Inferred |
| RSR-HR-BSD-04 | SRC-HR-001 | BSD | SECTION D — APPROVED BY HEAD OF DIVISION | Approver | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | HODName, HODPost, HODDate, HODRemarks, HODApp | Inferred |
| RSR-HR-BSD-05 | SRC-HR-001 | BSD | Admin/Updates | Admin | Editable by HR Admin when CurrentAction = HR Admin stage | HR Admin | Revision, Updatedby, Updateddt, Status, StaRem | Inferred |
| RSR-HR-BSD-06 | SRC-HR-001 | BSD | Hidden Fields | System | Not rendered — system routing fields only | System (not user-visible) | DocAuthor, CurrentAction, Editor1-3, HR, HRAdmin, IT, ModifiedDate | Inferred |
| RSR-HR-CWR-01 | SRC-HR-004 | CWR | Initiation | Requester | Always visible; editable by Requestor on draft | Requestor | - | Inferred |
| RSR-HR-CWR-02 | SRC-HR-004 | CWR | Permanent/Temporary Contract Workers | Requester (dual-section with Plant Shutdown) | Always visible; editable by Requestor on draft | Requestor | - | Inferred |
| RSR-HR-CWR-03 | SRC-HR-004 | CWR | Plant Shutdown Contract Workers | Requester | Always visible; editable by Requestor on draft | Requestor | - | Inferred |
| RSR-HR-CWR-04 | SRC-HR-004 | CWR | Endorsed by HOD | Approver (Stage 1) | Editable by HOD / Division Head when CurrentAction = HOD Approval stage | HOD / Division Head | - | Inferred |
| RSR-HR-CWR-05 | SRC-HR-004 | CWR | Approved by Division Head | Approver (Stage 2) | Editable by Division Head when CurrentAction = Division Head Approval stage | Division Head | - | Inferred |
| RSR-HR-CWR-06 | SRC-HR-004 | CWR | Acknowledged by AGM HR | Approver (Stage 3) | Editable by AGM HR when CurrentAction = AGM HR Acknowledgement stage | AGM HR | - | Inferred |
| RSR-HR-CWR-07 | SRC-HR-004 | CWR | To be filled by HR/MTN | Admin | Editable by HR Admin / MTN when CurrentAction = HR/MTN stage | HR Admin / MTN | - | Inferred |
| RSR-HR-CWR-08 | SRC-HR-004 | CWR | Acknowledged by Requestor | Requester (Stage 4) | Editable by Requestor when CurrentAction = Requestor Acknowledgement stage | Requestor | - | Inferred |
| RSR-HR-CWR-09 | SRC-HR-004 | CWR | Hidden Fields | System | Not rendered — system routing fields only | System (not user-visible) | - | Inferred |

## IT / IT - Access

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-IT-EAF-01 | SRC-001 | EAF | Requestor Information | Requester | Always visible; editable by Requestor on draft | Requestor | Capture requestor details (company, name, date, target user) | Clearly Found |
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

## MTN / Maintenance - Failure Analysis

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-MTN-FAILANALREPO-JHR-01 | MASTER-036 | FAILANALREPO | New Justification Note | Justification / pre-FAR note | Always visible; editable by Requestor / HOD on draft | Requestor / HOD / Approver | Site, ManBy, ManYear, Model, SrNo, Atth, HOD, SubBy, SubDate, AppBy, AppDate | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-02 | MASTER-036 | FAILANALREPO | Request section | Request details | Always visible; editable by Requestor on draft | Requestor | FARNo, Year, Month, INO, DateNotified, CompSel, RequestedBy, Recipient_MTN, Recipient_PROD, VerifierName | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-03 | MASTER-036 | FAILANALREPO | Entity Detail | Failure/entity details | Always visible; editable by Requestor / Maintenance / Production on draft | Requestor / Maintenance / Production | EntityNum, EntityName, Model, Criteria, Location, FailureDesc, HistoryFailure, MeantimeFailure, Attachment_1 | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-04 | MASTER-036 | FAILANALREPO | Reply section - Maintenance | Department reply | Editable by Maintenance users / HOD MTN when CurrentAction = Maintenance Reply stage | Maintenance Staff / HOD MTN | AppName, AppCom, RejDate, MeantimeInfo, Conclusion, MTNStatus, Remarks, RevBy, RevDate, AppExpireDate, RevStatus | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-05 | MASTER-036 | FAILANALREPO | Reply section - Production | Department reply | Editable by Production users when CurrentAction = Production Reply stage | Production Staff / Production Approver | AppNameProd, AppComProd, RejDate_P, MeantimeInfo_P, Conclusion_P, PRDStatus, Remarks_P, RevBy_P, RevDate_P, AppExpireDate_PROD, RevStatusPROD | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-06 | MASTER-036 | FAILANALREPO | Verification and follow-up | Verification / follow-up | Editable by Verifier when CurrentAction = Verification stage | Verifier / Reviewer | VerifiedOn, VerifiedBy, Body, NewStatus, FollowUpDate, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-07 | MASTER-036 | FAILANALREPO | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor / Process owner | WDDate, WDBy, WDAttach, WDrawnCom, WDStatus | Derived from section name |
| RSR-MTN-FAILANALREPO-JHR-08 | MASTER-036 | FAILANALREPO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Status, Status_PRD, AEditor1-4, ReviewEditorProd, ReviewEditorMTN, Requestor, ED, GM, ISADMIN, MailList, Recipient, ReplyStatus, RemTo, RemHOD, dates | Derived from field pattern |
| RSR-MTN-FAILANALREPO-PNG-01 | MASTER-196 | FAILANALREPO | Document-control header | Document metadata | Always visible; editable by Document owner / Admin | Document Owner / QA Admin | TitleForDoc, DocNo, IssuNo, DateIssue, FinalStatus, Authors, Author_APP, Author_DH, Readers, ObsoleteDate, Sendto, QA, QA2, CC, Defcc, QAAdmin, ISG, RejMail, Servers | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-02 | MASTER-196 | FAILANALREPO | Request section | Request details | Always visible; editable by Requestor on draft | Requestor | FARNo, Year, CompSel, RequestedBy, Recipient_MTN, Recipient_PROD, AppName, AppNameProd | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-03 | MASTER-196 | FAILANALREPO | Entity Detail | Failure/entity details | Always visible; editable by Requestor / Maintenance / Production on draft | Requestor / Maintenance / Production | Model, Criteria, HistoryFailure, Reason | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-04 | MASTER-196 | FAILANALREPO | Reply section - Maintenance | Department reply / extension | Editable by Maintenance users when CurrentAction = Maintenance Reply stage | Maintenance Staff / HOD MTN | AppCom, RejDate, Status1, Reason_1, AppCom_1, RejDate_1, Status1_1, NewReplyDateMTN, ExtReasonMTN, MTNStatus, Remarks, RevBy, RevDate | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-05 | MASTER-196 | FAILANALREPO | Reply section - Production | Department reply / extension | Editable by Production users when CurrentAction = Production Reply stage | Production Staff / Production Approver | AppComProd, RejDate_P, Status1_P, AppComProd_1, RejDate_P_1, Status1_P_1, NewReplyDatePROD, ExtReasonPROD, PRDStatus, Remarks_P, RevBy_P, RevDate_P | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-06 | MASTER-196 | FAILANALREPO | Verification and follow-up | Verification / follow-up | Editable by Verifier when CurrentAction = Verification stage | Verifier / Reviewer | CC4, Body, NewStatus, FollowUpDate, Conclusion, CC4_1, Body_1, NewStatus_1, FollowUpDate_1, Conclusion_P | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-07 | MASTER-196 | FAILANALREPO | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor / Process owner | WDDate, WDBy, WDrawnCom, WDStatus | Derived from section name |
| RSR-MTN-FAILANALREPO-PNG-08 | MASTER-196 | FAILANALREPO | Hidden / routing fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | Approval, Dept. Head, Readers, QA, QA2, ISG, RejMail, CurrentAction candidate, approval/status/review fields | Derived from field pattern |

## MTN / Maintenance - Maintenance Plan

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-MTN-MAINPLAN-01 | MASTER-197 | MAINPLAN | SECTION A - Plan request | Request / plan details | Always visible; editable by Requester / Maintenance Planner on draft | Requestor / Maintenance Planner | txtSrNo, Type, Company, EqName, MWC, Cycle, Others, PMJD, TMonth, TYear, JustReason, Requester, ReqDate | Derived from section name |
| RSR-MTN-MAINPLAN-02 | MASTER-197 | MAINPLAN | SECTION B - Acceptance | Acceptance | Editable by Acceptance Reviewer when CurrentAction = Acceptance stage | Acceptance Reviewer | AcceptedBy, Acceptance, AccBy, AccDate, SecBRem | Derived from section name |
| RSR-MTN-MAINPLAN-03 | MASTER-197 | MAINPLAN | SECTION C - Facilities Approval | Approval / rejection | Editable by Facilities Approver when CurrentAction = Facilities Approval stage | Facilities Approver | AppBy, AppDate, SecCRem | Derived from section name |
| RSR-MTN-MAINPLAN-04 | MASTER-197 | MAINPLAN | SECTION D - Maintenance Acknowledgement | Acknowledgement / completion | Editable by Maintenance when CurrentAction = Acknowledgement stage | Maintenance Staff | MPlan, AckBy, AckDate, SecDRem | Derived from section name |
| RSR-MTN-MAINPLAN-05 | MASTER-197 | MAINPLAN | Hidden / routing fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction/CA candidate, approver routing signals, ECM E&I, ECMEI, ECMFAC, ECMMAT, approval status values | Derived from field pattern |

## QA / QA - Audit Corrective Action Request (Johor)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-QAAUDICORR-01 | MASTER-082 | QAAUDICORR | Header | Request details | Always visible; editable by Auditor on draft | Auditor | CompanyName, QACARNo, AuditDate, IssueDate, AuditLoc, Department, CC | Derived from section name |
| RSR-QA-QAAUDICORR-02 | MASTER-082 | QAAUDICORR | Auditor's Section | Initiation | Always visible; editable by Auditor on draft | Auditor | AuditorName, AuditeeName, AuditeeList, InitiatedBy, IdentifiedDate, DivHead1, AudCC | Derived from section name |
| RSR-QA-QAAUDICORR-03 | MASTER-082 | QAAUDICORR | Audit System | Audit classification | Always visible; editable by Auditor on draft | Auditor | AuditSystem, CurrDueDate | Derived from section name |
| RSR-QA-QAAUDICORR-04 | MASTER-082 | QAAUDICORR | Non-Conformity Description & Classification | Non-conformance detail | Always visible; editable by Auditor on draft | Auditor | Class, Clause, NCDetails, Attachment1 | Derived from section name |
| RSR-QA-QAAUDICORR-05 | MASTER-082 | QAAUDICORR | Auditee's Section — Correction / Corrective Action | Auditee response | Editable by Auditee / Dept when CurrentAction = Auditee Reply stage | Auditee / Department | ProposeBy, ProposedDate, NoOfReply | Derived from section name |
| RSR-QA-QAAUDICORR-06 | MASTER-082 | QAAUDICORR | Div/Dept Head Review | Approval | Editable by HOD / Division Head when CurrentAction = HOD Review stage | HOD / Division Head | DivHead, DivAccDate, Status1, HeadDivComments | Derived from section name |
| RSR-QA-QAAUDICORR-07 | MASTER-082 | QAAUDICORR | Verification of Corrective Actions (QA) | Verification | Editable by QA Admin when CurrentAction = QA Verification stage | QA Admin | Auditor1, AcceptedDate, Status2, CommentAuditor, Status, AuditorComments, Attach, AuditorComments1, Attach1, ClosedBy, AgreedDate1, Workstations | Derived from section name |
| RSR-QA-QAAUDICORR-08 | MASTER-082 | QAAUDICORR | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction/CA, Isadmin, routing/mailing fields | Derived from field pattern |

## QA / QA - CCCAR 2025 (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-CCCA2025-01 | MASTER-242 | CCCA2025 | Header / CCCAR Request | Request details | Always visible; editable by QA / Requestor on draft | QA Admin / Requestor | CCCARNo, Disp_Datesent, DateSent, Nature, contname1-2, Requestor1/NoIdRequestor1, Location, Recipient1/NoIdRecipient1, SELECT/Location2, CC1, MKTPIC | Derived from section name |
| RSR-QA-CCCA2025-02 | MASTER-242 | CCCA2025 | Verification of Complaint | Complaint verification | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, ReviewBy2, DateVerify, CPA2, Comment1_2, Attachment3_1, Rejp | Derived from section name |
| RSR-QA-CCCA2025-03 | MASTER-242 | CCCA2025 | PCQI Verification | PCQI/QA review | Editable by PCQI / QA when CurrentAction = PCQI Verification stage | QA Admin / PCQI | ReviewBy, CC5, CPA_1, Comments_1, Comment1_1, attach_1, ReviewByHOD, DateCommentSent, CC3, CPA, Comment1, Attachment3, Comment4 | Derived from section name |
| RSR-QA-CCCA2025-04 | MASTER-242 | CCCA2025 | Corrective Action Verification — Implementation | Verification | Editable by QA when CurrentAction = Implementation Verification stage | QA Admin | CC4, VerifiedOn, Body, NewStatus, FollowUpDate | Derived from section name |
| RSR-QA-CCCA2025-05 | MASTER-242 | CCCA2025 | Corrective Action Verification — Effectiveness | Verification | Editable by QA when CurrentAction = Effectiveness Verification stage | QA Admin | VerifiedOn_1, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-QA-CCCA2025-06 | MASTER-242 | CCCA2025 | Food Safety / Root Cause Analysis | Supporting analysis | Editable by QA / PCQI alongside corrective action sections | QA Admin / PCQI | HazardYesNO, CAComment, ROYesNO, ROComment, Reccurrence, RecComment, Deadline, DeadlineComment, MeetingDate, Remark, Workstations, PARLink | Derived from field pattern |
| RSR-QA-CCCA2025-07 | MASTER-242 | CCCA2025 | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Authors, CDate, AEditor1-5, QA/QA2, QAAdmin, ISG, app1-4, FST, ACM/AES/DCM/ECM, AllPICA/AllPIC, mailing lists, LockSection1-2 | Derived from field pattern |

## QA / QA - Change Control Form (Johor)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-CHANCONT-01 | MASTER-073 | CHANCONT | Change Control Header | Request details | Always visible; editable by Requestor on draft | Requestor | CCNo, CCDesc, CCMeetDate, Attachment, Viewer | Derived from section name |
| RSR-QA-CHANCONT-02 | MASTER-073 | CHANCONT | Possible Impact Assessment | Impact checklist | Always visible; editable by Requestor on draft | Requestor | CCP_1 through CCP_7 impact area checkboxes | Derived from section name |
| RSR-QA-CHANCONT-03 | MASTER-073 | CHANCONT | Action | Action planning | Editable by Requestor during initiation; read-only after submission | Requestor | Change action details (fields unconfirmed — PDF fallback match) | Inferred |
| RSR-QA-CHANCONT-04 | MASTER-073 | CHANCONT | Verification / Approval | Approval | Editable by QA / Approver when CurrentAction = Approval stage | QA Admin / Approver | Verification and approval fields (fields unconfirmed — PDF fallback match) | Inferred |
| RSR-QA-CHANCONT-05 | MASTER-073 | CHANCONT | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA/CurrentAction, routing, status fields | Derived from field pattern |

## QA / QA - Change Control Form NEW (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-CHANCONTNEW-01 | MASTER-244 | CHANCONT | Change Control Request Header | Request details | Always visible; editable by Requestor on draft | Requestor | ChangeControlNo, changereq1, DateStart, DateEnd, Loc, Year/Month/CNO, CoName | Derived from section name |
| RSR-QA-CHANCONTNEW-02 | MASTER-244 | CHANCONT | Facilities / Engineering / Change Details | Supporting detail | Always visible; editable by Requestor on draft | Requestor | RptAttach, CRemarks, PreparedBy, PreDate, TrainingNeeded, TrainingConducted, Rem2, Rem3 | Derived from section name |
| RSR-QA-CHANCONTNEW-03 | MASTER-244 | CHANCONT | Pre-Approval / Department Owner | Pre-approval | Editable by Dept Owner when CurrentAction = Pre-Approval stage | Department Owner | deptownername, datedept, appcom1, Attach_pre, ChangeYesNo, ChangeYesNo_1/DatePractice | Derived from section name |
| RSR-QA-CHANCONTNEW-04 | MASTER-244 | CHANCONT | Final Approval / All HODs | Final approval | Editable by HODs when CurrentAction = Final Approval stage | HOD / Division Head | AllHODAPP, HOD3 | Derived from section name |
| RSR-QA-CHANCONTNEW-05 | MASTER-244 | CHANCONT | QA / Marketing Review | QA and Marketing review | Editable by QA / Marketing when CurrentAction = QA/Marketing Review stage | QA Admin / Marketing Manager | MKTStatus, MKTHead, MKTDate, Impact, Discussion, Rem, DocumentsRevised, MKTInformCust, Rem3 | Derived from section name |
| RSR-QA-CHANCONTNEW-06 | MASTER-244 | CHANCONT | Brainstorming Section | Supporting meeting record | Always visible when brainstorming sub-form is active; editable by Requestor | Requestor | CCNo, CCDesc, CCMeetDate, Attachment, Viewer | Derived from section name |
| RSR-QA-CHANCONTNEW-07 | MASTER-244 | CHANCONT | Checklist for Qualifying Critical Equipment | Equipment checklist | Visible when critical equipment checklist sub-form is active; editable by QA / Engineering | QA Admin / Engineering | EquipName, CCLocation | Derived from section name |
| RSR-QA-CHANCONTNEW-08 | MASTER-244 | CHANCONT | Discarded / Withdrawn | Withdrawal | Visible when CurrentAction = Discarded; editable by Requestor | Requestor | DiscardedBy, DiscardedOn, Reason | Derived from section name |
| RSR-QA-CHANCONTNEW-09 | MASTER-244 | CHANCONT | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, Editor1-9/AEditor1-9, QA/QA2, IT, QAAdmin, SHEAdmin, CCACM/CCAES/CCASN/CCDCM, mailing lists, RemDate, ReplyNo | Derived from field pattern |

## QA / QA - Deviation Investigation Report (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-DEVIINVEREPO-01 | MASTER-246 | DEVIINVEREPO | Header / Initiation | Request details | Always visible; editable by QA Requestor on draft | Requestor (QA) | PDRNo, Requestor1, Company, To, CC, isCCP, WorkArea, Product, BatchNo, IncDate, Year/Month/INO | Derived from section name |
| RSR-QA-DEVIINVEREPO-02 | MASTER-246 | DEVIINVEREPO | Recipient's Reply | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | Repliedby, RepliedDate | Derived from section name |
| RSR-QA-DEVIINVEREPO-03 | MASTER-246 | DEVIINVEREPO | QC Head Approval | Approval | Editable by QC Head when CurrentAction = QC Head Approval stage | QC Head | QCName, QCAcceptance, QCDate, DateReplySent | Derived from section name |
| RSR-QA-DEVIINVEREPO-04 | MASTER-246 | DEVIINVEREPO | Division / Department Head Approval | Approval | Editable by HOD when CurrentAction = HOD Approval stage | HOD / Division Head | HOD, Approvals, HODName, HODAcceptance, HODDate | Derived from section name |
| RSR-QA-DEVIINVEREPO-05 | MASTER-246 | DEVIINVEREPO | QA / PCQI Approval | Approval | Editable by QA/PCQI and COO when CurrentAction = QA/PCQI Approval stage | QA Admin / PCQI / COO | QAName, QAAcceptance, QADate, COOName, COOAcceptance, COODate | Derived from section name |
| RSR-QA-DEVIINVEREPO-06 | MASTER-246 | DEVIINVEREPO | Implementation / Corrective Action | Verification | Editable by QA when CurrentAction = Implementation stage | QA Admin | SendToImp, Body, NewStatus, FollowUpDate | Derived from section name |
| RSR-QA-DEVIINVEREPO-07 | MASTER-246 | DEVIINVEREPO | Effectiveness Verification | Verification | Editable by QA when CurrentAction = Effectiveness stage | QA Admin | NewStatus_1, Body_1 | Derived from section name |
| RSR-QA-DEVIINVEREPO-08 | MASTER-246 | DEVIINVEREPO | Root Cause / Food Safety Analysis | Supporting analysis | Editable by QA / PCQI alongside approval sections | QA Admin / PCQI | HazardYesNO, CAComment, ROYesNO, ROComment, Reccurrence, RecComment, Deadline, DeadlineComment, Category, RootCause_1, PARLink | Derived from field pattern |
| RSR-QA-DEVIINVEREPO-09 | MASTER-246 | DEVIINVEREPO | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDRemarks, WDStatus | Derived from section name |
| RSR-QA-DEVIINVEREPO-10 | MASTER-246 | DEVIINVEREPO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, ISADMIN, QAAdmin, QC, QA, QAHOD, QCHOD, COO, FST/ACMFST/ECMFST, PCQI, SELFST, Editor1-11, Defcc, AllPIC, RemDate | Derived from field pattern |

## QA / QA - GMP Inspection Report (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-GMPINSPREPO-01 | MASTER-252 | GMPINSPREPO | GMP Inspection Report Header | Audit details | Always visible; editable by Auditor on draft | Auditor | Company, AuditPeriod, AuditLocation, AuditDate, Auditor, Auditee, IssueTo, DueDate, CC, Score, Grade, Attachment | Derived from section name |
| RSR-QA-GMPINSPREPO-02 | MASTER-252 | GMPINSPREPO | Section A — Inspection Findings | Findings detail | Always visible; editable by Auditor on draft | Auditor | GO, GMPActionPlan, AuditorComment, ActionPlanNeed, InitiatedBy, InitiatedDate | Derived from section name |
| RSR-QA-GMPINSPREPO-03 | MASTER-252 | GMPINSPREPO | Section B — Summary of Inspection | Repeating inspection scores | Always visible; editable by Auditor on draft | Auditor | F_1_1 through F_9_1 (category scores and findings rows) | Derived from section name |
| RSR-QA-GMPINSPREPO-04 | MASTER-252 | GMPINSPREPO | Auditee Acknowledgement | Acknowledgement | Editable by Auditee / HOD when CurrentAction = Acknowledgement stage | Auditee / HOD | AcknowledgeBy, AcknowledgeDate, HOD, ProposedBy, ProposedDate | Derived from section name |
| RSR-QA-GMPINSPREPO-05 | MASTER-252 | GMPINSPREPO | Review / Acceptance | Review/acceptance | Editable by QA Reviewer when CurrentAction = Review/Acceptance stage | QA Reviewer | ReviewedBy, Acceptance, AccComments, AcceptedBy, AcceptedDate, Acceptance_1, AccComments_1, WDReason | Derived from section name |
| RSR-QA-GMPINSPREPO-06 | MASTER-252 | GMPINSPREPO | Inspection Plan | Scheduling reference | Always visible; editable by QA Admin (scheduling) | QA Admin | Year, Period, InitiatedDate, Remark, Distributedby, List1-6, DD1-12, ND_7-12 | Derived from section name |
| RSR-QA-GMPINSPREPO-07 | MASTER-252 | GMPINSPREPO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, CA, Editor1-5, IT, QA, FST, ECMFST, INO, QAHOD, DisributionList, RemCC1-3 | Derived from field pattern |

## QA / QA - ICAR (Penang)

> FormCode: `INTERN` stored in `MainDB_HR`. Covers External Audit ICAR and Internal ICAR sub-forms.

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-ICAR-PNG-01 | MASTER-265 | INTERN | External Audit Section | External audit record | Always visible when External Audit sub-form is active; editable by QA / Marketing PIC | QA Admin / Marketing PIC | Customer, DateAudit_1/DateAudit_1_1, MKTPIC, Product, AuditStatus, AuditReport, CorrectiveAction, Remark, SendTo, CC, RemDate, CertBody, TypeOfAudit, Scope, Rem_1 | Derived from section name |
| RSR-QA-ICAR-PNG-02 | MASTER-265 | INTERN | ICAR Header / Initiation | Request details | Always visible; editable by Requestor (QA) on draft | Requestor (QA) | ICARNo, DateSent, Requestor1, Location, Recipient1, Location2, CC1, DueDate, RespondBy, FSafety | Derived from section name |
| RSR-QA-ICAR-PNG-03 | MASTER-265 | INTERN | Non-Conformance Description | Non-conformance detail | Always visible; editable by Requestor on draft | Requestor | PDesc, Attachment | Derived from section name |
| RSR-QA-ICAR-PNG-04 | MASTER-265 | INTERN | QA Review / Div Head (CC5/CPA_1) | Review/acceptance | Editable by QA / HOD when CurrentAction = QA Review stage | QA Admin / HOD | DateReviewed, CC5, CPA_1, ReviewedBy, attach_1, NewDateReview, Commentedby, DateCommentSent, CC3 | Derived from section name |
| RSR-QA-ICAR-PNG-05 | MASTER-265 | INTERN | Corrective Action Verification — Implementation | Verification | Editable by QA when CurrentAction = Implementation Verification stage | QA Admin | CPA, Comment1_1, IniAtt, VerifiedOn_1, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-QA-ICAR-PNG-06 | MASTER-265 | INTERN | Root Cause / Food Safety Analysis | Supporting analysis | Editable by QA / PCQI alongside verification sections | QA Admin | Hazard, HComment, RO, RComment, Reccurrence, RecComment, Deadline, DeadlineComment, Workstations, PARLink | Derived from field pattern |
| RSR-QA-ICAR-PNG-07 | MASTER-265 | INTERN | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDAttach, WDRemarks, WDStatus | Derived from section name |
| RSR-QA-ICAR-PNG-08 | MASTER-265 | INTERN | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Authors/Authors_1, CDate, Editors_1, QAAdmin, QA/QA2, DH, AEditor1-10, ISAdmin, OSM, MailA, LockSection1-2, CAStatus | Derived from field pattern |

## QA / QA - Internal Corrective Action (Johor)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-INTECORRACTI-01 | MASTER-077 | INTECORRACTI | Header / Initiation | Request details | Always visible; editable by Requestor (QA) on draft | Requestor (QA) | ICARNo, DateSent, Requestor1/NoIdRequestor1, Location, Recipient1/NoIdRecipient1, Location2, CC1, DueDate, RespondBy, FS | Derived from section name |
| RSR-QA-INTECORRACTI-02 | MASTER-077 | INTECORRACTI | Non-Conformance Description | Non-conformance detail | Always visible; editable by Requestor on draft | Requestor | PDesc, Attachment | Derived from section name |
| RSR-QA-INTECORRACTI-03 | MASTER-077 | INTECORRACTI | Recipient's Reply | Recipient response | Editable by Recipient / Dept when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, DivHead, Attachment_1, HazardYesNO, HazardComment, ROYesNO, ROComment | Derived from section name |
| RSR-QA-INTECORRACTI-04 | MASTER-077 | INTECORRACTI | QA / Div Head Review | Review/acceptance | Editable by QA / HOD when CurrentAction = QA Review stage | QA Admin / HOD | DateReviewed, CC5, CPA_1, Comment1, attach_1, NewDateReview, DateCommentSent, CC3 | Derived from section name |
| RSR-QA-INTECORRACTI-05 | MASTER-077 | INTECORRACTI | Corrective Action Verification — Implementation | Verification | Editable by QA when CurrentAction = Implementation Verification stage | QA Admin | CPA, Comment1_1, IniAtt, CC4, VerifiedOn, Body, VerifiedBy, NewStatus, FollowUpDate | Derived from section name |
| RSR-QA-INTECORRACTI-06 | MASTER-077 | INTECORRACTI | Corrective Action Verification — Effectiveness | Verification | Editable by QA when CurrentAction = Effectiveness Verification stage | QA Admin | VerifiedOn_1, Body_1, attach_2, NewStatus_1, FWUpDate | Derived from section name |
| RSR-QA-INTECORRACTI-07 | MASTER-077 | INTECORRACTI | Recurrence / Root Cause | Supporting analysis | Editable by Recipient alongside reply section | Recipient / Department | Reccurrence, RecComment, RootCause, PARLink | Derived from field pattern |
| RSR-QA-INTECORRACTI-08 | MASTER-077 | INTECORRACTI | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDAttach, WDRemarks, WDStatus | Derived from section name |
| RSR-QA-INTECORRACTI-09 | MASTER-077 | INTECORRACTI | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, AEditor1-6, QA, QAAdmin, ISAdmin, QualityCouncil, AllHODGroup, mailing lists, LockSection1-2 | Derived from field pattern |

## QA / QA - NCR & Internal Audit Report (Johor)

> Very sparse source — fallback PDF match only. Fields and sections are minimally confirmed.

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-NCRINTEAUDI-01 | MASTER-069 | NCRINTEAUDI | Survey / Initiation | Request/survey entry | Always visible; editable by Requestor (QA Auditor) on draft | Requestor (QA Auditor) | Ini (Initiator), Rec (Recipient) — sparse; confirm against DXL | Inferred |
| RSR-QA-NCRINTEAUDI-02 | MASTER-069 | NCRINTEAUDI | Hidden / Routing Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA/CurrentAction, routing fields — confirm against DXL | Inferred |

## QA / QA - OFI (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-OFI-PNG-01 | MASTER-268 | OFI | MSDS Document Header | Document management | Always visible; editable by Document Owner / QA Admin | Document Owner / QA Admin | DN, IN, DateIssued, DateReview, Product, TradeName, CommercialName, CommonName, Status1, DocNo, IssuNo, Authors, Editors, Author_APP, Author_DH, Readers, ObsoleteDate, ReviewDate | Derived from section name |
| RSR-QA-OFI-PNG-02 | MASTER-268 | OFI | OFI Header / Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | OFINo, Requestor1/NoIdRequestor, Location1, Recipient1/NoIdRecipient1, Location2, CC1 | Derived from section name |
| RSR-QA-OFI-PNG-03 | MASTER-268 | OFI | OFI Description | Improvement detail | Always visible; editable by Requestor on draft | Requestor | OFIDesc, Attachment, Suggestion | Derived from section name |
| RSR-QA-OFI-PNG-04 | MASTER-268 | OFI | Recipient's Reply | Recipient response | Editable by Recipient / Dept when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, DeptHead | Derived from section name |
| RSR-QA-OFI-PNG-05 | MASTER-268 | OFI | QA Review / Acceptance | Review/acceptance | Editable by QA when CurrentAction = QA Review stage | QA Admin | DateReviewed, CC3, CPA_1, attach_1, NewDateReview, Workstations | Derived from section name |
| RSR-QA-OFI-PNG-06 | MASTER-268 | OFI | PAR Link | System cross-reference | Always visible (read-only cross-reference when PAR exists) | All authenticated users | PARLink | Derived from field pattern |
| RSR-QA-OFI-PNG-07 | MASTER-268 | OFI | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDAttach, WDrawnCom, WDStatus | Derived from section name |
| RSR-QA-OFI-PNG-08 | MASTER-268 | OFI | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Authors, CDate, ISAdmin, QAAdmin, QCMember, QA, OSM, DH, Editor1-4, mailing lists, No_Reply, HideDate | Derived from field pattern |

## QA / QA - OFI Request (Johor)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-OFI-01 | MASTER-080 | OFI | Header / Initiation | Request details | Always visible; editable by Requestor on draft | Requestor | OFINo, DateSent, Requestor1, Location1, Recipient1/NoIdRecipient1, Location2, CC1, DueDate, RespondBy | Derived from section name |
| RSR-QA-OFI-02 | MASTER-080 | OFI | OFI Description | Improvement detail | Always visible; editable by Requestor on draft | Requestor | OFIDesc, Attachment, Suggestion | Derived from section name |
| RSR-QA-OFI-03 | MASTER-080 | OFI | Recipient's Reply | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, DeptHead, Attachment_1 | Derived from section name |
| RSR-QA-OFI-04 | MASTER-080 | OFI | QA Review / Acceptance | Review/acceptance | Editable by QA when CurrentAction = QA Review stage | QA Admin | DateReviewed, CC3, CPA_1, attach_1, NewDateReview, QAComm, Workstations | Derived from section name |
| RSR-QA-OFI-05 | MASTER-080 | OFI | PAR Link | System cross-reference | Always visible (read-only cross-reference when PAR exists) | All authenticated users | PARLink | Derived from field pattern |
| RSR-QA-OFI-06 | MASTER-080 | OFI | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDAttach, WDrawnCom, WDStatus | Derived from section name |
| RSR-QA-OFI-07 | MASTER-080 | OFI | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Editor1-4, ISAdmin, QAAdmin, QCMember, QualityCouncil, mailing lists | Derived from field pattern |

## QA / QA - Preventive Action Report (Penang)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-PREVACTIREPO-01 | MASTER-269 | PREVACTIREPO | Header / Initiation | Request details | Always visible; editable by Requestor (QA) on draft | Requestor (QA) | PARNo, IssuedDate, PARInitiator, LocInitiator, PARRecipient/RecipientName, SELECT, PARCC, NextReminder, PARAtt | Derived from section name |
| RSR-QA-PREVACTIREPO-02 | MASTER-269 | PREVACTIREPO | Potential Non-Conformance Description | Non-conformance detail | Always visible; editable by Requestor on draft | Requestor | Non-conformance description fields (detail unconfirmed — confirm against DXL) | Inferred |
| RSR-QA-PREVACTIREPO-03 | MASTER-269 | PREVACTIREPO | Proposed Preventive Action | Action planning | Always visible; editable by Requestor on draft | Requestor | Proposed preventive action fields (detail unconfirmed — confirm against DXL) | Inferred |
| RSR-QA-PREVACTIREPO-04 | MASTER-269 | PREVACTIREPO | Requestor's Section — Submission | Request submission | Always visible; editable by Requestor; gated by Editor1 | Requestor | Editor1-gated requestor fields | Derived from field pattern |
| RSR-QA-PREVACTIREPO-05 | MASTER-269 | PREVACTIREPO | Recipient's Section — Acceptance | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage; gated by Editor2 | Recipient / Department | DateReplied, CCReply, AcceptanceStatus, Justify (inferred from Johor equivalent) | Inferred |
| RSR-QA-PREVACTIREPO-06 | MASTER-269 | PREVACTIREPO | QA's Section — Implementation Verification | Verification | Editable by QA when CurrentAction = Implementation Verification stage; gated by Editor3 | QA Admin | VerifiedOn_1, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-QA-PREVACTIREPO-07 | MASTER-269 | PREVACTIREPO | QA's Section — Effectiveness Verification | Verification | Editable by QA when CurrentAction = Effectiveness Verification stage; gated by Editor4 | QA Admin | Effectiveness verification fields; LockSection2 gate | Derived from section name |
| RSR-QA-PREVACTIREPO-08 | MASTER-269 | PREVACTIREPO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | DocAuthor, CDate, CurrentAction, Year/Month/INO, Editor1-4, Recipient, QA, MailingList1-4, LockSection1-2, ReplyStatus, QualityCouncil, QAAdmin | Derived from field pattern |

## QA / QA - Preventive Action Request (Johor)

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QA-PREVACTI-01 | MASTER-081 | PREVACTI | Header / Initiation | Request details | Always visible; editable by Requestor (QA) on draft | Requestor (QA) | PARNo, IssuedDate, PARInitiator, LocInitiator, PARRecipient/RecipientName, LocRecipient, PARCC, DueDate, NextReminder, PARAtt | Derived from section name |
| RSR-QA-PREVACTI-02 | MASTER-081 | PREVACTI | Potential Non-Conformance Description | Non-conformance detail | Always visible; editable by Requestor on draft | Requestor | Non-conformance description fields (detail unconfirmed — confirm against DXL) | Inferred |
| RSR-QA-PREVACTI-03 | MASTER-081 | PREVACTI | Proposed Preventive Action | Action planning | Always visible; editable by Requestor on draft | Requestor | Proposed preventive action fields (detail unconfirmed — confirm against DXL) | Inferred |
| RSR-QA-PREVACTI-04 | MASTER-081 | PREVACTI | Recipient's Section — Acceptance | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplied, CCReply, AcceptanceStatus, Justify | Derived from section name |
| RSR-QA-PREVACTI-05 | MASTER-081 | PREVACTI | Preventive Action Verification — Implementation | Verification | Editable by QA when CurrentAction = Implementation Verification stage | QA Admin | CC4, VerifiedOn, Body, VerifiedBy, NewStatus, FollowUpDate | Derived from section name |
| RSR-QA-PREVACTI-06 | MASTER-081 | PREVACTI | Preventive Action Verification — Effectiveness | Verification | Editable by QA when CurrentAction = Effectiveness Verification stage | QA Admin | VerifiedOn_1, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-QA-PREVACTI-07 | MASTER-081 | PREVACTI | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | DocAuthor, CDate, Editor1, Editor3, Editor4, CurrentAction, QA, QAAdmin, ISAdmin, QualityCouncil, mailing lists, LockSection1-2 | Derived from field pattern |

## QC / QC - Lab Work Request

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QC-LABWORK-01 | MASTER-101 | LABWORK | Header / R&D-Misc Section | Request details | Always visible; editable by Requestor on draft | Requestor | Year, DisTo, Category, Desc, Attach, Remark | Derived from section name |
| RSR-QC-LABWORK-02 | MASTER-101 | LABWORK | Requestor's Section | Request submission | Always visible; editable by Requestor on draft | Requestor | PurposeSel, QCSel, MISC1, RNDSel, MISC2, Recipient, LWRNo, CC, DateSent, cboLabLoc2 | Derived from section name |
| RSR-QC-LABWORK-03 | MASTER-101 | LABWORK | Sample Details | Sample information | Always visible; editable by Requestor on draft | Requestor | RequestedBy, ApprovedBy, SamName, SamDesc, ReceivedFrom, SONo, LotNo, SamQty, ReceiptDate, Att1, Others_1 | Derived from section name |
| RSR-QC-LABWORK-04 | MASTER-101 | LABWORK | Analysis Required | Analysis request | Always visible; editable by Requestor on draft | Requestor | PreDate, ReqDate, AppDate, PreComment, ReqComment, AppComment, statusapp1-3, QCAttach, FinalComment | Derived from section name |
| RSR-QC-LABWORK-05 | MASTER-101 | LABWORK | QC / R&D Section — Analysis Results | Analysis output | Editable by QC / R&D Chemist when CurrentAction = QC Analysis stage | QC Admin / R&D Chemist | AnalysedBy, AnalysisDate, VerifiedBy, cc2, DateVerified, FinalComments, statusapp4 | Derived from section name |
| RSR-QC-LABWORK-06 | MASTER-101 | LABWORK | Customer Survey / Feedback | Survey submission | Visible when customer survey sub-form is triggered; editable by Customer | Customer / External Respondent | SendToName/SendTo, Submittedby, Submittedon, Respondby, TtlPs, TtlQs, Score, Comment, Name/Completedby, JobTitle, Dept, Completedon | Derived from section name |
| RSR-QC-LABWORK-07 | MASTER-101 | LABWORK | Withdrawn / Discarded | Withdrawal | Visible when CurrentAction = Discarded; editable by Requestor | Requestor | WDBy, WDDate, WDReason | Derived from section name |
| RSR-QC-LABWORK-08 | MASTER-101 | LABWORK | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, QC, QCADMIN, Editor2-3, Initiator, Requestor, Verificator, Chemist, MailGurudev, namesMailingList1-3, ISG, DisplayNum | Derived from field pattern |

## QC / QC - OOS Report

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QC-OOSREPO-01 | MASTER-112 | OOSREPO | Header / Initiation | Request details | Always visible; editable by Requestor (QC) on draft | Requestor (QC) | RefNo, DateSent, Requestor1/NoIdRequestor1, Location, Recipient1/NoIdRecipient1, Location2, CC1, Attachment | Derived from section name |
| RSR-QC-OOSREPO-02 | MASTER-112 | OOSREPO | Recipient's Reply | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, Attachment_1 | Derived from section name |
| RSR-QC-OOSREPO-03 | MASTER-112 | OOSREPO | Root Cause Review | Root cause analysis | Editable by QC Admin / HOD when CurrentAction = Root Cause Review stage | QC Admin / HOD | DateReviewed, CC5, CPA_1, Comment1, Significance, attach_1, NewDateReview | Derived from section name |
| RSR-QC-OOSREPO-04 | MASTER-112 | OOSREPO | Testing / Retesting Results | Lab results detail | Editable by QC Chemist during testing/retesting stage | QC Admin / Chemist | Selection1, Date2_1, Comment1_2_1, attach_1_1_1 | Derived from section name |
| RSR-QC-OOSREPO-05 | MASTER-112 | OOSREPO | Corrective Actions | Action planning | Editable by Recipient / Dept when corrective actions are identified | Recipient / Department | Selection2, Date2, Comment1_2, attach_1_1 | Derived from section name |
| RSR-QC-OOSREPO-06 | MASTER-112 | OOSREPO | Verification — Implementation | Verification | Editable by QC Admin when CurrentAction = Implementation Verification stage | QC Admin | CC3, CPA, Comment1_1, CC4, VerifiedOn, Body, VerifiedBy, NewStatus, FollowUpDate | Derived from section name |
| RSR-QC-OOSREPO-07 | MASTER-112 | OOSREPO | Verification — Effectiveness | Verification | Editable by QC Admin when CurrentAction = Effectiveness Verification stage | QC Admin | VerifiedOn_1, Body_1, attach_2, VerifiedBy_1, NewStatus_1 | Derived from section name |
| RSR-QC-OOSREPO-08 | MASTER-112 | OOSREPO | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, CAStatus, ISG Admin, mailing/routing fields | Derived from field pattern |

## QC / QC - PQCAR

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QC-PQCA-01 | MASTER-102 | PQCA | Header | Request details | Always visible; editable by Requestor (QC) on draft | Requestor (QC) | PQCARNo, DateSent, Comp, Year, Month, INO | Derived from section name |
| RSR-QC-PQCA-02 | MASTER-102 | PQCA | Section A — Initiation | Request submission | Always visible; editable by Requestor on draft | Requestor | Requestor1/NoIdRequestor1, Recipient1/NoIdRecipient1, HOD, CC1, DueDate, RespondBy, Cat, AttachmentNC | Derived from section name |
| RSR-QC-PQCA-03 | MASTER-102 | PQCA | Section B — Recipient's Reply | Recipient response | Editable by Recipient when CurrentAction = Recipient Reply stage | Recipient / Department | DateReplySent, CC2, DivHead, Attachment_cause, RootCause | Derived from section name |
| RSR-QC-PQCA-04 | MASTER-102 | PQCA | Section C — QC Review / Acceptance | Review/acceptance | Editable by QC Admin / HOD when CurrentAction = QC Review stage | QC Admin / HOD | DateReviewed, CC5, CPA_1, Comment1, attach_1, NewDateReview | Derived from section name |
| RSR-QC-PQCA-05 | MASTER-102 | PQCA | Corrective Action Verification | Verification | Editable by QC Admin when CurrentAction = Corrective Action Verification stage | QC Admin | DateCommentSent, CC3, CPA, Comment1_1/ComDate1_1, VerifiedOn, QCVerAttach, Body, NewStatus, VerifiedBy, Category | Derived from section name |
| RSR-QC-PQCA-06 | MASTER-102 | PQCA | Management Review Minutes | Meeting record | Always visible; editable by QC Manager / GM during management review | QC Admin / General Manager | RptNo, MDate, MTime, MVenue, MChair, MAttend, Minutes, Agenda, MinBy, DesgBy, DateBy, QCBy/QCDesg/QCDate/QCRem, GMBy/GMDesg/GMDate/GMRem, Distribution | Derived from section name |
| RSR-QC-PQCA-07 | MASTER-102 | PQCA | Withdrawn | Withdrawal | Visible when CurrentAction = Withdrawn; editable by Requestor | Requestor | WDDate, WDBy, WDAttach, WDRemarks, WDStatus | Derived from section name |
| RSR-QC-PQCA-08 | MASTER-102 | PQCA | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, Authors, CDate, AEditor1-6, QAAdmin, ISAdmin, DefCC1, QANames, QualityCouncil, mailing lists, No_Reply, No_Reply_Initiator | Derived from field pattern |

## QC / QC - QA System Audit

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QC-QAAUDI-01 | MASTER-103 | QAAUDI | Method Validation / Verification Report | Technical report | Always visible; editable by QC Admin (document preparer / approver) | QC Admin | Company, ReportNo, Category, Title, ReportAttachment, IssueNo, Reason, Remark, PreBy, PreDesg, PreDate, AppBy, AppDesg, AppDate | Derived from section name |
| RSR-QC-QAAUDI-02 | MASTER-103 | QAAUDI | Section A — Audit Notification | Audit initiation | Always visible; editable by QA Auditor on draft | QA Auditor | QARNo, SendToA, CCNameA, DeptList, LocName, Purpose, Auditor, AuditDate, AuditSystem, AttachA, PreparedBy, NotifiedDate | Derived from section name |
| RSR-QC-QAAUDI-03 | MASTER-103 | QAAUDI | Section B — Audit Findings | Audit results | Editable by QA Auditor when CurrentAction = Findings Reporting stage | QA Auditor | CCNameB, AttachB, ReportedBy, NotifiedDateB | Derived from section name |
| RSR-QC-QAAUDI-04 | MASTER-103 | QAAUDI | Section C — Auditee's HOD Acceptance | Acceptance | Editable by Auditee HOD when CurrentAction = HOD Acceptance stage | Auditee HOD | AcceptanceC, CommentC, AttachmentC, AcceptedByC, NotifiedDateC | Derived from section name |
| RSR-QC-QAAUDI-05 | MASTER-103 | QAAUDI | Section D — NCR/OFI Update in System | System update | Editable by QA Admin when CurrentAction = NCR/OFI Update stage | QA Admin | Raised, CommentD, AttachmentD, UpdatedByD, NotifiedDateD | Derived from section name |
| RSR-QC-QAAUDI-06 | MASTER-103 | QAAUDI | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CurrentAction, AEditor1-4, Requestor, CreatedOn, QAMgr, QAAdmin, ISADMIN, QAMail, MailA-C | Derived from field pattern |

## QC / QC - QC PAR

| Rule ID | Source ID | Form | Section | Type | Visible / Condition | Role | Key Fields | Confidence |
|---|---|---|---|---|---|---|---|---|
| RSR-QC-QCPAR-01 | MASTER-106 | QCPAR | Resources / Obsolete Section | Reference/obsolete | Always visible (read-only reference); editable by QC Admin only | QC Admin | Year, DistributeTo, Category, Desc, Attach, Remark, ObsCom | Derived from section name |
| RSR-QC-QCPAR-02 | MASTER-106 | QCPAR | QC Chemical Preparation | Procedure record | Always visible; editable by QC Admin when active | QC Admin | DocNo, Title, Chemical, Apparatus, General, Procedure, HOD, Approvedby, Approveddate, ApprovedRem | Derived from section name |
| RSR-QC-QCPAR-03 | MASTER-106 | QCPAR | Request Analysis | Analysis request | Always visible; editable by Requestor on draft | Requestor | txtRefNo, Site, SendToQC, CC, DateSent, SelDept, RequestedBy, NewAnalysis, NewAnalysis2, Purpose, Purpose2, TankNo, Remarks | Derived from section name |
| RSR-QC-QCPAR-04 | MASTER-106 | QCPAR | HOD / Section Head Approval | Approval | Editable by HOD / Section Head when CurrentAction = HOD Approval stage | HOD / Section Head | HOD, Status, AppSubmissionDate | Derived from section name |
| RSR-QC-QCPAR-05 | MASTER-106 | QCPAR | Soap Scrap Notification | Notification | Editable by Production / QC when scrap notification is triggered | Production / QC Admin | SealNumber, PMDate, PMComm, QCMDate, QCMComm | Derived from section name |
| RSR-QC-QCPAR-06 | MASTER-106 | QCPAR | Hidden Fields | System/routing | Not rendered — system routing fields only | System (not user-visible) | CA, Editor1-4, QCADMIN, IT, CurrentAction, Requestor, INO, Year/Month, ISG, Prod, QC, CC1-2, CCList1-2, BCC, Purchasing, Marketing | Derived from field pattern |

## Caveats

- Rows are generated from already-extracted PDF requirement artifacts, not from new business confirmation.
- Role and visibility decisions are derived from section names, field patterns, and workflow signals — not DXL confirmation.
- Rows marked "Inferred" have insufficient source evidence; rows marked "Derived from section name / field pattern" are confident derivations that still require DXL/SME sign-off before build.
- Original source PDFs and XML files remain reference-only and were not modified.
