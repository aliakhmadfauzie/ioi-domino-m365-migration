# SRC-FIN-005 EARF Field Candidates

> Form: Expenditure Appropriation Request Form | Batch: FXB-002 | Method: PyMuPDF direct text extraction

| Candidate ID | PDF Label | Domino Field | Page | Suggested Type | Required | Choices | Status | Evidence |
|---|---|---|---:|---|---|---|---|---|
| CAND-SRC-FIN-005-001 | SAP IO No. | `SAPIONo` | 1 | text | Finance use | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-002 | Company | `Company` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-003 | Department | `Department` | 1 | text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-004 | Asset Class | `AssetClass` | 1 | choice/text | Unknown | `A012 Low Value Asset` visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-005 | Purpose of Asset | `Purpose` | 1 | multiline/choice | Unknown | Material disposal note visible | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-006 | Existing Asset No. | `ExAssetNo` | 1 | text | Conditional | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-007 | Execution Type | `ExecType` | 1 | choice/text | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-008 | Asset detail rows | `Inv_1..Inv_5`, `FW_1..FW_5`, `UL_1..UL_5`, `InvAmt_1..InvAmt_5`, `UP_1..UP_5`, `SAPAssNo_1..SAPAssNo_5` | 1 | repeating rows | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-009 | Total Cost | `TtlInvAmt` | 1 | currency | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-010 | Justification | `Justification` | 1 | multiline | Unknown | Unknown | Candidate | Raw text page 1 |
| CAND-SRC-FIN-005-011 | Attachment | `Attachment` | 1-2 | attachment | Unknown | Unknown | Candidate | Raw text pages 1-2 |
| CAND-SRC-FIN-005-012 | Department Head | `HOD` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-013 | Division Head | `HOD2` | 2 | people/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-014 | CC | `CC2` | 2 | people/group | Optional | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-015 | Requested by | `Preparedby`, `Prepareddate`, `Preparedpost` | 2 | people/date/text | Unknown | Unknown | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-016 | To be Verified by Finance | `VerName`, `VerDate`, `VerRem` | 2 | review | Unknown | Verify visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-017 | Department Head Approval | `hodname`, `hoddate`, `hodpost`, `hodrem`, `App1` | 2 | mixed approval | Unknown | Approve/Deny visible | Candidate | Raw text page 2 |
| CAND-SRC-FIN-005-018 | To Be Reviewed By | `CC`, `Reviewedby`, `Revieweddate`, `Reviewedpost`, `Reviewedrem`, `App2` | 2-3 | mixed review | Unknown | Approve/Deny visible | Candidate | Raw text pages 2-3 |
| CAND-SRC-FIN-005-019 | Division Head Approval | `hodname2`, `hoddate2`, `hodpost2`, `hodrem2`, `App3` | 3 | mixed approval | Unknown | Approve/Deny visible | Candidate | Raw text page 3 |
| CAND-SRC-FIN-005-020 | Notified by | `NotifiedBy`, `NotifiedDate` | 3 | people/date | Conditional | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-005-021 | EARF Completion | `CompDate`, `OldAsset`, `oldAssetRem` | 3 | completion | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-005-022 | Details of SAP PR raised | `PODt_1..PODt_5`, `PONo_1..PONo_5` | 3 | repeating rows | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-005-023 | Prepared by completion | `Preparedby2`, `Prepareddate2` | 3 | people/date | Unknown | Unknown | Candidate | Raw text page 3 |
| CAND-SRC-FIN-005-024 | Cancellation | `CanName`, `CanDate`, `CanReason` | 3-4 | cancellation | Conditional | Cancel visible | Candidate | Raw text pages 3-4 |
| CAND-SRC-FIN-005-025 | Created by / Created date | `DocAuthor`, `CDate` | 4 | audit | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-026 | Current Action | `CA` | 4 | workflow state | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-027 | IT / Finance routing | `IT`, `FINA`, `FIN1`, `FIN3`, `FIN`, `FINAdmin` | 4 | people/group routing | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-028 | Department consultation routing | `ITHOD`, `ADM`, `MTN`, `ADM_CC`, `CC3` | 4 | people/group routing | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-029 | Division/recommender routing | `DH`, `Recommender` | 4 | people/group routing | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-030 | Readers / servers | `Servers`, `Readers` | 4 | access control | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-031 | Editors | `Editor1`, `Editor1a`, `Editor2`, `Editor3`, `Editor4`, `Editor5`, `Editor6`, `Editor7` | 4 | people/group editor | System | Unknown | Candidate | Raw text page 4 |
| CAND-SRC-FIN-005-032 | Mailing List / Reminder Date | `MailingList`, `RemDate` | 4 | people/date | System | Unknown | Candidate | Raw text page 4 |

