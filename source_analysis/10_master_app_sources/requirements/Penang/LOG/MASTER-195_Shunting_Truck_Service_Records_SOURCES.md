# Master App PDF Source - Shunting Truck Service Records

> Master row: 195 | Site: Penang | Owner: LOG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 195 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Shunting Truck Service Records | Clearly Found |
| Owner | LOG | Clearly Found |
| Department | Log \| PHBSVR | Source inventory |
| Form List | IssueLog - Form \| STSR - Form \| STSR SAVE - Form \| LICSR - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHUNTRUCSERV | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/004_oleObject51.pdf | Extracted embedded PDF | sheet_order_fallback | 0.262 | Explicit mapping | 1 | 525 | 16 | 2 | Forklift Non Conformance - Issue Log |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/007_oleObject54.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 741 | 15 | 10 | SHUNTING TRUCK SERVICE RECORDS |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/008_oleObject55.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 1 | 410 | 7 | 1 | TRUCK DAILY INSPECTIONS/OTHER ATTACHMENT |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/009_oleObject56.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 1 | 381 | 4 | 3 | SERVICES RENEWAL RECORDS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Initiator Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Recipient Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | Shunting Truck Service Records | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verifier Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approval Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | Truck Daily Inspections/Other Attachment | Inferred from PDF text | Needs Human Confirmation |
| 8 | Hidden Fields | Inferred from PDF text | Needs Human Confirmation |
| 9 | Current Action | Inferred from PDF text | Needs Human Confirmation |
| 10 | Editor 1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Services Renewal Records | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Recipient | Recipient | Text | 1 | Parsed from PDF text |
| 2 | Forklift No. | ForkliftNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Driver's Name | Driver | Person/Text | 1 | Parsed from PDF text |
| 4 | Site | Site | Text | 1 | Parsed from PDF text |
| 5 | Department/Section | Department | Text | 1 | Parsed from PDF text |
| 6 | Area | Area | Text | 1 | Parsed from PDF text |
| 7 | Issue Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 8 | Description of Issue | Desc | Multiline Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | CC | CC | Text | 1 | Parsed from PDF text |
| 11 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 12 | Action taken | PDesc | Text | 1 | Parsed from PDF text |
| 13 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 14 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 15 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 17 | Truck No. | Truckno | Number/Text | 1 | Parsed from PDF text |
| 18 | Driver Name | Driver | Person/Text | 1 | Parsed from PDF text |
| 19 | Date of Service | ServiceDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Service Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 21 | Service Description | Service | Multiline Text | 1 | Parsed from PDF text |
| 22 | Cost | Cost | Number/Text | 1 | Parsed from PDF text |
| 23 | Truck current mileage | TruckCur | Text | 1 | Parsed from PDF text |
| 24 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 25 | Name | VerName | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Comment | VerComment | Multiline Text | 1 | Parsed from PDF text |
| 28 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 29 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Comment | Comment | Multiline Text | 1 | Parsed from PDF text |
| 31 | Truck No. | Trucknodes | Number/Text | 1 | Parsed from PDF text |
| 32 | Driver Name | Driverdes | Person/Text | 1 | Parsed from PDF text |
| 33 | Date of Service | ServiceDatedes | Date/Text | 1 | Parsed from PDF text |
| 34 | Description | Servicedes | Multiline Text | 1 | Parsed from PDF text |
| 35 | Cost | Costdes | Number/Text | 1 | Parsed from PDF text |
| 36 | Remarks | Remarksdes | Multiline Text | 1 | Parsed from PDF text |
| 37 | Truck No./Trailer No. | Truckno | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (4), approver (4), reject (2), status (2), submitted (1), verified (1), approval (1), approve (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_LOG`
FormCode: `SHUNTRUCSERV`
Child-list recommendation: `MainDB_LOG_Ext_SHUNTRUCSERV_Rows` candidate for repeating row fields

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
| MASTER-195-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-195-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-195-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 4 |
| Parsed Field Count | 37 |
| Workflow Signal Count | 16 |
| Notes | - |
