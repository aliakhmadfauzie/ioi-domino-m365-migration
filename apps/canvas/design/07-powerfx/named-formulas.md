# Named Formulas

> Canvas App named formulas (fx* prefix). Declared in App > Formulas property.
> All DRAFT_FORMULA until tested. Confirmed SP column names used where available.
> Last updated: 2026-06-02

---

## fxStatusLabel

Returns the display label for a Status.Value string.
Used by cmpStatusBadge and anywhere status is displayed.

```powerfx
// DRAFT_FORMULA — accepts SP Status.Value label strings
// Note: these ARE the labels stored in SP — no key-to-label conversion needed for HR/FIN
// This formula is a passthrough but enables future label remapping without updating all screens

fxStatusLabel(statusValue) = statusValue
// Usage: fxStatusLabel(record.Status.Value)  →  "Draft", "Submitted", etc.
```

---

## fxStatusColor

Returns the fill color for a given status label. Used in cmpStatusBadge.

```powerfx
// DRAFT_FORMULA
fxStatusColor(statusLabel) =
    Switch(statusLabel,
        "Draft",        RGBA(120, 120, 120, 1),    // Gray
        "Submitted",    RGBA(23, 82, 168, 1),       // IOI Blue
        "Under Review", RGBA(235, 130, 0, 1),       // Orange
        "Approved",     RGBA(22, 101, 52, 1),       // Green
        "Rejected",     RGBA(155, 47, 35, 1),       // Red
        "Closed",       RGBA(80, 80, 80, 1),        // Dark gray
        "Archived",     RGBA(150, 150, 150, 1),     // Light gray
        RGBA(0, 0, 0, 1)                            // Default black
    )
```

---

## fxITStatusColor

Returns color for MainDB_IT currentStatus (plain string — 60 values).

```powerfx
// DRAFT_FORMULA
fxITStatusColor(statusText) =
    If(statusText = "Approved" Or statusText = "Closed",
        RGBA(22, 101, 52, 1),       // Green
    If(statusText = "Rejected" Or statusText = "Withdrawn",
        RGBA(155, 47, 35, 1),       // Red
    If(statusText = "Draft",
        RGBA(120, 120, 120, 1),     // Gray
    If(StartsWith(statusText, "Pending"),
        RGBA(235, 130, 0, 1),       // Orange
        RGBA(23, 82, 168, 1)        // Blue (default)
    ))))
```

---

## fxDeptLabel

Converts MainDB_FIN departmentKey code to display label.
Source: `main-dbfin-model.ts` `MainDBFINDepartmentKeyToLabel` — CONFIRMED

```powerfx
// DRAFT_FORMULA — confirmed key values from main-dbfin-model.ts
fxDeptLabel(deptKey) =
    Switch(deptKey,
        "DepartmentKey00", "ADM",
        "DepartmentKey01", "EI",
        "DepartmentKey02", "ENG",
        "DepartmentKey03", "FIN",
        "DepartmentKey04", "HR",
        "DepartmentKey05", "IT",
        "DepartmentKey06", "LOG",
        "DepartmentKey07", "MKT",
        "DepartmentKey08", "MTN",
        "DepartmentKey09", "PBI",
        "DepartmentKey10", "PRD",
        "DepartmentKey11", "PUR",
        "DepartmentKey12", "QA",
        "DepartmentKey13", "QC",
        "DepartmentKey14", "RD",
        "DepartmentKey15", "SEC",
        "DepartmentKey16", "SHE",
        "DepartmentKey17", "STR",
        "DepartmentKey18", "TD",
        "DepartmentKey19", "WH",
        "Unknown"
    )
```

---

## fxCompanyLabel

Converts MainDB_FIN companyKey code to display label.
Source: `main-dbfin-model.ts` `MainDBFINCompanyKeyToLabel` — CONFIRMED

```powerfx
// DRAFT_FORMULA
fxCompanyLabel(companyKey) =
    Switch(companyKey,
        "CompanyKey0", "IOI Corporation Berhad",
        "CompanyKey1", "IOI Oleochemical Industries Berhad",
        "CompanyKey2", "Other",
        ""
    )
```

---

## fxUserHasRole

Returns true if the current user has the specified role for the given dept.
Uses colUserRoleAssignments loaded in App.OnStart.

```powerfx
// DRAFT_FORMULA — confirmed SP column names: RoleKey, DepartmentCodeScope, IsActiveAssignment
// RoleKey values themselves are MISSING_INFO — replace placeholders before use

fxUserHasRole(roleKey, deptCode) =
    CountIf(
        colUserRoleAssignments,
        RoleKey = roleKey
        And (IsBlank(DepartmentCodeScope) Or DepartmentCodeScope = deptCode)
        And IsActiveAssignment = true
    ) > 0

// Usage: fxUserHasRole("MISSING_INFO_HOD_ROLEKEY", "HR")
```

---

## fxGetListName

Returns the SP list name for a given dept code.
Canvas cannot use dynamic list names in Patch/Filter — this formula is used for display and documentation only.
In actual Patch formulas, use an If/Switch to select the correct data source.

```powerfx
// DRAFT_FORMULA — documentation/display only; not for use in Patch()
fxGetListName(deptCode) =
    Switch(deptCode,
        "FIN",  "MainDB_FIN",
        "HR",   "MainDB_HR",
        "IT",   "MainDB_IT",
        "QA",   "MainDB_QA",
        "QC",   "MainDB_QC",
        "PUR",  "MainDB_PUR",
        "SHE",  "MainDB_SHE",
        "STR",  "MainDB_STR",
        "PRD",  "MainDB_PRD",
        "LOG",  "MainDB_LOG",
        "MKT",  "MainDB_MKT",
        "ADM",  "MainDB_ADM",
        "SEC",  "MainDB_SEC",
        "MTN",  "MainDB_MTN",
        "EI",   "MainDB_EI",
        "ENG",  "MainDB_ENG",
        "TD",   "MainDB_TD",
        "WH",   "MainDB_WH",
        "Unknown"
    )
```

---

## fxGetHistoryListName

Returns the ApprovalHistory list name for a given dept.
Canvas cannot use dynamic list names — use an If/Switch in actual Patch formulas.

```powerfx
// DRAFT_FORMULA — documentation only
fxGetHistoryListName(deptCode) =
    Switch(deptCode,
        "HR",  "ApprovalHistory_HR",
        "QA",  "ApprovalHistory_QA",
        "STR", "ApprovalHistory_STR",
        "SHE", "ApprovalHistory_SHE",
        // MISSING_INFO: FIN, IT, QC, PUR, MTN etc. — confirm existence
        "MISSING_INFO"
    )
```
