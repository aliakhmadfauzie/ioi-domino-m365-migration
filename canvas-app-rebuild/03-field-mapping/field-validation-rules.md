# Field Validation Rules

> Confirmed validation patterns for Canvas App fields.
> All formulas are DRAFT_FORMULA until tested in Power Apps Studio.
> Last updated: 2026-06-02

---

## Validation Approach

Canvas validation runs in the `OnSelect` of Save Draft / Submit buttons before any Patch call.

1. Build a `colValidationErrors` collection of error messages
2. If `!IsEmpty(colValidationErrors)`, show `cmpValidationSummary` and stop — do not Patch
3. Clear `colValidationErrors` at the start of each validation run

```powerfx
// DRAFT_FORMULA — Validation runner pattern (in btnSubmit OnSelect)
Clear(colValidationErrors);

// Run each validation check
If(IsBlank(txtProjectName.Text),
    Collect(colValidationErrors, {Message: "Project Name is required"})
);
If(IsBlank(datStartDate.SelectedDate),
    Collect(colValidationErrors, {Message: "Start Date is required"})
);
// ... add more checks

// Check result before Patch
If(!IsEmpty(colValidationErrors),
    // Show summary and stop
    Set(locShowValidation, true),
    // Proceed to Patch
    /* Patch call here */
    Set(locShowValidation, false)
)
```

---

## Confirmed Validation Rules

### Rule V-01: Required Field (Text)

```powerfx
// DRAFT_FORMULA
If(IsBlank(txtFieldName.Text) Or Len(Trim(txtFieldName.Text)) = 0,
    Collect(colValidationErrors, {Message: "Field Label is required"})
)
```

### Rule V-02: Required Field (Date)

```powerfx
// DRAFT_FORMULA
If(IsBlank(datFieldName.SelectedDate),
    Collect(colValidationErrors, {Message: "Date Field is required"})
)
```

### Rule V-03: Required Field (People Picker)

```powerfx
// DRAFT_FORMULA
If(IsBlank(pplFieldName.outSelectedUser.Email),
    Collect(colValidationErrors, {Message: "Person field is required"})
)
```

### Rule V-04: Date Order (Completion Date must be after Start Date)

```powerfx
// DRAFT_FORMULA — confirmed from CAR form requirement
If(!IsBlank(datStartDate.SelectedDate) And !IsBlank(datCompDate.SelectedDate)
   And datCompDate.SelectedDate < datStartDate.SelectedDate,
    Collect(colValidationErrors, {Message: "Completion Date must be after Start Date"})
)
```

### Rule V-05: Comment Required for Reject / Return

```powerfx
// DRAFT_FORMULA — confirmed from AWHR detail.tsx and STR approve.tsx
// Applied in cmpWorkflowActionPanel BEFORE the Reject/Return Patch
If(locPendingAction = "Reject" Or locPendingAction = "Return",
    If(IsBlank(cmpApprovalCommentBox.outComment) Or Len(Trim(cmpApprovalCommentBox.outComment)) = 0,
        Collect(colValidationErrors, {Message: "A comment is required for Reject / Return actions"})
    )
)
```

### Rule V-06: Currency / Amount Greater Than Zero

```powerfx
// DRAFT_FORMULA
If(Value(curBudgetAmt.Text) <= 0,
    Collect(colValidationErrors, {Message: "Budget Amount must be greater than 0"})
)
```

### Rule V-07: At Least One Child Row (Editable Gallery)

```powerfx
// DRAFT_FORMULA — confirmed from AWHR new.tsx row count check
If(CountIf(colChildItems, ParentID = gblActiveRecordID) = 0,
    Collect(colValidationErrors, {Message: "At least one working hours row is required"})
)
```

### Rule V-08: Valid Email Format

```powerfx
// DRAFT_FORMULA
If(!IsMatch(txtEmail.Text, Match.Email),
    Collect(colValidationErrors, {Message: "Please enter a valid email address"})
)
```

### Rule V-09: HOS Required Before Submit (AWHR-specific)

```powerfx
// DRAFT_FORMULA — from AWHR new.tsx validation
If(IsBlank(pplAwhrHOS.outSelectedUser.Email),
    Collect(colValidationErrors, {Message: "HOS (Head of Section) is required"})
);
If(IsBlank(pplAwhrHOD.outSelectedUser.Email),
    Collect(colValidationErrors, {Message: "HOD (Head of Department) is required"})
)
```

---

## Validation Rules by Form Section

| Form | Section | Rule ID | Trigger | Validation |
|---|---|---|---|---|
| ALL | Header | V-01 | Submit | Title must not be blank |
| AWHR | Requisition Details | V-03 | Submit | HOS picker must have selection |
| AWHR | Requisition Details | V-03 | Submit | HOD picker must have selection |
| AWHR | Working Hours Rows | V-07 | Submit | At least one row required |
| CAR | Section A | V-01 | Submit | Project Name required |
| CAR | Section A | V-02 | Submit | Start Date required |
| CAR | Section A | V-04 | Submit | Completion Date after Start Date |
| CAR | Section A | V-06 | Submit | Budget Amount > 0 |
| ALL | Approval Actions | V-05 | Reject/Return | Comment required |
| ALL | Approval Actions | V-05 | Reject | Comment required |
