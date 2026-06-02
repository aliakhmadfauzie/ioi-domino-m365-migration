# Master App PDF Source - Share Folder Access Requisition

> Master row: 188 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 188 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Share Folder Access Requisition | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | Share Folder Access Requisition | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHARFOLDACCE | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/SFAR.pdf | HCL clean PDF | pdf_filename_title_token_fallback | 0.750 | HCL fallback high confidence | 4 | 1925 | 60 | 17 | \\Share Folder Access Request// |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/027_oleObject148.pdf | Extracted embedded PDF | pdf_filename_title_token_fallback | 0.750 | HCL fallback high confidence | 4 | 1925 | 60 | 17 | \\Share Folder Access Request// |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | \\Share Folder Access Request// | Inferred from PDF text | Needs Human Confirmation |
| 2 | Requestor Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Acidchem.Com\\Filesvr'. | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | *Request Type | Inferred from PDF text | Needs Human Confirmation |
| 6 | IT Section | Inferred from PDF text | Needs Human Confirmation |
| 7 | Verify Deny | Inferred from PDF text | Needs Human Confirmation |
| 8 | IT Verifier Section | Inferred from PDF text | Needs Human Confirmation |
| 9 | Owner Section | Inferred from PDF text | Needs Human Confirmation |
| 10 | Accept Reject | Inferred from PDF text | Needs Human Confirmation |
| 11 | HOD Section | Inferred from PDF text | Needs Human Confirmation |
| 12 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | *Type of Folder | Type | Choice/Text | 1 | Parsed from PDF text |
| 3 | *Server | Server | Text | 1 | Parsed from PDF text |
| 4 | *HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Department | Dept | Text | 1 | Parsed from PDF text |
| 7 | Ext | Ext | Text | 1 | Parsed from PDF text |
| 8 | *Owner of Folder | Owner | Text | 1 | Parsed from PDF text |
| 9 | *Request Type | AccessType | Choice/Text | 1 | Parsed from PDF text |
| 10 | Remove Access To | AccessTo; Windows; Login; ID | Text | 1 | Parsed from PDF text |
| 11 | Remove Access To | AccessToName; User | Person/Text | 1 | Parsed from PDF text |
| 12 | *Folder Name | FolderName; Including | Person/Text | 1 | Parsed from PDF text |
| 13 | *Permission | Permission | Text | 1 | Parsed from PDF text |
| 14 | *Purpose/Objective | Purpose | Text | 1 | Parsed from PDF text |
| 15 | Justification/Benefits | Justification | Multiline Text | 1 | Parsed from PDF text |
| 16 | Remarks / Attachment | Remark | Multiline Text | 1 | Parsed from PDF text |
| 17 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 18 | Date Sent | DateSent | Date/Text | 1 | Parsed from PDF text |
| 19 | Name | ITPICName | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | ITPICDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Status | ITPICStatus | Person/Text | 1 | Parsed from PDF text |
| 22 | Comment | ITPICComment | Person/Text | 1 | Parsed from PDF text |
| 23 | Name | ITName | Person/Text | 1 | Parsed from PDF text |
| 24 | Date | ITDate | Date/Text | 1 | Parsed from PDF text |
| 25 | Status | ITStatus | Choice/Text | 1 | Parsed from PDF text |
| 26 | Comment | ITComment | Multiline Text | 1 | Parsed from PDF text |
| 27 | Name | OwnerName | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | OwnerDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Status | OwnerStatus | Choice/Text | 1 | Parsed from PDF text |
| 30 | Comment | OwnerComment | Multiline Text | 1 | Parsed from PDF text |
| 31 | Name | AccName | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | AccDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Status | AccStatus | Choice/Text | 1 | Parsed from PDF text |
| 34 | Comment | AccComment | Multiline Text | 1 | Parsed from PDF text |
| 35 | Name | ITName2 | Person/Text | 1 | Parsed from PDF text |
| 36 | Date | ITDate2 | Date/Text | 1 | Parsed from PDF text |
| 37 | Status | ITStatus2 | Choice/Text | 1 | Parsed from PDF text |
| 38 | Comment | ITComment2 | Multiline Text | 1 | Parsed from PDF text |
| 39 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 40 | ISADMIN | ISG | Text | 1 | Parsed from PDF text |
| 41 | Penang | PNG | Text | 1 | Parsed from PDF text |
| 42 | Johor | JHR | Text | 1 | Parsed from PDF text |
| 43 | Johor 2 | JHR2 | Text | 1 | Parsed from PDF text |
| 44 | Batch Server PIC | BS | Person/Text | 1 | Parsed from PDF text |
| 45 | Intranet | INT | Text | 1 | Parsed from PDF text |
| 46 | PPIC | PPIC | Person/Text | 1 | Parsed from PDF text |
| 47 | Pancen IT Superior | PCNITSUP | Text | 1 | Parsed from PDF text |
| 48 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 49 | Editor 1a | Editor1a | Text | 1 | Parsed from PDF text |
| 50 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 51 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 52 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 53 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 54 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 55 | IT HOD | ITHOD | Person/Text | 1 | Parsed from PDF text |
| 56 | Verifier - Prai | VerifierPrai | Text | 1 | Parsed from PDF text |
| 57 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 58 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 59 | Mailing List | Maillist | Text | 1 | Parsed from PDF text |
| 60 | IT | IT | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (12), hod (8), reject (4), approve (2), verification (2), currentaction (2), ca (2), rejected (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SHARFOLDACCE`
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
| MASTER-188-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-188-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-188-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 60 |
| Workflow Signal Count | 34 |
| Notes | - |
