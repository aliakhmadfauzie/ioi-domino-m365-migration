# FIX-029 IOIPOL Approval Persistence Re-Audit

Date: 2026-06-03

## Scope

- Task: `TASK-FIX-029`
- Fix IDs: `FIX-028`, `FIX-029`, `FIX-079`
- Audit IDs: `AUD-006`, `AUD-039`
- Module: IT Policy / `IOIPOL` alias implemented by active `IOIP`

## Source Rules Applied

- DEC-2026-009 aliases `IOIPOL` to the active `IOIP` runtime implementation for UAT.
- IOIPOL/IOIP is an approval-required policy form.
- Approval proof must persist beyond notification email and rendered buttons.

## App Changes Verified

| Area | Evidence | Result |
|---|---|---|
| New submission state | `src/pages/it/forms/ioip/new.tsx` writes parent `CurrentstatusKey55`, `workflowstage: 2`, and child `iOIPFinalStatus: '1'`. | Pass |
| Canonical detail route | `src/routes/it-routes.tsx` routes `/it/forms/ioip/detail/:id` and `/it/forms/ioip/:id` to the dedicated IOIP detail page. | Pass |
| Child policy lookup | `src/pages/it/forms/ioip/detail.tsx` reads policy child rows with `parentRecordId eq ${id}`. | Pass |
| Approval persistence | `src/pages/it/forms/ioip/detail.tsx` records actions through `recordITApprovalAction(...)` and updates `MainDB_IT_Ext_Policy` status/date/comment/replied fields for approver stages. | Pass |
| Actor gating | Detail action controls are enabled only for the requester or expected policy approver email for the current stage. | Pass |
| Alias ownership | `IOIPOL` remains routed through the active `IOIP` implementation; no separate IOIP build path is required for UAT. | Pass |

## Verification Commands

| Command | Result |
|---|---|
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass - Vite production build completed with 4678 modules transformed and built in 15.97s |

## Remaining Evidence Boundary

Live SharePoint create/readback was not run in this pass. The app has a configured `maindb_it_ext_policy` data source, but the local `.power/schemas/sharepointonline/maindb_it_ext_policy.Schema.json` export was not present during this re-audit. This report verifies the app-side persistence path and build gate, not authenticated tenant readback.

## Decision

`FIX-028`, `FIX-029`, and `FIX-079` are verified for the code-first app UAT path.

- `FIX-028`: Verified by DEC-2026-009 alias handling and dedicated IOIP detail routing.
- `FIX-029`: Verified by parent approval action persistence plus policy extension approval field updates.
- `FIX-079`: Verified by resolving IOIP/IOIPOL ownership to the DEC-2026-009 UAT alias path.

## Next Safe Task

Continue with the next queue item after `TASK-FIX-029`; live SharePoint schema export/readback for `MainDB_IT_Ext_Policy` should be scheduled separately if tenant-backed evidence is required.
