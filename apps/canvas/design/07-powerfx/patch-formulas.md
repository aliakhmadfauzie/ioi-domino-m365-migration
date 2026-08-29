# Patch Formulas

> All SP write (Patch) formula patterns for workflow actions.
> Source: Corrected Canvas App Data Model and Formula Reference Document
> All DRAFT_FORMULA — confirmed SP column names used where available.
> Last updated: 2026-06-02

---

## Status: Formula Lifecycle

- `DRAFT_FORMULA` — not yet tested
- `TESTED` — verified against live SP in Power Apps Studio
- `CONFIRMED` — end-to-end workflow verified
- `RETIRED` — superseded; see replacement note

---

## Save Draft (HR/FIN Lists)

```powerfx
// DRAFT_FORMULA — Save Draft action
// Confirmed SP column names: Title, FormCode, Status, CurrentStatus, CurrentAction,
// EntitySite, Requestor_Email, Requestor_DisplayName
// Choice field write pattern: {Value: "label"} wrapper required for Choice columns

// New record (gblActiveRecordID = 0):
Set(locNewRecord,
    Patch(
        MainDB_HR,
        Defaults(MainDB_HR),
        {
            Title: gblActiveFormCode & "-" & Text(Now(), "yyyyMMdd-HHmmss"),
            FormCode: gblActiveFormCode,
            Status: {Value: "Draft"},
            CurrentStatus: "Draft",
            CurrentAction: "Request",
            EntitySite: {Value: gblActiveSite},
            Requestor_Email: gblCurrentUser.UserPrincipalName,
            Requestor_DisplayName: gblCurrentUser.DisplayName,
            // Form-specific fields:
            // awhrCompany: txtAwhrCompany.outValue,  ← AWHR example
            // MISSING_INFO: Confirm all form-specific columns before adding
        }
    )
);
Set(gblActiveRecordID, locNewRecord.ID);

// Update existing Draft (gblActiveRecordID > 0):
Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        // Only changed fields
        // MISSING_INFO: form-specific fields
    }
)
```

---

## Submit (HR/FIN Lists)

```powerfx
// DRAFT_FORMULA — Submit action
// Writes Status="Submitted", routing fields, SubmittedOn
// MISSING_INFO: routing fields (CurrentStage, CurrentApprover_Email, CurrentApproverGroup)
// must come from Config_ApproverMatrix lookup — pattern TBC

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Submitted"},
        CurrentStatus: "Submitted",
        CurrentAction: "Submitted",
        CurrentStage: "MISSING_INFO_FIRST_STAGE",               // Get from routing config
        CurrentApprover_Email: "MISSING_INFO_FIRST_APPROVER",    // Get from routing config
        CurrentApprover_DisplayName: "MISSING_INFO",
        CurrentApproverGroup: "MISSING_INFO",
        SubmittedOn: Text(Now(), DateTimeFormat.UTC),
        Requestor_Email: gblCurrentUser.UserPrincipalName,
        Requestor_DisplayName: gblCurrentUser.DisplayName
    }
);
// Then write to ApprovalHistory — see patch-formulas.md history section
```

---

## HOD / Intermediate Approve (HR/FIN Lists)

```powerfx
// DRAFT_FORMULA — Intermediate approval (HOD or any non-final approver)
// After approval: advances to next stage; still "Under Review" until final
// MISSING_INFO: next stage name and next approver email from Config_ApproverMatrix

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Under Review"},
        CurrentStatus: "Under Review",
        CurrentAction: "MISSING_INFO_STAGE_ACTION",              // e.g. "HOSApproved", "HODApproved"
        CurrentStage: "MISSING_INFO_NEXT_STAGE",
        CurrentApprover_Email: "MISSING_INFO_NEXT_APPROVER",
        CurrentApprover_DisplayName: "MISSING_INFO",
        CurrentApproverGroup: "MISSING_INFO",
        ApproverRemarks: cmpApprovalCommentBox.outComment
        // Form-specific approval fields:
        // awhrHOSName: gblCurrentUser.UserPrincipalName,   ← AWHR HOS approve
        // awhrHOSDate: Text(Now(), DateTimeFormat.UTC),
        // awhrHOSRemark: cmpApprovalCommentBox.outComment,
        // awhrCurrentAction: "HOSApproved",
    }
)
```

---

## Final Approve (Last stage — Status becomes Approved)

```powerfx
// DRAFT_FORMULA — Final approval
// Confirmed from main-dbhr-service.ts approve() method:
// statusKey: 'StatusKey3' → Status: "Approved"
// CurrentAction: "Approved"

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Approved"},
        CurrentStatus: "Approved",
        CurrentAction: "Approved",
        CurrentStage: "Completed",
        CurrentApprover_Email: "",
        CurrentApprover_DisplayName: "",
        CurrentApproverGroup: "",
        ApproverRemarks: cmpApprovalCommentBox.outComment
    }
)
```

