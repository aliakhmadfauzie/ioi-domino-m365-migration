# SRC-HR-011 FWWPD Field Candidates

> Form: Foreign Workers Work Permit Database | Batch: EXB-004 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-011-001 | Company | `Company` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-002 | Status | `Status` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-003 | Reason | `Reason` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-004 | Remark | `Remark` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-005 | Check-Out-Memo | `COMemo` | 1 | attachment/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-006 | Name | `Name` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-007 | Employee No. | `EmpNo` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-008 | Department | `Department` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-009 | Hostel Address | `Hostel` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-010 | Date of Birth | `DOB` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-011 | Date of Commencement | `DOC` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-012 | New Passport No. | `PassportNoNew` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-013 | New Upload Passport | `PassportNew` | 1 | attachment | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-014 | Passport Expiry Date | `PassportExpiryDate` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1; field text truncated as `assportExpiryDat` |
| CAND-SRC-HR-011-015 | Old Passport No. | `PassportNoOld` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-016 | Old Upload Passport | `PassportOld` | 1 | attachment | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-017 | Nationality | `Nationality` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-018 | Contract Period From | `ContractPeriod` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-019 | Contract Period To | `ContractPeriod_1` | 1 | date | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-011-020 | Work Permit Expiry Date | `WorkPermitExpiryDate` | 2 | date | Unknown | Unknown | Candidate | Raw text page 2; field text truncated as `orkPermitExpiryDa` |
| CAND-SRC-HR-011-021 | Work Permit No. | `WorkPermitNo` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-011-022 | Upload Permit to Work | `Permit` | 2 | attachment | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-011-023 | FOMEMA Worker Code | `WorkerCode` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-011-024 | SOCSO No. | `SocsoNo` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |

## Repeating / Table Field Codes

| Structure | Fields | Rows | Status | Evidence |
|---|---|---:|---|---|
| Hospitalization and surgical scheme | `Y_N`, `PN_N`, `SN_N`, `P_N`, `F_N`, `T_N`, `Att_N`, `D_N` | 10 | Candidate | Raw text pages 2-3 |
| FOMEMA status | `DY_N`, `C_N`, `DC_N`, `FR_N`, `FRmks_N`, `AttC_N`, `DD_N` | 10 | Candidate | Raw text pages 3-4 |
| MYEG process | `EY_N`, `DA_N`, `EY_N_1`, `ST_N`, `ECC_N`, `DS_N_1`, `S_N`, `DS_N` | 10 | Candidate | Raw text page 4 |
| Foreign employment contract | `FY_N`, `CPF_N`, `CPT_N`, `PB_N`, `FDS_N` | 10 | Candidate | Raw text page 4 |
| Hidden routing/admin | `CurrentAction`, `IT`, `HR`, `HRHOD`, `PdgEmpCon`, `HRList`, `EditorsE` | N/A | Candidate | Raw text page 5 |

