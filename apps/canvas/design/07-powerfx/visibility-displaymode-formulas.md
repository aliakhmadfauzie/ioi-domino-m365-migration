# Visibility and DisplayMode Formulas

> Power Fx patterns for controlling field and section visibility and edit mode.
> Source: Confirmed patterns from AWHR detail.tsx + design report section visibility rules.
> All DRAFT_FORMULA — test in Power Apps Studio.
> Last updated: 2026-06-02

---

## DisplayMode Patterns

### Standard Field DisplayMode

The `DisplayMode` property of all input controls follows this pattern:

```powerfx
// DRAFT_FORMULA — standard field DisplayMode
// Edit only when: form is in New or Edit mode AND user has submitter role for this form
If(
    gblFormMode = "New"
    Or (gblFormMode = "Edit"
        And fxUserHasRole("MISSING_INFO_SUBMITTER_ROLEKEY", gblActiveDept)
        And locRecord.Status.Value = "Draft"),
    DisplayMode.Edit,
    DisplayMode.View
)
```

### Approval Field DisplayMode (HOD section example)

```powerfx
// DRAFT_FORMULA — approval field editable only for the current approver in the correct stage
If(
    gblFormMode = "Approve"
    And fxUserHasRole("MISSING_INFO_HOD_ROLEKEY", gblActiveDept)
    And locRecord.CurrentApprover_Email = gblCurrentUser.UserPrincipalName,
    DisplayMode.Edit,
    DisplayMode.View
)
```

### Read-Only Fields (always View)

```powerfx
// Auto-populated fields are always read-only
DisplayMode.View
// Applied to: lblFormCode, lblSite, lblSubmitterEmail, lblSubmittedOn, cmpStatusBadge
```

---

## Visibility Patterns

### Section Always Visible

```powerfx
// Always show this section
true
```

### Section Visible After Submission

```powerfx
// DRAFT_FORMULA — section visible once submitted (not on Draft/New)
locRecord.Status.Value <> "Draft"
Or gblFormMode = "New"   // Always show on New form (section may be submitter-editable)
```

### HOD Approval Section Visible

```powerfx
// DRAFT_FORMULA — HOD section visible once record reaches or passes HOD stage
locRecord.Status.Value = "Submitted"
Or locRecord.Status.Value = "Under Review"
Or locRecord.Status.Value = "Approved"
Or locRecord.Status.Value = "Rejected"
Or locRecord.Status.Value = "Closed"
```

### AWHR-Specific: HOD Section Visible (Confirmed)

```powerfx
// DRAFT_FORMULA — confirmed from AWHR detail.tsx STAGE_ACTIONS
// HOD section visible when HOS has already acted (HOSApproved or later)
locRecord.awhrCurrentAction = "HOSApproved"
Or locRecord.awhrCurrentAction = "HODApproved"
Or locRecord.awhrCurrentAction = "Completed"
Or locRecord.awhrCurrentAction = "Rejected"
```

### AWHR-Specific: HR Completion Section Visible (Confirmed)

```powerfx
// DRAFT_FORMULA — HR section visible when HOD has acted
locRecord.awhrCurrentAction = "HODApproved"
Or locRecord.awhrCurrentAction = "Completed"
Or locRecord.awhrCurrentAction = "Rejected"
```

### Admin-Only Section Visible

```powerfx
// DRAFT_FORMULA
gblIsAdmin
```

---

## Command Bar Button Visibility

### Save Draft Button

```powerfx
// DRAFT_FORMULA — visible in New and Edit mode; Draft records only
gblFormMode = "New"
Or (gblFormMode = "Edit" And locRecord.Status.Value = "Draft")
```

### Submit Button

```powerfx
// DRAFT_FORMULA
gblFormMode = "New"
Or (gblFormMode = "Edit" And locRecord.Status.Value = "Draft")
Or (gblFormMode = "View" And locRecord.Status.Value = "Draft"
    And locRecord.Requestor_Email = gblCurrentUser.UserPrincipalName)
```

### Approve Button

```powerfx
// DRAFT_FORMULA — visible only for current approver in the correct stage
gblFormMode = "Approve"
And locRecord.CurrentApprover_Email = gblCurrentUser.UserPrincipalName
And (locRecord.Status.Value = "Submitted" Or locRecord.Status.Value = "Under Review")
```

### Reject Button

```powerfx
// DRAFT_FORMULA — same as Approve visibility
gblFormMode = "Approve"
And locRecord.CurrentApprover_Email = gblCurrentUser.UserPrincipalName
And (locRecord.Status.Value = "Submitted" Or locRecord.Status.Value = "Under Review")
```

### Return for Edit Button

```powerfx
// DRAFT_FORMULA — same as Approve
gblFormMode = "Approve"
And locRecord.CurrentApprover_Email = gblCurrentUser.UserPrincipalName
And (locRecord.Status.Value = "Submitted" Or locRecord.Status.Value = "Under Review")
```

### Withdraw Button (Submitter)

```powerfx
// DRAFT_FORMULA — only submitter can withdraw; only Draft or Submitted
locRecord.Requestor_Email = gblCurrentUser.UserPrincipalName
And (locRecord.Status.Value = "Draft" Or locRecord.Status.Value = "Submitted")
```

### Delete Button

```powerfx
// DRAFT_FORMULA — only Admin or submitter; Draft only
(gblIsAdmin Or locRecord.Requestor_Email = gblCurrentUser.UserPrincipalName)
And locRecord.Status.Value = "Draft"
```

### Copy Button

```powerfx
// DRAFT_FORMULA — available on any approved/closed record
locRecord.Status.Value = "Approved"
Or locRecord.Status.Value = "Closed"
Or locRecord.Status.Value = "Rejected"
```
