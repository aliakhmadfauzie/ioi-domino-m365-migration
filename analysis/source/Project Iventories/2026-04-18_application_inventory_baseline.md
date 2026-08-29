# Application Inventory Baseline

Date: 2026-04-18

## Objective

Create a baseline insight summary from the client application inventories so later migration, consolidation, and standardization decisions can reference a stable starting point.

## Source Files

- `../Refennve from client/HCL_Apps_Penang.xlsx`
- `../Refennve from client/HCL_Apps_Johor.xlsx`
- `../MASTER_CATALOG_EXTRACTION_PLAN.md`
- `../../Latest_Client_provided_file/PENANG/`
- `../../Latest_Client_provided_file/JOHOR_SITE_FORM/`
- `application_pdf_source_mapping.csv`
- `combined_source_mapping.csv`

## PDF Source Mapping Status

A per-application PDF source mapping file has been created as `application_pdf_source_mapping.csv`.

Current status:

- All 390 applications now carry a site-specific PDF source root.
- Penang applications point to `C:\Users\aliak\iCloudDrive\Documents\Claude\Projects\IOI_PROJECT\Latest_Client_provided_file\PENANG`.
- Johor applications point to `C:\Users\aliak\iCloudDrive\Documents\Claude\Projects\IOI_PROJECT\Latest_Client_provided_file\JOHOR_SITE_FORM`.
- 277 applications now have extracted embedded PDF paths populated from the client Excel workbooks.
- `pdf_path_status` now breaks down as:
	- `embedded_pdf_extracted_text_matched`: 158
	- `embedded_pdf_extracted_mixed_confidence`: 58
	- `embedded_pdf_extracted_low_confidence`: 61
	- `pending_icloud_sync`: 113
- The remaining `pending_icloud_sync` rows still depend on locally available external client PDF folders or later extraction work.

## Combined Source Mapping Status

A combined audit file has been created as `combined_source_mapping.csv`.

Current status:

- Total application rows: 390
- `planned_blueprint_missing_file`: 48
- `no_plan_blueprint_match`: 340
- `ambiguous_plan_match`: 2
- No local blueprint markdown files were found under the current `docs` workspace, so all blueprint-linked rows are currently plan-based rather than file-verified.

Implication: the combined mapping is now good enough to drive audit and prioritization work, but blueprint file verification still depends on bringing the actual blueprint markdown set into the workspace or its reachable filesystem path.

## Inventory Snapshot

| Metric | Penang | Johor |
|---|---:|---:|
| Total apps in `ALL` sheet | 247 | 143 |
| Distinct titles | 247 | 143 |
| Duplicate titles within site | 0 | 0 |
| Marked `Still Need? = Y` | 232 | 129 |
| `Still Need? = Y` rate | 94% | 90% |
| High usage | 77 | 44 |
| High usage rate | 31% | 31% |
| Simple complexity | 117 | 65 |
| Simple complexity rate | 47% | 45% |

## Main Findings

### 1. The estate is large and fragmented across sites

Penang holds 247 applications while Johor holds 143. There are no duplicate titles within either site inventory, but there is only one overlapping title between both `ALL` sheets: `Product Spec Code`.

Implication: cross-site migration cannot assume shared naming or direct one-to-one app equivalence. A normalization layer will be required.

### 2. Retention intent is very high

More than 90% of applications at both sites are still marked as needed.

Implication: the current inventory suggests strong business dependence, limited retirement discipline, or both. Decommissioning decisions will need evidence beyond owner preference.

### 3. Usage and retention are not aligned cleanly

Only 31% of applications are marked high usage at each site, while over 90% are still considered needed.

Implication: the portfolio likely contains many low-volume but business-critical tools, or legacy tools that remain protected from retirement. This is a rationalization opportunity.

### 4. Most of the portfolio appears suitable for templated migration

About half of the applications are classified as simple.

Implication: a sizable portion of the estate is a candidate for standardized Power Apps patterns rather than bespoke rebuilds.

### 5. QA-related domains look like strong standardization candidates

Large departmental groupings include:

- Penang: `IMS Related` (104), `HR` (54), `QA` (53)
- Johor: `QA` (34), `QC` (31), `GHR` (29)

Implication: QA and adjacent quality/compliance processes appear large enough to justify early template, schema, and workflow standardization.

## Strategic Interpretation

The combined evidence points to four planning conclusions:

1. Consolidation potential is high because many applications are simple.
2. Retirement potential exists, but business stakeholders currently signal reluctance to remove tools.
3. Cross-site harmonization will be harder than raw counts suggest because titles and ownership structures are highly localized.
4. A master catalog should group by business capability and workflow pattern, not by application title alone.

## Recommendations For Next Pass

1. Build a cross-site mapping table with columns: `Site`, `Title`, `Department`, `Owner`, `Usage`, `Still Need`, `Complexity`, `Candidate Capability Group`.
2. Identify low-usage but still-needed applications as a separate rationalization list.
3. Prioritize QA, HR, and IMS-related forms for reusable migration templates.
4. Add a normalized naming layer so Penang and Johor applications can be compared by function rather than title.

## Assumptions

- `Still Need? (Y/N)` is treated as the best available retention signal.
- Usage values were interpreted from workbook labels as provided by the client inventory.
- Complexity analysis is limited to sheets where complexity is explicitly present.

## Status

This document is the initial baseline and should be updated when deeper workbook parsing, department mapping, or form-level extraction is completed. The next update should populate exact PDF file paths after the client source folders are fully synced locally and replace plan-based blueprint assumptions with file-verified blueprint paths where available.