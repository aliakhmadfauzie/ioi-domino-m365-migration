# Master App PDF Source - MKT Visit/Call Report

> Master row: 208 | Site: Penang | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 208 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | MKT Visit/Call Report | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | Mktg \| PHBSVR | Source inventory |
| Form List | VisitReportV2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MKTVISICALL | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Mktg/005_oleObject14.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 3 | 1515 | 42 | 4 | VISIT/CALL REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Visit/Call Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 3 | Customer Details Selection | Inferred from PDF text | Needs Human Confirmation |
| 4 | Details of Discussion | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 6 | Acm Mkt | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Acmmkt | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ecm Mkt | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Ecmmkt | Inferred from PDF text | Needs Human Confirmation |
| 10 | Mkt Acm | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Mktacm | Inferred from PDF text | Needs Human Confirmation |
| 12 | Mkt Asn: Asnmkt | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CC | Text | 1 | Parsed from PDF text |
| 3 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 4 | Date of Visit | VisitDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Country | Country | Text | 1 | Parsed from PDF text |
| 6 | Company's Name | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 7 | Address | Address | Text | 1 | Parsed from PDF text |
| 8 | Category | CustomerType | Choice/Text | 1 | Parsed from PDF text |
| 9 | Customer Type | CustPros1 | Choice/Text | 1 | Parsed from PDF text |
| 10 | Subject | Subject | Text | 1 | Parsed from PDF text |
| 11 | Representative (s) | RepName | Person/Text | 1 | Parsed from PDF text |
| 12 | Meeting Person Name | PersonName | Person/Text | 1 | Parsed from PDF text |
| 13 | Position | Position | Text | 1 | Parsed from PDF text |
| 14 | Objectives of Visit | Objectives | Text | 1 | Parsed from PDF text |
| 15 | Company's Background | ComBackground | Text | 1 | Parsed from PDF text |
| 16 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 17 | Company Core Business | CoreBus | Text | 1 | Parsed from PDF text |
| 18 | Region | Region | Text | 1 | Parsed from PDF text |
| 19 | Interested Product | IntProd | Text | 1 | Parsed from PDF text |
| 20 | Forecast Volume (per annum) | Volume | Text | 1 | Parsed from PDF text |
| 21 | Target Price (in USD) | TargetPrice | Number/Text | 1 | Parsed from PDF text |
| 22 | Current Supplier | CurrSupplier | Text | 1 | Parsed from PDF text |
| 23 | Intended Application | ProdApplication | Text | 1 | Parsed from PDF text |
| 24 | Add additional Readers here | AddReaders | Text | 1 | Parsed from PDF text |
| 25 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 26 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 27 | AEditor1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 28 | WhoCanAccess | ISG | Text | 1 | Parsed from PDF text |
| 29 | Default Recipient | DefaultRecipients | Text | 1 | Parsed from PDF text |
| 30 | ACM MKT | ACMMKT | Text | 1 | Parsed from PDF text |
| 31 | ECM MKT | ECMMKT | Text | 1 | Parsed from PDF text |
| 32 | MKT ACM | MKTACM | Text | 1 | Parsed from PDF text |
| 33 | MKT ASN | ASNMKT | Text | 1 | Parsed from PDF text |
| 34 | MKT ECM | MKTECM | Text | 1 | Parsed from PDF text |
| 35 | MKT PCOC | MKTPOC | Text | 1 | Parsed from PDF text |
| 36 | MKT PFA | MKTPFA | Text | 1 | Parsed from PDF text |
| 37 | MKT Exes | MKTExecs | Text | 1 | Parsed from PDF text |
| 38 | MKT Head | MKT | Text | 1 | Parsed from PDF text |
| 39 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 40 | Readers | WhoCanRead | Text | 1 | Parsed from PDF text |
| 41 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 42 | Web URL | WebURL | Text | 1 | Parsed from PDF text |

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
| MASTER-208-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-208-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-208-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 42 |
| Workflow Signal Count | 4 |
| Notes | - |
