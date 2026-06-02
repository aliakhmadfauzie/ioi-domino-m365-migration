# Master App PDF Source - ECM Master List of Calibration

> Master row: 136 | Site: Penang | Owner: E&I | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 136 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | ECM Master List of Calibration | Clearly Found |
| Owner | E&I | Clearly Found |
| Department | E&I \| IMS Related \| PHBSVR | Source inventory |
| Form List | CaliFormIn - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ECMMASTOF | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/E_I/001_oleObject20.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1193 | 34 | 10 | IOI Oleochemical Industries Berhad |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | CalibraƟon Details | Inferred from PDF text | Needs Human Confirmation |
| 2 | Accept Reject | Inferred from PDF text | Needs Human Confirmation |
| 3 | FaciliƟes Manager Approval | Inferred from PDF text | Needs Human Confirmation |
| 4 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Eimgr | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Facmgr | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Facmgr2 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Instrument Tag | InsTag | Text | 1 | Parsed from PDF text |
| 2 | Type of Instrument | InsType | Choice/Text | 1 | Parsed from PDF text |
| 3 | Measuring Range | Range | Text | 1 | Parsed from PDF text |
| 4 | Tolerance | Tolerance | Text | 1 | Parsed from PDF text |
| 5 | Frequency | Frequency | Text | 1 | Parsed from PDF text |
| 6 | Type of Calibration | CalType | Choice/Text | 1 | Parsed from PDF text |
| 7 | Division/Department | Dept | Text | 1 | Parsed from PDF text |
| 8 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 9 | Date Submitted | DateSubmit | Date/Text | 1 | Parsed from PDF text |
| 10 | Name | NameEI | Person/Text | 1 | Parsed from PDF text |
| 11 | Designation | DesiEI | Text | 1 | Parsed from PDF text |
| 12 | Date | DateEI | Date/Text | 1 | Parsed from PDF text |
| 13 | Remark | RemarksEI | Multiline Text | 1 | Parsed from PDF text |
| 14 | Name | NameFAC | Person/Text | 1 | Parsed from PDF text |
| 15 | Designation | DesiFAC | Text | 1 | Parsed from PDF text |
| 16 | Date | DateFAC | Date/Text | 1 | Parsed from PDF text |
| 17 | Remark | RemarksFAC | Multiline Text | 1 | Parsed from PDF text |
| 18 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 19 | Calibration Due Date | CalDueDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Calibration Report | Report | Text | 1 | Parsed from PDF text |
| 21 | Remarks | Remark | Multiline Text | 1 | Parsed from PDF text |
| 22 | Updated by | Updatedby | Date/Text | 1 | Parsed from PDF text |
| 23 | Updated Date | UpdatedDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Remarks | Remark2 | Multiline Text | 1 | Parsed from PDF text |
| 25 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 26 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 27 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 28 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 29 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 30 | IT | IT | Text | 1 | Parsed from PDF text |
| 31 | Admin | Admin | Text | 1 | Parsed from PDF text |
| 32 | E&I Manager | EIMGR | Text | 1 | Parsed from PDF text |
| 33 | Fac Manager | FACMGR | Text | 1 | Parsed from PDF text |
| 34 | Backup FAC Manager | FACMGR2 | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | reject (2), status (2), verified (2), submitted (1), approval (1), approve (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_E&I`
FormCode: `ECMMASTOF`
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
| MASTER-136-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-136-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-136-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 34 |
| Workflow Signal Count | 10 |
| Notes | - |
