# IT Department - IT Support & Service Request Detailed Requirements

## 1. Scope

This document defines the detailed requirements for the IT Department support request module, covering:

- New Form
- My Submissions
- Submission Details
- Database and SharePoint storage

The requirement is based on the existing IT Support & Service Request module (`ITSSR`) migrated from Lotus Notes / Domino database `Current\ITSSR26.nsf` into the Power Apps Code Apps / SharePoint-backed platform.

## 2. Module Overview

| Item | Requirement |
|---|---|
| Module code | `ITSSR` |
| Module name | IT Support & Service Request |
| Source database | `Current\ITSSR26.nsf` |
| Target parent list | `MainDB_IT` |
| Target extension list | `MainDB_IT_Ext_Support` |
| Target document list | `MainDB_IT_Ext_Docs` |
| Primary users | Requestor, IT PIC, IT Admin / Helpdesk |
| Main purpose | Allow employees to submit IT issues or service requests, allow IT to triage/resolve them, and allow requestors to accept or return the resolution. |

## 3. User Roles

| Role | Description | Main permissions |
|---|---|---|
| Requestor | Employee submitting the IT request. | Create request, view own requests, edit draft/requestor section when allowed, accept or return resolved case. |
| IT PIC | IT personnel who clicks Assign & Start and takes ownership of the request. | View assigned requests, process routed requests before assignment, mark pending, resolve, reject/deny where allowed. |
| IT Admin / Helpdesk | IT group responsible for monitoring all ITSSR tickets. | View all ITSSR cases, assign/reassign PIC, process pending cases, handle support escalation. |
| System/Admin | Platform or SharePoint admin. | Configure routing, database columns, access, audit, and connector metadata. |

## 4. Workflow Requirements

The system shall support the following state flow:

```text
Draft
  -> Submitted
  -> InProgress
  -> Resolved
  -> Accepted
  -> Closed
```

Additional outcomes:

- `Denied`: IT rejects the request with a reason.
- `Submitted + Pending flag`: IT marks the case as pending without closing it.
- `Resolved -> InProgress`: requestor returns the case to IT when the solution is not accepted.

### 4.1 Status Mapping

| UI status | Legacy/Domino meaning | SharePoint status | Workflow stage |
|---|---|---|---|
| Draft | Requestor draft | `Draft` | 0 |
| Submitted | Pending IT | `PendingIT` | 1 |
| InProgress | IT PIC working | `PendingITPIC` | 2 |
| Resolved | Pending requestor acceptance | `PendingReqAcceptance` | 3 |
| Accepted | Requestor accepted | `Approved` | 4 |
| Closed | Administratively closed | `Closed` | 5 |
| Denied | IT rejected | `Denied` | 6 |

## 5. New Form Requirements

### 5.1 Entry Point

The system shall provide a New ITSSR form from the IT Department form list.

Expected route:

```text
/it/forms/itssr/new
```

The screen shall let the requestor submit a new IT support request into `MainDB_IT` and `MainDB_IT_Ext_Support`.

### 5.2 New Form Fields

