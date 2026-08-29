# Master App PDF Source - Typhoid/NPRA Database

> Master row: 155 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 155 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Typhoid/NPRA Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| IMS Related \| PHBSVR | Source inventory |
| Form List | Typhoid/NPRA Database | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | TNPRA | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/TNPRA.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.700 | HCL fallback high confidence | 5 | 3969 | 31 | 5 | Typhoid/NPRA |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/025_oleObject231.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.367 | HCL fallback high confidence | 5 | 3969 | 31 | 5 | Typhoid/NPRA |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - GENERAL INFORMATION | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B - TYPHOID INJECTION / FOOD HANDLER & NPRA... | Inferred from PDF text | Needs Human Confirmation |
| 5 | Typhoid Injection Record | Inferred from PDF text | Needs Human Confirmation |
| 6 | Food Handler Medical Examination Record | Inferred from PDF text | Needs Human Confirmation |
| 7 | I_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 8 | N_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | A_1_11 | Inferred from PDF text | Needs Human Confirmation |
| 10 | P_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | C_1_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | I_2_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 4 | Contract Company | ContractCompany | Text | 1 | Parsed from PDF text |
| 5 | Name | Name; Select | Person/Text | 1 | Parsed from PDF text |
| 6 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 7 | Passport No. | IdentityNo | Number/Text | 1 | Parsed from PDF text |
| 8 | Gender | Gender | Text | 1 | Parsed from PDF text |
| 9 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 10 | Department | Department | Text | 1 | Parsed from PDF text |
| 11 | Superior | Superior | Text | 1 | Parsed from PDF text |
| 12 | Training Date | LastTrainingDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Next Training Date | NextTrainingDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 15 | Status | ActiveStatus | Choice/Text | 1 | Parsed from PDF text |
| 16 | Date Left | DateLeft | Date/Text | 1 | Parsed from PDF text |
| 17 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 18 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 19 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 21 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 22 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 23 | HR - Reminder | HR | Text | 1 | Parsed from PDF text |
| 24 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 25 | Withdraw Editor | Editor | Text | 1 | Parsed from PDF text |
| 26 | TND | TND | Text | 1 | Parsed from PDF text |
| 27 | Reminder To | RemTo | Text | 1 | Parsed from PDF text |
| 28 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 29 | Provider List | ProviderLst | Text | 1 | Parsed from PDF text |
| 30 | Inject Date List | InjectDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Next Inject Date List | NextInjectDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), submitted (2), currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `TNPRA`
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
| MASTER-155-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-155-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-155-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 31 |
| Workflow Signal Count | 10 |
| Notes | - |
