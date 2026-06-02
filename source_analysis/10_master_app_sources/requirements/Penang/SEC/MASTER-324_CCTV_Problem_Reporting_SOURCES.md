# Master App PDF Source - CCTV Problem Reporting

> Master row: 324 | Site: Penang | Owner: SEC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 324 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | CCTV Problem Reporting | Clearly Found |
| Owner | SEC | Clearly Found |
| Department | Security \| PHBSVR | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | HRAPR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Security/002_oleObject101.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 833 | 28 | 2 | CCTV PROBLEM REPORTING FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Cctv Problem Reporting Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Request No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Sec | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Sgm | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Acm1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Acm2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Acm3 | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Ecm | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request No. | CCTVNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Name | NotiName | Person/Text | 1 | Parsed from PDF text |
| 4 | Ext | Ext | Text | 1 | Parsed from PDF text |
| 5 | Problem | Problem | Text | 1 | Parsed from PDF text |
| 6 | Channel | Channel | Text | 1 | Parsed from PDF text |
| 7 | Date | DateReported; DateReported_1 | Date/Text | 1 | Parsed from PDF text |
| 8 | Time | TimeReported; TimeReported_1 | Text | 1 | Parsed from PDF text |
| 9 | Location | Location | Text | 1 | Parsed from PDF text |
| 10 | Issue Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 11 | Action taken | Action | Text | 1 | Parsed from PDF text |
| 12 | Vendor List | Vendor | Text | 1 | Parsed from PDF text |
| 13 | Attachment | Attachment2 | Text | 1 | Parsed from PDF text |
| 14 | Reported By | ReportedBy | Text | 1 | Parsed from PDF text |
| 15 | Reported On | ReportedTime | Date/Text | 1 | Parsed from PDF text |
| 16 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 17 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 18 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 19 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 20 | Security | SEC | Text | 1 | Parsed from PDF text |
| 21 | Senior GM | SGM | Text | 1 | Parsed from PDF text |
| 22 | Mailing List ACM 1 | ACM1 | Text | 1 | Parsed from PDF text |
| 23 | Mailing List ACM 2 | ACM2 | Text | 1 | Parsed from PDF text |
| 24 | Mailing List ACM 3 | ACM3 | Text | 1 | Parsed from PDF text |
| 25 | Mailing List ECM | ECM | Text | 1 | Parsed from PDF text |
| 26 | Mailing List Food Safety Issue | FS | Text | 1 | Parsed from PDF text |
| 27 | Running Numbers | INO | Text | 1 | Parsed from PDF text |
| 28 | Next Reminder Date | NextRemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HRAPR`
Child-list recommendation: `MainDB_HR_Ext_HRAPR_Rows` candidate for repeating row fields

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
| MASTER-324-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-324-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-324-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 28 |
| Workflow Signal Count | 2 |
| Notes | - |
