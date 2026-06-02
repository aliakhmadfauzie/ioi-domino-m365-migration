# Master App PDF Source - PanCen - Returnable Items

> Master row: 122 | Site: Johor | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 122 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Returnable Items | Clearly Found |
| Owner | STR | Clearly Found |
| Department | STORE \| Critical App \| PCNSVR | Source inventory |
| Form List | Returnable Items - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RETUITEM | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/STORE/003_oleObject86.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 1615 | 43 | 12 | RETURNABLE ITEM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Returnable Item | Inferred from PDF text | Needs Human Confirmation |
| 2 | Internal / External Contract Job Instruction | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A - Item Taking Out | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B - Requestor Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | Requestor Approval | Inferred from PDF text | Needs Human Confirmation |
| 6 | SECTION C - Store PIC | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION D - Store Approval | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Approval | Inferred from PDF text | Needs Human Confirmation |
| 9 | SECTION E - Item Returned (Store PIC) | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION F - Requestor Confirmation | Inferred from PDF text | Needs Human Confirmation |
| 11 | Std - 24/010624/00 | Inferred from PDF text | Needs Human Confirmation |
| 12 | : Pic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Serial Number | SerialNumber | Text | 1 | Parsed from PDF text |
| 2 | Plant | Plant | Text | 1 | Parsed from PDF text |
| 3 | Requestor | ReqName | Person/Text | 1 | Parsed from PDF text |
| 4 | Department | Dept | Text | 1 | Parsed from PDF text |
| 5 | Requestor Approver | Approver | Person/Text | 1 | Parsed from PDF text |
| 6 | Party | Party | Text | 1 | Parsed from PDF text |
| 7 | Job Category | JobCategory | Choice/Text | 1 | Parsed from PDF text |
| 8 | Cost Code | CostCode | Number/Text | 1 | Parsed from PDF text |
| 9 | Date Submission | Date | Date/Text | 1 | Parsed from PDF text |
| 10 | Scope of work | Scope | Text | 1 | Parsed from PDF text |
| 11 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 12 | Returnables | Returnables | Text | 1 | Parsed from PDF text |
| 13 | Purchase Requisition No. | PurReqNo | Number/Text | 1 | Parsed from PDF text |
| 14 | Work Order No. | WorkOrderNo | Number/Text | 1 | Parsed from PDF text |
| 15 | Requestor Approval | ReqApproval | Person/Text | 1 | Parsed from PDF text |
| 16 | Approved by | Approvedby | Person/Text | 1 | Parsed from PDF text |
| 17 | Date | ApprovedDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Gate Pass No. | GatePass | Number/Text | 1 | Parsed from PDF text |
| 19 | Prepared by | Preparedby | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | PreparedDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Approve | Approve | Person/Text | 1 | Parsed from PDF text |
| 22 | Approved by | Approval | Person/Text | 1 | Parsed from PDF text |
| 23 | Date | ApprovalDate | Date/Text | 1 | Parsed from PDF text |
| 24 | Delivery Order No. | OrderNo | Number/Text | 1 | Parsed from PDF text |
| 25 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 26 | Receive | Receive | Text | 1 | Parsed from PDF text |
| 27 | Received by | Receivedby | Text | 1 | Parsed from PDF text |
| 28 | Date | ReceivedDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Accepted by | Accby | Text | 1 | Parsed from PDF text |
| 30 | Date | AccDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 32 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 33 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 34 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 35 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 36 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 37 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 38 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 39 | Editor 7 | Editor7 | Text | 1 | Parsed from PDF text |
| 40 | Store PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 41 | Store | Store | Text | 1 | Parsed from PDF text |
| 42 | IT | IT | Text | 1 | Parsed from PDF text |
| 43 | Running Number | Year; Month; INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | approval (4), approver (2), approved (2), approve (2), submitted (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `RETUITEM`
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
| MASTER-122-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-122-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-122-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 43 |
| Workflow Signal Count | 12 |
| Notes | - |
