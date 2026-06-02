# Master App PDF Source - CCP1 Filter Inspection Findings

> Master row: 213 | Site: Penang | Owner: PRD | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 213 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | CCP1 Filter Inspection Findings | Clearly Found |
| Owner | PRD | Clearly Found |
| Department | Prod \| IMS Related \| PHBSVR | Source inventory |
| Form List | CCP2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | CCP1FILTINSP | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Prod/002_oleObject116.pdf | Extracted embedded PDF | text_match_medium | 0.565 | Explicit mapping | 3 | 1677 | 44 | 12 | CCP |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - Requestor Section | Inferred from PDF text | Needs Human Confirmation |
| 2 | Witness Acknowledgement Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - Corrective Action/Improvement | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION C - Verification of Corrective Action/Improvement | Inferred from PDF text | Needs Human Confirmation |
| 6 | Editor 1 - Section A | Inferred from PDF text | Needs Human Confirmation |
| 7 | Editor 3 - Section B | Inferred from PDF text | Needs Human Confirmation |
| 8 | Editor 4 - Section C | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Site | Site | Text | 1 | Parsed from PDF text |
| 2 | Date of Inspection | InsDate | Date/Text | 1 | Parsed from PDF text |
| 3 | Time of Inspection | InsTime | Text | 1 | Parsed from PDF text |
| 4 | Area | Area | Text | 1 | Parsed from PDF text |
| 5 | Tank Farm/Plant | Tank | Text | 1 | Parsed from PDF text |
| 6 | Filter Location | FilterLocation | Text | 1 | Parsed from PDF text |
| 7 | Final Inspection Status | InsStatus | Choice/Text | 1 | Parsed from PDF text |
| 8 | Intactness | Intact | Text | 1 | Parsed from PDF text |
| 9 | nut etc.) | Condition | Text | 1 | Parsed from PDF text |
| 10 | Functionality | Functionality | Text | 1 | Parsed from PDF text |
| 11 | Filtrate Sample | Filtrate | Number/Text | 1 | Parsed from PDF text |
| 12 | Remarks | OtherRemarks | Multiline Text | 1 | Parsed from PDF text |
| 13 | Attachment | Findings | Text | 1 | Parsed from PDF text |
| 14 | Send To HOS/HOD | SendTo | Date/Text | 1 | Parsed from PDF text |
| 15 | CC | CC | Text | 1 | Parsed from PDF text |
| 16 | Date Submitted | SubmittedOn | Date/Text | 1 | Parsed from PDF text |
| 17 | Submitted by | InsBy_1; SubName | Person/Text | 1 | Parsed from PDF text |
| 18 | Position | Position | Text | 1 | Parsed from PDF text |
| 19 | Status | AckStatus | Choice/Text | 1 | Parsed from PDF text |
| 20 | Acknowledged by | AckBy | Text | 1 | Parsed from PDF text |
| 21 | Acknowledged on | AckOn | Text | 1 | Parsed from PDF text |
| 22 | Comments | AckComments | Multiline Text | 1 | Parsed from PDF text |
| 23 | Action | Action | Text | 1 | Parsed from PDF text |
| 24 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 25 | Dateline | Dateline | Date/Text | 1 | Parsed from PDF text |
| 26 | Submitted by | SubmittedBy; PICName | Person/Text | 1 | Parsed from PDF text |
| 27 | Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 29 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 30 | Comments | Comments | Multiline Text | 1 | Parsed from PDF text |
| 31 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 32 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 33 | Verified on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 34 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 35 | Editor 1 - Section A | Editor1 | Text | 1 | Parsed from PDF text |
| 36 | Editor 2 - Acknowledgement | Editor2 | Text | 1 | Parsed from PDF text |
| 37 | Editor 3 - Section B | Editor3 | Text | 1 | Parsed from PDF text |
| 38 | Editor 4 - Section C | Editor4 | Text | 1 | Parsed from PDF text |
| 39 | IT | IT | Text | 1 | Parsed from PDF text |
| 40 | Verifier | Verifier | Text | 1 | Parsed from PDF text |
| 41 | Mailing List ACM1 | MailingList1 | Text | 1 | Parsed from PDF text |
| 42 | Mailing List ACM2 | MailingList2 | Text | 1 | Parsed from PDF text |
| 43 | Default CC | Defcc | Text | 1 | Parsed from PDF text |
| 44 | Not Num | NotNum | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), submitted (3), verified (2), hod (1), verification (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_PRD`
FormCode: `CCP1FILTINSP`
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
| MASTER-213-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-213-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-213-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 44 |
| Workflow Signal Count | 12 |
| Notes | - |
