# Insight Basis

This folder is the canonical working area for insight generation derived from client inventories, extraction outputs, and migration analysis artifacts.

## Purpose

- Keep baseline findings separate from raw source files.
- Capture reusable insight summaries that can guide migration planning.
- Maintain traceable links between source datasets and downstream reports.

## Initial Sources

- `../Refennve from client/HCL_Apps_Penang.xlsx`
- `../Refennve from client/HCL_Apps_Johor.xlsx`
- `../MASTER_CATALOG_EXTRACTION_PLAN.md`
- `../../Latest_Client_provided_file/PENANG/`
- `../../Latest_Client_provided_file/JOHOR_SITE_FORM/`

## Starting Documents

- `2026-04-18_application_inventory_baseline.md` - first-pass cross-site application inventory insight summary.
- `application_pdf_source_mapping.csv` - one row per application with site-specific PDF source root and PDF path resolution status.
	The file now includes extracted embedded PDF paths, match-count metadata, and confidence-based PDF status fields where workbook-embedded PDFs were mapped successfully.
- `combined_source_mapping.csv` - combined inventory, PDF source status, and blueprint coverage status in one file.
- `excel_pdf_reference_inventory.csv` - inventory of PDF-related references discovered inside the Excel workbooks.
- `excel_pdf_reference_summary.md` - summary of embedded PDF detection inside the Excel workbooks.
- `embedded_pdf_application_mapping.csv` - extracted embedded PDFs mapped back to workbook application rows.
- `embedded_pdf_application_mapping_summary.md` - summary of match quality for embedded PDF to application mapping.
- `extracted-embedded-pdfs/` - extracted PDF files grouped by site and sheet.
- `master_app_data_still_needed.csv` - master data extract for apps marked still needed, including site, app name, owner, department, form list, and build readiness fields.
- `master_app_data_still_needed_summary.md` - summary counts for the still-needed master data extract.
- `APP_DEVELOPMENT_REFERENCE.md` - canonical guide for app development inputs, source priority, and required data sources.

## Actual Orchestration Links (Source Of Truth)

Use the real orchestration implementation below (not test helper artifacts):

- `../.github/automation/orchestrator-unified.js` - main runtime orchestrator.
- `../.github/automation/agent-pipeline.json` - canonical pipeline order and gate definitions.
- `../.github/automation/validator.js` - executable gate validation engine.
- `../.github/automation/logging-service.js` - structured orchestration event logging.
- `../.github/automation/ORCHESTRATION_SYSTEM_v2.md` - architecture and operating model.

## Usage

- Add new source-specific insight files here.
- Preserve raw numbers and assumptions in each document.
- Treat this folder as the basis for executive summaries, prioritization matrices, and migration decisions.
- Update `application_pdf_source_mapping.csv` once iCloud-synced PDF files become locally available so `pdf_path` can be filled precisely.
- Use `combined_source_mapping.csv` as the main audit file for source readiness, blueprint availability, and manual mapping follow-up.
- Use the orchestration source links above when referencing execution behavior in inventory insights or migration recommendations.