---

## Reject (Any Stage)

```powerfx
// DRAFT_FORMULA — Reject at any stage
// Confirmed from main-dbhr-service.ts reject():
// statusKey: 'StatusKey4' → Status: "Rejected"
// ApproverRemarks stores rejection comment

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Rejected"},
        CurrentStatus: "Rejected",
        CurrentAction: "Rejected",
        CurrentStage: "Rejected",
        CurrentApprover_Email: "",
        CurrentApprover_DisplayName: "",
        CurrentApproverGroup: "",
        ApproverRemarks: cmpApprovalCommentBox.outComment    // Required — validate before Patch
    }
)
```

---

## Return for Revision (Any Approval Stage)

```powerfx
// DRAFT_FORMULA — Return to submitter for revision
// Confirmed from main-dbhr-service.ts returnForRevision():
// statusKey: 'StatusKey0' → Status: "Draft"
// CurrentAction: "Request" (not "Returned" — this is confirmed)

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Draft"},
        CurrentStatus: "Draft",
        CurrentAction: "Request",                               // Confirmed from HR service
        CurrentStage: "Revision",
        CurrentApprover_Email: locRecord.Requestor_Email,      // Route back to submitter
        CurrentApprover_DisplayName: locRecord.Requestor_DisplayName,
        CurrentApproverGroup: "",
        ApproverRemarks: cmpApprovalCommentBox.outComment      // Return reason — required
    }
)
```

---

## Withdraw (Submitter — own Draft/Submitted)

```powerfx
// DRAFT_FORMULA — Withdraw record
// Only submitter can withdraw; only on Draft or Submitted records

Patch(
    MainDB_HR,
    LookUp(MainDB_HR, ID = gblActiveRecordID),
    {
        Status: {Value: "Closed"},
        CurrentStatus: "Closed",
        CurrentAction: "Withdrawn",
        CurrentStage: "Withdrawn",
        CurrentApprover_Email: "",
        CurrentApproverGroup: ""
    }
)
```

---

## IT List Workflow Advance (MainDB_IT — different pattern)

```powerfx
// DRAFT_FORMULA — IT approval advance
// MainDB_IT uses currentStatus (plain string, camelCase) NOT {Value: "..."} pattern
// workflowstage is a numeric counter

Patch(
    MainDB_IT,
    LookUp(MainDB_IT, id = gblActiveRecordID),
    {
        currentStatus: "MISSING_INFO_NEXT_STATUS",      // Plain string, e.g. "Pending IT Manager"
        currentAction: "MISSING_INFO_ACTION_LABEL",
        workflowstage: locRecord.workflowstage + 1,
        approvedByEmail: gblCurrentUser.UserPrincipalName,
        approvedByName: gblCurrentUser.DisplayName,
        hODApproverRemarks: cmpApprovalCommentBox.outComment
    }
)
```

---

## ApprovalHistory Write (After Every Workflow Action)

```powerfx
// DRAFT_FORMULA — Write to ApprovalHistory_{dept}
// Confirmed SP column names from ApprovalHistory_HRModel.ts:
// Title, RecordID, ParentID, AppName, EntitySite, FromState, ToState,
// ActionCode, ActionComment, ActionByEmail, ActionByName, ActionOn

// Canvas cannot use dynamic list names — use If/Switch per dept
If(
    gblActiveDept = "HR",
    Patch(
        ApprovalHistory_HR,
        Defaults(ApprovalHistory_HR),
        {
            Title: gblActiveFormCode & "-HIST-" & Text(Now(), "yyyymmdd-HHmmss"),
            RecordID: Text(gblActiveRecordID),
            ParentID: gblActiveRecordID,
            AppName: gblActiveFormCode,
            EntitySite: {Value: gblActiveSite},
            FromState: locPreviousStatus,             // Set before Patch: Set(locPreviousStatus, locRecord.Status.Value)
            ToState: locNewStatus,                    // The new status after action
            ActionCode: locActionCode,                // "Approved", "Rejected", "Returned", "Submitted"
            ActionComment: cmpApprovalCommentBox.outComment,
            ActionByEmail: gblCurrentUser.UserPrincipalName,
            ActionByName: gblCurrentUser.DisplayName,
            ActionOn: Text(Now(), DateTimeFormat.UTC)
        }
    ),
    gblActiveDept = "QA",
    Patch(ApprovalHistory_QA, Defaults(ApprovalHistory_QA), locHistoryRecord),
    gblActiveDept = "STR",
    Patch(ApprovalHistory_STR, Defaults(ApprovalHistory_STR), locHistoryRecord),
    gblActiveDept = "SHE",
    Patch(ApprovalHistory_SHE, Defaults(ApprovalHistory_SHE), locHistoryRecord),
    // MISSING_INFO: FIN, IT, QC, PUR etc. — add when confirmed
    Notify("History list not configured for: " & gblActiveDept, NotificationType.Warning)
)
```
