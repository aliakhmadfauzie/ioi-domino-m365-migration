# Master App PDF Source - PanCen - Health Certificates Registration

> Master row: 129 | Site: Johor | Owner: SlsAdm | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 129 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Health Certificates Registration | Clearly Found |
| Owner | SlsAdm | Clearly Found |
| Department | SlsAdmin \| PCNSVR | Source inventory |
| Form List | frmHC - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | HEALCERTREGI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/SlsAdmin/001_oleObject14.pdf | Extracted embedded PDF | text_match_medium | 0.519 | Explicit mapping | 5 | 1959 | 59 | 28 | HEALTH CERTIFICATE(HC) REGISTRATION/ |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Health Certificate(Hc) Registration/ | Inferred from PDF text | Needs Human Confirmation |
| 2 | Application | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A : THE DETAILS | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B : SUBMIT DRAFT HC THROUGH EMAIL | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION C : PAYMENT TO FINANCE | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION D : HC PAYMENT APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION E : VERIFICATION AND APPROVAL BY FINANCE DEPT | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION F : PAYMENT JOURNAL TO FINANCE | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION G : ORIGINAL HC COLLECTION STATUS | Inferred from PDF text | Needs Human Confirmation |
| 10 | Section A | Inferred from PDF text | Needs Human Confirmation |
| 11 | Section B | Inferred from PDF text | Needs Human Confirmation |
| 12 | Section C | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 2 | *Company | Company | Text | 1 | Parsed from PDF text |
| 3 | *Application No | AppNo | Text | 1 | Parsed from PDF text |
| 4 | *Buyer Name | BuyerName | Person/Text | 1 | Parsed from PDF text |
| 5 | *S/O No | SONo | Text | 1 | Parsed from PDF text |
| 6 | Invoice No. | InvNo | Number/Text | 1 | Parsed from PDF text |
| 7 | (example: SOB DATE) | Remark | Date/Text | 1 | Parsed from PDF text |
| 8 | Attachment (if any) | Att | Text | 1 | Parsed from PDF text |
| 9 | Submitted By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 10 | Submitted Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Remarks | BSRem | Multiline Text | 1 | Parsed from PDF text |
| 12 | Attachment | BSAttach | Text | 1 | Parsed from PDF text |
| 13 | Submitted By | BSName | Person/Text | 1 | Parsed from PDF text |
| 14 | Submitted Date | BSDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Payment status | FinStatus | Choice/Text | 1 | Parsed from PDF text |
| 16 | Remarks | FinRem | Multiline Text | 1 | Parsed from PDF text |
| 17 | Attachment | FinAttach | Text | 1 | Parsed from PDF text |
| 18 | Designation | FinDesg | Text | 1 | Parsed from PDF text |
| 19 | Submitted By | FinName | Person/Text | 1 | Parsed from PDF text |
| 20 | Submitted Date | FinDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Status | HCStatus | Choice/Text | 1 | Parsed from PDF text |
| 22 | Remarks | HCRem | Multiline Text | 1 | Parsed from PDF text |
| 23 | Attachment | HCAttach | Text | 1 | Parsed from PDF text |
| 24 | Designation | HCDesg | Text | 1 | Parsed from PDF text |
| 25 | Submitted Date | HCDate | Date/Text | 1 | Parsed from PDF text |
| 26 | Status | VERStatus | Choice/Text | 1 | Parsed from PDF text |
| 27 | Remarks | VERRem | Multiline Text | 1 | Parsed from PDF text |
| 28 | Attachment | VERAttach | Text | 1 | Parsed from PDF text |
| 29 | Designation | VERDesg | Text | 1 | Parsed from PDF text |
| 30 | Submitted By | VERName | Person/Text | 1 | Parsed from PDF text |
| 31 | Submitted Date | VERDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Status | PJStatus | Choice/Text | 1 | Parsed from PDF text |
| 33 | Remarks | PJRem | Multiline Text | 1 | Parsed from PDF text |
| 34 | Attachment | PJAttach | Text | 1 | Parsed from PDF text |
| 35 | Designation | PJDesg | Text | 1 | Parsed from PDF text |
| 36 | Submitted By | PJName | Person/Text | 1 | Parsed from PDF text |
| 37 | Submitted Date | PJDate | Date/Text | 1 | Parsed from PDF text |
| 38 | Date of received original HC | ORDate | Date/Text | 1 | Parsed from PDF text |
| 39 | Remarks | ORRem | Multiline Text | 1 | Parsed from PDF text |
| 40 | Attachments | AttchG | Text | 1 | Parsed from PDF text |
| 41 | Submitted By | ORName | Person/Text | 1 | Parsed from PDF text |
| 42 | Submitted Date | ORDateBy | Date/Text | 1 | Parsed from PDF text |
| 43 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 44 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 45 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 46 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 47 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 48 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 49 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 50 | Editor7 | Editor7 | Text | 1 | Parsed from PDF text |
| 51 | Editor8 | Editor8 | Text | 1 | Parsed from PDF text |
| 52 | IT Admin | IT; ITADMIN | Text | 1 | Parsed from PDF text |
| 53 | Send Draft Email By | ReplyDate | Date/Text | 1 | Parsed from PDF text |
| 54 | Section B - PIC | PIC2 | Person/Text | 1 | Parsed from PDF text |
| 55 | Section C - PIC | PIC3 | Person/Text | 1 | Parsed from PDF text |
| 56 | Section D - PIC | PIC4 | Person/Text | 1 | Parsed from PDF text |
| 57 | Section E - PIC | PIC5 | Person/Text | 1 | Parsed from PDF text |
| 58 | Mail List | CCList | Text | 1 | Parsed from PDF text |
| 59 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | submitted (15), status (7), approval (2), submit (1), verification (1), currentaction (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SLSADM`
FormCode: `HEALCERTREGI`
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
| MASTER-129-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-129-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-129-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 59 |
| Workflow Signal Count | 28 |
| Notes | - |
