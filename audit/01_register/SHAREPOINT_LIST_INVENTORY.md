# SharePoint List Inventory

> Repository inventory discovery updated 2026-05-31. Lists are recorded only when found in `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` or local `.power/schemas/sharepointonline` schema files.

## Discovery Summary

| Source | File Path | What Was Found | Why It Matters |
|---|---|---|---|
| App connection metadata | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | 97 unique SharePoint data sources across configured SharePoint datasets. | Confirms app-level SharePoint list references. |
| Local schema exports | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline` | 68 SharePoint schema files; LOG, MTN, and WH schema files validated with populated columns. | Confirms local field schema coverage for some referenced lists. |
| Source documentation | `docs/central-form-reference.md` | Project form and data source reference. | Required for later per-form field mapping validation. |

## Referenced SharePoint Lists

| List Name | Site/Dataset | Evidence Source | Schema File | Used By Forms | Audit Status | Notes |
|---|---|---|---|---|---|---|
| approvalhistory_hr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/approvalhistory_hr` | Unknown | Not Started | Schema export found. |
| hr_healthregister | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/hr_healthregister` | Unknown | Not Started | Schema export found. |
| opslog_hr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/opslog_hr` | Unknown | Not Started | Schema export found. |
| maindb_hr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/maindb_hr` | HR candidates | Not Started | Schema export found. |
| attachmentindex_hr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/attachmentindex_hr` | Unknown | Not Started | Schema export found. |
| hr_appraisalrecords | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/hr_appraisalrecords` | Unknown | Not Started | Schema export found. |
| auditlog_hr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/auditlog_hr` | Unknown | Not Started | Schema export found. |
| config_globaluserroleassignments | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/config_globaluserroleassignments` | Role logic | Not Started | Schema export found. |
| hr_routingmatrix | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/hr_routingmatrix` | Workflow routing | Not Started | Schema export found. |
| hr_interviewpipeline | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/hr_interviewpipeline` | Unknown | Not Started | Schema export found. |
| maindb_hr_ext_cafeteria | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/maindb_hr_ext_cafeteria` | AUD-066 | Not Started | Schema export found. |
| maindb_hr_ext_records | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/maindb_hr_ext_records` | Unknown | Not Started | Schema export found. |
| maindb_hr_ext_cwr | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/maindb_hr_ext_cwr` | AUD-067 | Not Started | Schema export found. |
| maindb_hr_ext_bsd | ioi-portal-hr | `power.config.json` | `.power/schemas/sharepointonline/maindb_hr_ext_bsd` | AUD-065 | Not Started | Schema export found. |
| maindb_hr_ext_een | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_epdu | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_ephr | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_esf | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_ftcr | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_fwwpe | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_fwwpd | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_gdsn | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_healthinfo | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_hr_ext_hrapr | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| hr_fwwpd_hostelrecords | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| hr_fwwpd_insurancedeductions | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| hr_fwwpd_complianceassets | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| hr_migrationreminderlog | ioi-portal-hr | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| approvalrecords | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/approvalrecords` | IT workflow | Not Started | Schema export found. |
| itforms | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/itforms` | IT forms | Not Started | Schema export found. |
| workflowauditlog | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/workflowauditlog` | IT workflow | Not Started | Schema export found. |
| config_employeedirectory | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/config_employeedirectory` | Office/user lookup support | Not Started | Schema export found. |
| maindb_it_ext_support | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/maindb_it_ext_support` | AUD-013 | Not Started | Schema export found. |
| maindb_it_ext_sap | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/maindb_it_ext_sap` | SAP forms | Not Started | Schema export found. |
| user_roles_it | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/user_roles_it` | Role logic | Not Started | Schema export found. |
| config_companies | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/config_companies` | Shared lookup | Not Started | Schema export found. |
| config_departments | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/config_departments` | Shared lookup | Not Started | Schema export found. |
| config_notesadminrouting | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/config_notesadminrouting` | Workflow routing | Not Started | Schema export found. |
| maindb_it_ext_assets | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/maindb_it_ext_assets` | AUD-003 | Not Started | Schema export found. |
| it_m1_rs_banks | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/it_m1_rs_banks` | AUD-044 candidate | Not Started | Schema export found. |
| maindb_it_ext_access | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/maindb_it_ext_access` | AUD-002 | Not Started | Schema export found. |
| policies | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/policies` | Unknown | Not Started | Schema export found. |
| it_m1_rs_sap_client | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/it_m1_rs_sap_client` | AUD-044 candidate | Not Started | Schema export found. |
| config_approvermatrix | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/config_approvermatrix` | Approval routing | Not Started | Schema export found. |
| it_m1_rs_systemslist | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/it_m1_rs_systemslist` | AUD-044 candidate | Not Started | Schema export found. |
| it_m1_sfar_servers | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/it_m1_sfar_servers` | AUD-023 | Not Started | Schema export found. |
| maindb_it | ioi-portal-it | `power.config.json` | `.power/schemas/sharepointonline/maindb_it` | IT forms | Not Started | Schema export found. |
| maindb_it_jhr | ioi-portal-it | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_it_ext_policy | ioi-portal-it | `power.config.json` | Missing | Unknown | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| lookuptargetb1de9795563e48c399a31430234dc6e2 | ioi-portal-it | `power.config.json` | Missing | Lookup target | Blocked - Missing SharePoint Schema | Lookup alias points to MainDB_IT table ID; needs manual confirmation before treating as a list. |
| it_routingmatrix | MainDB_IT site | `power.config.json` | `.power/schemas/sharepointonline/it_routingmatrix` | IT workflow routing | Not Started | Schema export found. |
| approvalhistory_str | ioi-portal-str | `power.config.json` | `.power/schemas/sharepointonline/approvalhistory_str` | Strategy workflow | Not Started | Schema export found. |
| maindb_str | ioi-portal-str | `power.config.json` | `.power/schemas/sharepointonline/maindb_str` | Strategy forms | Not Started | Schema export found. |
| assignments_str | ioi-portal-str | `power.config.json` | `.power/schemas/sharepointonline/assignments_str` | Strategy forms | Not Started | Schema export found. |
| attachmentindex_str | ioi-portal-str | `power.config.json` | `.power/schemas/sharepointonline/attachmentindex_str` | Strategy forms | Not Started | Schema export found. |
| lineitems_str | ioi-portal-str | `power.config.json` | `.power/schemas/sharepointonline/lineitems_str` | Strategy forms | Not Started | Schema export found. |
| qa_actionitems | ioi-portal-qa | `power.config.json` | `.power/schemas/sharepointonline/qa_actionitems` | QA forms | Not Started | Schema export found. |
| maindb_qa | ioi-portal-qa/QC | `power.config.json` | `.power/schemas/sharepointonline/maindb_qa` | QA/QC forms | Not Started | Schema export found. |
| qa_subactionitems | ioi-portal-qa | `power.config.json` | `.power/schemas/sharepointonline/qa_subactionitems` | QA forms | Not Started | Schema export found. |
| qa_haccp_reviewrecord | ioi-portal-qa | `power.config.json` | `.power/schemas/sharepointonline/qa_haccp_reviewrecord` | QA forms | Not Started | Schema export found. |
| approvalhistory_qa | ioi-portal-qa | `power.config.json` | `.power/schemas/sharepointonline/approvalhistory_qa` | QA workflow | Not Started | Schema export found. |
| maindb_qa_jhr | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_ims | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_capa | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_records | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_assessment | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_product | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_halalcert | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qa_ext_changecontrol | ioi-portal-qa/QC | `power.config.json` | Missing | QA/QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qc | ioi-portal-qc | `power.config.json` | Missing | QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qc_jhr | ioi-portal-qc | `power.config.json` | Missing | QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_qc_ext_lab | ioi-portal-qc | `power.config.json` | Missing | QC forms | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| approvalhistory_qc | ioi-portal-qc | `power.config.json` | Missing | QC workflow | Blocked - Missing SharePoint Schema | Referenced by app metadata, no local schema file found in scan. |
| maindb_fin | ioi-portal-fin | `power.config.json` | `.power/schemas/sharepointonline/maindb_fin` | Finance forms | Not Started | Schema export found. |
| maindb_prd | ioi-portal-prd | `power.config.json` | `.power/schemas/sharepointonline/maindb_prd` | Production forms | Not Started | Schema export found. |
| maindb_she | ioi-portal-she | `power.config.json` | `.power/schemas/sharepointonline/maindb_she` | SHE forms | Not Started | Schema export found. |
| maindb_log | ioi-portal-log | `power.config.json` | `.power/schemas/sharepointonline/maindb_log` | Log candidates | Not Started | Schema export validated; 194 columns found, required field `Title`. |
| maindb_mtn | ioi-portal-mtn | `power.config.json` | `.power/schemas/sharepointonline/maindb_mtn` | Maintenance candidates | Not Started | Schema export validated; 198 columns found, required field `Title`. |
| maindb_wh | ioi-portal-wh | `power.config.json` | `.power/schemas/sharepointonline/maindb_wh` | Warehouse candidates | Not Started | Schema export validated; 108 columns found, required field `Title`. |
| maindb_admin | ioi-portal-admin | `power.config.json` | `.power/schemas/sharepointonline/maindb_admin` | Admin forms | Not Started | Schema export found; 92 columns found, required field `Title`. |
| maindb_ei | ioi-portal-ei | `power.config.json` | `.power/schemas/sharepointonline/maindb_ei` | EI forms | Not Started | Schema export found; 103 columns found, required field `Title`. |
| maindb_eng | ioi-portal-eng | `power.config.json` | `.power/schemas/sharepointonline/maindb_eng` | Engineering forms | Not Started | Schema export found; 132 columns found, required field `Title`. |
| maindb_mkt | ioi-portal-mkt | `power.config.json` | `.power/schemas/sharepointonline/maindb_mkt` | Marketing forms | Not Started | Schema export found; 109 columns found, required field `Title`. |
| maindb_pbi | ioi-portal-pbi | `power.config.json` | `.power/schemas/sharepointonline/maindb_pbi` | PBI forms | Not Started | Schema export found; 103 columns found, required field `Title`. |
| maindb_pom | ioi-portal-pom | `power.config.json` | `.power/schemas/sharepointonline/maindb_pom` | POM forms | Not Started | Schema export found; 92 columns found, required field `Title`. |
| maindb_prc | ioi-portal-prc | `power.config.json` | `.power/schemas/sharepointonline/maindb_prc` | PRC forms | Not Started | Schema export found; 92 columns found, required field `Title`. |
| maindb_rd | ioi-portal-rd | `power.config.json` | `.power/schemas/sharepointonline/maindb_rd` | R&D forms | Not Started | Schema export found; 103 columns found, required field `Title`. |
| maindb_sa | ioi-portal-sa | `power.config.json` | `.power/schemas/sharepointonline/maindb_sa` | SA forms | Not Started | Schema export found; 92 columns found, required field `Title`. |
| maindb_sec | ioi-portal-sec | `power.config.json` | `.power/schemas/sharepointonline/maindb_sec` | Security forms | Not Started | Schema export found; 108 columns found, required field `Title`. |
| maindb_td | ioi-portal-td | `power.config.json` | `.power/schemas/sharepointonline/maindb_td` | TD forms | Not Started | Schema export found; 103 columns found, required field `Title`. |
| approvalhistory_she | ioi-portal-she | `power.config.json` | `.power/schemas/sharepointonline/approvalhistory_she` | SHE workflow | Not Started | Schema export found. |
| issueandbugtracker | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/issueandbugtracker` | Admin/support | Not Started | Schema export found. |
| userroles | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/userroles` | Role logic | Not Started | Schema export found. |
| appsettings | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/appsettings` | App configuration | Not Started | Schema export found. |
| auditlogs | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/auditlogs` | Audit trail | Not Started | Schema export found. |
| routepermissions | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/routepermissions` | Route access | Not Started | Schema export found. |
| userprofiles | IOI-App_Admin_Sites | `power.config.json` | `.power/schemas/sharepointonline/userprofiles` | User profile logic | Not Started | Schema export found. |

## Schema Coverage Notes

| Item | Status | Notes |
|---|---|---|
| Local schema coverage | In Progress | 68 schema files found; 97 unique configured data sources remain in app metadata, and LOG/MTN/WH schema exports are field-usable. |
| Missing schemas | Blocked - Missing SharePoint Schema | Referenced lists without local schema files must be confirmed before field-level audit. |
| Zero-column schema exports | Completed - Passed | Current local scan found no zero-column schema exports; prior LOG/MTN/WH blocker was caused by reading `items.properties` instead of `schema.items.properties`. |
| Duplicate cross-site references | In Progress | Some QA/QC list names appear under more than one dataset; exact ownership requires field-level audit. |

## SharePoint Schema Discovery - 2026-06-01

| Discovery Item | Count | Evidence | Notes |
|---|---:|---|---|
| SharePoint schema files found | 68 | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/*.Schema.json` | Power Platform SDK schema files with `webUrl`, list title, required array, properties, field types, relationships, and attachment pseudo-fields. |
| Configured SharePoint data sources | 97 | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | Data sources from SharePoint connection references. |
| Configured data sources missing local schema | 29 | `power.config.json` compared with `.power/schemas/sharepointonline` | Listed below. |
| Total Columns identified from local schema files | 4,475 | `*.Schema.json` property scan | Includes SharePoint system fields and attachment pseudo-fields. |
| Required field entries identified | 129 | `schema.items.required` arrays | Required status is recorded only where schema files expose it. |
| Columns with unknown JSON type | 0 | `*.Schema.json` property scan | Field type was present for every parsed schema property. |
| Columns with explicit enum/choice values | 0 | `*.Schema.json` property scan | Choice values were not exposed as `enum` values in the local SDK schema files. Choice values remain `Unknown` unless found in another source. |
| Relationship/lookup entries identified | 280 | `schema.items.x-ms-relationships` | Includes lookup-like objects, people objects, content type, author/editor, and related entity references. |
| Person/group-like columns identified | 592 | Claims/display/email property scan | Includes Author/Editor and business people fields. |
| Date-like columns identified | 609 | `format=date-time` plus date-named fields | Some date-named fields are typed as `string`; exact SharePoint DateTime status requires live/list export confirmation. |
| Attachment-like columns identified | 444 | Attachment/document/file field-name scan | Includes SharePoint `{Attachments}` pseudo-fields and business attachment/file columns. |

