# Master App PDF Source - TQM Training Database

> Master row: 275 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 275 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | TQM Training Database | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | TQMConf - Form \| TQMTM - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TQMTRAI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/084_oleObject316.pdf | Extracted embedded PDF | text_match_high | 0.753 | Explicit mapping | 2 | 1372 | 32 | 5 | TQM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/086_oleObject318.pdf | Extracted embedded PDF | text_match_high | 0.756 | Explicit mapping | 2 | 637 | 19 | 1 | TQM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Hrhod | Inferred from PDF text | Needs Human Confirmation |
| 2 | Tt_10 | Inferred from PDF text | Needs Human Confirmation |
| 3 | Tm_10 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Training Number | TQMNo | Text | 1 | Parsed from PDF text |
| 2 | Notification Date | NotDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Training Date | FDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Date | dDate_2 | Date/Text | 1 | Parsed from PDF text |
| 5 | Time | tTime_2 | Text | 1 | Parsed from PDF text |
| 6 | Venue | tVenue_1 | Text | 1 | Parsed from PDF text |
| 7 | Date | dDate_3 | Date/Text | 1 | Parsed from PDF text |
| 8 | Time | tTime_3 | Text | 1 | Parsed from PDF text |
| 9 | Venue | tVenue_2 | Text | 1 | Parsed from PDF text |
| 10 | Training Program Name | ProgName | Person/Text | 1 | Parsed from PDF text |
| 11 | Target Group | TrGrp | Text | 1 | Parsed from PDF text |
| 12 | Final list for TQM Training | FinalList | Text | 1 | Parsed from PDF text |
| 13 | CC (Participant's HOS/HOD) | CC | Person/Text | 1 | Parsed from PDF text |
| 14 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 15 | Follow up Date | FollowupDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Training Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 17 | Training Completion Date | CompDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Remark | Remark2 | Multiline Text | 1 | Parsed from PDF text |
| 19 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 20 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 21 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 22 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 23 | IT | IT | Text | 1 | Parsed from PDF text |
| 24 | QA | QA | Text | 1 | Parsed from PDF text |
| 25 | QA Roles | QARoles | Text | 1 | Parsed from PDF text |
| 26 | T&D | TND | Text | 1 | Parsed from PDF text |
| 27 | HRHOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 28 | OE Council | OE | Text | 1 | Parsed from PDF text |
| 29 | TQM Trainers | Trainers | Text | 1 | Parsed from PDF text |
| 30 | INO | INO | Text | 1 | Parsed from PDF text |
| 31 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 32 | Readers | NIUReaders | Text | 1 | Parsed from PDF text |
| 33 | Training Material Number | TQMNo | Text | 1 | Parsed from PDF text |
| 34 | CC | CC | Text | 1 | Parsed from PDF text |
| 35 | Uploaded By | UplName | Person/Text | 1 | Parsed from PDF text |
| 36 | Uploaded Date | UplDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), ca (2), hod (1), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `TQMTRAI`
Child-list recommendation: `MainDB_QA_Ext_TQMTRAI_Rows` candidate for repeating row fields

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
| MASTER-275-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-275-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-275-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 36 |
| Workflow Signal Count | 6 |
| Notes | - |
