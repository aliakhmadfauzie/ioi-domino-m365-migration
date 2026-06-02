# Field Candidates — CWR.pdf (SRC-HR-004)

> **Form**: Contract Worker Requisition (Outsourcing) | **Dept**: HR | **Pages**: 4
> **Total Candidates**: 58 | **Extraction**: PyMuPDF direct text

## Initiation Section (Page 1)

| CAND-ID | Label | Domino Field | Type | Required | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-004-01 | Issue No | `IssueNo` | Number | Inferred | — | Clearly Found |
| CAND-HR-004-02 | To (HOD) | `SendTo` | Person | Inferred | — | Clearly Found |
| CAND-HR-004-03 | Division Head | `DivHead` | Person | Inferred | — | Clearly Found |
| CAND-HR-004-04 | From (Name) | `Name` | Person | Inferred | — | Clearly Found |
| CAND-HR-004-05 | Type of Contract Workers | `Type` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-004-06 | Category | `PermCategory` | Choice | Inferred | Unknown | Clearly Found |

## Permanent/Temporary Contract Workers (Page 1)

| CAND-ID | Label | Domino Field | Type | Required | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-004-07 | Site | `Site` | Text | Inferred | Unknown | Clearly Found |
| CAND-HR-004-08 | No. of Workers | `NoWorkers` | Number | Inferred | — | Clearly Found |
| CAND-HR-004-09 | Section | `Workstation` | Text | Inferred | — | Clearly Found |
| CAND-HR-004-10 | Job Description | `JD` | Multiline | Inferred | — | Clearly Found |
| CAND-HR-004-11 | Working Hour | `WorkingHour` | Text | Inferred | — | Clearly Found |
| CAND-HR-004-12 | Date Required | `Period` | Date | Inferred | — | Clearly Found |
| CAND-HR-004-13 | Current no. of workers | `CurrentNoWorkers` | Number | Inferred | — | Clearly Found |

## Period Required — Date Rows (Page 1, Child List Candidate)

| CAND-ID | Row | Domino Pattern | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-14 | Period 1 | `tPeriod_1_1` → `fPeriod_1_1` (TotalDays_1_1) | Date range + Number | Clearly Found |
| CAND-HR-004-15 | Period 2 | `tPeriod_2_1` → `fPeriod_2_1` (TotalDays_2_1) | Date range + Number | Clearly Found |
| CAND-HR-004-16 | Period 3 | `tPeriod_3_1` → `fPeriod_3_1` (TotalDays_3_1) | Date range + Number | Clearly Found |

## Perm/Temp Additional (Page 2)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-17 | Effective Date | `EffDate` | Date | Clearly Found |
| CAND-HR-004-18 | Justification | `Justification` | Multiline | Clearly Found |

## Plant Shutdown Contract Workers (Page 2)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-19 | Site (Shutdown) | `Site2` | Text | Clearly Found |
| CAND-HR-004-20 | No. of Workers required | `NoWorkers2` | Number | Clearly Found |
| CAND-HR-004-21 | Section | `Workstation2` | Text | Clearly Found |
| CAND-HR-004-22 | Job Description | `JD2` | Multiline | Clearly Found |

## Plant Shutdown Period Rows (Page 2, Child List Candidate)

| CAND-ID | Row | Domino Pattern | Confidence |
|---|---|---|---|
| CAND-HR-004-23 | Period 1 | `tPeriod_1` → `fPeriod_1` (TotalDays_1) | Clearly Found |
| CAND-HR-004-24 | Period 2 | `tPeriod_2` → `fPeriod_2` (TotalDays_2) | Clearly Found |
| CAND-HR-004-25 | Period 3 | `tPeriod_3` → `fPeriod_3` (TotalDays_3) | Clearly Found |

## Requested By (Page 2)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-26 | Requested by | `DocAuthor` | Person | Clearly Found |
| CAND-HR-004-27 | Designation | `Designation` | Text | Clearly Found |
| CAND-HR-004-28 | Date | `DateIssued` | Date | Clearly Found |

