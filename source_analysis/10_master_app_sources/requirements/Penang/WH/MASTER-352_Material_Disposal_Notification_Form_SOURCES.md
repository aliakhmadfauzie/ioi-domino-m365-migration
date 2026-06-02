# Master App PDF Source - Material Disposal Notification Form

> Master row: 352 | Site: Penang | Owner: WH | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 352 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Material Disposal Notification Form | Clearly Found |
| Owner | WH | Clearly Found |
| Department | Whse | Source inventory |
| Form List | Material Disposal Notification Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | MATEDISPNOTI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/WH/ECMPCR1.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1154 | 13 | 9 | ECM PEST CONTROL - Problem Notification |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/WH/PCR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 4 | 1936 | 46 | 14 | Notification num |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/002_oleObject64.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 2 | 1154 | 13 | 9 | ECM PEST CONTROL - Problem Notification |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Whse/009_oleObject71.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.333 | HCL fallback needs review | 4 | 1936 | 46 | 14 | Notification num |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section C | Inferred from PDF text | Needs Human Confirmation |
| 4 | Pesthod | Inferred from PDF text | Needs Human Confirmation |
| 5 | Section A before submitting to | Inferred from PDF text | Needs Human Confirmation |
| 6 | Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 7 | Pest Control Reports | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Cc_1 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Pesthod | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Rno | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification num | NoticeNum | Text | 1 | Parsed from PDF text |
| 2 | Send To | ToEmails | Text | 1 | Parsed from PDF text |
| 3 | CC | CC | Text | 1 | Parsed from PDF text |
| 4 | Problem | SelectionList | Text | 1 | Parsed from PDF text |
| 5 | Station Number | StationNum | Text | 1 | Parsed from PDF text |
| 6 | Problem Description | ProblemDesc | Multiline Text | 1 | Parsed from PDF text |
| 7 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 8 | Sent by | SentBy | Text | 1 | Parsed from PDF text |
| 9 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 10 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 11 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 12 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 13 | FollowUp Date | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Category | MainTitle | Choice/Text | 1 | Parsed from PDF text |
| 15 | Vendor Name | Vendor | Person/Text | 1 | Parsed from PDF text |
| 16 | Company | Company | Text | 1 | Parsed from PDF text |
| 17 | Issue Date | IssueDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Revision No. | RevNo | Number/Text | 1 | Parsed from PDF text |
| 19 | Chemical Name | ChemicalName | Person/Text | 1 | Parsed from PDF text |
| 20 | Report Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 21 | Title | Title | Text | 1 | Parsed from PDF text |
| 22 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 23 | Expiry Date | ExpDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Review Date | ReviewDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Prepared By | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 27 | Prepared Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Send To | ToEmails_1 | Text | 1 | Parsed from PDF text |
| 29 | CC | CC_1 | Text | 1 | Parsed from PDF text |
| 30 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 31 | Comments | Comment | Multiline Text | 1 | Parsed from PDF text |
| 32 | Evidence of last revise | Evidence | Text | 1 | Parsed from PDF text |
| 33 | Last review date | RevDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Obsoleted Date | ObsDate | Date/Text | 1 | Parsed from PDF text |
| 35 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 36 | Logistics HOD | PESTHOD | Person/Text | 1 | Parsed from PDF text |
| 37 | Created on | CDate | Date/Text | 1 | Parsed from PDF text |
| 38 | WH Staff | WHStaff | Text | 1 | Parsed from PDF text |
| 39 | WH Admin | WHAdmin | Text | 1 | Parsed from PDF text |
| 40 | Default mails to QA | QA | Text | 1 | Parsed from PDF text |
| 41 | Default to QA, Lai, Francis & Geetha | DefCCALL | Text | 1 | Parsed from PDF text |
| 42 | MSDS CC list | MSDSCCList | Text | 1 | Parsed from PDF text |
| 43 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 44 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 45 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 46 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 47 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 48 | Send To - Monthly Report form | SendMailingList | Text | 1 | Parsed from PDF text |
| 49 | Copy To - Monthly Report form | SendMailingCC | Text | 1 | Parsed from PDF text |
| 50 | MailingList3 | MailingList3 | Text | 1 | Parsed from PDF text |
| 51 | Notes Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 52 | Reminder - Monthly Report Followup | AllByWhom | Text | 1 | Parsed from PDF text |
| 53 | Running Number | RNO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (16), hod (8), status (6), currentaction (6), review (4), rejected (2), submitted (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_WH`
FormCode: `MATEDISPNOTI`
Child-list recommendation: `MainDB_WH_Ext_MATEDISPNOTI_Rows` candidate for repeating row fields

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
| MASTER-352-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-352-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-352-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 53 |
| Workflow Signal Count | 46 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
