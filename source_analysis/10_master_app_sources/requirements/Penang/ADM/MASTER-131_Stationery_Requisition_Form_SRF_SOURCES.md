# Master App PDF Source - Stationery Requisition Form (SRF)

> Master row: 131 | Site: Penang | Owner: ADM | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 131 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Stationery Requisition Form (SRF) | Clearly Found |
| Owner | ADM | Clearly Found |
| Department | Admin | Source inventory |
| Form List | Stationery Requisition Form (SRF) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STATREQUSRF | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/ADMIN/DAR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1084 | 21 | 6 | DRIVER ARRANGEMENT REQUISITION |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/ADMIN/RAR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1219 | 21 | 5 | ROOM ARRANGEMENT REQUISITION |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Admin/001_oleObject1.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1084 | 21 | 6 | DRIVER ARRANGEMENT REQUISITION |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Admin/002_oleObject2.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1219 | 21 | 5 | ROOM ARRANGEMENT REQUISITION |

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
| 8 | Room Arrangement Requisition | Inferred from PDF text | Needs Human Confirmation |
| 9 | No Food To Be Consumed In Any Of The Rooms Except | Inferred from PDF text | Needs Human Confirmation |
| 10 | Coffee, Tea & Biscuits. | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Ioiadmin | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Isg | Inferred from PDF text | Needs Human Confirmation |

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
| 22 | Required On | DateRequired; DateRequired_1 | Date/Text | 1 | Parsed from PDF text |
| 23 | Function | Function | Text | 1 | Parsed from PDF text |
| 24 | No Of Pax | Pax | Text | 1 | Parsed from PDF text |
| 25 | Visitors / Company | Visitors | Text | 1 | Parsed from PDF text |
| 26 | Venue | Venue | Text | 1 | Parsed from PDF text |
| 27 | Reservation) | Equipment | Text | 1 | Parsed from PDF text |
| 28 | Refreshment | Refreshment | Text | 1 | Parsed from PDF text |
| 29 | Requested By | Requestor | Person/Text | 1 | Parsed from PDF text |
| 30 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 31 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 32 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 33 | IOI Admin | IOIADMIN | Text | 1 | Parsed from PDF text |
| 34 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (8), submit (4), currentaction (4), ca (4), approved (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_ADM`
FormCode: `STATREQUSRF`
Child-list recommendation: `MainDB_ADM_Ext_STATREQUSRF_Rows` candidate for repeating row fields

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
| MASTER-131-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-131-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-131-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 22 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
