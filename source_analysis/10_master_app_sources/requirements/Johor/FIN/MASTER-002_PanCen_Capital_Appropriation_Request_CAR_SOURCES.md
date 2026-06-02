# Master App PDF Source - PanCen - Capital Appropriation Request (CAR)

> Master row: 2 | Site: Johor | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 2 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Capital Appropriation Request (CAR) | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | FINANCE \| PCNSVR | Source inventory |
| Form List | CAR2 - Form | Source inventory |
| Blueprint Department | FIN | Source inventory |
| Blueprint Code | CAR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/FINANCE/001_oleObject9.pdf | Extracted embedded PDF | sheet_order_fallback | 0.002 | Explicit mapping | 12 | 7834 | 99 | 35 | PANCEN CAPITAL APPROPRIATION REQUEST (CAR) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | PANCEN CAPITAL APPROPRIATION REQUEST (CAR) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Assets Costing More Than Rm1000 | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Irr % | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Rm Npv | Inferred from PDF text | Needs Human Confirmation |
| 5 | Ul_10 | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 7 | COO Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | Director's Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Request for Additional CAR Amount | Inferred from PDF text | Needs Human Confirmation |
| 10 | *Details of SAP PO raised (Committed) | Inferred from PDF text | Needs Human Confirmation |
| 11 | HOD Approval for Cancellation | Inferred from PDF text | Needs Human Confirmation |
| 12 | COO Approval for Cancellation | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SAP IO No. | SAPIONo | Number/Text | 1 | Parsed from PDF text |
| 2 | SAP Asset No. | SAPAssNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Company | Company | Text | 1 | Parsed from PDF text |
| 4 | Department | Department | Text | 1 | Parsed from PDF text |
| 5 | Project Name | ProjectName | Person/Text | 1 | Parsed from PDF text |
| 6 | Objective | Objective | Text | 1 | Parsed from PDF text |
| 7 | Start Date | StartDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Completion Date | CompDate | Date/Text | 1 | Parsed from PDF text |
| 9 | (m3)/Waste (MT) | EstAnnualSaving | Text | 1 | Parsed from PDF text |
| 10 | Purpose of Investment | Purpose | Text | 1 | Parsed from PDF text |
| 11 | Investment | EcoLife | Text | 1 | Parsed from PDF text |
| 12 | Payback | Payback | Text | 1 | Parsed from PDF text |
| 13 | IRR | IRR | Text | 1 | Parsed from PDF text |
| 14 | (apply 12% hurdle rate) | RM; NPV | Number/Text | 1 | Parsed from PDF text |
| 15 | Amount Budgeted | RM; BudgetAmt | Number/Text | 1 | Parsed from PDF text |
| 16 | Budget Number | BudgetNo | Text | 1 | Parsed from PDF text |
| 17 | Executor | Executor | Text | 1 | Parsed from PDF text |
| 18 | Reviewer (HOD) | HOD | Person/Text | 1 | Parsed from PDF text |
| 19 | CC | CC | Text | 1 | Parsed from PDF text |
| 20 | Requested by | Preparedby | Person/Text | 1 | Parsed from PDF text |
| 21 | Requested Date | Prepareddate | Date/Text | 1 | Parsed from PDF text |
| 22 | Name | Reviewedby | Person/Text | 1 | Parsed from PDF text |
| 23 | Date | Revieweddate | Date/Text | 1 | Parsed from PDF text |
| 24 | Position | Reviewedpost | Text | 1 | Parsed from PDF text |
| 25 | Remark | Reviewedrem | Multiline Text | 1 | Parsed from PDF text |
| 26 | Name | ApprovedbyFIN | Person/Text | 1 | Parsed from PDF text |
| 27 | Date | ApproveddateFIN | Date/Text | 1 | Parsed from PDF text |
| 28 | Position | ApprovedFINPost | Person/Text | 1 | Parsed from PDF text |
| 29 | Remark | ApprovedFINRem | Person/Text | 1 | Parsed from PDF text |
| 30 | Name | Approvedby | Person/Text | 1 | Parsed from PDF text |
| 31 | Date | Approveddate | Date/Text | 1 | Parsed from PDF text |
| 32 | Position | Chief; Operating; Officer | Text | 1 | Parsed from PDF text |
| 33 | Remark | Approvedrem | Person/Text | 1 | Parsed from PDF text |
| 34 | Name | EDApprovedby | Person/Text | 1 | Parsed from PDF text |
| 35 | Date | EDApproveddate | Date/Text | 1 | Parsed from PDF text |
| 36 | Position | Divisional; Director | Text | 1 | Parsed from PDF text |
| 37 | Remark | EDApprovedrem | Person/Text | 1 | Parsed from PDF text |
| 38 | hard copy) | Att | Text | 1 | Parsed from PDF text |
| 39 | Remarks | Rem | Multiline Text | 1 | Parsed from PDF text |
| 40 | Completion Date | FinalCompDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Additional CAR Amount | RM; AddCARAmt | Number/Text | 1 | Parsed from PDF text |
| 42 | Location | Location | Text | 1 | Parsed from PDF text |
| 43 | Description | CARCompDesc | Multiline Text | 1 | Parsed from PDF text |
| 44 | (m3)/Waste (MT) | AnnualSaving | Text | 1 | Parsed from PDF text |
| 45 | Grand Total | RM; GrndTtl | Date/Text | 1 | Parsed from PDF text |
| 46 | CAR Amount | RM; TtlCARAmt | Number/Text | 1 | Parsed from PDF text |
| 47 | Under-spent CAR | CARUnderSpent | Text | 1 | Parsed from PDF text |
| 48 | Attachment (Photo) | Att2 | Text | 1 | Parsed from PDF text |
| 49 | Name | Reviewedby2 | Person/Text | 1 | Parsed from PDF text |
| 50 | Date | Revieweddate2 | Date/Text | 1 | Parsed from PDF text |
| 51 | Remark | Reviewedrem2 | Multiline Text | 1 | Parsed from PDF text |
| 52 | Name | Recommendby2 | Person/Text | 1 | Parsed from PDF text |
| 53 | Date | Recommenddate2 | Date/Text | 1 | Parsed from PDF text |
| 54 | Remark | Recommendrem2 | Multiline Text | 1 | Parsed from PDF text |
| 55 | Attachment | ROIAttachment | Text | 1 | Parsed from PDF text |
| 56 | Amount | RM | Number/Text | 1 | Parsed from PDF text |
| 57 | Cancelled by | CanName | Person/Text | 1 | Parsed from PDF text |
| 58 | Cancelled Date | CanDate | Date/Text | 1 | Parsed from PDF text |
| 59 | Reason | CanReason | Multiline Text | 1 | Parsed from PDF text |
| 60 | Approved by | CanName2 | Person/Text | 1 | Parsed from PDF text |
| 61 | Approved Date | CanDate2 | Date/Text | 1 | Parsed from PDF text |
| 62 | Remarks | CanReason2 | Multiline Text | 1 | Parsed from PDF text |
| 63 | Approved by | CanName3 | Person/Text | 1 | Parsed from PDF text |
| 64 | Approved Date | CanDate3 | Date/Text | 1 | Parsed from PDF text |
| 65 | Remarks | CanReason3 | Multiline Text | 1 | Parsed from PDF text |
| 66 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 67 | IT | IT | Text | 1 | Parsed from PDF text |
| 68 | IA | IA | Text | 1 | Parsed from PDF text |
| 69 | ED | ED | Text | 1 | Parsed from PDF text |
| 70 | COO | COO | Text | 1 | Parsed from PDF text |
| 71 | FIN Approver | FINApp | Person/Text | 1 | Parsed from PDF text |
| 72 | FIN | FIN | Text | 1 | Parsed from PDF text |
| 73 | FIN Admin | FINAdmin | Text | 1 | Parsed from PDF text |
| 74 | ED - exceed 200k | Exc200k | Text | 1 | Parsed from PDF text |
| 75 | Hide ED | HideED | Text | 1 | Parsed from PDF text |
| 76 | App - Completion | CompApp | Text | 1 | Parsed from PDF text |
| 77 | Completion Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 78 | Final Completion Date | FinalAppDate | Date/Text | 1 | Parsed from PDF text |
| 79 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 80 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 81 | Editor 1 - Initiator | Editor1 | Text | 1 | Parsed from PDF text |
| 82 | Editor 2 - HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 83 | Editor 3 - Finance App | Editor3 | Text | 1 | Parsed from PDF text |
| 84 | Editor 4 - COO | Editor4 | Text | 1 | Parsed from PDF text |
| 85 | Editor 5 - ED | Editor5 | Text | 1 | Parsed from PDF text |
| 86 | Editor 6 - Requestor | Editor6 | Person/Text | 1 | Parsed from PDF text |
| 87 | Editor 7 - Finance | Editor7 | Text | 1 | Parsed from PDF text |
| 88 | Editor 8 - Additional amount | Editor8 | Number/Text | 1 | Parsed from PDF text |
| 89 | Editor 9 - Executor | Editor9 | Text | 1 | Parsed from PDF text |
| 90 | Editor 10 - HOD | Editor10 | Person/Text | 1 | Parsed from PDF text |
| 91 | Editor 11 - Owner | Editor11 | Text | 1 | Parsed from PDF text |
| 92 | Editor 14 - FIN | Editor14 | Text | 1 | Parsed from PDF text |
| 93 | Editor 13 - Requestor | Editor13 | Person/Text | 1 | Parsed from PDF text |
| 94 | Editor 15 - HOD | Editor15 | Person/Text | 1 | Parsed from PDF text |
| 95 | Editor 16 - COO | Editor16 | Text | 1 | Parsed from PDF text |
| 96 | Additional Amount Requested | AddAmtReq | Number/Text | 1 | Parsed from PDF text |
| 97 | Completion Date Extended | ExtCompReq | Date/Text | 1 | Parsed from PDF text |
| 98 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 99 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (9), approve (9), hod (8), approval (4), reviewed (1), verified (1), submitted (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `CAR`
Child-list recommendation: No child list inferred from parsed field names; confirm during design

Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.

## 7. Power Apps Build Specification

| Screen/Component | Requirement | Confidence |
| --- | --- | --- |
| List | Filter by site/owner/FormCode and status | Inferred |
| New/Edit | Render parsed PDF fields grouped by inferred sections | Inferred |
| Detail | Read-only view with audit/workflow metadata | Inferred |
| Approval Actions | Show only if workflow state confirms approval is required | Needs Human Confirmation |
| Child Rows | Use editable gallery only if child-list recommendation is confirmed | Needs Human Confirmation |

## 8. Human Confirmation Questions

| # | Question | Severity |
| --- | --- | --- |
| MASTER-002-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-002-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-002-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 99 |
| Workflow Signal Count | 35 |
| Notes | - |
