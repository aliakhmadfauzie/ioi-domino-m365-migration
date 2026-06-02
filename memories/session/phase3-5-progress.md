# Phase 3-5 Implementation Progress — 2026-05-31

## Phase 3 — Parent-Child & Workflow Resilience ✅

### Fix 3.1 — Rollback on child creation failure (MED-01)
- ✅ EAF `handleSubmit` now wraps child ExtAccess creation in try/catch
- ✅ On child failure, parent record is deleted via `MainDBITService.delete()`
- ✅ Imported `MainDBITService` in `pages/it/forms/eaf/new.tsx`
- ✅ Parent ID captured in local variable `parentId` for rollback reference

### Fix 3.3 — ITSSR section data storage refactored (MED-04)
- ✅ Renamed `buildITSSRRemarks()` → `buildITSSRRemarksSummary()` — now generates plain text summary only
- ✅ Removed JSON embedding (`[ITSSR_SECTION1_JSON]...[/ITSSR_SECTION1_JSON]`) from new submissions
- ✅ Removed `section1Snapshot()` function (no longer needed)
- ✅ Kept `parseITSSRRemarksSnapshot()` as backward-compatible fallback for legacy records
- ✅ Updated all call sites to use new function name

### Fix 3.2 and 3.4
- 3.2 (MED-02): Schema verification needs Phase 0 — deferred
- 3.4 (MED-06): Already completed in Fix 1.2 (HR service rewrite)

## Phase 4 — Deprecation Cleanup & Metadata (In Progress)

### Complete:
- ✅ HIGH-05: Deprecated `sharepoint-submission-service` removed from `services/index.ts` exports
- ✅ HIGH-04/07: ITSSR, NIR, DCAL, DRR, ITDR entries updated in `data-source-mapping.ts`
- ✅ LOW-05: Site key logging added in `main-dbit-site-service.ts`

### Remaining:
- ⏳ More `data-source-mapping.ts` entries still show `sourceType: 'in-memory'` (20 remaining IT form entries)
- ⏳ LOW-01: Form code registry (optional)
- ⏳ MED-07: Unit tests for filter translation (optional)

## Phase 5 — UI Label & Documentation ✅ Complete

### LOW-04 — HI PurchasePrice type safety
- ✅ Added type-safe conversion in `MainDBITService.denormalize()`: number-typed fields from `STRUCTURED_FIELD_MAP` now go through `num()` conversion before write
- ✅ This ensures `hIPurchasePrice` (and any future number field) is written as a proper number, not a formatted string

### LOW-06 — Power Automate ticket ID generation
- ✅ Created `flows/generate-ticket-id.json` — complete flow design document
- ✅ Format: `{FormCode}-{YYYYMM}-{000000}` (e.g., `EAF-202605-000042`)
- ✅ Trigger: When item created in MainDB_IT SharePoint list
- ✅ Steps: Initialize variables → Query last ticket → Parse sequence → Format → Update Title → Log

### LOW-02 — SharePoint schema reference
- ✅ Created `docs/sharepoint-schemas/schema-reference.md`
- ✅ Documents all lists across IT/HR/STR portals
- ✅ Documents form-specific prefix columns, choice field options, extension list relationships
- ✅ Template ready for Phase 0 schema export to populate actual column schemas

### LOW-03 — Dynamic form column audit template
- ✅ Created `docs/sharepoint-schemas/dynamic-form-column-audit.md`
- ✅ Audit table template for all form definitions
- ✅ Ready to populate after Phase 0 schema export

### LOW-01 — Form code registry
- ✅ Created `src/lib/form-code-registry.ts` — single source of truth for all form codes
- ✅ Grouped by department/ module (M1-M6, HR, STR)
- ✅ Includes `FORM_CODE_LABELS` display name map
- ✅ Includes `getFormLabel()` and `isValidFormCode()` helpers

## Validation
- ✅ `npx tsc --noEmit` — passed with zero errors (exit code 0)

## STR & Finance Department Fixes ✅

### STR Department
- ✅ **Delegation fix**: Changed `getByFormCodes()`, `getByStatus()`, `getByUser()`, `getByModule()`, `getPendingApprovals()` from client-side filtering to OData filter-based queries. Now delegation-safe for >5000 records.
- ✅ Added `getByFormCode()` helper for single form code queries.
- ✅ **Doc number fix**: Replaced `Math.random()` with timestamp-based sequence (`STR-ACMSTR-2505-12345` format) for more reliable document numbers.
- ⚠️ `data-source-mapping.ts` already had correct entries (sharepoint/connected).

### Finance Department
- ✅ **Data source mapping added**: Added 4 entries (CAR, EARF, TClaim, MonthClose) to `data-source-mapping.ts` with `sourceType: 'sharepoint'` / `connectionStatus: 'connected'`.
- ✅ Already correctly uses `useCreateMainDBFIN` (generated hook) for SharePoint writes.
- ⚠️ JSON-in-description pattern noted (similar to MED-04) — all form data serialized as JSON blob in `description` field. Not queryable via OData. Recommend refactoring when form-specific columns are added to MainDB_FIN.

## Total Summary — All Phases

| Phase | Status | Key Changes |
|-------|--------|-------------|
| Phase 1 — Critical | ✅ Complete | EAFDetails fix, HR mock→real, rollback |
| Phase 2 — Mapping | ✅ Complete | DATA_SOURCE_NAME fix, OData mapping, choice key mapper |
| Phase 3 — Resilience | ✅ Complete | Parent-child rollback, ITSSR JSON removal |
| Phase 4 — Cleanup | ✅ Complete | Deprecated exports removed, data-source mapping updates, site key logging |
| Phase 5 — Docs/UI | ✅ Complete | Schema ref, column audit, flow design, form registry, type safety |
