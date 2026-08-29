# Master App PDF Source - Foreign Workers Work Permit

> Master row: 150 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 150 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Foreign Workers Work Permit | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| Critical App \| PHBSVR | Source inventory |
| Form List | SPForm2 - Form \| Form2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | FWWPD | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/008_oleObject214.pdf | Extracted embedded PDF | sheet_order_fallback | 0.383 | Explicit mapping | 4 | 2825 | 50 | 13 | Fixed Term Contract Requisition |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/010_oleObject216.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 3382 | 19 | 7 | FOREIGN WORKERS WORK |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | EMPLOYEE DETAILS (to be filled by HOD/HOS) | Inferred from PDF text | Needs Human Confirmation |
| 2 | Dept./Section* | Inferred from PDF text | Needs Human Confirmation |
| 3 | Justification For Fixed Term Contract | Inferred from PDF text | Needs Human Confirmation |
| 4 | SUBMITTED BY DEPARTMENT/SECTION HEAD: | Inferred from PDF text | Needs Human Confirmation |
| 5 | Recommendation By Division/Department Head | Inferred from PDF text | Needs Human Confirmation |
| 6 | Please Specify The Training | Inferred from PDF text | Needs Human Confirmation |
| 7 | Remarks/Attachment : | Inferred from PDF text | Needs Human Confirmation |
| 8 | Endorsed By Head Of Division/Department: | Inferred from PDF text | Needs Human Confirmation |
| 9 | Mc_10 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Hl_10 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Approving Authority | Inferred from PDF text | Needs Human Confirmation |
| 12 | HR SECTION : Fixed Term Contract Application Status | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Name* | EmpName | Person/Text | 1 | Parsed from PDF text |
| 2 | Emp. No* | EmpNo | Text | 1 | Parsed from PDF text |
| 3 | Date of Birth* | DOB | Date/Text | 1 | Parsed from PDF text |
| 4 | Age* | EmpAge | Text | 1 | Parsed from PDF text |
| 5 | Position* | EmpPost | Text | 1 | Parsed from PDF text |
| 6 | Dept./Section* | Dept | Text | 1 | Parsed from PDF text |
| 7 | Date Joined* | JoinDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Retirement Date* | RetDate | Date/Text | 1 | Parsed from PDF text |
| 9 | HOD/HODiv* | DivHead | Person/Text | 1 | Parsed from PDF text |
| 10 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 11 | Name | SubBy | Person/Text | 1 | Parsed from PDF text |
| 12 | Designation | SubDesg | Text | 1 | Parsed from PDF text |
| 13 | Date | SubDate | Date/Text | 1 | Parsed from PDF text |
| 14 | (Please Specify the month) | Others | Text | 1 | Parsed from PDF text |
| 15 | Identified Successor* | InSuccess | Text | 1 | Parsed from PDF text |
| 16 | For External Advertisement* | Ext | Text | 1 | Parsed from PDF text |
| 17 | Name of Successor* | SucName | Person/Text | 1 | Parsed from PDF text |
| 18 | Emp. No.* | SucEmpNo | Number/Text | 1 | Parsed from PDF text |
| 19 | Position* | SucPost | Text | 1 | Parsed from PDF text |
| 20 | Age* | SucAge | Text | 1 | Parsed from PDF text |
| 21 | Date to be Appointed* | SucDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Dept./Section* | SucDept | Text | 1 | Parsed from PDF text |
| 23 | Name | EndBy | Person/Text | 1 | Parsed from PDF text |
| 24 | Designation | EndDesg | Text | 1 | Parsed from PDF text |
| 25 | Date | EndDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Resources | AppHR | Text | 1 | Parsed from PDF text |
| 27 | Approved by title | AppCOO | Person/Text | 1 | Parsed from PDF text |
| 28 | Approved by edTitle | AppED | Date/Text | 1 | Parsed from PDF text |
| 29 | Status | CaseStatus | Choice/Text | 1 | Parsed from PDF text |
| 30 | Contract Period | AppFor | Text | 1 | Parsed from PDF text |
| 31 | Notify HOD | NotHOD | Person/Text | 1 | Parsed from PDF text |
| 32 | Remarks | Remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 33 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 34 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 35 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 36 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 37 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 38 | Editor5 - SGM | Editor5 | Text | 1 | Parsed from PDF text |
| 39 | Editor6 - ED | Editor6 | Text | 1 | Parsed from PDF text |
| 40 | Editor7 | Editor7 | Text | 1 | Parsed from PDF text |
| 41 | ED | ED | Text | 1 | Parsed from PDF text |
| 42 | SGM | SGM | Text | 1 | Parsed from PDF text |
| 43 | HR - Exec | HR_1 | Text | 1 | Parsed from PDF text |
| 44 | HR - Non Exec | HR_2 | Text | 1 | Parsed from PDF text |
| 45 | HR | HR | Text | 1 | Parsed from PDF text |
| 46 | HR Manager | HRM | Text | 1 | Parsed from PDF text |
| 47 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 48 | Year List | YearList | Text | 1 | Parsed from PDF text |
| 49 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 50 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 51 | Company | Company | Text | 1 | Parsed from PDF text |
| 52 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 53 | Check-Out-Memo | COMemo | Text | 1 | Parsed from PDF text |
| 54 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 55 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 56 | Department | Department | Text | 1 | Parsed from PDF text |
| 57 | Hostel Address | Hostel | Text | 1 | Parsed from PDF text |
| 58 | Date of Birth | DOB | Date/Text | 1 | Parsed from PDF text |
| 59 | Date of Commencement | DOC | Date/Text | 1 | Parsed from PDF text |
| 60 | New Passport No. | PassportNoNew | Number/Text | 1 | Parsed from PDF text |
| 61 | New Upload Passport | PassportNew | Text | 1 | Parsed from PDF text |
| 62 | Old Passport No. | PassportNoOld | Number/Text | 1 | Parsed from PDF text |
| 63 | Old Upload Passport | PassportOld | Text | 1 | Parsed from PDF text |
| 64 | Nationality | Nationality | Text | 1 | Parsed from PDF text |
| 65 | Contract Period | ContractPeriod; ContractPeriod_1 | Text | 1 | Parsed from PDF text |
| 66 | Work Permit No. | WorkPermitNo | Number/Text | 1 | Parsed from PDF text |
| 67 | Upload Permit to Work | Permit | Text | 1 | Parsed from PDF text |
| 68 | FOMEMA Worker Code | WorkerCode | Text | 1 | Parsed from PDF text |
| 69 | SOCSO No. | SocsoNo | Number/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (5), hod (4), submitted (3), approved (3), currentaction (2), review (1), reviewed (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `FWWPD`
Child-list recommendation: `MainDB_HR_Ext_FWWPD_Rows` candidate for repeating row fields

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
| MASTER-150-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-150-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-150-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 69 |
| Workflow Signal Count | 20 |
| Notes | - |
