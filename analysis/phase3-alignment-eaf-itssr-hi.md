# Phase 3: Alignment Check — EAF, ITSSR, HI

> **Generated**: 2026-05-31

---

## Alignment Table

| Source Requirement | Source Evidence | Current Repo Implementation | Alignment Status | Required Update |
|---|---|---|---|---|
| **EAF: 10 editable Domino fields** | DXL: User, justification, comment1-4, RequestedBy, Type, AgentName, ClientID, Group, system | 9 fields captured; `Group`, `ClientID` missing | ⚠️ Partially aligned | Add Group and ClientID fields to new.tsx |
| **EAF: 5-stage workflow** | DXL: Request→Submitted→Acceptance1→Acceptance2→Done | `FORM_STAGES.EAF` = S1-S5 correct ✅ | ✅ Aligned | None |
| **EAF: isPCN conditional routing** | DXL: `isPCN="1"` → COO, else Director | `isPancenCompany` check in new.tsx ✅ | ✅ Aligned | None |
| **EAF: CC recipients** | DXL: `CC` names field | PeoplePicker for CC ✅ | ✅ Aligned | None |
| **EAF: HApp (higher approver)** | DXL: `HApp` names field for COO/Director | Not surfaced as visible field in form | ❌ Not aligned | Add HApp display in detail view |
| **EAF: Email notifications** | DXL: `@MailSend(depthead;...)` | `useSendApprovalEmail` / `useSendConfirmationEmail` ✅ | ✅ Aligned | Power Automate flow still not built |
| **EAF: Form code consistency** | Design doc: 28 forms, formCode="EAF" | Schema file named `VPNACCESS.json` with formCode "VPNACCESS" | ❌ Not aligned | Rename schema to `EAF.json` with formCode "EAF" |
| **ITSSR: 23 fields** | DXL: CaseNo, ReportedBy, CreationDate, INO, CA, Category etc. | Schema covers ~30 fields including SLA tracking ✅ | ✅ Aligned | None |
| **ITSSR: INO auto-numbering** | DXL: SimpleAgent `field='INO' value='0121'` | `generateTicketId('ITSSR')` in submission service ✅ | ✅ Aligned | Power Automate Flow 2 designed but not built |
| **ITSSR: Category routing** | DXL: `CA` field used in view selection | `itssr-pic-routing.ts` maps categories to IT PIC emails ✅ | ✅ Aligned | None |
| **ITSSR: SLA tracking** | Inferred from Domino behavior | `itssr-sla-utils.ts` defines Critical=1h, High=4h, Normal=8h, Low=24h | ⚠️ Needs confirmation | Validate SLA hours with business |
| **ITSSR: PDF UI validation** | PDF exports available but not inventoried | `analysis/pdf-ui-inventory.md` is empty | ❌ Not aligned | Populate PDF UI inventory from 34 IT PDFs |
| **HI: 58 fields (Penang)** | DXL: machineid, usedby, macdesc, comp, cpuspd, hddtype, ram, inch, ipadd_1, winversion, MACAddress, SerialNo, Location, Printer + 45 more | `new.tsx` covers ~25 fields (equipment info, location, acquisition) | ⚠️ Partially aligned | Add remaining 33+ fields: CPU, RAM, HDD, Monitor, IP, MAC, OS, Printer etc. |
| **HI: 60 fields (Johor)** | DXL: Same as Penang + Site, Building/Level | `site` and `building` fields exist in new.tsx ✅ | ✅ Aligned | None |
| **HI: Extension list** | Design: `MainDB_IT_Ext_Assets` | Code writes to `MainDB_IT_Ext_Assets` but list doesn't exist on SharePoint | ❌ Blocked | Create Ext_Assets SharePoint list |
| **HI: No workflow** | DXL: Pure data entry form | No workflow stages; status = Active/Spare/Maintenance/Disposed ✅ | ✅ Aligned | None |
| **HI: Audit reminders** | DXL: RemExpiry agent | Power Automate Flow 4 designed (monthly) | ⚠️ Partially aligned | Flow not built |
| **HI: Detail/view page** | N/A — standard CRUD requirement | `[id].tsx` does not exist | ❌ Missing | Create HI detail page |
| **HI: Asset tag generation** | DXL: `machineid` = unique ID | `generateAssetTag()` creates `IOI-IT-{year}-{random}` ✅ | ✅ Aligned | None |
| **HI: Schema form code** | Design: formCode="HI" | Schema file `HWINV_PRAI.json` has formCode "HWINV_PRAI" | ❌ Not aligned | Rename schema to `HI.json` with formCode "HI" |
| **SharePoint: Mock vs real** | Design: SharePoint connector | Service currently uses in-memory mock | ⚠️ Partially aligned | Swap mock for real SharePoint connector |
| **SharePoint: MainDB_IT columns** | Design: 13 core + form-prefixed | Model generated; columns may not match actual list | ⚠️ Needs confirmation | Verify MainDB_IT columns match generated model |
| **Docs: PDF UI inventory** | 1,171 PDFs available | `analysis/pdf-ui-inventory.md` is empty | ❌ Not aligned | Populate inventory for IT forms first (34 PDFs) |

---

## Priority Updates Required

| Priority | Update | Form | Effort | Impact |
|---|---|---|---|---|
| 🔴 P0 | Create HI `[id].tsx` detail page | HI | 2 hr | Unblocks HI viewing |
| 🔴 P0 | Create `MainDB_IT_Ext_Assets` SharePoint list | HI | 30 min | Unblocks HI write-back |
| 🔴 P0 | Rename VPNACCESS.json → EAF.json | EAF | 15 min | Fixes form code mismatch |
| 🔴 P0 | Rename HWINV_PRAI.json → HI.json | HI | 15 min | Fixes form code mismatch |
| 🟡 P1 | Add `Group` and `ClientID` fields to EAF new form | EAF | 1 hr | Completes Domino field coverage |
| 🟡 P1 | Add remaining 33+ HI fields to new.tsx | HI | 3 hr | Completes asset tracking |
| 🟡 P1 | Build Power Automate Flow 1 (EAF approval) | EAF | 3 hr | Replaces Domino agents |
| 🟡 P1 | Build Power Automate Flow 2 (auto-numbering) | ITSSR | 1 hr | Replaces INO agent |
| 🟢 P2 | Populate PDF UI inventory for IT forms | All | 4 hr | Validates UI requirements |
| 🟢 P2 | Swap mock service for real SharePoint connector | All | 4 hr | Enables real data |
| 🟢 P2 | Surface `HApp` in EAF detail view | EAF | 30 min | Completes approval visibility |
