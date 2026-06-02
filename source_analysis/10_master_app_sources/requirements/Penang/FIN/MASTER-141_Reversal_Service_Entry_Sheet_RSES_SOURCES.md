# Master App PDF Source - Reversal Service Entry Sheet (RSES)

> Master row: 141 | Site: Penang | Owner: FIN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 141 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Reversal Service Entry Sheet (RSES) | Clearly Found |
| Owner | FIN | Clearly Found |
| Department | Fin | Source inventory |
| Form List | RSES - Form | Source inventory |
| Blueprint Department | FIN | Source inventory |
| Blueprint Code | RSES | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Fin/006_oleObject9.pdf | Extracted embedded PDF | sheet_order_fallback | 0.013 | Explicit mapping | 2 | 698 | 22 | 8 | REVERSAL SERVICE ENTRY SHEET |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Reversal Service Entry Sheet | Inferred from PDF text | Needs Human Confirmation |
| 2 | INITIATOR SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | SES Approval Date | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approver Acceptance | Inferred from PDF text | Needs Human Confirmation |
| 5 | Finance Acceptance | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Fin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 3 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 4 | Department | Dept | Text | 1 | Parsed from PDF text |
| 5 | Phone Ext. No. | ExtNo | Number/Text | 1 | Parsed from PDF text |
| 6 | Site | Site | Text | 1 | Parsed from PDF text |
| 7 | SES No. | SESNo | Number/Text | 1 | Parsed from PDF text |
| 8 | Purchase Order & Item No. | PO | Number/Text | 1 | Parsed from PDF text |
| 9 | SES Approval Date | SESAppDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 11 | Accepted Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 12 | Accepted Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Remarks | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 14 | Completed by | FINName | Person/Text | 1 | Parsed from PDF text |
| 15 | Completed Date | FINDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Remarks | FINRem | Multiline Text | 1 | Parsed from PDF text |
| 17 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 18 | IT | IT | Text | 1 | Parsed from PDF text |
| 19 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 20 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | Finance | FIN | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approver (3), reject (2), approval (1), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_FIN`
FormCode: `RSES`
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
| MASTER-141-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-141-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-141-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 22 |
| Workflow Signal Count | 8 |
| Notes | - |
