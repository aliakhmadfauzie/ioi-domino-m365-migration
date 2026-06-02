# SRC-HR-010 FTCR Field Candidates

> Form: Fixed Term Contract Requisition Form | Batch: EXB-004 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-010-001 | Name | `EmpName` | 1 | people/text | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-002 | Emp. No | `EmpNo` | 1 | text | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-003 | Date of Birth | `DOB` | 1 | date | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-004 | Age | `EmpAge` | 1 | number | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-005 | Position | `EmpPost` | 1 | text | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-006 | Dept./Section | `Dept` | 1 | text | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-007 | Date Joined | `JoinDate` | 1 | date | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-008 | Retirement Date | `RetDate` | 1 | date | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-009 | HOD/HODiv | `DivHead` | 1 | people | Yes in PDF | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-010 | Attachment | `Attachment` | 1 | attachment | No | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-011 | Submitted by Name | `SubBy` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-012 | Submitted by Designation | `SubDesg` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-013 | Submitted Date | `SubDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-010-014 | Contract Period | `CPeriod` | 2 | choice/text | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-015 | Contract Period Other | `Others` | 2 | text | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-016 | Div/Dept Head Justification | `DivHeadJust` | 2 | multiline | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-017 | Identified Successor | `InSuccess` | 2 | boolean/choice | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-018 | External Advertisement | `Ext` | 2 | boolean/choice | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-019 | Successor Name | `SucName` | 2 | people/text | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-020 | Successor Emp. No. | `SucEmpNo` | 2 | text | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-021 | Successor Position | `SucPost` | 2 | text | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-022 | Successor Age | `SucAge` | 2 | number | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-023 | Date to be Appointed | `SucDate` | 2 | date | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-024 | Successor Dept./Section | `SucDept` | 2 | text | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-025 | Training Required | `TrReq` | 2 | boolean/choice | Yes in PDF | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-026 | List of Training | `TrList` | 2 | multiline | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-027 | Remarks/Attachment | `Remarks` | 2 | multiline/attachment | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-028 | Endorsed By | `EndBy` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-029 | Endorser Designation | `EndDesg` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-030 | Endorsed Date | `EndDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-010-031 | AGM HR Reviewer | `AppHR` | 3 | people | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-032 | AGM HR Review Date | `AppHRDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-033 | AGM HR Remarks | `HRRem` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-034 | COO Approver | `AppCOO` | 3 | people | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-035 | COO Approval Date | `AppCOODate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-036 | COO Remarks | `COORem` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-037 | ED Approver | `AppED` | 3 | people | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-038 | ED Approval Date | `AppEDDate` | 3 | date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-039 | ED Remarks | `EDRem` | 3 | multiline | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-040 | HR Application Status | `CaseStatus` | 3 | choice | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-041 | Approved Contract Period | `AppFor` | 3 | choice/text | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-HR-010-042 | Notify HOD | `NotHOD` | 4 | people/text | Unknown | Unknown | Candidate | Raw text page 4 |

## Repeating / Table Field Codes

| Structure | Fields | Rows | Status | Evidence |
|---|---|---:|---|---|
| Employee background history | `Year_N`, `AprRate_N`, `DisRec_N`, `MC_N`, `HL_N`, `A_N`, `L_N`, `NPL_N`, `MedEx_N` | 10 | Candidate | Raw text pages 2-3 |
| Hidden routing/editors | `CA`, `Editor1`-`Editor7`, `ED`, `SGM`, `HR_1`, `HR_2`, `HR`, `HRM`, `IT`, `YearList`, `Servers`, `Readers` | N/A | Candidate | Raw text page 4 |