## Local Schema Column Inventory

> Full column display names, internal names, field types, required flags, lookup relationships, and attachment pseudo-fields are in each evidence schema file. This register records the per-list schema coverage and high-signal columns for audit routing.

| List display name | Internal/list URL name | Site URL | Columns | Required fields | Field type counts | Lookup/person/relationship fields | Evidence file path |
|---|---|---|---:|---|---|---|---|
| ApprovalHistory_HR | $internal / $urlName | $site | 41 | Title | array=1; boolean=2; integer=2; number=1; object=5; string=30 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/approvalhistory_hr.Schema.json` |
| ApprovalHistory_QA | $internal / $urlName | $site | 41 | Title | array=1; boolean=2; integer=2; number=1; object=5; string=30 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/approvalhistory_qa.Schema.json` |
| ApprovalHistory_SHE | $internal / $urlName | $site | 38 | Title | array=1; boolean=2; integer=1; number=1; object=4; string=29 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/approvalhistory_she.Schema.json` |
| ApprovalHistory_STR | $internal / $urlName | $site | 41 | Title | array=1; boolean=2; integer=2; number=1; object=5; string=30 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/approvalhistory_str.Schema.json` |
| ApprovalRecords | $internal / $urlName | $site | 38 | Title, FormID, FormCode | array=1; boolean=2; integer=2; number=1; object=5; string=27 | Action, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/approvalrecords.Schema.json` |
| AppSettings | $internal / $urlName | $site | 36 | Title, settingKey | array=1; boolean=3; integer=3; object=6; string=23 | category, dataType, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/appsettings.Schema.json` |
| Assignments_STR | $internal / $urlName | $site | 44 | Title | array=1; boolean=2; integer=2; object=5; string=34 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/assignments_str.Schema.json` |
| AttachmentIndex_HR | $internal / $urlName | $site | 37 | Title | array=1; boolean=2; integer=2; object=5; string=27 | Site, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/attachmentindex_hr.Schema.json` |
| AttachmentIndex_STR | $internal / $urlName | $site | 43 | Title | array=1; boolean=2; integer=3; object=6; string=31 | EntitySite, Site, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/attachmentindex_str.Schema.json` |
| AuditLog_HR | $internal / $urlName | $site | 39 | Title | array=1; boolean=2; integer=2; object=5; string=29 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/auditlog_hr.Schema.json` |
| AuditLogs | $internal / $urlName | $site | 38 | Title, action | array=1; boolean=2; integer=3; object=6; string=26 | action, department, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/auditlogs.Schema.json` |
| Config_ApproverMatrix | $internal / $urlName | $site | 32 | Title, ConfigKey | array=1; boolean=2; integer=1; object=4; string=24 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_approvermatrix.Schema.json` |
| Config_Companies | $internal / $urlName | $site | 32 | Title | array=1; boolean=2; integer=1; object=4; string=24 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_companies.Schema.json` |
| Config_Departments | $internal / $urlName | $site | 32 | Title, ConfigKey | array=1; boolean=2; integer=1; object=4; string=24 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_departments.Schema.json` |
| Config_EmployeeDirectory | $internal / $urlName | $site | 32 | Title, ConfigKey | array=1; boolean=2; integer=1; object=4; string=24 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_employeedirectory.Schema.json` |
| Config_GlobalUserRoleAssignments | $internal / $urlName | $site | 37 | Title, UserPrincipalName, RoleKey | array=1; boolean=3; integer=2; object=5; string=26 | AssignmentScope, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_globaluserroleassignments.Schema.json` |
| Config_NotesAdminRouting | $internal / $urlName | $site | 32 | Title, ConfigKey | array=1; boolean=2; integer=1; object=4; string=24 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/config_notesadminrouting.Schema.json` |
| HR_AppraisalRecords | $internal / $urlName | $site | 35 | Title | array=1; boolean=2; integer=2; object=5; string=25 | Status, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/hr_appraisalrecords.Schema.json` |
| HR_HealthRegister | $internal / $urlName | $site | 38 | Title | array=1; boolean=2; integer=4; object=7; string=24 | Status, EntitySite, Site, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/hr_healthregister.Schema.json` |
| HR_InterviewPipeline | $internal / $urlName | $site | 37 | Title | array=1; boolean=2; integer=3; object=6; string=25 | EntitySite, Site, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/hr_interviewpipeline.Schema.json` |
| HR_RoutingMatrix | $internal / $urlName | $site | 44 | Title | array=1; boolean=2; integer=4; number=1; object=8; string=28 | EntitySite, ApproverEmail, ApproverType, Site, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/hr_routingmatrix.Schema.json` |
| Issue and bug tracker | $internal / $urlName | $site | 40 | None listed | array=1; boolean=2; integer=4; object=8; string=25 | Priority, Status, Assignedto0, RelatedIssue, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/issueandbugtracker.Schema.json` |
| IT_M1_RS_Banks | $internal / $urlName | $site | 28 | None listed | array=1; boolean=2; integer=1; object=4; string=20 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/it_m1_rs_banks.Schema.json` |
| IT_M1_RS_SAP_Client | $internal / $urlName | $site | 28 | None listed | array=1; boolean=2; integer=1; object=4; string=20 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/it_m1_rs_sap_client.Schema.json` |
| IT_M1_RS_SystemsList | $internal / $urlName | $site | 28 | None listed | array=1; boolean=2; integer=1; object=4; string=20 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/it_m1_rs_systemslist.Schema.json` |
| IT_M1_SFAR_Servers | $internal / $urlName | $site | 28 | None listed | array=1; boolean=2; integer=1; object=4; string=20 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/it_m1_sfar_servers.Schema.json` |
| IT_RoutingMatrix | $internal / $urlName | $site | 37 | Title, FormName, StageKey | array=1; boolean=3; integer=2; number=1; object=5; string=25 | SiteScope, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/it_routingmatrix.Schema.json` |
| ITForms | $internal / $urlName | $site | 47 | Title, FormCode, Status, EnvironmentTag | array=1; boolean=2; integer=4; object=7; string=33 | Status, Site, EnvironmentTag, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/itforms.Schema.json` |
| LineItems_STR | $internal / $urlName | $site | 40 | Title | array=1; boolean=2; integer=2; object=6; string=29 | EntitySite, CreatedBy, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/lineitems_str.Schema.json` |
| MainDB_ADMIN | $internal / $urlName | $site | 92 | Title | boolean=2; integer=6; number=1; object=38; string=45 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_admin.Schema.json` |
| MainDB_EI | $internal / $urlName | $site | 103 | Title | boolean=3; integer=6; number=2; object=39; string=53 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_ei.Schema.json` |
| MainDB_ENG | $internal / $urlName | $site | 132 | Title | boolean=2; integer=6; number=1; object=39; string=84 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_eng.Schema.json` |
| MainDB_FIN | $internal / $urlName | $site | 96 | Title, Status, Department, FormCode | array=1; boolean=2; integer=6; number=2; object=12; string=73 | Company, SendTo, Module2, ReportedBy, Status, Department, EntitySite, ApproverEmail, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_fin.Schema.json` |
| MainDB_HR_Ext_BSD | $internal / $urlName | $site | 53 | Title | array=1; boolean=2; integer=2; number=1; object=5; string=42 | bSDRevision, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_bsd.Schema.json` |
| MainDB_HR_Ext_Cafeteria | $internal / $urlName | $site | 44 | Title | array=1; boolean=2; integer=2; object=5; string=34 | cIRRecordType, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cafeteria.Schema.json` |
| MainDB_HR_Ext_CWR | $internal / $urlName | $site | 97 | Title | array=1; boolean=2; integer=2; number=14; object=5; string=73 | cWRFormType, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_cwr.Schema.json` |
| MainDB_HR_Ext_Records | $internal / $urlName | $site | 33 | Title | array=1; boolean=2; integer=2; object=5; string=23 | cIRRecSubType, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr_ext_records.Schema.json` |
| MainDB_HR | $internal / $urlName | $site | 169 | Title, FormCode, EmployeeID, EmployeeName | array=1; boolean=2; integer=12; number=1; object=22; string=131 | CaseStatus, Status, EntitySite, ApproverEmail, Manager, RequestType, Requester, HOD, ExitCategory, ExitType, DivHead, ReportedBy | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_hr.Schema.json` |
| MainDB_IT_Ext_Access | $internal / $urlName | $site | 179 | Title | boolean=2; integer=6; number=2; object=39; string=130 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_access.Schema.json` |
| MainDB_IT_Ext_Assets | $internal / $urlName | $site | 54 | Title, ParentID, ParentFormCode | array=1; boolean=2; integer=2; number=2; object=5; string=42 | ParentID, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_assets.Schema.json` |
| MainDB_IT_Ext_SAP | $internal / $urlName | $site | 49 | Title, ParentID, ParentFormCode | array=1; boolean=2; integer=2; object=5; string=39 | ParentID, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json` |
| MainDB_IT_Ext_Support | $internal / $urlName | $site | 58 | Title, ParentID, ParentFormCode | array=1; boolean=2; integer=2; number=1; object=5; string=47 | ParentID, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it_ext_support.Schema.json` |
| MainDB_IT | $internal / $urlName | $site | 257 | Title, FormCode, CurrentStatus, Status | array=1; boolean=3; integer=4; number=5; object=9; string=235 | CurrentStatus, SubmittedBy, Site, EnvironmentTag, LastModifiedBy, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_it.Schema.json` |
| MainDB_LOG | $internal / $urlName | $site | 194 | Title | boolean=5; integer=6; number=12; object=39; string=132 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_log.Schema.json` |
| MainDB_MKT | $internal / $urlName | $site | 109 | Title | boolean=3; integer=6; number=3; object=40; string=57 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_mkt.Schema.json` |
| MainDB_MTN | $internal / $urlName | $site | 198 | Title | boolean=4; integer=6; number=10; object=39; string=139 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_mtn.Schema.json` |
| MainDB_PBI | $internal / $urlName | $site | 103 | Title | boolean=3; integer=6; number=2; object=39; string=53 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_pbi.Schema.json` |
| MainDB_POM | $internal / $urlName | $site | 92 | Title | boolean=2; integer=6; number=1; object=38; string=45 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_pom.Schema.json` |
| MainDB_PRC | $internal / $urlName | $site | 92 | Title | boolean=2; integer=6; number=1; object=38; string=45 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_prc.Schema.json` |
| MainDB_PRD | $internal / $urlName | $site | 88 | Title, Status, Department, FormCode, FormID | array=1; boolean=2; integer=4; object=9; string=72 | Status, Department, EntitySite, ApproverEmail, Supervisor, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_prd.Schema.json` |
| MainDB_QA | $internal / $urlName | $site | 68 | Title, Status, FormCode, FormID, Department, ChangeControlNo, FormType | array=1; boolean=3; integer=7; number=1; object=13; string=43 | Status, Department, FormType, EntitySite, ApproverEmail, Severity, ProposedByEmail, CurrentApproverEmail, Priority, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_qa.Schema.json` |
| MainDB_RD | $internal / $urlName | $site | 103 | Title | boolean=3; integer=6; number=2; object=39; string=53 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_rd.Schema.json` |
| MainDB_SA | $internal / $urlName | $site | 92 | Title | boolean=2; integer=6; number=1; object=38; string=45 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_sa.Schema.json` |
| MainDB_SEC | $internal / $urlName | $site | 108 | Title | boolean=3; integer=6; number=2; object=40; string=57 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_sec.Schema.json` |
| MainDB_SHE | $internal / $urlName | $site | 53 | Title, Status, FormCode, Department | array=1; boolean=3; integer=5; number=1; object=9; string=34 | Status, Department, EntitySite, ApproverEmail, Priority, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_she.Schema.json` |
| MainDB_STR | $internal / $urlName | $site | 91 | Title, Status, Department, FormCode | array=5; boolean=2; integer=5; object=10; string=69 | EntitySite, Status, Department, ApproverEmail, OData__ApprovalAssignedTo, OData__ApprovalRespondedBy, OData__ApprovalSentBy, Author, Editor, {ContentType}, {ApprovalStatus} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_str.Schema.json` |
| MainDB_TD | $internal / $urlName | $site | 103 | Title | boolean=3; integer=6; number=2; object=39; string=53 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_td.Schema.json` |
| MainDB_WH | $internal / $urlName | $site | 108 | Title | boolean=3; integer=6; number=3; object=39; string=57 | None listed | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/maindb_wh.Schema.json` |
| OpsLog_HR | $internal / $urlName | $site | 36 | Title | array=1; boolean=2; integer=2; object=5; string=26 | EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/opslog_hr.Schema.json` |
| Policies | $internal / $urlName | $site | 46 | Title, FormCode, PolicyNumber, RevisionNumber, Subject, PolicyOwnerID, DocumentAuthorID, Status, CurrentAction, EnvironmentTag, DateIssued | array=1; boolean=2; integer=4; object=7; string=32 | Status, CurrentAction, EnvironmentTag, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/policies.Schema.json` |
| QA_ActionItems | $internal / $urlName | $site | 38 | Title | array=1; boolean=2; integer=4; object=7; string=24 | StatusValue, ParentID, ActionType, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/qa_actionitems.Schema.json` |
| QA_HACCP_ReviewRecord | $internal / $urlName | $site | 33 | Title | array=1; boolean=2; integer=1; object=4; string=25 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/qa_haccp_reviewrecord.Schema.json` |
| QA_SubActionItems | $internal / $urlName | $site | 38 | Title | array=1; boolean=2; integer=4; number=1; object=7; string=23 | VerifStatus, ParentID, ChildID, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/qa_subactionitems.Schema.json` |
| RoutePermissions | $internal / $urlName | $site | 38 | Title, routePath | array=3; boolean=4; integer=2; object=5; string=24 | department, allowedRoles, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/routepermissions.Schema.json` |
| User_Roles_IT | $internal / $urlName | $site | 43 | Title, UserEmail, UserDisplayName, RoleCode, SecurityRole | array=1; boolean=3; integer=4; object=7; string=28 | RoleCode, Site, EntitySite, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/user_roles_it.Schema.json` |
| UserProfiles | $internal / $urlName | $site | 41 | Title, email, displayName | array=1; boolean=3; integer=3; object=7; string=27 | department, site, manager, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/userprofiles.Schema.json` |
| UserRoles | $internal / $urlName | $site | 43 | Title, userId, role | array=3; boolean=4; integer=3; object=7; string=26 | role, department, moduleAccess, assignedBy, Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/userroles.Schema.json` |
| WorkflowAuditLog | $internal / $urlName | $site | 38 | Title, FormCode | array=1; boolean=2; integer=1; number=1; object=4; string=29 | Author, Editor, {ContentType} | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/workflowauditlog.Schema.json` |

