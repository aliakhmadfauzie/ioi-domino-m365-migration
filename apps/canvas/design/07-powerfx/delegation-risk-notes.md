# Delegation Risk Notes

> Canvas Power Apps can only delegate Filter/Sort operations to SharePoint for indexed columns.
> Non-delegable operations run locally with a 500-record default limit (extendable to 2000).
> This file documents all delegation risks and safe patterns for this app.
> Last updated: 2026-06-02

---

## What Delegation Means

- **Delegable:** SP processes the Filter on the server; all matching records returned
- **Non-delegable:** Canvas fetches up to 500 (or 2000) records locally, then filters — records beyond the limit are silently dropped
- For a list with 10,000 records and a limit of 500, a non-delegable filter may miss 9,500 records

---

## SP Delegation-Safe Operations

These operations are delegation-safe with the SharePoint connector:

| Operation | Notes |
|---|---|
| `Filter(list, column = value)` | Safe if column is indexed |
| `Filter(list, column in table)` | Safe |
| `Filter(list, column <> value)` | Safe if indexed |
| `Filter(list, StartsWith(column, text))` | Safe for text columns |
| `SortByColumns(list, "column", ...)` | Safe if indexed |
| `CountRows(Filter(...))` | Safe if filter is delegable |

---

## SP Delegation UNSAFE Operations (Avoid in galleries)

| Operation | Risk | Safe Alternative |
|---|---|---|
| `Filter(list, column contains text)` | NOT delegable | Use `StartsWith()` instead |
| `Filter(list, IsBlank(column))` | NOT delegable | Use `Filter(list, column = "")` |
| `Filter(list, column1 + column2 = value)` | NOT delegable | Add a computed column to SP |
| `Search(list, text, "col1", "col2")` | May not be delegable | Use indexed column with StartsWith |
| `CountIf(Filter(list, ...))` on non-indexed columns | NOT delegable | Use CountRows of delegable Filter |
| Complex nested Or conditions on multiple non-indexed columns | Risk | Simplify to indexed columns |

---

## Critical Columns to Index

The following SP columns MUST have column indexing enabled before the app is built.
Without these indexes, galleries will truncate data at 500/2000 records.

| Column | List | Required For | Priority |
|---|---|---|---|
| `FormCode` | All MainDB_ lists | Filter by form code (all screens) | P1 — CRITICAL |
| `Status` | All MainDB_ lists | Filter by status (approval queue, my submissions) | P1 — CRITICAL |
| `EntitySite` | All MainDB_ lists | Filter by site (all screens) | P1 — CRITICAL |
| `Requestor_Email` | All MainDB_ lists | Filter by submitter (scrMyRequests) | P1 — CRITICAL |
| `CurrentApprover_Email` | All MainDB_ lists | Approval queue (scrApprovalProcess) | P1 — CRITICAL |
| `Created` | All MainDB_ lists | Date range filters | P2 |
| `Title` | All MainDB_ lists | Search by StartsWith | P2 |

---

## Scale Risk by Department

| Dept | Form Count | Estimated Records (5yr) | Delegation Risk |
|---|---|---|---|
| QA | 80 forms | Potentially 50,000+ rows | HIGH — must index all key columns |
| QC | 41 forms | 20,000+ rows | HIGH |
| HR | 37 forms | 15,000+ rows | MEDIUM-HIGH |
| PUR | 29 forms | 10,000+ rows | MEDIUM |
| IT | 21 forms | 5,000+ rows | MEDIUM |
| All others | <20 forms each | Lower volume | LOWER |

---

## App Configuration for Delegation

In Power Apps Settings → Advanced Settings:
- **Data row limit for non-delegable queries:** Set to 2000 (maximum)
- This does not fix delegation issues; it only increases the local limit before truncation

---

## Recommended Gallery Filter Patterns

### Safe Pattern — scrFormList

```powerfx
// DRAFT_FORMULA — safe: all filter columns are indexed
ClearCollect(
    colRequests,
    SortByColumns(
        Filter(
            MainDB_HR,
            FormCode = gblActiveFormCode
            And EntitySite.Value = gblActiveSite
        ),
        "Created",
        SortOrder.Descending
    )
)
```

### Safe Pattern — Approval Queue

```powerfx
// DRAFT_FORMULA — safe: CurrentApprover_Email and Status are indexed
ClearCollect(
    colMyPendingApprovals,
    Filter(
        MainDB_HR,
        CurrentApprover_Email = gblCurrentUser.UserPrincipalName
        And (Status.Value = "Submitted" Or Status.Value = "Under Review")
    )
)
```

### Safe Pattern — My Submissions

```powerfx
// DRAFT_FORMULA — safe: Requestor_Email is indexed
ClearCollect(
    colMySubmissions,
    SortByColumns(
        Filter(MainDB_HR, Requestor_Email = gblCurrentUser.UserPrincipalName),
        "Created",
        SortOrder.Descending
    )
)
```

### Risky Pattern — Avoid

```powerfx
// AVOID — Text search with 'in' operator is not delegation-safe
// Filter(MainDB_HR, txtSearch.Text in Title)

// SAFE ALTERNATIVE — StartsWith with indexed Title
Filter(MainDB_HR,
    FormCode = gblActiveFormCode
    And (txtSearch.Text = "" Or StartsWith(Title, txtSearch.Text))
)
```

---

## MainDB_T&D Warning

The list name `MainDB_T&D` contains an ampersand character.
Power Apps may have difficulty registering this as a data source name.

**Recommended action:** Test the connection to `MainDB_T&D` before committing to this list name.
If issues occur, request SP Admin to create an alias list or rename the list to `MainDB_TD`.
