# SRC-HR-015 HRAPR Field Candidates

> Form: HR Applications Problem Reporting | Batch: EXB-005 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-015-001 | Sent Date | `DateCreated` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-002 | Case No. | `DisplayCaseNo` | 1 | text | System | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-003 | To GHR Personnel | `SendTo` | 1 | people/group | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-004 | Company | `companyname` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-005 | Reported By | `ReportedBy` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-006 | Department | `Dept` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-007 | Employee No. | `EmpNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-008 | Section | `Section` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-009 | Extension No. | `ExtNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-010 | System | `System` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-011 | Modules | `Module` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-012 | Modules | `Module2` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-013 | Problem Description | `ProblemDesc` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-014 | Attachment | `Attach` | 1 | attachment | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-015 | CC | `CC` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-016 | Carried out by | `ISGName` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-017 | Solution | `Solution` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-018 | Case Status | `CaseStatus` | 1 | choice/status | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-019 | Date Started | `StartDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-020 | Date Completed | `DateClosed` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-021 | Description/Remarks | `ISGRemarks` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-022 | ISG Attachment | `Attachment2` | 1 | attachment | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-015-023 | Rejected Carried out by | `ISGName_1` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-024 | Rejected Status | `CaseStatus_1` | 2 | choice/status | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-025 | Rejected Date | `DateReject` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-026 | Rejected Remarks | `ISRemarks` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-027 | Requestor Acceptance Status | `Status` | 2 | choice/status | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-028 | Date Accepted | `DateAccept` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-029 | Acceptance Comment | `Comment` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-030 | KIV/Archived By | `KIVBy` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-031 | KIV Status | `KIVStatus` | 2 | choice/status | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-015-032 | KIV Date | `KIVDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |

## Hidden / Routing Field Codes

| Structure | Fields | Status | Evidence |
|---|---|---|---|
| Current action and actors | `CurrentAction`, `Requestor`, `AuthorsList`, `ISG`, `PIC`, `GHR`, `GHR2`, `HRHOD`, `AEditor1`, `AEditor2`, `AEditor3`, `MailingList`, `MailList` | Candidate | Raw text page 2 |
| Audit/reminder fields | `LastModifiedBy`, `AutoClosedDate`, `ModifiedBy`, `DateModified`, `RemDate` | Candidate | Raw text page 2 |
| Case number format | `Year - Month - CaseNo` | Candidate | Raw text page 3 |

