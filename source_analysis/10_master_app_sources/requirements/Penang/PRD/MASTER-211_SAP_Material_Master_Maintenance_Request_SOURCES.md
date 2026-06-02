# Master App PDF Source - SAP Material Master Maintenance Request

> Master row: 211 | Site: Penang | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 211 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP Material Master Maintenance Request | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | Prod \| Critical App \| PHBSVR | Source inventory |
| Form List | NewMatFormV1 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPMATEMAST | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/004_oleObject118.pdf | Extracted embedded PDF | sheet_order_fallback | 0.375 | Explicit mapping | 7 | 7048 | 122 | 18 | SAP NEW/EXISTING MATERIAL MASTER DATA |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Sap New/Existing Material Master Data | Inferred from PDF text | Needs Human Confirmation |
| 2 | REQUEST FORM | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section A: | Inferred from PDF text | Needs Human Confirmation |
| 4 | Request Num | Inferred from PDF text | Needs Human Confirmation |
| 5 | Material Master Request Type | Inferred from PDF text | Needs Human Confirmation |
| 6 | Email address for approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | Approval Section | Inferred from PDF text | Needs Human Confirmation |
| 8 | Approval Status | Inferred from PDF text | Needs Human Confirmation |
| 9 | Approval Date | Inferred from PDF text | Needs Human Confirmation |
| 10 | Submitted for verification of Master Data in SAP on SubmittedDate_1 by Sentby_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Verification from the Module Owner (Key User) | Inferred from PDF text | Needs Human Confirmation |
| 12 | Email Add/Name | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Plant Location | PltLocation | Text | 1 | Parsed from PDF text |
| 2 | Request Num | ReqNum | Text | 1 | Parsed from PDF text |
| 3 | Remark | ReqRemark | Multiline Text | 1 | Parsed from PDF text |
| 4 | Attachment | rtAttach1 | Text | 1 | Parsed from PDF text |
| 5 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 6 | Approval Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 7 | Approval Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Remarks | AppCom | Multiline Text | 1 | Parsed from PDF text |
| 9 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 10 | Created/Updated By | CreatedBy | Date/Text | 1 | Parsed from PDF text |
| 11 | Date Created/Updated | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 12 | App Required | sel1 | Text | 1 | Parsed from PDF text |
| 13 | Total App Required | TotalList | Number/Text | 1 | Parsed from PDF text |
| 14 | Verification Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 15 | Verification Status | txtStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 16 | Total Required App | TotalCount; If; QA | Number/Text | 1 | Parsed from PDF text |
| 17 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 18 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 19 | Recipe number | RecipeNum | Text | 1 | Parsed from PDF text |
| 20 | Remarks | Rem1_1 | Multiline Text | 1 | Parsed from PDF text |
| 21 | Attachment | Att1_2 | Text | 1 | Parsed from PDF text |
| 22 | Recipe number | RecipeNum1 | Text | 1 | Parsed from PDF text |
| 23 | Remarks | Rem2_1 | Multiline Text | 1 | Parsed from PDF text |
| 24 | Attachment | Att1_1_1 | Text | 1 | Parsed from PDF text |
| 25 | Recipe number | RecipeNumPCOC | Text | 1 | Parsed from PDF text |
| 26 | Remarks | RemPCOC | Multiline Text | 1 | Parsed from PDF text |
| 27 | Attachment | AttPCOC | Text | 1 | Parsed from PDF text |
| 28 | Recipe Num | CostRecipeNum | Number/Text | 1 | Parsed from PDF text |
| 29 | Remarks | Rem3_1 | Multiline Text | 1 | Parsed from PDF text |
| 30 | Attachment | Att2_1 | Text | 1 | Parsed from PDF text |
| 31 | Costing run performed by | CostingRunBy_1 | Number/Text | 1 | Parsed from PDF text |
| 32 | Costing run date | CostingRunDate_1 | Date/Text | 1 | Parsed from PDF text |
| 33 | Material is ready for use | ReadyMat | Text | 1 | Parsed from PDF text |
| 34 | Completed By | CompletedBy | Text | 1 | Parsed from PDF text |
| 35 | Date | CompletedDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 37 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 38 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 39 | MM No | Year; Month; MMNo | Text | 1 | Parsed from PDF text |
| 40 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 41 | CMMD Team - Creator | CMMDTeam | Date/Text | 1 | Parsed from PDF text |
| 42 | Cost Team | CostTeam | Number/Text | 1 | Parsed from PDF text |
| 43 | Mat Type Indication | MatIndication | Choice/Text | 1 | Parsed from PDF text |
| 44 | Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 45 | Section B (Main) | Editor2 | Text | 1 | Parsed from PDF text |
| 46 | Section B (Main) | Editor2_1 | Text | 1 | Parsed from PDF text |
| 47 | Section C - Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 48 | Section D | Editor4 | Text | 1 | Parsed from PDF text |
| 49 | Final Section - 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 50 | Prod Recipe Section | Editor6 | Text | 1 | Parsed from PDF text |
| 51 | Withdrawal Section | Editor7 | Text | 1 | Parsed from PDF text |
| 52 | Mailing list to Prod | ProdEmails | Text | 1 | Parsed from PDF text |
| 53 | Cost Team Editor | CostTeamEditor | Number/Text | 1 | Parsed from PDF text |
| 54 | Requestor (From Stock Inclusion form) | RequestedBy | Person/Text | 1 | Parsed from PDF text |
| 55 | Final Mailing List | FinalMail | Text | 1 | Parsed from PDF text |
| 56 | Costing & CMMDTeam Mail | ToCostCMMD | Date/Text | 1 | Parsed from PDF text |
| 57 | Marketing | MKTCC | Text | 1 | Parsed from PDF text |
| 58 | R&D | RNDCC | Text | 1 | Parsed from PDF text |
| 59 | Production Support | ProdSupport | Text | 1 | Parsed from PDF text |
| 60 | CC | CC | Text | 1 | Parsed from PDF text |
| 61 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 62 | IT | ITSA | Text | 1 | Parsed from PDF text |
| 63 | Production section creator - ACM/DCM | ACMProdTeam | Date/Text | 1 | Parsed from PDF text |
| 64 | Production section creator - AES | AESProdTeam | Date/Text | 1 | Parsed from PDF text |
| 65 | Production section creator - PCOC | PCOCProdTeam | Date/Text | 1 | Parsed from PDF text |
| 66 | Production section creator - PSN | PSNProdTeam | Date/Text | 1 | Parsed from PDF text |
| 67 | Production section creator - PEO | PEOProdTeam | Date/Text | 1 | Parsed from PDF text |
| 68 | Costing section creator (Mailing list) | ACMCostingTeam; ACMCostingTeam2 | Number/Text | 1 | Parsed from PDF text |
| 69 | Costing section creator (Mailing list) | PCOCCostingTeam | Number/Text | 1 | Parsed from PDF text |
| 70 | ZFAC - Fatty Acid | ZFACACM | Text | 1 | Parsed from PDF text |
| 71 | ZRES - Residue Oil | ZRESACM | Text | 1 | Parsed from PDF text |
| 72 | ZGLY - Glycerine | ZGLYACM | Text | 1 | Parsed from PDF text |
| 73 | ZOIL - Oil | ZOILACM | Text | 1 | Parsed from PDF text |
| 74 | ZEST - Ester | ZESTACM | Text | 1 | Parsed from PDF text |
| 75 | ZPIP - Pipeline Materials | ZPIPACM | Text | 1 | Parsed from PDF text |
| 76 | ZTRA - Stearic | ZTRAACM | Text | 1 | Parsed from PDF text |
| 77 | ZPMA - Packaging Material | ZPMAACM | Text | 1 | Parsed from PDF text |
| 78 | ZPRC - Process Chemicals | ZPRCACM | Text | 1 | Parsed from PDF text |
| 79 | ZNST - Non Stock Items | ZNSTACM | Text | 1 | Parsed from PDF text |
| 80 | ZSNO - Soap Noodles (AUC) | ZSNOAUC | Text | 1 | Parsed from PDF text |
| 81 | ZFAC - Fatty Acid | ZFACDCM | Text | 1 | Parsed from PDF text |
| 82 | ZSNO - Soap Noodles | ZSNODCM | Text | 1 | Parsed from PDF text |
| 83 | ZGLY - Glycerine | ZGLYDCM | Text | 1 | Parsed from PDF text |
| 84 | ZPMA - Packaging Material | ZPMADCM | Text | 1 | Parsed from PDF text |
| 85 | ZPRC - Process Chemicals | ZPRCDCM | Text | 1 | Parsed from PDF text |
| 86 | ZNST - Non Stock Items | ZNSTDCM | Text | 1 | Parsed from PDF text |
| 87 | ZCON - Consumables | ZCONDCM | Text | 1 | Parsed from PDF text |
| 88 | ZFAC - Fatty Acid | ZFACPCOC | Text | 1 | Parsed from PDF text |
| 89 | ZRES - Residue Oil | ZRESPCOC | Text | 1 | Parsed from PDF text |
| 90 | ZGLY - Glycerine | ZGLYPCOC | Text | 1 | Parsed from PDF text |
| 91 | ZOIL - Oil | ZOILPCOC | Text | 1 | Parsed from PDF text |
| 92 | ZPIP - Pipeline Materials | ZPIPPCOC | Text | 1 | Parsed from PDF text |
| 93 | ZPMA - Packaging Material | ZPMAPCOC | Text | 1 | Parsed from PDF text |
| 94 | ZPRC - Process Chemicals | ZPRCPCOC | Text | 1 | Parsed from PDF text |
| 95 | ZNST - Non Stock Items | ZNSTPCOC | Text | 1 | Parsed from PDF text |
| 96 | ZNPR - Non Process Checmical | ZNPRPCOC | Text | 1 | Parsed from PDF text |
| 97 | ZFAC - Fatty Acid | ZFACPSN | Text | 1 | Parsed from PDF text |
| 98 | ZSNO - Soap Noodles | ZSNOPSN | Text | 1 | Parsed from PDF text |
| 99 | ZGLY - Glycerine | ZGLYPSN | Text | 1 | Parsed from PDF text |
| 100 | ZPMA - Packaging Material | ZPMAPSN | Text | 1 | Parsed from PDF text |
| 101 | ZPRC - Process Chemicals | ZPRCPSN | Text | 1 | Parsed from PDF text |
| 102 | ZNST - Non Stock Items | ZNSTPSN | Text | 1 | Parsed from PDF text |
| 103 | ZOIL - Oil | ZOILPSN | Text | 1 | Parsed from PDF text |
| 104 | ZFAC - Fatty Acid | ZFACPEO | Text | 1 | Parsed from PDF text |
| 105 | ZGLY - Glycerine | ZGLYPEO | Text | 1 | Parsed from PDF text |
| 106 | ZOIL - Oil | ZOILPEO | Text | 1 | Parsed from PDF text |
| 107 | ZPMA - Packaging Material | ZPMAPEO | Text | 1 | Parsed from PDF text |
| 108 | ZPRC - Process Chemicals | ZPRCPEO | Text | 1 | Parsed from PDF text |
| 109 | ZNST - Non Stock Items | ZNSTPEO | Text | 1 | Parsed from PDF text |
| 110 | ZNPR - Non Process Checmical | ZNPRPEO | Text | 1 | Parsed from PDF text |
| 111 | Prod Team - ACM | ACMProd; Editor; ACMProdEditor | Text | 1 | Parsed from PDF text |
| 112 | Prod Team - AES | AESProd; Editor; AESProdEditor | Text | 1 | Parsed from PDF text |
| 113 | Prod Team - PCOC | PCOCProd; Editor; PCOCProdEditor | Text | 1 | Parsed from PDF text |
| 114 | Prod Team - PSN | PSNProd; Editor; PSNProdEditor | Text | 1 | Parsed from PDF text |
| 115 | Prod Team | PEO | Text | 1 | Parsed from PDF text |
| 116 | Costing Team - ACM & AES | ACMCostTeam; Editor; ACMCostTeamEditor | Number/Text | 1 | Parsed from PDF text |
| 117 | Costing Team - POC | PCOCCostTeam; Editor; PCOCCostTeamEditor | Number/Text | 1 | Parsed from PDF text |
| 118 | Mailing List to Costing | CostEmails | Number/Text | 1 | Parsed from PDF text |
| 119 | Additional CC for ZOIL | LeePohYean | Text | 1 | Parsed from PDF text |
| 120 | To include in Final Mail | ChkMail | Text | 1 | Parsed from PDF text |
| 121 | IT SAP FIN | ITSAPFIN | Text | 1 | Parsed from PDF text |
| 122 | CMMD Team - Creator | CMMDTeamBAK | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (5), verification (4), status (3), approved (2), currentaction (2), submitted (1), submit (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `SAPMATEMAST`
Child-list recommendation: `MainDB_PRD_Ext_SAPMATEMAST_Rows` candidate for repeating row fields

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
| MASTER-211-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-211-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-211-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 122 |
| Workflow Signal Count | 18 |
| Notes | - |
