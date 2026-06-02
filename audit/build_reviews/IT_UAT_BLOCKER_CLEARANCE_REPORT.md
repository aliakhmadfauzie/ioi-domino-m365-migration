# IT UAT Blocker Clearance Report

Date: 2026-06-02
Scope: IT department UAT blockers that could be resolved from repo evidence, route evidence, and live SharePoint provisioning.

## Actions Completed

| Area | Result | Evidence |
|---|---|---|
| SAPAMR Ext_SAP provisioning | Live `MainDB_IT_Ext_SAP` now has `SAPAMR_TBVEmail`, `SAPAMR_TBAEmail`, and `SAPAMR_TBV1Email` through `SAPAMR_TBV5Email`. | `scripts/sharepoint/provision-sapamr-ext-sap.ps1`; exported `maindb_it_ext_sap.Schema.json` |
| SAPAMR local schema evidence | Exported schema now includes the seven `SAPAMR_*` fields. | `.power/schemas/sharepointonline/maindb_it_ext_sap.Schema.json` |
| Legacy/detail routing | Added route aliases and canonical redirects for superseded/legacy names: `VPNACCESS -> EAF`, `NOTESID -> NIR`, `PWDRESET -> RS`, `USERID -> UR`, `IOIPOL -> IOIP`, `ITDAILYRPT -> ITDR`, `ITEVT -> ITE`, `SVRREBOOT -> SRL`, `SVRREC -> SRVR`, `HWINV_PRAI -> HI`, `INTUATSOF/SILOUATSOF -> SAPSOF2`. | `src/lib/it-form-routes.ts`; `src/routes/it-routes.tsx` |
| Shared IT detail links | IT-facing shared pages and IT notification templates now generate form-aware detail paths instead of direct `/submissions/{id}` links. | `src/pages/approvals.tsx`; `src/pages/batch-approvals.tsx`; `src/pages/forms.tsx`; `src/pages/index.tsx`; `src/services/notification-service.ts` |
| Alias-aware database filters | Generic IT database view and affected custom lists now query active and legacy form codes together. | `[formCode]/index.tsx`; `itdr/index.tsx`; `ite/index.tsx`; `srl/index.tsx`; `srvr/index.tsx`; `sapsof2/index.tsx` |
| HI storage ownership | UAT path treats HI hardware details as `MainDB_IT_Ext_Assets` data, matching current create/list/detail implementation. | `hi/new.tsx`; `hi/index.tsx`; `hi/[id].tsx` |
| SAPTR/ITSSR schema blockers | Current local schema evidence confirms SAPTR Ext_SAP fields and ITSSR Ext_Support fields. | `maindb_it_ext_sap.Schema.json`; `maindb_it_ext_support.Schema.json` |
| EAF build blocker | EAF detail screen now treats SharePoint audit metadata as optional extra fields, preserving strict `MainDBIT` typing while allowing the record info panel to render. | `src/pages/it/forms/eaf/detail.tsx` |

## Verification

`npx tsc -p tsconfig.app.json --noEmit` and `npm run build` passed from `ioicodeapp/powerapps-mirror/apps/ioi-platform`.

## Remaining Non-Code Blockers

The following are not cleared by this pass because source/workflow evidence is still missing or incomplete: TRNMAN source, MPSPRN source/status taxonomy, SAPCA staged workflow, SAPSLCF staged workflow, RS approval requirement, UR approval/ExtAccess requirement, and SVRREC approval classification.

These should be treated as out-of-scope for full IT UAT unless business owners provide the missing decision/source evidence or the forms are explicitly excluded from the UAT script.
