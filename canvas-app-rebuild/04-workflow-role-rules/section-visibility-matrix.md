# Section Visibility Matrix

> Defines which form sections are visible, editable, or read-only based on form mode, role, and workflow status.
> Source: MASTER_ROLE_SECTION_REGISTER.md (sections extracted), TSX AWHR pages (confirmed patterns)
> Last updated: 2026-06-02

---

## Three Visibility Axes

Every section visibility is controlled by THREE combined conditions:

| Axis | Canvas Variable / Formula | Controls |
|---|---|---|
| Form Mode | `gblFormMode` ("New", "Edit", "View", "Approve") | Whether the entire form is in entry or view state |
| Role | `fxUserHasRole(roleKey, dept)` using `colUserRoleAssignments` | Whether this user is allowed to see/edit this section |
| Status | `locRecord.Status.Value` or `locRecord.currentStatus` | Whether the workflow has reached the stage for this section |

---

## Section DisplayMode Formula Pattern

```powerfx
// DRAFT_FORMULA — Section DisplayMode decision
// Replace SECTION_ROLE_KEY and STATUS_VALUE with confirmed values

// Section is fully editable only when:
// 1. Form is in New or Edit mode
// 2. Current user has the required role for this section
// 3. Record status is at the correct stage for this section to be active

If(
    gblFormMode = "New" Or (gblFormMode = "Edit" And fxUserHasRole("SECTION_ROLE_KEY", gblActiveDept)),
    DisplayMode.Edit,
    DisplayMode.View
)
```

---

## Section Visibility Formula Pattern

```powerfx
// DRAFT_FORMULA — Section Visible decision
// Sections are always visible to people who can view the record
// They just become read-only once their stage is passed

// Approval sections: only visible once they have been acted on OR when it is the active stage
If(
    // Show section if the workflow has reached or passed this stage
    locRecord.Status.Value = "STAGE_STATUS_VALUE"
    Or locRecord.Status.Value = "Approved"
    Or locRecord.Status.Value = "Rejected"
    Or locRecord.Status.Value = "Closed"
    // Also show if current user is the approver for this stage
    Or (fxUserHasRole("APPROVER_ROLE_KEY", gblActiveDept) And locRecord.CurrentApprover_Email = gblCurrentUser.UserPrincipalName),
    true,
    false
)
```

---

## AWHR Section Visibility (Confirmed from TSX source)

| Section Name | Visible When | Editable When | Read-Only When | Source |
|---|---|---|---|---|
| Requisition Details | Always | New / Edit mode, Submitter role | View mode or post-submit | AWHR new.tsx fields |
| Exceeded Category | Always | Same as Requisition Details | Same | AWHR new.tsx EXCEEDED_OPTIONS |
| Working Hours Rows | Always | New / Edit mode, Submitter | View mode or post-submit | AWHR new.tsx row table |
| HOS Approval | After Submit | Never by submitter; HOS approval action writes it | Always (write via workflow action, not form fields) | AWHR detail.tsx awhrHOSName/Date/Remark |
| HOD Approval | When currentAction = HOSApproved or later | Never by submitter; HOD approval action writes it | Always read-only in form | AWHR detail.tsx awhrHODName/Date/Remark |
| HR Completion | When currentAction = HODApproved or later | Never by submitter; HR action writes it | Always read-only in form | AWHR detail.tsx awhrHRName/Date |

---

## Generic Form Section Visibility Rules

| Section Type | Visible When | Editable By | Read-Only For |
|---|---|---|---|
| Submitter / Request section | Always | Submitter in New/Edit mode | Everyone else; and submitter in View mode |
| HOD Approval section | Status = "Submitted" or later | HOD only, when it is their active stage | Submitter; other approvers |
| Secondary Approval section | Status = "Under Review" (after HOD) or later | Designated second approver when active | All others |
| Finance / COO Approval section | Only for high-value forms (CAR, CMF); Status = post-HOD | Finance approver / COO when active stage | All others |
| Executive Director Approval | Only for high-value forms; final stage | ED when active stage | All others |
| Verification section | Forms with verification stage; when current stage is Verification | Verifier when active | All others |
| Completion / Record Closure | All forms; Status = Approved / Closed / Completed | Admin / system only | All users (read-only display) |
| Audit History | All forms; post-Submit | Never editable | Everyone — read-only |
| Attachments | All forms | Submitter (New/Edit); Approvers can view | Read-only in View mode |

---

## AWHR Section Visibility in Canvas (DRAFT_FORMULA)

```powerfx
// DRAFT_FORMULA — Requisition Details section visibility
conAwhrRequisitionDetails.Visible = true   // Always visible

// DRAFT_FORMULA — Requisition Details DisplayMode
conAwhrRequisitionDetails_content.DisplayMode =
    If(gblFormMode = "New"
       Or (gblFormMode = "Edit"
           And locRecord.awhrCurrentAction = "Request"),
       DisplayMode.Edit,
       DisplayMode.View)

// DRAFT_FORMULA — HOS Approval section visibility
conAwhrHOSApproval.Visible =
    locRecord.Status.Value = "Submitted"
    Or locRecord.Status.Value = "Under Review"
    Or locRecord.Status.Value = "Approved"
    Or locRecord.Status.Value = "Rejected"
    Or locRecord.Status.Value = "Closed"

// DRAFT_FORMULA — HOD Approval section visible only once HOS has acted
conAwhrHODApproval.Visible =
    locRecord.awhrCurrentAction = "HOSApproved"
    Or locRecord.awhrCurrentAction = "HODApproved"
    Or locRecord.awhrCurrentAction = "Completed"
    Or locRecord.awhrCurrentAction = "Rejected"

// DRAFT_FORMULA — HR Completion section
conAwhrHRCompletion.Visible =
    locRecord.awhrCurrentAction = "HODApproved"
    Or locRecord.awhrCurrentAction = "Completed"
    Or locRecord.awhrCurrentAction = "Rejected"
```
