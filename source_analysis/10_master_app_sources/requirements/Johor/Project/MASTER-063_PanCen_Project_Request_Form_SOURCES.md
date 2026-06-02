# Master App PDF Source - PanCen - Project Request Form

> Master row: 63 | Site: Johor | Owner: Project | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 63 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Project Request Form | Clearly Found |
| Owner | Project | Clearly Found |
| Department | Project \| PCNSVR | Source inventory |
| Form List | PRJREQ - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | PROJ | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/Project/001_oleObject211.pdf | Extracted embedded PDF | text_match_high | 0.759 | Explicit mapping | 3 | 1927 | 22 | 15 | IOI PAN-CENTURY EDIBLE OILS SDN.BHD. |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Pan-Century Edible Oils Sdn.Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Pan-Century Oleochemicals Sdn.Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 3 | PROJECT REQUEST FORM | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION A : TO FILL UP BY REQUESTOR | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section/Department | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B : DEPARTMENT HEAD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION C : DIVISION HEAD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION D : ENGINEERING TEAM APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 9 | For P/E Department Evaluation | Inferred from PDF text | Needs Human Confirmation |
| 10 | 1. For project under CAPEX, existing CAR approval procedure need to be followed. | Inferred from PDF text | Needs Human Confirmation |
| 11 | Pjt-01/011220/06 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date Initiated | IniDate | Date/Text | 1 | Parsed from PDF text |
| 2 | Initiator | IniName | Person/Text | 1 | Parsed from PDF text |
| 3 | Section/Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Project Title | PrjTitle | Text | 1 | Parsed from PDF text |
| 5 | Scope Inclusion | Scope | Text | 1 | Parsed from PDF text |
| 6 | CAPEX Number | CAPEXno | Text | 1 | Parsed from PDF text |
| 7 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 8 | Preliminary Evaluation No. | PENo | Number/Text | 1 | Parsed from PDF text |
| 9 | Department Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 10 | Division Head | HODiv | Person/Text | 1 | Parsed from PDF text |
| 11 | Recommended By | AppBy | Text | 1 | Parsed from PDF text |
| 12 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Remark (If any) | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 14 | Approved By | AppBy2 | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | AppDate2 | Date/Text | 1 | Parsed from PDF text |
| 16 | Remark (If any) | AppRem2 | Multiline Text | 1 | Parsed from PDF text |
| 17 | Received By | AppBy3 | Text | 1 | Parsed from PDF text |
| 18 | Date | AppDate3 | Date/Text | 1 | Parsed from PDF text |
| 19 | Remark (If any) | AppRem3 | Multiline Text | 1 | Parsed from PDF text |
| 20 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 21 | Project Ref No. | RefNo | Number/Text | 1 | Parsed from PDF text |
| 22 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (5), reject (3), status (2), hod (1), approve (1), approved (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PROJECT`
FormCode: `PROJ`
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
| MASTER-063-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-063-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-063-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 22 |
| Workflow Signal Count | 15 |
| Notes | - |
