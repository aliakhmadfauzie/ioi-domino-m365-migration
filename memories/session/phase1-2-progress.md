# Phase 1 & 2 Implementation Progress — 2026-05-31

## Phase 1 — Critical Data Integrity Fixes ✅ Complete

### Fix 1.1 — EAFDetails reads ExtAccess instead of NIR/PRF (CRIT-01)
- ✅ Updated `components/submission-details/index.tsx`:
  - Added imports for `MainDBITExtAccess` and `MainDBITExtSupport` types
  - Added `Settings` icon import
  - Updated `DynamicSubmissionDetailsProps` to accept `extAccessRecords` and `extSupportRecords`
  - Rewrote `EAFDetails({ s })` → `EAFDetails({ s, extAccess })`
  - Now reads: `extAccess.eAFApplication`, `eAFSystemName`, `eAFDeptHeadEmail`, `eAFDeptHeadStatus`, `eAFITManagerApprovedBy`, etc.
  - No longer reads: `s.nIRFullName`, `s.nIRDepartment`, `s.subject`, `s.nIRRequestType`, `s.pRFITApprovedEmail`, `s.pRFITApprovedDate`, `s.pRFDeptManagerEmail`
  - Added IT Configuration section when `eAFITConfigStatus` is present
- ✅ Updated `pages/submissions/[id].tsx`:
  - Added imports for `useMainDBITExtAccessList` and `useMainDBITExtSupportList`
  - Added fetches for ext access/support records
  - Passes them to `DynamicSubmissionDetails`
- ✅ Fixed `structuredFields` sidebar (HIGH-03):
  - All form-specific fields wrapped in `if (submission.formcode === '...')` blocks
  - EAF no longer shows NIR/PRF/RS fields in sidebar

### Fix 1.2 — HRSubmissionService replaced with real SP writes (CRIT-02)
- ✅ Rewrote `services/hr-submission-service.ts`:
  - Removed all mock storage (`Map<string, HRSubmission>`, `mockIdCounter`, etc.)
  - All methods now delegate to `MainDBHRService` and `ApprovalHistoryHRService`
  - Added `ensureInitialized()` calls before each operation
  - Uses OData filters for `getAll()` instead of in-memory filtering
  - Approval history writes to real SharePoint via `ApprovalHistoryHRService`
  - Maintains same public API — callers don't need changes

## Phase 2 — Field Type & Mapping Fixes ✅ Complete

### Fix 2.1 — DATA_SOURCE_NAME casing (HIGH-08)
- ✅ Fixed `main-dbit-ext-access-service.ts`: `'MainDBITExtAccess'` → `'maindb_it_ext_access'`
- ✅ Fixed `main-dbit-ext-assets-service.ts`: `'MainDBITExtAssets'` → `'maindb_it_ext_assets'`
- ✅ Fixed `main-dbit-ext-sap-service.ts`: `'MainDBITExtSAP'` → `'maindb_it_ext_sap'`
- ✅ Fixed `main-dbit-ext-docs-service.ts`: `'MainDBITExtDocs'` → `'maindb_it_ext_docs'`
- ✅ Fixed `main-dbit-ext-infra-service.ts`: `'MainDBITExtInfra'` → `'maindb_it_ext_infra'`
- ✅ Fixed `main-dbit-ext-policy-service.ts`: `'MainDBITExtPolicy'` → `'maindb_it_ext_policy'`

### Fix 2.2 — Complete ExtAccess OData field mapping (MED-08)
- ✅ Added all EAF, NIR, RS, SFAR fields to `EXT_ACCESS_FIELD_MAP`
- ✅ Updated regex pattern to use `Object.keys().join('|')` for dynamic matching

### Fix 2.4 — Stable choice key validation layer (MED-03)
- ✅ Created `src/lib/choice-key-mapper.ts` with:
  - `validateChoiceKey()` — generic validator with warning logging
  - `validateCurrentStatusKey()`, `validateSiteKey()`, `validateEnvironmentTagKey()` — specific validators
  - `resolveCurrentStatusLabel()`, `resolveSiteLabel()`, `resolveEnvironmentTagLabel()` — label resolvers

### Fix 2.5 — EnvironmentTag write path verified (MED-09)
- ✅ Verified: `denormalize()` correctly uses `choiceValue(MainDBITEnvironmenttagKeyToLabel[...])` — writes `{ Value: 'Production' }` format. Correct.

## Phase 4 Quick Wins ✅

### HIGH-05 — Deprecated service removed from exports
- ✅ Commented out `export * from './sharepoint-submission-service'` in `services/index.ts`

### HIGH-04 / HIGH-07 — Data source mappings updated
- ✅ Fixed ITSSR entry: `sourceType: 'sharepoint'`, `connectionStatus: 'connected'`, service → `MainDBITService`
- ✅ Fixed NIR entry: same pattern

## Validation
- ✅ `npx tsc --noEmit` — passed with zero errors
