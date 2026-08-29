# Master App PDF Source - Organisation Charts

> Master row: 153 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 153 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Organisation Charts | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| IMS Related \| PHBSVR | Source inventory |
| Form List | NewOrgChart - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | ORGCHART | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/019_oleObject225.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 2828 | 31 | 11 | IOI OLEOCHEMICAL INDUSTRIES BHD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries Bhd | Inferred from PDF text | Needs Human Confirmation |
| 2 | Main Section: | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | Rejection: | Inferred from PDF text | Needs Human Confirmation |
| 5 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Jus_3 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_4 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Current Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 2 | Org Chart Num | OrgChartNum | Text | 1 | Parsed from PDF text |
| 3 | List) | attach_1 | Text | 1 | Parsed from PDF text |
| 4 | Submitted by | DraftSubBy | Text | 1 | Parsed from PDF text |
| 5 | Comments | DraftRemarks | Multiline Text | 1 | Parsed from PDF text |
| 6 | Reviewed by | DraftRevBy | Text | 1 | Parsed from PDF text |
| 7 | Org Chart Ref | OrgSelection | Text | 1 | Parsed from PDF text |
| 8 | New Changes | Changes | Text | 1 | Parsed from PDF text |
| 9 | Remarks | HRRem | Multiline Text | 1 | Parsed from PDF text |
| 10 | Num | OrgNum | Text | 1 | Parsed from PDF text |
| 11 | Distribution List | DistributionList | Text | 1 | Parsed from PDF text |
| 12 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 13 | Drafted on | DraftedOn | Text | 1 | Parsed from PDF text |
| 14 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 15 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 17 | HR PIC-Admin | HRPIC | Person/Text | 1 | Parsed from PDF text |
| 18 | HR Manager - PrepareBy | HRMgr | Text | 1 | Parsed from PDF text |
| 19 | HR | HR | Text | 1 | Parsed from PDF text |
| 20 | HR 2 | HR2 | Text | 1 | Parsed from PDF text |
| 21 | Editor | WhoMayEdit | Text | 1 | Parsed from PDF text |
| 22 | WhoCanRead | Readers | Text | 1 | Parsed from PDF text |
| 23 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 24 | Pasted date | DatePasted | Date/Text | 1 | Parsed from PDF text |
| 25 | Draft Reminder | RemDraftDate | Date/Text | 1 | Parsed from PDF text |
| 26 | RemInitiatorDate1 | RemInitiatorDate1; Reminder | Date/Text | 1 | Parsed from PDF text |
| 27 | SentStatus | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 28 | RemInitiatorDate2 | RemInitiatorDate2; Reminder | Date/Text | 1 | Parsed from PDF text |
| 29 | RemVer1 | RemVer1Date | Date/Text | 1 | Parsed from PDF text |
| 30 | RemEnd1 | RemEnd1Date | Date/Text | 1 | Parsed from PDF text |
| 31 | RemApp1 | RemApp1Date | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (3), status (2), reviewed (2), verified (1), approved (1), hod (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `ORGCHART`
Child-list recommendation: `MainDB_HR_Ext_ORGCHART_Rows` candidate for repeating row fields

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
| MASTER-153-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-153-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-153-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 31 |
| Workflow Signal Count | 11 |
| Notes | - |
