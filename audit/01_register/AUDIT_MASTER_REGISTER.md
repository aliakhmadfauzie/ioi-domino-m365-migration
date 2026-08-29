# Audit Master Register

> Created for the numbered audit control system. Existing legacy audit rows from `audit/audit-register.md` are preserved below with strict status and approval vocabulary.

## Repository Inventory Discovery - 2026-05-31

| Discovery Item | Count | Evidence | Audit Status | Notes |
|---|---:|---|---|---|
| Total repository files scanned | 40,361 | `rg --files` from repository root | In Progress | Includes app source, audit files, docs, generated dependencies, and node_modules. |
| Power Apps screens/pages found | 277 | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages` | In Progress | TS/TSX page files treated as code-first app screens. |
| Candidate forms assigned Audit IDs | 67 | `FORM_INVENTORY.md` | In Progress | AUD-001 through AUD-067 assigned. |
| Form schema JSON files found | 29 | `src/form-schemas` | In Progress | Includes 27 current schema files plus 2 `_legacy` schema files. |
| Component files found | 156 | `src/components` | In Progress | Shared and feature components require follow-up mapping. |
| TypeScript/TSX files found in app source | 879 | `src` | In Progress | 454 TSX files and 425 TS files. |
| YAML files found | 2 | `node_modules/jws/opslevel.yml`; `node_modules/jwa/opslevel.yml` | Blocked - Missing App File | No app-level Power Fx YAML files were found in the active app source scan. |
| SharePoint data sources referenced | 97 | `power.config.json` | In Progress | Detailed in `SHAREPOINT_LIST_INVENTORY.md`. |
| Local SharePoint schema files found | 68 | `.power/schemas/sharepointonline` | In Progress | Some referenced lists are missing local schema exports; LOG, MTN, and WH schema exports are now validated as field-usable. |
| Connector references found | 18 | `power.config.json` | In Progress | SharePoint and M365 connector references detailed in `DATA_CONNECTION_REGISTER.md`. |
| Workflow/status/approval references found | 5,530 | `src` source scan | In Progress | 421 status, 1,239 workflow, 3,870 approval-related references. |
| Role/visibility/validation references found | 5,772 | `src` source scan | In Progress | 1,772 role, 1,120 visibility, 2,880 validation/schema references. |

## Function and Logic Scan

| Logic Pattern | Count | Evidence Path | Audit Status | Notes |
|---|---:|---|---|---|
| Patch | 4 | `src` source scan | Not Started | Power Fx-style token found in TypeScript/TSX. Requires call-site audit. |
| SubmitForm | 0 | `src` source scan | Blocked - Missing App File | No Canvas `SubmitForm` formula usage found. |
| Collect | 1 | `src` source scan | Not Started | Requires call-site audit. |
| ClearCollect | 0 | `src` source scan | Blocked - Missing App File | No Canvas `ClearCollect` formula usage found. |
| Filter | 209 | `src` source scan | Not Started | Likely includes TypeScript names/text; requires call-site audit. |
| LookUp | 0 | `src` source scan | Blocked - Missing App File | No Canvas `LookUp` formula usage found. |
| Defaults | 0 | `src` source scan | Blocked - Missing App File | No Canvas `Defaults` formula usage found. |
| UpdateIf | 0 | `src` source scan | Blocked - Missing App File | No Canvas `UpdateIf` formula usage found. |
| Remove | 23 | `src` source scan | Not Started | Requires call-site audit; may include non-Power Fx usage. |
| ForAll | 0 | `src` source scan | Blocked - Missing App File | No Canvas `ForAll` formula usage found. |

## Register Summary

| Batch | Forms | Status | Started | Completed | Finding Files | Open Issues |
|---|---|---|---|---|---|---:|
| 1 | EAF, ITSSR, HI | Completed - Issues Found | 2026-05-31 | 2026-05-31 | 3 | 6 |
| 2 | SAPCR, SAPAMR, SAPTR | Completed - Issues Found | 2026-05-31 | 2026-05-31 | 3 | 7 |
| 3 | SAPCA, SAPDRP, SAPSLCF | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 3 | 6 |
| 4 | NIR, RS, UR | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 3 | 6 |
| 5 | ITSC, SFAR, DCALOG | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 3 | 6 |
| 6 | IOIPOL, ISGDOC, ITINFO | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 3 | 6 |
| 7 | ITDR, ITDR2, ITDAILYRPT | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 3 | 6 |
| 8 | PRF, INTUATSOF/SILOUATSOF, TRNMAN | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 4 | 8 |
| 9 | ITEVT, SVRREBOOT/SVRREC, PWDRESET | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 4 | 9 |
| 10 | MPSPRN, SAPSOF2 | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 2 | 6 |
| Audit Batch 003 | PRF, INTUATSOF, SILOUATSOF, TRNMAN, ITEVT, SVRREBOOT, SVRREC, PWDRESET, MPSPRN, SAPSOF2 | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 10 | 22 |
| Audit Batch 004 | HWINV_PRAI, NOTESID, USERID, VPNACCESS, ENGINEERING-[FORMCODE], IT-[FORMCODE], SECURITY-[FORMCODE], TRAINING-[FORMCODE], ASSET-SUBMISSION, DCAL | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 10 | 10 |
| Audit Batch 005 | DRR, EDL, HWRR, IOIP, ITP, SAP-INC, SRL, SRR, SRVR, LOG-CSD | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 10 | 10 |
| Audit Batch 006 | LOG-ECMFB, LOG-FBN, LOG-GTPW, LOG-POD, LOG-TI, LOG-TMI, QA-ICAR, QA-SOP, QA-WI, QC-CALIBRATION | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 10 | 10 |
| Audit Batch 007 | QC-LWR, QC-OOS, QC-PQCAR, HR-BSD, HR-CAFETERIA, HR-CWR | Completed - Issues Found | 2026-06-01 | 2026-06-01 | 6 | 6 |

## Batch 1 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Finding File | Backlog IDs | Notes |
|---|---|---|---|---|---|---|---|
| AUD-002 | EAF | External Access Form (VPN & Citrix) | Completed - Issues Found | Required | `audit/findings/batch-01/eaf.md` | AUD-B01-EAF-001, AUD-B01-EAF-002 | Missing/contradictory EAF extension fields and workflow status column names found. |
| AUD-013 | ITSSR | IT Support & Service Request | Completed - Issues Found | Not Required | `audit/findings/batch-01/itssr.md` | AUD-B01-ITSSR-001, AUD-B01-ITSSR-002 | IT routing PIC is not persisted on create; schema references columns not in generated model/schema. |
| AUD-003 | HI | Hardware Inventory | Completed - Issues Found | Not Required | `audit/findings/batch-01/hi.md` | AUD-B01-HI-001, AUD-B01-HI-002 | Create writes Ext_Assets but list/detail read MainDB_IT; schema table placement conflicts with implementation. |

## Batch 2 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Finding File | Backlog IDs | Notes |
|---|---|---|---|---|---|---|---|
| AUD-019 | SAPCR | SAP & WB Change Request | Completed - Issues Found | Required | `audit/findings/batch-02/sapcr.md` | AUD-B02-SAPCR-001, AUD-B02-SAPCR-002 | Submit creates Request/Draft state; field storage and Ext_SAP schema coverage conflict. |
| AUD-017 | SAPAMR | SAP Authorisation Matrix Review | Completed - Issues Found | Required | `audit/findings/batch-02/sapamr.md` | AUD-B02-SAPAMR-001, AUD-B02-SAPAMR-002 | TBV/TBA routing fields are not confirmed persisted; implementation relies on remarks JSON while schema is legacy. |
| AUD-022 | SAPTR | SAP Transport Request | Completed - Issues Found | Required | `audit/findings/batch-02/saptr.md` | AUD-B02-SAPTR-001, AUD-B02-SAPTR-002, AUD-B02-SAPTR-003 | New submissions are marked Approved; list page uses sample data; Ext_SAP columns need live confirmation. |

## Batch 001 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-018 | SAPCA | SAP Configuration Access Form | Completed - Issues Found | Required | High | `audit/03_findings/IT/AUD-018_SAPCA_AUDIT.md` | AUD-B001-SAPCA-001, AUD-B001-SAPCA-002 | 2026-06-01 | Source/workflow evidence exists; list read uses sample data and approval actions are console-only; structured SharePoint mapping incomplete. |
| AUD-020 | SAPDRP | SAP DRP Procedures | Completed - Issues Found | Unknown | High | `audit/03_findings/IT/AUD-020_SAPDRP_AUDIT.md` | AUD-B001-SAPDRP-001, AUD-B001-SAPDRP-002 | 2026-06-01 | Source has pending endorsement/approval views; implementation stores payload in remarks and does not implement workflow transitions. |
| AUD-021 | SAPSLCF | SAP Storage Location Creation Form | Completed - Issues Found | Unknown | High | `audit/03_findings/IT/AUD-021_SAPSLCF_AUDIT.md` | AUD-B001-SAPSLCF-001, AUD-B001-SAPSLCF-002 | 2026-06-01 | Source/app show status or HOD/IT stages but submit/read rely on remarks JSON and workflow state is not implemented. |
| AUD-043 | NIR | Notes ID Request | Completed - Issues Found | Required | High | `audit/03_findings/IT/AUD-043_NIR_AUDIT.md` | AUD-B001-NIR-001, AUD-B001-NIR-002 | 2026-06-01 | Source confirms workflow; app creates records but approval buttons only log and status key needs confirmation. |
| AUD-044 | RS | Reset Password / Unlock ID | Completed - Issues Found | Conditional | High | `audit/03_findings/IT/AUD-044_RS_AUDIT.md` | AUD-B001-RS-001, AUD-B001-RS-002 | 2026-06-01 | Source/docs conflict on approval; app states direct IT PIC flow with conditional ED approval for bank systems, but action handlers are console-only. |

## Batch 002 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-050 | UR | User Registration / User ID Request | Completed - Issues Found | Unknown | High | `audit/03_findings/IT/AUD-050_UR_AUDIT.md` | AUD-B002-UR-001, AUD-B002-UR-002 | 2026-06-01 | Approval remains Unknown; DynamicFormRenderer sets Approved and no ExtAccess write was proven. |
| AUD-012 | ITSC | IT Server Checklist | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-012_ITSC_AUDIT.md` | AUD-B002-ITSC-001, AUD-B002-ITSC-002 | 2026-06-01 | Source supports no approval; submit status is Approved and ExtAssets read parity is incomplete. |
| AUD-023 | SFAR | Share Folder Access Requisition | Completed - Issues Found | Required | Critical | `audit/03_findings/IT/AUD-023_SFAR_AUDIT.md` | AUD-B002-SFAR-001, AUD-B002-SFAR-002 | 2026-06-01 | Source proves approval is required; shared submit path sets Approved and does not prove ExtAccess persistence. |
| AUD-001 | DCALOG | Daily Call / Activity Log | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-001_DCALOG_AUDIT.md` | AUD-B002-DCALOG-001, AUD-B002-DCALOG-002 | 2026-06-01 | DCALOG source match is unclear; app route renders/reads IAL2 together with DCALOG. |
| AUD-006 | IOIPOL | IOI Policy | Verified | Required | High | `audit/03_findings/IT/AUD-006_IOIPOL_AUDIT.md` | FIX-028, FIX-029 verified | 2026-06-03 | IOIPOL aliases to active IOIP for UAT; approval transitions persist through MainDB_IT action history and MainDB_IT_Ext_Policy fields; live tenant readback not run. |
| AUD-007 | ISGDOC | ISG Document / IT Procedures | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-007_ISGDOC_AUDIT.md` | AUD-B002-ISGDOC-001, AUD-B002-ISGDOC-002 | 2026-06-01 | Source supports no approval; submit status is Approved and ExtDocs mapping is incomplete. |
| AUD-011 | ITINFO | IT Info | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-011_ITINFO_AUDIT.md` | AUD-B002-ITINFO-001, AUD-B002-ITINFO-002 | 2026-06-01 | Workflow evidence conflicts; app writes ExtDocs but list evidence only proves MainDB_IT reads. |
| AUD-040 | ITDR | IT Daily Report | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-040_ITDR_AUDIT.md` | AUD-B002-ITDR-001, AUD-B002-ITDR-002 | 2026-06-01 | ITDR route stores FormCode ITDAILYRPT, uses Approved status, and does not prove ExtSupport read parity. |
| AUD-009 | ITDR2 | IT Daily Report 2 | Blocked - Missing App File | Not Required | High | `audit/03_findings/IT/AUD-009_ITDR2_AUDIT.md` | AUD-B002-ITDR2-001, AUD-B002-ITDR2-002 | 2026-06-01 | New page exists, but no ITDR2 list/detail read implementation was found. |
| AUD-008 | ITDAILYRPT | IT Daily Report Schema Candidate | Blocked - Ambiguous Requirement | Not Required | Unknown | `audit/03_findings/IT/AUD-008_ITDAILYRPT_AUDIT.md` | AUD-B002-ITDAILYRPT-001, AUD-B002-ITDAILYRPT-002 | 2026-06-01 | ITDAILYRPT overlaps with AUD-040 ITDR and needs a source/register decision. |

