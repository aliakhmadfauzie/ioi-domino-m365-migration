# Master App PDF Source - SHE Service Requisition

> Master row: 321 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 321 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Service Requisition | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| PHBSVR | Source inventory |
| Form List | SHE Service Requisition | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHESERVREQU | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/5SIR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1052 | 21 | 3 | 5S IMPROVEMENT REQUEST |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/EI.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 1 | 386 | 8 | 2 | : Send |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/FEED.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 372 | 16 | 0 | Fire Extinguisher Expiry Date Checklist |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/HIRADC.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 9 | 6068 | 12 | 19 | Page 1 of 9 |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/INSW.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1053 | 22 | 12 | INTERNAL NOTIFICATION FOR |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/IPPE.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1355 | 14 | 2 | IOI OLEOCHEMICALS INDUSTRIES |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/RLOD.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 3 | 1284 | 16 | 14 | companyname (checkbox) |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/SHE/SDS.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 611 | 13 | 3 | Safety Data Sheet |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | 5S IMPROVEMENT REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | 5SIR Request | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Cc3 | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Cpa | Inferred from PDF text | Needs Human Confirmation |
| 6 | Withdrawn Section: | Inferred from PDF text | Needs Human Confirmation |
| 7 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section Control | Inferred from PDF text | Needs Human Confirmation |
| 9 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 11 | : She | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Isg | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | No. | OFINo | Number/Text | 1 | Parsed from PDF text |
| 2 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | Initiator | Requestor | Person/Text | 1 | Parsed from PDF text |
| 4 | Recipient | Recipient; NoIdRecipient | Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Observation | DateAudit | Date/Text | 1 | Parsed from PDF text |
| 7 | Location | Location1 | Text | 1 | Parsed from PDF text |
| 8 | Description | Desc | Multiline Text | 1 | Parsed from PDF text |
| 9 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 10 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 11 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 12 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 13 | Description | PDesc | Multiline Text | 1 | Parsed from PDF text |
| 14 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 15 | Date | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 16 | CC | CC3 | Text | 1 | Parsed from PDF text |
| 17 | Acceptance | CPA | Text | 1 | Parsed from PDF text |
| 18 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 20 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 21 | Remarks | WDCom | Multiline Text | 1 | Parsed from PDF text |
| 22 | To | Send | Text | 1 | Parsed from PDF text |
| 23 | Title | Subject | Text | 1 | Parsed from PDF text |
| 24 | Description | Body | Multiline Text | 1 | Parsed from PDF text |
| 25 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 26 | Section Control | Lock | Text | 1 | Parsed from PDF text |
| 27 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 28 | ISADMIN | ISADMIN | Text | 1 | Parsed from PDF text |
| 29 | Company | Company | Text | 1 | Parsed from PDF text |
| 30 | No. | No | Number/Text | 1 | Parsed from PDF text |
| 31 | Location | Location | Text | 1 | Parsed from PDF text |
| 32 | Area | Area | Text | 1 | Parsed from PDF text |
| 33 | Level | Level | Text | 1 | Parsed from PDF text |
| 34 | Serial No. | SerialNo | Number/Text | 1 | Parsed from PDF text |
| 35 | Expiry Date | ExpiryDate | Date/Text | 1 | Parsed from PDF text |
| 36 | Prompt Date | PromptDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 38 | Replaced | Replaced | Text | 1 | Parsed from PDF text |
| 39 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 40 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 41 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 42 | SHE | SHE | Text | 1 | Parsed from PDF text |
| 43 | Editor | Editor | Text | 1 | Parsed from PDF text |
| 44 | Document Type | DocType | Choice/Text | 1 | Parsed from PDF text |
| 45 | Department | Dept | Text | 1 | Parsed from PDF text |
| 46 | Number | No | Text | 1 | Parsed from PDF text |
| 47 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 48 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 49 | TITLE | Title | Text | 1 | Parsed from PDF text |
| 50 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 51 | 7.0 Distribution to | DefaultList | Text | 1 | Parsed from PDF text |
| 52 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 53 | Waste Category Code | Name | Person/Text | 1 | Parsed from PDF text |
| 54 | Waste Name | WasteName | Person/Text | 1 | Parsed from PDF text |
| 55 | Date of Waste Generation | WasteGenDate | Date/Text | 1 | Parsed from PDF text |
| 56 | Location of Waste Generated | Location | Number/Text | 1 | Parsed from PDF text |
| 57 | Quantity Generated in MT | Qty | Number/Text | 1 | Parsed from PDF text |
| 58 | Number of drums/carboys/bags | Qty1 | Number/Text | 1 | Parsed from PDF text |
| 59 | HOD/HOS | HOD | Person/Text | 1 | Parsed from PDF text |
| 60 | Requested by | NotifiedName; Notified | Person/Text | 1 | Parsed from PDF text |
| 61 | Status | HODStatus | Person/Text | 1 | Parsed from PDF text |
| 62 | Approved By | HODApproved | Person/Text | 1 | Parsed from PDF text |
| 63 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 64 | Remarks | HODRemarks | Person/Text | 1 | Parsed from PDF text |
| 65 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 66 | Remarks | remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 67 | SHE Personnel | SHE | Text | 1 | Parsed from PDF text |
| 68 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 69 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 70 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 71 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 72 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 73 | YEAR | Year | Text | 1 | Parsed from PDF text |
| 74 | NAME OF EMPLOYEE | EmpName | Person/Text | 1 | Parsed from PDF text |
| 75 | EMPLOYEE NO | EmpNo | Text | 1 | Parsed from PDF text |
| 76 | DESIGNATION | Designation | Text | 1 | Parsed from PDF text |
| 77 | SECTION/ DEPARTMENT | Department | Text | 1 | Parsed from PDF text |
| 78 | Please specify | OthersRemark | Multiline Text | 1 | Parsed from PDF text |
| 79 | Date issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 80 | Item received by | ReceiveBy | Text | 1 | Parsed from PDF text |
| 81 | Item issued by | IssuedBy | Text | 1 | Parsed from PDF text |
| 82 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 83 | ISG | IT | Text | 1 | Parsed from PDF text |
| 84 | PPE | PPE | Text | 1 | Parsed from PDF text |
| 85 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 86 | Title | DocTitle | Text | 1 | Parsed from PDF text |
| 87 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 88 | Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 89 | Distribution to | DistributionList | Text | 1 | Parsed from PDF text |
| 90 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 91 | SHE Admin | SHEAdmin | Text | 1 | Parsed from PDF text |
| 92 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 93 | HR Admin | HR | Text | 1 | Parsed from PDF text |
| 94 | Environment Admin | ENV | Text | 1 | Parsed from PDF text |
| 95 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 96 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 97 | Chemical Name | ChemName | Person/Text | 1 | Parsed from PDF text |
| 98 | Product Name | ProdName | Person/Text | 1 | Parsed from PDF text |
| 99 | Trade Name | TradeName | Person/Text | 1 | Parsed from PDF text |
| 100 | Identification of Hazard | IdenHaz | Text | 1 | Parsed from PDF text |
| 101 | Vendor | Vendor | Text | 1 | Parsed from PDF text |
| 102 | Manufacturer | Manufacturer | Text | 1 | Parsed from PDF text |
| 103 | Material Code | MCode | Text | 1 | Parsed from PDF text |
| 104 | SDS Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 105 | SDS Due Revised | DueRevDate | Date/Text | 1 | Parsed from PDF text |
| 106 | Prepared By | PreBy | Person/Text | 1 | Parsed from PDF text |
| 107 | Date Reviewed | DateReviewed | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (11), status (11), currentaction (9), approval (7), hod (6), approved (4), reviewed (3), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHESERVREQU`
Child-list recommendation: `MainDB_SHE_Ext_SHESERVREQU_Rows` candidate for repeating row fields

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
| MASTER-321-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-321-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-321-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 8 |
| Parsed Field Count | 107 |
| Workflow Signal Count | 55 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
