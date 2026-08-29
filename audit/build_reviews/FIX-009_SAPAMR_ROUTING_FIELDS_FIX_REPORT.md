# FIX-009 SAPAMR Routing Field Persistence Fix Report

## Task Selected

| Field | Value |
|---|---|
| Task ID | TASK-FIX-009 |
| Fix ID | FIX-009 |
| Department | IT |
| Form | SAPAMR |
| Priority | P0 |
| Type | Patch Mapping Issue / SharePoint Field Missing |
| Human Decision | Option B selected by user: provision SAPAMR routing fields on `MainDB_IT_Ext_SAP` |

## Why Allowed

| Check | Result |
|---|---|
| Blocking rules | No violation — provisioning script handles SharePoint schema; app code changes avoid guessed internal names through model fields matched to provisioned columns |
| Human decision | `IT-SAPAMR-SCHEMA-01` answered: Option B (Ext_SAP) |
| Existing code compiles | `npx tsc --noEmit` passes |

## Finding

SAPAMR `new.tsx` wrote routing fields (`sAPAMRTBVEmail`, `sAPAMRTBAEmail`, `sAPAMRTBV1Email`-`sAPAMRTBV5Email`) as model properties on `MainDB_IT` create payload, but `MainDBITService.denormalize()` did not map those properties to any SharePoint columns. The captured `maindb_it.Schema.json` and `maindb_it_ext_sap.Schema.json` had no `SAPAMR_*` columns.

Root cause: The fields were declared in the `MainDBIT` model (generated) but the service's `denormalize()` function only maps explicitly listed properties. The form tried to write routing data to parent columns that don't exist in SharePoint.

## Work Performed

### 1. Provisioning Script Created
`scripts/sharepoint/provision-sapamr-ext-sap.ps1`
- Connects to `https://ioioi.sharepoint.com/sites/ioi-portal-it`
- Adds 7 Text columns to `MainDB_IT_Ext_SAP`: `SAPAMR_TBVEmail`, `SAPAMR_TBAEmail`, `SAPAMR_TBV1Email` through `SAPAMR_TBV5Email`
- **Requires manual execution** (see notes below)

### 2. ExtSAP Model Updated
`src/generated/models/main-dbit-ext-sap-model.ts`
- Added 7 new fields matching provisioned SharePoint columns:
  - `sAPAMRTBVEmail` (SAPAMR TBVEmail)
  - `sAPAMRTBAEmail` (SAPAMR TBAEmail)
  - `sAPAMRTBV1Email` through `sAPAMRTBV5Email` (SAPAMR TBV1Email–TBV5Email)

### 3. SAPAMR Submit Updated
`src/pages/it/forms/sapamr/new.tsx`
- Added `useCreateMainDBITExtSAP` hook
- After creating `MainDB_IT` parent, now creates an `ExtSAP` child record with all routing fields
- Removed `sAPAMR*` fields from parent `MainDB_IT` create payload (these were never denormalized)
- Remarks JSON storage preserved for UI fallback

### 4. SAPAMR List/Detail Updated
`src/pages/it/forms/sapamr/index.tsx`
- Added `useMainDBITExtSAPList` hook to fetch ExtSAP child records
- Added `extByParentId` lookup map
- TBV/TBA values now prefer ExtSAP child data with remarks fallback
- Detail modal TBV_1–TBV_5 display reads from ExtSAP child (with remarks fallback)

## Files Changed

| File | Change |
|---|---|
| `scripts/sharepoint/provision-sapamr-ext-sap.ps1` | **Created** — PnP provisioning script |
| `src/generated/models/main-dbit-ext-sap-model.ts` | **Updated** — Added 7 `sAPAMR*` fields |
| `src/pages/it/forms/sapamr/new.tsx` | **Updated** — Creates ExtSAP child with routing fields |
| `src/pages/it/forms/sapamr/index.tsx` | **Updated** — Reads ExtSAP child data, prefers structured fields over remarks |

## Required Human Action

Before the fix is fully operational, the provisioning script must be run:

```powershell
.\scripts\sharepoint\provision-sapamr-ext-sap.ps1
```

This will add the 7 `SAPAMR_*` Text columns to the `MainDB_IT_Ext_SAP` SharePoint list. After provisioning, if desired, run `pac powerpages schema` or export from Power Platform to regenerate the schema JSON.

## Verification

- `npx tsc --noEmit` passed from `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform` with zero errors.
- New SAPAMR submissions will create ExtSAP child records with routing fields (once columns are provisioned).
- Existing records fall back to `remarks` JSON parsing.

## Result

**Fixed — Pending SharePoint Provisioning.** App code is ready. Once `provision-sapamr-ext-sap.ps1` executes and columns exist in SharePoint, new submissions will persist routing data to structured `SAPAMR_*` columns on `MainDB_IT_Ext_SAP`.

## Next Steps

1. User runs `.\scripts\sharepoint\provision-sapamr-ext-sap.ps1`
2. Regenerate schema/model via PAC or Power Platform export
3. Submit a test SAPAMR record and verify ExtSAP child is created with routing fields
4. Re-audit to confirm persistence works end-to-end
