# Form Requirement - Expenditure Appropriation Request Form (EARF)

> Source ID: SRC-FIN-005 | Department: FIN | Promoted: 2026-06-02 | Quality: 94/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/FIN/EARF.pdf` (4 pages, 2,611 chars)
> Promotion: Promote with Human Confirmation - routing, table storage, and completion states need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-FIN-005 | Clearly Found |
| Department | FIN | Clearly Found |
| PDF Title | Expenditure Appropriation Request Form (EARF) | Clearly Found |
| Form Purpose | Request, verify, approve, complete, and optionally cancel low-value asset expenditure requests with Finance SAP IO/asset data, asset item rows, HOD/division approvals, SAP PR details, and routing controls. | Clearly Found |
| Pages | 4 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Finance / Initiation | 1 | Request details | SAPIONo, Company, Department, AssetClass, Purpose, ExAssetNo, ExecType |
| Asset Detail Table | 1 | Fixed/repeating rows | Inv_1..Inv_5, FW_1..FW_5, UL_1..UL_5, InvAmt_1..InvAmt_5, UP_1..UP_5, SAPAssNo_1..SAPAssNo_5 |
| Justification / Attachment | 1-2 | Supporting details | TtlInvAmt, Justification, Attachment |
| Routing / Requestor | 2 | People/routing | HOD, HOD2, CC2, Preparedby, Prepareddate, Preparedpost |
| Finance Verification | 2 | Review | VerName, VerDate, VerRem |
| Department Head Approval | 2 | Approval | hodname, hoddate, hodpost, hodrem, App1 |
| Reviewed By | 2-3 | Review | CC, Reviewedby, Revieweddate, Reviewedpost, Reviewedrem, App2 |
| Division Head Approval | 3 | Approval | hodname2, hoddate2, hodpost2, hodrem2, App3 |
| Notification / Completion | 3 | Completion | NotifiedBy, NotifiedDate, CompDate, OldAsset, oldAssetRem |
| SAP PR Rows | 3 | Fixed/repeating rows | PODt_1..PODt_5, PONo_1..PONo_5 |
| Cancellation | 3-4 | Cancellation | CanName, CanDate, CanReason |
| Hidden Fields | 4 | System/routing | CA, IT, FINA, FIN1, FIN3, FIN, FINAdmin, ITHOD, ADM, MTN, ADM_CC, CC3, DH, Recommender, Servers, Readers, editors, MailingList, RemDate |

## 3. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - low-value asset approval and completion workflow | Clearly Found |
| Workflow Evidence | Finance verification, Department Head approval, reviewed-by section, Division Head approval, completion, cancellation, CurrentAction and routing fields | Clearly Found |
| CurrentAction Field | `CA` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 4. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `EARF`
Recommended storage: parent item for request/workflow data. The 5 asset rows and 5 SAP PR rows can remain fixed parent fields unless Finance requires flexible row counts or row-level reporting.

Child list candidates: `MainDB_FIN_Ext_EARFAssets`, `MainDB_FIN_Ext_EARFPRRows`

## 5. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| EARF-01 | Should asset detail rows and SAP PR rows be stored as fixed parent columns or child lists? | High |
| EARF-02 | Confirm routing rules for IT, IT HOD, Admin HOD, Maintenance HOD, Finance Admin, and Division Head based on purchase type. | High |
| EARF-03 | What are valid `CA`, `App1`, `App2`, and `App3` state values? | High |
| EARF-04 | Confirm whether Finance verification must occur before Department Head approval in all cases. | Medium |
| EARF-05 | Confirm completion and cancellation behavior after approval, including who can edit completion fields. | Medium |

## 6. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with routing/state confirmation |
| Approval Required | Yes |
| Promotion Quality | 94/100 |

