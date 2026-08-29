# Master App PDF Source - PanCen - Filter Cloth Replacement Record

> Master row: 56 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 56 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Filter Cloth Replacement Record | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| PCNSVR | Source inventory |
| Form List | NewFilterCloth - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FILTCLOTREPL | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/002_oleObject91.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 3 | 1404 | 33 | 13 | Filter Cloth replaCement |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A: Scheduled Filter Clothes Replacement | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section B: Filter Clothes Replacement Details | Inferred from PDF text | Needs Human Confirmation |
| 3 | Snp 1 | Inferred from PDF text | Needs Human Confirmation |
| 4 | Snp 2 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Snp 5 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Dpofa | Inferred from PDF text | Needs Human Confirmation |
| 7 | Dpkfa | Inferred from PDF text | Needs Human Confirmation |
| 8 | S10_2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section C: Verification of Filter Clothes Replacement | Inferred from PDF text | Needs Human Confirmation |
| 10 | Superior/ HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pds-58/040624/00 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Sk1 - Sk2 - Sk3 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Replacement type | Status | Choice/Text | 1 | Parsed from PDF text |
| 2 | Department | Department | Text | 1 | Parsed from PDF text |
| 3 | Scheduled Date | SchDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Scheduled Plant | SchPlant | Text | 1 | Parsed from PDF text |
| 5 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Reminder to | VerifierName | Person/Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 9 | CC | CC | Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attch | Text | 1 | Parsed from PDF text |
| 11 | Update Date | DateRepl | Date/Text | 1 | Parsed from PDF text |
| 12 | Update Time | TimeRepl | Date/Text | 1 | Parsed from PDF text |
| 13 | Updated by | ReplacedBy | Date/Text | 1 | Parsed from PDF text |
| 14 | Witness by | Witness | Text | 1 | Parsed from PDF text |
| 15 | Remarks | Remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 16 | Verified By | VerBy | Person/Text | 1 | Parsed from PDF text |
| 17 | Rejected by | RejBy | Text | 1 | Parsed from PDF text |
| 18 | Date Verified | VerDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Remarks | VerRemarks | Multiline Text | 1 | Parsed from PDF text |
| 20 | Approved By | AppBy | Person/Text | 1 | Parsed from PDF text |
| 21 | Rejected by | HODRejected | Person/Text | 1 | Parsed from PDF text |
| 22 | Date Approved | AppDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Remarks | AppRemarks | Multiline Text | 1 | Parsed from PDF text |
| 24 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 25 | Administrators | IT | Text | 1 | Parsed from PDF text |
| 26 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 27 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 28 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 29 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 30 | Skipped | SK1; SK2; SK3 | Text | 1 | Parsed from PDF text |
| 31 | SNP 2 | C9 | Text | 1 | Parsed from PDF text |
| 32 | SNP 3 | C17 | Text | 1 | Parsed from PDF text |
| 33 | INO | CaseNo | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), verified (2), rejected (2), approved (2), status (1), verification (1), approval (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `FILTCLOTREPL`
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
| MASTER-056-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-056-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-056-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 33 |
| Workflow Signal Count | 13 |
| Notes | - |
