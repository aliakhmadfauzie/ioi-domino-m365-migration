# DRD Build Preparation Report

Date: 2026-06-02
Task: `TASK-PREP-DRD-BUILD`
Department: HR
Form: DRD — Duty Roster Database

## Task Selected

| Field | Value |
|---|---|
| Task ID | `TASK-PREP-DRD-BUILD` |
| Type | Progress Register Update |
| Priority | P0 |
| Department | HR |
| Form | DRD |

## Why Allowed

- `TASK-RE-AUDIT-CIR` is complete and CIR passed strict parent-plus-extension re-audit.
- `TASK-HR-BUILD-GUARDRAILS` is complete and records the HR build gates.
- `HR_SCHEMA_VALIDATION_REPORT.md` classifies DRD as Ready for Build at 98/100 with zero P0/P1 blockers.
- `HUMAN_CONFIRMATION_QUESTIONS.md` records DRD with zero open blocking questions; `DRD-02` is P2/deferred.
- `HR_POWERAPPS_BUILD_PLAN.md` places DRD immediately after CIR in the approved HR build order.
- The selected task is a progress/prep checkpoint, so no app source changes are allowed or required in this pass.

## Work Performed

- Verified DRD source requirements, field list, workflow stages, and shift-code evidence.
- Verified DRD schema rows in the HR SharePoint schema export.
- Verified HR build guardrails and the CIR pass gate.
- Inspected the current HR app route/page structure to identify build insertion points.
- Prepared the actual DRD build scope and audit gates.

## Evidence

| Evidence | Finding |
|---|---|
| `analysis/source_analysis/02_extracted_requirements/HR/SRC-HR-005_DRD_REQUIREMENTS.md` | DRD promoted at 98/100; HOS -> HOD -> HR workflow and 10 shift codes extracted. |
| `analysis/source_analysis/06_sharepoint_design/HR_SHAREPOINT_SCHEMA_EXPORT.md` | DRD has 27 `drd*` parent columns on `MainDB_HR`; no child list required. |
| `analysis/source_analysis/09_reports/HR_SCHEMA_VALIDATION_REPORT.md` | DRD is Ready for Build; `drdCurrentAction` states are `Submitted`, `HOSApproved`, `HODApproved`, `Completed`. |
| `analysis/source_analysis/09_reports/HUMAN_CONFIRMATION_QUESTIONS.md` | `DRD-01` answered; `DRD-02` deferred P2 and does not block build prep. |
| `analysis/source_analysis/09_reports/HR_POWERAPPS_BUILD_PLAN.md` | DRD requires New, List, Detail, HOS approval, and HOD approval screens. |
| `analysis/source_analysis/09_reports/HR_BUILD_GUARDRAILS.md` | Build must preserve typecheck/build-audit/re-audit gates and avoid guessed internal names. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/hr-routes.tsx` | No dedicated `/hr/drd` route exists yet; `/hr/roster` currently points to a mock roster page. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbhr-model.ts` | Current generated model does not expose `drd*` fields; actual Build task must add/regenerate typed mappings or provide a documented typed payload layer. |

## Implementation Package

### Target App Paths

