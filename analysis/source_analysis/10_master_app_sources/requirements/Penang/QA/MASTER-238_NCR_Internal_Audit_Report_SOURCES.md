# Master App PDF Source - NCR & Internal Audit Report

> Master row: 238 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 238 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | NCR & Internal Audit Report | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | frmNCR - Form \| NewNCR - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | INTERN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/003_oleObject235.pdf | Extracted embedded PDF | text_match_medium | 0.500 | Explicit mapping | 3 | 1923 | 37 | 10 | Non-Conformity Report |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/066_oleObject298.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 8 | 8475 | 75 | 76 | CompanyName |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - Auditor Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B - Auditee's Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION C - Verification | Inferred from PDF text | Needs Human Confirmation |
| 4 | Verification of corrective | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Hpic | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 7 | Non-Conformity Report | Inferred from PDF text | Needs Human Confirmation |
| 8 | Auditor's Section A | Inferred from PDF text | Needs Human Confirmation |
| 9 | System | Inferred from PDF text | Needs Human Confirmation |
| 10 | Audit Period | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION A : | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION B : DESCRIPTION & CLASSIFICATION OF NON-CONFORMITY | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company Name | CompName | Person/Text | 1 | Parsed from PDF text |
| 2 | NCR Number | NotNum | Text | 1 | Parsed from PDF text |
| 3 | Audit Location | AuditLocation | Text | 1 | Parsed from PDF text |
| 4 | Audit Date | AuditDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Issue Date | IssueDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Auditor | Auditor | Text | 1 | Parsed from PDF text |
| 7 | Issued to (Auditee) | Auditee | Text | 1 | Parsed from PDF text |
| 8 | CC | CC | Text | 1 | Parsed from PDF text |
| 9 | Due Date | DueDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Clause | Clause | Text | 1 | Parsed from PDF text |
| 11 | Attachment | Attachments | Text | 1 | Parsed from PDF text |
| 12 | Acknowledge By | AckBy | Text | 1 | Parsed from PDF text |
| 13 | Head) | DivHead | Text | 1 | Parsed from PDF text |
| 14 | NC Description | NCDesc | Multiline Text | 1 | Parsed from PDF text |
| 15 | Root Cause | RootCause | Text | 1 | Parsed from PDF text |
| 16 | Div/ Dept Head | DivHeadName | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | DivHeadDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Acceptance status | DivHeadAcceptance | Choice/Text | 1 | Parsed from PDF text |
| 19 | Comment | DivHeadComment | Multiline Text | 1 | Parsed from PDF text |
| 20 | Auditor | AuditorName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | AuditorDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Acceptance status | AuditorAcceptance | Choice/Text | 1 | Parsed from PDF text |
| 23 | Comment | AuditorComment | Multiline Text | 1 | Parsed from PDF text |
| 24 | Comment/Attachment | VerComment | Multiline Text | 1 | Parsed from PDF text |
| 25 | Verified By | VerBy | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 28 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 29 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 30 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 31 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 32 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 33 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 34 | Halal Exec | HPIC | Person/Text | 1 | Parsed from PDF text |
| 35 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 36 | INO | INO | Text | 1 | Parsed from PDF text |
| 37 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 38 | NCR No. | NCRNo | Number/Text | 1 | Parsed from PDF text |
| 39 | SYSTEM | NCRTypeNew | Choice/Text | 1 | Parsed from PDF text |
| 40 | AUDIT PERIOD | AuditPeriod | Text | 1 | Parsed from PDF text |
| 41 | Audit Location | AuditLoc | Text | 1 | Parsed from PDF text |
| 42 | Audited Process | AuditPrcs | Text | 1 | Parsed from PDF text |
| 43 | Auditee(s) | AuditeeList | Text | 1 | Parsed from PDF text |
| 44 | [EmailAddress/Recipient] | AuditeeName; ActRecipient | Person/Text | 1 | Parsed from PDF text |
| 45 | Due Date * | CurrDueDate | Date/Text | 1 | Parsed from PDF text |
| 46 | New Due Date | DueDate | Date/Text | 1 | Parsed from PDF text |
| 47 | Classification | Class | Choice/Text | 1 | Parsed from PDF text |
| 48 | Non-Conformity Description | NCDetails | Multiline Text | 1 | Parsed from PDF text |
| 49 | Attachment | Attachment1 | Text | 1 | Parsed from PDF text |
| 50 | Identified by | InitiatedBy | Text | 1 | Parsed from PDF text |
| 51 | Date | IdentifiedDate | Date/Text | 1 | Parsed from PDF text |
| 52 | Acknowledged by | Auditee | Text | 1 | Parsed from PDF text |
| 53 | Date | AckDate | Date/Text | 1 | Parsed from PDF text |
| 54 | (Div/Dept Head) | DivHead1 | Text | 1 | Parsed from PDF text |
| 55 | No. of Response | NoOfReply | Number/Text | 1 | Parsed from PDF text |
| 56 | Reviewed by | DivHead | Text | 1 | Parsed from PDF text |
| 57 | Date | DivAccDate | Date/Text | 1 | Parsed from PDF text |
| 58 | Acceptance | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 59 | Acceptance Comments | HeadDivComments | Multiline Text | 1 | Parsed from PDF text |
| 60 | Rejected Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 61 | Accepted by | Auditor1 | Text | 1 | Parsed from PDF text |
| 62 | Date | AcceptedDate | Date/Text | 1 | Parsed from PDF text |
| 63 | Acceptance | Status2 | Choice/Text | 1 | Parsed from PDF text |
| 64 | Acceptance Comments | CommentAuditor | Multiline Text | 1 | Parsed from PDF text |
| 65 | Rejected Comments | Comment1a | Multiline Text | 1 | Parsed from PDF text |
| 66 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 67 | Date closed status sent | ClosedOn | Date/Text | 1 | Parsed from PDF text |
| 68 | Comments | AuditorComments_2 | Multiline Text | 1 | Parsed from PDF text |
| 69 | Attachment | Attach_2 | Text | 1 | Parsed from PDF text |
| 70 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 71 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 72 | Remarks | WDRemarks | Multiline Text | 1 | Parsed from PDF text |
| 73 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 74 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 75 | Auditor (Requestor) | Auditor | Person/Text | 1 | Parsed from PDF text |
| 76 | Created on | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 77 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 78 | Default CC (QA) | QA | Text | 1 | Parsed from PDF text |
| 79 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 80 | MTN | MTN | Text | 1 | Parsed from PDF text |
| 81 | Reminder Review CC list | CC1 | Text | 1 | Parsed from PDF text |
| 82 | NCR Type | NCType | Choice/Text | 1 | Parsed from PDF text |
| 83 | Checking | Sent | Text | 1 | Parsed from PDF text |
| 84 | Sending to reject DB | SendTo | Date/Text | 1 | Parsed from PDF text |
| 85 | COO | LCW | Text | 1 | Parsed from PDF text |
| 86 | SGM | SGM | Text | 1 | Parsed from PDF text |
| 87 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 88 | Reminder (For CA) CC to QA/SHE | QA2 | Text | 1 | Parsed from PDF text |
| 89 | All PIC - Approved | AllPICA | Person/Text | 1 | Parsed from PDF text |
| 90 | All PIC - Reminder | AllPIC | Person/Text | 1 | Parsed from PDF text |
| 91 | All PIC - Reminder - Weekly | AllPICW | Person/Text | 1 | Parsed from PDF text |
| 92 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 93 | AEditor2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 94 | AEditor3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 95 | AEditor4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 96 | AEditor5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 97 | AEditor6 | AEditor6 | Text | 1 | Parsed from PDF text |
| 98 | AEditor7 | AEditor7 | Text | 1 | Parsed from PDF text |
| 99 | Reminder To | RemTo | Text | 1 | Parsed from PDF text |
| 100 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 101 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 102 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 103 | MTNAdmin | MTNAdmin | Text | 1 | Parsed from PDF text |
| 104 | SHE Admin | SHEAdmin | Text | 1 | Parsed from PDF text |
| 105 | Admin Editor | EditorAdmin | Text | 1 | Parsed from PDF text |
| 106 | Ref Num | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 107 | Reminder Date | RemDate; RemDate_1; RemDate_2; RemDate_3 | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (62), review (7), verification (4), verified (3), currentaction (3), ca (2), rejected (2), reviewed (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `INTERN`
Child-list recommendation: `MainDB_HR_Ext_INTERN_Rows` candidate for repeating row fields

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
| MASTER-238-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-238-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-238-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 107 |
| Workflow Signal Count | 86 |
| Notes | - |
