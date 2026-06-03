# Data Sources Analysis Pipeline Report

> Run date: 2026-06-03
> Scope completed in this pass: FIN and MTN departments.
> App implementation note: the active application is the React/TypeScript Power Apps code-first app at `ioicodeapp/powerapps-mirror/apps/ioi-platform/`, not a traditional Canvas `.msapp`. Canvas-style source evidence is represented here by generated Power Platform schema exports, route/page TSX, extracted PDF/Domino source artifacts, and master migration registers.

## 1. Executive Summary

FIN and MTN both have enough evidence to continue controlled build work, but neither department is safe for broad screen expansion without targeted field and workflow reconciliation.

FIN has a registered SharePoint data source for `MainDB_FIN`, generated model/service/hook coverage, new submission and list/read pages, and master source coverage for 8 FIN apps/forms across Johor and Penang. The largest risk is field accuracy: the master source dictionary contains 596 FIN source fields, but the exported `MainDB_FIN` schema has 96 properties and exact source-field matches are sparse. Current FIN submit logic writes many user-entered values into generic columns such as `ProblemDesc`, `RequestTitle`, `Description`, `DocumentNo`, and `ReasonForChange` instead of one discrete SharePoint column per source field. Status: CONFLICT_FOUND.

MTN has a registered SharePoint data source for `MainDB_MTN`, generated model/service/hook coverage, MTR/maintenance routes, new submission and list/read pages, and master source coverage for 6 MTN apps/forms. The largest risk is naming and field alignment: source registers use `MTN` owner and master FormCodes such as `FAILANALREPO`, `MAINPLAN`, `MTNEMERCHAN`, `EQUIPREINSP`, and `PLANMAINDOCU`, while the app UI exposes MTR aliases such as `FAR`, `MTP`, `MECP`, `EPI`, and `PMD` and maps them at submit/read time. This is workable only if the alias rule is approved and documented. Status: NEEDS_CONFIRMATION.

Biggest blockers before continuing screen development:

| Priority | Area | Finding | Impact | Recommended Fix | Validation Step |
|---|---|---|---|---|---|
| P0 Critical blocker | FIN field storage | 596 source fields do not have a verified one-to-one FIN SharePoint internal-column matrix; current submit path summarizes many fields into `ProblemDesc`. Evidence: `source_analysis/10_master_app_sources/master_field_dictionary.csv`, `ioicodeapp/powerapps-mirror/apps/ioi-platform/src/pages/finance/forms/new.tsx:717`, `:723`, `:763`. | Users can submit, but audits cannot prove every FIN source field lands in the correct SharePoint column. | Create a FIN field-to-column mapping work item per master form, add missing `MainDB_FIN`/extension columns or explicitly mark fields out of scope. | Re-run schema export and compare every FIN `source_field` against actual `MainDB_FIN` and extension-list columns. |
| P0 Critical blocker | MTN required fields/schema | `MainDB_MTN` export contains `FormCode`, `Department`, `Status`, and `CurrentStatus`, but only `Title` is required in exported schema. Evidence: `.power/schemas/sharepointonline/maindb_mtn.Schema.json:67`, `:183`, `:221`, `:387`, `:2848`. | SharePoint can accept records that are not safely discriminated by form type/status. | Make required-field rules explicit for `FormCode`, department/site, status/current action, and submitted metadata. | Re-export schema and confirm required list includes approved discriminator/status fields or document why list-level required flags are intentionally relaxed. |
| P0 Critical blocker | Extension list provisioning | Master design expects extension row lists for `INSUCLAI`, `CMF_A`, `VENDREGIFINA`, `CAR`, `FAILANALREPO`, `MTNEMERCHAN`, and `PLANMAINDOCU`, but `power.config.json` currently registers only `maindb_fin` and `maindb_mtn` for these departments. Evidence: `source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md:6-8`, `:144-148`, `:200-207`, `power.config.json` lines containing only `maindb_fin` and `maindb_mtn`. | Repeated/gallery sections and child rows have no confirmed app data source. | Provision/register extension lists or revise master design to keep all fields on the main list. | `power.config.json` and `.power/schemas/sharepointonline/` should show the extension lists, then create/read smoke rows. |
| P1 High | FIN/MTN detail pages | FIN and MTR routes expose form list and new routes, but no department-specific detail route for `/fin/forms/:formCode/:id` or `/mtr/forms/:formCode/:id`. Evidence: `src/routes/fin-routes.tsx:17-30`, `src/routes/mtr-routes.tsx:17-30`. | Users can see rows but not a source-accurate detail/approval screen per record. | Add detail routes only after field matrix and action rules are approved. | Route audit plus Playwright smoke through list row click to canonical detail. |
| P1 High | Role/section logic | Master role/section register marks FIN and MTN role/section rows as `Needs Human Confirmation`. Evidence: `MASTER_ROLE_SECTION_REGISTER.md:1432-1477`, `:2011-2088`. | Approval sections and editability could be wrong even if submit works. | Confirm role ownership for HOD, FIN, MKT, COO/Director, MTN HOD, SHE HOD, ISG/QA where applicable. | Update role-section register statuses from `Needs Human Confirmation` to confirmed rules with source paths. |

Overall readiness: continue analysis and schema work, not uncontrolled screen build. FIN and MTN can keep current submit/read smoke testing, but production signoff is blocked by field matrix, extension-list, role/section, and workflow confirmation gaps.

## 2. Sources Reviewed

