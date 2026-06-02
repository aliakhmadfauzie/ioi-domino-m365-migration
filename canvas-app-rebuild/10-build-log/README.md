# 10 — Build Log

## Purpose
Living record of what has been built, what is currently in progress, and what is queued next. Updated after every build session.

## What Belongs Here
- Completed build steps with date and status (`completed-work.md`)
- Current active build batch with in-progress items (`current-batch.md`)
- Next queued batch with dependencies (`next-batch.md`)

## What Does NOT Belong Here
- Design documents
- Test results (those go in `09-testing/`)
- Risk and issue tracking (that goes in `11-risk-and-issues/`)

## Source of Truth
- `00-project-control/build-order.md` — the master ordered build plan
- Power Apps Studio — actual build state

## Update Rules
- Update `current-batch.md` at the start of every build session
- Move completed items from `current-batch.md` to `completed-work.md` when done
- Update `next-batch.md` after completing each batch
- Do not mark an item as completed if it has not been tested in Power Apps Studio
