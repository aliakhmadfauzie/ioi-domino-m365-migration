# SRC-HR-008 EPHR Field Candidates

> Form: Employee Personal Health Record | Batch: EXB-003 | Method: PyMuPDF direct text extraction

## Label / Field Pairs

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-HR-008-001 | Name | `FullName` | 1 | people/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-002 | IC No. / Passport No. | `IC` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-003 | Gender | `Gender` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-004 | HP No | `HP` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-005 | Company | `Company` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-006 | Department | `Dept` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-007 | Height | `H CM` | 1 | number/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-008 | Weight | `W KG` | 1 | number/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-009 | BMI | `BMI KG/M2` | 1 | number/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-010 | Blood Pressure | `BP mmHg` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-011 | Pulse | `P min` | 1 | number/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-012 | Visual | `Visual` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-013 | Color Vision | `Vision` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-014 | Past Medical / Surgical History | `MedHist` | 1 | choice | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-HR-008-015 | Follow up | `Followup` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-016 | Regularly | `Followup2` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-017 | Location | `LocaƟon` | 2 | choice | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-018 | Diagnosis | `Diagnosis` | 2 | text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-019 | Discharge Summary | `Discharge` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-020 | Medical Report | `AƩachment` | 2 | choice | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-HR-008-021 | Additional Report | `AƩachment2` | 2 | multiline | Unknown | Unknown | Candidate | Raw text page 2 |

## Standalone Table/System Field Codes

| Field Code | Page | Suggested Type | Status | Evidence |
|---|---:|---|---|---|
| `DOB` | 1 | date | Candidate | Raw text page 1 |
| `BMI` | 1 | number/text | Candidate | Raw text page 1 |
| `D_1` | 1 | text | Candidate | Raw text page 1 |
| `S_1` | 1 | text | Candidate | Raw text page 1 |
| `R_1` | 1 | text | Candidate | Raw text page 1 |
| `D_2` | 1 | text | Candidate | Raw text page 1 |
| `S_2` | 1 | text | Candidate | Raw text page 1 |
| `R_2` | 1 | text | Candidate | Raw text page 1 |
| `D_3` | 1 | text | Candidate | Raw text page 1 |
| `S_3` | 1 | text | Candidate | Raw text page 1 |
| `R_3` | 1 | text | Candidate | Raw text page 1 |
| `D_4` | 1 | text | Candidate | Raw text page 1 |
| `S_4` | 1 | text | Candidate | Raw text page 1 |
| `R_4` | 1 | text | Candidate | Raw text page 1 |
| `D_5` | 1 | text | Candidate | Raw text page 1 |
| `S_5` | 1 | text | Candidate | Raw text page 1 |
| `R_5` | 1 | text | Candidate | Raw text page 1 |
| `D_6` | 2 | text | Candidate | Raw text page 2 |
| `S_6` | 2 | text | Candidate | Raw text page 2 |
| `R_6` | 2 | text | Candidate | Raw text page 2 |
| `D_7` | 2 | text | Candidate | Raw text page 2 |
| `S_7` | 2 | text | Candidate | Raw text page 2 |
| `R_7` | 2 | text | Candidate | Raw text page 2 |
| `LocRem` | 2 | text | Candidate | Raw text page 2 |
| `AdmDate` | 2 | date | Candidate | Raw text page 2 |

Summary: 21 label pairs and 25 standalone table/system field codes extracted. Standalone codes are candidates only and require quality review before promotion.
