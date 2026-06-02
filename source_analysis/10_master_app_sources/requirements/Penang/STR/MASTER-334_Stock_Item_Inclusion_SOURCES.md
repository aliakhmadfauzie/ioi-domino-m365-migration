# Master App PDF Source - Stock Item Inclusion

> Master row: 334 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 334 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Stock Item Inclusion | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| IMS Related \| Critical App \| PHBSVR | Source inventory |
| Form List | Stock Item Inclusion | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STOCITEMINCL | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/STR/ACMSTR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 3 | 2024 | 18 | 13 | ACM STOCK ITEM REQUEST FOR OTH |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/STR/SIC.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 3 | 1518 | 47 | 7 | STOCK ITEM CANCELLATION FORM |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/STR/SIROP.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 3 | 2024 | 18 | 13 | ACM STOCK ITEM REQUEST FOR OTH |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/STR/SIU.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 4 | 1452 | 27 | 7 | STOCK ITEM UPDATE FORM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/010_oleObject44.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 3 | 1518 | 47 | 7 | STOCK ITEM CANCELLATION FORM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/012_oleObject46.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 4 | 1452 | 27 | 7 | STOCK ITEM UPDATE FORM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/013_oleObject47.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.667 | HCL fallback needs review | 3 | 2024 | 18 | 13 | ACM STOCK ITEM REQUEST FOR OTH |

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
| 8 | Stock Item Cancellation Form | Inferred from PDF text | Needs Human Confirmation |
| 9 | Requestor's section: | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Head of Dept's Approval | Inferred from PDF text | Needs Human Confirmation |
| 12 | Head of Division's Approval | Inferred from PDF text | Needs Human Confirmation |

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
| 19 | Series No | SICFNo | Text | 1 | Parsed from PDF text |
| 20 | Company | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 21 | Material Number | MaterialNo | Text | 1 | Parsed from PDF text |
| 22 | Material Description | MaterialDesc | Multiline Text | 1 | Parsed from PDF text |
| 23 | Object | PlantLocation | Text | 1 | Parsed from PDF text |
| 24 | Current Stock | CurrentStock | Text | 1 | Parsed from PDF text |
| 25 | Value of Stock | RM; StockValue | Text | 1 | Parsed from PDF text |
| 26 | items | Decision | Text | 1 | Parsed from PDF text |
| 27 | Attachment | ReqAtt | Text | 1 | Parsed from PDF text |
| 28 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 29 | Head of Division | HODiv | Person/Text | 1 | Parsed from PDF text |
| 30 | Name | Requestor | Person/Text | 1 | Parsed from PDF text |
| 31 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 32 | Date | DateSent | Date/Text | 1 | Parsed from PDF text |
| 33 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 34 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 35 | Comments | HODComment | Person/Text | 1 | Parsed from PDF text |
| 36 | Name | HODivName | Person/Text | 1 | Parsed from PDF text |
| 37 | Date | HODivDate | Date/Text | 1 | Parsed from PDF text |
| 38 | Comments | HODivComments | Person/Text | 1 | Parsed from PDF text |
| 39 | by | StoreTransferLocation | Text | 1 | Parsed from PDF text |
| 40 | Updated By | StoreName | Date/Text | 1 | Parsed from PDF text |
| 41 | Date | StoreDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Remarks | StoreComments | Multiline Text | 1 | Parsed from PDF text |
| 43 | Cost of Obsolete Item | ACCObsoleteCost | Number/Text | 1 | Parsed from PDF text |
| 44 | Downgrade Cost | ACCDowngradeCost | Number/Text | 1 | Parsed from PDF text |
| 45 | Name | ACCName | Person/Text | 1 | Parsed from PDF text |
| 46 | Date | ACCDate | Date/Text | 1 | Parsed from PDF text |
| 47 | Remarks | ACCComments | Multiline Text | 1 | Parsed from PDF text |
| 48 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 49 | Running number | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 50 | ACM Store | ACMStore | Text | 1 | Parsed from PDF text |
| 51 | ECM STORE | ECMStore | Text | 1 | Parsed from PDF text |
| 52 | Store | Store | Text | 1 | Parsed from PDF text |
| 53 | Store Tech | StoreTech | Text | 1 | Parsed from PDF text |
| 54 | Account | ACC | Text | 1 | Parsed from PDF text |
| 55 | PUR Staff | PUR | Text | 1 | Parsed from PDF text |
| 56 | COO | COO | Text | 1 | Parsed from PDF text |
| 57 | IS Admin | ISG | Text | 1 | Parsed from PDF text |
| 58 | Mail List | MM | Text | 1 | Parsed from PDF text |
| 59 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 60 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 61 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 62 | Editor 3a | Editor3a | Text | 1 | Parsed from PDF text |
| 63 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 64 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 65 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 66 | Series No | SIUFNo | Text | 1 | Parsed from PDF text |
| 67 | Option to Update | UpdateMatDesc | Date/Text | 1 | Parsed from PDF text |
| 68 | Technical Object | TechObject | Text | 1 | Parsed from PDF text |
| 69 | Reorder Point | MinStock | Text | 1 | Parsed from PDF text |
| 70 | Maximum Stock | MaxStock | Text | 1 | Parsed from PDF text |
| 71 | Average usage | AverageUsage | Text | 1 | Parsed from PDF text |
| 72 | New Item Description | NewItemDesc | Multiline Text | 1 | Parsed from PDF text |
| 73 | New Reorder Point | MinStock1 | Text | 1 | Parsed from PDF text |
| 74 | New Maximum Stock | MaxStock1 | Text | 1 | Parsed from PDF text |
| 75 | UOM | UOM | Text | 1 | Parsed from PDF text |
| 76 | Updated By | MMName | Date/Text | 1 | Parsed from PDF text |
| 77 | Date | MMDate | Date/Text | 1 | Parsed from PDF text |
| 78 | Remarks | MMComments | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (23), hod (22), currentaction (11), approval (8), approved (3) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STOCITEMINCL`
Child-list recommendation: `MainDB_STR_Ext_STOCITEMINCL_Rows` candidate for repeating row fields

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
| MASTER-334-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-334-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-334-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 7 |
| Parsed Field Count | 78 |
| Workflow Signal Count | 67 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
