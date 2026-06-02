# Master App PDF Source - Safekeeping - Direct Charge Items

> Master row: 340 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 340 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Safekeeping - Direct Charge Items | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store \| PHBSVR | Source inventory |
| Form List | SafeDirectItemsForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAFEDIRECHAR | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/006_oleObject40.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 4 | 2365 | 48 | 8 | Safekeeping Direct Charge Items |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Request Num: ItemReqNum | Inferred from PDF text | Needs Human Confirmation |
| 2 | Space availability at Store section? | Inferred from PDF text | Needs Human Confirmation |
| 3 | Request for Retrieval: | Inferred from PDF text | Needs Human Confirmation |
| 4 | : Ecmpic | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Acmpic | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Request Num | ItemReqNum | Text | 1 | Parsed from PDF text |
| 2 | Date | dateapp2 | Date/Text | 1 | Parsed from PDF text |
| 3 | Comments | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 4 | status | statusapp2 | Choice/Text | 1 | Parsed from PDF text |
| 5 | Comments | Comment2 | Multiline Text | 1 | Parsed from PDF text |
| 6 | Date | dateapp3 | Date/Text | 1 | Parsed from PDF text |
| 7 | status | statusapp3 | Choice/Text | 1 | Parsed from PDF text |
| 8 | Date | dateapp4 | Date/Text | 1 | Parsed from PDF text |
| 9 | Comments | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 10 | status | statusapp4 | Choice/Text | 1 | Parsed from PDF text |
| 11 | GRS Date | GRSDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Material Doc Num | MatDocNum | Text | 1 | Parsed from PDF text |
| 13 | Updated By | UpdatedByACM | Date/Text | 1 | Parsed from PDF text |
| 14 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 15 | Requested by | RetrieveReqName | Person/Text | 1 | Parsed from PDF text |
| 16 | Date | RetrieveDate | Date/Text | 1 | Parsed from PDF text |
| 17 | Remarks | RetrieveRemarks | Multiline Text | 1 | Parsed from PDF text |
| 18 | Issued by | StoreIssuedBy | Text | 1 | Parsed from PDF text |
| 19 | Date | RetrieveStoreDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Remarks | StoreRemarks | Multiline Text | 1 | Parsed from PDF text |
| 21 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 22 | Discarded on | DiscardedOn | Text | 1 | Parsed from PDF text |
| 23 | Reason | Reason | Multiline Text | 1 | Parsed from PDF text |
| 24 | Default CC List | DefCC | Text | 1 | Parsed from PDF text |
| 25 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 26 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 27 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 28 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 29 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 30 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 31 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 32 | IS Admin Role | ISAdmin | Text | 1 | Parsed from PDF text |
| 33 | PIC | PICAdmin | Person/Text | 1 | Parsed from PDF text |
| 34 | Store ACM | StoreHODEmail_A | Person/Text | 1 | Parsed from PDF text |
| 35 | Store ECM | StoreHODEmail_E | Person/Text | 1 | Parsed from PDF text |
| 36 | HOD Store Email | StoreHOD | Person/Text | 1 | Parsed from PDF text |
| 37 | COO Email | COOEmail | Text | 1 | Parsed from PDF text |
| 38 | ECM-Store PIC | ECMPIC | Person/Text | 1 | Parsed from PDF text |
| 39 | ACM-Store PIC | ACMPIC | Person/Text | 1 | Parsed from PDF text |
| 40 | Final PIC as per plant | FinalPIC | Person/Text | 1 | Parsed from PDF text |
| 41 | Mailing List from COO | ApprovalCC | Text | 1 | Parsed from PDF text |
| 42 | Final CC List | FinalCC | Text | 1 | Parsed from PDF text |
| 43 | Reminder - due item (Ori) | dtRemDue1 | Date/Text | 1 | Parsed from PDF text |
| 44 | Reminder - due item (ext) | dtRemDue2 | Date/Text | 1 | Parsed from PDF text |
| 45 | Next reminder date for Item due | FinalDueDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Year & Month & INO | INO | Text | 1 | Parsed from PDF text |
| 47 | Due Date | DueDate | Date/Text | 1 | Parsed from PDF text |
| 48 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (3), hod (2), verified (1), approved (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `SAFEDIRECHAR`
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
| MASTER-340-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-340-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-340-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 48 |
| Workflow Signal Count | 8 |
| Notes | - |
