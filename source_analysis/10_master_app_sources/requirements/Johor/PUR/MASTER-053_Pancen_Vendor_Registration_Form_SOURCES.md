# Master App PDF Source - Pancen - Vendor Registration Form

> Master row: 53 | Site: Johor | Owner: PUR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 53 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Vendor Registration Form | Clearly Found |
| Owner | PUR | Clearly Found |
| Department | PROCUREMENT \| PCNSVR | Source inventory |
| Form List | NewLiner - Form \| VendorReg - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VENDREGI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/006_oleObject72.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1076 | 37 | 11 | Comp |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PROCUREMENT/016_oleObject82.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2094 | 44 | 15 | IOI |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Freight Vendor Registration Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C - Purchasing | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION D - Purchasing HOD Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION E - Finance | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 8 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 9 | Section D | Inferred from PDF text | Needs Human Confirmation |
| 10 | Purhod | Inferred from PDF text | Needs Human Confirmation |
| 11 | Vendor Registration Form | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section A - Requestor | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Registration No | RptNo | Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Comp Name | CompName | Person/Text | 1 | Parsed from PDF text |
| 4 | Attachments | Attach | Text | 1 | Parsed from PDF text |
| 5 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 6 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 7 | Submitted by | SubmittedBy | Text | 1 | Parsed from PDF text |
| 8 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Update in SAP | SAPUpdate | Date/Text | 1 | Parsed from PDF text |
| 10 | Name | ByName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date | ByDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Remarks | ByComment | Multiline Text | 1 | Parsed from PDF text |
| 13 | Update in SAP | SAPUpdatePurHOD | Date/Text | 1 | Parsed from PDF text |
| 14 | Name | PurHodName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | PurHodDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Remarks | PurHodRem | Person/Text | 1 | Parsed from PDF text |
| 17 | Update in SAP | SAPUpdateFIN | Date/Text | 1 | Parsed from PDF text |
| 18 | Name | FinName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remarks | FinComment | Multiline Text | 1 | Parsed from PDF text |
| 21 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 23 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 24 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 25 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 26 | Editor3a | Editor3a | Text | 1 | Parsed from PDF text |
| 27 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 28 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 29 | ITAdmin | ITAdmin | Text | 1 | Parsed from PDF text |
| 30 | Purchasing | PURHOD | Person/Text | 1 | Parsed from PDF text |
| 31 | Purchasing | PUR | Text | 1 | Parsed from PDF text |
| 32 | Freight | FRG | Text | 1 | Parsed from PDF text |
| 33 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 34 | Finance 1 | FIN1 | Text | 1 | Parsed from PDF text |
| 35 | Finance 2 | FIN2 | Text | 1 | Parsed from PDF text |
| 36 | Finance | FINM | Text | 1 | Parsed from PDF text |
| 37 | INO | INO | Text | 1 | Parsed from PDF text |
| 38 | Request Type | Opt | Choice/Text | 1 | Parsed from PDF text |
| 39 | Email Supporting | Mail | Text | 1 | Parsed from PDF text |
| 40 | Date Request | DateReq | Date/Text | 1 | Parsed from PDF text |
| 41 | Requestor Name | ReqName | Person/Text | 1 | Parsed from PDF text |
| 42 | Company Name | CompName | Person/Text | 1 | Parsed from PDF text |
| 43 | Registration Number | RegNo | Text | 1 | Parsed from PDF text |
| 44 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 45 | Country of origin | Local | Text | 1 | Parsed from PDF text |
| 46 | Reason of Register | ReasonofReg | Multiline Text | 1 | Parsed from PDF text |
| 47 | For above 50K/year transaction required additional | Additional | Text | 1 | Parsed from PDF text |
| 48 | HOD's Approval | DeptApproval | Person/Text | 1 | Parsed from PDF text |
| 49 | Name | DeptName | Person/Text | 1 | Parsed from PDF text |
| 50 | Date | DeptDate | Date/Text | 1 | Parsed from PDF text |
| 51 | Remarks | DeptRemark | Multiline Text | 1 | Parsed from PDF text |
| 52 | Checked by | ProDept | Text | 1 | Parsed from PDF text |
| 53 | Date | ProDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Remarks | ProRemarks | Multiline Text | 1 | Parsed from PDF text |
| 55 | Approved by | HODApprov | Person/Text | 1 | Parsed from PDF text |
| 56 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 57 | Remarks | HODRemarks | Person/Text | 1 | Parsed from PDF text |
| 58 | Date | PurhDate | Date/Text | 1 | Parsed from PDF text |
| 59 | Created by | PurchPIC | Person/Text | 1 | Parsed from PDF text |
| 60 | Vendor code | VendorCode | Text | 1 | Parsed from PDF text |
| 61 | Remarks | PICRemarks | Person/Text | 1 | Parsed from PDF text |
| 62 | Finance Verification | FinPIC | Person/Text | 1 | Parsed from PDF text |
| 63 | Status | FinStatus | Choice/Text | 1 | Parsed from PDF text |
| 64 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 65 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 66 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 67 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 68 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 69 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 70 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 71 | HOD Dept2 - Vijaya | HODDept2 | Person/Text | 1 | Parsed from PDF text |
| 72 | HOD Dept - Chow | HODDept | Person/Text | 1 | Parsed from PDF text |
| 73 | Purch Dept - Norlisia/Roziah | PurchDept | Text | 1 | Parsed from PDF text |
| 74 | Aziun(PCOC)/Schubavani(PCEO) | FinDept | Text | 1 | Parsed from PDF text |
| 75 | CC | CC | Text | 1 | Parsed from PDF text |
| 76 | ADMIN | ADMIN | Text | 1 | Parsed from PDF text |
| 77 | IT | IT | Text | 1 | Parsed from PDF text |
| 78 | Running Number | Year; Month; INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (11), status (4), submitted (3), approval (3), ca (2), currentaction (1), approved (1), verification (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PUR`
FormCode: `VENDREGI`
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
| MASTER-053-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-053-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-053-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 78 |
| Workflow Signal Count | 26 |
| Notes | - |
