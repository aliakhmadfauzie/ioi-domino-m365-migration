# Data Connection Register

> Repository inventory discovery updated 2026-05-31. Connection rows are based on `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json`; runtime usage still requires per-feature audit.

## Discovery Evidence

| Source | File Path | What Was Found | Why It Matters |
|---|---|---|---|
| App connection metadata | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | 18 connection references. | Confirms configured connectors for the code app. |
| App connection metadata | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | 97 unique SharePoint data sources. | Confirms configured SharePoint list/table references. |
| Source code scan | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src` | Connector-related logic references appear in TypeScript/TSX, not Power Fx `.pa.yaml`. | Audits must map connector usage through code-first app implementation. |

## Connector References

| Connection Reference | Connector | Connector ID | Site/Dataset | Data Sources | App File Evidence | Audit Status | Notes |
|---|---|---|---|---:|---|---|---|
| 3eee79e3-fad2-4e24-84b7-acfa1d075fdb | SharePoint | `shared_sharepointonline` | HR, IT, STR, QA, QC, FIN, PRD, LOG, MTN, WH, SHE, Admin, EI, ENG, MKT, PBI, POM, PRC, RD, SA, SEC, TD, MainDB_IT | 96 | `power.config.json` | Not Started | Primary SharePoint reference with broad data source coverage, including newly detected Admin/EI/ENG/MKT/PBI/POM/PRC/RD/SA/SEC/TD main lists. |
| 3509ce13-98bf-4d83-a0e0-d044f4a67e94 | SharePoint | `shared_sharepointonline` | ioi-portal-it | 1 | `power.config.json` | Not Started | References `itforms`. |
| 7a10b3f0faba44f2a0c864aec3f1d045 | SharePoint | `shared_sharepointonline` | STR, HR, QA, QC, FIN, PRD, LOG, MTN, IT, SHE, Admin, MainDB_IT | 65 | `power.config.json` | Not Started | Secondary SharePoint reference with overlapping data sources. |
| shared-sharepointonl-6458878c-fd27-4804-af4d-6f37eaf07541 | SharePoint | `shared_sharepointonline` | Unknown | 0 | `power.config.json` | Not Started | Connection reference exists without data sources in scanned metadata. |
| 8a5dc4b8f4864ede8878dcb3af0468a4 | SharePoint | `shared_sharepointonline` | Unknown | 0 | `power.config.json` | Not Started | Connection reference exists without data sources in scanned metadata. |
| 08d57e013c6e4d539420ea8a9cb20699 | SharePoint | `shared_sharepointonline` | Unknown | 0 | `power.config.json` | Not Started | Connection reference exists without data sources in scanned metadata. |
| 31932564d2aa467fb9e768c6d9163d2b | Office 365 Users | `shared_office365users` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Office 365 Users connector configured; runtime call sites require audit. |
| f0abd25e783a4e8494fbea009df8e075 | Office 365 Users | `shared_office365users` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Duplicate Office 365 Users connection reference. |
| baf71139478348d8be4cdf53382b5ab6 | Office 365 Outlook | `shared_office365` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | M365 mail/calendar connector configured; runtime call sites require audit. |
| c8a3fe1e4c7440dd8d75140d1480bbe9 | Office 365 Outlook | `shared_office365` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Duplicate Office 365 Outlook connection reference. |
| 5cbbf3d78b214e2f850426c1f13c3755 | Office 365 Groups | `shared_office365groups` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Group membership/lookup usage requires audit. |
| c563cf315ef04c839699a285c9c3de53 | Office 365 Groups | `shared_office365groups` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Duplicate Office 365 Groups connection reference. |
| 7397a99597e04f03b303b29e8e74284a | Office 365 Groups Mail | `shared_office365groupsmail` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Group mail usage requires audit. |
| 08572eca1c784566a269b0334c3ca6e8 | Approvals | `shared_approvals` | Microsoft 365 | 0 | `power.config.json`; source scan | Not Started | Approval connector configured; do not infer per-form approval requirement from this alone. |
| 93ff1142a39e4e12a96c6a79877729ac | AAD Invitation Manager | `shared_aadinvitationmanager` | Microsoft 365/Azure AD | 0 | `power.config.json`; source scan | Not Started | Invitation usage requires audit. |
| 9cc66ba465bd44c4831a2d6d6c609b0b | Power Apps for Admins | `shared_powerappsforadmins` | Power Platform | 0 | `power.config.json`; source scan | Not Started | Admin connector configured; runtime usage requires audit. |
| 58680a2de7514a33bceb658855abcc17 | Power Apps Notification V2 | `shared_powerappsnotificationv2` | Power Platform | 0 | `power.config.json`; source scan | Not Started | Notification usage requires audit. |
| shared-microsoftcopi-90180ec8-c4e6-46d1-b953-efe3ea59b5d0 | Microsoft Copilot Studio | `shared_microsoftcopilotstudio` | Microsoft 365/Power Platform | 0 | `power.config.json`; source scan | Not Started | Copilot connector configured; runtime usage requires audit. |

## SharePoint Data Source Coverage

| Category | Count | Evidence | Audit Status | Notes |
|---|---:|---|---|---|
| Unique SharePoint data sources | 97 | `power.config.json` | In Progress | Detailed list recorded in `SHAREPOINT_LIST_INVENTORY.md`. |
| Local SharePoint schemas | 68 | `.power/schemas/sharepointonline` | In Progress | Field-level coverage is partial; LOG, MTN, and WH schema files are populated and field-usable. |
| SharePoint data sources missing local schema | 29 | `power.config.json`; `.power/schemas/sharepointonline` scan | Blocked - Missing SharePoint Schema | Must be resolved before full field mapping audit. |
| Power Fx formulas | 0 `.pa.yaml` app formula files found in app source scan | `src` and repo YAML scan | Blocked - Missing App File | Code-first implementation uses TypeScript/TSX rather than Canvas Power Fx source files. |

## Connector Clarification Needed

| Item | Reason | Status |
|---|---|---|
| Runtime Office 365 Users call sites | `power.config.json` confirms connector references, but per-screen usage must be mapped from TS/TSX implementation. | Not Started |
| Runtime M365 connector call sites | Outlook, Groups, Groups Mail, Approvals, and admin connectors are configured; call sites need evidence extraction. | Not Started |
| Empty SharePoint connection references | Several SharePoint connection references have no data sources in scanned metadata. | Blocked - Ambiguous Requirement |

## SharePoint Schema Discovery - 2026-06-01

| Discovery Item | Count | Evidence | Audit Status | Notes |
|---|---:|---|---|---|
| SharePoint connection references | 6 | `power.config.json` | In Progress | Three references contain data sources; three SharePoint references have no data sources in scanned metadata. |
| Unique configured SharePoint data source keys | 97 | `power.config.json` | In Progress | Includes HR, IT, QA/QC, STR, FIN, PRD, LOG, MTN, WH, SHE, Admin, EI, ENG, MKT, PBI, POM, PRC, RD, SA, SEC, TD, and MainDB_IT site lists. |
| Configured SharePoint site URLs/datasets | 24 | `power.config.json` | In Progress | Includes `ioi-portal-it`, `ioi-portal-hr`, `ioi-portal-qa`, `ioi-portal-qc`, `ioi-portal-str`, `ioi-portal-fin`, `ioi-portal-prd`, `ioi-portal-log`, `ioi-portal-mtn`, `ioi-portal-wh`, `ioi-portal-she`, `IOI-App_Admin_Sites`, and `MainDB_IT`. |
| Local SharePoint schema files | 68 | `.power/schemas/sharepointonline/*.Schema.json` | In Progress | 68 schema files were found locally; LOG, MTN, and WH schema exports expose populated column metadata. |
| Configured data sources missing local schema | 29 | `power.config.json` compared with `.power/schemas/sharepointonline` | Blocked - Missing SharePoint Schema | Missing schema list is recorded in `SHAREPOINT_LIST_INVENTORY.md`. |
| Schema files with zero columns | 0 | `.power/schemas/sharepointonline/*.Schema.json` current parse | Completed - Passed | LOG/MTN/WH were validated using `schema.items.properties`; no zero-column local schema exports remain. |
| Total columns found in local schemas | 4,475 | `.power/schemas/sharepointonline/*.Schema.json` | In Progress | Includes system fields and attachment pseudo-fields. |
| Columns with unknown JSON type | 0 | `.power/schemas/sharepointonline/*.Schema.json` | Completed - Passed | Every parsed schema property exposed a JSON type. |
| Choice values exposed by schema enum | 0 | `.power/schemas/sharepointonline/*.Schema.json` | Blocked - Missing SharePoint Schema | Choice fields appear as object/string fields without enum values in local SDK schemas; choice values need live/PnP export or documentation. |

## SharePoint Site Coverage

| Site URL | Configured Data Sources | Local Schema Coverage | Notes |
|---|---:|---:|---|
| `https://ioioi.sharepoint.com/sites/ioi-portal-it` | 27 | 25 | `maindb_it_jhr`, `maindb_it_ext_policy`, and lookup alias coverage need confirmation. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | 28 | 14 | Several HR extension/FWWPD lists are configured without local schema exports. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-qa` / `ioi-portal-qc` | 22 | 6 | QA/QC extension lists are configured but many schemas are missing locally. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-str` | 5 | 5 | Local schemas found for all configured STR data source keys. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-fin` | 1 | 1 | Local schema found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-prd` | 1 | 1 | Local schema found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-log` | 1 | 1 schema file / 194 columns | `maindb_log` schema export validated. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-mtn` | 1 | 1 schema file / 198 columns | `maindb_mtn` schema export validated. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-wh` | 1 | 1 schema file / 108 columns | `maindb_wh` schema export validated. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-admin` | 1 | 1 schema file / 92 columns | `maindb_admin` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-ei` | 1 | 1 schema file / 103 columns | `maindb_ei` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-eng` | 1 | 1 schema file / 132 columns | `maindb_eng` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-mkt` | 1 | 1 schema file / 109 columns | `maindb_mkt` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-pbi` | 1 | 1 schema file / 103 columns | `maindb_pbi` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-pom` | 1 | 1 schema file / 92 columns | `maindb_pom` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-prc` | 1 | 1 schema file / 92 columns | `maindb_prc` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-rd` | 1 | 1 schema file / 103 columns | `maindb_rd` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-sa` | 1 | 1 schema file / 92 columns | `maindb_sa` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-sec` | 1 | 1 schema file / 108 columns | `maindb_sec` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-td` | 1 | 1 schema file / 103 columns | `maindb_td` schema export found. |
| `https://ioioi.sharepoint.com/sites/ioi-portal-she` | 2 | 2 | Local schemas found. |
| `https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites` | 6 | 6 | Local schemas found. |
| `https://ioioi.sharepoint.com/sites/MainDB_IT` | 1 | 1 | `it_routingmatrix` schema found. |

## Schema Gap References

| Gap | Count | Evidence | Required Action |
|---|---:|---|---|
| Configured data sources missing local schema | 29 | `power.config.json`; `.power/schemas/sharepointonline` | Refresh/export schemas before field-level audit for those lists. |
| Schema files with zero columns | 0 | `.power/schemas/sharepointonline/*.Schema.json` current parse | No action for LOG/MTN/WH; remaining schema blockers are the 29 missing configured schema files. |
| App form-schema `spColumn` references missing from expected local schema | 111 | `src/form-schemas/**/*.json`; local schema files | Reconcile app schema metadata with generated SharePoint internal names. |
| Mapping target columns missing from local schema | 59 | `mapping/field-mapping.csv`; local schema files | Reconcile mapping docs with current SharePoint schema. |
| Required schema fields not referenced by form-schema metadata | 129 | `schema.items.required`; `src/form-schemas/**/*.json` | Verify whether page code/provisioning supplies these values. |

## Register Sync - 2026-06-01

| Sync Item | Result | Evidence | Notes |
|---|---:|---|---|
| Unique SharePoint data sources refreshed | 86 | `power.config.json` | Current metadata includes LOG, MTN, and WH main list references. |
| Local schema files refreshed | 68 | `.power/schemas/sharepointonline` | LOG, MTN, and WH schema exports were validated with populated columns; no zero-column schemas remain in the local scan. |
| Missing local schema count | 29 | `power.config.json` compared with schema directory | Explicit missing-list comparison still identifies 29 configured data source keys without matching local schema files; LOG/MTN/WH are no longer part of the schema blocker. |








