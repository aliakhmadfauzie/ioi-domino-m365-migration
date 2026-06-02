# PDF Extraction Status Register

> Tracks the extraction status of every PDF through the automated source-analysis pass.
> Last generated: 2026-06-02 21:46

## Portfolio Summary

| Stage | Count |
|---|---:|
| Analysed | 1171 |
| Not Started | 0 |
| In Progress | 0 |
| Needs OCR / Visual Review after automated analysis | 11 |

## Source Kind Summary

| Source Kind | Count | Status |
|---|---:|---|
| Extracted embedded PDF | 545 | Analysed |
| HCL clean PDF | 626 | Analysed |

## Site Summary

| Site | Count | Status |
|---|---:|---|
| Johor | 474 | Analysed |
| Penang | 325 | Analysed |
| Prai | 372 | Analysed |

## Register Location

Full row-level status is in `source_analysis/09_reports/SOURCE_FILE_ANALYSIS_STATUS.md` and `source_analysis/09_reports/source_file_analysis_status.csv`.

## Quality Gates

- Automated analysis confirms discovery, open/page count, raw text availability, field-candidate count, and workflow-signal count.
- Promotion to formal requirements remains gated by batch quality review and human confirmation where required.
