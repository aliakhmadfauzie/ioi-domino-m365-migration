# 12 — Release Readiness

## Purpose
Go/no-go checklists for UAT sign-off and production deployment. Nothing goes to production without every item in the go-live checklist confirmed.

## What Belongs Here
- Pre-release technical checklist (`pre-release-checklist.md`)
- Go-live deployment checklist (`go-live-checklist.md`)
- Rollback plan if production deployment fails (`rollback-plan.md`)

## What Does NOT Belong Here
- Active development work
- Test cases (those go in `09-testing/`)
- Build logs (those go in `10-build-log/`)

## Source of Truth
- `00-project-control/missing-info-register.md` — all items must be RESOLVED before go-live
- `09-testing/user-acceptance-test.md` — UAT sign-off required per department
- `11-risk-and-issues/` — all CRITICAL and HIGH items must be resolved before go-live

## Update Rules
- Checklists are append-only — do not remove items once added
- Mark each item: PENDING / PASS / FAIL / N/A
- Requires sign-off from IT Admin and at least one HOD per department before go-live
- Rollback plan must be reviewed and confirmed before every production deployment
