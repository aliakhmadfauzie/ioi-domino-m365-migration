# Field Candidates — EEN.pdf (SRC-HR-006)

> **Form**: Employee Exit Notification | **Dept**: HR | **Pages**: 8
> **Total Candidates**: 77 | **Extraction**: PyMuPDF direct text

## HR Section — Header (Pages 1-2)

| CAND-ID | Label | Domino Field | Type | Required | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-006-01 | Company | `Site` | Text | Inferred | Unknown | Clearly Found |
| CAND-HR-006-02 | Main Category | `Main` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-006-03 | Category | `Category` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-006-04 | Type | `Type` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-006-05 | please specify (other type) | `othertype` | Text | No | — | Clearly Found |
| CAND-HR-006-06 | Renewal Status | `ContractStatus` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-006-07 | Name & Email | `EmpName` / `EmpEmail` | Person+Email | Inferred | — | Clearly Found |
| CAND-HR-006-08 | Employee No. | `EmpNum` | Text | Inferred | — | Clearly Found |
| CAND-HR-006-09 | Position | `Position` | Text | Inferred | — | Clearly Found |
| CAND-HR-006-10 | Section | `EmpDept` | Text | Inferred | — | Clearly Found |
| CAND-HR-006-11 | Exit Interview (Hardcopy?) | `ExitInterview` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-006-12 | Notification Received Date | `dtNoticeReceived` | Date | Inferred | — | Clearly Found |
| CAND-HR-006-13 | Effective Resignation Date | `ResignedDate` | Date | Inferred | — | Clearly Found |
| CAND-HR-006-14 | Last Working Date | `LastWorkingDay` | Date | Inferred | — | Clearly Found |
| CAND-HR-006-15 | Last Service Date | `LastServiceDay` | Date | Inferred | — | Clearly Found |
| CAND-HR-006-16 | Superior | `HOD` | Person | Inferred | — | Clearly Found |
| CAND-HR-006-17 | Department/Division Head | `DivHead` | Person | Inferred | — | Clearly Found |
| CAND-HR-006-18 | Remarks | `HRComment` | Multiline | No | — | Clearly Found |
| CAND-HR-006-19 | Date Submitted | `SubmitDate` | Date | Inferred | — | Clearly Found |

## Deactivation Dates (Page 2)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-20 | Original Deactivate Date | `dtOriDeactivate` | Date | Clearly Found |
| CAND-HR-006-21 | Deactivate Date (after extension) | `dtDeactivate` | Date | Clearly Found |
| CAND-HR-006-22 | Justification (extension) | `Justification` | Multiline | Clearly Found |
| CAND-HR-006-23 | Granted by | `ExtName` | Person | Clearly Found |
| CAND-HR-006-24 | Granted on | `ExtDate` | Date | Clearly Found |

## APPROVE REJECT — ED Section (Pages 2-3)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-006-25 | Status | `Status` | Choice | APPROVE, REJECT | Clearly Found |
| CAND-HR-006-26 | Name (ED) | `EDName` | Person | — | Clearly Found |
| CAND-HR-006-27 | Date (ED) | `EDDate` | Date | — | Clearly Found |
| CAND-HR-006-28 | Remarks | `Remarks` | Multiline | — | Clearly Found |

## Exit Interview (Pages 3-5)

| CAND-ID | Question | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-29 | Q1: Reasons for leaving | `Reasons` | Multiline | Clearly Found |
| CAND-HR-006-30 | Q1: Other reason | `otherReason` | Text | Clearly Found |
| CAND-HR-006-31 | Q2: Progress feedback | `Progress` | Multiline | Clearly Found |
| CAND-HR-006-32 | Q3: Pay feedback | `Pay` | Multiline | Clearly Found |
| CAND-HR-006-33 | Q4: Found another job? | `NewJob` | Choice | Clearly Found |
| CAND-HR-006-34 | Q5: New job comparison | (multiline) | Multiline | Clearly Found |

## HOD/DIVISION APPROVAL (Page 4)

