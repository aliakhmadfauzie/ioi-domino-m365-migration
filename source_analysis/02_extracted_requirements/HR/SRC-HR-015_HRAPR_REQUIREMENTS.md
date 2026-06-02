# Form Requirement - HR Applications Problem Reporting (HRAPR)

> Source ID: SRC-HR-015 | Department: HR | Promoted: 2026-06-02 | Quality: 93/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/HRAPR.pdf` (3 pages, 1,323 chars)
> Promotion: Promote with Human Confirmation - status transitions, role ownership, and auto-close/reminder behavior need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-015 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | HR Applications Problem Reporting | Clearly Found |
| Form Purpose | Report HR application problems to GHR/ISG personnel, track handling, solution, rejection, requestor acceptance, KIV/archive, reminders, and auto-close metadata. | Clearly Found |
| Pages | 3 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Header / Routing | 1 | Case details | DateCreated, DisplayCaseNo, SendTo |
| Requestor's Section | 1 | Request details | companyname, ReportedBy, Dept, EmpNo, Section, ExtNo, System, Module, Module2, ProblemDesc, Attach, CC |
| GHR/ISG Action | 1 | Action/update | ISGName, Solution, CaseStatus, StartDate, DateClosed, ISGRemarks, Attachment2 |
| Rejected | 2 | Rejection | ISGName_1, CaseStatus_1, DateReject, ISRemarks |
| Requestor's Acceptance | 2 | Acceptance | Status, DateAccept, Comment |
| KIV/Archived | 2 | Archive | KIVBy, KIVStatus, KIVDate |
| Hidden Fields | 2-3 | System/routing | CurrentAction, Requestor, AuthorsList, ISG, PIC, GHR, GHR2, HRHOD, AEditor1-3, MailingList, MailList, AutoClosedDate, RemDate, audit fields |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Sent Date | `DateCreated` | Date | Clearly Found |
| Case No. | `DisplayCaseNo` | Text | Clearly Found |
| To GHR Personnel | `SendTo` | People/Group | Clearly Found |
| Requestor identity/contact | `companyname`, `ReportedBy`, `Dept`, `EmpNo`, `Section`, `ExtNo` | Mixed | Clearly Found |
| System / Modules | `System`, `Module`, `Module2` | Choice/Text | Clearly Found |
| Problem Description | `ProblemDesc` | Multiline | Clearly Found |
| Attachment / CC | `Attach`, `CC` | Attachment/People | Clearly Found |
| Action details | `ISGName`, `Solution`, `CaseStatus`, `StartDate`, `DateClosed`, `ISGRemarks`, `Attachment2` | Mixed | Clearly Found |
| Rejection details | `ISGName_1`, `CaseStatus_1`, `DateReject`, `ISRemarks` | Mixed | Clearly Found |
| Requestor acceptance | `Status`, `DateAccept`, `Comment` | Mixed | Clearly Found |
| KIV/archive | `KIVBy`, `KIVStatus`, `KIVDate` | Mixed | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Problem-report handling workflow candidate | Clearly Found |
| Workflow Evidence | Submit, GHR/ISG action, solution/completion, rejection, requestor acceptance, KIV/archive, CurrentAction, role and reminder fields | Clearly Found |
| CurrentAction Field | `CurrentAction` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HRAPR`
Recommended storage: parent/extension fields for one-row case lifecycle data; no repeating child-table structures detected. Attachments can use SharePoint attachments unless business requires separate evidence/document records.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| HRAPR-01 | What are valid `CurrentAction`, `CaseStatus`, `CaseStatus_1`, `Status`, and `KIVStatus` values? | High |
| HRAPR-02 | Confirm workflow transitions among GHR/ISG action, rejection, requestor acceptance, KIV/archive, and auto-close. | High |
| HRAPR-03 | Which roles correspond to `ISG`, `PIC`, `GHR`, `GHR2`, and `HRHOD`, and which fields can each edit? | High |
| HRAPR-04 | Confirm reminder and auto-close behavior using `RemDate` and `AutoClosedDate`. | Medium |
| HRAPR-05 | Confirm case number generation format `Year - Month - CaseNo`. | Medium |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with status/workflow confirmation |
| Approval Required | Problem-report workflow, not classic approval |
| Promotion Quality | 93/100 |

