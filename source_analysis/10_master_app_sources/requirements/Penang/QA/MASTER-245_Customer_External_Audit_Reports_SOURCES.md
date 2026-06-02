# Master App PDF Source - Customer/External Audit Reports

> Master row: 245 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 245 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Customer/External Audit Reports | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related \| PHBSVR | Source inventory |
| Form List | Customer/External Audit Reports | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CUSTEXTEAUDI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/027_oleObject259.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 2 | 547 | 12 | 3 | Division |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION C | Inferred from PDF text | Needs Human Confirmation |
| 4 | Verification of Correction | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Date Audit | DateAudit_1; DateAudit_1_1 | Date/Text | 1 | Parsed from PDF text |
| 2 | Certification Body | CertBody | Text | 1 | Parsed from PDF text |
| 3 | Type of Audit | TypeOfAudit | Choice/Text | 1 | Parsed from PDF text |
| 4 | Scope | Scope | Text | 1 | Parsed from PDF text |
| 5 | Status of Audit | AuditStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | (Attachment) | AuditReport | Text | 1 | Parsed from PDF text |
| 7 | Corrective Action Reply | CorrectiveAction | Text | 1 | Parsed from PDF text |
| 8 | implementation | Rem | Text | 1 | Parsed from PDF text |
| 9 | Reminder Date | RemDateE | Date/Text | 1 | Parsed from PDF text |
| 10 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 11 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 12 | Created | CDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (1), verification (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `CUSTEXTEAUDI`
Child-list recommendation: `MainDB_QA_Ext_CUSTEXTEAUDI_Rows` candidate for repeating row fields

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
| MASTER-245-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-245-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-245-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 1 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 3 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
