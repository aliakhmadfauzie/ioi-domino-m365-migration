# Master App PDF Source - External Access Form (VPN & Citrix)

> Master row: 171 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 171 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | External Access Form (VPN & Citrix) | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT | Source inventory |
| Form List | vpnaccess - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | EXTEACCEVPN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/001_oleObject122.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1208 | 38 | 10 | VPN ACCESS REQUEST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | VPN ACCESS REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | External Access Form (Vpn & | Inferred from PDF text | Needs Human Confirmation |
| 3 | REQUESTOR'S SECTION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Acceptance Of Department Head | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Hodname | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Divname | Inferred from PDF text | Needs Human Confirmation |
| 7 | Acceptance Of It Manager | Inferred from PDF text | Needs Human Confirmation |
| 8 | Acceptance Of It | Inferred from PDF text | Needs Human Confirmation |
| 9 | Acm It | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Acmit | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pcn It | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Pcnit | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Requestor | date1 | Date/Text | 1 | Parsed from PDF text |
| 3 | User | User | Text | 1 | Parsed from PDF text |
| 4 | CC | CC | Text | 1 | Parsed from PDF text |
| 5 | Status | status1 | Choice/Text | 1 | Parsed from PDF text |
| 6 | Accepted by | HODNAME | Person/Text | 1 | Parsed from PDF text |
| 7 | Accepted Date | date2 | Date/Text | 1 | Parsed from PDF text |
| 8 | Comment | comment1 | Multiline Text | 1 | Parsed from PDF text |
| 9 | Status | status2 | Choice/Text | 1 | Parsed from PDF text |
| 10 | Accepted by | DIVNAME | Person/Text | 1 | Parsed from PDF text |
| 11 | Accepted Date | date3 | Date/Text | 1 | Parsed from PDF text |
| 12 | Comment | comment2 | Multiline Text | 1 | Parsed from PDF text |
| 13 | Status | status3 | Choice/Text | 1 | Parsed from PDF text |
| 14 | Accepted by | name4 | Person/Text | 1 | Parsed from PDF text |
| 15 | Accepted Date | date4 | Date/Text | 1 | Parsed from PDF text |
| 16 | Comment | comment3 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Status | status4 | Choice/Text | 1 | Parsed from PDF text |
| 18 | Completed by | name5 | Person/Text | 1 | Parsed from PDF text |
| 19 | Date Sent | date5 | Date/Text | 1 | Parsed from PDF text |
| 20 | Remarks | comment4 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 22 | Created by | Requestor | Person/Text | 1 | Parsed from PDF text |
| 23 | Editors | Authors | Text | 1 | Parsed from PDF text |
| 24 | ACM IT | ACMIT | Text | 1 | Parsed from PDF text |
| 25 | PCN IT | PCNIT | Text | 1 | Parsed from PDF text |
| 26 | PCN IT 2 | PCNIT2 | Text | 1 | Parsed from PDF text |
| 27 | IT PIC | ITPIC | Person/Text | 1 | Parsed from PDF text |
| 28 | IT PIC 2 - Pancen | ITPIC2 | Person/Text | 1 | Parsed from PDF text |
| 29 | ED | ED | Text | 1 | Parsed from PDF text |
| 30 | HOO | HOO | Text | 1 | Parsed from PDF text |
| 31 | Higher Appprover | HApp | Text | 1 | Parsed from PDF text |
| 32 | Recipients & HOD | SendTo | Date/Text | 1 | Parsed from PDF text |
| 33 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 34 | IS Manager | IsMgr | Text | 1 | Parsed from PDF text |
| 35 | Requestor | AEditor1 | Person/Text | 1 | Parsed from PDF text |
| 36 | IT Admin | ITADMIN | Text | 1 | Parsed from PDF text |
| 37 | Reminder To | RemTo | Text | 1 | Parsed from PDF text |
| 38 | Reminder Subject | RemSubject | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), currentaction (2), submitted (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `EXTEACCEVPN`
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
| MASTER-171-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-171-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-171-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 10 |
| Notes | - |
