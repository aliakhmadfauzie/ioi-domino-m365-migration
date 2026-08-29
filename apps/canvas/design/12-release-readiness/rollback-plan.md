# Rollback Plan

> Steps to revert to the previous Domino system if the Canvas App deployment fails.
> Review and confirm this plan before every production deployment.
> Last updated: 2026-06-02

---

## Rollback Trigger Conditions

Initiate rollback if ANY of the following occur within the first [TBD] weeks of production:

| Trigger | Description |
|---|---|
| Data loss | Any SP record is lost, corrupted, or inaccessible |
| SP write failures | Patch formulas consistently fail to write to SP |
| Approval chain broken | Workflow actions do not advance records correctly |
| Access control failure | Users gaining unauthorized access to records |
| Performance failure | App takes > 15 seconds to load any gallery with normal data volume |
| Critical bug affecting > 50% of users | A defect blocks multiple depts from using core functions |

---

## Rollback Steps

### Immediate Response (0–2 hours)

| Step | Action | Owner |
|---|---|---|
| 1 | Communicate to all users: "Canvas App is temporarily suspended; use Domino forms until further notice" | IT Admin |
| 2 | Unpublish or restrict Canvas App access | IT Admin |
| 3 | Verify Domino forms are still accessible and functional | IT Admin |
| 4 | Document the trigger event in issue-log.md | IT Admin |

### Parallel Run Rollback (within 24 hours)

| Step | Action | Owner |
|---|---|---|
| 5 | Identify all records created in Canvas App (SP) since go-live | IT Admin |
| 6 | For each SP record, confirm whether a corresponding Domino record exists | IT/Dept |
| 7 | If SP-only records exist: export from SP and create in Domino to ensure continuity | Dept coordinators |
| 8 | Confirm Domino workflow is fully active for all pending approvals | IT/HODs |

### Recovery (within 1 week)

| Step | Action | Owner |
|---|---|---|
| 9 | Root cause analysis of rollback trigger | IT Admin |
| 10 | Fix the issue in Canvas App test environment | IT Admin |
| 11 | Regression test all affected functionality | IT + UAT |
| 12 | Re-release after confirmed fix | IT Admin |

---

## Data Safety Notes

1. **Domino forms stay live during parallel run** — this is the primary rollback option
2. **SP records are not deleted during rollback** — they remain in SP and can be reconciled after fix
3. **No destructive SP operations** during rollback — only access restriction
4. **SP backup** — confirm with SP Admin that SP list backup/versioning is enabled before go-live

---

## Contact List (Fill before go-live)

| Role | Name | Contact |
|---|---|---|
| IT Admin | | |
| SP Admin | | |
| HR HOD | | |
| FIN HOD | | |
| IT Project Manager | | |
| Domino Support Contact | | |