| CAND-ID | Label | Domino Field | Type | Choices | Confidence |
|---|---|---|---|---|---|
| CAND-HR-006-35 | HOD APPROVE REJECT | `HODRemarks` | Choice | APPROVE, REJECT | Clearly Found |
| CAND-HR-006-36 | Approved By | `HODName` | Person | — | Clearly Found |
| CAND-HR-006-37 | Approved Date | `HODDate` | Date | — | Clearly Found |

## Actual Last Working Day (Page 6)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-38 | Actual Last Working Day | `ActualLWD` | Date | Clearly Found |
| CAND-HR-006-39 | Sent by | `SentBy` | Person | Clearly Found |
| CAND-HR-006-40 | Sent Date | `SentDate` | Date | Clearly Found |

## HR Use — Returned Items (Page 6)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-41 | Company Properties | `CompanyProperties` | Choice | Clearly Found |
| CAND-HR-006-42 | Reason (not returned) | `Reason` | Multiline | Clearly Found |
| CAND-HR-006-43 | Remarks | `Remarks2` | Multiline | Clearly Found |
| CAND-HR-006-44 | Performed By | `PerformedBy2` | Person | Clearly Found |
| CAND-HR-006-45 | Performed Date | `PerformedDate2` | Date | Clearly Found |
| CAND-HR-006-46 | Attachment | `Attachment` | Attachment | Clearly Found |

## Withdraw Section (Page 7)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-47 | Status (Withdraw) | `WDStatus` | Choice | Clearly Found |
| CAND-HR-006-48 | Reason (Withdraw) | `WDReason` | Multiline | Clearly Found |
| CAND-HR-006-49 | Performed By (Withdraw) | `WDBy` | Person | Clearly Found |
| CAND-HR-006-50 | Performed Date (Withdraw) | `WDDate` | Date | Clearly Found |

## Hidden Fields (Pages 7-8)

| CAND-ID | Label | Domino Field | Type | Confidence |
|---|---|---|---|---|
| CAND-HR-006-51 | Current Action | `CA` | Choice | Clearly Found |
| CAND-HR-006-52 | Editor 1-6 | `Editor1`-`Editor6` | Person | Clearly Found |
| CAND-HR-006-53 | IT Section | `ITEditor` | Person | Clearly Found |
| CAND-HR-006-54 | HOD Section | `HODEditor` | Person | Clearly Found |
| CAND-HR-006-55 | HR Editor | `HREditor` | Person | Clearly Found |
| CAND-HR-006-56 | EI Related | `isEI` | Text | Clearly Found |
| CAND-HR-006-57 | ACM IT | `ACMIT` | Text | Clearly Found |
| CAND-HR-006-58 | PCN IT | `PCNIT` | Text | Clearly Found |
| CAND-HR-006-59 | HR Exec/Non-Exec | `HR1`, `HR2` | Text | Clearly Found |
| CAND-HR-006-60 | HR HOD | `HRHOD` | Person | Clearly Found |
| CAND-HR-006-61 | Finance | `FIN` | Text | Clearly Found |
| CAND-HR-006-62 | Security (BCC) | `BCC` | Text | Clearly Found |
| CAND-HR-006-63 | Running Number | `INO` | Text | Clearly Found |
| CAND-HR-006-64 | Reminder date | `RemDate` | Date | Clearly Found |
| CAND-HR-006-65 | Hide Extend button | `Hide` | Boolean | Clearly Found |
| CAND-HR-006-66 | Hide Interview | `HideInt` | Boolean | Clearly Found |
| CAND-HR-006-67 | Hide Handover | `HideHand` | Boolean | Clearly Found |
| CAND-HR-006-68 | Type Check | `TypeCheck` | Choice | Clearly Found |
| CAND-HR-006-69 | All Done (IT) | `AllDone` | Boolean | Clearly Found |
| CAND-HR-006-70 | All Done (HR) | `AllDone2` | Boolean | Clearly Found |

**⚠️ Structure Note**: 8-page complex form with exit interview questionnaire, deactivation extension, IT notification, HR returned items, and withdrawal mechanism. Recommend parent-child split for interview responses.