## Configured Lists Missing Local Schema

| Data Source Key | Site URL from `power.config.json` | Status | Notes |
|---|---|---|---|
| approvalhistory_qc | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| hr_fwwpd_complianceassets | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| hr_fwwpd_hostelrecords | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| hr_fwwpd_insurancedeductions | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| hr_migrationreminderlog | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| lookuptargetb1de9795563e48c399a31430234dc6e2 | `https://ioioi.sharepoint.com/sites/ioi-portal-it` | Blocked - Ambiguous Requirement | Lookup alias points to MainDB_IT table ID; treat as alias until confirmed. |
| maindb_hr_ext_een | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_epdu | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_ephr | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_esf | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_ftcr | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_fwwpd | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_fwwpe | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_gdsn | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_healthinfo | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_hr_ext_hrapr | `https://ioioi.sharepoint.com/sites/ioi-portal-hr` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_it_ext_policy | `https://ioioi.sharepoint.com/sites/ioi-portal-it` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_it_jhr | `https://ioioi.sharepoint.com/sites/ioi-portal-it` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_assessment | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_capa | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_changecontrol | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_halalcert | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_ims | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_product | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_ext_records | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qa_jhr | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qc | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qc_ext_lab | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |
| maindb_qc_jhr | `https://ioioi.sharepoint.com/sites/ioi-portal-qc` | Blocked - Missing SharePoint Schema | Data source is configured but no local `.Schema.json` was found. |

