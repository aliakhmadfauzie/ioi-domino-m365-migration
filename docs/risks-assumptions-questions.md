# Risks, Assumptions & Questions (RAQ) Log

> **Updated**: 2026-05-31 — Major revision: validated assumptions, added new risks, linked to decision log

---

## Risks

| # | Risk | Impact | Probability | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| 1 | Domino data export not available — cannot migrate historical records | High | Medium | Use DXL/XML and PDF UI exports as source of truth for schema; manual data entry for active records | You | 🔄 Active |
| 2 | SAP Sign Off form has 385+ fields — too complex for single form | Medium | High | Decompose into sub-forms by section (General, SAP, Testing, Sign-off); use multi-step form in Power Apps. **Decision made**: DEC-2026-007 — decompose into sub-forms | You | ✅ Mitigated |
| 3 | Approval connector requires Power Apps Premium license per user | Medium | Medium | Use SharePoint email notifications as fallback; confirm license count before rollout | You | 🔄 Active |
| 4 | Johor site has different field counts (e.g., HI: 60 vs 58) — schema divergence | Low | Medium | Create separate SharePoint list (`MainDB_IT_JHR`) for Johor-specific columns; shared parent list for cross-site views. **Decision made**: DEC-2026-004 | You | ✅ Mitigated |
| 5 | User adoption resistance to new system | Medium | Low | Pilot with IT department first; provide training; keep Domino read-only during transition. **Decision made**: DEC-2026-005 — staged deployment IT-first | You | ✅ Mitigated |
| 6 | Missing Domino agent logic in DXL exports — some agents are LotusScript/Java | Medium | Medium | Review agent code in DXL carefully; document unknown agent behaviors in RAQ log | You | 🔄 Active |
| 7 | Power Apps code-first app not yet deployed to Power Platform — could have environment-specific issues | Medium | Medium | Test Vite dev server locally first; then deploy to dev Power Platform environment | You | 🔄 Active |
| 8 | Microsoft 365 Users connector may need admin consent for all users | Low | Medium | Pre-consent in Azure AD admin portal before rollout | You | 🔄 Active |
| 9 | **NEW** — `powerapps-mirror` was scraped from browser — may have incomplete or corrupted files | Medium | Medium | Cross-reference with `powerapps-bundles-inbox/` text bundles; rebuild generated files from source exports if needed | You | 🔄 Active |
| 10 | **NEW** — Power Apps code-first app has dual code paths (`apps/code-first/ioicodeapp/apps/` and `apps/code-first/ioicodeapp/powerapps-mirror/apps/`) — confusion risk | Low | Medium | Document both paths clearly; designate `powerapps-mirror/apps/ioi-platform/` as primary | You | 🔄 Active |
| 11 | **NEW** — PDF UI inventory (`analysis/pdf-ui-inventory.md`) is empty — UI requirements not formally documented | Medium | High | Prioritize population of PDF UI inventory from 1,171 PDF exports; start with EAF (28 PDFs) and ITSSR as MVP | You | 🔄 Active |
| 12 | **NEW** — LOG/PRD/MTN forms have no DXL/XML source — field inventory based on PDF filenames and CSV meta only | High | High | Commission DXL exports for these departments; current design relies on inferred field patterns | You | 🔄 Active |
| 13 | **NEW** — MainDB_LOG and MainDB_MTN SharePoint sites not yet provisioned — must create new site collections | Medium | Medium | Create `ioi-portal-log` and `ioi-portal-mtn` SharePoint sites before list provisioning | You | 🔄 Active |

## Assumptions

