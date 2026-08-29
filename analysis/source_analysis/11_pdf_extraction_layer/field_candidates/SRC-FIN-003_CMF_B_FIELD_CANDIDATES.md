# SRC-FIN-003 CMF_B Field Candidates

> Form: Temporary Credit Limit Change Form | Batch: FXB-001 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-FIN-003-001 | Company | `Company` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-002 | Category | `Category` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-003 | Form No. | `CAFNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-004 | No. of Times Applied | `qty` | 1 | number | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-005 | Date | `DateInitiated` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-006 | Company / Customer Number (SAP) | `CompanyName` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-007 | Marketing Executive In Charge | `MKTExec` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-008 | Approved Credit Limit | `Currency_7`, `AppCreditLimit_1` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-009 | Proposed Temporary Credit Limit | `Currency_1`, `TemCreditLimit` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-010 | Total Credit Limit | `Currency_2`, `TotCreditLimit` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-011 | Payment Terms | `PaymentTerms` | 1 | text/choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-012 | Total Receivables | `Currency_3`, `TotRec` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-013 | Open Delivery Credit | `Currency_4`, `OpenDelCredit` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-014 | Sales Value | `Currency_5`, `SalesVal` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-015 | Credit Insurance Ref / Limit | `CreditInsRef`, `Currency_6`, `Limit` | 1 | text/currency | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-016 | Reason | `Reason` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-017 | Marketing Manager | `MKTHOD` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-003-018 | Requested by | `reqby`, `reqdate` | 2 | people/date | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-003-019 | Marketing Manager Approval | `MKTName`, `MKTDate`, `MKTRem`, `App1` | 2 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-003-020 | GM Approval | `GMName`, `GMDate`, `GMRem`, `App1_1` | 2 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-003-021 | Finance Review | `FMName`, `FMDate`, `CRate`, `FMRem`, `FMAtt`, `App2` | 2-3 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text pages 2-3 |
| CAND-SRC-FIN-003-022 | ED Approval | `EDName`, `EDDate`, `EDRem`, `App3` | 3 | mixed | Conditional | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-003-023 | Approved Credit Limit | `Currency`, `AppCreditLimit` | 3 | currency | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-003-024 | Rejected To | `Denial` | 3 | choice/text | Conditional | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-003-025 | Finance Acknowledgement | `FMName2`, `FMDate2`, `ExpiryDate`, `FMRem2`, `FMAtt2`, `App6` | 3 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 3 |

## Hidden / Routing Field Codes

| Structure | Fields | Status | Evidence |
|---|---|---|---|
| Current action and routing | `CA`, `MKTFA`, `MKTFE`, `MKTSN`, `MKT`, `ED`, `IT`, `FIN`, `FLimit`, `Editor1`, `Editor2`, `Editor2a`, `Editor3`, `Editor4`, `Editor5`, `MailList`, `INO`, `RemDate` | Candidate | Raw text pages 3-4 |