## Batch 003 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-015 | PRF | Program Request Form | Completed - Issues Found | Required | High | `audit/03_findings/IT/AUD-015_PRF_AUDIT.md` | AUD-B003-PRF-001, AUD-B003-PRF-002 | 2026-06-01 | PRF source/workflow is strong, but ExtAccess child workflow persistence and status mapping conflict need fixes. |
| AUD-005 | INTUATSOF | IntuatSOF | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-005_INTUATSOF_AUDIT.md` | AUD-B003-INTUATSOF-001, AUD-B003-INTUATSOF-002 | 2026-06-01 | INTUATSOF overlaps with SAPSOF/SAPSOF2 evidence and no dedicated app route was found. |
| AUD-024 | SILOUATSOF | SilouatSOF | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-024_SILOUATSOF_AUDIT.md` | AUD-B003-SILOUATSOF-001, AUD-B003-SILOUATSOF-002 | 2026-06-01 | SILOUATSOF overlaps with SAPSOF/SAPSOF2 evidence and no dedicated app route was found. |
| AUD-027 | TRNMAN | Training Manuals | Blocked - Missing Source | Not Required | High | `audit/03_findings/IT/AUD-027_TRNMAN_AUDIT.md` | AUD-B003-TRNMAN-001, AUD-B003-TRNMAN-002 | 2026-06-01 | Original source is not confirmed; app writes Approved status and remarks JSON only. |
| AUD-010 | ITEVT | IT Event Record | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-010_ITEVT_AUDIT.md` | AUD-B003-ITEVT-001, AUD-B003-ITEVT-002 | 2026-06-01 | ITE new page renders IAL3 while list reads ITEVT; source mapping remains unclear. |
| AUD-025 | SVRREBOOT | Server Reboot | Completed - Issues Found | Not Required | High | `audit/03_findings/IT/AUD-025_SVRREBOOT_AUDIT.md` | AUD-B003-SVRREBOOT-001, AUD-B003-SVRREBOOT-002 | 2026-06-01 | SRL new page renders IAL1 while list reads SVRREBOOT. |
| AUD-026 | SVRREC | Server Record / RCA | Completed - Issues Found | Unknown | High | `audit/03_findings/IT/AUD-026_SVRREC_AUDIT.md` | AUD-B003-SVRREC-001, AUD-B003-SVRREC-002 | 2026-06-01 | SRVR new/list/detail use conflicting form codes IAL4, SVRREC, and SRVR. |
| AUD-016 | PWDRESET | Password Reset Legacy Schema | Blocked - Ambiguous Requirement | Not Required | Unknown | `audit/03_findings/IT/AUD-016_PWDRESET_AUDIT.md` | AUD-B003-PWDRESET-001, AUD-B003-PWDRESET-002 | 2026-06-01 | PWDRESET is documented as superseded by RS and has no dedicated app implementation. |
| AUD-042 | MPSPRN | MPS Printer Request | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-042_MPSPRN_AUDIT.md` | AUD-B003-MPSPRN-001, AUD-B003-MPSPRN-002, AUD-B003-MPSPRN-003 | 2026-06-01 | No original source was found; only a new page exists and status keys appear reversed. |
| AUD-046 | SAPSOF2 | SAP Sign-Off Form 2 | Completed - Issues Found | Required | Critical | `audit/03_findings/IT/AUD-046_SAPSOF2_AUDIT.md` | AUD-B003-SAPSOF2-001, AUD-B003-SAPSOF2-002, AUD-B003-SAPSOF2-003 | 2026-06-01 | Required sign-off form uses Approved status, sample data list, and unproven child workflow persistence. |

