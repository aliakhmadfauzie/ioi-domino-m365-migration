# Master App PDF Source - PanCen - Organisation Charts

> Master row: 15 | Site: Johor | Owner: HR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 15 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Organisation Charts | Clearly Found |
| Owner | HR | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | PanCen - Organisation Charts | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | ORGCHART | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/011_oleObject26.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.033 | Embedded metadata fallback needs review | 6 | 2095 | 18 | 3 | PanCen Organisation Charts |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Main Section: | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 4 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ino_2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Jus_2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ino_3 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Jus_3 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ino_4 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Jus_4 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ino_5 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Revision No. | RevNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Distribution List | DistributionList | Text | 1 | Parsed from PDF text |
| 3 | Updated by | Updatedby | Date/Text | 1 | Parsed from PDF text |
| 4 | Initiator | Initiator | Text | 1 | Parsed from PDF text |
| 5 | Drafted on | DraftedOn | Text | 1 | Parsed from PDF text |
| 6 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 7 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 8 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 9 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 10 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 11 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 12 | HR Zubaidah | HR2 | Text | 1 | Parsed from PDF text |
| 13 | HR PIC-Admin | HRPIC | Person/Text | 1 | Parsed from PDF text |
| 14 | HR Manager - PrepareBy | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 15 | WhoCanRead | Readers | Text | 1 | Parsed from PDF text |
| 16 | IS Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 17 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Send To | SendTo | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approved (1), verified (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `ORGCHART`
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
| MASTER-015-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-015-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-015-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 18 |
| Workflow Signal Count | 3 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
