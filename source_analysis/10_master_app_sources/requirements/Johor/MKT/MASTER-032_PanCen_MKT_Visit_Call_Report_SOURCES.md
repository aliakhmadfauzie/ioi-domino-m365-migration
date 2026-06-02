# Master App PDF Source - PanCen - MKT Visit/Call Report

> Master row: 32 | Site: Johor | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 32 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - MKT Visit/Call Report | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | MARKETING \| PCNSVR | Source inventory |
| Form List | CountryDetails - Form \| VisitReportV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MKTVISICALL | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/005_oleObject59.pdf | Extracted embedded PDF | sheet_order_fallback | 0.058 | Explicit mapping | 1 | 86 | 2 | 0 | New entry for Country and Phone Code (IDD) |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/006_oleObject60.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 4 | 1080 | 28 | 4 | VISIT/CALL REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Visit/Call Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Customer Details Selection | Inferred from PDF text | Needs Human Confirmation |
| 4 | Details of Discussion | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Mktsn | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Country | CountryName | Person/Text | 1 | Parsed from PDF text |
| 2 | IDD Code | PhoneCode | Text | 1 | Parsed from PDF text |
| 3 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 4 | CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 6 | Date of Visit | VisitDate | Date/Text | 1 | Parsed from PDF text |
| 7 | Country | Country | Text | 1 | Parsed from PDF text |
| 8 | Company's Name | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 9 | Address | Address | Text | 1 | Parsed from PDF text |
| 10 | Category | CustomerType | Choice/Text | 1 | Parsed from PDF text |
| 11 | Customer Type | CustPros1 | Choice/Text | 1 | Parsed from PDF text |
| 12 | Subject | Subject | Text | 1 | Parsed from PDF text |
| 13 | Representative (s) Name | RepName | Person/Text | 1 | Parsed from PDF text |
| 14 | Meeting Person Name | PersonName | Person/Text | 1 | Parsed from PDF text |
| 15 | Position | Position | Text | 1 | Parsed from PDF text |
| 16 | Objectives of Visit | Objectives | Text | 1 | Parsed from PDF text |
| 17 | Company's Background | ComBackground | Text | 1 | Parsed from PDF text |
| 18 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 19 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 20 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 21 | WhoCanAccess | ISG | Text | 1 | Parsed from PDF text |
| 22 | Readers | WhoCanRead | Text | 1 | Parsed from PDF text |
| 23 | Default Recipient | DefaultRecipients | Text | 1 | Parsed from PDF text |
| 24 | Marketing (SN) | MKTSN | Text | 1 | Parsed from PDF text |
| 25 | MKT Exes | MKTExecs | Text | 1 | Parsed from PDF text |
| 26 | Compute CC list | CCNames | Person/Text | 1 | Parsed from PDF text |
| 27 | ACM MKT Manager | ACMMgr | Text | 1 | Parsed from PDF text |
| 28 | To Append User to WhoCanRead | newAppend | Text | 1 | Parsed from PDF text |
| 29 | Temp Role for amendments | TempEditor | Text | 1 | Parsed from PDF text |
| 30 | Servers | Servers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `MKTVISICALL`
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
| MASTER-032-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-032-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-032-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 30 |
| Workflow Signal Count | 4 |
| Notes | - |