| Field | Required | Source / Target | Requirement |
|---|---:|---|---|
| Company | Yes | ITSSR request section | User must select company from the configured IOI company list: IOI Corporation Berhad, IOI Properties Group Berhad, IOI Oleochemical Industries Berhad, IOI Bio-Energy Sdn Bhd, IOI Pan-Century Oleochemicals Sdn Bhd, IOI Pan-Century Edible Oils Sdn Bhd, IOI Acidchem Sdn Bhd, IOI Loders Croklaan, IOI Loders Croklaan Oils, IOI Loders Croklaan Asia, IOI Loders Croklaan Americas, IOI Loders Croklaan Europe, IOI Edible Oils Sdn Bhd, Moolgavkar Oils & Fats SDN BHD, Pamol Plantations Sdn Bhd, Syarikat Peladang Sabah Sdn Bhd, Leepang Enterprise Sdn Bhd, Sakilan Oil Palm Plantation Sdn Bhd, Ladang Sabah Sdn Bhd, Pamol (Sabah) Sdn Bhd, IOI Plantation Sdn Bhd, IOI Plantation Services Sdn Bhd, Mayvin Palm Oil Mill Sdn Bhd, Morisem Palm Oil Mill Sdn Bhd, Unico Trading Sdn Bhd, IOI Management Sdn Bhd, Woodman Enterprise Sdn Bhd, Gohtong Raya Sdn Bhd, Menang Corporation (M) Berhad, Bumiraya Impian Sdn Bhd, Uptown Spring Sdn Bhd, Excellent Bonanza Sdn Bhd, IOI Palm Biotech Sdn Bhd, Mutual Accord Sdn Bhd, IOI Research Centre Sdn Bhd, IOI Refinery Langat Sdn Bhd, Nexsol (M) Sdn Bhd, IOI Pulau Carey Resort Sdn Bhd, Canter Height Sdn Bhd, Other. |
| Department | Yes | ITSSR request section | User must select department from the configured ITSSR department list in `ITSSR_DEPARTMENTS`: Accounting, Administration, Audit, Engineering, Finance, Human Resources, Information Technology, Legal, Logistics, Marketing, Operations, Procurement, Production, Quality Assurance, Research & Development, Sales, Supply Chain, Other. |
| Service Type | Yes | ITSSR request section | Must support Hardware, Software, Network, Email, SAP, Bank, Other. |
| Hardware | Conditional | Service Type = Hardware | Show only for hardware requests. |
| Application | Conditional | Service Type = Software | Show only for software/application requests. |
| Reported By | Yes | Current user / employee picker | Auto-fill from logged-in user where possible; editable/searchable if delegated reporting is allowed. |
| Phone Extension | No | ITSSR extension | Capture phone or extension number. |
| CC Email | No | ITSSR extension | Allow requestor to add additional notification recipient. |
| Problem Description | Yes | ITSSR extension | Minimum 10 characters; must describe the issue or request. |
| Requestor Attachment | Optional | `MainDB_IT_Ext_Docs` or attachment URL | Allow supporting screenshot/document link. |
| Send To Email | System | Routing matrix | Auto-calculate from service type, application, and department. This is the routed notification recipient and may be a group email or multiple people. It is not the confirmed assigned person. |
| Assigned To Email | System | IT assignment action | Keep empty on new submission. Populate only when an IT user clicks Assign & Start, using the email address of the person who clicked the button. |

### 5.3 Validation

The New Form shall block submission when:

- Company is blank.
- Department is blank.
- Service Type is blank.
- Reported By email cannot be resolved.
- Send To Email routing cannot be resolved.
- Problem Description is blank or shorter than 10 characters.

### 5.4 Submission Behavior

On Submit, the system shall:

1. Create a parent record in `MainDB_IT`.
2. Generate a temporary title first, then update it to final case number format.
3. Use final case title format:

```text
ITSSR-YYYYDDMM.ID
```

4. Write parent record fields:

| Field | Value |
|---|---|
| `Title` | Final ITSSR case number |
| `FormCode` | `ITSSR` |
| `CurrentStatus` | Write `PendingIT` to SharePoint on initial request submission. App shall display this as `Submitted`. Do not write `InProgress` or display `InProgress` until IT confirms assignment/start. |
| `WorkflowStage` | Write `1` to SharePoint on initial request submission. App shall display Stage `1/5` and status `Submitted`. When IT clicks Assign & Start, update SharePoint to `CurrentStatus = PendingITPIC` and `WorkflowStage = 2`; app shall display `InProgress` and Stage `2/5`. |
| `SubmittedDate` | Current date/time |
| `Requestor_Email` | Reported By email |
| `EnvironmentTag` | Production by default unless running in UAT/Development |
| `IsLocked` | `false` initially |
| `Remarks` | Human-readable summary plus serialized requestor section snapshot |

