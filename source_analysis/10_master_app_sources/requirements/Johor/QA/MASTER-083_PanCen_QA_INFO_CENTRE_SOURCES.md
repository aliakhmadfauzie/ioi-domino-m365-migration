# Master App PDF Source - PanCen - QA INFO CENTRE

> Master row: 83 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 83 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - QA INFO CENTRE | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | QAInfo - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QACENT | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/049_oleObject153.pdf | Extracted embedded PDF | text_match_medium | 0.502 | Explicit mapping | 2 | 530 | 16 | 2 | QA INFORMATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Qa Information | Inferred from PDF text | Needs Human Confirmation |
| 2 | INFO SECTION | Inferred from PDF text | Needs Human Confirmation |
| 3 | FEEDBACK SECTION | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Sch | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | QA Info No | QAInfoNo | Text | 1 | Parsed from PDF text |
| 2 | To | SendTo | Date/Text | 1 | Parsed from PDF text |
| 3 | Topic | Topic | Person/Text | 1 | Parsed from PDF text |
| 4 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 5 | Description | Description | Multiline Text | 1 | Parsed from PDF text |
| 6 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Date Sent | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 10 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 11 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 12 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 13 | QA | QA | Text | 1 | Parsed from PDF text |
| 14 | Default CC | SCH | Text | 1 | Parsed from PDF text |
| 15 | Running No | Year; Month; INFONO | Text | 1 | Parsed from PDF text |
| 16 | IT | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `QACENT`
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
| MASTER-083-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-083-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-083-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 2 |
| Notes | - |
