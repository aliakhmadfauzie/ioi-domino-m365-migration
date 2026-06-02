# Master App PDF Source - PanCen - Worker Regular Inspection

> Master row: 18 | Site: Johor | Owner: SEC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 18 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Worker Regular Inspection | Clearly Found |
| Owner | SEC | Clearly Found |
| Department | GHR \| PCNSVR | Source inventory |
| Form List | frmWork - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | WORKREGUINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/GHR/015_oleObject30.pdf | Extracted embedded PDF | text_match_high | 0.776 | Explicit mapping | 3 | 844 | 26 | 8 | Company |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Workers Regular Inspection | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A : INSPECTION DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B : ACTION TAKEN & VERIFIED BY | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C : APPROVED BY | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date of Inspection | InsDate | Date/Text | 1 | Parsed from PDF text |
| 2 | Duration | Duration | Text | 1 | Parsed from PDF text |
| 3 | Time | Time | Text | 1 | Parsed from PDF text |
| 4 | Attachments | Attch1 | Text | 1 | Parsed from PDF text |
| 5 | Findings | Finding | Text | 1 | Parsed from PDF text |
| 6 | Attachments | Attch2 | Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 8 | Name | ChkName | Person/Text | 1 | Parsed from PDF text |
| 9 | Date | ChkDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Name | SupName | Person/Text | 1 | Parsed from PDF text |
| 11 | Date | SupDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Name | VerName | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Remarks | VerRem | Multiline Text | 1 | Parsed from PDF text |
| 15 | Status | AppStatus | Choice/Text | 1 | Parsed from PDF text |
| 16 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Remarks | AppRem | Multiline Text | 1 | Parsed from PDF text |
| 19 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 20 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 21 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 22 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 23 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 24 | HR Admin | HRAdmin | Text | 1 | Parsed from PDF text |
| 25 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 26 | Verifier | Verifier | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (2), approver (2), verified (1), approved (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SEC`
FormCode: `WORKREGUINSP`
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
| MASTER-018-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-018-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-018-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 26 |
| Workflow Signal Count | 8 |
| Notes | - |