5. Create extension record in `MainDB_IT_Ext_Support`.
6. Store routed recipient in `SendToEmail` / request summary only. `SendToEmail` may contain one email, multiple emails, or a group mailbox from routing.
7. Leave `AssignedToEmail` / `ITSSR_AssignedTo_Email` blank on initial submission.
8. Create document metadata in `MainDB_IT_Ext_Docs` when attachment URL is supplied.
9. Send email notification to routed `SendToEmail` recipient(s).
10. Return user to My Submissions / ITSSR list after success.

### 5.5 Auto-Routing

The New Form shall calculate routed `SendToEmail` recipient(s) using:

- Service Type
- Application
- Department
- Configured IT routing matrix

The form shall display the routed recipient before submission so the requestor can see where the case notification will go. The routed recipient is not the final assignee.

## 6. My Submissions Requirements

### 6.1 Entry Point

Expected route:

```text
/it/forms/itssr/itssr_submissiom
```

The My Submissions page must have two tabs:

- My Submission
- IT PIC

The My Submission tab shall list ITSSR cases where the current user is the initiator, creator, or requestor.

The IT PIC tab shall be shown only when the current user email is in `SendToEmail`, is in `AssignedToEmail`, is part of a group listed in `SendToEmail`, or has IT Admin/helpdesk access.

### 6.2 Visibility Rules

| User type | Records shown |
|---|---|
| Requestor / initiator / creator | Own submitted requests in My Submission tab. |
| Routed IT PIC | Submitted requests where current user email appears in `SendToEmail`, or where current user is part of a group listed in `SendToEmail`. Show these in the IT PIC tab as routed but not yet assigned when `AssignedToEmail` is empty. |
| Assigned IT PIC | Requests where current user email appears in `AssignedToEmail`. Show these in the IT PIC tab as assigned. |
| IT Admin | All ITSSR requests. |

### 6.3 List Data

Each submission row/card shall show:

- Case number / title.
- Current status.
- Workflow stage.
- Requestor name/email.
- Assigned IT PIC name/email when assigned; otherwise show routed `SendToEmail` recipient as the pending owner group/recipient.
- IT PIC tab must use different labels: `Routed / Not Assigned` when `AssignedToEmail` is empty, and `Assigned` when `AssignedToEmail` has a value.
- Submitted date.
- Problem description summary.
- Escalation indicator for active requests older than configured threshold.

### 6.4 Filters and Search

The list shall provide:

- Search by case number, requestor, assignee, problem description, and remarks.
- Status filter: All, Draft, Submitted, InProgress, Resolved, Accepted, Closed, Denied.
- My Submission and IT PIC tabs instead of a My Assignments toggle.
- Pagination with page size of 50 records.

### 6.5 Statistics

The list shall show summary counters:

- Total active.
- In progress.
- Resolved.
- Escalated.

### 6.6 Actions

| Action | Available to | Requirement |
|---|---|---|
| New ITSSR | All authorized users | Opens New Form. |
| View Details | Users with visibility | Opens Submission Details. |
| Return to Draft | Owner/Admin for active submitted/in-progress items where allowed | Changes status back to Draft and opens detail screen for editing. |

## 7. Submission Details Requirements

### 7.1 Entry Point

Expected route:

```text
/it/forms/itssr/:id
```

The Submission Details page shall provide a full case view, status timeline, tabbed sections, and stage-based actions.

### 7.2 Header

The detail page shall show:

- Back button.
- Case number.
- Current status badge.
- Pending flag when IT has marked the case as pending.
- Workflow stage timeline.

### 7.3 Tabs

The details screen shall include these tabs:

| Tab | Purpose |
|---|---|
| Request Details | Requestor section and original issue details. |
| IT Assignment | IT assignment, pending, rejection, and assignment start. |
| IT Resolution | Solution, problem category, classification, support method, IT attachment. |
| Acceptance | Requestor rating/comment and accept/return action. |
| PanCen Approval | Conditional tab for PanCen desktop/laptop requests. |
| Attachments | Requestor and IT attachment metadata. |

### 7.4 Request Details Tab

The requestor section shall show:

- Company
- Department
- Service Type
- Hardware or Application where relevant
- Reported By
- Phone Extension
- CC Email
- Routed IT PIC
- Problem Description

