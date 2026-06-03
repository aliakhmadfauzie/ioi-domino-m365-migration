# Project Status Report - IOI Group Domino to M365 Migration

> Report date: 2026-06-03  
> Owner: Migration team, with business and SharePoint owners required for final confirmations  
> Target date: Pending blocker resolution and confirmed rollout schedule

## 1. Progress

- The migration has progressed from evidence collection into active build and validation for the code-first Power Apps platform.
- Core project foundations are in place:
  - Active app path confirmed as `ioicodeapp/powerapps-mirror/apps/ioi-platform/`.
  - Architecture decisions confirmed for a single code-first React/TypeScript app, using department main lists and `FormCode` discriminators.
  - SharePoint integration patterns are established for main department lists, generated models, services, hooks, and route-level read/write screens.
- The current app has received several major implementation updates:
  - IT submission, detail, approval, and routing pages have been improved, including ITSSR, EAF, HI, IOIP/IOIPOL, ISGDOC, SFAR, SAPCA, SAPTR, and shared navigation behavior.
  - Form data is being moved away from generic `remarks` JSON storage toward structured SharePoint columns and extension lists.
  - FIN, PRD, and MTN/MTR detail routes and list view actions have been added for ready register lanes.
  - Index pages now use more business-friendly labels instead of raw list/database terminology.
  - Lookup and people-picker behavior has been improved for Company, Department, and person fields.
- Current evidence and analysis coverage:
  - 23 Domino IT forms analyzed in the original migration scope.
  - 1,171 PDF UI exports available as source evidence.
  - 29 JSON form schemas in the active app reference set.
  - 361 master workflow register rows extracted across the broader master app source inventory.
  - 361 Power Apps specification rows extracted, including list/new/detail/approval-action expectations.
  - 22,074 source fields captured in the master field dictionary.
  - FIN and MTN/MTR data-source analysis completed for the current pipeline pass.

## 2. Current Blocker

- The main blocker is source-field and workflow confirmation for the next department expansion, especially FIN and MTN/MTR.
- The key issue is that extracted Domino source fields do not yet have a fully confirmed one-to-one mapping to live SharePoint internal columns:
  - FIN has 596 extracted source fields requiring confirmed storage decisions.
  - MTN has 316 extracted source fields requiring confirmed storage decisions.
  - Several expected FIN and MTN extension lists are identified in design evidence, but not yet fully confirmed as provisioned, registered, and generated app data sources.
- Role and section behavior also needs business confirmation:
  - 153 of 177 current role/section register rows are still marked as needing human confirmation.
  - Approval routing, editability, and section visibility cannot be finalized safely until these rules are confirmed.
- Impact:
  - Users may be able to submit records, but the team cannot yet prove that every migrated source field is stored in the correct SharePoint column.
  - Approval buttons, current-action routing, and workflow status transitions may be incomplete or incorrect if built before the role matrix is confirmed.
  - Production signoff for FIN and MTN/MTR should remain blocked until schema, extension-list, and role/section decisions are closed.
- Needed to remove the blocker:
  - Business approval of FIN and MTN/MTR workflow and role matrices.
  - SharePoint owner confirmation of internal column names and extension-list strategy.
  - Re-exported SharePoint schemas after any list changes.
  - Live create/readback validation for promoted forms after mappings are updated.

## 3. Next Step

- Immediate action: complete the FIN and MTN/MTR field-to-column reconciliation pack.
- Recommended owner:
  - Migration team to prepare the mapping and decision list.
  - Business process owners to confirm approval roles, section ownership, and workflow actions.
  - SharePoint/platform owner to confirm or provision required columns and extension lists.
- Expected outcome:
  - A confirmed mapping matrix for FIN and MTN/MTR source fields.
  - A short decision register for unresolved extension-list, role, and route-alias questions.
  - Updated app data-source registration and generated services only after schema decisions are confirmed.
- Target timeline:
  - Mapping and blocker review should be the next working activity.
  - Build expansion should resume only after the P0 mapping and role/section confirmation items are closed.

## Management Summary

The project is progressing well at the platform and implementation level, with the active code-first app already supporting structured SharePoint integration, improved navigation, and several completed IT workflow fixes. The current risk is not basic app readiness; it is data and workflow accuracy for the broader department rollout. The next management decision point is to confirm FIN and MTN/MTR field storage, extension-list strategy, and approval ownership so the team can continue building without risking data loss or incorrect workflow behavior.
