# Master App PDF Source - PanCen - OFI Request

> Master row: 80 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 80 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | PanCen - OFI Request | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| PCNSVR | Source inventory |
| Form List | Initiator - Form \| OFIRequest - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | OFI | Source inventory or inferred |
| Build Readiness | review_required | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/023_oleObject127.pdf | Extracted embedded PDF | sheet_order_fallback | 0.200 | Explicit mapping | 2 | 474 | 2 | 2 | Food Safety Questionnaire Survey |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/046_oleObject150.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 5 | 2219 | 50 | 8 | PANCEN |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Enter Survey | Inferred from PDF text | Needs Human Confirmation |
| 2 | Details :- | Inferred from PDF text | Needs Human Confirmation |
| 3 | Pancen | Inferred from PDF text | Needs Human Confirmation |
| 4 | Opportunity For Improvement Request (OFI Request) | Inferred from PDF text | Needs Human Confirmation |
| 5 | OFI Request | Inferred from PDF text | Needs Human Confirmation |
| 6 | : Cc1 | Inferred from PDF text | Needs Human Confirmation |
| 7 | : Cc2 | Inferred from PDF text | Needs Human Confirmation |
| 8 | : Cc3 | Inferred from PDF text | Needs Human Confirmation |
| 9 | : Cpa_1 | Inferred from PDF text | Needs Human Confirmation |
| 10 | Preventive Action Request Form: PARLink | Inferred from PDF text | Needs Human Confirmation |
| 11 | [To Be Withdrawn By Qa Hod] | Inferred from PDF text | Needs Human Confirmation |
| 12 | Withdrawn section: | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Initiator | Ini | Text | 1 | Parsed from PDF text |
| 2 | Recipient | Rec | Text | 1 | Parsed from PDF text |
| 3 | OFI No. | Year; Month; INO | Number/Text | 1 | Parsed from PDF text |
| 4 | Date Issued | DateSent | Date/Text | 1 | Parsed from PDF text |
| 5 | OFI No. | OFINo | Number/Text | 1 | Parsed from PDF text |
| 6 | Date Issued | Disp_Datesent | Date/Text | 1 | Parsed from PDF text |
| 7 | Initiator | Requestor1 | Person/Text | 1 | Parsed from PDF text |
| 8 | Location (Intiator) | Location1 | Text | 1 | Parsed from PDF text |
| 9 | Recipient | Recipient1; NoIdRecipient1 | Text | 1 | Parsed from PDF text |
| 10 | Location (Recipient) | Location2 | Text | 1 | Parsed from PDF text |
| 11 | CC | CC1 | Text | 1 | Parsed from PDF text |
| 12 | Response required by | DueDate | Date/Text | 1 | Parsed from PDF text |
| 13 | Next Reminder Date | RespondBy | Date/Text | 1 | Parsed from PDF text |
| 14 | OFI Description | OFIDesc | Multiline Text | 1 | Parsed from PDF text |
| 15 | Attachment | Attachment | Text | 1 | Parsed from PDF text |
| 16 | Suggestion | Suggestion | Text | 1 | Parsed from PDF text |
| 17 | Date Replied | DateReplySent | Date/Text | 1 | Parsed from PDF text |
| 18 | CC | CC2 | Text | 1 | Parsed from PDF text |
| 19 | Div/Dept Head | DeptHead | Text | 1 | Parsed from PDF text |
| 20 | Attachment | Attachment_1 | Text | 1 | Parsed from PDF text |
| 21 | Date | DateReviewed | Date/Text | 1 | Parsed from PDF text |
| 22 | CC | CC3 | Text | 1 | Parsed from PDF text |
| 23 | Acceptance | CPA_1 | Text | 1 | Parsed from PDF text |
| 24 | Attachment | attach_1 | Text | 1 | Parsed from PDF text |
| 25 | New date to be reviewed | NewDateReview | Date/Text | 1 | Parsed from PDF text |
| 26 | Other comments | QAComm | Multiline Text | 1 | Parsed from PDF text |
| 27 | If yes, which workstations | Workstations | Text | 1 | Parsed from PDF text |
| 28 | Preventive Action Request Form | PARLink | Text | 1 | Parsed from PDF text |
| 29 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 30 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 31 | Attachment | WDAttach | Text | 1 | Parsed from PDF text |
| 32 | Remarks | WDrawnCom | Multiline Text | 1 | Parsed from PDF text |
| 33 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 34 | Initiator | Authors | Text | 1 | Parsed from PDF text |
| 35 | Created On | CDate | Date/Text | 1 | Parsed from PDF text |
| 36 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 37 | ISG Admin | ISAdmin | Text | 1 | Parsed from PDF text |
| 38 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 39 | Quality Council Member | QCMember | Text | 1 | Parsed from PDF text |
| 40 | Def CC Mailing List | CC | Text | 1 | Parsed from PDF text |
| 41 | Quality Council members | QualityCouncil | Text | 1 | Parsed from PDF text |
| 42 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 43 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 44 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 45 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 46 | Mailing List 1 | FirstMail | Text | 1 | Parsed from PDF text |
| 47 | Mailing List 2 | SecondMail | Text | 1 | Parsed from PDF text |
| 48 | Mailing List 3 | ThirdMail | Text | 1 | Parsed from PDF text |
| 49 | QA Mailing List | QA | Text | 1 | Parsed from PDF text |
| 50 | Sent to Rejected DB | SendTo | Date/Text | 1 | Parsed from PDF text |
| 51 | No. of reply | No_Reply | Number/Text | 1 | Parsed from PDF text |
| 52 | Date to hide the Feedback | HideDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | currentaction (3), reviewed (2), ca (1), review (1), hod (1), status (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `OFI`
Child-list recommendation: `MainDB_QA_Ext_OFI_Rows` candidate for repeating row fields

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
| MASTER-080-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-080-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-080-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 2 |
| Parsed Field Count | 52 |
| Workflow Signal Count | 10 |
| Notes | - |
