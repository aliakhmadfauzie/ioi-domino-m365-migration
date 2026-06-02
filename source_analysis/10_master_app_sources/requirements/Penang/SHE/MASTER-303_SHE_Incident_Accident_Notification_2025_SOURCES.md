# Master App PDF Source - SHE Incident/Accident Notification 2025

> Master row: 303 | Site: Penang | Owner: SHE | Generated: 2026-06-02
> Classification: Extracted

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 303 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | SHE Incident/Accident Notification 2025 | Clearly Found |
| Owner | SHE | Clearly Found |
| Department | SHE \| Critical App \| PHBSVR | Source inventory |
| Form List | IncForm - Form | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | SHEINCIACCI | Source inventory or inferred |
| Build Readiness | ready_for_build | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/SHE/016_oleObject165.pdf | Extracted embedded PDF | text_match_high | 1.000 | Explicit mapping | 7 | 4582 | 38 | 19 | IOI OLEOCHEMICAL INDUSTRIES BERHAD |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Ioi Oleochemical Industries Berhad | Inferred from PDF text | Needs Human Confirmation |
| 2 | She Incident/Accident Notification / Investigation Report | Inferred from PDF text | Needs Human Confirmation |
| 3 | 1. Incident/Accident Notification | Inferred from PDF text | Needs Human Confirmation |
| 4 | Details of Materials (Name/Batch) | Inferred from PDF text | Needs Human Confirmation |
| 5 | : Details | Inferred from PDF text | Needs Human Confirmation |
| 6 | 2. SHE SECTION | Inferred from PDF text | Needs Human Confirmation |
| 7 | 3. Investigation Report | Inferred from PDF text | Needs Human Confirmation |
| 8 | Division & Dept Head approval : nmInvesEndorsedE | Inferred from PDF text | Needs Human Confirmation |
| 9 | 4. REVIEW SECTION | Inferred from PDF text | Needs Human Confirmation |
| 10 | 5. SHE VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 11 | 6. IMPLEMENTATION VERIFICATION | Inferred from PDF text | Needs Human Confirmation |
| 12 | She-13/181207/02 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | * Send To | SendToAll | Date/Text | 1 | Parsed from PDF text |
| 2 | Materials Affected | MatAffect | Text | 1 | Parsed from PDF text |
| 3 | What Materials | Materials | Text | 1 | Parsed from PDF text |
| 4 | * Witness During Incident | txtIncWitness1E | Text | 1 | Parsed from PDF text |
| 5 | Remarks | SHERem | Multiline Text | 1 | Parsed from PDF text |
| 6 | Division & Dept Head approval | nmInvesEndorsedE | Text | 1 | Parsed from PDF text |
| 7 | Findings | Findings | Text | 1 | Parsed from PDF text |
| 8 | Reason for rejection | Comment1 | Multiline Text | 1 | Parsed from PDF text |
| 9 | AcceptanceStatus | txtAppStatus | Choice/Text | 1 | Parsed from PDF text |
| 10 | Log | HistoryLog | Text | 1 | Parsed from PDF text |
| 11 | Date Sent | SHEDate | Date/Text | 1 | Parsed from PDF text |
| 12 | Sent By | SHEUser | Text | 1 | Parsed from PDF text |
| 13 | Status | txtStatus3C | Choice/Text | 1 | Parsed from PDF text |
| 14 | Approved by | nmROSLIC | Person/Text | 1 | Parsed from PDF text |
| 15 | Date | dtDate3C | Date/Text | 1 | Parsed from PDF text |
| 16 | Comment | Comment3 | Multiline Text | 1 | Parsed from PDF text |
| 17 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 18 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 19 | Editor1 | Editor1 | Text | 1 | Parsed from PDF text |
| 20 | Editor2 | Editor2 | Text | 1 | Parsed from PDF text |
| 21 | Editor3 | Editor3 | Text | 1 | Parsed from PDF text |
| 22 | Editor4 | Editor4 | Text | 1 | Parsed from PDF text |
| 23 | Editor5 | Editor5 | Text | 1 | Parsed from PDF text |
| 24 | Editor6 | Editor6 | Text | 1 | Parsed from PDF text |
| 25 | Editor7 | Editor7 | Text | 1 | Parsed from PDF text |
| 26 | AllowAuthor | AllowEditor | Text | 1 | Parsed from PDF text |
| 27 | SHE Personnel | SHE | Text | 1 | Parsed from PDF text |
| 28 | SHE Personnel 2 | SHE2 | Text | 1 | Parsed from PDF text |
| 29 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 30 | CEO | CEO | Text | 1 | Parsed from PDF text |
| 31 | Mailing List 1 | MailingList1 | Text | 1 | Parsed from PDF text |
| 32 | Mailing List 3 | MailingList3 | Text | 1 | Parsed from PDF text |
| 33 | Mailing List4 | MailingList4 | Text | 1 | Parsed from PDF text |
| 34 | SHE Committee | SHECommittee | Text | 1 | Parsed from PDF text |
| 35 | InvesDeptHead | HOD | Person/Text | 1 | Parsed from PDF text |
| 36 | Reminder Cc | CcReminderHOD | Person/Text | 1 | Parsed from PDF text |
| 37 | SHE Recipients | SHERecipients | Text | 1 | Parsed from PDF text |
| 38 | All PICs | AllPIC | Person/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (4), approved (2), verification (2), verified (2), currentaction (2), hod (2), approval (1), rejected (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_SHE`
FormCode: `SHEINCIACCI`
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
| MASTER-303-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | Medium |
| MASTER-303-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-303-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted |
| PDF Count | 1 |
| Parsed Field Count | 38 |
| Workflow Signal Count | 19 |
| Notes | - |
