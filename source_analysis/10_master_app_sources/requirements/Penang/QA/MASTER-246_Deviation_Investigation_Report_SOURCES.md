# Master App PDF Source - Deviation Investigation Report

> Master row: 246 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 246 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Deviation Investigation Report | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | Deviation Investigation Report | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | DEVIINVEREPO | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QA/DIR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 10 | 10047 | 79 | 108 | Deviation Investigation |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/028_oleObject260.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 10 | 10047 | 79 | 108 | Deviation Investigation |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | QC HEAD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | Qa/Pcqi | Inferred from PDF text | Needs Human Confirmation |
| 4 | Implementation | Inferred from PDF text | Needs Human Confirmation |
| 5 | Followup Date | Inferred from PDF text | Needs Human Confirmation |
| 6 | Effectiveness | Inferred from PDF text | Needs Human Confirmation |
| 7 | Preventive Action Request Form | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 9 | Qa Hod | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Qahod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Qc Hod | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Qchod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Deviation Form No. | PDRNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Initiator | Requestor1 | Person/Text | 1 | Parsed from PDF text |
| 3 | Company | Company | Text | 1 | Parsed from PDF text |
| 4 | To | To | Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | * Is this a CCP or OPRP point ? | isCCP | Text | 1 | Parsed from PDF text |
| 7 | *Work Area / Name of Plant | WorkArea | Person/Text | 1 | Parsed from PDF text |
| 8 | Product Name | Product | Person/Text | 1 | Parsed from PDF text |
| 9 | Batch Number | BatchNo | Text | 1 | Parsed from PDF text |
| 10 | Date of the incident | IncDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Replied by | Repliedby | Text | 1 | Parsed from PDF text |
| 12 | Replied Date | RepliedDate | Date/Text | 1 | Parsed from PDF text |
| 13 | QC Head | QCName | Person/Text | 1 | Parsed from PDF text |
| 14 | Acceptance | QCAcceptance | Text | 1 | Parsed from PDF text |
| 15 | Date | QCDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 17 | Division/Department Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 18 | SecƟon D | Approvals | Text | 1 | Parsed from PDF text |
| 19 | Division/Department Head | HODName | Person/Text | 1 | Parsed from PDF text |
| 20 | Acceptance | HODAcceptance | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 22 | QA/PCQI | QAName | Person/Text | 1 | Parsed from PDF text |
| 23 | Acceptance | QAAcceptance | Text | 1 | Parsed from PDF text |
| 24 | Date | QADate | Date/Text | 1 | Parsed from PDF text |
| 25 | Ɵtle | COOName | Person/Text | 1 | Parsed from PDF text |
| 26 | Acceptance | COOAcceptance | Text | 1 | Parsed from PDF text |
| 27 | Date | COODate | Date/Text | 1 | Parsed from PDF text |
| 28 | Send To | SendToImp | Date/Text | 1 | Parsed from PDF text |
| 29 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 30 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 31 | FOLLOWUP DATE | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 33 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 34 | Preventive Action Request Form | PARLink | Text | 1 | Parsed from PDF text |
| 35 | Update the corrective action in Hazard Analysis Table? | HazardYesNO | Date/Text | 1 | Parsed from PDF text |
| 36 | Comment | CAComment | Multiline Text | 1 | Parsed from PDF text |
| 37 | Update the corrective action in R/O table? | ROYesNO | Date/Text | 1 | Parsed from PDF text |
| 38 | Comment | ROComment | Multiline Text | 1 | Parsed from PDF text |
| 39 | Recurrence | Reccurrence | Text | 1 | Parsed from PDF text |
| 40 | Comment | RecComment | Multiline Text | 1 | Parsed from PDF text |
| 41 | Implementation of correction and corrective action as per deadline | Deadline | Text | 1 | Parsed from PDF text |
| 42 | Comment | DeadlineComment | Multiline Text | 1 | Parsed from PDF text |
| 43 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 44 | Root Cause | RootCause_1 | Text | 1 | Parsed from PDF text |
| 45 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 47 | Remarks | WDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 48 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 49 | Initiator | Authors | Text | 1 | Parsed from PDF text |
| 50 | Created On | CDate | Date/Text | 1 | Parsed from PDF text |
| 51 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 52 | Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 53 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 54 | Quality Council Member | QC | Text | 1 | Parsed from PDF text |
| 55 | QA Creator | QA | Text | 1 | Parsed from PDF text |
| 56 | QA HOD | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 57 | QC HOD | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 58 | COO | COO | Text | 1 | Parsed from PDF text |
| 59 | OE Council | QCM | Text | 1 | Parsed from PDF text |
| 60 | Food Safety Team | ACMFST | Text | 1 | Parsed from PDF text |
| 61 | ECM Food Safety Team | ECMFST | Text | 1 | Parsed from PDF text |
| 62 | FST Check | FST | Text | 1 | Parsed from PDF text |
| 63 | PCQI Verifier | PCQI | Text | 1 | Parsed from PDF text |
| 64 | Selected Food Safety Team | SELFST | Text | 1 | Parsed from PDF text |
| 65 | All PIC - Reminder | AllPIC | Person/Text | 1 | Parsed from PDF text |
| 66 | Def CC Mailing List | Defcc | Text | 1 | Parsed from PDF text |
| 67 | Editor 1 - Requestor | Editor1 | Person/Text | 1 | Parsed from PDF text |
| 68 | Editor 2 - QC | Editor2 | Text | 1 | Parsed from PDF text |
| 69 | Editor 3 - QC HOD | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 70 | Editor 4 - Recipient | Editor4 | Text | 1 | Parsed from PDF text |
| 71 | Editor 5 - HOD | Editor5 | Person/Text | 1 | Parsed from PDF text |
| 72 | Editor 6 - QA HOD | Editor6 | Person/Text | 1 | Parsed from PDF text |
| 73 | Editor 7 - COO | Editor7 | Text | 1 | Parsed from PDF text |
| 74 | Editor 8 - Implementation | Editor8 | Text | 1 | Parsed from PDF text |
| 75 | Editor 9 - Effectiveness | Editor9 | Text | 1 | Parsed from PDF text |
| 76 | Editor 10 - QA | Editor10 | Text | 1 | Parsed from PDF text |
| 77 | Editor 11 - QA | Editor11 | Text | 1 | Parsed from PDF text |
| 78 | PDR No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 79 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (188), hod (12), verified (8), currentaction (4), submitted (2), approval (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `DEVIINVEREPO`
Child-list recommendation: `MainDB_QA_Ext_DEVIINVEREPO_Rows` candidate for repeating row fields

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
| MASTER-246-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-246-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-246-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 79 |
| Workflow Signal Count | 216 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