## Endorsed by HOD (Page 2-3)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-004-29 | HOD Approved/Rejected | `HODApp` | Choice | **Approved, Rejected** | Clearly Found |
| CAND-HR-004-30 | Name (HOD) | `HODName` | Person | — | Clearly Found |
| CAND-HR-004-31 | Date (HOD) | `HODDate` | Date | — | Clearly Found |
| CAND-HR-004-32 | Remark (HOD) | `HODRemark` | Multiline | — | Clearly Found |

## Approved by Division Head (Page 3)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-004-33 | DivHead Approved/Rejected | `HODApp3` | Choice | **Approved, Rejected** | Clearly Found |
| CAND-HR-004-34 | Name (DivHead) | `HODName3` | Person | — | Clearly Found |
| CAND-HR-004-35 | Date (DivHead) | `HODDate3` | Date | — | Clearly Found |
| CAND-HR-004-36 | Remark (DivHead) | `HODRemark3` | Multiline | — | Clearly Found |

## Acknowledged by AGM HR (Page 3)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-004-37 | HR Approved/Rejected | `HRApp` | Choice | **Approved, Rejected** | Clearly Found |
| CAND-HR-004-38 | Name (HR) | `HRName` | Person | — | Clearly Found |
| CAND-HR-004-39 | Position (HR) | `HRPosition` | Text | — | Clearly Found |
| CAND-HR-004-40 | Date (HR) | `HRDate` | Date | — | Clearly Found |
| CAND-HR-004-41 | Remark (HR) | `HRRemark` | Multiline | — | Clearly Found |

## HR/MTN Fill Section (Page 3)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-42 | Requisition filled by | `Vendor` | Text | Clearly Found |
| CAND-HR-004-43 | Number of pax | `Pax` | Number | Clearly Found |
| CAND-HR-004-44 | Required Due date | `DateHR` | Date | Clearly Found |
| CAND-HR-004-45 | Request Status | `Status` | Choice | Clearly Found |
| CAND-HR-004-46 | Remarks/Attachment | `Remarks` | Multiline | Clearly Found |
| CAND-HR-004-47 | Updated by | `UpdatedBy` | Person | Clearly Found |
| CAND-HR-004-48 | Designation (Update) | `UpdatedDesi` | Text | Clearly Found |
| CAND-HR-004-49 | Date (Updated) | `UpdatedDate` | Date | Clearly Found |

## Acknowledged by Requestor (Page 4)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-004-50 | Acknowledge/Deny | `HODApp2` | Choice | **Acknowledge, Deny** | Clearly Found |
| CAND-HR-004-51 | Name (Requestor) | `HODName2` | Person | — | Clearly Found |
| CAND-HR-004-52 | Date (Requestor) | `HODDate2` | Date | — | Clearly Found |
| CAND-HR-004-53 | Remark (Requestor) | `HODRemark2` | Multiline | — | Clearly Found |

## Hidden Fields (Page 4)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-004-54 | Current Action | `CurrentAction` | Choice | Clearly Found |
| CAND-HR-004-55 | Editor 1-5 | `Editor1`-`Editor5` | Person | Clearly Found |
| CAND-HR-004-56 | HR - CC | `HR2` | Text | Clearly Found |
| CAND-HR-004-57 | Maintenance | `MTN` | Text | Clearly Found |
| CAND-HR-004-58 | HR HOD | `HRHOD` | Person | Clearly Found |
| CAND-HR-004-59 | INO | `INO` | Text | Clearly Found |
| CAND-HR-004-60 | Reminder Date | `RemDate` | Date | Clearly Found |
| CAND-HR-004-61 | Reminder Subject | `RemSubject` | Text | Clearly Found |
| CAND-HR-004-62 | Reminder CC | `RemCC` | Text | Clearly Found |

**⚠️ Child List Candidates**: Period Required date rows in both Permanent and Plant Shutdown sections.
