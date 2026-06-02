# 03 — Field Mapping

## Purpose
Maps every form field from the Domino/PDF source to its Canvas control, SharePoint column, validation rule, and default value. This folder drives the field-by-field implementation of all Canvas forms.

## What Belongs Here
- Form field to Canvas control to SP column mapping, one section per form (`field-to-control-matrix.md`)
- Per-field validation rules with Power Fx pattern (`field-validation-rules.md`)
- Confirmed default value rules per field type (`field-default-values.md`)

## What Does NOT Belong Here
- Workflow or role rules
- Screen layout or navigation
- Component architecture
- Unconfirmed SP column names (these go in `02-sharepoint-schema/internal-name-checklist.md`)

## Source of Truth
- `source_analysis/10_master_app_sources/MASTER_FIELD_DICTIONARY.md` — 22,074 field rows (use for UI labels only; not SP internal names)
- `source_analysis/10_master_app_sources/requirements/` — per-form field extraction
- Confirmed SP column names from `02-sharepoint-schema/sharepoint-column-inventory.md`
- `mapping/field-mapping.md` — cross-reference (do not duplicate)

## Update Rules
- Add fields per form as each form's SP column names are confirmed
- Mark all SP internal names as CONFIRMED or MISSING_INFO
- Do not use PDF-extracted field names as SP internal names
- Complete the CAR form pilot mapping first before expanding to other forms
