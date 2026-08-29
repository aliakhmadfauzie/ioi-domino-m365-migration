# Master App PDF Source - IOI Oleo Excellent Achievement

> Master row: 257 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 257 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IOI Oleo Excellent Achievement | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | Achievement - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | OLEOEXCEACHI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/054_oleObject286.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 878 | 30 | 5 | IOI Oleo Excellent |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Achievement Details | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | OE Chairman's Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Report No. | ReportNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 4 | Description of Achievement | Desc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Department | Dept | Text | 1 | Parsed from PDF text |
| 6 | Attachment & Write Up | Attachment | Text | 1 | Parsed from PDF text |
| 7 | Div/Dept Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 8 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 9 | Date | InitiatedDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Comment | HODCom | Person/Text | 1 | Parsed from PDF text |
| 13 | Name | OEName | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | OEDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Comment | OECom | Multiline Text | 1 | Parsed from PDF text |
| 16 | d by | QABy | Text | 1 | Parsed from PDF text |
| 17 | Date | QADate | Date/Text | 1 | Parsed from PDF text |
| 18 | by | WDBy | Text | 1 | Parsed from PDF text |
| 19 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reason | WDCom | Multiline Text | 1 | Parsed from PDF text |
| 21 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 22 | INO | INO | Text | 1 | Parsed from PDF text |
| 23 | IT | IT | Text | 1 | Parsed from PDF text |
| 24 | OE Chairman | OE | Text | 1 | Parsed from PDF text |
| 25 | QA | QA | Text | 1 | Parsed from PDF text |
| 26 | Editor 1 - Initiator | Editor1 | Text | 1 | Parsed from PDF text |
| 27 | Editor 2 - HOD | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 28 | OE | Editor3 | Text | 1 | Parsed from PDF text |
| 29 | QA | Editor4 | Text | 1 | Parsed from PDF text |
| 30 | QA | Editor5 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), review (1), approval (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `OLEOEXCEACHI`
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
| MASTER-257-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-257-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-257-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 30 |
| Workflow Signal Count | 5 |
| Notes | - |
