# HR SharePoint List Creation — Script Plan

> **Date**: 2026-06-01 | **Source**: `HR_SHAREPOINT_BUILD_PACKAGE.md`
> **Script**: `scripts/sharepoint/create-hr-lists.ps1` | **Execution**: NOT YET EXECUTED

## Script Architecture

```
1. Pre-checks        → Module availability, site connectivity
2. Connect           → PnP Online to target HR site
3. Create Config     → ShiftCodes, Companies (no dependencies)
4. Create Parent     → MainDB_HR (core list)
5. Create Children   → Ext_BSD, Ext_AWHR, Ext_CWR_Periods (lookup deps)
6. Create Workflow   → WorkflowHistory
7. Add Columns       → ~250 columns across all lists
8. Add Lookups       → ParentID relationships after parent exists
9. Add Indexes       → FormCode, ParentID columns
10. Seed Data        → 10 shift codes, 3 companies
11. Verification     → List/column counts, validation checklist
12. Summary          → Created, skipped, pending items
```

## Idempotency Strategy

| Condition | Action |
|---|---|
| List already exists | Skip list creation |
| Column already exists | Skip column creation |
| Column type mismatch | Log warning, skip |
| Lookup target missing | Log error, skip lookup creation |

## Pending HR Confirmation Handling

| Field | Strategy |
|---|---|
| Choice fields with unknown values | Create as Single line of text with `# PENDING_HR` comment |
| AWHR HR stage columns (awhrHRName, awhrHRDate) | Create as Person/DateTime with `# PENDING_HR` comment |
| Company full names | Seed with code only, mark full names as `# PENDING_HR` |

## Manual Values Required Before Execution

| Variable | Value Needed |
|---|---|
| `$SiteUrl` | Target SharePoint HR site URL |
| Company full names | YKS, YTC, NAGA full company names |

## Expected Output

```
HR List Creation Script
========================
Site: {tenant}/sites/HR

[1/7] Creating MainDB_HR_Config_ShiftCodes... OK (3 columns)
[2/7] Creating MainDB_HR_Config_Companies... OK (2 columns)
[3/7] Creating MainDB_HR... OK
      Added FormCode choice... OK
      Added CIR columns (14)... OK
      Added BSD columns (19)... OK
      Added AWHR columns (35)... OK (3 PENDING_HR)
      Added CWR columns (48)... OK (2 PENDING_HR)
      Added DRD columns (27)... OK (1 PENDING_HR)
      Added EEN columns (51)... OK (6 PENDING_HR)
[4/7] Creating MainDB_HR_Ext_BSD... OK (6 columns)
[5/7] Creating MainDB_HR_Ext_AWHR... OK (12 columns)
[6/7] Creating MainDB_HR_Ext_CWR_Periods... OK (7 columns)
[7/7] Creating MainDB_HR_WorkflowHistory... OK (10 columns)

Seeding data...
  ShiftCodes: 10 rows inserted
  Companies: 3 rows inserted

Indexing...
  FormCode: indexed
  ParentID (x4): indexed
  wfFormCode: indexed

Verification...
  Lists created: 7/7
  Total columns: ~250
  Pending HR: ~25
  Seed data: 13 rows

✅ Script complete.
```