## Audit ID Coverage Added by Inventory

| Audit ID Range | Count | Source | Status | Notes |
|---|---:|---|---|---|
| AUD-001 to AUD-029 | 29 | `src/form-schemas` | In Progress | Schema-backed forms and legacy schema-backed candidates. |
| AUD-030 to AUD-033 | 4 | Department dynamic route folders | Blocked - Ambiguous Requirement | Dynamic `[formCode]` routes require source confirmation. |
| AUD-034 to AUD-050 | 17 | IT page-only form routes | Completed - Issues Found | Page evidence exists; item-level findings now classify rows as completed or blocked. |
| AUD-051 to AUD-057 | 7 | Log page-only form routes | Blocked - Missing Source | Page evidence and MainDB_LOG schema exist, but original source/workflow evidence is incomplete. |
| AUD-058 to AUD-060 | 3 | QA page-only form routes | Blocked - Ambiguous Requirement | QA route/source variants require ownership and workflow decisions. |
| AUD-061 to AUD-064 | 4 | QC page-only form routes | Blocked - Missing SharePoint Schema | QC route/source variants require schema and ownership decisions. |
| AUD-065 to AUD-067 | 3 | HR page-only form routes | Blocked - Ambiguous Requirement | HR source/app/schema evidence exists for some items, but field mapping, source, or approval classification remains unresolved. |

