# Phase 1: Source Analysis — EAF, ITSSR, HI

> **Generated**: 2026-05-31
> **Scope**: EAF (VPN/Citrix), ITSSR (IT Support), HI (Hardware Inventory)
> **Methodology**: DXL/XML source + PDF UI exports + field mapping cross-reference

---

## Requirement / Finding Table

| Requirement / Finding | Source | Evidence | Confidence | Notes |
|---|---|---|---|---|
| **EAF: 5-stage approval workflow** | Source-confirmed from DXL/XML | `EAF_all_dxl.xml` — `currentaction` = Request → Submitted → Acceptance1 → Acceptance2 → Done | High | Correctly implemented in code as S1-S5 |
| **EAF: Conditional COO/Director routing** | Source-confirmed from DXL/XML | `isPCN` field = "1" routes to COO, else Director | High | Code has `isPancenCompany` check ✅ |
| **EAF: 21 fields, 10 editable** | Source-confirmed from DXL/XML | Field inventory documents all 21 fields | High | Code captures 9/10 editable fields — missing `Group` and `ClientID` |
| **EAF: 6 Domino agents** | Source-confirmed from DXL/XML | Clear, Refresh Docs, RemAllPdg, Set, DBNSF agents | Medium | Agents are utility/cleanup — no direct Power Automate replacement needed |
| **EAF: 19 Domino views** | Source-confirmed from DXL/XML | Various filtered views by status | Medium | Replaced by Power Apps filtered lists |
| **EAF: `@MailSend` for notifications** | Source-confirmed from DXL/XML | `@MailSend(depthead;...)` in agent code | High | Power Automate flow designed but not built |
| **EAF: `CC` recipients** | Source-confirmed from DXL/XML | `CC` names field in Domino form | High | Implemented with PeoplePicker ✅ |
| **EAF: `HApp` higher approver** | Source-confirmed from DXL/XML | `HApp` names field — COO/Director | High | **Missing** — not a visible field in new.tsx |
| **EAF: `Group` and `ClientID` fields** | Source-confirmed from DXL/XML | `Group` (text), `ClientID` (text) | High | **Missing** — not captured in new form |
| **EAF: Schema file named VPNACCESS.json** | Confirmed from documentation | Schema file at `form-schemas/VPNACCESS.json` uses formCode "VPNACCESS" | High | **CONFLICT** — form code used is "EAF" but schema says "VPNACCESS" |
| **ITSSR: 23 fields total** | Source-confirmed from DXL/XML | Field inventory — CaseNo, ReportedBy, CreationDate, INO, CA, Category etc. | High | Code schema has comprehensive field coverage ✅ |
| **ITSSR: INO auto-numbering agent** | Source-confirmed from DXL/XML | `field='INO' value='0121'` — SimpleAgent | High | Designed in Power Automate Flow 2 but not built |
| **ITSSR: Category-based routing** | Inferred from PDF/UI | `CA` and `Category` fields used in view selection | Medium | Routing config exists at `itssr-pic-routing.ts` ✅ |
| **ITSSR: SLA tracking** | Needs business confirmation | Domino had manual follow-up | Low | SLA utils exist at `itssr-sla-utils.ts` — needs business validation |
| **ITSSR: PDF UI not inventoried** | Conflict found | `analysis/pdf-ui-inventory.md` is empty | Low | No formal UI inventory to validate against |
| **HI: 58 fields (Penang), 60 (Johor)** | Source-confirmed from DXL/XML | Field inventory documents all fields | High | Code `new.tsx` covers ~25 fields — **gap of 33+ fields** |
| **HI: No workflow/approval** | Source-confirmed from DXL/XML | Pure data entry form, no approval stages | High | Correct — no workflow in code ✅ |
| **HI: 7 Domino agents** | Source-confirmed from DXL/XML | RemExpiry agent for audit reminders | Medium | Power Automate Flow 4 designed for monthly audit |
| **HI: Extension list Ext_Assets not created** | Confirmed from documentation | SharePoint list design shows ⬜ Pending | High | **Blocking** — HI writes to `MainDB_IT_Ext_Assets` which doesn't exist |
| **HI: Schema file HWINV_PRAI.json** | Confirmed from documentation | Form schema exists but uses code "HWINV_PRAI" not "HI" | High | **CONFLICT** — form code "HI" vs schema "HWINV_PRAI" |
| **HI: No detail/edit page** | Confirmed from documentation | `[id].tsx` missing from `hi/` folder | High | **Missing** — only list and new form exist |
| **HI: Johor has 2 extra fields** | Source-confirmed from DXL/XML | `Site`, `Building/Level` | High | New.tsx has `site` and `building` fields — partially covered ✅ |

---

## Summary

| Form | Fields Total | Fields in Code | Gaps | Confidence |
|---|---|---|---|---|
| **EAF** | 21 (10 editable) | 9 editable captured | Missing: `Group`, `ClientID`; `HApp` not surfaced | High |
| **ITSSR** | 23 | ~20 captured | PDF UI inventory not validated | Medium |
| **HI** | 58 (Penang) / 60 (Johor) | ~25 in new form | 33+ fields missing from code; no detail page | High |

---

## Recommendations

1. **EAF**: Add `Group`, `ClientID` fields; rename schema to `EAF.json`
2. **ITSSR**: Populate PDF UI inventory; validate SLA hours with business
3. **HI**: Extend new form to cover all 58 fields; create `[id].tsx` detail page; create `Ext_Assets` list
4. **All**: Fix schema file names to match form codes consistently
