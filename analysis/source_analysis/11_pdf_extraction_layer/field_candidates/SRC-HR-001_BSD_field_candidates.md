# Field Candidates — BSD.pdf (SRC-HR-001)

> **Form**: Backup Staff Database | **Department**: HR | **Site**: Prai
> **Total Candidates**: 36 | **Clearly Found**: 36 | **Repeating Table**: BACKUP STAFF 1-3

## SECTION A — PERSON IN CHARGE (Page 1)

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-01 | Division | `Division` | Text | Inferred | Unknown | Clearly Found |
| CAND-HR-001-02 | Department | `Dept` | Text | Inferred | Unknown | Clearly Found |
| CAND-HR-001-03 | Section | `Section` | Text | Inferred | Unknown | Clearly Found |
| CAND-HR-001-04 | Name | `PIC` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-05 | Employee No. | `EmpNo` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-06 | Position | `Position` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-07 | Area of Responsibility | `Responsibility` | Multiline | Inferred | — | Clearly Found |
| CAND-HR-001-08 | Department/Division Head | `HOD` | Person | Inferred | — | Clearly Found |

## SECTION B — BACKUP STAFF (Page 2) ⚠️ CHILD LIST CANDIDATE

### BACKUP STAFF 1

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-09 | Name (BS1) | `PIC_1` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-10 | Position (BS1) | `Position_1` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-11 | Area of Responsibility (BS1) | `Responsibility_1` | Multiline | Inferred | — | Clearly Found |

### BACKUP STAFF 2

| CAND-HR-001-12 | Name (BS2) | `PIC_2` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-13 | Position (BS2) | `Position_2` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-14 | Area of Responsibility (BS2) | `Responsibility_2` | Multiline | Inferred | — | Clearly Found |

### BACKUP STAFF 3

| CAND-HR-001-15 | Name (BS3) | `PIC_3` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-16 | Position (BS3) | `Position_3` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-17 | Area of Responsibility (BS3) | `Responsibility_3` | Multiline | Inferred | — | Clearly Found |

## SECTION C — NOMINATED BY HOD/HOS (Page 2)

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-18 | Name (Submitted By) | `SubmittedBy` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-19 | Date (Submit) | `SubmitDate` | Date | Inferred | — | Clearly Found |
| CAND-HR-001-20 | Remark | `Remark` | Multiline | No | — | Clearly Found |

## SECTION D — APPROVED BY HEAD OF DIVISION (Page 3)

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-21 | APPROVE REJECT | (choice) | Choice | Inferred | APPROVE, REJECT | Clearly Found |
| CAND-HR-001-22 | Name (HOD) | `HODName` | Person | Inferred | — | Clearly Found |
| CAND-HR-001-23 | Position (HOD) | `HODPost` | Text | Inferred | — | Clearly Found |
| CAND-HR-001-24 | Date (HOD) | `HODDate` | Date | Inferred | — | Clearly Found |
| CAND-HR-001-25 | Remarks (HOD) | `HODRemarks` | Multiline | No | — | Clearly Found |
| CAND-HR-001-26 | HOD Approval Flag | `HODApp` | Boolean | Inferred | — | Clearly Found |

## ADMIN/UPDATES (Page 3)

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-27 | Revision Required | `Revision` | Choice | No | Unknown | Clearly Found |
| CAND-HR-001-28 | Updated by | `Updatedby` | Person | No | — | Clearly Found |
| CAND-HR-001-29 | Date (Updated) | `Updateddt` | Date | No | — | Clearly Found |
| CAND-HR-001-30 | Status | `Status` | Choice | Inferred | Unknown | Clearly Found |
| CAND-HR-001-31 | Remarks (Status) | `StaRem` | Multiline | No | — | Clearly Found |

## HIDDEN FIELDS (Page 3)

| CAND-ID | Label | Domino Field | Type | Req | Choices | Confidence |
|---|---|---|---|---|---|---|
| CAND-HR-001-32 | Created by | `DocAuthor` | Person | System | — | Clearly Found |
| CAND-HR-001-33 | Status (CurrentAction) | `CurrentAction` | Choice | System | Unknown | Clearly Found |
| CAND-HR-001-34 | HR Section | `Editor1` | Person | System | — | Clearly Found |
| CAND-HR-001-35 | HOD Section | `Editor2` | Person | System | — | Clearly Found |
| CAND-HR-001-36 | HOD/HOS | `Editor3` | Person | System | — | Clearly Found |
| CAND-HR-001-37 | HR Admin | `HRAdmin` | Person | System | — | Clearly Found |
| CAND-HR-001-38 | Modification Date | `ModifiedDate` | Date | System | — | Clearly Found |
