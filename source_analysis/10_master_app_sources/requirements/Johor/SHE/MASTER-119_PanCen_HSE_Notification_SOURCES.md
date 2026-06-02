# Master App PDF Source - PanCen - HSE Notification

> Master row: 119 | Site: Johor | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 119 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - HSE Notification | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PCNSVR | Source inventory |
| Form List | HSERNO - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | HSENOTI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/SHE/005_oleObject217.pdf | Extracted embedded PDF | text_match_high | 0.753 | Explicit mapping | 6 | 5149 | 35 | 87 | Title |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Main Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - DETAILS OF DOCUMENT | Inferred from PDF text | Needs Human Confirmation |
| 3 | Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B : RECORDS OF ISSUES (ESTABLISHMENT OR REVISION) | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ini_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ini_2 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Issuance Date | IssuanceDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Business Division | BA | Text | 1 | Parsed from PDF text |
| 6 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 7 | Department/Section | Dept | Text | 1 | Parsed from PDF text |
| 8 | Activity | Activity | Text | 1 | Parsed from PDF text |
| 9 | Category | Category2 | Choice/Text | 1 | Parsed from PDF text |
| 10 | Location | Location | Text | 1 | Parsed from PDF text |
| 11 | HOD Name | HOD | Person/Text | 1 | Parsed from PDF text |
| 12 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 13 | Date Submitted | DateSubmitted | Date/Text | 1 | Parsed from PDF text |
| 14 | Initiator | NameSubmitted | Person/Text | 1 | Parsed from PDF text |
| 15 | HOD Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date Approved | HODDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Comment | HODComment | Person/Text | 1 | Parsed from PDF text |
| 18 | SHE HOD Name | SHEHODName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date Approved | SHEHODDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Comment | SHEHODComment | Person/Text | 1 | Parsed from PDF text |
| 21 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 22 | IT | IT | Text | 1 | Parsed from PDF text |
| 23 | CC | CC | Text | 1 | Parsed from PDF text |
| 24 | Issue No | IssueNo | Text | 1 | Parsed from PDF text |
| 25 | All Issue Nos | AllIssNo | Text | 1 | Parsed from PDF text |
| 26 | All Issue Dates | AllIssDt | Date/Text | 1 | Parsed from PDF text |
| 27 | All Review Dates | AllRevDt | Date/Text | 1 | Parsed from PDF text |
| 28 | INO | INO | Text | 1 | Parsed from PDF text |
| 29 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 30 | SHE HOD | SHEHOD | Person/Text | 1 | Parsed from PDF text |
| 31 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 32 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 33 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 34 | SHE PIC | SHEPIC | Person/Text | 1 | Parsed from PDF text |
| 35 | RemDate | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approve (33), reject (32), hod (9), review (4), approval (4), approved (2), reviewed (1), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `HSENOTI`
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
| MASTER-119-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-119-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-119-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 35 |
| Workflow Signal Count | 87 |
| Notes | - |