## Items Needing Clarification

| Item | Why It Needs Clarification | Current Status |
|---|---|---|
| Page-only candidate forms | App routes exist, but form names, Domino source, SharePoint schema, and workflow behavior are not fully confirmed. | Blocked - Ambiguous Requirement |
| Missing local SharePoint schema files | 97 unique SharePoint data sources are configured; 68 local schema files were found, LOG/MTN/WH expose columns, and 29 configured data sources still lack local schema files. | Blocked - Missing SharePoint Schema |
| Power Fx formulas | No app-level Canvas Power Fx YAML files were found; this is a code-first app. | Blocked - Missing App File |
| Office 365 Users usage | Connector references exist, but runtime call sites need mapped evidence. | Not Started |
| Approval requirements for unresolved forms | Approval must be classified only from evidence; unresolved rows remain Unknown and blocked where needed. | Blocked - Ambiguous Requirement |

## Source Document Discovery - 2026-06-01

| Discovery Item | Count | Evidence | Audit Status | Notes |
|---|---:|---|---|---|
| Source/evidence files found in whole repository | 3,568 | `rg --files` for PDF, Excel, Word, Markdown, CSV, JSON, XML/DXL, and image extensions | In Progress | Includes generated/dependency files. |
| Source/evidence files found in project evidence folders, excluding `node_modules`, `dist`, and `.venv` | 1,923 | `source`, `analysis`, `mapping`, `m365-design`, `docs`, `ioicodeapp` scan | In Progress | Used as practical audit evidence population. |
| PDF files found | 1,172 | Repository scan | In Progress | 626 clean HCL PDFs plus fallback/legacy PDFs and one IT schema PDF. |
| Clean HCL form PDFs | 626 | `source/pdf/pdf_form_hcl/hcl_form_pdf/` | In Progress | Primary PDF/UI evidence source. |
| Extracted embedded PDFs | 546 | `source/Project Iventories/extracted-embedded-pdfs/` | In Progress | Fallback PDF source where HCL PDFs are missing or relationship needs cross-check. |
| IT HCL PDFs mapped by filename/content evidence | 34 | `source/pdf/pdf_form_hcl/hcl_form_pdf/PRAI_SITE_FORM/IT`; `JOHOR_SITE_FORM/IT` | In Progress | 28 Penang IT PDFs plus 6 Johor IT PDFs. |
| Excel workbooks found | 6 | Repository scan | In Progress | Includes final app inventory, routing configuration, IT form workbooks, and Domino mail groups. |
| Word documents found | 0 | Repository scan | Blocked - Missing Source | No `.doc` or `.docx` files found. |
| Markdown source/reference documents found in project evidence folders | 78 | Repository scan excluding generated dependencies | In Progress | Includes analysis, docs, mapping/design, and app technical docs. |
| CSV source/reference files found | 20 | Repository scan | In Progress | Includes mapping, inventory, SharePoint audit, and routing/group CSVs. |
| JSON source/schema/config files found in project evidence folders | 106 | Repository scan excluding generated dependencies | In Progress | Includes form schemas, flow definitions, power config, SharePoint audit exports, and app data models. |
| Domino/HCL DXL XML files found | 68 | `source/dxl` | In Progress | HR Johor, HR Penang, and QA Johor DXL XML exports. No IT DXL XML files were found as standalone source files in this scan; IT DXL facts are present in analysis outputs. |
| Domino/HCL inventory TXT files found | 69 | `source/dxl` | In Progress | Companion inventory exports for DXL sources. |
| Screenshots found | 447 | `apps/code-first/ioicodeapp/powerapps-screenshots` | In Progress | Current app UI evidence, not original requirement evidence. |
| SharePoint list export/audit files found | 7 | `analysis/sharepoint-provisioning` | In Progress | Three timestamped CSV/JSON exports plus latest JSON. |

