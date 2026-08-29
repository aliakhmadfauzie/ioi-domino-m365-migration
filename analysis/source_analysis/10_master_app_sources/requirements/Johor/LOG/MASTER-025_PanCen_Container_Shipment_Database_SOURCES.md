# Master App PDF Source - PanCen - Container Shipment Database

> Master row: 25 | Site: Johor | Owner: LOG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 25 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Container Shipment Database | Clearly Found |
| Owner | LOG | Clearly Found |
| Department | LOGISTICS \| Critical App \| PCNSVR | Source inventory |
| Form List | Main_Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CONTSHIP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/LOGISTICS/001_oleObject52.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 4267 | 36 | 8 | CONTAINER SHIPMENT DATABASE |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Container Shipment Database | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A: CONTAINER DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | So No./Item | Inferred from PDF text | Needs Human Confirmation |
| 4 | Quantity(Mts) | Inferred from PDF text | Needs Human Confirmation |
| 5 | Booking No. | Inferred from PDF text | Needs Human Confirmation |
| 6 | Volume | Inferred from PDF text | Needs Human Confirmation |
| 7 | Attachment Booking | Inferred from PDF text | Needs Human Confirmation |
| 8 | Type Of Container | Inferred from PDF text | Needs Human Confirmation |
| 9 | Incoterm | Inferred from PDF text | Needs Human Confirmation |
| 10 | Proforma Invoice Number | Inferred from PDF text | Needs Human Confirmation |
| 11 | Liner | Inferred from PDF text | Needs Human Confirmation |
| 12 | Collection Depot | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SO NO./ITEM | SoNo | Number/Text | 1 | Parsed from PDF text |
| 2 | QUANTITY(MTS) | Quantity | Number/Text | 1 | Parsed from PDF text |
| 3 | BOOKING NO. | BookingNo | Number/Text | 1 | Parsed from PDF text |
| 4 | VOLUME | Volume | Text | 1 | Parsed from PDF text |
| 5 | ATTACHMENT BOOKING | Attachment | Text | 1 | Parsed from PDF text |
| 6 | TYPE OF CONTAINER | Type | Choice/Text | 1 | Parsed from PDF text |
| 7 | PROFORMA INVOICE NUMBER | Proforma | Text | 1 | Parsed from PDF text |
| 8 | LINER | Liner | Text | 1 | Parsed from PDF text |
| 9 | COLLECTION DEPOT | Collection | Text | 1 | Parsed from PDF text |
| 10 | VESSEL | Vessel | Text | 1 | Parsed from PDF text |
| 11 | ETA PORT | EtaPort | Text | 1 | Parsed from PDF text |
| 12 | CUSTOMER | Customer | Text | 1 | Parsed from PDF text |
| 13 | PRODUCT | Product | Text | 1 | Parsed from PDF text |
| 14 | TANK NO | TankNo | Text | 1 | Parsed from PDF text |
| 15 | DATE EMAIL REQUEST | DateEmail | Date/Text | 1 | Parsed from PDF text |
| 16 | EMPTY REQUEST DATE | RequestDate | Date/Text | 1 | Parsed from PDF text |
| 17 | PACKAGING | Packaging | Text | 1 | Parsed from PDF text |
| 18 | PACKING TYPE | PackingType | Choice/Text | 1 | Parsed from PDF text |
| 19 | FORWARDING \ HAULIER | Forwarding | Text | 1 | Parsed from PDF text |
| 20 | ETA POL | PASIR; GUDANG; PTP | Text | 1 | Parsed from PDF text |
| 21 | REMARK | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 22 | YARD OPENING TIME | YOD | Text | 1 | Parsed from PDF text |
| 23 | STATUS | Status | Choice/Text | 1 | Parsed from PDF text |
| 24 | TOTAL CONTAINER | TotalContainer | Number/Text | 1 | Parsed from PDF text |
| 25 | SECTION B | ATTACHMENT | Text | 1 | Parsed from PDF text |
| 26 | SECTION C | PAYMENT | Text | 1 | Parsed from PDF text |
| 27 | CA | CA | Text | 1 | Parsed from PDF text |
| 28 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 29 | Editor PCOC | Editor_PCOC | Text | 1 | Parsed from PDF text |
| 30 | Editor PCEO | Editor_PCEO | Text | 1 | Parsed from PDF text |
| 31 | Editor SNP | Editor_SNP | Text | 1 | Parsed from PDF text |
| 32 | Log PCOC Mail | Log_PCOC | Text | 1 | Parsed from PDF text |
| 33 | Log PCEO Mail | Log_PCEO | Text | 1 | Parsed from PDF text |
| 34 | Log SNP Mail | Log_PSNP | Text | 1 | Parsed from PDF text |
| 35 | IT | ISAdmin | Text | 1 | Parsed from PDF text |
| 36 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (5), ca (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_LOG`
FormCode: `CONTSHIP`
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
| MASTER-025-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-025-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-025-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 36 |
| Workflow Signal Count | 8 |
| Notes | - |
