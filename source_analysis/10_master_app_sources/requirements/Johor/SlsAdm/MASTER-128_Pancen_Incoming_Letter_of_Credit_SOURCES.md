# Master App PDF Source - Pancen - Incoming Letter of Credit

> Master row: 128 | Site: Johor | Owner: SlsAdm | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 128 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - Incoming Letter of Credit | Clearly Found |
| Owner | SlsAdm | Clearly Found |
| Department | SlsAdmin \| MARKETING \| PCNSVR | Source inventory |
| Form List | frmLOCNew - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | INCOLETTOF | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/SlsAdmin/002_oleObject15.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 6 | 2354 | 82 | 16 | INCOMING LETTER OF CREDIT |
| source/Project Iventories/extracted-embedded-pdfs/Johor/MARKETING/003_oleObject57.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2352 | 81 | 16 | INCOMING LETTER OF CREDIT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Incoming Letter Of Credit | Inferred from PDF text | Needs Human Confirmation |
| 2 | SECTION A : THE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 3 | Applicant Name | Inferred from PDF text | Needs Human Confirmation |
| 4 | Fn_Ib | Inferred from PDF text | Needs Human Confirmation |
| 5 | Fn_Cb | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION B : SALES ORDER | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION C : JUSTIFICATION BY FREIGHT TEAM | Inferred from PDF text | Needs Human Confirmation |
| 8 | Accepted Unaccepted | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION D : JUSTIFICATION BY LAB TEAM | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION E : FINANCIAL DOCUMENT NUMBER (FD NUMBER) | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION F : MARKETING UPDATE | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION G : AMENDMENTS L/C RECEIVED | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 3 | Marketing Team | MkTeam | Text | 1 | Parsed from PDF text |
| 4 | LC Type | LCType | Choice/Text | 1 | Parsed from PDF text |
| 5 | L/C reader | LCReader | Text | 1 | Parsed from PDF text |
| 6 | CC | CC | Text | 1 | Parsed from PDF text |
| 7 | Applicant Name | Name | Person/Text | 1 | Parsed from PDF text |
| 8 | L/C Number | LCNo | Text | 1 | Parsed from PDF text |
| 9 | Full Name of Issung Bank | FN_IB | Person/Text | 1 | Parsed from PDF text |
| 10 | Bank | FN_CB | Text | 1 | Parsed from PDF text |
| 11 | L/C Amount | LCAmt | Number/Text | 1 | Parsed from PDF text |
| 12 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 13 | LC) | Att | Text | 1 | Parsed from PDF text |
| 14 | Lab team involvement | LAB | Text | 1 | Parsed from PDF text |
| 15 | LC Term | LC | Text | 1 | Parsed from PDF text |
| 16 | Submitted By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 17 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 18 | S/O Number | SONo | Text | 1 | Parsed from PDF text |
| 19 | CC | SOCC | Text | 1 | Parsed from PDF text |
| 20 | Remarks | SORem | Multiline Text | 1 | Parsed from PDF text |
| 21 | Attachment | SOAtt | Text | 1 | Parsed from PDF text |
| 22 | Date | SODate | Date/Text | 1 | Parsed from PDF text |
| 23 | Submitted By | SOBy | Text | 1 | Parsed from PDF text |
| 24 | Status | FRStatus | Choice/Text | 1 | Parsed from PDF text |
| 25 | Remarks | FRRem | Multiline Text | 1 | Parsed from PDF text |
| 26 | Attachment | FRAtt | Text | 1 | Parsed from PDF text |
| 27 | Submitted By | FRName | Person/Text | 1 | Parsed from PDF text |
| 28 | Date | FRDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Status | LabStatus | Choice/Text | 1 | Parsed from PDF text |
| 30 | Remarks | LabRem | Multiline Text | 1 | Parsed from PDF text |
| 31 | Attachment | LabAtt | Text | 1 | Parsed from PDF text |
| 32 | Submitted By | LabName | Person/Text | 1 | Parsed from PDF text |
| 33 | Date | LabDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Status | FD | Choice/Text | 1 | Parsed from PDF text |
| 35 | SAP Done? | No_1 | Text | 1 | Parsed from PDF text |
| 36 | FD Number | FDNo | Text | 1 | Parsed from PDF text |
| 37 | (L/C checklist) | FDAtt | Text | 1 | Parsed from PDF text |
| 38 | Remarks | FDRem | Multiline Text | 1 | Parsed from PDF text |
| 39 | CC | FDCC | Text | 1 | Parsed from PDF text |
| 40 | Submitted By | FDName | Person/Text | 1 | Parsed from PDF text |
| 41 | Date | FDDate | Date/Text | 1 | Parsed from PDF text |
| 42 | Remarks | MKRem | Multiline Text | 1 | Parsed from PDF text |
| 43 | Attachments | MKAttach | Text | 1 | Parsed from PDF text |
| 44 | Submitted By | MKName | Person/Text | 1 | Parsed from PDF text |
| 45 | Date | MKDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Attachment | AmAtt | Text | 1 | Parsed from PDF text |
| 47 | Submitted By | AmdName | Person/Text | 1 | Parsed from PDF text |
| 48 | Date | AmdDate | Date/Text | 1 | Parsed from PDF text |
| 49 | Status | CLFD | Choice/Text | 1 | Parsed from PDF text |
| 50 | SAP Done? | No_2 | Text | 1 | Parsed from PDF text |
| 51 | FD Number | CLFDNo | Text | 1 | Parsed from PDF text |
| 52 | Attachment | CLAtt | Text | 1 | Parsed from PDF text |
| 53 | Submitted By | CLName | Person/Text | 1 | Parsed from PDF text |
| 54 | Date | CLDate | Date/Text | 1 | Parsed from PDF text |
| 55 | Checked | MKFDNo | Text | 1 | Parsed from PDF text |
| 56 | Remarks | MKFDRem | Multiline Text | 1 | Parsed from PDF text |
| 57 | Submitted By | MKFDName | Person/Text | 1 | Parsed from PDF text |
| 58 | Date | MKFDDate | Date/Text | 1 | Parsed from PDF text |
| 59 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 60 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 61 | Editor1 - A | Editor1 | Text | 1 | Parsed from PDF text |
| 62 | Editor2 - B | Editor2 | Text | 1 | Parsed from PDF text |
| 63 | Editor3 - C | Editor3 | Text | 1 | Parsed from PDF text |
| 64 | Editor4 - D | Editor4 | Text | 1 | Parsed from PDF text |
| 65 | Editor5 - E | Editor5 | Text | 1 | Parsed from PDF text |
| 66 | Editor6 - F | Editor6 | Text | 1 | Parsed from PDF text |
| 67 | Editor7 - G | Editor7 | Text | 1 | Parsed from PDF text |
| 68 | Editor8 - H | Editor8 | Text | 1 | Parsed from PDF text |
| 69 | Editor9 - I | Editor9 | Text | 1 | Parsed from PDF text |
| 70 | ISG Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 71 | ISG Admin | IT | Text | 1 | Parsed from PDF text |
| 72 | Freight | FR | Text | 1 | Parsed from PDF text |
| 73 | Lab | LABPIC | Person/Text | 1 | Parsed from PDF text |
| 74 | Lab - SN | LABSN | Text | 1 | Parsed from PDF text |
| 75 | Lab - FA | LABFA | Text | 1 | Parsed from PDF text |
| 76 | Documentation Team | DOC | Text | 1 | Parsed from PDF text |
| 77 | Default CC | DefCC | Text | 1 | Parsed from PDF text |
| 78 | CC SN/FA | FSCC | Text | 1 | Parsed from PDF text |
| 79 | Default CC Sop Noddles | SNCC | Text | 1 | Parsed from PDF text |
| 80 | Default CC Fatty Acids | FACC | Text | 1 | Parsed from PDF text |
| 81 | Default CC Mkt Support | ACMCC | Text | 1 | Parsed from PDF text |
| 82 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (20), status (8), currentaction (2), ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SLSADM`
FormCode: `INCOLETTOF`
Child-list recommendation: `MainDB_SLSADM_Ext_INCOLETTOF_Rows` candidate for repeating row fields

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
| MASTER-128-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-128-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-128-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 82 |
| Workflow Signal Count | 32 |
| Notes | - |
