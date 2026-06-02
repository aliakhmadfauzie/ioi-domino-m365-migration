# SRC-FIN-004 CMF_C Field Candidates

> Form: Review of Customers on Credit | Batch: FXB-002 | Method: PyMuPDF direct text extraction

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-FIN-004-001 | Form No. | `CAFNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-002 | Date of Review | `DateReview` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-003 | Company | `Company` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-004 | Category | `Category` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-005 | Marketing Executive in charge | `MKTExec` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-006 | Marketing Manager | `MKTHOD` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-007 | Review & prepared by | `reqby`, `reqdate` | 1 | people/date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-004-008 | Customer review table | `C_1..C_50`, `S_1..S_50`, `A_1..A_50`, `H_1..H_50`, `N_1..N_50`, `F_1..F_50`, `M_1..M_50` | 1-3 | repeating rows | Unknown | Active/Inactive; Yes/No; Main/Increase/Decrease/Cancel | Candidate | Raw text pages 1-3 |
| CAND-SRC-FIN-004-009 | Attachment | `Attachment` | 3 | attachment | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-004-010 | Verified & Endorsed by Marketing Manager | `MKTName`, `MKTDate`, `MKTPost`, `MKTRem`, `App1` | 3 | mixed approval | Unknown | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-004-011 | Approved by | `SectionTitle`, `GMName`, `GMDate`, `GMRem`, `App1_1` | 3 | mixed approval | Unknown | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-004-012 | Finance Review | `FMName`, `FMDate`, `CRate`, `FMRem`, `FMAtt`, `App2` | 4 | mixed review | Unknown | Approve/Deny visible | Candidate | Raw text page 4 |
| CAND-SRC-FIN-004-013 | Approved by | `SectionTitle_1_1`, `EDName`, `EDDate`, `EDRem`, `App3` | 4 | mixed approval | Unknown | Approve/Deny visible | Candidate | Raw text page 4 |
| CAND-SRC-FIN-004-014 | To be Acknowledged by Finance | `FMName2`, `FMDate2`, `FMRem2`, `FMAtt2`, `App6` | 4 | mixed acknowledgement | Unknown | Approve/Deny visible | Candidate | Raw text page 4 |
| CAND-SRC-FIN-004-015 | Created by / Created date | `DocAuthor`, `CDate` | 4 | audit | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-004-016 | Current Action | `CA` | 5 | workflow state | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-017 | Marketing routing | `MKTFA`, `MKTFE`, `MKTSN`, `MKT` | 5 | people/group routing | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-018 | ED / IT / Finance routing | `ED`, `IT`, `FIN` | 5 | people/group routing | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-019 | Editors | `Editor1`, `Editor2`, `Editor2a`, `Editor3`, `Editor4`, `Editor5` | 5 | people/group editor | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-020 | Mail List | `MailList` | 5 | people/group | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-021 | INO | `Year - INO` | 5 | generated ID | System | Unknown | Candidate | Raw text page 5 |
| CAND-SRC-FIN-004-022 | Reminder Date | `RemDate` | 5 | date | System | Unknown | Candidate | Raw text page 5 |

## Notes

- The 50 customer rows are promoted as one repeatable row structure. The extracted PDF text truncates several `M_*` row values visually; exact internal names should be confirmed from DXL before schema generation.

