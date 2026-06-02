# Batch 1 Finding: HI

## Audit Summary

| Item | Detail |
|---|---|
| Form | HI - Hardware Inventory |
| Department | IT |
| Source Evidence | `analysis/evidence-reconciliation.md`, `mapping/field-mapping.csv`, `docs/central-form-reference.md` |
| App Evidence | `src/pages/it/forms/hi/new.tsx`, `src/pages/it/forms/hi/index.tsx`, `src/pages/it/forms/hi/[id].tsx`, `src/form-schemas/HI.json` |
| SharePoint Schema Evidence | `.power/schemas/sharepointonline/maindb_it_ext_assets.Schema.json` |
| Approval Classification | No Approval Required |
| Audit Status | Completed with issues |

## Findings

### AUD-B01-HI-001 - HI create writes Ext_Assets but list/detail read only MainDB_IT

- Source:
- File path: `src/pages/it/forms/hi/new.tsx:143-172`; `src/pages/it/forms/hi/index.tsx:99-126`; `src/pages/it/forms/hi/[id].tsx:55-91`
- Code/formula/section: HI create, list mapping, and detail mapping.
- What was found: The create page writes hardware fields to `MainDB_IT_Ext_Assets`. The HI list and detail pages only call `useMainDBITList` and read `hI*` fields from the parent `MainDB_IT` record. They do not join the Ext_Assets child record created by the submit flow.
- Why it matters: Newly submitted HI records can display blank hardware details in list/detail views because the details are stored in the child list but read from the parent list.

### AUD-B01-HI-002 - HI schema/data ownership conflicts between docs, mapping, and implementation

- Source:
- File path: `mapping/field-mapping.csv:35-48`; `src/form-schemas/HI.json:14-260`; `.power/schemas/sharepointonline/maindb_it_ext_assets.Schema.json:218-400`; `src/pages/it/forms/hi/new.tsx:145-171`
- Code/formula/section: HI field mapping and SharePoint list ownership.
- What was found: `mapping/field-mapping.csv` maps HI fields to `MainDB_IT_Ext_Assets`. The create code also writes Ext_Assets. But `HI.json` marks many fields as `spTable: MainDB_IT`, including Machine ID, Asset Tag, Type, Computer Name, Used By, Location, Department, CPU, RAM, HDD, IP, MAC, OS, Vendor, and purchase fields.
- Why it matters: The schema can drive future implementation in the wrong direction and conflicts with both the field mapping CSV and the actual create flow. This also explains why current read paths look at parent fields.

## Verified Behavior

| Area | Status | Evidence |
|---|---|---|
| Parent record create | Verified | `src/pages/it/forms/hi/new.tsx:133-141` creates `MainDB_IT` with `formcode: 'HI'`. |
| Child record create | Verified | `src/pages/it/forms/hi/new.tsx:143-172` creates `MainDB_IT_Ext_Assets` and rolls back parent on failure. |
| Approval classification | Verified | `docs/04_WORKFLOW_APPROVAL_RULES.md` classifies HI as No Approval Required. |
| Johor variance | Open | `analysis/evidence-reconciliation.md:39` and `:78` document two extra Johor fields requiring confirmation. |

## Blocked

Fixing is blocked in audit mode. Before fix mode, confirm whether HI reads should join Ext_Assets or whether the app should migrate the hardware fields back into MainDB_IT.

## Re-Audit - FIX-006

| Field | Value |
|---|---|
| Re-Audit Date | 2026-06-01 |
| Fix ID | FIX-006 |
| Verification Status | Verified |
| Re-Audited By | Codex audit agent |

### Re-Audit Evidence

- Source: Changed HI database view
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx:12`
- Code/formula/section: `useMainDBITExtAssetsList`
- What was found: The HI database view now imports and calls `useMainDBITExtAssetsList` with `filter: "parentFormCode eq 'HI'"`.
- Why it matters: The list view now reads the same Ext_Assets child list that HI submit creates.

- Source: Changed HI database view
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx:113`
- Code/formula/section: `assetsByParentId` / `assetsByParentTitle`
- What was found: Ext_Assets records are indexed by parent lookup ID and parent title, then joined to each MainDB_IT parent record.
- Why it matters: New child-backed records and older/fallback records can both be displayed.

- Source: Changed HI database view
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/index.tsx:129`
- Code/formula/section: HI list mapping
- What was found: The list now prefers child values such as `asset?.hITagNo`, `asset?.hIAssetNo`, `asset?.hIType`, `asset?.hIComputerName`, `asset?.hICompany`, `asset?.hIUsedByEmail`, `asset?.hILocation`, `asset?.hIDepartment`, `asset?.hISerialNo`, `asset?.hIPurchaseDate`, `asset?.hIVendor`, and `asset?.hIStatus`, with MainDB_IT fallback values.
- Why it matters: Hardware details saved to Ext_Assets are no longer hidden from the HI list view.

- Source: Changed HI detail view
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/it/forms/hi/[id].tsx:7`
- Code/formula/section: `useMainDBITExtAssetsList`
- What was found: The HI detail page now reads Ext_Assets records filtered by `parentRecord/ID eq {id}` and displays child-backed asset, hardware, assignment, and location fields.
- Why it matters: The malformed detail page was replaced with a functional detail view that reads the extension child data.

- Source: Changed route configuration
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/routes/it-routes.tsx:145`
- Code/formula/section: HI routes
- What was found: Explicit `/it/forms/hi`, `/it/forms/hi/new`, and `/it/forms/hi/:id` routes are registered before the generic form routes.
- Why it matters: The fixed HI list/detail implementation is reachable and no longer depends only on generic routes.

- Source: SharePoint schema evidence
- File path: `ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_assets.Schema.json:1021`
- Code/formula/section: Required and HI child columns
- What was found: The schema includes `ParentID`, `ParentFormCode`, `HI_TagNo`, `HI_AssetNo`, `HI_Type`, `HI_ComputerName`, `HI_Company`, `HI_UsedBy_Email`, `HI_Location`, `HI_Department`, `HI_WinVersion`, `HI_OfficeVersion`, `HI_SerialNo`, `HI_PurchaseDate`, `HI_Vendor`, and `HI_Status`.
- Why it matters: The fields used by the verified read-path fix correspond to captured Ext_Assets schema evidence.

### Regression Check

| Area | Result | Evidence |
|---|---|---|
| TypeScript compile | Passed | `npx tsc --noEmit` completed successfully in `ioicodeapp/powerapps-mirror/apps/ioi-platform`. |
| Submit/write behavior | No regression found | `hi/new.tsx` was not changed during FIX-006 implementation. |
| Workflow logic | No regression found | HI remains a non-approval form; no workflow files or status transition logic were changed. |
| Validation logic | No regression found | HI submit validation in `hi/new.tsx` was not changed. |
| SharePoint mapping | Valid for verified read fields | Read fields match captured `MainDB_IT_Ext_Assets` schema columns listed above. |

### Remaining Issues

AUD-B01-HI-001 / FIX-006 is verified. AUD-B01-HI-002 / FIX-053 remains unresolved because `HI.json` still conflicts with the Ext_Assets implementation and needs a separate schema/data ownership decision.
