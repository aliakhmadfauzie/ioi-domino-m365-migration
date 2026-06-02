# Master App PDF Source - Pancen - Sensory Evaluation Form

> Master row: 111 | Site: Johor | Owner: QC | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 111 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Sensory Evaluation Form | Clearly Found |
| Owner | QC | Clearly Found |
| Department | QC \| PCNSVR | Source inventory |
| Form List | Main_Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SENSEVAL | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/025_oleObject188.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 1095 | 16 | 7 | SENSORY EVALUATION FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Sensory Evaluation Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | Ioi Pan-Century Edible Iols Sdn Bhd | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A: SAMPLE INFORMATION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Product Name | Inferred from PDF text | Needs Human Confirmation |
| 5 | Tank No | Inferred from PDF text | Needs Human Confirmation |
| 6 | Date Sampling | Inferred from PDF text | Needs Human Confirmation |
| 7 | Lot No/Batch | Inferred from PDF text | Needs Human Confirmation |
| 8 | Additional | Inferred from PDF text | Needs Human Confirmation |
| 9 | Information | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION B: RESULT OF ANALYSIS | Inferred from PDF text | Needs Human Confirmation |
| 11 | Panelist | Inferred from PDF text | Needs Human Confirmation |
| 12 | In-House Method For Sensory Evaluation | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | PRODUCT NAME | ProductName | Person/Text | 1 | Parsed from PDF text |
| 2 | TANK NO | TankNo | Text | 1 | Parsed from PDF text |
| 3 | DATE SAMPLING | DateSampling | Date/Text | 1 | Parsed from PDF text |
| 4 | LOT NO/BATCH | LotNoBatch | Text | 1 | Parsed from PDF text |
| 5 | INFORMATION | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 6 | Verify by | Creator | Text | 1 | Parsed from PDF text |
| 7 | CA | CA | Text | 1 | Parsed from PDF text |
| 8 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 9 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 10 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 11 | E1 | E1 | Text | 1 | Parsed from PDF text |
| 12 | E2 | E2 | Text | 1 | Parsed from PDF text |
| 13 | IT | ISAdmin | Text | 1 | Parsed from PDF text |
| 14 | IT | IT | Text | 1 | Parsed from PDF text |
| 15 | QC | QC | Text | 1 | Parsed from PDF text |
| 16 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (2), ca (2), submitted (1), verified (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QC`
FormCode: `SENSEVAL`
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
| MASTER-111-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-111-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-111-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 16 |
| Workflow Signal Count | 7 |
| Notes | - |