## Column Gap Discovery

| Gap Type | Count | Evidence | Status | Notes |
|---|---:|---|---|---|
| App/form-schema `spColumn` references checked | 115 | `src/form-schemas/**/*.json` compared with local schema files | In Progress | Uses `spColumn`/`spTable` metadata from app schemas. |
| App/form-schema `spColumn` references missing from expected local schema | 111 | `src/form-schemas/**/*.json`; `.power/schemas/sharepointonline/*.Schema.json` | Completed - Issues Found | Many schema references use legacy/mixed-case internal names that do not match current schema columns. |
| Field-mapping target columns checked | 66 | `mapping/field-mapping.csv` compared with local schema files | In Progress | Mapping source is source-of-truth intent, not necessarily implemented app code. |
| Field-mapping target columns missing from local schema | 59 | `mapping/field-mapping.csv`; local schema files | Completed - Issues Found | Indicates mapping/schema drift that must be reconciled during field audit. |
| Required schema fields not referenced by form-schema `spColumn` metadata | 129 | `schema.items.required` compared with `src/form-schemas` | Completed - Issues Found | Treat as Possibly Missing in App until per-form code proves values are supplied elsewhere. |
| Schema columns missing from app but required by original source form | Unknown | Requires per-form source audit | Not Started | Do not classify source-required missing implementation until each source form is audited. |

