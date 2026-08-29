# Master App PDF Source - Health Info

> Master row: 167 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 167 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Health Info | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Form2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | HEALTHINFO | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/011_oleObject217.pdf | Extracted embedded PDF | sheet_order_fallback | 0.256 | Explicit mapping | 3 | 1212 | 38 | 5 | GIFT/DONATION/SPONSORSHIP |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Gift/Donation/Sponsorship | Inferred from PDF text | Needs Human Confirmation |
| 2 | Notification | Inferred from PDF text | Needs Human Confirmation |
| 3 | PART A - INITIATOR SECTION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Request Type | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Sap_Id | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 7 | PART B - HOD SECTION | Inferred from PDF text | Needs Human Confirmation |
| 8 | Editor1 - Section A | Inferred from PDF text | Needs Human Confirmation |
| 9 | Editor2 - Section B | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Sgm | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Fin - Tcg | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Mkt | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request Type | ReqType | Number/Text | 1 | Parsed from PDF text |
| 2 | Relationship | Recipient | Text | 1 | Parsed from PDF text |
| 3 | the gift | Name | Person/Text | 1 | Parsed from PDF text |
| 4 | Address | Address | Text | 1 | Parsed from PDF text |
| 5 | SAP No. / Vendor ID No. | SAP_ID | Number/Text | 1 | Parsed from PDF text |
| 6 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 7 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 8 | Department | Department | Text | 1 | Parsed from PDF text |
| 9 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 10 | Purpose of the gift | Purpose | Text | 1 | Parsed from PDF text |
| 11 | Benefit to Company | IsBenefit | Text | 1 | Parsed from PDF text |
| 12 | Gift with Company Logo | IsLogo | Text | 1 | Parsed from PDF text |
| 13 | (Actual/Estimation) | RM | Text | 1 | Parsed from PDF text |
| 14 | text | DateRec | Date/Text | 1 | Parsed from PDF text |
| 15 | Quantity | Quantity | Number/Text | 1 | Parsed from PDF text |
| 16 | Price per Unit | RM; Price | Number/Text | 1 | Parsed from PDF text |
| 17 | Total Cost | RM | Number/Text | 1 | Parsed from PDF text |
| 18 | Purchase through PO | IsPO | Text | 1 | Parsed from PDF text |
| 19 | PO Number (if applicable) | PoNo | Text | 1 | Parsed from PDF text |
| 20 | by | Notified | Text | 1 | Parsed from PDF text |
| 21 | Position | position | Text | 1 | Parsed from PDF text |
| 22 | Date | reportedDate | Date/Text | 1 | Parsed from PDF text |
| 23 | by | HODName | Person/Text | 1 | Parsed from PDF text |
| 24 | Position | HODPost | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 27 | Editor1 - Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 28 | Editor2 - Section B | Editor2 | Text | 1 | Parsed from PDF text |
| 29 | ED | ED | Text | 1 | Parsed from PDF text |
| 30 | SGM | SGM | Text | 1 | Parsed from PDF text |
| 31 | HR | HR | Text | 1 | Parsed from PDF text |
| 32 | FIN | FIN; TCG | Text | 1 | Parsed from PDF text |
| 33 | PUR | PUR | Text | 1 | Parsed from PDF text |
| 34 | MKT | MKT | Text | 1 | Parsed from PDF text |
| 35 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 36 | INO | INO | Text | 1 | Parsed from PDF text |
| 37 | MailingList | MailList | Text | 1 | Parsed from PDF text |
| 38 | Readers | Readers | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), submitted (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HEALTHINFO`
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
| MASTER-167-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-167-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-167-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 5 |
| Notes | - |
