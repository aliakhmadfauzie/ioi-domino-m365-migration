# Master App PDF Source - PanCen - Validation Database

> Master row: 86 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 86 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Validation Database | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | PanCen - Validation Database | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | VALI | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/016_oleObject120.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.000 | Embedded metadata fallback needs review | 4 | 2407 | 26 | 6 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/055_oleObject159.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.000 | Embedded metadata fallback needs review | 4 | 2332 | 26 | 5 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/057_oleObject161.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.000 | Embedded metadata fallback needs review | 3 | 1300 | 35 | 12 | PANCEN VALIDATION PROTOCOL |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Food & Feed Safety Manual | Inferred from PDF text | Needs Human Confirmation |
| 2 | Section No. : SNoD (static text) | Inferred from PDF text | Needs Human Confirmation |
| 3 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 4 | Validation & Verification Authority | Inferred from PDF text | Needs Human Confirmation |
| 5 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Qa2 | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Isg | Inferred from PDF text | Needs Human Confirmation |
| 8 | Soap Noodles Haccp Manual | Inferred from PDF text | Needs Human Confirmation |
| 9 | Pancen Validation Protocol | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 12 | Sent for approval by | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Section No. | SectionNo | Number/Text | 1 | Parsed from PDF text |
| 3 | TITLE | doctitle | Text | 1 | Parsed from PDF text |
| 4 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 5 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 6 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 7 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 8 | Approval | Author_VER | Text | 1 | Parsed from PDF text |
| 9 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 10 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 11 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 12 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 14 | Initiator | Editor_Initiator | Text | 1 | Parsed from PDF text |
| 15 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 16 | QA | QA | Text | 1 | Parsed from PDF text |
| 17 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 18 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 19 | MailingList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 20 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 21 | Roles | QAAdmin | Text | 1 | Parsed from PDF text |
| 22 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 23 | Initiator | InitiatorName | Person/Text | 1 | Parsed from PDF text |
| 24 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 25 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 26 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 27 | Validation Protocol Number | VRNos | Text | 1 | Parsed from PDF text |
| 28 | Title | Title | Text | 1 | Parsed from PDF text |
| 29 | Validation Type | ValType | Choice/Text | 1 | Parsed from PDF text |
| 30 | Validation Protocol (Attachment) | ValidationProtocol | Text | 1 | Parsed from PDF text |
| 31 | Validation Report | ValidationReport | Text | 1 | Parsed from PDF text |
| 32 | Division/Department Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 33 | Prepared by | Preby | Person/Text | 1 | Parsed from PDF text |
| 34 | Date | Predate | Date/Text | 1 | Parsed from PDF text |
| 35 | Name | DivName | Person/Text | 1 | Parsed from PDF text |
| 36 | Attachment | AppAtt | Text | 1 | Parsed from PDF text |
| 37 | Comments | AppCom | Multiline Text | 1 | Parsed from PDF text |
| 38 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 39 | Name | QAName | Person/Text | 1 | Parsed from PDF text |
| 40 | Attachment | QAAtt | Text | 1 | Parsed from PDF text |
| 41 | Comments | QACom | Multiline Text | 1 | Parsed from PDF text |
| 42 | Date | QAAppDate | Date/Text | 1 | Parsed from PDF text |
| 43 | Addendum | Addendum | Text | 1 | Parsed from PDF text |
| 44 | DocAuthor | DocAuthor | Text | 1 | Parsed from PDF text |
| 45 | Created Date | CDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 47 | VRN No | Year; Month; VRNo | Text | 1 | Parsed from PDF text |
| 48 | Editor 1 - Intiation | Editor1 | Text | 1 | Parsed from PDF text |
| 49 | Editor 2a - Div App | Editor2a | Text | 1 | Parsed from PDF text |
| 50 | Editor 3 - HOD App | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 51 | Editor 4 - QA HOD | Editor4 | Person/Text | 1 | Parsed from PDF text |
| 52 | QA Personnel | QA | Text | 1 | Parsed from PDF text |
| 53 | QA Manager | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 54 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 55 | Mailing List all | CC | Text | 1 | Parsed from PDF text |
| 56 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 57 | Reminder Date 1 - Pending Validation | RemDate1 | Date/Text | 1 | Parsed from PDF text |
| 58 | Approval | RemDate2 | Date/Text | 1 | Parsed from PDF text |
| 59 | Reminder Date 3 - Pending HOD | RemDate3 | Date/Text | 1 | Parsed from PDF text |
| 60 | Reminder Date 4 - Pending QA HOD | RemDate4 | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (8), status (6), hod (5), verified (2), verification (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `VALI`
Child-list recommendation: `MainDB_QA_Ext_VALI_Rows` candidate for repeating row fields

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
| MASTER-086-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-086-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-086-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 3 |
| Parsed Field Count | 60 |
| Workflow Signal Count | 23 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