## SharePoint Schema Discovery - 2026-06-01

| Discovery Item | Count | Evidence | Audit Status | Notes |
|---|---:|---|---|---|
| SharePoint schema files found | 68 | `apps/code-first/ioicodeapp/powerapps-mirror/apps/ioi-platform/.power/schemas/sharepointonline/*.Schema.json` | In Progress | Local SDK schema files for configured SharePoint lists. |
| SharePoint lists/data sources identified | 97 | `power.config.json` | In Progress | Configured SharePoint data source keys across 24 site/dataset entries. |
| PnP/provisioning audit rows found | 72 | `analysis/sharepoint-provisioning/sharepoint-list-audit.latest.json` | In Progress | Includes list names, site URLs, status, and column plan counts. |
| Columns identified from local schema files | 4,475 | `.Schema.json` property scan | In Progress | Includes SharePoint system fields and attachment pseudo-fields. |
| Required field entries identified | 129 | `schema.items.required` arrays | In Progress | Required status is available only where schema files expose it. |
| Columns with unknown field type | 0 | `.Schema.json` property scan | Completed - Passed | Every parsed schema property had a JSON type. |
| Choice values identified from schema enum | 0 | `.Schema.json` property scan | Blocked - Missing SharePoint Schema | Local SDK schemas did not expose enum choice values. |
| Relationship/lookup entries identified | 280 | `x-ms-relationships` | In Progress | Includes lookup, people, content type, author/editor, and other related entities. |
| Person/group-like columns identified | 592 | Claims/display/email property scan | In Progress | Includes system people fields and business people fields. |
| Date-like columns identified | 609 | Date format/name scan | In Progress | Some date-named fields are typed as string; requires live schema confirmation. |
| Attachment-like columns identified | 444 | Attachment/file/document field scan | In Progress | Includes `{Attachments}` pseudo-fields and business file columns. |
| Configured data sources missing local schema | 29 | `power.config.json` compared with local schema files | Blocked - Missing SharePoint Schema | Listed in `SHAREPOINT_LIST_INVENTORY.md`. |
| App/form-schema column references missing from local schema | 111 | `src/form-schemas/**/*.json` compared with local schema files | Completed - Issues Found | Exact `spColumn` values do not match expected schema columns. |
| Field-mapping target columns missing from local schema | 59 | `mapping/field-mapping.csv` compared with local schema files | Completed - Issues Found | Indicates mapping/schema drift. |
| Required schema fields not referenced by form-schema metadata | 129 | Required schema arrays compared with form schema `spColumn` metadata | Completed - Issues Found | Possibly missing in app unless supplied by page code/provisioning. |

