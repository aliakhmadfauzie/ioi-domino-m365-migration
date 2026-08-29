# HR Build Guardrails

Date: 2026-06-02
Task: `TASK-HR-BUILD-GUARDRAILS`
Owner: Migration Agent

## Purpose

This checkpoint locks the HR build rules after CIR passed strict re-audit and before DRD build preparation starts. It prevents later HR builds from bypassing the CIR baseline, the approved parent-plus-extension architecture, or the build/audit gates.

## Entry Evidence

| Evidence | Result |
|---|---|
| `audit/build_reviews/HR_CIR_RE_AUDIT_3.md` | CIR passed strict parent-plus-extension re-audit. |
| `analysis/source_analysis/09_reports/HR_SCHEMA_VALIDATION_REPORT.md` | DRD is structurally ready for build at 98/100 with zero P0/P1 blockers. |
| `analysis/source_analysis/09_reports/HR_POWERAPPS_BUILD_PLAN.md` | Approved HR order is CIR, DRD, BSD, CWR, EEN, AWHR. |
| `analysis/source_analysis/02_extracted_requirements/HR/SRC-HR-005_DRD_REQUIREMENTS.md` | DRD promoted at 98/100 with HOS -> HOD -> HR routing evidence and shift-code reference. |
| `analysis/source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md` | DRD parent columns and `MainDB_HR_Config_ShiftCodes` design are captured. |

## Guardrails

| # | Rule | Required Evidence |
|---:|---|---|
| 1 | Do not start DRD or any later HR app build unless CIR remains passed. | `audit/build_reviews/HR_CIR_RE_AUDIT_3.md` and queue status `TASK-RE-AUDIT-CIR = Complete`. |
| 2 | Preserve DEC-2026-008 for CIR: parent metadata in `MainDB_HR`; CIR-specific fields in `MainDB_HR_Ext_Cafeteria`. | CIR code/re-audit evidence, schema sync report, and accepted `cirTeamMembers2` mapping. |
| 3 | Keep non-approval HR forms out of generic approval UI and workflow-history paths. | For CIR and any future non-approval form, audit must verify no approval panel/actions are present. |
| 4 | Approval HR forms must implement explicit stage/state evidence before promotion. | Requirement file, schema export, page code, and workflow-history/write evidence. |
| 5 | Do not treat pending HR choices as confirmed. | Human confirmation questions must remain open/deferred unless answered. Affected fields can use neutral inputs only when the validation report allows it. |
| 6 | Use exported SharePoint internal names, not display labels or guessed legacy names. | Schema export or live `.power/schemas/sharepointonline` evidence. |
| 7 | Every app-source build/fix must be followed by `npx tsc --noEmit`. | TypeScript pass recorded in the build/fix/audit report. |
| 8 | Every HR build must produce a build audit, then fix/re-audit any P0/P1 issue before the next HR build starts. | `audit/build_reviews/` report plus queue/register update. |
| 9 | Child/extension lists must be used when the schema or decision log requires them. | Schema export and build audit proving parent-child write/read linkage. |
| 10 | Human blockers must block only the affected task/form, not unrelated safe preparation work. | Queue blocker row with explicit dependency and evidence. |

## DRD Entry Criteria

| Criterion | Status | Evidence |
|---|---|---|
| CIR baseline passed | Met | `audit/build_reviews/HR_CIR_RE_AUDIT_3.md` |
| HR build guardrails captured | Met | This document |
| DRD promoted requirement exists | Met | `analysis/source_analysis/02_extracted_requirements/HR/SRC-HR-005_DRD_REQUIREMENTS.md` |
| DRD schema validation clean | Met | `analysis/source_analysis/09_reports/HR_SCHEMA_VALIDATION_REPORT.md` |
| DRD has no P0/P1 human blockers | Met | `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` |
| Shift codes captured | Met | `analysis/source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md` |
| Build order allows DRD next | Met | `analysis/source_analysis/09_reports/HR_POWERAPPS_BUILD_PLAN.md` |

## Result

`TASK-HR-BUILD-GUARDRAILS` is complete. The next safe task is `TASK-PREP-DRD-BUILD`, which should prepare the DRD implementation package before any DRD app-source build begins.