Edit rules:

- Requestor can edit only when status is Draft.
- IT can view this section read-only.
- On resubmit from draft, required fields and problem description validation must run again.

### 7.5 IT Assignment Tab

The IT Assignment tab shall allow IT to:

- Review routed `SendToEmail` recipient(s).
- Click Assign & Start to assign the case to the current logged-in IT user.
- Add IT remarks.
- Assign and start work.
- Mark case as pending.
- Clear pending flag.
- Reject and deny the case with mandatory remarks.

Actions:

| Action | Next status | Required data |
|---|---|---|
| Assign & Start | InProgress | Show only when `AssignedToEmail` is empty. Current logged-in IT user email must be available; system writes this email into `AssignedToEmail` / `ITSSR_AssignedTo_Email`. Hide/remove this button when `AssignedToEmail` is not empty. |
| Mark as Pending | Submitted + pending flag | IT Remarks |
| Clear Pending | Submitted | Existing pending case |
| Reject & Deny | Denied | IT Remarks |

Notifications:

- Requestor shall receive notification when case starts, is marked pending, pending is cleared, or denied.

### 7.6 IT Resolution Tab

The IT Resolution tab shall allow assigned IT users to enter:

- Solution.
- IT attachment link.
- Problem Category.
- Secondary Category.
- Classification.
- Support Method.
- Date Resolved.
- Date Notified Requestor.

Validation:

- Solution is required before marking the case as Resolved.

Action:

- Mark as Resolved changes status to `Resolved` / pending requestor acceptance.
- System shall notify requestor to review and accept.
- If an IT attachment URL is entered, metadata shall be written to `MainDB_IT_Ext_Docs`.

### 7.7 Acceptance Tab

The Acceptance tab shall allow the requestor to:

- Provide satisfaction rating from 1 to 10.
- Provide comment.
- Accept and close the case.
- Return the case to IT when issue persists.

Validation:

- Rating is required when accepting.
- Comment is required when rating is below 8.
- Comment is required or strongly recommended when returning to IT.

Actions:

| Action | Next status | Requirement |
|---|---|---|
| Accept & Close | Accepted | Store rating, comment, and accepted date. |
| Return to IT | InProgress | Notify assigned IT PIC and preserve requestor comment. |

### 7.8 PanCen Approval Tab

This tab shall appear only when the request is a PanCen desktop/laptop request.

Conditions:

- Service Type is Hardware and company/OU indicates PanCen, or
- Type2 equals `NEW REQUEST DESKTOP/LAPTOP`.

Sections:

| Section | Actor | Requirement |
|---|---|---|
| IT Verification | Requestor / IT | Store verified by and verification date. |
| IT Manager Approval | IT Manager | Store approval/rejection, approver, date, and comment. |
| COO Approval | COO / delegated IT | Required only when COO approval is set to Yes. |

### 7.9 Attachments Tab

The attachments tab shall show document metadata linked to the case:

- Requestor attachment.
- IT resolution attachment.
- Document type.
- Document title.
- Version/revision where available.
- Clickable URL where stored.

If no metadata exists, show a clear empty state.

## 8. Database Requirements

### 8.1 Parent List: `MainDB_IT`

`MainDB_IT` shall store the common workflow parent record for all IT forms.

Required ITSSR parent fields:

| Field | Requirement |
|---|---|
| `Title` | Case number, required. |
| `FormCode` | Must equal `ITSSR`. |
| `CurrentStatus` | SharePoint status value. Allowed ITSSR values: `Draft`, `PendingIT`, `PendingITPIC`, `PendingReqAcceptance`, `Approved`, `Closed`, `Denied`. App display mapping: `Draft` -> Draft, `PendingIT` -> Submitted, `PendingITPIC` -> InProgress, `PendingReqAcceptance` -> Resolved, `Approved` -> Accepted, `Closed` -> Closed, `Denied` -> Denied. |
| `WorkflowStage` | SharePoint numeric stage. Required ITSSR mapping: `0` = Draft, `1` = Submitted, `2` = InProgress, `3` = Resolved, `4` = Accepted, `5` = Closed, `6` = Denied. App must display the mapped app status, not the raw SharePoint value. |
| `SubmittedDate` | Date/time request was submitted. |
| `Requestor_Email` | Requestor email for filtering and notifications. |
| `Requestor_Name` | Requestor display name where available. |
| `Site` | Site key where available: Johor, Penang, Prai, KL, or Both Sites. |
| `EnvironmentTag` | Production, UAT, Development. |
| `IsLocked` | Indicates whether record is locked from editing. |
| `Remarks` | Human-readable summary and serialized requestor-section snapshot. |

