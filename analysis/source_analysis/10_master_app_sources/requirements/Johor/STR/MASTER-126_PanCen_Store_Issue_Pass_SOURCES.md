# Master App PDF Source - PanCen - Store Issue Pass

> Master row: 126 | Site: Johor | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 126 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Store Issue Pass | Clearly Found |
| Owner | STR | Clearly Found |
| Department | STORE \| PCNSVR | Source inventory |
| Form List | SIP - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | STORISSUPASS | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/STORE/005_oleObject88.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1144 | 25 | 9 | STORE ISSUE PASS |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Store Issue Pass | Inferred from PDF text | Needs Human Confirmation |
| 2 | Plant | Inferred from PDF text | Needs Human Confirmation |
| 3 | Serial Number | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION A - ISSUANCE OF DIRECT CHARGES ITEMS | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B - Requestor Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION C - Issue By | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION D - Store Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Approval | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | PLANT | Plant | Text | 1 | Parsed from PDF text |
| 2 | SERIAL NUMBER | SerialNumber | Text | 1 | Parsed from PDF text |
| 3 | Requestor | ReqName | Person/Text | 1 | Parsed from PDF text |
| 4 | Department | Dept | Text | 1 | Parsed from PDF text |
| 5 | Requestor Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 6 | Cost Code | CostCode | Number/Text | 1 | Parsed from PDF text |
| 7 | Date & Time | Date | Date/Text | 1 | Parsed from PDF text |
| 8 | Approved by | Approvedby | Person/Text | 1 | Parsed from PDF text |
| 9 | Date | ApprovedDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Received by | Receivedby | Text | 1 | Parsed from PDF text |
| 11 | Issue by | Issueby | Text | 1 | Parsed from PDF text |
| 12 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Approved by | Approval | Person/Text | 1 | Parsed from PDF text |
| 14 | Date | ApprovalDate | Date/Text | 1 | Parsed from PDF text |
| 15 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 16 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 17 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 18 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 19 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 20 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 21 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 22 | Store Issue | StoreIssue | Text | 1 | Parsed from PDF text |
| 23 | Approvedby | Apprvby | Person/Text | 1 | Parsed from PDF text |
| 24 | IT | IT | Text | 1 | Parsed from PDF text |
| 25 | Running Number | Year; Month; INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (3), approver (2), approved (2), approve (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `STORISSUPASS`
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
| MASTER-126-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-126-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-126-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 25 |
| Workflow Signal Count | 9 |
| Notes | - |
