# Master App PDF Source - IN-HOUSE Training Application

> Master row: 346 | Site: Penang | Owner: T&D | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 346 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | IN-HOUSE Training Application | Clearly Found |
| Owner | T&D | Clearly Found |
| Department | T&D \| PHBSVR | Source inventory |
| Form List | ApplicationForm3 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | INHOUSTRAI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/T_D/003_oleObject108.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 3013 | 33 | 14 | In -House |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | To Be Filled In By Requestor | Inferred from PDF text | Needs Human Confirmation |
| 2 | Training Objective | Inferred from PDF text | Needs Human Confirmation |
| 3 | Result Expected | Inferred from PDF text | Needs Human Confirmation |
| 4 | TENTATIVE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 5 | Target Group | Inferred from PDF text | Needs Human Confirmation |
| 6 | Category Of Training | Inferred from PDF text | Needs Human Confirmation |
| 7 | Type Of Training Evaluation | Inferred from PDF text | Needs Human Confirmation |
| 8 | Facilities Required | Inferred from PDF text | Needs Human Confirmation |
| 9 | Meals Required | Inferred from PDF text | Needs Human Confirmation |
| 10 | Training Materials Required | Inferred from PDF text | Needs Human Confirmation |
| 11 | Expected Costing | Inferred from PDF text | Needs Human Confirmation |
| 12 | Remark | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date | dDate_2 | Date/Text | 1 | Parsed from PDF text |
| 2 | Time | tTime_2 | Text | 1 | Parsed from PDF text |
| 3 | Venue | tVenue_1 | Text | 1 | Parsed from PDF text |
| 4 | Date | dDate_3 | Date/Text | 1 | Parsed from PDF text |
| 5 | Venue | tVenue_2 | Text | 1 | Parsed from PDF text |
| 6 | Date | Date | Date/Text | 1 | Parsed from PDF text |
| 7 | Status | tHODStatus | Person/Text | 1 | Parsed from PDF text |
| 8 | (Estimated amount | RM | Number/Text | 1 | Parsed from PDF text |
| 9 | us | tTDStatus | Choice/Text | 1 | Parsed from PDF text |
| 10 | Remarks | tTD_Remark | Multiline Text | 1 | Parsed from PDF text |
| 11 | Status | tHRStatus | Choice/Text | 1 | Parsed from PDF text |
| 12 | Remarks | tHR_Remark | Multiline Text | 1 | Parsed from PDF text |
| 13 | Training Notification Sent | Status | Choice/Text | 1 | Parsed from PDF text |
| 14 | Remark | TndRemarks | Multiline Text | 1 | Parsed from PDF text |
| 15 | Training Grant Applied? | Grant | Text | 1 | Parsed from PDF text |
| 16 | Date Applied | DateAppliedG | Date/Text | 1 | Parsed from PDF text |
| 17 | Training Claims Applied? | Claim | Text | 1 | Parsed from PDF text |
| 18 | Date Applied | DateAppliedC | Date/Text | 1 | Parsed from PDF text |
| 19 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 20 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 21 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 22 | Editor 1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 23 | Editor 2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 24 | Editor 3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 25 | Editor 4 | AEditor4 | Text | 1 | Parsed from PDF text |
| 26 | Editor 5 | AEditor5 | Text | 1 | Parsed from PDF text |
| 27 | COO | COO | Text | 1 | Parsed from PDF text |
| 28 | Admin | Admin | Text | 1 | Parsed from PDF text |
| 29 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 30 | tTD | TND | Text | 1 | Parsed from PDF text |
| 31 | Year | Year | Text | 1 | Parsed from PDF text |
| 32 | Month | Month | Text | 1 | Parsed from PDF text |
| 33 | Notification No | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (4), hod (3), status (3), currentaction (2), approved (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_T&D`
FormCode: `INHOUSTRAI`
Child-list recommendation: `MainDB_T&D_Ext_INHOUSTRAI_Rows` candidate for repeating row fields

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
| MASTER-346-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-346-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-346-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 33 |
| Workflow Signal Count | 14 |
| Notes | - |
