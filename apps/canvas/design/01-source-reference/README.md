# 01 — Source Reference

## Purpose
Read-only index of all reference material used to design the Canvas App. Nothing in this folder is built from. Everything in this folder points to where source material lives.

## What Belongs Here
- Index of all TSX pages, components, and services relevant as Canvas reference (`tsx-reference-index.md`)
- Index of all 361 Domino PDF source requirement files (`domino-source-index.md`)
- Traceability matrix linking form codes to Domino source, TSX reference, Canvas screen, and SP list (`source-traceability-matrix.md`)

## What Does NOT Belong Here
- Actual TSX source files (those live in `apps/code-first/ioicodeapp/powerapps-mirror/`)
- Canvas implementation files
- Power Fx formulas
- SharePoint schema

## Source of Truth
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/` — TSX reference app
- `analysis/source_analysis/10_master_app_sources/requirements/` — 361 per-form Domino source docs
- `analysis/source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md`
- `analysis/source_analysis/10_master_app_sources/MASTER_POWERAPPS_SPEC_REGISTER.md`
- `analysis/source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md`

## Update Rules
- Add new TSX files to the index as they are reviewed; mark each as USED_AS_REFERENCE or RETIRED
- Add new Domino source docs as they are extracted
- Update traceability matrix when a form's Canvas screen is confirmed

## Important Note
`design/m365-design/powerapps-design.md` describes the TSX code-first app, NOT the Canvas App target. It is SUPERSEDED by the Canvas App rebuild design report. Do not use it as a design reference.