## Schema Discovery Issues

| Issue | Evidence | Current Status | Notes |
|---|---|---|---|
| Missing local schemas for configured lists | `power.config.json`; `.power/schemas/sharepointonline` | Blocked - Missing SharePoint Schema | 29 configured data source keys have no matching local `.Schema.json`. |
| Choice values unavailable in local schema files | `.Schema.json` scan | Blocked - Missing SharePoint Schema | Need live SharePoint/PnP field export or explicit docs for choice option values. |
| App schema metadata does not match current SharePoint internal names | `src/form-schemas/**/*.json`; local schema files | Completed - Issues Found | 111 `spColumn` references missing from expected schemas; many appear to be legacy/mixed-case names. |
| Mapping documents do not match current schema exports | `mapping/field-mapping.csv`; local schema files | Completed - Issues Found | 59 mapped target columns were not found in local schema exports. |
| Required schema fields may be populated outside dynamic form schemas | `schema.items.required`; app form schemas | In Progress | Verify page code before filing implementation defects. |

## Source Mapping Summary

| Mapping Result | Count | Evidence | Notes |
|---|---:|---|---|
| Audit forms with clear source evidence mapped | 21 | `FORM_INVENTORY.md` Source Files Mapped table | Clear match when form code/title or established analysis maps source to audit item. |
| Audit forms with possible-match source evidence | 9 | `FORM_INVENTORY.md` Source Files Mapped table | Legacy schemas, SAPSOF variants, IAL variants, and page-only groups require item audit confirmation. |
| Audit items still requiring per-item source confirmation | 38 | AUD-030 to AUD-067 page-only candidates | Routes/screens exist, but source document relationship is not always proven. |
| SharePoint source files added to list register | 17 | `SHAREPOINT_LIST_INVENTORY.md` Source Document Discovery table | Includes config, local schema, provisioning exports, schema docs, and scripts. |
| Workflow source files added to workflow register | 14 | `WORKFLOW_REGISTER.md` Source Document Discovery table | Includes workflow analysis, approval rules, flow JSON, routing docs, Excel routing files, and group CSVs. |

## Remaining Forms Without Strong Source Files

| Audit ID(s) | Form Code(s) | Reason Source Is Still Weak | Current Status |
|---|---|---|---|
| AUD-030 to AUD-033 | Dynamic `[formCode]` routes | Dynamic routes prove screen capability but do not identify specific original forms. | Blocked - Ambiguous Requirement |
| AUD-034 | ASSET-SUBMISSION | Page route found; no matching original form source was confirmed in this discovery pass. | Blocked - Missing Source |
| AUD-036 to AUD-038 | DRR, EDL, HWRR | Page routes found; no matching original form source was confirmed in this discovery pass. | Blocked - Missing Source |
| AUD-041 to AUD-045 | ITP, MPSPRN, SAP-INC | NIR and RS were audited in Batch 001 with item-level findings; remaining page-only audit IDs still need confirmation against form title/content. | Blocked - Ambiguous Requirement |
| AUD-047 to AUD-064 | SRL, SRR, SRVR, LOG, QA, QC candidates | Department PDFs and screenshots exist, but exact source-to-audit mapping is not complete. | Blocked - Ambiguous Requirement |
| AUD-065 to AUD-067 | HR-BSD, HR-CAFETERIA, HR-CWR | HR DXL/PDF evidence exists for HR source forms, but app audit IDs need field-level source confirmation. | Blocked - Ambiguous Requirement |

## Next Not Started Item

No assigned audit IDs remain with Not Started status after Batches 004-007. Remaining work is blocker resolution and re-audit.

## Register Sync - 2026-06-01

| Sync Item | Result | Evidence | Notes |
|---|---:|---|---|
| Form inventory item rows synchronized | 67 | `FORM_INVENTORY.md`; item-level finding rows above | Candidate form rows now match item-level master rows for status, approval, finding path, and notes. |
| SharePoint/data connection counts synchronized | 97 data sources; 68 schema files | `power.config.json`; `.power/schemas/sharepointonline` | LOG, MTN, and WH schemas validate with populated columns; no zero-column local schema exports remain. |
| Remaining not-started item rows | 0 | `FORM_INVENTORY.md` | Batches 004-007 created blocker findings for all remaining candidate rows. |



