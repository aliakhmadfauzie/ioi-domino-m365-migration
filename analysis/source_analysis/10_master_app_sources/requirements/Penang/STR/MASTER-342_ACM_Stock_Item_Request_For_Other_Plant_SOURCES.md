# Master App PDF Source - ACM Stock Item Request For Other Plant

> Master row: 342 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 342 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ACM Stock Item Request For Other Plant | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| Prod \| PHBSVR | Source inventory |
| Form List | MatRequestForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ACMSTOCITEM | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/013_oleObject47.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 2024 | 18 | 13 | ACM STOCK ITEM REQUEST FOR OTH |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | ACM STOCK ITEM REQUEST FOR OTH | Inferred from PDF text | Needs Human Confirmation |
| 2 | Request Num: ItemReqNum | Inferred from PDF text | Needs Human Confirmation |
| 3 | Ecmhod | Inferred from PDF text | Needs Human Confirmation |
| 4 | Acmhod | Inferred from PDF text | Needs Human Confirmation |
| 5 | Mmpic | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ecmpic | Inferred from PDF text | Needs Human Confirmation |
| 7 | Acmpic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request Num | ItemReqNum | Text | 1 | Parsed from PDF text |
| 2 | Endorsed by (HOD) | nmEmailAdd_ECM | Person/Text | 1 | Parsed from PDF text |
| 3 | Approved by (ACM/ASN HOD) | nmEmailAdd_APP | Person/Text | 1 | Parsed from PDF text |
| 4 | Date | dateapp1 | Date/Text | 1 | Parsed from PDF text |
| 5 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 6 | Date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 7 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 8 | Comments | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 9 | status | statusapp2 | Choice/Text | 1 | Parsed from PDF text |
| 10 | status | statusapp3 | Choice/Text | 1 | Parsed from PDF text |
| 11 | GI Material Document Number | txtMatDocNum | Text | 1 | Parsed from PDF text |
| 12 | Updated By | UpdatedByACM | Date/Text | 1 | Parsed from PDF text |
| 13 | Status | StatusChk2_1 | Choice/Text | 1 | Parsed from PDF text |
| 14 | Updated By | UpdatedByECM | Date/Text | 1 | Parsed from PDF text |
| 15 | Status | StatusChk2 | Choice/Text | 1 | Parsed from PDF text |
| 16 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 17 | Discarded on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 18 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (6), status (5), approved (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `ACMSTOCITEM`
Child-list recommendation: `MainDB_STR_Ext_ACMSTOCITEM_Rows` candidate for repeating row fields

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
| MASTER-342-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-342-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-342-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 18 |
| Workflow Signal Count | 13 |
| Notes | - |
