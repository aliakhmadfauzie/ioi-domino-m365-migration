# Master App PDF Source - PanCen - Change Control Form

> Master row: 73 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 73 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Change Control Form | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | PanCen - Change Control Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CHANCONT | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QA/CC3.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback needs review | 4 | 3153 | 5 | 7 | Brainstorming for Change Control |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QA/CC4.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback needs review | 2 | 1758 | 2 | 5 | Checklist of Document Update for Change Control |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/017_oleObject249.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback needs review | 4 | 3153 | 5 | 7 | Brainstorming for Change Control |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/018_oleObject250.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback needs review | 2 | 1758 | 2 | 5 | Checklist of Document Update for Change Control |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Possible Impact | Inferred from PDF text | Needs Human Confirmation |
| 2 | Action | Inferred from PDF text | Needs Human Confirmation |
| 3 | Verification/ | Inferred from PDF text | Needs Human Confirmation |
| 4 | Pmt/ Pma | Inferred from PDF text | Needs Human Confirmation |
| 5 | Chra) | Inferred from PDF text | Needs Human Confirmation |
| 6 | Ccp_1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Ccp_2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Ccp_3 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ccp_4 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ccp_5 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ccp_6 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ccp_7 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Change control No. | CCNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Description of Change control | CCDesc | Multiline Text | 1 | Parsed from PDF text |
| 3 | Date of Meeting | CCMeetDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 5 | View by | Viewer | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (10), submitted (4), ca (4), verification (2), route (2), approved (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `CHANCONT`
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
| MASTER-073-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-073-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-073-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 5 |
| Workflow Signal Count | 24 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
