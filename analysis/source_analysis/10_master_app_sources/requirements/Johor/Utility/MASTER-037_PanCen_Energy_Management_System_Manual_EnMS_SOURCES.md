# Master App PDF Source - PanCen - Energy Management System Manual (EnMS)

> Master row: 37 | Site: Johor | Owner: Utility | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 37 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Energy Management System Manual (EnMS) | Clearly Found |
| Owner | Utility | Clearly Found |
| Department | Maint \| PCNSVR | Source inventory |
| Form List | PanCen - Energy Management System Manual (EnMS) | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ENERMANUENMS | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/MTN/4_EnMS_NewQM.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.033 | HCL fallback high confidence | 4 | 1402 | 25 | 5 | Page 1 of 4 |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/MTN/4_EnMS_NewQM_SF_Approval_Complex.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.033 | HCL fallback high confidence | 2 | 1211 | 10 | 9 | APPROVALS |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/MTN/4_EnMS_QM.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.033 | HCL fallback high confidence | 3 | 780 | 25 | 2 | Page 1 of 3 |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 4 | Record Of Review | Inferred from PDF text | Needs Human Confirmation |
| 5 | Send To Qa | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 9 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 10 | Submitted for approval on DateSubmitted | Inferred from PDF text | Needs Human Confirmation |
| 11 | : K1 - K2 - K3 - K4 - K5 - K6 - K7 - K8 - K9 - K10 - K11 - K12 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Completed Approval list | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Date Issue | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 5 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 6 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 7 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 8 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 9 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 10 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 11 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 12 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 14 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 15 | QA | QA | Text | 1 | Parsed from PDF text |
| 16 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 17 | CC | CC | Text | 1 | Parsed from PDF text |
| 18 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 19 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 20 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 21 | Maillist for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 22 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 23 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 24 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 25 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Required Approvals list | TotalList | Number/Text | 1 | Parsed from PDF text |
| 27 | Pending for App | K1; K2; K3; K4 | Text | 1 | Parsed from PDF text |
| 28 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 29 | Completed Approval list | TotalCount | Number/Text | 1 | Parsed from PDF text |
| 30 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 31 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 32 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 33 | Pending App - QMR | PdgApp | Text | 1 | Parsed from PDF text |
| 34 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 35 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 36 | Section No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 37 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 38 | Distribution to | DefaultList | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (5), approval (4), review (2), approved (2), reviewed (1), submitted (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_UTILITY`
FormCode: `ENERMANUENMS`
Child-list recommendation: `MainDB_UTILITY_Ext_ENERMANUENMS_Rows` candidate for repeating row fields

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
| MASTER-037-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-037-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-037-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 16 |
| Notes | - |
