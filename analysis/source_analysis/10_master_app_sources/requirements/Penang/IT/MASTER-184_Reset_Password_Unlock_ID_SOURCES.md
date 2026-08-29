# Master App PDF Source - Reset Password/Unlock ID

> Master row: 184 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 184 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Reset Password/Unlock ID | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT \| PHBSVR | Source inventory |
| Form List | ResetPassword2 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | RESEPASSUNLO | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/018_oleObject139.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1780 | 18 | 7 | RESET PASSWORD / UNLOCK ID FORM |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Reset Password / Unlock Id Form | Inferred from PDF text | Needs Human Confirmation |
| 2 | Please Take Note That Your New Password Must Follow The | Inferred from PDF text | Needs Human Confirmation |
| 3 | Requirements Below: | Inferred from PDF text | Needs Human Confirmation |
| 4 | Bank - ED Approval | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Isadmin | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Ou - Co | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Client | Client | Text | 1 | Parsed from PDF text |
| 2 | Client Num | ClientName | Person/Text | 1 | Parsed from PDF text |
| 3 | Bank | Bank | Text | 1 | Parsed from PDF text |
| 4 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 5 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 6 | Login ID | LoginID | Text | 1 | Parsed from PDF text |
| 7 | Unlock ID | Unlock | Text | 1 | Parsed from PDF text |
| 8 | Author | DocumentAuthor | Text | 1 | Parsed from PDF text |
| 9 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 10 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 11 | ED | ED | Text | 1 | Parsed from PDF text |
| 12 | Admin | ISADMIN | Text | 1 | Parsed from PDF text |
| 13 | Running numbers | Numbers | Text | 1 | Parsed from PDF text |
| 14 | Gatepass/SalesPortal | IncludeAll | Text | 1 | Parsed from PDF text |
| 15 | Editor 1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 16 | Editor 2 | AEditor2 | Text | 1 | Parsed from PDF text |
| 17 | Editor 3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 18 | Requestor Organization Unit | OU; CO | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), submitted (1), currentaction (1), approval (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `RESEPASSUNLO`
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
| MASTER-184-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-184-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-184-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 18 |
| Workflow Signal Count | 7 |
| Notes | - |
