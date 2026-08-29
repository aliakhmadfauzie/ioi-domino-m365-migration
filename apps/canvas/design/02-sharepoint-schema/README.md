# 02 — SharePoint Schema

## Purpose
Confirmed SharePoint list and column inventory. This folder is the data contract for all Canvas App formulas. Nothing is invented here — every entry must be confirmed from generated model files, service wrapper files, or SP admin export.

## What Belongs Here
- All confirmed SP list names (`sharepoint-list-inventory.md`)
- All confirmed SP column names with SP REST name, type, and required flag (`sharepoint-column-inventory.md`)
- Checklist of columns that must still be verified against live SP before Patch formulas are finalized (`internal-name-checklist.md`)

## What Does NOT Belong Here
- PDF-extracted field names used as SP internal names (these are UNCONFIRMED and must not be treated as SP column names)
- Canvas control names or component names
- Power Fx formulas

## Source of Truth
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/` — generated model files (primary)
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/services/main-dbhr-service.ts` — confirmed LOWER_TO_SHAREPOINT mapping
- `mapping/field-mapping.md` and `mapping/field-mapping.csv` — cross-reference only; do not duplicate
- `design/m365-design/sharepoint-list-design.md` — cross-reference only
- `analysis/design-requirement/sharepoint-migration.md` — cross-reference only

## Update Rules
- Add confirmed column names only after verifying against model file or live SP export
- Mark unconfirmed items as `MISSING_INFO` with date added
- When confirmed, mark with source and date
- Never remove a row — mark superseded items as RETIRED

## Critical Warning
The MASTER_FIELD_DICTIONARY.md contains PDF-extracted field labels, NOT confirmed SP column internal names. Do not use PDF-extracted names in Patch formulas until verified.
