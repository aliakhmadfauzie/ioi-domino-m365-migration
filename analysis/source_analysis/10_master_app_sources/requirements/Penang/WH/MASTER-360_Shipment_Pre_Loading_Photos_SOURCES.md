# Master App PDF Source - Shipment Pre-Loading Photos

> Master row: 360 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 360 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Shipment Pre-Loading Photos | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse \| PHBSVR | Source inventory |
| Form List | AuditReport - Form \| FormDoc - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHIPPRELOAD | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/011_oleObject73.pdf | Extracted embedded PDF | sheet_order_fallback | 0.252 | Explicit mapping | 4 | 2662 | 40 | 5 | INTER-DEPT AUDIT REPORT |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/015_oleObject77.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 1 | 407 | 15 | 2 | SHIPMENT PRE-LOADING |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Inter-Dept Audit Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | Auditee'S Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 3 | Opportunities For Improvement | Inferred from PDF text | Needs Human Confirmation |
| 4 | Action To | Inferred from PDF text | Needs Human Confirmation |
| 5 | Be Taken | Inferred from PDF text | Needs Human Confirmation |
| 6 | By When | Inferred from PDF text | Needs Human Confirmation |
| 7 | Auditee'S Hod Acknowledgement | Inferred from PDF text | Needs Human Confirmation |
| 8 | Withdrawn | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Admin | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Ino | Inferred from PDF text | Needs Human Confirmation |
| 11 | Shipment Pre-Loading | Inferred from PDF text | Needs Human Confirmation |
| 12 | Photos | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 2 | Internal Audit Report No. | ReportNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Audit Site | Area | Text | 1 | Parsed from PDF text |
| 4 | Audit Department | Dept | Text | 1 | Parsed from PDF text |
| 5 | Audit Date | AuditDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Time Start | TimeStart | Text | 1 | Parsed from PDF text |
| 7 | Time End | TimeEnd | Text | 1 | Parsed from PDF text |
| 8 | Auditor | Auditor | Text | 1 | Parsed from PDF text |
| 9 | Auditee | Auditee; AuditeeName | Person/Text | 1 | Parsed from PDF text |
| 10 | Auditee's Div/Dept Head | AuditeeHOD | Person/Text | 1 | Parsed from PDF text |
| 11 | CC | AudCC | Text | 1 | Parsed from PDF text |
| 12 | Improvement? | OppImp | Text | 1 | Parsed from PDF text |
| 13 | Auditor General Comment | AuditorComment | Multiline Text | 1 | Parsed from PDF text |
| 14 | Auditor | AuditorName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | AuditorDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Auditee | AuditeeName2 | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | AuditeeDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Acceptance | Acceptance_1 | Text | 1 | Parsed from PDF text |
| 19 | Remark | AuditeeRem | Multiline Text | 1 | Parsed from PDF text |
| 20 | Reviewed By | ReviewedBy | Text | 1 | Parsed from PDF text |
| 21 | Date | ReviewedDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Acceptance | Acceptance | Text | 1 | Parsed from PDF text |
| 23 | Acceptance Comments | AccComments | Multiline Text | 1 | Parsed from PDF text |
| 24 | Withdrawn by | ObsBy | Text | 1 | Parsed from PDF text |
| 25 | Date | ObsDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Reason | ObsReason | Multiline Text | 1 | Parsed from PDF text |
| 27 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 28 | Requestor | DocAuthor | Person/Text | 1 | Parsed from PDF text |
| 29 | Created Date | CDate | Date/Text | 1 | Parsed from PDF text |
| 30 | QA Admin | ADMIN | Text | 1 | Parsed from PDF text |
| 31 | IT | IT | Text | 1 | Parsed from PDF text |
| 32 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 33 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 34 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 35 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 36 | INO | INO | Text | 1 | Parsed from PDF text |
| 37 | Action Plans | APs | Text | 1 | Parsed from PDF text |
| 38 | Action Takens | ATs | Text | 1 | Parsed from PDF text |
| 39 | Whoms | Wms | Text | 1 | Parsed from PDF text |
| 40 | Whens | Wns | Text | 1 | Parsed from PDF text |
| 41 | Company | Comp | Text | 1 | Parsed from PDF text |
| 42 | Area | Area | Text | 1 | Parsed from PDF text |
| 43 | Sales Order | SalesOrder | Text | 1 | Parsed from PDF text |
| 44 | Ship Doc No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 45 | Vehicle Type | VehType | Choice/Text | 1 | Parsed from PDF text |
| 46 | Vehicle No. | VehNo | Number/Text | 1 | Parsed from PDF text |
| 47 | Attachment (photos) | Attachments | Text | 1 | Parsed from PDF text |
| 48 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 49 | CC Copy | CC | Text | 1 | Parsed from PDF text |
| 50 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 51 | Created By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 52 | Created On | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 53 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 54 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 55 | ISG Admin | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | rejected (2), ca (2), hod (1), reviewed (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `SHIPPRELOAD`
Child-list recommendation: `MainDB_WH_Ext_SHIPPRELOAD_Rows` candidate for repeating row fields

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
| MASTER-360-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-360-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-360-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 55 |
| Workflow Signal Count | 7 |
| Notes | - |
