# Master App PDF Source - Pancen - Filter Paper PFAD Despatch

> Master row: 109 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 109 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Filter Paper PFAD Despatch | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PCNSVR | Source inventory |
| Form List | MainPage - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FILTPAPEPFAD | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/001_oleObject164.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 821 | 23 | 15 | IOI PAN-CENTURY EDIBLE OILS SDN. BHD. |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Pan-Century Edible Oils Sdn. Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 2 | Filter Paper Pfad Despatch | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Comment Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verification by PCQI | Inferred from PDF text | Needs Human Confirmation |
| 6 | Comment Verification | Inferred from PDF text | Needs Human Confirmation |
| 7 | Qcd - 45/260824/00 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Status Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | Status Verification | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Doc. No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 2 | SO No. | SONo | Number/Text | 1 | Parsed from PDF text |
| 3 | Customer Name | CustomerName | Person/Text | 1 | Parsed from PDF text |
| 4 | Storage Tank No. | StorageTankNo | Number/Text | 1 | Parsed from PDF text |
| 5 | Tanker No. | TankerNo | Number/Text | 1 | Parsed from PDF text |
| 6 | *Email Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 7 | Filter Paper Photo (attachment) | Attachment | Text | 1 | Parsed from PDF text |
| 8 | Date Submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 9 | Name | ApproverName | Person/Text | 1 | Parsed from PDF text |
| 10 | Date | ApprovedDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Comment Approval | CommentApproval | Multiline Text | 1 | Parsed from PDF text |
| 12 | Name | VerifyName | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | VerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Comment Verification | CommentVerification | Multiline Text | 1 | Parsed from PDF text |
| 15 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 16 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 17 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 18 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 19 | Status Approval | StatusApproval | Choice/Text | 1 | Parsed from PDF text |
| 20 | Status Verification | StatusVerification | Choice/Text | 1 | Parsed from PDF text |
| 21 | Running Number | INO | Text | 1 | Parsed from PDF text |
| 22 | IT | ISADMIN | Text | 1 | Parsed from PDF text |
| 23 | *Email Verifier | Verifier | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (3), verification (3), approver (2), reject (2), status (2), submitted (1), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `FILTPAPEPFAD`
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
| MASTER-109-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-109-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-109-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 23 |
| Workflow Signal Count | 15 |
| Notes | - |