| Source | Purpose | Status |
|---|---|---|
| `docs/repo-knowledge-base.md` | Folder governance and placement rules | Reviewed |
| `docs/central-form-reference.md` | Current form/data reference and code-first app note | Reviewed |
| `docs/documentation-governance.md` | Source-of-truth and update rules | Reviewed |
| `docs/change-log.md` | Current implementation history | Reviewed |
| `.github/instructions/domino-migration.instructions.md` | Domino/M365 migration rules and department portfolio | Reviewed |
| `ioicodeapp/.github/copilot-instructions.md` | Code-first app data-source and no-remarks rules | Reviewed |
| `source_analysis/10_master_app_sources/master_app_source_coverage.csv` | FIN/MTN app coverage, source quality, field/workflow counts | Reviewed |
| `source_analysis/10_master_app_sources/master_field_dictionary.csv` | FIN/MTN source fields and recommended field types | Reviewed |
| `source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md` | Expected main and extension SharePoint lists | Reviewed |
| `source_analysis/10_master_app_sources/MASTER_POWERAPPS_SPEC_REGISTER.md` | Expected list/new/detail/approval screen scope | Reviewed |
| `source_analysis/10_master_app_sources/MASTER_WORKFLOW_REGISTER.md` | Extracted workflow signal inventory | Reviewed |
| `source_analysis/10_master_app_sources/MASTER_ROLE_SECTION_REGISTER.md` | Role and section candidates | Reviewed |
| `source_analysis/10_master_app_sources/requirements/Penang/FIN/*.md` | FIN requirement artifacts | Reviewed by register/path coverage |
| `source_analysis/10_master_app_sources/requirements/Johor/FIN/*.md` | Johor FIN requirement artifacts | Reviewed by register/path coverage |
| `source_analysis/10_master_app_sources/requirements/Penang/MTN/*.md` | Penang MTN requirement artifacts | Reviewed by register/path coverage |
| `source_analysis/10_master_app_sources/requirements/Johor/MTN/*.md` | Johor MTN requirement artifacts | Reviewed by register/path coverage |
| `ioicodeapp/powerapps-mirror/apps/ioi-platform/power.config.json` | Registered SharePoint data sources | Reviewed |
| `.power/schemas/sharepointonline/maindb_fin.Schema.json` | Exported `MainDB_FIN` list schema | Reviewed |
| `.power/schemas/sharepointonline/maindb_mtn.Schema.json` | Exported `MainDB_MTN` list schema | Reviewed |
| `src/generated/models/main-dbfin-model.ts` | FIN generated model/choice keys | Reviewed |
| `src/generated/models/main-dbmtn-model.ts` | MTN generated model/choice keys | Reviewed |
| `src/generated/services/main-dbfin-service.ts` | FIN SharePoint service translator | Evidence path reviewed |
| `src/generated/services/main-dbmtn-service.ts` | MTN SharePoint service translator | Evidence path reviewed |
| `src/generated/hooks/use-main-dbfin.ts` | FIN read/write hooks | Evidence path reviewed |
| `src/generated/hooks/use-main-dbmtn.ts` | MTN read/write hooks | Evidence path reviewed |
| `src/routes/fin-routes.tsx` | FIN route surface | Reviewed |
| `src/routes/mtr-routes.tsx` and `src/routes/maintenance-routes.tsx` | MTN/MTR route surface and legacy redirects | Reviewed |
| `src/pages/finance/forms/new.tsx` | FIN submit logic and current UI field configs | Reviewed |
| `src/pages/finance/forms/[formCode]/index.tsx` | FIN list/read logic | Reviewed |
| `src/pages/mtr/forms/new.tsx` | MTN submit logic and alias mapping | Reviewed |
| `src/pages/mtr/forms/[formCode]/index.tsx` | MTN list/read logic | Reviewed |

## 3. Missing Inputs

| ID | Missing Input | Evidence Path | Impact |
|---|---|---|---|
| MISSING_INFO-FIN-001 | Confirmed FIN business approval matrix by form and site. | `MASTER_WORKFLOW_REGISTER.md:6-8`, `:144-148`; `MASTER_ROLE_SECTION_REGISTER.md:1432-1477` | Cannot finalize approval buttons, next status, or current approver routing. |
| MISSING_INFO-FIN-002 | Full FIN SharePoint internal column matrix for all 596 source fields. | `master_field_dictionary.csv`; `.power/schemas/sharepointonline/maindb_fin.Schema.json` | Cannot prove every UI/source field writes to a discrete SharePoint column. |
| MISSING_INFO-FIN-003 | Confirmation whether Penang `VENDREGIFINA` belongs under FIN or PRC/HR because coverage uses fallback-matched PRC PDFs. | `master_app_source_coverage.csv` row 142 | Build should not proceed from fallback evidence alone. |
| MISSING_INFO-MTN-001 | Approved MTN vs MTR naming decision and route alias policy. | `src/routes/maintenance-routes.tsx:13-21`, `src/routes/mtr-routes.tsx:17-30` | Users and auditors may not know that maintenance forms are implemented under MTR routes. |
| MISSING_INFO-MTN-002 | Confirmed MTN role matrix for Maintenance HOD, SHE HOD, QA/ISG and plant/maintenance actors. | `MASTER_ROLE_SECTION_REGISTER.md:2011-2088` | Cannot safely implement section visibility or approval action gating. |
| MISSING_INFO-MTN-003 | Full MTN SharePoint internal column matrix for all 316 source fields. | `master_field_dictionary.csv`; `.power/schemas/sharepointonline/maindb_mtn.Schema.json` | Several source fields are not exact exported schema properties. |
| MISSING_INFO-COMMON-001 | Power Automate exported/live workflow definitions for FIN and MTN. | `m365-design/power-automate-design.md`; no FIN/MTN flow export reviewed in this pass | Workflow status transitions remain app/local-design evidence only. |
| MISSING_INFO-COMMON-002 | Live create/readback artifacts for every FIN and MTN form after the latest field-mapping changes. | `scripts/sharepoint/Test-FinPrdMtnSubmissions.ps1`; `audit/sharepoint-verification/` | Static schema/code evidence does not prove tenant writes for every promoted form. |

## 4. Conflicts Found

