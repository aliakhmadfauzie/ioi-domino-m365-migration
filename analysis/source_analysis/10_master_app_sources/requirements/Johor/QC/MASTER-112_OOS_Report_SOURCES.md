# Master App PDF Source - OOS Report

> Master row: 112 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 112 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | OOS Report | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PHBSVR | Source inventory |
| Form List | OOS2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | OOSREPO | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/030_oleObject193.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 6 | 3443 | 40 | 14 | Division |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cc5 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Cpa_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Cc3 | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Cpa | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc4 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Implementation :- | Inferred from PDF text | Needs Human Confirmation |
| 9 | Effectiveness :- | Inferred from PDF text | Needs Human Confirmation |
| 10 | Qcd-44/061220/02 | Inferred from PDF text | Needs Human Confirmation |
| 11 | CAStatus - Verification | Inferred from PDF text | Needs Human Confirmation |
| 12 | Isg Admin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Reference No. | RefNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 3 | Initiator | Requestor1; NoIdRequestor1 | Person/Text | 1 | Parsed from PDF text |
| 4 | Location (Initiator) | Location | Text | 1 | Parsed from PDF text |
| 5 | To | Recipient1; NoIdRecipient1 | Text | 1 | Parsed from PDF text |
| 6 | Location (Recipient) | Location2 | Text | 1 | Parsed from PDF text |
| 7 | cc | CC1 | Text | 1 | Parsed from PDF text |
| 8 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 9 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 10 | cc | CC2 | Text | 1 | Parsed from PDF text |
| 11 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 12 | Date | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 13 | cc | CC5 | Text | 1 | Parsed from PDF text |
| 14 | Acceptance | CPA_1 | Text | 1 | Parsed from PDF text |
| 15 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 16 | non-conformance | Significance | Text | 1 | Parsed from PDF text |
| 17 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 18 | New date to be reviewed | NewDateReview | Date/Text | 1 | Parsed from PDF text |
| 19 | testing result/Work | Selection1 | Text | 1 | Parsed from PDF text |
| 20 | Date | Date2_1 | Date/Text | 1 | Parsed from PDF text |
| 21 | Comments | Comment1_2_1 | Multiline Text | 1 | Parsed from PDF text |
| 22 | Attachment | attach_1_1_1 | Text | 1 | Parsed from PDF text |
| 23 | actions | Selection2 | Text | 1 | Parsed from PDF text |
| 24 | Date | Date2 | Date/Text | 1 | Parsed from PDF text |
| 25 | Comments | Comment1_2 | Multiline Text | 1 | Parsed from PDF text |
| 26 | Attachment | attach_1_1 | Text | 1 | Parsed from PDF text |
| 27 | cc | CC3 | Text | 1 | Parsed from PDF text |
| 28 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 29 | Comments | Comment1_1 | Multiline Text | 1 | Parsed from PDF text |
| 30 | Send To | CC4 | Text | 1 | Parsed from PDF text |
| 31 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 32 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 33 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 34 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 35 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Verified on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 37 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 38 | Attachment | attach_2 | Text | 1 | Parsed from PDF text |
| 39 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 40 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (4), review (3), reviewed (2), status (2), currentaction (1), rejected (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `OOSREPO`
Child-list recommendation: `MainDB_QC_Ext_OOSREPO_Rows` candidate for repeating row fields

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
| MASTER-112-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-112-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-112-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 40 |
| Workflow Signal Count | 14 |
| Notes | - |
