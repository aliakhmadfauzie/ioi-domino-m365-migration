# Master App PDF Source - Change Order - 2025

> Master row: 205 | Site: Penang | Owner: MKT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 205 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Change Order - 2025 | Clearly Found |
| Owner | MKT | Clearly Found |
| Department | Mktg \| IMS Related \| PHBSVR | Source inventory |
| Form List | ChangeOrder - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CHANORDE2025 | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Mktg/003_oleObject12.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2161 | 42 | 16 | Change Order |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Change | Inferred from PDF text | Needs Human Confirmation |
| 2 | Order No | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Drp | Inferred from PDF text | Needs Human Confirmation |
| 4 | Sales Admin | Inferred from PDF text | Needs Human Confirmation |
| 5 | Production Planning | Inferred from PDF text | Needs Human Confirmation |
| 6 | Warehouse | Inferred from PDF text | Needs Human Confirmation |
| 7 | Finance | Inferred from PDF text | Needs Human Confirmation |
| 8 | Quality Control | Inferred from PDF text | Needs Human Confirmation |
| 9 | Logistics | Inferred from PDF text | Needs Human Confirmation |
| 10 | Date Sent | Inferred from PDF text | Needs Human Confirmation |
| 11 | Subject | Inferred from PDF text | Needs Human Confirmation |
| 12 | Approval Required : | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | ORDER NO | ChangeOrderNo | Text | 1 | Parsed from PDF text |
| 2 | DRP Use | DRP | Text | 1 | Parsed from PDF text |
| 3 | TO | SendToALL | Date/Text | 1 | Parsed from PDF text |
| 4 | DATE SENT | DateSent | Date/Text | 1 | Parsed from PDF text |
| 5 | SUBJECT | Subject | Text | 1 | Parsed from PDF text |
| 6 | Name | Approval1 | Person/Text | 1 | Parsed from PDF text |
| 7 | Approval Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 8 | Date | ApprovalDate1 | Date/Text | 1 | Parsed from PDF text |
| 9 | Name | Approval2 | Person/Text | 1 | Parsed from PDF text |
| 10 | Approval Status | Status2 | Choice/Text | 1 | Parsed from PDF text |
| 11 | Date | ApprovalDate2 | Date/Text | 1 | Parsed from PDF text |
| 12 | Name | Approval3 | Person/Text | 1 | Parsed from PDF text |
| 13 | Approval Status | Status3 | Choice/Text | 1 | Parsed from PDF text |
| 14 | Date | ApprovalDate3 | Date/Text | 1 | Parsed from PDF text |
| 15 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 16 | Status | CurrentStatus | Choice/Text | 1 | Parsed from PDF text |
| 17 | CNO | CNO | Text | 1 | Parsed from PDF text |
| 18 | To | To | Text | 1 | Parsed from PDF text |
| 19 | MKT Admin | MKTAdmin | Text | 1 | Parsed from PDF text |
| 20 | MailGroup-ACM | CCGroupACM | Text | 1 | Parsed from PDF text |
| 21 | MailGroup-DCM | CCGroupDCM | Text | 1 | Parsed from PDF text |
| 22 | MailGroup-AEC | CCGroupAEC | Text | 1 | Parsed from PDF text |
| 23 | MailGroup-AES | CCGroupAES | Text | 1 | Parsed from PDF text |
| 24 | MailGroup SAP section - ACM | CO_ACM_SAP | Text | 1 | Parsed from PDF text |
| 25 | MailGroup SAP section - AES | CO_AES_SAP | Text | 1 | Parsed from PDF text |
| 26 | MailGroup SAP section - DCM | CO_DCM_SAP | Text | 1 | Parsed from PDF text |
| 27 | Editor | Editors | Text | 1 | Parsed from PDF text |
| 28 | AEditor1 - SAP Section | AEditor1 | Text | 1 | Parsed from PDF text |
| 29 | ISG | ISNames | Person/Text | 1 | Parsed from PDF text |
| 30 | Allowed editing by | Editingby | Text | 1 | Parsed from PDF text |
| 31 | IntendedReader | IntendedReaders | Text | 1 | Parsed from PDF text |
| 32 | A1Replied - App1 | A1Replied | Text | 1 | Parsed from PDF text |
| 33 | A2Replied - App2 | A2Replied | Text | 1 | Parsed from PDF text |
| 34 | A3Replied - App3 | A3Replied | Text | 1 | Parsed from PDF text |
| 35 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 36 | App1 | App1Mail | Text | 1 | Parsed from PDF text |
| 37 | App2 | App2Mail | Text | 1 | Parsed from PDF text |
| 38 | App3 | App3Mail | Text | 1 | Parsed from PDF text |
| 39 | SendTo - after approval | SendEmails | Date/Text | 1 | Parsed from PDF text |
| 40 | Copy To | CopyEmails | Text | 1 | Parsed from PDF text |
| 41 | Open URL | WebURL | Text | 1 | Parsed from PDF text |
| 42 | Display CNO | display_CNO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (11), status (4), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MKT`
FormCode: `CHANORDE2025`
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
| MASTER-205-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-205-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-205-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 42 |
| Workflow Signal Count | 16 |
| Notes | - |