| ID | Conflict | Evidence | Status |
|---|---|---|---|
| CONFLICT_FOUND-FIN-001 | Master FIN source has 596 extracted fields, but current FIN schema has 96 properties and current submit logic maps many fields into generic summary columns. | `master_field_dictionary.csv`; `.power/schemas/sharepointonline/maindb_fin.Schema.json`; `src/pages/finance/forms/new.tsx:717`, `:723`, `:763` | Open |
| CONFLICT_FOUND-FIN-002 | Master design expects FIN extension lists for row/gallery forms, but app data-source registration shows only `maindb_fin` under the FIN site. | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:6-8`, `:144-148`; `power.config.json` FIN datasource block | Open |
| CONFLICT_FOUND-FIN-003 | UI form labels are generic business forms, not full source-label parity for CAR/CMF/EARF/RSES/VENDREGIFINA. Example: CAR UI asks for `Project Title`, `Project Type`, `Requested Amount`, while master CAR source starts with `SAP IO No.`, `SAP Asset No.`, `Company`, `Department`, `CAR Name/Project Name`. | `src/pages/finance/forms/new.tsx:145-206`; `master_field_dictionary.csv` master 143 | Open |
| CONFLICT_FOUND-MTN-001 | MTN source owner/form codes differ from app route/UI aliases (`FAR`, `MTP`, `MECP`, `EPI`, `PMD`) and require runtime translation to `FAILANALREPO`, `MAINPLAN`, `MTNEMERCHAN`, `EQUIPREINSP`, `PLANMAINDOCU`. | `src/pages/mtr/forms/new.tsx:141-154`; `src/pages/mtr/forms/[formCode]/index.tsx:24-34` | Needs confirmation |
| CONFLICT_FOUND-MTN-002 | `MainDB_MTN` exported schema only requires `Title`, while the generated model marks `formCode` required and the list view filters by `FormCode`. | `.power/schemas/sharepointonline/maindb_mtn.Schema.json:2848`; `src/generated/models/main-dbmtn-model.ts:40-43`; `src/pages/mtr/forms/[formCode]/index.tsx:86-92` | Open |
| CONFLICT_FOUND-MTN-003 | Master design expects MTN extension lists for row/gallery forms, but app data-source registration shows only `maindb_mtn` under the MTN site. | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:200-207`; `power.config.json` MTN datasource block | Open |
| CONFLICT_FOUND-MTN-004 | Generated MTN model property `workflflowStage` appears misspelled relative to schema/display intent `WorkflowStage`. | `src/generated/models/main-dbmtn-model.ts:87`; `.power/schemas/sharepointonline/maindb_mtn.Schema.json:489` | Open |

## 5. Data Source Inventory

| Data Source | Type | Used By Screen/Form | Purpose | Read/Write | Current Location | Status | Issue |
|---|---|---|---|---|---|---|---|
| `MainDB_FIN` | SharePoint list | FIN CAR, CMF, INSUCLAI, RSES, VENDREGIFINA, EARF submit/list pages | Main FIN submission register using `FormCode` discriminator | Read/Write | `power.config.json`; `.power/schemas/sharepointonline/maindb_fin.Schema.json`; `src/generated/*main-dbfin*` | Partially confirmed | CONFLICT_FOUND-FIN-001: source-field parity not proven. |
| `MainDB_FIN_Ext_CMF_A_Rows` | Expected SharePoint extension list | FIN Credit Management row/gallery candidate | Repeating/row data for CMF | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:144` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| `MainDB_FIN_Ext_CAR_Rows` | Expected SharePoint extension list | FIN CAR row/gallery candidate | Repeating/row data for CAR | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:147` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| `MainDB_FIN_Ext_INSUCLAI_Rows` | Expected SharePoint extension list | Johor FIN Insurance Claim | Repeating insurance claim rows | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:8` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| `MainDB_FIN_Ext_VENDREGIFINA_Rows` | Expected SharePoint extension list | Penang FIN Vendor Registration | Repeating vendor profile/update rows | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:146` | MISSING_INFO | Form ownership/source match also needs confirmation. |
| `MainDB_MTN` | SharePoint list | MTR/MTN FAR, MTP, MECP, EPI, PMD submit/list pages | Main MTN submission register using `FormCode` discriminator | Read/Write | `power.config.json`; `.power/schemas/sharepointonline/maindb_mtn.Schema.json`; `src/generated/*main-dbmtn*` | Partially confirmed | CONFLICT_FOUND-MTN-002: list-required fields weaker than app/model expectations. |
| `MainDB_MTN_Ext_FAILANALREPO_Rows` | Expected SharePoint extension list | MTN Failure Analysis Report | Failure-analysis row/gallery detail | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:40`, `:200` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| `MainDB_MTN_Ext_MTNEMERCHAN_Rows` | Expected SharePoint extension list | MTN Emergency Change Procedure | Emergency change row/detail data | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:204` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| `MainDB_MTN_Ext_PLANMAINDOCU_Rows` | Expected SharePoint extension list | Plant Maintenance Documentation | Maintenance documentation row/detail data | Expected Read/Write | `MASTER_SHAREPOINT_DESIGN_REGISTER.md:207` | MISSING_INFO | Not registered in `power.config.json` in this pass. |
| Microsoft 365 user/email context | Connector/hook | FIN and MTN submit pages | Requestor identity and notification metadata | Read/send | `src/hooks/use-user.ts`; `src/hooks/use-email-notification.ts`; used in `finance/forms/new.tsx` and `mtr/forms/new.tsx` | Needs confirmation | Connector schema exists locally, but this pass did not prove tenant email send/read permissions. |
| Local form config constants | App constants | FIN and MTN new forms, department module cards | UI fields, aliases, stages, form names | Read | `src/pages/finance/forms/new.tsx`; `src/pages/mtr/forms/new.tsx`; `src/config/departments.ts` | Partially confirmed | Some labels/fields are generic and not source-label parity. |
| Master source registers | Analysis artifacts | FIN/MTN data-source pipeline | Expected form codes, field lists, workflow signals, section candidates | Read | `source_analysis/10_master_app_sources/*` | Confirmed analysis evidence | These are extracted evidence, not live tenant proof. |

