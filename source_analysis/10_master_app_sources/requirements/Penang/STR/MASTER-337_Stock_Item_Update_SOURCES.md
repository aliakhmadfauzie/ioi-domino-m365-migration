# Master App PDF Source - Stock Item Update

> Master row: 337 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 337 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Stock Item Update | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| IMS Related \| PHBSVR | Source inventory |
| Form List | ItemCodeV6 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCITEMUPDA | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/010_oleObject44.pdf | Extracted embedded PDF | text_match_medium | 0.501 | Explicit mapping | 3 | 1518 | 47 | 7 | STOCK ITEM CANCELLATION FORM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/012_oleObject46.pdf | Extracted embedded PDF | text_match_high | 0.750 | Explicit mapping | 4 | 1452 | 27 | 7 | STOCK ITEM UPDATE FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Stock Item Cancellation Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | Requestor's section: | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 4 | Head of Dept's Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Head of Division's Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ecm Store | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Acc | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Coo | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 11 | Stock Item Update Form | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Uom | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Series No | SICFNo | Text | 1 | Parsed from PDF text |
| 2 | Company | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 3 | Material Number | MaterialNo | Text | 1 | Parsed from PDF text |
| 4 | Material Description | MaterialDesc | Multiline Text | 1 | Parsed from PDF text |
| 5 | Object | PlantLocation | Text | 1 | Parsed from PDF text |
| 6 | Current Stock | CurrentStock | Text | 1 | Parsed from PDF text |
| 7 | Value of Stock | RM; StockValue | Text | 1 | Parsed from PDF text |
| 8 | items | Decision | Text | 1 | Parsed from PDF text |
| 9 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 10 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 11 | Head of Division | HODiv | Person/Text | 1 | Parsed from PDF text |
| 12 | Name | Requestor | Person/Text | 1 | Parsed from PDF text |
| 13 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 14 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 15 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Comments | HODComment | Person/Text | 1 | Parsed from PDF text |
| 18 | Name | HODivName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | HODivDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Comments | HODivComments | Person/Text | 1 | Parsed from PDF text |
| 21 | by | StoreTransferLocation | Text | 1 | Parsed from PDF text |
| 22 | Updated By | StoreName | Date/Text | 1 | Parsed from PDF text |
| 23 | Date | StoreDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Remarks | StoreComments | Multiline Text | 1 | Parsed from PDF text |
| 25 | Cost of Obsolete Item | ACCObsoleteCost | Number/Text | 1 | Parsed from PDF text |
| 26 | Downgrade Cost | ACCDowngradeCost | Number/Text | 1 | Parsed from PDF text |
| 27 | Name | ACCName | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | ACCDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Remarks | ACCComments | Multiline Text | 1 | Parsed from PDF text |
| 30 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 31 | Running number | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 32 | ACM Store | ACMStore | Text | 1 | Parsed from PDF text |
| 33 | ECM STORE | ECMStore | Text | 1 | Parsed from PDF text |
| 34 | Store | Store | Text | 1 | Parsed from PDF text |
| 35 | Store Tech | StoreTech | Text | 1 | Parsed from PDF text |
| 36 | Account | ACC | Text | 1 | Parsed from PDF text |
| 37 | PUR Staff | PUR | Text | 1 | Parsed from PDF text |
| 38 | COO | COO | Text | 1 | Parsed from PDF text |
| 39 | IS Admin | ISG | Text | 1 | Parsed from PDF text |
| 40 | Mail List | MM | Text | 1 | Parsed from PDF text |
| 41 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 42 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 43 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 44 | Editor 3a | Editor3a | Text | 1 | Parsed from PDF text |
| 45 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 46 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 47 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 48 | Series No | SIUFNo | Text | 1 | Parsed from PDF text |
| 49 | Option to Update | UpdateMatDesc | Date/Text | 1 | Parsed from PDF text |
| 50 | Technical Object | TechObject | Text | 1 | Parsed from PDF text |
| 51 | Reorder Point | MinStock | Text | 1 | Parsed from PDF text |
| 52 | Maximum Stock | MaxStock | Text | 1 | Parsed from PDF text |
| 53 | Average usage | AverageUsage | Text | 1 | Parsed from PDF text |
| 54 | New Item Description | NewItemDesc | Multiline Text | 1 | Parsed from PDF text |
| 55 | New Reorder Point | MinStock1 | Text | 1 | Parsed from PDF text |
| 56 | New Maximum Stock | MaxStock1 | Text | 1 | Parsed from PDF text |
| 57 | UOM | UOM | Text | 1 | Parsed from PDF text |
| 58 | Updated By | MMName | Date/Text | 1 | Parsed from PDF text |
| 59 | Date | MMDate | Date/Text | 1 | Parsed from PDF text |
| 60 | Remarks | MMComments | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (4), status (4), currentaction (4), hod (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STOCITEMUPDA`
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
| MASTER-337-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-337-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-337-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 60 |
| Workflow Signal Count | 14 |
| Notes | - |
