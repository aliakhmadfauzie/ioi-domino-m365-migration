# Master App PDF Source - Statutory & Regulatory Register

> Master row: 239 | Site: Penang | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 239 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Statutory & Regulatory Register | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| IMS Related | Source inventory |
| Form List | Quality Manual - Form \| NewReg - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STATREGU | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/051_oleObject283.pdf | Extracted embedded PDF | sheet_order_fallback | 0.384 | Explicit mapping | 2 | 1080 | 22 | 2 | Page 1 of 2 |
| source/Project Iventories/extracted-embedded-pdfs/Penang/QA/083_oleObject315.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 790 | 22 | 5 | STATUTORY & REGULATORY REGISTER |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 3 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Statutory & Regulatory Register | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approval required by Dept | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 2 | Document Title | DocTitle | Text | 1 | Parsed from PDF text |
| 3 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 4 | Approvers | App1; App2; App4; App9 | Person/Text | 1 | Parsed from PDF text |
| 5 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 6 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 7 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 8 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 9 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 10 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 11 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 12 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 13 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 14 | QA | QA | Text | 1 | Parsed from PDF text |
| 15 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 16 | Mail List for rejection | RejMail | Text | 1 | Parsed from PDF text |
| 17 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 18 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 19 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 20 | Quality Council | QualityCManagers | Text | 1 | Parsed from PDF text |
| 21 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 22 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 23 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 24 | Sijil Pendaftaran | SysCert | Text | 1 | Parsed from PDF text |
| 25 | Country | Country | Text | 1 | Parsed from PDF text |
| 26 | Regulatory / Statutory body | RegStatBody | Text | 1 | Parsed from PDF text |
| 27 | Required renewal? | Renewal | Text | 1 | Parsed from PDF text |
| 28 | Certificate/ License | CertLicense | Text | 1 | Parsed from PDF text |
| 29 | / Div Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 30 | Prepared by | PreparedBy | Person/Text | 1 | Parsed from PDF text |
| 31 | Approved by | ApprovedBy | Person/Text | 1 | Parsed from PDF text |
| 32 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 33 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 35 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 36 | Date Submit | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 37 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 38 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 39 | Running numbers | INO | Text | 1 | Parsed from PDF text |
| 40 | Assign Ref No | DisplayRefNo | Text | 1 | Parsed from PDF text |
| 41 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 42 | IT | IT | Text | 1 | Parsed from PDF text |
| 43 | Rem CC | RemCC | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (2), status (1), hod (1), approved (1), currentaction (1), submit (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `STATREGU`
Child-list recommendation: `MainDB_QA_Ext_STATREGU_Rows` candidate for repeating row fields

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
| MASTER-239-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-239-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-239-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 43 |
| Workflow Signal Count | 7 |
| Notes | - |
