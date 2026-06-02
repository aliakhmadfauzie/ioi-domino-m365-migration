# Master App PDF Source - PanCen - PPE Requisition Form

> Master row: 120 | Site: Johor | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 120 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - PPE Requisition Form | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PCNSVR | Source inventory |
| Form List | PanCen - PPE Requisition Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PPEREQU | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/SHE/007_oleObject219.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.700 | Embedded metadata fallback needs review | 3 | 1484 | 19 | 16 | PERSONAL PROTECTIVE EQUIPMENT (PPE) |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Personal Protective Equipment (Ppe) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Requisition Form | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A - GENERAL INFORMATIONS | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Request Type | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION B - HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION C - PIC APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION D - SHE VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 11 | Verify Reject | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION E - STORE ACKNOWLEDGEMENT | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No . | NotNum | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 4 | Reservation) | PIC | Person/Text | 1 | Parsed from PDF text |
| 5 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 6 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 7 | Department | Department | Text | 1 | Parsed from PDF text |
| 8 | Request Type | ItemType | Choice/Text | 1 | Parsed from PDF text |
| 9 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 10 | Items | Items | Text | 1 | Parsed from PDF text |
| 11 | Helmet Colour | HelmetColour | Text | 1 | Parsed from PDF text |
| 12 | Shoe Model | ShoeModel | Text | 1 | Parsed from PDF text |
| 13 | Shoe Type | ShoeType | Choice/Text | 1 | Parsed from PDF text |
| 14 | Shoe Size | ShoeSize | Text | 1 | Parsed from PDF text |
| 15 | Shirt Size | ShirtSize | Text | 1 | Parsed from PDF text |
| 16 | Last Issuance Date | LastIssuanceDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 18 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (4), reject (3), status (3), approval (2), approve (2), verification (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `PPEREQU`
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
| MASTER-120-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-120-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-120-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 19 |
| Workflow Signal Count | 16 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
