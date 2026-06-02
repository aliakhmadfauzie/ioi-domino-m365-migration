# Form Requirement — IT Activity Log 2 (IAL2 — Server Reboot)

> **Source ID**: SRC-004
> **Analysis Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Base**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL2.pdf` (150 KB), `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`
> **Evidence Quality**: ⚠️ Direct PDF viewing not available. Field labels derived from IAL2-specific analysis (`pdf-ui-inventory.md` describes "Server Reboot form") and the shared `DataRestorationV1` Domino template structure (same as IAL1). All field labels marked Inferred unless confirmed by named analysis source.

## 1. Basic Information

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Source ID | SRC-004 | Clearly Found | `PDF_FORM_INVENTORY.md` |
| Department | IT | Clearly Found | File path: `PRAI_SITE_FORM/IT/` |
| Form Name | IT Activity Log 2 — Server Reboot | Clearly Found | `pdf-ui-inventory.md` ("Server Reboot form") |
| Domino Form Name | DataRestorationV1 | Clearly Found | `pdf-ui-inventory.md` |
| Source File | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL2.pdf` | Clearly Found | Filesystem |
| PDF Size | 150 KB | Clearly Found | `pdf-ui-inventory.md` |
| Est. Visible Fields | ~16 | Inferred | `pdf-ui-inventory.md` (same template as IAL1) |
| Form Purpose | Log server reboot activities with review/sign-off | Clearly Found | `pdf-ui-inventory.md` ("Server Reboot form") |
| Single or Multi-Form | Single form | Clearly Found | PDF naming convention |
| Related Forms | IAL1 (Data Restoration), IAL3 (ISG Events), IAL4 (Data Center), IAL5 (Server Records) — all share `DataRestorationV1` template | Clearly Found | `pdf-ui-inventory.md` |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence | Evidence Source |
|---|---|---|---|---|---|---|---|
| 1 | Activity Entry | Requester | Log server reboot details — requester, date, server, reboot type | Always visible | IT Staff | Inferred | Same template as IAL1 (`pdf-ui-inventory.md`) |
| 2 | Activity Details | Information | Description of reboot, affected systems, start/end time, outcome | Always visible | IT Staff | Inferred | Same template as IAL1 |
| 3 | Review / Approval | Approver | Reviewer sign-off on reboot activity | After entry submitted | Reviewer/Approver | Inferred | `pdf-ui-inventory.md` marks IAL2 as workflow ✅ |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Evidence Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IAL2-001 | Entry | Date | `activityDate` | Date | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL2-002 | Entry | Time | `activityTime` | Text | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL2-003 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL2-004 | Entry | Server / Hostname | `serverName` | Text | Inferred | — | — | Header | No | Inferred | Same template; Server Reboot variant | Server reboot target |
| IAL2-005 | Entry | Activity Type | `activityType` | Choice | Inferred | — | Unknown | Header | No | Inferred | Same template as IAL1 | Server Reboot specific |
| IAL2-006 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL2-007 | Details | Description / Reason | `description` | Multiline Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | Reboot reason |
| IAL2-008 | Details | Affected Systems | `affectedSystems` | Text | Inferred | — | — | Information | No | Inferred | Server Reboot variant | |
| IAL2-009 | Details | Reboot Type | `rebootType` | Choice | Inferred | — | Unknown | Information | No | Inferred | Server Reboot variant | Scheduled, Emergency, etc. |
| IAL2-010 | Details | Start Time | `startTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL2-011 | Details | End Time | `endTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL2-012 | Details | Outcome / Status | `outcome` | Choice | Inferred | — | Unknown | Information | No | Inferred | Same template as IAL1 | Success, Failed, Partial |
| IAL2-013 | Details | Downtime Duration | `downtimeDuration` | Text | Optional (Inferred) | — | — | Information | No | Inferred | Server Reboot variant | |
| IAL2-014 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | — | Approval | No | Inferred | `pdf-ui-inventory.md` workflow ✅ | |
| IAL2-015 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |
| IAL2-016 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Activity Type | Unknown | Not visible in intermediate analysis | — | Unknown |
| Reboot Type | Unknown | Not documented in intermediate analysis | — | Unknown |
| Outcome / Status | Unknown | Not documented in intermediate analysis | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|
| Server / Hostname | Must not be empty | Inferred from IT log practice | Same template as IAL1 | Inferred |
| Description / Reason | Must not be empty | Inferred from activity log practice | Same template as IAL1 | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|---|
| Activity Entry | All | IT Staff (requester) | — | Always visible during create | Inferred | Same template as IAL1 | Inferred |
| Activity Details | All | IT Staff (requester) | — | Always visible | Inferred | Same template as IAL1 | Inferred |
| Review Section | Reviewer, Admin | Reviewer | Requester (after submit) | After entry submitted | Inferred | `pdf-ui-inventory.md` workflow ✅ | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Approval Required | Inferred | Inferred | `pdf-ui-inventory.md` marks IAL2 workflow ✅ but no routing details |
| Approval Type | Single-stage review | Inferred | Same template as IAL1 |