## Batch 004 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-004 | HWINV_PRAI | HWINV_PRAI Legacy Hardware Inventory | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-004_HWINV_PRAI_AUDIT.md` | FIX-066 | 2026-06-01 | Central reference marks HWINV_PRAI as Duplicate / Outdated and no active app route was found. |
| AUD-014 | NOTESID | Notes ID Legacy Schema | Blocked - Ambiguous Requirement | Required | High | `audit/03_findings/IT/AUD-014_NOTESID_AUDIT.md` | FIX-067 | 2026-06-01 | Source and central reference show approval/workflow sections for NOTESID, but current app route evidence points to NIR rather than a dedicated NOTESID page. |
| AUD-028 | USERID | USERID Legacy Schema | Blocked - Ambiguous Requirement | Required | High | `audit/03_findings/IT/AUD-028_USERID_AUDIT.md` | FIX-068 | 2026-06-01 | Source and central reference show approval/workflow sections for USERID, but current app implementation evidence is the UR route audited as AUD-050. |
| AUD-029 | VPNACCESS | VPNACCESS Legacy Schema | Blocked - Ambiguous Requirement | Required | High | `audit/03_findings/IT/AUD-029_VPNACCESS_AUDIT.md` | FIX-069 | 2026-06-01 | Central reference marks VPNACCESS as Duplicate / Outdated and evidence points to EAF for the active implementation. |
| AUD-030 | ENGINEERING-[FORMCODE] | Engineering Dynamic Form Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/Engineering/AUD-030_ENGINEERING-_FORMCODE__AUDIT.md` | FIX-070 | 2026-06-01 | Route proves dynamic screen capability but does not identify an original Domino form, source fields, SharePoint list, or workflow. |
| AUD-031 | IT-[FORMCODE] | IT Dynamic Form Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-031_IT-_FORMCODE__AUDIT.md` | FIX-071 | 2026-06-01 | Route proves dynamic screen capability but does not identify a distinct audit item beyond known IT forms. |
| AUD-032 | SECURITY-[FORMCODE] | Security Dynamic Form Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/Security/AUD-032_SECURITY-_FORMCODE__AUDIT.md` | FIX-072 | 2026-06-01 | Route and schema evidence exist, but no specific source form/workflow/list mapping is tied to the audit item. |
| AUD-033 | TRAINING-[FORMCODE] | Training Dynamic Form Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/Training/AUD-033_TRAINING-_FORMCODE__AUDIT.md` | FIX-073 | 2026-06-01 | Route proves dynamic screen capability but does not identify original source form, fields, or workflow. |
| AUD-034 | ASSET-SUBMISSION | Asset Submission | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-034_ASSET-SUBMISSION_AUDIT.md` | FIX-074 | 2026-06-01 | App page exists, but no source document or SharePoint schema mapping was found for the candidate form. |
| AUD-035 | DCAL | DCAL Page Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-035_DCAL_AUDIT.md` | FIX-075 | 2026-06-01 | DCAL page route appears related to DCALOG, which is already blocked because source matching is unclear. |

## Batch 005 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-036 | DRR | DRR | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-036_DRR_AUDIT.md` | FIX-076 | 2026-06-01 | App route exists, but no original source document, SharePoint list mapping, or workflow evidence was found. |
| AUD-037 | EDL | EDL | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-037_EDL_AUDIT.md` | FIX-077 | 2026-06-01 | App route exists, but no original source document, SharePoint list mapping, or workflow evidence was found. |
| AUD-038 | HWRR | HWRR | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-038_HWRR_AUDIT.md` | FIX-078 | 2026-06-01 | App route/data file exists, but no original source document or workflow evidence was confirmed. |
| AUD-039 | IOIP | IOIP Page Route | Verified | Required | High | `audit/03_findings/IT/AUD-039_IOIP_AUDIT.md` | FIX-079 verified | 2026-06-03 | IOIP is the active IOIPOL policy implementation for UAT under DEC-2026-009; ownership re-audit passed. |
| AUD-041 | ITP | ITP Page Route | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/IT/AUD-041_ITP_AUDIT.md` | FIX-080 | 2026-06-01 | ITP source appears related to ISGDOC, already audited as AUD-007; separate route ownership remains unclear. |
| AUD-045 | SAP-INC | SAP Incident | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-045_SAP-INC_AUDIT.md` | FIX-081 | 2026-06-01 | App route exists, but no original source document, SharePoint list mapping, or workflow evidence was found. |
| AUD-047 | SRL | Server Reboot Log Route | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/IT/AUD-047_SRL_AUDIT.md` | FIX-082 | 2026-06-01 | SRL route appears related to AUD-025 SVRREBOOT, which is already blocked by source/form-code ambiguity. |
| AUD-048 | SRR | SRR | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/IT/AUD-048_SRR_AUDIT.md` | FIX-083 | 2026-06-01 | App route exists, but discovered SRR source files belong to STR/QA and cannot be assumed to match IT SRR. |
| AUD-049 | SRVR | Server Record Route | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/IT/AUD-049_SRVR_AUDIT.md` | FIX-084 | 2026-06-01 | SRVR route is related to server reboot/recovery candidates already flagged for conflicting form codes. |
| AUD-051 | LOG-CSD | Log CSD | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-051_LOG-CSD_AUDIT.md` | FIX-085 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original CSD source/workflow evidence was not confirmed. |

