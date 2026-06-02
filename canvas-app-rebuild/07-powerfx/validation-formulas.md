# Validation Formulas

> Power Fx validation patterns for Canvas App forms.
> Source: Design report validation rules + confirmed patterns from AWHR new.tsx + STR approve.tsx
> All DRAFT_FORMULA — test in Power Apps Studio before use.
> Last updated: 2026-06-02

---

## Validation Runner Pattern

Run this in btnSubmit.OnSelect and btnApprove/Reject.OnSelect before any Patch call.

```powerfx
// DRAFT_FORMULA — Validation runner (in button OnSelect)

// Step 1: Clear previous errors
Clear(colValidationErrors);
Set(locShowValidation, false);

// Step 2: Run all required field checks for this form
// Add one If block per required field
If(IsBlank(txtProjectName.Text) Or Len(Trim(txtProjectName.Text)) = 0,
    Collect(colValidationErrors, {FieldName: "txtProjectName", Message: "Project Name is required"})
);
If(IsBlank(datStartDate.SelectedDate),
    Collect(colValidationErrors, {FieldName: "datStartDate", Message: "Start Date is required"})
);

// Step 3: Check result — stop if errors exist
If(!IsEmpty(colValidationErrors),
    Set(locShowValidation, true),
    // No errors — proceed to Patch
    /* Patch call here */
    Set(locShowValidation, false)
)
```

---

## V-01: Required Text Field

```powerfx
// DRAFT_FORMULA
If(IsBlank(controlName.Text) Or Len(Trim(controlName.Text)) = 0,
    Collect(colValidationErrors, {FieldName: "controlName", Message: "Field Label is required"})
)
```

---

## V-02: Required Date Field

```powerfx
// DRAFT_FORMULA
If(IsBlank(datFieldName.SelectedDate),
    Collect(colValidationErrors, {FieldName: "datFieldName", Message: "Date is required"})
)
```

---

## V-03: Required People Picker

```powerfx
// DRAFT_FORMULA
If(IsBlank(pplFieldName.outSelectedUser.Email),
    Collect(colValidationErrors, {FieldName: "pplFieldName", Message: "Please select a person"})
)
```

---

## V-04: Date Order (End after Start)

Confirmed needed for CAR form (CompDate must be after StartDate).

```powerfx
// DRAFT_FORMULA
If(
    !IsBlank(datStartDate.SelectedDate)
    And !IsBlank(datCompDate.SelectedDate)
    And datCompDate.SelectedDate < datStartDate.SelectedDate,
    Collect(colValidationErrors, {FieldName: "datCompDate", Message: "Completion Date must be after Start Date"})
)
```

---

## V-05: Comment Required for Reject / Return

Confirmed from AWHR detail.tsx and STR approve.tsx.

```powerfx
// DRAFT_FORMULA — used in cmpWorkflowActionPanel before Reject/Return Patch
If(
    (locPendingAction = "Reject" Or locPendingAction = "Return")
    And (IsBlank(cmpApprovalCommentBox.outComment) Or Len(Trim(cmpApprovalCommentBox.outComment)) = 0),
    Collect(colValidationErrors, {FieldName: "comment", Message: "A comment is required for Reject or Return actions"})
)
```

---

## V-06: Currency / Amount > 0

```powerfx
// DRAFT_FORMULA
If(Value(curBudgetAmt.Text) <= 0,
    Collect(colValidationErrors, {FieldName: "curBudgetAmt", Message: "Amount must be greater than zero"})
)
```

---

## V-07: Minimum Child Rows (Editable Gallery)

Confirmed from AWHR new.tsx — at least one working hours row required before submit.

```powerfx
// DRAFT_FORMULA
If(IsEmpty(colChildItems) Or CountRows(colChildItems) = 0,
    Collect(colValidationErrors, {FieldName: "galChildRows", Message: "At least one row is required"})
)
```

---

## V-08: Required Choice Field

```powerfx
// DRAFT_FORMULA
If(IsBlank(drpFieldName.Selected.Value) Or drpFieldName.Selected.Value = "",
    Collect(colValidationErrors, {FieldName: "drpFieldName", Message: "Please select a value"})
)
```

---

## V-09: Valid Email Format

```powerfx
// DRAFT_FORMULA
If(!IsMatch(txtEmail.Text, Match.Email),
    Collect(colValidationErrors, {FieldName: "txtEmail", Message: "Please enter a valid email address"})
)
```

---

## V-10: Record Ownership Guard (before Edit)

Only the original submitter can edit their own Draft records. Applied in scrEditDraft OnVisible.

```powerfx
// DRAFT_FORMULA — scrEditDraft OnVisible guard
If(
    locRecord.Requestor_Email <> gblCurrentUser.UserPrincipalName
    And !gblIsAdmin,
    Navigate(scrAccessDenied),
    // Also guard status
    If(locRecord.Status.Value <> "Draft",
        Navigate(scrViewRequest)
    )
)
```
