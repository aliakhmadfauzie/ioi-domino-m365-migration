# Master App PDF Source - ACM Product Data Sheet (New)

> Master row: 204 | Site: Penang | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 204 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ACM Product Data Sheet (New) | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | Mktg \| IMS Related \| PHBSVR | Source inventory |
| Form List | ACM Product Data Sheet (New) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ACMPRODDATA | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Mktg/002_oleObject11.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 1 | 419 | 12 | 2 | Sales Enquiry (sales@ioioleo.com) |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Mktg/001_oleObject10.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 4 | 1552 | 23 | 13 | title |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Requestor's Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approval Required :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date Created | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 2 | Region | Region | Text | 1 | Parsed from PDF text |
| 3 | SGrp | SGrp | Text | 1 | Parsed from PDF text |
| 4 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 5 | Country | Country | Text | 1 | Parsed from PDF text |
| 6 | Company Name | CustomerName | Person/Text | 1 | Parsed from PDF text |
| 7 | Person Name | PersonName | Person/Text | 1 | Parsed from PDF text |
| 8 | Email Address | EmailAddress | Text | 1 | Parsed from PDF text |
| 9 | Product | Product | Text | 1 | Parsed from PDF text |
| 10 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 11 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 12 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 13 | Reference No. | PSCNo | Number/Text | 1 | Parsed from PDF text |
| 14 | PDS | PDS | Text | 1 | Parsed from PDF text |
| 15 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 16 | Date prepared | predate | Date/Text | 1 | Parsed from PDF text |
| 17 | Date | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 18 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 19 | Comment | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 20 | Comment | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Status | statusapp1 | Choice/Text | 1 | Parsed from PDF text |
| 22 | Status | statusapp2 | Choice/Text | 1 | Parsed from PDF text |
| 23 | Date | dateapp4 | Date/Text | 1 | Parsed from PDF text |
| 24 | Date | dateapp5 | Date/Text | 1 | Parsed from PDF text |
| 25 | Comment | Comment4 | Multiline Text | 1 | Parsed from PDF text |
| 26 | Comment | Comment5 | Multiline Text | 1 | Parsed from PDF text |
| 27 | Status | statusapp4 | Choice/Text | 1 | Parsed from PDF text |
| 28 | Status | statusapp5 | Choice/Text | 1 | Parsed from PDF text |
| 29 | PDS No. | PDSNo | Number/Text | 1 | Parsed from PDF text |
| 30 | Notified date | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Notified by | NotifiedBy | Text | 1 | Parsed from PDF text |
| 32 | Status | DisStatus | Choice/Text | 1 | Parsed from PDF text |
| 33 | Date | DisDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Done by | DisDone | Text | 1 | Parsed from PDF text |
| 35 | Creation date | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (8), approved (2), review (2), approval (1), reviewed (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `ACMPRODDATA`
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
| MASTER-204-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-204-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-204-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 2 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 15 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
