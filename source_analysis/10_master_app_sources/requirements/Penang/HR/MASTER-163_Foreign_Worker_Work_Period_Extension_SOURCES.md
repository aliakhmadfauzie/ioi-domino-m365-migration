# Master App PDF Source - Foreign Worker Work Period Extension

> Master row: 163 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 163 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Foreign Worker Work Period Extension | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | Foreign Worker Work Period Extension | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | FWWPE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/HR/FWWPE.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.533 | HCL fallback high confidence | 4 | 2072 | 40 | 16 | Foreign Worker Work Period Ex |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - ISSUED BY HR PERSONNEL | Inferred from PDF text | Needs Human Confirmation |
| 2 | Head of Section (Optional) | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Hos | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION B - REPLY BY SUPERIOR | Inferred from PDF text | Needs Human Confirmation |
| 8 | Click To Reply | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION C - ACCEPTED BY HEAD OF SECTION | Inferred from PDF text | Needs Human Confirmation |
| 10 | Approved Rejected | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION D - ENDORSED BY HEAD OF DEPARTMENT | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION E - APPROVED BY HUMAN RESOURCES DEPARTMENT | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No | IssueNo | Text | 1 | Parsed from PDF text |
| 2 | Superior | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Head of Section (Optional) | HOS | Text | 1 | Parsed from PDF text |
| 4 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Company | Company | Text | 1 | Parsed from PDF text |
| 7 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 8 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 9 | Passport No. | PassportNo | Number/Text | 1 | Parsed from PDF text |
| 10 | Department | Department | Text | 1 | Parsed from PDF text |
| 11 | Work Permit Expiry Date | WPExpDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Contract Period | DateF | Date/Text | 1 | Parsed from PDF text |
| 13 | Contract Year | Year; Year | Text | 1 | Parsed from PDF text |
| 14 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 15 | Remark | ReplyRemark | Multiline Text | 1 | Parsed from PDF text |
| 16 | Position | Position | Text | 1 | Parsed from PDF text |
| 17 | Name | ReplyName | Person/Text | 1 | Parsed from PDF text |
| 18 | Date | ReplyDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Status | HOSStatus | Choice/Text | 1 | Parsed from PDF text |
| 20 | Name | HOSName | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | HOSDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Remark | HOSRemark | Multiline Text | 1 | Parsed from PDF text |
| 23 | Contract Status | ContStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Status | HODStatus | Person/Text | 1 | Parsed from PDF text |
| 25 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Remark | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 28 | Status | HRHODStatus | Person/Text | 1 | Parsed from PDF text |
| 29 | Name | HRHODName | Person/Text | 1 | Parsed from PDF text |
| 30 | Date | HRHODDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Remark | HRHODRemark | Person/Text | 1 | Parsed from PDF text |
| 32 | Flight Departure Date | DepartDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Departure Time | DepartTime | Text | 1 | Parsed from PDF text |
| 34 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 35 | Transportation Details | Att2 | Text | 1 | Parsed from PDF text |
| 36 | Date of Submission | SubDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 38 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 39 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 40 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (6), approved (4), rejected (3), hod (2), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `FWWPE`
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
| MASTER-163-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-163-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-163-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 40 |
| Workflow Signal Count | 16 |
| Notes | - |
