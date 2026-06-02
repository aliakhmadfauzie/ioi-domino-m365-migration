# Master App PDF Source - ChemSHERPA

> Master row: 291 | Site: Penang | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 291 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ChemSHERPA | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PHBSVR | Source inventory |
| Form List | Form - Form \| chemsherpa - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CHEM | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/002_oleObject173.pdf | Extracted embedded PDF | sheet_order_fallback | 0.379 | Explicit mapping | 2 | 1437 | 13 | 3 | Company regNo |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QC/003_oleObject174.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1404 | 14 | 7 | chemSHERPA - CI |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Hos/Hod | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 2 | Date | Date_1 | Date/Text | 1 | Parsed from PDF text |
| 3 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 4 | Company | Comp | Text | 1 | Parsed from PDF text |
| 5 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 6 | Re | Subject | Text | 1 | Parsed from PDF text |
| 7 | Product | ACMProduct | Text | 1 | Parsed from PDF text |
| 8 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 9 | Products | Product | Text | 1 | Parsed from PDF text |
| 10 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 11 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 12 | QC | QC | Text | 1 | Parsed from PDF text |
| 13 | IT | IT | Text | 1 | Parsed from PDF text |
| 14 | Company | CompName | Person/Text | 1 | Parsed from PDF text |
| 15 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 16 | Number | ProdNo | Text | 1 | Parsed from PDF text |
| 17 | Date Issue | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 18 | Issue No. | IssueNo | Number/Text | 1 | Parsed from PDF text |
| 19 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 20 | Recipient | Recipient | Text | 1 | Parsed from PDF text |
| 21 | HOS/HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 22 | Name | Reviewedby | Person/Text | 1 | Parsed from PDF text |
| 23 | Date | Revieweddate | Date/Text | 1 | Parsed from PDF text |
| 24 | Remark | Reviewedrem | Multiline Text | 1 | Parsed from PDF text |
| 25 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 26 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 27 | on | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), approver (2), currentaction (1), submitted (1), reviewed (1), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `CHEM`
Child-list recommendation: `MainDB_QC_Ext_CHEM_Rows` candidate for repeating row fields

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
| MASTER-291-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-291-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-291-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 10 |
| Notes | - |
