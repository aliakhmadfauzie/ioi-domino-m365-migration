# 04 — Workflow and Role Rules

## Purpose
Business rules contract for workflow state machines and role access. This folder defines WHAT the app does, not HOW it does it technically. All Canvas workflow logic must trace back to a confirmed rule in this folder.

## What Belongs Here
- Confirmed status transitions per form and per list (`workflow-state-matrix.md`)
- Role-to-screen and role-to-action access rules (`role-access-matrix.md`)
- Which forms require approval and which do not (`approval-requirement-matrix.md`)
- Section visibility rules by mode, role, and status (`section-visibility-matrix.md`)

## What Does NOT Belong Here
- Power Fx formula code (that goes in `07-powerfx/`)
- SP column names (that goes in `02-sharepoint-schema/`)
- Canvas component details (that goes in `06-components/`)

## Source of Truth
- `analysis/source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md` — 361-form approval status
- `analysis/source_analysis/04_workflow_register/` — per-form workflow extraction
- `analysis/source_analysis/05_role_section_rules/` — section visibility rules
- `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/hr/awhr/detail.tsx` — AWHR confirmed stage transitions
- `Config_GlobalUserRoleAssignments` SP list — role assignments source of truth

## Update Rules
- Confirm each workflow rule against the Domino PDF source before marking CONFIRMED
- RoleKey values must come from live `Config_GlobalUserRoleAssignments` SP list data
- Add per-form workflow detail as each form is built — do not assume generic rules apply
