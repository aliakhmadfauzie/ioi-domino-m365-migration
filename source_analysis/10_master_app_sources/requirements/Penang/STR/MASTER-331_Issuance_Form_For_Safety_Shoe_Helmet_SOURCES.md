# Master App PDF Source - Issuance Form For Safety Shoe & Helmet

> Master row: 331 | Site: Penang | Owner: STR | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 331 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Issuance Form For Safety Shoe & Helmet | Clearly Found |
| Owner | STR | Clearly Found |
| Department | Store | Source inventory |
| Form List | Form - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | ISSUSAFESHOE | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Store/003_oleObject37.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 3 | 1276 | 27 | 12 | Issuance Form For Safety |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SECTION A - GENERAL INFORMATIONS | Inferred from PDF text | Needs Human Confirmation |
| 2 | : Hod | Inferred from PDF text | Needs Human Confirmation |
| 3 | : Pic | Inferred from PDF text | Needs Human Confirmation |
| 4 | Request Type | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION B - SUPERIOR VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 7 | SECTION C - DIV HEAD/HOD APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 8 | SECTION D - PERSON IN CHARGE ACKNOWLEDGEMENT | Inferred from PDF text | Needs Human Confirmation |
| 9 | Acknowledge | Inferred from PDF text | Needs Human Confirmation |
| 10 | : Ino | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Issue No . | NotNum | Text | 1 | Parsed from PDF text |
| 2 | Company | Company | Text | 1 | Parsed from PDF text |
| 3 | Superior | Superior | Text | 1 | Parsed from PDF text |
| 4 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 5 | Reservation) | PIC | Person/Text | 1 | Parsed from PDF text |
| 6 | Request Type | ItemType | Choice/Text | 1 | Parsed from PDF text |
| 7 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 8 | Items | Items | Text | 1 | Parsed from PDF text |
| 9 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 10 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 11 | Department | Department | Text | 1 | Parsed from PDF text |
| 12 | Safety Shoe Size | ShoeType | Choice/Text | 1 | Parsed from PDF text |
| 13 | Last Issuance Date | LastIssuanceDate | Date/Text | 1 | Parsed from PDF text |
| 14 | Safety Helmet Colour | HelmetColour | Text | 1 | Parsed from PDF text |
| 15 | Remarks (SAP Reservation No.) | picComment | Number/Text | 1 | Parsed from PDF text |
| 16 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 17 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 18 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 19 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 20 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 21 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 22 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 23 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 24 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 25 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 26 | HR | HR | Text | 1 | Parsed from PDF text |
| 27 | INO | INO | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (3), approve (2), reject (2), status (2), verification (1), approval (1), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_STR`
FormCode: `ISSUSAFESHOE`
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
| MASTER-331-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-331-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-331-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 27 |
| Workflow Signal Count | 12 |
| Notes | - |
