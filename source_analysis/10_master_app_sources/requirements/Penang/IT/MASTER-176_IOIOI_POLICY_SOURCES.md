# Master App PDF Source - IOIOI POLICY

> Master row: 176 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 176 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IOIOI POLICY | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| IMS Related \| PHBSVR | Source inventory |
| Form List | IOIOI POLICY | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IOIOPOLI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/003_oleObject124.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 3 | 1138 | 12 | 5 | Page 1 of 3 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | IOIOI POLICY | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Subject | Subject | Text | 1 | Parsed from PDF text |
| 2 | Revision Number | ReviNum | Text | 1 | Parsed from PDF text |
| 3 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 4 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 5 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 6 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 7 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 8 | Date Archieved | DateArchived | Date/Text | 1 | Parsed from PDF text |
| 9 | Form Name | FormName | Person/Text | 1 | Parsed from PDF text |
| 10 | policy Owner | PolicyOwner | Text | 1 | Parsed from PDF text |
| 11 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 12 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), approved (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `IOIOPOLI`
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
| MASTER-176-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-176-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-176-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 5 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
