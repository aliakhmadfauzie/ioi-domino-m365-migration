# 05 — Screen Design

## Purpose
Canvas App screen inventory and detailed screen-level design. Defines all 15 canonical parameterized screens, their purpose, SP data connections, navigation, and build checklist.

## What Belongs Here
- All 15 Canvas screen definitions with purpose and SP mapping (`screen-inventory.md`)
- Screen-to-SharePoint read/write matrix (`screen-to-sharepoint-matrix.md`)
- Navigate() flow and global variable state at each transition (`screen-navigation-map.md`)
- Per-screen build checklist (`screen-build-checklist.md`)

## What Does NOT Belong Here
- Component internal implementation (that goes in `06-components/`)
- Power Fx formula code (that goes in `07-powerfx/`)
- YAML code (that goes in `08-canvas-yaml/`)

## Source of Truth
- Canvas App Rebuild Design Report — Phase 2 (Screen Inventory)
- `analysis/source_analysis/07_powerapps_spec/POWERAPPS_BUILD_SPEC_REGISTER.md` — cross-reference (do not duplicate)
- `analysis/source_analysis/07_powerapps_spec/HR_POWERAPPS_BUILD_SPEC.md` — cross-reference
- TSX pages in `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/` — reference only

## Update Rules
- Update `screen-build-checklist.md` after each screen is completed in Power Apps Studio
- Screen names are final after approval — do not rename screens mid-build
- All 15 screens must be listed; add notes if a screen is deferred

## Key Architecture Note
The Canvas App uses 15 canonical parameterized screens for 361 forms.
Navigation is driven by global variables: `gblActiveFormCode`, `gblActiveDept`, `gblActiveSite`, `gblActiveRecordID`, `gblFormMode`.
There are NO per-form separate screens.
