# Master App PDF Source - SAP Sign off Form

> Master row: 178 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 178 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Sign off Form | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| IMS Related \| PHBSVR | Source inventory |
| Form List | SILO3 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPSIGNOFF | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/024_oleObject145.pdf | Extracted embedded PDF | text_match_high | 0.768 | Explicit mapping | 5 | 5351 | 68 | 23 | SILO UAT - SIGN OFF FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Silo Uat - Sign Off Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Ku1_Silo | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Ku2_Silo | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ku3_Silo | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Ku4_Silo | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Ku5_Silo | Inferred from PDF text | Needs Human Confirmation |
| 7 | BPO Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Bpo1_Silo | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Bpo2_Silo | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Bpo3_Silo | Inferred from PDF text | Needs Human Confirmation |
| 11 | B_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Tc_1_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Client | Client | Text | 1 | Parsed from PDF text |
| 2 | Client num | ClientNum | Text | 1 | Parsed from PDF text |
| 3 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 4 | Module | ModuleName | Person/Text | 1 | Parsed from PDF text |
| 5 | Reference (SSR/CR/PRF) | RefName | Person/Text | 1 | Parsed from PDF text |
| 6 | Attachment | ITRemAttach | Text | 1 | Parsed from PDF text |
| 7 | TR Number Reference (link) | TRNumber | Text | 1 | Parsed from PDF text |
| 8 | Remarks | SAPRemarks | Multiline Text | 1 | Parsed from PDF text |
| 9 | CC | CCEmail | Text | 1 | Parsed from PDF text |
| 10 | 1st Key User | KU1_SILO | Text | 1 | Parsed from PDF text |
| 11 | 2nd Key User (optional) | KU2_SILO | Text | 1 | Parsed from PDF text |
| 12 | 3rd Key User (optional) | KU3_SILO | Text | 1 | Parsed from PDF text |
| 13 | 4th Key User (optional) | KU4_SILO | Text | 1 | Parsed from PDF text |
| 14 | 5th Key User (optional) | KU5_SILO | Text | 1 | Parsed from PDF text |
| 15 | BPO Approval | BPO1_SILO | Text | 1 | Parsed from PDF text |
| 16 | BPO Approval | BPO2_SILO | Text | 1 | Parsed from PDF text |
| 17 | BPO Approval | BPO3_SILO | Text | 1 | Parsed from PDF text |
| 18 | Submitted by (IT) | ITFuncName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date Submitted | ITSubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Attachment | KU1Attach_SILO | Text | 1 | Parsed from PDF text |
| 21 | Remarks | KU1Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 22 | Status | LockKU1_SILO | Choice/Text | 1 | Parsed from PDF text |
| 23 | Attachment | KU2Attach_SILO | Text | 1 | Parsed from PDF text |
| 24 | Remarks | KU2Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 25 | Status | LockKU2_SILO | Choice/Text | 1 | Parsed from PDF text |
| 26 | Attachment | KU3Attach_SILO | Text | 1 | Parsed from PDF text |
| 27 | Remarks | KU3Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 28 | Status | LockKU3_SILO | Choice/Text | 1 | Parsed from PDF text |
| 29 | Attachment | KU4Attach_SILO | Text | 1 | Parsed from PDF text |
| 30 | Remarks | KU4Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 31 | Status | LockKU4_SILO | Choice/Text | 1 | Parsed from PDF text |
| 32 | Attachment | KU5Attach_SILO | Text | 1 | Parsed from PDF text |
| 33 | Remarks | KU5Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 34 | Status | LockKU5_SILO | Choice/Text | 1 | Parsed from PDF text |
| 35 | Remarks | BPO1Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 36 | Status | LockBPO1_SILO | Choice/Text | 1 | Parsed from PDF text |
| 37 | Remarks | BPO2Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 38 | Status | LockBPO2_SILO | Choice/Text | 1 | Parsed from PDF text |
| 39 | Remarks | BPO3Rem_SILO | Multiline Text | 1 | Parsed from PDF text |
| 40 | Status | LockBPO3_SILO | Choice/Text | 1 | Parsed from PDF text |
| 41 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 42 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 43 | Date Withdrawn | WDDate | Date/Text | 1 | Parsed from PDF text |
| 44 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 45 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 46 | Running number | Year; INO; RunningNo | Text | 1 | Parsed from PDF text |
| 47 | Requestor | AEditor1 | Person/Text | 1 | Parsed from PDF text |
| 48 | sign off. | AEditor2 | Text | 1 | Parsed from PDF text |
| 49 | Key Users Notification - All | NotifyKeyUsers | Text | 1 | Parsed from PDF text |
| 50 | BPO Notification - All | NotifyBPO | Text | 1 | Parsed from PDF text |
| 51 | CC All | CCAll | Text | 1 | Parsed from PDF text |
| 52 | IT | ISAdmin | Text | 1 | Parsed from PDF text |
| 53 | Editor1: Editor1 , Editor2 : Editor2 , Editor3 : Editor3 , Editor4 : Editor4 , Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 54 | Get required signed off | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 55 | Get signed off status | SignStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 56 | Total Signed off | TotalList | Number/Text | 1 | Parsed from PDF text |
| 57 | Get total Key users signed | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 58 | Final count KU - All app | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 59 | Get BPO count | CountBPO1; CountBPO2; CountBPO3 | Text | 1 | Parsed from PDF text |
| 60 | Total Signed Off BPO | SignStatusBPO1; SignStatusBPO2; SignStatusBPO3 | Number/Text | 1 | Parsed from PDF text |
| 61 | Get total BPO Signed | TotalBPOSelected | Number/Text | 1 | Parsed from PDF text |
| 62 | Get total BPO signed | GetTotalBPO | Number/Text | 1 | Parsed from PDF text |
| 63 | Final count - All app BPO | AllApprovedBPO | Person/Text | 1 | Parsed from PDF text |
| 64 | SendEmailBPO confirmation | SendEmailBPO | Text | 1 | Parsed from PDF text |
| 65 | Reminder date (7 days frm submitted dt) | RemDate | Date/Text | 1 | Parsed from PDF text |
| 66 | Pending key users | RemKeyUsers | Text | 1 | Parsed from PDF text |
| 67 | Pending BPO | RemBPO | Text | 1 | Parsed from PDF text |
| 68 | Get Ref Num | GetRefName | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (13), approval (3), submitted (3), approved (3), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SAPSIGNOFF`
Child-list recommendation: No child list inferred from parsed field names; confirm during design

Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.

## 7. Power Apps Build Specification

| Screen/Component | Requirement | Confidence |
| --- | --- | --- |
| List | Filter by site/owner/FormCode and status | Inferred |
| New/Edit | Render parsed PDF fields grouped by inferred sections | Inferred |
| Detail | Read-only view with audit/workflow metadata | Inferred |
| Approval Actions | Show only if workflow state confirms approval is required | Needs Human Confirmation |
| Child Rows | Use editable gallery only if child-list recommendation is confirmed | Needs Human Confirmation |

## 8. Human Confirmation Questions

| # | Question | Severity |
| --- | --- | --- |
| MASTER-178-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-178-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-178-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 68 |
| Workflow Signal Count | 23 |
| Notes | - |
