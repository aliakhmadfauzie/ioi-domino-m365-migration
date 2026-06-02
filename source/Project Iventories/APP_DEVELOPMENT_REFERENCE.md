# App Development Reference

Date: 2026-04-18

## Purpose

This file is the working reference for app development planning and build preparation.

Use it to decide:

- which applications are in scope
- which source files to use for each application
- which source is the most reliable for forms, owners, departments, and site context
- where confidence is high versus where manual review is still required

## Recommended Source Priority

Use the sources in this order when preparing an app for development:

1. `master_app_data_still_needed.csv`
2. `application_pdf_source_mapping.csv`
3. `embedded_pdf_application_mapping.csv`
4. `combined_source_mapping.csv`
5. extracted PDFs under `extracted-embedded-pdfs/`
6. `MASTER_CATALOG_EXTRACTION_PLAN.md`

Reason:

- `master_app_data_still_needed.csv` gives the cleanest development scope for active applications only.
- `application_pdf_source_mapping.csv` is the main per-app source map and now includes extracted PDF paths where available.
- `embedded_pdf_application_mapping.csv` gives the direct PDF-to-application join and match confidence.
- `combined_source_mapping.csv` is the audit view for blueprint readiness, PDF status, and unresolved mapping work.
- `extracted-embedded-pdfs/` is the actual form artifact source when you need to inspect a real form layout.
- `MASTER_CATALOG_EXTRACTION_PLAN.md` explains the intended target architecture and extraction strategy.

## Core Data Sources

### 1. Active App Scope

File: `master_app_data_still_needed.csv`

Use for:

- app shortlist for development
- site split
- owner reference
- department reference
- initial form grouping

Fields:

- `site`
- `app_name`
- `owner`
- `department`
- `form_list`

Current coverage:

- 361 apps marked still needed
- Penang: 232
- Johor: 129

### 2. App-to-PDF Source Map

File: `application_pdf_source_mapping.csv`

Use for:

- identifying where the form source comes from
- checking whether an app already has extracted PDF evidence
- understanding confidence level of the PDF match

Important fields:

- `site`
- `title`
- `owner`
- `still_need`
- `pdf_source_root`
- `pdf_path`
- `pdf_path_status`
- `embedded_pdf_count`
- `embedded_pdf_match_methods`
- `embedded_pdf_match_scores`

Current PDF status breakdown:

- `embedded_pdf_extracted_text_matched`: 158
- `embedded_pdf_extracted_mixed_confidence`: 58
- `embedded_pdf_extracted_low_confidence`: 61
- `pending_icloud_sync`: 113

Interpretation:

- `embedded_pdf_extracted_text_matched` is strong enough to use as the primary development form source.
- `embedded_pdf_extracted_mixed_confidence` is usable but should be checked.
- `embedded_pdf_extracted_low_confidence` needs manual validation before build use.
- `pending_icloud_sync` means no extracted PDF path is available yet from the embedded mapping flow.

### 3. PDF-to-App Mapping Detail

File: `embedded_pdf_application_mapping.csv`

Use for:

- detailed tracing from extracted PDF to app row
- checking the exact extracted PDF file used in a match
- reviewing how the match was made

Important fields:

- `sheet`
- `ole_archive_path`
- `extracted_pdf_path`
- `pdf_meta_title`
- `pdf_text_excerpt`
- `matched_app_title`
- `match_method`
- `match_score`

Current match quality:

- `text_match_high`: 305
- `text_match_medium`: 84
- `sheet_order_fallback`: 156

Use rule:

- prefer `text_match_high`
- accept `text_match_medium` with a quick check
- manually inspect all `sheet_order_fallback` rows

### 4. Combined Audit Map

File: `combined_source_mapping.csv`

Use for:

- blueprint readiness review
- identifying apps with no planned blueprint match
- finding apps that are still PDF-only or unmapped

Important fields:

- `blueprint_department`
- `blueprint_code`
- `blueprint_path_expected`
- `blueprint_status`
- `overall_source_status`

Use this file when deciding whether an app is ready for:

- direct build
- blueprint creation
- manual analysis

### 5. Extracted Form Files

Folder: `extracted-embedded-pdfs/`

Use for:

- reading the actual embedded form layouts
- checking sections, labels, field names, approval structure, and attachments
- deriving screen design and field mapping

Structure:

- grouped by `site`
- then grouped by workbook `sheet`

### 6. Planning Reference

File: `../MASTER_CATALOG_EXTRACTION_PLAN.md`

Use for:

- development strategy
- target extraction phases
- identifying focus departments
- understanding intended master catalog workflow

This is not the app-level source of truth, but it is the planning source of truth.

## Minimum Data Pack Needed Per App

Before app development starts for one application, gather these five items:

1. `site` and `app_name` from `master_app_data_still_needed.csv`
2. `owner` and `department` from `master_app_data_still_needed.csv`
3. `pdf_path` and `pdf_path_status` from `application_pdf_source_mapping.csv`
4. `match_method` and `match_score` from `embedded_pdf_application_mapping.csv`
5. extracted PDF file from `extracted-embedded-pdfs/` when available

If blueprint information is needed, also check `combined_source_mapping.csv`.

## Recommended Development Workflow

### High-confidence path

Use this when:

- app is in `master_app_data_still_needed.csv`
- `pdf_path_status = embedded_pdf_extracted_text_matched`

Workflow:

1. start from `master_app_data_still_needed.csv`
2. open matching row in `application_pdf_source_mapping.csv`
3. open extracted PDF from `pdf_path`
4. inspect `embedded_pdf_application_mapping.csv` if clarification is needed
5. derive fields, steps, and screens from the extracted PDF

### Review-needed path

Use this when:

- `pdf_path_status = embedded_pdf_extracted_mixed_confidence`
- `pdf_path_status = embedded_pdf_extracted_low_confidence`
- `overall_source_status` indicates unmapped or blueprint gaps

Workflow:

1. start from `application_pdf_source_mapping.csv`
2. inspect related rows in `embedded_pdf_application_mapping.csv`
3. read the extracted PDF manually
4. validate against workbook sheet and owner/department context
5. only then treat it as build-ready

## Current Limitations

- not every app has a high-confidence PDF match yet
- some PDF mappings still rely on sheet-order fallback
- blueprint file verification is still incomplete in the current `docs` workspace
- some client PDF sources still depend on external iCloud-synced folders

## Development Recommendation

For immediate build work, prioritize apps that satisfy all of these:

- present in `master_app_data_still_needed.csv`
- `pdf_path_status = embedded_pdf_extracted_text_matched`
- clear owner and department assignment
- form list is specific enough to identify the target business form

For apps outside those conditions, treat them as analysis-needed before development.