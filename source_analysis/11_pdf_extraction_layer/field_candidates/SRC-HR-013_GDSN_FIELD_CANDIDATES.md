# SRC-HR-013 GDSN Field Candidates

> Form: Gift/Donation/Sponsorship Notification | Batch: EXB-005 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-013-001 | Notification No. | `ProjectCode` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-002 | Request Type | `ReqType` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-003 | Company | `company` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-004 | Relationship | `Recipient` | 1 | text/choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-005 | Name of person/company the gift | `Name` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-006 | Address | `Address` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-007 | SAP No. / Vendor ID No. | `SAP_ID` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-008 | Requestor | `Requestor` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-009 | HOD | `HOD` | 1 | people | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-010 | Department | `Department` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-011 | Type | `Type` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-012 | Purpose of the gift | `Purpose` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-013 | Other Purpose | `otherPurpose` | 1 | multiline | Conditional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-014 | Benefit to Company | `IsBenefit` | 1 | boolean/choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-015 | Benefit Text | `benefitText` | 1 | multiline | Conditional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-016 | Gift with Company Logo | `IsLogo` | 1 | boolean/choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-013-017 | Description of Gift | `ItemDetail` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-018 | Value of Gift | `GiftValue` | 2 | currency | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-019 | Date | `DateRec` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-020 | Quantity | `Quantity` | 2 | number | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-021 | Price per Unit | `Price` | 2 | currency | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-022 | Total Cost | `Total` | 2 | currency | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-023 | Purchase through PO | `IsPO` | 2 | boolean/choice | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-024 | PO Number | `PoNo` | 2 | text | Conditional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-025 | Submitted by | `Notified` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-026 | Position | `position` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-027 | Submitted Date | `reportedDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-028 | HOD Endorsed By | `HODName` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-029 | HOD Position | `HODPost` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-030 | HOD Date | `HODDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-031 | HOD App | `App` | 2 | choice/status | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-013-032 | Notified To | `SendTo` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |

## Hidden / Routing Field Codes

| Structure | Fields | Status | Evidence |
|---|---|---|---|
| Current action and routing | `CA`, `Editor1`, `Editor2`, `ED`, `SGM`, `HR`, `FIN`, `PUR`, `IsPUR`, `MKT`, `IT`, `INO`, `MailList`, `Readers` | Candidate | Raw text page 3 |

