# Master App PDF Source - Tanker Problem Reporting

> Master row: 327 | Site: Penang | Owner: SEC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 327 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Tanker Problem Reporting | Clearly Found |
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
| source/Project Iventories/extracted-embedded-pdfs/Penang/Security/006_oleObject105.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1799 | 37 | 6 | TANKER PROBLEM REPORTING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Tanker Problem Reporting | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - REQUESTOR | Inferred from PDF text | Needs Human Confirmation |
| 3 | Request No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B - RECIPIENT | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION C - HEAD OF DEPARTMENT | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION D - SECURITY HOS VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | Ghr-16/281022/00 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Sec | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 2 | CC | CopyTo | Text | 1 | Parsed from PDF text |
| 3 | Company | Company | Text | 1 | Parsed from PDF text |
| 4 | Gate | Gate | Text | 1 | Parsed from PDF text |
| 5 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 6 | Tanker No | TankerNo | Text | 1 | Parsed from PDF text |
| 7 | Tanker Latch | TankerLatch | Text | 1 | Parsed from PDF text |
| 8 | Driver's Name | DriverName | Person/Text | 1 | Parsed from PDF text |
| 9 | Vendor | Vendor | Text | 1 | Parsed from PDF text |
| 10 | Transporter | Transporter | Text | 1 | Parsed from PDF text |
| 11 | Product | Product | Text | 1 | Parsed from PDF text |
| 12 | Mode | Mode | Text | 1 | Parsed from PDF text |
| 13 | Problem Description | Detail | Multiline Text | 1 | Parsed from PDF text |
| 14 | Date of Incident | DateReported | Date/Text | 1 | Parsed from PDF text |
| 15 | Time of Incident | TimeReported | Text | 1 | Parsed from PDF text |
| 16 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 17 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 18 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 20 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remarks | Appremarks | Multiline Text | 1 | Parsed from PDF text |
| 23 | Name | VerName | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Remarks | Verremarks | Multiline Text | 1 | Parsed from PDF text |
| 26 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 27 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 28 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 29 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 30 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 31 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 32 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 33 | Security Personnel | SEC | Text | 1 | Parsed from PDF text |
| 34 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 35 | Send To | To | Text | 1 | Parsed from PDF text |
| 36 | CC | CC | Text | 1 | Parsed from PDF text |
| 37 | Default CC list | DefCC | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), currentaction (2), hod (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HRAPR`
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
| MASTER-327-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-327-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-327-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 37 |
| Workflow Signal Count | 6 |
| Notes | - |
