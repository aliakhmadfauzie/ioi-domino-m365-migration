# Master App PDF Source - PanCen - QA Audit Corrective Action Request

> Master row: 82 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 82 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - QA Audit Corrective Action Request | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | PanCen - QA Audit Corrective Action Request | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | QAAUDICORR | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/QA/25_QACAR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 5 | 2774 | 39 | 11 | QA AUDIT CORRECTIVE ACTION REQUEST |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/048_oleObject152.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 5 | 2774 | 39 | 11 | QA AUDIT CORRECTIVE ACTION REQUEST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | QA AUDIT CORRECTIVE ACTION REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | Auditor's Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Audit System | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B : DESCRIPTION & CLASSIFICATION OF NON-CONFORMITY | Inferred from PDF text | Needs Human Confirmation |
| 5 | Auditee's Section | Inferred from PDF text | Needs Human Confirmation |
| 6 | Correction/Corrective Action | Inferred from PDF text | Needs Human Confirmation |
| 7 | VERIFICATION OF CORRECTIVE ACTIONS (to be completed by QA) | Inferred from PDF text | Needs Human Confirmation |
| 8 | QA Section: | Inferred from PDF text | Needs Human Confirmation |
| 9 | Verification - QA | Inferred from PDF text | Needs Human Confirmation |
| 10 | Isadmin | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | CompanyName | Person/Text | 1 | Parsed from PDF text |
| 2 | QACAR No. | QACARNo | Number/Text | 1 | Parsed from PDF text |
| 3 | AUDIT SYSTEM | AuditSystem | Text | 1 | Parsed from PDF text |
| 4 | Audit Date | AuditDate | Date/Text | 1 | Parsed from PDF text |
| 5 | Issue Date | IssueDate | Date/Text | 1 | Parsed from PDF text |
| 6 | Audit Location | AuditLoc | Text | 1 | Parsed from PDF text |
| 7 | Department | Department | Text | 1 | Parsed from PDF text |
| 8 | Auditor(s) | AuditorName | Person/Text | 1 | Parsed from PDF text |
| 9 | Recipient] | AuditeeName | Person/Text | 1 | Parsed from PDF text |
| 10 | Auditee(s) | AuditeeList | Text | 1 | Parsed from PDF text |
| 11 | CC | CC | Text | 1 | Parsed from PDF text |
| 12 | Due Date * | CurrDueDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Classification | Class | Choice/Text | 1 | Parsed from PDF text |
| 14 | Clause | Clause | Text | 1 | Parsed from PDF text |
| 15 | Description | NCDetails | Multiline Text | 1 | Parsed from PDF text |
| 16 | Attachment | Attachment1 | Text | 1 | Parsed from PDF text |
| 17 | Identified by | InitiatedBy | Text | 1 | Parsed from PDF text |
| 18 | Date | IdentifiedDate | Date/Text | 1 | Parsed from PDF text |
| 19 | (Div/Dept Head) | DivHead1 | Text | 1 | Parsed from PDF text |
| 20 | CC | AudCC | Text | 1 | Parsed from PDF text |
| 21 | Proposed by | ProposeBy | Text | 1 | Parsed from PDF text |
| 22 | Date | ProposedDate | Date/Text | 1 | Parsed from PDF text |
| 23 | No. of Response | NoOfReply | Number/Text | 1 | Parsed from PDF text |
| 24 | Reviewed by | DivHead | Text | 1 | Parsed from PDF text |
| 25 | Date | DivAccDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Acceptance | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 27 | Comments | HeadDivComments | Multiline Text | 1 | Parsed from PDF text |
| 28 | Accepted by | Auditor1 | Text | 1 | Parsed from PDF text |
| 29 | Date | AcceptedDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Acceptance | Status2 | Choice/Text | 1 | Parsed from PDF text |
| 31 | Comments | CommentAuditor | Multiline Text | 1 | Parsed from PDF text |
| 32 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 33 | Comments | AuditorComments | Multiline Text | 1 | Parsed from PDF text |
| 34 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 35 | Comments | AuditorComments1 | Multiline Text | 1 | Parsed from PDF text |
| 36 | Attachment | Attach1 | Text | 1 | Parsed from PDF text |
| 37 | Verified by | ClosedBy | Person/Text | 1 | Parsed from PDF text |
| 38 | Date | AgreedDate1 | Date/Text | 1 | Parsed from PDF text |
| 39 | If yes, which workstations | Workstations | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | review (6), verification (4), status (4), currentaction (4), reviewed (2), verified (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `QAAUDICORR`
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
| MASTER-082-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-082-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-082-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 39 |
| Workflow Signal Count | 22 |
| Notes | - |