## 6. SharePoint List and Field Accuracy Matrix

This matrix summarizes all FIN and MTN forms completed in this pass. The full source-field inventory remains in `source_analysis/10_master_app_sources/master_field_dictionary.csv`; this report records the accuracy status and highest-risk examples per form so it does not duplicate the 912 source-field rows.

| Form | Section | UI Field Label | App Field Name | SharePoint List | SharePoint Internal Column | Field Type | Required? | Read/Write | Status | Issue |
|---|---|---|---|---|---|---|---|---|---|---|
| FIN Johor CAR | Source header/project | SAP IO No.; SAP Asset No.; Company; Department; Project Name | `SAPIONo`; `SAPAssNo`; `Company`; `Department`; `ProjectName` | `MainDB_FIN` | Only `Company` and `Department` exact-matched in exported schema sample | Number/Text, Text, Person/Text | MISSING_INFO | Expected Write | CONFLICT_FOUND | 99 source fields, 2 exact schema matches. |
| FIN Johor CMF | Credit application | Company; Category; No.; Application Form No.; Date Initiated | `Company`; `Category`; `CAFNo`; `PrevCAFNo`; `DateInitiated` | `MainDB_FIN`; expected extension TBD | `Company` and `Status` exact-matched in sample | Text, Choice/Text, Date/Text | MISSING_INFO | Expected Write | CONFLICT_FOUND | 64 source fields, 2 exact schema matches. |
| FIN Johor Insurance Claim | Claim/customer review | Company; Category; Form No.; Date; Customer Number | `Company`; `Category`; `CAFNo`; `DateInitiated`; `CompanyName` | `MainDB_FIN`; `MainDB_FIN_Ext_INSUCLAI_Rows` expected | `Company` and `Department` exact-matched in sample | Text, Choice/Text, Person/Text | MISSING_INFO | Expected Write | CONFLICT_FOUND | Extension list expected but not registered. |
| FIN Penang CMF | Credit management | Company; Category; Form No.; Date; Customer Number | `Company`; `Category`; `CAFNo`; `DateInitiated`; `CompanyName` | `MainDB_FIN`; `MainDB_FIN_Ext_CMF_A_Rows` expected | `Company` exact-matched in sample | Text, Choice/Text, Date/Text | MISSING_INFO | App writes generic FIN record | CONFLICT_FOUND | UI collapses CMF_B/CMF_C aliases to `CMF_A`. |
| FIN Penang RSES | Initiator/approval | Company; Requestor; Approver; Department; Phone Ext. No. | `Company`; `Requestor`; `Approver`; `Dept`; `ExtNo` | `MainDB_FIN` | `Company` and `AppName` exact-matched in sample | Text, Person/Text, Number/Text | MISSING_INFO | App writes generic FIN record | CONFLICT_FOUND | Approver/person fields need picker and SharePoint person-format confirmation. |
| FIN Penang Vendor Registration | Request/procurement/finance/IT | Running Number; Date Created; Requestor; Company; Name | `NotNum`; `Date`; `REQUESTOR`; `Comp`; `Name` | `MainDB_FIN`; `MainDB_FIN_Ext_VENDREGIFINA_Rows` expected | 0 exact schema matches in sample | Text, Date/Text, Person/Text | MISSING_INFO | Expected Write | CONFLICT_FOUND | Source coverage is `Extracted - Needs Review`; form ownership/source path must be confirmed. |
| FIN Penang CAR | Capital approval | SAP IO No.; SAP Asset No.; Company; Department; CAR Name/Project Name | `SAPIONo`; `SAPAssNo`; `Company`; `Department`; `ProjectName` | `MainDB_FIN`; `MainDB_FIN_Ext_CAR_Rows` expected | `Company` and `Department` exact-matched in sample | Number/Text, Text, Person/Text | MISSING_INFO | App writes generic FIN record | CONFLICT_FOUND | 147 source fields, 2 exact schema matches. |
| FIN Penang EARF | Review/expense | Form No.; Date of Review; Company; Category; charge | `CAFNo`; `DateReview`; `Company`; `Category`; `MKTExec` | `MainDB_FIN` | `Company` exact-matched in sample | Number/Text, Date/Text, Text | MISSING_INFO | App writes generic FIN record | CONFLICT_FOUND | 43 source fields, 1 exact schema match. |
| MTN Johor FAR | Entity/detail/troubleshooting/action | Applicable to; Manufactured by; Year; Model No.; Serial Number | `Site`; `ManBy`; `ManYear`; `Model`; `SrNo` | `MainDB_MTN`; `MainDB_MTN_Ext_FAILANALREPO_Rows` expected | `Location`, `Remarks`, `CurrentAction`, `Status`, `AppName` exact-matched in sample | Text, Number/Text | MISSING_INFO | App alias writes `FAILANALREPO` for FAR | CONFLICT_FOUND | 107 source fields, 5 exact schema matches. |
| MTN Penang FAR | Approval/entity/troubleshooting/action | Title; Section No.; Issue No.; Date Issued; Status | `TitleForDoc`; `DocNo`; `IssuNo`; `DateIssue`; `FinalStatus` | `MainDB_MTN`; `MainDB_MTN_Ext_FAILANALREPO_Rows` expected | `FinalStatus`, `AppName`, `Remarks` exact-matched in sample | Text, Number/Text, Date/Text, Choice/Text | MISSING_INFO | App writes FAR-specific generated columns | PARTIAL | Alias is correct, but source-field parity is incomplete. |
| MTN Penang Maintenance Plan | Sections A-D/E | Serial No.; Type; Company; Equipment Name; Work Center | `txtSrNo`; `Type`; `Company`; `EqName`; `MWC` | `MainDB_MTN` | 0 exact schema matches in sample | Text, Choice/Text, Person/Text | MISSING_INFO | App alias writes `MAINPLAN` for MTP | CONFLICT_FOUND | Source code uses `mP*` fields rather than source names; mapping requires confirmation. |
| MTN Penang Emergency Change | Initiation/final approval | Location; Dept; Change Requested; Equipment Owner; Notification No. | `Loc`; `Dept`; `changereq1`; `EquipOwnerEmail`; `NotNum` | `MainDB_MTN`; `MainDB_MTN_Ext_MTNEMERCHAN_Rows` expected | `Remarks` and `CurrentAction` exact-matched in sample | Text, Person/Text, Number/Text | MISSING_INFO | App alias writes `MTNEMERCHAN` for MECP | PARTIAL | Core route alias exists, but source-field parity is incomplete. |
| MTN Penang Equipment Pre-Inspection | Equipment inspection | Company; Reported By; Date of Inspection; Inspected By; Reason | `Company`; `ReportedBy`; `InsDate`; `InspectedBy`; `Reason` | `MainDB_MTN` | 0 exact schema matches in sample | Text, Date/Text, Multiline Text | MISSING_INFO | App alias writes `EQUIPREINSP` for EPI | CONFLICT_FOUND | Source has only 12 fields but none exact-match exported schema names. |
| MTN Penang Plant Maintenance Documentation | Sections A-D | Serial No.; Year of Review; Work Center; Remarks; Checked | `txtSrNo`; `YearReview`; `MWC`; `Comment`; `Checked` | `MainDB_MTN`; `MainDB_MTN_Ext_PLANMAINDOCU_Rows` expected | `Attachments`, `SubmittedBy`, `SubmittedDate` exact-matched in sample | Text, Multiline Text | MISSING_INFO | App alias writes `PLANMAINDOCU` for PMD | CONFLICT_FOUND | 49 source fields, 3 exact matches and extension expected. |

