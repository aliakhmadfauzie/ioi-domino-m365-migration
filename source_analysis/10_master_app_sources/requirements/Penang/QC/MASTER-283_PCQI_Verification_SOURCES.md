# Master App PDF Source - PCQI Verification

> Master row: 283 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 283 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | PCQI Verification | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | Resources - Form \| PCQI - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PCQIVERI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/016_oleObject187.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 1 | 392 | 11 | 2 | Resources |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/027_oleObject198.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 682 | 24 | 9 | QC RECORDS - PCQI |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | OBSOLETE SECTION | Inferred from PDF text | Needs Human Confirmation |
| 2 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Qcadmin | Inferred from PDF text | Needs Human Confirmation |
| 4 | Qc Records - Pcqi | Inferred from PDF text | Needs Human Confirmation |
| 5 | VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 6 | Info Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | PCQI Verification | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Year | Year | Text | 1 | Parsed from PDF text |
| 2 | Distributed to | DistributeTo | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 6 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 7 | Remarks | ObsCom | Multiline Text | 1 | Parsed from PDF text |
| 8 | CA | CA | Text | 1 | Parsed from PDF text |
| 9 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 10 | Admin | QCADMIN | Text | 1 | Parsed from PDF text |
| 11 | IT | IT | Text | 1 | Parsed from PDF text |
| 12 | Company | Company | Text | 1 | Parsed from PDF text |
| 13 | Product | Product | Text | 1 | Parsed from PDF text |
| 14 | Category | Topic | Person/Text | 1 | Parsed from PDF text |
| 15 | Title | Title | Text | 1 | Parsed from PDF text |
| 16 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 17 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 18 | Remarks | QCRemarks | Multiline Text | 1 | Parsed from PDF text |
| 19 | Portal | Up | Text | 1 | Parsed from PDF text |
| 20 | Comments | Comment | Multiline Text | 1 | Parsed from PDF text |
| 21 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 22 | Verified by | VerName | Person/Text | 1 | Parsed from PDF text |
| 23 | Date Verified | VerDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Attachment | UpAttch | Text | 1 | Parsed from PDF text |
| 25 | Done by | UpDoneBy | Text | 1 | Parsed from PDF text |
| 26 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 27 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 28 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 29 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 30 | QC | QC | Text | 1 | Parsed from PDF text |
| 31 | QA | QA | Text | 1 | Parsed from PDF text |
| 32 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 33 | Manager | ISG | Text | 1 | Parsed from PDF text |
| 34 | QCAdmin | QCAdmin | Text | 1 | Parsed from PDF text |
| 35 | WhoCanRead | AllowableReader | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (2), verification (2), verified (2), currentaction (2), submitted (1), approve (1), reject (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `PCQIVERI`
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
| MASTER-283-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-283-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-283-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 11 |
| Notes | - |