### App-Referenced Columns Missing From Schema

| Source | Missing Count | Affected Forms/Lists | Evidence | Notes |
|---|---:|---|---|---|
| App form schemas | 111 | DCALOG: 7; EAF/ExtAccess: 23; EAF/MainDB_IT: 2; HI/MainDB_IT: 34; ITSSR: 5; ITSSR/ExtSupport: 26; SVRREC: 14 | `src/form-schemas/**/*.json`; local schema files | Missing means the exact `spColumn` string was not found in the expected local schema file. Case and renamed-column drift are included. |
| Field mapping CSV | 59 | MainDB_IT: 31; MainDB_IT_Ext_Access: 3; MainDB_IT_Ext_Assets: 14; MainDB_IT_Ext_SAP: 5; MainDB_IT_Ext_Support: 6 | `mapping/field-mapping.csv`; local schema files | Mapping target examples missing from schema include `TargetUser`, `Description`, `ApplicationType`, `HODStatus`, `AssetTag`, `CaseNo`, `CurrentStatus`, and `ShareFolder`. |

### Required Schema Columns Possibly Missing From App

| List | Required Columns Not Referenced By Form Schema Metadata | Status | Notes |
|---|---|---|---|
| Core IT lists | MainDB_IT: `Title`, `FormCode`, `CurrentStatus`, `Status`; ITForms: `Title`, `FormCode`, `Status`, `EnvironmentTag`; extension lists: `Title`, `ParentID`, `ParentFormCode` | Completed - Issues Found | These may be supplied in page code instead of form schema metadata; verify during batch audits. |
| Workflow/config lists | ApprovalRecords: `Title`, `FormID`, `FormCode`; IT_RoutingMatrix: `Title`, `FormName`, `StageKey`; Policies: `Title`, `FormCode`, `PolicyNumber`, `RevisionNumber`, `Subject`, `PolicyOwnerID`, `DocumentAuthorID`, `Status`, `CurrentAction`, `EnvironmentTag`, `DateIssued` | Completed - Issues Found | Required values must be verified in admin/workflow screens or provisioning scripts. |
| Department main lists | MainDB_HR, MainDB_FIN, MainDB_PRD, MainDB_QA, MainDB_SHE, MainDB_STR required fields | Completed - Issues Found | Current form schema metadata does not prove these are populated. Audit related department screens before build. |
| Admin/config lists | AppSettings, AuditLogs, Config* lists, UserRoles, UserProfiles, RoutePermissions | Completed - Issues Found | App/admin code may populate these outside dynamic form schemas. Requires targeted admin/config audit. |

