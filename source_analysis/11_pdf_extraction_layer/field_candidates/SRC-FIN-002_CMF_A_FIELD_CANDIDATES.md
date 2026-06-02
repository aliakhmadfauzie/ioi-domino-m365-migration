# SRC-FIN-002 CMF_A Field Candidates

> Form: Approval for Credit Application Form | Batch: FXB-001 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-FIN-002-001 | Company | `Company` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-002 | Category | `Category` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-003 | Credit Application Form No. | `CAFNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-004 | Previous Credit Application Form No. | `PrevCAFNo` | 1 | text | Optional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-005 | Date Initiated | `DateInitiated` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-006 | Company / Customer Number (SAP) | `CompanyName` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-007 | New Account | `Status` | 1 | choice/boolean | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-008 | Risk Category | `Risk` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-009 | Reasons | `Reasons`, `Reasons2` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-010 | Marketing Executive In Charge | `MKTExec` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-011 | Proposed Credit Limit | `Currency`, `CreditLimit` | 1 | currency | Unknown | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-012 | Proposed Credit Period | `Days` | 1 | number/text | Unknown | Days | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-013 | Proposed Revised Credit Limit | `Currency_1`, `RevCreditLimit` | 1 | currency | Conditional | Currency prefix visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-014 | Credit Insurance Ref / Limit | `CreditInsRef`, `Currency_3`, `Limit` | 1 | text/currency | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-002-015 | Attachment | `Attachment` | 2 | attachment | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-002-016 | Remark | `Remark` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-002-017 | GM Approval | `GMName`, `GMDate`, `GMRem`, `App1` | 2 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-002-018 | Finance Review | `FMName`, `FMDate`, `CRate`, `FMRem`, `FMAtt`, `App2` | 2 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-002-019 | Senior Financial Controller Approval | `FCName`, `FCDate`, `FCRem`, `App3` | 2-3 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text pages 2-3 |
| CAND-SRC-FIN-002-020 | SGM Operations Approval | `COOName`, `COODate`, `COORem`, `App4` | 3 | mixed | Conditional | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-002-021 | ED Approval | `EDName`, `EDDate`, `EDRem`, `App5` | 3 | mixed | Conditional | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-002-022 | Approved Credit Limit / Period | `Currency_2`, `AppCreditLimit`, `Days2` | 3 | currency/number | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-002-023 | Rejected To | `Denial` | 3 | choice/text | Conditional | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-002-024 | Finance Acknowledgement | `FMName2`, `FMDate2`, `FMRem2`, `FMAtt2`, `App6` | 3 | mixed | Unknown | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-002-025 | Finance Follow-up Cancellation | `CanName`, `CanDate`, `CanRem`, `CanAtt` | 4 | mixed | Conditional | Cancel visible | Candidate | Raw text page 4 |

## Hidden / Routing Field Codes

| Structure | Fields | Status | Evidence |
|---|---|---|---|
| Current action and routing | `CA`, `COOACM`, `COOPCN`, `COO`, `ED`, `IT`, `FIN`, `FIN2`, `FINHOD`, `MKTFA`, `MKTFE`, `MKTSN`, `MKT`, `FLimit`, `FLimit2`, `Editor1`-`Editor8`, `MailList`, `INO`, `RemDate` | Candidate | Raw text pages 4-5 |