## 7. Field Mapping Findings

| ID | Finding | Evidence | Status | Recommended Fix |
|---|---|---|---|---|
| FIN-FIELD-001 | FIN current submit logic uses a generic mapping/summarization pattern instead of source-field-specific columns for many fields. | `src/pages/finance/forms/new.tsx:131-142`, `:717`, `:723`, `:763` | CONFLICT_FOUND | Create per-form `submitTransform` or service translation from source field IDs to actual SharePoint columns. |
| FIN-FIELD-002 | `ProblemDesc` is used as a multiline-ish form summary, but `ProblemDesc` is non-filterable in schema capabilities. | `.power/schemas/sharepointonline/maindb_fin.Schema.json:9`, `:31`, `:507-508`; `finance/forms/new.tsx:763` | NEEDS_CONFIRMATION | Confirm whether summary storage is only for display/search backup; do not treat it as structured field storage. |
| FIN-FIELD-003 | CMF_B and CMF_C route/form aliases collapse to `CMF_A`, which may be valid as a single master list discriminator only if approved. | `src/pages/finance/forms/[formCode]/index.tsx:35-38`; `src/pages/finance/forms/new.tsx:676-684` | NEEDS_CONFIRMATION | Document alias mapping in master register or split form codes. |
| MTN-FIELD-001 | MTN source-field names do not consistently match exported schema/model names; app uses generated normalized prefixes such as `fAR*`, `mP*`, `mEC*`, `ePI*`, and `pM*`. | `src/generated/models/main-dbmtn-model.ts:53-140`; `master_field_dictionary.csv` owner MTN | CONFLICT_FOUND | Add a source-field to generated-column crosswalk for each MTN form. |
| MTN-FIELD-002 | `workflflowStage` generated model spelling does not match intended `WorkflowStage`. | `src/generated/models/main-dbmtn-model.ts:87`; `src/pages/mtr/forms/new.tsx:251` | CONFLICT_FOUND | Confirm service translator maps to correct internal `WorkflowStage`; rename app property only if translator/schema support it. |
| COMMON-FIELD-001 | Person fields are mostly typed as `Person/Text` in source dictionaries but current FIN/MTN pages use text inputs and current-user strings rather than confirmed person objects for all source person fields. | `master_field_dictionary.csv`; `finance/forms/new.tsx`; `mtr/forms/new.tsx` | NEEDS_CONFIRMATION | Use EmployeePicker/person-column mapping where SharePoint column type is Person; otherwise document text-only historical fields. |

## 8. Workflow Findings

