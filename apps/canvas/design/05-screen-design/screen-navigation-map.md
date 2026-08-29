# Screen Navigation Map

> Documents all Navigate() calls, global variables set before navigation, and navigation guards.
> Last updated: 2026-06-02

---

## Navigation Principles

1. **Always Set Before Navigate:** Set all required global variables BEFORE calling Navigate()
2. **No URL routing:** Canvas App has no URL paths — all navigation is imperative
3. **Back navigation:** Use Navigate(scrPreviousScreen) or track gblNavHistory
4. **Guards:** Every screen's OnVisible checks cmpAccessGuard before rendering

---

## Navigation Flow Diagram (Text)

```
scrHomeDashboard
    ├── [Dept Card tap] → Set(gblActiveDept) → Navigate(scrDeptHub)
    ├── [My Submissions] → Navigate(scrMyRequests)
    ├── [My Approvals] → Navigate(scrApprovalProcess)
    └── [Admin link] → Navigate(scrAdminConfig) [Admin only]

scrDeptHub
    ├── [Form Card tap] → Set(gblActiveFormCode) → Navigate(scrFormList)
    ├── [New button] → Set(gblActiveFormCode; gblFormMode="New"; gblActiveRecordID=0) → Navigate(scrNewRequest)
    ├── [Back] → Navigate(scrHomeDashboard)
    └── [My Submissions for dept] → Navigate(scrMyRequests) [filtered]

scrFormList
    ├── [New button] → Set(gblFormMode="New"; gblActiveRecordID=0) → Navigate(scrNewRequest)
    ├── [Record tap] → Set(gblActiveRecordID=id; gblFormMode="View") → Navigate(scrViewRequest)
    ├── [Edit Draft] → Set(gblActiveRecordID=id; gblFormMode="Edit") → Navigate(scrEditDraft)
    └── [Back] → Navigate(scrDeptHub)

scrNewRequest
    ├── [Save Draft success] → Set(gblActiveRecordID=newID) → Stay on screen (show success)
    ├── [Submit success] → Navigate(scrMyRequests) or Navigate(scrFormList)
    ├── [Cancel] → cmpConfirmDialog → Navigate(scrFormList)
    └── [Back with unsaved changes] → cmpUnsavedChangesBanner → cmpConfirmDialog

scrEditDraft
    ├── [Save success] → Stay on screen
    ├── [Submit success] → Navigate(scrViewRequest; gblFormMode="View")
    ├── [Cancel] → Navigate(scrViewRequest; gblFormMode="View") or Navigate(scrFormList)
    └── [Guard: Status ≠ Draft] → Navigate(scrViewRequest; gblFormMode="View")

scrViewRequest
    ├── [Approve/Reject/Return] → cmpWorkflowActionPanel → Patch → Refresh locRecord → Stay on screen
    ├── [Print] → MISSING_INFO (Power Automate PDF or browser Print)
    ├── [Copy] → Patch new record → Navigate(scrNewRequest with pre-filled)
    ├── [Edit (own Draft)] → Set(gblFormMode="Edit") → Navigate(scrEditDraft)
    ├── [Back] → Navigate(scrFormList) or Navigate(scrApprovalProcess)
    └── [View History] → May show inline or Navigate(scrWorkflowHistory if built)

scrApprovalProcess
    ├── [Approve/Reject] → Patch + History write → Refresh gallery
    ├── [View Full Record] → Set(gblActiveRecordID=id; gblFormMode="Approve") → Navigate(scrViewRequest)
    └── [Back] → Navigate(scrHomeDashboard)

scrMyRequests
    ├── [Record tap] → Set(gblActiveRecordID=id; gblFormMode="View") → Navigate(scrViewRequest)
    ├── [Continue Draft] → Set(gblActiveRecordID=id; gblFormMode="Edit") → Navigate(scrEditDraft)
    └── [Back] → Navigate(scrHomeDashboard)

scrAllRequestsAdmin
    ├── [Record tap] → Set(gblActiveRecordID=id; gblFormMode="View") → Navigate(scrViewRequest)
    └── [Back] → Navigate(scrHomeDashboard)

scrAccessDenied
    └── [Home] → Navigate(scrHomeDashboard)

scrNotFound
    └── [Home] → Navigate(scrHomeDashboard)
```

---

## Standard Navigate Pattern (DRAFT_FORMULA)

```powerfx
// DRAFT_FORMULA — Navigate to form list for a dept+form
// Set context variables first, then navigate

Set(gblActiveDept, "HR");
Set(gblActiveFormCode, "AWHR");
Navigate(scrFormList, ScreenTransition.Fade)

// ---

// DRAFT_FORMULA — Navigate to view a specific record
Set(gblActiveRecordID, galRequests.Selected.ID);
Set(gblActiveDept, "HR");
Set(gblActiveFormCode, "AWHR");
Set(gblFormMode, "View");
Navigate(scrViewRequest, ScreenTransition.Fade)

// ---

// DRAFT_FORMULA — Navigate to new form
Set(gblActiveRecordID, 0);
Set(gblActiveDept, "FIN");
Set(gblActiveFormCode, "CAR");
Set(gblFormMode, "New");
Navigate(scrNewRequest, ScreenTransition.Fade)
```

---

## Screen OnVisible Guards (DRAFT_FORMULA)

Each screen runs access check OnVisible before loading data.

```powerfx
// DRAFT_FORMULA — scrNewRequest OnVisible
// 1. Check access
If(!fxUserHasRole("MISSING_INFO_SUBMITTER_ROLEKEY", gblActiveDept),
    Navigate(scrAccessDenied),
    // 2. Load form config
    ClearCollect(colFormConfig, Filter(AppConfig_FormRules, FormCode = gblActiveFormCode));
    // 3. If Edit mode, load existing record
    If(gblFormMode = "Edit" And gblActiveRecordID > 0,
        Set(locRecord, LookUp(MainDB_HR, ID = gblActiveRecordID));
        // Guard: only Draft records can be edited
        If(locRecord.Status.Value <> "Draft",
            Navigate(scrViewRequest)
        )
    )
)
```
