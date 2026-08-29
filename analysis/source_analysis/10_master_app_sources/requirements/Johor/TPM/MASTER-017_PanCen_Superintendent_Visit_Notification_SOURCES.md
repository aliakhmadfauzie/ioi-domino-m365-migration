# Master App PDF Source - PanCen - Superintendent Visit Notification

> Master row: 17 | Site: Johor | Owner: TPM | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 17 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Superintendent Visit Notification | Clearly Found |
| Owner | TPM | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | PanCen - Superintendent Visit Notification | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SUPEVISINOTI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/014_oleObject29.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.000 | Embedded metadata fallback needs review | 4 | 1806 | 22 | 14 | SUPERINTENDENT - NIGHT VISIT NOTIFICATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Superintendent - Night Visit Notification | Inferred from PDF text | Needs Human Confirmation |
| 2 | SUPERINTENDENT NIGHT VISIT TEAM SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 4 | REVIEW SECTION | Inferred from PDF text | Needs Human Confirmation |
| 5 | HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 7 | HR HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 9 | Hr Hod | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Hrhod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NVNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Superintendent | TeamMembers | Text | 1 | Parsed from PDF text |
| 3 | Night Visit Date | DateVisit | Date/Text | 1 | Parsed from PDF text |
| 4 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 5 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 6 | Notified by | Notified | Text | 1 | Parsed from PDF text |
| 7 | Investigation Co-ordinator | Inv_Coordinator | Text | 1 | Parsed from PDF text |
| 8 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 9 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 10 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 11 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 12 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 13 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 14 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 15 | HR Admin | HRAdmin | Text | 1 | Parsed from PDF text |
| 16 | HR Personnel | HR | Text | 1 | Parsed from PDF text |
| 17 | ISG Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 18 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 19 | Reminder Date | ReminderDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reminder SendTo | RemindTo | Date/Text | 1 | Parsed from PDF text |
| 21 | Reminder CopyTo | RemindCC | Text | 1 | Parsed from PDF text |
| 22 | Running Number | Year; Month | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (5), approval (2), approve (2), reject (2), currentaction (2), review (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_TPM`
FormCode: `SUPEVISINOTI`
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
| MASTER-017-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-017-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-017-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 22 |
| Workflow Signal Count | 14 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
