# Master App PDF Source - Resource Reservation

> Master row: 133 | Site: Penang | Owner: - | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 133 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Resource Reservation | Clearly Found |
| Owner | - | Clearly Found |
| Department | Admin \| Critical App | Source inventory |
| Form List | Room - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RESORESE | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Admin/002_oleObject2.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1219 | 21 | 5 | ROOM ARRANGEMENT REQUISITION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Room Arrangement Requisition | Inferred from PDF text | Needs Human Confirmation |
| 2 | No Food To Be Consumed In Any Of The Rooms Except | Inferred from PDF text | Needs Human Confirmation |
| 3 | Coffee, Tea & Biscuits. | Inferred from PDF text | Needs Human Confirmation |
| 4 | REQUESTOR'S SECTION | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Details | Inferred from PDF text | Needs Human Confirmation |
| 6 | Admin Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Ioiadmin | Inferred from PDF text | Needs Human Confirmation |
| 8 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No | RDARNo | Text | 1 | Parsed from PDF text |
| 2 | Required On | DateRequired; DateRequired_1 | Date/Text | 1 | Parsed from PDF text |
| 3 | Function | Function | Text | 1 | Parsed from PDF text |
| 4 | No Of Pax | Pax | Text | 1 | Parsed from PDF text |
| 5 | Visitors / Company | Visitors | Text | 1 | Parsed from PDF text |
| 6 | Venue | Venue | Text | 1 | Parsed from PDF text |
| 7 | Reservation) | Equipment | Text | 1 | Parsed from PDF text |
| 8 | Refreshment | Refreshment | Text | 1 | Parsed from PDF text |
| 9 | Requested By | Requestor | Person/Text | 1 | Parsed from PDF text |
| 10 | Requested Date | DateRequested | Date/Text | 1 | Parsed from PDF text |
| 11 | Admin Staff | AdminStaff; AdminName | Person/Text | 1 | Parsed from PDF text |
| 12 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 13 | Comments | Comments | Multiline Text | 1 | Parsed from PDF text |
| 14 | Date Completed | DateCompleted | Date/Text | 1 | Parsed from PDF text |
| 15 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 16 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 17 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 18 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 19 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 20 | IOI Admin | IOIADMIN | Text | 1 | Parsed from PDF text |
| 21 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), submit (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_ADMINCRITICALAPP`
FormCode: `RESORESE`
Child-list recommendation: `MainDB_ADMINCRITICALAPP_Ext_RESORESE_Rows` candidate for repeating row fields

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
| MASTER-133-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-133-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-133-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 5 |
| Notes | - |
