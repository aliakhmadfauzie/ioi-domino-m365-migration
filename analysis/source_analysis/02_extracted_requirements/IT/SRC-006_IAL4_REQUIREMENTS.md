# Form Requirement — IT Activity Log 4 (IAL4 — Data Center)

> **Source ID**: SRC-006
> **Analysis Date**: 2026-06-01
> **Analyst**: Domino PDF Source Analysis Agent
> **Evidence Base**: `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL4.pdf` (153 KB), `analysis/pdf-ui-inventory.md`, `docs/central-form-reference.md`
> **Evidence Quality**: ⚠️ Direct PDF viewing not available. Field labels derived from the shared `DataRestorationV1` Domino template structure (same as IAL1). All field labels marked Inferred unless confirmed by named analysis source.

## 1. Basic Information

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Source ID | SRC-006 | Clearly Found | `PDF_FORM_INVENTORY.md` |
| Department | IT | Clearly Found | File path: `PRAI_SITE_FORM/IT/` |
| Form Name | IT Activity Log 4 — Data Center | Clearly Found | `pdf-ui-inventory.md` ("Data Center form") |
| Domino Form Name | DataRestorationV1 | Clearly Found | `pdf-ui-inventory.md` |
| Source File | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT/IAL4.pdf` | Clearly Found | Filesystem |
| PDF Size | 153 KB | Clearly Found | `pdf-ui-inventory.md` |
| Est. Visible Fields | ~16 | Inferred | `pdf-ui-inventory.md` (same template as IAL1) |
| Form Purpose | Log data center activities — access, maintenance, environmental checks — with review/sign-off | Clearly Found | `pdf-ui-inventory.md` ("Data Center form") |
| Single or Multi-Form | Single form | Clearly Found | PDF naming convention |
| Related Forms | IAL1 (Data Restoration), IAL2 (Server Reboot), IAL3 (ISG Events), IAL5 (Server Records) — all share `DataRestorationV1` template | Clearly Found | `pdf-ui-inventory.md` |

## 2. Form Sections

| Section No. | Section Name | Type | Purpose | Visibility Rule | Role Dependency | Confidence | Evidence Source |
|---|---|---|---|---|---|---|---|
| 1 | Activity Entry | Requester | Log data center activity — requester, date, activity type, location/rack | Always visible | IT Staff/DC Ops | Inferred | Same template as IAL1 (`pdf-ui-inventory.md`) |
| 2 | Activity Details | Information | Description of data center activity, equipment affected, environmental readings, outcome | Always visible | IT Staff/DC Ops | Inferred | Same template as IAL1 |
| 3 | Review / Approval | Approver | Reviewer sign-off on data center activity | After entry submitted | Reviewer/Approver | Inferred | `pdf-ui-inventory.md` marks IAL4 as workflow ✅ |

## 3. Field Extraction

| Field ID | Section | Field Label | Suggested Internal Name | Data Type | Required | Default Value | Choices | Field Group | Repeating Table | Evidence Confidence | Evidence Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IAL4-001 | Entry | Date | `activityDate` | Date | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL4-002 | Entry | Time | `activityTime` | Text | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL4-003 | Entry | Requestor / Performed By | `performedBy` | Person | Inferred | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL4-004 | Entry | Location / Rack | `location` | Text | Inferred | — | — | Header | No | Inferred | Data Center variant | |
| IAL4-005 | Entry | Activity Type | `activityType` | Choice | Inferred | — | Unknown | Header | No | Inferred | Same template as IAL1 | Access, Maintenance, Inspection, etc. |
| IAL4-006 | Entry | Equipment / System | `equipment` | Text | Inferred | — | — | Header | No | Inferred | Data Center variant | Server, UPS, Cooling, etc. |
| IAL4-007 | Entry | Reference No | `referenceNo` | Text | Optional (Inferred) | — | — | Header | No | Inferred | Same template as IAL1 | |
| IAL4-008 | Details | Description | `description` | Multiline Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL4-009 | Details | Environmental Readings | `environmentalReadings` | Text | Optional (Inferred) | — | — | Information | No | Inferred | Data Center variant | Temp, Humidity |
| IAL4-010 | Details | Access Type | `accessType` | Choice | Inferred | — | Unknown | Information | No | Inferred | Data Center variant | Physical, Remote, Vendor |
| IAL4-011 | Details | Start Time | `startTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL4-012 | Details | End Time | `endTime` | Text | Inferred | — | — | Information | No | Inferred | Same template as IAL1 | |
| IAL4-013 | Details | Outcome / Status | `outcome` | Choice | Inferred | — | Unknown | Information | No | Inferred | Same template as IAL1 | Completed, Issues Found, etc. |
| IAL4-014 | Review | Reviewed By | `reviewedBy` | Person | Optional (Inferred) | — | — | Approval | No | Inferred | `pdf-ui-inventory.md` workflow ✅ | |
| IAL4-015 | Review | Review Date | `reviewDate` | Date | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |
| IAL4-016 | Review | Review Comments | `reviewComments` | Multiline Text | Optional (Inferred) | — | — | Approval | No | Inferred | Same template as IAL1 | |

## 4. Choice Fields

| Field Label | Choices Found | Source Evidence | Exact Text | Confidence |
|---|---|---|---|---|
| Activity Type | Unknown | Not visible in intermediate analysis | — | Unknown |
| Access Type | Unknown | Not documented in intermediate analysis | — | Unknown |
| Outcome / Status | Unknown | Not documented in intermediate analysis | — | Unknown |