## Schema Source Files Found

| Source File or Group | File Type | What It Describes | Evidence Use |
|---|---|---|---|
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/*.Schema.json` | JSON | Local Power Platform schema exports for 68 SharePoint lists. | Primary local schema evidence. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | JSON | SharePoint connection references, site URLs, table IDs, and configured data source keys. | Primary connection/data source evidence. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit.latest.json` | JSON | 72 SharePoint provisioning/audit rows with list names, site URLs, status, and planned/existing column counts. | PnP/provisioning audit evidence. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-*.csv` and `.json` | CSV/JSON | Timestamped SharePoint list audit exports. | Historical schema/provisioning evidence. |
| `docs/sharepoint-schemas/schema-reference.md` | Markdown | SharePoint schema reference documentation. | Documentation evidence; reconcile with schema exports. |
| `docs/sharepoint-schemas/dynamic-form-column-audit.md` | Markdown | Dynamic form column audit notes. | Field-mapping evidence. |
| `design/m365-design/sharepoint-list-design.md` | Markdown | Target SharePoint list design. | Design intent only if it conflicts with schema exports. |
| `apps/code-first/ioicodeapp/IT_Forms_ForSharePoint.xlsx`; `apps/code-first/ioicodeapp/IT_Forms_ForSharePoint_NEW.xlsx`; `apps/code-first/ioicodeapp/IT_Routing_Configuration.xlsx` | Excel | IT list/form/routing workbooks. | Excel schema/routing evidence; worksheet-level parsing still needed. |

## Register Sync - 2026-06-01

| Sync Item | Result | Evidence | Notes |
|---|---:|---|---|
| Unique SharePoint data sources refreshed | 86 | `power.config.json` | Added current LOG, MTN, and WH main list references. |
| Local schema files refreshed | 68 | `.power/schemas/sharepointonline` | `maindb_log`, `maindb_mtn`, and `maindb_wh` validate with populated columns; local schema scan has no zero-column exports. |
| Missing local schema count | 29 | `power.config.json` compared with schema directory | Explicit missing-list comparison still identifies 29 configured data source keys without matching local schema files; LOG/MTN/WH are no longer part of the schema blocker. |
## Source Document Discovery - 2026-06-01

| Source File or Group | File Type | Related Department | Related Form/List | Fields Visible or Described | Approval/Workflow Information Found | Can Be Used As Audit Evidence | Notes |
|---|---|---|---|---|---|---|---|
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | JSON | App-wide | 97 SharePoint data sources | List/table references and connection references | Connector references include SharePoint, Approvals, Office 365 Users, Outlook, Groups, and others | Yes | Primary app connection metadata. Does not prove per-form approval. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/` | SharePoint schema exports | App-wide | 68 local schema exports, all with parsed columns | SharePoint columns and generated schema metadata | Status/approval columns where present | Yes | Local schema coverage is partial against 97 configured data sources. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit.latest.json` | JSON | App-wide | SharePoint list audit export | List/column audit data from provisioning pass | Status/approval columns where present | Yes | Strong SharePoint evidence from audit output; reconcile with latest live export before build. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-165721.csv` | CSV | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-165721.json` | JSON | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-165942.csv` | CSV | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-165942.json` | JSON | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-170040.csv` | CSV | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-provisioning/sharepoint-list-audit-20260531-170040.json` | JSON | App-wide | SharePoint list audit export | List/column audit rows | Status/approval columns where present | Yes | Historical audit export. |
| `analysis/sharepoint-integration-audit.md` | Markdown | IT, HR, QA/QC | SharePoint integration across app lists | Column existence, field types, read/write logic, parent-child patterns | Status and approval list interactions where audited | Yes | Strong analysis source, but findings must be tied to specific audit items. |
| `docs/sharepoint-schemas/schema-reference.md` | Markdown | App-wide | SharePoint schema reference | Field/schema reference | Status/approval fields where documented | Yes | Documentation evidence; reconcile with live schema exports. |
| `docs/sharepoint-schemas/dynamic-form-column-audit.md` | Markdown | IT | Dynamic form columns | Dynamic form column mapping | Workflow/status columns where documented | Yes | Useful for field-level audit. |
| `design/m365-design/sharepoint-list-design.md` | Markdown | App-wide | Designed SharePoint lists | Target column design | Workflow/status design intent | Yes, design intent | Lower priority than live/schema export if conflicts occur. |
| `apps/code-first/ioicodeapp/scripts/sharepoint-app-lists.csv` | CSV | App-wide | SharePoint app lists | List inventory rows | Unknown | Yes | Utility/source inventory. |
| `apps/code-first/ioicodeapp/scripts/maindb-it-columns.json` and `apps/code-first/ioicodeapp/scripts/maindb-it-columns-v2.json` | JSON | IT | MainDB_IT | MainDB_IT column definitions | Status columns where present | Yes | Script source evidence; reconcile with actual SharePoint export. |
| `apps/code-first/ioicodeapp/powerapps-mirror/scripts/maindb-it-columns.json` and `maindb-it-columns-v2.json` | JSON | IT | MainDB_IT | MainDB_IT column definitions | Status columns where present | Yes | Mirror script evidence; possible duplicate of script folder definitions. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/scripts/hr-migration/hr-list-definitions.json` | JSON | HR | HR SharePoint lists | HR list definitions | HR workflow/status fields if defined | Yes | HR-specific schema source. |
| `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/scripts/hr-migration/hr-list-ids.generated.json` | JSON | HR | HR SharePoint lists | Generated list IDs | No workflow by itself | Yes | Confirms generated IDs, not field-level behavior. |

## SharePoint Source Files With Unclear Relationship

| Source File or Group | File Type | Reason Relationship Is Unclear | Status |
|---|---|---|---|
| Duplicate/dated SharePoint audit exports in `analysis/sharepoint-provisioning/` | CSV/JSON | Multiple timestamped exports exist; latest export should be preferred unless a form audit needs historical comparison. | In Progress |
| `lookuptargetb1de9795563e48c399a31430234dc6e2` in `power.config.json` | Connection metadata | Appears to be a lookup alias to MainDB_IT by table ID, not a human-named list. | Blocked - Ambiguous Requirement |
| Missing schema files for 29 configured data sources | JSON/schema | Configured lists exist in app metadata, but local schema exports were not found. | Blocked - Missing SharePoint Schema |











