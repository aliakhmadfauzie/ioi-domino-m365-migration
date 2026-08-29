# Master App PDF Source - Lab Work Request (LWR)

> Master row: 282 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 282 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Lab Work Request (LWR) | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| IMS Related \| PHBSVR | Source inventory |
| Form List | Others - Form \| QC Laboratory Preventive Action Request - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | LABWORKLWR | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/014_oleObject185.pdf | Extracted embedded PDF | sheet_order_fallback | 0.378 | Explicit mapping | 1 | 371 | 10 | 2 | Others |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/032_oleObject203.pdf | Extracted embedded PDF | text_match_high | 0.754 | Explicit mapping | 3 | 2653 | 6 | 29 | QC Laboratory Preventive Action |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | OBSOLETE SECTION | Inferred from PDF text | Needs Human Confirmation |
| 2 | OBSOLETE SECTION: | Inferred from PDF text | Needs Human Confirmation |
| 3 | Qcadmin | Inferred from PDF text | Needs Human Confirmation |
| 4 | Request | Inferred from PDF text | Needs Human Confirmation |
| 5 | Potential Non-Conformance | Inferred from PDF text | Needs Human Confirmation |
| 6 | Description | Inferred from PDF text | Needs Human Confirmation |
| 7 | Proposed Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 8 | Preventive Action | Inferred from PDF text | Needs Human Confirmation |
| 9 | By Whom | Inferred from PDF text | Needs Human Confirmation |
| 10 | By When | Inferred from PDF text | Needs Human Confirmation |
| 11 | Approval By QC Manager | Inferred from PDF text | Needs Human Confirmation |
| 12 | * Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Year | Year | Text | 1 | Parsed from PDF text |
| 2 | Distributed to | DistributeTo | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Description/ Remark | Desc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 6 | Remarks | ObsCom | Multiline Text | 1 | Parsed from PDF text |
| 7 | CA | CA | Text | 1 | Parsed from PDF text |
| 8 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 9 | Admin | QCADMIN | Text | 1 | Parsed from PDF text |
| 10 | IT | IT | Text | 1 | Parsed from PDF text |
| 11 | (Recipient) | cboLabLoc2 | Text | 1 | Parsed from PDF text |
| 12 | Attachment | rTxtAttachment | Text | 1 | Parsed from PDF text |
| 13 | * Replied By | txtRepliedBy | Text | 1 | Parsed from PDF text |
| 14 | * Comments | txtVerImpComments | Multiline Text | 1 | Parsed from PDF text |
| 15 | Attachment | rTxtVerImpAttachment | Text | 1 | Parsed from PDF text |
| 16 | Attachment | rTxtVerEffAttachment | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (7), hod (5), verification (4), verified (4), approval (3), ca (2), submitted (2), rejected (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `LABWORKLWR`
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
| MASTER-282-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-282-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-282-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 31 |
| Notes | - |
