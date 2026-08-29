# SharePoint Schema Validation - LOG / MTN / WH

Date: 2026-06-01

## Scope

Validated the local SharePoint schema exports for:

| Data Source Key | List Title | Site URL | Schema File |
|---|---|---|---|
| maindb_log | MainDB_LOG | https://ioioi.sharepoint.com/sites/ioi-portal-log | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_log.Schema.json` |
| maindb_mtn | MainDB_MTN | https://ioioi.sharepoint.com/sites/ioi-portal-mtn | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_mtn.Schema.json` |
| maindb_wh | MainDB_WH | https://ioioi.sharepoint.com/sites/ioi-portal-wh | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_wh.Schema.json` |

## Validation Result

| Data Source Key | Columns Found | Required Fields | Validation Status | Notes |
|---|---:|---|---|---|
| maindb_log | 194 | Title | Completed - Passed | Schema properties are under `schema.items.properties`. |
| maindb_mtn | 198 | Title | Completed - Passed | Schema properties are under `schema.items.properties`. |
| maindb_wh | 108 | Title | Completed - Passed | Schema properties are under `schema.items.properties`. |

## Evidence

- Source: Local SharePoint schema export
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_log.Schema.json`
- Code/formula/section: `schema.items.properties`
- What was found: `MainDB_LOG` exposes 194 column/property definitions and required field `Title`.
- Why it matters: LOG field-level audits can use this schema evidence; the prior zero-column blocker was invalid.

- Source: Local SharePoint schema export
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_mtn.Schema.json`
- Code/formula/section: `schema.items.properties`
- What was found: `MainDB_MTN` exposes 198 column/property definitions and required field `Title`.
- Why it matters: MTN field-level audits can use this schema evidence; the prior zero-column blocker was invalid.

- Source: Local SharePoint schema export
- File path: `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_wh.Schema.json`
- Code/formula/section: `schema.items.properties`
- What was found: `MainDB_WH` exposes 108 column/property definitions and required field `Title`.
- Why it matters: WH field-level audits can use this schema evidence; the prior zero-column blocker was invalid.

## Register Updates

| Register | Update |
|---|---|
| `audit/01_register/SHAREPOINT_LIST_INVENTORY.md` | LOG/MTN/WH list rows changed from blocked zero-column notes to validated schema rows. |
| `audit/01_register/DATA_CONNECTION_REGISTER.md` | Zero-column schema count changed to 0 and LOG/MTN/WH site coverage updated. |
| `audit/01_register/AUDIT_MASTER_REGISTER.md` | Local schema count and column count refreshed. |

## Remaining Limits

The validation proves local schema metadata exists. It does not prove per-form source requirements, approval routing, or app read/write correctness for LOG, MTN, or WH forms. Those remain subject to item-level audit.