Filtering requirements:

- My Submissions shall query only `FormCode = ITSSR`.
- Default ordering shall be `SubmittedDate desc`.
- Pagination shall use `top` and `skip`.

### 8.2 Extension List: `MainDB_IT_Ext_Support`

`MainDB_IT_Ext_Support` shall store ITSSR-specific data.

Required fields:

| Field | Purpose |
|---|---|
| `Title` | Same case number as parent. |
| `ParentFormCode` | Must equal `ITSSR`. |
| `ParentRecord` | Lookup to parent `MainDB_IT` record. |
| `ITSSR_CaseNo` | Case number. |
| `ITSSR_ServiceType` | Hardware, Software, Network, Email, SAP, Bank, Other. |
| `ITSSR_ProblemDescription` | Requestor problem/request description. |
| `ITSSR_ReportedBy_Email` | Reported by email. |
| `ITSSR_AssignedTo_Email` | Confirmed assigned IT PIC email. Blank on initial submission; populated with the current logged-in IT user's email when that user clicks Assign & Start. |
| `ITSSR_Department` | Requestor department. |
| `ITSSR_Extension` | Phone extension. |
| `ITSSR_Hardware` | Hardware item when applicable. |
| `ITSSR_Application` | Application/system when applicable. |
| `ITSSR_CC` | CC recipients. |
| `ITSSR_DateStarted` | Date IT started work. |
| `ITSSR_ITRemarks` | IT comments/remarks. |
| `ITSSR_Solution` | IT solution text. |
| `ITSSR_ProblemCategory` | Primary problem category. |
| `ITSSR_ProblemCategory2` | Secondary/root-cause category. |
| `ITSSR_ServiceType2` | Classification or secondary service type mapping. |
| `ITSSR_SupportMethod` | OnSite, Remote, Phone, Email, Others. |
| `ITSSR_DateResolved` | Date resolved by IT. |
| `ITSSR_DateNotified` | Date requestor notified. |
| `ITSSR_DateAccepted` | Date requestor accepted. |
| `ITSSR_SatisfactionRating` | Rating 1 to 10. |
| `ITSSR_RequestorComment` | Requestor acceptance/return comment. |
| `ITSSR_CS` | Legacy sub-state: 0 rejected, 1 closed, 2 pending. |
| `ITSSR_US` | Legacy user acceptance state: 0 returned, 1 accepted. |
| `ITSSR_PendingDate` | Date pending flag was set. |
| `ITSSR_OU` | OU/site, used for PanCen logic. |
| `ITSSR_Type2` | Secondary type, used for desktop/laptop approval logic. |
| `ITSSR_COOApproval` | Whether COO approval is required. |
| `ITSSR_VerifiedBy` | PanCen verification by. |
| `ITSSR_VerificationDate` | PanCen verification date. |
| `ITSSR_ManagerBy` | IT Manager approver. |
| `ITSSR_ManagerDate` | IT Manager approval date. |
| `ITSSR_COOBy` | COO approver. |
| `ITSSR_COODate` | COO approval date. |

### 8.3 Document List: `MainDB_IT_Ext_Docs`

`MainDB_IT_Ext_Docs` shall store attachment metadata for ITSSR cases.

Required fields:

