# Master App PDF Source - EQUIPMENT PRE-INSPECTION REPORT

> Master row: 201 | Site: Penang | Owner: MTN | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 201 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | EQUIPMENT PRE-INSPECTION REPORT | Clearly Found |
| Owner | MTN | Clearly Found |
| Department | Maint \| Prod \| PHBSVR | Source inventory |
| Form List | EPI - Form \| Report - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | EQUIPREINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Maint/009_oleObject34.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 2 | 622 | 0 | 1 | EQUIPMENT PRE-INSPECTION REPORT |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/001_oleObject115.pdf | Extracted embedded PDF | text_match_medium | 0.510 | Explicit mapping | 1 | 518 | 12 | 0 | ISG Documentation |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/003_oleObject117.pdf | Extracted embedded PDF | text_match_medium | 1.000 | Explicit mapping | 2 | 622 | 0 | 1 | EQUIPMENT PRE-INSPECTION REPORT |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Equipment Pre-Inspection Report | Inferred from PDF text | Needs Human Confirmation |
| 2 | Equipment Pre_Inspection | Inferred from PDF text | Needs Human Confirmation |
| 3 | Inspectiontp | Inferred from PDF text | Needs Human Confirmation |
| 4 | Pitting | Inferred from PDF text | Needs Human Confirmation |
| 5 | Crack | Inferred from PDF text | Needs Human Confirmation |
| 6 | Bulging | Inferred from PDF text | Needs Human Confirmation |
| 7 | Sagging | Inferred from PDF text | Needs Human Confirmation |
| 8 | Otherobser | Inferred from PDF text | Needs Human Confirmation |
| 9 | Conditions | Inferred from PDF text | Needs Human Confirmation |
| 10 | Remarks | Inferred from PDF text | Needs Human Confirmation |
| 11 | Picture | Inferred from PDF text | Needs Human Confirmation |
| 12 | Hidden Fields | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Reported By | ReportedBy | Text | 1 | Parsed from PDF text |
| 3 | Date of Inspection | InsDate | Date/Text | 1 | Parsed from PDF text |
| 4 | Inspected By | InspectedBy | Text | 1 | Parsed from PDF text |
| 5 | the Inspection | Reason | Multiline Text | 1 | Parsed from PDF text |
| 6 | Equipment Number | EquipNo | Text | 1 | Parsed from PDF text |
| 7 | Test Result/Report | Result | Text | 1 | Parsed from PDF text |
| 8 | Created by | Authors | Text | 1 | Parsed from PDF text |
| 9 | Last Modified by | MachineAuthor; DateModified | Date/Text | 1 | Parsed from PDF text |
| 10 | Creation Date | MachineCreationDate | Date/Text | 1 | Parsed from PDF text |
| 11 | Modification Date | MachineModificationDate | Date/Text | 1 | Parsed from PDF text |
| 12 | ISG | ISG | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | ca (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_MTN`
FormCode: `EQUIPREINSP`
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
| MASTER-201-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-201-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-201-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 3 |
| Parsed Field Count | 12 |
| Workflow Signal Count | 2 |
| Notes | - |
