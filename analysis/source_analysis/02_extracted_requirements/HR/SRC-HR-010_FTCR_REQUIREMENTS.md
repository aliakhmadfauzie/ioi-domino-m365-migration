# Form Requirement - Fixed Term Contract Requisition Form (FTCR)

> Source ID: SRC-HR-010 | Department: HR | Promoted: 2026-06-02 | Quality: 94/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/FTCR.pdf` (4 pages, 2,822 chars)
> Promotion: Promote with Human Confirmation - approval route/status values and fixed-row table storage need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-010 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | Fixed Term Contract Requisition Form | Clearly Found |
| Form Purpose | Request, justify, review, and approve a fixed-term employment contract, including successor/training information and HR background history. | Clearly Found |
| Pages | 4 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Employee Details | 1 | Request details | EmpName, EmpNo, DOB, EmpAge, EmpPost, Dept, JoinDate, RetDate, DivHead, Attachment |
| Justification | 1 | Request details | Justification text |
| Submitted by Department/Section Head | 1 | Submission | SubBy, SubDesg, SubDate |
| Division/Department Recommendation | 1-2 | Approval/recommendation | CPeriod, Others, DivHeadJust, InSuccess, Ext, successor details, training fields |
| Endorsement | 2 | Approval/recommendation | EndBy, EndDesg, EndDate |
| Employee Background History | 2-3 | Fixed table | Year_N, AprRate_N, DisRec_N, MC_N, HL_N, A_N, L_N, NPL_N, MedEx_N |
| Approving Authority | 3 | Approval | AppHR, AppCOO, AppED with dates and remarks |
| HR Section | 3-4 | HR update/status | CaseStatus, AppFor, SpecifyOthers, NotHOD, Remarks2 |
| Hidden Fields | 4 | System/routing | CA, Editor1-Editor7, ED, SGM, HR_1, HR_2, HR, HRM, IT, Servers, Readers |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Name | `EmpName` | Person/Text | Clearly Found |
| Emp. No | `EmpNo` | Text | Clearly Found |
| Date of Birth | `DOB` | Date | Clearly Found |
| Age | `EmpAge` | Number | Clearly Found |
| Position | `EmpPost` | Text | Clearly Found |
| Dept./Section | `Dept` | Text | Clearly Found |
| Date Joined | `JoinDate` | Date | Clearly Found |
| Retirement Date | `RetDate` | Date | Clearly Found |
| HOD/HODiv | `DivHead` | Person | Clearly Found |
| Attachment | `Attachment` | Attachment | Clearly Found |
| Submitted by | `SubBy` | Person/Text | Clearly Found |
| Submitted designation | `SubDesg` | Text | Clearly Found |
| Submitted date | `SubDate` | Date | Clearly Found |
| Contract Period | `CPeriod` / `Others` | Choice/Text | Clearly Found, values need confirmation |
| Div/Dept Head Justification | `DivHeadJust` | Multiline | Clearly Found |
| Identified Successor | `InSuccess` | Choice/Boolean | Clearly Found, values need confirmation |
| External Advertisement | `Ext` | Choice/Boolean | Clearly Found, values need confirmation |
| Successor details | `SucName`, `SucEmpNo`, `SucPost`, `SucAge`, `SucDate`, `SucDept` | Mixed | Clearly Found |
| Training Required / List | `TrReq`, `TrList` | Choice + multiline | Clearly Found |
| Endorsed by | `EndBy`, `EndDesg`, `EndDate` | Person/Text/Date | Clearly Found |
| Approving authority | `AppHR`, `AppCOO`, `AppED`, date and remark fields | Mixed | Clearly Found |
| HR status | `CaseStatus`, `AppFor`, `SpecifyOthers` | Choice/Text | Clearly Found, values need confirmation |
| Notify HOD | `NotHOD` | Person/Text | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - multi-stage approval candidate | Clearly Found |
| Workflow Evidence | Submitter, department/division recommendation, endorsement, AGM HR review, COO/SGM approval, ED approval, HR status, CurrentAction and editor routing fields | Clearly Found |
| CurrentAction Field | `CA` / `CurrentAction` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `FTCR`
Child-list candidate: `MainDB_HR_Ext_FTCR_BackgroundHistory` if the 10 background-history rows should be flexible; otherwise fixed row columns can remain on the parent/extension form storage.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| FTCR-01 | Confirm the exact approval route: Department/Section Head -> Div/Dept Head -> Endorser -> AGM HR -> COO/SGM -> ED -> HR status? | High |
| FTCR-02 | What are valid `CA` / `CaseStatus` / `AppFor` values? | High |
| FTCR-03 | Should the 10 background-history rows be fixed columns or a child list? | High |
| FTCR-04 | What are choice values for contract period, identified successor, external advertisement, and training required? | Medium |
| FTCR-05 | Which role can edit the HR Section and Notify HOD fields? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with workflow/status confirmation |
| Approval Required | Yes |
| Promotion Quality | 94/100 |

