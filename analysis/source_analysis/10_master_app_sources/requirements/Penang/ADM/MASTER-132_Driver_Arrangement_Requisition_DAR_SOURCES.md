# Master App PDF Source - Driver Arrangement Requisition (DAR)

> Master row: 132 | Site: Penang | Owner: ADM | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 132 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Driver Arrangement Requisition (DAR) | Clearly Found |
| Owner | ADM | Clearly Found |
| Department | Admin \| Critical App | Source inventory |
| Form List | Driver - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | DRIVREQUDAR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Admin/001_oleObject1.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1084 | 21 | 6 | DRIVER ARRANGEMENT REQUISITION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Driver Arrangement Requisition | Inferred from PDF text | Needs Human Confirmation |
| 2 | REQUESTOR'S SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | Other Details | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Details | Inferred from PDF text | Needs Human Confirmation |
| 5 | Admin Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ioiadmin | Inferred from PDF text | Needs Human Confirmation |
| 7 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No | RDARNo | Text | 1 | Parsed from PDF text |
| 2 | Required On/Date of Visit | DateRequired | Date/Text | 1 | Parsed from PDF text |
| 3 | Venue (To/From) | Venue | Text | 1 | Parsed from PDF text |
| 4 | Vehicle (only if applicable) | Vehicle | Text | 1 | Parsed from PDF text |
| 5 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 6 | Estimated time of flight arrival | ArrivalTime | Text | 1 | Parsed from PDF text |
| 7 | Flight Departure Time | DepartureTime | Text | 1 | Parsed from PDF text |
| 8 | Flight No. | FlightNo | Number/Text | 1 | Parsed from PDF text |
| 9 | No. of Visitors | Visitors | Number/Text | 1 | Parsed from PDF text |
| 10 | Host | Host | Text | 1 | Parsed from PDF text |
| 11 | Lunch Standby | Lunch | Text | 1 | Parsed from PDF text |
| 12 | Requested Date | DateRequested | Date/Text | 1 | Parsed from PDF text |
| 13 | Driver's Name | DriverName | Person/Text | 1 | Parsed from PDF text |
| 14 | Driver's HP Number | DriverNo | Text | 1 | Parsed from PDF text |
| 15 | Vehicle No. | VehicleNo | Number/Text | 1 | Parsed from PDF text |
| 16 | Admin Staff | AdminStaff; AdminName | Person/Text | 1 | Parsed from PDF text |
| 17 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 18 | Comments | Comments | Multiline Text | 1 | Parsed from PDF text |
| 19 | Date Completed | DateCompleted | Date/Text | 1 | Parsed from PDF text |
| 20 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 21 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), submit (1), approved (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_ADM`
FormCode: `DRIVREQUDAR`
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
| MASTER-132-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-132-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-132-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 21 |
| Workflow Signal Count | 6 |
| Notes | - |
