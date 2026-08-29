# Master App PDF Source - PanCen - Job Descriptions

> Master row: 11 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 11 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Job Descriptions | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | JD_Form2 - Form | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | JD | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/006_oleObject21.pdf | Extracted embedded PDF | sheet_order_fallback | 0.395 | Explicit mapping | 6 | 1961 | 27 | 5 | JOB DESCRIPTION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Job Description | Inferred from PDF text | Needs Human Confirmation |
| 2 | JD SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B | Inferred from PDF text | Needs Human Confirmation |
| 7 | Job Description Details | Inferred from PDF text | Needs Human Confirmation |
| 8 | Not In Use | Inferred from PDF text | Needs Human Confirmation |
| 9 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Department | Dept | Text | 1 | Parsed from PDF text |
| 3 | Job Number | Code; JobNo | Text | 1 | Parsed from PDF text |
| 4 | Designation | Designation | Text | 1 | Parsed from PDF text |
| 5 | Effective Date | EffDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Report to | ReportedTo | Date/Text | 1 | Parsed from PDF text |
| 7 | Revision No. | RevNo | Number/Text | 1 | Parsed from PDF text |
| 8 | Basic Education | Edu | Text | 1 | Parsed from PDF text |
| 9 | Experience | Exp | Text | 1 | Parsed from PDF text |
| 10 | Skills | Skills | Text | 1 | Parsed from PDF text |
| 11 | (Attachment) | Attachment | Text | 1 | Parsed from PDF text |
| 12 | Updated by | Updatedby | Date/Text | 1 | Parsed from PDF text |
| 13 | Date | Updateddt | Date/Text | 1 | Parsed from PDF text |
| 14 | Distribution List | DistributionList | Text | 1 | Parsed from PDF text |
| 15 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 16 | IT | IT | Text | 1 | Parsed from PDF text |
| 17 | HR | HR | Text | 1 | Parsed from PDF text |
| 18 | HR2 | HR2 | Text | 1 | Parsed from PDF text |
| 19 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 20 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 21 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 22 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 23 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 24 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 25 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 26 | Reminder | SendTo | Date/Text | 1 | Parsed from PDF text |
| 27 | Attachment Names | Att | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (2), hod (2), currentaction (1) | Parsed from PDF text |
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
| MASTER-011-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-011-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-011-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 5 |
| Notes | - |
