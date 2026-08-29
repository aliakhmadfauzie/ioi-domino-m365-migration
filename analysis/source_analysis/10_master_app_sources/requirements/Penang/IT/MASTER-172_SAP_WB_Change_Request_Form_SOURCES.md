# Master App PDF Source - SAP & WB Change Request Form

> Master row: 172 | Site: Penang | Owner: IT | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 172 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SAP & WB Change Request Form | Clearly Found |
| Owner | IT | Clearly Found |
| Department | IT | Source inventory |
| Form List | ChangeFormV3 - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SAPWBCHAN | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/IT/020_oleObject141.pdf | Extracted embedded PDF | text_match_high | 0.757 | Explicit mapping | 4 | 2822 | 61 | 5 | SAP & WB CHANGE REQUEST |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | SAP & WB CHANGE REQUEST | Inferred from PDF text | Needs Human Confirmation |
| 2 | Change Request No: ChgReqNo | Inferred from PDF text | Needs Human Confirmation |
| 3 | SECTION A : INITIATION | Inferred from PDF text | Needs Human Confirmation |
| 4 | SECTION B : PRIORITY | Inferred from PDF text | Needs Human Confirmation |
| 5 | SECTION C : DETAILED DESCRIPTION OF PROPOSED CHANGE & REASON FOR CHANGE | Inferred from PDF text | Needs Human Confirmation |
| 6 | Reported By | Inferred from PDF text | Needs Human Confirmation |
| 7 | SAP CHANGE REQUEST FORM | Inferred from PDF text | Needs Human Confirmation |
| 8 | Changes In Standard Sap | Inferred from PDF text | Needs Human Confirmation |
| 9 | Describe in details on how the | Inferred from PDF text | Needs Human Confirmation |
| 10 | SECTION D : BUSINESS PROCESS OWNER's ACCEPTANCE | Inferred from PDF text | Needs Human Confirmation |
| 11 | SECTION E : PROJECT MANAGER's ACCEPTANCE | Inferred from PDF text | Needs Human Confirmation |
| 12 | SECTION : SAP Standard details (to be filled by Ms. Khor/Clare) | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Change Request No | ChgReqNo | Text | 1 | Parsed from PDF text |
| 2 | SECTION A | INITIATION | Text | 1 | Parsed from PDF text |
| 3 | Project phase | ProjectPhase | Text | 1 | Parsed from PDF text |
| 4 | Plant | All | Text | 1 | Parsed from PDF text |
| 5 | SECTION B | PRIORITY | Text | 1 | Parsed from PDF text |
| 6 | Attachment | Att_C | Text | 1 | Parsed from PDF text |
| 7 | CC (Main/Backup person) | CCNameList | Person/Text | 1 | Parsed from PDF text |
| 8 | SAP | SAPChange | Text | 1 | Parsed from PDF text |
| 9 | Program ID | PrgID | Text | 1 | Parsed from PDF text |
| 10 | Type | PrgType | Choice/Text | 1 | Parsed from PDF text |
| 11 | Object Name | ObjectName | Person/Text | 1 | Parsed from PDF text |
| 12 | Program/Source code affected | Code1 | Text | 1 | Parsed from PDF text |
| 13 | amendment | Code2 | Text | 1 | Parsed from PDF text |
| 14 | amendment | Code3 | Text | 1 | Parsed from PDF text |
| 15 | Configuration affected | Config1 | Text | 1 | Parsed from PDF text |
| 16 | amendment | Config2 | Text | 1 | Parsed from PDF text |
| 17 | Configuration after amendment | Config3 | Text | 1 | Parsed from PDF text |
| 18 | changes been made | Desc | Text | 1 | Parsed from PDF text |
| 19 | Due Date | dtDueDate_F | Date/Text | 1 | Parsed from PDF text |
| 20 | CC | CCList | Text | 1 | Parsed from PDF text |
| 21 | Installation | InsNum | Text | 1 | Parsed from PDF text |
| 22 | Basis Release | BasisRelNum | Text | 1 | Parsed from PDF text |
| 23 | Registration Access Key | RegAccessKey | Text | 1 | Parsed from PDF text |
| 24 | Page 3 of 4 | CompBy | Text | 1 | Parsed from PDF text |
| 25 | Date Completed | DateComp | Date/Text | 1 | Parsed from PDF text |
| 26 | SECTION | ABAPER | Text | 1 | Parsed from PDF text |
| 27 | Transport Request | TRNumber2 | Text | 1 | Parsed from PDF text |
| 28 | Remarks | TRRemarks2 | Multiline Text | 1 | Parsed from PDF text |
| 29 | Completed By | CompletedBy2 | Text | 1 | Parsed from PDF text |
| 30 | Date Completed | DateCompleted2 | Date/Text | 1 | Parsed from PDF text |
| 31 | Attachment | TRAttachment2 | Text | 1 | Parsed from PDF text |
| 32 | ABAPER's Transport Request | ABAPTR | Text | 1 | Parsed from PDF text |
| 33 | Transport Number | TRNumber | Text | 1 | Parsed from PDF text |
| 34 | Remarks | TRRemarks | Multiline Text | 1 | Parsed from PDF text |
| 35 | Completed By | CompletedBy | Text | 1 | Parsed from PDF text |
| 36 | Date Completed | DateCompleted | Date/Text | 1 | Parsed from PDF text |
| 37 | Attachment | TRAttachment | Text | 1 | Parsed from PDF text |
| 38 | Comments | ResolutionComments | Multiline Text | 1 | Parsed from PDF text |
| 39 | Attachments | Att_G | Text | 1 | Parsed from PDF text |
| 40 | Status | DiscardStatus | Choice/Text | 1 | Parsed from PDF text |
| 41 | Discarded by | DiscardedBy | Text | 1 | Parsed from PDF text |
| 42 | Discarded Date | DiscardedDate | Date/Text | 1 | Parsed from PDF text |
| 43 | Doc Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 44 | Running numbers | Year; Month | Text | 1 | Parsed from PDF text |
| 45 | Current Action | CurrentAction | Text | 1 | Parsed from PDF text |
| 46 | ACM PM | ACMPM | Text | 1 | Parsed from PDF text |
| 47 | Page 4 of 4 | ABAP | Text | 1 | Parsed from PDF text |
| 48 | Editor - ABAP | ABAPEditor | Text | 1 | Parsed from PDF text |
| 49 | Editor 1 - Section A - C | AEditor1 | Text | 1 | Parsed from PDF text |
| 50 | Editor 2 - Section F | AEditor2 | Text | 1 | Parsed from PDF text |
| 51 | Editor 3 - Section G | AEditor3 | Text | 1 | Parsed from PDF text |
| 52 | Editor 4 - Section H | AEditor4 | Text | 1 | Parsed from PDF text |
| 53 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 54 | Mailing List A | MailA | Text | 1 | Parsed from PDF text |
| 55 | Mailing List B (with Assg To) | MailB | Text | 1 | Parsed from PDF text |
| 56 | Mailing list - completion | MailC | Text | 1 | Parsed from PDF text |
| 57 | Khor & Clare | SAPAdmin | Text | 1 | Parsed from PDF text |
| 58 | IS Mailing List | ISMails | Text | 1 | Parsed from PDF text |
| 59 | Transporter | Transporter | Text | 1 | Parsed from PDF text |
| 60 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 61 | ISCreator | ISCreator | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), currentaction (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_IT`
FormCode: `SAPWBCHAN`
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
| MASTER-172-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-172-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-172-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 61 |
| Workflow Signal Count | 5 |
| Notes | - |
