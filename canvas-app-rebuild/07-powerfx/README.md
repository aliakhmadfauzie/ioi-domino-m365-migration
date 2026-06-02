# 07 — Power Fx Formulas

## Purpose
All confirmed and draft Power Fx formulas, organized by purpose. This is the central formula library for the Canvas App. Every formula here must use confirmed SP column names from `02-sharepoint-schema/`.

## What Belongs Here
- App.OnStart formula (`app-onstart.md`)
- Named formulas (`named-formulas.md`)
- Patch (write) formulas for all workflow actions (`patch-formulas.md`)
- Validation formulas for required fields and business rules (`validation-formulas.md`)
- Visibility and DisplayMode formulas (`visibility-displaymode-formulas.md`)
- Delegation risk notes and safe Filter patterns (`delegation-risk-notes.md`)

## What Does NOT Belong Here
- YAML code (that goes in `08-canvas-yaml/`)
- Design decisions (that goes in `00-project-control/decision-log.md`)
- SP column definitions (that goes in `02-sharepoint-schema/`)

## Source of Truth
- Corrected Canvas App Data Model and Formula Reference Document (produced in session)
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/services/main-dbhr-service.ts` — confirmed SP column names
- `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/` — confirmed model files

## Update Rules
- ALL formulas start as DRAFT_FORMULA
- Change to TESTED only after verified against live SP list in Power Apps Studio
- Change to CONFIRMED only after end-to-end workflow test passes
- Never delete a formula — mark superseded ones as RETIRED with date and replacement reference
- Every formula must cite its SP column source

## Formula Status Labels
- `DRAFT_FORMULA` — not yet tested in Power Apps Studio
- `TESTED` — tested against live SP list; no regression issues found
- `CONFIRMED` — end-to-end workflow verified; UAT passed
- `RETIRED` — superseded; do not use
