# Master App PDF Source - Pancen - Tanker Inspection

> Master row: 24 | Site: Johor | Owner: LOG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 24 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Tanker Inspection | Clearly Found |
| Owner | LOG | Clearly Found |
| Department | LOGISTICS | Source inventory |
| Form List | frmTanker - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TANKINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/LOGISTICS/002_oleObject53.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2297 | 24 | 6 | Company |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Tanker Inspection | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - To be filled in by logistic personnel | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - To be filled in by Lab personnel | Inferred from PDF text | Needs Human Confirmation |
| 4 | Yesno_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Yesno_2 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Yesno_3 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Yesno_4 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Yesno_5 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Yesno_6 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Yesno_7 | Inferred from PDF text | Needs Human Confirmation |
| 11 | QC Approval | Inferred from PDF text | Needs Human Confirmation |
| 12 | Lgs-92/010624/00 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Date | InDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Time | InTime | Text | 1 | Parsed from PDF text |
| 4 | Tanker & Trailer No | TankNo | Text | 1 | Parsed from PDF text |
| 5 | 2) 2nd last | Second | Text | 1 | Parsed from PDF text |
| 6 | 3) 3rd last | Third | Text | 1 | Parsed from PDF text |
| 7 | Product to load | Product | Text | 1 | Parsed from PDF text |
| 8 | Customer | Customer | Text | 1 | Parsed from PDF text |
| 9 | Delivery term | DeliveryTerm | Text | 1 | Parsed from PDF text |
| 10 | Attachments | ExAttach | Text | 1 | Parsed from PDF text |
| 11 | CC | CC | Text | 1 | Parsed from PDF text |
| 12 | Submitted by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 13 | Attachments | Attch | Text | 1 | Parsed from PDF text |
| 14 | Inspected By | QCName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | QCDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Date | QCAppDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Remark | QCRemark | Multiline Text | 1 | Parsed from PDF text |
| 18 | Attachments | Attch_1 | Text | 1 | Parsed from PDF text |
| 19 | Submitted By | AttchBy | Text | 1 | Parsed from PDF text |
| 20 | Date | AttchDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 22 | QCPCEO ; cc | QCPCEOCC | Text | 1 | Parsed from PDF text |
| 23 | QCPCOC2 ; cc | QCPCOC3 | Text | 1 | Parsed from PDF text |
| 24 | QCPCEO2 ; cc | QCPCEO_CC | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (2), approval (1), currentaction (1), ca (1), approver (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_LOG`
FormCode: `TANKINSP`
Child-list recommendation: `MainDB_LOG_Ext_TANKINSP_Rows` candidate for repeating row fields

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
| MASTER-024-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-024-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-024-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 24 |
| Workflow Signal Count | 6 |
| Notes | - |
