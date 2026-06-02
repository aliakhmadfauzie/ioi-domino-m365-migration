# Form Requirement - HR Information / Notice (HEALTHINFO)

> Source ID: SRC-HR-014 | Department: HR | Promoted: 2026-06-02 | Quality: 86/100
> Evidence: PyMuPDF direct text from `PRAI_SITE_FORM/HR/HEALTHINFO.pdf` (2 pages, 369 chars)
> Promotion: Promote with Human Confirmation - compact extract; form purpose and status semantics need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-014 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | HR Information / Notice | Inferred from title/body labels |
| Form Purpose | Publish HR information/notice content to recipients, with attachment, status updates, and viewed counter tracking. | Inferred |
| Pages | 2 | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Information Header | 1 | Notice details | Title, Category, Send, Subject |
| Information Body | 1 | Content | Body, Att, Ext |
| Status Updates | 1 | Tracking | Update, Status |
| View Details | 1 | Tracking | Viewed, CtrLst |
| Hidden Fields | 1-2 | System/routing | Author, DateSent, Lock, Lock2, CurrentAction, ISADMIN |

## 3. Field Requirements

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Title | `Title` | Text | Clearly Found |
| Category | `Category` | Choice | Clearly Found, values need confirmation |
| To | `Send` | People/Group | Clearly Found |
| Subject | `Subject` | Text | Clearly Found |
| Description | `Body` | Rich text/Multiline | Clearly Found |
| Attachment | `Att` | Attachment | Clearly Found |
| Phone Ext. No. | `Ext` | Text | Clearly Found |
| Status Updates | `Update` | Multiline | Clearly Found |
| Status | `Status` | Choice/Status | Clearly Found |
| Viewed counter/details | `Viewed`, `CtrLst` | Number/Text | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | No approval visible in extracted text | Inferred |
| Workflow Evidence | CurrentAction exists; no approval/endorsement/rejection section appears | Clearly Found |
| CurrentAction Field | `CurrentAction` | Clearly Found |
| State Values | Unknown | Needs Human Confirmation |

## 5. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `HEALTHINFO`
Recommended storage: parent/extension fields for notice content and status; no child-table structures detected.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| HEALTHINFO-01 | Confirm this is a notice/information-only form with no approval workflow. | High |
| HEALTHINFO-02 | What are valid `Status` and `CurrentAction` values? | Medium |
| HEALTHINFO-03 | Who can publish, update, and archive notices? | Medium |
| HEALTHINFO-04 | Should view counters/readers be migrated or reset during M365 migration? | Low |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with status/publishing confirmation |
| Approval Required | Not visible / likely no approval |
| Promotion Quality | 86/100 |

