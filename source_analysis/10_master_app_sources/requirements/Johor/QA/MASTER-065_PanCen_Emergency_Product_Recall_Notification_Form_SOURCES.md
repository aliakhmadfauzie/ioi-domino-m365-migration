# Master App PDF Source - PanCen - Emergency & Product Recall Notification Form

> Master row: 65 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 65 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - Emergency & Product Recall Notification Form | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA | Source inventory |
| Form List | PRNoti - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | EMERPRODRECA | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/011_oleObject115.pdf | Extracted embedded PDF | text_match_medium | 0.508 | Explicit mapping | 11 | 13577 | 87 | 123 | Product Recall Notification Form |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - INITIATION | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION B - TRACEABILITY | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 6 | Immediate Action Taken | Inferred from PDF text | Needs Human Confirmation |
| 7 | Traceability | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION C - NOTIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 9 | Submit To Recall | Inferred from PDF text | Needs Human Confirmation |
| 10 | Parties | Inferred from PDF text | Needs Human Confirmation |
| 11 | Notification Required? | Inferred from PDF text | Needs Human Confirmation |
| 12 | Remarks/Attachment | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Company | Text | 1 | Parsed from PDF text |
| 2 | Site | Site | Text | 1 | Parsed from PDF text |
| 3 | Type | ActMock | Choice/Text | 1 | Parsed from PDF text |
| 4 | Recall Notification No. | NotNum | Number/Text | 1 | Parsed from PDF text |
| 5 | CC | CC | Text | 1 | Parsed from PDF text |
| 6 | Impact/Category of Non-Conformance | Category | Choice/Text | 1 | Parsed from PDF text |
| 7 | Materials affected | Materials | Text | 1 | Parsed from PDF text |
| 8 | Batch Number of affected materials | BatchNo | Text | 1 | Parsed from PDF text |
| 9 | Notified by | NotifiedBy | Text | 1 | Parsed from PDF text |
| 10 | Designation | NotifiedPost | Text | 1 | Parsed from PDF text |
| 11 | Notified Date | NotifiedDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Dept. Head | HOD | Person/Text | 1 | Parsed from PDF text |
| 13 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 14 | storage/tanks/plants | Action_Workareas | Text | 1 | Parsed from PDF text |
| 15 | Action for affected materials | Action_Materials | Text | 1 | Parsed from PDF text |
| 16 | Action for affected products | Action_Products | Text | 1 | Parsed from PDF text |
| 17 | Required QC testing/analysis | ReqAnalysis | Text | 1 | Parsed from PDF text |
| 18 | Remark | RecallRem | Multiline Text | 1 | Parsed from PDF text |
| 19 | Product Recall Classification | RecallClass | Choice/Text | 1 | Parsed from PDF text |
| 20 | Types of Product Recall | RecallType | Choice/Text | 1 | Parsed from PDF text |
| 21 | materials/products | QtyTally | Number/Text | 1 | Parsed from PDF text |
| 22 | Traceability Percentage | TracePer | Text | 1 | Parsed from PDF text |
| 23 | Shipped) | RRPer | Text | 1 | Parsed from PDF text |
| 24 | cycle (Notification of scenario) | TimeTaken | Text | 1 | Parsed from PDF text |
| 25 | Status of Recalled Product | Status | Choice/Text | 1 | Parsed from PDF text |
| 26 | Prepared By | PreBy | Person/Text | 1 | Parsed from PDF text |
| 27 | Designation | PreDesg | Text | 1 | Parsed from PDF text |
| 28 | Date | PreDate | Date/Text | 1 | Parsed from PDF text |
| 29 | Time Taken | TimeTaken2 | Text | 1 | Parsed from PDF text |
| 30 | Reviewed by | HODApp | Person/Text | 1 | Parsed from PDF text |
| 31 | Date | HODAppDate | Date/Text | 1 | Parsed from PDF text |
| 32 | Remark | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 33 | Submitted By | SubmittedBy | Text | 1 | Parsed from PDF text |
| 34 | Date | SubmittedDate | Date/Text | 1 | Parsed from PDF text |
| 35 | CC | CC_2 | Text | 1 | Parsed from PDF text |
| 36 | Status | ActionStatus | Choice/Text | 1 | Parsed from PDF text |
| 37 | Proposed By | ProposedBy | Text | 1 | Parsed from PDF text |
| 38 | Designation | ProposedDesg | Text | 1 | Parsed from PDF text |
| 39 | Date | ProposedDate | Date/Text | 1 | Parsed from PDF text |
| 40 | Status | Status1 | Choice/Text | 1 | Parsed from PDF text |
| 41 | Replied | A1replied | Text | 1 | Parsed from PDF text |
| 42 | Done | Done1 | Text | 1 | Parsed from PDF text |
| 43 | Listing Required Approval | TotalList | Number/Text | 1 | Parsed from PDF text |
| 44 | Status of Approval Done | TotalCount | Number/Text | 1 | Parsed from PDF text |
| 45 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 46 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 47 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 48 | All Emails | AllApps | Text | 1 | Parsed from PDF text |
| 49 | Pending Apps | PdgApps | Text | 1 | Parsed from PDF text |
| 50 | Approved by | FDTApp | Date/Text | 1 | Parsed from PDF text |
| 51 | Date | FDTAppDate | Date/Text | 1 | Parsed from PDF text |
| 52 | Remark | FDTRemark | Date/Text | 1 | Parsed from PDF text |
| 53 | Send on | VerifiedOn | Person/Text | 1 | Parsed from PDF text |
| 54 | Comments | Body | Multiline Text | 1 | Parsed from PDF text |
| 55 | Verified by | VerifiedBy | Person/Text | 1 | Parsed from PDF text |
| 56 | Status | NewStatus | Choice/Text | 1 | Parsed from PDF text |
| 57 | FOLLOWUP DATE | FollowUpDate | Date/Text | 1 | Parsed from PDF text |
| 58 | SECTION F | EFFECTIVENESS | Text | 1 | Parsed from PDF text |
| 59 | Send on | VerifiedOn_1 | Person/Text | 1 | Parsed from PDF text |
| 60 | Comments | Body_1 | Multiline Text | 1 | Parsed from PDF text |
| 61 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 62 | Verified by | VerifiedBy_1 | Person/Text | 1 | Parsed from PDF text |
| 63 | Status | NewStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 64 | Comment | HACom | Multiline Text | 1 | Parsed from PDF text |
| 65 | Comment | ROCom | Multiline Text | 1 | Parsed from PDF text |
| 66 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 67 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 68 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 69 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 70 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 71 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 72 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 73 | Editor 7 | Editor7 | Text | 1 | Parsed from PDF text |
| 74 | Editor 8 | Editor8 | Text | 1 | Parsed from PDF text |
| 75 | Editor 9 | Editor9 | Text | 1 | Parsed from PDF text |
| 76 | Editor 10 | Editor10 | Text | 1 | Parsed from PDF text |
| 77 | Editor 11 | Editor11 | Text | 1 | Parsed from PDF text |
| 78 | QA | QA | Text | 1 | Parsed from PDF text |
| 79 | QA Manager | QAHOD | Person/Text | 1 | Parsed from PDF text |
| 80 | Recall Team | RecTeam | Text | 1 | Parsed from PDF text |
| 81 | FST Leader | FSTL | Text | 1 | Parsed from PDF text |
| 82 | FDT Leader | FDTL | Date/Text | 1 | Parsed from PDF text |
| 83 | COO | COO | Text | 1 | Parsed from PDF text |
| 84 | IT | IT | Text | 1 | Parsed from PDF text |
| 85 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 86 | INO | INO | Text | 1 | Parsed from PDF text |
| 87 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (95), approve (6), reject (6), hod (2), reviewed (2), approval (2), approved (2), verified (2) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `EMERPRODRECA`
Child-list recommendation: `MainDB_QA_Ext_EMERPRODRECA_Rows` candidate for repeating row fields

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
| MASTER-065-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-065-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-065-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 87 |
| Workflow Signal Count | 123 |
| Notes | - |
