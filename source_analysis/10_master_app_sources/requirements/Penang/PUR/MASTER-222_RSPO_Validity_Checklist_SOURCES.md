# Master App PDF Source - RSPO Validity Checklist

> Master row: 222 | Site: Penang | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 222 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | RSPO Validity Checklist | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | Pur \| IMS Related \| PHBSVR | Source inventory |
| Form List | RSPO - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RSPOVALICHEC | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Pur/010_oleObject88.pdf | Extracted embedded PDF | sheet_order_fallback | 0.265 | Explicit mapping | 2 | 414 | 14 | 3 | Monthly Checklist of |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | : Fno | Inferred from PDF text | Needs Human Confirmation |
| 2 | Pur-22/310323/00 | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Form No. | FNO | Number/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 4 | Suppliers | Suppliers | Text | 1 | Parsed from PDF text |
| 5 | Expiry Date | ExpDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Status as RSPO portal | Status | Choice/Text | 1 | Parsed from PDF text |
| 7 | Checked by | PreName | Person/Text | 1 | Parsed from PDF text |
| 8 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Designation | PreDesg | Text | 1 | Parsed from PDF text |
| 10 | Remarks | PreRem | Multiline Text | 1 | Parsed from PDF text |
| 11 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 12 | IT | IT | Text | 1 | Parsed from PDF text |
| 13 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 14 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `RSPOVALICHEC`
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
| MASTER-222-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-222-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-222-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 14 |
| Workflow Signal Count | 3 |
| Notes | - |