## 5. Validation Rules

| Field | Validation Rule | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|
| Location / Rack | Must not be empty | Inferred from DC log practice | Same template as IAL1 | Inferred |
| Description | Must not be empty | Inferred from activity log practice | Same template as IAL1 | Inferred |

## 6. Role and Visibility Rules

| Section/Field | Visible To | Editable By | Hidden From | Condition | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|---|
| Activity Entry | All | IT Staff/DC Ops (requester) | — | Always visible during create | Inferred | Same template as IAL1 | Inferred |
| Activity Details | All | IT Staff/DC Ops (requester) | — | Always visible | Inferred | Same template as IAL1 | Inferred |
| Review Section | Reviewer, Admin | Reviewer | Requester (after submit) | After entry submitted | Inferred | `pdf-ui-inventory.md` workflow ✅ | Inferred |

## 7. Workflow and Routing

| Attribute | Value | Confidence | Evidence Source |
|---|---|---|---|
| Approval Required | Inferred | Inferred | `pdf-ui-inventory.md` marks IAL4 workflow ✅ but no routing details |
| Approval Type | Single-stage review | Inferred | Same template as IAL1 |

### Workflow Stages

| Stage | Role/Approver | Routing Rule | Status Value | Evidence | Evidence Source | Confidence |
|---|---|---|---|---|---|---|
| Entry | IT Staff/DC Ops | Create activity log | Draft / Entry | Inferred | Same template as IAL1 | Inferred |
| Submitted | DC Staff → Reviewer | Submit for review | Submitted | Inferred | Same template as IAL1 | Inferred |
| Reviewed | Reviewer (e.g., DC Manager) | Review and sign off | Reviewed / Completed | Inferred | `pdf-ui-inventory.md` workflow ✅; signature pattern from template | Inferred |

**Evidence Note**: The `pdf-ui-inventory.md` marks IAL4 with workflow ✅ and describes it as "Data Center form." The exact routing mechanism (who is the reviewer, how assigned) is not documented. Approval classified as Inferred.

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
| Title | Single line of text | Yes | — | — | — | Auto-generated or activity summary |
| FormCode | Choice | Yes | IAL4 | — | — | Discriminator |
| ial4ActivityDate | Date | Inferred | — | — | — | |
| ial4ActivityTime | Single line of text | Inferred | — | — | — | |
| ial4PerformedBy | Person | Inferred | — | — | Yes | |
| ial4Location | Single line of text | Inferred | — | — | — | |
| ial4ActivityType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial4Equipment | Single line of text | Inferred | — | — | — | |
| ial4ReferenceNo | Single line of text | No | — | — | — | |
| ial4Description | Multiple lines of text | Inferred | — | — | — | |
| ial4EnvironmentalReadings | Single line of text | No | — | — | — | |
| ial4AccessType | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial4StartTime | Single line of text | Inferred | — | — | — | |
| ial4EndTime | Single line of text | Inferred | — | — | — | |
| ial4Outcome | Choice | Inferred | Needs Human Confirmation | — | — | |
| ial4ReviewedBy | Person | No | — | — | Yes | |
| ial4ReviewDate | Date | No | — | — | — | |
| ial4ReviewComments | Multiple lines of text | No | — | — | — | |
| ial4CurrentStatus | Choice | Yes | Draft; Submitted; Reviewed | — | — | |

## 10. Power Apps Build Specification

| Screen | Section | Control Type | Data Card / Component | Validation | Visibility | Submit Mapping | Notes |
|---|---|---|---|---|---|---|---|
| New | Activity Entry | Text inputs, People picker, Date picker, Dropdowns | DynamicFormRenderer | Date, Location, Activity Type, Description required | Always | MainDB_IT | |
| New | Activity Details | Text inputs, Multiline text, Dropdowns | DynamicFormRenderer | Outcome required on submit | Always | MainDB_IT | |
| Detail | Review | Read-only display + Review button (if reviewer) | ApprovalPanel | Review Comments optional | Visible after submit, editable by reviewer | MainDB_IT | Only editable if current user is assigned reviewer |
| List | All | Gallery / Data table | ListView | — | — | MainDB_IT | Filter by FormCode=IAL4 |

## 11. Open Questions

| Question | Area | Severity | Why It Matters | Suggested Owner |
|---|---|---|---|---|
| Is approval review mandatory or optional for IAL4 (Data Center)? | Workflow | High | Affects whether status stays at Submitted or requires Review | DC Manager |
| What are the exact Activity Type choices for Data Center? | Field Choices | Medium | Affects categorization | DC Team |
| What are the exact Access Type choices (Physical, Remote, Vendor)? | Field Choices | Medium | Affects security tracking | DC Team |
| What are the exact Outcome choices? | Field Choices | Medium | Affects status tracking | DC Team |
| How is the reviewer assigned for data center activities? | Workflow Routing | High | Affects Power Automate flow design | DC Manager |
| Should IAL1-5 share the same SharePoint list? | SharePoint Design | Medium | Affects list architecture | SharePoint Architect |

## 12. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes — with workflow and choice confirmations |
| Needs Human Confirmation | Yes — approval requirement, reviewer assignment, choice values |
| Blocked | No |
| Duplicate | No |
| Not a Form | No |
