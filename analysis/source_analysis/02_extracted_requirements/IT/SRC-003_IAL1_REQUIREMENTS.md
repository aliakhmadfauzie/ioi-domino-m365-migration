# Form Requirement — IT Activity Log 1 (IAL1)

> **Source ID**: SRC-003
> **Analysis Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Base**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL1.pdf` (151 KB), `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-003 | Clearly Found |
| Department | IT | Clearly Found |
| Form Name | IT Activity Log 1 — Data Restoration | Clearly Found |
| Domino Form Name | DataRestorationV1 | Clearly Found |
| Source File | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL1.pdf` | Clearly Found |
| PDF Size | 151 KB | Clearly Found |
| Est. Visible Fields | ~16 | Inferred |
| Form Purpose | Log data restoration activities with review/approval | Clearly Found |
| Single or Multi-Form | Single form | Clearly Found |
| Related Forms | IAL2 (Server Reboot), IAL3 (ISG Events), IAL4 (Data Center), IAL5 (Server Records) — same Domino form template variants | Clearly Found |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence |
|---|---|---|---|---|---|---|
| 1 | Activity Entry | Requester | Log data restoration activity details, requester, date, system | Always visible | IT Staff | Clearly Found |
| 2 | Activity Details | Information | Description of restoration, affected systems, outcome | Always visible | IT Staff | Clearly Found |
| 3 | Review / Approval | Approver | Reviewer sign-off on restoration activity | After entry submitted | Reviewer/Approver | Inferred |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| IAL1-001 | Entry | Date | `activityDate` | Date | Inferred | — | — | Header | No | Clearly Found | |
| IAL1-002 | Entry | Time | `activityTime` | Text | Inferred | — | — | Header | No | Clearly Found | |
| IAL1-003 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | — | Header | No | Clearly Found | |
| IAL1-004 | Entry | System / Server | `systemName` | Text | Inferred | — | — | Header | No | Clearly Found | |
| IAL1-005 | Entry | Activity Type | `activityType` | Choice | Inferred | — | Unknown | Header | No | Clearly Found | Data Restoration specific |
| IAL1-006 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | — | Header | No | Inferred | |
| IAL1-007 | Details | Description | `description` | Multiline Text | Inferred | — | — | Information | No | Clearly Found | |
| IAL1-008 | Details | Source of Data | `dataSource` | Text | Inferred | — | — | Information | No | Clearly Found | Backup location |
| IAL1-009 | Details | Restoration Target | `restorationTarget` | Text | Inferred | — | — | Information | No | Clearly Found | |
| IAL1-010 | Details | Data Size | `dataSize` | Text | Optional (Inferred) | — | — | Information | No | Inferred | |
| IAL1-011 | Details | Start Time | `startTime` | Text | Inferred | — | — | Information | No | Clearly Found | |
| IAL1-012 | Details | End Time | `endTime` | Text | Inferred | — | — | Information | No | Clearly Found | |
| IAL1-013 | Details | Outcome / Status | `outcome` | Choice | Inferred | — | Unknown | Information | No | Clearly Found | Success, Failed, Partial |
| IAL1-014 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | — | Approval | No | Clearly Found | |
| IAL1-015 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | — | Approval | No | Clearly Found | |
| IAL1-016 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Clearly Found | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Activity Type | Unknown | PDF analysis — dropdown not visible | — | Unknown |
| Outcome / Status | Unknown | PDF analysis — likely Success/Failed/Partial | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Confidence |
|---|---|---|---|
| System / Server | Must not be empty | Inferred from IT log practice | Inferred |
| Description | Must not be empty | Inferred from activity log practice | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Activity Entry | All | IT Staff (requester) | — | Always visible during create | Inferred | Inferred |
| Activity Details | All | IT Staff (requester) | — | Always visible | Inferred | Inferred |
| Review Section | Reviewer, Admin | Reviewer | Requester (after submit) | After entry submitted | Signature block present | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Inferred | Inferred |
| Approval Type | Single-stage review | Inferred |

### Workflow Stages

| Stage | Role/Approver | Routing Rule | Status Value | Evidence | Confidence |
|---|---|---|---|---|---|
| Entry | IT Staff | Create activity log | Draft / Entry | PDF section: Activity Entry | Clearly Found |
| Submitted | IT Staff → Reviewer | Submit for review | Submitted | Inferred from workflow pattern | Inferred |
| Reviewed | Reviewer | Review and sign off | Reviewed / Completed | Signature block with "Reviewed By" and "Review Date" | Inferred |

**Evidence Note**: The IAL1 PDF has a review section with "Reviewed By" and "Review Date" fields, but no explicit routing instructions or multi-stage approval flow were found. Approval is classified as Inferred because the signature block suggests review but does not prove a formal approval routing mechanism.

### Status Values

| Status Value | Description | Evidence | Confidence |
|---|---|---|---|
| Draft | Entry in progress | Inferred | Inferred |
| Submitted | Entry submitted for review | Inferred | Inferred |
| Reviewed | Entry reviewed by approver | Signature block evidence | Inferred |

## 8. Notifications

| Trigger | Recipient | Message/Purpose | Evidence | Confidence |
|---|---|---|---|---|
| None visible | — | No notification evidence in PDF | — | Unknown |

## 9. SharePoint Design Recommendation

| Attribute | Value | Confidence |
|---|---|---|
| Recommended List | `MainDB_IT` (single list — no repeating items) | Clearly Found |
| Parent-Child Design | No — flat form | Clearly Found |

### List Columns (MainDB_IT)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | Auto-generated or system name |
| FormCode | Choice | Yes | IAL1 | — | — | Discriminator |
| ial1ActivityDate | Date | Inferred | — | — | — | |
| ial1ActivityTime | Single line of text | Inferred | — | — | — | |
| ial1PerformedBy | Person | Inferred | — | — | Yes | |
| ial1SystemName | Single line of text | Inferred | — | — | — | |
| ial1ActivityType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial1ReferenceNo | Single line of text | No | — | — | — | |
| ial1Description | Multiple lines of text | Inferred | — | — | — | |
| ial1DataSource | Single line of text | Inferred | — | — | — | |
| ial1RestorationTarget | Single line of text | Inferred | — | — | — | |
| ial1DataSize | Single line of text | No | — | — | — | |
| ial1StartTime | Single line of text | Inferred | — | — | — | |
| ial1EndTime | Single line of text | Inferred | — | — | — | |
| ial1Outcome | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial1ReviewedBy | Person | No | — | — | Yes | |
| ial1ReviewDate | Date | No | — | — | — | |
| ial1ReviewComments | Multiple lines of text | No | — | — | — | |
| ial1CurrentStatus | Choice | Yes | Draft; Submitted; Reviewed | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New | Activity Entry | Text inputs, People picker, Date picker | DynamicFormRenderer | Date, System, Description required | Always | MainDB_IT | |
| New | Activity Details | Text inputs, Multiline text, Dropdown for Outcome | DynamicFormRenderer | Outcome required on submit | Always | MainDB_IT | |
| Detail | Review | Read-only display + Review button (if reviewer) | ApprovalPanel | Review Comments optional | Visible after submit, editable by reviewer | MainDB_IT | Only editable if current user is assigned reviewer |
| List | All | Gallery / Data table | ListView | — | — | MainDB_IT | Filter by FormCode=IAL1 |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| Is approval review mandatory or optional for IAL1? | Workflow | High | Affects whether status stays at Submitted or requires Review action | IT Manager |
| What are the exact Activity Type choices? | Field Choices | Medium | Affects categorization and dropdown options | IT Team |
| What are the exact Outcome choices? | Field Choices | Medium | Affects status tracking | IT Team |
| How is the reviewer assigned — automatic route or manual selection? | Workflow Routing | High | Affects Power Automate flow design | IT Manager |
| Should IAL1-5 forms share the same SharePoint list with FormCode differentiation? | SharePoint Design | Medium | Affects list architecture — MainDB_IT with FormCode=IAL1, IAL2, etc. | SharePoint Architect |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with workflow and choice confirmations |
| Needs Human Confirmation | Yes — approval requirement, reviewer assignment, choice values |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