## Batch 006 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-052 | LOG-ECMFB | Log ECMFB | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-052_LOG-ECMFB_AUDIT.md` | FIX-086 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original ECMFB source/workflow evidence was not confirmed. |
| AUD-053 | LOG-FBN | Log FBN | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-053_LOG-FBN_AUDIT.md` | FIX-087 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original FBN source/workflow evidence was not confirmed. |
| AUD-054 | LOG-GTPW | Log GTPW | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-054_LOG-GTPW_AUDIT.md` | FIX-088 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original GTPW source/workflow evidence was not confirmed. |
| AUD-055 | LOG-POD | Log POD | Blocked - Ambiguous Requirement | Unknown | Unknown | `audit/03_findings/Log/AUD-055_LOG-POD_AUDIT.md` | FIX-089 | 2026-06-01 | POD source and app route exist, but field-level mapping and workflow classification were not completed in current evidence. |
| AUD-056 | LOG-TI | Log TI | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-056_LOG-TI_AUDIT.md` | FIX-090 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original TI source/workflow evidence was not confirmed. |
| AUD-057 | LOG-TMI | Log TMI | Blocked - Missing Source | Unknown | Unknown | `audit/03_findings/Log/AUD-057_LOG-TMI_AUDIT.md` | FIX-091 | 2026-06-01 | LOG app page and MainDB_LOG schema exist, but original TMI source/workflow evidence was not confirmed. |
| AUD-058 | QA-ICAR | QA ICAR | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QA/AUD-058_QA-ICAR_AUDIT.md` | FIX-092 | 2026-06-01 | Multiple ICAR source variants exist; app route exists, but exact source variant, field mapping, and workflow classification are not resolved. |
| AUD-059 | QA-SOP | QA SOP | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QA/AUD-059_QA-SOP_AUDIT.md` | FIX-093 | 2026-06-01 | Multiple SOP source variants exist across QA/QC; app route exists, but exact source variant and workflow classification are not resolved. |
| AUD-060 | QA-WI | QA WI | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QA/AUD-060_QA-WI_AUDIT.md` | FIX-094 | 2026-06-01 | Multiple WI source variants exist across QA/QC; app route exists, but exact source variant and workflow classification are not resolved. |
| AUD-061 | QC-CALIBRATION | QC Calibration | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QC/AUD-061_QC-CALIBRATION_AUDIT.md` | FIX-095 | 2026-06-01 | Calibration source PDFs and app route exist, but QC main schema is missing and exact form variant is unresolved. |

## Batch 007 Item Status

| Audit ID | Form Code | Form Name | Audit Status | Approval Classification | Risk | Finding File | Backlog IDs | Last Reviewed | Notes |
|---|---|---|---|---|---|---|---|---|---|
| AUD-062 | QC-LWR | QC LWR | Blocked - Missing SharePoint Schema | Unknown | High | `audit/03_findings/QC/AUD-062_QC-LWR_AUDIT.md` | FIX-096 | 2026-06-01 | LWR source and app route exist, but local QC schema evidence is missing for field-level mapping. |
| AUD-063 | QC-OOS | QC OOS | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QC/AUD-063_QC-OOS_AUDIT.md` | FIX-097 | 2026-06-01 | OOS source variants and app route exist, but exact source ownership and local QC schema evidence are unresolved. |
| AUD-064 | QC-PQCAR | QC PQCAR | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/QC/AUD-064_QC-PQCAR_AUDIT.md` | FIX-098 | 2026-06-01 | PQCAR source variants and app route exist, but exact source ownership and local QC schema evidence are unresolved. |
| AUD-065 | HR-BSD | HR Backup Staff Declaration | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/HR/AUD-065_HR-BSD_AUDIT.md` | FIX-099 | 2026-06-01 | Source, app, and schema evidence exist, but item-level field mapping, validation, and approval classification remain unresolved. |
| AUD-066 | HR-CAFETERIA | HR Cafeteria | Blocked - Missing Source | Unknown | High | `audit/03_findings/HR/AUD-066_HR-CAFETERIA_AUDIT.md` | FIX-100 | 2026-06-01 | App and schema evidence exist, but original source/workflow evidence was not confirmed. |
| AUD-067 | HR-CWR | HR Contract Worker Request | Blocked - Ambiguous Requirement | Unknown | High | `audit/03_findings/HR/AUD-067_HR-CWR_AUDIT.md` | FIX-101 | 2026-06-01 | Source, app, and schema evidence exist, but item-level field mapping, validation, and approval classification remain unresolved. |







