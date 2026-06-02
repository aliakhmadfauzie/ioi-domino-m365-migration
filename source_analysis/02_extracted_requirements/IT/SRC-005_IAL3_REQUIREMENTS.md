# Form Requirement — IT Activity Log 3 (IAL3 — ISG Events)

> **Source ID**: SRC-005
> **Analysis Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Base**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL3.pdf` (76 KB), `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`
> **Evidence Quality**: ⚠️ Direct PDF viewing not available. IAL3 is the smallest IT PDF (76 KB). Field labels derived from the shared `DataRestorationV1` Domino template structure (same as IAL1). All field labels marked Inferred unless confirmed by named analysis source.

## 1. Basic Information

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Source ID | SRC-005 | Clearly Found | `PDF_FORM_INVENTORY.md` |
| Department | IT | Clearly Found | File path: `PRAI_SITE_FORM/IT/` |
| Form Name | IT Activity Log 3 — ISG Events | Clearly Found | `pdf-ui-inventory.md` ("ISG Events form") |
| Domino Form Name | DataRestorationV1 | Clearly Found | `pdf-ui-inventory.md` |
| Source File | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL3.pdf` | Clearly Found | Filesystem |
| PDF Size | 76 KB (smallest IT PDF) | Clearly Found | `pdf-ui-inventory.md` |
| Est. Visible Fields | ~16 | Inferred | `pdf-ui-inventory.md` (same template as IAL1) |
| Form Purpose | Log ISG (Information Security Group) events with review/sign-off | Clearly Found | `pdf-ui-inventory.md` ("ISG Events form") |
| Single or Multi-Form | Single form | Clearly Found | PDF naming convention |
| Related Forms | IAL1 (Data Restoration), IAL2 (Server Reboot), IAL4 (Data Center), IAL5 (Server Records) — all share `DataRestorationV1` template | Clearly Found | `pdf-ui-inventory.md` |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence | Evidence Source |
|---|---|---|---|---|---|---|---|
| 1 | Activity Entry | Requester | Log ISG event details — requester, date, event type, system affected | Always visible | IT Staff/ISG | Inferred | Same template as IAL1 (`pdf-ui-inventory.md`) |
| 2 | Activity Details | Information | Description of ISG event, impact, resolution, outcome | Always visible | IT Staff/ISG | Inferred | Same template as IAL1 |
| 3 | Review / Approval | Approver | Reviewer sign-off on ISG event | After entry submitted | Reviewer/Approver | Inferred | `pdf-ui-inventory.md` marks IAL3 as workflow ✅ |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Evidence Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IAL3-001 | Entry | Date | `activityDate` | Date | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL3-002 | Entry | Time | `activityTime` | Text | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL3-003 | Entry | Requestor / Reported By | `reportedBy` | Person | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL3-004 | Entry | Event Type | `eventType` | Choice | Inferred | — | Unknown | Header | No | Inferred | ISG Events variant | Security, Incident, Audit, etc. |
| IAL3-005 | Entry | System / Asset Affected | `systemAffected` | Text | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL3-006 | Entry | Reference No / Ticket No | `referenceNo` | Text | Optional (Inferred) | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL3-007 | Entry | Severity | `severity` | Choice | Inferred | — | Unknown | Header | No | Inferred | ISG Events variant | Low, Medium, High, Critical |
| IAL3-008 | Details | Description | `description` | Multiline Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL3-009 | Details | Impact Assessment | `impactAssessment` | Multiline Text | Optional (Inferred) | — | — | Information | No | Inferred | ISG Events variant | |
| IAL3-010 | Details | Resolution / Action Taken | `resolution` | Multiline Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL3-011 | Details | Start Time | `startTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL3-012 | Details | End Time | `endTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL3-013 | Details | Outcome / Status | `outcome` | Choice | Inferred | — | Unknown | Information | No | Inferred | Same template as IAL1 | Resolved, Escalated, etc. |
| IAL3-014 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | — | Approval | No | Inferred | `pdf-ui-inventory.md` workflow ✅ | |
| IAL3-015 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |
| IAL3-016 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Event Type | Unknown | Not visible in intermediate analysis | — | Unknown |
| Severity | Unknown | Not documented in intermediate analysis | — | Unknown |
| Outcome / Status | Unknown | Not documented in intermediate analysis | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|
| Event Type | Must not be empty | Inferred from ISG event log practice | Same template as IAL1 | Inferred |
| Description | Must not be empty | Inferred from activity log practice | Same template as IAL1 | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|---|
| Activity Entry | All | IT Staff/ISG (requester) | — | Always visible during create | Inferred | Same template as IAL1 | Inferred |
| Activity Details | All | IT Staff/ISG (requester) | — | Always visible | Inferred | Same template as IAL1 | Inferred |
| Review Section | Reviewer, Admin | Reviewer | Requester (after submit) | After entry submitted | Inferred | `pdf-ui-inventory.md` workflow ✅ | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Approval Required | Inferred | Inferred | `pdf-ui-inventory.md` marks IAL3 workflow ✅ but no routing details |
| Approval Type | Single-stage review | Inferred | Same template as IAL1 |

