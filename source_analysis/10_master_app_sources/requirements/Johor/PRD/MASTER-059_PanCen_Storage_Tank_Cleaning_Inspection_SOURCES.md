# Master App PDF Source - PanCen - Storage Tank Cleaning Inspection

> Master row: 59 | Site: Johor | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 59 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Storage Tank Cleaning Inspection | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | PRODUCTION \| PCNSVR | Source inventory |
| Form List | NewEntry - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORTANKCLEA | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/010_oleObject99.pdf | Extracted embedded PDF | text_match_medium | 0.562 | Explicit mapping | 4 | 1795 | 41 | 12 | STORAGE TANK CLEANING INSPECTION CHECKLIST |
| source/Project Iventories/extracted-embedded-pdfs/Johor/PRODUCTION/011_oleObject100.pdf | Extracted embedded PDF | text_match_medium | 0.562 | Explicit mapping | 4 | 1795 | 41 | 12 | STORAGE TANK CLEANING INSPECTION CHECKLIST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Storage Tank Cleaning Inspection Checklist | Inferred from PDF text | Needs Human Confirmation |
| 2 | Cleaning Request | Inferred from PDF text | Needs Human Confirmation |
| 3 | Details of Cleaning | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Pdf-119/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Pcqi | Inferred from PDF text | Needs Human Confirmation |
| 7 | Pcqi2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Pcqi2 | Inferred from PDF text | Needs Human Confirmation |
| 9 | Pcqi3 | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Pcqi3 | Inferred from PDF text | Needs Human Confirmation |
| 11 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Site | Site | Text | 1 | Parsed from PDF text |
| 2 | Storage Tank No. | TankNo | Number/Text | 1 | Parsed from PDF text |
| 3 | Tank Designation | TD | Text | 1 | Parsed from PDF text |
| 4 | Location | Location | Text | 1 | Parsed from PDF text |
| 5 | Requested By | ReqBy; ReqByEmail | Text | 1 | Parsed from PDF text |
| 6 | Position | CRPosition | Text | 1 | Parsed from PDF text |
| 7 | Date | CRDate | Date/Text | 1 | Parsed from PDF text |
| 8 | Cleaning Verified By | CRVrByName; CRVrBy | Person/Text | 1 | Parsed from PDF text |
| 9 | Date of cleaning | Date | Date/Text | 1 | Parsed from PDF text |
| 10 | Time | Time | Text | 1 | Parsed from PDF text |
| 11 | Frequency | Frequency; Year | Text | 1 | Parsed from PDF text |
| 12 | Next cleaning Date | NextDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Previous Product | Previous | Text | 1 | Parsed from PDF text |
| 14 | Incoming Product | Incoming | Text | 1 | Parsed from PDF text |
| 15 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 16 | Verified By | VerifiedBy; VerifiedByEmail | Person/Text | 1 | Parsed from PDF text |
| 17 | Position | Position | Text | 1 | Parsed from PDF text |
| 18 | Verified Date | VerifiedDate | Date/Text | 1 | Parsed from PDF text |
| 19 | Status | ApprovalStatus | Choice/Text | 1 | Parsed from PDF text |
| 20 | Position | ApprovalPosition | Text | 1 | Parsed from PDF text |
| 21 | Date | ApprovedDate | Date/Text | 1 | Parsed from PDF text |
| 22 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 23 | Title | Title | Text | 1 | Parsed from PDF text |
| 24 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 25 | Date Submit | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 26 | PCQI | PCQI | Text | 1 | Parsed from PDF text |
| 27 | PCQI2 | PCQI2 | Text | 1 | Parsed from PDF text |
| 28 | PCQI3 | PCQI3 | Text | 1 | Parsed from PDF text |
| 29 | PCQI Group | Group | Text | 1 | Parsed from PDF text |
| 30 | Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 31 | Latest | Latest | Text | 1 | Parsed from PDF text |
| 32 | Final Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 33 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 34 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 35 | Running numbers | INO | Text | 1 | Parsed from PDF text |
| 36 | Assign Ref No | DisplayRefNo | Text | 1 | Parsed from PDF text |
| 37 | Get Ref No | RefNo | Text | 1 | Parsed from PDF text |
| 38 | Year & Month | Year; Month | Text | 1 | Parsed from PDF text |
| 39 | IT Admin | ITAdmin | Text | 1 | Parsed from PDF text |
| 40 | IT | IT | Text | 1 | Parsed from PDF text |
| 41 | STAdmin | STAdmin | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | verified (6), status (4), currentaction (4), approver (4), approval (2), approved (2), submit (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `STORTANKCLEA`
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
| MASTER-059-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-059-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-059-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 41 |
| Workflow Signal Count | 24 |
| Notes | - |