| # | Assumption | Validated? | Date | Notes |
|---|---|---|---|---|
| 1 | SharePoint site `https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites` is accessible with list creation permissions | ✅ Yes | 2026-05-31 | Confirmed — MainDB_IT + some extension lists exist |
| 2 | Power Platform environment with Dataverse is available | ✅ Yes | 2026-05-31 | PAC CLI authenticated successfully |
| 3 | All 23 Domino forms use a single Domino server (PHBSVR) | ✅ Yes | 2026-05-31 | Confirmed from DXL inventory files (PATH field) |
| 4 | Johor and Penang share the same parent list schema; differences are only in extension lists | ⚠️ Partial | 2026-05-31 | HI Johor has 2 extra fields — need confirmation |
| 5 | Existing Domino agents can be fully replaced by Power Automate flows | ⚠️ Partial | 2026-05-31 | Most agents are simple @MailSend or formula agents; LotusScript agents need manual review |
| 6 | All Domino PDF UI exports cover the latest form versions | ⚠️ Partial | 2026-05-31 | 1,171 PDFs extracted; some may be outdated versions |
| 7 | Power Apps code-first app mirror (powerapps-mirror) matches the actual Power Apps project | ⚠️ Partial | 2026-05-31 | Mirror structure verified (28 form schemas, 80+ models, 40+ routes); content fidelity needs cross-reference with bundles |
| 8 | HR Domino forms follow the same structure as IT forms | ❌ Not yet | — | No HR DXL source files have been analyzed yet |
| 9 | **NEW** — PAC auth session will remain valid for the duration of the migration work | ❌ Not yet | — | Token expiry unknown; need to verify refresh capability |
| 10 | **NEW** — Power Apps code-first app can be deployed via `pac` CLI directly from the mirror folder | ❌ Not yet | — | Need to test `pac deploy` with `power.config.json` configuration || 12 | **NEW** — DXL/XML source files exist for non-IT departments beyond HR and QA | ❌ Not yet | — | Penang QA folder is empty; no DXL found for PRC, SHE, FIN, LOG, PRD, STR, or any Johor non-HR/QA departments |
| 13 | **NEW** — The full portfolio of ~418+ forms can be migrated with the same main-list-per-dept pattern | ❌ Not yet | — | IT MainDB_IT pattern proven; HR MainDB_HR provisioned; other dept lists need verification |
## Questions

| # | Question | Asked To | Answer | Date | Status |
|---|---|---|---|---|---|
| 1 | What is the Power Platform environment name/URL for deployment? | You | — | — | ❌ Open |
| 2 | Are there existing SharePoint lists already created (MainDB_IT, MainDB_IT_JHR)? | You | MainDB_IT + some extension lists exist | 2026-05-31 | ✅ Answered |
| 3 | Should Power Automate flows be created as cloud flows or as part of a solution? | You | Solution-aware flows (DEC-2026-006) | 2026-05-31 | ✅ Decided |
| 4 | Are there Domino HR forms that need to be migrated? If so, where are the DXL/XML source files? | You | — | — | ❌ Open |
| 5 | Is the SAP Sign Off form still actively used with all 385+ fields, or can it be simplified? | You | — | — | ❌ Open |
| 6 | What is the target go-live date for the first wave (IT department pilot)? | You | — | — | ❌ Open |
| 7 | Which department should be the pilot — IT only, or include HR and Finance? | You | IT first (DEC-2026-005) | 2026-05-31 | ✅ Decided |
| 8 | Are there any custom LotusScript agents in Domino that need to be replicated in Power Automate or Azure Logic Apps? | You | — | — | ❌ Open |
| 9 | Should Johor and Penang have separate Power Apps or a single app with site filtering? | You | Single app with site filtering (DEC-2026-003) | 2026-05-31 | ✅ Decided |
| 10 | Is there a preference for the Power App UI theme/layout (modern/corporate)? | You | — | — | ❌ Open |
| 11 | **NEW** — Which specific extension lists currently exist on SharePoint? Can we get a schema dump? | You | — | — | ❌ Open |
| 12 | **NEW** — Should the PDF UI inventory be populated from all 1,171 exports, or focus on IT forms only (34 PDFs)? | You | — | — | ❌ Open |
| 13 | **NEW** — Full portfolio scope is ~418+ forms (not 23 IT only) — 28 non-IT department-sites have PDF-only evidence | You | — | — | ❌ Open |
| 14 | **NEW** — Where are the DXL source files for Penang QA/QC, Penang PRC, Penang SHE, and other non-IT departments? | You | — | — | ❌ Open |

---

## RAQ to Decision Log Cross-Reference

| RAQ # | Type | Linked Decision | Status |
|-------|------|-----------------|--------|
| A2 | Assumption → Validated | — | ✅ Closed |
| A1 | Assumption → Validated | — | ✅ Closed |
| R2 | Risk → Mitigated | DEC-2026-007 | ✅ Closed |
| R4 | Risk → Mitigated | DEC-2026-004 | ✅ Closed |
| R5 | Risk → Mitigated | DEC-2026-005 | ✅ Closed |
| Q2 | Question → Answered | — | ✅ Closed |
| Q3 | Question → Decided | DEC-2026-006 | ✅ Closed |
| Q7 | Question → Decided | DEC-2026-005 | ✅ Closed |
| Q9 | Question → Decided | DEC-2026-003 | ✅ Closed | |
