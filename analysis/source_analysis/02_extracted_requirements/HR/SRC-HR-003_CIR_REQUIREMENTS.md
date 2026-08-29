# Form Requirement — Cafeteria Inspection (CIR)

> **Source ID**: SRC-HR-003 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 100/100
> **Evidence**: PyMuPDF direct text extraction from `PRAI_SITE_FORM/HR/CIR.pdf` (2 pages, 620 chars)
> **Promotion**: ✅ Direct promotion — zero blockers

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-003 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "Cafeteria Inspection" | Clearly Found |
| Form Purpose | Log cafeteria inspection results with team members, inspector, and corrective action review | Clearly Found |
| Pages | 2 | Clearly Found |

## 2. Source Evidence Summary

| Evidence | Source |
|---|---|
| Raw text extraction | `11_pdf_extraction_layer/raw_text/CIR_page1.txt`, `CIR_page2.txt` |
| Page inventory | `11_pdf_extraction_layer/page_inventory/SRC-HR-003_CIR_page_inventory.md` |
| Visual notes | `11_pdf_extraction_layer/visual_notes/SRC-HR-003_CIR_visual_notes.md` |
| Workflow candidates | `11_pdf_extraction_layer/workflow_candidates/SRC-HR-003_CIR_workflow_candidates.md` |

## 3. Form Sections

| Section | Page | Type | Key Fields |
|---|---|---|---|
| Initiator Section | 1 | Requester | Site, TeamMembers, Inspector, InsDate, InsTime, SubmittedBy, SubmittedDate |
| Corrective Action Review | 1 | Review | ReviewedBy, ReviewedDate, Remarks, Status |
| Hidden Fields | 2 | System | DocAuthor, CDate, CurrentAction, Editor1, Editor2, Editors, INO, IT, ACMComm, ECMComm |

## 4. Field Requirements

| # | PDF Label | Domino Field | Section | Type | Required | Choices | Page | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | No. | `Num` | Initiator | Text | Inferred | — | 1 | Clearly Found |
| 2 | Site | `Site` | Initiator | Text | Inferred | Unknown | 1 | Clearly Found |
| 3 | Team Members | `TeamMembers` | Initiator | Person | Inferred | — | 1 | Clearly Found |
| 4 | Inspector | `Inspector` | Initiator | Person | Inferred | — | 1 | Clearly Found |
| 5 | Inspection Date | `InsDate` | Initiator | Date | Inferred | — | 1 | Clearly Found |
| 6 | Inspection Time | `InsTime` | Initiator | Text | Inferred | — | 1 | Clearly Found |
| 7 | Submitted By | `SubmittedBy` | Initiator | Person | Inferred | — | 1 | Clearly Found |
| 8 | Submitted Date | `SubmittedDate` | Initiator | Date | Inferred | — | 1 | Clearly Found |
| 9 | Reviewed By | `ReviewedBy` | Review | Person | Optional | — | 1 | Clearly Found |
| 10 | Reviewed Date | `ReviewedDate` | Review | Date | Optional | — | 1 | Clearly Found |
| 11 | Remarks | `Remarks` | Review | Multiline | No | — | 1 | Clearly Found |
| 12 | Status | `Status` | Review | Choice | Inferred | Unknown | 1 | Clearly Found |
| 13 | Created by | `DocAuthor` | Hidden | Person | System | — | 2 | Clearly Found |
| 14 | Created on | `CDate` | Hidden | Date | System | — | 2 | Clearly Found |
| 15 | Current Action | `CurrentAction` | Hidden | Choice | System | Unknown | 2 | Clearly Found |
| 16 | Editor 1 | `Editor1` | Hidden | Person | System | — | 2 | Clearly Found |
| 17 | Editor 2 | `Editor2` | Hidden | Person | System | — | 2 | Clearly Found |
| 18 | Editors | `Editors` | Hidden | Person | System | — | 2 | Clearly Found |
| 19 | INO | `INO` | Hidden | Text | System | — | 2 | Clearly Found |
| 20 | IT | `IT` | Hidden | Text | System | — | 2 | Clearly Found |
| 21 | Committee Members (ACM) | `ACMComm` | Hidden | Text | System | — | 2 | Clearly Found |
| 22 | Committee Members (ECM) | `ECMComm` | Hidden | Text | System | — | 2 | Clearly Found |

## 5. Choice Fields

| Field | Choices Found | Confidence |
|---|---|---|
| Site | Unknown | Unknown |
| Status | Unknown | Unknown |
| CurrentAction | Unknown | Unknown |

## 6. Validation Rules

None visible in PDF text.

## 7. Repeating Tables

None — single inspection record per form.

## 8. Attachments

None visible.

## 9. Role and Visibility Rules

| Section | Visible To | Editable By | Evidence |
|---|---|---|---|
| Initiator Section | All | Inspector/Requester | "Initiator Section" label |
| Corrective Action Review | Reviewer, Admin | Reviewer | "Corrective Action Review" section with ReviewedBy |

## 10. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | **Not Required** | Clearly Found |
| Review Mechanism | Corrective Action Review (ReviewedBy + ReviewedDate) | Clearly Found |

**Evidence**: No approval sections, no APPROVE/REJECT, no signature blocks. `CurrentAction` is present but is a standard Domino field — without additional approval signals it does not constitute workflow evidence. The "Corrective Action Review" section with ReviewedBy/ReviewedDate suggests a review mechanism, not formal approval.

## 11. Status Values

| Field | Values | Confidence |
|---|---|---|
| Status | Unknown — not in PDF text | Unknown |
| CurrentAction | Unknown — not in PDF text | Unknown |

## 12. SharePoint Design Recommendation

**List**: `MainDB_HR` (single list, no child lists)
**FormCode**: `CIR`
**Columns**: 22 fields mapped from Domino

| Column | Type | Required | Notes |
|---|---|---|---|
| Title | Single line | Yes | Use `Num` (inspection number) |
| FormCode | Choice | Yes | CIR |
| cirSite | Choice | Inferred | Needs human confirmation |
| cirTeamMembers | Person | Inferred | Multi-person |
| cirInspector | Person | Inferred | |
| cirInsDate | Date | Inferred | |
| cirInsTime | Single line | Inferred | |
| cirSubmittedBy | Person | Inferred | |
| cirSubmittedDate | Date | Inferred | |
| cirReviewedBy | Person | No | |
| cirReviewedDate | Date | No | |
| cirRemarks | Multiline | No | |
| cirStatus | Choice | Inferred | Needs human confirmation |
| cirCurrentAction | Choice | System | Needs human confirmation |

## 13. Power Apps Build Recommendation

**Screens**: New Inspection, List, Detail (with Review section)
**Controls**: DynamicFormRenderer, text inputs, people pickers, date pickers
**Visibility**: Review section visible after submit, editable by reviewer

## 14. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| 1 | What are the Site choice values? | Medium |
| 2 | What are the Status choice values? | Medium |
| 3 | Is the Corrective Action Review mandatory? | Medium |

## 15. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | ✅ Yes |
| Approval Required | ❌ Not Required |
| Promotion Quality | 100/100 |
