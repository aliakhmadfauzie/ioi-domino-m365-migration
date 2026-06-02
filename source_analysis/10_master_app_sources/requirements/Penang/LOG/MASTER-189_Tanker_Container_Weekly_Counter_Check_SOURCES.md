# Master App PDF Source - Tanker & Container Weekly Counter Check

> Master row: 189 | Site: Penang | Owner: LOG | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 189 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Tanker & Container Weekly Counter Check | Clearly Found |
| Owner | LOG | Clearly Found |
| Department | Log | Source inventory |
| Form List | LicAss - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | TANKCONTWEEK | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/Log/005_oleObject52.pdf | Extracted embedded PDF | sheet_order_fallback | 0.261 | Explicit mapping | 5 | 2919 | 47 | 4 | FDP ASSESSMENT APPLICATION |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Fdp Assessment Application | Inferred from PDF text | Needs Human Confirmation |
| 2 | Initiator Section | Inferred from PDF text | Needs Human Confirmation |
| 3 | Application For :- | Inferred from PDF text | Needs Human Confirmation |
| 4 | Forklift / Reach Truck Operator Assessment | Inferred from PDF text | Needs Human Confirmation |
| 5 | Operator Behaviors | Inferred from PDF text | Needs Human Confirmation |
| 6 | Pre Inspection | Inferred from PDF text | Needs Human Confirmation |
| 7 | Picking Up A Load | Inferred from PDF text | Needs Human Confirmation |
| 8 | Traveling With Load | Inferred from PDF text | Needs Human Confirmation |
| 9 | Ob_10 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Ob_11 | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ob_12 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Ob_13 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Form Serial No. | FBNo | Number/Text | 1 | Parsed from PDF text |
| 2 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 3 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 4 | Site | Site | Text | 1 | Parsed from PDF text |
| 5 | Department | Department | Text | 1 | Parsed from PDF text |
| 6 | Designation | AppDesg | Text | 1 | Parsed from PDF text |
| 7 | Equipment Operated | Equip | Number/Text | 1 | Parsed from PDF text |
| 8 | Vendor | Vendor | Text | 1 | Parsed from PDF text |
| 9 | Type of License | LicType | Choice/Text | 1 | Parsed from PDF text |
| 10 | forklift driving | Experience | Text | 1 | Parsed from PDF text |
| 11 | Years of Experience | ExpYears | Text | 1 | Parsed from PDF text |
| 12 | Driver | FDriverNo | Text | 1 | Parsed from PDF text |
| 13 | Carried out by | AssType | Choice/Text | 1 | Parsed from PDF text |
| 14 | Internal Assessor SELECT | Assessor; IAName | Person/Text | 1 | Parsed from PDF text |
| 15 | Qualified Assessor | Assessor2 | Text | 1 | Parsed from PDF text |
| 16 | CC | CC | Text | 1 | Parsed from PDF text |
| 17 | Requested By (HOS/HOD) | Requestor | Person/Text | 1 | Parsed from PDF text |
| 18 | Designation | Desg | Text | 1 | Parsed from PDF text |
| 19 | Reported On | DateSent | Date/Text | 1 | Parsed from PDF text |
| 20 | Assessed by | AssBy | Text | 1 | Parsed from PDF text |
| 21 | Witnessed By | Witness | Text | 1 | Parsed from PDF text |
| 22 | Assessed Date | AssessmentDate | Date/Text | 1 | Parsed from PDF text |
| 23 | us | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 24 | Eligible for FDP | Eligibility | Text | 1 | Parsed from PDF text |
| 25 | Forklift FDP No. | FLicNo | Number/Text | 1 | Parsed from PDF text |
| 26 | Type of FDP | Type2 | Choice/Text | 1 | Parsed from PDF text |
| 27 | Validation Date | ValDate | Date/Text | 1 | Parsed from PDF text |
| 28 | Name | AssName | Person/Text | 1 | Parsed from PDF text |
| 29 | Designation | AssDesg | Text | 1 | Parsed from PDF text |
| 30 | Date | AssDate | Date/Text | 1 | Parsed from PDF text |
| 31 | Remark | AssRem | Multiline Text | 1 | Parsed from PDF text |
| 32 | Discarded by | WDBy | Text | 1 | Parsed from PDF text |
| 33 | Discarded on | WDDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 35 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 36 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 37 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 38 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 39 | Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 40 | Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 41 | Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 42 | PIC | PIC | Person/Text | 1 | Parsed from PDF text |
| 43 | Defcc | Defcc | Text | 1 | Parsed from PDF text |
| 44 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 45 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 46 | Running Number | Year; Month; INO | Text | 1 | Parsed from PDF text |
| 47 | Pass | Pass | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | hod (2), status (1), ca (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_LOG`
FormCode: `TANKCONTWEEK`
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
| MASTER-189-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-189-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-189-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 47 |
| Workflow Signal Count | 4 |
| Notes | - |
