# Master App PDF Source - PanCen - Food Defence Assessment

> Master row: 75 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 75 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Food Defence Assessment | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | PanCen - Food Defence Assessment | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | FOODDEFEASSE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/JOHOR_SITE_FORM/QA/6_FDAssess.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 4 | 2145 | 50 | 16 | FOOD DEFENCE ASSESSMENT CHECKLIST & FINDINGS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/017_oleObject121.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 1.000 | HCL fallback high confidence | 4 | 2145 | 50 | 16 | FOOD DEFENCE ASSESSMENT CHECKLIST & FINDINGS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Food Defence Assessment Checklist & Findings | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A - Initiation (To be filled by Auditor) | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - Auditee's HOD Review of the Checklist & Finding | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION C - Auditee's Reply | Inferred from PDF text | Needs Human Confirmation |
| 5 | Wm_1 / Nm_1 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Wm_2 / Nm_2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | Wm_3 / Nm_3 | Inferred from PDF text | Needs Human Confirmation |
| 8 | Wm_4 / Nm_4 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Wm_5 / Nm_5 | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION D - Auditee's HOD Review of the Replied | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION E - Auditor's Acceptance | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION F - Verification of Action Plan (To be completed by QA) | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Department | Dept | Text | 1 | Parsed from PDF text |
| 4 | Area/Plant | Area | Text | 1 | Parsed from PDF text |
| 5 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 6 | Auditor | Auditor; AuditorName | Person/Text | 1 | Parsed from PDF text |
| 7 | Auditee | Auditee; AuditeeName | Person/Text | 1 | Parsed from PDF text |
| 8 | Auditee's Div/Dept Head | AuditeeHOD | Person/Text | 1 | Parsed from PDF text |
| 9 | CC | CC | Text | 1 | Parsed from PDF text |
| 10 | Self Assessment Checklist | Checklist | Text | 1 | Parsed from PDF text |
| 11 | Findings Statement | Finding_1 | Text | 1 | Parsed from PDF text |
| 12 | Auditor | ReqName | Person/Text | 1 | Parsed from PDF text |
| 13 | Date | ReqDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Reviewed by | RevName | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Acceptance | RevAcc | Text | 1 | Parsed from PDF text |
| 17 | Comments | RevCom | Multiline Text | 1 | Parsed from PDF text |
| 18 | Replied by | RepName | Person/Text | 1 | Parsed from PDF text |
| 19 | Date | RepDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Reviewed by | RevName2 | Person/Text | 1 | Parsed from PDF text |
| 21 | Date | RevDate2 | Date/Text | 1 | Parsed from PDF text |
| 22 | Acceptance | RevAcc2 | Text | 1 | Parsed from PDF text |
| 23 | Comments | RevCom2 | Multiline Text | 1 | Parsed from PDF text |
| 24 | Accepted by | AudName | Person/Text | 1 | Parsed from PDF text |
| 25 | Date | AudDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Acceptance | AudAcc | Text | 1 | Parsed from PDF text |
| 27 | Comments | AudCom | Multiline Text | 1 | Parsed from PDF text |
| 28 | Verified by | VerName | Person/Text | 1 | Parsed from PDF text |
| 29 | Verified Date | VerDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Status | VerStatus | Choice/Text | 1 | Parsed from PDF text |
| 31 | Comments | VerCom | Multiline Text | 1 | Parsed from PDF text |
| 32 | Attachment | VerAtt | Text | 1 | Parsed from PDF text |
| 33 | Followup Date | FollowupDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 35 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 36 | Withdrawn Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 37 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 38 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 39 | IT | IT | Text | 1 | Parsed from PDF text |
| 40 | QA | QA | Text | 1 | Parsed from PDF text |
| 41 | HR | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 42 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 43 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 44 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 45 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 46 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 47 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 48 | Editor 7 | Editor7 | Text | 1 | Parsed from PDF text |
| 49 | INO | INO | Text | 1 | Parsed from PDF text |
| 50 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approve (6), status (6), hod (4), review (4), reviewed (4), verified (4), verification (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `FOODDEFEASSE`
Child-list recommendation: `MainDB_QA_Ext_FOODDEFEASSE_Rows` candidate for repeating row fields

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
| MASTER-075-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-075-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-075-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 50 |
| Workflow Signal Count | 32 |
| Notes | - |
