# Master App PDF Source - PanCen - Masterlist of Records

> Master row: 79 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 79 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Masterlist of Records | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | IniExec - Form \| MasterList2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MASTOFRECO | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/021_oleObject125.pdf | Extracted embedded PDF | sheet_order_fallback | 0.200 | Explicit mapping | 2 | 476 | 2 | 2 | Food Safety Questionnaire Survey |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/042_oleObject146.pdf | Extracted embedded PDF | text_match_high | 0.764 | Explicit mapping | 3 | 1285 | 10 | 10 | MASTERLIST OF DocType |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Enter Survey | Inferred from PDF text | Needs Human Confirmation |
| 2 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | INITIATION SECTION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approval name | Inferred from PDF text | Needs Human Confirmation |
| 5 | (Approval party) | Inferred from PDF text | Needs Human Confirmation |
| 6 | APPROVAL SECTION | Inferred from PDF text | Needs Human Confirmation |
| 7 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 8 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 9 | OBSOLETE SECTION | Inferred from PDF text | Needs Human Confirmation |
| 10 | Editor Section A | Inferred from PDF text | Needs Human Confirmation |
| 11 | Editor Section B | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Initiator | Ini | Text | 1 | Parsed from PDF text |
| 2 | Recipient | Rec | Text | 1 | Parsed from PDF text |
| 3 | Document Type | DocTypeName | Person/Text | 1 | Parsed from PDF text |
| 4 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 5 | Designation | txtDesg1 | Text | 1 | Parsed from PDF text |
| 6 | CC | CCMail | Text | 1 | Parsed from PDF text |
| 7 | Designation | txtDesg2 | Text | 1 | Parsed from PDF text |
| 8 | Comments | AppCom | Multiline Text | 1 | Parsed from PDF text |
| 9 | Remarks | ObsCom | Multiline Text | 1 | Parsed from PDF text |
| 10 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 11 | DocAuthor | DocAuthor | Text | 1 | Parsed from PDF text |
| 12 | Created On | CreateDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (4), review (3), currentaction (2), ca (1), reviewed (1), hod (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `MASTOFRECO`
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
| MASTER-079-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-079-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-079-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 12 |
| Notes | - |
