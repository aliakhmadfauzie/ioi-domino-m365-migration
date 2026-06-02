# Master App PDF Source - ECM Forklift Breakdown Notification

> Master row: 193 | Site: Penang | Owner: LOG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 193 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ECM Forklift Breakdown Notification | Clearly Found |
| Owner | LOG | Clearly Found |
| Department | Log \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ECMFORKBREA | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/001_oleObject48.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1604 | 44 | 15 | ECM Forklift Breakdown Notification |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiator Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Department / Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section Head | Inferred from PDF text | Needs Human Confirmation |
| 4 | Requestor's Section Head Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Cost Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Department Head Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | Division Head Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | Div Head Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | FBNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Forklift Type | FType | Choice/Text | 1 | Parsed from PDF text |
| 3 | Forklift Model | FModel | Text | 1 | Parsed from PDF text |
| 4 | Forklift Number | FNumber | Text | 1 | Parsed from PDF text |
| 5 | Department / Section | Department | Text | 1 | Parsed from PDF text |
| 6 | Problem Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 7 | Cause | Cause | Text | 1 | Parsed from PDF text |
| 8 | Area | Area | Text | 1 | Parsed from PDF text |
| 9 | Requestor Name | Name | Person/Text | 1 | Parsed from PDF text |
| 10 | Extension/Speed Dial | Ext | Text | 1 | Parsed from PDF text |
| 11 | Reported By | Requestor | Person/Text | 1 | Parsed from PDF text |
| 12 | Reported On | DateSent | Date/Text | 1 | Parsed from PDF text |
| 13 | Incur Cost | Cost | Number/Text | 1 | Parsed from PDF text |
| 14 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 15 | Total Cost | RM | Number/Text | 1 | Parsed from PDF text |
| 16 | Cost Detail | CostDetail | Number/Text | 1 | Parsed from PDF text |
| 17 | Status | ApproverStatus_1 | Person/Text | 1 | Parsed from PDF text |
| 18 | Remark | ApproverRemark_1 | Person/Text | 1 | Parsed from PDF text |
| 19 | By | ApprovedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | ApprovedDate_1 | Date/Text | 1 | Parsed from PDF text |
| 21 | Status | ApproverStatus | Person/Text | 1 | Parsed from PDF text |
| 22 | Remark | ApproverRemark | Person/Text | 1 | Parsed from PDF text |
| 23 | By | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | ApprovedDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Status | DHStatus | Choice/Text | 1 | Parsed from PDF text |
| 26 | Remark | AckRemark | Multiline Text | 1 | Parsed from PDF text |
| 27 | By | AckName | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | AckDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Status | DHStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 30 | Remark | AckRemark1 | Multiline Text | 1 | Parsed from PDF text |
| 31 | By | AckName1 | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | AckDate1 | Date/Text | 1 | Parsed from PDF text |
| 33 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 34 | By | SentBy | Text | 1 | Parsed from PDF text |
| 35 | Date | SentDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Acceptance | Acceptance | Text | 1 | Parsed from PDF text |
| 37 | Remark | AcceptanceRemark | Multiline Text | 1 | Parsed from PDF text |
| 38 | By | AcceptedBy | Text | 1 | Parsed from PDF text |
| 39 | Date | AcceptedDate | Date/Text | 1 | Parsed from PDF text |
| 40 | Auto Complete | Auto | Text | 1 | Parsed from PDF text |
| 41 | Date Auto Completed | DateAutoComplete | Date/Text | 1 | Parsed from PDF text |
| 42 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 43 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 44 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (5), status (4), hod (3), approver (2), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_LOG`
FormCode: `ECMFORKBREA`
Child-list recommendation: `MainDB_LOG_Ext_ECMFORKBREA_Rows` candidate for repeating row fields

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
| MASTER-193-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-193-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-193-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 44 |
| Workflow Signal Count | 15 |
| Notes | - |
