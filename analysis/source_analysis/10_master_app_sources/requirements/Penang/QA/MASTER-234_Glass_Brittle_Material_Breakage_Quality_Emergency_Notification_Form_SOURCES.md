# Master App PDF Source - Glass/ Brittle Material Breakage & Quality Emergency Notification Form

> Master row: 234 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 234 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Glass/ Brittle Material Breakage & Quality Emergency Notification Form | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | Glass/ Brittle Material Breakage & Quality Emergency Notification Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | GLASBRITMATE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QA/GBMB.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.429 | HCL fallback needs review | 8 | 4654 | 68 | 21 | Glass/Brittle Materials Breakage |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/QA/GBMB2.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.429 | HCL fallback needs review | 9 | 5278 | 66 | 18 | Quality Emergency Notification Form |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/043_oleObject275.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.429 | HCL fallback needs review | 8 | 4654 | 68 | 21 | Glass/Brittle Materials Breakage |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/044_oleObject276.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.429 | HCL fallback needs review | 9 | 5278 | 66 | 18 | Quality Emergency Notification Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - INITIATOR | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION B - QA / QC / Superintendant / Production Shift Leaders | Inferred from PDF text | Needs Human Confirmation |
| 3 | On-site Verification before resume operation :- | Inferred from PDF text | Needs Human Confirmation |
| 4 | Verification | Inferred from PDF text | Needs Human Confirmation |
| 5 | Outcome of discussion/verification | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION C - INVESTIGATION | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION D - VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 9 | Implementation :- | Inferred from PDF text | Needs Human Confirmation |
| 10 | Effectiveness :- | Inferred from PDF text | Needs Human Confirmation |
| 11 | Qa-48/280420/00 | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Qahod | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Notification No (if applicable ) | txtINNumberC | Text | 1 | Parsed from PDF text |
| 3 | CC | CC | Text | 1 | Parsed from PDF text |
| 4 | Materials affected | MaterialsAffected | Text | 1 | Parsed from PDF text |
| 5 | Name of Materials affected | MaterialName | Person/Text | 1 | Parsed from PDF text |
| 6 | materials (if applicable) | BatchNo | Text | 1 | Parsed from PDF text |
| 7 | Action for affected work areas | Action_Workareas | Text | 1 | Parsed from PDF text |
| 8 | Action for affected materials | Action_Materials | Text | 1 | Parsed from PDF text |
| 9 | Action for affected products | Action_Products | Text | 1 | Parsed from PDF text |
| 10 | Notified by | NotifiedBy | Text | 1 | Parsed from PDF text |
| 11 | Designation | NotifiedPost | Text | 1 | Parsed from PDF text |
| 12 | Notified Date | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Outcome of discussion/verification | Outcome | Text | 1 | Parsed from PDF text |
| 14 | Remark | Rem | Multiline Text | 1 | Parsed from PDF text |
| 15 | First Batch Number of product produced | FirstBatchNo | Text | 1 | Parsed from PDF text |
| 16 | Resume Operation on (Date/Time) | ResumeDate; ResumeTime | Date/Text | 1 | Parsed from PDF text |
| 17 | Div/Dept Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 18 | Utilities | Utilities | Text | 1 | Parsed from PDF text |
| 19 | Others | OtherMat | Text | 1 | Parsed from PDF text |
| 20 | Proposed By | ProposedBy | Text | 1 | Parsed from PDF text |
| 21 | Date | ProposedDate | Date/Text | 1 | Parsed from PDF text |
| 22 | Reviewed by | HODApp | Person/Text | 1 | Parsed from PDF text |
| 23 | Date | HODAppDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Remark | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 25 | Approved by | QCApp | Person/Text | 1 | Parsed from PDF text |
| 26 | Date | QCAppDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Remark | QCRemark | Multiline Text | 1 | Parsed from PDF text |
| 28 | Approved by | QAApp | Person/Text | 1 | Parsed from PDF text |
| 29 | Date | QAAppDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Remark | QARemark | Multiline Text | 1 | Parsed from PDF text |
| 31 | Approved by | FSTApp | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | FSTAppDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Remark | FSTRemark | Multiline Text | 1 | Parsed from PDF text |
| 34 | Send on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 35 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 36 | Utilities | Utilities_2 | Text | 1 | Parsed from PDF text |
| 37 | Others | OtherMat_1 | Text | 1 | Parsed from PDF text |
| 38 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 39 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 40 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 41 | Send on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 42 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 43 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 44 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 45 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 46 | Comment | HACom | Multiline Text | 1 | Parsed from PDF text |
| 47 | Comment | ROCom | Multiline Text | 1 | Parsed from PDF text |
| 48 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 49 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 50 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 51 | Editor 3 - Initiator | Editor3 | Text | 1 | Parsed from PDF text |
| 52 | Editor 4 - HOD | Editor4 | Person/Text | 1 | Parsed from PDF text |
| 53 | Editor 5 - QC HOD | Editor5 | Person/Text | 1 | Parsed from PDF text |
| 54 | Editor 6 - QA HOD | Editor6 | Person/Text | 1 | Parsed from PDF text |
| 55 | Editor 7 | Editor7 | Text | 1 | Parsed from PDF text |
| 56 | Editor 8 | Editor8 | Text | 1 | Parsed from PDF text |
| 57 | Editor 9 | Editor9 | Text | 1 | Parsed from PDF text |
| 58 | QA | QA | Text | 1 | Parsed from PDF text |
| 59 | QA Manager | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 60 | QC Manager | QC1 | Text | 1 | Parsed from PDF text |
| 61 | QC Manager ECM | QC2 | Text | 1 | Parsed from PDF text |
| 62 | QC HOD | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 63 | FDT | FDT | Date/Text | 1 | Parsed from PDF text |
| 64 | FST Leader | FSTL | Text | 1 | Parsed from PDF text |
| 65 | IT | IT | Text | 1 | Parsed from PDF text |
| 66 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 67 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 68 | INO | INO | Text | 1 | Parsed from PDF text |
| 69 | Div/Dept. Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 70 | Category of Incident | Category | Choice/Text | 1 | Parsed from PDF text |
| 71 | Required QC testing/analysis | ReqAnalysis | Text | 1 | Parsed from PDF text |
| 72 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 73 | Remarks | Rem | Multiline Text | 1 | Parsed from PDF text |
| 74 | QC Results | ReqSamp_1 | Text | 1 | Parsed from PDF text |
| 75 | Approved by | FDTApp | Date/Text | 1 | Parsed from PDF text |
| 76 | Date | FDTAppDate | Date/Text | 1 | Parsed from PDF text |
| 77 | Remark | FDTRemark | Date/Text | 1 | Parsed from PDF text |
| 78 | Editor 3 - HOD | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 79 | Editor 4 - QC HOD | Editor4 | Person/Text | 1 | Parsed from PDF text |
| 80 | Editor 5 - QA HOD | Editor5 | Person/Text | 1 | Parsed from PDF text |
| 81 | Editor 6 - FST | Editor6 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (24), approved (14), verification (10), verified (10), status (8), reviewed (4), currentaction (4), ca (4) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `GLASBRITMATE`
Child-list recommendation: `MainDB_QA_Ext_GLASBRITMATE_Rows` candidate for repeating row fields

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
| MASTER-234-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-234-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-234-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 81 |
| Workflow Signal Count | 78 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