| Form | Status | Role | Action/Button | Expected Next Status | Expected Routing | Current Logic | Status | Issue |
|---|---|---|---|---|---|---|---|---|
| FIN CAR | Submitted/approved signals extracted | Requester, HOD, Finance, GM/COO/Director candidates | Submit, approve, reject, cancellation approval | HOD/Finance/GM or COO/Director dependent | Business approval matrix needed | New page writes Draft/Submitted and routes to list; approval route redirects to global approvals | NEEDS_CONFIRMATION | Workflow signal count 35/43 but no form-specific approval screen verified. |
| FIN CMF | Approval/review/reject signals extracted | MKT, MKT HOD, FIN, FIN HOD candidates | Submit, review, approve/reject | Credit review then approval | Finance/Marketing routing needed | App writes generic Submitted record under `CMF_A` | CONFLICT_FOUND | CMF_A/B/C aliasing and roles not confirmed. |
| FIN Insurance Claim | Approval/review/status signals extracted | MKT, FIN, HOD, INO candidates | Submit, review, approve/reject | Review/claim approval | Needs insurance-specific approver logic | App supports `INSUCLAI` form code but no confirmed detail approval path | NEEDS_CONFIRMATION | Extension row list expected. |
| FIN RSES | Approver/reject/finance acceptance signals extracted | Requestor, Approver, Finance | Submit, approve, reject | Approver then Finance Acceptance | Needs approver source | App writes Submitted record | NEEDS_CONFIRMATION | Person-field and route action logic missing. |
| FIN VENDREGIFINA | HOD/rejected/currentaction signals extracted | Requestor, Procurement, Finance, IT | Submit, verify, update, withdraw | Multi-section routing | Needs source ownership confirmation | App exposes form code but source is fallback needs review | CONFLICT_FOUND | Do not build final workflow before source ownership confirmation. |
| FIN EARF | Approve/review/verified signals extracted | MKT, MKT HOD, FIN candidates | Submit, review, approve | Review then finance approval | Needs matrix | App writes Submitted record | NEEDS_CONFIRMATION | Exact action path missing. |
| MTN FAILANALREPO | Review/verified/HOD/currentaction signals extracted | Requester, Maintenance, HOD, QA/ISG candidates | Submit, review, verify, approve, reject | Investigation/review then HOD/closure | Needs section actor matrix | App writes New/Submitted with `workflowStage` intent and FAR fields | PARTIAL | Detail approval screen not verified. |
| MTN MAINPLAN | Approver/currentaction signals extracted | Planner, Facilities, Maintenance, E&I/Facilities/Materials candidates | Submit, accept, approve, acknowledge | Section B/C/D/E approval | Needs role confirmation | App writes MTP alias to `MAINPLAN` with plan fields | NEEDS_CONFIRMATION | Source sections not mapped to app action logic. |
| MTN MTNEMERCHAN | HOD/SHE HOD/currentaction signals extracted | Initiator, MTN HOD, SHE HOD, HOD of initiator | Submit, approve, final approve | Emergency approval chain | Needs safety-routing confirmation | App writes MECP alias to `MTNEMERCHAN` | PARTIAL | No section-specific approval action verified. |
| MTN EQUIPREINSP | Minimal workflow signals | Reported By, Inspected By | Submit/report | Inspection completion | Possibly no complex approval | App writes EPI alias to `EQUIPREINSP` | NEEDS_CONFIRMATION | Workflow count low but approval spec register still says approval actions. |
| MTN PLANMAINDOCU | Approver/review/currentaction signals extracted | Checked, Acknowledged, Endorsed actors | Submit/check/acknowledge/endorse | Section B/C/D workflow | Needs role confirmation | App writes PMD alias to `PLANMAINDOCU` | CONFLICT_FOUND | Extension list expected and action rules absent. |

## 9. Role Matrix Findings

| Role | Source | Permission | Screens Visible | Sections Visible | Buttons Visible | Data Scope | Status | Issue |
|---|---|---|---|---|---|---|---|---|
| FIN Requester | Current user/app submit pages | Create draft/submit | `/fin/forms/:formCode/new`; `/fin/forms/:formCode` | Request sections | Save/Submit | Own FIN records expected | PARTIAL | No per-record ownership detail route verified. |
| FIN HOD | Master workflow/role-section candidates | Approve/reject expected | Global approvals redirect | HOD sections | Approval buttons expected | Routed FIN records | NEEDS_CONFIRMATION | Role source not confirmed in app or SharePoint role list for FIN. |
| FIN Finance Reviewer | Master role-section candidates | Review/approve expected | Global approvals redirect | FIN sections | Review/approve expected | FIN records | NEEDS_CONFIRMATION | Finance role lookup/routing source missing. |
| FIN Marketing/Procurement/IT actors | Master role-section candidates | Conditional workflow actions | Not form-specific | CMF/vendor sections | Conditional buttons expected | Related form records | NEEDS_CONFIRMATION | Especially VENDREGIFINA source/ownership needs confirmation. |
| MTN Requester | Current user/app submit pages | Create draft/submit | `/mtr/forms/:formCode/new`; `/mtr/forms/:formCode` | Request/incident sections | Save/Submit | Own MTN records expected | PARTIAL | App uses `MTR` route/department but source owner is `MTN`. |
| MTN Maintenance/HOD | Master role-section candidates | Review/approve/acknowledge expected | Global approvals redirect | Maintenance reply/approval sections | Approve/reject expected | MTN records | NEEDS_CONFIRMATION | HOD and maintenance staff source not confirmed. |
| MTN SHE HOD | Emergency change source candidate | Safety approval expected | Global approvals redirect | SHE/final approval sections | Approve/reject expected | Emergency-change records | NEEDS_CONFIRMATION | Routing condition for SHE involvement not confirmed. |
| MTN QA/ISG | FAR source candidate | Review/verify expected | Global approvals redirect | QA/ISG approval sections | Verify/approve expected | FAR records | NEEDS_CONFIRMATION | Role/section rows remain human-confirmation candidates. |
| Admin | App-level/admin routes | Manage/reroute expected | Global admin/workflow pages | All | Configure/override | Department-wide | MISSING_INFO | This pass did not verify FIN/MTN admin role tables. |

## 10. Routing Logic Findings

