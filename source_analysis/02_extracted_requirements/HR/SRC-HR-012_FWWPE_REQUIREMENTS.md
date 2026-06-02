# Form Requirement - Foreign Worker Work Period Extension (FWWPE)

> Source ID: SRC-HR-012 | Department: HR | Promoted: 2026-06-02 | Quality: 95/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/FWWPE.pdf` (4 pages, 2,069 chars)
> Promotion: Promote with Human Confirmation - HOS optionality, CurrentAction states, and completion actors need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-012 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | Foreign Worker Work Period Extension | Clearly Found |
| Form Purpose | HR issues a foreign-worker work period extension request, superior replies, HOS/HOD/HR approve or reject, then flight/transport and income-tax completion are tracked. | Clearly Found |
| Pages | 4 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Section A - Issued by HR Personnel | 1 | Request/routing | SendTo, HOS, HOD, CC, Company, Name, EmpNo, PassportNo, Department, Section, WPExpDate, DateF, DateT, Year, DocAuthor, DateIssued |
| Section B - Reply by Superior | 1-2 | Reply/action | Status, Reason, Departure, attachment, ReplyRemark, Position, ReplyName, ReplyDate |
| Section C - Accepted by HOS | 2 | Approval | HOSStatus, HOSName, HOSDate, HOSRemark |
| Section D - Endorsed by HOD | 2 | Approval | ContStatus, HODStatus, HODName, HODDate, HODRemark |
| Section E - Approved by HR Department | 2-3 | Approval | HRHODStatus, HRHODName, HRHODDate, HRHODRemark |
| Section F - Flight & Transportation | 3 | Completion | DepartDate, DepartTime, Att, Att2, Doneby, Donedate |
| Section G - Income Tax Declaration | 3 | Completion | SubDate, Remarks, Doneby2, Donedate2 |
| Withdrawn | 3 | Withdrawal | WDDate, WDBy, WDRem |
| Hidden Fields | 3-4 | System/routing | CurrentAction, Editor1-Editor8, IT, HR, PIC1, PIC2, HRHOD, ToList, CCList, INO |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Superior | `SendTo` | Person | Clearly Found |
| Head of Section | `HOS` | Person | Clearly Found, optional in PDF |
| Head of Department | `HOD` | Person | Clearly Found |
| CC | `CC` | People/Text | Clearly Found |
| Company / Name / Employee No. | `Company`, `Name`, `EmpNo` | Text/Person | Clearly Found |
| Passport No. | `PassportNo` | Text | Clearly Found |
| Department / Section | `Department`, `Section` | Text | Clearly Found |
| Work Permit Expiry Date | `WPExpDate` | Date | Clearly Found |
| Contract Period | `DateF`, `DateT`, `Year` | Date range + number/text | Clearly Found |
| Requested by / issued date | `DocAuthor`, `DateIssued` | Person/date | Clearly Found |
| Superior reply | `Status`, `Reason`, `Departure`, `attachment`, `ReplyRemark`, `Position`, `ReplyName`, `ReplyDate` | Mixed | Clearly Found |
| HOS approval | `HOSStatus`, `HOSName`, `HOSDate`, `HOSRemark` | Mixed | Clearly Found |
| HOD endorsement | `ContStatus`, `HODStatus`, `HODName`, `HODDate`, `HODRemark` | Mixed | Clearly Found |
| HR approval | `HRHODStatus`, `HRHODName`, `HRHODDate`, `HRHODRemark` | Mixed | Clearly Found |
| Flight/transport completion | `DepartDate`, `DepartTime`, `Att`, `Att2`, `Doneby`, `Donedate` | Mixed | Clearly Found |
| Income-tax completion | `SubDate`, `Remarks`, `Doneby2`, `Donedate2` | Mixed | Clearly Found |
| Withdrawal | `WDDate`, `WDBy`, `WDRem` | Mixed | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Yes - multi-stage workflow | Clearly Found |
| Workflow Evidence | Superior reply, HOS acceptance, HOD endorsement, HR approval, completion sections, withdrawal, CurrentAction and editor routing fields | Clearly Found |
| Visible status choices | Continue / Not to Continue; Approved / Rejected; Done; Withdrawn | Clearly Found as UI text |
| CurrentAction Field | `CurrentAction` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `FWWPE`
Recommended storage: parent or HR extension fields for one-row workflow sections; optional document attachment handling for early-leave letter, flight attachment, and transport details.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| FWWPE-01 | Confirm whether HOS approval is optional/skipped when Head of Section is blank. | High |
| FWWPE-02 | What are exact `CurrentAction` state values and transition order? | High |
| FWWPE-03 | Who completes Section F and Section G, and can they be completed independently? | High |
| FWWPE-04 | Confirm full choice values for `Status`, `ContStatus`, `HOSStatus`, `HODStatus`, and `HRHODStatus`. | Medium |
| FWWPE-05 | Should attachment fields use SharePoint attachments or a dedicated document child list? | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with workflow/status confirmation |
| Approval Required | Yes |
| Promotion Quality | 95/100 |