### Workflow Stages

| Stage | Role/Approver | Routing Rule | Status Value | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|
| Entry | IT Staff/ISG | Create event log | Draft / Entry | Inferred | Same template as IAL1 | Inferred |
| Submitted | ISG Staff → Reviewer | Submit for review | Submitted | Inferred | Same template as IAL1 | Inferred |
| Reviewed | Reviewer (e.g., ISG Manager) | Review and sign off | Reviewed / Completed | Inferred | `pdf-ui-inventory.md` workflow ✅; signature pattern from template | Inferred |

**Evidence Note**: The `pdf-ui-inventory.md` marks IAL3 with workflow ✅ and describes it as "ISG Events form" — the smallest IT PDF at 76 KB. The exact routing mechanism is not documented. Approval classified as Inferred.

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
| Title | Single line of text | Yes | — | — | — | Auto-generated or system name |
| FormCode | Choice | Yes | IAL3 | — | — | Discriminator |
| ial3ActivityDate | Date | Inferred | — | — | — | |
| ial3ActivityTime | Single line of text | Inferred | — | — | — | |
| ial3ReportedBy | Person | Inferred | — | — | Yes | |
| ial3EventType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial3SystemAffected | Single line of text | Inferred | — | — | — | |
| ial3ReferenceNo | Single line of text | No | — | — | — | |
| ial3Severity | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial3Description | Multiple lines of text | Inferred | — | — | — | |
| ial3ImpactAssessment | Multiple lines of text | No | — | — | — | |
| ial3Resolution | Multiple lines of text | Inferred | — | — | — | |
| ial3StartTime | Single line of text | Inferred | — | — | — | |
| ial3EndTime | Single line of text | Inferred | — | — | — | |
| ial3Outcome | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial3ReviewedBy | Person | No | — | — | Yes | |
| ial3ReviewDate | Date | No | — | — | — | |
| ial3ReviewComments | Multiple lines of text | No | — | — | — | |
| ial3CurrentStatus | Choice | Yes | Draft; Submitted; Reviewed | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New | Activity Entry | Text inputs, People picker, Date picker, Dropdowns | DynamicFormRenderer | Date, Event Type, System, Description required | Always | MainDB_IT | |
| New | Activity Details | Text inputs, Multiline text, Dropdowns | DynamicFormRenderer | Outcome required on submit | Always | MainDB_IT | |
| Detail | Review | Read-only display + Review button (if reviewer) | ApprovalPanel | Review Comments optional | Visible after submit, editable by reviewer | MainDB_IT | Only editable if current user is assigned reviewer |
| List | All | Gallery / Data table | ListView | — | — | MainDB_IT | Filter by FormCode=IAL3 |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| Is approval review mandatory or optional for IAL3 (ISG Events)? | Workflow | High | Affects whether status stays at Submitted or requires Review | ISG Manager |
| What are the exact Event Type choices for ISG Events? | Field Choices | Medium | Affects categorization | ISG Team |
| What are the exact Severity choices (Low/Medium/High/Critical)? | Field Choices | Medium | Affects escalation routing | ISG Team |
| What are the exact Outcome choices? | Field Choices | Medium | Affects status tracking | ISG Team |
| How is the reviewer assigned for ISG events? | Workflow Routing | High | Affects Power Automate flow design | ISG Manager |
| Should IAL1-5 share the same SharePoint list? | SharePoint Design | Medium | Affects list architecture | SharePoint Architect |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with workflow and choice confirmations |
| Needs Human Confirmation | Yes — approval requirement, reviewer assignment, choice values |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