### Workflow Stages

| Stage | Role/Approver | Routing Rule | Status Value | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|
| Entry | IT Staff | Create activity log | Draft / Entry | Inferred | Same template as IAL1 | Inferred |
| Submitted | IT Staff → Reviewer | Submit for review | Submitted | Inferred | Same template as IAL1 | Inferred |
| Reviewed | Reviewer | Review and sign off | Reviewed / Completed | Inferred | `pdf-ui-inventory.md` workflow ✅; signature pattern from template | Inferred |

**Evidence Note**: The `pdf-ui-inventory.md` marks IAL2 with workflow ✅ and describes it as "Server Reboot form." The exact routing mechanism (who is the reviewer, how assigned) is not documented. Following the Batch 001 pattern, approval is classified as Inferred based on the template structure.

### Status Values

| Status Value | Description | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|
| Draft | Entry in progress | Inferred | Same template as IAL1 | Inferred |
| Submitted | Entry submitted for review | Inferred | Same template as IAL1 | Inferred |
| Reviewed | Entry reviewed by approver | Inferred | Same template as IAL1 | Inferred |

## 8. Notifications

| Trigger | Recipient | Message/Purpose | Evidence | Confidence |
|---|---|---|---|---|
| None visible | — | No notification evidence in intermediate analysis | — | Unknown |

## 9. SharePoint Design Recommendation

| Attribute | Value | Evidence Source | Confidence |
|---|---|---|---|
| Recommended List | `MainDB_IT` (single list — no repeating items) | Same template as IAL1 | Clearly Found |
| Parent-Child Design | No — flat form | Same template structure | Clearly Found |

### List Columns (MainDB_IT)

| Column Name | Column Type | Required | Choice Values | Lookup Target | Person Field | Notes |
|---|---|---|---|---|---|---|
| Title | Single line of text | Yes | — | — | — | Auto-generated or server name |
| FormCode | Choice | Yes | IAL2 | — | — | Discriminator |
| ial2ActivityDate | Date | Inferred | — | — | — | |
| ial2ActivityTime | Single line of text | Inferred | — | — | — | |
| ial2PerformedBy | Person | Inferred | — | — | Yes | |
| ial2ServerName | Single line of text | Inferred | — | — | — | |
| ial2ActivityType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial2ReferenceNo | Single line of text | No | — | — | — | |
| ial2Description | Multiple lines of text | Inferred | — | — | — | |
| ial2AffectedSystems | Single line of text | Inferred | — | — | — | |
| ial2RebootType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial2StartTime | Single line of text | Inferred | — | — | — | |
| ial2EndTime | Single line of text | Inferred | — | — | — | |
| ial2Outcome | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial2DowntimeDuration | Single line of text | No | — | — | — | |
| ial2ReviewedBy | Person | No | — | — | Yes | |
| ial2ReviewDate | Date | No | — | — | — | |
| ial2ReviewComments | Multiple lines of text | No | — | — | — | |
| ial2CurrentStatus | Choice | Yes | Draft; Submitted; Reviewed | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New | Activity Entry | Text inputs, People picker, Date picker | DynamicFormRenderer | Date, Server, Description required | Always | MainDB_IT | |
| New | Activity Details | Text inputs, Multiline text, Dropdowns | DynamicFormRenderer | Outcome required on submit | Always | MainDB_IT | |
| Detail | Review | Read-only display + Review button (if reviewer) | ApprovalPanel | Review Comments optional | Visible after submit, editable by reviewer | MainDB_IT | Only editable if current user is assigned reviewer |
| List | All | Gallery / Data table | ListView | — | — | MainDB_IT | Filter by FormCode=IAL2 |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| Is approval review mandatory or optional for IAL2? | Workflow | High | Affects whether status stays at Submitted or requires Review action | IT Manager |
| What are the exact Activity Type choices for Server Reboot? | Field Choices | Medium | Affects categorization | IT Team |
| What are the exact Reboot Type choices (Scheduled, Emergency, etc.)? | Field Choices | Medium | Affects SLA tracking | IT Team |
| What are the exact Outcome choices? | Field Choices | Medium | Affects status tracking | IT Team |
| How is the reviewer assigned? | Workflow Routing | High | Affects Power Automate flow design | IT Manager |
| Should IAL1-5 share the same SharePoint list with FormCode differentiation? | SharePoint Design | Medium | Affects list architecture | SharePoint Architect |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with workflow and choice confirmations |
| Needs Human Confirmation | Yes — approval requirement, reviewer assignment, choice values |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
