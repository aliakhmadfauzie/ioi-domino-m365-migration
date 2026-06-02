# HR Power Apps Build Plan

> **Date**: 2026-06-01 | **Source**: `HR_POWERAPPS_BUILD_SPEC.md`, `HR_SCHEMA_VALIDATION_REPORT.md`
> **App**: IOI Platform (React 19 + TypeScript + Vite + shadcn/ui)

## 1. Build Order

| # | Form | Reason | Status |
|---|---|---|---|
| 1 | **CIR** | No workflow — validate basic HR pattern | ✅ Ready |
| 2 | **DRD** | 3-stage workflow — validate approval pattern | ✅ Ready |
| 3 | **BSD** | Child list pattern (Ext_BSD) | ✅ Ready |
| 4 | **CWR** | Complex 4-stage + dual sections + periods child | ✅ Ready |
| 5 | **EEN** | Largest form (51 columns), multi-stage | ✅ Ready |
| 6 | **AWHR** | Preliminary — HR stage pending | ⚠️ |

## 2. Screen List — 33 Screens

| Form | New | List | Detail | Approval Screens | Total |
|---|---|---|---|---|---|
| CIR | 1 | 1 | 1 | 0 | 3 |
| DRD | 1 | 1 | 1 | 2 (HOS, HOD) | 5 |
| BSD | 1 | 1 | 1 | 1 (HOD) | 4 |
| CWR | 1 | 1 | 1 | 4 | 7 |
| EEN | 1 | 1 | 1 | 3 (ED, HOD, HR) | 6 |
| AWHR | 1 | 1 | 1 | 3 (HOS, HOD, HR) | 6 |

## 3. Shared Components

| Component | Used By |
|---|---|
| `DynamicFormRenderer` | All New/Edit screens |
| `ApprovalPanel` | DRD, BSD, CWR, EEN, AWHR |
| `EditableTable` | BSD, AWHR, CWR (child galleries) |
| `WorkflowTimeline` | All approval forms |
| `StatusBadge` | All forms |
| `PeoplePicker` | All forms |

## 4. Reusable Patterns

### Form Layout
```
/{dept}/forms/{formCode}/
  new.tsx       → Create
  index.tsx     → List
  [id].tsx      → Detail
```

### Data Source
```typescript
const listName = 'MainDB_HR';
const formCode = 'CIR'; // per-form discriminator
```

### Submit/Patch
```typescript
Patch(MainDB_HR, {
  FormCode: 'CIR',
  cirSite, cirInspector, cirInsDate, ...
  cirCurrentAction: 'Submitted'
})
```

## 5. Form-Specific Build Instructions

### CIR (Build #1)
- No workflow
- 14 columns
- CurrentAction: Submitted → Accepted
- Validate: basic pattern

### DRD (Build #2)
- 3-stage: HOS → HOD → HR
- 27 columns
- Shift code lookup from Config_ShiftCodes
- Validate: approval pattern

### BSD (Build #3)
- 2-stage: HOD only
- 19 parent + Ext_BSD child
- Child gallery: EditableTable
- Validate: child list pattern

### CWR (Build #4)
- 4-stage: HOD → DivHead → AGM HR → Requestor
- 47 parent + Ext_CWR_Periods child
- Dual sections (Perm + Shutdown)
- Validate: complex multi-stage

### EEN (Build #5)
- Multi-stage: ED → HOD → IT → Withdraw
- 51 columns, 8 pages equivalent
- Exit interview embedded
- Validate: large form pattern

### AWHR (Build #6)
- 3-stage: HOS → HOD → HR
- HR stage pending confirmation
- Build with placeholder HR screen

## 6. UAT Sequence

| # | Form | Scenarios |
|---|---|---|
| 1 | CIR | Create, submit, list, detail — no workflow |
| 2 | DRD | Full 3-stage approval cycle |
| 3 | BSD | HOD approval + child gallery |
| 4 | CWR | Full 4-stage cycle |
| 5 | EEN | ED approval, extension, IT notify, withdraw |
| 6 | AWHR | Preliminary — HR stage placeholder |

## 7. Build Status Summary

| Form | Ready? |
|---|---|
| CIR | ✅ Build Now |
| DRD | ✅ After CIR validated |
| BSD | ✅ After DRD validated |
| CWR | ✅ After BSD validated |
| EEN | ✅ After CWR validated |
| AWHR | ⚠️ Preliminary only |