| Form | Trigger | Condition | Route To | Routing Source | Current Implementation | Status | Issue |
|---|---|---|---|---|---|---|---|
| FIN all promoted forms | User opens FIN module | `/fin/forms/:formCode` | FIN list page | `src/routes/fin-routes.tsx:17-30` | Routes to FIN form index/list/new; approvals redirect global | PARTIAL | No detail route. |
| FIN CMF_B/CMF_C | Read/list or submit | CMF_B/CMF_C/Credit aliases | `CMF_A` SharePoint code | `finance/forms/[formCode]/index.tsx:35-38`; `finance/forms/new.tsx:676-684` | Alias collapses to `CMF_A` | NEEDS_CONFIRMATION | Needs master-design approval. |
| FIN submit | Save/submit | Draft vs submit | `/fin/forms/{FormCode}` list | `finance/forms/new.tsx` | Creates `MainDB_FIN` record then navigates to list | PARTIAL | Verify post-submit readback per form. |
| MTN legacy maintenance route | User opens `/maintenance` | Any maintenance path | `/mtr` or `/mtr/forms` | `maintenance-routes.tsx:13-21` | Redirects legacy Maintenance to MTR | PARTIAL | Alias is useful but must be documented. |
| MTN app route | User opens `/mtr/forms/:formCode` | FAR/MTP/PMD/MECP/EPI or master codes | Matching master FormCode filter | `mtr/forms/[formCode]/index.tsx:24-39`, `:85-92` | Uses `FormCode eq` filter plus local form-code filter | PARTIAL | No detail route. |
| MTN submit | Save/submit | UI aliases | Master FormCode via `getSharePointFormCode` | `mtr/forms/new.tsx:141-154`, `:240-251` | Creates `MainDB_MTN` record | PARTIAL | Alias source must be approved and tested live. |

## 11. Section Logic Findings

| Form | Section | Expected Visibility Rule | Expected Edit Rule | Current Rule | Status | Issue |
|---|---|---|---|---|---|---|
| FIN CAR | Capital/project/financial/HOD/COO/Director/cancellation sections | Role/status conditional | Requester edits request; approvers edit own approval sections | App shows generic project/financial/justification/timeline/attachment sections on new form | CONFLICT_FOUND | Source approval/cancellation sections not implemented in reviewed page. |
| FIN CMF | Credit application/review/approval sections | Marketing/Finance role conditional | Role-specific edit | App shows generic configured sections and collapses aliases | NEEDS_CONFIRMATION | Exact sections from master role-section register need confirmation. |
| FIN RSES | Initiator, Approver Acceptance, Finance Acceptance | Initiator then approver/finance | Role-specific edit | App generic submit only verified | NEEDS_CONFIRMATION | Section action logic missing. |
| FIN VENDREGIFINA | Requestor, Procurement, Finance Update/Confirmation, IT Update, Withdrawn | Multi-role conditional | Role-specific edit | App generic submit only verified | CONFLICT_FOUND | Source identity needs confirmation before build. |
| MTN FAILANALREPO | Entity Detail, Troubleshooting, Possible Causes, Corrective Action, Result, Extension | Status and role conditional | Requester/Maintenance/HOD/QA/ISG split expected | App captures selected FAR fields in one page | CONFLICT_FOUND | Full source sections not mapped to app section rules. |
| MTN MAINPLAN | Section A, Section B Acceptance, Section C Facilities Approval, Section D Maintenance Acknowledgement, Section E | Status and role conditional | Role-specific edit | App captures MTP fields in one page | NEEDS_CONFIRMATION | Section actors and visibility missing. |
| MTN MTNEMERCHAN | Initiation, details, final HOD approval | Emergency condition and role conditional | Initiator then HOD/SHE/HOD | App captures MECP fields in one page | NEEDS_CONFIRMATION | Safety/HOD routing not verified. |
| MTN EQUIPREINSP | Inspection fields, hidden fields | Likely requester/inspector only | Inspector/requester edit | App captures EPI fields in one page | NEEDS_CONFIRMATION | Approval spec says approval actions despite low workflow signal count. |
| MTN PLANMAINDOCU | Section A-D, Checked, Acknowledged, Endorsement | Status and role conditional | Role-specific edit | App captures PMD fields in one page | CONFLICT_FOUND | Expected extension row list and section workflow absent in reviewed page. |

## 12. Validation Rule Findings

| Form | Field/Section | Validation Rule | Trigger | Error Message | Current Implementation | Status | Issue |
|---|---|---|---|---|---|---|---|
| FIN all | `Title`, `Status`, `Department`, `FormCode` | SharePoint required | Create/update | Connector validation | `MainDB_FIN` schema requires all four; app supplies title, statusKey, departmentKey, formCode | PARTIAL | Live readback still required after schema/export changes. |
| FIN all | Source required fields | MISSING_INFO | Submit | MISSING_INFO | UI has local `required: true` flags in form config | NEEDS_CONFIRMATION | Required source fields are not fully reconciled against SharePoint required flags. |
| FIN CAR | Amount/date fields | Number/date formatting | Submit | App-side/browser validation only | App parses numeric values and writes ISO/date strings where configured | PARTIAL | Source `Number/Text` and `Date/Text` types require final SharePoint type decisions. |
| MTN all | `Title` | SharePoint required | Create/update | Connector validation | App supplies title | PARTIAL | Only title is required in schema export; FormCode/status requiredness not enforced at list level. |
| MTN all | `FormCode` | App/model required | Create/read filter | App compile/runtime | App supplies master FormCode from alias mapping; list page filters by `FormCode` | CONFLICT_FOUND | SharePoint export does not mark `FormCode` required. |
| MTN FAR/MTP/MECP/EPI/PMD | Equipment/date/status fields | Local app fields | Submit | Toast/connector errors | App gathers fields and maps to generated MTN columns | PARTIAL | Source requiredness and type matching need field-by-field validation. |
| Common attachments | Attachment upload/link metadata | MISSING_INFO | Submit/upload | MISSING_INFO | AttachmentLinks columns exist in schemas, but this pass did not verify upload manager per FIN/MTN form | MISSING_INFO | Attachment field behavior needs live upload/readback test. |
| Common person fields | Person/email format | Use picker/person claims if SharePoint Person | Submit | MISSING_INFO | Current user strings and text fields are used in reviewed paths | NEEDS_CONFIRMATION | Need to classify source `Person/Text` as actual Person vs historical text fields. |

## 13. Mock/Stale Data Findings

