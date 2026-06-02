# 00 — Project Control

## Purpose
Single source of truth for overall Canvas App migration status, build sequencing, decisions made, and open information gaps. Every person working on this project should start here.

## What Belongs Here
- Overall migration phase status (`migration-status.md`)
- Ordered build plan with current progress (`build-order.md`)
- Architecture and design decisions with rationale (`decision-log.md`)
- Open MISSING_INFO items that are blocking build (`missing-info-register.md`)

## What Does NOT Belong Here
- TSX code or references
- SharePoint column names or schema details
- Power Fx formulas
- Component or screen design details

## Source of Truth
- Canvas App Rebuild Design Report (produced in session)
- Audit and Fact-Check Report (produced in session)
- Corrected Canvas App Data Model and Formula Reference (produced in session)

## Update Rules
- `migration-status.md` — update whenever a phase or blocker status changes
- `build-order.md` — update after each completed build step
- `decision-log.md` — add entry whenever an architectural or design decision is made; never delete old entries
- `missing-info-register.md` — mark items RESOLVED with date and resolution; never delete rows
