# Master App PDF Source - Interview Database

> Master row: 169 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 169 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Interview Database | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| PHBSVR | Source inventory |
| Form List | INT - Form \| JD2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | INTERVIEWDB | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/016_oleObject222.pdf | Extracted embedded PDF | text_match_high | 0.757 | Explicit mapping | 4 | 1679 | 17 | 6 | INTERVIEW DATABASE |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/017_oleObject223.pdf | Extracted embedded PDF | sheet_order_fallback | 0.376 | Explicit mapping | 6 | 3382 | 16 | 12 | IOI OLEOCHEMICAL INDUSTRIES BHD. |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Interview Database | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Oleochemical Industries Berhad | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A : JUSTIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 4 | *Department/Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B : INTERVIEWER | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION C : VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION D : FOR HR USE | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ds_10 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ioi Oleochemical Industries Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 10 | JD Section | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section | Inferred from PDF text | Needs Human Confirmation |
| 12 | : section | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | SECTION A | JUSTIFICATION | Multiline Text | 1 | Parsed from PDF text |
| 2 | *Name | Name | Person/Text | 1 | Parsed from PDF text |
| 3 | *Department/Section | Department | Text | 1 | Parsed from PDF text |
| 4 | *Venue Of Interview | Venue | Text | 1 | Parsed from PDF text |
| 5 | Interviewer | Interviewer | Text | 1 | Parsed from PDF text |
| 6 | CC | ACC | Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | Attachments | Attachments | Text | 1 | Parsed from PDF text |
| 9 | SECTION B | INTERVIEWER | Text | 1 | Parsed from PDF text |
| 10 | Remarks | InRemarks | Multiline Text | 1 | Parsed from PDF text |
| 11 | Name | InName | Person/Text | 1 | Parsed from PDF text |
| 12 | Date | InDate | Date/Text | 1 | Parsed from PDF text |
| 13 | SECTION C | VERIFICATION | Text | 1 | Parsed from PDF text |
| 14 | Remarks | VrRemarks | Multiline Text | 1 | Parsed from PDF text |
| 15 | Date | VrDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 17 | Date | EmailDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Status | HStatus | Choice/Text | 1 | Parsed from PDF text |
| 19 | Division | div1 | Text | 1 | Parsed from PDF text |
| 20 | Department | department1 | Text | 1 | Parsed from PDF text |
| 21 | Company | Company | Text | 1 | Parsed from PDF text |
| 22 | Effective Date | effectdate | Date/Text | 1 | Parsed from PDF text |
| 23 | Revision Num | revnum | Text | 1 | Parsed from PDF text |
| 24 | Allowed editing for | AddEditor | Text | 1 | Parsed from PDF text |
| 25 | Distribution to | DistributionList | Text | 1 | Parsed from PDF text |
| 26 | Employee Email | EmpEmail | Text | 1 | Parsed from PDF text |
| 27 | Assign Job Number | NewNum | Text | 1 | Parsed from PDF text |
| 28 | Change Dept Name | DeptName | Person/Text | 1 | Parsed from PDF text |
| 29 | Change Rev Num | NewRevNum | Text | 1 | Parsed from PDF text |
| 30 | Change Section | SecName | Person/Text | 1 | Parsed from PDF text |
| 31 | Change Job Title | ChgTitle | Text | 1 | Parsed from PDF text |
| 32 | NAME | ackName | Person/Text | 1 | Parsed from PDF text |
| 33 | DATE | ackDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), currentaction (3), rejected (3), approved (2), approval (2), submitted (1), verification (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `INTERVIEWDB`
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
| MASTER-169-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-169-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-169-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 33 |
| Workflow Signal Count | 18 |
| Notes | - |
