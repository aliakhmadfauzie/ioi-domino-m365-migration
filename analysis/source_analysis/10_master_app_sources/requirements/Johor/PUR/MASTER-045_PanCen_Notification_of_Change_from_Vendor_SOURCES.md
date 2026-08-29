# Master App PDF Source - PanCen - Notification of Change from Vendor

> Master row: 45 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 45 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Notification of Change from Vendor | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | PanCen - Notification of Change from Vendor | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | NOTIOFCHAN | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/PRC/7_PCNVdrChange.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 5 | 3379 | 28 | 19 | Pancen Notification of Change from Vendor |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/007_oleObject73.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 5 | 3379 | 28 | 19 | Pancen Notification of Change from Vendor |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section 1 - Initiation (to be completed by Initiator) | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Pur | Inferred from PDF text | Needs Human Confirmation |
| 3 | R & D | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section 2 - Assessment | Inferred from PDF text | Needs Human Confirmation |
| 5 | Verification Status | Inferred from PDF text | Needs Human Confirmation |
| 6 | Status of Req'd approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | For Approval Notification :- | Inferred from PDF text | Needs Human Confirmation |
| 8 | Log Hod | Inferred from PDF text | Needs Human Confirmation |
| 9 | Prod Hod | Inferred from PDF text | Needs Human Confirmation |
| 10 | Mkt Hod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section 3 - Approval | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section 4 - Status | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Vendor Change Num | ChgNum | Text | 1 | Parsed from PDF text |
| 2 | Company | CompName | Person/Text | 1 | Parsed from PDF text |
| 3 | Department | PUR | Text | 1 | Parsed from PDF text |
| 4 | Name/Description of Material | txtMatDescription | Person/Text | 1 | Parsed from PDF text |
| 5 | Type of Material | VCARCat | Choice/Text | 1 | Parsed from PDF text |
| 6 | Name | nmRequestor | Person/Text | 1 | Parsed from PDF text |
| 7 | Date | dtRequestDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Remarks | txtRequestorRemarks | Person/Text | 1 | Parsed from PDF text |
| 9 | To capture team required | sel1 | Text | 1 | Parsed from PDF text |
| 10 | No of team required | TotalList | Number/Text | 1 | Parsed from PDF text |
| 11 | Verification Status | txtStatus1 | Choice/Text | 1 | Parsed from PDF text |
| 12 | Status of Req'd approval | TotalCount; If; QA | Number/Text | 1 | Parsed from PDF text |
| 13 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 14 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 15 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 16 | Comment | txtComLOGC_1 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Comment | txtComProdC_1 | Multiline Text | 1 | Parsed from PDF text |
| 18 | Comment | txtComMKTC_1 | Multiline Text | 1 | Parsed from PDF text |
| 19 | Comment | txtComQAC_1 | Multiline Text | 1 | Parsed from PDF text |
| 20 | HiddenStatus | StatusLOG | Choice/Text | 1 | Parsed from PDF text |
| 21 | HiddenStatus | StatusProd | Choice/Text | 1 | Parsed from PDF text |
| 22 | HiddenStatus | StatusMKT | Choice/Text | 1 | Parsed from PDF text |
| 23 | HiddenStatus | StatusQA | Choice/Text | 1 | Parsed from PDF text |
| 24 | CC | SendCC | Text | 1 | Parsed from PDF text |
| 25 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 27 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 28 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (12), approval (8), hod (6), submitted (2), approve (2), reject (2), verification (2), approved (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `NOTIOFCHAN`
Child-list recommendation: `MainDB_PUR_Ext_NOTIOFCHAN_Rows` candidate for repeating row fields

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
| MASTER-045-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-045-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-045-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 28 |
| Workflow Signal Count | 38 |
| Notes | - |
