# SRC-HR-012 FWWPE Field Candidates

> Form: Foreign Worker Work Period Extension | Batch: EXB-004 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-012-001 | Issue No | `IssueNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-002 | Superior | `SendTo` | 1 | people | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-003 | Head of Section | `HOS` | 1 | people | Optional in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-004 | Head of Department | `HOD` | 1 | people | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-005 | CC | `CC` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-006 | Company | `Company` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-007 | Name | `Name` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-008 | Employee No. | `EmpNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-009 | Passport No. | `PassportNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-010 | Department | `Department` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-011 | Section | `Section` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-012 | Work Permit Expiry Date | `WPExpDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-013 | Contract Period From | `DateF` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-014 | Contract Period To | `DateT` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-015 | Contract Year | `Year` | 1 | number/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-016 | Requested By | `DocAuthor` | 1 | people | System | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-017 | Date Issued | `DateIssued` | 1 | date | System | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-018 | Superior Reply Status | `Status` | 1 | choice | Unknown | Continue / Not to Continue visible | Candidate | Raw text page 1 |
| CAND-SRC-HR-012-019 | Reason for leaving | `Reason` | 2 | multiline | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-020 | Departure | `Departure` | 2 | date/text | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-021 | Early-leave letter | `attachment` | 2 | attachment | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-022 | Reply Remark | `ReplyRemark` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-023 | Reply Position | `Position` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-024 | Reply Name | `ReplyName` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-025 | Reply Date | `ReplyDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-026 | HOS Status | `HOSStatus` | 2 | choice | Unknown | Approved / Rejected visible | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-027 | HOS Name | `HOSName` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-028 | HOS Date | `HOSDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-029 | HOS Remark | `HOSRemark` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-030 | HOD Contract Status | `ContStatus` | 2 | choice | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-031 | HOD Status | `HODStatus` | 2 | choice | Unknown | Approved / Rejected visible | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-032 | HOD Name | `HODName` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-033 | HOD Date | `HODDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-034 | HOD Remark | `HODRemark` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-012-035 | HR Status | `HRHODStatus` | 3 | choice | Unknown | Approved / Rejected visible | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-036 | HR Name | `HRHODName` | 3 | people/text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-037 | HR Date | `HRHODDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-038 | HR Remark | `HRHODRemark` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-039 | Flight Departure Date | `DepartDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-040 | Departure Time | `DepartTime` | 3 | text/time | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-041 | Flight Attachment | `Att` | 3 | attachment | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-042 | Transportation Details | `Att2` | 3 | attachment/text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-043 | Income Tax Date of Submission | `SubDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-044 | Income Tax Remarks | `Remarks` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-045 | Withdrawn Date | `WDDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-046 | Withdrawn By | `WDBy` | 3 | people/text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-012-047 | Withdrawal Remarks | `WDRem` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |

## Hidden / Routing Field Codes

| Structure | Fields | Status | Evidence |
|---|---|---|---|
| Current action and editor routing | `CurrentAction`, `Editor1`-`Editor8`, `IT`, `HR`, `PIC1`, `PIC2`, `HRHOD`, `ToList`, `CCList`, `INO` | Candidate | Raw text pages 3-4 |

