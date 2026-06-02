# Master App PDF Source - Job Descriptions (New)

> Master row: 151 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 151 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Job Descriptions (New) | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| IMS Related \| PHBSVR | Source inventory |
| Form List | Job Descriptions (New) | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | JD | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/017_oleObject223.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 6 | 3382 | 16 | 12 | IOI OLEOCHEMICAL INDUSTRIES BHD. |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries Bhd. | Inferred from PDF text | Needs Human Confirmation |
| 2 | JD Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section | Inferred from PDF text | Needs Human Confirmation |
| 4 | : section | Inferred from PDF text | Needs Human Confirmation |
| 5 | Job Summary | Inferred from PDF text | Needs Human Confirmation |
| 6 | Duties & Accountability | Inferred from PDF text | Needs Human Confirmation |
| 7 | Authority | Inferred from PDF text | Needs Human Confirmation |
| 8 | Required Qualification And Working Experience | Inferred from PDF text | Needs Human Confirmation |
| 9 | Required Competency | Inferred from PDF text | Needs Human Confirmation |
| 10 | Change Section | Inferred from PDF text | Needs Human Confirmation |
| 11 | Acknowledged Receipt | Inferred from PDF text | Needs Human Confirmation |
| 12 | Hrpic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Status | HStatus | Choice/Text | 1 | Parsed from PDF text |
| 2 | Division | div1 | Text | 1 | Parsed from PDF text |
| 3 | Department | department1 | Text | 1 | Parsed from PDF text |
| 4 | Company | Company | Text | 1 | Parsed from PDF text |
| 5 | Effective Date | effectdate | Date/Text | 1 | Parsed from PDF text |
| 6 | Revision Num | revnum | Text | 1 | Parsed from PDF text |
| 7 | Allowed editing for | AddEditor | Text | 1 | Parsed from PDF text |
| 8 | Distribution to | DistributionList | Text | 1 | Parsed from PDF text |
| 9 | Employee Email | EmpEmail | Text | 1 | Parsed from PDF text |
| 10 | Assign Job Number | NewNum | Text | 1 | Parsed from PDF text |
| 11 | Change Dept Name | DeptName | Person/Text | 1 | Parsed from PDF text |
| 12 | Change Rev Num | NewRevNum | Text | 1 | Parsed from PDF text |
| 13 | Change Section | SecName | Person/Text | 1 | Parsed from PDF text |
| 14 | Change Job Title | ChgTitle | Text | 1 | Parsed from PDF text |
| 15 | NAME | ackName | Person/Text | 1 | Parsed from PDF text |
| 16 | DATE | ackDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | rejected (3), approved (2), currentaction (2), approval (2), status (1), hod (1), review (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `JD`
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
| MASTER-151-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-151-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-151-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 12 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