| ID | Finding | Evidence | Status | Recommended Fix |
|---|---|---|---|---|
| MOCK-FIN-001 | No `SAMPLE_DATA` array was found in the reviewed FIN list/new paths; pages use generated hooks/services. | `src/pages/finance/forms/[formCode]/index.tsx:16`, `:55-61`; `src/pages/finance/forms/new.tsx:39`, `:695` | Confirmed for reviewed paths | Keep using generated hooks for FIN. |
| MOCK-MTN-001 | No `SAMPLE_DATA` array was found in the reviewed MTR/MTN list/new paths; pages use generated hooks/services. | `src/pages/mtr/forms/[formCode]/index.tsx:16`, `:86-92`; `src/pages/mtr/forms/new.tsx:31`, `:327` | Confirmed for reviewed paths | Keep using generated hooks for MTN. |
| STALE-FIN-001 | FIN UI still contains generic form-field labels that do not match source labels for all fields. | `finance/forms/new.tsx`; `master_field_dictionary.csv` owner FIN | CONFLICT_FOUND | Replace generic configs with source-backed field definitions. |
| STALE-MTN-001 | MTN UI uses `MTR` route/label aliases while source registers use `MTN` owner and master codes. | `maintenance-routes.tsx:13-21`; `mtr-routes.tsx:17-30`; `MASTER_SHAREPOINT_DESIGN_REGISTER.md:200-207` | NEEDS_CONFIRMATION | Document alias decision or rename UI/routes before rollout. |
| STALE-COMMON-001 | Expected extension lists from master design are not registered as app data sources in reviewed `power.config.json` blocks. | `MASTER_SHAREPOINT_DESIGN_REGISTER.md`; `power.config.json` FIN/MTN datasource blocks | CONFLICT_FOUND | Register/provision extension data sources or revise design. |

## 14. Prioritized Fix List

| Priority | Area | Finding | Impact | Recommended Fix | Validation Step |
|---|---|---|---|---|---|
| P0 Critical blocker | FIN/MTN schema | Full source-field-to-SharePoint-column matrix is not confirmed for 596 FIN and 316 MTN fields. | Incorrect or lost migrated data. | Generate per-form mapping sheets from `master_field_dictionary.csv` to live schema exports and route unresolved fields to schema decisions. | Compare all source fields to `.power` exports after re-export; no `MISSING_INFO` for promoted fields. |
| P0 Critical blocker | Extension lists | Master design expects several FIN/MTN extension lists but app config registers only main lists. | Repeating/row sections cannot persist accurately. | Provision/register extension lists or formally move fields to main lists. | `power.config.json`, schema exports, generated model/service/hook files include each approved extension list. |
| P0 Critical blocker | FIN summary storage | FIN submit path summarizes field values into `ProblemDesc`. | Violates discrete-field audit expectations if used for structured form data. | Map each source field to a discrete model column; reserve `ProblemDesc` only for free-text display summary if approved. | Submit CAR/CMF/EARF/RSES test rows and read back every mapped field separately. |
| P1 High | MTN required discriminator | `MainDB_MTN` does not mark `FormCode` required in exported schema. | Orphan records could bypass list filters. | Set required fields or add service-level hard validation and document list-level exception. | Create attempt without FormCode should fail at chosen enforcement layer. |
| P1 High | Detail/approval routes | FIN and MTN have list/new routes but no verified department-specific detail route. | Users cannot complete record-level review/approval in department context. | Add detail pages after field and role matrices are confirmed. | List row click opens `/fin/forms/{code}/detail/{id}` or `/mtr/forms/{code}/detail/{id}` and reads SharePoint record. |
| P1 High | Role/section confirmation | FIN and MTN role/section rows remain `Needs Human Confirmation`. | Approver buttons/sections may be exposed to the wrong users. | Confirm per-form actor matrix and update `MASTER_ROLE_SECTION_REGISTER.md`. | Role simulation or authenticated test confirms visibility/editability by actor. |
| P2 Medium | Alias documentation | FIN CMF aliases and MTN MTR aliases are implemented but not fully business-approved in this report. | Auditors may treat the app as wrong even if code works. | Add alias table to master Power Apps spec and central form reference. | Search report/spec shows every route alias and SharePoint FormCode mapping. |
| P2 Medium | Validation/error copy | Required rules are local and incomplete against source fields. | Users may submit incomplete historical forms. | Add source-backed validation metadata after field matrix is approved. | Submit blocked for every confirmed required field; draft behavior documented separately. |
| P3 Low | Microsoft 365 user/email proof | User/email hooks are used but connector permission evidence was not refreshed in this pass. | Notifications or identity enrichment may fail after deployment. | Run tenant email/profile smoke for FIN and MTN submit paths. | Evidence artifact shows user profile and email send/read status. |

## 15. Updated / Created Files

| File | Action | Notes |
|---|---|---|
| `source_analysis/09_reports/DATA_SOURCES_ANALYSIS_PIPELINE_REPORT.md` | Created | New pipeline report covering FIN and MTN with missing/conflict/needs-confirmation markers. |
| `docs/change-log.md` | Updated | Added change-log entry for this report creation. |

## 16. Next Recommended Action

Fix first: create the FIN and MTN source-field-to-SharePoint-column reconciliation matrix from `master_field_dictionary.csv` against live `.power` schema exports and the generated service translators. Do this before building more screens or adding approval buttons.

The first two concrete work items should be:

1. FIN: reconcile CAR and CMF first because they have the highest field counts and current app submit logic is most generic there.
2. MTN: reconcile `FAILANALREPO` and `PLANMAINDOCU` first because both expect extension-row storage and have workflow/section complexity.

Blocking progress: extension-list registration/provisioning and human-confirmed role/section rules are still missing for several FIN and MTN forms. Keep `MISSING_INFO`, `CONFLICT_FOUND`, and `NEEDS_CONFIRMATION` open until those are resolved with schema exports, app code, or business decision evidence.
