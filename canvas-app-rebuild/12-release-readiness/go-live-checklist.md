# Go-Live Checklist

> Final checklist before production deployment.
> All pre-release checklist items must be PASS.
> All UAT sign-offs must be complete.
> Last updated: 2026-06-02

---

## 1. Pre-Requisites

| # | Check | Status |
|---|---|---|
| 1.1 | All items in pre-release-checklist.md = PASS | [ ] |
| 1.2 | All CRITICAL and HIGH issues in issue-log.md = RESOLVED | [ ] |
| 1.3 | All UAT sign-offs in 09-testing/user-acceptance-test.md = PASS (all depts) | [ ] |
| 1.4 | IT Admin has confirmed production SP site permissions for all users | [ ] |
| 1.5 | Config_GlobalUserRoleAssignments populated with all production user role assignments | [ ] |

---

## 2. Production Environment Setup

| # | Check | Status |
|---|---|---|
| 2.1 | Canvas App published to production Power Apps environment | [ ] |
| 2.2 | SP data source URLs in Canvas App point to production SP (not test/dev) | [ ] |
| 2.3 | All required SP columns indexed in production SP lists | [ ] |
| 2.4 | Canvas App shared with all end users (or published to org) | [ ] |
| 2.5 | Canvas App accessible via Power Apps mobile app and browser | [ ] |

---

## 3. Parallel Run Period

| # | Check | Status |
|---|---|---|
| 3.1 | Domino forms remain LIVE during parallel run | [ ] |
| 3.2 | Pilot users (HR + FIN + IT) using Canvas App for new submissions | [ ] |
| 3.3 | Data consistency check: compare SP records with Domino records weekly | [ ] |
| 3.4 | Parallel run duration confirmed: minimum [TBD] weeks | [ ] |

---

## 4. Training and Communication

| # | Check | Status |
|---|---|---|
| 4.1 | End user training sessions completed for all depts | [ ] |
| 4.2 | HOD and approver training completed (approval workflow walkthrough) | [ ] |
| 4.3 | IT Admin training completed (Config_GlobalUserRoleAssignments management) | [ ] |
| 4.4 | User guide / quick reference card distributed | [ ] |
| 4.5 | Support contact identified for post-go-live issues | [ ] |

---

## 5. Final Sign-Off

| Approver | Name | Date | Signature |
|---|---|---|---|
| IT Project Manager | | | |
| IT Admin | | | |
| HR HOD | | | |
| FIN HOD | | | |
| IT HOD | | | |
| At least 2 additional dept HODs | | | |