| Path | Action For Build Mode |
|---|---|
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/hr/drd/new.tsx` | Create DRD submission form. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/hr/drd/index.tsx` | Create DRD list/database view filtered by `FormCode = DRD`. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/hr/drd/detail.tsx` | Create detail page with stage-aware approval sections. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/hr-routes.tsx` | Add `/hr/drd`, `/hr/drd/new`, and `/hr/drd/detail/:id`; consider redirecting `/hr/roster` to `/hr/drd` or retiring the mock page only if safe. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/generated/models/main-dbhr-model.ts` and service/validator mappings | Add or regenerate DRD field mappings if the build writes typed `drd*` fields. |

### Parent List And Form Identity

| Item | Required Value |
|---|---|
| Parent list | `MainDB_HR` |
| Form discriminator | `FormCode = DRD` |
| Child list | None |
| Workflow history | `MainDB_HR_WorkflowHistory` for audit trail |
| Shift-code config | `MainDB_HR_Config_ShiftCodes` |

### DRD Field Map

| Requirement Field | SharePoint Internal Name | Build Note |
|---|---|---|
| Comp | `drdCompany` | Choice: YKS, YTC, NAGA from schema export. |
| Category | `drdCategory` | Choice: Both, Outsource Worker from schema export. |
| Dept | `drdDepartment` | Text. |
| Section | `drdSection` | Text. |
| HOS | `drdHOS` | Person picker. |
| HOD | `drdHOD` | Person picker. |
| CC | `drdCC` | Text or people/email input, matching available component support. |
| Month | `drdMonth` | Number, 1-12. |
| Year | `drdYear` | Number. |
| Attch | `drdAttch` | Attachment support if available; otherwise document deferred attachment handling. |
| Amend | `drdAmend` | P2 deferred choice; do not hardcode unconfirmed values beyond schema evidence. |
| Changes | `drdChanges` | Multiline text. |
| EmpName | `drdEmpName` | Person picker. |
| SubmittedBy | `drdSubmittedBy` | Current user at submit. |
| SubmittedDate | `drdSubmittedDate` | Current date/time at submit. |
| HOSName | `drdHOSName` | Written at HOS approval. |
| HOSDate | `drdHOSDate` | Written at HOS approval. |
| HOSRemark | `drdHOSRemark` | HOS approval comments. |
| HODName | `drdHODName` | Written at HOD approval. |
| HODDate | `drdHODDate` | Written at HOD approval. |
| HODRemark | `drdHODRemark` | HOD approval comments. |
| HRName | `drdHRName` | Written at HR processing/completion. |
| HRDate | `drdHRDate` | Written at HR processing/completion. |
| HOSApp | `drdHOSApp` | Boolean/system flag. |
| HODApp | `drdHODApp` | Boolean/system flag. |
| HRApp | `drdHRApp` | Boolean/system flag. |
| CA | `drdCurrentAction` | `Submitted -> HOSApproved -> HODApproved -> Completed`. |

### Workflow Package

| Stage | Actor | Entry State | Action | Exit State | Required Writes |
|---|---|---|---|---|---|
| Submit | Requester | New/draft | Submit roster | `Submitted` | DRD header fields, `drdSubmittedBy`, `drdSubmittedDate`, `drdCurrentAction`. |
| HOS approval | Section Head | `Submitted` | Approve with remark | `HOSApproved` | `drdHOSName`, `drdHOSDate`, `drdHOSRemark`, `drdHOSApp`, workflow history row. |
| HOD approval | Department Head | `HOSApproved` | Approve with remark | `HODApproved` | `drdHODName`, `drdHODDate`, `drdHODRemark`, `drdHODApp`, workflow history row. |
| HR processing | HR | `HODApproved` | Complete/receive | `Completed` | `drdHRName`, `drdHRDate`, `drdHRApp`, workflow history row. |

### Shift-Code Package

Build must expose the 10 extracted shift codes: OFC, OFO, N1, A1, A2, B1, C1, 7A1, 7A2, 7P1. The preferred source is `MainDB_HR_Config_ShiftCodes`; if the config service is not wired during the first build, use a clearly marked local constant and keep a follow-up task for config-list readback.

## Audit Gates For DRD Build

| Gate | Required Result |
|---|---|
| Field coverage | All 27 DRD schema fields are represented, persisted, or explicitly justified. |
| FormCode filter | List/detail read only DRD records from `MainDB_HR`. |
| Workflow | DRD must not use generic final Approved status on initial submit. |
| Workflow history | HOS, HOD, and HR actions create/read audit trail evidence. |
| Shift codes | UI exposes the 10 confirmed shift codes. |
| No guessed names | App writes exported `drd*` internal names only. |
| TypeScript | `npx tsc --noEmit` passes after app source changes. |
| Build audit | Create `audit/build_reviews/HR_DRD_BUILD_AUDIT.md` before unlocking BSD. |

## Result

`TASK-PREP-DRD-BUILD` is complete. The next safe task is `TASK-BUILD-HR-DRD` in Build mode.

## Queue Updates

- `TASK-PREP-DRD-BUILD`: Ready -> Complete
- `TASK-BUILD-HR-DRD`: Blocked -> Ready
- `TASK-NEXT-BUILD`: remains blocked for all non-DRD HR builds until DRD build/audit passes

## Next Recommended Task

Run `TASK-BUILD-HR-DRD`.