| Field | Purpose |
|---|---|
| `Title` | Parent case number. |
| `ParentFormCode` | Must equal `ITSSR`. |
| `ParentRecord` | Lookup to `MainDB_IT`. |
| `ITP_DocType` | Requestor Attachment, IT Resolution, or other doc type. |
| `ITP_DocTitle` | Display title. |
| `ITP_VersionNo` | Version number, default `1`. |
| `ITP_RevisionNo` | Revision number, default `0`. |
| `ITP_DateLastUpdated` | Date metadata was created/updated. |
| `ITP_ApplicableTo` | `ITSSR`. |
| `ITP_Comments` | Attachment URL/comment. |
| `ITP_Attachment` | Attachment URL. |

### 8.4 Read Mapping

When opening a list or detail page, the system shall:

1. Load parent `MainDB_IT` record(s).
2. Load matching `MainDB_IT_Ext_Support` record(s) by parent lookup ID or case title.
3. Merge parent and extension fields into one ITSSR view model.
4. Load linked docs from `MainDB_IT_Ext_Docs` by parent lookup ID or case title.

### 8.5 Write Mapping

Updates shall write to:

- `MainDB_IT` for status, workflow stage, parent metadata, requestor email, submitted date, lock state, and summary remarks.
- `MainDB_IT_Ext_Support` for ITSSR-specific request, assignment, resolution, acceptance, pending, and PanCen fields.
- `MainDB_IT_Ext_Docs` for attachment metadata.

### 8.6 Audit and Traceability

The system shall preserve:

- Created date/time.
- Submitted date/time.
- Started date/time.
- Resolved date/time.
- Notified date/time.
- Accepted date/time.
- Assigned IT PIC.
- Requestor identity.
- IT remarks and solution.
- Requestor rating/comment.
- Status and workflow stage history where audit logging is available.

## 9. Notification Requirements

| Event | Recipient | Requirement |
|---|---|---|
| New request submitted | Routed `SendToEmail` recipient(s) | Email with case number, requestor, company/department, service type, and problem description. This is routing notification, not confirmed assignment. |
| Case assigned/start | Requestor | Inform that request is in progress and show assigned IT PIC. |
| Case pending | Requestor | Include IT pending remarks. |
| Pending cleared | Requestor | Inform requestor case is active again. |
| Case denied | Requestor | Include rejection reason. |
| Case resolved | Requestor | Include solution and request acceptance action. |
| Case returned to IT | Assigned IT PIC | Include requestor comment. |
| Case accepted | Assigned IT PIC | Include rating and comment. |

## 10. Access and Security Requirements

- Requestors shall not see other users' requests unless they are IT Admin or assigned IT PIC.
- IT Admin shall see all ITSSR records.
- Assigned IT PIC shall see records assigned to them. Before assignment, routed IT users can see submitted records when their email appears in `SendToEmail`; group-routing visibility requires the user to have IT Admin/helpdesk access or the platform must resolve group membership.
- Requestor fields are editable only while Draft or when explicitly returned to Draft.
- IT fields are editable only by IT users at the correct workflow stage.
- Acceptance fields are editable only by the requestor when status is Resolved.
- SharePoint permissions shall support ITSSR groups and users mapped from Domino access groups.

## 11. Reporting Requirements

The IT Department database/list view shall support reporting by:

- Status.
- Assigned IT PIC.
- Requestor department.
- Company/site.
- Service Type.
- Problem Category.
- Support Method.
- Date submitted.
- Date resolved.
- Satisfaction rating.
- Escalated cases.
- Pending cases.

## 12. Acceptance Criteria

The implementation is acceptable when:

- A user can submit a new ITSSR request and receive a generated case number.
- Parent record is created in `MainDB_IT`.
- Extension record is created in `MainDB_IT_Ext_Support`.
- Attachment metadata is created in `MainDB_IT_Ext_Docs` when provided.
- My Submissions shows the case for requestor, assigned IT PIC, and IT Admin according to access rules.
- Detail page shows merged parent, extension, and document data.
- IT can assign, mark pending, resolve, or deny a case.
- Requestor can accept or return a resolved case.
- Status values remain consistent across `CurrentStatus`, `WorkflowStage`, and extension sub-state fields.
- Build/runtime does not depend on mock-only data for ITSSR persistence.
